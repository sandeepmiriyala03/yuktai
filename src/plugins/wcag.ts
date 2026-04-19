// lib/wcagPlugin.ts
// Place this file at:  src/lib/wcagPlugin.ts
// Import it anywhere:  import { wcagPlugin } from "@/lib/wcagPlugin"

/**
 * Configuration options for the WCAG accessibility plugin.
 */
export interface A11yConfig {
  /** Whether the plugin is enabled */
  enabled: boolean;
  /** Enable high contrast mode */
  highContrast?: boolean;
  /** Reduce motion for animations and transitions */
  reduceMotion?: boolean;
  /** Automatically apply fixes to new DOM elements */
  autoFix?: boolean;
  /** Root element to scan (defaults to document) */
  root?: HTMLElement | Document;
  /** Skip specific fixes (e.g., ['headings', 'images']) */
  skipFixes?: string[];
  /** Include page validation in the report */
  validate?: boolean;
  level?: "A" | "AA" | "AAA";
}

/**
 * Report of accessibility fixes applied.
 */
export interface A11yReport {
  /** Number of elements fixed */
  fixed: number;
  /** Number of elements scanned */
  scanned: number;
  /** List of errors encountered */
  errors?: string[];
}

/**
 * WCAG Accessibility Plugin
 * Provides automated fixes for common WCAG 2.1 compliance issues.
 */
export const wcagPlugin = {
  name: "ui.a11y.pro",
  version: "1.0.1",
  observer: null as MutationObserver | null,

  /**
   * Main entry point for the accessibility plugin.
   * @param config Configuration options
   * @returns Promise resolving to a report or status message
   */
  async execute(config: A11yConfig): Promise<A11yReport | string> {
    if (!config?.enabled) {
      this.stopObserver();
      return "yuktai-a11y: disabled";
    }

    try {
      const report = this.applyFixes(config);

      if (config.autoFix) {
        this.startObserver(config);
      }

      this.ensureLiveRegion();
      this.announce(`Accessibility active. ${report.fixed} fixes applied.`);

      // If validation is requested, include it in the report
      if ((config as any).validate) {
        const validation = this.validatePage();
        return { ...report, validation };
      }

      return report;
    } catch (error) {
      console.error('WCAG Plugin execution error:', error);
      return { fixed: 0, scanned: 0, errors: [error.message] };
    }
  },

  /**
   * Applies accessibility fixes to DOM elements.
   * IMPORTANT: Never modifies 'id' attributes — developer owns those.
   * @param config Configuration options
   * @returns Report of fixes applied
   */
  applyFixes(config: A11yConfig): A11yReport {
    const report: A11yReport = { fixed: 0, scanned: 0, errors: [] };

    // SSR guard — never runs on the server
    if (typeof document === "undefined") return report;

    const root = config.root || document;
    const skipFixes = config.skipFixes || [];

    try {
      const elements = root.querySelectorAll(
        "a,button,input,select,textarea,img,table,[onclick],[tabindex],h1,h2,h3,h4,h5,h6,iframe,video,audio,[role],[aria-label],[aria-labelledby]"
      );

      report.scanned = elements.length;

      let lastHeadingLevel = 0;

      elements.forEach((el) => {
        try {
          const h = el as HTMLElement;
          const tag = h.tagName.toLowerCase();

          // 1. Heading hierarchy — fix skipped levels
          if (!skipFixes.includes('headings') && /^h[1-6]$/.test(tag)) {
            const level = parseInt(tag[1]);
            if (level > lastHeadingLevel + 1 && lastHeadingLevel !== 0) {
              h.setAttribute("aria-level", String(lastHeadingLevel + 1));
              report.fixed++;
            }
            lastHeadingLevel = level;
          }

          // 2. Empty buttons / links — add fallback aria-label
          if (!skipFixes.includes('buttons') && (tag === "a" || tag === "button") && !h.innerText.trim()) {
            if (!h.getAttribute("aria-label")) {
              const label = h.getAttribute("title") || h.getAttribute("aria-label") || "Interactive element";
              h.setAttribute("aria-label", label);
              report.fixed++;
            }
          }

          // 3. Clickable non-interactive elements → role + keyboard
          if (!skipFixes.includes('clickables')) {
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
          }

          // 4. Form fields — inject aria-label from placeholder
          //    We never touch id — developer controls label association
          if (!skipFixes.includes('forms') && ["input", "select", "textarea"].includes(tag)) {
            if (!h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
              const label =
                h.getAttribute("placeholder") ||
                h.getAttribute("name") ||
                h.getAttribute("title") ||
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
          if (!skipFixes.includes('images') && tag === "img" && !h.hasAttribute("alt")) {
            h.setAttribute("alt", "");
            h.setAttribute("aria-hidden", "true");
            report.fixed++;
          }

          // 6. Tables without headers
          if (!skipFixes.includes('tables') && tag === "table" && !el.querySelector("th")) {
            if (!h.getAttribute("role")) {
              h.setAttribute("role", "grid");
              report.fixed++;
            }
          }

          // 7. Media elements — add controls and captions
          if (!skipFixes.includes('media') && ["video", "audio"].includes(tag)) {
            if (!h.hasAttribute("controls")) {
              h.setAttribute("controls", "true");
              report.fixed++;
            }
          }

          // 8. Iframes — add title
          if (!skipFixes.includes('iframes') && tag === "iframe" && !h.getAttribute("title")) {
            h.setAttribute("title", "Embedded content");
            report.fixed++;
          }

        } catch (elementError) {
          report.errors!.push(`Error fixing element ${el.tagName}: ${elementError.message}`);
        }
      });

      // 9. Visual preferences — applied at document root level
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

    } catch (error) {
      report.errors!.push(`General error in applyFixes: ${error.message}`);
    }

    return report;
  },

  /**
   * Starts observing DOM mutations to apply fixes to new elements.
   * @param config Configuration options
   */
  startObserver(config: A11yConfig) {
    if (this.observer || typeof document === "undefined") return;

    this.observer = new MutationObserver((mutations) => {
      // Debounce mutations to avoid excessive processing
      clearTimeout((this as any)._mutationTimer);
      (this as any)._mutationTimer = setTimeout(() => {
        mutations.forEach((m) => {
          m.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              // Only scan the newly added subtree — not the full page again
              this.applyFixes({ ...config, root: node });
            }
          });
        });
      }, 100); // 100ms debounce
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false, // Only care about new elements
    });
  },

  /**
   * Stops the DOM mutation observer.
   */
  stopObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if ((this as any)._mutationTimer) {
      clearTimeout((this as any)._mutationTimer);
    }
  },

  /**
   * Cleans up all resources and resets the plugin state.
   */
  cleanup() {
    this.stopObserver();
    this.removeLiveRegion();
    // Remove any injected styles
    const style = document.getElementById("yukt-reduce-motion");
    if (style) style.remove();
    // Reset visual preferences
    if (typeof document !== "undefined") {
      document.documentElement.style.filter = "";
      document.documentElement.style.scrollBehavior = "";
    }
  },

  /**
   * Ensures a screen reader live region exists for announcements.
   */
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

  /**
   * Removes the screen reader live region.
   */
  removeLiveRegion() {
    if (typeof document === "undefined") return;
    const node = document.getElementById("yukt-sr-announcer");
    if (node) node.remove();
  },

  /**
   * Announces a message to screen readers.
   * @param msg Message to announce
   */
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

  /**
   * Checks if two colors have sufficient contrast ratio.
   * @param fg Foreground color (hex, rgb, or color name)
   * @param bg Background color (hex, rgb, or color name)
   * @param ratio Minimum contrast ratio (default 4.5 for normal text)
   * @returns True if contrast is sufficient
   */
  checkContrast(fg: string, bg: string, ratio: number = 4.5): boolean {
    try {
      // Simple implementation - in production, use a proper color library
      const getLuminance = (color: string): number => {
        // Convert color to RGB, then to luminance
        // This is a simplified version
        const temp = document.createElement("div");
        temp.style.color = color;
        temp.style.backgroundColor = bg;
        document.body.appendChild(temp);
        const fgRgb = window.getComputedStyle(temp).color;
        const bgRgb = window.getComputedStyle(temp).backgroundColor;
        temp.remove();

        // Parse RGB values and calculate luminance
        const fgMatch = fgRgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        const bgMatch = bgRgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

        if (!fgMatch || !bgMatch) return 1; // Assume good contrast if parsing fails

        const fgL = this.rgbToLuminance(parseInt(fgMatch[1]), parseInt(fgMatch[2]), parseInt(fgMatch[3]));
        const bgL = this.rgbToLuminance(parseInt(bgMatch[1]), parseInt(bgMatch[2]), parseInt(bgMatch[3]));

        const lighter = Math.max(fgL, bgL);
        const darker = Math.min(fgL, bgL);

        return (lighter + 0.05) / (darker + 0.05);
      };

      return getLuminance(fg) >= ratio;
    } catch (error) {
      console.warn('Contrast check failed:', error);
      return true; // Assume good contrast on error
    }
  },

  /**
   * Validates the current page for accessibility issues.
   * @returns Detailed report of accessibility status
   */
  validatePage(): { score: number; issues: string[]; recommendations: string[] } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (typeof document === "undefined") {
      return { score: 0, issues: ['Server-side rendering detected'], recommendations: [] };
    }

    // Check for missing lang attribute
    if (!document.documentElement.getAttribute('lang')) {
      issues.push('Missing lang attribute on html element');
      recommendations.push('Add lang attribute to <html> element (e.g., <html lang="en">)');
    }

    // Check for missing title
    if (!document.title) {
      issues.push('Missing page title');
      recommendations.push('Add a descriptive <title> element');
    }

    // Check for focus management
    const focusableElements = document.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
    if (focusableElements.length === 0) {
      issues.push('No keyboard-focusable elements found');
      recommendations.push('Ensure interactive elements are keyboard accessible');
    }

    // Check for images without alt
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
    if (imagesWithoutAlt.length > 0) {
      issues.push(`${imagesWithoutAlt.length} images missing alt text`);
      recommendations.push('Add descriptive alt text to all images');
    }

    // Check for headings hierarchy
    const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'));
    let lastLevel = 0;
    headings.forEach((h, index) => {
      const level = parseInt(h.tagName[1]);
      if (index > 0 && level > lastLevel + 1) {
        issues.push(`Skipped heading level: ${h.tagName} after h${lastLevel}`);
        recommendations.push('Ensure heading hierarchy is sequential');
      }
      lastLevel = level;
    });

    // Calculate score (simple heuristic)
    const score = Math.max(0, 100 - (issues.length * 10));

    return { score, issues, recommendations };
  },
};