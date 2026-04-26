// ─────────────────────────────────────────────────────────────────────────────
// src/react/YuktAIWrapper.tsx
// yuktai v2.0.18 — Yuktishaalaa AI Lab
//
// Main React wrapper component.
// Initialises the accessibility engine and all AI features.
// Renders the WidgetPanel UI for user preference control.
// Responsive panel layout — desktop, tablet, mobile.
//
// AI detection — works across Chrome 127 through 147+
// Checks all known window.ai API shapes across Chrome versions.
//
// Usage in Next.js App Router:
//   <YuktAIWrapper position="left">{children}</YuktAIWrapper>
//
// Usage in Next.js Pages Router:
//   <YuktAIWrapper position="right">{children}</YuktAIWrapper>
// ─────────────────────────────────────────────────────────────────────────────

"use client"

import React, {
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react"

import { wcagPlugin, type A11yConfig, type A11yReport } from "../core/renderer"
import { WidgetPanel, type WidgetSettings, DEFAULT_SETTINGS } from "./WidgetPanel"

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
export interface YuktAIWrapperProps {
  // Which side the floating button appears on
  position?: "left" | "right"

  // Your app content
  children:  ReactNode

  // Optional — override default config
  config?:   Partial<A11yConfig>
}

// ─────────────────────────────────────────────────────────────────────────────
// detectAISupport
// Checks all known Chrome Built-in AI API shapes across versions.
//
// Chrome 127–134: window.ai.summarizer / rewriter / writer with capabilities()
// Chrome 135–146: window.ai.languageModel with capabilities()
// Chrome 147+:    window.ai.languageModel with availability()
// Fallback:       globalThis.ai, window.translation
//
// Returns true if ANY AI capability is detected and available.
// ─────────────────────────────────────────────────────────────────────────────
async function detectAISupport(): Promise<boolean> {
  try {
    if (typeof window === "undefined") return false

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ai = (window as any).ai || (globalThis as any).ai

    // No AI object — flags not enabled
    if (!ai) return false

    // ── Check 1: Chrome 147+ — languageModel.availability()
    if (ai.languageModel?.availability) {
      try {
        const status = await ai.languageModel.availability()
        if (
          status === "readily"     ||
          status === "downloadable" ||
          status === "available"
        ) return true
      } catch { /* try next */ }
    }

    // ── Check 2: Chrome 135–146 — languageModel.capabilities()
    if (ai.languageModel?.capabilities) {
      try {
        const caps = await ai.languageModel.capabilities()
        if (
          caps?.available === "readily" ||
          caps?.available === "after-download"
        ) return true
      } catch { /* try next */ }
    }

    // ── Check 3: Chrome 135+ — languageModel.create exists
    if (ai.languageModel && typeof ai.languageModel.create === "function") {
      return true
    }

    // ── Check 4: Chrome 127–134 — summarizer API
    if (ai.summarizer?.capabilities) {
      try {
        const caps = await ai.summarizer.capabilities()
        if (caps?.available !== "no") return true
      } catch { /* try next */ }
    }

    // ── Check 5: Chrome 127–134 — rewriter API
    if (ai.rewriter?.capabilities) {
      try {
        const caps = await ai.rewriter.capabilities()
        if (caps?.available !== "no") return true
      } catch { /* try next */ }
    }

    // ── Check 6: Chrome 127–134 — writer API
    if (ai.writer?.capabilities) {
      try {
        const caps = await ai.writer.capabilities()
        if (caps?.available !== "no") return true
      } catch { /* try next */ }
    }

    // ── Check 7: Translation API — separate from window.ai
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).translation?.canTranslate) return true

    // ── Check 8: Loose check — any known sub-API exists
    if (
      ai.summarizer  ||
      ai.rewriter    ||
      ai.writer      ||
      ai.languageModel ||
      ai.translator
    ) return true

    return false

  } catch {
    return false
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// YuktAIWrapper
// Top-level component — wrap your entire app with this.
// Handles engine init, AI support detection, panel open/close.
// ─────────────────────────────────────────────────────────────────────────────
export function YuktAIWrapper({
  position = "left",
  children,
  config: configOverrides = {},
}: YuktAIWrapperProps) {

  const [panelOpen, setPanelOpen]           = useState(false)
  const [settings, setSettings]             = useState<WidgetSettings>(DEFAULT_SETTINGS)
  const [report, setReport]                 = useState<A11yReport | null>(null)
  const [isActive, setIsActive]             = useState(false)
  const [aiSupported, setAiSupported]       = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const panelRef                            = React.useRef<HTMLDivElement>(null)

  // ─────────────────────────────────────────────────────────────────────────
  // Detect AI and voice support on mount
  // 500ms delay — Chrome needs time to initialise window.ai after page load
  // Without this delay, window.ai is often undefined even when flags enabled
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return

    const run = async () => {
      const supported = await detectAISupport()
      setAiSupported(supported)

      // Log to console so developer can verify detection
      if (supported) {
        console.log("yuktai: Chrome Built-in AI detected ✅")
      } else {
        console.log(
          "yuktai: Chrome Built-in AI not detected.",
          "Enable via chrome://flags — see panel for setup guide."
        )
      }

      // Voice control — SpeechRecognition API
      // No flags needed — works in Chrome, Edge, Firefox
      const hasVoice = !!(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).SpeechRecognition ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).webkitSpeechRecognition
      )
      setVoiceSupported(hasVoice)
    }

    // 500ms delay for Chrome AI initialisation
    const timer = setTimeout(run, 500)
    return () => clearTimeout(timer)
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // Load saved preferences from localStorage on mount
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const saved = localStorage.getItem("yuktai-a11y-prefs")
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<WidgetSettings>
        setSettings(prev => ({ ...prev, ...parsed }))
      }
    } catch {
      // localStorage not available — ignore
    }
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // runEngine — builds A11yConfig and runs the WCAG engine
  // ─────────────────────────────────────────────────────────────────────────
  const runEngine = useCallback(async (current: WidgetSettings) => {
    const config: A11yConfig = {
      enabled:             true,
      highContrast:        current.highContrast,
      darkMode:            current.darkMode,
      reduceMotion:        current.reduceMotion,
      largeTargets:        current.largeTargets,
      speechEnabled:       current.speechEnabled,
      autoFix:             current.autoFix,
      dyslexiaFont:        current.dyslexiaFont,
      localFont:           current.localFont,
      fontSizeMultiplier:  current.fontScale / 100,
      colorBlindMode:      current.colorBlindMode,
      showAuditBadge:      current.showAuditBadge,
      showSkipLinks:       true,
      showPreferencePanel: false,
      plainEnglish:        current.plainEnglish,
      summarisePage:       current.summarisePage,
      translateLanguage:   current.translateLanguage,
      voiceControl:        current.voiceControl,
      smartLabels:         current.smartLabels,
      ...configOverrides,
    }

    await wcagPlugin.execute(config)
    const freshReport = wcagPlugin.applyFixes(config)
    setReport(freshReport)
    setIsActive(true)
  }, [configOverrides])

  // ─────────────────────────────────────────────────────────────────────────
  // handleApply — saves and runs engine
  // ─────────────────────────────────────────────────────────────────────────
  const handleApply = useCallback(async () => {
    try {
      localStorage.setItem("yuktai-a11y-prefs", JSON.stringify(settings))
    } catch { /* ignore */ }
    await runEngine(settings)
    setPanelOpen(false)
  }, [settings, runEngine])

  // ─────────────────────────────────────────────────────────────────────────
  // handleReset — clears all settings and DOM attributes
  // ─────────────────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    try {
      localStorage.removeItem("yuktai-a11y-prefs")
    } catch { /* ignore */ }

    const root  = document.documentElement
    const attrs = [
      "data-yuktai-high-contrast",
      "data-yuktai-dark",
      "data-yuktai-reduce-motion",
      "data-yuktai-large-targets",
      "data-yuktai-keyboard",
      "data-yuktai-dyslexia",
    ]
    attrs.forEach(attr => root.removeAttribute(attr))
    document.body.style.filter              = ""
    document.body.style.fontFamily          = ""
    document.documentElement.style.fontSize = ""

    setReport(null)
    setIsActive(false)
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // handleSet — updates a single setting
  // ─────────────────────────────────────────────────────────────────────────
  const handleSet = useCallback(<K extends keyof WidgetSettings>(
    key: K,
    val: WidgetSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: val }))
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // Escape key closes panel
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && panelOpen) setPanelOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [panelOpen])

  // ─────────────────────────────────────────────────────────────────────────
  // Focus trap — keeps focus inside panel when open
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (panelOpen && panelRef.current) {
      wcagPlugin.trapFocus(panelRef.current)
    }
  }, [panelOpen])

  // ─────────────────────────────────────────────────────────────────────────
  // FAB style — teal when active, blue when idle
  // ─────────────────────────────────────────────────────────────────────────
  const fabStyle: React.CSSProperties = {
    position:       "fixed",
    bottom:         "24px",
    [position]:     "24px",
    zIndex:         9998,
    width:          "52px",
    height:         "52px",
    borderRadius:   "50%",
    background:     isActive ? "#0d9488" : "#1a73e8",
    color:          "#fff",
    border:         "none",
    cursor:         "pointer",
    fontSize:       "22px",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    boxShadow:      "0 4px 16px rgba(0,0,0,0.25)",
    transition:     "transform 0.15s, background 0.2s",
  }

  return (
    <>
      {/* App content — untouched */}
      {children}

      {/* Floating accessibility button */}
      <button
        style={fabStyle}
        aria-label="Open accessibility preferences"
        aria-haspopup="dialog"
        aria-expanded={panelOpen}
        data-yuktai-pref-toggle="true"
        onClick={() => setPanelOpen(prev => !prev)}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)"
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"
        }}
      >
        ♿
      </button>

      {/* Preference panel — only rendered when open */}
      {panelOpen && (
        <WidgetPanel
          ref={panelRef}
          position={position}
          settings={settings}
          report={report}
          isActive={isActive}
          aiSupported={aiSupported}
          voiceSupported={voiceSupported}
          set={handleSet}
          onApply={handleApply}
          onReset={handleReset}
          onClose={() => setPanelOpen(false)}
        />
      )}
    </>
  )
}