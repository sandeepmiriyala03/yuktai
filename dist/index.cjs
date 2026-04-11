"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);

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
var import_tesseract = __toESM(require("tesseract.js"), 1);
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
      const worker = await import_tesseract.default.createWorker({
        logger: (m) => console.log(m),
        // ✅ LOAD FROM URL (NO LOCAL FILES)
        langPath: "https://tessdata.projectnaptha.com/4.0.0",
        corePath: "https://cdn.jsdelivr.net/npm/tesseract.js-core@v4.0.4/tesseract-core.wasm.js",
        workerPath: "https://cdn.jsdelivr.net/npm/tesseract.js@v4.0.2/dist/worker.min.js",
        cacheMethod: "readwrite"
        // ⚡ cache in browser
      });
      await worker.loadLanguage("osd");
      await worker.initialize("osd");
      const osd = await worker.recognize(input.file);
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
          const res = await worker.recognize(input.file);
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
