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
var ALL_LANGS = [
  { value: "ara", group: "other" },
  { value: "asm", group: "indic" },
  { value: "ben", group: "indic" },
  { value: "bod", group: "indic" },
  { value: "chi_sim", group: "cjk" },
  { value: "chi_tra", group: "cjk" },
  { value: "deu", group: "latin" },
  { value: "eng", group: "latin" },
  { value: "fra", group: "latin" },
  { value: "guj", group: "indic" },
  { value: "hin", group: "indic" },
  { value: "ita", group: "latin" },
  { value: "jpn", group: "cjk" },
  { value: "kan", group: "indic" },
  { value: "kor", group: "cjk" },
  { value: "mal", group: "indic" },
  { value: "mar", group: "indic" },
  { value: "nep", group: "indic" },
  { value: "nld", group: "latin" },
  { value: "ori", group: "indic" },
  { value: "pan", group: "indic" },
  { value: "por", group: "latin" },
  { value: "rus", group: "other" },
  { value: "san", group: "indic" },
  { value: "snd", group: "indic" },
  { value: "spa", group: "latin" },
  { value: "swe", group: "latin" },
  { value: "tam", group: "indic" },
  { value: "tel", group: "indic" },
  { value: "tha", group: "other" },
  { value: "tur", group: "latin" },
  { value: "urd", group: "other" },
  { value: "vie", group: "other" }
];
var getLangsByGroup = (group) => ALL_LANGS.filter((l) => l.group === group).map((l) => l.value);
var ocrSmartPlugin = {
  name: "image.ocr.smart",
  async execute(input) {
    try {
      if (!input?.file) return "\u274C No file provided";
      const blob = input.file instanceof Blob ? input.file : new Blob([input.file]);
      const worker = await Tesseract.createWorker({
        langPath: "https://tessdata.projectnaptha.com/4.0.0",
        corePath: "https://cdn.jsdelivr.net/npm/tesseract.js-core@v6/tesseract-core.wasm.js",
        workerPath: "https://cdn.jsdelivr.net/npm/tesseract.js@6/dist/worker.min.js",
        cacheMethod: "readwrite"
      });
      await worker.loadLanguage("osd");
      await worker.initialize("osd");
      const osd = await worker.recognize(blob);
      const script = osd.data?.script || "";
      let candidates = [];
      if (script.includes("Telugu") || script.includes("Devanagari") || script.includes("Tamil") || script.includes("Kannada") || script.includes("Malayalam")) {
        candidates = getLangsByGroup("indic");
      } else if (script.includes("Latin")) {
        candidates = getLangsByGroup("latin");
      } else if (script.includes("Chinese") || script.includes("Hangul")) {
        candidates = getLangsByGroup("cjk");
      } else {
        candidates = ["eng"];
      }
      let bestText = "";
      let bestConfidence = 0;
      let bestLang = "";
      for (const lang of candidates.slice(0, 5)) {
        try {
          await worker.loadLanguage(lang);
          await worker.initialize(lang);
          const res = await worker.recognize(blob);
          const text = res.data.text?.trim();
          const confidence = res.data.confidence || 0;
          if (text && confidence > bestConfidence) {
            bestText = text;
            bestConfidence = confidence;
            bestLang = lang;
          }
        } catch {
          continue;
        }
      }
      await worker.terminate();
      if (!bestText) return "\u26A0\uFE0F No text detected";
      return {
        language: bestLang,
        confidence: Math.round(bestConfidence),
        text: bestText
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
