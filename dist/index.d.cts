import React from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';

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

/**
 * Metadata for the YuktAI reporting engine
 */
interface A11yReport {
    fixes: number;
    nodes: number;
    renderTime: number;
}
/**
 * Universal DOM Accessibility Fixer (A, AA, AAA compliant)
 * Deep-walks the React tree to inject compliance attributes.
 */
declare function render(element: React.ReactNode, enabled?: boolean, report?: A11yReport): React.ReactNode;

declare function YuktAIWrapper({ children }: {
    children?: React.ReactNode;
}): react_jsx_runtime.JSX.Element;

declare global {
    var __yuktai_runtime__: Runtime | undefined;
}
declare const YuktAI: {
    render: typeof render;
    list(): string[];
    use(name: string): Plugin | undefined;
};

export { YuktAI, YuktAIWrapper, YuktAI as default };
