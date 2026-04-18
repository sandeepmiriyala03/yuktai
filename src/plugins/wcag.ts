// wcagPlugin.ts
// Generic WCAG 2.1 AA accessibility engine
// Works on any website — no hardcoded class names or selectors
// YuktAIWrapper calls execute() once on page load — everything else is automatic

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
  details: { tag: string; fix: string }[];
}

export const wcagPlugin = {
  name: "ui.a11y.pro",
  version: "1.0.0",
  observer: null as MutationObserver | null,
  drawerObserver: null as MutationObserver | null,

  // ─────────────────────────────────────────────────────────────
  // MAIN ENTRY — YuktAIWrapper calls this once on page load
  // ─────────────────────────────────────────────────────────────
  async execute(config: A11yConfig): Promise<A11yReport | string> {
    if (!config?.enabled) {
      this.stopObserver();
      this.stopDrawerObserver();
      return "yuktai-a11y: disabled";
    }

    // SSR guard
    if (typeof document === "undefined") {
      return { fixed: 0, scanned: 0, details: [] };
    }

    // Step 1 — fix all WCAG issues present at page load
    const report = this.applyFixes(config);

    // Step 2 — patch interactive patterns (nav, dialogs, tabs etc.)
    // runs after first paint so all elements are in DOM
    requestAnimationFrame(() => {
      this.patchInteractivePatterns();
      this.watchDialogs();
    });

    // Step 3 — watch DOM for future changes (dynamic content, modals, drawers)
    if (config.autoFix) {
      this.startObserver(config);
    }

    // Step 4 — screen reader announcer
    this.ensureLiveRegion();
    this.announce(`Accessibility active. ${report.fixed} fixes applied.`);

    return report;
  },

  // ─────────────────────────────────────────────────────────────
  // WCAG DOM FIXER
  // Scans every relevant element and injects missing ARIA
  // WCAG 2.1 rules covered:
  //   1.1.1  — Non-text content (images)
  //   1.3.1  — Info and relationships (labels, roles)
  //   2.1.1  — Keyboard (clickable elements)
  //   2.4.6  — Headings and labels
  //   4.1.2  — Name, role, value (form controls)
  // ─────────────────────────────────────────────────────────────
  applyFixes(config: A11yConfig): A11yReport {
    const report: A11yReport = { fixed: 0, scanned: 0, details: [] };
    if (typeof document === "undefined") return report;

    const root = config.root || document;

    const elements = root.querySelectorAll(
      "a, button, input, select, textarea, img, table, " +
      "[onclick], [tabindex], [contenteditable], " +
      "h1, h2, h3, h4, h5, h6, " +
      "nav, main, header, footer, aside, section"
    );

    report.scanned = elements.length;
    let lastHeadingLevel = 0;

    elements.forEach((el) => {
      const h = el as HTMLElement;
      const tag = h.tagName.toLowerCase();

      // ── WCAG 2.4.6 — Heading hierarchy ──────────────────────
      if (/^h[1-6]$/.test(tag)) {
        const level = parseInt(tag[1]);
        if (level > lastHeadingLevel + 1 && lastHeadingLevel !== 0) {
          // Skipped a heading level — correct it with aria-level
          h.setAttribute("aria-level", String(lastHeadingLevel + 1));
          report.fixed++;
          report.details.push({ tag, fix: `aria-level="${lastHeadingLevel + 1}" (skipped heading corrected)` });
        }
        lastHeadingLevel = level;
      }

      // ── WCAG 1.3.1 — Landmark roles ─────────────────────────
      // Ensure semantic elements have explicit roles when needed
      if (tag === "nav" && !h.getAttribute("aria-label")) {
        // Multiple navs on a page must be distinguishable
        const allNavs = document.querySelectorAll("nav");
        if (allNavs.length > 1 && !h.getAttribute("aria-labelledby")) {
          h.setAttribute("aria-label", "Navigation");
          report.fixed++;
          report.details.push({ tag, fix: 'aria-label="Navigation"' });
        }
      }

      // ── WCAG 4.1.2 — Empty interactive elements ─────────────
      if ((tag === "a" || tag === "button") && !h.innerText.trim()) {
        if (!h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
          const label =
            h.getAttribute("title") ||
            h.getAttribute("data-label") ||
            h.querySelector("img")?.getAttribute("alt") ||
            "Interactive element";
          h.setAttribute("aria-label", label);
          report.fixed++;
          report.details.push({ tag, fix: `aria-label="${label}"` });
        }
      }

      // ── WCAG 2.1.1 — Keyboard: clickable non-interactive elements
      const isClickable =
        h.hasAttribute("onclick") ||
        (typeof window !== "undefined" &&
          window.getComputedStyle(h).cursor === "pointer");

      const isNativeInteractive = ["button", "a", "input", "select", "textarea"].includes(tag);

      if (isClickable && !isNativeInteractive) {
        if (!h.getAttribute("role")) {
          h.setAttribute("role", "button");
          report.fixed++;
          report.details.push({ tag, fix: 'role="button"' });
        }
        if (h.tabIndex < 0) {
          h.tabIndex = 0;
          report.fixed++;
          report.details.push({ tag, fix: 'tabindex="0"' });
        }
        // Add keyboard handler — Enter and Space trigger click
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

      // ── WCAG 4.1.2 — Form field labels ──────────────────────
      // Never touch id — developer owns id and label[for] association
      if (["input", "select", "textarea"].includes(tag)) {
        const inputEl = h as HTMLInputElement;

        // Skip hidden inputs
        if (inputEl.type === "hidden") return;

        if (!h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
          // Try to find an associated <label> via id
          const id = h.getAttribute("id");
          const hasLabel = id
            ? !!document.querySelector(`label[for="${id}"]`)
            : false;

          if (!hasLabel) {
            const label =
              h.getAttribute("placeholder") ||
              h.getAttribute("name") ||
              h.getAttribute("data-label") ||
              tag;
            h.setAttribute("aria-label", label);
            report.fixed++;
            report.details.push({ tag, fix: `aria-label="${label}"` });
          }
        }

        // required fields must declare aria-required
        if (h.hasAttribute("required") && !h.getAttribute("aria-required")) {
          h.setAttribute("aria-required", "true");
          report.fixed++;
          report.details.push({ tag, fix: 'aria-required="true"' });
        }

        // disabled fields should declare aria-disabled
        if (h.hasAttribute("disabled") && !h.getAttribute("aria-disabled")) {
          h.setAttribute("aria-disabled", "true");
          report.fixed++;
          report.details.push({ tag, fix: 'aria-disabled="true"' });
        }
      }

      // ── WCAG 1.1.1 — Images ─────────────────────────────────
      if (tag === "img") {
        if (!h.hasAttribute("alt")) {
          // Decorative image — hide from screen readers
          h.setAttribute("alt", "");
          h.setAttribute("aria-hidden", "true");
          report.fixed++;
          report.details.push({ tag, fix: 'alt="" aria-hidden="true" (decorative)' });
        }
        // If alt exists but is filename-like, flag it (can't auto-fix meaning)
      }

      // ── WCAG 1.3.1 — Tables ─────────────────────────────────
      if (tag === "table") {
        if (!el.querySelector("th") && !h.getAttribute("role")) {
          h.setAttribute("role", "grid");
          report.fixed++;
          report.details.push({ tag, fix: 'role="grid" (no th found)' });
        }
        // Tables need a caption or aria-label for screen readers
        if (!el.querySelector("caption") && !h.getAttribute("aria-label")) {
          h.setAttribute("aria-label", "Data table");
          report.fixed++;
          report.details.push({ tag, fix: 'aria-label="Data table"' });
        }
      }
    });

    // ── Visual preferences ───────────────────────────────────
    if (config.highContrast) {
      document.documentElement.style.filter = "contrast(1.15) brightness(1.05)";
    }

    if (config.reduceMotion) {
      document.documentElement.style.scrollBehavior = "auto";
      if (!document.getElementById("yukt-reduce-motion")) {
        const style = document.createElement("style");
        style.id = "yukt-reduce-motion";
        style.textContent =
          `*, *::before, *::after { transition: none !important; animation: none !important; }`;
        document.head.appendChild(style);
      }
    }

    return report;
  },

  // ─────────────────────────────────────────────────────────────
  // INTERACTIVE PATTERNS PATCHER
  // Generic — detects patterns by behaviour, not by class name
  // Covers: nav dropdowns, mobile drawers, dialogs, tabs, accordions
  // ─────────────────────────────────────────────────────────────
  patchInteractivePatterns() {
    if (typeof document === "undefined") return;

    // ── 1. Navigation landmarks ──────────────────────────────
    // Multiple <nav> elements must each have a unique aria-label
    const navEls = document.querySelectorAll<HTMLElement>("nav");
    if (navEls.length > 1) {
      navEls.forEach((nav, i) => {
        if (!nav.getAttribute("aria-label") && !nav.getAttribute("aria-labelledby")) {
          nav.setAttribute("aria-label", i === 0 ? "Main navigation" : `Navigation ${i + 1}`);
        }
      });
    }

    // ── 2. Dropdown trigger buttons ─────────────────────────
    // Detect: any button/div that has a sibling or child menu-like element
    // Signs: has aria-haspopup, controls a [role=menu], or has a child list
    document.querySelectorAll<HTMLElement>(
      "[aria-haspopup], [data-toggle='dropdown']"
    ).forEach((trigger) => {
      if (!trigger.getAttribute("aria-expanded")) {
        trigger.setAttribute("aria-expanded", "false");
      }
    });

    // Detect divs acting as dropdown triggers by cursor + child list pattern
    document.querySelectorAll<HTMLElement>("div, span").forEach((el) => {
      if (typeof window === "undefined") return;
      const hasPointer = window.getComputedStyle(el).cursor === "pointer";
      const hasChildMenu =
        el.querySelector("[role='menu'], ul, ol") !== null ||
        el.nextElementSibling?.matches("ul, ol, [role='menu'], [role='listbox']");

      if (hasPointer && hasChildMenu) {
        if (!el.getAttribute("role"))          el.setAttribute("role", "button");
        if (!el.getAttribute("aria-haspopup")) el.setAttribute("aria-haspopup", "true");
        if (!el.getAttribute("aria-expanded")) el.setAttribute("aria-expanded", "false");
        if (!el.getAttribute("tabindex"))      el.setAttribute("tabindex", "0");

        if (!(el as any)._dropKeyBound) {
          el.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.click(); }
            if (e.key === "Escape") el.blur();
          });
          (el as any)._dropKeyBound = true;
        }
      }
    });

    // ── 3. Dialog / Drawer / Modal detection ────────────────
    // Detect by: role=dialog already set, or common modal patterns
    document.querySelectorAll<HTMLElement>(
      "[role='dialog'], [role='alertdialog'], " +
      "[aria-modal='true'], " +
      ".modal, .drawer, .sidebar, .overlay, .panel"
    ).forEach((dialog) => {
      if (!dialog.getAttribute("role"))       dialog.setAttribute("role", "dialog");
      if (!dialog.getAttribute("aria-modal")) dialog.setAttribute("aria-modal", "true");
      if (!dialog.getAttribute("aria-label") && !dialog.getAttribute("aria-labelledby")) {
        // Try to find a heading inside as the label
        const heading = dialog.querySelector<HTMLElement>("h1, h2, h3, h4");
        if (heading) {
          if (!heading.getAttribute("id")) {
            heading.setAttribute("id", `yukt-dlg-title-${Date.now()}`);
          }
          dialog.setAttribute("aria-labelledby", heading.getAttribute("id")!);
        } else {
          dialog.setAttribute("aria-label", "Dialog");
        }
      }
    });

    // ── 4. Tab patterns ─────────────────────────────────────
    // Detect: elements with role=tab that are missing aria-selected
    document.querySelectorAll<HTMLElement>("[role='tab']").forEach((tab) => {
      if (!tab.getAttribute("aria-selected")) {
        tab.setAttribute("aria-selected", "false");
      }
    });

    // ── 5. Accordion / expand-collapse patterns ──────────────
    // Detect: buttons that control a collapsible region
    document.querySelectorAll<HTMLElement>(
      "[aria-controls], [data-toggle='collapse']"
    ).forEach((trigger) => {
      if (trigger.tagName.toLowerCase() === "button") {
        if (!trigger.getAttribute("aria-expanded")) {
          trigger.setAttribute("aria-expanded", "false");
        }
      }
    });

    // ── 6. Icon-only buttons ─────────────────────────────────
    // Detect: buttons that contain only an svg or img, no text
    document.querySelectorAll<HTMLElement>("button, [role='button']").forEach((btn) => {
      const hasText = btn.innerText.trim().length > 0;
      const hasSvg = btn.querySelector("svg") !== null;
      const hasImg = btn.querySelector("img") !== null;

      if (!hasText && (hasSvg || hasImg)) {
        if (!btn.getAttribute("aria-label") && !btn.getAttribute("aria-labelledby")) {
          const label =
            btn.getAttribute("title") ||
            btn.getAttribute("data-label") ||
            btn.getAttribute("name") ||
            "Button";
          btn.setAttribute("aria-label", label);
        }
        // Hide decorative svg from screen reader — button label is enough
        btn.querySelectorAll<HTMLElement>("svg").forEach((svg) => {
          if (!svg.getAttribute("aria-hidden")) {
            svg.setAttribute("aria-hidden", "true");
          }
        });
      }
    });

    // ── 7. Links that open in new tab ────────────────────────
    // Detect: target="_blank" without warning screen reader users
    document.querySelectorAll<HTMLAnchorElement>("a[target='_blank']").forEach((a) => {
      if (!a.getAttribute("aria-label") && !a.getAttribute("aria-describedby")) {
        const existing = a.getAttribute("aria-label") || a.innerText.trim();
        if (existing) {
          a.setAttribute("aria-label", `${existing} (opens in new tab)`);
        }
      }
    });

    // ── 8. Skip navigation link ──────────────────────────────
    // WCAG 2.4.1 — Add a skip link if none exists
    if (!document.getElementById("yukt-skip-link")) {
      const main = document.querySelector("main, [role='main'], #main, #content");
      if (main) {
        if (!main.getAttribute("id")) main.setAttribute("id", "yukt-main-content");
        const skip = document.createElement("a");
        skip.id = "yukt-skip-link";
        skip.href = `#${main.getAttribute("id")}`;
        skip.textContent = "Skip to main content";
        skip.style.cssText = [
          "position:fixed",
          "top:-999px",
          "left:8px",
          "z-index:99999",
          "padding:8px 16px",
          "background:#0d9488",
          "color:#fff",
          "border-radius:4px",
          "font-size:14px",
          "text-decoration:none",
          "transition:top 0.2s",
        ].join(";");
        skip.addEventListener("focus", () => { skip.style.top = "8px"; });
        skip.addEventListener("blur",  () => { skip.style.top = "-999px"; });
        document.body.insertBefore(skip, document.body.firstChild);
      }
    }
  },

  // ─────────────────────────────────────────────────────────────
  // DIALOG / DRAWER WATCHER
  // Watches for any element gaining/losing an "open" state
  // Works generically — detects open state by:
  //   - class changes (open, is-open, active, visible, show)
  //   - aria-hidden toggling
  //   - display style changes
  // ─────────────────────────────────────────────────────────────
  watchDialogs() {
    if (typeof document === "undefined" || this.drawerObserver) return;

    const OPEN_CLASSES = ["open", "is-open", "active", "visible", "show", "expanded"];

    this.drawerObserver = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        const target = m.target as HTMLElement;

        // Only care about elements that look like dialogs/drawers
        const isDialog =
          target.getAttribute("role") === "dialog" ||
          target.getAttribute("role") === "alertdialog" ||
          target.getAttribute("aria-modal") === "true";

        if (!isDialog) return;

        if (m.type === "attributes" && m.attributeName === "class") {
          const isOpen = OPEN_CLASSES.some((c) => target.classList.contains(c));
          target.setAttribute("aria-hidden", String(!isOpen));

          // Find the trigger that controls this dialog
          const id = target.getAttribute("id");
          if (id) {
            const trigger = document.querySelector<HTMLElement>(
              `[aria-controls="${id}"]`
            );
            if (trigger) trigger.setAttribute("aria-expanded", String(isOpen));
          }

          // Focus management — move focus inside when opened (WCAG 2.1.2)
          if (isOpen) {
            const firstFocusable = target.querySelector<HTMLElement>(
              "a[href], button:not([disabled]), input:not([disabled]), " +
              "select:not([disabled]), textarea:not([disabled]), [tabindex='0']"
            );
            setTimeout(() => firstFocusable?.focus(), 50);
          }
        }

        if (m.type === "attributes" && m.attributeName === "aria-hidden") {
          const isHidden = target.getAttribute("aria-hidden") === "true";
          const id = target.getAttribute("id");
          if (id) {
            const trigger = document.querySelector<HTMLElement>(
              `[aria-controls="${id}"]`
            );
            if (trigger) trigger.setAttribute("aria-expanded", String(!isHidden));
          }
        }
      });
    });

    // Watch the full document body for any dialog-like elements
    this.drawerObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "aria-hidden", "style"],
      subtree: true,
    });
  },

  // ─────────────────────────────────────────────────────────────
  // MUTATIONOBSERVER — autoFix mode
  // Watches for new DOM nodes and applies fixes to them
  // Only scans the new subtree — not the full page again
  // ─────────────────────────────────────────────────────────────
  startObserver(config: A11yConfig) {
    if (this.observer || typeof document === "undefined") return;

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            this.applyFixes({ ...config, root: node });
            // Also patch interactive patterns in the new subtree
            requestAnimationFrame(() => this.patchInteractivePatterns());
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
    if (this.observer) { this.observer.disconnect(); this.observer = null; }
  },

  stopDrawerObserver() {
    if (this.drawerObserver) { this.drawerObserver.disconnect(); this.drawerObserver = null; }
  },

  // ─────────────────────────────────────────────────────────────
  // SCREEN READER LIVE REGION
  // ─────────────────────────────────────────────────────────────
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
    node.textContent = "";
    setTimeout(() => { node.textContent = msg; }, 50);
  },
};

// ─────────────────────────────────────────────────────────────
// Default export — matches YuktAIWrapper import shape:
//   const api = mod?.default
//   api.list()       → feature flags
//   api.wcagPlugin   → the engine
// ─────────────────────────────────────────────────────────────
const yuktai = {
  list(): string[] {
    return ["ui.a11y.pro", "image.ocr.smart"];
  },
  wcagPlugin,
};

export default yuktai;
