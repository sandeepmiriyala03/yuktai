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
 * Layer 2: Global DOM Renderer
 * Renders React into the DOM with auto-fixes applied.
 */
declare function render(element: React.ReactNode, selector: string): void;

interface YuktAIWrapperProps {
    children?: React.ReactNode;
}
declare function YuktAIWrapper({ children }: YuktAIWrapperProps): react_jsx_runtime.JSX.Element;

declare global {
    var __yuktai_runtime__: Runtime | undefined;
}
declare const YuktAI: {
    render: typeof render;
    list(): string[];
    use(name: string): Plugin | undefined;
};

export { YuktAI, YuktAIWrapper, YuktAI as default };
