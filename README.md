# YuktAI Grid — Developer Learning & Integration Guide

> Full documentation based on the supplied README.md plus the Ratnalabala integration work and current WebMCP verification.


# YuktAI Grid — Developer Learning & Integration Guide

## Live Ratnalabala Example

**Live URL:** https://ratnalabala.vercel.app/poems?view=grid

This section documents the practical Ratnalabala integration built around YuktAI Grid. The supplied live URL is the target live example. The web retrieval layer could not directly fetch that deployed page during this documentation pass, so runtime observations are based on the implementation/source work in this conversation rather than a fresh crawl of the deployed page.

### Complete architecture

```text
                    USER
                      │
                      ▼
              Natural-language query
                      │
             ┌────────┴────────┐
             ▼                 ▼
        YuktAI Agent        WebMCP
             │                 │
             └────────┬────────┘
                      ▼
                Grid Tool Layer
                      │
                      ▼
                 YuktAI Grid
                      │
                      ▼
                Ratnalabala UI
                      │
                      ▼
              Next.js API Proxy
                      │
                      ▼
                 FastAPI/Python
                      │
                      ▼
                  PostgreSQL
```

### Ratnalabala technology stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js | Application, routing and UI |
| UI | React + TypeScript | Typed interactive components |
| UI components | MUI / Material UI | Layout, buttons, toggles, cards and controls |
| Grid | `@yuktishaalaa/yuktai` | Accessible Grid + Agent + WebMCP |
| Icons | YuktAI SVG icons | Search, sorting, pagination/status |
| Backend | Python / FastAPI-style API | Poem retrieval |
| Database | PostgreSQL | Poems, poets and audit data |
| Database hosting | Neon | PostgreSQL hosting |
| Hosting | Vercel | Next.js deployment |
| Voice | Web Speech API + SpeechSynthesis | Telugu voice input/output |
| Agent | YuktAI Grid Agent + custom rules | Natural-language actions |
| Browser tool layer | WebMCP | Structured browser-agent interaction |

> This table describes the Ratnalabala implementation discussed in this project. It is separate from the package-wide README feature inventory.

## Ratnalabala data flow

```text
PostgreSQL
 ├── poems
 ├── poets
 └── poems_audit
        │
        ▼
Python API
  endpoint=poems&poet_id=1
        │
        ▼
Next.js /api/getpoems
        │
        ▼
Ratnalabala page
        │
        ├── పద్యాలు
        └── యుక్తి AI
                │
                ▼
           YuktAI Grid
          ┌─────┴─────┐
          ▼           ▼
        Agent       WebMCP
```

## Ratnalabala Grid row model

```tsx
type PoemRow = {
  id: string;
  title: string;
  content: string;
  specialLine: string;
  makutam: string;
};
```

The page maps API poems into Grid rows. `specialLine` and `makutam` are derived from poem content so Agent rules can work with domain-specific information.

## Ratnalabala Grid configuration

```tsx
<YuktaiGrid<PoemRow>
  data={rows}
  columns={COLUMNS}
  rowKey="id"
  view="table"
  mobileBreakpoint={768}
  theme={theme}
  locale="te-IN"
  inputLanguage="te-IN"
  customRules={POEM_RULES}
  search
  pagination={{
    pageSize: 20,
    showSizeChanger: true,
    sizeOptions: [10, 20, 36],
  }}
  loading={loading}
  highlightIds={highlightIds}
  autoScrollToHighlight
  onRowClick={(row) => onOpenPoem(row.title)}
  ai
  webmcp
  toolName="ratnalabala_poems"
  toolDescriptions={TOOL_DESCRIPTIONS}
  onWebMCPStatusChange={setWebmcp}
/>
```

## Ratnalabala Grid columns

```tsx
const COLUMNS: GridColumn<PoemRow>[] = [
  { key: "title", label: "పద్యం పేరు", width: "24%" },
  {
    key: "content",
    label: "పద్యం",
    sortable: false,
  },
  {
    key: "specialLine",
    label: "ప్రత్యేక పంక్తి",
    width: "30%",
    sortable: false,
  },
];
```

## Ratnalabala Agent rules

The reusable package provides generic Grid operations. Ratnalabala adds application-specific rules.

| Rule | Example |
|---|---|
| help | `సహాయం` |
| makutam | `మకుటం ఏమిటి` |
| special-line | `గర్వం ప్రత్యేక పంక్తి` |
| first-line | `గర్వం మొదటి పంక్తి` |
| starts-with-letter | `క తో మొదలయ్యే పద్యాలు` |
| word-in-poems | `"బుద్ధి" ఉన్న పద్యాలు` |
| poem-of-the-day | `ఈరోజు పద్యం` |
| random-poem | `ఏదైనా పద్యం` |
| count-poems | `ఎన్ని పద్యాలు` |
| list-titles | `పద్యాల పేర్లు` |
| poem-details | `గర్వం వివరాలు` |
| alphabetical | `అక్షర క్రమంలో` |
| open-poem | `గర్వం తెరువు` |

The architectural principle is:

```text
Generic YuktAI tools
        +
Ratnalabala domain rules
        =
Application Agent
```

## Generic Grid tools

```text
search
count
columns
get_row
highlight
select
open
filter
clear_filters
sort
clear_sort
```

These are reusable. They should not contain Ratnalabala-specific knowledge.

## Agent examples

### Count

User:

```text
ఎన్ని పద్యాలు
```

Agent:

```text
count
```

Result:

```text
మొత్తం 36 పద్యాలు ఉన్నాయి.
```

### Open

User:

```text
గర్వం తెరువు
```

Agent:

```text
open
```

The application opens the matching poem.

### Word search

User:

```text
"బుద్ధి" ఉన్న పద్యాలు
```

Agent:

```text
search/filter
```

Matching poems are highlighted.

### Alphabetical sorting

User:

```text
అక్షర క్రమంలో
```

Agent:

```text
sort(title, asc)
```

### Daily poem

User:

```text
ఈరోజు పద్యం
```

The application chooses the daily poem and highlights it.

## Why Ratnalabala is an important live example

Ratnalabala demonstrates that an Agentic Grid is not just a chatbot placed beside a table.

The user can express intent in Telugu:

```text
"గర్వం తెరువు"
```

and the application can execute a Grid operation.

This gives:

```text
Natural language
       ↓
Intent
       ↓
Tool
       ↓
Grid action
       ↓
Visible UI change
```

That is the core Agentic UI pattern.

## Telugu language architecture

The Ratnalabala Grid is configured with:

```tsx
locale="te-IN"
inputLanguage="te-IN"
```

The page is intentionally Telugu-first.

The current `YuktaiGridAI` implementation renders its language selector internally. During today's debugging, `showInputLanguage={false}` was found not to be a supported prop in the current component API. Therefore the correct way to hide the selector is to change the actual component implementation, while keeping:

```tsx
inputLanguage="te-IN"
```

This preserves Telugu voice recognition while removing unnecessary language-selection UI.

## Ratnalabala UI views

The current page uses a two-view concept:

```tsx
<ToggleButton value="cards">
  పద్యాలు
</ToggleButton>

<ToggleButton value="grid">
  యుక్తి AI
</ToggleButton>
```

The intent is:

- **పద్యాలు** — traditional poem/card reading experience.
- **యుక్తి AI** — Agentic YuktAI Grid experience.

## Ratnalabala backend stack

The project flow is:

```text
PostgreSQL
   ↓
Python API
   ↓
Next.js API route
   ↓
React page
   ↓
YuktAI Grid
```

The database model includes poems, poets and audit information. The poem API returns structured records such as:

```json
[
  {
    "poem_id": 1,
    "title": "గర్వం",
    "content": "...",
    "special_line": "...",
    "poet_id": 1,
    "poet_name": "..."
  }
]
```

The Grid then maps the API representation into its own row representation.

## WebMCP in Ratnalabala

The Grid enables:

```tsx
webmcp
```

and supplies:

```tsx
toolName="ratnalabala_poems"
toolDescriptions={TOOL_DESCRIPTIONS}
```

The tool layer exposes meaningful operations instead of requiring an external agent to infer UI behavior from DOM structure.

Chrome's current WebMCP documentation describes the Imperative API through:

```js
document.modelContext.registerTool(...)
```

with:

- tool name
- description
- input schema
- execute function

Chrome also recommends clear action-oriented tool names, useful descriptions, avoiding excessive/overlapping tools, and managing registration based on page state.

## WebMCP status handling

The Ratnalabala implementation handles:

```text
unsupported
registering
ready
partial
error
```

This is important because WebMCP availability should not be assumed.

## YuktAI icons in Ratnalabala

The package provides seven custom SVG icons:

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
```

Ratnalabala uses package icons where they fit the Grid UI, avoiding another icon dependency for Grid controls.

## NPM installation

### Next.js 16 + React 19

```bash
npm install @yuktishaalaa/yuktai --legacy-peer-deps
```

### Next.js 13 / 14 / 15

```bash
npm install @yuktishaalaa/yuktai
```

### Yarn

```bash
yarn add @yuktishaalaa/yuktai
```

### pnpm

```bash
pnpm add @yuktishaalaa/yuktai
```

The supplied README states:

- Node.js 18+
- npm 8+
- Next.js 13+

The public npm page currently reports version 4.6.4.

## Next.js configuration

```js
const nextConfig = {
  transpilePackages: ["@yuktishaalaa/yuktai"],
};

module.exports = nextConfig;
```

## Basic Grid example

```tsx
"use client";

import { YuktaiGrid } from "@yuktishaalaa/yuktai";

const data = [
  { id: 1, name: "Sandeep", role: "Developer", salary: 85000 },
  { id: 2, name: "Priya", role: "Designer", salary: 90000 },
];

export default function EmployeesPage() {
  return (
    <YuktaiGrid
      data={data}
      columns={[
        { key: "name", label: "Name", sortable: true },
        { key: "role", label: "Role" },
        {
          key: "salary",
          label: "Salary",
          type: "number",
          align: "right",
        },
      ]}
      theme="default"
      locale="en-US"
      search
      ai
      view="auto"
      pagination={{ pageSize: 20 }}
    />
  );
}
```

## Large-data architecture

For a few thousand rows, client-side pagination is practical.

For 100K, 200K or 300K rows:

```text
Database
   ↓
API
   ↓
Next.js proxy
   ↓
Server-side filtering/pagination
   ↓
YuktAI Grid
```

Disable built-in client pagination/search when those operations are implemented on the server:

```tsx
<YuktaiGrid
  data={apiResp?.rows ?? []}
  columns={columns}
  search={false}
  pagination={false}
  loading={!apiResp}
/>
```

## Production architecture

```text
                    USER
                      │
                      ▼
               Next.js / React
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
    YuktAI Grid              API Proxy
    ├── Agent                    │
    └── WebMCP                   ▼
                            FastAPI/Python
                                  │
                                  ▼
                              PostgreSQL
```

## Today's learning and debugging lessons

1. Verify the actual installed component API before adding props.
2. `showInputLanguage={false}` was not part of the current YuktaiGridAI API.
3. Keep application-specific rules in the consuming application.
4. Keep generic Grid tools reusable.
5. Agent actions should affect UI state, not only return text.
6. WebMCP should degrade gracefully when unsupported.
7. Use YuktAI's own icons where appropriate.
8. Client-side pagination is not a substitute for server-side pagination at enterprise scale.
9. Separate API/database models from Grid/Agent row models.
10. Use clear tool descriptions because agents need to know when each operation should be used.

## Developer learning path

### Phase 1 — Grid

```text
data
 ↓
columns
 ↓
rowKey
 ↓
search
 ↓
sort
 ↓
pagination
 ↓
themes
 ↓
mobile
```

### Phase 2 — Tools

```text
tool name
 ↓
description
 ↓
input
 ↓
execute
 ↓
result
```

### Phase 3 — Agent

```text
user request
 ↓
intent
 ↓
tool selection
 ↓
execution
 ↓
UI state
```

### Phase 4 — Domain rules

```text
Generic YuktAI tools
+
Ratnalabala rules
```

### Phase 5 — WebMCP

```text
modelContext
 ↓
registerTool
 ↓
inputSchema
 ↓
execute
```

### Phase 6 — Production

```text
Authentication
Authorization
Tool security
Audit
Observability
Testing
Server-side data
```

## Open-source documentation

Repository:

https://github.com/sandeepmiriyala03/yuktai

NPM:

https://www.npmjs.com/package/@yuktishaalaa/yuktai

License:

```text
ISC © Sandeep Miriyala — Yuktishaalaa AI Lab
```

The supplied README describes the project as open source and says it was built in free time, with Claude, GPT and Gemini used as learning assistance while the implementation decisions and code were made by the author.

## Final architecture summary

```text
                 RATNALABALA
                      │
                      ▼
               PostgreSQL
                      │
                      ▼
                FastAPI/Python
                      │
                      ▼
                Next.js Proxy
                      │
                      ▼
              Ratnalabala UI
                 │        │
                 │        └── WebMCP
                 │
                 └──────────── YuktAI Grid
                                  │
                         ┌────────┴────────┐
                         ▼                 ▼
                       Agent            Tools
                         │                 │
                         └────────┬────────┘
                                  ▼
                              Grid State
```

**YuktAI Grid = UI + tool surface**  
**Agent = decision/action layer**  
**WebMCP = browser-agent communication layer**  
**Ratnalabala = real Telugu application demonstrating the complete architecture**

## Source and verification notes

Primary package source: the complete README.md supplied with this request.

The README states v4.6.4 as the release containing YuktaiGrid Agentic AI + WebMCP, embedded Grid AI Assistant, English/Telugu UI, functional page-size switching and Grid icon polish.

Public npm verification was performed during this documentation pass and reports `@yuktishaalaa/yuktai` v4.6.4.

Chrome WebMCP documentation was checked for the Imperative API, registered-tool guidance, best practices and security hints.

The Ratnalabala live URL is included as the requested real-world example. The deployment itself could not be fetched by the web retrieval layer during this pass, so no unsupported claims about its current runtime appearance are made.

---

# Appendix — Complete README feature inventory

The remainder of this document is the supplied README's feature inventory reorganized for developer reference:

### Accessibility Engine

- WCAG 2.2 auto-fix
- Speak on focus
- Voice control
- High contrast
- Dark mode
- Reduce motion
- Large targets
- Colour-blind modes
- Dyslexia font
- Font picker
- Font scaling
- Audit badge
- Skip links
- Focus trap
- Preference persistence
- Reset

### YuktaiGrid

- Search
- Sort
- Pagination
- Page-size switching
- Mobile card view
- Loading state
- Empty state
- Five WCAG themes
- Row selection
- Custom render
- rowKey
- Highlighting
- Auto-scroll to highlighted rows
- Keyboard navigation
- ARIA grid semantics
- 44×44 targets
- English/Telugu UI
- Inline SVG icons
- Embedded AI Assistant

### In-Tab RAG

- Ask questions about any page
- Gemini Nano desktop path
- Transformers.js mobile path
- Automatic engine selection
- Offline after first load
- q4 quantization
- flan-t5-small
- Cosine similarity
- DOM text extraction/deduplication

### Autonomous Agent

- Plain-English goals
- DOM traversal
- Form-field scanning
- Multiple label strategies
- Static/React/WordPress/legacy portal support
- Gemini Nano planning
- Transformers.js mobile path
- Rule fallback
- Target highlighting
- Section scrolling
- Numbered plans
- iframe handling

### Vibe Coder

- Website-type detection
- Page detection
- Feature detection
- Theme detection
- Site-name extraction
- Preview
- Next.js 16 generation
- Tailwind + CSS Modules
- TypeScript
- Responsive layouts
- Common site pages
- ZIP download
- Template-based generation

### Technical principles

- Zero API keys
- Zero cost positioning
- Zero telemetry
- Browser/mobile support
- Offline capability where applicable
- PWA compatibility
- Next.js 16
- React 19
- TypeScript
- SSR-safe design
- Panel coordination
- `data-yuktai-panel`
- Responsive UI
- `showRag`
- `showAgent`
- `position`

### Compatibility

- Next.js 13
- Next.js 14
- Next.js 15
- Next.js 16
- React 17
- React 18
- React 19
- Node.js 18+
- npm 8+
- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+
- Samsung Internet 14+

### Project links

- NPM: https://www.npmjs.com/package/@yuktishaalaa/yuktai
- GitHub: https://github.com/sandeepmiriyala03/yuktai
- Live demo mentioned in README: https://aksharatantra.vercel.app
- Ratnalabala live example requested for this guide: https://ratnalabala.vercel.app/poems?view=grid

### License

ISC © Sandeep Miriyala — Yuktishaalaa AI Lab.


---

# Appendix B — Supplied README.md (source copy)

**# @yuktishaalaa/yuktai**

\> Universal Next.js plugin for accessibility, AI, and data. One install brings WCAG 2.2 auto-fix, in-browser RAG, an AI agent, code generation, and an accessible data grid with Agentic AI + WebMCP — zero API keys, zero cost, works offline.

[![npm]\(https\://img.shields.io/npm/v/@yuktishaalaa/yuktai)]\(https\://www\.npmjs.com/package/@yuktishaalaa/yuktai)

[![downloads]\(https\://img.shields.io/npm/dm/@yuktishaalaa/yuktai)]\(https\://www\.npmjs.com/package/@yuktishaalaa/yuktai)

[![license]\(https\://img.shields.io/badge/license-ISC-brightgreen)]\(./LICENSE)

[![node]\(https\://img.shields.io/badge/node-%3E%3D18-blue)]\(https\://nodejs.org)

[![Next.js]\(https\://img.shields.io/badge/Next.js-16%2B-black)]\(https\://nextjs.org)

**\*\*7,000+ developers\*\*** already installed yuktai. Built entirely in free time by [Sandeep Miriyala]\(https\://github.com/sandeepmiriyala03) with help from Claude, GPT, and Gemini.

Live demo → [https\://aksharatantra.miriyala.in/staffdirectory]\(https\://aksharatantra.miriyala.in/staffdirectory)

**---**

**## The story**

I have been building web apps since 2013. In all those years the same things kept breaking on almost every website I touched. Missing ARIA labels. No keyboard navigation. Forms that senior citizens couldn't figure out. Data grids that broke on mobile. Accessibility tools that cost money. AI tools that needed API keys.

I wanted something without any of those barriers.

Free. Open source. One install. Works on every device. No account. No key. No server.

So I built yuktai — one weekend and one late-night at a time. This README is the map of everything that shipped.

**---**

**## What's inside**

Five modules ship in the single npm package:

\| Module | Features | What it does |

\|---|---|---|

\| **\*\*1. Accessibility Engine\*\*** | 16 | WCAG 2.2 auto-fix, speak on focus, colour-blind modes, dyslexia font, skip links |

\| **\*\*2. YuktaiGrid\*\*** ⭐ NEW | 12 | Accessible data grid with 5 WCAG themes, search, sort, pagination, mobile card view |

\| **\*\*3. In-Tab RAG\*\*** | 11 | Ask questions about any page — offline, no API |

\| **\*\*4. Autonomous AI Agent\*\*** | 13 | Natural-language browser automation |

\| **\*\*5. Vibe Coder\*\*** | 19 | Generate full Next.js projects from plain English |

Plus Grid Assistant capabilities, Grid Agent tools, WebMCP integration, 7 custom SVG icons, and a voice + chat assistant.

**---**

**## What's new**

**### v4.6.4 — YuktaiGrid Agentic AI + WebMCP**

YuktaiGrid now brings Grid UI, Grid AI Assistant, reusable Grid Tools, Agent execution, and WebMCP registration together.

\- Shared Grid Tools for Agent and WebMCP execution

\- Search grid rows

\- Count grid rows

\- Get grid columns

\- Get a row by ID

\- Highlight rows

\- Select a row

\- Open a row

\- WebMCP registration through document.modelContext

\- useYuktaiGridAgent for programmatic Grid tool execution

\- Embedded Grid AI Assistant inside YuktaiGrid

\- English and Telugu AI UI

\- English voice input by default with Telugu voice-input support

\- language, inputLanguage, and embedded AI options

\- Functional page-size switching such as 10 → 20 → 50 → 100

\- Inline SVG Grid icons with no external icon dependency

\- Public seven-icon package API

Architecture: User → Agent → WebMCP → YuktaiGrid → Data

**### v4.6.3**

Previous published release before the v4.6.4 Grid fixes and polish.

**---**

**## Install**

**### Next.js 16 + React 19 (recommended)**

\`\`\`bash

npm install @yuktishaalaa/yuktai --legacy-peer-deps

\`\`\`

**### Older Next.js (13, 14, 15)**

\`\`\`bash

npm install @yuktishaalaa/yuktai

\`\`\`

Requirements: Node.js 18+, npm 8+, Next.js 13+.

**---**

**## Quick start**

**### Step 1 — \`next.config.js\`**

\`\`\`js

const nextConfig = {

  transpilePackages: ["@yuktishaalaa/yuktai"],

};

module.exports = nextConfig;

\`\`\`

**### Step 2 — Client wrapper**

\`\`\`tsx

// components/YuktaiClient.tsx

"use client";

import { useState, useEffect, type ReactNode } from "react";

import { YuktAIWrapper } from "@yuktishaalaa/yuktai";

export default function YuktaiClient({ children }: { children: ReactNode }) {

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <>{children}\</>;

  return (

    \<YuktAIWrapper position="left">

      {children}

    \</YuktAIWrapper>

  );

}

\`\`\`

**### Step 3 — \`app/layout.tsx\`**

\`\`\`tsx

import YuktaiClient from "@/components/YuktaiClient";

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (

    \<html lang="en">

      \<body>

        \<YuktaiClient>

          \<main>{children}\</main>

        \</YuktaiClient>

      \</body>

    \</html>

  );

}

\`\`\`

That's it. Three AI-powered buttons appear on every page. Click the ♿ button bottom-right to open the accessibility panel.

**---**

**## Module 1 — Accessibility Engine**

Scans every element and injects missing accessibility attributes automatically.

Covers: headings, images, forms, tables, lists, landmarks, ARIA widgets. Watches for new DOM elements via \`MutationObserver\`.

**### Features (16)**

\- WCAG 2.2 auto-fix — ARIA, roles, tabindex, scope, autocomplete

\- Speak on focus — browser speech synthesis

\- Voice control — say commands to navigate

\- High contrast · Dark mode · Reduce motion · Large targets (44×44)

\- Colour-blind modes — Deuteranopia, Protanopia, Tritanopia, Greyscale

\- Dyslexia font — Atkinson Hyperlegible (research-backed)

\- Local font picker, font scaling 80–130%

\- Audit badge — WCAG score 0–100 (localhost only)

\- Skip links, focus trap, preference persistence, reset

**### Direct API**

\`\`\`ts

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

\`\`\`

**---**

**## Module 2 — YuktaiGrid ⭐**

An accessible data grid built for Next.js. Handles small tables and large datasets. Works with any API. Ships with the 5 accessibility themes.

**### Usage**

\`\`\`tsx

"use client";

import { YuktaiGrid } from "@yuktishaalaa/yuktai";

const data = [

{ id: 1, name: "Sandeep", role: "Developer", salary: 85000 },

{ id: 2, name: "Priya", role: "Designer", salary: 90000 },

];

export default function EmployeesPage() {

return (

\\\<YuktaiGrid

  data={data}

  columns={[

    { key: "name", label: "Name", sortable: true },

    { key: "role", label: "Role" },

    { key: "salary", label: "Salary", type: "number", align: "right" },

  ]}

  theme="default"                         // default | high-contrast | dark | color-blind | dyslexia

  locale="en-US"                          // en-US | te-IN

  search={true}                           // real-time filtering

  ai={true}                               // embedded Grid AI Assistant

  view="auto"                             // auto | table | card

  pagination={{

    pageSize: 20,

    showSizeChanger: true,

    sizeOptions: [10, 20, 50, 100],

  }}

/>

);

}

\`\`\`

**### Grid features**

\- Search bar with inline SVG icon

\- Sort — click a column header to toggle ascending / descending

\- Functional client-side pagination

\- Configurable page-size switching such as 10, 20, 50, 100

\- Mobile card view below the configured breakpoint

\- Loading and empty states

\- 5 WCAG themes

\- Row selection, custom render, and rowKey

\- Row highlighting and optional auto-scroll to highlighted rows

\- Embedded Grid AI Assistant

\- English and Telugu Grid UI

\- Inline SVG search, sort, selection, and pagination icons

\- No external icon dependency

**### Handling large datasets (100K, 200K, 300K rows)**

**\*\*Client-side pagination handles a few thousand rows well.\*\*** For anything larger, use **\*\*server-side pagination\*\*** — fetch only the page you need.

Here's the pattern with a Next.js API proxy that also solves CORS.

**\*\*\`src/app/api/employees/route.ts\`\*\*** — the proxy:

\`\`\`ts

import { NextRequest, NextResponse } from "next/server";

let cachedData: any[] | null = null;

let cacheTime = 0;

const TTL_MS = 60_000;

async function fetchAll(): Promise\<any[]> {

  const now = Date.now();

  if (cachedData && now - cacheTime < TTL_MS) return cachedData;

  const res  = await fetch("https\://your-api.com/employees", { cache: "no-store" });

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

  const rows  = filtered.slice((page - 1) \* pageSize, page \* pageSize);

  return NextResponse.json({

    rows,

    pagination: { page, pageSize, totalRows: total, totalPages: Math.ceil(total / pageSize) },

  });

}

\`\`\`

**\*\*Page — call the paginated API and disable the grid's built-in pagination:\*\***

\`\`\`tsx

const [apiResp, setApiResp]     = useState\<any>(null);

const [currentPage, setPage]    = useState(1);

useEffect(() => {

  fetch(\`/api/employees?page=${currentPage}&pageSize=5000\`)

    .then(r => r.json())

    .then(setApiResp);

}, [currentPage]);

\<YuktaiGrid

  data={apiResp?.rows ?? []}

  columns={columns}

  search={false}         // disable — we handle search server-side

  pagination={false}     // disable — we handle pagination server-side

  loading={!apiResp}

/>

\`\`\`

Then render your own pagination bar backed by \`apiResp.pagination\`. This pattern works for 100K, 200K, 300K rows — the browser only ever holds 5,000 rows in memory.

**---**

**---**

**## Grid Agentic AI + WebMCP**

YuktaiGrid exposes reusable Grid operations so an Agent can work with grid data through a shared tool layer and WebMCP.

**### Grid tools**

\`\`\`ts

import {

searchGrid,

countGrid,

getColumns,

getRow,

highlightRows,

selectRow,

openRow,

} from "@yuktishaalaa/yuktai";

\`\`\`

These operations form the common execution layer for programmatic Agent tools and WebMCP.

**### Agent execution**

\`\`\`tsx

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

\`\`\`

**### WebMCP**

\`\`\`tsx

import {

YuktaiGridWebMCP,

} from "@yuktishaalaa/yuktai";

\<YuktaiGridWebMCP

data={data}

columns={columns}

/>

\`\`\`

WebMCP registration is invisible in the UI and uses document.modelContext when available.

**### Embedded Grid AI Assistant**

\`\`\`tsx

\<YuktaiGrid

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

\`\`\`

Grid AI supports:

\- language="en-US" or language="te-IN" for AI UI and responses

\- inputLanguage="en-US" or inputLanguage="te-IN" for voice input

\- embedded mode for rendering AI inside the Grid

\- Local intent parsing for search, sort, count, highest, lowest, average, total, and lookup

**---**

**## Module 3 — In-Tab RAG (Ask This Page)**

Retrieval-Augmented Generation running entirely in the browser. Extracts semantic chunks from the current DOM, embeds them, finds the best match for the user's question, and answers — offline, no API key.

**### Features (11)**

\- Ask any question about any page

\- Gemini Nano on desktop Chrome — zero download, zero API

\- Transformers.js on mobile — 30 MB one-time model load

\- Auto engine detection and switching

\- Works offline after first load

\- q4 quantization on mobile (32-bit → 4-bit weights)

\- \`flan-t5-small\` for full-sentence answers

\- Cosine similarity semantic search

\- Deduped DOM text extraction

**### What I learned**

The hardest part was mobile. Transformers.js kept crashing on iOS Safari with out-of-memory errors. Learning about quantization — same model, 75% smaller — fixed it. DistilBERT gives short useless spans; flan-t5-small gives real sentences. None of that was in any tutorial. Found on a Saturday by breaking things until something worked.

**---**

**## Module 4 — Autonomous AI Agent**

User types a goal in plain English. Yuktai reads the DOM, finds the right elements, plans steps, and highlights what to do.

**### Features (13)**

\- Plain-English goal input

\- Reads full page DOM — 9 traversal strategies

\- Scans all form fields — 11 label strategies

\- Works on static HTML, React, WordPress, and old government portals

\- Gemini Nano planning on desktop, Transformers.js on mobile

\- Rule-based fallback if AI fails

\- Highlights target field with teal outline

\- Scrolls to relevant section by keyword

\- Numbered step-by-step plan

\- Handles iframes

The 11 label strategies came from real websites — old government portals put labels in the previous table cell, modern apps use \`aria-label\`, static pages use \`placeholder\`. Every strategy solved a problem I had actually hit.

**---**

**## Module 5 — Vibe Coder**

Type a business requirement. Yuktai generates a full Next.js 16 project as a downloadable ZIP.

**### Features (19)**

\- Detects website type (12 types), pages needed (21 types), features (14 types)

\- Detects theme colour (8), extracts site name

\- Preview before generating

\- Full Next.js 16 project — Tailwind + CSS Modules, TypeScript, mobile responsive

\- Navbar, Footer, Home, About, Contact, Services, Pricing, Auth, Dashboard pages

\- Downloads as ZIP · \`npm run dev\` works immediately

\- Pure templates — no AI writes the code

No AI writes a single line. Pure template engineering. Same reusable-utility thinking from 2013 jQuery — now generating entire Next.js projects.

**---**

**## Grid AI Assistant — Voice + Chat**

The Grid AI Assistant can run embedded inside YuktaiGrid or as a standalone component.

Voice input uses the browser Web Speech API. AI responses can be spoken with SpeechSynthesis. Intent parsing runs locally for the supported Grid operations.

Supports:

\- Search

\- Sort

\- Count

\- Highest / maximum

\- Lowest / minimum

\- Average

\- Total

\- Row lookup

\- English and Telugu AI UI

\- English voice input by default

\- Telugu voice input with inputLanguage="te-IN"

Example:

\`\`\`tsx

\<YuktaiGridAI

data={data}

columns={columns}

onSearch={handleSearch}

onSort={handleSort}

language="te-IN"

inputLanguage="en-US"

embedded

/>

\`\`\`

Voice recognition depends on browser Web Speech API support.

**---**

**## Icon library**

7 custom SVG icons. Zero external dependency. All seven remain part of the public package API.

\`\`\`tsx

import {

  SearchIcon,

  SortUpIcon,

  SortDownIcon,

  ChevronLeftIcon,

  ChevronRightIcon,

  CheckIcon,

  CloseIcon,

} from "@yuktishaalaa/yuktai";

\<SearchIcon        size={20} />

\<SortUpIcon        size={20} color="#0D9488" />

\<CheckIcon         size={20} color="#10b981" label="Task complete" />

\<CloseIcon         size={20} color="#dc2626" />

\<ChevronLeftIcon   size={24} label="Previous" />

\<ChevronRightIcon  size={24} label="Next" />

\`\`\`

Props: \`size\` (default 20), \`color\` (default \`currentColor\`), \`strokeWidth\` (default 2.5), \`label\` (adds ARIA — decorative if omitted).

**---**

**## Gemini Nano (Chrome 147+)**

\- Plain-English mode — rewrites complex text

\- Summarise page — 3-sentence summary

\- Smart ARIA labels — AI generates labels

\- Translate page — 18 languages

\- Chrome 147+ standalone globals (\`window\.LanguageModel\`)

\- Fallback to old \`window\.ai\` namespace

Chrome 147 silently removed \`window\.ai\` and moved everything to standalone globals. Debugged for an evening before finding it in the release notes.

**---**

**## Technical (17 features)**

Zero API keys · Zero cost · Zero telemetry · Works on all browsers · Works on mobile (Android + iOS) · Works offline after first load · PWA compatible · Next.js 16 compatible · React 19 compatible · TypeScript throughout · SSR safe (no window errors) · Escape closes all panels · Each panel closes others · \`data-yuktai-panel\` — never reads own UI · Three stacked FAB buttons · Mobile full-screen panels · Tablet responsive · \`showRag\`, \`showAgent\`, \`position\` props.

**---**

**## Configuration**

\`\`\`ts

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

\`\`\`

**---**

**## WCAG coverage**

\| Standard | Criteria covered |

\|---|---|

\| WCAG 2.0 | 19 criteria |

\| WCAG 2.1 | 7 criteria |

\| WCAG 2.2 | 3 criteria (focus appearance, target size, timeout) |

\| Beyond WCAG | SpeechSynthesis, visual alerts, keyboard cheatsheet, audit score, colour-blind modes, dyslexia font |

**---**

**## Design principles**

\- **\*\*Zero id attributes\*\*** — no injected node ever gets an \`id\`. Tracked via module-level JavaScript references. Never collides with host app ids.

\- **\*\*Zero API keys\*\*** — runs entirely in the browser. No external calls, no telemetry, no cost.

\- **\*\*Zero framework lock-in\*\*** — \`core/renderer.ts\` has no framework imports. Works in Node.js, browsers, and test environments.

\- **\*\*Honest limits\*\*** — client-side grid pagination works for a few thousand rows. Beyond that, use server-side pagination (pattern shown above).

**---**

**## Compatibility**

**### Next.js versions**

\| Version | Supported |

\|---|---|

\| Next.js 16 | ✅ |

\| Next.js 15 | ✅ |

\| Next.js 14 | ✅ |

\| Next.js 13 | ✅ |

**### React versions**

\| Version | Supported | Install flag |

\|---|---|---|

\| React 19 | ✅ | \`--legacy-peer-deps\` |

\| React 18 | ✅ | none |

\| React 17 | ✅ | none |

**### Browsers**

Chrome 90+ · Firefox 90+ · Safari 15+ · Edge 90+ · Samsung Internet 14+

**---**

**## Roadmap**

Shipped: v4.6.4 — YuktaiGrid Agentic AI + WebMCP integration, embedded Grid AI Assistant, English/Telugu Grid UI, functional page-size switching, and Grid icon polish.

Next: expand Grid Agent tools and WebMCP capabilities.

Long term: richer browser-native AI and multimodal Grid experiences.

**---**

**## Links**

\- npm — [@yuktishaalaa/yuktai]\(https\://www\.npmjs.com/package/@yuktishaalaa/yuktai)

\- GitHub — [sandeepmiriyala03/yuktai]\(https\://github.com/sandeepmiriyala03/yuktai)

\- Live demo — [aksharatantra.vercel.app]\(https\://aksharatantra.vercel.app)

**---**

**## License**

ISC © Sandeep Miriyala — [Yuktishaalaa AI Lab]\(https\://github.com/sandeepmiriyala03)

Built in free time. With help from Claude, GPT, and Gemini for learning — but every line written, every bug fixed, every decision made by me.

Free forever. Open source.