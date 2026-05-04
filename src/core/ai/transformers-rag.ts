// ─────────────────────────────────────────────────────────────────────────────
// src/core/ai/transformers-rag.ts
// yuktai v3.0.9 — Yuktishaalaa AI Lab
//
// Mobile RAG — Ask any question about the current page.
// Uses @huggingface/transformers — runs entirely in the browser.
//
// Works on:
//   ✅ Mobile Chrome (Android)
//   ✅ Mobile Safari (iOS)
//   ✅ Desktop Chrome (any browser without Gemini Nano)
//   ✅ Firefox, Edge, Samsung Internet
//   ✅ PWA offline (after first model load ~90MB)
//
// AI concept — RAG (Retrieval Augmented Generation):
//   1. Page text collected and split into chunks
//   2. Each chunk converted to vector (embedding)
//   3. Question converted to vector
//   4. Cosine similarity finds most relevant chunks
//   5. QA model answers from relevant chunks only
//
// Models:
//   Embeddings: Xenova/all-MiniLM-L6-v2 (~23MB)
//   QA:         Xenova/distilbert-base-cased-distilled-squad (~67MB)
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
let qaPipeline:        any = null
let modelsLoading          = false
let modelsLoaded           = false

// ─────────────────────────────────────────────────────────────────────────────
// loadModels — downloads and caches models in browser on first call
// ─────────────────────────────────────────────────────────────────────────────
async function loadModels(): Promise<void> {
  if (modelsLoaded) return
  if (modelsLoading) {
    while (modelsLoading) await new Promise(r => setTimeout(r, 200))
    return
  }

  modelsLoading = true

  try {
    // ── FIXED: use @huggingface/transformers not @xenova/transformers ──
    // @xenova/transformers is deprecated. Use @huggingface/transformers v3+
    const { pipeline, env } = await import("@huggingface/transformers")

    // Allow model downloads from Hugging Face CDN
    env.allowRemoteModels  = true
    env.allowLocalModels   = false
    env.useBrowserCache    = true   // cache models in IndexedDB after first load

    // Embedding model — converts text to semantic vectors
    embeddingPipeline = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      {
        // Use WebGPU if available for speed, fallback to WASM/CPU
        device: typeof navigator !== "undefined" && "gpu" in navigator
          ? "webgpu"
          : "wasm",
      }
    )

    // QA model — extracts answers from context
    qaPipeline = await pipeline(
      "question-answering",
      "Xenova/distilbert-base-cased-distilled-squad",
      {
        device: typeof navigator !== "undefined" && "gpu" in navigator
          ? "webgpu"
          : "wasm",
      }
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
  const elements = document.querySelectorAll<HTMLElement>("*")

  for (const el of elements) {
    if (el.closest("[data-yuktai-panel]")) continue
    const text = el.innerText?.trim()
    if (text && text.length > 30) texts.push(text)
    const aria = el.getAttribute("aria-label")
    if (aria && aria.length > 10) texts.push(aria)
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      if (el.placeholder) texts.push(el.placeholder)
    }
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
// cosineSimilarity — measures semantic similarity between two vectors
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
  // @huggingface/transformers v3 returns .data directly as Float32Array
  const data = output?.data ?? output
  return Array.from(data as Float32Array)
}

// ─────────────────────────────────────────────────────────────────────────────
// findRelevantChunks — semantic search to find top N relevant chunks
// ─────────────────────────────────────────────────────────────────────────────
async function findRelevantChunks(
  question: string,
  chunks:   string[],
  topN = 3
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
// askPageWithTransformers — main RAG function for mobile and all browsers
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

    const relevantChunks = await findRelevantChunks(question, chunks, 3)
    const context        = relevantChunks.join(" ... ")

    // @huggingface/transformers v3 QA API
    const result = await qaPipeline(question, context)

    if (!result?.answer || result.answer.trim().length === 0) {
      return { success: true, answer: "I could not find a specific answer on this page." }
    }

    return { success: true, answer: result.answer.trim() }

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
// isTransformersSupported — checks WebAssembly + Worker support
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