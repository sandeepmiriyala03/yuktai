import { Runtime } from "./runtime/runtime";
import { aiPlugin } from "./plugins/ai";
import { voicePlugin } from "./plugins/voice";
import { ocrSmartPlugin } from "./plugins/ocr";

// 🔥 Create GLOBAL singleton (fixes Next.js duplication issue)
const globalAny = globalThis as any;

if (!globalAny.__yuktai_runtime__) {
  const runtime = new Runtime();

  // ✅ Register plugins ONLY once
  runtime.register(aiPlugin.name, aiPlugin);
  runtime.register(voicePlugin.name, voicePlugin);
  runtime.register(ocrSmartPlugin.name, ocrSmartPlugin);

  // Save globally
  globalAny.__yuktai_runtime__ = runtime;
}

// Use existing runtime
const runtime: Runtime = globalAny.__yuktai_runtime__;

// ✅ Export API
export default {
  run: (task: string, input: any) => runtime.run(task, input),

  // 🔥 Optional debug helper
  list: () => {
    return Array.from((runtime as any).plugins.keys());
  }
};