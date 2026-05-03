// ─────────────────────────────────────────────────────────────────────────────
// src/core/ai/rag.ts
// FIXED — minimal safe corrections only
// ─────────────────────────────────────────────────────────────────────────────

export interface RagResult {
  success: boolean
  answer:  string
  error?:  string
}

// ─────────────────────────────────────────────────────────────────────────────
// getPageText
// ─────────────────────────────────────────────────────────────────────────────
function getPageText(): string {
  const elements = document.querySelectorAll<HTMLElement>(
    "p, h1, h2, h3, h4, h5, h6, li, td, th, label, figcaption"
  )

  const texts: string[] = []

  for (const el of elements) {
    if (el.closest("[data-yuktai-panel]")) continue

    const text = el.innerText?.trim()

    // 🔧 FIX: increase filter quality
    if (text && text.length > 20) texts.push(text)
  }

  // 🔧 FIX: reduce size (was 6000 → causes failures)
  return texts.join(" ").slice(0, 3000)
}

// ─────────────────────────────────────────────────────────────────────────────
// askPage
// ─────────────────────────────────────────────────────────────────────────────
export async function askPage(question: string): Promise<RagResult> {
  if (!question.trim()) {
    return { success: false, answer: "", error: "Please type a question." }
  }

  try {
    const w   = window as any

    // 🔧 FIX: safer API detection
    const API = w.LanguageModel || w.ai?.languageModel

    console.log("AI API:", API) // 🔧 debug

    if (!API) {
      return {
        success: false,
        answer:  "",
        error:   "Gemini Nano not available. Enable via chrome://flags.",
      }
    }

    const pageText = getPageText()

    if (!pageText || pageText.length < 50) {
      return {
        success: false,
        answer:  "",
        error:   "Not enough content on this page to answer from.",
      }
    }

    let session

    // 🔧 FIX: handle API differences (systemPrompt may fail)
    try {
      session = await API.create({
        systemPrompt: `You are a helpful assistant. 
Answer questions based ONLY on the page content provided below.
Keep answers short — 2 to 3 sentences maximum.
If the answer is not in the content say: "I could not find that on this page."
Do not make up information.`,
      })
    } catch {
      session = await API.create()
    }

    const prompt  = `Page content:\n${pageText}\n\nQuestion: ${question}`

    const answer  = await session.prompt(prompt)

    // 🔧 FIX: safe cleanup
    if (session?.destroy) {
      session.destroy()
    }

    return {
      success: true,
      answer:  answer?.trim() || "No answer found.",
    }

  } catch (error) {
    console.error("RAG ERROR:", error) // 🔧 debug

    return {
      success: false,
      answer:  "",
      error:   error instanceof Error ? error.message : "Something went wrong.",
    }
  }
}