// ─────────────────────────────────────────────────────────────────────────────
// src/react/YuktAIWrapper.tsx
// yuktai v2.0.20 — Yuktishaalaa AI Lab
//
// Main React wrapper component.
// AI detection fixed for Chrome 147+ — APIs moved to standalone globals.
//
// Chrome 127–146: window.ai.languageModel / summarizer / rewriter / writer
// Chrome 147+:    window.LanguageModel / Summarizer / Rewriter / Writer
//
// Usage in Next.js App Router:
//   <YuktAIWrapper position="left">{children}</YuktAIWrapper>
//
// With RAG button:
//   <YuktAIWrapper position="left" showRag={true}>{children}</YuktAIWrapper>
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
  showRag?:  boolean            // show 💬 RAG floating button — default false
}

// ─────────────────────────────────────────────────────────────────────────────
// detectAISupport
// Chrome 147+ moved AI APIs from window.ai.* to standalone globals.
// We check both — newest first.
// ─────────────────────────────────────────────────────────────────────────────
async function detectAISupport(): Promise<boolean> {
  try {
    if (typeof window === "undefined") return false

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any

    // Chrome 147+ standalone globals
    if (w.LanguageModel) {
      try {
        if (typeof w.LanguageModel.availability === "function") {
          const status = await w.LanguageModel.availability()
          console.log("yuktai: LanguageModel.availability() =", status)
          if (status === "readily" || status === "available" || status === "downloadable") return true
        } else {
          return true
        }
      } catch { /* continue */ }
    }

    if (w.Summarizer) {
      try {
        if (typeof w.Summarizer.availability === "function") {
          const status = await w.Summarizer.availability()
          if (status === "readily" || status === "available") return true
        } else { return true }
      } catch { /* continue */ }
    }

    if (w.Rewriter) {
      try {
        if (typeof w.Rewriter.availability === "function") {
          const status = await w.Rewriter.availability()
          if (status === "readily" || status === "available") return true
        } else { return true }
      } catch { /* continue */ }
    }

    if (w.Writer) {
      try {
        if (typeof w.Writer.availability === "function") {
          const status = await w.Writer.availability()
          if (status === "readily" || status === "available") return true
        } else { return true }
      } catch { /* continue */ }
    }

    // Chrome 127–146 window.ai namespace
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ai = w.ai || (globalThis as any).ai

    if (ai) {
      if (ai.languageModel?.availability) {
        try {
          const status = await ai.languageModel.availability()
          if (status === "readily" || status === "downloadable" || status === "available") return true
        } catch { /* continue */ }
      }
      if (ai.languageModel?.capabilities) {
        try {
          const caps = await ai.languageModel.capabilities()
          if (caps?.available === "readily" || caps?.available === "after-download") return true
        } catch { /* continue */ }
      }
      if (ai.languageModel && typeof ai.languageModel.create === "function") return true
      if (ai.summarizer?.capabilities) {
        try { const caps = await ai.summarizer.capabilities(); if (caps?.available !== "no") return true } catch { /* continue */ }
      }
      if (ai.rewriter?.capabilities) {
        try { const caps = await ai.rewriter.capabilities(); if (caps?.available !== "no") return true } catch { /* continue */ }
      }
      if (ai.writer?.capabilities) {
        try { const caps = await ai.writer.capabilities(); if (caps?.available !== "no") return true } catch { /* continue */ }
      }
      if (ai.summarizer || ai.rewriter || ai.writer || ai.languageModel) return true
    }

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
  config:  configOverrides = {},
  showRag = false,
}: YuktAIWrapperProps) {

  // ── Accessibility panel state ──
  const [panelOpen, setPanelOpen]           = useState(false)
  const [settings, setSettings]             = useState<WidgetSettings>(DEFAULT_SETTINGS)
  const [report, setReport]                 = useState<A11yReport | null>(null)
  const [isActive, setIsActive]             = useState(false)
  const [aiSupported, setAiSupported]       = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const panelRef                            = React.useRef<HTMLDivElement>(null)

  // ── RAG state — only used when showRag={true} ──
  const [ragOpen,     setRagOpen]     = useState(false)
  const [ragQuestion, setRagQuestion] = useState("")
  const [ragAnswer,   setRagAnswer]   = useState("")
  const [ragLoading,  setRagLoading]  = useState(false)

  // ─────────────────────────────────────────────────────────────────────────
  // RAG ask handler
  // ─────────────────────────────────────────────────────────────────────────
  const handleRagAsk = useCallback(async () => {
    if (!ragQuestion.trim() || ragLoading || !aiSupported) return
    setRagLoading(true)
    setRagAnswer("")
    try {
      const { askPage } = await import("../core/ai/rag")
      const r = await askPage(ragQuestion)
      setRagAnswer(
        r.success
          ? r.answer
              .replace(/\*\*(.*?)\*\*/g, "$1")
              .replace(/\*(.*?)\*/g, "$1")
              .replace(/#+\s/g, "")
              .trim()
          : "⚠️ " + (r.error || "No answer found.")
      )
    } catch {
      setRagAnswer("⚠️ Something went wrong.")
    }
    setRagLoading(false)
  }, [ragQuestion, ragLoading, aiSupported])

  // ─────────────────────────────────────────────────────────────────────────
  // Detect AI and voice support on mount
  // 800ms delay — Chrome 147 needs more time to expose standalone globals
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return

    const run = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any

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

      const hasVoice = !!(w.SpeechRecognition || w.webkitSpeechRecognition)
      setVoiceSupported(hasVoice)
    }

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
    const root = document.documentElement
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

  // Escape closes both panels
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (panelOpen) setPanelOpen(false)
        if (ragOpen)   setRagOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [panelOpen, ragOpen])

  // Focus trap on accessibility panel
  useEffect(() => {
    if (panelOpen && panelRef.current) wcagPlugin.trapFocus(panelRef.current)
  }, [panelOpen])

  // ── ♿ FAB style ──
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

  // ── 💬 RAG FAB style — sits above ♿ ──
  const ragFabStyle: React.CSSProperties = {
    position:       "fixed",
    bottom:         "84px",       // 24px (♿) + 52px (♿ height) + 8px gap
    [position]:     "24px",
    zIndex:         9998,
    width:          "52px",
    height:         "52px",
    borderRadius:   "50%",
    background:     ragOpen ? "#7c3aed" : "#6d28d9",
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
      {/* App content */}
      {children}

      {/* ── 💬 RAG floating button — only when showRag={true} ── */}
      {showRag && (
        <button
          style={ragFabStyle}
          aria-label="Ask a question about this page"
          aria-haspopup="dialog"
          aria-expanded={ragOpen}
          onClick={() => {
            setRagOpen(prev => !prev)
            setPanelOpen(false)   // close accessibility panel if open
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)" }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)" }}
        >
          💬
        </button>
      )}

      {/* ── 💬 RAG mini panel ── */}
      {showRag && ragOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Ask this page"
          data-yuktai-panel="true"
          style={{
            position:     "fixed",
            bottom:       "148px",    // above 💬 button
            [position]:   "24px",
            zIndex:       9999,
            width:        "300px",
            maxWidth:     "calc(100vw - 48px)",
            background:   "#fff",
            border:       "1px solid #e2e8f0",
            borderRadius: "16px",
            boxShadow:    "0 8px 32px rgba(0,0,0,0.12)",
            fontFamily:   "system-ui,-apple-system,sans-serif",
            padding:      "14px",
          }}
        >
          {/* RAG Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>
                💬 Ask this page
              </p>
              <p style={{ margin: 0, fontSize: "10px", color: "#7c3aed" }}>
                Gemini Nano · On device · Zero cost
              </p>
            </div>
            <button
              onClick={() => setRagOpen(false)}
              aria-label="Close ask panel"
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#94a3b8", fontSize: "18px", lineHeight: 1,
                padding: "2px", borderRadius: "4px",
              }}
            >
              ×
            </button>
          </div>

          {/* RAG Input + Ask button */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
            <input
              type="text"
              value={ragQuestion}
              onChange={e => setRagQuestion(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleRagAsk() }}
              placeholder="e.g. What does this page do?"
              disabled={!aiSupported || ragLoading}
              aria-label="Ask a question about this page"
              style={{
                flex:         1,
                padding:      "8px 10px",
                borderRadius: "8px",
                border:       "1px solid #e2e8f0",
                fontSize:     "12px",
                color:        "#0f172a",
                background:   aiSupported ? "#fff" : "#f8fafc",
                outline:      "none",
                height:       "36px",
              }}
            />
            <button
              onClick={handleRagAsk}
              disabled={!aiSupported || ragLoading || !ragQuestion.trim()}
              aria-label="Submit question"
              style={{
                padding:      "8px 12px",
                borderRadius: "8px",
                border:       "none",
                background:   aiSupported && ragQuestion.trim() && !ragLoading
                  ? "#7c3aed" : "#e2e8f0",
                color:        aiSupported && ragQuestion.trim() && !ragLoading
                  ? "#fff" : "#94a3b8",
                fontSize:     "12px",
                fontWeight:   600,
                cursor:       aiSupported && ragQuestion.trim() && !ragLoading
                  ? "pointer" : "not-allowed",
                height:       "36px",
                minWidth:     "48px",
                transition:   "background 0.2s",
              }}
            >
              {ragLoading ? "..." : "Ask"}
            </button>
          </div>

          {/* RAG Answer */}
          {ragAnswer && (
            <div style={{
              padding:      "10px",
              background:   "#f5f3ff",
              borderRadius: "8px",
              fontSize:     "12px",
              color:        "#4c1d95",
              lineHeight:   1.6,
              maxHeight:    "180px",
              overflowY:    "auto",
            }}>
              <strong style={{ display: "block", marginBottom: "4px", fontSize: "11px", color: "#7c3aed" }}>
                💬 Answer
              </strong>
              {ragAnswer}
              <button
                onClick={() => { setRagAnswer(""); setRagQuestion("") }}
                style={{
                  display:    "block",
                  marginTop:  "6px",
                  background: "none",
                  border:     "none",
                  color:      "#94a3b8",
                  fontSize:   "10px",
                  cursor:     "pointer",
                  padding:    0,
                }}
              >
                Clear
              </button>
            </div>
          )}

          {/* Not supported message */}
          {!aiSupported && (
            <p style={{ margin: "4px 0 0", fontSize: "10px", color: "#94a3b8" }}>
              Enable Gemini Nano via chrome://flags to use this feature.
            </p>
          )}
        </div>
      )}

      {/* ── ♿ Floating accessibility button ── */}
      <button
        style={fabStyle}
        aria-label="Open accessibility preferences"
        aria-haspopup="dialog"
        aria-expanded={panelOpen}
        data-yuktai-pref-toggle="true"
        onClick={() => {
          setPanelOpen(prev => !prev)
          setRagOpen(false)   // close RAG panel if open
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)" }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)" }}
      >
        ♿
      </button>

      {/* ── Accessibility preference panel ── */}
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