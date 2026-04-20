// ─────────────────────────────────────────────────────────────────────────────
// @yuktishaalaa/yuktai · src/index.ts
// Main entry point — exports everything the consumer needs.
// DO NOT add "use client" here — this is a package entry, not a React component.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Core engine ─────────────────────────────────────────────────────────────
export { wcagPlugin } from "./core/renderer";
export type {
  A11yConfig,
  A11yReport,
  A11yFix,
  Severity,
  ColorBlindMode,
} from "./core/renderer";

// ─── React / Next.js wrapper ─────────────────────────────────────────────────
export * from "./next/YuktAIWrapper";
export { default } from "./next/YuktAIWrapper";

// ─── Plugins ─────────────────────────────────────────────────────────────────
export { aiPlugin } from "./plugins/ai";
export { voicePlugin } from "./plugins/voice";


// Optional alias
export { wcagPlugin as wcag } from "./core/renderer";

// ─── Runtime ─────────────────────────────────────────────────────────────────
export { Runtime } from "./runtime/runtime";

// ─── Singleton runtime — initialised once, shared across the app ─────────────
import { Runtime } from "./runtime/runtime";
import { aiPlugin } from "./plugins/ai";
import { voicePlugin } from "./plugins/voice";

import { wcagPlugin } from "./core/renderer";

declare global {
  // eslint-disable-next-line no-var
  var __yuktai_runtime__: Runtime | undefined;
}

function getRuntime(): Runtime {
  if (typeof globalThis === "undefined") return new Runtime();

  if (!globalThis.__yuktai_runtime__) {
    const runtime = new Runtime();

    runtime.register(wcagPlugin.name, wcagPlugin);
    runtime.register(aiPlugin.name, aiPlugin);
    runtime.register(voicePlugin.name, voicePlugin);

    globalThis.__yuktai_runtime__ = runtime;
  }

  return globalThis.__yuktai_runtime__;
}

// Only initialise runtime on client side
const runtime =
  typeof window !== "undefined" ? getRuntime() : new Runtime();

// ─── Public YuktAI API ───────────────────────────────────────────────────────
export const YuktAI = {
  wcagPlugin,

  list(): string[] {
    return runtime.getPlugins();
  },

  use(name: string) {
    return runtime.use(name);
  },

  fix(config?: Partial<import("./core/renderer").A11yConfig>) {
    return wcagPlugin.applyFixes({
      enabled: true,
      autoFix: true,
      ...config,
    });
  },

  scan() {
    return wcagPlugin.scan();
  },
};