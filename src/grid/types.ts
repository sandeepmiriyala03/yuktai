import type { ReactNode } from "react"

// ─────────────────────────────────────────────────────────────────────────────
// Grid Column
// ─────────────────────────────────────────────────────────────────────────────

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

  type?:
    | "text"
    | "number"
    | "date"
    | "boolean"
    | "badge"
}

// ─────────────────────────────────────────────────────────────────────────────
// Sorting
// ─────────────────────────────────────────────────────────────────────────────

export type SortDirection =
  | "asc"
  | "desc"
  | null

export interface SortConfig {
  key: string
  direction: SortDirection
}

// ─────────────────────────────────────────────────────────────────────────────
// Filtering
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// View
// ─────────────────────────────────────────────────────────────────────────────

export type ViewMode =
  | "table"
  | "card"
  | "auto"

// ─────────────────────────────────────────────────────────────────────────────
// Grid Theme
// ─────────────────────────────────────────────────────────────────────────────

export type GridTheme =
  | "default"
  | "high-contrast"
  | "dark"
  | "color-blind"
  | "dyslexia"

// ─────────────────────────────────────────────────────────────────────────────
// Languages
//
// English + 22 Indian Scheduled Languages
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// Languages
// English + 22 Indian Scheduled Languages
// ─────────────────────────────────────────────────────────────────────────────

export type IndicLanguageLocale =
  | "as-IN"   // Assamese
  | "bn-IN"   // Bengali
  | "brx-IN"  // Bodo
  | "doi-IN"  // Dogri
  | "gu-IN"   // Gujarati
  | "hi-IN"   // Hindi
  | "kn-IN"   // Kannada
  | "ks-IN"   // Kashmiri
  | "kok-IN"  // Konkani
  | "mai-IN"  // Maithili
  | "ml-IN"   // Malayalam
  | "mni-IN"  // Manipuri / Meitei
  | "mr-IN"   // Marathi
  | "ne-IN"   // Nepali
  | "or-IN"   // Odia
  | "pa-IN"   // Punjabi
  | "sa-IN"   // Sanskrit
  | "sat-IN"  // Santali
  | "sd-IN"   // Sindhi
  | "ta-IN"   // Tamil
  | "te-IN"   // Telugu
  | "ur-IN"   // Urdu

export type GridLocale =
  | "en-IN"
  | "en-US"
  | IndicLanguageLocale

// Used specifically by the AI / voice input layer.
export type GridInputLanguage = GridLocale
// ─────────────────────────────────────────────────────────────────────────────
// AI
// ─────────────────────────────────────────────────────────────────────────────

export interface AIFeatures {
  search?: boolean
  summary?: boolean
  anomaly?: boolean
  suggest?: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// Voice
// ─────────────────────────────────────────────────────────────────────────────

export interface VoiceFeatures {
  control?: boolean
  speakOnFocus?: boolean
  speakSummary?: boolean
  language?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────────────────────────────────────

export interface PaginationConfig {
  pageSize?: number
  showSizeChanger?: boolean
  sizeOptions?: number[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Grid Translations
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// Agent Rule Context
// ─────────────────────────────────────────────────────────────────────────────

export interface YuktaiGridRuleContext<
  T = Record<string, unknown>
> {
  /**
   * Original user input.
   */
  input: string

  /**
   * Current grid data.
   */
  data: T[]

  /**
   * Available grid columns.
   */
  columns: {
    key: string
    label: string
  }[]

  /**
   * Execute one of the generic Grid tools.
   *
   * Example:
   *
   * executeTool("count")
   *
   * executeTool("filter", {
   *   key: "lines",
   *   operator: "greaterThan",
   *   value: 6
   * })
   */
  executeTool: (
    name: string,
    input?: Record<string, unknown>
  ) => Promise<{
    success: boolean
    message: string
    data?: unknown
    error?: {
      code: string
    }
    tool?: string
  }>
}

// ─────────────────────────────────────────────────────────────────────────────
// Application-defined Agent Rule
// ─────────────────────────────────────────────────────────────────────────────

export interface YuktaiGridRule<
  T = Record<string, unknown>
> {
  /**
   * Application-defined rule name.
   */
  name: string

  /**
   * User phrases that activate this rule.
   */
  phrases: string[]

  /**
   * Optional description for documentation/debugging.
   */
  description?: string

  /**
   * Application-specific execution logic.
   *
   * The package does NOT contain application-specific rules.
   */
  execute: (
    context: YuktaiGridRuleContext<T>
  ) => Promise<string> | string
}

// ─────────────────────────────────────────────────────────────────────────────
// YuktAI Grid Props
// ─────────────────────────────────────────────────────────────────────────────

export interface YuktaiGridProps<
  T = Record<string, unknown>
> {
  // ───────────────────────────────────────────────────────────────────────────
  // Data
  // ───────────────────────────────────────────────────────────────────────────

  data: T[]

  columns: GridColumn<T>[]

  // ───────────────────────────────────────────────────────────────────────────
  // View
  // ───────────────────────────────────────────────────────────────────────────

  view?: ViewMode

  mobileBreakpoint?: number

  theme?: GridTheme

  locale?: GridLocale

  // ───────────────────────────────────────────────────────────────────────────
  // AI
  // ───────────────────────────────────────────────────────────────────────────

  ai?: boolean | AIFeatures

  // ───────────────────────────────────────────────────────────────────────────
  // Voice
  // ───────────────────────────────────────────────────────────────────────────

  voice?: boolean | VoiceFeatures

  // ───────────────────────────────────────────────────────────────────────────
  // Pagination
  // ───────────────────────────────────────────────────────────────────────────

  pagination?:
    | boolean
    | PaginationConfig

  // ───────────────────────────────────────────────────────────────────────────
  // Grid Search
  // ───────────────────────────────────────────────────────────────────────────

  search?: boolean

  // ───────────────────────────────────────────────────────────────────────────
  // Selection
  // ───────────────────────────────────────────────────────────────────────────

  selectable?: boolean

  selectedKeys?: string[]

  rowKey?: keyof T & string

  // ───────────────────────────────────────────────────────────────────────────
  // State
  // ───────────────────────────────────────────────────────────────────────────

  loading?: boolean

  empty?: ReactNode

  highlightIds?: (
    string | number
  )[]

  highlightColor?: string

  autoScrollToHighlight?: boolean

  // ───────────────────────────────────────────────────────────────────────────
  // Events
  // ───────────────────────────────────────────────────────────────────────────

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

  // ───────────────────────────────────────────────────────────────────────────
  // Agent / WebMCP
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Voice/input language of the embedded assistant.
   *
   * Supports English and the 22 Indian Scheduled Languages.
   */
  inputLanguage?:
    | "en-IN"
    | "en-US"
    | IndicLanguageLocale

  /**
   * Prefix for WebMCP / Agent tool names.
   *
   * Example:
   *
   * "ratnalabala_poems"
   *
   * produces:
   *
   * ratnalabala_poems_search
   * ratnalabala_poems_filter
   * ratnalabala_poems_sort
   */
  toolName?: string

  /**
   * Agent-facing tool descriptions.
   */
  toolDescriptions?: Partial<
    Record<
      | "search"
      | "count"
      | "columns"
      | "get_row"
      | "highlight"
      | "select"
      | "open"
      | "filter"
      | "clear_filters"
      | "sort"
      | "clear_sort",
      string
    >
  >

  // ───────────────────────────────────────────────────────────────────────────
  // WebMCP
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Expose Grid tools to AI agents through WebMCP.
   */
  webmcp?: boolean

  /**
   * Real WebMCP registration status.
   */
  onWebMCPStatusChange?: (
    status: {
      state:
        | "unsupported"
        | "registering"
        | "ready"
        | "partial"
        | "error"

      registered: string[]

      errors: {
        tool: string
        message: string
      }[]
    }
  ) => void

  // ───────────────────────────────────────────────────────────────────────────
  // Application-defined Rules
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Application-specific Agent rules.
   *
   * Example:
   *
   * customRules={[
   *   {
   *     name: "show-long-poems",
   *     phrases: ["పెద్ద పద్యాలు"],
   *     execute: async ({ executeTool }) => {
   *       const result = await executeTool("filter", {
   *         key: "lines",
   *         operator: "greaterThan",
   *         value: 6,
   *       })
   *
   *       return result.message
   *     },
   *   },
   * ]}
   */
  customRules?: YuktaiGridRule<T>[]

  // ───────────────────────────────────────────────────────────────────────────
  // Agent Result
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Every result from the Agent.
   */
  onAgentResult?: (
    result: {
      success: boolean
      message: string
      tool?: string
    }
  ) => void
}