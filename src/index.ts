

import { Runtime } from "./runtime/runtime";
import { aiPlugin } from "./plugins/ai";
import { voicePlugin } from "./plugins/voice";
import { ocrSmartPlugin } from "./plugins/ocr";
import { wcagPlugin } from './plugins/wcag';
// 🔹 Extend global safely
declare global {
  var __yuktai_runtime__: Runtime | undefined;
}

// 🔹 Singleton runtime
function getRuntime(): Runtime {
  if (!globalThis.__yuktai_runtime__) {
    const runtime = new Runtime();

    runtime.register(aiPlugin.name, aiPlugin);
    runtime.register(voicePlugin.name, voicePlugin);
    runtime.register(ocrSmartPlugin.name, ocrSmartPlugin);
    runtime.register(wcagPlugin.name, wcagPlugin);
    globalThis.__yuktai_runtime__ = runtime;
  }

  return globalThis.__yuktai_runtime__;
}

const runtime = getRuntime();

// ✅ Public API
const YuktAI = {


  list(): string[] {
    return runtime.getPlugins();
  }
};

export default YuktAI;