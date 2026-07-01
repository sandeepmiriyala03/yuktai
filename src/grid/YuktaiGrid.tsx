// ─────────────────────────────────────────────────────────────────────────────
// @yuktishaalaa/yuktai · src/grid/YuktaiGrid.tsx
//
// Main component — accessible AI data grid for Next.js
// Auto switches between table view (desktop) and card view (mobile)
// WCAG 2.2 compliant by default
// SSR-safe — works in Next.js 16 App Router
// v4.1.0 — uses yuktai icons for sort indicators and pagination
// ─────────────────────────────────────────────────────────────────────────────

"use client"

import React, { useState, useCallback } from "react"
import { useGrid } from "./useGrid"
import type {
  YuktaiGridProps,
  GridTheme,
} from "./types"

// ── yuktai icons — used inside the grid itself ──
import { SortUpIcon }       from "../icons/SortUpIcon"
import { SortDownIcon }     from "../icons/SortDownIcon"
import { ChevronLeftIcon }  from "../icons/ChevronLeftIcon"
import { ChevronRightIcon } from "../icons/ChevronRightIcon"

// ─────────────────────────────────────────────────────────────────────────────
// Theme definition
// ─────────────────────────────────────────────────────────────────────────────
interface ThemeStyles {
  container: React.CSSProperties
  header:    React.CSSProperties
  row:       React.CSSProperties
  rowHover:  React.CSSProperties
  cell:      React.CSSProperties
  button:    React.CSSProperties
  border:    string
}

const THEMES: Record<GridTheme, ThemeStyles> = {
  "default": {
    container: { background: "#FFFFFF", color: "#0F172A", fontFamily: "system-ui, -apple-system, sans-serif" },
    header:    { background: "#F8FAFC", color: "#475569", borderBottom: "1px solid #E2E8F0" },
    row:       { borderBottom: "1px solid #F1F5F9" },
    rowHover:  { background: "#F8FAFC" },
    cell:      { color: "#0F172A" },
    button:    { background: "#0D9488", color: "#FFFFFF" },
    border:    "#E2E8F0",
  },
  "high-contrast": {
    container: { background: "#000000", color: "#FFFFFF", fontFamily: "system-ui, sans-serif", fontWeight: 600 },
    header:    { background: "#000000", color: "#FFFF00", borderBottom: "2px solid #FFFFFF", fontWeight: 700 },
    row:       { borderBottom: "1px solid #FFFFFF" },
    rowHover:  { background: "#1A1A1A" },
    cell:      { color: "#FFFFFF" },
    button:    { background: "#FFFF00", color: "#000000", border: "2px solid #FFFFFF" },
    border:    "#FFFFFF",
  },
  "dark": {
    container: { background: "#0F172A", color: "#F1F5F9", fontFamily: "system-ui, sans-serif" },
    header:    { background: "#1E293B", color: "#94A3B8", borderBottom: "1px solid #334155" },
    row:       { borderBottom: "1px solid #1E293B" },
    rowHover:  { background: "#1E293B" },
    cell:      { color: "#F1F5F9" },
    button:    { background: "#14B8A6", color: "#0F172A" },
    border:    "#334155",
  },
  "color-blind": {
    container: { background: "#FFFFFF", color: "#0F172A", fontFamily: "system-ui, sans-serif" },
    header:    { background: "#F8FAFC", color: "#475569", borderBottom: "1px solid #E2E8F0" },
    row:       { borderBottom: "1px solid #F1F5F9" },
    rowHover:  { background: "#F8FAFC" },
    cell:      { color: "#0F172A" },
    button:    { background: "#1F2937", color: "#FFFFFF" },
    border:    "#E2E8F0",
  },
  "dyslexia": {
    container: { background: "#FDF6E3", color: "#3D3424", fontFamily: "'Atkinson Hyperlegible', system-ui, sans-serif", letterSpacing: "0.3px", lineHeight: 1.7 },
    header:    { background: "#FAF0D7", color: "#5C4F37", borderBottom: "1px solid #D7CFB8", letterSpacing: "0.5px" },
    row:       { borderBottom: "1px solid #ECE0C2" },
    rowHover:  { background: "#FAF0D7" },
    cell:      { color: "#3D3424" },
    button:    { background: "#92400E", color: "#FDF6E3" },
    border:    "#D7CFB8",
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Default UI text
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_TEXT = {
  search:       "Search...",
  noData:       "No data to display",
  loading:      "Loading...",
  rowsSelected: "rows selected",
  page:         "Page",
  of:           "of",
  showing:      "Showing",
  to:           "to",
  results:      "results",
  prev:         "Previous",
  next:         "Next",
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export function YuktaiGrid<T extends Record<string, unknown>>(
  props: YuktaiGridProps<T>
) {
  const {
    data,
    columns,
    view             = "auto",
    mobileBreakpoint = 768,
    theme            = "default",
    pagination       = true,
    search           = true,
    selectable       = false,
    selectedKeys     = [],
    rowKey,
    loading          = false,
    empty,
    onSelectionChange,
    onRowClick,
    onSortChange,
    className,
  } = props

  const [selected, setSelected] = useState<string[]>(selectedKeys)

  const {
    displayedData,
    filteredCount,
    sort,
    toggleSort,
    searchQuery,
    setSearchQuery,
    page,
    pageSize,
    totalPages,
    setPage,
    isMobile,
  } = useGrid({ data, columns, pagination, mobileBreakpoint })

  const useCardView =
    view === "card" ||
    (view === "auto" && isMobile)

  const styles  = THEMES[theme]
  const visible = columns.filter(c => !(isMobile && c.hiddenOnMobile))

  const getRowKey = useCallback((row: T, idx: number): string => {
    if (rowKey && row[rowKey] !== undefined) return String(row[rowKey])
    if (row.id !== undefined)                return String(row.id)
    return String(idx)
  }, [rowKey])

  const handleSort = useCallback((key: string) => {
    toggleSort(key)
    onSortChange?.(sort)
  }, [toggleSort, onSortChange, sort])

  const handleSelect = useCallback((key: string) => {
    setSelected(prev => {
      const next = prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
      onSelectionChange?.(next)
      return next
    })
  }, [onSelectionChange])

  // ─────────────────────────────────────────────────────────────────
  // Loading state
  // ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div role="status" aria-live="polite" style={{
        ...styles.container,
        padding: "2rem",
        textAlign: "center",
        borderRadius: 8,
        border: `1px solid ${styles.border}`,
      }}>
        {DEFAULT_TEXT.loading}
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────
  // Empty state
  // ─────────────────────────────────────────────────────────────────
  if (data.length === 0) {
    return (
      <div role="status" style={{
        ...styles.container,
        padding: "2rem",
        textAlign: "center",
        borderRadius: 8,
        border: `1px solid ${styles.border}`,
      }}>
        {empty ?? DEFAULT_TEXT.noData}
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────
  return (
    <div
      className={className}
      style={{
        ...styles.container,
        borderRadius: 8,
        border: `1px solid ${styles.border}`,
        overflow: "hidden",
      }}
      data-yuktai-grid
      data-theme={theme}
    >

      {/* ── Header with search ── */}
      {search && (
        <div style={{
          ...styles.header,
          padding: "12px 16px",
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}>
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={DEFAULT_TEXT.search}
            aria-label={DEFAULT_TEXT.search}
            style={{
              flex: 1,
              padding: "8px 12px",
              fontSize: 14,
              border: `1px solid ${styles.border}`,
              borderRadius: 6,
              background: "transparent",
              color: "inherit",
              minHeight: 44,
            }}
          />
          {selectable && selected.length > 0 && (
            <span style={{ fontSize: 13, color: "inherit" }}>
              {selected.length} {DEFAULT_TEXT.rowsSelected}
            </span>
          )}
        </div>
      )}

      {/* ── Card view (mobile) ── */}
      {useCardView ? (
        <div role="list" style={{ padding: 8 }}>
          {displayedData.map((row, idx) => {
            const key = getRowKey(row, idx)
            return (
              <div
                key={key}
                role="listitem"
                onClick={() => onRowClick?.(row, idx)}
                style={{
                  padding: 12,
                  marginBottom: 8,
                  border: `1px solid ${styles.border}`,
                  borderRadius: 8,
                  background: "transparent",
                  cursor: onRowClick ? "pointer" : "default",
                  minHeight: 44,
                }}
                tabIndex={0}
              >
                {visible.map(col => (
                  <div key={col.key} style={{
                    display:  "flex",
                    justifyContent: "space-between",
                    padding:  "4px 0",
                    fontSize: 13,
                  }}>
                    <span style={{ fontWeight: 500, opacity: 0.7 }}>
                      {col.label}:
                    </span>
                    <span style={styles.cell}>
                      {col.render
                        ? col.render(row[col.key], row, idx)
                        : String(row[col.key] ?? "")}
                    </span>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      ) : (

        /* ── Table view (desktop) ── */
        <div style={{ overflowX: "auto" }}>
          <table
            role="grid"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 14,
            }}
          >
            <thead>
              <tr role="row">
                {selectable && (
                  <th style={{ ...styles.header, padding: "10px 14px", width: 44 }}>
                    <input
                      type="checkbox"
                      aria-label="Select all"
                      checked={selected.length === displayedData.length && displayedData.length > 0}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelected(displayedData.map((r, i) => getRowKey(r, i)))
                        } else {
                          setSelected([])
                        }
                      }}
                      style={{ minWidth: 20, minHeight: 20, cursor: "pointer" }}
                    />
                  </th>
                )}
                {visible.map(col => (
                  <th
                    key={col.key}
                    role="columnheader"
                    aria-sort={
                      sort?.key === col.key
                        ? sort.direction === "asc" ? "ascending" : "descending"
                        : "none"
                    }
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                    style={{
                      ...styles.header,
                      padding: "10px 14px",
                      textAlign: col.align ?? "left",
                      cursor: col.sortable !== false ? "pointer" : "default",
                      userSelect: "none",
                      width: col.width,
                      fontWeight: 500,
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {/* Header label + yuktai sort icon */}
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      {col.label}
                      {sort?.key === col.key && (
                        sort.direction === "asc"
                          ? <SortUpIcon   size={14} />
                          : <SortDownIcon size={14} />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayedData.map((row, idx) => {
                const key = getRowKey(row, idx)
                const isSelected = selected.includes(key)
                return (
                  <tr
                    key={key}
                    role="row"
                    aria-selected={isSelected}
                    onClick={() => onRowClick?.(row, idx)}
                    style={{
                      ...styles.row,
                      cursor: onRowClick ? "pointer" : "default",
                      background: isSelected ? (styles.rowHover.background as string) : "transparent",
                    }}
                  >
                    {selectable && (
                      <td style={{ padding: "10px 14px" }}>
                        <input
                          type="checkbox"
                          aria-label={`Select row ${idx + 1}`}
                          checked={isSelected}
                          onChange={() => handleSelect(key)}
                          onClick={e => e.stopPropagation()}
                          style={{ minWidth: 20, minHeight: 20, cursor: "pointer" }}
                        />
                      </td>
                    )}
                    {visible.map(col => (
                      <td
                        key={col.key}
                        role="gridcell"
                        style={{
                          ...styles.cell,
                          padding: "10px 14px",
                          textAlign: col.align ?? "left",
                        }}
                      >
                        {col.render
                          ? col.render(row[col.key], row, idx)
                          : String(row[col.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ── */}
      {pagination !== false && totalPages > 1 && (
        <div style={{
          ...styles.header,
          padding: "10px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `1px solid ${styles.border}`,
          borderBottom: "none",
          fontSize: 13,
          flexWrap: "wrap",
          gap: 8,
        }}>
          <span>
            {DEFAULT_TEXT.showing} {((page - 1) * pageSize) + 1} {DEFAULT_TEXT.to}{" "}
            {Math.min(page * pageSize, filteredCount)} {DEFAULT_TEXT.of}{" "}
            {filteredCount} {DEFAULT_TEXT.results}
          </span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>

            {/* Previous button — yuktai ChevronLeftIcon */}
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              aria-label={DEFAULT_TEXT.prev}
              style={{
                ...styles.button,
                padding: "6px 12px",
                border: `1px solid ${styles.border}`,
                borderRadius: 4,
                cursor: page === 1 ? "not-allowed" : "pointer",
                opacity: page === 1 ? 0.5 : 1,
                minHeight: 44,
                minWidth: 44,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChevronLeftIcon size={18} />
            </button>

            <span style={{ padding: "0 8px" }}>
              {DEFAULT_TEXT.page} {page} {DEFAULT_TEXT.of} {totalPages}
            </span>

            {/* Next button — yuktai ChevronRightIcon */}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              aria-label={DEFAULT_TEXT.next}
              style={{
                ...styles.button,
                padding: "6px 12px",
                border: `1px solid ${styles.border}`,
                borderRadius: 4,
                cursor: page === totalPages ? "not-allowed" : "pointer",
                opacity: page === totalPages ? 0.5 : 1,
                minHeight: 44,
                minWidth: 44,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChevronRightIcon size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default YuktaiGrid