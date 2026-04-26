// ─────────────────────────────────────────────────────────────────────────────
// src/core/ai/translator.ts
// yuktai v2.0.19 — Yuktishaalaa AI Lab
//
// Page translation — translates all visible page text into chosen language.
//
// Chrome 147+ uses standalone globals: window.Translator
// Chrome 127–146 used: window.translation
// This file handles both automatically.
//
// Zero API keys. Zero cost. No data leaves the browser.
// ─────────────────────────────────────────────────────────────────────────────

// ── Supported languages in yuktai v2.0.19
export const SUPPORTED_LANGUAGES: { code: string; label: string }[] = [
  { code: "en", label: "English"     },
  { code: "hi", label: "Hindi"       },
  { code: "es", label: "Spanish"     },
  { code: "fr", label: "French"      },
  { code: "de", label: "German"      },
  { code: "it", label: "Italian"     },
  { code: "pt", label: "Portuguese"  },
  { code: "nl", label: "Dutch"       },
  { code: "pl", label: "Polish"      },
  { code: "ru", label: "Russian"     },
  { code: "ja", label: "Japanese"    },
  { code: "ko", label: "Korean"      },
  { code: "zh", label: "Chinese"     },
  { code: "ar", label: "Arabic"      },
  { code: "tr", label: "Turkish"     },
  { code: "vi", label: "Vietnamese"  },
  { code: "bn", label: "Bengali"     },
  { code: "id", label: "Indonesian"  },
]

// ── Result returned to the caller
export interface TranslateResult {
  success:  boolean
  language: string
  fixed:    number
  error?:   string
}

// ── Track current language so we can restore original
let currentLanguage = "en"

// ─────────────────────────────────────────────────────────────────────────────
// getTranslatorAPI
// Returns the Translator API regardless of Chrome version.
//
// Chrome 147+ uses: window.Translator
// Chrome 127–146 used: window.translation
// ─────────────────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getTranslatorAPI(): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  return w.Translator || w.translation || null
}

// ─────────────────────────────────────────────────────────────────────────────
// checkTranslatorSupport
// Returns true if Chrome Built-in AI Translation is available.
// ─────────────────────────────────────────────────────────────────────────────
export async function checkTranslatorSupport(
  targetLanguage: string
): Promise<boolean> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w      = window as any
    const API    = getTranslatorAPI()
    if (!API) return false

    // Chrome 147+ — window.Translator.availability()
    if (w.Translator && typeof w.Translator.availability === "function") {
      try {
        const status = await w.Translator.availability({
          sourceLanguage: "en",
          targetLanguage,
        })
        return (
          status === "readily"      ||
          status === "available"    ||
          status === "downloadable" ||
          status === "after-download"
        )
      } catch { /* try next */ }
    }

    // Chrome 147+ — window.Translator.canTranslate() fallback
    if (w.Translator && typeof w.Translator.canTranslate === "function") {
      const result = await w.Translator.canTranslate({
        sourceLanguage: "en",
        targetLanguage,
      })
      return result !== "no"
    }

    // Chrome 127–146 — window.translation.canTranslate()
    if (w.translation && typeof w.translation.canTranslate === "function") {
      const result = await w.translation.canTranslate({
        sourceLanguage: "en",
        targetLanguage,
      })
      return result !== "no"
    }

    return false

  } catch {
    return false
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// createTranslator
// Creates a translator session for the given language pair.
// Handles both Chrome 147+ and Chrome 127–146 API shapes.
// ─────────────────────────────────────────────────────────────────────────────
async function createTranslator(
  targetLanguage: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any

  const options = {
    sourceLanguage: "en",
    targetLanguage,
  }

  // Chrome 147+ — window.Translator.create()
  if (w.Translator && typeof w.Translator.create === "function") {
    return await w.Translator.create(options)
  }

  // Chrome 127–146 — window.translation.createTranslator()
  if (w.translation && typeof w.translation.createTranslator === "function") {
    return await w.translation.createTranslator(options)
  }

  throw new Error("Translation API not available")
}

// ─────────────────────────────────────────────────────────────────────────────
// translatePage
// Translates all visible text on the page into the chosen language.
// Stores original text so it can be restored when switching back to English.
// Called when user picks a language from the panel.
// ─────────────────────────────────────────────────────────────────────────────
export async function translatePage(
  targetLanguage: string
): Promise<TranslateResult> {

  // Already in this language — do nothing
  if (targetLanguage === currentLanguage) {
    return { success: true, language: targetLanguage, fixed: 0 }
  }

  // Switching back to English — restore originals
  if (targetLanguage === "en") {
    restoreOriginalText()
    currentLanguage = "en"
    return { success: true, language: "en", fixed: 0 }
  }

  // Check if translation is supported for this language
  const supported = await checkTranslatorSupport(targetLanguage)
  if (!supported) {
    return {
      success:  false,
      language: targetLanguage,
      fixed:    0,
      error:    `Translation to ${targetLanguage} not available. Enable via chrome://flags.`,
    }
  }

  try {
    const translator = await createTranslator(targetLanguage)

    // Find all translatable text elements
    const elements = document.querySelectorAll<HTMLElement>(
      "p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption, span, a"
    )

    let fixed = 0

    for (const el of elements) {
      // Skip yuktai's own panel
      if (el.closest("[data-yuktai-panel]")) continue

      // Only translate leaf text nodes — skip elements with child elements
      if (el.children.length > 0) continue

      const original = el.innerText?.trim()
      if (!original || original.length < 2) continue

      // Store original text for restoration
      if (!el.dataset.yuktaiTranslationOriginal) {
        el.dataset.yuktaiTranslationOriginal = original
      }

      // Translate using the session
      const translated = await translator.translate(original)

      if (translated && translated !== original) {
        el.innerText = translated
        fixed++
      }
    }

    // Clean up session
    if (typeof translator.destroy === "function") translator.destroy()

    currentLanguage = targetLanguage
    return { success: true, language: targetLanguage, fixed }

  } catch (error) {
    return {
      success:  false,
      language: targetLanguage,
      fixed:    0,
      error:    error instanceof Error ? error.message : "Translation failed",
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// restoreOriginalText
// Restores all original English text when user switches back to English.
// ─────────────────────────────────────────────────────────────────────────────
export function restoreOriginalText(): void {
  const translated = document.querySelectorAll<HTMLElement>(
    "[data-yuktai-translation-original]"
  )
  for (const el of translated) {
    const original = el.dataset.yuktaiTranslationOriginal
    if (original) {
      el.innerText = original
      delete el.dataset.yuktaiTranslationOriginal
    }
  }
  currentLanguage = "en"
}

// ─────────────────────────────────────────────────────────────────────────────
// getCurrentLanguage
// Returns the currently active language code.
// ─────────────────────────────────────────────────────────────────────────────
export function getCurrentLanguage(): string {
  return currentLanguage
}