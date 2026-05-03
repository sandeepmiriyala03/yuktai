// ─────────────────────────────────────────────────────────────────────────────
// src/core/ai/rag.ts
// yuktai v2.0.20 — Yuktishaalaa AI Lab
//
// RAG — Ask any question about the current page.
// Uses Chrome Built-in AI (window.LanguageModel) — Gemini Nano on device.
// Zero API keys. Zero cost. No data leaves the browser.
// ─────────────────────────────────────────────────────────────────────────────

// ── Result returned to caller
export interface RagResult {
  success: boolean
  answer:  string
  error?:  string
}

// ─────────────────────────────────────────────────────────────────────────────
// getPageText
// Collects all visible text from page — skips yuktai panel itself
// ─────────────────────────────────────────────────────────────────────────────
function getPageText(): string {
  const elements = document.querySelectorAll<HTMLElement>(
    "p, h1, h2, h3, h4, h5, h6, li, td, th, label, figcaption"
  )

  const texts: string[] = []

  for (const el of elements) {
    if (el.closest("[data-yuktai-panel]")) continue
    const text = el.innerText?.trim()
    if (text && text.length > 10) texts.push(text)
  }

  // Limit to 6000 chars — stays within Gemini Nano context window
  return texts.join(" ").slice(0, 6000)
}

// ─────────────────────────────────────────────────────────────────────────────
// askPage
// Takes a question → reads page text → asks Gemini Nano → returns answer
// ─────────────────────────────────────────────────────────────────────────────
export async function askPage(question: string): Promise<RagResult> {
  if (!question.trim()) {
    return { success: false, answer: "", error: "Please type a question." }
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w   = window as any
    const API = w.LanguageModel || w.ai?.languageModel

    if (!API) {
      return {
        success: false,
        answer:  "",
        error:   "Gemini Nano not available. Enable via chrome://flags.",
      }
    }

    // Get page content
    const pageText = getPageText()

    if (!pageText || pageText.length < 50) {
      return {
        success: false,
        answer:  "",
        error:   "Not enough content on this page to answer from.",
      }
    }

    // Create Gemini Nano session
    const session = await API.create({
      systemPrompt: `You are a helpful assistant. 
Answer questions based ONLY on the page content provided below.
Keep answers short — 2 to 3 sentences maximum.
If the answer is not in the content say: "I could not find that on this page."
Do not make up information.`,
    })

    // Send page content + question
    const prompt  = `Page content:\n${pageText}\n\nQuestion: ${question}`
    const answer  = await session.prompt(prompt)

    // Free memory
    session.destroy()

    return {
      success: true,
      answer:  answer?.trim() || "No answer found.",
    }

  } catch (error) {
    return {
      success: false,
      answer:  "",
      error:   error instanceof Error ? error.message : "Something went wrong.",
    }
  }
}