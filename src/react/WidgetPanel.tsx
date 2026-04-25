"use client";
// yuktai-a11y · react/WidgetPanel.tsx  v2.0.0

import React, { forwardRef } from "react";
import { A11yReport, ColorBlindMode } from "../core/renderer";

// ─── FIX: Added all missing fields that YuktAIWrapper.tsx references ──────────
export interface WidgetSettings {
  highContrast:   boolean;
  reduceMotion:   boolean;
  autoFix:        boolean;
  dyslexiaFont:   boolean;
  fontScale:      number;
  // v2.0.0 new fields
  darkMode:       boolean;
  largeTargets:   boolean;
  speechEnabled:  boolean;
  colorBlindMode: ColorBlindMode;
  showAuditBadge: boolean;
  timeoutWarning: number | undefined;
}

export const DEFAULT_SETTINGS: WidgetSettings = {
  highContrast:   false,
  reduceMotion:   false,
  autoFix:        true,
  dyslexiaFont:   false,
  fontScale:      100,
  // v2.0.0 defaults
  darkMode:       false,
  largeTargets:   false,
  speechEnabled:  false,
  colorBlindMode: "none",
  showAuditBadge: false,
  timeoutWarning: undefined,
};

export const FONT_STEPS = [80, 90, 100, 110, 120, 130];

const COLOUR_BLIND_OPTIONS: { value: ColorBlindMode; label: string }[] = [
  { value: "none",          label: "None" },
  { value: "deuteranopia",  label: "Deuteranopia" },
  { value: "protanopia",    label: "Protanopia" },
  { value: "tritanopia",    label: "Tritanopia" },
  { value: "achromatopsia", label: "Greyscale" },
];

const OPTIONS: {
  id: keyof WidgetSettings
  label: string
  description: string
  icon: string
}[] = [
  { id: "highContrast", label: "High contrast",         description: "Increases contrast for low vision",    icon: "◑"  },
  { id: "darkMode",     label: "Dark mode",              description: "Inverts colours for dark preference",  icon: "🌙" },
  { id: "reduceMotion", label: "Reduce motion",          description: "Disables transitions & animations",    icon: "⏸"  },
  { id: "largeTargets", label: "Large click targets",    description: "44×44px minimum touch targets",        icon: "👆" },
  { id: "speechEnabled",label: "Speak on focus",         description: "Browser reads focused element aloud",  icon: "🔊" },
  { id: "autoFix",      label: "Auto-fix ARIA",          description: "Watches for new DOM nodes",            icon: "♿" },
  { id: "dyslexiaFont", label: "Dyslexia-friendly font", description: "Atkinson Hyperlegible font",           icon: "Aa" },
  { id: "showAuditBadge",label: "Show audit score",      description: "Dev-only score badge (localhost)",     icon: "📊" },
];

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label
      aria-label={label}
      style={{ position: "relative", display: "inline-flex", width: 40, height: 24, cursor: "pointer", flexShrink: 0 }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ opacity: 0, width: 0, height: 0, position: "absolute" }}
      />
      <span style={{ position: "absolute", inset: 0, borderRadius: 99, background: checked ? "#0d9488" : "#cbd5e1", transition: "background 0.2s" }} />
      <span style={{ position: "absolute", top: 3, left: checked ? 19 : 3, width: 18, height: 18, background: "#fff", borderRadius: "50%", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", pointerEvents: "none" }} />
    </label>
  )
}

interface Props {
  position:  "left" | "right"
  settings:  WidgetSettings
  report:    A11yReport | null
  isActive:  boolean
  set:       <K extends keyof WidgetSettings>(key: K, val: WidgetSettings[K]) => void
  onApply:   () => void
  onReset:   () => void
  onClose:   () => void
}

export const WidgetPanel = forwardRef<HTMLDivElement, Props>(
  ({ position, settings, report, isActive, set, onApply, onReset, onClose }, ref) => {
    const side = position === "left" ? { left: 88 } : { right: 88 }

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="yuktai-a11y accessibility options"
        style={{
          position: "fixed", bottom: 24, ...side, width: 320,
          background: "#fff", border: "1px solid #e2e8f0",
          borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          zIndex: 9998, overflow: "hidden",
          fontFamily: "system-ui,-apple-system,sans-serif",
          maxHeight: "80vh", overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ padding: "14px 18px 12px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: "#f0fdfa", color: "#0d9488", letterSpacing: "0.05em", fontFamily: "monospace" }}>
                @yuktishaalaa/yuktai v2.0.0
              </span>
              {isActive && (
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: "#f0fdfa", color: "#0f766e", border: "1px solid #99f6e4" }}>
                  ● ACTIVE
                </span>
              )}
            </div>
            <p style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 600, color: "#0f172a" }}>Accessibility</p>
            <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>WCAG 2.2 · No JAWS needed · Open Source</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close accessibility panel"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#94a3b8", fontSize: 18, lineHeight: 1, borderRadius: 6 }}
          >
            ×
          </button>
        </div>

        {/* Toggles */}
        <div style={{ padding: "6px 0" }}>
          {OPTIONS.map((opt, i) => (
            <React.Fragment key={opt.id}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                  <span
                    aria-hidden="true"
                    style={{ width: 30, height: 30, borderRadius: 8, background: "#f0fdfa", color: "#0d9488", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, fontWeight: 700 }}
                  >
                    {opt.icon}
                  </span>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{opt.label}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>{opt.description}</p>
                  </div>
                </div>
                <Toggle
                  checked={settings[opt.id] as boolean}
                  onChange={(v) => set(opt.id, v as WidgetSettings[typeof opt.id])}
                  label={`Toggle ${opt.label}`}
                />
              </div>
              {i < OPTIONS.length - 1 && <div style={{ height: 1, background: "#f8fafc", margin: "0 18px" }} />}
            </React.Fragment>
          ))}
        </div>

        {/* Colour blind mode */}
        <div style={{ padding: "10px 18px", borderTop: "1px solid #f1f5f9" }}>
          <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 500, color: "#0f172a" }}>🎨 Colour blindness</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {COLOUR_BLIND_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => set("colorBlindMode", opt.value)}
                aria-pressed={settings.colorBlindMode === opt.value}
                style={{
                  padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500,
                  border: `1px solid ${settings.colorBlindMode === opt.value ? "#0d9488" : "#e2e8f0"}`,
                  background: settings.colorBlindMode === opt.value ? "#f0fdfa" : "#fff",
                  color: settings.colorBlindMode === opt.value ? "#0d9488" : "#64748b",
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font size */}
        <div style={{ padding: "10px 18px 14px", borderTop: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#0f172a" }}>Text size</p>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#0d9488", background: "#f0fdfa", padding: "2px 8px", borderRadius: 99 }}>
              {settings.fontScale}%
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => { const i = FONT_STEPS.indexOf(settings.fontScale); if (i > 0) set("fontScale", FONT_STEPS[i - 1]) }}
              disabled={settings.fontScale <= 80}
              aria-label="Decrease text size"
              style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: settings.fontScale <= 80 ? "not-allowed" : "pointer", fontSize: 16, color: settings.fontScale <= 80 ? "#cbd5e1" : "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >
              −
            </button>
            <div style={{ flex: 1, display: "flex", gap: 3 }}>
              {FONT_STEPS.map((s) => (
                <button
                  key={s}
                  onClick={() => set("fontScale", s)}
                  aria-label={`Set text size to ${s}%`}
                  style={{ flex: 1, height: 6, borderRadius: 99, border: "none", cursor: "pointer", padding: 0, background: s <= settings.fontScale ? "#0d9488" : "#e2e8f0", transition: "background 0.15s" }}
                />
              ))}
            </div>
            <button
              onClick={() => { const i = FONT_STEPS.indexOf(settings.fontScale); if (i < FONT_STEPS.length - 1) set("fontScale", FONT_STEPS[i + 1]) }}
              disabled={settings.fontScale >= 130}
              aria-label="Increase text size"
              style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: settings.fontScale >= 130 ? "not-allowed" : "pointer", fontSize: 16, color: settings.fontScale >= 130 ? "#cbd5e1" : "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >
              +
            </button>
          </div>
        </div>

        {/* Audit report */}
        {report && (
          <div
            role="status"
            style={{ margin: "0 14px", padding: "8px 12px", background: "#f0fdfa", border: "1px solid #99f6e4", borderRadius: 8, fontSize: 12, color: "#0f766e", fontWeight: 500, fontFamily: "monospace" }}
          >
            {report.fixed > 0
              ? `✓ ${report.fixed} fixes · ${report.scanned} nodes · ${report.renderTime}ms · Score: ${report.score}/100`
              : `✓ 0 fixes needed · ${report.scanned} nodes clean · ${report.renderTime}ms`}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: "flex", gap: 8, padding: "12px 14px 14px" }}>
          <button
            onClick={onReset}
            style={{ flex: 1, padding: "8px 0", fontSize: 13, fontWeight: 500, borderRadius: 9, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", cursor: "pointer" }}
          >
            Reset
          </button>
          <button
            onClick={onApply}
            style={{ flex: 2, padding: "8px 0", fontSize: 13, fontWeight: 600, borderRadius: 9, border: "none", background: "#0d9488", color: "#fff", cursor: "pointer" }}
          >
            Apply settings
          </button>
        </div>
      </div>
    )
  }
)

WidgetPanel.displayName = "WidgetPanel"