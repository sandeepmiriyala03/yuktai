/**
 * AksharaJS – OCR Module
 *
 * Optical Character Recognition using Tesseract.js.
 * Supports Latin and Indic scripts (Telugu, Hindi, Tamil, etc.).
 *
 * API:
 *   akshara.ocr.extract(imageSource, options)
 *     imageSource: HTMLImageElement | File | Blob | URL string | base64
 *     options:     { lang: 'eng+tel', logger: fn }
 *
 *   Returns: { text, confidence, words, lines }
 */

// Tesseract.js CDN – loaded lazily to avoid blocking
const TESSERACT_CDN = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';

// Language code mapping for Tesseract
const LANG_MAP = {
  te : 'tel',  // Telugu
  hi : 'hin',  // Hindi (Devanagari)
  ta : 'tam',  // Tamil
  bn : 'ben',  // Bengali
  kn : 'kan',  // Kannada
  ml : 'mal',  // Malayalam
  ar : 'ara',  // Arabic
  en : 'eng',  // English
};

export class OCREngine {

  constructor(logger) {
    this.log      = logger;
    this._worker  = null;
    this._loading = false;
    this._ready   = false;
  }

  // ── Load Tesseract worker (lazy) ──────────────────────────────────────
  async _ensureWorker(lang = 'eng') {
    if (this._ready && this._worker) return;
    if (this._loading) {
      // Wait until loading completes
      await new Promise(res => {
        const poll = setInterval(() => { if (this._ready) { clearInterval(poll); res(); } }, 100);
      });
      return;
    }

    this._loading = true;

    // Dynamically load Tesseract.js
    if (typeof Tesseract === 'undefined') {
      await this._loadScript(TESSERACT_CDN);
    }

    try {
      // Tesseract.js v5 API
      this._worker = await Tesseract.createWorker(lang, 1, {
        logger: m => this.log.debug('[ocr]', m.status, m.progress),
      });

      this._ready   = true;
      this._loading = false;
      this.log.info(`[ocr] Tesseract worker ready (lang: ${lang})`);
    } catch (err) {
      this._loading = false;
      this.log.warn('[ocr] Failed to initialise Tesseract:', err);
      throw err;
    }
  }

  // ── Main: extract text from an image ─────────────────────────────────
  async extract(imageSource, options = {}) {
    // Resolve Tesseract language code
    const docLang     = document.documentElement.getAttribute('lang') || 'en';
    const tessLang    = options.lang || LANG_MAP[docLang] || 'eng';

    try {
      await this._ensureWorker(tessLang);

      this.log.info(`[ocr] Extracting text (lang: ${tessLang})…`);

      // Handle File/Blob input
      let source = imageSource;
      if (imageSource instanceof File || imageSource instanceof Blob) {
        source = URL.createObjectURL(imageSource);
      } else if (imageSource instanceof HTMLImageElement) {
        source = imageSource.src;
      }

      const { data } = await this._worker.recognize(source);

      const result = {
        text       : data.text.trim(),
        confidence : data.confidence,
        words      : data.words?.map(w => ({ text: w.text, confidence: w.confidence })) || [],
        lines      : data.lines?.map(l => ({ text: l.text })) || [],
      };

      this.log.info(`[ocr] Extracted ${result.text.length} characters (confidence: ${result.confidence.toFixed(1)}%)`);
      return result;
    } catch (err) {
      this.log.warn('[ocr] Extraction failed:', err);
      return { text: '', confidence: 0, words: [], lines: [], error: err.message };
    }
  }

  // ── Convenience: extract from all images with data-ocr attribute ──────
  async extractFromDOM(root = document) {
    const images  = Array.from((root.querySelectorAll || (() => [])). call(root, 'img[data-ocr]'));
    const results = [];

    for (const img of images) {
      const result = await this.extract(img);
      if (result.text) {
        img.setAttribute('alt', result.text);
        img.setAttribute('data-ocr-text', result.text);
        results.push({ img, ...result });
      }
    }

    return results;
  }

  // ── Terminate worker ──────────────────────────────────────────────────
  async terminate() {
    if (this._worker) {
      await this._worker.terminate();
      this._worker = null;
      this._ready  = false;
    }
  }

  // ── Helper: load external script ──────────────────────────────────────
  _loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const script  = document.createElement('script');
      script.src    = src;
      script.onload  = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
}
