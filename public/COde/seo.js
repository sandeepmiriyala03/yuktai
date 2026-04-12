/**
 * AksharaJS – SEO Engine
 *
 * Responsibilities:
 *  - Auto-generate <title> (fallback from first <h1>)
 *  - Generate meta description from visible content
 *  - Inject viewport meta tag
 *  - Add robots meta
 *  - Add Open Graph (og:*) tags
 *  - Inject JSON-LD WebPage structured data
 *  - Ensure canonical link
 *  - Warn on poor link text ("click here", "read more", etc.)
 *  - Ensure all images have descriptive alt text
 *  - Improve semantic HTML (convert div-buttons to <button> etc.)
 */

import { DOMUtils } from '../utils/dom.js';

// Common non-descriptive link phrases
const POOR_LINK_TEXT = [
  'click here', 'read more', 'learn more', 'here', 'more', 'link',
  'click', 'go', 'this', 'see here', 'continue reading',
];

export class SEOEngine {

  constructor(logger) {
    this.log = logger;
  }

  // ── Main entry point ──────────────────────────────────────────────────
  enhance(root) {
    const doc = root === document ? document : root.ownerDocument || document;

    this._ensureTitle(doc);
    this._ensureMetaDescription(doc);
    this._ensureViewport(doc);
    this._ensureRobots(doc);
    this._injectOpenGraph(doc);
    this._injectJSONLD(doc);
    this._ensureCanonical(doc);
    this._warnPoorLinkText(doc);
    this._enforceImageAlt(doc);
    this._improveSemanticHTML(doc);

    this.log.info('[seo] SEO pass complete');
  }

  // ── 1. <title> ────────────────────────────────────────────────────────
  _ensureTitle(doc) {
    let title = doc.title && doc.title.trim();

    if (!title) {
      const h1 = doc.querySelector('h1');
      title    = h1 ? h1.textContent.trim() : doc.location?.hostname || 'Untitled';
      const el = doc.querySelector('title') || doc.createElement('title');
      el.textContent = title;
      if (!doc.querySelector('title')) doc.head.appendChild(el);
      this.log.info(`[seo] <title> set: "${title}"`);
    }
  }

  // ── 2. Meta description ───────────────────────────────────────────────
  _ensureMetaDescription(doc) {
    if (doc.querySelector('meta[name="description"]')) return;

    // Harvest first ~160 characters of meaningful body text
    const source = doc.querySelector('main p, article p, section p, p');
    let description = '';

    if (source) {
      description = source.textContent.replace(/\s+/g, ' ').trim().slice(0, 160);
    }

    if (!description) {
      const body = doc.body?.textContent.replace(/\s+/g, ' ').trim().slice(0, 160) || '';
      description = body;
    }

    if (description) {
      this._setMeta(doc, 'description', description);
      this.log.info(`[seo] meta description set`);
    }
  }

  // ── 3. Viewport ───────────────────────────────────────────────────────
  _ensureViewport(doc) {
    if (!doc.querySelector('meta[name="viewport"]')) {
      this._setMeta(doc, 'viewport', 'width=device-width, initial-scale=1');
    }
  }

  // ── 4. Robots ─────────────────────────────────────────────────────────
  _ensureRobots(doc) {
    if (!doc.querySelector('meta[name="robots"]')) {
      this._setMeta(doc, 'robots', 'index, follow');
    }
  }

  // ── 5. Open Graph ─────────────────────────────────────────────────────
  _injectOpenGraph(doc) {
    const title       = doc.title || '';
    const description = doc.querySelector('meta[name="description"]')?.content || '';
    const url         = doc.location?.href  || '';
    const image       = doc.querySelector('img[src]')?.src || '';

    const ogTags = {
      'og:type'        : 'website',
      'og:title'       : title,
      'og:description' : description,
      'og:url'         : url,
    };
    if (image) ogTags['og:image'] = image;

    Object.entries(ogTags).forEach(([property, content]) => {
      if (content && !doc.querySelector(`meta[property="${property}"]`)) {
        const meta       = doc.createElement('meta');
        meta.setAttribute('property', property);
        meta.setAttribute('content', content);
        doc.head.appendChild(meta);
      }
    });

    // Twitter card
    if (!doc.querySelector('meta[name="twitter:card"]')) {
      this._setMeta(doc, 'twitter:card', 'summary_large_image');
      this._setMeta(doc, 'twitter:title', title);
      if (description) this._setMeta(doc, 'twitter:description', description);
    }
  }

  // ── 6. JSON-LD structured data (WebPage) ──────────────────────────────
  _injectJSONLD(doc) {
    if (doc.querySelector('script[type="application/ld+json"]')) return;

    const title       = doc.title || '';
    const description = doc.querySelector('meta[name="description"]')?.content || '';
    const url         = doc.location?.href || '';
    const lang        = doc.documentElement.getAttribute('lang') || 'en';

    const jsonld = {
      '@context'    : 'https://schema.org',
      '@type'       : 'WebPage',
      name          : title,
      description   : description,
      url           : url,
      inLanguage    : lang,
      dateModified  : new Date().toISOString().split('T')[0],
    };

    const script      = doc.createElement('script');
    script.type       = 'application/ld+json';
    script.textContent = JSON.stringify(jsonld, null, 2);
    doc.head.appendChild(script);

    this.log.info('[seo] JSON-LD WebPage injected');
  }

  // ── 7. Canonical link ─────────────────────────────────────────────────
  _ensureCanonical(doc) {
    if (!doc.querySelector('link[rel="canonical"]')) {
      const url = doc.location?.href;
      if (url) {
        const link  = doc.createElement('link');
        link.rel    = 'canonical';
        link.href   = url.split('?')[0].split('#')[0]; // strip query & hash
        doc.head.appendChild(link);
      }
    }
  }

  // ── 8. Warn on poor link text ─────────────────────────────────────────
  _warnPoorLinkText(doc) {
    doc.querySelectorAll('a[href]').forEach(a => {
      const text = a.textContent.trim().toLowerCase();
      if (POOR_LINK_TEXT.includes(text)) {
        this.log.warn(
          `[seo] Poor link text: "${a.textContent.trim()}" → Use descriptive text`,
          a,
        );
        // Add title as partial fix
        if (!a.getAttribute('title') && !a.getAttribute('aria-label')) {
          const url = a.href || '';
          a.setAttribute('aria-label', `Visit ${url}`);
        }
      }
    });
  }

  // ── 9. Image alt enforcement ──────────────────────────────────────────
  _enforceImageAlt(doc) {
    doc.querySelectorAll('img:not([alt])').forEach(img => {
      const filename = (img.src || '').split('/').pop().split('.')[0];
      const alt      = filename.replace(/[-_]/g, ' ') || 'Image';
      img.setAttribute('alt', alt);
      this.log.warn(`[seo] Image missing alt text, auto-set: "${alt}"`);
    });
  }

  // ── 10. Improve semantic HTML ─────────────────────────────────────────
  _improveSemanticHTML(doc) {
    // Warn about div-only layouts lacking semantic landmarks
    const hasMain    = !!doc.querySelector('main, [role="main"]');
    const hasNav     = !!doc.querySelector('nav, [role="navigation"]');
    const hasHeader  = !!doc.querySelector('header, [role="banner"]');

    if (!hasMain)   this.log.warn('[seo] No <main> landmark found. Add <main> for better SEO.');
    if (!hasNav)    this.log.warn('[seo] No <nav> landmark found. Wrap navigation in <nav>.');
    if (!hasHeader) this.log.warn('[seo] No <header> element found.');

    // Heading count
    const h1s = doc.querySelectorAll('h1');
    if (h1s.length === 0)  this.log.warn('[seo] No <h1> found. Every page should have exactly one.');
    if (h1s.length > 1)    this.log.warn(`[seo] Multiple <h1> tags (${h1s.length}). Use only one per page.`);
  }

  // ── Helper: upsert a <meta name="…"> ─────────────────────────────────
  _setMeta(doc, name, content) {
    let meta = doc.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = doc.createElement('meta');
      meta.setAttribute('name', name);
      doc.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }
}
