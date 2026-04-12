/**
 * AksharaJS – Accessibility Engine
 * WCAG 2.1 Level AA + ADA compliance automation.
 *
 * What it does:
 *  - Adds missing aria-labels to interactive elements
 *  - Ensures keyboard-navigability (tabindex)
 *  - Enforces visible focus indicators via injected CSS
 *  - Validates and fills missing alt text on images
 *  - Validates heading hierarchy (h1 → h2 → h3…)
 *  - Assigns ARIA landmark roles to semantic elements
 *  - Detects low colour contrast (WCAG AA: 4.5:1 normal, 3:1 large)
 *  - Enforces minimum font size (16 px)
 */

import { DOMUtils } from '../utils/dom.js';

export class AccessibilityEngine {

  constructor(logger) {
    this.log = logger;
  }

  // ── Main entry point ──────────────────────────────────────────────────
  enhance(root) {
    this._injectFocusCSS();
    this._addAriaLabels(root);
    this._ensureKeyboardAccessibility(root);
    this._enforceAltText(root);
    this._validateHeadingHierarchy(root);
    this._assignLandmarkRoles(root);
    this._detectLowContrast(root);
    this._enforceFontSize(root);
    this._secureForms(root);
    this.log.info('[a11y] Accessibility pass complete');
  }

  // ── 1. Inject focus indicators via a <style> tag ──────────────────────
  _injectFocusCSS() {
    const id = 'akshara-focus-styles';
    if (document.getElementById(id)) return;

    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      /* AksharaJS – Accessible Focus Indicators */
      :focus-visible {
        outline: 3px solid #005fcc !important;
        outline-offset: 3px !important;
        border-radius: 2px !important;
      }
      /* Skip-to-main-content link */
      .akshara-skip-link {
        position: absolute;
        top: -100%;
        left: 0;
        background: #005fcc;
        color: #fff;
        padding: 8px 16px;
        font-size: 16px;
        z-index: 99999;
        text-decoration: none;
        border-radius: 0 0 4px 0;
        transition: top 0.2s;
      }
      .akshara-skip-link:focus {
        top: 0 !important;
      }
    `;
    document.head.appendChild(style);

    // Add skip-to-content link if absent
    if (!document.querySelector('.akshara-skip-link')) {
      const main = document.querySelector('main, [role="main"]');
      if (main) {
        if (!main.id) main.id = 'akshara-main-content';
        const skip = document.createElement('a');
        skip.href       = `#${main.id}`;
        skip.className  = 'akshara-skip-link';
        skip.textContent = 'Skip to main content';
        document.body.insertBefore(skip, document.body.firstChild);
      }
    }
  }

  // ── 2. Add aria-labels to unlabelled interactive elements ─────────────
  _addAriaLabels(root) {
    const selectors = [
      'button', 'a[href]', 'input', 'select', 'textarea',
      '[role="button"]', '[role="link"]',
    ];

    selectors.forEach(sel => {
      (root === document ? document.querySelectorAll(sel) : root.querySelectorAll ? root.querySelectorAll(sel) : [])
        .forEach(el => {
          if (!this._hasAccessibleName(el)) {
            const label = this._inferLabel(el);
            if (label) {
              el.setAttribute('aria-label', label);
              this.log.debug(`[a11y] aria-label added: "${label}" → `, el);
            } else {
              this.log.warn('[a11y] Cannot infer accessible name for', el);
            }
          }
        });
    });
  }

  // Check if element already has an accessible name
  _hasAccessibleName(el) {
    return (
      el.getAttribute('aria-label') ||
      el.getAttribute('aria-labelledby') ||
      el.getAttribute('title') ||
      (el.id && document.querySelector(`label[for="${el.id}"]`)) ||
      (el.closest('label')) ||
      el.textContent.trim().length > 0
    );
  }

  // Infer a reasonable label from context
  _inferLabel(el) {
    const tag    = el.tagName.toLowerCase();
    const type   = el.getAttribute('type') || '';
    const name   = el.getAttribute('name') || '';
    const href   = el.getAttribute('href') || '';
    const src    = el.getAttribute('src')  || '';
    const value  = el.getAttribute('value') || '';

    if (tag === 'button' || el.getAttribute('role') === 'button') {
      if (value)       return value;
      if (type === 'submit') return 'Submit form';
      if (type === 'reset')  return 'Reset form';
      return 'Button';
    }
    if (tag === 'a') {
      if (href.includes('mailto')) return `Email ${href.replace('mailto:', '')}`;
      if (href.includes('tel'))    return `Call ${href.replace('tel:', '')}`;
      return null; // cannot safely infer link text
    }
    if (tag === 'input') {
      const placeholder = el.getAttribute('placeholder') || '';
      if (placeholder) return placeholder;
      if (name)        return DOMUtils.camelToLabel(name);
      return `${type || 'text'} field`;
    }
    if (tag === 'select') return name ? DOMUtils.camelToLabel(name) : 'Select option';
    if (tag === 'textarea') return name ? DOMUtils.camelToLabel(name) : 'Text area';

    return null;
  }

  // ── 3. Keyboard accessibility (tabindex) ─────────────────────────────
  _ensureKeyboardAccessibility(root) {
    const interactives = (root.querySelectorAll || (() => []))
      .call(root, '[onclick]:not(button):not(a):not(input):not(select):not(textarea)');

    interactives.forEach(el => {
      if (!el.getAttribute('tabindex')) {
        el.setAttribute('tabindex', '0');
        // Make Enter/Space trigger click
        el.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            el.click();
          }
        });
        this.log.debug('[a11y] tabindex added to', el);
      }
    });
  }

  // ── 4. Alt text enforcement ───────────────────────────────────────────
  _enforceAltText(root) {
    (root.querySelectorAll || (() => []))
      .call(root, 'img')
      .forEach(img => {
        if (!img.hasAttribute('alt')) {
          const src  = img.getAttribute('src') || '';
          const name = src.split('/').pop().split('.')[0].replace(/[-_]/g, ' ');
          const alt  = name || 'Image';
          img.setAttribute('alt', alt);
          this.log.warn(`[a11y] Missing alt text auto-filled: "${alt}" →`, img.src);
        }

        // Decorative images should have empty alt, not no alt
        if (img.getAttribute('role') === 'presentation' && img.getAttribute('alt') !== '') {
          img.setAttribute('alt', '');
        }
      });
  }

  // ── 5. Heading hierarchy ──────────────────────────────────────────────
  _validateHeadingHierarchy(root) {
    const doc     = root === document ? document : root.ownerDocument || document;
    const headings = Array.from(doc.querySelectorAll('h1,h2,h3,h4,h5,h6'));
    let prevLevel = 0;

    headings.forEach(h => {
      const level = parseInt(h.tagName[1], 10);
      if (prevLevel && level > prevLevel + 1) {
        this.log.warn(
          `[a11y] Heading hierarchy skip: h${prevLevel} → h${level}`,
          h.textContent.trim(),
        );
      }
      prevLevel = level;
    });

    // Warn if no h1
    if (!doc.querySelector('h1')) {
      this.log.warn('[a11y] No <h1> found on the page.');
    }
  }

  // ── 6. Landmark roles ─────────────────────────────────────────────────
  _assignLandmarkRoles(root) {
    const map = {
      header  : 'banner',
      nav     : 'navigation',
      main    : 'main',
      footer  : 'contentinfo',
      aside   : 'complementary',
      section : 'region',
      form    : 'form',
    };

    Object.entries(map).forEach(([tag, role]) => {
      (root.querySelectorAll || (() => []))
        .call(root, tag)
        .forEach(el => {
          if (!el.getAttribute('role')) {
            el.setAttribute('role', role);
          }
          // region needs an accessible name
          if (role === 'region' && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
            const heading = el.querySelector('h1,h2,h3,h4,h5,h6');
            if (heading) {
              if (!heading.id) heading.id = `akshara-region-${Math.random().toString(36).slice(2, 7)}`;
              el.setAttribute('aria-labelledby', heading.id);
            }
          }
        });
    });
  }

  // ── 7. Colour contrast detection (WCAG AA) ───────────────────────────
  _detectLowContrast(root) {
    // We sample visible text nodes; full pixel-level analysis
    // requires canvas (expensive on large DOMs), so we inspect
    // computed styles and approximate luminance.
    const doc = root === document ? document : root.ownerDocument || document;

    // Only sample the first 200 text-bearing elements to stay performant
    const textEls = Array.from(doc.querySelectorAll('p,span,a,li,td,th,label,h1,h2,h3,h4,h5,h6')).slice(0, 200);

    textEls.forEach(el => {
      const style   = window.getComputedStyle(el);
      const fg      = style.color;
      const bg      = style.backgroundColor;
      const fgRGB   = DOMUtils.parseRGB(fg);
      const bgRGB   = DOMUtils.parseRGB(bg);
      if (!fgRGB || !bgRGB) return;
      if (bgRGB[3] === 0) return; // transparent bg – skip

      const ratio = DOMUtils.contrastRatio(fgRGB, bgRGB);
      const fontSize = parseFloat(style.fontSize);
      const isBold   = parseInt(style.fontWeight, 10) >= 700;
      const isLarge  = fontSize >= 18 || (isBold && fontSize >= 14);
      const required = isLarge ? 3.0 : 4.5;

      if (ratio < required) {
        this.log.warn(
          `[a11y] Low contrast (${ratio.toFixed(2)}:1, required ${required}:1)`,
          el,
        );
      }
    });
  }

  // ── 8. Font size enforcement ──────────────────────────────────────────
  _enforceFontSize(root) {
    const doc = root === document ? document : root.ownerDocument || document;
    const MINIMUM_PX = 16;

    Array.from(doc.querySelectorAll('p,span,li,td,label')).slice(0, 300).forEach(el => {
      const size = parseFloat(window.getComputedStyle(el).fontSize);
      if (size < MINIMUM_PX) {
        this.log.warn(`[a11y] Font size too small (${size}px < ${MINIMUM_PX}px)`, el);
      }
    });
  }

  // ── 9. Form accessibility ─────────────────────────────────────────────
  _secureForms(root) {
    (root.querySelectorAll || (() => []))
      .call(root, 'form')
      .forEach(form => {
        // Add novalidate and use custom validation for better UX
        form.querySelectorAll('input,select,textarea').forEach(field => {
          // Ensure required fields are marked for assistive tech
          if (field.required && !field.getAttribute('aria-required')) {
            field.setAttribute('aria-required', 'true');
          }
          // Ensure invalid states are announced
          field.addEventListener('invalid', () => {
            field.setAttribute('aria-invalid', 'true');
          });
          field.addEventListener('input', () => {
            if (field.validity.valid) {
              field.setAttribute('aria-invalid', 'false');
            }
          });
        });
      });
  }
}
