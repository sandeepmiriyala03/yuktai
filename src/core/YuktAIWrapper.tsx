"use client";

// ─────────────────────────────────────────────────────────────────────────────
// yuktai-a11y · YuktAIWrapper.tsx
// Drop-in React wrapper — wraps your app and renders the accessibility widget.
// Zero id attributes — injected <style> nodes tracked via module-level refs,
// panel wired to FAB via React ref (no aria-controls id needed).
//
// Usage (app/layout.tsx):
//   import YuktAIWrapper from "yuktai-a11y";
//   export default function RootLayout({ children }) {
//     return (
//       <html lang="en">
//         <body>
//           <YuktAIWrapper>{children}</YuktAIWrapper>
//         </body>
//       </html>
//     );
//   }
// ─────────────────────────────────────────────────────────────────────────────

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { wcagPlugin, A11yReport } from "./renderer";

// ─── Module-level <style> node refs (no ids) ──────────────────────────────────
let _focusStyleNode: HTMLStyleElement | null = null;
let _dyslexiaStyleNode: HTMLStyleElement | null = null;

// ─── Internal types ───────────────────────────────────────────────────────────

interface WidgetSettings {
  highContrast: boolean;
  reduceMotion: boolean;
  autoFix: boolean;
  dyslexiaFont: boolean;
  fontScale: number;
}

const DEFAULT_SETTINGS: WidgetSettings = {
  highContrast: false,
  reduceMotion: false,
  autoFix: true,
  dyslexiaFont: false,
  fontScale: 100,
};

const FONT_STEPS = [80, 90, 100, 110, 120, 130, 140, 150];

const OPTIONS: {
  id: keyof WidgetSettings;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    id: "highContrast",
    label: "High contrast",
    description: "Boosts contrast and brightness on all elements",
    icon: "◑",
  },
  {
    id: "reduceMotion",
    label: "Reduce motion",
    description: "Disables transitions and animations site-wide",
    icon: "⏸",
  },
  {
    id: "autoFix",
    label: "Auto-fix ARIA",
    description: "Re-runs fixes automatically on new DOM nodes",
    icon: "♿",
  },
  {
    id: "dyslexiaFont",
    label: "Dyslexia-friendly font",
    description: "Wider letter & word spacing for readability",
    icon: "Aa",
  },
];

// ─── Toggle sub-component ─────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label
      aria-label={label}
      style={{
        position: "relative",
        display: "inline-flex",
        width: 40,
        height: 24,
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ opacity: 0, width: 0, height: 0, position: "absolute" }}
      />
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 99,
          background: checked ? "#0d9488" : "#cbd5e1",
          transition: "background 0.2s",
        }}
      />
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 19 : 3,
          width: 18,
          height: 18,
          background: "#fff",
          borderRadius: "50%",
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          pointerEvents: "none",
        }}
      />
    </label>
  );
}

// ─── YuktAIWrapper ────────────────────────────────────────────────────────────

export default function YuktAIWrapper({ children }: { children?: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<WidgetSettings>(DEFAULT_SETTINGS);
  const [report, setReport] = useState<A11yReport | null>(null);
  const [isActive, setIsActive] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  // Avoid SSR mismatch
  useEffect(() => setMounted(true), []);

  // Inject global focus-ring styles once — tracked via module ref, no id
  useEffect(() => {
    if (_focusStyleNode) return;
    const style = document.createElement("style");
    style.innerHTML = `
      *:focus-visible {
        outline: 3px solid #0d9488 !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 5px rgba(13,148,136,0.25) !important;
      }
    `;
    document.head.appendChild(style);
    _focusStyleNode = style;
    return () => {
      _focusStyleNode?.remove();
      _focusStyleNode = null;
    };
  }, []);

  // Cleanup observer and injected nodes on unmount
  useEffect(() => {
    return () => {
      wcagPlugin.stopObserver();
      wcagPlugin.removeLiveRegion();
      wcagPlugin.removeColorBlindSvg();
    };
  }, []);

  // Close panel on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        fabRef.current &&
        !fabRef.current.contains(e.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Escape key closes the panel and returns focus to FAB
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        fabRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const set = <K extends keyof WidgetSettings>(key: K, val: WidgetSettings[K]) =>
    setSettings((prev) => ({ ...prev, [key]: val }));

  // ── Apply ─────────────────────────────────────────────────────────────────

  const applySettings = useCallback(async () => {
    const config = {
      enabled: true,
      highContrast: settings.highContrast,
      reduceMotion: settings.reduceMotion,
      autoFix: settings.autoFix,
    };

    const execMessage = await wcagPlugin.execute(config);
    console.log("[yuktai-a11y]", execMessage);

    const r = wcagPlugin.applyFixes(config);
    setReport(r);

    // Font scale via root font-size (no id needed)
    document.documentElement.style.fontSize = `${settings.fontScale}%`;

    // Dyslexia font — tracked via module-level ref, no id
    if (settings.dyslexiaFont) {
      if (!_dyslexiaStyleNode) {
        const style = document.createElement("style");
        style.textContent = `
          body, body * {
            font-family: 'Georgia', serif !important;
            letter-spacing: 0.06em !important;
            word-spacing: 0.12em !important;
            line-height: 1.9 !important;
          }
        `;
        document.head.appendChild(style);
        _dyslexiaStyleNode = style;
      }
    } else {
      _dyslexiaStyleNode?.remove();
      _dyslexiaStyleNode = null;
    }

    setIsActive(true);
    setOpen(false);

    wcagPlugin.announce(
      `yuktai-a11y active. ${r.fixed} fixes applied. ` +
        [
          settings.highContrast && "High contrast on.",
          settings.reduceMotion && "Motion reduced.",
          settings.dyslexiaFont && "Dyslexia font on.",
          settings.fontScale !== 100 && `Text at ${settings.fontScale}%.`,
        ]
          .filter(Boolean)
          .join(" ")
    );
  }, [settings]);

  // ── Reset ─────────────────────────────────────────────────────────────────

  const resetSettings = useCallback(async () => {
    await wcagPlugin.execute({ enabled: false });

    document.documentElement.style.fontSize = "";

    _dyslexiaStyleNode?.remove();
    _dyslexiaStyleNode = null;

    document.querySelectorAll<HTMLElement>("*").forEach((h) => {
      h.style.filter = "";
      h.style.transition = "";
      h.style.animation = "";
    });

    setSettings(DEFAULT_SETTINGS);
    setReport(null);
    setIsActive(false);

    wcagPlugin.announce("yuktai-a11y disabled. All settings reset to defaults.");
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  if (!mounted) return <>{children}</>;

  return (
    <>
      {children}

      {/* ── Floating action button ───────────────────────────────────────── */}
      <button
        ref={fabRef}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open yuktai-a11y accessibility options"
        aria-expanded={open}
        aria-haspopup="dialog"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: isActive ? "#0f766e" : "#0d9488",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
          zIndex: 9999,
          transition: "background 0.2s, transform 0.15s",
          outline: "none",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onFocus={(e) =>
          (e.currentTarget.style.boxShadow = "0 0 0 4px rgba(13,148,136,0.45)")
        }
        onBlur={(e) =>
          (e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.18)")
        }
      >
        <svg
          viewBox="0 0 24 24"
          style={{ width: 26, height: 26, fill: "#fff" }}
          aria-hidden="true"
        >
          <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm9 4.5l-5-.5-2-.2V5l-4 .5-4-.5v.8L4 6.5 3 7l1 3 4-.5v2.3L6 17h2l2-4.5L12 14l2 2.5L16 17h2l-2-4.2V9.5l4 .5 1-3z" />
        </svg>

        {isActive && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#5eead4",
              border: "2px solid #fff",
            }}
          />
        )}
      </button>

      {/* ── Panel — ref-connected to FAB, no id needed ────────────────────── */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="yuktai-a11y accessibility options"
          style={{
            position: "fixed",
            bottom: 88,
            right: 24,
            width: 312,
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            zIndex: 9998,
            overflow: "hidden",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 18px 12px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: 99,
                    background: "#f0fdfa",
                    color: "#0d9488",
                    letterSpacing: "0.05em",
                    fontFamily: "monospace",
                  }}
                >
                  yuktai-a11y v{wcagPlugin.version}
                </span>
                {isActive && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: 99,
                      background: "#f0fdfa",
                      color: "#0f766e",
                      border: "1px solid #99f6e4",
                    }}
                  >
                    ● ACTIVE
                  </span>
                )}
              </div>
              <p style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 600, color: "#0f172a" }}>
                Accessibility
              </p>
              <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                Zero-config WCAG fixes for your page
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close panel"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
                color: "#94a3b8",
                fontSize: 18,
                lineHeight: 1,
                borderRadius: 6,
              }}
            >
              ×
            </button>
          </div>

          {/* Option toggles */}
          <div style={{ padding: "6px 0" }}>
            {OPTIONS.map((opt, i) => (
              <React.Fragment key={opt.id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 18px",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                    <span
                      aria-hidden="true"
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        background: "#f0fdfa",
                        color: "#0d9488",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        flexShrink: 0,
                        fontWeight: 700,
                      }}
                    >
                      {opt.icon}
                    </span>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#0f172a" }}>
                        {opt.label}
                      </p>
                      <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>
                        {opt.description}
                      </p>
                    </div>
                  </div>
                  <Toggle
                    checked={settings[opt.id] as boolean}
                    onChange={(v) => set(opt.id, v)}
                    label={`Toggle ${opt.label}`}
                  />
                </div>
                {i < OPTIONS.length - 1 && (
                  <div style={{ height: 1, background: "#f8fafc", margin: "0 18px" }} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Font size control */}
          <div style={{ padding: "10px 18px 14px", borderTop: "1px solid #f1f5f9" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#0f172a" }}>
                Text size
              </p>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#0d9488",
                  background: "#f0fdfa",
                  padding: "2px 8px",
                  borderRadius: 99,
                }}
              >
                {settings.fontScale}%
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => {
                  const idx = FONT_STEPS.indexOf(settings.fontScale);
                  if (idx > 0) set("fontScale", FONT_STEPS[idx - 1]);
                }}
                disabled={settings.fontScale <= 80}
                aria-label="Decrease text size"
                style={{
                  width: 30, height: 30, borderRadius: 8,
                  border: "1px solid #e2e8f0", background: "#fff",
                  cursor: settings.fontScale <= 80 ? "not-allowed" : "pointer",
                  fontSize: 16,
                  color: settings.fontScale <= 80 ? "#cbd5e1" : "#0f172a",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                −
              </button>

              <div style={{ flex: 1, display: "flex", gap: 3 }}>
                {FONT_STEPS.map((s) => (
                  <button
                    key={s}
                    onClick={() => set("fontScale", s)}
                    aria-label={`Set text size to ${s}%`}
                    style={{
                      flex: 1, height: 6, borderRadius: 99,
                      border: "none", cursor: "pointer", padding: 0,
                      background: s <= settings.fontScale ? "#0d9488" : "#e2e8f0",
                      transition: "background 0.15s",
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  const idx = FONT_STEPS.indexOf(settings.fontScale);
                  if (idx < FONT_STEPS.length - 1) set("fontScale", FONT_STEPS[idx + 1]);
                }}
                disabled={settings.fontScale >= 150}
                aria-label="Increase text size"
                style={{
                  width: 30, height: 30, borderRadius: 8,
                  border: "1px solid #e2e8f0", background: "#fff",
                  cursor: settings.fontScale >= 150 ? "not-allowed" : "pointer",
                  fontSize: 16,
                  color: settings.fontScale >= 150 ? "#cbd5e1" : "#0f172a",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Report badge */}
          {report && (
            <div
              role="status"
              style={{
                margin: "0 14px",
                padding: "8px 12px",
                background: "#f0fdfa",
                border: "1px solid #99f6e4",
                borderRadius: 8,
                fontSize: 12,
                color: "#0f766e",
                fontWeight: 500,
                fontFamily: "monospace",
              }}
            >
              ✓ yuktai-a11y: {report.fixed} fixes across {report.scanned} nodes
            </div>
          )}

          {/* Footer actions */}
          <div style={{ display: "flex", gap: 8, padding: "12px 14px 14px" }}>
            <button
              onClick={resetSettings}
              style={{
                flex: 1, padding: "8px 0", fontSize: 13, fontWeight: 500,
                borderRadius: 9, border: "1px solid #e2e8f0",
                background: "#fff", color: "#64748b", cursor: "pointer",
              }}
            >
              Reset
            </button>
            <button
              onClick={applySettings}
              style={{
                flex: 2, padding: "8px 0", fontSize: 13, fontWeight: 600,
                borderRadius: 9, border: "none",
                background: "#0d9488", color: "#fff", cursor: "pointer",
              }}
            >
              Apply settings
            </button>
          </div>
        </div>
      )}
    </>
  );
}