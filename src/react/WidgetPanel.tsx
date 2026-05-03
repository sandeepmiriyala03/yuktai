// ─────────────────────────────────────────────────────────────────────────────
// src/react/WidgetPanel.tsx
// yuktai v2.1.0 — Yuktishaalaa AI Lab
//
// Auto-switches RAG engine:
//   Desktop Chrome + Gemini Nano → rag.ts
//   Mobile / All other browsers  → transformers-rag.ts
// ─────────────────────────────────────────────────────────────────────────────

"use client"

import React, { forwardRef, useEffect, useState } from "react"
import type { A11yReport }    from "../core/renderer"
import type { ColorBlindMode } from "../core/renderer"
import { SUPPORTED_LANGUAGES } from "../core/ai/translator"
import { askPage }              from "../core/ai/rag"
import {
  askPageWithTransformers,
  isTransformersSupported,
  getModelLoadStatus,
}                               from "../core/ai/transformers-rag"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
export interface WidgetSettings {
  highContrast:      boolean
  reduceMotion:      boolean
  autoFix:           boolean
  dyslexiaFont:      boolean
  fontScale:         number
  localFont:         string
  darkMode:          boolean
  largeTargets:      boolean
  speechEnabled:     boolean
  colorBlindMode:    ColorBlindMode
  showAuditBadge:    boolean
  timeoutWarning:    number | undefined
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
// useScreenSize
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
  return { isMobile: width <= 480, isTablet: width > 480 && width <= 768 }
}

// ─────────────────────────────────────────────────────────────────────────────
// Toggle
// ─────────────────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label, disabled = false }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean
}) {
  return (
    <label aria-label={label} style={{ position: "relative", display: "inline-flex", width: "40px", height: "24px", cursor: disabled ? "not-allowed" : "pointer", flexShrink: 0, opacity: disabled ? 0.4 : 1 }}>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={e => onChange(e.target.checked)} style={{ opacity: 0, width: 0, height: 0, position: "absolute" }} />
      <span style={{ position: "absolute", inset: 0, borderRadius: "99px", background: checked ? "#0d9488" : "#cbd5e1", transition: "background 0.2s" }} />
      <span style={{ position: "absolute", top: "3px", left: checked ? "19px" : "3px", width: "18px", height: "18px", background: "#fff", borderRadius: "50%", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", pointerEvents: "none" }} />
    </label>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SectionHeader — with AI concept subtitle
// ─────────────────────────────────────────────────────────────────────────────
function SectionHeader({ label, color = "#64748b", badge, concept }: {
  label: string; color?: string; badge?: string; concept?: string
}) {
  return (
    <div style={{ margin: "10px 18px 4px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <p style={{ margin: 0, fontSize: "10px", fontWeight: 600, color, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {label}
        </p>
        {badge && (
          <span style={{ fontSize: "9px", fontWeight: 500, padding: "1px 7px", borderRadius: "99px", background: "#f5f3ff", color: "#7c3aed", border: "0.5px solid #c4b5fd", whiteSpace: "nowrap" }}>
            {badge}
          </span>
        )}
      </div>
      {concept && (
        <p style={{ margin: "2px 0 0", fontSize: "9px", color: "#94a3b8", fontStyle: "italic" }}>
          {concept}
        </p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Row — with how-to tip on hover
// ─────────────────────────────────────────────────────────────────────────────
function Row({ icon, label, desc, checked, onChange, disabled = false, disabledReason, tip }: {
  icon: string; label: string; desc: string; checked: boolean; onChange: (v: boolean) => void
  disabled?: boolean; disabledReason?: string; tip?: string
}) {
  return (
    <div title={disabled ? disabledReason : tip} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
        <span aria-hidden="true" style={{ width: "32px", height: "32px", borderRadius: "8px", background: disabled ? "#f1f5f9" : "#f0fdfa", color: disabled ? "#94a3b8" : "#0d9488", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", flexShrink: 0, fontWeight: 700 }}>
          {icon}
        </span>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: "13px", fontWeight: 500, color: disabled ? "#94a3b8" : "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {label}
          </p>
          <p style={{ margin: 0, fontSize: "10px", color: "#94a3b8" }}>
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
  return <div style={{ height: "1px", background: "#f1f5f9" }} />
}

// ─────────────────────────────────────────────────────────────────────────────
// HowTo — simple steps guide
// ─────────────────────────────────────────────────────────────────────────────
function HowTo({ steps }: { steps: string[] }) {
  return (
    <div style={{ margin: "0 18px 8px", padding: "8px 10px", background: "#f8fafc", borderRadius: "8px", border: "0.5px solid #e2e8f0" }}>
      <p style={{ margin: "0 0 4px", fontSize: "9px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>How to use</p>
      {steps.map((s, i) => (
        <p key={i} style={{ margin: "0 0 2px", fontSize: "10px", color: "#475569" }}>{i + 1}. {s}</p>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WidgetPanel — main component
// ─────────────────────────────────────────────────────────────────────────────
export const WidgetPanel = forwardRef<HTMLDivElement, Props>(
  ({ position, settings, report, isActive, aiSupported, voiceSupported, set, onApply, onReset, onClose }, ref) => {

    const { isMobile, isTablet } = useScreenSize()
    const [localFonts,    setLocalFonts]    = useState<string[]>([])
    const [ragQuestion,   setRagQuestion]   = useState("")
    const [ragAnswer,     setRagAnswer]     = useState("")
    const [ragLoading,    setRagLoading]    = useState(false)
    const [ragEngine,     setRagEngine]     = useState<"gemini" | "transformers" | null>(null)
    const [modelStatus,   setModelStatus]   = useState<"idle" | "loading" | "ready">("idle")

    // ── Detect which RAG engine to use ──
    useEffect(() => {
      const w = window as any
      const hasGemini = !!(w.LanguageModel || w.ai?.languageModel)
      if (hasGemini && aiSupported) {
        setRagEngine("gemini")
      } else if (isTransformersSupported()) {
        setRagEngine("transformers")
      }
    }, [aiSupported])

    // ── Poll model status when using Transformers ──
    useEffect(() => {
      if (ragEngine !== "transformers") return
      const interval = setInterval(() => {
        setModelStatus(getModelLoadStatus())
      }, 500)
      return () => clearInterval(interval)
    }, [ragEngine])

    // ─────────────────────────────────────────────────────────────────────
    // handleAsk — auto switches between Gemini Nano and Transformers.js
    // ─────────────────────────────────────────────────────────────────────
    const handleAsk = async () => {
      if (!ragQuestion.trim() || ragLoading) return
      if (!ragEngine) {
        setRagAnswer("⚠️ No AI engine available on this device.")
        return
      }

      setRagLoading(true)
      setRagAnswer("")

      try {
        let result

        if (ragEngine === "gemini") {
          // Desktop Chrome with Gemini Nano
          result = await askPage(ragQuestion)
        } else {
          // Mobile / all other browsers — Transformers.js
          setModelStatus("loading")
          result = await askPageWithTransformers(ragQuestion)
          setModelStatus("ready")
        }

        setRagAnswer(
          result.success && result.answer
            ? result.answer
                .replace(/\*\*(.*?)\*\*/g, "$1")
                .replace(/\*(.*?)\*/g, "$1")
                .replace(/#+\s/g, "")
                .trim()
            : "⚠️ " + (result.error || "No answer found on this page")
        )
      } catch {
        setRagAnswer("⚠️ Failed to get answer. Please try again.")
      }

      setRagLoading(false)
    }

    // Load local fonts
    useEffect(() => {
      const loadFonts = async () => {
        try {
          const win = window as unknown as { queryLocalFonts?: () => Promise<{ family: string }[]> }
          if (!win.queryLocalFonts) return
          const fonts    = await win.queryLocalFonts()
          const families = [...new Set(fonts.map(f => f.family))].sort()
          setLocalFonts(families.slice(0, 50))
        } catch { /* ignore */ }
      }
      loadFonts()
    }, [])

    // ── RAG badge label based on engine ──
    const ragBadge = ragEngine === "gemini"
      ? "Gemini Nano"
      : ragEngine === "transformers"
      ? "Transformers.js · All devices"
      : "Detecting..."

    // ── Loading message based on state ──
    const loadingMsg = ragEngine === "transformers" && modelStatus === "loading"
      ? "Loading AI model... (first time only)"
      : "..."

    const panelStyle: React.CSSProperties = isMobile
      ? { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999, background: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px 16px 0 0", boxShadow: "0 -8px 32px rgba(0,0,0,0.12)", maxHeight: "90vh", overflowY: "auto", fontFamily: "system-ui,-apple-system,sans-serif", width: "100%" }
      : { position: "fixed", bottom: "84px", [position]: "24px", zIndex: 9999, width: isTablet ? "300px" : "320px", maxWidth: "calc(100vw - 48px)", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", maxHeight: "80vh", overflowY: "auto", fontFamily: "system-ui,-apple-system,sans-serif" }

    return (
      <div ref={ref} role="dialog" aria-modal="true" aria-label="yuktai accessibility preferences" data-yuktai-panel="true" style={panelStyle}>

        {/* ── Header ── */}
        <div style={{ padding: "14px 18px 12px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "4px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "99px", background: "#f0fdfa", color: "#0d9488", letterSpacing: "0.05em", fontFamily: "monospace" }}>
                @yuktishaalaa/yuktai v2.1.0
              </span>
              {isActive && (
                <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "99px", background: "#f0fdfa", color: "#0f766e", border: "1px solid #99f6e4" }}>
                  ● ACTIVE
                </span>
              )}
            </div>
            <p style={{ margin: "0 0 1px", fontSize: "15px", fontWeight: 600, color: "#0f172a" }}>Accessibility</p>
            <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>WCAG 2.2 · Open source · Zero cost · All devices</p>
          </div>
          <button onClick={onClose} aria-label="Close accessibility panel" style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#94a3b8", fontSize: "20px", lineHeight: 1, borderRadius: "6px", flexShrink: 0, minWidth: isMobile ? "44px" : "auto", minHeight: isMobile ? "44px" : "auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
            ×
          </button>
        </div>

        {/* ── Section 1: Core ── */}
        <SectionHeader label="♿ Core Accessibility" concept="Rule-based engine — works on all browsers and devices" />
        <HowTo steps={["Toggle any feature on", "Click Apply settings", "Preferences saved automatically"]} />
        <Row icon="🔧" label="Auto-fix ARIA" desc="Injects missing labels and roles automatically" checked={settings.autoFix} onChange={v => set("autoFix", v)} tip="Fixes aria-label, alt text, roles on every element" />
        <Divider />
        <Row icon="🔊" label="Speak on focus" desc="Browser reads elements aloud as you tab" checked={settings.speechEnabled} onChange={v => set("speechEnabled", v)} tip="Uses browser SpeechSynthesis — no install needed" />
        <Divider />
        <Row icon="🎙️" label="Voice control" desc="Say commands to navigate the page" checked={settings.voiceControl} onChange={v => set("voiceControl", v)} disabled={!voiceSupported} disabledReason="Not supported in this browser" tip='Say "scroll down", "go to main", "click"' />

        {/* ── Section 2: AI Features ── */}
        <Divider />
        <SectionHeader label="🤖 AI Features" color="#7c3aed" badge="Gemini Nano" concept="Large Language Model running privately on your device — Chrome 127+ only" />

        <div style={{ margin: "4px 18px 6px", padding: "8px 10px", background: aiSupported ? "#f0fdfa" : "#f5f3ff", borderRadius: "8px", border: `0.5px solid ${aiSupported ? "#99f6e4" : "#c4b5fd"}`, fontSize: "10px", color: aiSupported ? "#0f766e" : "#7c3aed", lineHeight: 1.5 }}>
          {aiSupported
            ? "✅ Gemini Nano detected — AI features ready. Runs privately on your device."
            : "⚙️ AI features need one-time setup — see guide below."}
        </div>

        {!aiSupported && (
          <div style={{ margin: "0 18px 8px", padding: "10px 12px", background: "#fafafa", borderRadius: "8px", border: "0.5px solid #e2e8f0", fontSize: "11px", color: "#475569", lineHeight: 1.7 }}>
            <p style={{ margin: "0 0 6px", fontWeight: 600, color: "#0f172a", fontSize: "11px" }}>🛠 One-time setup — 5 steps:</p>
            <p style={{ margin: "0 0 3px" }}>1. Open Chrome → <code style={{ background: "#f1f5f9", padding: "1px 5px", borderRadius: "4px", fontSize: "10px", color: "#0d9488", fontFamily: "monospace" }}>chrome://flags</code></p>
            <p style={{ margin: "0 0 3px" }}>2. Enable each flag:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", margin: "4px 0 6px 10px" }}>
              {AI_FLAGS.map(f => <span key={f} style={{ fontSize: "10px", color: "#7c3aed", fontFamily: "monospace" }}>→ {f}</span>)}
            </div>
            <p style={{ margin: "0 0 3px" }}>3. Click <strong style={{ color: "#0f172a" }}>Relaunch</strong></p>
            <p style={{ margin: "0 0 3px" }}>4. <code style={{ background: "#f1f5f9", padding: "1px 5px", borderRadius: "4px", fontSize: "10px", color: "#0d9488", fontFamily: "monospace" }}>chrome://components</code> → Optimization Guide On Device Model → Check for update</p>
            <p style={{ margin: "0" }}>5. Refresh — AI features unlock automatically ✅</p>
          </div>
        )}

        <Row icon="📝" label="Plain English mode" desc="Rewrites complex text in simple language" checked={settings.plainEnglish} onChange={v => set("plainEnglish", v)} disabled={!aiSupported} disabledReason="Enable Gemini Nano — see setup above" tip="AI concept: LLM text rewriting" />
        <Divider />
        <Row icon="📋" label="Summarise page" desc="3-sentence summary appears at top" checked={settings.summarisePage} onChange={v => set("summarisePage", v)} disabled={!aiSupported} disabledReason="Enable Gemini Nano — see setup above" tip="AI concept: Abstractive summarisation" />
        <Divider />
        <Row icon="🏷️" label="Smart aria-labels" desc="AI generates meaningful labels for elements" checked={settings.smartLabels} onChange={v => set("smartLabels", v)} disabled={!aiSupported} disabledReason="Enable Gemini Nano — see setup above" tip="AI concept: Context-aware label generation" />

        {/* ── Section 3: Visual ── */}
        <Divider />
        <SectionHeader label="👁️ Visual" concept="CSS filter-based — works on all browsers and devices" />
        <HowTo steps={["Toggle any visual mode", "Changes apply instantly", "Works on mobile and desktop"]} />
        <Row icon="◑" label="High contrast" desc="Boosts contrast for low vision users" checked={settings.highContrast} onChange={v => set("highContrast", v)} tip="CSS filter: contrast()" />
        <Divider />
        <Row icon="🌙" label="Dark mode" desc="Inverts colours — easy on eyes at night" checked={settings.darkMode} onChange={v => set("darkMode", v)} tip="CSS filter: invert + hue-rotate" />
        <Divider />
        <Row icon="⏸️" label="Reduce motion" desc="Disables all animations" checked={settings.reduceMotion} onChange={v => set("reduceMotion", v)} tip="WCAG 2.3.3 — vestibular disorders" />
        <Divider />
        <Row icon="👆" label="Large targets" desc="44×44px minimum touch targets" checked={settings.largeTargets} onChange={v => set("largeTargets", v)} tip="WCAG 2.5.8 — motor impaired users" />

        {/* Colour blind */}
        <Divider />
        <div style={{ padding: "10px 18px" }}>
          <p style={{ margin: "0 0 2px", fontSize: "12px", fontWeight: 500, color: "#0f172a" }}>🎨 Colour blindness</p>
          <p style={{ margin: "0 0 8px", fontSize: "10px", color: "#94a3b8" }}>SVG colour matrix filters — all devices</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {COLOUR_BLIND_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => set("colorBlindMode", opt.value)} aria-pressed={settings.colorBlindMode === opt.value}
                style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 500, border: `1px solid ${settings.colorBlindMode === opt.value ? "#0d9488" : "#e2e8f0"}`, background: settings.colorBlindMode === opt.value ? "#f0fdfa" : "#fff", color: settings.colorBlindMode === opt.value ? "#0d9488" : "#64748b", cursor: "pointer", minHeight: isMobile ? "36px" : "auto" }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Section 4: Font ── */}
        <Divider />
        <SectionHeader label="🔤 Font" concept="Browser Font API + CSS — Chrome 103+" />
        <HowTo steps={["Toggle dyslexia font or pick from device", "Adjust size with + / −", "Saved across visits"]} />
        <Row icon="Aa" label="Dyslexia-friendly font" desc="Atkinson Hyperlegible — research-backed" checked={settings.dyslexiaFont} onChange={v => set("dyslexiaFont", v)} tip="By Braille Institute — free and open source" />

        <Divider />
        <div style={{ padding: "10px 18px" }}>
          <p style={{ margin: "0 0 2px", fontSize: "12px", fontWeight: 500, color: "#0f172a" }}>🖥️ Local font</p>
          <p style={{ margin: "0 0 8px", fontSize: "10px", color: "#94a3b8" }}>window.queryLocalFonts() — Chrome 103+</p>
          {localFonts.length > 0 ? (
            <select value={settings.localFont} onChange={e => set("localFont", e.target.value)} aria-label="Choose a font from your device"
              style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", color: "#0f172a", background: "#fff", cursor: "pointer", height: isMobile ? "44px" : "36px" }}>
              <option value="">System default</option>
              {localFonts.map(font => <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>)}
            </select>
          ) : (
            <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>Allow font access when Chrome prompts you.</p>
          )}
        </div>

        {/* Font scale */}
        <Divider />
        <div style={{ padding: "10px 18px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <div>
              <p style={{ margin: 0, fontSize: "12px", fontWeight: 500, color: "#0f172a" }}>📏 Text size</p>
              <p style={{ margin: 0, fontSize: "10px", color: "#94a3b8" }}>Scales all text on the page</p>
            </div>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#0d9488", background: "#f0fdfa", padding: "2px 8px", borderRadius: "99px" }}>{settings.fontScale}%</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button onClick={() => { const i = FONT_STEPS.indexOf(settings.fontScale); if (i > 0) set("fontScale", FONT_STEPS[i - 1]) }} disabled={settings.fontScale <= 80} aria-label="Decrease text size"
              style={{ width: isMobile ? "44px" : "30px", height: isMobile ? "44px" : "30px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff", cursor: settings.fontScale <= 80 ? "not-allowed" : "pointer", fontSize: "16px", color: settings.fontScale <= 80 ? "#cbd5e1" : "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>−</button>
            <div style={{ flex: 1, display: "flex", gap: "3px" }}>
              {FONT_STEPS.map(s => (
                <button key={s} onClick={() => set("fontScale", s)} aria-label={`Set text size to ${s}%`}
                  style={{ flex: 1, height: "6px", borderRadius: "99px", border: "none", cursor: "pointer", padding: 0, background: s <= settings.fontScale ? "#0d9488" : "#e2e8f0", transition: "background 0.15s" }} />
              ))}
            </div>
            <button onClick={() => { const i = FONT_STEPS.indexOf(settings.fontScale); if (i < FONT_STEPS.length - 1) set("fontScale", FONT_STEPS[i + 1]) }} disabled={settings.fontScale >= 130} aria-label="Increase text size"
              style={{ width: isMobile ? "44px" : "30px", height: isMobile ? "44px" : "30px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff", cursor: settings.fontScale >= 130 ? "not-allowed" : "pointer", fontSize: "16px", color: settings.fontScale >= 130 ? "#cbd5e1" : "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>+</button>
          </div>
        </div>

        {/* ── Section 5: Translate ── */}
        <Divider />
        <SectionHeader label="🌐 Translate" color="#7c3aed" badge="Gemini Nano" concept="Chrome Translation API — on device, no internet after setup" />
        <HowTo steps={["Enable Gemini Nano first", "Pick your language", "Full page translates instantly"]} />
        <div style={{ padding: "6px 18px 12px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {SUPPORTED_LANGUAGES.slice(0, isMobile ? 8 : 18).map(lang => (
              <button key={lang.code} onClick={() => set("translateLanguage", lang.code)} aria-pressed={settings.translateLanguage === lang.code} disabled={!aiSupported}
                style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 500, border: `1px solid ${settings.translateLanguage === lang.code ? "#7c3aed" : "#e2e8f0"}`, background: settings.translateLanguage === lang.code ? "#f5f3ff" : "#fff", color: settings.translateLanguage === lang.code ? "#7c3aed" : "#64748b", cursor: aiSupported ? "pointer" : "not-allowed", opacity: aiSupported ? 1 : 0.5, minHeight: isMobile ? "36px" : "auto" }}>
                {lang.label}
              </button>
            ))}
          </div>
          {!aiSupported && <p style={{ margin: "6px 0 0", fontSize: "10px", color: "#94a3b8" }}>Enable Gemini Nano using the setup guide above.</p>}
        </div>

        {/* ── Section 6: Ask this page — RAG ── */}
        <Divider />
        <SectionHeader
          label="💬 Ask This Page"
          color="#0d9488"
          badge={ragBadge}
          concept="RAG — Retrieval Augmented Generation. Works on all devices including mobile."
        />
        <HowTo steps={[
          "Type any question about this page",
          "Press Ask or hit Enter",
          ragEngine === "transformers"
            ? "Transformers.js answers — works on mobile, offline"
            : "Gemini Nano reads page and answers privately",
          "Zero cost. No data leaves your device."
        ]} />

        {/* Engine badge */}
        <div style={{ margin: "0 18px 8px", padding: "6px 10px", background: ragEngine === "gemini" ? "#f0fdfa" : ragEngine === "transformers" ? "#f5f3ff" : "#f8fafc", borderRadius: "8px", border: `0.5px solid ${ragEngine === "gemini" ? "#99f6e4" : ragEngine === "transformers" ? "#c4b5fd" : "#e2e8f0"}`, fontSize: "10px", color: ragEngine === "gemini" ? "#0f766e" : ragEngine === "transformers" ? "#7c3aed" : "#94a3b8" }}>
          {ragEngine === "gemini"   && "✅ Using Gemini Nano — on device, private, instant"}
          {ragEngine === "transformers" && "✅ Using Transformers.js — works on mobile and all browsers"}
          {!ragEngine               && "⏳ Detecting AI engine..."}
          {ragEngine === "transformers" && modelStatus === "loading" && " · Loading model..."}
          {ragEngine === "transformers" && modelStatus === "ready"   && " · Model ready ✅"}
        </div>

        <div style={{ padding: "0 18px 14px" }}>
          <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
            <input
              type="text"
              value={ragQuestion}
              onChange={e => setRagQuestion(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleAsk() }}
              placeholder="e.g. What does this page do?"
              disabled={ragLoading || !ragEngine}
              aria-label="Ask a question about this page"
              style={{ flex: 1, padding: "8px 10px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px", color: "#0f172a", background: ragEngine ? "#fff" : "#f8fafc", outline: "none", height: isMobile ? "44px" : "36px" }}
            />
            <button
              onClick={handleAsk}
              disabled={ragLoading || !ragQuestion.trim() || !ragEngine}
              aria-label="Ask question"
              style={{ padding: "8px 14px", borderRadius: "8px", border: "none", background: ragEngine && ragQuestion.trim() && !ragLoading ? "#0d9488" : "#e2e8f0", color: ragEngine && ragQuestion.trim() && !ragLoading ? "#fff" : "#94a3b8", fontSize: "12px", fontWeight: 600, cursor: ragEngine && ragQuestion.trim() && !ragLoading ? "pointer" : "not-allowed", flexShrink: 0, height: isMobile ? "44px" : "36px", minWidth: "52px", transition: "background 0.2s" }}
            >
              {ragLoading ? loadingMsg : "Ask"}
            </button>
          </div>

          {ragAnswer && (
            <div role="status" aria-live="polite" style={{ padding: "10px 12px", background: "#f0fdfa", border: "1px solid #99f6e4", borderRadius: "8px", fontSize: "12px", color: "#0f766e", lineHeight: 1.6, maxHeight: "180px", overflowY: "auto" }}>
              <strong style={{ display: "block", marginBottom: "4px", fontSize: "11px", color: "#0d9488" }}>💬 Answer</strong>
              {ragAnswer}
              <button onClick={() => { setRagAnswer(""); setRagQuestion("") }}
                style={{ display: "block", marginTop: "6px", background: "none", border: "none", color: "#94a3b8", fontSize: "10px", cursor: "pointer", padding: 0 }}>
                Clear
              </button>
            </div>
          )}
        </div>

        {/* ── Audit report ── */}
        {report && (
          <div role="status" style={{ margin: "0 14px 10px", padding: "8px 12px", background: "#f0fdfa", border: "1px solid #99f6e4", borderRadius: "8px", fontSize: "12px", color: "#0f766e", fontWeight: 500, fontFamily: "monospace" }}>
            {report.fixed > 0
              ? `✓ ${report.fixed} fixes · ${report.scanned} nodes · ${report.renderTime}ms · Score: ${report.score}/100`
              : `✓ 0 auto-fixes needed · ${report.scanned} nodes · ${report.renderTime}ms`}
          </div>
        )}

        {/* ── Footer ── */}
        <div style={{ display: "flex", gap: "8px", padding: "12px 14px 14px", position: isMobile ? "sticky" : "relative", bottom: isMobile ? 0 : "auto", background: "#fff", borderTop: "1px solid #f1f5f9" }}>
          <button onClick={onReset} style={{ flex: 1, padding: isMobile ? "12px 0" : "8px 0", fontSize: "13px", fontWeight: 500, borderRadius: "9px", border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", cursor: "pointer" }}>
            Reset
          </button>
          <button onClick={onApply} style={{ flex: 2, padding: isMobile ? "12px 0" : "8px 0", fontSize: "13px", fontWeight: 600, borderRadius: "9px", border: "none", background: "#0d9488", color: "#fff", cursor: "pointer" }}>
            Apply settings
          </button>
        </div>

      </div>
    )
  }
)

WidgetPanel.displayName = "WidgetPanel"