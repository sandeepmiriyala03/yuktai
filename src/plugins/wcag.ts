export interface A11yConfig {
  enabled: boolean;
  highContrast?: boolean;
  reduceMotion?: boolean;
  autoFix?: boolean;
  root?: HTMLElement | Document; // 🔥 optional scope support
}

export const wcagPlugin = {
  name: "ui.a11y.pro",
  observer: null as MutationObserver | null,

  async execute(config: A11yConfig) {
    if (!config.enabled) {
      this.stopObserver();
      return "WCAG enforcement disabled.";
    }

    const report = this.applyFixes(config);

    if (config.autoFix) {
      this.startObserver(config);
    }

    this.ensureLiveRegion();
    this.announce(`Accessibility enabled. ${report.fixed} issues fixed`);

    return `♿ Fixed ${report.fixed} issues across ${report.scanned} elements`;
  },

  applyFixes(config: A11yConfig) {
    const report = { fixed: 0, scanned: 0 };

    const root = config.root || document;

    // 🔥 FINAL OPTIMIZED SELECTOR
    const elements = root.querySelectorAll(
      `
      a[href],
      button,
      input,
      select,
      textarea,
      img,
      table,
      [onclick],
      [role],
      [tabindex],
      [contenteditable],
      h1, h2, h3, h4, h5, h6
      `
    );

    report.scanned = elements.length;

    let lastHeadingLevel = 0;

    elements.forEach((el) => {
      const htmlEl = el as HTMLElement;

      // 🚀 skip already processed elements (performance)
      if (htmlEl.hasAttribute("data-a11y-checked")) return;
      htmlEl.setAttribute("data-a11y-checked", "true");

      const tag = htmlEl.tagName.toLowerCase();

      // 🏗️ Heading hierarchy
      if (/^h[1-6]$/.test(tag)) {
        const level = parseInt(tag[1]);
        if (level > lastHeadingLevel + 1 && lastHeadingLevel !== 0) {
          htmlEl.setAttribute("aria-level", String(lastHeadingLevel + 1));
          report.fixed++;
        }
        lastHeadingLevel = level;
      }

      // 🔗 Empty buttons/links
      if ((tag === "a" || tag === "button") && !htmlEl.innerText.trim()) {
        if (!htmlEl.getAttribute("aria-label")) {
          htmlEl.setAttribute("aria-label", "Action button");
          report.fixed++;
        }
      }

      // 🖱️ Clickable elements fix
      const hasClick =
        htmlEl.hasAttribute("onclick") ||
        window.getComputedStyle(htmlEl).cursor === "pointer";

      if (hasClick && !["button", "a", "input"].includes(tag)) {
        if (!htmlEl.getAttribute("role")) {
          htmlEl.setAttribute("role", "button");
          report.fixed++;
        }

        if (htmlEl.tabIndex < 0) {
          htmlEl.tabIndex = 0;
          report.fixed++;
        }

        // ✅ avoid duplicate listeners
        if (!htmlEl.hasAttribute("data-a11y-key")) {
          htmlEl.setAttribute("data-a11y-key", "true");

          htmlEl.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              htmlEl.click();
            }
          });
        }
      }

      // 📋 Forms
      if (["input", "select", "textarea"].includes(tag)) {
        if (!htmlEl.getAttribute("aria-label")) {
          const placeholder =
            htmlEl.getAttribute("placeholder") || "User input";
          htmlEl.setAttribute("aria-label", placeholder);
          report.fixed++;
        }

        if (htmlEl.hasAttribute("required")) {
          htmlEl.setAttribute("aria-required", "true");
        }
      }

      // 🖼️ Images
      if (tag === "img" && !htmlEl.hasAttribute("alt")) {
        htmlEl.setAttribute("alt", "");
        report.fixed++;
      }

      // 📊 Tables
      if (tag === "table" && !htmlEl.querySelector("th")) {
        htmlEl.setAttribute("role", "grid");
        report.fixed++;
      }

      // 🔥 debug marker (optional)
      htmlEl.setAttribute("data-a11y-fixed", "true");
    });

    // 🎨 Global visual adjustments
    if (config.highContrast) {
      document.documentElement.style.filter =
        "contrast(1.15) brightness(1.05)";
    }

    if (config.reduceMotion) {
      document.documentElement.style.scrollBehavior = "auto";
    }

    return report;
  },

  startObserver(config: A11yConfig) {
    if (this.observer) return;

    this.observer = new MutationObserver(() => {
      this.applyFixes(config);
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

  // ✅ pure DOM live region (no id)
  ensureLiveRegion() {
    let node = document.querySelector(
      '[aria-live="polite"]'
    ) as HTMLElement | null;

    if (!node) {
      node = document.createElement("div");
      node.setAttribute("aria-live", "polite");
      node.style.cssText =
        "position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;";
      document.body.appendChild(node);
    }
  },

  announce(msg: string) {
    const node = document.querySelector(
      '[aria-live="polite"]'
    ) as HTMLElement | null;

    if (node) {
      node.textContent = "";
      setTimeout(() => {
        node!.textContent = msg;
      }, 50);
    }
  },
};