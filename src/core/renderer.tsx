// ─────────────────────────────────────────────────────────────────────────────
// src/core/renderer.ts
// yuktai v4.0.0 — Yuktishaalaa AI Lab
//
// Universal accessibility engine — zero framework deps.
// WCAG 2.2 compliant. Responsive. Desktop + Mobile.
// Integrates with AI modules: rewriter, summarizer, translator, voice, labeller.
//
// ✅ WCAG 2.0 — 19 criteria
// ✅ WCAG 2.1 — 7 criteria
// ✅ WCAG 2.2 — focus appearance, target size, timeout
// ✅ Responsive — works on mobile, tablet, desktop
// ✅ SpeechSynthesis — browser built-in, zero install
// ✅ Visual alerts — for deaf users
// ✅ Keyboard navigation — no AT needed
// ✅ Skip links — multi-target, always visible mobile
// ✅ Persistent preferences — localStorage
// ✅ AI ready — connects to rewriter, summarizer, translator, voice, labeller
// ─────────────────────────────────────────────────────────────────────────────

// ── AI module imports — each handles its own Chrome Built-in AI API
import { rewritePage, restorePage, checkRewriterSupport }         from "./ai/rewriter"
import { summarizePage, removeSummaryBox, checkSummarizerSupport } from "./ai/summarizer"
import { translatePage, restoreOriginalText, SUPPORTED_LANGUAGES } from "./ai/translator"
import { startVoiceControl, stopVoiceControl, checkVoiceSupport }  from "./ai/voice"
import { applySmartLabels, removeSmartLabels, checkLabellerSupport } from "./ai/labeller"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ColorBlindMode =
  | "none" | "deuteranopia" | "protanopia" | "tritanopia" | "achromatopsia"

export type Severity  = "critical" | "serious" | "moderate" | "minor"
export type AlertType = "success"  | "error"   | "info"     | "warning"

export interface A11yConfig {
  enabled:              boolean
  highContrast?:        boolean
  darkMode?:            boolean
  reduceMotion?:        boolean
  autoFix?:             boolean
  fontSizeMultiplier?:  number
  colorBlindMode?:      ColorBlindMode
  keyboardHints?:       boolean
  speechEnabled?:       boolean
  showPreferencePanel?: boolean
  showAuditBadge?:      boolean
  showSkipLinks?:       boolean
  largeTargets?:        boolean
  timeoutWarning?:      number
  dyslexiaFont?:        boolean
  localFont?:           string

  // v4.0.0 AI feature flags
  plainEnglish?:        boolean
  summarisePage?:       boolean
  translateLanguage?:   string
  voiceControl?:        boolean
  smartLabels?:         boolean
}

export interface A11yFix {
  tag:      string
  fix:      string
  severity: Severity
  element:  string
}

export interface A11yReport {
  fixed:      number
  scanned:    number
  renderTime: number
  score:      number
  details:    A11yFix[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Module-level refs — zero ids, zero host-page collisions
// ─────────────────────────────────────────────────────────────────────────────
let _liveRegionNode:          HTMLElement      | null = null
let _colorBlindSvgNode:       SVGSVGElement    | null = null
let _preferencePanelNode:     HTMLElement      | null = null
let _skipBarNode:             HTMLElement      | null = null
let _auditBadgeNode:          HTMLElement      | null = null
let _visualAlertNode:         HTMLElement      | null = null
let _keyboardCheatsheetNode:  HTMLElement      | null = null
let _timeoutWarningNode:      HTMLElement      | null = null
let _timeoutTimer:            ReturnType<typeof setTimeout> | null = null
let _currentConfig:           A11yConfig       | null = null

const CB_FILTER_REFS: Record<string, string> = {
  deuteranopia: "yuktai-cb-d",
  protanopia:   "yuktai-cb-p",
  tritanopia:   "yuktai-cb-t",
}

// ─────────────────────────────────────────────────────────────────────────────
// Tag groups
// ─────────────────────────────────────────────────────────────────────────────
const HEADING_TAGS     = new Set(["h1","h2","h3","h4","h5","h6"])
const FORM_TAGS        = new Set(["input","select","textarea"])
const INTERACTIVE_TAGS = new Set(["button","a","input","select","textarea","details","summary"])
const MEDIA_TAGS       = new Set(["video","audio"])
const LIST_TAGS        = new Set(["ul","ol","dl"])
const INLINE_TAGS      = new Set([
  "span","strong","em","b","i","u","s","small","mark","del","ins",
  "sub","sup","abbr","cite","code","kbd","samp","var","time","q",
])
const LANDMARK_MAP: Record<string, string> = {
  nav: "navigation", header: "banner",
  footer: "contentinfo", main: "main", aside: "complementary",
}

// ─────────────────────────────────────────────────────────────────────────────
// Speech Synthesis — browser built-in, zero install
// ─────────────────────────────────────────────────────────────────────────────
function speak(text: string, priority: "polite" | "assertive" = "polite"): void {
  if (typeof window === "undefined") return
  if (!_currentConfig?.speechEnabled) return
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utt    = new SpeechSynthesisUtterance(text)
  utt.rate     = 1.0
  utt.pitch    = 1.0
  utt.volume   = 1.0
  const voices = window.speechSynthesis.getVoices()
  if (voices.length > 0) utt.voice = voices[0]
  window.speechSynthesis.speak(utt)
}

// ─────────────────────────────────────────────────────────────────────────────
// Visual Alert — sliding banner for deaf users, no audio dependency
// Responsive — anchored left+right on small screens
// ─────────────────────────────────────────────────────────────────────────────
function showVisualAlert(message: string, type: AlertType = "info"): void {
  if (typeof document === "undefined") return

  const colors = {
    success: { bg: "#0f9d58", border: "#0a7a44", icon: "✓" },
    error:   { bg: "#d93025", border: "#b52a1c", icon: "✕" },
    warning: { bg: "#f29900", border: "#c67c00", icon: "⚠" },
    info:    { bg: "#1a73e8", border: "#1557b0", icon: "ℹ" },
  }
  const c = colors[type]

  if (!_visualAlertNode) {
    _visualAlertNode = document.createElement("div")
    _visualAlertNode.setAttribute("role", "alert")
    _visualAlertNode.setAttribute("aria-live", "assertive")
    _visualAlertNode.setAttribute("aria-atomic", "true")
    _visualAlertNode.style.cssText = `
      position: fixed;
      top: 80px;
      right: 16px;
      left: auto;
      z-index: 999999;
      max-width: 320px;
      width: calc(100% - 32px);
      border-radius: 8px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: system-ui, sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: transform 0.3s, opacity 0.3s;
      transform: translateX(120%);
      opacity: 0;
    `
    document.body.appendChild(_visualAlertNode)
  }

  _visualAlertNode.style.background = c.bg
  _visualAlertNode.style.border     = `1px solid ${c.border}`
  _visualAlertNode.style.color      = "#fff"
  _visualAlertNode.innerHTML = `
    <span style="font-size:18px;font-weight:700">${c.icon}</span>
    <span style="flex:1;line-height:1.4">${message}</span>
    <button
      onclick="this.parentElement.style.transform='translateX(120%)';this.parentElement.style.opacity='0'"
      style="background:none;border:none;color:#fff;cursor:pointer;font-size:18px;padding:0;line-height:1"
      aria-label="Close notification">×</button>
  `

  // Responsive — full width on small screens
  if (window.innerWidth <= 480) {
    _visualAlertNode.style.right  = "8px"
    _visualAlertNode.style.left   = "8px"
    _visualAlertNode.style.maxWidth = "none"
    _visualAlertNode.style.width  = "auto"
  }

  requestAnimationFrame(() => {
    if (_visualAlertNode) {
      _visualAlertNode.style.transform = "translateX(0)"
      _visualAlertNode.style.opacity   = "1"
    }
  })

  setTimeout(() => {
    if (_visualAlertNode) {
      _visualAlertNode.style.transform = "translateX(120%)"
      _visualAlertNode.style.opacity   = "0"
    }
  }, 5000)
}

// ─────────────────────────────────────────────────────────────────────────────
// Announce — aria-live + speech + visual combined
// ─────────────────────────────────────────────────────────────────────────────
function announce(message: string, type: AlertType = "info", useSpeech = true): void {
  if (_liveRegionNode) _liveRegionNode.textContent = message
  showVisualAlert(message, type)
  if (useSpeech) speak(message, type === "error" ? "assertive" : "polite")
}

// ─────────────────────────────────────────────────────────────────────────────
// Skip Links — multi-target, always visible on mobile
// ─────────────────────────────────────────────────────────────────────────────
function injectSkipLinks(): void {
  if (typeof document === "undefined") return
  if (_skipBarNode) return

  const targets = [
    { label: "Skip to main content", selector: "main,[role='main'],#main,#main-content" },
    { label: "Skip to navigation",   selector: "nav,[role='navigation'],#nav,#navigation" },
    { label: "Skip to search",       selector: "[role='search'],#search,input[type='search']" },
  ]

  const bar = document.createElement("div")
  bar.setAttribute("data-yuktai-skip-bar", "true")
  bar.setAttribute("role", "navigation")
  bar.setAttribute("aria-label", "Skip links")
  bar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999999;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 4px;
    background: #111;
    transform: translateY(-100%);
    transition: transform 0.2s ease;
    font-family: system-ui, sans-serif;
  `

  let hasAnyTarget = false

  targets.forEach(({ label, selector }) => {
    const target = document.querySelector(selector) as HTMLElement | null
    if (!target) return
    hasAnyTarget = true

    if (!target.getAttribute("tabindex")) {
      target.setAttribute("tabindex", "-1")
    }

    const link = document.createElement("a")
    link.href         = "#"
    link.textContent  = label
    link.style.cssText = `
      color: #fff;
      background: #1a73e8;
      padding: 8px 14px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      white-space: nowrap;
      border: 2px solid transparent;
      transition: background 0.15s, border-color 0.15s;
    `

    link.addEventListener("focus", () => {
      bar.style.transform = "translateY(0)"
    })

    link.addEventListener("blur", () => {
      setTimeout(() => {
        if (!bar.matches(":focus-within")) {
          bar.style.transform = "translateY(-100%)"
        }
      }, 2000)
    })

    link.addEventListener("click", (e: MouseEvent) => {
      e.preventDefault()
      target.focus()
      target.scrollIntoView({ behavior: "smooth", block: "start" })
      announce(`Jumped to ${label.replace("Skip to ", "")}`, "info")
      bar.style.transform = "translateY(-100%)"
    })

    bar.appendChild(link)
  })

  if (!hasAnyTarget) return

  // Always visible on mobile
  const isMobile = window.innerWidth < 768
  if (isMobile) {
    bar.style.transform = "translateY(0)"
    bar.style.position  = "sticky"
  }

  // Keep responsive on resize
  window.addEventListener("resize", () => {
    if (window.innerWidth < 768) {
      bar.style.transform = "translateY(0)"
    }
  })

  document.body.insertBefore(bar, document.body.firstChild)
  _skipBarNode = bar
}

// ─────────────────────────────────────────────────────────────────────────────
// Focus + Responsive Styles
// All responsive breakpoints handled here
// ─────────────────────────────────────────────────────────────────────────────
function injectFocusStyles(): void {
  if (typeof document === "undefined") return
  if (document.querySelector("[data-yuktai-focus-style]")) return

  const style       = document.createElement("style")
  style.setAttribute("data-yuktai-focus-style", "true")
  style.textContent = `

    /* ── Focus indicator — WCAG 2.4.11 minimum 2px solid ── */
    [data-yuktai-a11y] *:focus-visible {
      outline: 3px solid #1a73e8 !important;
      outline-offset: 3px !important;
      border-radius: 2px !important;
      box-shadow: 0 0 0 6px rgba(26,115,232,0.15) !important;
    }

    /* ── High contrast focus ── */
    [data-yuktai-high-contrast] *:focus-visible {
      outline: 3px solid #ffff00 !important;
      outline-offset: 3px !important;
      box-shadow: 0 0 0 6px rgba(255,255,0,0.2) !important;
    }

    /* ── Keyboard hint mode ── */
    [data-yuktai-keyboard] *:focus {
      outline: 3px solid #ff6b35 !important;
      outline-offset: 3px !important;
    }

    /* ── Remove default outline — replaced above ── */
    [data-yuktai-a11y] *:focus:not(:focus-visible) {
      outline: none !important;
    }

    /* ── Large targets — WCAG 2.5.8 ── */
    [data-yuktai-large-targets] button,
    [data-yuktai-large-targets] a,
    [data-yuktai-large-targets] input,
    [data-yuktai-large-targets] select,
    [data-yuktai-large-targets] [role="button"] {
      min-height: 44px !important;
      min-width: 44px !important;
    }

    /* ── Reduce motion — WCAG 2.3.3 ── */
    [data-yuktai-reduce-motion] *,
    [data-yuktai-reduce-motion] *::before,
    [data-yuktai-reduce-motion] *::after {
      animation-duration: 0.001ms !important;
      transition-duration: 0.001ms !important;
    }

    /* ── High contrast mode ── */
    [data-yuktai-high-contrast] {
      filter: contrast(1.4) brightness(1.05) !important;
    }

    /* ── Dark mode ── */
    [data-yuktai-dark] {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    [data-yuktai-dark] img,
    [data-yuktai-dark] video,
    [data-yuktai-dark] canvas {
      filter: invert(1) hue-rotate(180deg) !important;
    }

    /* ── Dyslexia font ── */
    [data-yuktai-dyslexia] * {
      font-family: "Atkinson Hyperlegible", "Arial", sans-serif !important;
      letter-spacing: 0.05em !important;
      word-spacing: 0.1em !important;
      line-height: 1.8 !important;
    }

    /* ── Link underline enforcement ── */
    [data-yuktai-a11y] a:not([role]):not([class]) {
      text-decoration: underline !important;
    }

    /* ─────────────────────────────────────────────
       RESPONSIVE BREAKPOINTS
    ───────────────────────────────────────────── */

    /* Skip link bar — wrap on small screens */
    @media (max-width: 768px) {
      [data-yuktai-skip-bar] {
        flex-wrap: wrap;
      }
      [data-yuktai-skip-bar] a {
        font-size: 12px !important;
        padding: 6px 10px !important;
      }
    }

    /* Preference panel — bottom sheet on mobile */
    @media (max-width: 480px) {
      [data-yuktai-panel] {
        width: 100% !important;
        right: 0 !important;
        left: 0 !important;
        bottom: 0 !important;
        border-radius: 16px 16px 0 0 !important;
        max-height: 85vh !important;
      }
    }

    /* FAB button — reposition on mobile */
    @media (max-width: 480px) {
      [data-yuktai-pref-toggle] {
        bottom: 12px !important;
        right: 12px !important;
        width: 44px !important;
        height: 44px !important;
      }
    }

    /* Audit badge — reposition on mobile */
    @media (max-width: 480px) {
      [data-yuktai-badge] {
        bottom: 12px !important;
        left: 12px !important;
        font-size: 11px !important;
        padding: 4px 10px !important;
      }
    }

    /* Keyboard cheatsheet — full width on mobile */
    @media (max-width: 480px) {
      [data-yuktai-cheatsheet] {
        width: calc(100vw - 32px) !important;
        max-height: 80vh !important;
        overflow-y: auto !important;
      }
    }

    /* Timeout warning — full width on mobile */
    @media (max-width: 480px) {
      [data-yuktai-timeout] {
        width: calc(100vw - 32px) !important;
      }
    }

    /* Visual alert — full width on mobile */
    @media (max-width: 480px) {
      [data-yuktai-alert] {
        right: 8px !important;
        left: 8px !important;
        max-width: none !important;
        width: auto !important;
      }
    }
  `
  document.head.appendChild(style)
  document.documentElement.setAttribute("data-yuktai-a11y", "true")
}

// ─────────────────────────────────────────────────────────────────────────────
// Keyboard Navigator — arrow keys, escape, no AT needed
// ─────────────────────────────────────────────────────────────────────────────
function initKeyboardNavigator(): void {
  if (typeof document === "undefined") return
  if (document.querySelector("[data-yuktai-kb-init]")) return

  document.documentElement.setAttribute("data-yuktai-kb-init", "true")

  document.addEventListener("keydown", (e: KeyboardEvent) => {
    const target = document.activeElement as HTMLElement
    if (!target) return

    const role = target.getAttribute("role") || ""

    // ── Escape — close modals and menus ──
    if (e.key === "Escape") {
      const modal = target.closest("[role='dialog'],[role='alertdialog']") as HTMLElement
      if (modal) {
        modal.style.display = "none"
        announce("Dialog closed", "info")
        return
      }
      const menu = target.closest("[role='menu'],[role='menubar']") as HTMLElement
      if (menu) {
        menu.style.display = "none"
        announce("Menu closed", "info")
      }
    }

    // ── Arrow keys in menus ──
    if (role === "menuitem" || target.closest("[role='menu'],[role='menubar']")) {
      const menu  = target.closest("[role='menu'],[role='menubar']") as HTMLElement
      if (!menu) return
      const items = Array.from(
        menu.querySelectorAll("[role='menuitem']:not([disabled])")
      ) as HTMLElement[]
      const idx = items.indexOf(target)

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault()
        items[(idx + 1) % items.length]?.focus()
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault()
        items[(idx - 1 + items.length) % items.length]?.focus()
      } else if (e.key === "Home") {
        e.preventDefault()
        items[0]?.focus()
      } else if (e.key === "End") {
        e.preventDefault()
        items[items.length - 1]?.focus()
      }
    }

    // ── Arrow keys in tabs ──
    if (role === "tab" || target.closest("[role='tablist']")) {
      const tablist = target.closest("[role='tablist']") as HTMLElement
      if (!tablist) return
      const tabs = Array.from(
        tablist.querySelectorAll("[role='tab']:not([disabled])")
      ) as HTMLElement[]
      const idx = tabs.indexOf(target)

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault()
        const next = tabs[(idx + 1) % tabs.length]
        next?.focus(); next?.click()
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        const prev = tabs[(idx - 1 + tabs.length) % tabs.length]
        prev?.focus(); prev?.click()
      }
    }

    // ── Arrow keys in listbox ──
    if (role === "option" || target.closest("[role='listbox']")) {
      const listbox = target.closest("[role='listbox']") as HTMLElement
      if (!listbox) return
      const options = Array.from(
        listbox.querySelectorAll("[role='option']:not([aria-disabled='true'])")
      ) as HTMLElement[]
      const idx = options.indexOf(target)

      if (e.key === "ArrowDown") {
        e.preventDefault()
        options[(idx + 1) % options.length]?.focus()
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        options[(idx - 1 + options.length) % options.length]?.focus()
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        target.setAttribute("aria-selected", "true")
        options.forEach(o => {
          if (o !== target) o.setAttribute("aria-selected", "false")
        })
        announce(`Selected: ${target.textContent?.trim()}`, "success")
      }
    }

    // ── Alt + A — keyboard cheatsheet ──
    if (e.altKey && e.key === "a") {
      e.preventDefault()
      toggleKeyboardCheatsheet()
    }

    // ── Speak focused element on Tab ──
    if (e.key === "Tab" && _currentConfig?.speechEnabled) {
      setTimeout(() => {
        const focused = document.activeElement as HTMLElement
        if (!focused) return
        const label =
          focused.getAttribute("aria-label") ||
          focused.getAttribute("title") ||
          focused.textContent?.trim() ||
          focused.tagName.toLowerCase()
        const roleLabel = focused.getAttribute("role") || focused.tagName.toLowerCase()
        speak(`${label}, ${roleLabel}`)
      }, 100)
    }
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Focus Trap — keeps Tab inside open modals
// ─────────────────────────────────────────────────────────────────────────────
function trapFocus(modal: HTMLElement): void {
  const focusable = modal.querySelectorAll(
    'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),' +
    'textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[role="button"]'
  ) as NodeListOf<HTMLElement>

  if (focusable.length === 0) return

  const first = focusable[0]
  const last  = focusable[focusable.length - 1]
  first.focus()

  modal.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key !== "Tab") return
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus() }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus() }
    }
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Keyboard Cheatsheet — Alt+A
// Responsive — full width on mobile
// ─────────────────────────────────────────────────────────────────────────────
function toggleKeyboardCheatsheet(): void {
  if (typeof document === "undefined") return

  if (_keyboardCheatsheetNode) {
    _keyboardCheatsheetNode.remove()
    _keyboardCheatsheetNode = null
    return
  }

  const panel = document.createElement("div")
  panel.setAttribute("role", "dialog")
  panel.setAttribute("aria-label", "Keyboard shortcuts")
  panel.setAttribute("aria-modal", "true")
  panel.setAttribute("data-yuktai-cheatsheet", "true")
  panel.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999999;
    background: #1a1a2e;
    color: #fff;
    border-radius: 12px;
    padding: 24px;
    width: min(320px, calc(100vw - 32px));
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    font-family: system-ui, sans-serif;
  `

  const shortcuts = [
    ["Alt + A",    "Open/close this menu"],
    ["Tab",        "Next focusable element"],
    ["Shift+Tab",  "Previous focusable element"],
    ["Enter",      "Activate button or link"],
    ["Space",      "Check checkbox / scroll"],
    ["Arrow keys", "Navigate lists and menus"],
    ["Escape",     "Close dialog or menu"],
    ["Home",       "First item in list"],
    ["End",        "Last item in list"],
  ]

  panel.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <h2 style="margin:0;font-size:16px;font-weight:700;color:#74c0fc">
        ⌨ Keyboard shortcuts
      </h2>
      <button data-yuktai-close
        style="background:none;border:none;color:#aaa;cursor:pointer;font-size:20px;padding:0;line-height:1"
        aria-label="Close shortcuts">×</button>
    </div>
    ${shortcuts.map(([key, desc]) => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #2a2a4a">
        <kbd style="background:#2a2a4a;color:#74c0fc;padding:3px 8px;border-radius:4px;font-size:12px;font-family:monospace;border:1px solid #3a3a6a">${key}</kbd>
        <span style="font-size:12px;color:#ccc;text-align:right;flex:1;margin-left:12px">${desc}</span>
      </div>
    `).join("")}
  `

  const closeBtn = panel.querySelector("[data-yuktai-close]") as HTMLElement
  closeBtn?.addEventListener("click", () => {
    panel.remove()
    _keyboardCheatsheetNode = null
  })

  panel.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      panel.remove()
      _keyboardCheatsheetNode = null
    }
  })

  document.body.appendChild(panel)
  _keyboardCheatsheetNode = panel
  trapFocus(panel)
  announce("Keyboard shortcuts opened. Press Escape to close.", "info")
}

// ─────────────────────────────────────────────────────────────────────────────
// Audit Score Badge — dev only, localhost
// Responsive — repositioned on small screens
// ─────────────────────────────────────────────────────────────────────────────
function injectAuditBadge(report: A11yReport): void {
  if (typeof document === "undefined") return
  if (!_currentConfig?.showAuditBadge) return

  if (
    typeof window !== "undefined" &&
    !window.location.hostname.includes("localhost") &&
    !window.location.hostname.includes("127.0.0.1")
  ) return

  if (_auditBadgeNode) _auditBadgeNode.remove()

  const score = report.score
  const color = score >= 90 ? "#0f9d58" : score >= 70 ? "#f29900" : "#d93025"
  const emoji = score >= 90 ? "♿" : score >= 70 ? "⚠" : "✕"

  const badge = document.createElement("button")
  badge.setAttribute("aria-label", `Accessibility score: ${score} out of 100`)
  badge.setAttribute("data-yuktai-badge", "true")
  badge.style.cssText = `
    position: fixed;
    bottom: 16px;
    left: 16px;
    z-index: 999998;
    background: ${color};
    color: #fff;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 700;
    font-family: system-ui, sans-serif;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    gap: 6px;
    transition: transform 0.15s;
  `
  badge.innerHTML = `${emoji} ${score}/100 <span style="font-weight:400;opacity:0.85">${report.details.length} issues</span>`
  badge.addEventListener("click", () => showAuditDetails(report))

  document.body.appendChild(badge)
  _auditBadgeNode = badge
}

function showAuditDetails(report: A11yReport): void {
  const existing = document.querySelector("[data-yuktai-audit-details]")
  if (existing) { existing.remove(); return }

  const panel = document.createElement("div")
  panel.setAttribute("data-yuktai-audit-details", "true")
  panel.setAttribute("role", "dialog")
  panel.setAttribute("aria-label", "Accessibility audit details")
  panel.style.cssText = `
    position: fixed;
    bottom: 56px;
    left: 16px;
    right: 16px;
    z-index: 999999;
    background: #1a1a2e;
    color: #fff;
    border-radius: 12px;
    padding: 16px;
    width: auto;
    max-width: 340px;
    max-height: 60vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    font-family: system-ui, sans-serif;
    font-size: 12px;
  `

  const sevColor = {
    critical: "#d93025", serious: "#f29900",
    moderate: "#1a73e8", minor:    "#0f9d58",
  }

  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <strong style="font-size:14px;color:#74c0fc">Audit report</strong>
      <span style="color:#aaa">${report.fixed} fixed · ${report.renderTime}ms</span>
    </div>
    ${report.details.slice(0, 20).map(d => `
      <div style="padding:6px 0;border-bottom:1px solid #2a2a4a">
        <div style="display:flex;gap:6px;align-items:center">
          <span style="background:${sevColor[d.severity]};color:#fff;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:700;text-transform:uppercase">${d.severity}</span>
          <code style="color:#74c0fc">&lt;${d.tag}&gt;</code>
        </div>
        <div style="color:#ccc;margin-top:3px">${d.fix}</div>
      </div>
    `).join("")}
    ${report.details.length > 20
      ? `<div style="color:#888;padding:8px 0;text-align:center">+${report.details.length - 20} more issues</div>`
      : ""}
  `

  panel.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") panel.remove()
  })

  document.body.appendChild(panel)
  trapFocus(panel)
}

// ─────────────────────────────────────────────────────────────────────────────
// Timeout Warning — WCAG 2.2.1 motor users
// Responsive — full width on mobile
// ─────────────────────────────────────────────────────────────────────────────
function startTimeoutWarning(seconds: number): void {
  if (typeof document === "undefined") return
  if (_timeoutTimer) clearTimeout(_timeoutTimer)

  _timeoutTimer = setTimeout(() => {
    if (_timeoutWarningNode) return

    const warning = document.createElement("div")
    warning.setAttribute("role", "alertdialog")
    warning.setAttribute("aria-label", "Session timeout warning")
    warning.setAttribute("aria-modal", "true")
    warning.setAttribute("data-yuktai-timeout", "true")
    warning.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 999999;
      background: #fff;
      color: #111;
      border-radius: 12px;
      padding: 24px;
      width: min(320px, calc(100vw - 32px));
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
      font-family: system-ui, sans-serif;
      border: 2px solid #d93025;
    `
    warning.innerHTML = `
      <h2 style="margin:0 0 8px;font-size:18px;color:#d93025">⏱ Session timeout</h2>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.5;color:#444">
        Your session will expire soon. Do you need more time?
      </p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button data-yuktai-extend
          style="flex:1;min-width:120px;padding:10px;background:#1a73e8;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600">
          Yes, more time
        </button>
        <button data-yuktai-dismiss
          style="flex:1;min-width:120px;padding:10px;background:#f1f3f4;color:#111;border:none;border-radius:8px;cursor:pointer;font-size:14px">
          No, sign out
        </button>
      </div>
    `

    const extend  = warning.querySelector("[data-yuktai-extend]")  as HTMLElement
    const dismiss = warning.querySelector("[data-yuktai-dismiss]") as HTMLElement

    extend?.addEventListener("click", () => {
      warning.remove()
      _timeoutWarningNode = null
      announce("Session extended. You have more time.", "success")
      if (_currentConfig?.timeoutWarning) {
        startTimeoutWarning(_currentConfig.timeoutWarning)
      }
    })

    dismiss?.addEventListener("click", () => {
      warning.remove()
      _timeoutWarningNode = null
    })

    document.body.appendChild(warning)
    _timeoutWarningNode = warning
    trapFocus(warning)
    announce("Warning: Your session will expire soon. Do you need more time?", "warning")
  }, seconds * 1000)
}

// ─────────────────────────────────────────────────────────────────────────────
// Apply Config to DOM — toggles data attributes on <html>
// ─────────────────────────────────────────────────────────────────────────────
function applyConfigToDOM(config: A11yConfig): void {
  if (typeof document === "undefined") return
  const root = document.documentElement

  root.toggleAttribute("data-yuktai-high-contrast", !!config.highContrast)
  root.toggleAttribute("data-yuktai-dark",          !!config.darkMode)
  root.toggleAttribute("data-yuktai-reduce-motion", !!config.reduceMotion)
  root.toggleAttribute("data-yuktai-large-targets", !!config.largeTargets)
  root.toggleAttribute("data-yuktai-keyboard",      !!config.keyboardHints)
  root.toggleAttribute("data-yuktai-dyslexia",      !!config.dyslexiaFont)

  // Local font
  if (config.localFont) {
    document.body.style.fontFamily = `"${config.localFont}", system-ui, sans-serif`
  } else if (!config.dyslexiaFont) {
    document.body.style.fontFamily = ""
  }

  // Font scale
  if (config.fontSizeMultiplier && config.fontSizeMultiplier !== 1) {
    document.documentElement.style.fontSize = `${config.fontSizeMultiplier * 100}%`
  } else {
    document.documentElement.style.fontSize = ""
  }

  // Colour blind filter
  if (config.colorBlindMode && config.colorBlindMode !== "none") {
    const filterValue = config.colorBlindMode === "achromatopsia"
      ? "grayscale(100%)"
      : `url(#${CB_FILTER_REFS[config.colorBlindMode]})`
    document.body.style.filter = filterValue
  } else {
    document.body.style.filter = ""
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Save + Load Preferences — localStorage
// ─────────────────────────────────────────────────────────────────────────────
function savePreferences(config: A11yConfig): void {
  try {
    const toSave = {
      highContrast:      config.highContrast,
      darkMode:          config.darkMode,
      reduceMotion:      config.reduceMotion,
      largeTargets:      config.largeTargets,
      speechEnabled:     config.speechEnabled,
      colorBlindMode:    config.colorBlindMode,
      dyslexiaFont:      config.dyslexiaFont,
      localFont:         config.localFont,
      fontSizeMultiplier: config.fontSizeMultiplier,
      plainEnglish:      config.plainEnglish,
      summarisePage:     config.summarisePage,
      translateLanguage: config.translateLanguage,
      voiceControl:      config.voiceControl,
      smartLabels:       config.smartLabels,
    }
    localStorage.setItem("yuktai-a11y-prefs", JSON.stringify(toSave))
  } catch { /* ignore */ }
}

function loadPreferences(config: A11yConfig): void {
  try {
    const saved = localStorage.getItem("yuktai-a11y-prefs")
    if (saved) Object.assign(config, JSON.parse(saved))
  } catch { /* ignore */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// AI Feature Handlers — called from WidgetPanel toggles
// Each function checks support before running
// ─────────────────────────────────────────────────────────────────────────────
async function handlePlainEnglish(enabled: boolean): Promise<void> {
  if (enabled) {
    const supported = await checkRewriterSupport()
    if (!supported) {
      announce("Plain English requires Chrome 127+", "warning")
      return
    }
    announce("Rewriting page in plain English...", "info", false)
    const result = await rewritePage()
    announce(
      result.error
        ? `Plain English failed: ${result.error}`
        : `${result.fixed} sections rewritten in plain English`,
      result.error ? "error" : "success",
      false
    )
  } else {
    restorePage()
    announce("Original text restored", "info", false)
  }
}

async function handleSummarisePage(enabled: boolean): Promise<void> {
  if (enabled) {
    const supported = await checkSummarizerSupport()
    if (!supported) {
      announce("Page summariser requires Chrome 127+", "warning")
      return
    }
    announce("Generating page summary...", "info", false)
    const result = await summarizePage()
    announce(
      result.error ? `Summary failed: ${result.error}` : "Page summary added at top",
      result.error ? "error" : "success",
      false
    )
  } else {
    removeSummaryBox()
    announce("Page summary removed", "info", false)
  }
}

async function handleTranslate(language: string): Promise<void> {
  if (language === "en") {
    restoreOriginalText()
    announce("Page restored to English", "info", false)
    return
  }
  announce(`Translating page to ${language}...`, "info", false)
  const result = await translatePage(language)
  announce(
    result.error
      ? `Translation failed: ${result.error}`
      : `Page translated to ${language}`,
    result.error ? "error" : "success",
    false
  )
}

async function handleVoiceControl(enabled: boolean): Promise<void> {
  if (enabled) {
    if (!checkVoiceSupport()) {
      announce("Voice control not supported in this browser", "warning")
      return
    }
    startVoiceControl((result) => {
      if (result.success) announce(`Voice: ${result.action}`, "info", false)
    })
    announce("Voice control started. Say a command.", "success", false)
  } else {
    stopVoiceControl()
    announce("Voice control stopped", "info", false)
  }
}

async function handleSmartLabels(enabled: boolean): Promise<void> {
  if (enabled) {
    const supported = await checkLabellerSupport()
    if (!supported) {
      announce("Smart labels requires Chrome 127+", "warning")
      return
    }
    announce("Generating smart labels...", "info", false)
    const result = await applySmartLabels()
    announce(
      result.error
        ? `Smart labels failed: ${result.error}`
        : `${result.fixed} elements labelled`,
      result.error ? "error" : "success",
      false
    )
  } else {
    removeSmartLabels()
    announce("Smart labels removed", "info", false)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Live Region
// ─────────────────────────────────────────────────────────────────────────────
function ensureLiveRegion(): void {
  if (typeof document === "undefined" || _liveRegionNode) return
  const node = document.createElement("div")
  node.setAttribute("aria-live", "polite")
  node.setAttribute("aria-atomic", "true")
  node.setAttribute("aria-relevant", "text")
  node.style.cssText =
    "position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);"
  document.body.appendChild(node)
  _liveRegionNode = node
}

// ─────────────────────────────────────────────────────────────────────────────
// Color Blind SVG Filters
// ─────────────────────────────────────────────────────────────────────────────
function ensureColorBlindFilters(): void {
  if (typeof document === "undefined" || _colorBlindSvgNode) return
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.setAttribute("aria-hidden", "true")
  svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;"
  svg.innerHTML = `
    <defs>
      <filter id="${CB_FILTER_REFS.deuteranopia}">
        <feColorMatrix type="matrix"
          values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${CB_FILTER_REFS.protanopia}">
        <feColorMatrix type="matrix"
          values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${CB_FILTER_REFS.tritanopia}">
        <feColorMatrix type="matrix"
          values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"/>
      </filter>
    </defs>
  `
  document.body.appendChild(svg)
  _colorBlindSvgNode = svg
}

// ─────────────────────────────────────────────────────────────────────────────
// Score Calculator
// ─────────────────────────────────────────────────────────────────────────────
function calculateScore(report: A11yReport): number {
  const weights = { critical: 20, serious: 10, moderate: 5, minor: 2 }
  const deduction = report.details.reduce(
    (acc, d) => acc + (weights[d.severity] || 0), 0
  )
  return Math.max(0, Math.min(100, 100 - deduction))
}

// ─────────────────────────────────────────────────────────────────────────────
// wcagPlugin — main export
// All existing functionality preserved + AI handlers added
// ─────────────────────────────────────────────────────────────────────────────
export const wcagPlugin = {
  name:     "yuktai-a11y",
  version:  "4.0.0",
  observer: null as MutationObserver | null,

  async execute(config: A11yConfig): Promise<string> {
    if (!config.enabled) {
      this.stopObserver()
      return "yuktai: disabled."
    }

    _currentConfig = config

    // Load saved preferences first
    loadPreferences(config)

    // Infrastructure
    ensureLiveRegion()
    ensureColorBlindFilters()
    injectFocusStyles()
    initKeyboardNavigator()

    if (config.showSkipLinks !== false)      injectSkipLinks()
    if (config.showPreferencePanel !== false) {
      // WidgetPanel.tsx handles the panel UI in v4.0.0
      // renderer only handles infrastructure here
    }

    applyConfigToDOM(config)

    // Run WCAG fixes
    const report  = this.applyFixes(config)
    report.score  = calculateScore(report)

    if (config.showAuditBadge) injectAuditBadge(report)
    if (config.timeoutWarning) startTimeoutWarning(config.timeoutWarning)
    if (config.autoFix)        this.startObserver(config)

    // Run AI features if enabled
    if (config.plainEnglish)                           await handlePlainEnglish(true)
    if (config.summarisePage)                          await handleSummarisePage(true)
    if (config.translateLanguage && config.translateLanguage !== "en") await handleTranslate(config.translateLanguage)
    if (config.voiceControl)                           await handleVoiceControl(true)
    if (config.smartLabels)                            await handleSmartLabels(true)

    const msg = `${report.fixed} fixes applied. Score: ${report.score}/100.`
    announce(msg, report.score >= 90 ? "success" : "info", false)

    return `yuktai v4.0.0: ${msg} Scanned ${report.scanned} elements in ${report.renderTime}ms.`
  },

  applyFixes(config: A11yConfig): A11yReport {
    const report: A11yReport = {
      fixed: 0, scanned: 0, renderTime: 0, score: 100, details: [],
    }
    if (typeof document === "undefined") return report

    const start    = performance.now()
    const elements = document.querySelectorAll("*")
    report.scanned = elements.length

    const push = (tag: string, fix: string, severity: Severity, el: HTMLElement) => {
      report.details.push({ tag, fix, severity, element: el.outerHTML.slice(0, 100) })
      report.fixed++
    }

    elements.forEach((el) => {
      const h   = el as HTMLElement
      const tag = h.tagName.toLowerCase()

      // ── Document level ──
      if (tag === "html" && !h.getAttribute("lang")) {
        h.setAttribute("lang", "en")
        push(tag, 'lang="en" added', "critical", h)
      }

      if (tag === "meta") {
        const name    = h.getAttribute("name")
        const content = h.getAttribute("content") || ""
        if (name === "viewport" && content.includes("user-scalable=no")) {
          h.setAttribute("content", content.replace("user-scalable=no", "user-scalable=yes"))
          push(tag, "user-scalable=yes restored", "serious", h)
        }
        if (name === "viewport" && /maximum-scale=1(?:[^0-9]|$)/.test(content)) {
          h.setAttribute("content", content.replace(/maximum-scale=1(?=[^0-9]|$)/, "maximum-scale=5"))
          push(tag, "maximum-scale=5 restored", "serious", h)
        }
      }

      if (tag === "main" && !h.getAttribute("tabindex")) {
        h.setAttribute("tabindex", "-1")
        if (!h.getAttribute("id")) h.setAttribute("id", "main-content")
      }

      // ── Images ──
      if (tag === "img") {
        if (!h.hasAttribute("alt")) {
          h.setAttribute("alt", "")
          h.setAttribute("aria-hidden", "true")
          push(tag, 'alt="" aria-hidden="true"', "serious", h)
        }
      }

      if (tag === "svg") {
        if (!h.getAttribute("aria-hidden") && !h.getAttribute("aria-label") && !el.querySelector("title")) {
          h.setAttribute("aria-hidden", "true")
          push(tag, 'aria-hidden="true" (decorative svg)', "minor", h)
        }
        if (!h.getAttribute("focusable")) h.setAttribute("focusable", "false")
      }

      if (tag === "iframe") {
        if (!h.getAttribute("title") && !h.getAttribute("aria-label")) {
          h.setAttribute("title", "embedded content")
          h.setAttribute("aria-label", "embedded content")
          push(tag, 'title + aria-label added', "serious", h)
        }
      }

      // ── Interactive ──
      if (tag === "button") {
        if (!h.innerText?.trim() && !h.getAttribute("aria-label")) {
          const label = h.getAttribute("title") || "button"
          h.setAttribute("aria-label", label)
          push(tag, `aria-label="${label}" (empty button)`, "critical", h)
        }
        if (h.hasAttribute("disabled") && !h.getAttribute("aria-disabled")) {
          h.setAttribute("aria-disabled", "true")
          report.fixed++
        }
      }

      if (tag === "a") {
        const anchor = h as HTMLAnchorElement
        if (!h.innerText?.trim() && !h.getAttribute("aria-label")) {
          h.setAttribute("aria-label", h.getAttribute("title") || "link")
          push(tag, "aria-label added (empty link)", "critical", h)
        }
        if (anchor.target === "_blank" && !anchor.rel?.includes("noopener")) {
          anchor.rel = "noopener noreferrer"
          report.fixed++
        }
      }

      // ── Forms ──
      if (FORM_TAGS.has(tag)) {
        const input = h as HTMLInputElement
        if (!h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
          const label = h.getAttribute("placeholder") || h.getAttribute("name") || tag
          h.setAttribute("aria-label", label)
          push(tag, `aria-label="${label}"`, "serious", h)
        }
        if (h.hasAttribute("required") && !h.getAttribute("aria-required")) {
          h.setAttribute("aria-required", "true")
          report.fixed++
        }

        // Autocomplete
        if (tag === "input" && !input.autocomplete) {
          const n = input.name || ""
          if (input.type === "email" || n.includes("email"))
            input.autocomplete = "email"
          else if (input.type === "tel" || n.includes("tel"))
            input.autocomplete = "tel"
          else if (input.type === "password")
            input.autocomplete = "current-password"
          report.fixed++
        }
      }

      // ── Tables ──
      if (tag === "th" && !h.getAttribute("scope")) {
        h.setAttribute("scope", h.closest("thead") ? "col" : "row")
        push(tag, "scope added to <th>", "moderate", h)
      }

      // ── Landmarks ──
      if (LANDMARK_MAP[tag] && !h.getAttribute("role")) {
        h.setAttribute("role", LANDMARK_MAP[tag])
        push(tag, `role="${LANDMARK_MAP[tag]}"`, "minor", h)
      }

      // ── ARIA widgets ──
      const role = h.getAttribute("role") || ""

      if (role === "tab" && !h.getAttribute("aria-selected")) {
        h.setAttribute("aria-selected", "false")
        report.fixed++
      }

      if (["alert","status","log"].includes(role) && !h.getAttribute("aria-live")) {
        h.setAttribute("aria-live", role === "alert" ? "assertive" : "polite")
        push(tag, `aria-live added on role=${role}`, "moderate", h)
      }

      if (role === "combobox" && !h.getAttribute("aria-expanded")) {
        h.setAttribute("aria-expanded", "false")
        push(tag, 'aria-expanded="false" on combobox', "serious", h)
      }

      if ((role === "checkbox" || role === "radio") && !h.getAttribute("aria-checked")) {
        h.setAttribute("aria-checked", "false")
        push(tag, `aria-checked="false" on role=${role}`, "serious", h)
      }
    })

    report.renderTime = parseFloat((performance.now() - start).toFixed(2))
    return report
  },

  scan(): A11yReport {
    const report: A11yReport = {
      fixed: 0, scanned: 0, renderTime: 0, score: 100, details: [],
    }
    if (typeof document === "undefined") return report

    const start    = performance.now()
    const elements = document.querySelectorAll("*")
    report.scanned = elements.length

    const push = (tag: string, fix: string, severity: Severity, el: HTMLElement) =>
      report.details.push({ tag, fix, severity, element: el.outerHTML.slice(0, 100) })

    elements.forEach((el) => {
      const h   = el as HTMLElement
      const tag = h.tagName.toLowerCase()

      if ((tag === "a" || tag === "button") && !h.innerText?.trim() && !h.getAttribute("aria-label"))
        push(tag, "needs aria-label (empty)", "critical", h)
      if (tag === "img" && !h.hasAttribute("alt"))
        push(tag, "needs alt text", "serious", h)
      if (FORM_TAGS.has(tag) && !h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby"))
        push(tag, "needs aria-label", "serious", h)
      if (tag === "iframe" && !h.getAttribute("title") && !h.getAttribute("aria-label"))
        push(tag, "iframe needs title", "serious", h)
    })

    report.fixed      = report.details.length
    report.score      = calculateScore(report)
    report.renderTime = parseFloat((performance.now() - start).toFixed(2))
    return report
  },

  startObserver(config: A11yConfig) {
    if (this.observer || typeof document === "undefined") return
    this.observer = new MutationObserver(() => this.applyFixes(config))
    this.observer.observe(document.body, {
      childList: true, subtree: true, attributes: false,
    })
  },

  stopObserver() {
    this.observer?.disconnect()
    this.observer = null
  },

  // ── Public API — available to any app using yuktai ──
  announce,
  speak,
  showVisualAlert,
  trapFocus,
  handlePlainEnglish,
  handleSummarisePage,
  handleTranslate,
  handleVoiceControl,
  handleSmartLabels,
  SUPPORTED_LANGUAGES,
}