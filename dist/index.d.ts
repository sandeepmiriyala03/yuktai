interface Plugin {
    name: string;
    execute(input: any): any | Promise<any>;
}
declare class Runtime {
    private plugins;
    /**
     * 🔹 Register plugin safely
     * Ensures the plugin exists and has a valid execute function.
     */
    register(name: string, plugin: Plugin): void;
    /**
     * 🔹 Run task
     * Simplified execution without lifecycle event overhead.
     */
    run(task: string, input: unknown): Promise<unknown>;
    /**
     * 🔹 Safe plugin listing
     */
    getPlugins(): string[];
}

declare global {
    var __yuktai_runtime__: Runtime | undefined;
}
declare const YuktAI: {
    list(): string[];
};

export { YuktAI as default };
