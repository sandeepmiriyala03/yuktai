"use client";

import Tesseract from "tesseract.js";

/**
 * 🌍 Full Language Config
 */
const ALL_LANGS = [
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
  { value: "vie", group: "other" },
];

const getLangsByGroup = (group: string) =>
  ALL_LANGS.filter((l) => l.group === group).map((l) => l.value);

/**
 * 🚀 YuktAI OCR Plugin (CDN VERSION)
 */
export const ocrSmartPlugin = {
  name: "image.ocr.smart",

  async execute(input: { file: File }) {
    try {
      if (!input?.file) return "❌ No file provided";

      // 🔥 WORKER (CDN BASED)
      const worker = await Tesseract.createWorker({
        logger: (m) => console.log(m),

        // ✅ LOAD FROM URL (NO LOCAL FILES)
        langPath: "https://tessdata.projectnaptha.com/4.0.0",

        corePath:
          "https://cdn.jsdelivr.net/npm/tesseract.js-core@v4.0.4/tesseract-core.wasm.js",

        workerPath:
          "https://cdn.jsdelivr.net/npm/tesseract.js@v4.0.2/dist/worker.min.js",

        cacheMethod: "readwrite", // ⚡ cache in browser
      });

      // 🧠 STEP 1: SCRIPT DETECTION
      await worker.loadLanguage("osd");
      await worker.initialize("osd");

      const osd = await worker.recognize(input.file);
      const script = (osd.data as any)?.script || "";

      let candidates: string[] = [];

      if (
        script.includes("Telugu") ||
        script.includes("Devanagari") ||
        script.includes("Tamil") ||
        script.includes("Kannada") ||
        script.includes("Malayalam")
      ) {
        candidates = getLangsByGroup("indic");
      } else if (script.includes("Latin")) {
        candidates = getLangsByGroup("latin");
      } else if (script.includes("Chinese") || script.includes("Hangul")) {
        candidates = getLangsByGroup("cjk");
      } else {
        candidates = ["eng"]; // 🔥 fallback
      }

      let bestText = "";
      let bestConfidence = 0;
      let bestLang = "";

      // ⚡ STEP 2: OCR LOOP (LIMITED)
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

      await worker.terminate(); // 🔥 cleanup

      if (!bestText) return "⚠️ No text detected";

      return {
        language: bestLang,
        confidence: Math.round(bestConfidence),
        text: bestText,
      };
    } catch (err) {
      console.error(err);
      return "❌ OCR failed";
    }
  },
};