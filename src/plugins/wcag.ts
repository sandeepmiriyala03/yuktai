export interface A11yConfig {
  enabled: boolean;
  highContrast?: boolean;
  reduceMotion?: boolean;
  autoFix?: boolean; // If true, it starts the MutationObserver
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

    return `♿ YuktAI A11y Active: ${report.fixed} DOM issues resolved across ${report.scanned} nodes.`;
  },

  applyFixes(config: A11yConfig) {
    const report = { fixed: 0, scanned: 0 };
    const elements = document.querySelectorAll("*");
    report.scanned = elements.length;

    let lastHeadingLevel = 0;

    elements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      const tag = htmlEl.tagName.toLowerCase();

      // 1. 🏗️ DOM STRUCTURE & HEADING HIERARCHY
      if (/^h[1-6]$/.test(tag)) {
        const level = parseInt(tag[1]);
        if (level > lastHeadingLevel + 1 && lastHeadingLevel !== 0) {
          htmlEl.setAttribute("aria-level", (lastHeadingLevel + 1).toString());
          report.fixed++;
        }
        lastHeadingLevel = level;
      }

      // 2. 🔗 LINK & BUTTON INTEGRITY (Empty Elements)
      if ((tag === "a" || tag === "button") && !htmlEl.innerText.trim()) {
        const desc = htmlEl.getAttribute("title") || htmlEl.getAttribute("aria-label") || "Action button";
        htmlEl.setAttribute("aria-label", desc);
        report.fixed++;
      }

      // 3. 🖱️ INTERACTIVE SEMANTICS (The "Vibe" Fix)
      const hasClick = htmlEl.hasAttribute("onclick") || window.getComputedStyle(htmlEl).cursor === "pointer";
      if (hasClick && !["button", "a", "input"].includes(tag)) {
        if (!htmlEl.getAttribute("role")) htmlEl.setAttribute("role", "button");
        if (htmlEl.tabIndex < 0) htmlEl.tabIndex = 0;
        
        // Add Keyboard Trigger
        htmlEl.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") htmlEl.click(); };
        report.fixed++;
      }

      // 4. 📋 FORM & LABEL RELATIONSHIPS
      if (["input", "select", "textarea"].includes(tag)) {
        if (!htmlEl.id) htmlEl.id = `yukt-id-${Math.random().toString(36).slice(2, 7)}`;
        
        const label = document.querySelector(`label[for="${htmlEl.id}"]`);
        if (!label && !htmlEl.getAttribute("aria-label")) {
          const placeholder = htmlEl.getAttribute("placeholder") || "User input";
          htmlEl.setAttribute("aria-label", placeholder);
          report.fixed++;
        }
        if (htmlEl.hasAttribute("required")) htmlEl.setAttribute("aria-required", "true");
      }

      // 5. 🖼️ MEDIA & TABLES
      if (tag === "img" && !htmlEl.hasAttribute("alt")) {
        htmlEl.setAttribute("alt", ""); 
        report.fixed++;
      }
      if (tag === "table" && !htmlEl.querySelector("th")) {
        htmlEl.setAttribute("role", "grid"); // Fallback for layout tables vs data tables
      }

      // 6. 🎨 VISUAL ACCESSIBILITY
      if (config.highContrast) {
        htmlEl.style.filter = "contrast(1.1) brightness(1.05)";
      }
      if (config.reduceMotion) {
        htmlEl.style.transition = "none";
        htmlEl.style.animation = "none";
      }
    });

    this.ensureLiveRegion();
    return report;
  },

  startObserver(config: A11yConfig) {
    if (this.observer) return;
    this.observer = new MutationObserver(() => this.applyFixes(config));
    this.observer.observe(document.body, { childList: true, subtree: true });
  },

  stopObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  },

  ensureLiveRegion() {
    if (!document.getElementById("yukt-announcer")) {
      const node = document.createElement("div");
      node.id = "yukt-announcer";
      node.setAttribute("aria-live", "polite");
      node.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;";
      document.body.appendChild(node);
    }
  },

  announce(msg: string) {
    const announcer = document.getElementById("yukt-announcer");
    if (announcer) announcer.innerText = msg;
  }
};