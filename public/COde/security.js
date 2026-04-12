/**
 * AksharaJS – Security Engine
 * OWASP Top 10 inspired hardening for the browser context.
 *
 * Responsibilities:
 *  - Sanitise HTML before insertion (prevent XSS)
 *  - Intercept unsafe innerHTML assignments
 *  - Secure external links with rel="noopener noreferrer"
 *  - Input sanitisation helpers
 *  - Inject Content-Security-Policy meta tag
 *  - Warn if page is served over HTTP
 *  - Warn if the page is framed (clickjacking risk)
 *  - Override dangerous global methods with safe wrappers
 */

export class SecurityEngine {

  constructor(logger) {
    this.log = logger;
  }

  // ── Main entry point ──────────────────────────────────────────────────
  enhance(root) {
    this._checkHTTPS();
    this._checkFraming();
    this._injectCSP();
    this._secureExternalLinks(root);
    this._interceptInnerHTML();
    this.log.info('[security] Security pass complete');
  }

  // ── 1. HTTPS check ────────────────────────────────────────────────────
  _checkHTTPS() {
    if (
      typeof location !== 'undefined' &&
      location.protocol === 'http:' &&
      location.hostname !== 'localhost' &&
      location.hostname !== '127.0.0.1'
    ) {
      this.log.warn('[security] Page is served over HTTP. Use HTTPS in production!');
    }
  }

  // ── 2. Framing / clickjacking detection ───────────────────────────────
  _checkFraming() {
    try {
      if (window.self !== window.top) {
        this.log.warn('[security] Page is embedded in an iframe – potential clickjacking risk. Ensure X-Frame-Options is set.');
      }
    } catch {
      // Silently ignore cross-origin iframe detection errors
    }
  }

  // ── 3. Inject CSP meta tag ────────────────────────────────────────────
  _injectCSP() {
    if (document.querySelector('meta[http-equiv="Content-Security-Policy"]')) return;

    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Security-Policy');
    meta.setAttribute(
      'content',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",   // tighten in production
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https:",
        "connect-src 'self'",
        "frame-ancestors 'none'",
      ].join('; '),
    );
    document.head.prepend(meta);
    this.log.info('[security] CSP meta tag injected');
  }

  // ── 4. Secure external links ──────────────────────────────────────────
  _secureExternalLinks(root) {
    const origin = typeof location !== 'undefined' ? location.origin : '';

    (root.querySelectorAll || (() => []))
      .call(root, 'a[href]')
      .forEach(a => {
        const href = a.getAttribute('href') || '';

        // External link check
        const isExternal =
          href.startsWith('http://') ||
          href.startsWith('https://') ||
          (href.startsWith('//') && !href.startsWith('//' + location.host));

        const targetBlank = a.getAttribute('target') === '_blank';

        if (isExternal || targetBlank) {
          const rel = (a.getAttribute('rel') || '').split(' ').filter(Boolean);
          const needed = ['noopener', 'noreferrer'];

          needed.forEach(r => { if (!rel.includes(r)) rel.push(r); });
          a.setAttribute('rel', rel.join(' '));

          // Always open external links in new tab (optional, log only)
          this.log.debug(`[security] Secured external link: ${href}`);
        }
      });
  }

  // ── 5. innerHTML interceptor ──────────────────────────────────────────
  // Override Element.prototype.innerHTML setter to sanitise content.
  // Uses DOMParser as a safe HTML parser.
  _interceptInnerHTML() {
    if (Element.prototype.__aksharaPatched) return;

    const originalDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    if (!originalDescriptor || !originalDescriptor.set) return;

    const log = this.log;

    Object.defineProperty(Element.prototype, 'innerHTML', {
      set(value) {
        const sanitised = SecurityEngine.sanitizeHTML(value);
        if (sanitised !== value) {
          log.warn('[security] Potentially unsafe HTML sanitised before insertion.');
        }
        originalDescriptor.set.call(this, sanitised);
      },
      get: originalDescriptor.get,
      configurable: true,
    });

    Element.prototype.__aksharaPatched = true;
    this.log.info('[security] innerHTML interceptor active');
  }

  // ── Public: HTML sanitiser ────────────────────────────────────────────
  // Strips dangerous elements/attributes from an HTML string.
  static sanitizeHTML(html) {
    if (typeof html !== 'string') return '';

    // Use DOMParser to parse safely
    const parser = new DOMParser();
    const doc    = parser.parseFromString(`<div>${html}</div>`, 'text/html');
    const div    = doc.querySelector('div') || doc.body;

    SecurityEngine._stripDangerous(div);

    return div.innerHTML;
  }

  static _stripDangerous(node) {
    const FORBIDDEN_TAGS = new Set([
      'script', 'iframe', 'object', 'embed', 'link', 'meta',
      'base', 'form', 'input', 'button', 'select', 'textarea',
    ]);

    const FORBIDDEN_ATTRS = new Set([
      'onload', 'onerror', 'onclick', 'onmouseover', 'onfocus',
      'onblur', 'onchange', 'onsubmit', 'onkeydown', 'onkeyup',
      'onkeypress', 'onmousedown', 'onmouseup', 'onmousemove',
    ]);

    // Walk tree and clean
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT);
    const toRemove = [];

    let current = walker.currentNode;
    while (current) {
      if (FORBIDDEN_TAGS.has(current.tagName?.toLowerCase())) {
        toRemove.push(current);
      } else {
        // Strip dangerous attributes
        Array.from(current.attributes || []).forEach(attr => {
          if (
            FORBIDDEN_ATTRS.has(attr.name.toLowerCase()) ||
            attr.value.toLowerCase().startsWith('javascript:')
          ) {
            current.removeAttribute(attr.name);
          }
        });
      }
      current = walker.nextNode();
    }

    toRemove.forEach(el => el.parentNode?.removeChild(el));
  }

  // ── Public: input sanitiser ───────────────────────────────────────────
  static sanitizeInput(value) {
    if (typeof value !== 'string') return '';
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
}
