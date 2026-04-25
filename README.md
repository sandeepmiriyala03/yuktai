# @yuktishaalaa/yuktai

> Universal runtime accessibility plugin — automatically fixes WCAG violations on every page, for every user, with zero configuration.

[![npm](https://img.shields.io/npm/v/@yuktishaalaa/yuktai)](https://www.npmjs.com/package/@yuktishaalaa/yuktai)
[![license](https://img.shields.io/badge/license--brightgreen)](./LICENSE)

---

## Install

```bash
npm i @yuktishaalaa/yuktai
```

---

## What it does

yuktai scans every HTML element on the page and automatically injects missing accessibility attributes — `aria-label`, `alt`, `role`, `tabindex`, `scope`, `autocomplete`, `aria-required`, `aria-expanded`, and more. It also:

- Injects a skip-to-content link
- Ensures `<html lang>` and `<title>` are present
- Fixes `<meta viewport>` if it blocks user zoom
- Watches for new DOM elements via `MutationObserver` and fixes them as they appear
- Applies user-controlled visual preferences (high contrast, reduce motion, font scale, dyslexia font, colour-blind simulation)

The floating button appears bottom-left. Click it, enable settings, click **Apply settings**.

---

## React

```tsx
// src/App.tsx
import { YuktAIWrapper } from "@yuktishaalaa/yuktai";

export default function App() {
  return (
    <YuktAIWrapper position="left">
      <YourAppContent />
    </YuktAIWrapper>
  );
}
```

**Props**

| Prop | Type | Default | Description |
|---|---|---|---|
| `position` | `"left" \| "right"` | `"left"` | Side the FAB appears on |
| `children` | `ReactNode` | required | Your app content |

---

## Next.js (App Router)

**Step 1 — next.config.js** (required)

```js
const nextConfig = {
  transpilePackages: ["@yuktishaalaa/yuktai"],
};
module.exports = nextConfig;
```

**Step 2 — app/layout.tsx**

```tsx
import { YuktAIWrapper } from "@yuktishaalaa/yuktai";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <YuktAIWrapper position="left">
          <main>{children}</main>
        </YuktAIWrapper>
      </body>
    </html>
  );
}
```

**Pages Router** — use `pages/_app.tsx` instead:

```tsx
import { YuktAIWrapper } from "@yuktishaalaa/yuktai";
import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <YuktAIWrapper position="left">
      <Component {...pageProps} />
    </YuktAIWrapper>
  );
}
```

---

## Vue 3 / Nuxt 3

```vue
<!-- App.vue -->
<script setup lang="ts">
import YuktAIWrapper from "@yuktishaalaa/yuktai/vue";
</script>

<template>
  <YuktAIWrapper position="left">
    <RouterView />
  </YuktAIWrapper>
</template>
```

**Nuxt 3 — app.vue**

```vue
<script setup lang="ts">
import YuktAIWrapper from "@yuktishaalaa/yuktai/vue";
</script>

<template>
  <YuktAIWrapper position="left">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </YuktAIWrapper>
</template>
```

**Nuxt 3 — client plugin** (`plugins/yuktai.client.ts`)

```ts
import YuktAIWrapper from "@yuktishaalaa/yuktai/vue";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("YuktAIWrapper", YuktAIWrapper);
});
```

---

## Angular

**app.module.ts**

```ts
import { YuktAIModule } from "@yuktishaalaa/yuktai/angular";

@NgModule({
  imports: [BrowserModule, YuktAIModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

**app.component.html**

```html
<yuktai-a11y position="left">
  <router-outlet></router-outlet>
</yuktai-a11y>
```

**Angular 17+ standalone**

```ts
import { YuktAIComponent } from "@yuktishaalaa/yuktai/angular";

@Component({
  standalone: true,
  imports: [RouterOutlet, YuktAIComponent],
  template: `
    <yuktai-a11y position="left">
      <router-outlet />
    </yuktai-a11y>
  `,
})
export class AppComponent {}
```

---

## Vanilla JavaScript

**CDN — no install needed**

```html
<!-- Add before </body> -->
<script src="https://cdn.jsdelivr.net/npm/@yuktishaalaa/yuktai/vanilla/index.js"></script>
```

**npm import**

```js
import "@yuktishaalaa/yuktai/vanilla";
```

**Configure position**

```html
<script>
  window.YUKTAI_CONFIG = { position: "right" };
</script>
<script src="cdn.../vanilla/index.js"></script>
```

**Programmatic API**

```js
window.yuktai.apply();   // apply settings
window.yuktai.reset();   // reset everything
window.yuktai.wcagPlugin.scan(); // scan without fixing
```

---

## Web Component

Works in every framework and plain HTML — uses native Custom Elements with Shadow DOM.

**Plain HTML**

```html
<script type="module"
  src="https://cdn.jsdelivr.net/npm/@yuktishaalaa/yuktai/web-component/index.js">
</script>

<yuktai-a11y position="left">
  <!-- your content -->
</yuktai-a11y>
```

**Inside React**

```tsx
import "@yuktishaalaa/yuktai/web-component";

// @ts-ignore
<yuktai-a11y position="left">
  <App />
</yuktai-a11y>
```

**Inside Vue** — add to `vite.config.ts` first:

```ts
plugins: [vue({
  template: {
    compilerOptions: {
      isCustomElement: (tag) => tag === "yuktai-a11y",
    }
  }
})]
```

```vue
<script setup>
import "@yuktishaalaa/yuktai/web-component";
</script>
<template>
  <yuktai-a11y position="left">
    <RouterView />
  </yuktai-a11y>
</template>
```

---

## Direct engine API

```ts
import { wcagPlugin } from "@yuktishaalaa/yuktai/core";

// Apply all WCAG rules
const report = wcagPlugin.applyFixes({ enabled: true });
console.log(report.fixed);       // fixes applied
console.log(report.scanned);     // nodes scanned
console.log(report.renderTime);  // ms

// Scan only — no DOM changes
const violations = wcagPlugin.scan();

// Auto-fix new elements
wcagPlugin.startObserver({ enabled: true, autoFix: true });
wcagPlugin.stopObserver();

// Cleanup
wcagPlugin.removeLiveRegion();
wcagPlugin.removeColorBlindSvg();
```

---

## HTML elements covered

The engine covers every HTML element:

- **Headings** — `h1` through `h6`
- **Text** — `p`, `span`, `abbr`, `mark`, `time`, `meter`, `progress`, and all inline elements
- **Images & media** — `img`, `area`, `svg`, `canvas`, `video`, `audio`, `iframe`, `object`, `embed`, `figure`
- **Interactive** — `button`, `a`, clickable `div`/`span`
- **Forms** — `input` (all types), `select`, `textarea`, `fieldset`, `label`
- **Tables** — `table`, `th`, `td`, `caption`
- **Lists** — `ul`, `ol`, `dl`, `li`, `dt`, `dd`
- **Landmarks** — `nav`, `header`, `footer`, `main`, `aside`, `section`, `article`, `details`, `summary`, `dialog`
- **Document** — `html`, `head`, `meta viewport`, `body`
- **ARIA widgets** — `role=tab`, `alert`, `tooltip`, `menu`, `listbox`, `slider`, `checkbox`, `combobox`, `grid`, `tree`, `spinbutton`

---

## The report

After clicking **Apply settings**, the panel shows:

```
✓ 12 fixes applied · 534 nodes · 1.2ms
✓ 0 fixes needed · 534 nodes clean · 0.8ms
```

`0 fixes needed` is a passing result — it means the page is already accessible. The render time confirms the engine ran.

---

## Design principles

- **Zero id attributes** — no injected node ever gets an `id`. All injected nodes are tracked via module-level JavaScript references. The plugin never collides with the host app's ids.
- **Zero API keys** — the engine runs entirely in the browser. No external calls, no telemetry, no cost.
- **Zero framework lock-in** — `core/renderer.ts` has no framework imports. It works in Node.js, browsers, and test environments.
- **One engine, many adapters** — all adapters import from `core/renderer.ts`. The WCAG logic is written once.

---

## License

 yuktai contributors
