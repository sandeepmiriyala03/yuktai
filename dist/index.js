// src/lifecycle/useYuktLifecycle.tsx
var YuktLifecycle = class {
  constructor(lifecycle) {
    this.lifecycle = lifecycle;
  }
  init() {
    this.lifecycle?.onInit?.();
  }
  process() {
    this.lifecycle?.onProcess?.();
  }
  generate() {
    this.lifecycle?.onGenerate?.();
  }
  execute() {
    this.lifecycle?.onExecute?.();
  }
  enhance() {
    this.lifecycle?.onEnhance?.();
  }
  render() {
    this.lifecycle?.onRender?.();
  }
  error(err) {
    this.lifecycle?.onError?.(err);
  }
};

// src/runtime/runtime.ts
var Runtime = class {
  constructor() {
    this.plugins = /* @__PURE__ */ new Map();
  }
  // 🔹 Register plugin safely
  register(name, plugin) {
    this.plugins.set(name, plugin);
  }
  // 🔹 Run task with lifecycle
  run(task, input, lifecycle) {
    const lc = new YuktLifecycle(lifecycle);
    try {
      lc.init();
      lc.process();
      const plugin = this.plugins.get(task);
      if (!plugin) {
        throw new Error(`Plugin not found: ${task}`);
      }
      lc.execute();
      const result = plugin.execute(input);
      lc.enhance();
      lc.render();
      return result;
    } catch (err) {
      lc.error(err);
      throw err;
    }
  }
  // 🔹 Safe plugin listing
  getPlugins() {
    return Array.from(this.plugins.keys());
  }
};

// src/plugins/ai.ts
var aiPlugin = {
  name: "ai.text",
  async execute(input) {
    return `\u{1F916} YuktAI says: ${input}`;
  }
};

// src/plugins/voice.ts
var voicePlugin = {
  name: "voice.text",
  async execute(input) {
    if (!input || input.trim() === "") {
      return "\u{1F3A4} No speech detected";
    }
    return `\u{1F3A4} You said: ${input}`;
  }
};

// src/plugins/ocr.ts
import Tesseract from "tesseract.js";
var worker = null;
var currentLang = null;
function detectLang(buffer) {
  const text = new TextDecoder("utf-8", { fatal: false }).decode(
    new Uint8Array(buffer.slice(0, 2e3))
  );
  if (/[\u0C00-\u0C7F]/.test(text)) return "tel";
  if (/[\u0900-\u097F]/.test(text)) return "hin";
  if (/[\u0B80-\u0BFF]/.test(text)) return "tam";
  if (/[\u4E00-\u9FFF]/.test(text)) return "chi_sim";
  if (/[\u3040-\u30FF]/.test(text)) return "jpn";
  if (/[\u0600-\u06FF]/.test(text)) return "ara";
  if (/[\u0400-\u04FF]/.test(text)) return "rus";
  return "eng";
}
async function getWorker(lang) {
  if (worker && currentLang === lang) return worker;
  if (worker) {
    await worker.terminate();
    worker = null;
  }
  worker = await Tesseract.createWorker({
    langPath: "/tessdata",
    // 🔥 BEST (self-host)
    // OR use:
    // langPath: "https://cdn.jsdelivr.net/npm/@tesseract.js-data/",
    logger: () => {
    }
  });
  await worker.loadLanguage(lang);
  await worker.initialize(lang);
  currentLang = lang;
  return worker;
}
var ocrSmartPlugin = {
  name: "image.ocr.smart",
  async execute(input) {
    try {
      if (!input?.file) return "\u274C No file provided";
      const blob = input.file instanceof Blob ? input.file : new Blob([input.file], {
        type: input.type ?? "image/png"
      });
      const lang = input.lang || detectLang(await blob.arrayBuffer()) || "eng";
      const workerInstance = await getWorker(lang);
      const { data } = await workerInstance.recognize(blob);
      const text = data.text?.trim();
      if (!text) return "\u26A0\uFE0F No text detected";
      return {
        language: lang,
        confidence: Math.round(data.confidence ?? 0),
        text
      };
    } catch (err) {
      console.error("[ocrSmartPlugin]", err);
      return "\u274C OCR failed";
    }
  }
};

// src/index.ts
function getRuntime() {
  if (!globalThis.__yuktai_runtime__) {
    const runtime2 = new Runtime();
    runtime2.register(aiPlugin.name, aiPlugin);
    runtime2.register(voicePlugin.name, voicePlugin);
    runtime2.register(ocrSmartPlugin.name, ocrSmartPlugin);
    globalThis.__yuktai_runtime__ = runtime2;
  }
  return globalThis.__yuktai_runtime__;
}
var runtime = getRuntime();
var YuktAI = {
  run(task, input, lifecycle) {
    return runtime.run(task, input, lifecycle);
  },
  list() {
    return runtime.getPlugins();
  }
};
var index_default = YuktAI;
export {
  index_default as default
};
