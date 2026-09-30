import * as react_jsx_runtime from 'react/jsx-runtime';
import React, { ReactNode } from 'react';

interface Plugin {
    name: string;
    execute(input: any): any | Promise<any>;
}
declare class Runtime {
    private plugins;
    register(name: string, plugin: Plugin): void;
    /**
     * 🔹 Direct Plugin Access
     * This is what YuktAI.use(name) calls.
     */
    use(name: string): Plugin | undefined;
    /**
     * 🔹 Run task
     */
    run(task: string, input: unknown): Promise<unknown>;
    getPlugins(): string[];
}

type ColorBlindMode = "none" | "deuteranopia" | "protanopia" | "tritanopia" | "achromatopsia";
type Severity = "critical" | "serious" | "moderate" | "minor";
type AlertType = "success" | "error" | "info" | "warning";
interface A11yConfig {
    enabled: boolean;
    highContrast?: boolean;
    darkMode?: boolean;
    reduceMotion?: boolean;
    autoFix?: boolean;
    fontSizeMultiplier?: number;
    colorBlindMode?: ColorBlindMode;
    keyboardHints?: boolean;
    speechEnabled?: boolean;
    showPreferencePanel?: boolean;
    showAuditBadge?: boolean;
    showSkipLinks?: boolean;
    largeTargets?: boolean;
    timeoutWarning?: number;
    dyslexiaFont?: boolean;
    localFont?: string;
    plainEnglish?: boolean;
    summarisePage?: boolean;
    translateLanguage?: string;
    voiceControl?: boolean;
    smartLabels?: boolean;
}
interface A11yFix {
    tag: string;
    fix: string;
    severity: Severity;
    element: string;
}
interface A11yReport {
    fixed: number;
    scanned: number;
    renderTime: number;
    score: number;
    details: A11yFix[];
}
declare function speak(text: string, priority?: "polite" | "assertive"): void;
declare function showVisualAlert(message: string, type?: AlertType): void;
declare function announce(message: string, type?: AlertType, useSpeech?: boolean): void;
declare function trapFocus(modal: HTMLElement): void;
declare function handlePlainEnglish(enabled: boolean): Promise<void>;
declare function handleSummarisePage(enabled: boolean): Promise<void>;
declare function handleTranslate(language: string): Promise<void>;
declare function handleVoiceControl(enabled: boolean): Promise<void>;
declare function handleSmartLabels(enabled: boolean): Promise<void>;
declare const wcagPlugin: {
    name: string;
    version: string;
    observer: MutationObserver | null;
    execute(config: A11yConfig): Promise<string>;
    applyFixes(config: A11yConfig): A11yReport;
    scan(): A11yReport;
    startObserver(config: A11yConfig): void;
    stopObserver(): void;
    announce: typeof announce;
    speak: typeof speak;
    showVisualAlert: typeof showVisualAlert;
    trapFocus: typeof trapFocus;
    handlePlainEnglish: typeof handlePlainEnglish;
    handleSummarisePage: typeof handleSummarisePage;
    handleTranslate: typeof handleTranslate;
    handleVoiceControl: typeof handleVoiceControl;
    handleSmartLabels: typeof handleSmartLabels;
    SUPPORTED_LANGUAGES: {
        code: string;
        label: string;
    }[];
};

interface YuktAIWrapperProps {
    position?: "left" | "right";
    children: ReactNode;
    config?: Partial<A11yConfig>;
    showRag?: boolean;
    showAgent?: boolean;
}
declare function YuktAIWrapper({ position, children, config: configOverrides, showRag, showAgent, }: YuktAIWrapperProps): react_jsx_runtime.JSX.Element;

declare const aiPlugin: {
    name: string;
    execute(input: string): Promise<string>;
};

declare const voicePlugin: {
    name: string;
    execute(input: string): Promise<string>;
};

interface GridColumn<T = Record<string, unknown>> {
    key: keyof T & string;
    label: string;
    sortable?: boolean;
    filterable?: boolean;
    hiddenOnMobile?: boolean;
    pinned?: boolean;
    width?: number | string;
    render?: (value: T[keyof T], row: T, index: number) => ReactNode;
    align?: "left" | "center" | "right";
    type?: "text" | "number" | "date" | "boolean" | "badge";
}
type SortDirection = "asc" | "desc" | null;
interface SortConfig {
    key: string;
    direction: SortDirection;
}
type FilterOperator = "contains" | "equals" | "startsWith" | "endsWith" | "greaterThan" | "lessThan" | "between";
interface FilterConfig {
    key: string;
    operator: FilterOperator;
    value: string | number | [number, number];
}
type ViewMode = "table" | "card" | "auto";
type GridTheme = "default" | "high-contrast" | "dark" | "color-blind" | "dyslexia";
type GridLocale = "en-IN" | "en-US" | "te-IN" | "hi-IN" | "ta-IN" | "bn-IN" | "mr-IN" | "kn-IN" | "ml-IN" | "gu-IN" | "pa-IN" | "ur-IN";
interface AIFeatures {
    search?: boolean;
    summary?: boolean;
    anomaly?: boolean;
    suggest?: boolean;
}
interface VoiceFeatures {
    control?: boolean;
    speakOnFocus?: boolean;
    speakSummary?: boolean;
    language?: string;
}
interface PaginationConfig {
    pageSize?: number;
    showSizeChanger?: boolean;
    sizeOptions?: number[];
}
interface GridTranslations {
    search: string;
    noData: string;
    loading: string;
    rowsSelected: string;
    page: string;
    of: string;
    showing: string;
    to: string;
    results: string;
    sort: string;
    filter: string;
    export: string;
    voice: string;
    ask: string;
}
interface YuktaiGridProps<T = Record<string, unknown>> {
    data: T[];
    columns: GridColumn<T>[];
    view?: ViewMode;
    mobileBreakpoint?: number;
    theme?: GridTheme;
    locale?: GridLocale;
    ai?: boolean | AIFeatures;
    voice?: boolean | VoiceFeatures;
    pagination?: boolean | PaginationConfig;
    search?: boolean;
    selectable?: boolean;
    selectedKeys?: string[];
    rowKey?: keyof T & string;
    loading?: boolean;
    empty?: ReactNode;
    highlightIds?: (string | number)[];
    highlightColor?: string;
    autoScrollToHighlight?: boolean;
    onSelectionChange?: (keys: string[]) => void;
    onRowClick?: (row: T, index: number) => void;
    onSortChange?: (sort: SortConfig | null) => void;
    className?: string;
    /** Voice input language of the embedded assistant (default: follows `locale`). */
    inputLanguage?: "en-US" | "te-IN";
    /** Prefix for tool names, e.g. "ratnalabala_poems" → "ratnalabala_poems_search". */
    toolName?: string;
    /** Agent-facing tool descriptions, e.g. { search: "Search Telugu poems by title or text." } */
    toolDescriptions?: Partial<Record<"search" | "count" | "columns" | "get_row" | "highlight" | "select" | "open" | "filter" | "clear_filters" | "sort" | "clear_sort", string>>;
    /**
     * Expose the grid's tools to AI agents via WebMCP (document.modelContext).
     * Uses exactly the same tools as the embedded assistant.
     */
    webmcp?: boolean;
    /** Real WebMCP registration status (state, registered tools, errors). */
    onWebMCPStatusChange?: (status: {
        state: "unsupported" | "registering" | "ready" | "partial" | "error";
        registered: string[];
        errors: {
            tool: string;
            message: string;
        }[];
    }) => void;
    /** Every result from the Agent (assistant or WebMCP), e.g. for logging. */
    onAgentResult?: (result: {
        success: boolean;
        message: string;
        tool?: string;
    }) => void;
}

declare function YuktaiGrid<T extends Record<string, unknown>>({ data, columns, rowKey, view, mobileBreakpoint, theme, locale, ai, search, selectable, selectedKeys, onSelectionChange, pagination, loading, highlightIds, highlightColor, autoScrollToHighlight, onRowClick, onSortChange, empty, className, inputLanguage, toolName, toolDescriptions, webmcp, onWebMCPStatusChange, onAgentResult, }: YuktaiGridProps<T>): react_jsx_runtime.JSX.Element;

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
type GridToolColumn = {
    key: string;
    label: string;
    type?: "text" | "number" | "date";
};
type GridToolErrorCode = "NOT_FOUND" | "NOT_SUPPORTED" | "INVALID_INPUT" | "INTERNAL";
type GridToolFilterOperator = "contains" | "equals" | "startsWith" | "endsWith" | "greaterThan" | "lessThan" | "between";
type GridToolFilter = {
    key: string;
    operator: GridToolFilterOperator;
    value: string | number | [number, number];
};
type GridToolSort = {
    key: string;
    direction: "asc" | "desc";
};
/** Language of `message` (shown to people). Agent descriptions stay English. */
type GridToolLocale = "en" | "te";
type GridToolContext<T> = {
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
type GridToolResult<T = unknown> = {
    success: boolean;
    message: string;
    data?: T;
    error?: {
        code: GridToolErrorCode;
    };
};
/** A tool ready for the Agent and for WebMCP `registerTool`. */
type GridTool = {
    name: string;
    title: string;
    /** For AI agents (English works best for tool selection). Never shown in the UI. */
    description: string;
    /** Short label for the UI, in the grid's locale. */
    label: string;
    inputSchema: Record<string, unknown>;
    execute: (input: Record<string, unknown>) => Promise<GridToolResult>;
};
type CreateGridToolsOptions = {
    /** Tool name prefix, e.g. "ratnalabala_poems" → "ratnalabala_poems_search". */
    name?: string;
    /** Override agent descriptions per tool, keyed by the short tool id ("search", "open", …). */
    descriptions?: Partial<Record<GridToolId, string>>;
};
type GridToolId = "search" | "count" | "columns" | "get_row" | "highlight" | "select" | "open" | "filter" | "clear_filters" | "sort" | "clear_sort";
/** The single row-ID rule used by every tool. */
declare function getRowId(row: unknown, rowKey?: string): string;
/**
 * Applies filters to rows — exported so YuktaiGrid filters its rows with
 * exactly the same rules the filter tool uses to count matches.
 */
declare function applyGridFilters<T>(data: T[], columns: GridToolColumn[], filters: GridToolFilter[]): T[];
/** Maps grid columns (any type) to tool columns (text / number / date). */
declare function toGridToolColumns(columns: {
    key: string;
    label: string;
    type?: string;
}[]): GridToolColumn[];
declare function searchGrid<T extends Record<string, unknown>>(context: GridToolContext<T>, query: string): GridToolResult<T[]>;
declare function countGrid<T>(context: GridToolContext<T>): GridToolResult<number>;
declare function getColumns<T>(context: GridToolContext<T>): GridToolResult<GridToolColumn[]>;
declare function getRow<T extends Record<string, unknown>>(context: GridToolContext<T>, id: string): GridToolResult<T>;
declare function highlightRows<T extends Record<string, unknown>>(context: GridToolContext<T>, ids: string[]): GridToolResult<string[]>;
declare function selectRow<T extends Record<string, unknown>>(context: GridToolContext<T>, id: string): GridToolResult<string>;
declare function openRow<T extends Record<string, unknown>>(context: GridToolContext<T>, id: string): GridToolResult<string>;
declare function filterGrid<T extends Record<string, unknown>>(context: GridToolContext<T>, filter: GridToolFilter): GridToolResult<{
    filters: GridToolFilter[];
    count: number;
}>;
declare function clearFilters<T>(context: GridToolContext<T>): GridToolResult<GridToolFilter[]>;
declare function sortGrid<T>(context: GridToolContext<T>, key: string, direction?: "asc" | "desc"): GridToolResult<GridToolSort>;
declare function clearSort<T>(context: GridToolContext<T>): GridToolResult<null>;
/**
 * Builds the tool list used by BOTH the Agent and WebMCP.
 * Only tools the grid can actually perform are included — e.g. "open" is
 * left out when no onOpenRow callback is given — so agents never see a tool
 * that would just return NOT_SUPPORTED.
 */
declare function createGridTools<T extends Record<string, unknown>>(context: GridToolContext<T>, options?: CreateGridToolsOptions): GridTool[];

interface UseGridOptions<T> {
    data: T[];
    columns: GridColumn<T>[];
    pagination?: boolean | PaginationConfig;
    mobileBreakpoint?: number;
    /** Locale for text sorting, e.g. "te-IN" (default: browser locale) */
    locale?: string;
    /** Starting filters (optional) */
    initialFilters?: GridToolFilter[];
}
interface UseGridReturn<T> {
    displayedData: T[];
    /** All matching rows (search + filters + sort), before pagination */
    rows: T[];
    totalCount: number;
    filteredCount: number;
    sort: SortConfig | null;
    toggleSort: (key: string) => void;
    /** Set sort directly (null clears it) */
    setSort: (sort: SortConfig | null) => void;
    clearSort: () => void;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    filters: GridToolFilter[];
    setFilters: (filters: GridToolFilter[]) => void;
    /** Add or replace the filter for one column */
    setFilter: (filter: GridToolFilter) => void;
    /** Remove the filter for one column */
    removeFilter: (key: string) => void;
    clearFilters: () => void;
    page: number;
    pageSize: number;
    totalPages: number;
    setPage: (p: number) => void;
    setPageSize: (s: number) => void;
    isMobile: boolean;
    reset: () => void;
}
declare function useGrid<T extends Record<string, unknown>>(options: UseGridOptions<T>): UseGridReturn<T>;

type Language = "en-US" | "te-IN";
interface YuktaiGridAIProps<T> {
    data: T[];
    columns: {
        key: string;
        label: string;
        type?: "number" | "text" | "date";
    }[];
    /**
     * Used only when no `agent` is given (4.6.x behaviour).
     * With an agent, every action goes through agent.ask() instead.
     */
    onSearch?: (query: string) => void;
    onSort?: (key: string, dir: "asc" | "desc") => void;
    theme?: "light" | "dark";
    /**
     * Language of AI UI and AI responses.
     * Default: English.
     */
    language?: Language;
    /**
     * Language used by browser voice recognition.
     * Default: English.
     */
    inputLanguage?: Language;
    /**
     * When true, AI is rendered inside the grid.
     * When false, AI uses the floating assistant UI.
     */
    embedded?: boolean;
    /**
     * The grid Agent (from useYuktaiGridAgent). When given, search / sort /
     * filter / open / clear requests are sent to agent.ask() — the same
     * pipeline WebMCP uses — and the Agent's result message is shown.
     * Questions like "highest / average / total" are still answered here.
     */
    agent?: {
        ask: (text: string) => Promise<{
            success: boolean;
            message: string;
        }>;
        loading?: boolean;
    };
    /** Called when the person switches the voice input language. */
    onInputLanguageChange?: (language: Language) => void;
}
declare function YuktaiGridAI<T extends Record<string, unknown>>({ data, columns, onSearch, onSort, theme, language, inputLanguage, embedded, agent, onInputLanguageChange, }: YuktaiGridAIProps<T>): react_jsx_runtime.JSX.Element;

type ModelContextTool = {
    name: string;
    title: string;
    description: string;
    inputSchema: Record<string, unknown>;
    execute: (input: any) => Promise<unknown> | unknown;
};
declare global {
    interface Document {
        modelContext?: {
            registerTool: (tool: ModelContextTool, options?: {
                signal?: AbortSignal;
            }) => Promise<void>;
        };
    }
}
type WebMCPState = "unsupported" | "registering" | "ready" | "partial" | "error";
type WebMCPStatus = {
    state: WebMCPState;
    /** Tools that the browser actually accepted */
    registered: string[];
    errors: {
        tool: string;
        message: string;
    }[];
};
type WebMCPColumn = {
    key: string;
    label: string;
    type?: "text" | "number" | "date";
};
type YuktaiGridWebMCPProps<T> = {
    /**
     * Ready-made tools (YuktaiGrid passes its own list here). When given,
     * data/columns/callbacks below are not needed.
     */
    tools?: GridTool[];
    data?: T[];
    columns?: WebMCPColumn[];
    rowKey?: string;
    locale?: GridToolLocale;
    onSelectRow?: (id: string) => void;
    onHighlightRows?: (ids: string[]) => void;
    onOpenRow?: (id: string) => void;
    /** Tool name prefix (default "yuktai_grid") */
    name?: string;
    /** Agent-facing descriptions per tool, e.g. { search: "Search Telugu poems…" } */
    descriptions?: CreateGridToolsOptions["descriptions"];
    /** Called whenever the registration status changes */
    onStatusChange?: (status: WebMCPStatus) => void;
};
declare function YuktaiGridWebMCP<T extends Record<string, unknown>>({ tools: toolsProp, data, columns, rowKey, locale, onSelectRow, onHighlightRows, onOpenRow, name, descriptions, onStatusChange, }: YuktaiGridWebMCPProps<T>): null;

type GridAgentTool = {
    name: string;
    description: string;
    /** Optional UI label (e.g. Telugu). createGridTools() provides it. */
    label?: string;
    /** Optional JSON schema; its `required` list is checked before running. */
    inputSchema?: Record<string, unknown>;
    execute: (input: Record<string, unknown>) => Promise<unknown> | unknown;
};
type GridAgentErrorCode = GridToolErrorCode | "NOT_UNDERSTOOD";
type GridAgentResult<T = unknown> = Omit<GridToolResult<T>, "error"> & {
    error?: {
        code: GridAgentErrorCode;
    };
    /** Full name of the tool that produced this result */
    tool?: string;
};
type GridAgentStep = {
    id: number;
    tool: string;
    input: Record<string, unknown>;
    result: GridAgentResult;
    source: "tool" | "ask";
    at: number;
};
type GridIntent = {
    kind: "tool";
    tool: string;
    input: Record<string, unknown>;
}
/** "open <something>": search for it, then open the first match */
 | {
    kind: "open";
    text: string;
};
type GridIntentContext = {
    columns: {
        key: string;
        label: string;
    }[];
    locale: GridToolLocale;
};
type YuktaiGridAgentProps = {
    tools: GridAgentTool[];
    onResult?: (result: GridAgentResult) => void;
    onError?: (error: Error) => void;
    /** Language of the agent's own messages (default "en"). */
    locale?: GridToolLocale;
    /** Columns, so ask() can understand "sort by <column>". */
    columns?: {
        key: string;
        label: string;
    }[];
    /** Row ID field — must match the grid's rowKey (default "id"). */
    rowKey?: string;
    /** Replace the built-in regex intent parser (e.g. with an on-device LLM). */
    parseIntent?: (text: string, context: GridIntentContext) => GridIntent | null;
    /** How many steps to keep in history (default 20). */
    historyLimit?: number;
};
/** Built-in parser: exported so it can be tested and reused. */
declare function parseGridIntent(text: string, context: GridIntentContext): GridIntent | null;
declare function useYuktaiGridAgent({ tools, onResult, onError, locale, columns, rowKey, parseIntent, historyLimit, }: YuktaiGridAgentProps): {
    loading: boolean;
    tools: GridAgentTool[];
    executeTool: (name: string, input?: Record<string, unknown>) => Promise<GridAgentResult<unknown>>;
    ask: (text: string) => Promise<GridAgentResult>;
    lastResult: GridAgentResult<unknown> | null;
    lastError: Error | null;
    history: GridAgentStep[];
    clearHistory: () => void;
};

interface IconProps extends React.SVGAttributes<SVGSVGElement> {
    /** Size in pixels — applied to both width and height. Default: 20 */
    size?: number | string;
    /** Stroke color — defaults to currentColor (inherits from parent) */
    color?: string;
    /** Stroke width override — default: 2.5 */
    strokeWidth?: number;
    /** Accessible label — if provided, icon becomes non-decorative */
    label?: string;
}
/**
 * Shared base for all yuktai icons.
 * Children should be SVG path/circle/rect elements.
 */
declare function IconBase({ size, color, strokeWidth, label, children, ...rest }: IconProps & {
    children: React.ReactNode;
}): react_jsx_runtime.JSX.Element;

declare function SearchIcon(props: IconProps): react_jsx_runtime.JSX.Element;

declare function SortUpIcon(props: IconProps): react_jsx_runtime.JSX.Element;

declare function SortDownIcon(props: IconProps): react_jsx_runtime.JSX.Element;

declare function ChevronLeftIcon(props: IconProps): react_jsx_runtime.JSX.Element;

declare function ChevronRightIcon(props: IconProps): react_jsx_runtime.JSX.Element;

declare function CheckIcon(props: IconProps): react_jsx_runtime.JSX.Element;

declare function CloseIcon(props: IconProps): react_jsx_runtime.JSX.Element;

declare global {
    var __yuktai_runtime__: Runtime | undefined;
}
declare const YuktAI: {
    wcagPlugin: {
        name: string;
        version: string;
        observer: MutationObserver | null;
        execute(config: A11yConfig): Promise<string>;
        applyFixes(config: A11yConfig): A11yReport;
        scan(): A11yReport;
        startObserver(config: A11yConfig): void;
        stopObserver(): void;
        announce: (message: string, type?: AlertType, useSpeech?: boolean) => void;
        speak: (text: string, priority?: "polite" | "assertive") => void;
        showVisualAlert: (message: string, type?: AlertType) => void;
        trapFocus: (modal: HTMLElement) => void;
        handlePlainEnglish: (enabled: boolean) => Promise<void>;
        handleSummarisePage: (enabled: boolean) => Promise<void>;
        handleTranslate: (language: string) => Promise<void>;
        handleVoiceControl: (enabled: boolean) => Promise<void>;
        handleSmartLabels: (enabled: boolean) => Promise<void>;
        SUPPORTED_LANGUAGES: {
            code: string;
            label: string;
        }[];
    };
    list(): string[];
    use(name: string): Plugin | undefined;
    fix(config?: Partial<A11yConfig>): A11yReport;
    scan(): A11yReport;
};

export { type A11yConfig, type A11yFix, type A11yReport, type AIFeatures, CheckIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon, type ColorBlindMode, type CreateGridToolsOptions, type FilterConfig, type FilterOperator, type GridAgentErrorCode, type GridAgentResult, type GridAgentStep, type GridAgentTool, type GridColumn, type GridIntent, type GridIntentContext, type GridLocale, type GridTheme, type GridTool, type GridToolColumn, type GridToolContext, type GridToolErrorCode, type GridToolFilter, type GridToolFilterOperator, type GridToolId, type GridToolLocale, type GridToolResult, type GridToolSort, type GridTranslations, IconBase, type IconProps, type PaginationConfig, Runtime, SearchIcon, type Severity, type SortConfig, type SortDirection, SortDownIcon, SortUpIcon, type UseGridOptions, type UseGridReturn, type ViewMode, type VoiceFeatures, type WebMCPState, type WebMCPStatus, YuktAI, YuktAIWrapper, type YuktAIWrapperProps, YuktaiGrid, YuktaiGridAI, type YuktaiGridAIProps, useYuktaiGridAgent as YuktaiGridAgent, type YuktaiGridAgentProps, type YuktaiGridProps, YuktaiGridWebMCP, type YuktaiGridWebMCPProps, aiPlugin, applyGridFilters, clearFilters, clearSort, countGrid, createGridTools, YuktAIWrapper as default, filterGrid, getColumns, getRow, getRowId, highlightRows, openRow, parseGridIntent, searchGrid, selectRow, sortGrid, toGridToolColumns, useGrid, useYuktaiGridAgent, voicePlugin, wcagPlugin as wcag, wcagPlugin };
