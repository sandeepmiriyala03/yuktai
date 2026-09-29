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

import YuktaiGridAI from "./YuktaiGridAI";

type Language = "en-US" | "te-IN";

const translations: Record<
  Language,
  {
    search: string;
    searchAria: string;
    rows: string;
    row: string;
    loading: string;
    noData: string;
    selectRow: string;
    pageSize: string;
    page: string;
    of: string;
    previous: string;
    next: string;
    yes: string;
    no: string;
    sortAscending: string;
    sortDescending: string;
  }
> = {
  "en-US": {
    search: "Search...",
    searchAria: "Search grid",
    rows: "rows",
    row: "row",
    loading: "Loading...",
    noData: "No data found.",
    selectRow: "Select row",
    pageSize: "Page size",
    page: "Page",
    of: "of",
    previous: "Previous",
    next: "Next",
    yes: "Yes",
    no: "No",
    sortAscending: "Sort ascending",
    sortDescending: "Sort descending",
  },
  "te-IN": {
    search: "శోధించండి...",
    searchAria: "గ్రిడ్‌లో శోధించండి",
    rows: "వరుసలు",
    row: "వరుస",
    loading: "లోడ్ అవుతోంది...",
    noData: "డేటా కనబడలేదు.",
    selectRow: "వరుసను ఎంచుకోండి",
    pageSize: "పేజీ పరిమాణం",
    page: "పేజీ",
    of: "లో",
    previous: "వెనుకకు",
    next: "ముందుకు",
    yes: "అవును",
    no: "కాదు",
    sortAscending: "ఆరోహణ క్రమంలో అమర్చండి",
    sortDescending: "అవరోహణ క్రమంలో అమర్చండి",
  },
};

function SearchIcon({
  size = 20,
  color = "currentColor",
  strokeWidth = 2.4,
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

function SortUpIcon({
  size = 18,
  color = "currentColor",
  strokeWidth = 2.4,
  label,
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
  label?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    >
      {label ? <title>{label}</title> : null}
      <path d="m6 15 6-6 6 6" />
    </svg>
  );
}

function SortDownIcon({
  size = 18,
  color = "currentColor",
  strokeWidth = 2.4,
  label,
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
  label?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    >
      {label ? <title>{label}</title> : null}
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronLeftIcon({
  size = 20,
  color = "currentColor",
  strokeWidth = 2.4,
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({
  size = 20,
  color = "currentColor",
  strokeWidth = 2.4,
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function CheckIcon({
  size = 18,
  color = "currentColor",
  strokeWidth = 2.4,
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

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
  ai = false,
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
  empty,
  className = "",
}: YuktaiGridProps<T>) {
  const language: Language =
    locale === "te-IN" ? "te-IN" : "en-US";

  const t = translations[language];

  const aiEnabled =
    ai === true ||
    (typeof ai === "object" && ai !== null);

  const paginationEnabled =
    pagination !== false &&
    pagination !== undefined;

  const configuredPageSize =
    typeof pagination === "object"
      ? pagination.pageSize ?? 20
      : 20;

  const sizeOptions =
    typeof pagination === "object" &&
    pagination.sizeOptions &&
    pagination.sizeOptions.length > 0
      ? pagination.sizeOptions
      : [10, 20, 50, 100];

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] =
    useState(configuredPageSize);
  const [sortKey, setSortKey] = useState<
    string | undefined
  >();
  const [sortDirection, setSortDirection] =
    useState<"asc" | "desc">("asc");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setPageSize(configuredPageSize);
    setPage(1);
  }, [configuredPageSize]);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(
        window.innerWidth <= mobileBreakpoint
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

        const comparison = String(av).localeCompare(
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

    const escapedId =
      typeof CSS !== "undefined" &&
      typeof CSS.escape === "function"
        ? CSS.escape(String(firstHighlight))
        : String(firstHighlight).replace(
            /["\\]/g,
            "\\$&"
          );

    const element =
      document.querySelector(
        `[data-yuktai-row-id="${escapedId}"]`
      );

    element?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [
    highlightIds,
    autoScrollToHighlight,
    page,
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

  const isCardView =
    view === "card" ||
    (view === "auto" && isMobile);

  const getId = (row: T) =>
    String(
      row[rowKey as keyof T] ?? ""
    );

  const isSelected = (id: string) =>
    selectedKeys.some(
      (key) => String(key) === id
    );

  const isHighlighted = (id: string) =>
    highlightIds.some(
      (key) => String(key) === id
    );

  const toggleSelection = (row: T) => {
    if (!selectable) {
      return;
    }

    const id = getId(row);

    const next = isSelected(id)
      ? selectedKeys.filter(
          (key) =>
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
    setSortDirection(nextDirection);
    setPage(1);

    onSortChange?.({
      key,
      direction: nextDirection,
    });
  };

  const handleAISearch = (
    query: string
  ) => {
    setSearchText(query);
    setPage(1);
  };

  const handleAISort = (
    key: string,
    direction: "asc" | "desc"
  ) => {
    const column = columns.find(
      (item) =>
        String(item.key) === key ||
        item.label.toLowerCase() ===
          key.toLowerCase()
    );

    if (!column) {
      return;
    }

    setSortKey(String(column.key));
    setSortDirection(direction);
    setPage(1);

    onSortChange?.({
      key: String(column.key),
      direction,
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
      return value ? t.yes : t.no;
    }

    return String(value);
  };

  const dark =
    theme === "dark";

  const highContrast =
    theme === "high-contrast";

  const dyslexia =
    theme === "dyslexia";

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
      fontFamily: dyslexia
        ? "Arial, sans-serif"
        : undefined,
    };

  const headerStyle: React.CSSProperties =
    {
      padding: 12,
      display: "flex",
      alignItems: "center",
      gap: 12,
      flexWrap: "wrap",
      borderBottom: dark
        ? "1px solid #334155"
        : "1px solid #e2e8f0",
    };

  const iconButtonStyle =
    (
      disabled: boolean
    ): React.CSSProperties => ({
      width: 40,
      height: 40,
      minWidth: 40,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      borderRadius: 8,
      border: dark
        ? "1px solid #475569"
        : "1px solid #cbd5e1",
      background: disabled
        ? dark
          ? "#1e293b"
          : "#f8fafc"
        : dark
        ? "#1e293b"
        : "#ffffff",
      color: disabled
        ? "#94a3b8"
        : dark
        ? "#f8fafc"
        : "#0f172a",
      cursor: disabled
        ? "not-allowed"
        : "pointer",
      opacity: disabled ? 0.55 : 1,
    });

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
          {t.loading}
        </div>
      </div>
    );
  }

  const aiColumns: {
    key: string;
    label: string;
    type: "number" | "text" | "date";
  }[] = columns.map((column) => ({
    key: String(column.key),
    label: column.label,
    type:
      column.type === "number"
        ? "number"
        : column.type === "date"
        ? "date"
        : "text",
  }));

  return (
    <div
      className={className}
      style={containerStyle}
    >
      {(search || aiEnabled) && (
        <div style={headerStyle}>
          {search && (
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 420,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  display: "flex",
                  alignItems: "center",
                  color: dark
                    ? "#cbd5e1"
                    : "#64748b",
                  pointerEvents: "none",
                }}
              >
                <SearchIcon
                  size={19}
                />
              </div>

              <input
                value={searchText}
                onChange={(event) => {
                  setSearchText(
                    event.target.value
                  );
                  setPage(1);
                }}
                placeholder={t.search}
                aria-label={
                  t.searchAria
                }
                style={{
                  width: "100%",
                  padding:
                    "10px 12px 10px 40px",
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
                  boxSizing: "border-box",
                }}
              />
            </div>
          )}

          <div
            style={{
              marginLeft: "auto",
              fontSize: 13,
              opacity: 0.7,
              whiteSpace: "nowrap",
            }}
          >
            {rows.length}{" "}
            {rows.length === 1
              ? t.row
              : t.rows}
          </div>

          {aiEnabled && (
            <YuktaiGridAI<T>
              data={data}
              columns={aiColumns}
              onSearch={handleAISearch}
              onSort={handleAISort}
              theme={
                dark
                  ? "dark"
                  : "light"
              }
              language={language}
              inputLanguage="en-US"
              embedded
            />
          )}
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
          {empty ?? t.noData}
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
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleSelection(
                          row
                        );
                      }}
                      aria-label={`${t.selectRow} ${id}`}
                      aria-pressed={selected}
                      style={{
                        width: 32,
                        height: 32,
                        display:
                          "inline-flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        padding: 0,
                        marginBottom: 10,
                        borderRadius: 7,
                        border: selected
                          ? "1px solid #2563eb"
                          : "1px solid #cbd5e1",
                        background:
                          selected
                            ? "#2563eb"
                            : "transparent",
                        color: selected
                          ? "#ffffff"
                          : "currentColor",
                        cursor:
                          "pointer",
                      }}
                    >
                      {selected && (
                        <CheckIcon
                          size={17}
                        />
                      )}
                    </button>
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
                          alignItems:
                            "flex-start",
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
                      width: 52,
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
                    (column) => {
                      const active =
                        sortKey ===
                        String(
                          column.key
                        );

                      return (
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
                            userSelect:
                              "none",
                          }}
                        >
                          <span
                            style={{
                              display:
                                "inline-flex",
                              alignItems:
                                "center",
                              gap: 5,
                            }}
                          >
                            {column.label}

                            {active &&
                              (sortDirection ===
                              "asc" ? (
                                <SortUpIcon
                                  size={
                                    17
                                  }
                                  label={
                                    t.sortAscending
                                  }
                                />
                              ) : (
                                <SortDownIcon
                                  size={
                                    17
                                  }
                                  label={
                                    t.sortDescending
                                  }
                                />
                              ))}
                          </span>
                        </th>
                      );
                    }
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
                      data-yuktai-row-id={id}
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
                          <button
                            type="button"
                            onClick={(
                              event
                            ) => {
                              event.stopPropagation();
                              toggleSelection(
                                row
                              );
                            }}
                            aria-label={`${t.selectRow} ${id}`}
                            aria-pressed={
                              selected
                            }
                            style={{
                              width: 28,
                              height: 28,
                              display:
                                "inline-flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              padding: 0,
                              borderRadius: 6,
                              border:
                                selected
                                  ? "1px solid #2563eb"
                                  : dark
                                  ? "1px solid #64748b"
                                  : "1px solid #cbd5e1",
                              background:
                                selected
                                  ? "#2563eb"
                                  : "transparent",
                              color:
                                selected
                                  ? "#ffffff"
                                  : "currentColor",
                              cursor:
                                "pointer",
                            }}
                          >
                            {selected && (
                              <CheckIcon
                                size={16}
                              />
                            )}
                          </button>
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
            flexWrap: "wrap",
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
            {t.page} {page} {t.of}{" "}
            {totalPages}
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {typeof pagination ===
              "object" &&
              pagination.showSizeChanger && (
                <select
                  value={pageSize}
                  onChange={(event) => {
                    const nextSize =
                      Number(
                        event.target
                          .value
                      );

                    if (
                      !Number.isFinite(
                        nextSize
                      ) ||
                      nextSize <= 0
                    ) {
                      return;
                    }

                    setPageSize(
                      nextSize
                    );
                    setPage(1);
                  }}
                  aria-label={
                    t.pageSize
                  }
                  style={{
                    minHeight: 40,
                    padding:
                      "7px 10px",
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
                  }}
                >
                  {sizeOptions.map(
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
              aria-label={
                t.previous
              }
              title={t.previous}
              style={iconButtonStyle(
                page <= 1
              )}
            >
              <ChevronLeftIcon
                size={20}
              />
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
              aria-label={t.next}
              title={t.next}
              style={iconButtonStyle(
                page >= totalPages
              )}
            >
              <ChevronRightIcon
                size={20}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default YuktaiGrid;