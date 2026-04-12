/**
 * AksharaJS – IndexedDB Module
 *
 * Promise-based wrapper around IndexedDB.
 * Auto-initialises during akshara.init().
 *
 * API:
 *   akshara.db.init(dbName, version?, stores?)
 *   akshara.db.set(store, key, value)
 *   akshara.db.get(store, key)
 *   akshara.db.getAll(store)
 *   akshara.db.delete(store, key)
 *   akshara.db.clear(store)
 */

const DEFAULT_STORES = ['settings', 'cache', 'users', 'data'];

export class DBEngine {

  constructor(logger) {
    this.log = logger;
    this._db  = null;
  }

  // ── Open / create database ────────────────────────────────────────────
  init(dbName = 'aksharajs-db', version = 1, stores = DEFAULT_STORES) {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        this.log.warn('[db] IndexedDB not supported.');
        reject(new Error('IndexedDB not supported'));
        return;
      }

      const request = indexedDB.open(dbName, version);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        stores.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'key' });
            this.log.debug(`[db] Object store created: "${storeName}"`);
          }
        });
      };

      request.onsuccess = (event) => {
        this._db = event.target.result;
        this.log.info(`[db] IndexedDB "${dbName}" opened (v${version})`);
        resolve(this);
      };

      request.onerror = (event) => {
        this.log.warn('[db] Failed to open IndexedDB:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  // ── Internal: get transaction ─────────────────────────────────────────
  _tx(store, mode = 'readonly') {
    if (!this._db) throw new Error('[db] Database not initialised. Call db.init() first.');
    return this._db.transaction(store, mode).objectStore(store);
  }

  // ── SET ───────────────────────────────────────────────────────────────
  set(store, key, value) {
    return new Promise((resolve, reject) => {
      try {
        const req = this._tx(store, 'readwrite').put({ key, value, updatedAt: Date.now() });
        req.onsuccess = () => resolve(true);
        req.onerror   = e  => reject(e.target.error);
      } catch (e) { reject(e); }
    });
  }

  // ── GET ───────────────────────────────────────────────────────────────
  get(store, key) {
    return new Promise((resolve, reject) => {
      try {
        const req = this._tx(store).get(key);
        req.onsuccess = e  => resolve(e.target.result?.value ?? null);
        req.onerror   = e  => reject(e.target.error);
      } catch (e) { reject(e); }
    });
  }

  // ── GET ALL ───────────────────────────────────────────────────────────
  getAll(store) {
    return new Promise((resolve, reject) => {
      try {
        const req = this._tx(store).getAll();
        req.onsuccess = e  => resolve(e.target.result.map(r => ({ key: r.key, value: r.value })));
        req.onerror   = e  => reject(e.target.error);
      } catch (e) { reject(e); }
    });
  }

  // ── DELETE ────────────────────────────────────────────────────────────
  delete(store, key) {
    return new Promise((resolve, reject) => {
      try {
        const req = this._tx(store, 'readwrite').delete(key);
        req.onsuccess = () => resolve(true);
        req.onerror   = e  => reject(e.target.error);
      } catch (e) { reject(e); }
    });
  }

  // ── CLEAR ─────────────────────────────────────────────────────────────
  clear(store) {
    return new Promise((resolve, reject) => {
      try {
        const req = this._tx(store, 'readwrite').clear();
        req.onsuccess = () => resolve(true);
        req.onerror   = e  => reject(e.target.error);
      } catch (e) { reject(e); }
    });
  }

  // ── KEYS ──────────────────────────────────────────────────────────────
  keys(store) {
    return new Promise((resolve, reject) => {
      try {
        const req = this._tx(store).getAllKeys();
        req.onsuccess = e  => resolve(e.target.result);
        req.onerror   = e  => reject(e.target.error);
      } catch (e) { reject(e); }
    });
  }

  // ── COUNT ─────────────────────────────────────────────────────────────
  count(store) {
    return new Promise((resolve, reject) => {
      try {
        const req = this._tx(store).count();
        req.onsuccess = e  => resolve(e.target.result);
        req.onerror   = e  => reject(e.target.error);
      } catch (e) { reject(e); }
    });
  }
}
