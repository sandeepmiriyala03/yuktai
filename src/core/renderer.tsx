// ─────────────────────────────────────────────────────────────────────────────
// yuktai-a11y · core/renderer.ts  v2.0.0
// Universal accessibility engine — zero framework deps, zero JAWS needed.
// WCAG 2.2 compliant. Works with NVDA, VoiceOver, TalkBack, Narrator.
//
// USER FEEDBACK INCORPORATED:
// ✅ Success/error announced clearly after every action
// ✅ Keyboard navigation — no JAWS, no NVDA needed
// ✅ Skip link — always visible mobile, multi-target, announced
// ✅ SpeechSynthesis — browser built-in voice, zero install
// ✅ Preference panel — blind/deaf/motor/colour blind presets
// ✅ Visual alerts — for deaf users (no audio dependency)
// ✅ Focus indicator — WCAG 2.4.11 minimum size enforced
// ✅ Touch targets — 44×44px minimum enforced
// ✅ Timeout warning — motor users protected
// ✅ Audit score badge — developer sees issues instantly
// ✅ Responsive — works on mobile, tablet, desktop
// ✅ Persistent preferences — localStorage
// ─────────────────────────────────────────────────────────────────────────────

export type ColorBlindMode =
  | "none" | "deuteranopia" | "protanopia" | "tritanopia" | "achromatopsia"

export type Severity = "critical" | "serious" | "moderate" | "minor"

export interface A11yConfig {
  enabled: boolean
  highContrast?: boolean
  darkMode?: boolean
  reduceMotion?: boolean
  autoFix?: boolean
  fontSizeMultiplier?: number
  colorBlindMode?: ColorBlindMode
  keyboardHints?: boolean
  speechEnabled?: boolean
  showPreferencePanel?: boolean
  showAuditBadge?: boolean
  showSkipLinks?: boolean
  largeTargets?: boolean
  timeoutWarning?: number // seconds before warning
}

export interface A11yFix {
  tag: string
  fix: string
  severity: Severity
  element: string
}

export interface A11yReport {
  fixed: number
  scanned: number
  renderTime: number
  score: number
  details: A11yFix[]
}

// ─── Module-level refs — zero ids, zero host-page collisions ─────────────────
let _liveRegionNode: HTMLElement | null = null
let _colorBlindSvgNode: SVGSVGElement | null = null
let _preferencePanelNode: HTMLElement | null = null
let _skipBarNode: HTMLElement | null = null
let _auditBadgeNode: HTMLElement | null = null
let _visualAlertNode: HTMLElement | null = null
let _keyboardCheatsheetNode: HTMLElement | null = null
let _timeoutWarningNode: HTMLElement | null = null
let _timeoutTimer: ReturnType<typeof setTimeout> | null = null
let _currentConfig: A11yConfig | null = null

const CB_FILTER_REFS: Record<string, string> = {
  deuteranopia: "yuktai-cb-d",
  protanopia:   "yuktai-cb-p",
  tritanopia:   "yuktai-cb-t",
}

// ─── Tag group sets ───────────────────────────────────────────────────────────
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

// ─── Speech Synthesis — browser built-in, zero install ───────────────────────
function speak(text: string, priority: "polite" | "assertive" = "polite"): void {
  if (typeof window === "undefined") return
  if (!_currentConfig?.speechEnabled) return
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.rate = 1.0
  utt.pitch = 1.0
  utt.volume = 1.0
  // Use first available voice
  const voices = window.speechSynthesis.getVoices()
  if (voices.length > 0) utt.voice = voices[0]
  window.speechSynthesis.speak(utt)
}

// ─── Visual Alert — for deaf users, no audio dependency ──────────────────────
function showVisualAlert(
  message: string,
  type: "success" | "error" | "info" | "warning" = "info"
): void {
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
      position:fixed;top:80px;right:16px;z-index:999999;
      max-width:320px;width:calc(100% - 32px);
      border-radius:8px;padding:12px 16px;
      display:flex;align-items:center;gap:10px;
      font-family:system-ui,sans-serif;font-size:14px;
      box-shadow:0 4px 12px rgba(0,0,0,0.3);
      transition:transform 0.3s,opacity 0.3s;
      transform:translateX(120%);opacity:0;
    `
    document.body.appendChild(_visualAlertNode)
  }

  _visualAlertNode.style.background = c.bg
  _visualAlertNode.style.border = `1px solid ${c.border}`
  _visualAlertNode.style.color = "#fff"
  _visualAlertNode.innerHTML = `
    <span style="font-size:18px;font-weight:700">${c.icon}</span>
    <span style="flex:1;line-height:1.4">${message}</span>
    <button onclick="this.parentElement.style.transform='translateX(120%)';this.parentElement.style.opacity='0'"
      style="background:none;border:none;color:#fff;cursor:pointer;font-size:18px;padding:0;line-height:1"
      aria-label="Close notification">×</button>
  `

  // Animate in
  requestAnimationFrame(() => {
    if (_visualAlertNode) {
      _visualAlertNode.style.transform = "translateX(0)"
      _visualAlertNode.style.opacity = "1"
    }
  })

  // Auto hide after 5 seconds
  setTimeout(() => {
    if (_visualAlertNode) {
      _visualAlertNode.style.transform = "translateX(120%)"
      _visualAlertNode.style.opacity = "0"
    }
  }, 5000)
}

// ─── Announce — aria-live + speech + visual combined ─────────────────────────
function announce(
  message: string,
  type: "success" | "error" | "info" | "warning" = "info",
  useSpeech = true
): void {
  // 1. aria-live for screen readers
  if (_liveRegionNode) _liveRegionNode.textContent = message

  // 2. Visual alert for deaf users
  showVisualAlert(message, type)

  // 3. SpeechSynthesis for users without screen reader
  if (useSpeech) speak(message, type === "error" ? "assertive" : "polite")
}

// ─── Skip Links — multi-target, always visible mobile ────────────────────────
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
    position:fixed;top:0;left:0;right:0;z-index:999999;
    display:flex;gap:4px;padding:4px;
    background:#111;
    transform:translateY(-100%);
    transition:transform 0.2s ease;
    font-family:system-ui,sans-serif;
  `

  let hasAnyTarget = false

  targets.forEach(({ label, selector }) => {
    const target = document.querySelector(selector) as HTMLElement | null
    if (!target) return
    hasAnyTarget = true

    // Ensure target is focusable
    if (!target.getAttribute("tabindex")) {
      target.setAttribute("tabindex", "-1")
    }

    const link = document.createElement("a")
    link.href = "#"
    link.textContent = label
    link.style.cssText = `
      color:#fff;background:#1a73e8;
      padding:8px 14px;border-radius:4px;
      font-size:13px;font-weight:600;
      text-decoration:none;white-space:nowrap;
      border:2px solid transparent;
      transition:background 0.15s,border-color 0.15s;
    `

    link.addEventListener("focus", () => {
      bar.style.transform = "translateY(0)"
    })

    link.addEventListener("blur", () => {
      // Keep visible for 2 seconds after blur
      setTimeout(() => {
        if (!bar.matches(":focus-within")) {
          bar.style.transform = "translateY(-100%)"
        }
      }, 2000)
    })

    link.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        target.focus()
        target.scrollIntoView({ behavior: "smooth", block: "start" })
        announce(`Jumped to ${label.replace("Skip to ", "")}`, "info")
        bar.style.transform = "translateY(-100%)"
      }
    })

    link.addEventListener("click", (e: MouseEvent) => {
      e.preventDefault()
      target.focus()
      target.scrollIntoView({ behavior: "smooth", block: "start" })
      announce(`Jumped to ${label.replace("Skip to ", "")}`, "info")
      bar.style.transform = "translateY(-100%)"
    })

    link.addEventListener("mouseover", () => {
      link.style.background = "#1557b0"
      link.style.borderColor = "#fff"
    })
    link.addEventListener("mouseout", () => {
      link.style.background = "#1a73e8"
      link.style.borderColor = "transparent"
    })

    bar.appendChild(link)
  })

  if (!hasAnyTarget) return

  // Mobile — always visible
  const isMobile = window.innerWidth < 768
  if (isMobile) {
    bar.style.transform = "translateY(0)"
    bar.style.position = "sticky"
  }

  document.body.insertBefore(bar, document.body.firstChild)
  _skipBarNode = bar
}

// ─── Focus Indicator — WCAG 2.4.11 minimum size ──────────────────────────────
function injectFocusStyles(): void {
  if (typeof document === "undefined") return
  if (document.querySelector("[data-yuktai-focus-style]")) return

  const style = document.createElement("style")
  style.setAttribute("data-yuktai-focus-style", "true")
  style.textContent = `
    /* WCAG 2.4.11 — minimum 2px solid focus indicator */
    [data-yuktai-a11y] *:focus-visible {
      outline: 3px solid #1a73e8 !important;
      outline-offset: 3px !important;
      border-radius: 2px !important;
      box-shadow: 0 0 0 6px rgba(26,115,232,0.15) !important;
    }

    /* High contrast focus */
    [data-yuktai-high-contrast] *:focus-visible {
      outline: 3px solid #ffff00 !important;
      outline-offset: 3px !important;
      box-shadow: 0 0 0 6px rgba(255,255,0,0.2) !important;
    }

    /* Keyboard hint mode */
    [data-yuktai-keyboard] *:focus {
      outline: 3px solid #ff6b35 !important;
      outline-offset: 3px !important;
    }

    /* Remove default outline — replaced by above */
    [data-yuktai-a11y] *:focus:not(:focus-visible) {
      outline: none !important;
    }

    /* Large targets — WCAG 2.5.8 */
    [data-yuktai-large-targets] button,
    [data-yuktai-large-targets] a,
    [data-yuktai-large-targets] input,
    [data-yuktai-large-targets] select,
    [data-yuktai-large-targets] [role="button"] {
      min-height: 44px !important;
      min-width: 44px !important;
    }

    /* Reduce motion — WCAG 2.3.3 */
    [data-yuktai-reduce-motion] *,
    [data-yuktai-reduce-motion] *::before,
    [data-yuktai-reduce-motion] *::after {
      animation-duration: 0.001ms !important;
      transition-duration: 0.001ms !important;
    }

    /* High contrast mode */
    [data-yuktai-high-contrast] {
      filter: contrast(1.4) brightness(1.05) !important;
    }

    /* Dark mode */
    [data-yuktai-dark] {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    [data-yuktai-dark] img,
    [data-yuktai-dark] video,
    [data-yuktai-dark] canvas {
      filter: invert(1) hue-rotate(180deg) !important;
    }

    /* Skip link bar responsive */
    @media (max-width: 768px) {
      [data-yuktai-skip-bar] {
        flex-wrap: wrap;
      }
      [data-yuktai-skip-bar] a {
        font-size: 12px !important;
        padding: 6px 10px !important;
      }
    }

    /* Preference panel responsive */
    @media (max-width: 480px) {
      [data-yuktai-panel] {
        width: 100% !important;
        right: 0 !important;
        bottom: 0 !important;
        border-radius: 16px 16px 0 0 !important;
      }
    }

    /* Link underline enforcement */
    [data-yuktai-a11y] a:not([role]):not([class]) {
      text-decoration: underline !important;
    }
  `
  document.head.appendChild(style)

  // Mark body
  document.documentElement.setAttribute("data-yuktai-a11y", "true")
}

// ─── Keyboard Navigator — arrow keys, escape, no JAWS needed ─────────────────
function initKeyboardNavigator(): void {
  if (typeof document === "undefined") return
  if (document.querySelector("[data-yuktai-kb-init]")) return

  document.documentElement.setAttribute("data-yuktai-kb-init", "true")

  document.addEventListener("keydown", (e: KeyboardEvent) => {
    const target = document.activeElement as HTMLElement
    if (!target) return

    const role = target.getAttribute("role") || ""

    // ── Escape — close modals, menus ──
    if (e.key === "Escape") {
      const modal = target.closest("[role='dialog'],[role='alertdialog']") as HTMLElement
      if (modal) {
        modal.style.display = "none"
        // Return focus to trigger
        const triggerId = modal.getAttribute("data-yuktai-trigger")
        if (triggerId) {
          const trigger = document.querySelector(`[data-yuktai-id='${triggerId}']`) as HTMLElement
          trigger?.focus()
        }
        announce("Dialog closed", "info")
        return
      }
      // Close menus
      const menu = target.closest("[role='menu'],[role='menubar']") as HTMLElement
      if (menu) {
        menu.style.display = "none"
        announce("Menu closed", "info")
      }
    }

    // ── Arrow keys in menu/menubar ──
    if (role === "menuitem" || target.closest("[role='menu'],[role='menubar']")) {
      const menu = target.closest("[role='menu'],[role='menubar']") as HTMLElement
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
        next?.focus()
        next?.click()
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        const prev = tabs[(idx - 1 + tabs.length) % tabs.length]
        prev?.focus()
        prev?.click()
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

    // ── Keyboard cheatsheet — Alt + A ──
    if (e.altKey && e.key === "a") {
      e.preventDefault()
      toggleKeyboardCheatsheet()
    }

    // ── Announce focused element for users without screen reader ──
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

// ─── Focus Trap — for modals ──────────────────────────────────────────────────
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
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  })
}

// ─── Keyboard Cheatsheet ──────────────────────────────────────────────────────
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
  panel.style.cssText = `
    position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
    z-index:999999;background:#1a1a2e;color:#fff;
    border-radius:12px;padding:24px;width:320px;max-width:calc(100vw - 32px);
    box-shadow:0 20px 60px rgba(0,0,0,0.5);
    font-family:system-ui,sans-serif;
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
      <button data-yuktai-close style="background:none;border:none;color:#aaa;cursor:pointer;font-size:20px;padding:0;line-height:1" aria-label="Close shortcuts">×</button>
    </div>
    ${shortcuts.map(([key, desc]) => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #2a2a4a">
        <kbd style="background:#2a2a4a;color:#74c0fc;padding:3px 8px;border-radius:4px;font-size:12px;font-family:monospace;border:1px solid #3a3a6a">${key}</kbd>
        <span style="font-size:12px;color:#ccc;text-align:right;flex:1;margin-left:12px">${desc}</span>
      </div>
    `).join("")}
    <p style="margin:12px 0 0;font-size:11px;color:#888;text-align:center">
      Powered by @yuktai/a11y · Press Escape to close
    </p>
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

// ─── Audit Score Badge ────────────────────────────────────────────────────────
function injectAuditBadge(report: A11yReport): void {
  if (typeof document === "undefined") return
  if (!_currentConfig?.showAuditBadge) return

  // Only in dev
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
  badge.setAttribute("aria-label", `Accessibility score: ${score} out of 100. Click for details.`)
  badge.setAttribute("data-yuktai-badge", "true")
  badge.style.cssText = `
    position:fixed;bottom:16px;left:16px;z-index:999998;
    background:${color};color:#fff;
    border:none;border-radius:20px;cursor:pointer;
    padding:6px 12px;font-size:12px;font-weight:700;
    font-family:system-ui,sans-serif;
    box-shadow:0 2px 8px rgba(0,0,0,0.3);
    display:flex;align-items:center;gap:6px;
    transition:transform 0.15s;
  `
  badge.innerHTML = `${emoji} ${score}/100 <span style="font-weight:400;opacity:0.85">${report.details.length} issues</span>`

  badge.addEventListener("mouseenter", () => { badge.style.transform = "scale(1.05)" })
  badge.addEventListener("mouseleave", () => { badge.style.transform = "scale(1)" })

  badge.addEventListener("click", () => {
    showAuditDetails(report)
  })

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
    position:fixed;bottom:56px;left:16px;z-index:999999;
    background:#1a1a2e;color:#fff;border-radius:12px;
    padding:16px;width:340px;max-width:calc(100vw - 32px);
    max-height:60vh;overflow-y:auto;
    box-shadow:0 8px 32px rgba(0,0,0,0.5);
    font-family:system-ui,sans-serif;font-size:12px;
  `

  const sevColor = { critical: "#d93025", serious: "#f29900", moderate: "#1a73e8", minor: "#0f9d58" }

  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <strong style="font-size:14px;color:#74c0fc">Audit Report</strong>
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
    ${report.details.length > 20 ? `<div style="color:#888;padding:8px 0;text-align:center">+${report.details.length - 20} more issues</div>` : ""}
  `

  panel.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") panel.remove()
  })

  document.body.appendChild(panel)
  trapFocus(panel)
}

// ─── Timeout Warning — WCAG 2.2.1 motor users ────────────────────────────────
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
      position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
      z-index:999999;background:#fff;color:#111;
      border-radius:12px;padding:24px;width:320px;max-width:calc(100vw - 32px);
      box-shadow:0 20px 60px rgba(0,0,0,0.4);
      font-family:system-ui,sans-serif;border:2px solid #d93025;
    `
    warning.innerHTML = `
      <h2 style="margin:0 0 8px;font-size:18px;color:#d93025">⏱ Session timeout</h2>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.5;color:#444">
        Your session will expire soon. Do you need more time?
      </p>
      <div style="display:flex;gap:8px">
        <button data-yuktai-extend style="flex:1;padding:10px;background:#1a73e8;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600">
          Yes, more time
        </button>
        <button data-yuktai-dismiss style="flex:1;padding:10px;background:#f1f3f4;color:#111;border:none;border-radius:8px;cursor:pointer;font-size:14px">
          No, sign out
        </button>
      </div>
    `

    const extend = warning.querySelector("[data-yuktai-extend]") as HTMLElement
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

// ─── Preference Panel ─────────────────────────────────────────────────────────
function injectPreferencePanel(config: A11yConfig): void {
  if (typeof document === "undefined") return
  if (_preferencePanelNode) return

  // Load saved preferences
  try {
    const saved = localStorage.getItem("yuktai-a11y-prefs")
    if (saved) {
      const prefs = JSON.parse(saved)
      Object.assign(config, prefs)
      applyConfigToDOM(config)
    }
  } catch { /* ignore */ }

  // Floating toggle button
  const toggle = document.createElement("button")
  toggle.setAttribute("aria-label", "Accessibility preferences")
  toggle.setAttribute("aria-haspopup", "dialog")
  toggle.setAttribute("data-yuktai-pref-toggle", "true")
  toggle.style.cssText = `
    position:fixed;bottom:16px;right:16px;z-index:999998;
    width:48px;height:48px;border-radius:50%;
    background:#1a73e8;color:#fff;border:none;
    cursor:pointer;font-size:22px;
    box-shadow:0 2px 12px rgba(0,0,0,0.3);
    display:flex;align-items:center;justify-content:center;
    transition:transform 0.15s,background 0.15s;
  `
  toggle.innerHTML = "♿"
  toggle.addEventListener("mouseenter", () => {
    toggle.style.transform = "scale(1.1)"
    toggle.style.background = "#1557b0"
  })
  toggle.addEventListener("mouseleave", () => {
    toggle.style.transform = "scale(1)"
    toggle.style.background = "#1a73e8"
  })

  // Panel
  const panel = document.createElement("div")
  panel.setAttribute("role", "dialog")
  panel.setAttribute("aria-label", "Accessibility preferences")
  panel.setAttribute("aria-modal", "true")
  panel.setAttribute("data-yuktai-panel", "true")
  panel.style.cssText = `
    position:fixed;bottom:76px;right:16px;z-index:999999;
    width:300px;max-width:calc(100vw - 32px);
    background:#fff;border-radius:16px;
    box-shadow:0 8px 32px rgba(0,0,0,0.2);
    border:1px solid #e0e0e0;
    font-family:system-ui,sans-serif;
    overflow:hidden;display:none;
  `

  const sections = [
    {
      icon: "👁",
      title: "Vision",
      options: [
        { key: "highContrast",     label: "High contrast",  type: "toggle" },
        { key: "darkMode",         label: "Dark mode",      type: "toggle" },
        { key: "largeTargets",     label: "Large text & targets", type: "toggle" },
      ]
    },
    {
      icon: "🎨",
      title: "Colour blindness",
      options: [
        { key: "colorBlind_none",         label: "None",         type: "radio", group: "cb" },
        { key: "colorBlind_deuteranopia", label: "Deuteranopia", type: "radio", group: "cb" },
        { key: "colorBlind_protanopia",   label: "Protanopia",   type: "radio", group: "cb" },
        { key: "colorBlind_tritanopia",   label: "Tritanopia",   type: "radio", group: "cb" },
        { key: "colorBlind_achromatopsia",label: "Greyscale",    type: "radio", group: "cb" },
      ]
    },
    {
      icon: "⌨",
      title: "Motor",
      options: [
        { key: "reduceMotion", label: "Reduce motion", type: "toggle" },
        { key: "largeTargets", label: "Large click targets", type: "toggle" },
      ]
    },
    {
      icon: "🔊",
      title: "Audio",
      options: [
        { key: "speechEnabled", label: "Speak on focus", type: "toggle" },
      ]
    },
  ]

  panel.innerHTML = `
    <div style="padding:16px 16px 8px;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center">
      <strong style="font-size:15px;color:#111">♿ Accessibility</strong>
      <button data-yuktai-panel-close style="background:none;border:none;cursor:pointer;font-size:20px;color:#666;padding:0;line-height:1" aria-label="Close preferences">×</button>
    </div>
    <div style="padding:8px 0;max-height:60vh;overflow-y:auto">
      ${sections.map(section => `
        <div style="padding:8px 16px">
          <div style="font-size:11px;font-weight:700;color:#888;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:8px">
            ${section.icon} ${section.title}
          </div>
          ${section.options.map(opt => `
            <label style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;cursor:pointer;gap:8px">
              <span style="font-size:13px;color:#333">${opt.label}</span>
              ${opt.type === "toggle" ? `
                <div data-yuktai-toggle="${opt.key}" style="
                  width:40px;height:22px;border-radius:11px;
                  background:${getConfigValue(config, opt.key) ? "#1a73e8" : "#ccc"};
                  position:relative;cursor:pointer;transition:background 0.2s;flex-shrink:0;
                ">
                  <div style="
                    position:absolute;top:2px;left:${getConfigValue(config, opt.key) ? "20px" : "2px"};
                    width:18px;height:18px;border-radius:50%;background:#fff;
                    transition:left 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.2);
                  "></div>
                </div>
              ` : `
                <input type="radio" name="yuktai-${opt.group}" value="${opt.key}"
                  ${getColorBlindSelected(config, opt.key) ? "checked" : ""}
                  style="width:16px;height:16px;cursor:pointer;accent-color:#1a73e8"
                />
              `}
            </label>
          `).join("")}
        </div>
      `).join("")}
      <div style="padding:8px 16px 4px">
        <div style="font-size:11px;font-weight:700;color:#888;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:8px">
          ⌨ Keyboard
        </div>
        <button data-yuktai-show-keys style="
          width:100%;padding:8px;background:#f8f9fa;border:1px solid #e0e0e0;
          border-radius:8px;cursor:pointer;font-size:13px;color:#333;
          display:flex;align-items:center;justify-content:center;gap:6px;
        ">
          Show keyboard shortcuts <kbd style="background:#e0e0e0;padding:1px 6px;border-radius:4px;font-size:11px">Alt+A</kbd>
        </button>
      </div>
    </div>
    <div style="padding:8px 16px 12px;border-top:1px solid #f0f0f0">
      <button data-yuktai-reset style="
        width:100%;padding:8px;background:#fff;border:1px solid #d93025;
        border-radius:8px;cursor:pointer;font-size:12px;color:#d93025;font-weight:600;
      ">Reset all preferences</button>
    </div>
  `

  // Wire toggles
  panel.querySelectorAll("[data-yuktai-toggle]").forEach(el => {
    el.addEventListener("click", () => {
      const key = el.getAttribute("data-yuktai-toggle") as keyof A11yConfig
      ;(config as Record<string, unknown>)[key] = !getConfigValue(config, key as string)
      savePreferences(config)
      applyConfigToDOM(config)
      rebuildPanel(config)
      announce(
        `${key.replace(/([A-Z])/g, " $1")} ${getConfigValue(config, key as string) ? "enabled" : "disabled"}`,
        "info"
      )
    })
  })

  // Wire radio buttons (colour blind)
  panel.querySelectorAll("input[type='radio']").forEach(el => {
    el.addEventListener("change", () => {
      const val = (el as HTMLInputElement).value.replace("colorBlind_", "")
      config.colorBlindMode = val as ColorBlindMode
      savePreferences(config)
      applyConfigToDOM(config)
      announce(`Colour blind mode: ${val}`, "info")
    })
  })

  // Keyboard shortcuts button
  panel.querySelector("[data-yuktai-show-keys]")?.addEventListener("click", () => {
    toggleKeyboardCheatsheet()
  })

  // Reset
  panel.querySelector("[data-yuktai-reset]")?.addEventListener("click", () => {
    localStorage.removeItem("yuktai-a11y-prefs")
    config.highContrast = false
    config.darkMode = false
    config.reduceMotion = false
    config.largeTargets = false
    config.speechEnabled = false
    config.colorBlindMode = "none"
    applyConfigToDOM(config)
    rebuildPanel(config)
    announce("Preferences reset to default", "info")
  })

  // Close
  panel.querySelector("[data-yuktai-panel-close]")?.addEventListener("click", () => {
    panel.style.display = "none"
    toggle.focus()
    announce("Preferences closed", "info")
  })

  panel.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      panel.style.display = "none"
      toggle.focus()
    }
  })

  // Toggle button logic
  toggle.addEventListener("click", () => {
    const isOpen = panel.style.display !== "none"
    panel.style.display = isOpen ? "none" : "block"
    toggle.setAttribute("aria-expanded", String(!isOpen))
    if (!isOpen) {
      trapFocus(panel)
      announce("Accessibility preferences opened", "info")
    }
  })

  document.body.appendChild(toggle)
  document.body.appendChild(panel)
  _preferencePanelNode = panel
}

function rebuildPanel(config: A11yConfig): void {
  if (_preferencePanelNode) {
    _preferencePanelNode.remove()
    _preferencePanelNode = null
  }
  injectPreferencePanel(config)
}

function getConfigValue(config: A11yConfig, key: string): boolean {
  return !!(config as Record<string, unknown>)[key]
}

function getColorBlindSelected(config: A11yConfig, key: string): boolean {
  const mode = key.replace("colorBlind_", "")
  return config.colorBlindMode === mode
}

function savePreferences(config: A11yConfig): void {
  try {
    const toSave = {
      highContrast:   config.highContrast,
      darkMode:       config.darkMode,
      reduceMotion:   config.reduceMotion,
      largeTargets:   config.largeTargets,
      speechEnabled:  config.speechEnabled,
      colorBlindMode: config.colorBlindMode,
    }
    localStorage.setItem("yuktai-a11y-prefs", JSON.stringify(toSave))
  } catch { /* ignore */ }
}

function applyConfigToDOM(config: A11yConfig): void {
  if (typeof document === "undefined") return
  const root = document.documentElement

  root.toggleAttribute("data-yuktai-high-contrast", !!config.highContrast)
  root.toggleAttribute("data-yuktai-dark",          !!config.darkMode)
  root.toggleAttribute("data-yuktai-reduce-motion", !!config.reduceMotion)
  root.toggleAttribute("data-yuktai-large-targets", !!config.largeTargets)
  root.toggleAttribute("data-yuktai-keyboard",      !!config.keyboardHints)

  // Colour blind
  const body = document.body
  if (config.colorBlindMode && config.colorBlindMode !== "none") {
    const filterValue = config.colorBlindMode === "achromatopsia"
      ? "grayscale(100%)"
      : `url(#${CB_FILTER_REFS[config.colorBlindMode]})`
    body.style.filter = filterValue
  } else {
    body.style.filter = ""
  }
}

// ─── Live Region ──────────────────────────────────────────────────────────────
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

// ─── Color Blind SVG Filters ──────────────────────────────────────────────────
function ensureColorBlindFilters(): void {
  if (typeof document === "undefined" || _colorBlindSvgNode) return
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.setAttribute("aria-hidden", "true")
  svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;"
  svg.innerHTML = `
    <defs>
      <filter id="${CB_FILTER_REFS.deuteranopia}">
        <feColorMatrix type="matrix" values="0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0"/>
      </filter>
      <filter id="${CB_FILTER_REFS.protanopia}">
        <feColorMatrix type="matrix" values="0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0"/>
      </filter>
      <filter id="${CB_FILTER_REFS.tritanopia}">
        <feColorMatrix type="matrix" values="0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0 0.475 0.525 0 0 0 0 0 1 0"/>
      </filter>
    </defs>
  `
  document.body.appendChild(svg)
  _colorBlindSvgNode = svg
}

// ─── Score Calculator ─────────────────────────────────────────────────────────
function calculateScore(report: A11yReport): number {
  const weights = { critical: 20, serious: 10, moderate: 5, minor: 2 }
  const deduction = report.details.reduce((acc, d) => acc + (weights[d.severity] || 0), 0)
  return Math.max(0, Math.min(100, 100 - deduction))
}

// ─── Main wcagPlugin ──────────────────────────────────────────────────────────
export const wcagPlugin = {
  name: "yuktai-a11y",
  version: "2.0.0",
  observer: null as MutationObserver | null,

  async execute(config: A11yConfig): Promise<string> {
    if (!config.enabled) {
      this.stopObserver()
      return "yuktai-a11y: disabled."
    }

    _currentConfig = config

    // Set up infrastructure
    ensureLiveRegion()
    ensureColorBlindFilters()
    injectFocusStyles()
    initKeyboardNavigator()

    if (config.showSkipLinks !== false) injectSkipLinks()
    if (config.showPreferencePanel !== false) injectPreferencePanel(config)

    // Apply DOM config
    applyConfigToDOM(config)

    // Run fixes
    const report = this.applyFixes(config)
    report.score = calculateScore(report)

    // Audit badge
    if (config.showAuditBadge) injectAuditBadge(report)

    // Timeout warning
    if (config.timeoutWarning) startTimeoutWarning(config.timeoutWarning)

    // Auto observer
    if (config.autoFix) this.startObserver(config)

    const msg = `${report.fixed} accessibility fixes applied. Score: ${report.score}/100.`
    announce(msg, report.score >= 90 ? "success" : "info", false)

    return `yuktai-a11y v2: ${msg} Scanned ${report.scanned} elements in ${report.renderTime}ms.`
  },

  applyFixes(config: A11yConfig): A11yReport {
    const report: A11yReport = { fixed: 0, scanned: 0, renderTime: 0, score: 100, details: [] }
    if (typeof document === "undefined") return report

    const start = performance.now()
    const elements = document.querySelectorAll("*")
    report.scanned = elements.length

    const push = (tag: string, fix: string, severity: Severity, el: HTMLElement) => {
      report.details.push({ tag, fix, severity, element: el.outerHTML.slice(0, 100) })
      report.fixed++
    }

    elements.forEach((el) => {
      const h = el as HTMLElement
      const tag = h.tagName.toLowerCase()

      // ── DOCUMENT LEVEL ──────────────────────────────────────────────────────

      if (tag === "html" && !h.getAttribute("lang")) {
        h.setAttribute("lang", "en")
        push(tag, 'lang="en" added to <html>', "critical", h)
      }

      if (tag === "head" && !document.title) {
        document.title = document.querySelector("h1")?.innerText?.trim() || "Page"
        push(tag, `document.title set to "${document.title}"`, "serious", h)
      }

      if (tag === "meta") {
        const name = h.getAttribute("name")
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

      // Main content target for skip link
      if (tag === "main" && !h.getAttribute("tabindex")) {
        h.setAttribute("tabindex", "-1")
        if (!h.getAttribute("id")) h.setAttribute("id", "main-content")
      }

      // ── WCAG 2.2 — Focus appearance (2.4.11) ────────────────────────────────
      if (tag === "body") {
        // Block video autoplay with sound — deaf users
        document.querySelectorAll("video[autoplay]:not([muted])").forEach(v => {
          (v as HTMLVideoElement).muted = true
          push("video", "autoplay video muted (deaf users)", "serious", h)
        })
      }

      // ── WCAG 2.2 — Target size (2.5.8) ──────────────────────────────────────
      if (config.largeTargets && (tag === "button" || tag === "a" || tag === "input")) {
        const rect = h.getBoundingClientRect()
        if (rect.width > 0 && rect.width < 24) {
          h.style.minWidth = "44px"
          h.style.minHeight = "44px"
          push(tag, "min 44px touch target enforced", "minor", h)
        }
      }

      // ── HEADINGS ─────────────────────────────────────────────────────────────
      if (HEADING_TAGS.has(tag)) {
        if (!h.innerText?.trim() && !h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
          h.setAttribute("aria-label", `${tag.toUpperCase()} section`)
          push(tag, `aria-label added (empty heading)`, "moderate", h)
        }
        if (h.hasAttribute("onclick") && !h.getAttribute("tabindex")) {
          h.setAttribute("tabindex", "0")
          if (!h.onkeydown) {
            h.onkeydown = (e: KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); h.click() }
            }
          }
          push(tag, "tabindex=0 + keydown (clickable heading)", "minor", h)
        }
      }

      // ── IMAGES ───────────────────────────────────────────────────────────────
      if (tag === "img") {
        if (!h.hasAttribute("alt")) {
          h.setAttribute("alt", "")
          h.setAttribute("aria-hidden", "true")
          push(tag, 'alt="" aria-hidden="true"', "serious", h)
        }
        if (h.getAttribute("role") === "presentation" && h.getAttribute("alt") !== "") {
          h.setAttribute("alt", "")
          push(tag, 'alt="" (role=presentation)', "minor", h)
        }
      }

      if (tag === "area" && !h.getAttribute("alt")) {
        const label = h.getAttribute("title") || h.getAttribute("href") || "map area"
        h.setAttribute("alt", label)
        push(tag, `alt="${label}" on <area>`, "serious", h)
      }

      if (tag === "svg") {
        if (!h.getAttribute("aria-hidden") && !h.getAttribute("aria-label") && !el.querySelector("title")) {
          if (!h.getAttribute("role") || h.getAttribute("role") === "img") {
            const titleEl = document.createElementNS("http://www.w3.org/2000/svg", "title")
            titleEl.textContent = "graphic"
            h.prepend(titleEl)
            h.setAttribute("role", "img")
            push(tag, 'role="img" + <title> injected', "moderate", h)
          } else {
            h.setAttribute("aria-hidden", "true")
            push(tag, 'aria-hidden="true" (decorative svg)', "minor", h)
          }
        }
        if (!h.getAttribute("focusable")) h.setAttribute("focusable", "false")
      }

      if (tag === "canvas") {
        if (!h.getAttribute("role")) {
          h.setAttribute("role", "img")
          push(tag, 'role="img"', "serious", h)
        }
        if (!h.getAttribute("aria-label")) {
          h.setAttribute("aria-label", h.getAttribute("title") || "canvas graphic")
          push(tag, "aria-label added to canvas", "serious", h)
        }
      }

      if (tag === "object" || tag === "embed") {
        if (!h.getAttribute("aria-label") && !h.getAttribute("title")) {
          h.setAttribute("aria-label", `embedded ${tag} content`)
          push(tag, `aria-label added to <${tag}>`, "moderate", h)
        }
      }

      if (tag === "video") {
        if (!el.querySelector("track") && !h.getAttribute("aria-label")) {
          h.setAttribute("aria-label", h.getAttribute("title") || "video player")
          push(tag, "aria-label added (no captions track)", "serious", h)
        }
      }

      if (tag === "audio") {
        if (!el.querySelector("track") && !h.getAttribute("aria-label")) {
          h.setAttribute("aria-label", h.getAttribute("title") || "audio player")
          push(tag, "aria-label added to audio", "serious", h)
        }
      }

      if (tag === "iframe") {
        if (!h.getAttribute("title") && !h.getAttribute("aria-label")) {
          h.setAttribute("title", "embedded content")
          h.setAttribute("aria-label", "embedded content")
          push(tag, 'title + aria-label="embedded content"', "serious", h)
        }
      }

      if (tag === "figure") {
        if (!el.querySelector("figcaption") && !h.getAttribute("aria-label")) {
          const img = el.querySelector("img")
          const altText = img?.getAttribute("alt")
          if (altText) {
            h.setAttribute("aria-label", altText)
            push(tag, "aria-label from inner img alt", "minor", h)
          }
        }
      }

      // ── INTERACTIVE ──────────────────────────────────────────────────────────
      if (tag === "button") {
        if (!h.innerText?.trim() && !h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
          const label = h.getAttribute("title") || h.getAttribute("data-label") || "button"
          h.setAttribute("aria-label", label)
          push(tag, `aria-label="${label}" (empty button)`, "critical", h)
        }
        if (h.hasAttribute("disabled") && !h.getAttribute("aria-disabled")) {
          h.setAttribute("aria-disabled", "true")
          report.fixed++
        }
        // Announce button result on click — user feedback
        if (!h.getAttribute("data-yuktai-announced")) {
          h.setAttribute("data-yuktai-announced", "true")
          h.addEventListener("click", () => {
            const label = h.getAttribute("aria-label") || h.textContent?.trim() || "button"
            setTimeout(() => {
              announce(`${label} activated`, "success", false)
            }, 100)
          })
        }
      }

      if (tag === "a") {
        const anchor = h as HTMLAnchorElement
        if (!h.innerText?.trim() && !h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
          const label = h.getAttribute("title") || "link"
          h.setAttribute("aria-label", label)
          push(tag, `aria-label="${label}" (empty link)`, "critical", h)
        }
        if (anchor.target === "_blank") {
          if (!anchor.rel?.includes("noopener")) {
            anchor.rel = "noopener noreferrer"
            report.fixed++
          }
          const currentLabel = anchor.getAttribute("aria-label") || anchor.innerText?.trim() || "link"
          if (!currentLabel.includes("opens in new window")) {
            anchor.setAttribute("aria-label", `${currentLabel} (opens in new window)`)
            push(tag, "aria-label: new-window warning", "moderate", h)
          }
        }
        if (!anchor.href && !anchor.getAttribute("role") && !anchor.getAttribute("tabindex")) {
          anchor.setAttribute("role", "button")
          anchor.setAttribute("tabindex", "0")
          push(tag, 'role="button" tabindex=0 (href-less link)', "serious", h)
        }
      }

      // Clickable non-interactive elements
      const isClickable =
        h.hasAttribute("onclick") ||
        (typeof window !== "undefined" && window.getComputedStyle(h).cursor === "pointer")
      if (isClickable && !INTERACTIVE_TAGS.has(tag)) {
        if (!h.getAttribute("role")) {
          h.setAttribute("role", "button")
          push(tag, 'role="button" (clickable non-interactive)', "serious", h)
        }
        if (h.tabIndex < 0) { h.tabIndex = 0; report.fixed++ }
        if (!h.onkeydown) {
          h.onkeydown = (e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); h.click() }
          }
        }
      }

      // ── FORMS — announce errors + success ────────────────────────────────────
      if (FORM_TAGS.has(tag)) {
        const input = h as HTMLInputElement

        if (!h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
          const label = h.getAttribute("placeholder") || h.getAttribute("name") || h.getAttribute("title") || tag
          h.setAttribute("aria-label", label)
          push(tag, `aria-label="${label}"`, "serious", h)
        }
        if (h.hasAttribute("required") && !h.getAttribute("aria-required")) {
          h.setAttribute("aria-required", "true"); report.fixed++
        }
        if (h.hasAttribute("disabled") && !h.getAttribute("aria-disabled")) {
          h.setAttribute("aria-disabled", "true"); report.fixed++
        }
        if (h.hasAttribute("readonly") && !h.getAttribute("aria-readonly")) {
          h.setAttribute("aria-readonly", "true"); report.fixed++
        }

        // Announce validation errors — user feedback
        if (!h.getAttribute("data-yuktai-validation")) {
          h.setAttribute("data-yuktai-validation", "true")
          h.addEventListener("invalid", () => {
            const label = h.getAttribute("aria-label") || h.getAttribute("placeholder") || "Field"
            const msg = (h as HTMLInputElement).validationMessage || "is invalid"
            announce(`Error: ${label} ${msg}`, "error")
          })
          h.addEventListener("change", () => {
            if ((h as HTMLInputElement).validity?.valid) {
              const label = h.getAttribute("aria-label") || h.getAttribute("placeholder") || "Field"
              announce(`${label} looks good`, "success", false)
            }
          })
        }

        // Autocomplete
        if (tag === "input" && !input.autocomplete) {
          const n = input.name || ""
          if (input.type === "email" || n.includes("email"))        { input.autocomplete = "email"; report.fixed++ }
          else if (input.type === "tel" || n.includes("tel"))       { input.autocomplete = "tel"; report.fixed++ }
          else if (input.type === "password")                       { input.autocomplete = "current-password"; report.fixed++ }
          else if (n.includes("firstname") || n.includes("fname"))  { input.autocomplete = "given-name"; report.fixed++ }
          else if (n.includes("lastname") || n.includes("lname"))   { input.autocomplete = "family-name"; report.fixed++ }
          else if (n === "name" || n.includes("fullname"))          { input.autocomplete = "name"; report.fixed++ }
          else if (n.includes("zip") || n.includes("postal"))      { input.autocomplete = "postal-code"; report.fixed++ }
          else if (n.includes("city"))                              { input.autocomplete = "address-level2"; report.fixed++ }
          else if (n.includes("country"))                           { input.autocomplete = "country"; report.fixed++ }
        }

        if (tag === "input" && input.type === "image" && !h.getAttribute("alt")) {
          h.setAttribute("alt", h.getAttribute("value") || "submit")
          push(tag, "alt added to input[type=image]", "serious", h)
        }

        if (tag === "input" && input.type === "range") {
          if (!h.getAttribute("aria-valuemin")) h.setAttribute("aria-valuemin", input.min || "0")
          if (!h.getAttribute("aria-valuemax")) h.setAttribute("aria-valuemax", input.max || "100")
          if (!h.getAttribute("aria-valuenow")) h.setAttribute("aria-valuenow", input.value || "50")
          report.fixed++
        }
      }

      if (tag === "fieldset") {
        if (!el.querySelector("legend") && !h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
          h.setAttribute("aria-label", "form group")
          push(tag, 'aria-label="form group" (no legend)', "moderate", h)
        }
      }

      // ── TABLES ───────────────────────────────────────────────────────────────
      if (tag === "table") {
        if (!el.querySelector("th") && !h.getAttribute("role")) {
          h.setAttribute("role", "grid")
          push(tag, 'role="grid" (no <th>)', "serious", h)
        }
        if (!el.querySelector("caption") && !h.getAttribute("aria-label")) {
          h.setAttribute("aria-label", "data table")
          push(tag, 'aria-label="data table"', "moderate", h)
        }
      }

      if (tag === "th" && !h.getAttribute("scope")) {
        const isInThead = h.closest("thead") !== null
        h.setAttribute("scope", isInThead ? "col" : "row")
        push(tag, `scope="${isInThead ? "col" : "row"}"`, "moderate", h)
      }

      // ── LISTS ────────────────────────────────────────────────────────────────
      if (LIST_TAGS.has(tag)) {
        if (h.getAttribute("role") === "presentation") {
          el.querySelectorAll("li").forEach(li => {
            if (!li.getAttribute("role")) li.setAttribute("role", "presentation")
          })
          report.fixed++
        }
        if ((tag === "ul" || tag === "ol") && !h.getAttribute("aria-label")) {
          const parent = h.closest("nav")
          if (parent) {
            h.setAttribute("aria-label", parent.getAttribute("aria-label") || "navigation list")
            push(tag, "aria-label from parent nav", "minor", h)
          }
        }
      }

      // ── LANDMARKS ────────────────────────────────────────────────────────────
      if (LANDMARK_MAP[tag] && !h.getAttribute("role")) {
        h.setAttribute("role", LANDMARK_MAP[tag])
        push(tag, `role="${LANDMARK_MAP[tag]}"`, "minor", h)
      }

      if (["nav","section","article","aside"].includes(tag)) {
        const siblings = el.parentElement?.querySelectorAll(tag)
        if (siblings && siblings.length > 1 && !h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
          const heading = el.querySelector("h1,h2,h3,h4,h5,h6")
          const text = heading?.textContent?.trim()
          if (text) {
            h.setAttribute("aria-label", text)
            push(tag, "aria-label from inner heading", "moderate", h)
          }
        }
      }

      if (tag === "details") {
        if (!el.querySelector("summary")) {
          const summary = document.createElement("summary")
          summary.textContent = h.getAttribute("aria-label") || "More details"
          h.prepend(summary)
          push(tag, "<summary> injected", "moderate", h)
        }
      }

      if (tag === "summary" && !h.innerText?.trim() && !h.getAttribute("aria-label")) {
        h.setAttribute("aria-label", "Toggle details")
        push(tag, 'aria-label="Toggle details"', "moderate", h)
      }

      if (tag === "dialog") {
        const role = h.getAttribute("role")
        if (role && role !== "dialog" && role !== "alertdialog") {
          h.setAttribute("role", "dialog")
          push(tag, 'role corrected to "dialog"', "serious", h)
        }
        if (!h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
          const heading = el.querySelector("h1,h2,h3,h4,h5,h6")
          const text = heading?.textContent?.trim() || "dialog"
          h.setAttribute("aria-label", text)
          push(tag, "aria-label added to dialog", "serious", h)
        }
        // Auto focus trap on open
        if (!h.getAttribute("data-yuktai-trap")) {
          h.setAttribute("data-yuktai-trap", "true")
          const observer = new MutationObserver(() => {
            if (h.style.display !== "none" && h.style.visibility !== "hidden") {
              trapFocus(h)
            }
          })
          observer.observe(h, { attributes: true, attributeFilter: ["style", "open"] })
        }
      }

      // ── INLINE ───────────────────────────────────────────────────────────────
      if (tag === "abbr" && !h.getAttribute("title")) {
        h.setAttribute("title", h.innerText?.trim() || "abbreviation")
        push(tag, "title added to <abbr>", "minor", h)
      }

      if (tag === "time" && !h.getAttribute("datetime") && h.innerText?.trim()) {
        h.setAttribute("datetime", h.innerText.trim())
        push(tag, `datetime="${h.innerText.trim()}" added`, "minor", h)
      }

      if (tag === "meter") {
        if (!h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
          h.setAttribute("aria-label", h.getAttribute("title") || "meter")
          push(tag, "aria-label added to <meter>", "moderate", h)
        }
      }

      if (tag === "progress") {
        if (!h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
          h.setAttribute("aria-label", h.getAttribute("title") || "progress")
          push(tag, "aria-label added to <progress>", "moderate", h)
        }
        const p = h as HTMLProgressElement
        if (!h.getAttribute("aria-valuenow")) h.setAttribute("aria-valuenow", String(p.value))
        if (!h.getAttribute("aria-valuemax")) h.setAttribute("aria-valuemax", String(p.max || 1))
        report.fixed++
      }

      // ── ARIA WIDGETS ─────────────────────────────────────────────────────────
      const role = h.getAttribute("role") || ""

      if (role === "tab" && !h.getAttribute("aria-selected")) {
        h.setAttribute("aria-selected", "false"); report.fixed++
      }
      if (role === "tabpanel") {
        if (!h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
          h.setAttribute("aria-label", "tab panel")
          push(tag, 'aria-label="tab panel"', "moderate", h)
        }
        if (!h.getAttribute("tabindex")) { h.setAttribute("tabindex", "0"); report.fixed++ }
      }

      if (["alert","status","log","marquee"].includes(role)) {
        if (!h.getAttribute("aria-live")) {
          const lv = role === "alert" ? "assertive" : "polite"
          h.setAttribute("aria-live", lv)
          push(tag, `aria-live="${lv}" on role=${role}`, "moderate", h)
        }
        if (!h.getAttribute("aria-atomic")) { h.setAttribute("aria-atomic", "true"); report.fixed++ }
      }

      if (role === "tooltip" && !h.getAttribute("aria-live")) {
        h.setAttribute("aria-live", "polite"); report.fixed++
      }

      if ((role === "menu" || role === "menubar") && !h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
        h.setAttribute("aria-label", "menu")
        push(tag, 'aria-label="menu"', "moderate", h)
      }

      if (role === "listbox" && !h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
        h.setAttribute("aria-label", "listbox")
        push(tag, 'aria-label="listbox"', "moderate", h)
      }
      if (role === "option" && !h.getAttribute("aria-selected")) {
        h.setAttribute("aria-selected", "false"); report.fixed++
      }

      if (role === "slider") {
        if (!h.getAttribute("aria-valuemin")) h.setAttribute("aria-valuemin", "0")
        if (!h.getAttribute("aria-valuemax")) h.setAttribute("aria-valuemax", "100")
        if (!h.getAttribute("aria-valuenow")) h.setAttribute("aria-valuenow", "50")
        report.fixed++
      }

      if ((role === "checkbox" || role === "radio") && !h.getAttribute("aria-checked")) {
        h.setAttribute("aria-checked", "false")
        push(tag, `aria-checked="false" on role=${role}`, "serious", h)
      }

      if (role === "combobox") {
        if (!h.getAttribute("aria-expanded")) {
          h.setAttribute("aria-expanded", "false")
          push(tag, 'aria-expanded="false" on combobox', "serious", h)
        }
        if (!h.getAttribute("aria-haspopup")) { h.setAttribute("aria-haspopup", "listbox"); report.fixed++ }
      }

      if ((role === "grid" || role === "treegrid") && !h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
        h.setAttribute("aria-label", "data grid")
        push(tag, 'aria-label="data grid"', "moderate", h)
      }

      if (role === "tree" && !h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
        h.setAttribute("aria-label", "tree")
        push(tag, 'aria-label="tree"', "moderate", h)
      }

      if (role === "spinbutton") {
        if (!h.getAttribute("aria-valuenow")) h.setAttribute("aria-valuenow", "0")
        if (!h.getAttribute("aria-valuemin")) h.setAttribute("aria-valuemin", "0")
        if (!h.getAttribute("aria-valuemax")) h.setAttribute("aria-valuemax", "100")
        report.fixed++
      }
    })

    report.renderTime = parseFloat((performance.now() - start).toFixed(2))
    return report
  },

  scan(): A11yReport {
    const report: A11yReport = { fixed: 0, scanned: 0, renderTime: 0, score: 100, details: [] }
    if (typeof document === "undefined") return report
    const start = performance.now()
    const elements = document.querySelectorAll("*")
    report.scanned = elements.length
    const push = (tag: string, fix: string, severity: Severity, el: HTMLElement) =>
      report.details.push({ tag, fix, severity, element: el.outerHTML.slice(0, 100) })
    elements.forEach((el) => {
      const h = el as HTMLElement
      const tag = h.tagName.toLowerCase()
      if ((tag === "a" || tag === "button") && !h.innerText?.trim() && !h.getAttribute("aria-label"))
        push(tag, "needs aria-label (empty)", "critical", h)
      if (tag === "img" && !h.hasAttribute("alt"))
        push(tag, "needs alt text", "serious", h)
      if (FORM_TAGS.has(tag) && !h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby"))
        push(tag, "needs aria-label", "serious", h)
      if (tag === "iframe" && !h.getAttribute("title") && !h.getAttribute("aria-label"))
        push(tag, "iframe needs title", "serious", h)
      if (MEDIA_TAGS.has(tag) && !el.querySelector("track") && !h.getAttribute("aria-label"))
        push(tag, "media needs captions/aria-label", "serious", h)
      if (HEADING_TAGS.has(tag) && !h.innerText?.trim() && !h.getAttribute("aria-label"))
        push(tag, "empty heading", "moderate", h)
    })
    report.fixed = report.details.length
    report.score = calculateScore(report)
    report.renderTime = parseFloat((performance.now() - start).toFixed(2))
    return report
  },

  startObserver(config: A11yConfig) {
    if (this.observer || typeof document === "undefined") return
    this.observer = new MutationObserver(() => this.applyFixes(config))
    this.observer.observe(document.body, { childList: true, subtree: true, attributes: false })
  },

  stopObserver() { this.observer?.disconnect(); this.observer = null },

  // Public API for apps using the plugin
  announce,
  speak,
  showVisualAlert,
  trapFocus,
}