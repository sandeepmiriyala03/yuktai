// ─────────────────────────────────────────────────────────────────────────────
// src/core/ai/transformers-rag.ts
// yuktai v2.1.0 — Yuktishaalaa AI Lab
//
// Mobile RAG — Ask any question about the current page.
// Uses Transformers.js (Hugging Face) — runs entirely in the browser.
//
// Works on:
//   ✅ Mobile Chrome (Android)
//   ✅ Mobile Safari (iOS)
//   ✅ Desktop Chrome (without Gemini Nano flags)
//   ✅ Firefox
//   ✅ Edge
//   ✅ PWA offline (after first model load)
//
// AI concept:
//   Retrieval Augmented Generation (RAG)
//   1. Page text collected and split into chunks
//   2. Each chunk converted to vector (embedding)
//   3. Question converted to vector
//   4. Cosine similarity finds most relevant chunks
//   5. QA model answers from relevant chunks only
//
// Model used:
//   Embeddings: Xenova/all-MiniLM-L6-v2 (~23MB) — English
//   QA:         Xenova/distilbert-base-cased-distilled-squad (~67MB)
//
// First load: downloads models to browser cache (~90MB total)
// After that: works fully offline — zero internet needed
//
// Zero API keys. Zero cost. No data leaves the browser.
// ─────────────────────────────────────────────────────────────────────────────

export interface RagResult {
  success: boolean
  answer:  string
  error?:  string
}

// ── Module-level cache — models loaded once per session
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let embeddingPipeline: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let qaPipeline: any        = null
let modelsLoading          = false
let modelsLoaded           = false

// ─────────────────────────────────────────────────────────────────────────────
// loadModels
// Downloads and caches Transformers.js models in browser.
// Called once — subsequent calls use cached models.
// ─────────────────────────────────────────────────────────────────────────────
async function loadModels(): Promise<void> {
  if (modelsLoaded)  return
  if (modelsLoading) {
    // Wait for ongoing load to finish
    while (modelsLoading) await new Promise(r => setTimeout(r, 200))
    return
  }

  modelsLoading = true

  try {
    // Dynamic import — Transformers.js is large, load only when needed
    const { pipeline } = await import("@xenova/transformers")

    // Load embedding model — converts text to vectors
    // Xenova/all-MiniLM-L6-v2 — fast, small, good quality
    embeddingPipeline = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      { device: "webgpu" }          // uses WebGPU if available, falls back to CPU
    )

    // Load QA model — answers questions from context
    // DistilBERT — small and fast, good for extractive QA
    qaPipeline = await pipeline(
      "question-answering",
      "Xenova/distilbert-base-cased-distilled-squad",
      { device: "webgpu" }
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
// waitForContent
// Waits for React/SPA dynamic content to finish rendering
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
// getPageText
// Collects all visible text from the page — skips yuktai panel
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

  return texts.join(" ").slice(0, 8000)  // more chars — Transformers handles it
}

// ─────────────────────────────────────────────────────────────────────────────
// chunkText
// Splits page text into overlapping chunks for better retrieval
// ─────────────────────────────────────────────────────────────────────────────
function chunkText(text: string, chunkSize = 200, overlap = 50): string[] {
  const words  = text.split(/\s+/)
  const chunks: string[] = []

  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(" ")
    if (chunk.trim().length > 20) chunks.push(chunk)
  }

  return chunks
}

// ─────────────────────────────────────────────────────────────────────────────
// cosineSimilarity
// Measures how similar two vectors are — 1.0 = identical, 0 = unrelated
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
// embed
// Converts text to a vector using the embedding model
// ─────────────────────────────────────────────────────────────────────────────
async function embed(text: string): Promise<number[]> {
  const output = await embeddingPipeline(text, {
    pooling:   "mean",
    normalize: true,
  })
  return Array.from(output.data as Float32Array)
}

// ─────────────────────────────────────────────────────────────────────────────
// findRelevantChunks
// Semantic search — finds top N chunks most relevant to the question
// ─────────────────────────────────────────────────────────────────────────────
async function findRelevantChunks(
  question: string,
  chunks:   string[],
  topN = 3
): Promise<string[]> {
  // Embed the question
  const questionVector = await embed(question)

  // Embed all chunks and score them
  const scored = await Promise.all(
    chunks.map(async chunk => {
      const chunkVector = await embed(chunk)
      const score       = cosineSimilarity(questionVector, chunkVector)
      return { chunk, score }
    })
  )

  // Sort by relevance — highest score first
  scored.sort((a, b) => b.score - a.score)

  // Return top N most relevant chunks
  return scored.slice(0, topN).map(s => s.chunk)
}

// ─────────────────────────────────────────────────────────────────────────────
// askPageWithTransformers
// Main RAG function using Transformers.js — works on all devices
//
// Flow:
//   1. Load models (cached after first load)
//   2. Get page text
//   3. Split into chunks
//   4. Find relevant chunks via semantic search
//   5. QA model answers from relevant chunks
// ─────────────────────────────────────────────────────────────────────────────
export async function askPageWithTransformers(
  question: string
): Promise<RagResult> {
  if (!question.trim()) {
    return { success: false, answer: "", error: "Please type a question." }
  }

  try {
    // Load models — first call downloads, subsequent calls use cache
    await loadModels()

    // Wait for SPA content to render
    await waitForContent()

    // Get all page text
    const pageText = getPageText()

    if (!pageText || pageText.length < 50) {
      return {
        success: false,
        answer:  "",
        error:   "Not enough content on this page to answer from.",
      }
    }

    // Split into chunks
    const chunks = chunkText(pageText)

    if (chunks.length === 0) {
      return { success: false, answer: "", error: "Could not process page content." }
    }

    // Find most relevant chunks via semantic search
    const relevantChunks = await findRelevantChunks(question, chunks, 3)

    // Combine top chunks into context for QA model
    const context = relevantChunks.join(" ... ")

    // QA model answers from the relevant context only
    const result = await qaPipeline({
      question,
      context,
    })

    if (!result?.answer || result.answer.trim().length === 0) {
      return {
        success: true,
        answer:  "I could not find a specific answer on this page.",
      }
    }

    return {
      success: true,
      answer:  result.answer.trim(),
    }

  } catch (error) {
    console.error("yuktai: Transformers RAG error", error)
    return {
      success: false,
      answer:  "",
      error:   error instanceof Error
        ? error.message
        : "Transformers.js error — please try again.",
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// isTransformersSupported
// Checks if the browser can run Transformers.js
// Requires: WebAssembly support (all modern browsers)
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
// Returns current model loading status for UI feedback
// ─────────────────────────────────────────────────────────────────────────────
export function getModelLoadStatus(): "idle" | "loading" | "ready" {
  if (modelsLoaded)  return "ready"
  if (modelsLoading) return "loading"
  return "idle"
}