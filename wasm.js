/**
 * AksharaJS – WebAssembly Module
 *
 * Async WASM loading with JS fallback.
 *
 * API:
 *   akshara.wasm.load(path)              → loads .wasm file
 *   akshara.wasm.run(functionName, args) → calls an exported function
 */

export class WasmEngine {

  constructor(logger) {
    this.log      = logger;
    this._modules = new Map(); // cache loaded modules
  }

  // ── Load a .wasm file ────────────────────────────────────────────────
  async load(path, importObject = {}) {
    if (this._modules.has(path)) {
      return this._modules.get(path);
    }

    if (!WebAssembly || !WebAssembly.instantiateStreaming) {
      this.log.warn('[wasm] WebAssembly not supported – falling back to JS.');
      return null;
    }

    try {
      let instance;

      // Try streaming instantiation first (most efficient)
      if (typeof fetch !== 'undefined') {
        const result = await WebAssembly.instantiateStreaming(fetch(path), importObject);
        instance = result.instance;
      } else {
        // Node.js / fallback
        const bytes  = await this._fetchBytes(path);
        const result = await WebAssembly.instantiate(bytes, importObject);
        instance = result.instance;
      }

      this._modules.set(path, instance);
      this.log.info(`[wasm] Loaded: ${path}`);
      return instance;
    } catch (err) {
      this.log.warn(`[wasm] Failed to load ${path}:`, err);
      return null;
    }
  }

  // ── Run an exported function ──────────────────────────────────────────
  async run(functionName, args = [], modulePath = null) {
    // If modulePath is given, ensure it is loaded
    const instance = modulePath
      ? (this._modules.get(modulePath) || await this.load(modulePath))
      : this._modules.values().next().value; // use first loaded module

    if (!instance) {
      this.log.warn(`[wasm] No WASM module loaded. Call wasm.load(path) first.`);
      return null;
    }

    const fn = instance.exports[functionName];
    if (typeof fn !== 'function') {
      this.log.warn(`[wasm] Export "${functionName}" not found in WASM module.`);
      return null;
    }

    try {
      return fn(...args);
    } catch (err) {
      this.log.warn(`[wasm] Error calling "${functionName}":`, err);
      return null;
    }
  }

  // ── Fetch raw bytes (fallback) ────────────────────────────────────────
  async _fetchBytes(path) {
    const response = await fetch(path);
    return response.arrayBuffer();
  }

  // ── List loaded modules ───────────────────────────────────────────────
  list() {
    return Array.from(this._modules.keys());
  }
}
