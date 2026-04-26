// ─────────────────────────────────────────────────────────────────────────────
// src/react/YuktAIWrapper.tsx
// yuktai v2.0.19 — Yuktishaalaa AI Lab
//
// Main React wrapper component.
// AI detection fixed for Chrome 147+ — APIs moved to standalone globals.
//
// Chrome 127–146: window.ai.languageModel / summarizer / rewriter / writer
// Chrome 147+:    window.LanguageModel / Summarizer / Rewriter / Writer
//
// Usage in Next.js App Router:
//   <YuktAIWrapper position="left">{children}</YuktAIWrapper>
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
  position?: "left" | "right"
  children:  ReactNode
  config?:   Partial<A11yConfig>
}

// ─────────────────────────────────────────────────────────────────────────────
// detectAISupport
//
// Chrome 147+ moved AI APIs from window.ai.* to standalone globals:
//   window.LanguageModel
//   window.Summarizer
//   window.Rewriter
//   window.Writer
//
// Chrome 127–146 used:
//   window.ai.languageModel
//   window.ai.summarizer
//   window.ai.rewriter
//   window.ai.writer
//
// We check both — newest first.
// ─────────────────────────────────────────────────────────────────────────────
async function detectAISupport(): Promise<boolean> {
  try {
    if (typeof window === "undefined") return false

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any

    // ── Chrome 147+ standalone globals ──────────────────────────────────────
    // APIs are now top-level constructors on window

    // LanguageModel
    if (w.LanguageModel) {
      try {
        // Check availability if the method exists
        if (typeof w.LanguageModel.availability === "function") {
          const status = await w.LanguageModel.availability()
          console.log("yuktai: LanguageModel.availability() =", status)
          if (status === "readily" || status === "available" || status === "downloadable") {
            return true
          }
        } else {
          // Constructor exists — treat as supported
          return true
        }
      } catch { /* continue */ }
    }

    // Summarizer
    if (w.Summarizer) {
      try {
        if (typeof w.Summarizer.availability === "function") {
          const status = await w.Summarizer.availability()
          if (status === "readily" || status === "available") return true
        } else {
          return true
        }
      } catch { /* continue */ }
    }

    // Rewriter
    if (w.Rewriter) {
      try {
        if (typeof w.Rewriter.availability === "function") {
          const status = await w.Rewriter.availability()
          if (status === "readily" || status === "available") return true
        } else {
          return true
        }
      } catch { /* continue */ }
    }

    // Writer
    if (w.Writer) {
      try {
        if (typeof w.Writer.availability === "function") {
          const status = await w.Writer.availability()
          if (status === "readily" || status === "available") return true
        } else {
          return true
        }
      } catch { /* continue */ }
    }

    // ── Chrome 127–146 window.ai namespace ──────────────────────────────────
    const ai = w.ai || (globalThis as any).ai

    if (ai) {

      // languageModel.availability() — Chrome 135–146
      if (ai.languageModel?.availability) {
        try {
          const status = await ai.languageModel.availability()
          if (status === "readily" || status === "downloadable" || status === "available") return true
        } catch { /* continue */ }
      }

      // languageModel.capabilities() — Chrome 135–146
      if (ai.languageModel?.capabilities) {
        try {
          const caps = await ai.languageModel.capabilities()
          if (caps?.available === "readily" || caps?.available === "after-download") return true
        } catch { /* continue */ }
      }

      // languageModel.create exists — Chrome 135+
      if (ai.languageModel && typeof ai.languageModel.create === "function") return true

      // summarizer.capabilities() — Chrome 127–134
      if (ai.summarizer?.capabilities) {
        try {
          const caps = await ai.summarizer.capabilities()
          if (caps?.available !== "no") return true
        } catch { /* continue */ }
      }

      // rewriter.capabilities() — Chrome 127–134
      if (ai.rewriter?.capabilities) {
        try {
          const caps = await ai.rewriter.capabilities()
          if (caps?.available !== "no") return true
        } catch { /* continue */ }
      }

      // writer.capabilities() — Chrome 127–134
      if (ai.writer?.capabilities) {
        try {
          const caps = await ai.writer.capabilities()
          if (caps?.available !== "no") return true
        } catch { /* continue */ }
      }

      // Loose check — any sub-API exists
      if (ai.summarizer || ai.rewriter || ai.writer || ai.languageModel) return true
    }

    // Translation API — separate namespace
    if (w.Translator || w.translation?.canTranslate) return true

    return false

  } catch {
    return false
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// YuktAIWrapper — main component
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
  // Detect AI support on mount
  // 800ms delay — Chrome 147 needs more time to expose standalone globals
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return

    const run = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any

      // Log what Chrome 147 exposes — helps with debugging
      console.log("yuktai: Checking AI APIs...")
      console.log("yuktai: window.ai =", w.ai)
      console.log("yuktai: window.LanguageModel =", w.LanguageModel)
      console.log("yuktai: window.Summarizer =", w.Summarizer)
      console.log("yuktai: window.Rewriter =", w.Rewriter)
      console.log("yuktai: window.Writer =", w.Writer)

      const supported = await detectAISupport()
      setAiSupported(supported)

      if (supported) {
        console.log("yuktai: Chrome Built-in AI detected ✅")
      } else {
        console.log("yuktai: Chrome Built-in AI not detected ❌")
        console.log("yuktai: Enable flags at chrome://flags and download model at chrome://components")
      }

      // Voice control detection
      const hasVoice = !!(w.SpeechRecognition || w.webkitSpeechRecognition)
      setVoiceSupported(hasVoice)
    }

    // 800ms delay — Chrome 147 standalone globals need more init time
    const timer = setTimeout(run, 800)
    return () => clearTimeout(timer)
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // Load saved preferences from localStorage
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const saved = localStorage.getItem("yuktai-a11y-prefs")
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<WidgetSettings>
        setSettings(prev => ({ ...prev, ...parsed }))
      }
    } catch { /* ignore */ }
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // runEngine
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
  // handleApply
  // ─────────────────────────────────────────────────────────────────────────
  const handleApply = useCallback(async () => {
    try { localStorage.setItem("yuktai-a11y-prefs", JSON.stringify(settings)) } catch { /* ignore */ }
    await runEngine(settings)
    setPanelOpen(false)
  }, [settings, runEngine])

  // ─────────────────────────────────────────────────────────────────────────
  // handleReset
  // ─────────────────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    try { localStorage.removeItem("yuktai-a11y-prefs") } catch { /* ignore */ }
    const root  = document.documentElement
    ;[
      "data-yuktai-high-contrast",
      "data-yuktai-dark",
      "data-yuktai-reduce-motion",
      "data-yuktai-large-targets",
      "data-yuktai-keyboard",
      "data-yuktai-dyslexia",
    ].forEach(attr => root.removeAttribute(attr))
    document.body.style.filter              = ""
    document.body.style.fontFamily          = ""
    document.documentElement.style.fontSize = ""
    setReport(null)
    setIsActive(false)
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // handleSet
  // ─────────────────────────────────────────────────────────────────────────
  const handleSet = useCallback(<K extends keyof WidgetSettings>(
    key: K, val: WidgetSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: val }))
  }, [])

  // Escape closes panel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && panelOpen) setPanelOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [panelOpen])

  // Focus trap
  useEffect(() => {
    if (panelOpen && panelRef.current) wcagPlugin.trapFocus(panelRef.current)
  }, [panelOpen])

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
      {children}

      <button
        style={fabStyle}
        aria-label="Open accessibility preferences"
        aria-haspopup="dialog"
        aria-expanded={panelOpen}
        data-yuktai-pref-toggle="true"
        onClick={() => setPanelOpen(prev => !prev)}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)" }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)" }}
      >
        ♿
      </button>

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