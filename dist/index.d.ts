import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

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
};

interface YuktAIWrapperProps {
    children?: ReactNode;
    position?: "left" | "right";
}
declare function YuktAIWrapper({ children, position }: YuktAIWrapperProps): react_jsx_runtime.JSX.Element;

declare const aiPlugin: {
    name: string;
    execute(input: string): Promise<string>;
};

declare const voicePlugin: {
    name: string;
    execute(input: string): Promise<string>;
};

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
    };
    list(): string[];
    use(name: string): Plugin | undefined;
    fix(config?: Partial<A11yConfig>): A11yReport;
    scan(): A11yReport;
};

export { type A11yConfig, type A11yFix, type A11yReport, type ColorBlindMode, Runtime, type Severity, YuktAI, YuktAIWrapper, type YuktAIWrapperProps, aiPlugin, YuktAIWrapper as default, voicePlugin, wcagPlugin as wcag, wcagPlugin };
