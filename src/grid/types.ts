import type { ReactNode } from "react"

export interface GridColumn<T = Record<string, unknown>> {
  key: keyof T & string
  label: string
  sortable?: boolean
  filterable?: boolean
  hiddenOnMobile?: boolean
  pinned?: boolean
  width?: number | string
  render?: (
    value: T[keyof T],
    row: T,
    index: number
  ) => ReactNode
  align?: "left" | "center" | "right"
  type?: "text" | "number" | "date" | "boolean" | "badge"
}

export type SortDirection =
  | "asc"
  | "desc"
  | null

export interface SortConfig {
  key: string
  direction: SortDirection
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
  key: string
  operator: FilterOperator
  value:
    | string
    | number
    | [number, number]
}

export type ViewMode =
  | "table"
  | "card"
  | "auto"

export type GridTheme =
  | "default"
  | "high-contrast"
  | "dark"
  | "color-blind"
  | "dyslexia"

export type GridLocale =
  | "en-IN"
  | "en-US"
  | "te-IN"
  | "hi-IN"
  | "ta-IN"
  | "bn-IN"
  | "mr-IN"
  | "kn-IN"
  | "ml-IN"
  | "gu-IN"
  | "pa-IN"
  | "ur-IN"

export interface AIFeatures {
  search?: boolean
  summary?: boolean
  anomaly?: boolean
  suggest?: boolean
}

export interface VoiceFeatures {
  control?: boolean
  speakOnFocus?: boolean
  speakSummary?: boolean
  language?: string
}

export interface PaginationConfig {
  pageSize?: number
  showSizeChanger?: boolean
  sizeOptions?: number[]
}

export interface GridTranslations {
  search: string
  noData: string
  loading: string
  rowsSelected: string
  page: string
  of: string
  showing: string
  to: string
  results: string
  sort: string
  filter: string
  export: string
  voice: string
  ask: string
}

export interface YuktaiGridProps<
  T = Record<string, unknown>
> {
  data: T[]

  columns: GridColumn<T>[]

  view?: ViewMode

  mobileBreakpoint?: number

  theme?: GridTheme

  locale?: GridLocale

  ai?: boolean | AIFeatures

  voice?: boolean | VoiceFeatures

  pagination?:
    | boolean
    | PaginationConfig

  search?: boolean

  selectable?: boolean

  selectedKeys?: string[]

  rowKey?: keyof T & string

  loading?: boolean

  empty?: ReactNode

  highlightIds?: (
    string | number
  )[]

  highlightColor?: string

  autoScrollToHighlight?: boolean

  onSelectionChange?: (
    keys: string[]
  ) => void

  onRowClick?: (
    row: T,
    index: number
  ) => void

  onSortChange?: (
    sort: SortConfig | null
  ) => void

  className?: string

  /* ───── v4.7.0 — one Agent pipeline for Assistant + WebMCP ───── */

  /** Voice input language of the embedded assistant (default: follows `locale`). */
  inputLanguage?: "en-US" | "te-IN"

  /** Prefix for tool names, e.g. "ratnalabala_poems" → "ratnalabala_poems_search". */
  toolName?: string

  /** Agent-facing tool descriptions, e.g. { search: "Search Telugu poems by title or text." } */
  toolDescriptions?: Partial<Record<
    | "search" | "count" | "columns" | "get_row" | "highlight" | "select"
    | "open" | "filter" | "clear_filters" | "sort" | "clear_sort",
    string
  >>

  /**
   * Expose the grid's tools to AI agents via WebMCP (document.modelContext).
   * Uses exactly the same tools as the embedded assistant.
   */
  webmcp?: boolean

  /** Real WebMCP registration status (state, registered tools, errors). */
  onWebMCPStatusChange?: (status: {
    state: "unsupported" | "registering" | "ready" | "partial" | "error"
    registered: string[]
    errors: { tool: string; message: string }[]
  }) => void

  /** Every result from the Agent (assistant or WebMCP), e.g. for logging. */
  onAgentResult?: (result: {
    success: boolean
    message: string
    tool?: string
  }) => void
}