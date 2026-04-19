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

interface A11yConfig {
    enabled: boolean;
    highContrast?: boolean;
    reduceMotion?: boolean;
    autoFix?: boolean;
    fontSizeMultiplier?: number;
    colorBlindMode?: "none" | "deuteranopia" | "protanopia" | "tritanopia" | "achromatopsia";
    keyboardHints?: boolean;
}
interface A11yReport {
    fixed: number;
    scanned: number;
    details: {
        tag: string;
        fix: string;
        element: string;
    }[];
}

declare function YuktAIWrapper({ children }: {
    children?: ReactNode;
}): react_jsx_runtime.JSX.Element;

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
        removeColorBlindSvg(): void;
        startObserver(config: A11yConfig): void;
        stopObserver(): void;
        ensureLiveRegion(): void;
        removeLiveRegion(): void;
        announce(msg: string): void;
    };
    list(): string[];
    use(name: string): Plugin | undefined;
};

export { YuktAI, YuktAIWrapper, YuktAI as default };
