# @yuktishaalaa/yuktai

> Universal Next.js plugin for accessibility, AI, and data. One install brings WCAG 2.2 auto-fix, in-browser RAG, an AI agent, code generation, and an accessible data grid with Agentic AI + WebMCP — zero API keys, zero cost, works offline.

[![npm](https://img.shields.io/npm/v/@yuktishaalaa/yuktai)](https://www.npmjs.com/package/@yuktishaalaa/yuktai)

[![downloads](https://img.shields.io/npm/dm/@yuktishaalaa/yuktai)](https://www.npmjs.com/package/@yuktishaalaa/yuktai)

[![license](https://img.shields.io/badge/license-ISC-brightgreen)](./LICENSE)

[![node](https://img.shields.io/badge/node-%3E%3D18-blue)](https://nodejs.org)

[![Next.js](https://img.shields.io/badge/Next.js-16%2B-black)](https://nextjs.org)

**7,000+ developers** already installed yuktai. Built entirely in free time by [Sandeep Miriyala](https://github.com/sandeepmiriyala03) with help from Claude, GPT, and Gemini.

Live demo → [https://aksharatantra.miriyala.in/staffdirectory](https://aksharatantra.miriyala.in/staffdirectory)

---

## The story

I have been building web apps since 2013. In all those years the same things kept breaking on almost every website I touched. Missing ARIA labels. No keyboard navigation. Forms that senior citizens couldn't figure out. Data grids that broke on mobile. Accessibility tools that cost money. AI tools that needed API keys.

I wanted something without any of those barriers.

Free. Open source. One install. Works on every device. No account. No key. No server.

So I built yuktai — one weekend and one late-night at a time. This README is the map of everything that shipped.

---

## What's inside

Five modules ship in the single npm package:

| Module | Features | What it does |

|---|---|---|

| **1. Accessibility Engine** | 16 | WCAG 2.2 auto-fix, speak on focus, colour-blind modes, dyslexia font, skip links |

| **2. YuktaiGrid** ⭐ NEW | 12 | Accessible data grid with 5 WCAG themes, search, sort, pagination, mobile card view |

| **3. In-Tab RAG** | 11 | Ask questions about any page — offline, no API |

| **4. Autonomous AI Agent** | 13 | Natural-language browser automation |

| **5. Vibe Coder** | 19 | Generate full Next.js projects from plain English |

Plus Grid Assistant capabilities, Grid Agent tools, WebMCP integration, 7 custom SVG icons, and a voice + chat assistant.

---

## What's new

### v4.6.4 — YuktaiGrid Agentic AI + WebMCP

YuktaiGrid now brings Grid UI, Grid AI Assistant, reusable Grid Tools, Agent execution, and WebMCP registration together.

- Shared Grid Tools for Agent and WebMCP execution

- Search grid rows

- Count grid rows

- Get grid columns

- Get a row by ID

- Highlight rows

- Select a row

- Open a row

- WebMCP registration through document.modelContext

- useYuktaiGridAgent for programmatic Grid tool execution

- Embedded Grid AI Assistant inside YuktaiGrid

- English and Telugu AI UI

- English voice input by default with Telugu voice-input support

- language, inputLanguage, and embedded AI options

- Functional page-size switching such as 10 → 20 → 50 → 100

- Inline SVG Grid icons with no external icon dependency

- Public seven-icon package API

Architecture: User → Agent → WebMCP → YuktaiGrid → Data

### v4.6.3

Previous published release before the v4.6.4 Grid fixes and polish.

---

## Install

### Next.js 16 + React 19 (recommended)

```bash

npm install @yuktishaalaa/yuktai --legacy-peer-deps

```

### Older Next.js (13, 14, 15)

```bash

npm install @yuktishaalaa/yuktai

```

Requirements: Node.js 18+, npm 8+, Next.js 13+.

---

## Quick start

### Step 1 — `next.config.js`

```js

const nextConfig = {

  transpilePackages: ["@yuktishaalaa/yuktai"],

};

module.exports = nextConfig;

```

### Step 2 — Client wrapper

```tsx

// components/YuktaiClient.tsx

"use client";

import { useState, useEffect, type ReactNode } from "react";

import { YuktAIWrapper } from "@yuktishaalaa/yuktai";

export default function YuktaiClient({ children }: { children: ReactNode }) {

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <>{children}</>;

  return (

    <YuktAIWrapper position="left">

      {children}

    </YuktAIWrapper>

  );

}

```

### Step 3 — `app/layout.tsx`

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

That's it. Three AI-powered buttons appear on every page. Click the ♿ button bottom-right to open the accessibility panel.

---

## Module 1 — Accessibility Engine

Scans every element and injects missing accessibility attributes automatically.

Covers: headings, images, forms, tables, lists, landmarks, ARIA widgets. Watches for new DOM elements via `MutationObserver`.

### Features (16)

- WCAG 2.2 auto-fix — ARIA, roles, tabindex, scope, autocomplete

- Speak on focus — browser speech synthesis

- Voice control — say commands to navigate

- High contrast · Dark mode · Reduce motion · Large targets (44×44)

- Colour-blind modes — Deuteranopia, Protanopia, Tritanopia, Greyscale

- Dyslexia font — Atkinson Hyperlegible (research-backed)

- Local font picker, font scaling 80–130%

- Audit badge — WCAG score 0–100 (localhost only)

- Skip links, focus trap, preference persistence, reset

### Direct API

```ts

import { wcagPlugin } from "@yuktishaalaa/yuktai";

// Apply fixes

const report = wcagPlugin.applyFixes({

  enabled:       true,

  highContrast:  false,

  darkMode:      false,

  reduceMotion:  false,

  largeTargets:  false,

  speechEnabled: false,

  colorBlindMode:"none",

  autoFix:       true,

});

console.log(report.fixed);   // number of fixes applied

console.log(report.score);   // 0–100

```

---

## Module 2 — YuktaiGrid ⭐

An accessible data grid built for Next.js. Handles small tables and large datasets. Works with any API. Ships with the 5 accessibility themes.

### Usage

```tsx

"use client";

import { YuktaiGrid } from "@yuktishaalaa/yuktai";

const data = [

{ id: 1, name: "Sandeep", role: "Developer", salary: 85000 },

{ id: 2, name: "Priya", role: "Designer", salary: 90000 },

];

export default function EmployeesPage() {

return (

\<YuktaiGrid

  data={data}

  columns={[

    { key: "name", label: "Name", sortable: true },

    { key: "role", label: "Role" },

    { key: "salary", label: "Salary", type: "number", align: "right" },

  ]}

  theme="default"                         // default | high-contrast | dark | color-blind | dyslexia

  locale="en-US"                          // en-US | te-IN

  search={true}                           // real-time filtering

  ai={true}                               // embedded Grid AI Assistant

  view="auto"                             // auto | table | card

  pagination={{
    pageSize: 20,
    showSizeChanger: true,
    sizeOptions: [10, 20, 50, 100],
  }}

/>

);

}

```

### Grid features

- Search bar with inline SVG icon

- Sort — click a column header to toggle ascending / descending

- Functional client-side pagination

- Configurable page-size switching such as 10, 20, 50, 100

- Mobile card view below the configured breakpoint

- Loading and empty states

- 5 WCAG themes

- Row selection, custom render, and rowKey

- Row highlighting and optional auto-scroll to highlighted rows

- Embedded Grid AI Assistant

- English and Telugu Grid UI

- Inline SVG search, sort, selection, and pagination icons

- No external icon dependency

### Handling large datasets (100K, 200K, 300K rows)

**Client-side pagination handles a few thousand rows well.** For anything larger, use **server-side pagination** — fetch only the page you need.

Here's the pattern with a Next.js API proxy that also solves CORS.

**`src/app/api/employees/route.ts`** — the proxy:

```ts

import { NextRequest, NextResponse } from "next/server";

let cachedData: any[] | null = null;

let cacheTime = 0;

const TTL_MS = 60_000;

async function fetchAll(): Promise<any[]> {

  const now = Date.now();

  if (cachedData && now - cacheTime < TTL_MS) return cachedData;

  const res  = await fetch("https://your-api.com/employees", { cache: "no-store" });

  const json = await res.json();

  cachedData = Array.isArray(json) ? json : (json.employees ?? json.data ?? []);

  cacheTime  = now;

  return cachedData;

}

export async function GET(req: NextRequest) {

  const p = req.nextUrl.searchParams;

  const page     = Math.max(1, parseInt(p.get("page")     || "1"));

  const pageSize = Math.max(1, parseInt(p.get("pageSize") || "5000"));

  const search   = (p.get("search") || "").toLowerCase().trim();

  const all      = await fetchAll();

  const filtered = search

    ? all.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search)))

    : all;

  const total = filtered.length;

  const rows  = filtered.slice((page - 1) * pageSize, page * pageSize);

  return NextResponse.json({

    rows,

    pagination: { page, pageSize, totalRows: total, totalPages: Math.ceil(total / pageSize) },

  });

}

```

**Page — call the paginated API and disable the grid's built-in pagination:**

```tsx

const [apiResp, setApiResp]     = useState<any>(null);

const [currentPage, setPage]    = useState(1);

useEffect(() => {

  fetch(`/api/employees?page=${currentPage}&pageSize=5000`)

    .then(r => r.json())

    .then(setApiResp);

}, [currentPage]);

<YuktaiGrid

  data={apiResp?.rows ?? []}

  columns={columns}

  search={false}         // disable — we handle search server-side

  pagination={false}     // disable — we handle pagination server-side

  loading={!apiResp}

/>

```

Then render your own pagination bar backed by `apiResp.pagination`. This pattern works for 100K, 200K, 300K rows — the browser only ever holds 5,000 rows in memory.

---

---

## Grid Agentic AI + WebMCP

YuktaiGrid exposes reusable Grid operations so an Agent can work with grid data through a shared tool layer and WebMCP.

### Grid tools

```ts

import {
searchGrid,
countGrid,
getColumns,
getRow,
highlightRows,
selectRow,
openRow,
} from "@yuktishaalaa/yuktai";

```

These operations form the common execution layer for programmatic Agent tools and WebMCP.

### Agent execution

```tsx

import {
useYuktaiGridAgent,
type GridAgentTool,
} from "@yuktishaalaa/yuktai";

const tools: GridAgentTool[] = [
{
name: "search",
description: "Search grid rows",
execute: async ({ query }) => {
return { query };
},
},
];

const { executeTool, loading } =
useYuktaiGridAgent({ tools });

```

### WebMCP

```tsx

import {
YuktaiGridWebMCP,
} from "@yuktishaalaa/yuktai";

<YuktaiGridWebMCP
data={data}
columns={columns}
/>

```

WebMCP registration is invisible in the UI and uses document.modelContext when available.

### Embedded Grid AI Assistant

```tsx

<YuktaiGrid
data={data}
columns={columns}
locale="te-IN"
ai={true}
pagination={{
pageSize: 20,
showSizeChanger: true,
sizeOptions: [10, 20, 50, 100],
}}
/>

```

Grid AI supports:

- language="en-US" or language="te-IN" for AI UI and responses

- inputLanguage="en-US" or inputLanguage="te-IN" for voice input

- embedded mode for rendering AI inside the Grid

- Local intent parsing for search, sort, count, highest, lowest, average, total, and lookup

---

## Module 3 — In-Tab RAG (Ask This Page)

Retrieval-Augmented Generation running entirely in the browser. Extracts semantic chunks from the current DOM, embeds them, finds the best match for the user's question, and answers — offline, no API key.

### Features (11)

- Ask any question about any page

- Gemini Nano on desktop Chrome — zero download, zero API

- Transformers.js on mobile — 30 MB one-time model load

- Auto engine detection and switching

- Works offline after first load

- q4 quantization on mobile (32-bit → 4-bit weights)

- `flan-t5-small` for full-sentence answers

- Cosine similarity semantic search

- Deduped DOM text extraction

### What I learned

The hardest part was mobile. Transformers.js kept crashing on iOS Safari with out-of-memory errors. Learning about quantization — same model, 75% smaller — fixed it. DistilBERT gives short useless spans; flan-t5-small gives real sentences. None of that was in any tutorial. Found on a Saturday by breaking things until something worked.

---

## Module 4 — Autonomous AI Agent

User types a goal in plain English. Yuktai reads the DOM, finds the right elements, plans steps, and highlights what to do.

### Features (13)

- Plain-English goal input

- Reads full page DOM — 9 traversal strategies

- Scans all form fields — 11 label strategies

- Works on static HTML, React, WordPress, and old government portals

- Gemini Nano planning on desktop, Transformers.js on mobile

- Rule-based fallback if AI fails

- Highlights target field with teal outline

- Scrolls to relevant section by keyword

- Numbered step-by-step plan

- Handles iframes

The 11 label strategies came from real websites — old government portals put labels in the previous table cell, modern apps use `aria-label`, static pages use `placeholder`. Every strategy solved a problem I had actually hit.

---

## Module 5 — Vibe Coder

Type a business requirement. Yuktai generates a full Next.js 16 project as a downloadable ZIP.

### Features (19)

- Detects website type (12 types), pages needed (21 types), features (14 types)

- Detects theme colour (8), extracts site name

- Preview before generating

- Full Next.js 16 project — Tailwind + CSS Modules, TypeScript, mobile responsive

- Navbar, Footer, Home, About, Contact, Services, Pricing, Auth, Dashboard pages

- Downloads as ZIP · `npm run dev` works immediately

- Pure templates — no AI writes the code

No AI writes a single line. Pure template engineering. Same reusable-utility thinking from 2013 jQuery — now generating entire Next.js projects.

---

## Grid AI Assistant — Voice + Chat

The Grid AI Assistant can run embedded inside YuktaiGrid or as a standalone component.

Voice input uses the browser Web Speech API. AI responses can be spoken with SpeechSynthesis. Intent parsing runs locally for the supported Grid operations.

Supports:

- Search

- Sort

- Count

- Highest / maximum

- Lowest / minimum

- Average

- Total

- Row lookup

- English and Telugu AI UI

- English voice input by default

- Telugu voice input with inputLanguage="te-IN"

Example:

```tsx

<YuktaiGridAI
data={data}
columns={columns}
onSearch={handleSearch}
onSort={handleSort}
language="te-IN"
inputLanguage="en-US"
embedded
/>

```

Voice recognition depends on browser Web Speech API support.

---

## Icon library

7 custom SVG icons. Zero external dependency. All seven remain part of the public package API.

```tsx

import {

  SearchIcon,

  SortUpIcon,

  SortDownIcon,

  ChevronLeftIcon,

  ChevronRightIcon,

  CheckIcon,

  CloseIcon,

} from "@yuktishaalaa/yuktai";

<SearchIcon        size={20} />

<SortUpIcon        size={20} color="#0D9488" />

<CheckIcon         size={20} color="#10b981" label="Task complete" />

<CloseIcon         size={20} color="#dc2626" />

<ChevronLeftIcon   size={24} label="Previous" />

<ChevronRightIcon  size={24} label="Next" />

```

Props: `size` (default 20), `color` (default `currentColor`), `strokeWidth` (default 2.5), `label` (adds ARIA — decorative if omitted).

---

## Gemini Nano (Chrome 147+)

- Plain-English mode — rewrites complex text

- Summarise page — 3-sentence summary

- Smart ARIA labels — AI generates labels

- Translate page — 18 languages

- Chrome 147+ standalone globals (`window.LanguageModel`)

- Fallback to old `window.ai` namespace

Chrome 147 silently removed `window.ai` and moved everything to standalone globals. Debugged for an evening before finding it in the release notes.

---

## Technical (17 features)

Zero API keys · Zero cost · Zero telemetry · Works on all browsers · Works on mobile (Android + iOS) · Works offline after first load · PWA compatible · Next.js 16 compatible · React 19 compatible · TypeScript throughout · SSR safe (no window errors) · Escape closes all panels · Each panel closes others · `data-yuktai-panel` — never reads own UI · Three stacked FAB buttons · Mobile full-screen panels · Tablet responsive · `showRag`, `showAgent`, `position` props.

---

## Configuration

```ts

import { wcagPlugin, A11yConfig } from "@yuktishaalaa/yuktai";

const config: A11yConfig = {

  enabled:             true,   // required

  highContrast:        false,

  darkMode:            false,

  reduceMotion:        false,

  largeTargets:        false,

  speechEnabled:       false,

  colorBlindMode:      "none", // none | deuteranopia | protanopia | tritanopia | achromatopsia

  autoFix:             true,

  showPreferencePanel: true,

  showSkipLinks:       true,

  showAuditBadge:      false,  // dev only (localhost)

  fontSizeMultiplier:  1,

  timeoutWarning:      0,      // seconds (0 = off)

};

await wcagPlugin.execute(config);

```

---

## WCAG coverage

| Standard | Criteria covered |

|---|---|

| WCAG 2.0 | 19 criteria |

| WCAG 2.1 | 7 criteria |

| WCAG 2.2 | 3 criteria (focus appearance, target size, timeout) |

| Beyond WCAG | SpeechSynthesis, visual alerts, keyboard cheatsheet, audit score, colour-blind modes, dyslexia font |

---

## Design principles

- **Zero id attributes** — no injected node ever gets an `id`. Tracked via module-level JavaScript references. Never collides with host app ids.

- **Zero API keys** — runs entirely in the browser. No external calls, no telemetry, no cost.

- **Zero framework lock-in** — `core/renderer.ts` has no framework imports. Works in Node.js, browsers, and test environments.

- **Honest limits** — client-side grid pagination works for a few thousand rows. Beyond that, use server-side pagination (pattern shown above).

---

## Compatibility

### Next.js versions

| Version | Supported |

|---|---|

| Next.js 16 | ✅ |

| Next.js 15 | ✅ |

| Next.js 14 | ✅ |

| Next.js 13 | ✅ |

### React versions

| Version | Supported | Install flag |

|---|---|---|

| React 19 | ✅ | `--legacy-peer-deps` |

| React 18 | ✅ | none |

| React 17 | ✅ | none |

### Browsers

Chrome 90+ · Firefox 90+ · Safari 15+ · Edge 90+ · Samsung Internet 14+

---

## Roadmap

Shipped: v4.6.4 — YuktaiGrid Agentic AI + WebMCP integration, embedded Grid AI Assistant, English/Telugu Grid UI, functional page-size switching, and Grid icon polish.

Next: expand Grid Agent tools and WebMCP capabilities.

Long term: richer browser-native AI and multimodal Grid experiences.

---

## Links

- npm — [@yuktishaalaa/yuktai](https://www.npmjs.com/package/@yuktishaalaa/yuktai)

- GitHub — [sandeepmiriyala03/yuktai](https://github.com/sandeepmiriyala03/yuktai)

- Live demo — [aksharatantra.vercel.app](https://aksharatantra.vercel.app)

---

## License

ISC © Sandeep Miriyala — [Yuktishaalaa AI Lab](https://github.com/sandeepmiriyala03)

Built in free time. With help from Claude, GPT, and Gemini for learning — but every line written, every bug fixed, every decision made by me.

Free forever. Open source.