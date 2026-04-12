/**
 * AksharaJS - Core Engine
 * "Code the intent. AksharaJS handles the rest."
 *
 * Orchestrates all sub-modules: accessibility, i18n, seo, pwa,
 * db, wasm, ocr, tts, security, and ai.
 *
 * @version 1.0.0
 * @license MIT
 */

import { AccessibilityEngine } from '../accessibility/accessibility.js';
import { I18nEngine }          from '../i18n/i18n.js';
import { SEOEngine }           from '../seo/seo.js';
import { PWAEngine }           from '../pwa/pwa.js';
import { DBEngine }            from '../db/db.js';
import { WasmEngine }          from '../wasm/wasm.js';
import { OCREngine }           from '../ocr/ocr.js';
import { TTSEngine }           from '../tts/tts.js';
import { SecurityEngine }      from '../security/security.js';
import { AIEngine }            from '../ai/ai.js';
import { Logger }              from '../utils/logger.js';
import { DOMUtils }            from '../utils/dom.js';

// ─── Default configuration ────────────────────────────────────────────────
const DEFAULT_CONFIG = {
  accessibility : true,
  i18n          : true,
  seo           : true,
  pwa           : false,   // off by default – requires SW registration
  offline       : false,
  db            : false,
  wasm          : false,
  ocr           : false,
  tts           : true,
  security      : true,
  ai            : false,
  debug         : false,
};

// ─── Singleton state ───────────────────────────────────────────────────────
let _config      = { ...DEFAULT_CONFIG };
let _initialized = false;

// ─── Engine instances ──────────────────────────────────────────────────────
const engines = {};

/**
 * akshara namespace – public API
 */
const akshara = {

  // ── Initialise AksharaJS with user config ──────────────────────────────
  async init(userConfig = {}) {
    _config = { ...DEFAULT_CONFIG, ...userConfig };

    const log = new Logger(_config.debug);
    log.info('AksharaJS initialising…', _config);

    // Always-on engines
    engines.accessibility = new AccessibilityEngine(log);
    engines.i18n          = new I18nEngine(log);
    engines.seo           = new SEOEngine(log);
    engines.security      = new SecurityEngine(log);

    // Conditional engines
    if (_config.pwa || _config.offline) {
      engines.pwa = new PWAEngine(log, _config);
      await engines.pwa.register();
    }

    if (_config.db) {
      engines.db = new DBEngine(log);
      await engines.db.init('aksharajs-db');
    }

    if (_config.wasm) {
      engines.wasm = new WasmEngine(log);
    }

    if (_config.ocr) {
      engines.ocr = new OCREngine(log);
    }

    if (_config.tts) {
      engines.tts = new TTSEngine(log);
    }

    if (_config.ai) {
      engines.ai = new AIEngine(log);
    }

    // Expose sub-modules on the public API
    akshara.db   = engines.db   || _stubDB();
    akshara.wasm = engines.wasm || _stubWasm();
    akshara.ocr  = engines.ocr  || _stubOCR();
    akshara.tts  = engines.tts  || _stubTTS();
    akshara.ai   = engines.ai   || _stubAI();

    _initialized = true;
    log.info('AksharaJS ready ✓');

    return akshara;
  },

  // ── Enhance a document or DOM node ────────────────────────────────────
  enhance(root = document) {
    if (!_initialized) {
      console.warn('[AksharaJS] Call akshara.init() before enhance().');
      // Auto-init with defaults
      akshara.init(_config).then(() => akshara.enhance(root));
      return;
    }

    const log = new Logger(_config.debug);
    log.info('Enhancing DOM…');

    const startTime = performance.now();

    // Run engines in priority order
    if (_config.security)      engines.security.enhance(root);
    if (_config.i18n)          engines.i18n.enhance(root);
    if (_config.accessibility) engines.accessibility.enhance(root);
    if (_config.seo)           engines.seo.enhance(root);

    const elapsed = (performance.now() - startTime).toFixed(2);
    log.info(`DOM enhanced in ${elapsed}ms ✓`);

    return akshara;
  },

  // ── Utility: run all engines on dynamic content (e.g. after AJAX) ──────
  enhanceFragment(fragment) {
    return akshara.enhance(fragment);
  },

  // ── Current resolved config ───────────────────────────────────────────
  getConfig() {
    return { ..._config };
  },

  // ── Version ──────────────────────────────────────────────────────────
  version: '1.0.0',
};

// ─── Stubs (used when a module is disabled) ────────────────────────────────

function _stubDB() {
  const warn = () => console.warn('[AksharaJS] Enable db:true to use akshara.db');
  return { init: warn, set: warn, get: warn, getAll: warn, delete: warn, clear: warn };
}
function _stubWasm() {
  const warn = () => console.warn('[AksharaJS] Enable wasm:true to use akshara.wasm');
  return { load: warn, run: warn };
}
function _stubOCR() {
  const warn = () => console.warn('[AksharaJS] Enable ocr:true to use akshara.ocr');
  return { extract: warn };
}
function _stubTTS() {
  const warn = () => console.warn('[AksharaJS] Enable tts:true to use akshara.tts');
  return { speak: warn, stop: warn };
}
function _stubAI() {
  const warn = () => console.warn('[AksharaJS] Enable ai:true to use akshara.ai');
  return {
    generateAltText : warn,
    checkContrast   : warn,
    simplifyText    : warn,
    announce        : warn,
  };
}

export { akshara };
export default akshara;
