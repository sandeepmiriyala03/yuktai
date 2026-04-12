/**
 * AksharaJS – PWA Engine
 *
 * Responsibilities:
 *  - Register a Service Worker (cache-first for static, network-first for dynamic)
 *  - Generate and inject a Web App Manifest
 *  - Handle offline fallback page
 *  - Add install prompt support
 */

export class PWAEngine {

  constructor(logger, config) {
    this.log    = logger;
    this.config = config;
  }

  // ── Register Service Worker ───────────────────────────────────────────
  async register() {
    if (!('serviceWorker' in navigator)) {
      this.log.warn('[pwa] Service Worker not supported in this browser.');
      return;
    }

    // Inject the SW script as a Blob URL (embedded SW, no external file needed)
    const swBlob = new Blob([this._generateSWScript()], { type: 'application/javascript' });
    const swURL  = URL.createObjectURL(swBlob);

    try {
      const reg = await navigator.serviceWorker.register(swURL, { scope: '/' });
      this.log.info('[pwa] Service Worker registered:', reg.scope);
    } catch (err) {
      this.log.warn('[pwa] Service Worker registration failed:', err);
    }

    // Generate & inject manifest
    this._injectManifest();
    // Inject meta theme-color
    this._injectThemeColor();
  }

  // ── Generate Service Worker JS source ────────────────────────────────
  _generateSWScript() {
    const CACHE_NAME  = 'akshara-cache-v1';
    const DYNAMIC_CACHE = 'akshara-dynamic-v1';

    // Static assets to precache
    const PRECACHE_URLS = [
      '/',
      '/index.html',
      '/offline.html',
    ];

    return `
const CACHE_NAME     = '${CACHE_NAME}';
const DYNAMIC_CACHE  = '${DYNAMIC_CACHE}';
const PRECACHE_URLS  = ${JSON.stringify(PRECACHE_URLS)};
const OFFLINE_URL    = '/offline.html';

// Install: precache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS)).catch(() => {})
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME && k !== DYNAMIC_CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first for static, network-first for dynamic
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET and cross-origin
  if (event.request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  const isStatic = /\\.(js|css|woff2?|png|jpg|jpeg|gif|svg|ico|webp)$/i.test(url.pathname);

  if (isStatic) {
    // Cache-first strategy
    event.respondWith(
      caches.match(event.request).then(cached =>
        cached || fetch(event.request).then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          }
          return res;
        })
      ).catch(() => caches.match(OFFLINE_URL))
    );
  } else {
    // Network-first strategy
    event.respondWith(
      fetch(event.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(DYNAMIC_CACHE).then(c => c.put(event.request, clone));
        }
        return res;
      }).catch(() =>
        caches.match(event.request) ||
        caches.match(OFFLINE_URL)
      )
    );
  }
});
    `;
  }

  // ── Generate manifest.json and inject link tag ────────────────────────
  _injectManifest() {
    if (document.querySelector('link[rel="manifest"]')) return;

    const title     = document.title || 'My App';
    const themeColor = '#005fcc';
    const bgColor    = '#ffffff';

    const manifest = {
      name             : title,
      short_name       : title.slice(0, 12),
      description      : document.querySelector('meta[name="description"]')?.content || title,
      start_url        : '/',
      display          : 'standalone',
      background_color : bgColor,
      theme_color      : themeColor,
      lang             : document.documentElement.getAttribute('lang') || 'en',
      orientation      : 'any',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);

    const link  = document.createElement('link');
    link.rel    = 'manifest';
    link.href   = url;
    document.head.appendChild(link);

    this.log.info('[pwa] Web App Manifest injected');
  }

  // ── Meta theme-color ──────────────────────────────────────────────────
  _injectThemeColor() {
    if (!document.querySelector('meta[name="theme-color"]')) {
      const meta     = document.createElement('meta');
      meta.name      = 'theme-color';
      meta.content   = '#005fcc';
      document.head.appendChild(meta);
    }

    // Apple mobile web app tags
    if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
      const m = document.createElement('meta');
      m.name    = 'apple-mobile-web-app-capable';
      m.content = 'yes';
      document.head.appendChild(m);
    }
  }
}
