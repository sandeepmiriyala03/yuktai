# @yuktishaalaa/yuktai

> Universal runtime accessibility plugin — automatically fixes WCAG 2.2 violations on every page, for every user, with zero configuration. No JAWS needed.

[![npm](https://img.shields.io/npm/v/@yuktishaalaa/yuktai)](https://www.npmjs.com/package/@yuktishaalaa/yuktai)
[![downloads](https://img.shields.io/npm/dm/@yuktishaalaa/yuktai)](https://www.npmjs.com/package/@yuktishaalaa/yuktai)
[![license](https://img.shields.io/badge/license-ISC-brightgreen)](./LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D18-blue)](https://nodejs.org)

---

## What's new in v2.0.0

- ✅ No JAWS needed — works with NVDA, VoiceOver, TalkBack, Narrator
- ✅ Built-in SpeechSynthesis — browser speaks on focus, zero install
- ✅ Visual alerts — sliding banner for deaf users, no audio needed
- ✅ Keyboard navigation — arrow keys, Escape, focus trap, no AT needed
- ✅ Skip links — multi-target (main, nav, search), always visible on mobile
- ✅ Preference panel — blind / deaf / motor / colour blind presets
- ✅ Persistent preferences — saved to localStorage across pages
- ✅ WCAG 2.2 — focus appearance, target size 44×44px, timeout warning
- ✅ Audit score — 0–100 with issue breakdown (localhost dev only)
- ✅ Dyslexia font — Atkinson Hyperlegible (research-backed)
- ✅ React 17, 18, 19 supported
- ✅ TypeScript declarations — full `index.d.ts` generated

---

## Install

### React 17 or 18
```bash
npm i @yuktishaalaa/yuktai
```

### React 19 or MUI v5 conflict
```bash
npm i @yuktishaalaa/yuktai --legacy-peer-deps
```

### MUI v5 + React 19 permanent fix
```bash
npm i @mui/material@6 @mui/icons-material@6 --legacy-peer-deps
```

### Requirements
- Node.js 18 or higher
- npm 8 or higher

---

## What it does

yuktai scans every HTML element on the page and automatically injects missing accessibility attributes — `aria-label`, `alt`, `role`, `tabindex`, `scope`, `autocomplete`, `aria-required`, `aria-expanded`, and more. It also:

- Injects multi-target skip links — main content, navigation, search
- Ensures `<html lang>` and `<title>` are present
- Fixes `<meta viewport>` if it blocks user zoom
- Watches for new DOM elements via `MutationObserver`
- Applies user-controlled visual preferences — high contrast, dark mode, reduce motion, large targets, font scale, dyslexia font, colour blind simulation
- Speaks focused elements aloud via browser SpeechSynthesis — zero install
- Shows visual alert banners for deaf users — no audio dependency
- Enforces keyboard navigation — arrow keys, Escape, focus trap in modals
- Saves user preferences to localStorage across sessions
- Shows accessibility audit score 0–100 in development

The floating ♿ button appears bottom-right. Click it, choose preferences, click **Apply settings**.

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

## Next.js — App Router

**Step 1 — next.config.js**

```js
const nextConfig = {
  transpilePackages: ["@yuktishaalaa/yuktai"],
};
module.exports = nextConfig;
```

**Step 2 — Create a client wrapper**

```tsx
// components/YuktaiClient.tsx
"use client";
import { useState, useEffect, type ReactNode } from "react";
import { YuktAIWrapper } from "@yuktishaalaa/yuktai";

export default function YuktaiClient({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Prevents React hydration mismatch error #418
  if (!mounted) return <>{children}</>;

  return (
    <YuktAIWrapper position="left">
      {children}
    </YuktAIWrapper>
  );
}
```

**Step 3 — app/layout.tsx**

```tsx
import YuktaiClient from "@/components/YuktaiClient";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <YuktaiClient>
          <main>{children}</main>
        </YuktaiClient>
      </body>
    </html>
  );
}
```

**Pages Router — pages/_app.tsx**

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
window.yuktai.apply();
window.yuktai.reset();
window.yuktai.wcagPlugin.scan();
```

---

## Web Component

Works in every framework and plain HTML — uses native Custom Elements.

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
import { wcagPlugin } from "@yuktishaalaa/yuktai";

// Apply all WCAG rules
const report = wcagPlugin.applyFixes({
  enabled:       true,
  highContrast:  false,
  darkMode:      false,
  reduceMotion:  false,
  largeTargets:  false,
  speechEnabled: false,
  colorBlindMode:"none",
  autoFix:       true,
});

console.log(report.fixed);      // number of fixes applied
console.log(report.scanned);    // number of nodes scanned
console.log(report.renderTime); // time in ms
console.log(report.score);      // accessibility score 0–100
console.log(report.details);    // array of A11yFix objects

// Scan only — no DOM changes
const violations = wcagPlugin.scan();

// Announce to screen readers + visual alert + speech
wcagPlugin.announce("Form submitted successfully", "success");
wcagPlugin.announce("Email is required", "error");

// Browser speech — zero install
wcagPlugin.speak("Welcome to the dashboard");

// Visual alert for deaf users
wcagPlugin.showVisualAlert("Settings saved", "success");

// Focus trap for modals
const modal = document.querySelector("#my-modal") as HTMLElement;
wcagPlugin.trapFocus(modal);

// Auto-fix new DOM elements
wcagPlugin.startObserver({ enabled: true, autoFix: true });
wcagPlugin.stopObserver();
```

---

## A11yConfig options

```ts
import { wcagPlugin, A11yConfig } from "@yuktishaalaa/yuktai";

const config: A11yConfig = {
  enabled:             true,   // required
  highContrast:        false,  // increase contrast
  darkMode:            false,  // invert colours
  reduceMotion:        false,  // disable animations
  largeTargets:        false,  // 44×44px minimum touch targets
  speechEnabled:       false,  // speak focused elements aloud
  colorBlindMode:      "none", // none | deuteranopia | protanopia | tritanopia | achromatopsia
  autoFix:             true,   // MutationObserver watches for new elements
  showPreferencePanel: true,   // floating ♿ button + panel
  showSkipLinks:       true,   // multi-target skip links
  showAuditBadge:      false,  // score badge — dev only (localhost)
  fontSizeMultiplier:  1,      // font scale multiplier
  timeoutWarning:      0,      // seconds before session timeout warning (0 = off)
};

await wcagPlugin.execute(config);
```

---

## HTML elements covered

- **Headings** — `h1` through `h6`
- **Text** — `p`, `span`, `abbr`, `mark`, `time`, `meter`, `progress`, all inline elements
- **Images & media** — `img`, `area`, `svg`, `canvas`, `video`, `audio`, `iframe`, `object`, `embed`, `figure`
- **Interactive** — `button`, `a`, clickable `div` / `span`
- **Forms** — `input` (all types), `select`, `textarea`, `fieldset`, `label`
- **Tables** — `table`, `th`, `td`, `caption`
- **Lists** — `ul`, `ol`, `dl`, `li`, `dt`, `dd`
- **Landmarks** — `nav`, `header`, `footer`, `main`, `aside`, `section`, `article`, `details`, `summary`, `dialog`
- **Document** — `html`, `head`, `meta viewport`, `body`
- **ARIA widgets** — `role=tab`, `alert`, `tooltip`, `menu`, `listbox`, `slider`, `checkbox`, `combobox`, `grid`, `tree`, `spinbutton`

---

## WCAG coverage

| Standard | Criteria covered |
|---|---|
| WCAG 2.0 | 19 criteria |
| WCAG 2.1 | 7 criteria |
| WCAG 2.2 | 3 criteria (focus appearance, target size, timeout) |
| Beyond WCAG | SpeechSynthesis, visual alerts, keyboard cheatsheet, audit score, colour blind modes, dyslexia font |

---

## Accessibility features — no screen reader software needed

| Feature | Who it helps | How |
|---|---|---|
| SpeechSynthesis | Blind users without screen reader | Browser reads focused element aloud |
| Visual alerts | Deaf users | Sliding banner — no audio |
| Skip links | All keyboard users | Jump to main, nav, search |
| Focus trap | Keyboard users | Tab stays inside modals |
| Arrow key nav | Keyboard users | Navigate menus, tabs, listbox |
| Keyboard cheatsheet | All users | Press Alt+A |
| Colour blind modes | Colour blind users | Deuteranopia, protanopia, tritanopia, greyscale |
| High contrast | Low vision users | Filter-based contrast boost |
| Dark mode | Light sensitivity | Invert + hue rotate |
| Large targets | Motor impaired | 44×44px minimum |
| Timeout warning | Motor impaired | Warning before session expires |
| Dyslexia font | Dyslexia users | Atkinson Hyperlegible |
| Reduce motion | Vestibular disorder | Disables all animations |

---

## The report

After clicking **Apply settings**, the panel shows:

```
✓ 12 fixes · 534 nodes · 1.2ms · Score: 88/100
✓ 0 fixes needed · 534 nodes clean · 0.8ms · Score: 100/100
```

`Score: 100/100` means the page is fully accessible. `0 fixes needed` is a passing result — the page was already accessible before yuktai ran.

---

## Design principles

- **Zero id attributes** — no injected node ever gets an `id`. All injected nodes tracked via module-level JavaScript references. Never collides with host app ids.
- **Zero API keys** — runs entirely in the browser. No external calls, no telemetry, no cost.
- **Zero framework lock-in** — `core/renderer.ts` has no framework imports. Works in Node.js, browsers, and test environments.
- **Zero JAWS dependency** — uses standard browser APIs. Works with NVDA, VoiceOver, TalkBack, Narrator — all free.
- **One engine, many adapters** — all adapters import from `core/renderer.ts`. WCAG logic written once.

---

## Browser support

| Browser | Supported |
|---|---|
| Chrome 90+ | ✅ |
| Firefox 90+ | ✅ |
| Safari 15+ | ✅ |
| Edge 90+ | ✅ |
| Samsung Internet 14+ | ✅ |

---

## Framework compatibility

| Framework | Version | Supported |
|---|---|---|
| React | 17, 18, 19 | ✅ |
| Next.js | 13, 14, 15 | ✅ |
| Vue | 3+ | ✅ |
| Nuxt | 3+ | ✅ |
| Angular | 15+ | ✅ |
| Remix | Any | ✅ |
| Astro | Any | ✅ |
| Vanilla JS | ES2020+ | ✅ |

---

## License

ISC © Sandeep Miriyala — [Yuktishaalaa AI Lab]