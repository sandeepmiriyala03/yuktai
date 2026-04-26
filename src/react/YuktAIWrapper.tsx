// ─────────────────────────────────────────────────────────────────────────────
// src/react/YuktAIWrapper.tsx
// yuktai v4.0.0 — Yuktishaalaa AI Lab
//
// Main React wrapper component.
// Initialises the accessibility engine and all AI features.
// Renders the WidgetPanel UI for user preference control.
// Desktop only. Responsive panel layout.
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
// YuktAIWrapper
// Top-level component — wrap your entire app with this.
// Handles engine init, AI support detection, panel open/close.
// ─────────────────────────────────────────────────────────────────────────────
export function YuktAIWrapper({
  position = "left",
  children,
  config: configOverrides = {},
}: YuktAIWrapperProps) {

  // ── Panel open/close state ──
  const [panelOpen, setPanelOpen] = useState(false)

  // ── Current widget settings — synced with localStorage ──
  const [settings, setSettings] = useState<WidgetSettings>(DEFAULT_SETTINGS)

  // ── Last audit report — shown in panel ──
  const [report, setReport] = useState<A11yReport | null>(null)

  // ── Whether the engine has been applied ──
  const [isActive, setIsActive] = useState(false)

  // ── AI feature support flags — detected on mount ──
  const [aiSupported, setAiSupported] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)

  // ── Panel ref — used for focus trap on open ──
  const panelRef = React.useRef<HTMLDivElement>(null)

  // ─────────────────────────────────────────────────────────────────────────
  // Detect browser AI support on mount
  // Chrome 127+ has window.ai — older browsers do not
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return

    // Check Chrome Built-in AI
    const hasAI = !!(window as unknown as Record<string, unknown>).ai
    setAiSupported(hasAI)

    // Check SpeechRecognition for voice control
    const hasVoice = !!(
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition
    )
    setVoiceSupported(hasVoice)
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
  // Run the accessibility engine whenever settings change
  // ─────────────────────────────────────────────────────────────────────────
  const runEngine = useCallback(async (current: WidgetSettings) => {
    // Build config from current settings
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
      showPreferencePanel: false, // panel handled by React — not the engine
      plainEnglish:        current.plainEnglish,
      summarisePage:       current.summarisePage,
      translateLanguage:   current.translateLanguage,
      voiceControl:        current.voiceControl,
      smartLabels:         current.smartLabels,
      ...configOverrides,
    }

    // Run fixes and get report
    await wcagPlugin.execute(config)
    const freshReport = wcagPlugin.applyFixes(config)
    setReport(freshReport)
    setIsActive(true)
  }, [configOverrides])

  // ─────────────────────────────────────────────────────────────────────────
  // Apply settings — called from panel Apply button
  // ─────────────────────────────────────────────────────────────────────────
  const handleApply = useCallback(async () => {
    // Save to localStorage
    try {
      localStorage.setItem("yuktai-a11y-prefs", JSON.stringify(settings))
    } catch {
      // ignore
    }

    // Run engine with new settings
    await runEngine(settings)
    setPanelOpen(false)
  }, [settings, runEngine])

  // ─────────────────────────────────────────────────────────────────────────
  // Reset — restore all defaults
  // ─────────────────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    try {
      localStorage.removeItem("yuktai-a11y-prefs")
    } catch {
      // ignore
    }

    // Remove all DOM attributes applied by engine
    const root = document.documentElement
    const attrs = [
      "data-yuktai-high-contrast",
      "data-yuktai-dark",
      "data-yuktai-reduce-motion",
      "data-yuktai-large-targets",
      "data-yuktai-keyboard",
      "data-yuktai-dyslexia",
    ]
    attrs.forEach(attr => root.removeAttribute(attr))
    document.body.style.filter     = ""
    document.body.style.fontFamily = ""
    document.documentElement.style.fontSize = ""

    setReport(null)
    setIsActive(false)
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // Update a single setting
  // ─────────────────────────────────────────────────────────────────────────
  const handleSet = useCallback(<K extends keyof WidgetSettings>(
    key: K,
    val: WidgetSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: val }))
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // Keyboard — Escape closes panel
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && panelOpen) {
        setPanelOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [panelOpen])

  // ─────────────────────────────────────────────────────────────────────────
  // Focus trap — when panel opens, keep focus inside
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (panelOpen && panelRef.current) {
      wcagPlugin.trapFocus(panelRef.current)
    }
  }, [panelOpen])

  // ─────────────────────────────────────────────────────────────────────────
  // FAB button position — left or right
  // ─────────────────────────────────────────────────────────────────────────
  const fabStyle: React.CSSProperties = {
    position:     "fixed",
    bottom:       "24px",
    [position]:   "24px",
    zIndex:       9998,
    width:        "52px",
    height:       "52px",
    borderRadius: "50%",
    background:   isActive ? "#0d9488" : "#1a73e8",
    color:        "#fff",
    border:       "none",
    cursor:       "pointer",
    fontSize:     "22px",
    display:      "flex",
    alignItems:   "center",
    justifyContent: "center",
    boxShadow:    "0 4px 16px rgba(0,0,0,0.25)",
    transition:   "transform 0.15s, background 0.2s",
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
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