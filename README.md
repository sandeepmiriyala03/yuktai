# yuktai-a11y

> Universal runtime WCAG auto-fix engine with Gen AI layer.  
> Zero-config. Zero id collisions. Every framework. Open source.

---

## What it does

Most accessibility tools **find** problems. yuktai-a11y **fixes** them — automatically, continuously, at runtime, across every framework, with a Gen AI layer for the issues rules cannot reach.


---

## Install

```bash
npm install yuktai-a11y
```

---

## Usage by framework

### React
```tsx
import YuktAIWrapper from "yuktai-a11y/react";

export default function App() {
  return (
    <YuktAIWrapper position="left">
      <YourApp />
    </YuktAIWrapper>
  );
}
```

### Next.js (App Router)
```tsx
// app/layout.tsx
import YuktAIWrapper from "yuktai-a11y/next";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <YuktAIWrapper>{children}</YuktAIWrapper>
      </body>
    </html>
  );
}
```

### Vue 3 / Nuxt 3
```vue
<script setup>
import YuktAIWrapper from "yuktai-a11y/vue";
</script>

<template>
  <YuktAIWrapper position="left">
    <slot />
  </YuktAIWrapper>
</template>
```

### Angular
```ts
// app.module.ts
import { YuktAIModule } from "yuktai-a11y/angular";

@NgModule({ imports: [YuktAIModule] })
export class AppModule {}
```
```html
<!-- app.component.html -->
<yuktai-a11y position="left">
  <router-outlet></router-outlet>
</yuktai-a11y>
```

### Vanilla JS / CDN
```html
<script src="https://cdn.jsdelivr.net/npm/yuktai-a11y/vanilla/index.js"></script>
```

### Web Component (works in ANY framework or plain HTML)
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/yuktai-a11y/web-component/index.js"></script>
<yuktai-a11y position="left"></yuktai-a11y>
```

---


```

## What the engine fixes

### WCAG Level A
- Empty buttons and links → `aria-label` injected
- Images without alt → `alt=""` + `aria-hidden="true"`

### WCAG Level AA
- Clickable divs/spans → `role="button"` + `tabIndex=0` + Enter/Space keyboard support
- Form fields without labels → `aria-label` from placeholder/name
- Required fields → `aria-required="true"`
- Input autocomplete purpose → `autocomplete="email"` / `"tel"` (WCAG 1.3.5)
- External links → `rel="noopener noreferrer"` + screen-reader new-tab warning

### WCAG Level AAA
- Tables without headers → `role="grid"`
- Structural landmarks → `role="navigation"`, `"banner"`, `"contentinfo"`, `"main"`

### Visual preferences (user-controlled)
- High contrast filter
- Reduce motion
- Dyslexia-friendly font (wider spacing)
- Font scale 80%–150%
- Color blindness simulation (deuteranopia, protanopia, tritanopia, achromatopsia)
- Keyboard navigation hints

---

## The "0 fixes" report

If you see `✓ 0 fixes needed · 534 nodes clean · 1.2ms` — that is a **passing result**.  
It means every element on your page already has correct accessibility attributes. The render time proves the engine ran and how fast it completed.

---

## Core API (direct usage)
```ts
import { wcagPlugin } from "yuktai-a11y/core";

// Apply all fixes
const report = wcagPlugin.applyFixes({ enabled: true, highContrast: false });
console.log(report.fixed, report.scanned, report.renderTime);

// Scan only (no fixes — for Gen AI input)
const violations = wcagPlugin.scan();

// Announce to screen readers
wcagPlugin.announce("Settings applied.");

// MutationObserver (auto-fix new DOM nodes)
wcagPlugin.startObserver({ enabled: true, autoFix: true });
wcagPlugin.stopObserver();
```

---

## Design decisions

- **Zero id attributes** — no injected node ever gets an `id`. All DOM nodes tracked via module-level refs. Never collides with the host app.
- **Core is framework-agnostic** — `core/renderer.ts` has zero framework imports. Works in Node (SSR auditing), browsers, and test environments.
- **Layered** — rules engine first (fast, free, deterministic), AI layer only for flagged violations (targeted, cheap).
- **MutationObserver** — continuously fixes new elements added after page load. Works with SPAs, infinite scroll, modals, dynamic content.

