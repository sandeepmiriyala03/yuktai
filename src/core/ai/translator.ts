// ─────────────────────────────────────────────────────────────────────────────
// src/core/ai/translator.ts
// yuktai v4.0.0 — Yuktishaalaa AI Lab
//
// Page translation — translates all visible page text into chosen language.
// Uses Chrome Built-in AI (window.translation) — Gemini Nano on device.
// Zero API keys. Zero cost. No data leaves the browser.
// Desktop only. Chrome 127+ required.
// ─────────────────────────────────────────────────────────────────────────────

// ── Types for Chrome Built-in AI Translation API
declare global {
  interface Window {
    translation?: {
      createTranslator: (options: TranslatorOptions) => Promise<Translator>;
      canTranslate: (options: TranslatorOptions) => Promise<"readily" | "after-download" | "no">;
    };
  }
}

interface TranslatorOptions {
  sourceLanguage: string; // e.g. "en"
  targetLanguage: string; // e.g. "hi"
}

interface Translator {
  translate: (text: string) => Promise<string>;
  destroy:   () => void;
}

// ── Supported languages in yuktai v4.0.0
// These are the languages Chrome Built-in AI supports today
export const SUPPORTED_LANGUAGES: { code: string; label: string }[] = [
  { code: "en", label: "English"    },
  { code: "hi", label: "Hindi"      },
  { code: "es", label: "Spanish"    },
  { code: "fr", label: "French"     },
  { code: "de", label: "German"     },
  { code: "it", label: "Italian"    },
  { code: "pt", label: "Portuguese" },
  { code: "nl", label: "Dutch"      },
  { code: "pl", label: "Polish"     },
  { code: "ru", label: "Russian"    },
  { code: "ja", label: "Japanese"   },
  { code: "ko", label: "Korean"     },
  { code: "zh", label: "Chinese"    },
  { code: "ar", label: "Arabic"     },
  { code: "tr", label: "Turkish"    },
  { code: "vi", label: "Vietnamese" },
  { code: "bn", label: "Bengali"    },
  { code: "id", label: "Indonesian" },
];

// ── Result returned to the caller
export interface TranslateResult {
  success:  boolean;
  language: string;
  fixed:    number;
  error?:   string;
}

// ── Track current language so we can restore original
let currentLanguage = "en";

// ─────────────────────────────────────────────────────────────────────────────
// checkTranslatorSupport
// Returns true if Chrome Built-in AI Translation is available.
// Call this before showing the language picker in the UI.
// ─────────────────────────────────────────────────────────────────────────────
export async function checkTranslatorSupport(
  targetLanguage: string
): Promise<boolean> {
  try {
    if (!window.translation) return false;

    const result = await window.translation.canTranslate({
      sourceLanguage: "en",
      targetLanguage,
    });

    return result !== "no";

  } catch {
    return false;
  }
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

  // If already in this language — do nothing
  if (targetLanguage === currentLanguage) {
    return { success: true, language: targetLanguage, fixed: 0 };
  }

  // If switching back to English — restore originals
  if (targetLanguage === "en") {
    restoreOriginalText();
    currentLanguage = "en";
    return { success: true, language: "en", fixed: 0 };
  }

  // Check if translation is supported for this language
  const supported = await checkTranslatorSupport(targetLanguage);
  if (!supported) {
    return {
      success:  false,
      language: targetLanguage,
      fixed:    0,
      error:    `Translation to ${targetLanguage} not available. Chrome 127+ required.`,
    };
  }

  try {
    // Create translator session
    const translator = await window.translation!.createTranslator({
      sourceLanguage: "en",
      targetLanguage,
    });

    // Find all translatable text elements
    const elements = document.querySelectorAll<HTMLElement>(
      "p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption, span, a"
    );

    let fixed = 0;

    for (const el of elements) {
      // Skip yuktai's own panel
      if (el.closest("[data-yuktai-panel]")) continue;

      // Skip elements with child elements — only translate leaf text nodes
      if (el.children.length > 0) continue;

      const original = el.innerText?.trim();
      if (!original || original.length < 2) continue;

      // Store original text for restoration
      if (!el.dataset.yuktaiTranslationOriginal) {
        el.dataset.yuktaiTranslationOriginal = original;
      }

      // Translate
      const translated = await translator.translate(original);

      if (translated && translated !== original) {
        el.innerText = translated;
        fixed++;
      }
    }

    // Clean up session
    translator.destroy();

    // Update current language
    currentLanguage = targetLanguage;

    return { success: true, language: targetLanguage, fixed };

  } catch (error) {
    return {
      success:  false,
      language: targetLanguage,
      fixed:    0,
      error:    error instanceof Error ? error.message : "Translation failed",
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// restoreOriginalText
// Restores all original English text when user switches back to English.
// ─────────────────────────────────────────────────────────────────────────────
export function restoreOriginalText(): void {
  const translated = document.querySelectorAll<HTMLElement>(
    "[data-yuktai-translation-original]"
  );

  for (const el of translated) {
    const original = el.dataset.yuktaiTranslationOriginal;
    if (original) {
      el.innerText = original;
      delete el.dataset.yuktaiTranslationOriginal;
    }
  }

  currentLanguage = "en";
}

// ─────────────────────────────────────────────────────────────────────────────
// getCurrentLanguage
// Returns the currently active language code.
// Used by the panel to show which language is selected.
// ─────────────────────────────────────────────────────────────────────────────
export function getCurrentLanguage(): string {
  return currentLanguage;
}