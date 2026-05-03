// ─────────────────────────────────────────────────────────────────────────────
// rag.ts — improved universal extraction
// ─────────────────────────────────────────────────────────────────────────────

export interface RagResult {
  success: boolean
  answer: string
  error?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Wait for page to stabilize (important for React / SPA)
// ─────────────────────────────────────────────────────────────────────────────
function waitForContent(): Promise<void> {
  return new Promise(resolve => {
    let timeout = setTimeout(resolve, 1500)

    const observer = new MutationObserver(() => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        observer.disconnect()
        resolve()
      }, 500)
    })

    observer.observe(document.body, { childList: true, subtree: true })
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Extract maximum useful text
// ─────────────────────────────────────────────────────────────────────────────
function getPageText(): string {
  const texts: string[] = []

  const elements = document.querySelectorAll<HTMLElement>("*")

  for (const el of elements) {
    if (el.closest("[data-yuktai-panel]")) continue

    // visible text
    const text = el.innerText?.trim()
    if (text && text.length > 30) texts.push(text)

    // aria labels (important for accessibility sites)
    const aria = el.getAttribute("aria-label")
    if (aria && aria.length > 10) texts.push(aria)

    // input values / placeholders
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      if (el.placeholder) texts.push(el.placeholder)
      if (el.value) texts.push(el.value)
    }

    // button labels
    if (el instanceof HTMLButtonElement) {
      const btn = el.innerText || el.getAttribute("aria-label")
      if (btn) texts.push(btn)
    }
  }

  return texts.join(" ").slice(0, 3500)
}

// ─────────────────────────────────────────────────────────────────────────────
// Main function
// ─────────────────────────────────────────────────────────────────────────────
export async function askPage(question: string): Promise<RagResult> {
  if (!question.trim()) {
    return { success: false, answer: "", error: "Please type a question." }
  }

  try {
    const w = window as any
    const API = w.LanguageModel || w.ai?.languageModel

    if (!API) {
      return {
        success: false,
        answer: "",
        error: "Gemini Nano not available.",
      }
    }

    // 🔥 IMPORTANT: wait for dynamic content
    await waitForContent()

    const pageText = getPageText()

    if (!pageText || pageText.length < 100) {
      return {
        success: false,
        answer: "",
        error: "Page content not readable.",
      }
    }

    let session

    try {
      session = await API.create({
        systemPrompt: `Answer ONLY using page content.
Keep answer short (2–3 sentences).
If not found say: "I could not find that on this page."`,
        outputLanguage: "en",
      })
    } catch {
      session = await API.create()
    }

    const prompt = `Page:\n${pageText}\n\nQ: ${question}`

    const answer = await session.prompt(prompt)

    if (session?.destroy) session.destroy()

    return {
      success: true,
      answer: answer?.trim() || "No answer found.",
    }

  } catch (e) {
    return {
      success: false,
      answer: "",
      error: e instanceof Error ? e.message : "Error occurred",
    }
  }
}