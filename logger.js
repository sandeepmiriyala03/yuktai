/**
 * AksharaJS – Logger Utility
 *
 * Provides levelled logging with optional debug mode.
 * All AksharaJS log messages are prefixed with [AksharaJS].
 */

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };

export class Logger {

  constructor(debug = false) {
    this._debug = debug;
    this._level = debug ? LEVELS.debug : LEVELS.info;
    this._logs  = [];          // in-memory log store
  }

  debug(...args) {
    if (this._level <= LEVELS.debug) {
      this._record('debug', args);
      console.debug('[AksharaJS]', ...args);
    }
  }

  info(...args) {
    if (this._level <= LEVELS.info) {
      this._record('info', args);
      console.info('[AksharaJS]', ...args);
    }
  }

  warn(...args) {
    this._record('warn', args);
    console.warn('[AksharaJS]', ...args);
  }

  error(...args) {
    this._record('error', args);
    console.error('[AksharaJS]', ...args);
  }

  // Return collected log entries (useful for debug panels)
  getLogs(level = null) {
    return level
      ? this._logs.filter(l => l.level === level)
      : [...this._logs];
  }

  _record(level, args) {
    this._logs.push({
      level,
      timestamp : new Date().toISOString(),
      message   : args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '),
    });
  }
}
