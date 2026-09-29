"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  GridColumn,
  YuktaiGridProps,
} from "./types";

type YuktaiGridPropsWithHighlight<
  T extends Record<string, unknown>
> = YuktaiGridProps<T> & {
  highlightIds?: (string | number)[];
  highlightColor?: string;
  autoScrollToHighlight?: boolean;
};

export function YuktaiGrid<
  T extends Record<string, unknown>
>({
  data,
  columns,
  rowKey = "id",
  view = "auto",
  mobileBreakpoint = 768,
  theme = "default",
  locale = "en-US",
  search = true,
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  pagination,
  loading = false,
  highlightIds = [],
  highlightColor = "#fff3a3",
  autoScrollToHighlight = false,
  onRowClick,
  onSortChange,
  empty = "No data found.",
  className = "",
}: YuktaiGridPropsWithHighlight<T>) {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<
    string | undefined
  >();
  const [sortDirection, setSortDirection] =
    useState<"asc" | "desc">("asc");

  const paginationEnabled =
    pagination !== false &&
    pagination !== undefined;

  const pageSize =
    typeof pagination === "object"
      ? pagination.pageSize ?? 20
      : 20;

  const rows = useMemo(() => {
    let result = [...data];

    if (searchText.trim()) {
      const query = searchText
        .trim()
        .toLowerCase();

      result = result.filter((row) =>
        columns.some((column) =>
          String(
            row[column.key as keyof T] ?? ""
          )
            .toLowerCase()
            .includes(query)
        )
      );
    }

    if (sortKey) {
      result.sort((a, b) => {
        const av = a[sortKey as keyof T];
        const bv = b[sortKey as keyof T];

        if (av == null && bv == null) {
          return 0;
        }

        if (av == null) {
          return 1;
        }

        if (bv == null) {
          return -1;
        }

        if (
          typeof av === "number" &&
          typeof bv === "number"
        ) {
          return sortDirection === "asc"
            ? av - bv
            : bv - av;
        }

        const comparison =
          String(av).localeCompare(
            String(bv),
            locale,
            {
              numeric: true,
              sensitivity: "base",
            }
          );

        return sortDirection === "asc"
          ? comparison
          : -comparison;
      });
    }

    return result;
  }, [
    data,
    columns,
    searchText,
    sortKey,
    sortDirection,
    locale,
  ]);

  const totalPages = paginationEnabled
    ? Math.max(
        1,
        Math.ceil(
          rows.length / pageSize
        )
      )
    : 1;

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (!autoScrollToHighlight) {
      return;
    }

    const firstHighlight =
      highlightIds[0];

    if (
      firstHighlight === undefined ||
      firstHighlight === null
    ) {
      return;
    }

    const element =
      document.querySelector(
        `[data-yuktai-row-id="${CSS.escape(
          String(firstHighlight)
        )}"]`
      );

    element?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [
    highlightIds,
    autoScrollToHighlight,
  ]);

  const displayedRows = useMemo(() => {
    if (!paginationEnabled) {
      return rows;
    }

    const start =
      (page - 1) * pageSize;

    return rows.slice(
      start,
      start + pageSize
    );
  }, [
    rows,
    paginationEnabled,
    page,
    pageSize,
  ]);

  const [isMobile, setIsMobile] =
    useState(false);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(
        window.innerWidth <=
          mobileBreakpoint
      );
    };

    updateViewport();

    window.addEventListener(
      "resize",
      updateViewport
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateViewport
      );
    };
  }, [mobileBreakpoint]);

  const isCardView =
    view === "card" ||
    (view === "auto" && isMobile);

  const getId = (row: T) =>
    String(
      row[rowKey as keyof T] ?? ""
    );

  const isSelected = (id: string) =>
    selectedKeys.some(
      (key: string) =>
        String(key) === id
    );

  const isHighlighted = (
    id: string
  ) =>
    highlightIds.some(
      (key: string | number) =>
        String(key) === id
    );

  const toggleSelection = (
    row: T
  ) => {
    if (!selectable) {
      return;
    }

    const id = getId(row);

    const next = isSelected(id)
      ? selectedKeys.filter(
          (key: string) =>
            String(key) !== id
        )
      : [...selectedKeys, id];

    onSelectionChange?.(next);
  };

  const handleSort = (
    column: GridColumn<T>
  ) => {
    if (column.sortable === false) {
      return;
    }

    const key = String(column.key);

    const nextDirection =
      sortKey === key &&
      sortDirection === "asc"
        ? "desc"
        : "asc";

    setSortKey(key);
    setSortDirection(
      nextDirection
    );
    setPage(1);

    onSortChange?.({
      key,
      direction: nextDirection,
    });
  };

  const renderValue = (
    row: T,
    column: GridColumn<T>,
    index: number
  ) => {
    if (column.render) {
      return column.render(
        row[column.key as keyof T],
        row,
        index
      );
    }

    const value =
      row[column.key as keyof T];

    if (value == null) {
      return "";
    }

    if (column.type === "date") {
      const date = new Date(
        String(value)
      );

      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString(
          locale
        );
      }
    }

    if (column.type === "boolean") {
      return value ? "Yes" : "No";
    }

    return String(value);
  };

  const dark =
    theme === "dark";

  const highContrast =
    theme === "high-contrast";

  const containerStyle: React.CSSProperties =
    {
      width: "100%",
      overflow: "hidden",
      border: highContrast
        ? "2px solid #000000"
        : dark
        ? "1px solid #334155"
        : "1px solid #e2e8f0",
      borderRadius: 12,
      background: dark
        ? "#0f172a"
        : "#ffffff",
      color: dark
        ? "#f8fafc"
        : "#0f172a",
    };

  const headerStyle: React.CSSProperties =
    {
      padding: 12,
      display: "flex",
      alignItems: "center",
      gap: 12,
      borderBottom: dark
        ? "1px solid #334155"
        : "1px solid #e2e8f0",
    };

  if (loading) {
    return (
      <div
        className={className}
        style={containerStyle}
      >
        <div
          style={{
            padding: 32,
            textAlign: "center",
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={containerStyle}
    >
      {search && (
        <div style={headerStyle}>
          <input
            value={searchText}
            onChange={(event) => {
              setSearchText(
                event.target.value
              );
              setPage(1);
            }}
            placeholder="Search..."
            aria-label="Search grid"
            style={{
              width: "100%",
              maxWidth: 360,
              padding: "9px 12px",
              borderRadius: 8,
              border: dark
                ? "1px solid #475569"
                : "1px solid #cbd5e1",
              background: dark
                ? "#1e293b"
                : "#ffffff",
              color: dark
                ? "#ffffff"
                : "#0f172a",
              outline: "none",
            }}
          />

          <div
            style={{
              marginLeft: "auto",
              fontSize: 13,
              opacity: 0.7,
            }}
          >
            {rows.length} rows
          </div>
        </div>
      )}

      {rows.length === 0 ? (
        <div
          style={{
            padding: 40,
            textAlign: "center",
            opacity: 0.7,
          }}
        >
          {empty}
        </div>
      ) : isCardView ? (
        <div
          style={{
            display: "grid",
            gap: 12,
            padding: 12,
          }}
        >
          {displayedRows.map(
            (row, index) => {
              const id = getId(row);
              const selected =
                isSelected(id);
              const highlighted =
                isHighlighted(id);

              return (
                <div
                  key={id}
                  data-yuktai-row-id={id}
                  onClick={() =>
                    onRowClick?.(
                      row,
                      index
                    )
                  }
                  style={{
                    padding: 14,
                    borderRadius: 10,
                    border: dark
                      ? "1px solid #334155"
                      : "1px solid #e2e8f0",
                    background:
                      highlighted
                        ? highlightColor
                        : selected
                        ? dark
                          ? "#1e3a5f"
                          : "#eff6ff"
                        : dark
                        ? "#1e293b"
                        : "#ffffff",
                    cursor: onRowClick
                      ? "pointer"
                      : "default",
                  }}
                >
                  {selectable && (
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        toggleSelection(
                          row
                        )
                      }
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                      aria-label={`Select row ${id}`}
                      style={{
                        marginBottom: 10,
                      }}
                    />
                  )}

                  {columns.map(
                    (column) => (
                      <div
                        key={String(
                          column.key
                        )}
                        style={{
                          display: "flex",
                          gap: 8,
                          padding:
                            "5px 0",
                        }}
                      >
                        <strong
                          style={{
                            minWidth: 100,
                            opacity: 0.7,
                          }}
                        >
                          {column.label}
                        </strong>

                        <span>
                          {renderValue(
                            row,
                            column,
                            index
                          )}
                        </span>
                      </div>
                    )
                  )}
                </div>
              );
            }
          )}
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse:
                "collapse",
            }}
          >
            <thead>
              <tr>
                {selectable && (
                  <th
                    style={{
                      padding: 10,
                      borderBottom:
                        dark
                          ? "1px solid #334155"
                          : "1px solid #e2e8f0",
                      width: 44,
                    }}
                  />
                )}

                {columns
                  .filter(
                    (column) =>
                      !(
                        isMobile &&
                        column.hiddenOnMobile
                      )
                  )
                  .map(
                    (column) => (
                      <th
                        key={String(
                          column.key
                        )}
                        onClick={() =>
                          handleSort(
                            column
                          )
                        }
                        style={{
                          padding: 10,
                          textAlign:
                            column.align ??
                            "left",
                          borderBottom:
                            dark
                              ? "1px solid #334155"
                              : "1px solid #e2e8f0",
                          whiteSpace:
                            "nowrap",
                          cursor:
                            column.sortable ===
                            false
                              ? "default"
                              : "pointer",
                          width:
                            column.width,
                        }}
                      >
                        {column.label}

                        {sortKey ===
                          String(
                            column.key
                          ) && (
                          <span
                            style={{
                              marginLeft: 6,
                            }}
                            aria-hidden="true"
                          >
                            {sortDirection ===
                            "asc"
                              ? "↑"
                              : "↓"}
                          </span>
                        )}
                      </th>
                    )
                  )}
              </tr>
            </thead>

            <tbody>
              {displayedRows.map(
                (row, index) => {
                  const id =
                    getId(row);

                  const selected =
                    isSelected(id);

                  const highlighted =
                    isHighlighted(id);

                  return (
                    <tr
                      key={id}
                      data-yuktai-row-id={
                        id
                      }
                      onClick={() =>
                        onRowClick?.(
                          row,
                          index
                        )
                      }
                      style={{
                        background:
                          highlighted
                            ? highlightColor
                            : selected
                            ? dark
                              ? "#1e3a5f"
                              : "#eff6ff"
                            : "transparent",
                        cursor:
                          onRowClick
                            ? "pointer"
                            : "default",
                      }}
                    >
                      {selectable && (
                        <td
                          style={{
                            padding: 10,
                            borderBottom:
                              dark
                                ? "1px solid #334155"
                                : "1px solid #e2e8f0",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={
                              selected
                            }
                            onChange={() =>
                              toggleSelection(
                                row
                              )
                            }
                            onClick={(
                              event
                            ) =>
                              event.stopPropagation()
                            }
                            aria-label={`Select row ${id}`}
                          />
                        </td>
                      )}

                      {columns
                        .filter(
                          (column) =>
                            !(
                              isMobile &&
                              column.hiddenOnMobile
                            )
                        )
                        .map(
                          (
                            column
                          ) => (
                            <td
                              key={String(
                                column.key
                              )}
                              style={{
                                padding: 10,
                                textAlign:
                                  column.align ??
                                  "left",
                                borderBottom:
                                  dark
                                    ? "1px solid #334155"
                                    : "1px solid #e2e8f0",
                              }}
                            >
                              {renderValue(
                                row,
                                column,
                                index
                              )}
                            </td>
                          )
                        )}
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      )}

      {paginationEnabled && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: 12,
            padding: 12,
            borderTop: dark
              ? "1px solid #334155"
              : "1px solid #e2e8f0",
          }}
        >
          <span
            style={{
              fontSize: 13,
              opacity: 0.7,
            }}
          >
            Page {page} of{" "}
            {totalPages}
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {typeof pagination ===
              "object" &&
              pagination
                .showSizeChanger &&
              pagination.sizeOptions &&
              pagination.sizeOptions
                .length > 0 && (
                <select
                  value={pageSize}
                  onChange={() => undefined}
                  aria-label="Page size"
                  style={{
                    padding:
                      "6px 8px",
                  }}
                >
                  {pagination.sizeOptions.map(
                    (size) => (
                      <option
                        key={size}
                        value={size}
                      >
                        {size}
                      </option>
                    )
                  )}
                </select>
              )}

            <button
              type="button"
              disabled={page <= 1}
              onClick={() =>
                setPage((value) =>
                  Math.max(
                    1,
                    value - 1
                  )
                )
              }
            >
              Previous
            </button>

            <button
              type="button"
              disabled={
                page >= totalPages
              }
              onClick={() =>
                setPage((value) =>
                  Math.min(
                    totalPages,
                    value + 1
                  )
                )
              }
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default YuktaiGrid;