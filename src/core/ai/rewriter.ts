// ─────────────────────────────────────────────────────────────────────────────
// src/core/ai/rewriter.ts
// yuktai v4.0.0 — Yuktishaalaa AI Lab
//
// Plain English mode — rewrites complex page text into simple language.
// Uses Chrome Built-in AI (window.ai.rewriter) — Gemini Nano on device.
// Zero API keys. Zero cost. No data leaves the browser.
// Desktop only. Chrome 127+ required.
// ─────────────────────────────────────────────────────────────────────────────

// ── Types for Chrome Built-in AI Rewriter API
// These are not in TypeScript's default lib yet — so we declare them here
declare global {
  interface Window {
    ai?: {
      rewriter?: {
        create: (options?: RewriterOptions) => Promise<Rewriter>;
        capabilities: () => Promise<{ available: "readily" | "after-download" | "no" }>;
      };
    };
  }
}

interface RewriterOptions {
  // How simple the output should be
  tone?: "as-is" | "more-formal" | "more-casual";
  // Target reading level
  format?: "as-is" | "plain-text" | "markdown";
  // Target length
  length?: "as-is" | "shorter" | "longer";
}

interface Rewriter {
  rewrite: (text: string, options?: { context?: string }) => Promise<string>;
  destroy: () => void;
}

// ── Result returned to the caller
export interface RewriteResult {
  success:  boolean;
  original: string;
  rewritten: string;
  error?:   string;
}

// ─────────────────────────────────────────────────────────────────────────────
// checkRewriterSupport
// Returns true if Chrome Built-in AI Rewriter is available on this device.
// Call this before enabling the Plain English toggle in the UI.
// ─────────────────────────────────────────────────────────────────────────────
export async function checkRewriterSupport(): Promise<boolean> {
  try {
    // Check if the API exists in this browser
    if (!window.ai?.rewriter) return false;

    // Check if Gemini Nano is ready on this device
    const capabilities = await window.ai.rewriter.capabilities();
    return capabilities.available !== "no";

  } catch {
    // API not available — fail silently
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// rewriteText
// Takes a single string and rewrites it in plain simple English.
// Used by the Plain English mode toggle in WidgetPanel.
// ─────────────────────────────────────────────────────────────────────────────
export async function rewriteText(text: string): Promise<RewriteResult> {
  // Don't process empty or very short text
  if (!text || text.trim().length < 20) {
    return { success: false, original: text, rewritten: text, error: "Text too short" };
  }

  try {
    // Create a rewriter session with plain English settings
    const rewriter = await window.ai!.rewriter!.create({
      tone:   "more-casual",   // Friendly and approachable
      format: "plain-text",    // No markdown — clean output
      length: "as-is",         // Keep roughly the same length
    });

    // Rewrite the text with accessibility context
    const rewritten = await rewriter.rewrite(text, {
      context: "Rewrite this text in simple plain English. Use short sentences. Avoid jargon. Make it easy to understand for everyone.",
    });

    // Clean up the session to free memory
    rewriter.destroy();

    return {
      success:  true,
      original: text,
      rewritten: rewritten.trim(),
    };

  } catch (error) {
    return {
      success:  false,
      original: text,
      rewritten: text,
      error:    error instanceof Error ? error.message : "Rewrite failed",
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// rewritePage
// Finds all paragraph and heading text on the page and rewrites them.
// Called when user enables "Plain English mode" in the panel.
// Only rewrites text — never changes structure, links, or ARIA attributes.
// ─────────────────────────────────────────────────────────────────────────────
export async function rewritePage(): Promise<{ fixed: number; error?: string }> {
  // Check support first
  const supported = await checkRewriterSupport();
  if (!supported) {
    return { fixed: 0, error: "Chrome Built-in AI not available on this device. Chrome 127+ required." };
  }

  // Select all readable text elements on the page
  // We only touch visible text — not inputs, buttons, or ARIA attributes
  const textElements = document.querySelectorAll<HTMLElement>(
    "p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption"
  );

  let fixed = 0;

  for (const el of textElements) {
    const original = el.innerText?.trim();

    // Skip empty elements and very short text
    if (!original || original.length < 20) continue;

    // Skip elements that are already inside yuktai's own panel
    if (el.closest("[data-yuktai-panel]")) continue;

    const result = await rewriteText(original);

    if (result.success && result.rewritten !== original) {
      // Store original text so we can restore it later
      el.dataset.yuktaiOriginal = original;

      // Replace with plain English version
      el.innerText = result.rewritten;
      fixed++;
    }
  }

  return { fixed };
}

// ─────────────────────────────────────────────────────────────────────────────
// restorePage
// Restores all original text when user turns off Plain English mode.
// ─────────────────────────────────────────────────────────────────────────────
export function restorePage(): void {
  const rewritten = document.querySelectorAll<HTMLElement>("[data-yuktai-original]");

  for (const el of rewritten) {
    const original = el.dataset.yuktaiOriginal;
    if (original) {
      el.innerText = original;
      delete el.dataset.yuktaiOriginal;
    }
  }
}