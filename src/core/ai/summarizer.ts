// ─────────────────────────────────────────────────────────────────────────────
// src/core/ai/summarizer.ts
// yuktai v4.0.0 — Yuktishaalaa AI Lab
//
// Page summariser — reads the full page and returns a short summary.
// Uses Chrome Built-in AI (window.ai.summarizer) — Gemini Nano on device.
// Zero API keys. Zero cost. No data leaves the browser.
// Desktop only. Chrome 127+ required.
// ─────────────────────────────────────────────────────────────────────────────

// ── Types for Chrome Built-in AI Summarizer API
declare global {
  interface Window {
    ai?: {
      summarizer?: {
        create: (options?: SummarizerOptions) => Promise<Summarizer>;
        capabilities: () => Promise<{ available: "readily" | "after-download" | "no" }>;
      };
    };
  }
}

interface SummarizerOptions {
  // How long the summary should be
  type?:   "key-points" | "tl;dr" | "teaser" | "headline";
  // Output format
  format?: "plain-text" | "markdown";
  // Target length
  length?: "short" | "medium" | "long";
}

interface Summarizer {
  summarize: (text: string, options?: { context?: string }) => Promise<string>;
  destroy:   () => void;
}

// ── Result returned to the caller
export interface SummaryResult {
  success:  boolean;
  summary:  string;
  error?:   string;
}

// ── The summary box element we inject into the page
const SUMMARY_BOX_ID = "yuktai-summary-box";

// ─────────────────────────────────────────────────────────────────────────────
// checkSummarizerSupport
// Returns true if Chrome Built-in AI Summarizer is available on this device.
// Call this before showing the Summarise toggle in the UI.
// ─────────────────────────────────────────────────────────────────────────────
export async function checkSummarizerSupport(): Promise<boolean> {
  try {
    if (!window.ai?.summarizer) return false;

    const capabilities = await window.ai.summarizer.capabilities();
    return capabilities.available !== "no";

  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// getPageText
// Collects all visible text from the page into a single string.
// Skips scripts, styles, and yuktai's own panel.
// ─────────────────────────────────────────────────────────────────────────────
function getPageText(): string {
  const elements = document.querySelectorAll<HTMLElement>(
    "p, h1, h2, h3, h4, h5, h6, li, blockquote, article, section"
  );

  const texts: string[] = [];

  for (const el of elements) {
    // Skip yuktai's own panel
    if (el.closest("[data-yuktai-panel]")) continue;

    // Skip hidden elements
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") continue;

    const text = el.innerText?.trim();
    if (text && text.length > 10) {
      texts.push(text);
    }
  }

  // Join all text — limit to 5000 chars to stay within AI context window
  return texts.join(" ").slice(0, 5000);
}

// ─────────────────────────────────────────────────────────────────────────────
// summarizePage
// Reads the full page text and generates a short 3-sentence summary.
// Injects the summary box at the top of the page for screen reader users.
// Called when user enables "Summarise page" in the panel.
// ─────────────────────────────────────────────────────────────────────────────
export async function summarizePage(): Promise<SummaryResult> {
  // Check support first
  const supported = await checkSummarizerSupport();
  if (!supported) {
    return {
      success: false,
      summary: "",
      error: "Chrome Built-in AI not available. Chrome 127+ required.",
    };
  }

  // Get all visible text from the page
  const pageText = getPageText();
  if (!pageText || pageText.length < 100) {
    return {
      success: false,
      summary: "",
      error: "Not enough text on this page to summarise.",
    };
  }

  try {
    // Create summarizer session
    const summarizer = await window.ai!.summarizer!.create({
      type:   "tl;dr",       // Short and to the point
      format: "plain-text",  // Clean text — no markdown
      length: "short",       // 2-3 sentences max
    });

    // Generate summary
    const summary = await summarizer.summarize(pageText, {
      context: "Summarise this page in 2-3 simple sentences for a screen reader user who wants to know if this page is relevant to them.",
    });

    // Clean up session
    summarizer.destroy();

    // Inject summary box into page
    injectSummaryBox(summary.trim());

    return { success: true, summary: summary.trim() };

  } catch (error) {
    return {
      success: false,
      summary: "",
      error: error instanceof Error ? error.message : "Summary failed",
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// injectSummaryBox
// Adds a visible summary box at the top of the page.
// Screen readers will read this first — helping users decide if page is useful.
// ─────────────────────────────────────────────────────────────────────────────
function injectSummaryBox(summary: string): void {
  // Remove existing box if present
  removeSummaryBox();

  const box = document.createElement("div");
  box.id = SUMMARY_BOX_ID;

  // Mark as yuktai element so we never rewrite it
  box.setAttribute("data-yuktai-panel", "true");

  // ARIA — screen readers announce this as a summary region
  box.setAttribute("role", "region");
  box.setAttribute("aria-label", "Page summary by yuktai");

  box.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9990;
    background: #0d9488;
    color: #ffffff;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    padding: 10px 20px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  `;

  // Summary text
  const text = document.createElement("p");
  text.style.cssText = "margin: 0; flex: 1;";
  text.textContent = `📋 Page summary: ${summary}`;

  // Close button
  const close = document.createElement("button");
  close.textContent = "×";
  close.setAttribute("aria-label", "Close page summary");
  close.style.cssText = `
    background: none;
    border: none;
    color: #ffffff;
    font-size: 20px;
    cursor: pointer;
    padding: 0 4px;
    line-height: 1;
    flex-shrink: 0;
  `;
  close.addEventListener("click", removeSummaryBox);

  box.appendChild(text);
  box.appendChild(close);
  document.body.prepend(box);
}

// ─────────────────────────────────────────────────────────────────────────────
// removeSummaryBox
// Removes the summary box from the page.
// Called when user turns off the Summarise toggle.
// ─────────────────────────────────────────────────────────────────────────────
export function removeSummaryBox(): void {
  const existing = document.getElementById(SUMMARY_BOX_ID);
  if (existing) existing.remove();
}