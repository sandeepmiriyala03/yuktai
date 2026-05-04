// ─────────────────────────────────────────────────────────────────────────────
// src/react/YuktAIWrapper.tsx
// yuktai v3.0.9 — Yuktishaalaa AI Lab
//
// Two floating buttons:
//   ♿  — Accessibility panel (bottom)
//   💬  — RAG Ask panel (above ♿, shown when showRag={true})
//
// RAG engine auto-selected:
//   Desktop Chrome + Gemini Nano → rag.ts (instant, no download)
//   Mobile / All other browsers  → transformers-rag.ts (works offline)
//
// Usage:
//   <YuktAIWrapper position="left">                 — ♿ only
//   <YuktAIWrapper position="left" showRag={true}>  — ♿ + 💬
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
import {
  isTransformersSupported,
  getModelLoadStatus,
} from "../core/ai/transformers-rag"

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
export interface YuktAIWrapperProps {
  position?: "left" | "right"
  children:  ReactNode
  config?:   Partial<A11yConfig>
  showRag?:  boolean   // show 💬 RAG button — default false
}

// ─────────────────────────────────────────────────────────────────────────────
// detectAISupport — checks Chrome Built-in AI (Gemini Nano)
// Chrome 147+: window.LanguageModel / Summarizer / Rewriter / Writer
// Chrome 127–146: window.ai.*
// ─────────────────────────────────────────────────────────────────────────────
async function detectAISupport(): Promise<boolean> {
  try {
    if (typeof window === "undefined") return false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any

    if (w.LanguageModel) {
      try {
        if (typeof w.LanguageModel.availability === "function") {
          const s = await w.LanguageModel.availability()
          if (s === "readily" || s === "available" || s === "downloadable") return true
        } else return true
      } catch { /* continue */ }
    }
    if (w.Summarizer) {
      try {
        const s = await w.Summarizer.availability?.()
        if (!s || s === "readily" || s === "available") return true
      } catch { /* continue */ }
    }
    if (w.Rewriter) {
      try {
        const s = await w.Rewriter.availability?.()
        if (!s || s === "readily" || s === "available") return true
      } catch { /* continue */ }
    }
    if (w.Writer) {
      try {
        const s = await w.Writer.availability?.()
        if (!s || s === "readily" || s === "available") return true
      } catch { /* continue */ }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ai = w.ai || (globalThis as any).ai
    if (ai) {
      if (ai.languageModel?.availability) {
        try { const s = await ai.languageModel.availability(); if (s === "readily" || s === "available") return true } catch { /* continue */ }
      }
      if (ai.languageModel && typeof ai.languageModel.create === "function") return true
      if (ai.summarizer || ai.rewriter || ai.writer || ai.languageModel) return true
    }
    if (w.Translator || w.translation?.canTranslate) return true
    return false
  } catch {
    return false
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// YuktAIWrapper
// ─────────────────────────────────────────────────────────────────────────────
export function YuktAIWrapper({
  position = "left",
  children,
  config:  configOverrides = {},
  showRag = false,
}: YuktAIWrapperProps) {

  // ── Panel state ──
  const [panelOpen,      setPanelOpen]      = useState(false)
  const [settings,       setSettings]       = useState<WidgetSettings>(DEFAULT_SETTINGS)
  const [report,         setReport]         = useState<A11yReport | null>(null)
  const [isActive,       setIsActive]       = useState(false)
  const [aiSupported,    setAiSupported]    = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const panelRef                            = React.useRef<HTMLDivElement>(null)

  // ── RAG state ──
  const [ragOpen,      setRagOpen]      = useState(false)
  const [ragQuestion,  setRagQuestion]  = useState("")
  const [ragAnswer,    setRagAnswer]    = useState("")
  const [ragLoading,   setRagLoading]   = useState(false)
  const [ragEngine,    setRagEngine]    = useState<"gemini" | "transformers" | null>(null)
  const [modelStatus,  setModelStatus]  = useState<"idle" | "loading" | "ready">("idle")

  // ── Detect RAG engine on mount ──
  useEffect(() => {
    if (typeof window === "undefined") return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    const hasGemini = !!(w.LanguageModel || w.ai?.languageModel)
    if (hasGemini && aiSupported) {
      setRagEngine("gemini")
    } else if (isTransformersSupported()) {
      setRagEngine("transformers")
    }
  }, [aiSupported])

  // ── Poll Transformers model status ──
  useEffect(() => {
    if (ragEngine !== "transformers") return
    const interval = setInterval(() => setModelStatus(getModelLoadStatus()), 500)
    return () => clearInterval(interval)
  }, [ragEngine])

  // ── RAG ask handler — auto switches between Gemini Nano and Transformers.js ──
  const handleRagAsk = useCallback(async () => {
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
        const { askPage } = await import("../core/ai/rag")
        result = await askPage(ragQuestion)
      } else {
        setModelStatus("loading")
        const { askPageWithTransformers } = await import("../core/ai/transformers-rag")
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
          : "⚠️ " + (result.error || "No answer found.")
      )
    } catch {
      setRagAnswer("⚠️ Something went wrong. Please try again.")
    }

    setRagLoading(false)
  }, [ragQuestion, ragLoading, ragEngine])

  // ── Detect AI and voice on mount ──
  useEffect(() => {
    if (typeof window === "undefined") return

    const run = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any
      console.log("yuktai: Checking AI APIs...")
      console.log("yuktai: window.LanguageModel =", w.LanguageModel)

      const supported = await detectAISupport()
      setAiSupported(supported)
      console.log(supported
        ? "yuktai: Chrome Built-in AI detected ✅"
        : "yuktai: Chrome Built-in AI not detected — Transformers.js will handle RAG on mobile"
      )

      setVoiceSupported(!!(w.SpeechRecognition || w.webkitSpeechRecognition))
    }

    const timer = setTimeout(run, 800)
    return () => clearTimeout(timer)
  }, [])

  // ── Load saved preferences ──
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const saved = localStorage.getItem("yuktai-a11y-prefs")
      if (saved) setSettings(prev => ({ ...prev, ...JSON.parse(saved) }))
    } catch { /* ignore */ }
  }, [])

  // ── Engine ──
  const runEngine = useCallback(async (current: WidgetSettings) => {
    const config: A11yConfig = {
      enabled: true, highContrast: current.highContrast, darkMode: current.darkMode,
      reduceMotion: current.reduceMotion, largeTargets: current.largeTargets,
      speechEnabled: current.speechEnabled, autoFix: current.autoFix,
      dyslexiaFont: current.dyslexiaFont, localFont: current.localFont,
      fontSizeMultiplier: current.fontScale / 100, colorBlindMode: current.colorBlindMode,
      showAuditBadge: current.showAuditBadge, showSkipLinks: true, showPreferencePanel: false,
      plainEnglish: current.plainEnglish, summarisePage: current.summarisePage,
      translateLanguage: current.translateLanguage, voiceControl: current.voiceControl,
      smartLabels: current.smartLabels, ...configOverrides,
    }
    await wcagPlugin.execute(config)
    setReport(wcagPlugin.applyFixes(config))
    setIsActive(true)
  }, [configOverrides])

  const handleApply = useCallback(async () => {
    try { localStorage.setItem("yuktai-a11y-prefs", JSON.stringify(settings)) } catch { /* ignore */ }
    await runEngine(settings)
    setPanelOpen(false)
  }, [settings, runEngine])

  const handleReset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    try { localStorage.removeItem("yuktai-a11y-prefs") } catch { /* ignore */ }
    const root = document.documentElement
    ;["data-yuktai-high-contrast","data-yuktai-dark","data-yuktai-reduce-motion","data-yuktai-large-targets","data-yuktai-keyboard","data-yuktai-dyslexia"].forEach(a => root.removeAttribute(a))
    document.body.style.filter = ""
    document.body.style.fontFamily = ""
    document.documentElement.style.fontSize = ""
    setReport(null); setIsActive(false)
  }, [])

  const handleSet = useCallback(<K extends keyof WidgetSettings>(key: K, val: WidgetSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: val }))
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { if (panelOpen) setPanelOpen(false); if (ragOpen) setRagOpen(false) }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [panelOpen, ragOpen])

  useEffect(() => {
    if (panelOpen && panelRef.current) wcagPlugin.trapFocus(panelRef.current)
  }, [panelOpen])

  // ── RAG loading message ──
  const ragLoadingMsg = ragEngine === "transformers" && modelStatus === "loading"
    ? "Loading AI... (first time only)"
    : "..."

  // ── RAG panel subtitle ──
  const ragSubtitle = ragEngine === "gemini"
    ? "Gemini Nano · On device · Instant"
    : ragEngine === "transformers"
    ? "Transformers.js · All devices · Offline"
    : "Detecting engine..."

  // ── FAB styles ──
  const fabStyle: React.CSSProperties = {
    position: "fixed", bottom: "24px", [position]: "24px", zIndex: 9998,
    width: "52px", height: "52px", borderRadius: "50%",
    background: isActive ? "#0d9488" : "#1a73e8",
    color: "#fff", border: "none", cursor: "pointer", fontSize: "22px",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 16px rgba(0,0,0,0.25)", transition: "transform 0.15s, background 0.2s",
  }

  const ragFabStyle: React.CSSProperties = {
    position: "fixed", bottom: "84px", [position]: "24px", zIndex: 9998,
    width: "52px", height: "52px", borderRadius: "50%",
    background: ragOpen ? "#7c3aed" : "#6d28d9",
    color: "#fff", border: "none", cursor: "pointer", fontSize: "22px",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 16px rgba(0,0,0,0.25)", transition: "transform 0.15s, background 0.2s",
  }

  return (
    <>
      {children}

      {/* ── 💬 RAG button — shown when showRag={true} ── */}
      {showRag && (
        <button
          style={ragFabStyle}
          aria-label="Ask a question about this page"
          aria-haspopup="dialog"
          aria-expanded={ragOpen}
          title={`Ask this page · ${ragSubtitle}`}
          onClick={() => { setRagOpen(p => !p); setPanelOpen(false) }}
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
            position: "fixed", bottom: "148px", [position]: "24px", zIndex: 9999,
            width: "300px", maxWidth: "calc(100vw - 48px)",
            background: "#fff", border: "1px solid #e2e8f0",
            borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            fontFamily: "system-ui,-apple-system,sans-serif", padding: "14px",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>💬 Ask this page</p>
              <p style={{ margin: 0, fontSize: "10px", color: ragEngine === "gemini" ? "#0d9488" : "#7c3aed" }}>
                {ragSubtitle}
              </p>
              {ragEngine === "transformers" && modelStatus === "loading" && (
                <p style={{ margin: "2px 0 0", fontSize: "9px", color: "#94a3b8" }}>
                  Downloading AI model — first time only (~90MB)
                </p>
              )}
              {ragEngine === "transformers" && modelStatus === "ready" && (
                <p style={{ margin: "2px 0 0", fontSize: "9px", color: "#0d9488" }}>
                  Model ready ✅ — works offline now
                </p>
              )}
            </div>
            <button onClick={() => setRagOpen(false)} aria-label="Close ask panel"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: "18px", lineHeight: 1, padding: "2px", borderRadius: "4px" }}>
              ×
            </button>
          </div>

          {/* Input */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
            <input
              type="text"
              value={ragQuestion}
              onChange={e => setRagQuestion(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleRagAsk() }}
              placeholder="e.g. What does this page do?"
              disabled={ragLoading || !ragEngine}
              aria-label="Ask a question about this page"
              style={{ flex: 1, padding: "8px 10px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px", color: "#0f172a", background: ragEngine ? "#fff" : "#f8fafc", outline: "none", height: "36px" }}
            />
            <button
              onClick={handleRagAsk}
              disabled={ragLoading || !ragQuestion.trim() || !ragEngine}
              aria-label="Submit question"
              style={{
                padding: "8px 12px", borderRadius: "8px", border: "none",
                background: ragEngine && ragQuestion.trim() && !ragLoading ? "#7c3aed" : "#e2e8f0",
                color: ragEngine && ragQuestion.trim() && !ragLoading ? "#fff" : "#94a3b8",
                fontSize: "12px", fontWeight: 600,
                cursor: ragEngine && ragQuestion.trim() && !ragLoading ? "pointer" : "not-allowed",
                height: "36px", minWidth: "48px", transition: "background 0.2s",
              }}
            >
              {ragLoading ? ragLoadingMsg : "Ask"}
            </button>
          </div>

          {/* Answer */}
          {ragAnswer && (
            <div style={{ padding: "10px", background: "#f5f3ff", borderRadius: "8px", fontSize: "12px", color: "#4c1d95", lineHeight: 1.6, maxHeight: "180px", overflowY: "auto" }}>
              <strong style={{ display: "block", marginBottom: "4px", fontSize: "11px", color: "#7c3aed" }}>💬 Answer</strong>
              {ragAnswer}
              <button onClick={() => { setRagAnswer(""); setRagQuestion("") }}
                style={{ display: "block", marginTop: "6px", background: "none", border: "none", color: "#94a3b8", fontSize: "10px", cursor: "pointer", padding: 0 }}>
                Clear
              </button>
            </div>
          )}

          {!ragEngine && (
            <p style={{ margin: "4px 0 0", fontSize: "10px", color: "#94a3b8" }}>
              Detecting AI engine...
            </p>
          )}
        </div>
      )}

      {/* ── ♿ Accessibility button ── */}
      <button
        style={fabStyle}
        aria-label="Open accessibility preferences"
        aria-haspopup="dialog"
        aria-expanded={panelOpen}
        data-yuktai-pref-toggle="true"
        onClick={() => { setPanelOpen(p => !p); setRagOpen(false) }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)" }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)" }}
      >
        ♿
      </button>

      {/* ── Accessibility panel ── */}
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