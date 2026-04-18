// lib/wcagPlugin.ts
// Place this file at:  src/lib/wcagPlugin.ts
// Import it anywhere:  import { wcagPlugin } from "@/lib/wcagPlugin"

export interface A11yConfig {
  enabled: boolean;
  highContrast?: boolean;
  reduceMotion?: boolean;
  autoFix?: boolean;
  root?: HTMLElement | Document;
}

export interface A11yReport {
  fixed: number;
  scanned: number;
}

export const wcagPlugin = {
  name: "ui.a11y.pro",
  version: "1.0.0",
  observer: null as MutationObserver | null,

  // ── Main entry point ────────────────────────────────────────
  async execute(config: A11yConfig): Promise<A11yReport | string> {
    if (!config?.enabled) {
      this.stopObserver();
      return "yuktai-a11y: disabled";
    }

    const report = this.applyFixes(config);

    if (config.autoFix) {
      this.startObserver(config);
    }

    this.ensureLiveRegion();
    this.announce(`Accessibility active. ${report.fixed} fixes applied.`);

    return report;
  },

  // ── DOM fixer ───────────────────────────────────────────────
  // IMPORTANT: never touches `id` attributes — developer owns those
  applyFixes(config: A11yConfig): A11yReport {
    const report: A11yReport = { fixed: 0, scanned: 0 };

    // SSR guard — never runs on the server
    if (typeof document === "undefined") return report;

    const root = config.root || document;

    const elements = root.querySelectorAll(
      "a,button,input,select,textarea,img,table,[onclick],[tabindex],h1,h2,h3,h4,h5,h6"
    );

    report.scanned = elements.length;

    let lastHeadingLevel = 0;

    elements.forEach((el) => {
      const h = el as HTMLElement;
      const tag = h.tagName.toLowerCase();

      // 1. Heading hierarchy — fix skipped levels
      if (/^h[1-6]$/.test(tag)) {
        const level = parseInt(tag[1]);
        if (level > lastHeadingLevel + 1 && lastHeadingLevel !== 0) {
          h.setAttribute("aria-level", String(lastHeadingLevel + 1));
          report.fixed++;
        }
        lastHeadingLevel = level;
      }

      // 2. Empty buttons / links — add fallback aria-label
      if ((tag === "a" || tag === "button") && !h.innerText.trim()) {
        if (!h.getAttribute("aria-label")) {
          const label = h.getAttribute("title") || "Interactive element";
          h.setAttribute("aria-label", label);
          report.fixed++;
        }
      }

      // 3. Clickable non-interactive elements → role + keyboard
      const isClickable =
        h.hasAttribute("onclick") ||
        (typeof window !== "undefined" &&
          window.getComputedStyle(h).cursor === "pointer");

      if (isClickable && !["button", "a", "input", "select", "textarea"].includes(tag)) {
        if (!h.getAttribute("role")) {
          h.setAttribute("role", "button");
          report.fixed++;
        }
        if (h.tabIndex < 0) {
          h.tabIndex = 0;
          report.fixed++;
        }
        // Prevent adding duplicate keyboard listener
        if (!(h as any)._yuktKeyBound) {
          h.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              h.click();
            }
          });
          (h as any)._yuktKeyBound = true;
        }
      }

      // 4. Form fields — inject aria-label from placeholder
      //    We never touch id — developer controls label association
      if (["input", "select", "textarea"].includes(tag)) {
        if (!h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
          const label =
            h.getAttribute("placeholder") ||
            h.getAttribute("name") ||
            tag;
          h.setAttribute("aria-label", label);
          report.fixed++;
        }
        if (h.hasAttribute("required") && !h.getAttribute("aria-required")) {
          h.setAttribute("aria-required", "true");
          report.fixed++;
        }
      }

      // 5. Images — empty alt for decorative images
      if (tag === "img" && !h.hasAttribute("alt")) {
        h.setAttribute("alt", "");
        h.setAttribute("aria-hidden", "true");
        report.fixed++;
      }

      // 6. Tables without headers
      if (tag === "table" && !el.querySelector("th")) {
        if (!h.getAttribute("role")) {
          h.setAttribute("role", "grid");
          report.fixed++;
        }
      }
    });

    // 7. Visual preferences — applied at document root level
    if (config.highContrast) {
      document.documentElement.style.filter = "contrast(1.15) brightness(1.05)";
    }
    if (config.reduceMotion) {
      document.documentElement.style.scrollBehavior = "auto";
      // Also inject a global style rule for prefers-reduce-motion
      if (!document.getElementById("yukt-reduce-motion")) {
        const style = document.createElement("style");
        style.id = "yukt-reduce-motion";
        style.textContent = `*, *::before, *::after { transition: none !important; animation: none !important; }`;
        document.head.appendChild(style);
      }
    }

    return report;
  },

  // ── MutationObserver — watches for new DOM nodes ────────────
  startObserver(config: A11yConfig) {
    if (this.observer || typeof document === "undefined") return;

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            // Only scan the newly added subtree — not the full page again
            this.applyFixes({ ...config, root: node });
          }
        });
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  },

  stopObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  },

  // ── Screen reader live region ────────────────────────────────
  ensureLiveRegion() {
    if (typeof document === "undefined") return;
    if (document.getElementById("yukt-sr-announcer")) return;

    const node = document.createElement("div");
    node.id = "yukt-sr-announcer";
    node.setAttribute("aria-live", "polite");
    node.setAttribute("aria-atomic", "true");
    node.style.cssText =
      "position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;";
    document.body.appendChild(node);
  },

  announce(msg: string) {
    if (typeof document === "undefined") return;
    const node = document.getElementById("yukt-sr-announcer");
    if (!node) return;
    // Clear first, then set — forces screen readers to re-announce
    node.textContent = "";
    setTimeout(() => {
      node.textContent = msg;
    }, 50);
  },
};