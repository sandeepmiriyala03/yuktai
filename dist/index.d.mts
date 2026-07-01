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
declare function YuktaiGrid<T extends Record<string, unknown>>({ data, columns, onSearch, onSort, theme, language, }: YuktaiGridAIProps<T>): react_jsx_runtime.JSX.Element;

interface GridColumn<T = Record<string, unknown>> {
    /** Unique key — must match a property in your data */
    key: keyof T & string;
    /** Display label for the header */
    label: string;
    /** Allow sorting on this column (default: true) */
    sortable?: boolean;
    /** Allow filtering on this column (default: true) */
    filterable?: boolean;
    /** Hide this column on mobile (default: false) */
    hiddenOnMobile?: boolean;
    /** Pin this column on tablet view */
    pinned?: boolean;
    /** Column width — number (px) or string (%, fr) */
    width?: number | string;
    /** Custom cell renderer */
    render?: (value: T[keyof T], row: T, index: number) => ReactNode;
    /** Cell alignment */
    align?: "left" | "center" | "right";
    /** Type — affects default formatting and filter UI */
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
    /** Enable AI semantic search */
    search?: boolean;
    /** Enable AI row summary */
    summary?: boolean;
    /** Enable anomaly detection */
    anomaly?: boolean;
    /** Enable suggestions */
    suggest?: boolean;
}
interface VoiceFeatures {
    /** Voice commands for search/filter/sort */
    control?: boolean;
    /** Read rows aloud on focus */
    speakOnFocus?: boolean;
    /** Read filtered data summary aloud */
    speakSummary?: boolean;
    /** Voice language (defaults to locale) */
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
    /** The data to display */
    data: T[];
    /** Column definitions */
    columns: GridColumn<T>[];
    /** View mode — "auto" picks based on screen size */
    view?: ViewMode;
    /** Mobile breakpoint in pixels (default: 768) */
    mobileBreakpoint?: number;
    /** WCAG theme (default: "default") */
    theme?: GridTheme;
    /** Locale (default: "en-US") */
    locale?: GridLocale;
    /** AI features */
    ai?: boolean | AIFeatures;
    /** Voice features */
    voice?: boolean | VoiceFeatures;
    /** Pagination */
    pagination?: boolean | PaginationConfig;
    /** Show search bar */
    search?: boolean;
    /** Multi-row selection */
    selectable?: boolean;
    /** Selected row keys */
    selectedKeys?: string[];
    /** Row key field (default: "id") */
    rowKey?: keyof T & string;
    /** Loading state */
    loading?: boolean;
    /** Custom empty state */
    empty?: ReactNode;
    /** Callbacks */
    onSelectionChange?: (keys: string[]) => void;
    onRowClick?: (row: T, index: number) => void;
    onSortChange?: (sort: SortConfig | null) => void;
    /** Custom className */
    className?: string;
}

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

export { type A11yConfig, type A11yFix, type A11yReport, type AIFeatures, CheckIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon, type ColorBlindMode, type FilterConfig, type FilterOperator, type GridColumn, type GridLocale, type GridTheme, type GridTranslations, IconBase, type IconProps, type PaginationConfig, Runtime, SearchIcon, type Severity, type SortConfig, type SortDirection, SortDownIcon, SortUpIcon, type ViewMode, type VoiceFeatures, YuktAI, YuktAIWrapper, type YuktAIWrapperProps, YuktaiGrid, type YuktaiGridProps, aiPlugin, YuktAIWrapper as default, useGrid, voicePlugin, wcagPlugin as wcag, wcagPlugin };
