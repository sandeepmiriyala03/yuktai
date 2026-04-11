// src/runtime/runtime.ts
var Runtime = class {
  constructor() {
    this.plugins = /* @__PURE__ */ new Map();
  }
  register(name, plugin) {
    this.plugins.set(name, plugin);
  }
  async run(task, input) {
    const plugin = this.plugins.get(task);
    if (!plugin) {
      throw new Error(`Plugin not found: ${task}`);
    }
    return plugin.execute(input);
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
var LANG_GROUPS = {
  indic: ["hin", "tel", "tam", "kan", "mal", "ben", "guj", "pan", "mar"],
  latin: ["eng", "fra", "deu", "spa", "por", "ita", "nld", "swe", "tur"],
  cjk: ["chi_sim", "chi_tra", "jpn", "kor"],
  other: ["ara", "rus", "tha", "urd", "vie"]
};
function detectCandidates(buffer) {
  const bytes = new Uint8Array(buffer.slice(0, 2e3));
  const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  if (/[\u0C00-\u0C7F]/.test(text)) return LANG_GROUPS.indic;
  if (/[\u0900-\u097F]/.test(text)) return LANG_GROUPS.indic;
  if (/[\u0B80-\u0BFF]/.test(text)) return LANG_GROUPS.indic;
  if (/[\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/.test(text)) return LANG_GROUPS.cjk;
  if (/[\u0600-\u06FF]/.test(text)) return ["ara", "urd"];
  if (/[\u0400-\u04FF]/.test(text)) return ["rus"];
  return ["eng", "hin", "tel"];
}
var ocrSmartPlugin = {
  name: "image.ocr.smart",
  async execute(input) {
    try {
      if (!input?.file) return "\u274C No file provided";
      const blob = input.file instanceof Blob ? input.file : new Blob([input.file], { type: input.type ?? "image/png" });
      const candidates = detectCandidates(await blob.arrayBuffer());
      const workers = await Promise.all(
        candidates.slice(0, 4).map(
          (lang) => Tesseract.createWorker([lang], 1, {
            // ✅ Remove corePath/workerPath — v6 resolves these automatically
            langPath: "https://tessdata.projectnaptha.com/4.0.0",
            cacheMethod: "readwrite"
          })
        )
      );
      const results = await Promise.all(
        workers.map(async (worker, i) => {
          try {
            const { data } = await worker.recognize(blob);
            return {
              lang: candidates[i],
              text: data.text?.trim() ?? "",
              confidence: data.confidence ?? 0
            };
          } catch {
            return { lang: candidates[i], text: "", confidence: 0 };
          } finally {
            await worker.terminate();
          }
        })
      );
      const best = results.reduce(
        (a, b) => b.confidence > a.confidence ? b : a
      );
      if (!best.text) return "\u26A0\uFE0F No text detected";
      return {
        language: best.lang,
        confidence: Math.round(best.confidence),
        text: best.text
      };
    } catch (err) {
      console.error(err);
      return "\u274C OCR failed";
    }
  }
};

// src/index.ts
var globalAny = globalThis;
if (!globalAny.__yuktai_runtime__) {
  const runtime2 = new Runtime();
  runtime2.register(aiPlugin.name, aiPlugin);
  runtime2.register(voicePlugin.name, voicePlugin);
  runtime2.register(ocrSmartPlugin.name, ocrSmartPlugin);
  globalAny.__yuktai_runtime__ = runtime2;
}
var runtime = globalAny.__yuktai_runtime__;
var index_default = {
  run: (task, input) => runtime.run(task, input),
  // 🔥 Optional debug helper
  list: () => {
    return Array.from(runtime.plugins.keys());
  }
};
export {
  index_default as default
};
