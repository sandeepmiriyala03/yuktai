export type GridToolColumn = {
  key: string;
  label: string;
  type?: "text" | "number" | "date";
};

export type GridToolContext<T> = {
  data: T[];
  columns: GridToolColumn[];
  onSelectRow?: (id: string) => void;
  onHighlightRows?: (ids: string[]) => void;
  onOpenRow?: (id: string) => void;
};

export type GridToolResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

export function searchGrid<T extends Record<string, unknown>>(
  context: GridToolContext<T>,
  query: string
): GridToolResult<T[]> {
  const text = query.trim().toLowerCase();

  const rows = context.data.filter((row) =>
    context.columns.some((column) =>
      String(row[column.key] ?? "")
        .toLowerCase()
        .includes(text)
    )
  );

  const ids = rows
    .map((row) => String(row.id ?? ""))
    .filter(Boolean);

  context.onHighlightRows?.(ids);

  return {
    success: true,
    message: `${rows.length} row(s) found.`,
    data: rows,
  };
}

export function countGrid<T>(
  context: GridToolContext<T>
): GridToolResult<number> {
  return {
    success: true,
    message: `${context.data.length} row(s).`,
    data: context.data.length,
  };
}

export function getColumns<T>(
  context: GridToolContext<T>
): GridToolResult<GridToolColumn[]> {
  return {
    success: true,
    message: "Grid columns retrieved.",
    data: context.columns,
  };
}

export function getRow<T extends Record<string, unknown>>(
  context: GridToolContext<T>,
  id: string
): GridToolResult<T> {
  const row = context.data.find(
    (item) => String(item.id ?? "") === id
  );

  if (!row) {
    return {
      success: false,
      message: `Row "${id}" not found.`,
    };
  }

  return {
    success: true,
    message: "Row found.",
    data: row,
  };
}

export function highlightRows<T extends Record<string, unknown>>(
  context: GridToolContext<T>,
  ids: string[]
): GridToolResult<string[]> {
  context.onHighlightRows?.(ids);

  return {
    success: true,
    message: `${ids.length} row(s) highlighted.`,
    data: ids,
  };
}

export function selectRow<T extends Record<string, unknown>>(
  context: GridToolContext<T>,
  id: string
): GridToolResult<string> {
  context.onSelectRow?.(id);

  return {
    success: true,
    message: `Row "${id}" selected.`,
    data: id,
  };
}

export function openRow<T extends Record<string, unknown>>(
  context: GridToolContext<T>,
  id: string
): GridToolResult<string> {
  context.onOpenRow?.(id);

  return {
    success: true,
    message: `Row "${id}" opened.`,
    data: id,
  };
}