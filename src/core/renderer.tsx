"use client";

// ─────────────────────────────────────────────────────────────────────────────
// yuktai-a11y · renderer.tsx
// Core accessibility engine — DOM fixer, observer, and reporting types.
// Zero id attributes — all injected nodes are tracked via module-level refs.
// ─────────────────────────────────────────────────────────────────────────────

export interface A11yConfig {
  enabled: boolean;
  highContrast?: boolean;
  reduceMotion?: boolean;
  autoFix?: boolean;
  fontSizeMultiplier?: number;
  colorBlindMode?: "none" | "deuteranopia" | "protanopia" | "tritanopia" | "achromatopsia";
  keyboardHints?: boolean;
}

export interface A11yReport {
  fixed: number;
  scanned: number;
  details: { tag: string; fix: string; element: string }[];
}

// ─── Module-level node references (no ids needed) ────────────────────────────
// These hold the actual DOM nodes we inject so we never rely on getElementById.

let _liveRegionNode: HTMLElement | null = null;
let _colorBlindSvgNode: SVGSVGElement | null = null;

// SVG filter reference ids are internal to the SVG element itself — they are
// not queried from the host document, so they are safe to use inside the SVG.
const CB_FILTER_REFS: Record<string, string> = {
  deuteranopia: "yuktai-cb-d",
  protanopia:   "yuktai-cb-p",
  tritanopia:   "yuktai-cb-t",
};

// ─── wcagPlugin ───────────────────────────────────────────────────────────────

export const wcagPlugin = {
  name: "yuktai-a11y",
  version: "1.0.0",
  observer: null as MutationObserver | null,

  /** Run fixes + optionally start MutationObserver. */
  async execute(config: A11yConfig): Promise<string> {
    if (!config.enabled) {
      this.stopObserver();
      return "yuktai-a11y: disabled.";
    }
    const report = this.applyFixes(config);
    if (config.autoFix) this.startObserver(config);
    return `yuktai-a11y: ${report.fixed} fixes applied across ${report.scanned} nodes.`;
  },

  /**
   * DOM accessibility fixer — WCAG A / AA / AAA.
   * Never touches id attributes. Never uses getElementById.
   */
  applyFixes(config: A11yConfig): A11yReport {
    const report: A11yReport = { fixed: 0, scanned: 0, details: [] };
    if (typeof document === "undefined") return report;

    const elements = document.querySelectorAll("*");
    report.scanned = elements.length;

    elements.forEach((el) => {
      const h = el as HTMLElement;
      const tag = h.tagName.toLowerCase();

      // ── LEVEL A: PERCEIVABLE ─────────────────────────────────────────────

      // 1. Empty buttons / links — inject aria-label
      if ((tag === "a" || tag === "button") && !h.innerText?.trim()) {
        if (!h.getAttribute("aria-label")) {
          const label = h.getAttribute("title") || "Interactive element";
          h.setAttribute("aria-label", label);
          report.details.push({ tag, fix: `aria-label="${label}"`, element: h.outerHTML.slice(0, 60) });
          report.fixed++;
        }
      }

      // 2. Decorative images — empty alt + aria-hidden
      if (tag === "img" && !h.hasAttribute("alt")) {
        h.setAttribute("alt", "");
        h.setAttribute("aria-hidden", "true");
        report.details.push({ tag, fix: 'alt="" aria-hidden="true"', element: h.outerHTML.slice(0, 60) });
        report.fixed++;
      }

      // ── LEVEL AA: KEYBOARD & NAVIGATION ─────────────────────────────────

      // 3. Clickable non-interactive elements — role, tabIndex, Enter/Space
      const isClickable =
        h.hasAttribute("onclick") ||
        (typeof window !== "undefined" && window.getComputedStyle(h).cursor === "pointer");

      if (isClickable && !["button", "a", "input", "select", "textarea"].includes(tag)) {
        if (!h.getAttribute("role")) {
          h.setAttribute("role", "button");
          report.details.push({ tag, fix: 'role="button"', element: h.outerHTML.slice(0, 60) });
          report.fixed++;
        }
        if (h.tabIndex < 0) {
          h.tabIndex = 0;
          report.fixed++;
        }
        if (!h.onkeydown) {
          h.onkeydown = (e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              h.click();
            }
          };
        }
      }

      // 4. Form fields — aria-label + aria-required (WCAG 1.3.1, 4.1.2)
      if (["input", "select", "textarea"].includes(tag)) {
        if (!h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
          const label =
            h.getAttribute("placeholder") || h.getAttribute("name") || tag;
          h.setAttribute("aria-label", label);
          report.details.push({ tag, fix: `aria-label="${label}"`, element: h.outerHTML.slice(0, 60) });
          report.fixed++;
        }
        if (h.hasAttribute("required") && !h.getAttribute("aria-required")) {
          h.setAttribute("aria-required", "true");
          report.fixed++;
        }
        // Input autocomplete purpose (WCAG 1.3.5)
        const inputEl = h as HTMLInputElement;
        if (tag === "input" && !inputEl.autocomplete) {
          if (inputEl.name?.includes("email")) inputEl.autocomplete = "email";
          else if (inputEl.name?.includes("tel")) inputEl.autocomplete = "tel";
        }
      }

      // ── LEVEL AAA: ENHANCED CONTEXT ──────────────────────────────────────

      // 5. Tables without headers (WCAG 1.3.1)
      if (tag === "table" && !el.querySelector("th")) {
        if (!h.getAttribute("role")) {
          h.setAttribute("role", "grid");
          report.details.push({ tag, fix: 'role="grid"', element: h.outerHTML.slice(0, 60) });
          report.fixed++;
        }
      }

      // 6. External links — security + screen-reader warning (WCAG 2.4.9)
      if (tag === "a") {
        const anchor = h as HTMLAnchorElement;
        if (anchor.target === "_blank") {
          if (!anchor.rel?.includes("noopener")) {
            anchor.rel = "noopener noreferrer";
            report.fixed++;
          }
          const currentLabel =
            anchor.getAttribute("aria-label") ||
            (anchor.innerText?.trim() ? anchor.innerText.trim() : "link");
          if (!currentLabel.includes("opens in new window")) {
            anchor.setAttribute("aria-label", `${currentLabel} (opens in new window)`);
            report.fixed++;
          }
        }
      }

      // 7. Structural landmarks
      const landmarks: Record<string, string> = {
        nav: "navigation",
        header: "banner",
        footer: "contentinfo",
        main: "main",
      };
      if (landmarks[tag] && !h.getAttribute("role")) {
        h.setAttribute("role", landmarks[tag]);
        report.fixed++;
      }

      // ── VISUAL PREFERENCES ───────────────────────────────────────────────

      if (config.highContrast) {
        h.style.filter = "contrast(1.15) brightness(1.05)";
      }

      if (config.reduceMotion) {
        h.style.transition = "none";
        h.style.animation = "none";
      }

      if (config.fontSizeMultiplier && config.fontSizeMultiplier !== 1) {
        const current = parseFloat(window.getComputedStyle(h).fontSize);
        h.style.fontSize = `${current * config.fontSizeMultiplier}px`;
      }

      if (config.colorBlindMode && config.colorBlindMode !== "none") {
        // achromatopsia uses a plain CSS filter — no SVG ref needed
        const filterValue =
          config.colorBlindMode === "achromatopsia"
            ? "grayscale(100%)"
            : `url(#${CB_FILTER_REFS[config.colorBlindMode]})`;
        h.style.filter = (h.style.filter ? h.style.filter + " " : "") + filterValue;
      }

      if (config.keyboardHints) {
        if (
          h.tabIndex >= 0 ||
          ["button", "a", "input", "select", "textarea"].includes(tag)
        ) {
          h.style.outline = "2px solid #007acc";
          h.style.outlineOffset = "2px";
        }
      }
    });

    // Inject SVG color-blindness filter definitions once.
    // Tracked via _colorBlindSvgNode — no id on the SVG element itself.
    // The filter ids inside the SVG defs are local to the SVG and do not
    // pollute the host document's id namespace.
    if (config.colorBlindMode && config.colorBlindMode !== "none" && !_colorBlindSvgNode) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("aria-hidden", "true");
      svg.style.display = "none";
      svg.innerHTML = `
        <defs>
          <filter id="${CB_FILTER_REFS.deuteranopia}">
            <feColorMatrix type="matrix" values="0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0"/>
          </filter>
          <filter id="${CB_FILTER_REFS.protanopia}">
            <feColorMatrix type="matrix" values="0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0"/>
          </filter>
          <filter id="${CB_FILTER_REFS.tritanopia}">
            <feColorMatrix type="matrix" values="0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0"/>
          </filter>
        </defs>
      `;
      document.body.appendChild(svg);
      _colorBlindSvgNode = svg;
    }

    this.ensureLiveRegion();
    return report;
  },

  /** Remove the injected color-blind SVG node if present. */
  removeColorBlindSvg() {
    _colorBlindSvgNode?.remove();
    _colorBlindSvgNode = null;
  },

  /** Start MutationObserver to re-apply fixes on DOM changes. */
  startObserver(config: A11yConfig) {
    if (this.observer || typeof document === "undefined") return;
    this.observer = new MutationObserver(() => this.applyFixes(config));
    this.observer.observe(document.body, { childList: true, subtree: true });
  },

  /** Stop and destroy the MutationObserver. */
  stopObserver() {
    this.observer?.disconnect();
    this.observer = null;
  },

  /**
   * Inject a visually-hidden aria-live region for screen-reader announcements.
   * The node is tracked in _liveRegionNode — no id attribute is set.
   */
  ensureLiveRegion() {
    if (typeof document === "undefined" || _liveRegionNode) return;
    const node = document.createElement("div");
    node.setAttribute("aria-live", "polite");
    node.setAttribute("aria-atomic", "true");
    node.style.cssText =
      "position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;";
    document.body.appendChild(node);
    _liveRegionNode = node;
  },

  /** Remove the live region node. */
  removeLiveRegion() {
    _liveRegionNode?.remove();
    _liveRegionNode = null;
  },

  /** Announce a message to screen readers via the live region. */
  announce(msg: string) {
    if (_liveRegionNode) _liveRegionNode.textContent = msg;
  },
};