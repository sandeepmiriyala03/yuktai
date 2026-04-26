// ─────────────────────────────────────────────────────────────────────────────
// src/core/ai/labeller.ts
// yuktai v4.0.0 — Yuktishaalaa AI Lab
//
// Smart aria-labels — generates meaningful labels for unlabelled elements.
// Uses Chrome Built-in AI (window.ai.writer) — Gemini Nano on device.
// Zero API keys. Zero cost. No data leaves the browser.
// Desktop only. Chrome 127+ required.
//
// Why this matters:
// Developers often ship buttons, links, and inputs with no aria-label.
// Screen readers then say "button" or "link" with no context.
// This file uses AI to read surrounding context and generate
// a meaningful label — e.g. "Add item to cart" instead of just "button".
// ─────────────────────────────────────────────────────────────────────────────

// ── Types for Chrome Built-in AI Writer API
declare global {
  interface Window {
    ai?: {
      writer?: {
        create:       (options?: WriterOptions) => Promise<Writer>;
        capabilities: () => Promise<{ available: "readily" | "after-download" | "no" }>;
      };
    };
  }
}

interface WriterOptions {
  tone?:   "formal" | "neutral" | "casual";
  format?: "plain-text" | "markdown";
  length?: "short" | "medium" | "long";
}

interface Writer {
  write:   (prompt: string) => Promise<string>;
  destroy: () => void;
}

// ── Result returned to the caller
export interface LabelResult {
  success:   boolean;
  fixed:     number;
  elements:  { tag: string; label: string }[];
  error?:    string;
}

// ── Elements that need smart labels
// These are elements that are commonly missing aria-labels
const UNLABELLED_SELECTORS = [
  "button:not([aria-label]):not([aria-labelledby])",
  "a:not([aria-label]):not([aria-labelledby])",
  "input:not([aria-label]):not([aria-labelledby]):not([id])",
  "select:not([aria-label]):not([aria-labelledby])",
  "textarea:not([aria-label]):not([aria-labelledby])",
  "[role='button']:not([aria-label])",
  "[role='link']:not([aria-label])",
  "[role='checkbox']:not([aria-label])",
  "[role='tab']:not([aria-label])",
].join(", ");

// ─────────────────────────────────────────────────────────────────────────────
// checkLabellerSupport
// Returns true if Chrome Built-in AI Writer is available on this device.
// ─────────────────────────────────────────────────────────────────────────────
export async function checkLabellerSupport(): Promise<boolean> {
  try {
    if (!window.ai?.writer) return false;

    const capabilities = await window.ai.writer.capabilities();
    return capabilities.available !== "no";

  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// getElementContext
// Reads surrounding context of an element to help AI generate a good label.
// Looks at: inner text, placeholder, nearby label, parent text, sibling text.
// ─────────────────────────────────────────────────────────────────────────────
function getElementContext(el: HTMLElement): string {
  const parts: string[] = [];

  // 1. Inner text of the element itself
  const innerText = el.innerText?.trim();
  if (innerText) parts.push(`element text: "${innerText}"`);

  // 2. Placeholder for inputs
  const placeholder = (el as HTMLInputElement).placeholder?.trim();
  if (placeholder) parts.push(`placeholder: "${placeholder}"`);

  // 3. Name attribute
  const name = el.getAttribute("name")?.trim();
  if (name) parts.push(`name: "${name}"`);

  // 4. Type for inputs
  const type = el.getAttribute("type")?.trim();
  if (type) parts.push(`type: "${type}"`);

  // 5. Nearby label element
  const id = el.id;
  if (id) {
    const label = document.querySelector<HTMLElement>(`label[for="${id}"]`);
    if (label) parts.push(`label: "${label.innerText?.trim()}"`);
  }

  // 6. Parent container text — max 60 chars
  const parentText = el.parentElement?.innerText?.trim().slice(0, 60);
  if (parentText) parts.push(`parent context: "${parentText}"`);

  // 7. Tag name and role
  parts.push(`tag: ${el.tagName.toLowerCase()}`);
  const role = el.getAttribute("role");
  if (role) parts.push(`role: ${role}`);

  return parts.join(". ");
}

// ─────────────────────────────────────────────────────────────────────────────
// generateLabel
// Sends element context to Chrome AI and gets a short meaningful label back.
// ─────────────────────────────────────────────────────────────────────────────
async function generateLabel(
  writer:  Writer,
  context: string
): Promise<string> {
  const prompt = `
    Generate a short, clear aria-label for an HTML element.
    The label must be 2-6 words maximum.
    The label must describe what the element does or what it is.
    Do not include punctuation.
    Do not explain — just output the label text only.

    Element details:
    ${context}

    Output only the label. Nothing else.
  `.trim();

  const result = await writer.write(prompt);

  // Clean up — remove quotes, extra spaces, punctuation
  return result
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\.$/, "")
    .trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// applySmartLabels
// Finds all unlabelled interactive elements on the page.
// Generates meaningful aria-labels using Chrome Built-in AI.
// Called when user enables "Smart aria-labels" in the panel.
// ─────────────────────────────────────────────────────────────────────────────
export async function applySmartLabels(): Promise<LabelResult> {
  // Check support first
  const supported = await checkLabellerSupport();
  if (!supported) {
    return {
      success:  false,
      fixed:    0,
      elements: [],
      error:    "Chrome Built-in AI not available. Chrome 127+ required.",
    };
  }

  // Find all unlabelled elements
  const elements = document.querySelectorAll<HTMLElement>(UNLABELLED_SELECTORS);

  if (elements.length === 0) {
    return {
      success:  true,
      fixed:    0,
      elements: [],
    };
  }

  try {
    // Create one writer session for all elements
    const writer = await window.ai!.writer!.create({
      tone:   "neutral",
      format: "plain-text",
      length: "short",
    });

    let fixed = 0;
    const labelledElements: { tag: string; label: string }[] = [];

    for (const el of elements) {
      // Skip yuktai's own panel
      if (el.closest("[data-yuktai-panel]")) continue;

      // Skip hidden elements
      const style = window.getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") continue;

      // Get context for this element
      const context = getElementContext(el);

      // Generate label using AI
      const label = await generateLabel(writer, context);

      if (label && label.length > 0) {
        // Store original state
        el.dataset.yuktaiLabelOriginal =
          el.getAttribute("aria-label") || "";

        // Apply the generated label
        el.setAttribute("aria-label", label);
        fixed++;

        labelledElements.push({
          tag:   el.tagName.toLowerCase(),
          label,
        });
      }
    }

    // Clean up writer session
    writer.destroy();

    return {
      success:  true,
      fixed,
      elements: labelledElements,
    };

  } catch (error) {
    return {
      success:  false,
      fixed:    0,
      elements: [],
      error:    error instanceof Error ? error.message : "Label generation failed",
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// removeSmartLabels
// Removes all AI-generated labels and restores original state.
// Called when user turns off Smart aria-labels toggle.
// ─────────────────────────────────────────────────────────────────────────────
export function removeSmartLabels(): void {
  const labelled = document.querySelectorAll<HTMLElement>(
    "[data-yuktai-label-original]"
  );

  for (const el of labelled) {
    const original = el.dataset.yuktaiLabelOriginal;

    if (original) {
      // Restore original label
      el.setAttribute("aria-label", original);
    } else {
      // Remove label entirely if there was none before
      el.removeAttribute("aria-label");
    }

    delete el.dataset.yuktaiLabelOriginal;
  }
}