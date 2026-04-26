// ─────────────────────────────────────────────────────────────────────────────
// src/core/ai/rewriter.ts
// yuktai v2.0.19 — Yuktishaalaa AI Lab
//
// Plain English mode — rewrites complex page text into simple language.
//
// Chrome 147+ uses standalone globals: window.Rewriter
// Chrome 127–146 used: window.ai.rewriter
// This file handles both automatically.
//
// Zero API keys. Zero cost. No data leaves the browser.
// ─────────────────────────────────────────────────────────────────────────────

// ── Result returned to the caller
export interface RewriteResult {
  success:   boolean
  original:  string
  rewritten: string
  error?:    string
}

// ─────────────────────────────────────────────────────────────────────────────
// getRewriterAPI
// Returns the Rewriter API regardless of Chrome version.
// Chrome 147+: window.Rewriter
// Chrome 127–146: window.ai.rewriter
// ─────────────────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getRewriterAPI(): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  return w.Rewriter || w.ai?.rewriter || null
}

// ─────────────────────────────────────────────────────────────────────────────
// checkRewriterSupport
// Returns true if Chrome Built-in AI Rewriter is available on this device.
// ─────────────────────────────────────────────────────────────────────────────
export async function checkRewriterSupport(): Promise<boolean> {
  try {
    const API = getRewriterAPI()
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

    // Fallback — API exists, assume supported
    return typeof API.create === "function"

  } catch {
    return false
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// rewriteText
// Takes a single string and rewrites it in plain simple English.
// ─────────────────────────────────────────────────────────────────────────────
export async function rewriteText(text: string): Promise<RewriteResult> {
  if (!text || text.trim().length < 20) {
    return { success: false, original: text, rewritten: text, error: "Text too short" }
  }

  try {
    const API = getRewriterAPI()
    if (!API) throw new Error("Rewriter API not available")

    // Create rewriter session
    // outputLanguage required in Chrome 147+
    const rewriter = await API.create({
      tone:           "more-casual",
      format:         "plain-text",
      length:         "as-is",
      outputLanguage: "en",
    })

    const rewritten = await rewriter.rewrite(text, {
      context: "Rewrite this text in simple plain English. Use short sentences. Avoid jargon. Make it easy to understand for everyone.",
    })

    rewriter.destroy()

    return {
      success:   true,
      original:  text,
      rewritten: rewritten.trim(),
    }

  } catch (error) {
    return {
      success:   false,
      original:  text,
      rewritten: text,
      error:     error instanceof Error ? error.message : "Rewrite failed",
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// rewritePage
// Finds all paragraph and heading text on the page and rewrites them.
// Called when user enables "Plain English mode" in the panel.
// Only rewrites text — never changes structure, links, or ARIA attributes.
// ─────────────────────────────────────────────────────────────────────────────
export async function rewritePage(): Promise<{ fixed: number; error?: string }> {
  const supported = await checkRewriterSupport()
  if (!supported) {
    return { fixed: 0, error: "Chrome Built-in AI Rewriter not available. Enable via chrome://flags." }
  }

  const textElements = document.querySelectorAll<HTMLElement>(
    "p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption"
  )

  let fixed = 0

  for (const el of textElements) {
    const original = el.innerText?.trim()

    if (!original || original.length < 20) continue
    if (el.closest("[data-yuktai-panel]")) continue

    const result = await rewriteText(original)

    if (result.success && result.rewritten !== original) {
      el.dataset.yuktaiOriginal = original
      el.innerText = result.rewritten
      fixed++
    }
  }

  return { fixed }
}

// ─────────────────────────────────────────────────────────────────────────────
// restorePage
// Restores all original text when user turns off Plain English mode.
// ─────────────────────────────────────────────────────────────────────────────
export function restorePage(): void {
  const rewritten = document.querySelectorAll<HTMLElement>("[data-yuktai-original]")
  for (const el of rewritten) {
    const original = el.dataset.yuktaiOriginal
    if (original) {
      el.innerText = original
      delete el.dataset.yuktaiOriginal
    }
  }
}