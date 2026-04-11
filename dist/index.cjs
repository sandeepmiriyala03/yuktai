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
var ocrSmartPlugin = {
  name: "image.ocr.smart",
  async execute(input) {
    try {
      if (!input?.file) return "\u274C No file provided";
      const blob = input.file instanceof Blob ? input.file : new Blob([input.file], { type: input.type ?? "image/png" });
      const lang = detectLang(await blob.arrayBuffer());
      const worker = await import_tesseract.default.createWorker(lang, 1, {
        langPath: "https://unpkg.com/@tesseract.js-data",
        cacheMethod: "none",
        logger: () => {
        }
        // suppress console noise
      });
      try {
        const { data } = await worker.recognize(blob);
        const text = data.text?.trim();
        if (!text) return "\u26A0\uFE0F No text detected";
        return {
          language: lang,
          confidence: Math.round(data.confidence ?? 0),
          text
        };
      } finally {
        await worker.terminate();
      }
    } catch (err) {
      console.error("[ocrSmartPlugin]", err);
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
