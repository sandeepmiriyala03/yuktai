// ─────────────────────────────────────────────────────────────────────────────
// src/react/WidgetPanel.tsx
// yuktai v2.0.18 — Yuktishaalaa AI Lab
//
// Accessibility preference panel — fully responsive.
// Desktop: fixed panel bottom left or right, 320px wide.
// Tablet:  same as desktop, slightly narrower.
// Mobile:  full width bottom sheet, slides up from bottom.
//
// Sections:
//   1. Core       — ARIA auto-fix, speak on focus, voice control
//   2. AI features — Gemini Nano (Chrome 127+ with flags enabled)
//   3. Visual     — contrast, dark mode, colour blind, large targets
//   4. Font       — dyslexia font, local font picker, font scale
//   5. Translate  — 18 language picker
//   6. Audit      — score display
// ─────────────────────────────────────────────────────────────────────────────

"use client"

import React, { forwardRef, useEffect, useState } from "react"
import type { A11yReport }    from "../core/renderer"
import type { ColorBlindMode } from "../core/renderer"
import { SUPPORTED_LANGUAGES } from "../core/ai/translator"
import { askPage }              from "../core/ai/rag"
// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface WidgetSettings {
  // Core
  highContrast:      boolean
  reduceMotion:      boolean
  autoFix:           boolean
  dyslexiaFont:      boolean
  fontScale:         number
  localFont:         string

  // v2.0.18
  darkMode:          boolean
  largeTargets:      boolean
  speechEnabled:     boolean
  colorBlindMode:    ColorBlindMode
  showAuditBadge:    boolean
  timeoutWarning:    number | undefined

  // AI features — require Chrome 127+ with flags enabled
  plainEnglish:      boolean
  summarisePage:     boolean
  translateLanguage: string
  voiceControl:      boolean
  smartLabels:       boolean
}

export const DEFAULT_SETTINGS: WidgetSettings = {
  highContrast:      false,
  reduceMotion:      false,
  autoFix:           true,
  dyslexiaFont:      false,
  fontScale:         100,
  localFont:         "",
  darkMode:          false,
  largeTargets:      false,
  speechEnabled:     false,
  colorBlindMode:    "none",
  showAuditBadge:    false,
  timeoutWarning:    undefined,
  plainEnglish:      false,
  summarisePage:     false,
  translateLanguage: "en",
  voiceControl:      false,
  smartLabels:       false,
}

export const FONT_STEPS = [80, 90, 100, 110, 120, 130]

const COLOUR_BLIND_OPTIONS: { value: ColorBlindMode; label: string }[] = [
  { value: "none",          label: "None"        },
  { value: "deuteranopia",  label: "Deuteranopia" },
  { value: "protanopia",    label: "Protanopia"   },
  { value: "tritanopia",    label: "Tritanopia"   },
  { value: "achromatopsia", label: "Greyscale"    },
]

// Chrome flags needed to enable Gemini Nano AI features
const AI_FLAGS = [
  "Prompt API for Gemini Nano",
  "Summarization API for Gemini Nano",
  "Writer API for Gemini Nano",
  "Rewriter API for Gemini Nano",
  "Translation API",
]

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
interface Props {
  position:       "left" | "right"
  settings:       WidgetSettings
  report:         A11yReport | null
  isActive:       boolean
  aiSupported:    boolean
  voiceSupported: boolean
  set:            <K extends keyof WidgetSettings>(key: K, val: WidgetSettings[K]) => void
  onApply:        () => void
  onReset:        () => void
  onClose:        () => void
}

// ─────────────────────────────────────────────────────────────────────────────
// useScreenSize — detects screen width for responsive layout
// ─────────────────────────────────────────────────────────────────────────────
function useScreenSize() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  )
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])
  return {
    isMobile: width <= 480,
    isTablet: width > 480 && width <= 768,
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// Toggle — accessible on/off switch
// ─────────────────────────────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
}: {
  checked:   boolean
  onChange:  (v: boolean) => void
  label:     string
  disabled?: boolean
}) {
  return (
    <label
      aria-label={label}
      style={{
        position:   "relative",
        display:    "inline-flex",
        width:      "40px",
        height:     "24px",
        cursor:     disabled ? "not-allowed" : "pointer",
        flexShrink: 0,
        opacity:    disabled ? 0.4 : 1,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={e => onChange(e.target.checked)}
        style={{ opacity: 0, width: 0, height: 0, position: "absolute" }}
      />
      <span style={{
        position:     "absolute",
        inset:        0,
        borderRadius: "99px",
        background:   checked ? "#0d9488" : "#cbd5e1",
        transition:   "background 0.2s",
      }} />
      <span style={{
        position:      "absolute",
        top:           "3px",
        left:          checked ? "19px" : "3px",
        width:         "18px",
        height:        "18px",
        background:    "#fff",
        borderRadius:  "50%",
        transition:    "left 0.2s",
        boxShadow:     "0 1px 3px rgba(0,0,0,0.2)",
        pointerEvents: "none",
      }} />
    </label>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SectionHeader — labelled section divider with optional badge
// ─────────────────────────────────────────────────────────────────────────────
function SectionHeader({
  label,
  color = "#64748b",
  badge,
}: {
  label:  string
  color?: string
  badge?: string
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "8px 18px 4px" }}>
      <p style={{
        margin:        0,
        fontSize:      "10px",
        fontWeight:    600,
        color,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}>
        {label}
      </p>
      {badge && (
        <span style={{
          fontSize:     "9px",
          fontWeight:   500,
          padding:      "1px 7px",
          borderRadius: "99px",
          background:   "#f5f3ff",
          color:        "#7c3aed",
          border:       "0.5px solid #c4b5fd",
          whiteSpace:   "nowrap",
        }}>
          {badge}
        </span>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Row — single toggle row with icon, label, description
// ─────────────────────────────────────────────────────────────────────────────
function Row({
  icon, label, desc, checked, onChange, disabled = false, disabledReason,
}: {
  icon:            string
  label:           string
  desc:            string
  checked:         boolean
  onChange:        (v: boolean) => void
  disabled?:       boolean
  disabledReason?: string
}) {
  return (
    <div
      title={disabled ? disabledReason : undefined}
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", gap: "12px" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
        <span aria-hidden="true" style={{
          width:          "30px",
          height:         "30px",
          borderRadius:   "8px",
          background:     disabled ? "#f1f5f9" : "#f0fdfa",
          color:          disabled ? "#94a3b8" : "#0d9488",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          fontSize:       "13px",
          flexShrink:     0,
          fontWeight:     700,
        }}>
          {icon}
        </span>
        <div style={{ minWidth: 0 }}>
          <p style={{
            margin:       0,
            fontSize:     "13px",
            fontWeight:   500,
            color:        disabled ? "#94a3b8" : "#0f172a",
            whiteSpace:   "nowrap",
            overflow:     "hidden",
            textOverflow: "ellipsis",
          }}>
            {label}
          </p>
          <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>
            {disabled ? disabledReason : desc}
          </p>
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} label={`Toggle ${label}`} disabled={disabled} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Divider
// ─────────────────────────────────────────────────────────────────────────────
function Divider() {
  return <div style={{ height: "1px", background: "#f1f5f9", margin: "0" }} />
}

// ─────────────────────────────────────────────────────────────────────────────
// WidgetPanel — main panel component
// ─────────────────────────────────────────────────────────────────────────────
export const WidgetPanel = forwardRef<HTMLDivElement, Props>(
  ({ position, settings, report, isActive, aiSupported, voiceSupported, set, onApply, onReset, onClose }, ref) => {

    const { isMobile, isTablet } = useScreenSize()
    const [localFonts, setLocalFonts] = useState<string[]>([])
const [ragQuestion,  setRagQuestion]  = useState("")
const [ragAnswer,    setRagAnswer]    = useState("")
const [ragLoading,   setRagLoading]   = useState(false)
const handleAsk = async () => {
  if (!ragQuestion.trim() || ragLoading || !aiSupported) return

  setRagLoading(true)
  setRagAnswer("")

  try {
    const r = await askPage(ragQuestion)

    if (r.success && r.answer) {
      setRagAnswer(r.answer)
    } else {
      setRagAnswer("⚠️ " + (r.error || "No answer found on this page"))
    }
  } catch {
    setRagAnswer("⚠️ Failed to fetch answer")
  }

  setRagLoading(false)
}

    useEffect(() => {
      const loadFonts = async () => {
        try {
          const win = window as unknown as { queryLocalFonts?: () => Promise<{ family: string }[]> }
          if (!win.queryLocalFonts) return
          const fonts    = await win.queryLocalFonts()
          const families = [...new Set(fonts.map(f => f.family))].sort()
          setLocalFonts(families.slice(0, 50))
        } catch { /* permission denied or unavailable */ }
      }
      loadFonts()
    }, [])

    const panelStyle: React.CSSProperties = isMobile
      ? {
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
          background: "#fff", border: "1px solid #e2e8f0",
          borderRadius: "16px 16px 0 0", boxShadow: "0 -8px 32px rgba(0,0,0,0.12)",
          maxHeight: "90vh", overflowY: "auto",
          fontFamily: "system-ui,-apple-system,sans-serif", width: "100%",
        }
      : {
          position: "fixed", bottom: "84px", [position]: "24px", zIndex: 9999,
          width: isTablet ? "300px" : "320px", maxWidth: "calc(100vw - 48px)",
          background: "#fff", border: "1px solid #e2e8f0",
          borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          maxHeight: "80vh", overflowY: "auto",
          fontFamily: "system-ui,-apple-system,sans-serif",
        }

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="yuktai accessibility preferences"
        data-yuktai-panel="true"
        style={panelStyle}
      >

        {/* ── Header ── */}
        <div style={{
          padding: "14px 18px 12px", borderBottom: "1px solid #f1f5f9",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          position: "sticky", top: 0, background: "#fff", zIndex: 1,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "5px", flexWrap: "wrap" }}>
              <span style={{
                fontSize: "10px", fontWeight: 700, padding: "2px 7px",
                borderRadius: "99px", background: "#f0fdfa", color: "#0d9488",
                letterSpacing: "0.05em", fontFamily: "monospace",
              }}>
                @yuktishaalaa/yuktai v2.0.18
              </span>
              {isActive && (
                <span style={{
                  fontSize: "10px", fontWeight: 700, padding: "2px 7px",
                  borderRadius: "99px", background: "#f0fdfa", color: "#0f766e",
                  border: "1px solid #99f6e4",
                }}>
                  ● ACTIVE
                </span>
              )}
            </div>
            <p style={{ margin: "0 0 2px", fontSize: "15px", fontWeight: 600, color: "#0f172a" }}>Accessibility</p>
            <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>WCAG 2.2 · Open source · Zero cost</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close accessibility panel"
            style={{
              background: "none", border: "none", cursor: "pointer", padding: "4px",
              color: "#94a3b8", fontSize: "20px", lineHeight: 1, borderRadius: "6px", flexShrink: 0,
              minWidth: isMobile ? "44px" : "auto", minHeight: isMobile ? "44px" : "auto",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >×</button>
        </div>

        {/* ── Section 1: Core ── */}
        <SectionHeader label="Core" />
        <Row icon="♿" label="Auto-fix ARIA" desc="Injects missing labels and roles" checked={settings.autoFix} onChange={v => set("autoFix", v)} />
        <Divider />
        <Row icon="🔊" label="Speak on focus" desc="Browser reads elements aloud" checked={settings.speechEnabled} onChange={v => set("speechEnabled", v)} />
        <Divider />
        <Row icon="🎙" label="Voice control" desc="Navigate page by voice" checked={settings.voiceControl} onChange={v => set("voiceControl", v)} disabled={!voiceSupported} disabledReason="Not supported in this browser" />

        {/* ── Section 2: AI Features ── */}
        <Divider />
        <SectionHeader label="AI features" color="#7c3aed" badge="Gemini Nano · Chrome 127+" />

        {/* AI status box */}
        <div style={{
          margin: "4px 18px 6px", padding: "8px 10px",
          background: "#f5f3ff", borderRadius: "8px", border: "0.5px solid #c4b5fd",
          fontSize: "10px", color: "#7c3aed", lineHeight: 1.5,
        }}>
          {aiSupported
            ? "Gemini Nano detected — AI features ready. Runs privately on your device. No data leaves your browser."
            : "AI features need setup — see guide below."}
        </div>

        {/* AI setup guide — only when Gemini Nano not detected */}
        {!aiSupported && (
          <div style={{
            margin: "0 18px 8px", padding: "10px 12px",
            background: "#fafafa", borderRadius: "8px", border: "0.5px solid #e2e8f0",
            fontSize: "11px", color: "#475569", lineHeight: 1.7,
          }}>
            <p style={{ margin: "0 0 6px", fontWeight: 600, color: "#0f172a", fontSize: "11px" }}>
              🛠 How to enable AI features:
            </p>
            <p style={{ margin: "0 0 3px" }}>
              1. Open Chrome and go to{" "}
              <code style={{ background: "#f1f5f9", padding: "1px 5px", borderRadius: "4px", fontSize: "10px", color: "#0d9488", fontFamily: "monospace" }}>
                chrome://flags
              </code>
            </p>
            <p style={{ margin: "0 0 3px" }}>
              2. Search and set each to <strong style={{ color: "#0f172a" }}>Enabled:</strong>
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", margin: "4px 0 6px 10px" }}>
              {AI_FLAGS.map(flag => (
                <span key={flag} style={{ fontSize: "10px", color: "#7c3aed", fontFamily: "monospace" }}>
                  → {flag}
                </span>
              ))}
            </div>
            <p style={{ margin: "0 0 3px" }}>
              3. Click <strong style={{ color: "#0f172a" }}>Relaunch</strong> when Chrome prompts you
            </p>
            <p style={{ margin: "0 0 3px" }}>
              4. Go to{" "}
              <code style={{ background: "#f1f5f9", padding: "1px 5px", borderRadius: "4px", fontSize: "10px", color: "#0d9488", fontFamily: "monospace" }}>
                chrome://components
              </code>
            </p>
            <p style={{ margin: "0 0 3px 10px" }}>
              → Find <strong style={{ color: "#0f172a" }}>Optimization Guide On Device Model</strong>
            </p>
            <p style={{ margin: "0 0 6px 10px" }}>
              → Click <strong style={{ color: "#0f172a" }}>Check for update</strong> and wait for download
            </p>
            <p style={{ margin: "0" }}>
              5. Refresh this page — AI features will unlock automatically
            </p>
          </div>
        )}

        <Row icon="📝" label="Plain English mode" desc="Simplifies complex page text" checked={settings.plainEnglish} onChange={v => set("plainEnglish", v)} disabled={!aiSupported} disabledReason="Enable Gemini Nano — see setup guide above" />
        <Divider />
        <Row icon="📋" label="Summarise page" desc="3-sentence summary at top" checked={settings.summarisePage} onChange={v => set("summarisePage", v)} disabled={!aiSupported} disabledReason="Enable Gemini Nano — see setup guide above" />
        <Divider />
        <Row icon="🏷" label="Smart aria-labels" desc="AI generates meaningful labels" checked={settings.smartLabels} onChange={v => set("smartLabels", v)} disabled={!aiSupported} disabledReason="Enable Gemini Nano — see setup guide above" />

        {/* ── Section 3: Visual ── */}
        <Divider />
        <SectionHeader label="Visual" />
        <Row icon="◑" label="High contrast" desc="Boosts contrast for low vision" checked={settings.highContrast} onChange={v => set("highContrast", v)} />
        <Divider />
        <Row icon="🌙" label="Dark mode" desc="Inverts colours" checked={settings.darkMode} onChange={v => set("darkMode", v)} />
        <Divider />
        <Row icon="⏸" label="Reduce motion" desc="Disables animations" checked={settings.reduceMotion} onChange={v => set("reduceMotion", v)} />
        <Divider />
        <Row icon="👆" label="Large targets" desc="44×44px minimum touch targets" checked={settings.largeTargets} onChange={v => set("largeTargets", v)} />

        {/* Colour blind picker */}
        <Divider />
        <div style={{ padding: "10px 18px" }}>
          <p style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: 500, color: "#0f172a" }}>🎨 Colour blindness</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {COLOUR_BLIND_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => set("colorBlindMode", opt.value)}
                aria-pressed={settings.colorBlindMode === opt.value}
                style={{
                  padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 500,
                  border: `1px solid ${settings.colorBlindMode === opt.value ? "#0d9488" : "#e2e8f0"}`,
                  background: settings.colorBlindMode === opt.value ? "#f0fdfa" : "#fff",
                  color: settings.colorBlindMode === opt.value ? "#0d9488" : "#64748b",
                  cursor: "pointer", minHeight: isMobile ? "36px" : "auto",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Section 4: Font ── */}
        <Divider />
        <SectionHeader label="Font" />
        <Row icon="Aa" label="Dyslexia-friendly font" desc="Atkinson Hyperlegible" checked={settings.dyslexiaFont} onChange={v => set("dyslexiaFont", v)} />

        {/* Local font picker */}
        <Divider />
        <div style={{ padding: "10px 18px" }}>
          <p style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: 500, color: "#0f172a" }}>🔤 Local font</p>
          {localFonts.length > 0 ? (
            <select
              value={settings.localFont}
              onChange={e => set("localFont", e.target.value)}
              aria-label="Choose a font from your device"
              style={{
                width: "100%", padding: "8px 10px", borderRadius: "8px",
                border: "1px solid #e2e8f0", fontSize: "13px", color: "#0f172a",
                background: "#fff", cursor: "pointer", height: isMobile ? "44px" : "36px",
              }}
            >
              <option value="">System default</option>
              {localFonts.map(font => (
                <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
              ))}
            </select>
          ) : (
            <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>
              Local font access available in Chrome 103+. Allow font access when prompted.
            </p>
          )}
        </div>

        {/* Font scale */}
        <Divider />
        <div style={{ padding: "10px 18px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: 500, color: "#0f172a" }}>Text size</p>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#0d9488", background: "#f0fdfa", padding: "2px 8px", borderRadius: "99px" }}>
              {settings.fontScale}%
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => { const i = FONT_STEPS.indexOf(settings.fontScale); if (i > 0) set("fontScale", FONT_STEPS[i - 1]) }}
              disabled={settings.fontScale <= 80}
              aria-label="Decrease text size"
              style={{
                width: isMobile ? "44px" : "30px", height: isMobile ? "44px" : "30px",
                borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff",
                cursor: settings.fontScale <= 80 ? "not-allowed" : "pointer", fontSize: "16px",
                color: settings.fontScale <= 80 ? "#cbd5e1" : "#0f172a",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >−</button>
            <div style={{ flex: 1, display: "flex", gap: "3px" }}>
              {FONT_STEPS.map(s => (
                <button key={s} onClick={() => set("fontScale", s)} aria-label={`Set text size to ${s}%`}
                  style={{ flex: 1, height: "6px", borderRadius: "99px", border: "none", cursor: "pointer", padding: 0, background: s <= settings.fontScale ? "#0d9488" : "#e2e8f0", transition: "background 0.15s" }}
                />
              ))}
            </div>
            <button
              onClick={() => { const i = FONT_STEPS.indexOf(settings.fontScale); if (i < FONT_STEPS.length - 1) set("fontScale", FONT_STEPS[i + 1]) }}
              disabled={settings.fontScale >= 130}
              aria-label="Increase text size"
              style={{
                width: isMobile ? "44px" : "30px", height: isMobile ? "44px" : "30px",
                borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff",
                cursor: settings.fontScale >= 130 ? "not-allowed" : "pointer", fontSize: "16px",
                color: settings.fontScale >= 130 ? "#cbd5e1" : "#0f172a",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >+</button>
          </div>
        </div>

        {/* ── Section 5: Translate ── */}
        <Divider />
        <div style={{ padding: "10px 18px" }}>
          <p style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: 500, color: "#0f172a" }}>
            🌐 Translate page{" "}
            <span style={{ marginLeft: "6px", fontSize: "9px", fontWeight: 500, padding: "1px 6px", borderRadius: "99px", background: "#f5f3ff", color: "#7c3aed", border: "0.5px solid #c4b5fd" }}>
              Gemini Nano
            </span>
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {SUPPORTED_LANGUAGES.slice(0, isMobile ? 8 : 18).map(lang => (
              <button
                key={lang.code}
                onClick={() => set("translateLanguage", lang.code)}
                aria-pressed={settings.translateLanguage === lang.code}
                disabled={!aiSupported}
                style={{
                  padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 500,
                  border: `1px solid ${settings.translateLanguage === lang.code ? "#7c3aed" : "#e2e8f0"}`,
                  background: settings.translateLanguage === lang.code ? "#f5f3ff" : "#fff",
                  color: settings.translateLanguage === lang.code ? "#7c3aed" : "#64748b",
                  cursor: aiSupported ? "pointer" : "not-allowed",
                  opacity: aiSupported ? 1 : 0.5, minHeight: isMobile ? "36px" : "auto",
                }}
              >
                {lang.code.toUpperCase()}
              </button>
            ))}
          </div>
          {!aiSupported && (
            <p style={{ margin: "6px 0 0", fontSize: "10px", color: "#94a3b8" }}>
              Enable Gemini Nano using the setup guide above to unlock translation.
            </p>
          )}
        </div>

        {/* ── Audit report ── */}

// ── Section 6: Ask this page — RAG ──
<Divider />
<SectionHeader
  label="Ask this page"
  color="#0d9488"
  badge="Gemini Nano"
/>

<div style={{ padding: "10px 18px 14px" }}>
  <p style={{ margin: "0 0 8px", fontSize: "11px", color: "#64748b" }}>
    Ask any question — answered from this page. On device. Zero cost.
  </p>

  {/* Input + Button */}
  <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
    <input
      type="text"
      value={ragQuestion}
      onChange={e => setRagQuestion(e.target.value)}
      onKeyDown={e => {
        if (e.key === "Enter") handleAsk()
      }}
      placeholder="Ask something..."
      disabled={!aiSupported || ragLoading}
      style={{
        flex: 1,
        padding: "8px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        fontSize: "12px"
      }}
    />

    <button
      onClick={handleAsk}
      disabled={!ragQuestion.trim() || ragLoading || !aiSupported}
      style={{
        padding: "8px 12px",
        borderRadius: "8px",
        border: "none",
        background:
          ragQuestion.trim() && !ragLoading && aiSupported
            ? "#0d9488"
            : "#e2e8f0",
        color:
          ragQuestion.trim() && !ragLoading && aiSupported
            ? "#fff"
            : "#94a3b8",
        cursor:
          ragQuestion.trim() && !ragLoading && aiSupported
            ? "pointer"
            : "not-allowed"
      }}
    >
      {ragLoading ? "⏳ Thinking..." : "Ask"}
    </button>
  </div>

  {/* Answer */}
  {(ragAnswer || ragLoading) && (
    <div
      style={{
        padding: "10px",
        background: "#f0fdfa",
        borderRadius: "8px",
        fontSize: "12px",
        color: "#0f766e"
      }}
    >
      <strong style={{ display: "block", marginBottom: "4px" }}>
        💬 Answer
      </strong>

      {ragLoading ? "⏳ Thinking..." : ragAnswer || "No answer found"}
    </div>
  )}
</div>
        {report && (
          <div role="status" style={{
            margin: "0 14px", padding: "8px 12px",
            background: "#f0fdfa", border: "1px solid #99f6e4",
            borderRadius: "8px", fontSize: "12px", color: "#0f766e",
            fontWeight: 500, fontFamily: "monospace",
          }}>
            {report.fixed > 0
              ? `✓ ${report.fixed} fixes · ${report.scanned} nodes · ${report.renderTime}ms · Score: ${report.score}/100`
              : `✓ 0 auto-fixes needed · ${report.scanned} nodes · ${report.renderTime}ms`}
          </div>
        )}

        {/* ── Footer ── */}
        <div style={{
          display: "flex", gap: "8px", padding: "12px 14px 14px",
          position: isMobile ? "sticky" : "relative", bottom: isMobile ? 0 : "auto",
          background: "#fff", borderTop: "1px solid #f1f5f9",
        }}>
          <button onClick={onReset} style={{
            flex: 1, padding: isMobile ? "12px 0" : "8px 0", fontSize: "13px", fontWeight: 500,
            borderRadius: "9px", border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", cursor: "pointer",
          }}>
            Reset
          </button>
          <button onClick={onApply} style={{
            flex: 2, padding: isMobile ? "12px 0" : "8px 0", fontSize: "13px", fontWeight: 600,
            borderRadius: "9px", border: "none", background: "#0d9488", color: "#fff", cursor: "pointer",
          }}>
            Apply settings
          </button>
        </div>

      </div>
    )
  }
)

WidgetPanel.displayName = "WidgetPanel"