/**
 * AksharaJS – Main Entry Point
 * "Code the intent. AksharaJS handles the rest."
 *
 * Usage:
 *   import { akshara } from 'aksharajs';
 *   // or
 *   import akshara from 'aksharajs';
 *
 *   await akshara.init({ accessibility: true, seo: true, security: true });
 *   akshara.enhance(document);
 */

export { akshara, akshara as default } from './core/akshara.js';

// Named sub-module exports (for tree-shaking)
export { AccessibilityEngine } from './accessibility/accessibility.js';
export { I18nEngine }          from './i18n/i18n.js';
export { SEOEngine }           from './seo/seo.js';
export { PWAEngine }           from './pwa/pwa.js';
export { DBEngine }            from './db/db.js';
export { WasmEngine }          from './wasm/wasm.js';
export { OCREngine }           from './ocr/ocr.js';
export { TTSEngine }           from './tts/tts.js';
export { SecurityEngine }      from './security/security.js';
export { AIEngine }            from './ai/ai.js';
export { Logger }              from './utils/logger.js';
export { DOMUtils }            from './utils/dom.js';
