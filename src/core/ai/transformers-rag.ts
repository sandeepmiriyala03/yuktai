// ─────────────────────────────────────────────────────────────────────────────
// src/core/ai/transformers-rag.ts
// yuktai v3.0.13 — Yuktishaalaa AI Lab
//
// Fixes in v3.0.13:
//   1. Mobile Safari "Out of memory" — switched to q4 quantized models
//   2. Transformers.js v4 API — env.useBrowserCache removed, use env.useWasmCache
//   3. WebGPU forced off on mobile — wasm only (WebGPU unstable on mobile)
//   4. isMobile detection — separate device handling
//   5. Smaller model for mobile — Xenova/all-MiniLM-L6-v2 q4 only ~10MB
//
// Models:
//   Embeddings: Xenova/all-MiniLM-L6-v2 — q4 quantized (~10MB mobile / ~23MB desktop)
//   Generation: Xenova/flan-t5-small    — q4 quantized (~20MB mobile / ~80MB desktop)
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
let embeddingPipeline:  any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let generativePipeline: any = null
let modelsLoading           = false
let modelsLoaded            = false

// ─────────────────────────────────────────────────────────────────────────────
// isMobileDevice — detects mobile to use lighter models and force wasm
// ─────────────────────────────────────────────────────────────────────────────
function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false
  return /Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(navigator.userAgent)
}

// ─────────────────────────────────────────────────────────────────────────────
// safeDevice — wasm always on mobile, webgpu only on desktop if available
// FIX: WebGPU is unstable on mobile Safari and Android Chrome
// ─────────────────────────────────────────────────────────────────────────────
function safeDevice(): string {
  if (isMobileDevice()) return "wasm"  // always wasm on mobile
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
// FIX: v4 API uses env.useWasmCache not env.useBrowserCache
// FIX: q4 quantization on mobile to fit in memory
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

    // ── FIX: v4 uses env.useWasmCache not env.useBrowserCache ──
    if (typeof window !== "undefined" && typeof caches !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (env as any).useWasmCache = true
    }

    const device = safeDevice()
    const mobile = isMobileDevice()

    console.log(`yuktai: Transformers.js — device: ${device}, mobile: ${mobile}`)

    // ── FIX: q4 quantization on mobile — ~10MB vs ~23MB ──
    // q4 is default for WASM — much smaller memory footprint
    embeddingPipeline = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      {
        device,
        dtype: mobile ? "q4" : "fp32",
      }
    )

    // ── FIX: q4 quantization on mobile — ~20MB vs ~80MB ──
    generativePipeline = await pipeline(
      "text2text-generation",
      "Xenova/flan-t5-small",
      {
        device,
        dtype: mobile ? "q4" : "fp32",
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
// waitForContent — waits for SPA dynamic content to render
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

  const elements = document.querySelectorAll<HTMLElement>(
    "p, h1, h2, h3, h4, h5, h6, li, td, th, label, figcaption, blockquote, span, a, button, div"
  )

  for (const el of elements) {
    if (el.closest("[data-yuktai-panel]")) continue

    const hasBlockChild = el.querySelector("p, h1, h2, h3, h4, li, td, div")
    if (hasBlockChild) continue

    const text = el.innerText?.trim()
    if (!text || text.length < 15) continue
    if (seen.has(text)) continue
    seen.add(text)
    texts.push(text)

    const aria = el.getAttribute("aria-label")?.trim()
    if (aria && aria.length > 8 && !seen.has(aria)) {
      seen.add(aria)
      texts.push(aria)
    }
  }

  // Document title first — most important
  const title = document.title?.trim()
  if (title && !seen.has(title)) texts.unshift(title)

  // Meta description
  const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
  const desc = meta?.getAttribute("content")?.trim()
  if (desc && !seen.has(desc)) texts.unshift(desc)

  return texts.join(" ").slice(0, 8000)
}

// ─────────────────────────────────────────────────────────────────────────────
// chunkText — splits page text into overlapping chunks
// ─────────────────────────────────────────────────────────────────────────────
function chunkText(text: unknown, chunkSize = 150, overlap = 30): string[] {
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
// embed — converts text to semantic vector
// ─────────────────────────────────────────────────────────────────────────────
async function embed(text: string): Promise<number[]> {
  const output = await embeddingPipeline(text, { pooling: "mean", normalize: true })
  const data   = output?.data ?? output
  return Array.from(data as Float32Array)
}

// ─────────────────────────────────────────────────────────────────────────────
// findRelevantChunks — semantic search for top N chunks
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
// askPageWithTransformers — main RAG function, works on all devices
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
    const context        = relevantChunks.join(" ").slice(0, 1200)

    const prompt = `Answer the question based on the context. Give a complete answer in 2-3 sentences.

Context: ${context}

Question: ${question}

Answer:`

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: any[] = await generativePipeline(prompt, {
      max_new_tokens: 120,
      min_new_tokens: 10,
    })

    const answer = results?.[0]?.generated_text?.trim() || ""

    if (!answer) {
      return { success: true, answer: "I could not find a specific answer on this page." }
    }

    return { success: true, answer }

  } catch (error) {
    console.error("yuktai: Transformers RAG error", error)

    // ── Specific mobile memory error ──
    const msg = error instanceof Error ? error.message : ""
    if (msg.includes("Out of memory") || msg.includes("memory")) {
      return {
        success: false,
        answer:  "",
        error:   "Not enough device memory. Try on a device with more RAM or use desktop Chrome with Gemini Nano.",
      }
    }

    return {
      success: false,
      answer:  "",
      error:   msg || "Transformers.js error.",
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