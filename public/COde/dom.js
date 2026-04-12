/**
 * AksharaJS – DOM Utility Helpers
 *
 * Shared pure utility functions used across all engines.
 */

export const DOMUtils = {

  // ── Convert camelCase / snake_case to human label ─────────────────────
  camelToLabel(str) {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/[_-]+/g, ' ')
      .replace(/^\s*/, '')
      .replace(/\b\w/g, c => c.toUpperCase());
  },

  // ── Parse RGB/RGBA string to [r, g, b, a] array ───────────────────────
  parseRGB(color) {
    if (!color) return null;
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) return null;
    return [
      parseInt(match[1], 10),
      parseInt(match[2], 10),
      parseInt(match[3], 10),
      parseFloat(match[4] ?? 1),
    ];
  },

  // ── WCAG relative luminance ───────────────────────────────────────────
  relativeLuminance([r, g, b]) {
    const channel = c => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  },

  // ── WCAG contrast ratio ───────────────────────────────────────────────
  contrastRatio(fg, bg) {
    const L1 = DOMUtils.relativeLuminance(fg);
    const L2 = DOMUtils.relativeLuminance(bg);
    const lighter = Math.max(L1, L2);
    const darker  = Math.min(L1, L2);
    return (lighter + 0.05) / (darker + 0.05);
  },

  // ── Check if element is visible ───────────────────────────────────────
  isVisible(el) {
    const style = window.getComputedStyle(el);
    return (
      style.display    !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity    !== '0' &&
      el.offsetWidth   > 0 &&
      el.offsetHeight  > 0
    );
  },

  // ── Safely set attribute if not already set ───────────────────────────
  setAttrIfMissing(el, attr, value) {
    if (!el.getAttribute(attr)) {
      el.setAttribute(attr, value);
      return true;
    }
    return false;
  },

  // ── Generate a short unique id ────────────────────────────────────────
  uid(prefix = 'akshara') {
    return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
  },

  // ── Collect text content without hidden elements ───────────────────────
  visibleText(el) {
    return Array.from(el.childNodes)
      .filter(n => n.nodeType === Node.TEXT_NODE || (n.nodeType === Node.ELEMENT_NODE && DOMUtils.isVisible(n)))
      .map(n => n.textContent)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  },

  // ── Debounce ──────────────────────────────────────────────────────────
  debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },

  // ── Throttle ──────────────────────────────────────────────────────────
  throttle(fn, limit = 100) {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= limit) { last = now; return fn(...args); }
    };
  },

  // ── Walk DOM efficiently with TreeWalker ──────────────────────────────
  walkElements(root, callback, filter = NodeFilter.SHOW_ELEMENT) {
    const walker = document.createTreeWalker(root, filter);
    let node     = walker.nextNode();
    while (node) {
      callback(node);
      node = walker.nextNode();
    }
  },
};
