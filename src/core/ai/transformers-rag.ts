// ─────────────────────────────────────────────────────────────────────────────
// src/core/ai/transformers-rag.ts
// yuktai v3.0.12 — Yuktishaalaa AI Lab
//
// Mobile RAG — fixed for all devices.
//
// Fixes in v3.0.12:
//   1. WebGPU detection was crashing on mobile — now safely falls back to wasm
//   2. Switched from DistilBERT (extractive) to flan-t5-small (generative)
//      DistilBERT only extracted short spans — "Akshar" instead of full answer
//      flan-t5-small generates full sentence answers like Gemini Nano
//   3. Context limit increased to 1500 chars for better answers
//   4. env.useBrowserCache guarded against SSR
//
// Works on:
//   ✅ Mobile Chrome (Android)
//   ✅ Mobile Safari (iOS)
//   ✅ Desktop Chrome / Firefox / Edge
//   ✅ PWA offline (after first model load)
//
// Models:
//   Embeddings: Xenova/all-MiniLM-L6-v2 (~23MB)
//   QA:         Xenova/flan-t5-small (~80MB) — generative, full sentence answers
//
// Zero API keys. Zero cost. No data leaves the browser.
// ─────────────────────────────────────────────────────────────────────────────

export interface RagResult {
  success: boolean
  answer:  string
  error?:  string
}

// ── Module-level cache — loaded once per session
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let embeddingPipeline: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let generativePipeline: any = null
let modelsLoading           = false
let modelsLoaded            = false

// ─────────────────────────────────────────────────────────────────────────────
// safeDevice — returns "webgpu" if supported, "wasm" otherwise
// ── FIX: "gpu" in navigator was crashing on mobile Safari and Android
// ─────────────────────────────────────────────────────────────────────────────
function safeDevice(): string {
  try {
    if (
      typeof navigator !== "undefined" &&
      "gpu" in navigator &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any).gpu !== undefined
    ) {
      return "webgpu"
    }
  } catch { /* ignore */ }
  return "wasm"
}

// ─────────────────────────────────────────────────────────────────────────────
// loadModels — downloads and caches models on first call
// ─────────────────────────────────────────────────────────────────────────────
async function loadModels(): Promise<void> {
  if (modelsLoaded) return
  if (modelsLoading) {
    while (modelsLoading) await new Promise(r => setTimeout(r, 200))
    return
  }

  modelsLoading = true

  try {
    const { pipeline, env } = await import("@huggingface/transformers")

    env.allowRemoteModels = true
    env.allowLocalModels  = false

    // ── FIX: guard against SSR / server context ──
    if (typeof window !== "undefined" && typeof caches !== "undefined") {
      env.useBrowserCache = true
    } else {
      env.useBrowserCache = false
    }

    const device = safeDevice()
    console.log("yuktai: Transformers.js using device:", device)

    // Embedding model — converts text to semantic vectors
    embeddingPipeline = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      { device }
    )

    // ── FIX: switched from DistilBERT to flan-t5-small ──
    // DistilBERT is extractive — only returns short spans like "Akshar"
    // flan-t5-small is generative — returns full sentence answers
    generativePipeline = await pipeline(
      "text2text-generation",
      "Xenova/flan-t5-small",
      { device }
    )

    modelsLoaded  = true
    modelsLoading = false
    console.log("yuktai: Transformers.js models loaded ✅")

  } catch (err) {
    modelsLoading = false
    console.error("yuktai: Transformers.js model load failed", err)
    throw err
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// waitForContent — waits for React/SPA dynamic content to render
// ─────────────────────────────────────────────────────────────────────────────
function waitForContent(): Promise<void> {
  return new Promise(resolve => {
    let timeout = setTimeout(resolve, 1500)
    const observer = new MutationObserver(() => {
      clearTimeout(timeout)
      timeout = setTimeout(() => { observer.disconnect(); resolve() }, 500)
    })
    observer.observe(document.body, { childList: true, subtree: true })
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// getPageText — collects all visible text, skips yuktai panel
// ─────────────────────────────────────────────────────────────────────────────
function getPageText(): string {
  const texts: string[] = []
  const seen  = new Set<string>()

  // ── ALL possible text-bearing DOM elements ──
  const elements = document.querySelectorAll<HTMLElement>(`
    p, h1, h2, h3, h4, h5, h6,
    li, ul, ol, dl, dt, dd,
    td, th, tr, caption,
    blockquote, q, cite,
    figcaption, figure,
    label, legend, fieldset,
    span, a, b, strong, em, i, u, s, mark, small,
    abbr, acronym, dfn, code, pre, kbd, samp, var,
    article, section, main, aside, nav, header, footer,
    div, button, summary, details,
    time, address, bdi, bdo,
    ins, del, sub, sup,
    title, caption
  `)

  for (const el of elements) {
    // Skip yuktai panel — never read our own UI
    if (el.closest("[data-yuktai-panel]")) continue

    // Skip hidden elements
    const style = window.getComputedStyle(el)
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") continue

    // Skip elements that have block children — avoids parent duplicating child text
    const hasBlockChild = el.querySelector("p, h1, h2, h3, h4, h5, h6, li, td, div, article, section")
    if (hasBlockChild) continue

    const text = el.innerText?.trim()
    if (!text || text.length < 15) continue

    if (seen.has(text)) continue
    seen.add(text)
    texts.push(text)

    // aria-label
    const aria = el.getAttribute("aria-label")?.trim()
    if (aria && aria.length > 8 && aria !== text && !seen.has(aria)) {
      seen.add(aria)
      texts.push(aria)
    }

    // aria-description
    const ariaDesc = el.getAttribute("aria-description")?.trim()
    if (ariaDesc && ariaDesc.length > 8 && !seen.has(ariaDesc)) {
      seen.add(ariaDesc)
      texts.push(ariaDesc)
    }

    // title attribute
    const title = el.getAttribute("title")?.trim()
    if (title && title.length > 8 && title !== text && !seen.has(title)) {
      seen.add(title)
      texts.push(title)
    }

    // alt text on images inside element
    el.querySelectorAll<HTMLImageElement>("img").forEach(img => {
      const alt = img.getAttribute("alt")?.trim()
      if (alt && alt.length > 8 && !seen.has(alt)) {
        seen.add(alt)
        texts.push(alt)
      }
    })
  }

  // ── Inputs and textareas — placeholders + values ──
  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
    "input, textarea"
  ).forEach(el => {
    if (el.closest("[data-yuktai-panel]")) return
    if (el.placeholder && !seen.has(el.placeholder)) {
      seen.add(el.placeholder)
      texts.push(el.placeholder)
    }
    if (el.value && el.value.length > 10 && !seen.has(el.value)) {
      seen.add(el.value)
      texts.push(el.value)
    }
  })

  // ── Select options ──
  document.querySelectorAll<HTMLSelectElement>("select").forEach(el => {
    if (el.closest("[data-yuktai-panel]")) return
    Array.from(el.options).forEach(opt => {
      const optText = opt.text?.trim()
      if (optText && optText.length > 5 && !seen.has(optText)) {
        seen.add(optText)
        texts.push(optText)
      }
    })
  })

  // ── Meta tags — page description and keywords ──
  document.querySelectorAll<HTMLMetaElement>(
    'meta[name="description"], meta[name="keywords"], meta[property="og:title"], meta[property="og:description"]'
  ).forEach(meta => {
    const content = meta.getAttribute("content")?.trim()
    if (content && content.length > 10 && !seen.has(content)) {
      seen.add(content)
      texts.push(content)
    }
  })

  // ── Document title ──
  const docTitle = document.title?.trim()
  if (docTitle && !seen.has(docTitle)) {
    seen.add(docTitle)
    texts.unshift(docTitle) // put title first — most important
  }

  return texts.join(" ").slice(0, 8000)
}

// ─────────────────────────────────────────────────────────────────────────────
// chunkText — splits page text into overlapping chunks
// ─────────────────────────────────────────────────────────────────────────────
function chunkText(text: unknown, chunkSize = 200, overlap = 50): string[] {
  if (typeof text !== "string") {
    try { text = String(text ?? "") } catch { return [] }
  }
  const str = (text as string).trim()
  if (!str) return []

  const safeOverlap = Math.min(overlap, Math.floor(chunkSize / 2))
  const words       = str.split(/\s+/)
  const chunks: string[] = []
  const step = chunkSize - safeOverlap

  for (let i = 0; i < words.length; i += step) {
    const chunk = words.slice(i, i + chunkSize).join(" ")
    if (chunk.trim().length > 20) chunks.push(chunk)
  }

  return chunks
}

// ─────────────────────────────────────────────────────────────────────────────
// cosineSimilarity
// ─────────────────────────────────────────────────────────────────────────────
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0
  for (let i = 0; i < a.length; i++) {
    dot   += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-8)
}

// ─────────────────────────────────────────────────────────────────────────────
// embed — converts text to a semantic vector
// ─────────────────────────────────────────────────────────────────────────────
async function embed(text: string): Promise<number[]> {
  const output = await embeddingPipeline(text, { pooling: "mean", normalize: true })
  const data   = output?.data ?? output
  return Array.from(data as Float32Array)
}

// ─────────────────────────────────────────────────────────────────────────────
// findRelevantChunks — semantic search for top N most relevant chunks
// ─────────────────────────────────────────────────────────────────────────────
async function findRelevantChunks(
  question: string,
  chunks:   string[],
  topN = 5
): Promise<string[]> {
  const questionVector = await embed(question)

  const scored = await Promise.all(
    chunks.map(async chunk => {
      const chunkVector = await embed(chunk)
      const score       = cosineSimilarity(questionVector, chunkVector)
      return { chunk, score }
    })
  )

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, topN).map(s => s.chunk)
}

// ─────────────────────────────────────────────────────────────────────────────
// askPageWithTransformers — main RAG function
// ─────────────────────────────────────────────────────────────────────────────
export async function askPageWithTransformers(
  question: string
): Promise<RagResult> {
  if (!question.trim()) {
    return { success: false, answer: "", error: "Please type a question." }
  }

  try {
    await loadModels()
    await waitForContent()

    const pageText = getPageText()
    if (!pageText || pageText.length < 50) {
      return { success: false, answer: "", error: "Not enough content on this page." }
    }

    const chunks = chunkText(pageText)
    if (chunks.length === 0) {
      return { success: false, answer: "", error: "Could not process page content." }
    }

    // ── FIX: increased to 5 chunks, join cleanly, limit to 1500 chars ──
    const relevantChunks = await findRelevantChunks(question, chunks, 5)
    const context        = relevantChunks.join(" ").slice(0, 1500)

    // ── FIX: use flan-t5-small with structured prompt for full answers ──
    const prompt = `Answer the question based on the context below. Give a complete and helpful answer in 2-3 sentences.

Context: ${context}

Question: ${question}

Answer:`

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: any[] = await generativePipeline(prompt, {
      max_new_tokens: 150,
      min_new_tokens: 10,
    })

    const answer = results?.[0]?.generated_text?.trim() || ""

    if (!answer || answer.length === 0) {
      return { success: true, answer: "I could not find a specific answer on this page." }
    }

    return { success: true, answer }

  } catch (error) {
    console.error("yuktai: Transformers RAG error", error)
    return {
      success: false,
      answer:  "",
      error:   error instanceof Error ? error.message : "Transformers.js error.",
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// isTransformersSupported
// ─────────────────────────────────────────────────────────────────────────────
export function isTransformersSupported(): boolean {
  try {
    return typeof WebAssembly !== "undefined" && typeof Worker !== "undefined"
  } catch {
    return false
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// getModelLoadStatus
// ─────────────────────────────────────────────────────────────────────────────
export function getModelLoadStatus(): "idle" | "loading" | "ready" {
  if (modelsLoaded)  return "ready"
  if (modelsLoading) return "loading"
  return "idle"
}