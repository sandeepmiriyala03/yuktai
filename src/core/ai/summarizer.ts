// ─────────────────────────────────────────────────────────────────────────────
// src/core/ai/summarizer.ts
// yuktai v2.0.19 — Yuktishaalaa AI Lab
//
// Page summariser — reads the full page and returns a short summary.
//
// Chrome 147+ uses standalone globals: window.Summarizer
// Chrome 127–146 used: window.ai.summarizer
// This file handles both automatically.
//
// Zero API keys. Zero cost. No data leaves the browser.
// ─────────────────────────────────────────────────────────────────────────────

// ── Result returned to the caller
export interface SummaryResult {
  success:  boolean
  summary:  string
  error?:   string
}

// ── Summary box element ID
const SUMMARY_BOX_ID = "yuktai-summary-box"

// ─────────────────────────────────────────────────────────────────────────────
// getSummarizerAPI
// Returns the Summarizer API regardless of Chrome version.
// Chrome 147+: window.Summarizer
// Chrome 127–146: window.ai.summarizer
// ─────────────────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSummarizerAPI(): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  return w.Summarizer || w.ai?.summarizer || null
}

// ─────────────────────────────────────────────────────────────────────────────
// checkSummarizerSupport
// Returns true if Chrome Built-in AI Summarizer is available on this device.
// ─────────────────────────────────────────────────────────────────────────────
export async function checkSummarizerSupport(): Promise<boolean> {
  try {
    const API = getSummarizerAPI()
    if (!API) return false

    // Chrome 147+ uses availability()
    if (typeof API.availability === "function") {
      const status = await API.availability()
      return status === "readily" || status === "available" || status === "downloadable"
    }

    // Chrome 127–146 uses capabilities()
    if (typeof API.capabilities === "function") {
      const caps = await API.capabilities()
      return caps?.available !== "no"
    }

    return typeof API.create === "function"

  } catch {
    return false
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// getPageText
// Collects all visible text from the page into a single string.
// Skips scripts, styles, and yuktai's own panel.
// ─────────────────────────────────────────────────────────────────────────────
function getPageText(): string {
  const elements = document.querySelectorAll<HTMLElement>(
    "p, h1, h2, h3, h4, h5, h6, li, blockquote, article, section"
  )

  const texts: string[] = []

  for (const el of elements) {
    if (el.closest("[data-yuktai-panel]")) continue

    const style = window.getComputedStyle(el)
    if (style.display === "none" || style.visibility === "hidden") continue

    const text = el.innerText?.trim()
    if (text && text.length > 10) texts.push(text)
  }

  // Limit to 5000 chars to stay within AI context window
  return texts.join(" ").slice(0, 5000)
}

// ─────────────────────────────────────────────────────────────────────────────
// summarizePage
// Reads the full page text and generates a short 3-sentence summary.
// Injects the summary box at the top of the page for screen reader users.
// Called when user enables "Summarise page" in the panel.
// ─────────────────────────────────────────────────────────────────────────────
export async function summarizePage(): Promise<SummaryResult> {
  const supported = await checkSummarizerSupport()
  if (!supported) {
    return {
      success: false,
      summary: "",
      error:   "Chrome Built-in AI Summarizer not available. Enable via chrome://flags.",
    }
  }

  const pageText = getPageText()
  if (!pageText || pageText.length < 100) {
    return {
      success: false,
      summary: "",
      error:   "Not enough text on this page to summarise.",
    }
  }

  try {
    const API = getSummarizerAPI()
    if (!API) throw new Error("Summarizer API not available")

    // Create summarizer session
    // outputLanguage required in Chrome 147+
    const summarizer = await API.create({
      type:           "tl;dr",
      format:         "plain-text",
      length:         "short",
      outputLanguage: "en",
    })

    const summary = await summarizer.summarize(pageText, {
      context: "Summarise this page in 2-3 simple sentences for a screen reader user who wants to know if this page is relevant to them.",
    })

    summarizer.destroy()
    injectSummaryBox(summary.trim())

    return { success: true, summary: summary.trim() }

  } catch (error) {
    return {
      success: false,
      summary: "",
      error:   error instanceof Error ? error.message : "Summary failed",
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// injectSummaryBox
// Adds a teal banner at the top of the page with the summary text.
// Screen readers read this first — helps users decide if page is relevant.
// ─────────────────────────────────────────────────────────────────────────────
function injectSummaryBox(summary: string): void {
  removeSummaryBox()

  const box = document.createElement("div")
  box.id = SUMMARY_BOX_ID
  box.setAttribute("data-yuktai-panel", "true")
  box.setAttribute("role", "region")
  box.setAttribute("aria-label", "Page summary by yuktai")
  box.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9990;
    background: #0d9488;
    color: #ffffff;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    padding: 10px 20px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  `

  const text = document.createElement("p")
  text.style.cssText = "margin: 0; flex: 1;"
  text.textContent = `📋 Page summary: ${summary}`

  const close = document.createElement("button")
  close.textContent = "×"
  close.setAttribute("aria-label", "Close page summary")
  close.style.cssText = `
    background: none; border: none; color: #ffffff;
    font-size: 20px; cursor: pointer; padding: 0 4px;
    line-height: 1; flex-shrink: 0;
  `
  close.addEventListener("click", removeSummaryBox)

  box.appendChild(text)
  box.appendChild(close)
  document.body.prepend(box)
}

// ─────────────────────────────────────────────────────────────────────────────
// removeSummaryBox
// Removes the summary box. Called when toggle is turned off.
// ─────────────────────────────────────────────────────────────────────────────
export function removeSummaryBox(): void {
  const existing = document.getElementById(SUMMARY_BOX_ID)
  if (existing) existing.remove()
}