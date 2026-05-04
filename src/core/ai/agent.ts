// ─────────────────────────────────────────────────────────────────────────────
// src/core/ai/agent.ts
// yuktai v3.1.0 — Yuktishaalaa AI Lab
//
// Full DOM coverage — works on:
//   ✅ React / Next.js / Vue / Angular (SPA)
//   ✅ Static HTML pages
//   ✅ WordPress / Drupal / Joomla
//   ✅ Government portals (old HTML tables)
//   ✅ Hospital / bank portals
//   ✅ Plain HTML — no framework
// ─────────────────────────────────────────────────────────────────────────────

export interface AgentStep {
  text: string
  type: "info" | "action" | "success" | "error" | "field"
}

export interface AgentResult {
  success: boolean
  steps:   AgentStep[]
  error?:  string
}

export interface FormField {
  label:       string
  type:        string
  placeholder: string
  required:    boolean
  element:     HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
}

// ─────────────────────────────────────────────────────────────────────────────
// isVisible — checks if element is actually visible to user
// ─────────────────────────────────────────────────────────────────────────────
function isVisible(el: HTMLElement): boolean {
  try {
    const style = window.getComputedStyle(el)
    if (style.display     === "none")    return false
    if (style.visibility  === "hidden")  return false
    if (style.opacity     === "0")       return false
    if ((el as HTMLElement).hidden)      return false
    // Check bounding box — zero size = not visible
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) return false
    return true
  } catch {
    return true // assume visible if check fails
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// getPageText — comprehensive DOM text extraction
// Covers static HTML, SPAs, WordPress, government portals
// ─────────────────────────────────────────────────────────────────────────────
export function getPageText(): string {
  const texts: string[] = []
  const seen  = new Set<string>()

  const push = (text: string) => {
    const t = text.trim()
    if (t && t.length > 10 && !seen.has(t)) {
      seen.add(t)
      texts.push(t)
    }
  }

  // ── 1. Document title — most important ──
  if (document.title) push(document.title)

  // ── 2. Meta tags — static pages rely heavily on these ──
  const metas = [
    'meta[name="description"]',
    'meta[name="keywords"]',
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    'meta[name="twitter:title"]',
    'meta[name="twitter:description"]',
  ]
  for (const sel of metas) {
    const content = document.querySelector<HTMLMetaElement>(sel)?.getAttribute("content")
    if (content) push(content)
  }

  // ── 3. All text-bearing elements — widest possible selector ──
  // Static pages use font, center, marquee, etc.
  const textSelectors = [
    // Headings
    "h1", "h2", "h3", "h4", "h5", "h6",
    // Paragraphs and text blocks
    "p", "blockquote", "q", "pre", "code",
    // Lists
    "li", "dt", "dd",
    // Tables — government portals use tables heavily
    "th", "td", "caption",
    // Links and inline
    "a", "b", "strong", "em", "i", "u", "s",
    "abbr", "acronym", "cite", "dfn",
    "mark", "small", "sub", "sup",
    "ins", "del", "bdi", "bdo",
    // Semantic HTML5
    "article", "section", "aside", "nav",
    "header", "footer", "main",
    "summary", "details",
    "figcaption", "figure", "address",
    "time", "output",
    // Forms
    "label", "legend", "option",
    // Buttons
    "button",
    // Old/static HTML tags
    "font", "center", "span", "div",
    // Custom elements fallback
    "[role='heading']",
    "[role='main']",
    "[role='article']",
    "[role='region']",
    "[role='complementary']",
    "[role='contentinfo']",
    "[role='navigation']",
    "[role='banner']",
    "[role='listitem']",
    "[role='cell']",
    "[role='columnheader']",
    "[role='rowheader']",
  ]

  const allElements = document.querySelectorAll<HTMLElement>(textSelectors.join(","))

  for (const el of allElements) {
    // Skip yuktai panel
    if (el.closest("[data-yuktai-panel]")) continue

    // Skip invisible elements
    if (!isVisible(el)) continue

    // Skip if has block children — avoids parent duplicating child text
    const hasBlockChild = el.querySelector(
      "p, h1, h2, h3, h4, h5, h6, li, td, th, div, article, section, blockquote, pre"
    )
    if (hasBlockChild) continue

    // innerText — works for visible rendered text
    const text = el.innerText?.trim()
    if (text && text.length > 10) push(text)

    // textContent fallback — for elements where innerText may be empty
    if (!text) {
      const tc = el.textContent?.trim()
      if (tc && tc.length > 10) push(tc)
    }

    // ARIA attributes — important for accessibility sites
    const ariaLabel = el.getAttribute("aria-label")?.trim()
    if (ariaLabel && ariaLabel.length > 5) push(ariaLabel)

    const ariaDesc = el.getAttribute("aria-description")?.trim()
    if (ariaDesc && ariaDesc.length > 5) push(ariaDesc)

    const ariaValue = el.getAttribute("aria-valuetext")?.trim()
    if (ariaValue) push(ariaValue)

    // title attribute — static pages use this a lot
    const title = el.getAttribute("title")?.trim()
    if (title && title.length > 5) push(title)

    // data-* attributes that may contain text
    const dataLabel = el.getAttribute("data-label")?.trim()
    if (dataLabel) push(dataLabel)

    const dataTitle = el.getAttribute("data-title")?.trim()
    if (dataTitle) push(dataTitle)

    // alt text on images inside the element
    el.querySelectorAll<HTMLImageElement>("img").forEach(img => {
      const alt = img.getAttribute("alt")?.trim()
      if (alt && alt.length > 5) push(alt)
      const imgTitle = img.getAttribute("title")?.trim()
      if (imgTitle && imgTitle.length > 5) push(imgTitle)
    })
  }

  // ── 4. Images directly — static pages have lots of meaningful images ──
  document.querySelectorAll<HTMLImageElement>("img").forEach(img => {
    if (img.closest("[data-yuktai-panel]")) return
    if (!isVisible(img)) return
    const alt   = img.getAttribute("alt")?.trim()
    const title = img.getAttribute("title")?.trim()
    if (alt   && alt.length > 5)   push(alt)
    if (title && title.length > 5) push(title)
  })

  // ── 5. Input placeholders + values — forms on static pages ──
  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
    "input:not([type=hidden]), textarea"
  ).forEach(el => {
    if (el.closest("[data-yuktai-panel]")) return
    if (!isVisible(el as HTMLElement)) return
    if (el.placeholder) push(el.placeholder)
    if (el.value && el.value.length > 3) push(el.value)
    const ariaLabel = el.getAttribute("aria-label")?.trim()
    if (ariaLabel) push(ariaLabel)
  })

  // ── 6. Select options — dropdown content ──
  document.querySelectorAll<HTMLSelectElement>("select").forEach(el => {
    if (el.closest("[data-yuktai-panel]")) return
    if (!isVisible(el as HTMLElement)) return
    Array.from(el.options).forEach(opt => {
      if (opt.text?.trim().length > 3) push(opt.text.trim())
    })
  })

  // ── 7. Table data — government portals are table-heavy ──
  document.querySelectorAll<HTMLTableCellElement>("td, th").forEach(cell => {
    if (cell.closest("[data-yuktai-panel]")) return
    if (!isVisible(cell)) return
    const text = cell.innerText?.trim()
    if (text && text.length > 3) push(text)
  })

  // ── 8. iframes — some static portals use iframes ──
  // Note: only accessible if same-origin
  try {
    document.querySelectorAll<HTMLIFrameElement>("iframe").forEach(iframe => {
      try {
        const iDoc = iframe.contentDocument
        if (!iDoc) return
        const iText = iDoc.body?.innerText?.trim()
        if (iText && iText.length > 20) push(iText.slice(0, 500))
      } catch { /* cross-origin — skip */ }
    })
  } catch { /* ignore */ }

  // ── 9. Link text — navigation structure ──
  document.querySelectorAll<HTMLAnchorElement>("a").forEach(a => {
    if (a.closest("[data-yuktai-panel]")) return
    if (!isVisible(a)) return
    const text = a.innerText?.trim()
    if (text && text.length > 3 && text.length < 100) push(text)
  })

  return texts.join(" ").slice(0, 5000)
}

// ─────────────────────────────────────────────────────────────────────────────
// getFieldLabel — finds the best label for a form field
// Covers all label strategies used in static + modern pages
// ─────────────────────────────────────────────────────────────────────────────
function getFieldLabel(
  el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
): string {
  // 1. aria-label — most reliable
  const aria = el.getAttribute("aria-label")?.trim()
  if (aria) return aria

  // 2. aria-labelledby — points to another element
  const labelledBy = el.getAttribute("aria-labelledby")
  if (labelledBy) {
    const labelEl = document.getElementById(labelledBy)
    if (labelEl) return labelEl.innerText?.trim() || ""
  }

  // 3. <label for="id"> — standard HTML
  if (el.id) {
    const labelEl = document.querySelector<HTMLLabelElement>(`label[for="${el.id}"]`)
    if (labelEl) return labelEl.innerText?.trim() || ""
  }

  // 4. Wrapping <label> — label wraps the input
  const parentLabel = el.closest("label")
  if (parentLabel) {
    const clone = parentLabel.cloneNode(true) as HTMLElement
    clone.querySelectorAll("input, select, textarea").forEach(n => n.remove())
    return clone.innerText?.trim() || ""
  }

  // 5. placeholder — common in modern forms
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    if (el.placeholder) return el.placeholder
  }

  // 6. name attribute — fallback for old static forms
  if (el.name) return el.name.replace(/[_-]/g, " ")

  // 7. Preceding sibling text — some static pages put label as text node
  const prev = el.previousSibling
  if (prev?.nodeType === Node.TEXT_NODE) {
    const text = prev.textContent?.trim()
    if (text && text.length > 1) return text
  }

  // 8. Preceding element text — td before input in table forms
  const prevEl = el.previousElementSibling as HTMLElement | null
  if (prevEl) {
    const text = prevEl.innerText?.trim()
    if (text && text.length > 1 && text.length < 60) return text
  }

  // 9. Parent td/th text — government table forms
  const parentCell = el.closest("td, th") as HTMLElement | null
  if (parentCell) {
    const prevCell = parentCell.previousElementSibling as HTMLElement | null
    if (prevCell) {
      const text = prevCell.innerText?.trim()
      if (text && text.length > 1) return text
    }
  }

  // 10. title attribute
  const title = el.getAttribute("title")?.trim()
  if (title) return title

  // 11. type as last resort
  return el instanceof HTMLInputElement ? el.type : "field"
}

// ─────────────────────────────────────────────────────────────────────────────
// scanFormFields — finds ALL visible form fields
// Covers static HTML forms, table-based forms, modern forms
// ─────────────────────────────────────────────────────────────────────────────
export function scanFormFields(): FormField[] {
  const fields: FormField[] = []

  const inputs = document.querySelectorAll<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >([
    "input:not([type=hidden])",
    "input:not([type=submit])",
    "input:not([type=button])",
    "input:not([type=reset])",
    "input:not([type=image])",
    "select",
    "textarea",
    "[contenteditable='true']",
    "[role='textbox']",
    "[role='combobox']",
    "[role='spinbutton']",
    "[role='searchbox']",
    "[role='listbox']",
  ].join(", "))

  for (const el of inputs) {
    if (el.closest("[data-yuktai-panel]")) continue
    if (!isVisible(el as HTMLElement)) continue

    // Skip submit/button/reset inputs
    if (el instanceof HTMLInputElement) {
      const type = el.type.toLowerCase()
      if (["submit", "button", "reset", "image"].includes(type)) continue
    }

    const label = getFieldLabel(el as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)

    fields.push({
      label,
      type:        el instanceof HTMLInputElement ? el.type : el.tagName.toLowerCase(),
      placeholder: (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)
        ? el.placeholder || ""
        : "",
      required:    (el as HTMLInputElement).required ||
                   el.getAttribute("aria-required") === "true" ||
                   el.getAttribute("data-required") === "true",
      element:     el as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
    })
  }

  return fields
}

// ─────────────────────────────────────────────────────────────────────────────
// highlightField
// ─────────────────────────────────────────────────────────────────────────────
export function highlightField(
  el:         HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  durationMs = 3000
): void {
  el.scrollIntoView({ behavior: "smooth", block: "center" })
  el.style.outline       = "3px solid #0d9488"
  el.style.outlineOffset = "3px"
  try { el.focus() } catch { /* ignore */ }
  setTimeout(() => {
    el.style.outline       = ""
    el.style.outlineOffset = ""
  }, durationMs)
}

// ─────────────────────────────────────────────────────────────────────────────
// scrollToSection — finds section by keyword
// ─────────────────────────────────────────────────────────────────────────────
export function scrollToSection(keyword: string): boolean {
  const lower = keyword.toLowerCase()

  // All possible heading and landmark elements
  const candidates = document.querySelectorAll<HTMLElement>(
    "h1, h2, h3, h4, h5, h6, section, article, [id], [aria-label], [role='heading'], [role='region']"
  )

  for (const el of candidates) {
    if (el.closest("[data-yuktai-panel]")) continue
    if (!isVisible(el)) continue

    const text = (
      el.innerText ||
      el.getAttribute("id") ||
      el.getAttribute("aria-label") ||
      el.getAttribute("name") ||
      ""
    ).toLowerCase()

    if (text.includes(lower)) {
      el.scrollIntoView({ behavior: "smooth", block: "center" })
      el.style.outline       = "2px solid #0d9488"
      el.style.outlineOffset = "4px"
      setTimeout(() => {
        el.style.outline       = ""
        el.style.outlineOffset = ""
      }, 2500)
      return true
    }
  }
  return false
}

// ─────────────────────────────────────────────────────────────────────────────
// planWithGeminiNano
// ─────────────────────────────────────────────────────────────────────────────
async function planWithGeminiNano(
  pageText:  string,
  task:      string,
  hasFields: boolean
): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w   = window as any
  const API = w.LanguageModel || w.ai?.languageModel
  if (!API) throw new Error("Gemini Nano not available")

  const session = await API.create({
    systemPrompt: `You are a helpful web accessibility agent.
Create a simple action plan to help a user complete a task on a webpage.
Rules:
- Maximum 5 steps
- Short and clear — no jargon
- If filling a form — list each field and what to enter
- No markdown — no asterisks, no bold, no headers
- Number each step: 1. 2. 3.`,
  })

  const formNote = hasFields ? `\nThe page has form fields the user may need to fill.` : ""
  const prompt   = `Page content: ${pageText}${formNote}\n\nUser task: ${task}\n\nAction plan:`
  const answer   = await session.prompt(prompt)
  session.destroy()
  return answer?.trim() || ""
}

// ─────────────────────────────────────────────────────────────────────────────
// planWithTransformers — mobile fallback
// ─────────────────────────────────────────────────────────────────────────────
async function planWithTransformers(
  pageText: string,
  task:     string
): Promise<string> {
  const { askPageWithTransformers } = await import("./transformers-rag")
  const r = await askPageWithTransformers(`How do I: ${task}`)
  return r.answer || "I could not create a plan for this task."
}

// ─────────────────────────────────────────────────────────────────────────────
// runAgent — main exported function
// ─────────────────────────────────────────────────────────────────────────────
export async function runAgent(
  task:   string,
  engine: "gemini" | "transformers" | null,
  onStep: (step: AgentStep) => void
): Promise<AgentResult> {

  if (!task.trim()) {
    return { success: false, steps: [], error: "Please tell me what you want to do." }
  }
  if (!engine) {
    return { success: false, steps: [], error: "No AI engine available on this device." }
  }

  const steps: AgentStep[] = []
  const addStep = (text: string, type: AgentStep["type"] = "info") => {
    const s = { text, type }
    steps.push(s)
    onStep(s)
  }

  try {

    // ── 1. Read page ──
    addStep("📖 Reading page content...", "info")
    const pageText  = getPageText()
    const fields    = scanFormFields()
    const hasFields = fields.length > 0

    if (pageText.length < 50) {
      addStep("⚠️ Page content is very limited. This may be a static image page.", "error")
    }

    if (hasFields) {
      addStep(`📋 Found ${fields.length} form field${fields.length !== 1 ? "s" : ""} on this page`, "info")
    } else {
      addStep("📄 No form fields found — this appears to be a content page", "info")
    }

    // ── 2. Create AI plan ──
    addStep("🤖 Creating action plan...", "info")
    let planText = ""

    try {
      if (engine === "gemini") {
        planText = await planWithGeminiNano(pageText, task, hasFields)
      } else {
        planText = await planWithTransformers(pageText, task)
      }
    } catch {
      // Rule-based fallback — no AI needed
      planText = hasFields
        ? "1. Locate the form on this page\n2. Fill each required field\n3. Review your answers\n4. Submit the form"
        : "1. Read the page carefully\n2. Find the section relevant to your task\n3. Follow the on-page instructions"
    }

    // ── 3. Show plan ──
    if (planText) {
      addStep("✅ Your action plan:", "success")
      planText
        .split(/\n/)
        .map(l => l.replace(/\*\*/g, "").replace(/\*/g, "").trim())
        .filter(l => l.length > 5)
        .slice(0, 6)
        .forEach(line => addStep(`   ${line}`, "action"))
    }

    // ── 4. Execute ──
    if (hasFields) {
      // Highlight first field
      const first = fields[0]
      addStep(`🎯 First field: "${first.label}"${first.required ? " ★ required" : ""}`, "field")
      highlightField(first.element)

      // Show all field names
      if (fields.length > 1) {
        addStep(`📝 All ${fields.length} fields: ${fields.map(f => f.label).join(" → ")}`, "info")
      }

    } else {
      // Scroll to relevant section
      const keywords = task.toLowerCase().split(/\s+/).filter(w => w.length > 3)
      let scrolled   = false
      for (const kw of keywords) {
        if (scrollToSection(kw)) {
          addStep(`🎯 Scrolled to relevant section: "${kw}"`, "action")
          scrolled = true
          break
        }
      }
      if (!scrolled) {
        addStep("💡 Scroll through the page to find what you need.", "info")
      }
    }

    // ── 5. Done ──
    addStep("✅ Ready. Follow the steps above. Ask me again if you need more help.", "success")
    return { success: true, steps }

  } catch (error) {
    const msg = error instanceof Error ? error.message : "Agent error."
    addStep(`⚠️ ${msg}`, "error")
    return { success: false, steps, error: msg }
  }
}