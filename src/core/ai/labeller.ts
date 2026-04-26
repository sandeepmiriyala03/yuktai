// ─────────────────────────────────────────────────────────────────────────────
// src/core/ai/labeller.ts
// yuktai v2.0.19 — Yuktishaalaa AI Lab
//
// Smart aria-labels — generates meaningful labels for unlabelled elements.
//
// Chrome 147+ uses standalone globals: window.Writer
// Chrome 127–146 used: window.ai.writer
// This file handles both automatically.
//
// Zero API keys. Zero cost. No data leaves the browser.
// ─────────────────────────────────────────────────────────────────────────────

// ── Result returned to the caller
export interface LabelResult {
  success:  boolean
  fixed:    number
  elements: { tag: string; label: string }[]
  error?:   string
}

// ── Elements that commonly have missing aria-labels
const UNLABELLED_SELECTORS = [
  "button:not([aria-label]):not([aria-labelledby])",
  "a:not([aria-label]):not([aria-labelledby])",
  "input:not([aria-label]):not([aria-labelledby]):not([id])",
  "select:not([aria-label]):not([aria-labelledby])",
  "textarea:not([aria-label]):not([aria-labelledby])",
  "[role='button']:not([aria-label])",
  "[role='link']:not([aria-label])",
  "[role='checkbox']:not([aria-label])",
  "[role='tab']:not([aria-label])",
].join(", ")

// ─────────────────────────────────────────────────────────────────────────────
// getWriterAPI
// Returns the Writer API regardless of Chrome version.
// Chrome 147+: window.Writer
// Chrome 127–146: window.ai.writer
// ─────────────────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getWriterAPI(): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  return w.Writer || w.ai?.writer || null
}

// ─────────────────────────────────────────────────────────────────────────────
// checkLabellerSupport
// Returns true if Chrome Built-in AI Writer is available on this device.
// ─────────────────────────────────────────────────────────────────────────────
export async function checkLabellerSupport(): Promise<boolean> {
  try {
    const API = getWriterAPI()
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
// getElementContext
// Reads surrounding context of an element to help AI generate a good label.
// ─────────────────────────────────────────────────────────────────────────────
function getElementContext(el: HTMLElement): string {
  const parts: string[] = []

  const innerText = el.innerText?.trim()
  if (innerText) parts.push(`element text: "${innerText}"`)

  const placeholder = (el as HTMLInputElement).placeholder?.trim()
  if (placeholder) parts.push(`placeholder: "${placeholder}"`)

  const name = el.getAttribute("name")?.trim()
  if (name) parts.push(`name: "${name}"`)

  const type = el.getAttribute("type")?.trim()
  if (type) parts.push(`type: "${type}"`)

  const id = el.id
  if (id) {
    const label = document.querySelector<HTMLElement>(`label[for="${id}"]`)
    if (label) parts.push(`label: "${label.innerText?.trim()}"`)
  }

  const parentText = el.parentElement?.innerText?.trim().slice(0, 60)
  if (parentText) parts.push(`parent context: "${parentText}"`)

  parts.push(`tag: ${el.tagName.toLowerCase()}`)

  const role = el.getAttribute("role")
  if (role) parts.push(`role: ${role}`)

  return parts.join(". ")
}

// ─────────────────────────────────────────────────────────────────────────────
// generateLabel
// Sends element context to Chrome AI and gets a short meaningful label back.
// ─────────────────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function generateLabel(writer: any, context: string): Promise<string> {
  const prompt = `
    Generate a short, clear aria-label for an HTML element.
    The label must be 2-6 words maximum.
    The label must describe what the element does or what it is.
    Do not include punctuation.
    Do not explain — just output the label text only.

    Element details:
    ${context}

    Output only the label. Nothing else.
  `.trim()

  const result = await writer.write(prompt)

  return result
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\.$/, "")
    .trim()
}

// ─────────────────────────────────────────────────────────────────────────────
// applySmartLabels
// Finds all unlabelled interactive elements on the page.
// Generates meaningful aria-labels using Chrome Built-in AI.
// Called when user enables "Smart aria-labels" in the panel.
// ─────────────────────────────────────────────────────────────────────────────
export async function applySmartLabels(): Promise<LabelResult> {
  const supported = await checkLabellerSupport()
  if (!supported) {
    return {
      success:  false,
      fixed:    0,
      elements: [],
      error:    "Chrome Built-in AI Writer not available. Enable via chrome://flags.",
    }
  }

  const elements = document.querySelectorAll<HTMLElement>(UNLABELLED_SELECTORS)

  if (elements.length === 0) {
    return { success: true, fixed: 0, elements: [] }
  }

  try {
    const API = getWriterAPI()
    if (!API) throw new Error("Writer API not available")

    // Create one writer session for all elements
    // outputLanguage required in Chrome 147+
    const writer = await API.create({
      tone:           "neutral",
      format:         "plain-text",
      length:         "short",
      outputLanguage: "en",
    })

    let fixed = 0
    const labelledElements: { tag: string; label: string }[] = []

    for (const el of elements) {
      if (el.closest("[data-yuktai-panel]")) continue

      const style = window.getComputedStyle(el)
      if (style.display === "none" || style.visibility === "hidden") continue

      const context = getElementContext(el)
      const label   = await generateLabel(writer, context)

      if (label && label.length > 0) {
        el.dataset.yuktaiLabelOriginal = el.getAttribute("aria-label") || ""
        el.setAttribute("aria-label", label)
        fixed++
        labelledElements.push({ tag: el.tagName.toLowerCase(), label })
      }
    }

    writer.destroy()

    return { success: true, fixed, elements: labelledElements }

  } catch (error) {
    return {
      success:  false,
      fixed:    0,
      elements: [],
      error:    error instanceof Error ? error.message : "Label generation failed",
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// removeSmartLabels
// Removes all AI-generated labels and restores original state.
// Called when user turns off Smart aria-labels toggle.
// ─────────────────────────────────────────────────────────────────────────────
export function removeSmartLabels(): void {
  const labelled = document.querySelectorAll<HTMLElement>("[data-yuktai-label-original]")

  for (const el of labelled) {
    const original = el.dataset.yuktaiLabelOriginal
    if (original) {
      el.setAttribute("aria-label", original)
    } else {
      el.removeAttribute("aria-label")
    }
    delete el.dataset.yuktaiLabelOriginal
  }
}