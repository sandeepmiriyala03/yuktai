/**
 * AksharaJS – AI Module (Mock / Placeholder)
 *
 * Provides mock implementations of AI-powered features.
 * These are designed to be replaced with real model calls
 * (e.g. a vision API for alt text, a contrast-check model, etc.)
 *
 * API:
 *   akshara.ai.generateAltText(imgElement)
 *   akshara.ai.checkContrast(element)
 *   akshara.ai.simplifyText(text, options)
 *   akshara.ai.announce(message)
 */

export class AIEngine {

  constructor(logger) {
    this.log = logger;
    this.log.info('[ai] AI module loaded (mock mode – replace with real API calls)');
  }

  // ── 1. Generate alt text for an image ────────────────────────────────
  // Mock: derives text from filename. Replace with a Vision API call.
  async generateAltText(imgElement) {
    const src = imgElement?.src || '';
    const filename = src.split('/').pop().split('?')[0].split('.')[0];
    const mock = filename.replace(/[-_]/g, ' ').trim() || 'Descriptive image';

    this.log.debug(`[ai] generateAltText (mock): "${mock}"`);

    // TODO: Replace with real call, e.g.:
    // const response = await fetch('/api/ai/alt-text', {
    //   method: 'POST',
    //   body: JSON.stringify({ imageUrl: src }),
    // });
    // return (await response.json()).altText;

    return mock;
  }

  // ── 2. Contrast checker ───────────────────────────────────────────────
  // Mock: returns a simulated contrast ratio.
  async checkContrast(element) {
    const style  = element ? window.getComputedStyle(element) : null;
    const mock   = { ratio: 4.6, passes: true, level: 'AA' };

    this.log.debug('[ai] checkContrast (mock):', mock);

    // TODO: Replace with an actual colour analysis call or AI service.

    return mock;
  }

  // ── 3. Simplify text ─────────────────────────────────────────────────
  // Mock: trims sentences to a readability target.
  async simplifyText(text, options = {}) {
    const { readingLevel = 'grade-6', maxWords = 50 } = options;

    // Very naive mock: truncate and add ellipsis
    const words    = (text || '').split(/\s+/);
    const simplified = words.length > maxWords
      ? words.slice(0, maxWords).join(' ') + '…'
      : text;

    this.log.debug(`[ai] simplifyText (mock): ${words.length} → ${Math.min(words.length, maxWords)} words`);

    // TODO: Replace with an LLM API call:
    // const response = await fetch('/api/ai/simplify', {
    //   method: 'POST',
    //   body: JSON.stringify({ text, readingLevel }),
    // });
    // return (await response.json()).simplified;

    return simplified;
  }

  // ── 4. ARIA live region announcer ─────────────────────────────────────
  announce(message, priority = 'polite') {
    // Create or reuse ARIA live region
    let region = document.getElementById('akshara-ai-live');
    if (!region) {
      region             = document.createElement('div');
      region.id          = 'akshara-ai-live';
      region.setAttribute('role', 'status');
      region.setAttribute('aria-live', priority);
      region.setAttribute('aria-atomic', 'true');
      region.style.cssText = `
        position: absolute; width: 1px; height: 1px;
        padding: 0; margin: -1px; overflow: hidden;
        clip: rect(0,0,0,0); border: 0;
      `;
      document.body.appendChild(region);
    }

    region.setAttribute('aria-live', priority);

    // Temporarily clear then re-set to ensure announcement
    region.textContent = '';
    requestAnimationFrame(() => {
      region.textContent = message;
    });

    this.log.debug(`[ai] announce: "${message}"`);
  }

  // ── 5. Auto alt text for all images on page ───────────────────────────
  async autoAltText(root = document) {
    const images = Array.from(
      (root.querySelectorAll || (() => [])).call(root, 'img:not([alt]), img[alt=""]')
    );

    for (const img of images) {
      const alt = await this.generateAltText(img);
      if (alt) img.setAttribute('alt', alt);
    }

    this.log.info(`[ai] Auto alt text applied to ${images.length} images`);
    return images.length;
  }
}
