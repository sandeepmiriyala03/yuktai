// ─────────────────────────────────────────────────────────────────────────────
// @yuktishaalaa/yuktai · src/grid/useGrid.ts
//
// Core hook — search, filters, sorting and pagination for your own grid UI.
// SSR-safe — no window references at module level.
//
// v4.7.0
//  - Filters, using the SAME rules as the filter tool (applyGridFilters), so a
//    custom UI, the Agent and WebMCP all agree on which rows match.
//  - Telugu-safe search: Unicode-normalised (NFC) and case-insensitive.
//  - Sorting fixes: empty values stay LAST in both directions (reverse() used
//    to move them to the top on "desc"); number-like strings and date strings
//    sort by value when the column type says so.
//  - Changing search, filters, sort or page size goes back to page 1.
//  - New direct setters (setSort, setFilters, setFilter, clearFilters) — handy
//    as callbacks for createGridTools.
//  - `rows`: every matching row before pagination (for export / counts).
//
// Backward compatible: every field returned in 4.6.x is still returned.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo, useCallback, useEffect } from "react"
import type { GridColumn, SortConfig, PaginationConfig } from "./types"
import {
  applyGridFilters,
  toGridToolColumns,
  type GridToolFilter,
} from "./gridTools"

// ─────────────────────────────────────────────────────────────────────────────
// Hook input
// ─────────────────────────────────────────────────────────────────────────────
export interface UseGridOptions<T> {
  data:              T[]
  columns:           GridColumn<T>[]
  pagination?:       boolean | PaginationConfig
  mobileBreakpoint?: number
  /** Locale for text sorting, e.g. "te-IN" (default: browser locale) */
  locale?:           string
  /** Starting filters (optional) */
  initialFilters?:   GridToolFilter[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook output
// ─────────────────────────────────────────────────────────────────────────────
export interface UseGridReturn<T> {
  // Data
  displayedData:  T[]
  /** All matching rows (search + filters + sort), before pagination */
  rows:           T[]
  totalCount:     number
  filteredCount:  number

  // Sort
  sort:           SortConfig | null
  toggleSort:     (key: string) => void
  /** Set sort directly (null clears it) */
  setSort:        (sort: SortConfig | null) => void
  clearSort:      () => void

  // Search
  searchQuery:    string
  setSearchQuery: (q: string) => void

  // Filters
  filters:        GridToolFilter[]
  setFilters:     (filters: GridToolFilter[]) => void
  /** Add or replace the filter for one column */
  setFilter:      (filter: GridToolFilter) => void
  /** Remove the filter for one column */
  removeFilter:   (key: string) => void
  clearFilters:   () => void

  // Pagination
  page:           number
  pageSize:       number
  totalPages:     number
  setPage:        (p: number) => void
  setPageSize:    (s: number) => void

  // View mode detection
  isMobile:       boolean

  // Reset
  reset:          () => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function getDefaultPageSize(pagination: UseGridOptions<unknown>["pagination"]): number {
  if (pagination === false) return Number.MAX_SAFE_INTEGER
  if (pagination === true || pagination === undefined) return 10
  return pagination.pageSize ?? 10
}

/** Case-insensitive, Unicode-normalised text (Telugu typed differently still matches) */
function normalizeText(value: unknown): string {
  return String(value ?? "").normalize("NFC").toLowerCase().trim()
}

function isEmpty(value: unknown): boolean {
  return value === null || value === undefined || (typeof value === "string" && value.trim() === "")
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null
  const text = String(value ?? "").trim()
  if (text === "") return null // empty must NOT become 0
  const n = Number(text)
  return Number.isFinite(n) ? n : null
}

function toTime(value: unknown): number | null {
  const t = value instanceof Date ? value.getTime() : new Date(String(value)).getTime()
  return Number.isFinite(t) ? t : null
}

/** Compares two non-empty values, using the column type when it's known. */
function compareValues(a: unknown, b: unknown, type: GridColumn["type"], locale?: string): number {
  if (type === "number" || (typeof a === "number" && typeof b === "number")) {
    const x = toNumber(a)
    const y = toNumber(b)
    if (x !== null && y !== null) return x - y
  }

  if (type === "date" || (a instanceof Date && b instanceof Date)) {
    const x = toTime(a)
    const y = toTime(b)
    if (x !== null && y !== null) return x - y
  }

  if (typeof a === "boolean" && typeof b === "boolean") {
    return a === b ? 0 : a ? 1 : -1
  }

  // Locale-aware text compare (Indic-friendly, numeric-aware: "2" < "10")
  return String(a).localeCompare(String(b), locale, {
    sensitivity: "base",
    numeric: true,
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook implementation
// ─────────────────────────────────────────────────────────────────────────────
export function useGrid<T extends Record<string, unknown>>(
  options: UseGridOptions<T>
): UseGridReturn<T> {
  const {
    data,
    columns,
    pagination = true,
    mobileBreakpoint = 768,
    locale,
    initialFilters = [],
  } = options

  const [sort, setSortState]               = useState<SortConfig | null>(null)
  const [searchQuery, setSearchQueryState] = useState("")
  const [filters, setFiltersState]         = useState<GridToolFilter[]>(initialFilters)
  const [page, setPage]                    = useState(1)
  const [pageSize, setPageSizeState]       = useState(getDefaultPageSize(pagination))
  const [isMobile, setIsMobile]            = useState(false)

  // Follow changes to the pagination prop (it was only read once before)
  const configuredPageSize = getDefaultPageSize(pagination)
  useEffect(() => {
    setPageSizeState(configuredPageSize)
    setPage(1)
  }, [configuredPageSize])

  // ── SSR-safe mobile detection (same rule as YuktaiGrid: <= breakpoint) ──
  useEffect(() => {
    if (typeof window === "undefined") return

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= mobileBreakpoint)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [mobileBreakpoint])

  const toolColumns = useMemo(
    () => toGridToolColumns(columns.map((c) => ({ key: String(c.key), label: c.label, type: c.type }))),
    [columns]
  )

  // ── Sort: asc → desc → none ──
  const toggleSort = useCallback((key: string) => {
    setSortState(prev => {
      if (!prev || prev.key !== key) return { key, direction: "asc" }
      if (prev.direction === "asc")    return { key, direction: "desc" }
      return null
    })
    setPage(1)
  }, [])

  const setSort = useCallback((next: SortConfig | null) => {
    setSortState(next && next.direction ? next : null)
    setPage(1)
  }, [])

  const clearSort = useCallback(() => {
    setSortState(null)
    setPage(1)
  }, [])

  // ── Search (new query → page 1) ──
  const setSearchQuery = useCallback((q: string) => {
    setSearchQueryState(q)
    setPage(1)
  }, [])

  // ── Filters (one per column; any change → page 1) ──
  const setFilters = useCallback((next: GridToolFilter[]) => {
    setFiltersState(next)
    setPage(1)
  }, [])

  const setFilter = useCallback((filter: GridToolFilter) => {
    setFiltersState(prev => [...prev.filter(f => f.key !== filter.key), filter])
    setPage(1)
  }, [])

  const removeFilter = useCallback((key: string) => {
    setFiltersState(prev => prev.filter(f => f.key !== key))
    setPage(1)
  }, [])

  const clearFilters = useCallback(() => {
    setFiltersState([])
    setPage(1)
  }, [])

  // ── Page size (→ page 1) ──
  const setPageSize = useCallback((size: number) => {
    setPageSizeState(Math.max(1, Math.floor(size) || 1))
    setPage(1)
  }, [])

  // ── Search — across the grid's columns, Telugu-safe ──
  const searchedData = useMemo(() => {
    const q = normalizeText(searchQuery)
    if (!q) return data

    return data.filter(row =>
      columns.some(col => {
        const val = row[col.key]
        if (val === null || val === undefined) return false
        return normalizeText(val).includes(q)
      })
    )
  }, [data, searchQuery, columns])

  // ── Filters — exactly the same rules as the filter tool ──
  const filteredData = useMemo(
    () => applyGridFilters(searchedData, toolColumns, filters),
    [searchedData, toolColumns, filters]
  )

  // ── Sort — empty values always last, in both directions ──
  const sortedData = useMemo(() => {
    if (!sort || !sort.direction) return filteredData

    const column = columns.find(c => String(c.key) === sort.key)
    const direction = sort.direction === "desc" ? -1 : 1

    return [...filteredData].sort((a, b) => {
      const aVal = a[sort.key]
      const bVal = b[sort.key]
      const aEmpty = isEmpty(aVal)
      const bEmpty = isEmpty(bVal)

      if (aEmpty && bEmpty) return 0
      if (aEmpty) return 1   // not flipped by direction
      if (bEmpty) return -1

      return direction * compareValues(aVal, bVal, column?.type, locale)
    })
  }, [filteredData, sort, columns, locale])

  // ── Paginate ──
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize))

  const displayedData = useMemo(() => {
    if (pagination === false) return sortedData
    const start = (page - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, page, pageSize, pagination])

  // ── Keep page in bounds when data changes ──
  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const safeSetPage = useCallback(
    (p: number) => setPage(Math.min(Math.max(1, Math.floor(p) || 1), totalPages)),
    [totalPages]
  )

  // ── Reset everything ──
  const reset = useCallback(() => {
    setSortState(null)
    setSearchQueryState("")
    setFiltersState([])
    setPage(1)
  }, [])

  return {
    displayedData,
    rows:          sortedData,
    totalCount:    data.length,
    filteredCount: sortedData.length,

    sort,
    toggleSort,
    setSort,
    clearSort,

    searchQuery,
    setSearchQuery,

    filters,
    setFilters,
    setFilter,
    removeFilter,
    clearFilters,

    page,
    pageSize,
    totalPages,
    setPage: safeSetPage,
    setPageSize,

    isMobile,
    reset,
  }
}

export default useGrid