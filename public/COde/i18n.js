/**
 * AksharaJS – Internationalisation (I18n) Engine
 *
 * Responsibilities:
 *  - Detect the dominant Unicode script in visible text
 *    (Telugu, Devanagari, Arabic, Tamil, Kannada, Malayalam, Latin, …)
 *  - Set <html lang="…"> appropriately
 *  - Apply dir="rtl" or dir="ltr" at document and element level
 *  - Stamp data-script="<script>" on text containers
 *  - Load appropriate font stacks via injected CSS variables
 */

// ─── Unicode block ranges for script detection ───────────────────────────
const SCRIPT_RANGES = [
  { name: 'Telugu',     lang: 'te', dir: 'ltr', range: [0x0C00, 0x0C7F] },
  { name: 'Devanagari', lang: 'hi', dir: 'ltr', range: [0x0900, 0x097F] },
  { name: 'Bengali',    lang: 'bn', dir: 'ltr', range: [0x0980, 0x09FF] },
  { name: 'Tamil',      lang: 'ta', dir: 'ltr', range: [0x0B80, 0x0BFF] },
  { name: 'Kannada',    lang: 'kn', dir: 'ltr', range: [0x0C80, 0x0CFF] },
  { name: 'Malayalam',  lang: 'ml', dir: 'ltr', range: [0x0D00, 0x0D7F] },
  { name: 'Gujarati',   lang: 'gu', dir: 'ltr', range: [0x0A80, 0x0AFF] },
  { name: 'Gurmukhi',   lang: 'pa', dir: 'ltr', range: [0x0A00, 0x0A7F] },
  { name: 'Odia',       lang: 'or', dir: 'ltr', range: [0x0B00, 0x0B7F] },
  { name: 'Arabic',     lang: 'ar', dir: 'rtl', range: [0x0600, 0x06FF] },
  { name: 'Hebrew',     lang: 'he', dir: 'rtl', range: [0x0590, 0x05FF] },
  { name: 'Persian',    lang: 'fa', dir: 'rtl', range: [0xFB50, 0xFDFF] },
  { name: 'Latin',      lang: 'en', dir: 'ltr', range: [0x0041, 0x024F] },
];

// Font stacks per script
const FONT_STACKS = {
  Telugu     : '"Noto Sans Telugu", "Gautami", sans-serif',
  Devanagari : '"Noto Sans Devanagari", "Mangal", sans-serif',
  Bengali    : '"Noto Sans Bengali", "Vrinda", sans-serif',
  Tamil      : '"Noto Sans Tamil", "Latha", sans-serif',
  Kannada    : '"Noto Sans Kannada", "Tunga", sans-serif',
  Malayalam  : '"Noto Sans Malayalam", "Kartika", sans-serif',
  Arabic     : '"Noto Sans Arabic", "Tahoma", sans-serif',
  Hebrew     : '"Noto Sans Hebrew", "Arial Hebrew", sans-serif',
  Latin      : '"system-ui", "-apple-system", "Segoe UI", sans-serif',
  default    : '"Noto Sans", sans-serif',
};

export class I18nEngine {

  constructor(logger) {
    this.log = logger;
  }

  // ── Main entry point ──────────────────────────────────────────────────
  enhance(root) {
    const doc = root === document ? document : root.ownerDocument || document;

    // 1. Detect dominant script from body text
    const bodyText = doc.body ? doc.body.innerText || doc.body.textContent : '';
    const detected = this._detectScript(bodyText);

    if (detected) {
      this.log.info(`[i18n] Detected script: ${detected.name} (${detected.lang})`);

      // 2. Set <html lang="…">
      if (!doc.documentElement.getAttribute('lang')) {
        doc.documentElement.setAttribute('lang', detected.lang);
      }

      // 3. Set dir attribute
      doc.documentElement.setAttribute('dir', detected.dir);

      // 4. Inject font CSS variable
      this._injectFontStack(detected.name);

      // 5. Stamp data-script on body
      if (doc.body) {
        doc.body.setAttribute('data-script', detected.name.toLowerCase());
      }
    }

    // 6. Per-element script annotation for mixed-script pages
    this._annotateElements(root);

    this.log.info('[i18n] I18n pass complete');
  }

  // ── Detect dominant script from a text sample ─────────────────────────
  _detectScript(text) {
    if (!text || !text.length) return null;

    // Count codepoints per script
    const counts = {};
    for (const char of text) {
      const cp = char.codePointAt(0);
      for (const script of SCRIPT_RANGES) {
        if (cp >= script.range[0] && cp <= script.range[1]) {
          counts[script.name] = (counts[script.name] || 0) + 1;
          break;
        }
      }
    }

    // Return the script with the highest count
    let dominant = null;
    let max      = 0;
    for (const [name, count] of Object.entries(counts)) {
      if (count > max) {
        max      = count;
        dominant = name;
      }
    }

    if (!dominant) return SCRIPT_RANGES.find(s => s.name === 'Latin');
    return SCRIPT_RANGES.find(s => s.name === dominant);
  }

  // ── Inject Noto font stack via CSS variables ──────────────────────────
  _injectFontStack(scriptName) {
    const id = 'akshara-i18n-fonts';
    if (document.getElementById(id)) return;

    const fontStack = FONT_STACKS[scriptName] || FONT_STACKS.default;

    const style = document.createElement('style');
    style.id    = id;
    style.textContent = `
      /* AksharaJS – I18n Font Stack for ${scriptName} */
      :root {
        --akshara-font-primary: ${fontStack};
      }
      body {
        font-family: var(--akshara-font-primary);
      }
    `;
    document.head.appendChild(style);

    // Preconnect to Google Fonts for Noto fonts
    const preconnect = document.createElement('link');
    preconnect.rel  = 'preconnect';
    preconnect.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnect);
  }

  // ── Per-element script detection for mixed-script content ─────────────
  _annotateElements(root) {
    const selectors = 'p,h1,h2,h3,h4,h5,h6,span,td,li,label,a';
    const elements  = (root.querySelectorAll || (() => []))
      .call(root, selectors);

    elements.forEach(el => {
      const text     = el.innerText || el.textContent || '';
      const detected = this._detectScript(text);
      if (!detected) return;

      const current = el.getAttribute('data-script');
      if (!current) {
        el.setAttribute('data-script', detected.name.toLowerCase());
      }

      // Apply RTL per element if mixed content
      if (detected.dir === 'rtl') {
        if (!el.getAttribute('dir')) {
          el.setAttribute('dir', 'rtl');
        }
        // For RTL text inside LTR document
        if (document.documentElement.getAttribute('dir') !== 'rtl') {
          el.style.textAlign = el.style.textAlign || 'right';
        }
      }

      // Stamp lang on element if different from document lang
      const docLang = document.documentElement.getAttribute('lang');
      if (detected.lang !== docLang && !el.getAttribute('lang')) {
        el.setAttribute('lang', detected.lang);
      }
    });
  }

  // ── Public: detect script from any string ─────────────────────────────
  detect(text) {
    return this._detectScript(text);
  }
}
