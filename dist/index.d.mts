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
}

type YuktaiGridPropsWithHighlight<T extends Record<string, unknown>> = YuktaiGridProps<T> & {
    highlightIds?: (string | number)[];
    highlightColor?: string;
    autoScrollToHighlight?: boolean;
};
declare function YuktaiGrid<T extends Record<string, unknown>>({ data, columns, rowKey, view, mobileBreakpoint, theme, locale, search, selectable, selectedKeys, onSelectionChange, pagination, loading, highlightIds, highlightColor, autoScrollToHighlight, onRowClick, onSortChange, empty, className, }: YuktaiGridPropsWithHighlight<T>): react_jsx_runtime.JSX.Element;

interface UseGridOptions<T> {
    data: T[];
    columns: GridColumn<T>[];
    pagination?: boolean | PaginationConfig;
    mobileBreakpoint?: number;
}
interface UseGridReturn<T> {
    displayedData: T[];
    totalCount: number;
    filteredCount: number;
    sort: SortConfig | null;
    toggleSort: (key: string) => void;
    clearSort: () => void;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    page: number;
    pageSize: number;
    totalPages: number;
    setPage: (p: number) => void;
    setPageSize: (s: number) => void;
    isMobile: boolean;
    reset: () => void;
}
declare function useGrid<T extends Record<string, unknown>>(options: UseGridOptions<T>): UseGridReturn<T>;

interface YuktaiGridAIProps<T> {
    data: T[];
    columns: {
        key: string;
        label: string;
        type?: "number" | "text" | "date";
    }[];
    onSearch: (query: string) => void;
    onSort?: (key: string, dir: "asc" | "desc") => void;
    theme?: "light" | "dark";
    language?: "en-US" | "en-IN" | "hi-IN" | "te-IN";
}
declare function YuktaiGridAI<T extends Record<string, unknown>>({ data, columns, onSearch, onSort, theme, language, }: YuktaiGridAIProps<T>): react_jsx_runtime.JSX.Element;

declare global {
    interface Document {
        modelContext?: {
            registerTool: (tool: {
                name: string;
                title: string;
                description: string;
                inputSchema: Record<string, unknown>;
                execute: (input: any) => Promise<unknown> | unknown;
            }, options?: {
                signal?: AbortSignal;
            }) => Promise<void>;
        };
    }
}
type WebMCPColumn = {
    key: string;
    label: string;
    type?: "text" | "number" | "date";
};
type YuktaiGridWebMCPProps<T> = {
    data: T[];
    columns: WebMCPColumn[];
    name?: string;
    onSelectRow?: (id: string) => void;
    onHighlightRows?: (ids: string[]) => void;
    onOpenRow?: (id: string) => void;
};
declare function YuktaiGridWebMCP<T extends Record<string, unknown>>({ data, columns, name, onSelectRow, onHighlightRows, onOpenRow, }: YuktaiGridWebMCPProps<T>): null;

type GridAgentTool = {
    name: string;
    description: string;
    execute: (input: Record<string, unknown>) => Promise<unknown> | unknown;
};
type YuktaiGridAgentProps = {
    tools: GridAgentTool[];
    onResult?: (result: unknown) => void;
    onError?: (error: Error) => void;
};
declare function useYuktaiGridAgent({ tools, onResult, onError, }: YuktaiGridAgentProps): {
    loading: boolean;
    tools: GridAgentTool[];
    executeTool: (name: string, input?: Record<string, unknown>) => Promise<unknown>;
};

type GridToolColumn = {
    key: string;
    label: string;
    type?: "text" | "number" | "date";
};
type GridToolContext<T> = {
    data: T[];
    columns: GridToolColumn[];
    onSelectRow?: (id: string) => void;
    onHighlightRows?: (ids: string[]) => void;
    onOpenRow?: (id: string) => void;
};
type GridToolResult<T = unknown> = {
    success: boolean;
    message: string;
    data?: T;
};
declare function searchGrid<T extends Record<string, unknown>>(context: GridToolContext<T>, query: string): GridToolResult<T[]>;
declare function countGrid<T>(context: GridToolContext<T>): GridToolResult<number>;
declare function getColumns<T>(context: GridToolContext<T>): GridToolResult<GridToolColumn[]>;
declare function getRow<T extends Record<string, unknown>>(context: GridToolContext<T>, id: string): GridToolResult<T>;
declare function highlightRows<T extends Record<string, unknown>>(context: GridToolContext<T>, ids: string[]): GridToolResult<string[]>;
declare function selectRow<T extends Record<string, unknown>>(context: GridToolContext<T>, id: string): GridToolResult<string>;
declare function openRow<T extends Record<string, unknown>>(context: GridToolContext<T>, id: string): GridToolResult<string>;

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

export { type A11yConfig, type A11yFix, type A11yReport, type AIFeatures, CheckIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon, type ColorBlindMode, type FilterConfig, type FilterOperator, type GridAgentTool, type GridColumn, type GridLocale, type GridTheme, type GridToolColumn, type GridToolContext, type GridToolResult, type GridTranslations, IconBase, type IconProps, type PaginationConfig, Runtime, SearchIcon, type Severity, type SortConfig, type SortDirection, SortDownIcon, SortUpIcon, type ViewMode, type VoiceFeatures, YuktAI, YuktAIWrapper, type YuktAIWrapperProps, YuktaiGrid, YuktaiGridAI, type YuktaiGridAIProps, useYuktaiGridAgent as YuktaiGridAgent, type YuktaiGridAgentProps, type YuktaiGridProps, YuktaiGridWebMCP, type YuktaiGridWebMCPProps, aiPlugin, countGrid, YuktAIWrapper as default, getColumns, getRow, highlightRows, openRow, searchGrid, selectRow, useGrid, useYuktaiGridAgent, voicePlugin, wcagPlugin as wcag, wcagPlugin };
