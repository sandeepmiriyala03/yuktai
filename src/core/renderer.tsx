// ─────────────────────────────────────────────────────────────────────────────
// yuktai-a11y · core/renderer.ts  v1.0.0
// Universal accessibility engine — zero framework deps, zero id attributes.
// Covers EVERY HTML element: h1-h6, p, lists, forms, tables, media,
// interactive widgets, landmarks, inline, embeds, document-level.
// All injected nodes tracked via module-level refs — never touches host ids.
// ─────────────────────────────────────────────────────────────────────────────

export type ColorBlindMode =
  | "none" | "deuteranopia" | "protanopia" | "tritanopia" | "achromatopsia";

export type Severity = "critical" | "serious" | "moderate" | "minor";

export interface A11yConfig {
  enabled: boolean;
  highContrast?: boolean;
  reduceMotion?: boolean;
  autoFix?: boolean;
  fontSizeMultiplier?: number;
  colorBlindMode?: ColorBlindMode;
  keyboardHints?: boolean;
}

export interface A11yFix {
  tag: string;
  fix: string;
  severity: Severity;
  element: string;
}

export interface A11yReport {
  fixed: number;
  scanned: number;
  renderTime: number;
  details: A11yFix[];
}

// ─── Module-level refs — zero ids, zero host-page collisions ──────────────────
let _liveRegionNode: HTMLElement | null = null;
let _colorBlindSvgNode: SVGSVGElement | null = null;

const CB_FILTER_REFS: Record<string, string> = {
  deuteranopia: "yuktai-cb-d",
  protanopia:   "yuktai-cb-p",
  tritanopia:   "yuktai-cb-t",
};

// ─── Tag group sets ───────────────────────────────────────────────────────────
const HEADING_TAGS     = new Set(["h1","h2","h3","h4","h5","h6"]);
const FORM_TAGS        = new Set(["input","select","textarea"]);
const INTERACTIVE_TAGS = new Set(["button","a","input","select","textarea","details","summary"]);
const MEDIA_TAGS       = new Set(["video","audio"]);
const LIST_TAGS        = new Set(["ul","ol","dl"]);
const LIST_ITEM_TAGS   = new Set(["li","dt","dd"]);
const INLINE_TAGS      = new Set([
  "span","strong","em","b","i","u","s","small","mark","del","ins",
  "sub","sup","abbr","cite","code","kbd","samp","var","time","q",
]);
const LANDMARK_MAP: Record<string, string> = {
  nav: "navigation", header: "banner",
  footer: "contentinfo", main: "main", aside: "complementary",
};

// ─── wcagPlugin ───────────────────────────────────────────────────────────────

export const wcagPlugin = {
  name: "yuktai-a11y",
  version: "1.0.0",
  observer: null as MutationObserver | null,

  async execute(config: A11yConfig): Promise<string> {
    if (!config.enabled) {
      this.stopObserver();
      return "yuktai-a11y: disabled.";
    }
    const report = this.applyFixes(config);
    if (config.autoFix) this.startObserver(config);
    return `yuktai-a11y: ${report.fixed} fixes applied across ${report.scanned} nodes in ${report.renderTime}ms.`;
  },

  scan(): A11yReport {
    const report: A11yReport = { fixed: 0, scanned: 0, renderTime: 0, details: [] };
    if (typeof document === "undefined") return report;
    const start = performance.now();
    const elements = document.querySelectorAll("*");
    report.scanned = elements.length;
    const push = (tag: string, fix: string, severity: Severity, el: HTMLElement) =>
      report.details.push({ tag, fix, severity, element: el.outerHTML.slice(0, 100) });
    elements.forEach((el) => {
      const h = el as HTMLElement;
      const tag = h.tagName.toLowerCase();
      if ((tag === "a" || tag === "button") && !h.innerText?.trim() && !h.getAttribute("aria-label"))
        push(tag, "needs aria-label (empty)", "critical", h);
      if (tag === "img" && !h.hasAttribute("alt"))
        push(tag, "needs alt text", "serious", h);
      if (FORM_TAGS.has(tag) && !h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby"))
        push(tag, "needs aria-label", "serious", h);
      if (tag === "iframe" && !h.getAttribute("title") && !h.getAttribute("aria-label"))
        push(tag, "iframe needs title", "serious", h);
      if (MEDIA_TAGS.has(tag) && !el.querySelector("track") && !h.getAttribute("aria-label"))
        push(tag, "media needs captions/aria-label", "serious", h);
      if (HEADING_TAGS.has(tag) && !h.innerText?.trim() && !h.getAttribute("aria-label"))
        push(tag, "empty heading", "moderate", h);
    });
    report.fixed = report.details.length;
    report.renderTime = parseFloat((performance.now() - start).toFixed(2));
    return report;
  },

  applyFixes(config: A11yConfig): A11yReport {
    const report: A11yReport = { fixed: 0, scanned: 0, renderTime: 0, details: [] };
    if (typeof document === "undefined") return report;

    const start = performance.now();
    const elements = document.querySelectorAll("*");
    report.scanned = elements.length;

    const push = (tag: string, fix: string, severity: Severity, el: HTMLElement) => {
      report.details.push({ tag, fix, severity, element: el.outerHTML.slice(0, 100) });
      report.fixed++;
    };

    elements.forEach((el) => {
      const h = el as HTMLElement;
      const tag = h.tagName.toLowerCase();

      // ══════════════════════════════════════════════════════════════════════
      // DOCUMENT LEVEL
      // ══════════════════════════════════════════════════════════════════════

      // html lang
      if (tag === "html" && !h.getAttribute("lang")) {
        h.setAttribute("lang", "en");
        push(tag, 'lang="en" added to <html>', "critical", h);
      }

      // Page title
      if (tag === "head" && !document.title) {
        document.title = document.querySelector("h1")?.innerText?.trim() || "Page";
        push(tag, `document.title set to "${document.title}"`, "serious", h);
      }

      // Meta viewport — never block user zoom (WCAG 1.4.4)
      if (tag === "meta") {
        const name = h.getAttribute("name");
        const content = h.getAttribute("content") || "";
        if (name === "viewport" && content.includes("user-scalable=no")) {
          h.setAttribute("content", content.replace("user-scalable=no", "user-scalable=yes"));
          push(tag, "user-scalable=yes restored", "serious", h);
        }
        if (name === "viewport" && /maximum-scale=1(?:[^0-9]|$)/.test(content)) {
          h.setAttribute("content", content.replace(/maximum-scale=1(?=[^0-9]|$)/, "maximum-scale=5"));
          push(tag, "maximum-scale=5 restored", "serious", h);
        }
      }

      // Skip-to-content link — injected once
      if (tag === "body" && !document.querySelector("[data-yuktai-skip]")) {
        const skip = document.createElement("a");
        skip.setAttribute("href", "#main-content");
        skip.setAttribute("data-yuktai-skip", "true");
        skip.setAttribute("aria-label", "Skip to main content");
        skip.textContent = "Skip to main content";
        skip.style.cssText =
          "position:fixed;top:-40px;left:0;background:#0d9488;color:#fff;" +
          "padding:8px 16px;z-index:99999;font-family:system-ui;font-size:14px;" +
          "border-radius:0 0 4px 0;text-decoration:none;transition:top 0.2s;";
        skip.addEventListener("focus", () => { skip.style.top = "0"; });
        skip.addEventListener("blur",  () => { skip.style.top = "-40px"; });
        h.insertBefore(skip, h.firstChild);
        push(tag, "skip-to-content link injected", "minor", h);
        // Give main a tabindex so skip link can focus it
        const mainEl = document.querySelector("main,[role='main']") as HTMLElement | null;
        if (mainEl && !mainEl.getAttribute("tabindex")) mainEl.setAttribute("tabindex", "-1");
      }

      // ══════════════════════════════════════════════════════════════════════
      // HEADINGS: h1 – h6
      // ══════════════════════════════════════════════════════════════════════

      if (HEADING_TAGS.has(tag)) {
        // Empty heading
        if (!h.innerText?.trim() && !h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
          h.setAttribute("aria-label", `${tag.toUpperCase()} section`);
          push(tag, `aria-label="${tag.toUpperCase()} section" (empty heading)`, "moderate", h);
        }
        // Clickable headings need keyboard support
        if (h.hasAttribute("onclick") && !h.getAttribute("tabindex")) {
          h.setAttribute("tabindex", "0");
          if (!h.onkeydown) {
            h.onkeydown = (e: KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); h.click(); }
            };
          }
          push(tag, "tabindex=0 + keydown (clickable heading)", "minor", h);
        }
      }

      // ══════════════════════════════════════════════════════════════════════
      // PARAGRAPHS
      // ══════════════════════════════════════════════════════════════════════

      if (tag === "p") {
        // RTL paragraph without lang
        if (h.getAttribute("dir") === "rtl" && !h.getAttribute("lang") && !document.documentElement.getAttribute("lang")) {
          h.setAttribute("lang", "ar");
          push(tag, 'lang="ar" (rtl paragraph)', "moderate", h);
        }
      }

      // ══════════════════════════════════════════════════════════════════════
      // IMAGES & MEDIA
      // ══════════════════════════════════════════════════════════════════════

      // img
      if (tag === "img") {
        if (!h.hasAttribute("alt")) {
          h.setAttribute("alt", "");
          h.setAttribute("aria-hidden", "true");
          push(tag, 'alt="" aria-hidden="true"', "serious", h);
        }
        if (h.getAttribute("role") === "presentation" && h.getAttribute("alt") !== "") {
          h.setAttribute("alt", "");
          push(tag, 'alt="" (role=presentation)', "minor", h);
        }
      }

      // area (image maps)
      if (tag === "area" && !h.getAttribute("alt")) {
        const label = h.getAttribute("title") || h.getAttribute("href") || "map area";
        h.setAttribute("alt", label);
        push(tag, `alt="${label}" on <area>`, "serious", h);
      }

      // svg
      if (tag === "svg") {
        if (!h.getAttribute("aria-hidden") && !h.getAttribute("aria-label") && !el.querySelector("title")) {
          if (!h.getAttribute("role") || h.getAttribute("role") === "img") {
            const titleEl = document.createElementNS("http://www.w3.org/2000/svg", "title");
            titleEl.textContent = "graphic";
            h.prepend(titleEl);
            h.setAttribute("role", "img");
            push(tag, 'role="img" + <title> injected', "moderate", h);
          } else {
            h.setAttribute("aria-hidden", "true");
            push(tag, 'aria-hidden="true" (decorative svg)', "minor", h);
          }
        }
        if (!h.getAttribute("focusable")) h.setAttribute("focusable", "false");
      }

      // canvas
      if (tag === "canvas") {
        if (!h.getAttribute("role")) {
          h.setAttribute("role", "img");
          push(tag, 'role="img"', "serious", h);
        }
        if (!h.getAttribute("aria-label")) {
          h.setAttribute("aria-label", h.getAttribute("title") || "canvas graphic");
          push(tag, "aria-label added to canvas", "serious", h);
        }
      }

      // object / embed
      if (tag === "object" || tag === "embed") {
        if (!h.getAttribute("aria-label") && !h.getAttribute("title")) {
          h.setAttribute("aria-label", `embedded ${tag} content`);
          push(tag, `aria-label added to <${tag}>`, "moderate", h);
        }
      }

      // video
      if (tag === "video") {
        if (!el.querySelector("track") && !h.getAttribute("aria-label")) {
          h.setAttribute("aria-label", h.getAttribute("title") || "video player");
          push(tag, "aria-label added (no captions track)", "serious", h);
        }
      }

      // audio
      if (tag === "audio") {
        if (!el.querySelector("track") && !h.getAttribute("aria-label")) {
          h.setAttribute("aria-label", h.getAttribute("title") || "audio player");
          push(tag, "aria-label added to audio", "serious", h);
        }
      }

      // iframe
      if (tag === "iframe") {
        if (!h.getAttribute("title") && !h.getAttribute("aria-label")) {
          h.setAttribute("title", "embedded content");
          h.setAttribute("aria-label", "embedded content");
          push(tag, 'title + aria-label="embedded content"', "serious", h);
        }
      }

      // figure / figcaption
      if (tag === "figure") {
        if (!el.querySelector("figcaption") && !h.getAttribute("aria-label")) {
          const img = el.querySelector("img");
          const altText = img?.getAttribute("alt");
          if (altText) {
            h.setAttribute("aria-label", altText);
            push(tag, `aria-label from inner img alt`, "minor", h);
          }
        }
      }

      // ══════════════════════════════════════════════════════════════════════
      // INTERACTIVE: buttons, links, clickable divs
      // ══════════════════════════════════════════════════════════════════════

      // button
      if (tag === "button") {
        if (!h.innerText?.trim() && !h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
          const label = h.getAttribute("title") || h.getAttribute("data-label") || "button";
          h.setAttribute("aria-label", label);
          push(tag, `aria-label="${label}" (empty button)`, "critical", h);
        }
        if (h.hasAttribute("disabled") && !h.getAttribute("aria-disabled")) {
          h.setAttribute("aria-disabled", "true");
          report.fixed++;
        }
      }

      // a (links)
      if (tag === "a") {
        const anchor = h as HTMLAnchorElement;
        // Empty link
        if (!h.innerText?.trim() && !h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
          const label = h.getAttribute("title") || "link";
          h.setAttribute("aria-label", label);
          push(tag, `aria-label="${label}" (empty link)`, "critical", h);
        }
        // External links
        if (anchor.target === "_blank") {
          if (!anchor.rel?.includes("noopener")) {
            anchor.rel = "noopener noreferrer";
            report.fixed++;
          }
          const currentLabel = anchor.getAttribute("aria-label") || anchor.innerText?.trim() || "link";
          if (!currentLabel.includes("opens in new window")) {
            anchor.setAttribute("aria-label", `${currentLabel} (opens in new window)`);
            push(tag, "aria-label: new-window warning", "moderate", h);
          }
        }
        // Href-less interactive link
        if (!anchor.href && !anchor.getAttribute("role") && !anchor.getAttribute("tabindex")) {
          anchor.setAttribute("role", "button");
          anchor.setAttribute("tabindex", "0");
          push(tag, 'role="button" tabindex=0 (href-less link)', "serious", h);
        }
      }

      // Clickable non-interactive elements (divs, spans, etc.)
      const isClickable =
        h.hasAttribute("onclick") ||
        (typeof window !== "undefined" && window.getComputedStyle(h).cursor === "pointer");
      if (isClickable && !INTERACTIVE_TAGS.has(tag)) {
        if (!h.getAttribute("role")) {
          h.setAttribute("role", "button");
          push(tag, 'role="button" (clickable non-interactive)', "serious", h);
        }
        if (h.tabIndex < 0) { h.tabIndex = 0; report.fixed++; }
        if (!h.onkeydown) {
          h.onkeydown = (e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); h.click(); }
          };
        }
      }

      // ══════════════════════════════════════════════════════════════════════
      // FORMS
      // ══════════════════════════════════════════════════════════════════════

      if (FORM_TAGS.has(tag)) {
        const input = h as HTMLInputElement;

        // Label
        if (!h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
          const label = h.getAttribute("placeholder") || h.getAttribute("name") || h.getAttribute("title") || tag;
          h.setAttribute("aria-label", label);
          push(tag, `aria-label="${label}"`, "serious", h);
        }
        // Required
        if (h.hasAttribute("required") && !h.getAttribute("aria-required")) {
          h.setAttribute("aria-required", "true"); report.fixed++;
        }
        // Disabled
        if (h.hasAttribute("disabled") && !h.getAttribute("aria-disabled")) {
          h.setAttribute("aria-disabled", "true"); report.fixed++;
        }
        // Readonly
        if (h.hasAttribute("readonly") && !h.getAttribute("aria-readonly")) {
          h.setAttribute("aria-readonly", "true"); report.fixed++;
        }
        // Autocomplete purpose (WCAG 1.3.5)
        if (tag === "input" && !input.autocomplete) {
          const n = input.name || "";
          if (input.type === "email" || n.includes("email"))           { input.autocomplete = "email";          report.fixed++; }
          else if (input.type === "tel" || n.includes("tel"))          { input.autocomplete = "tel";            report.fixed++; }
          else if (input.type === "password")                          { input.autocomplete = "current-password"; report.fixed++; }
          else if (input.type === "url")                               { input.autocomplete = "url";            report.fixed++; }
          else if (n.includes("firstname") || n.includes("fname"))     { input.autocomplete = "given-name";     report.fixed++; }
          else if (n.includes("lastname") || n.includes("lname"))      { input.autocomplete = "family-name";    report.fixed++; }
          else if (n === "name" || n.includes("fullname"))             { input.autocomplete = "name";           report.fixed++; }
          else if (n.includes("zip") || n.includes("postal"))          { input.autocomplete = "postal-code";    report.fixed++; }
          else if (n.includes("city"))                                 { input.autocomplete = "address-level2"; report.fixed++; }
          else if (n.includes("country"))                              { input.autocomplete = "country";        report.fixed++; }
        }
        // input[type=image] needs alt
        if (tag === "input" && input.type === "image" && !h.getAttribute("alt")) {
          h.setAttribute("alt", h.getAttribute("value") || "submit");
          push(tag, "alt added to input[type=image]", "serious", h);
        }
        // Range inputs — ARIA value attributes
        if (tag === "input" && input.type === "range") {
          if (!h.getAttribute("aria-valuemin")) h.setAttribute("aria-valuemin", input.min || "0");
          if (!h.getAttribute("aria-valuemax")) h.setAttribute("aria-valuemax", input.max || "100");
          if (!h.getAttribute("aria-valuenow")) h.setAttribute("aria-valuenow", input.value || "50");
          report.fixed++;
        }
      }

      // fieldset without legend
      if (tag === "fieldset") {
        if (!el.querySelector("legend") && !h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
          h.setAttribute("aria-label", "form group");
          push(tag, 'aria-label="form group" (no legend)', "moderate", h);
        }
      }

      // label not associated with a control
      if (tag === "label") {
        const hasFor = h.getAttribute("for");
        const hasInput = el.querySelector("input,select,textarea");
        if (!hasFor && !hasInput && !h.getAttribute("aria-label")) {
          push(tag, "label not associated with any control", "moderate", h);
        }
      }

      // ══════════════════════════════════════════════════════════════════════
      // TABLES
      // ══════════════════════════════════════════════════════════════════════

      if (tag === "table") {
        if (!el.querySelector("th") && !h.getAttribute("role")) {
          h.setAttribute("role", "grid");
          push(tag, 'role="grid" (no <th>)', "serious", h);
        }
        if (!el.querySelector("caption") && !h.getAttribute("aria-label") && !h.getAttribute("summary")) {
          h.setAttribute("aria-label", "data table");
          push(tag, 'aria-label="data table" (no caption)', "moderate", h);
        }
      }

      if (tag === "th" && !h.getAttribute("scope")) {
        const isInThead = h.closest("thead") !== null;
        h.setAttribute("scope", isInThead ? "col" : "row");
        push(tag, `scope="${isInThead ? "col" : "row"}"`, "moderate", h);
      }

      // ══════════════════════════════════════════════════════════════════════
      // LISTS
      // ══════════════════════════════════════════════════════════════════════

      if (LIST_TAGS.has(tag)) {
        if (h.getAttribute("role") === "presentation") {
          el.querySelectorAll("li").forEach((li) => {
            if (!li.getAttribute("role")) li.setAttribute("role", "presentation");
          });
          report.fixed++;
        }
        if ((tag === "ul" || tag === "ol") && !h.getAttribute("aria-label")) {
          const parent = h.closest("nav");
          if (parent) {
            h.setAttribute("aria-label", parent.getAttribute("aria-label") || "navigation list");
            push(tag, "aria-label from parent nav", "minor", h);
          }
        }
      }

      if (tag === "dt" && !h.getAttribute("aria-label")) {
        const next = h.nextElementSibling;
        if (!next || next.tagName.toLowerCase() !== "dd") {
          h.setAttribute("aria-label", h.innerText?.trim() || "term");
          push(tag, "aria-label on <dt> (no following <dd>)", "minor", h);
        }
      }

      // ══════════════════════════════════════════════════════════════════════
      // LANDMARKS & SECTIONING
      // ══════════════════════════════════════════════════════════════════════

      if (LANDMARK_MAP[tag] && !h.getAttribute("role")) {
        h.setAttribute("role", LANDMARK_MAP[tag]);
        push(tag, `role="${LANDMARK_MAP[tag]}"`, "minor", h);
      }

      // Multiple nav/section/article/aside need unique labels
      if (["nav","section","article","aside"].includes(tag)) {
        const siblings = document.querySelectorAll(tag);
        if (siblings.length > 1 && !h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
          const heading = el.querySelector("h1,h2,h3,h4,h5,h6");
          if (heading?.innerText?.trim()) {
            h.setAttribute("aria-label", heading.innerText.trim());
            push(tag, `aria-label from inner heading`, "moderate", h);
          }
        }
      }

      // details / summary
      if (tag === "details") {
        if (!el.querySelector("summary")) {
          const summary = document.createElement("summary");
          summary.textContent = h.getAttribute("aria-label") || "More details";
          h.prepend(summary);
          push(tag, "<summary> injected", "moderate", h);
        }
      }
      if (tag === "summary" && !h.innerText?.trim() && !h.getAttribute("aria-label")) {
        h.setAttribute("aria-label", "Toggle details");
        push(tag, 'aria-label="Toggle details" (empty summary)', "moderate", h);
      }

      // dialog
      if (tag === "dialog") {
        if (!h.getAttribute("role")) {
          h.setAttribute("role", "dialog");
          push(tag, 'role="dialog"', "serious", h);
        }
        if (!h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
          const heading = el.querySelector("h1,h2,h3,h4,h5,h6");
          h.setAttribute("aria-label", heading?.innerText?.trim() || "dialog");
          push(tag, `aria-label added to dialog`, "serious", h);
        }
      }

      // ══════════════════════════════════════════════════════════════════════
      // INLINE ELEMENTS
      // ══════════════════════════════════════════════════════════════════════

      // abbr needs title
      if (tag === "abbr" && !h.getAttribute("title")) {
        h.setAttribute("title", h.innerText?.trim() || "abbreviation");
        push(tag, `title added to <abbr>`, "minor", h);
      }

      // time needs datetime
      if (tag === "time" && !h.getAttribute("datetime") && h.innerText?.trim()) {
        h.setAttribute("datetime", h.innerText.trim());
        push(tag, `datetime="${h.innerText.trim()}" added`, "minor", h);
      }

      // mark (highlighted text) — help screen readers understand why
      if (tag === "mark" && !h.getAttribute("aria-label")) {
        h.setAttribute("aria-label", `highlighted: ${h.innerText?.trim()?.slice(0, 60)}`);
        push(tag, "aria-label added to <mark>", "minor", h);
      }

      // meter
      if (tag === "meter") {
        if (!h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
          h.setAttribute("aria-label", h.getAttribute("title") || "meter");
          push(tag, "aria-label added to <meter>", "moderate", h);
        }
      }

      // progress
      if (tag === "progress") {
        if (!h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
          h.setAttribute("aria-label", h.getAttribute("title") || "progress");
          push(tag, "aria-label added to <progress>", "moderate", h);
        }
        const p = h as HTMLProgressElement;
        if (!h.getAttribute("aria-valuenow")) h.setAttribute("aria-valuenow", String(p.value));
        if (!h.getAttribute("aria-valuemax")) h.setAttribute("aria-valuemax", String(p.max || 1));
        report.fixed++;
      }

      // ══════════════════════════════════════════════════════════════════════
      // ARIA WIDGET ROLES
      // ══════════════════════════════════════════════════════════════════════

      const role = h.getAttribute("role") || "";

      // tab
      if (role === "tab" && !h.getAttribute("aria-selected")) {
        h.setAttribute("aria-selected", "false"); report.fixed++;
      }
      if (role === "tabpanel") {
        if (!h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
          h.setAttribute("aria-label", "tab panel");
          push(tag, 'aria-label="tab panel"', "moderate", h);
        }
        if (!h.getAttribute("tabindex")) { h.setAttribute("tabindex", "0"); report.fixed++; }
      }

      // alert / status / log / marquee
      if (["alert","status","log","marquee"].includes(role)) {
        if (!h.getAttribute("aria-live")) {
          const lv = role === "alert" ? "assertive" : "polite";
          h.setAttribute("aria-live", lv);
          push(tag, `aria-live="${lv}" on role=${role}`, "moderate", h);
        }
        if (!h.getAttribute("aria-atomic")) { h.setAttribute("aria-atomic", "true"); report.fixed++; }
      }

      // tooltip
      if (role === "tooltip" && !h.getAttribute("aria-live")) {
        h.setAttribute("aria-live", "polite"); report.fixed++;
      }

      // menu / menubar
      if ((role === "menu" || role === "menubar") && !h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
        h.setAttribute("aria-label", "menu");
        push(tag, 'aria-label="menu"', "moderate", h);
      }
      if (role === "menuitem" && h.tabIndex < 0) { h.tabIndex = -1; report.fixed++; }

      // listbox / option
      if (role === "listbox" && !h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
        h.setAttribute("aria-label", "listbox");
        push(tag, 'aria-label="listbox"', "moderate", h);
      }
      if (role === "option" && !h.getAttribute("aria-selected")) {
        h.setAttribute("aria-selected", "false"); report.fixed++;
      }

      // slider
      if (role === "slider") {
        if (!h.getAttribute("aria-valuemin")) h.setAttribute("aria-valuemin", "0");
        if (!h.getAttribute("aria-valuemax")) h.setAttribute("aria-valuemax", "100");
        if (!h.getAttribute("aria-valuenow")) h.setAttribute("aria-valuenow", "50");
        report.fixed++;
      }

      // checkbox / radio (custom widgets)
      if ((role === "checkbox" || role === "radio") && !h.getAttribute("aria-checked")) {
        h.setAttribute("aria-checked", "false");
        push(tag, `aria-checked="false" on role=${role}`, "serious", h);
      }

      // combobox
      if (role === "combobox") {
        if (!h.getAttribute("aria-expanded")) {
          h.setAttribute("aria-expanded", "false");
          push(tag, 'aria-expanded="false" on combobox', "serious", h);
        }
        if (!h.getAttribute("aria-haspopup")) { h.setAttribute("aria-haspopup", "listbox"); report.fixed++; }
      }

      // grid / treegrid
      if ((role === "grid" || role === "treegrid") && !h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
        h.setAttribute("aria-label", "data grid");
        push(tag, 'aria-label="data grid"', "moderate", h);
      }

      // tree
      if (role === "tree" && !h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
        h.setAttribute("aria-label", "tree");
        push(tag, 'aria-label="tree"', "moderate", h);
      }
      if (role === "treeitem" && el.querySelector('[role="group"]') && !h.getAttribute("aria-expanded")) {
        h.setAttribute("aria-expanded", "false"); report.fixed++;
      }

      // spinbutton
      if (role === "spinbutton") {
        if (!h.getAttribute("aria-valuenow")) h.setAttribute("aria-valuenow", "0");
        if (!h.getAttribute("aria-valuemin")) h.setAttribute("aria-valuemin", "0");
        if (!h.getAttribute("aria-valuemax")) h.setAttribute("aria-valuemax", "100");
        report.fixed++;
      }

      // ══════════════════════════════════════════════════════════════════════
      // VISUAL PREFERENCES
      // ══════════════════════════════════════════════════════════════════════

      const notMeta = !["html","head","meta","script","style","link","noscript"].includes(tag);

      if (config.highContrast && notMeta && !INLINE_TAGS.has(tag)) {
        h.style.filter = "contrast(1.15) brightness(1.05)";
      }

      if (config.reduceMotion && notMeta) {
        h.style.transition = "none";
        h.style.animation = "none";
      }

      if (config.fontSizeMultiplier && config.fontSizeMultiplier !== 1 && notMeta) {
        const current = parseFloat(window.getComputedStyle(h).fontSize);
        if (!isNaN(current) && current > 0) {
          h.style.fontSize = `${current * config.fontSizeMultiplier}px`;
        }
      }

      if (config.colorBlindMode && config.colorBlindMode !== "none" && tag === "body") {
        const filterValue = config.colorBlindMode === "achromatopsia"
          ? "grayscale(100%)"
          : `url(#${CB_FILTER_REFS[config.colorBlindMode]})`;
        h.style.filter = filterValue;
      }

      if (config.keyboardHints && (INTERACTIVE_TAGS.has(tag) || h.tabIndex >= 0)) {
        h.style.outline = "2px solid #007acc";
        h.style.outlineOffset = "2px";
      }
    });

    // Inject SVG color-blind filter defs — tracked via ref, no id on SVG element
    if (config.colorBlindMode && config.colorBlindMode !== "none" && !_colorBlindSvgNode) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("aria-hidden", "true");
      svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;";
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
        </defs>`;
      document.body.appendChild(svg);
      _colorBlindSvgNode = svg;
    }

    this.ensureLiveRegion();
    report.renderTime = parseFloat((performance.now() - start).toFixed(2));
    return report;
  },

  removeColorBlindSvg() { _colorBlindSvgNode?.remove(); _colorBlindSvgNode = null; },

  startObserver(config: A11yConfig) {
    if (this.observer || typeof document === "undefined") return;
    this.observer = new MutationObserver(() => this.applyFixes(config));
    this.observer.observe(document.body, { childList: true, subtree: true, attributes: false });
  },

  stopObserver() { this.observer?.disconnect(); this.observer = null; },

  ensureLiveRegion() {
    if (typeof document === "undefined" || _liveRegionNode) return;
    const node = document.createElement("div");
    node.setAttribute("aria-live", "polite");
    node.setAttribute("aria-atomic", "true");
    node.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;";
    document.body.appendChild(node);
    _liveRegionNode = node;
  },

  removeLiveRegion() { _liveRegionNode?.remove(); _liveRegionNode = null; },

  announce(msg: string) { if (_liveRegionNode) _liveRegionNode.textContent = msg; },
};