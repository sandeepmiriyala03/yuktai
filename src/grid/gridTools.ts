/**
 * gridTools — the ONE place where YuktaiGrid tools are defined.
 *
 * Both the in-page Agent (useYuktaiGridAgent) and WebMCP (YuktaiGridWebMCP)
 * should get their tools from `createGridTools()`, so the list an agent sees
 * can never drift from the list the UI shows.
 *
 * Rules every tool follows:
 *  1. One row-ID strategy: `getRowId(row, context.rowKey)` everywhere.
 *     `rowKey` must match YuktaiGrid's `rowKey` prop (default "id").
 *  2. One result shape: { success, message, data?, error?: { code } }.
 *  3. Never claim success for something that didn't happen:
 *     missing callback → NOT_SUPPORTED, unknown row → NOT_FOUND.
 *  4. Never throw: tool execution is wrapped, errors become INTERNAL results.
 *
 * Backward compatible with 4.6.x: the existing exports keep their names and
 * parameters; results only gain an optional `error` field.
 */

/* ================= TYPES ================= */

export type GridToolColumn = {
  key: string;
  label: string;
  type?: "text" | "number" | "date";
};

export type GridToolErrorCode = "NOT_FOUND" | "NOT_SUPPORTED" | "INVALID_INPUT" | "INTERNAL";

export type GridToolFilterOperator =
  | "contains"
  | "equals"
  | "startsWith"
  | "endsWith"
  | "greaterThan"
  | "lessThan"
  | "between";

export type GridToolFilter = {
  key: string;
  operator: GridToolFilterOperator;
  value: string | number | [number, number];
};

export type GridToolSort = {
  key: string;
  direction: "asc" | "desc";
};

/** Language of `message` (shown to people). Agent descriptions stay English. */
export type GridToolLocale = "en" | "te";

export type GridToolContext<T> = {
  data: T[];
  columns: GridToolColumn[];
  /** Field used as the row ID by every tool (default "id"). Match YuktaiGrid's rowKey. */
  rowKey?: string;
  /** Language for result messages (default "en"). */
  locale?: GridToolLocale;
  /** Filters currently applied, so a new filter can be merged in. */
  filters?: GridToolFilter[];
  onSelectRow?: (id: string) => void;
  onHighlightRows?: (ids: string[]) => void;
  onOpenRow?: (id: string) => void;
  onFiltersChange?: (filters: GridToolFilter[]) => void;
  onSortChange?: (sort: GridToolSort | null) => void;
};

export type GridToolResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  error?: { code: GridToolErrorCode };
};

/** A tool ready for the Agent and for WebMCP `registerTool`. */
export type GridTool = {
  name: string;
  title: string;
  /** For AI agents (English works best for tool selection). Never shown in the UI. */
  description: string;
  /** Short label for the UI, in the grid's locale. */
  label: string;
  inputSchema: Record<string, unknown>;
  execute: (input: Record<string, unknown>) => Promise<GridToolResult>;
};

export type CreateGridToolsOptions = {
  /** Tool name prefix, e.g. "ratnalabala_poems" → "ratnalabala_poems_search". */
  name?: string;
  /** Override agent descriptions per tool, keyed by the short tool id ("search", "open", …). */
  descriptions?: Partial<Record<GridToolId, string>>;
};

export type GridToolId =
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
  | "clear_sort";

/* ================= MESSAGES ================= */

const MESSAGES = {
  en: {
    found: (n: number) => `${n} row(s) found.`,
    count: (n: number) => `${n} row(s).`,
    columns: "Grid columns retrieved.",
    rowFound: "Row found.",
    notFound: (id: string) => `Row "${id}" not found.`,
    noneFound: "None of the given rows were found.",
    highlighted: (n: number) => `${n} row(s) highlighted.`,
    selected: (id: string) => `Row "${id}" selected.`,
    opened: (id: string) => `Row "${id}" opened.`,
    notSupported: (action: string) => `This grid does not support "${action}".`,
    emptyQuery: "Please enter something to search.",
    noIds: "No row IDs were given.",
    unknownColumn: (key: string) => `Unknown column "${key}".`,
    badOperator: (op: string) => `Unknown filter operator "${op}".`,
    badValue: "The filter value is not valid for this column.",
    filtered: (n: number) => `Filter applied: ${n} row(s) match.`,
    filtersCleared: "All filters cleared.",
    sorted: (label: string, dir: "asc" | "desc") =>
      `Sorted by ${label} (${dir === "asc" ? "ascending" : "descending"}).`,
    sortCleared: "Sorting cleared.",
    internal: "Something went wrong while running this action.",
  },
  te: {
    found: (n: number) => `${n} వరుస(లు) దొరికాయి.`,
    count: (n: number) => `మొత్తం ${n} వరుసలు.`,
    columns: "కాలమ్‌ల వివరాలు.",
    rowFound: "వరుస దొరికింది.",
    notFound: (id: string) => `"${id}" వరుస దొరకలేదు.`,
    noneFound: "ఇచ్చిన వరుసలేవీ దొరకలేదు.",
    highlighted: (n: number) => `${n} వరుస(లు) హైలైట్ చేశాను.`,
    selected: (id: string) => `"${id}" ఎంచుకున్నాను.`,
    opened: (id: string) => `"${id}" తెరిచాను.`,
    notSupported: (action: string) => `ఈ పట్టికలో "${action}" సౌకర్యం లేదు.`,
    emptyQuery: "వెతకడానికి ఏదైనా రాయండి.",
    noIds: "వరుస IDలు ఇవ్వలేదు.",
    unknownColumn: (key: string) => `"${key}" అనే కాలమ్ లేదు.`,
    badOperator: (op: string) => `"${op}" అనే ఫిల్టర్ విధానం లేదు.`,
    badValue: "ఈ కాలమ్‌కి ఈ ఫిల్టర్ విలువ సరిపోదు.",
    filtered: (n: number) => `ఫిల్టర్ వేశాను: ${n} వరుసలు సరిపోయాయి.`,
    filtersCleared: "ఫిల్టర్లన్నీ తీసేశాను.",
    sorted: (label: string, dir: "asc" | "desc") =>
      `${label} ప్రకారం క్రమం (${dir === "asc" ? "ఆరోహణ" : "అవరోహణ"}).`,
    sortCleared: "క్రమం తీసేశాను.",
    internal: "ఈ పని చేస్తుండగా సమస్య వచ్చింది.",
  },
} as const;

type Messages = (typeof MESSAGES)["en"];

function msg(context: { locale?: GridToolLocale }): Messages {
  return MESSAGES[context.locale ?? "en"] as Messages;
}

function ok<T>(message: string, data?: T): GridToolResult<T> {
  return { success: true, message, data };
}

function fail<T = never>(code: GridToolErrorCode, message: string): GridToolResult<T> {
  return { success: false, message, error: { code } };
}

/* ================= HELPERS ================= */

const OPERATORS: GridToolFilterOperator[] = [
  "contains",
  "equals",
  "startsWith",
  "endsWith",
  "greaterThan",
  "lessThan",
  "between",
];

/** The single row-ID rule used by every tool. */
export function getRowId(row: unknown, rowKey = "id"): string {
  const value = (row as Record<string, unknown> | null | undefined)?.[rowKey];
  return value === undefined || value === null ? "" : String(value);
}

/** Case-insensitive, Unicode-normalised text (so Telugu typed differently still matches). */
function normalizeText(value: unknown): string {
  return String(value ?? "").normalize("NFC").toLowerCase().trim();
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const text = String(value ?? "").trim();
  if (text === "") return null; // empty/null must NOT become 0
  const n = Number(text);
  return Number.isFinite(n) ? n : null;
}

function toTime(value: unknown): number | null {
  if (value instanceof Date) return value.getTime();
  const t = new Date(String(value ?? "")).getTime();
  return Number.isFinite(t) ? t : null;
}

/** Agents sometimes send "a,b" instead of ["a","b"] — accept both. */
function toIdList(value: unknown): string[] {
  const list = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : [];
  return list.map((v) => String(v).trim()).filter(Boolean);
}

function findColumn<T>(context: GridToolContext<T>, key: string): GridToolColumn | undefined {
  const wanted = normalizeText(key);
  // Accept either the key or the visible label ("title" or "పద్యం పేరు")
  return context.columns.find(
    (c) => normalizeText(c.key) === wanted || normalizeText(c.label) === wanted
  );
}

function findRow<T>(context: GridToolContext<T>, id: string): T | undefined {
  return context.data.find((row) => getRowId(row, context.rowKey) === id);
}

function cellValue(row: unknown, key: string): unknown {
  return (row as Record<string, unknown>)[key];
}

/** Compares a value to the filter according to the column type. */
function matchesFilter(row: unknown, filter: GridToolFilter, column: GridToolColumn): boolean {
  const raw = cellValue(row, column.key);
  const kind = column.type ?? "text";

  if (kind === "number" || kind === "date") {
    const read = kind === "number" ? toNumber : toTime;
    const cell = read(raw);
    if (cell === null) return false;

    if (filter.operator === "between") {
      const [a, b] = filter.value as [number, number];
      const lo = read(a);
      const hi = read(b);
      return lo !== null && hi !== null && cell >= Math.min(lo, hi) && cell <= Math.max(lo, hi);
    }
    const target = read(filter.value);
    if (target === null) return false;
    switch (filter.operator) {
      case "equals":
        return cell === target;
      case "greaterThan":
        return cell > target;
      case "lessThan":
        return cell < target;
      default:
        break; // text operators on numbers/dates fall through to text matching
    }
  }

  const text = normalizeText(raw);
  const target = normalizeText(filter.value);
  switch (filter.operator) {
    case "equals":
      return text === target;
    case "startsWith":
      return text.startsWith(target);
    case "endsWith":
      return text.endsWith(target);
    case "contains":
      return text.includes(target);
    default:
      return false;
  }
}

/** Is this operator/value combination valid for the column? */
function isValidFilter(filter: GridToolFilter, column: GridToolColumn): boolean {
  const kind = column.type ?? "text";
  const read = kind === "date" ? toTime : toNumber;

  if (filter.operator === "between") {
    if (kind === "text" || !Array.isArray(filter.value) || filter.value.length !== 2) return false;
    return read(filter.value[0]) !== null && read(filter.value[1]) !== null;
  }
  if (filter.operator === "greaterThan" || filter.operator === "lessThan") {
    return kind !== "text" && read(filter.value) !== null;
  }
  return !Array.isArray(filter.value) && String(filter.value).trim() !== "";
}

/**
 * Applies filters to rows — exported so YuktaiGrid filters its rows with
 * exactly the same rules the filter tool uses to count matches.
 */
export function applyGridFilters<T>(data: T[], columns: GridToolColumn[], filters: GridToolFilter[]): T[] {
  if (!filters.length) return data;
  return applyFilters({ data, columns }, filters);
}

/** Maps grid columns (any type) to tool columns (text / number / date). */
export function toGridToolColumns(
  columns: { key: string; label: string; type?: string }[]
): GridToolColumn[] {
  return columns.map((c) => ({
    key: String(c.key),
    label: c.label,
    type: c.type === "number" ? "number" : c.type === "date" ? "date" : "text",
  }));
}

function applyFilters<T>(context: GridToolContext<T>, filters: GridToolFilter[]): T[] {
  return context.data.filter((row) =>
    filters.every((f) => {
      const column = findColumn(context, f.key);
      return column ? matchesFilter(row, f, column) : true;
    })
  );
}

/* ================= TOOLS (existing exports, now safer) ================= */

export function searchGrid<T extends Record<string, unknown>>(
  context: GridToolContext<T>,
  query: string
): GridToolResult<T[]> {
  const m = msg(context);
  const text = normalizeText(query);
  if (!text) return fail("INVALID_INPUT", m.emptyQuery);

  const rows = context.data.filter((row) =>
    context.columns.some((column) => normalizeText(row[column.key]).includes(text))
  );

  const ids = rows.map((row) => getRowId(row, context.rowKey)).filter(Boolean);
  context.onHighlightRows?.(ids); // same behaviour as 4.6.x: matches glow

  return ok(m.found(rows.length), rows);
}

export function countGrid<T>(context: GridToolContext<T>): GridToolResult<number> {
  return ok(msg(context).count(context.data.length), context.data.length);
}

export function getColumns<T>(context: GridToolContext<T>): GridToolResult<GridToolColumn[]> {
  return ok(msg(context).columns, context.columns);
}

export function getRow<T extends Record<string, unknown>>(
  context: GridToolContext<T>,
  id: string
): GridToolResult<T> {
  const m = msg(context);
  const rowId = String(id ?? "").trim();
  if (!rowId) return fail("INVALID_INPUT", m.noIds);

  const row = findRow(context, rowId);
  return row ? ok(m.rowFound, row) : fail("NOT_FOUND", m.notFound(rowId));
}

export function highlightRows<T extends Record<string, unknown>>(
  context: GridToolContext<T>,
  ids: string[]
): GridToolResult<string[]> {
  const m = msg(context);
  const wanted = toIdList(ids);
  if (wanted.length === 0) return fail("INVALID_INPUT", m.noIds);
  if (!context.onHighlightRows) return fail("NOT_SUPPORTED", m.notSupported("highlight"));

  // Only highlight rows that really exist
  const known = wanted.filter((id) => findRow(context, id) !== undefined);
  if (known.length === 0) return fail("NOT_FOUND", m.noneFound);

  context.onHighlightRows(known);
  return ok(m.highlighted(known.length), known);
}

export function selectRow<T extends Record<string, unknown>>(
  context: GridToolContext<T>,
  id: string
): GridToolResult<string> {
  const m = msg(context);
  const rowId = String(id ?? "").trim();
  if (!rowId) return fail("INVALID_INPUT", m.noIds);
  if (!context.onSelectRow) return fail("NOT_SUPPORTED", m.notSupported("select"));
  if (!findRow(context, rowId)) return fail("NOT_FOUND", m.notFound(rowId));

  context.onSelectRow(rowId);
  return ok(m.selected(rowId), rowId);
}

export function openRow<T extends Record<string, unknown>>(
  context: GridToolContext<T>,
  id: string
): GridToolResult<string> {
  const m = msg(context);
  const rowId = String(id ?? "").trim();
  if (!rowId) return fail("INVALID_INPUT", m.noIds);
  if (!context.onOpenRow) return fail("NOT_SUPPORTED", m.notSupported("open"));
  if (!findRow(context, rowId)) return fail("NOT_FOUND", m.notFound(rowId));

  context.onOpenRow(rowId);
  return ok(m.opened(rowId), rowId);
}

/* ================= NEW TOOLS: filter / sort ================= */

export function filterGrid<T extends Record<string, unknown>>(
  context: GridToolContext<T>,
  filter: GridToolFilter
): GridToolResult<{ filters: GridToolFilter[]; count: number }> {
  const m = msg(context);
  const column = findColumn(context, filter?.key ?? "");
  if (!column) return fail("INVALID_INPUT", m.unknownColumn(String(filter?.key ?? "")));
  if (!OPERATORS.includes(filter.operator)) return fail("INVALID_INPUT", m.badOperator(String(filter.operator)));

  const normalized: GridToolFilter = { ...filter, key: column.key };
  if (!isValidFilter(normalized, column)) return fail("INVALID_INPUT", m.badValue);
  if (!context.onFiltersChange) return fail("NOT_SUPPORTED", m.notSupported("filter"));

  // One filter per column: a new filter on the same column replaces the old one
  const filters = [...(context.filters ?? []).filter((f) => f.key !== column.key), normalized];
  const count = applyFilters(context, filters).length;

  context.onFiltersChange(filters);
  return ok(m.filtered(count), { filters, count });
}

export function clearFilters<T>(context: GridToolContext<T>): GridToolResult<GridToolFilter[]> {
  const m = msg(context);
  if (!context.onFiltersChange) return fail("NOT_SUPPORTED", m.notSupported("clear filters"));
  context.onFiltersChange([]);
  return ok(m.filtersCleared, []);
}

export function sortGrid<T>(
  context: GridToolContext<T>,
  key: string,
  direction: "asc" | "desc" = "asc"
): GridToolResult<GridToolSort> {
  const m = msg(context);
  const column = findColumn(context, key);
  if (!column) return fail("INVALID_INPUT", m.unknownColumn(String(key)));
  if (direction !== "asc" && direction !== "desc") return fail("INVALID_INPUT", m.badValue);
  if (!context.onSortChange) return fail("NOT_SUPPORTED", m.notSupported("sort"));

  const sort: GridToolSort = { key: column.key, direction };
  context.onSortChange(sort);
  return ok(m.sorted(column.label, direction), sort);
}

export function clearSort<T>(context: GridToolContext<T>): GridToolResult<null> {
  const m = msg(context);
  if (!context.onSortChange) return fail("NOT_SUPPORTED", m.notSupported("clear sort"));
  context.onSortChange(null);
  return ok(m.sortCleared, null);
}

/* ================= SINGLE TOOL REGISTRY ================= */

const DEFAULT_DESCRIPTIONS: Record<GridToolId, string> = {
  search: "Search all columns for text. Matching rows are highlighted.",
  count: "Count the rows currently in the grid.",
  columns: "List the grid's columns with their keys, labels and types.",
  get_row: "Get one row by its ID.",
  highlight: "Highlight one or more rows by ID without filtering the grid.",
  select: "Select one row by ID.",
  open: "Open one row by ID to show its full details.",
  filter: "Filter the grid by one column. Replaces any existing filter on that column.",
  clear_filters: "Remove all filters.",
  sort: "Sort the grid by one column, ascending or descending.",
  clear_sort: "Remove sorting.",
};

const LABELS: Record<GridToolLocale, Record<GridToolId, string>> = {
  en: {
    search: "Search",
    count: "Count",
    columns: "Columns",
    get_row: "Get row",
    highlight: "Highlight",
    select: "Select",
    open: "Open",
    filter: "Filter",
    clear_filters: "Clear filters",
    sort: "Sort",
    clear_sort: "Clear sort",
  },
  te: {
    search: "వెతుకు",
    count: "లెక్క",
    columns: "కాలమ్‌లు",
    get_row: "వరుస చూపు",
    highlight: "హైలైట్",
    select: "ఎంచుకో",
    open: "తెరువు",
    filter: "ఫిల్టర్",
    clear_filters: "ఫిల్టర్లు తీసేయి",
    sort: "క్రమం",
    clear_sort: "క్రమం తీసేయి",
  },
};

/** Runs a tool without ever throwing. */
async function safe(context: { locale?: GridToolLocale }, run: () => GridToolResult): Promise<GridToolResult> {
  try {
    return run();
  } catch {
    return fail("INTERNAL", msg(context).internal);
  }
}

/**
 * Builds the tool list used by BOTH the Agent and WebMCP.
 * Only tools the grid can actually perform are included — e.g. "open" is
 * left out when no onOpenRow callback is given — so agents never see a tool
 * that would just return NOT_SUPPORTED.
 */
export function createGridTools<T extends Record<string, unknown>>(
  context: GridToolContext<T>,
  options: CreateGridToolsOptions = {}
): GridTool[] {
  const prefix = options.name ?? "yuktai_grid";
  const labels = LABELS[context.locale ?? "en"];
  const describe = (id: GridToolId) => options.descriptions?.[id] ?? DEFAULT_DESCRIPTIONS[id];

  const idProp = { id: { type: "string", description: "Row ID" } };
  const columnKeys = context.columns.map((c) => c.key);

  const all: Array<{ id: GridToolId; available: boolean; schema: Record<string, unknown>; run: (i: Record<string, unknown>) => GridToolResult }> = [
    {
      id: "search",
      available: true,
      schema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
      run: (i) => searchGrid(context, String(i.query ?? "")),
    },
    {
      id: "count",
      available: true,
      schema: { type: "object", properties: {} },
      run: () => countGrid(context),
    },
    {
      id: "columns",
      available: true,
      schema: { type: "object", properties: {} },
      run: () => getColumns(context),
    },
    {
      id: "get_row",
      available: true,
      schema: { type: "object", properties: idProp, required: ["id"] },
      run: (i) => getRow(context, String(i.id ?? "")),
    },
    {
      id: "highlight",
      available: !!context.onHighlightRows,
      schema: {
        type: "object",
        properties: { ids: { type: "array", items: { type: "string" }, description: "Row IDs" } },
        required: ["ids"],
      },
      run: (i) => highlightRows(context, toIdList(i.ids)),
    },
    {
      id: "select",
      available: !!context.onSelectRow,
      schema: { type: "object", properties: idProp, required: ["id"] },
      run: (i) => selectRow(context, String(i.id ?? "")),
    },
    {
      id: "open",
      available: !!context.onOpenRow,
      schema: { type: "object", properties: idProp, required: ["id"] },
      run: (i) => openRow(context, String(i.id ?? "")),
    },
    {
      id: "filter",
      available: !!context.onFiltersChange,
      schema: {
        type: "object",
        properties: {
          key: { type: "string", enum: columnKeys },
          operator: { type: "string", enum: OPERATORS },
          value: { description: "Text or number; for 'between' an array of two numbers or dates" },
        },
        required: ["key", "operator", "value"],
      },
      run: (i) =>
        filterGrid(context, {
          key: String(i.key ?? ""),
          operator: String(i.operator ?? "") as GridToolFilterOperator,
          value: i.value as GridToolFilter["value"],
        }),
    },
    {
      id: "clear_filters",
      available: !!context.onFiltersChange,
      schema: { type: "object", properties: {} },
      run: () => clearFilters(context),
    },
    {
      id: "sort",
      available: !!context.onSortChange,
      schema: {
        type: "object",
        properties: {
          key: { type: "string", enum: columnKeys },
          direction: { type: "string", enum: ["asc", "desc"] },
        },
        required: ["key"],
      },
      run: (i) => sortGrid(context, String(i.key ?? ""), i.direction === "desc" ? "desc" : "asc"),
    },
    {
      id: "clear_sort",
      available: !!context.onSortChange,
      schema: { type: "object", properties: {} },
      run: () => clearSort(context),
    },
  ];

  return all
    .filter((t) => t.available)
    .map((t) => ({
      name: `${prefix}_${t.id}`,
      title: LABELS.en[t.id],
      description: describe(t.id),
      label: labels[t.id],
      inputSchema: t.schema,
      execute: (input: Record<string, unknown>) => safe(context, () => t.run(input ?? {})),
    }));
}