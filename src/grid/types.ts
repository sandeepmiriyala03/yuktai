// ─────────────────────────────────────────────────────────────────────────────
// @yuktishaalaa/yuktai-grid · src/types.ts
//
// All TypeScript types for yuktai-grid.
// Single source of truth — every component imports from here.
// ─────────────────────────────────────────────────────────────────────────────

import type { ReactNode } from "react"

// ─────────────────────────────────────────────────────────────────────────────
// GridColumn — defines one column
// ─────────────────────────────────────────────────────────────────────────────
export interface GridColumn<T = Record<string, unknown>> {
  /** Unique key — must match a property in your data */
  key:        keyof T & string

  /** Display label for the header */
  label:      string

  /** Allow sorting on this column (default: true) */
  sortable?:  boolean

  /** Allow filtering on this column (default: true) */
  filterable?: boolean

  /** Hide this column on mobile (default: false) */
  hiddenOnMobile?: boolean

  /** Pin this column on tablet view */
  pinned?:    boolean

  /** Column width — number (px) or string (%, fr) */
  width?:     number | string

  /** Custom cell renderer */
  render?:    (value: T[keyof T], row: T, index: number) => ReactNode

  /** Cell alignment */
  align?:     "left" | "center" | "right"

  /** Type — affects default formatting and filter UI */
  type?:      "text" | "number" | "date" | "boolean" | "badge"
}

// ─────────────────────────────────────────────────────────────────────────────
// Sort & Filter
// ─────────────────────────────────────────────────────────────────────────────
export type SortDirection = "asc" | "desc" | null

export interface SortConfig {
  key:        string
  direction:  SortDirection
}

export type FilterOperator =
  | "contains"
  | "equals"
  | "startsWith"
  | "endsWith"
  | "greaterThan"
  | "lessThan"
  | "between"

export interface FilterConfig {
  key:        string
  operator:   FilterOperator
  value:      string | number | [number, number]
}

// ─────────────────────────────────────────────────────────────────────────────
// View mode — auto-detected based on screen size
// ─────────────────────────────────────────────────────────────────────────────
export type ViewMode = "table" | "card" | "auto"

// ─────────────────────────────────────────────────────────────────────────────
// Theme — WCAG-compliant built-in themes
// ─────────────────────────────────────────────────────────────────────────────
export type GridTheme =
  | "default"        // WCAG AA — 4.5:1 contrast
  | "high-contrast"  // WCAG AAA — 7:1 contrast
  | "dark"           // Dark mode AA
  | "color-blind"    // Patterns + safe palette
  | "dyslexia"       // Atkinson Hyperlegible font

// ─────────────────────────────────────────────────────────────────────────────
// Locale — Indic language support
// ─────────────────────────────────────────────────────────────────────────────
export type GridLocale =
  | "en-IN"   // English (India)
  | "en-US"
  | "te-IN"   // Telugu
  | "hi-IN"   // Hindi
  | "ta-IN"   // Tamil
  | "bn-IN"   // Bengali
  | "mr-IN"   // Marathi
  | "kn-IN"   // Kannada
  | "ml-IN"   // Malayalam
  | "gu-IN"   // Gujarati
  | "pa-IN"   // Punjabi
  | "ur-IN"   // Urdu

// ─────────────────────────────────────────────────────────────────────────────
// AI Features
// ─────────────────────────────────────────────────────────────────────────────
export interface AIFeatures {
  /** Enable AI semantic search */
  search?:    boolean

  /** Enable AI row summary */
  summary?:   boolean

  /** Enable anomaly detection */
  anomaly?:   boolean

  /** Enable suggestions */
  suggest?:   boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// Voice & TTS
// ─────────────────────────────────────────────────────────────────────────────
export interface VoiceFeatures {
  /** Voice commands for search/filter/sort */
  control?:   boolean

  /** Read rows aloud on focus */
  speakOnFocus?: boolean

  /** Read filtered data summary aloud */
  speakSummary?: boolean

  /** Voice language (defaults to locale) */
  language?:  string
}

// ─────────────────────────────────────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────────────────────────────────────
export interface PaginationConfig {
  pageSize?:  number
  showSizeChanger?: boolean
  sizeOptions?: number[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Translations — UI text per locale
// ─────────────────────────────────────────────────────────────────────────────
export interface GridTranslations {
  search:       string
  noData:       string
  loading:      string
  rowsSelected: string
  page:         string
  of:           string
  showing:      string
  to:           string
  results:      string
  sort:         string
  filter:       string
  export:       string
  voice:        string
  ask:          string
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Props — what developers pass
// ─────────────────────────────────────────────────────────────────────────────
export interface YuktaiGridProps<T = Record<string, unknown>> {
  /** The data to display */
  data:            T[]

  /** Column definitions */
  columns:         GridColumn<T>[]

  /** View mode — "auto" picks based on screen size */
  view?:           ViewMode

  /** Mobile breakpoint in pixels (default: 768) */
  mobileBreakpoint?: number

  /** WCAG theme (default: "default") */
  theme?:          GridTheme

  /** Locale (default: "en-US") */
  locale?:         GridLocale

  /** AI features */
  ai?:             boolean | AIFeatures

  /** Voice features */
  voice?:          boolean | VoiceFeatures

  /** Pagination */
  pagination?:     boolean | PaginationConfig

  /** Show search bar */
  search?:         boolean

  /** Multi-row selection */
  selectable?:     boolean

  /** Selected row keys */
  selectedKeys?:   string[]

  /** Row key field (default: "id") */
  rowKey?:         keyof T & string

  /** Loading state */
  loading?:        boolean

  /** Custom empty state */
  empty?:          ReactNode

  /** Callbacks */
  onSelectionChange?: (keys: string[]) => void
  onRowClick?:        (row: T, index: number) => void
  onSortChange?:      (sort: SortConfig | null) => void

  /** Custom className */
  className?:      string
}
