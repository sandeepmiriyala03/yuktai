// ─────────────────────────────────────────────────────────────────────────────
// @yuktishaalaa/yuktai-grid · src/useGrid.ts
//
// Core hook — manages sorting, filtering, searching, pagination
// SSR-safe — no window references at module level
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo, useCallback, useEffect } from "react"
import type {
  GridColumn,
  SortConfig,
  PaginationConfig,
  YuktaiGridProps,
} from "./types"

// ─────────────────────────────────────────────────────────────────────────────
// Hook input
// ─────────────────────────────────────────────────────────────────────────────
interface UseGridOptions<T> {
  data:        T[]
  columns:     GridColumn<T>[]
  pagination?: boolean | PaginationConfig
  mobileBreakpoint?: number
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook output
// ─────────────────────────────────────────────────────────────────────────────
interface UseGridReturn<T> {
  // Data
  displayedData:  T[]
  totalCount:     number
  filteredCount:  number

  // Sort
  sort:           SortConfig | null
  toggleSort:     (key: string) => void
  clearSort:      () => void

  // Search
  searchQuery:    string
  setSearchQuery: (q: string) => void

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
// Get default page size from config
// ─────────────────────────────────────────────────────────────────────────────
function getDefaultPageSize(pagination: UseGridOptions<unknown>["pagination"]): number {
  if (pagination === false) return Number.MAX_SAFE_INTEGER
  if (pagination === true || pagination === undefined) return 10
  return pagination.pageSize ?? 10
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
  } = options

  const [sort, setSort]               = useState<SortConfig | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage]               = useState(1)
  const [pageSize, setPageSize]       = useState(getDefaultPageSize(pagination))
  const [isMobile, setIsMobile]       = useState(false)

  // ── SSR-safe mobile detection ──
  useEffect(() => {
    if (typeof window === "undefined") return

    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [mobileBreakpoint])

  // ── Toggle sort: asc → desc → null ──
  const toggleSort = useCallback((key: string) => {
    setSort(prev => {
      if (!prev || prev.key !== key) return { key, direction: "asc" }
      if (prev.direction === "asc")    return { key, direction: "desc" }
      return null
    })
    setPage(1)
  }, [])

  const clearSort = useCallback(() => setSort(null), [])

  // ── Search — match across all visible string fields ──
  const searchedData = useMemo(() => {
    if (!searchQuery.trim()) return data
    const q = searchQuery.toLowerCase().trim()

    return data.filter(row => {
      return columns.some(col => {
        const val = row[col.key]
        if (val === null || val === undefined) return false
        return String(val).toLowerCase().includes(q)
      })
    })
  }, [data, searchQuery, columns])

  // ── Sort ──
  const sortedData = useMemo(() => {
    if (!sort) return searchedData

    const sorted = [...searchedData].sort((a, b) => {
      const aVal = a[sort.key]
      const bVal = b[sort.key]

      if (aVal === bVal)        return 0
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      // Number compare
      if (typeof aVal === "number" && typeof bVal === "number") {
        return aVal - bVal
      }

      // Date compare
      if (aVal instanceof Date && bVal instanceof Date) {
        return aVal.getTime() - bVal.getTime()
      }

      // String compare — locale-aware (Indic language friendly)
      const aStr = String(aVal)
      const bStr = String(bVal)
      return aStr.localeCompare(bStr, undefined, {
        sensitivity: "base",
        numeric: true,
      })
    })

    return sort.direction === "desc" ? sorted.reverse() : sorted
  }, [searchedData, sort])

  // ── Paginate ──
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize))

  const displayedData = useMemo(() => {
    if (pagination === false) return sortedData
    const start = (page - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, page, pageSize, pagination])

  // ── Reset ──
  const reset = useCallback(() => {
    setSort(null)
    setSearchQuery("")
    setPage(1)
  }, [])

  // ── Keep page in bounds when data changes ──
  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  return {
    displayedData,
    totalCount:    data.length,
    filteredCount: sortedData.length,

    sort,
    toggleSort,
    clearSort,

    searchQuery,
    setSearchQuery,

    page,
    pageSize,
    totalPages,
    setPage,
    setPageSize,

    isMobile,
    reset,
  }
}
