"use client";

import Tesseract from "tesseract.js";

/**
 * ✅ Full Language Config (your structure)
 */
const ALL_LANGS = [
  { value: "ara", label: "Arabic", group: "other" },
  { value: "asm", label: "Assamese", group: "indic" },
  { value: "ben", label: "Bengali", group: "indic" },
  { value: "bod", label: "Bodo", group: "indic" },
  { value: "chi_sim", label: "Chinese (Simplified)", group: "cjk" },
  { value: "chi_tra", label: "Chinese (Traditional)", group: "cjk" },
  { value: "deu", label: "German", group: "latin" },
  { value: "eng", label: "English", group: "latin" },
  { value: "fra", label: "French", group: "latin" },
  { value: "guj", label: "Gujarati", group: "indic" },
  { value: "hin", label: "Hindi", group: "indic" },
  { value: "ita", label: "Italian", group: "latin" },
  { value: "jpn", label: "Japanese", group: "cjk" },
  { value: "kan", label: "Kannada", group: "indic" },
  { value: "kor", label: "Korean", group: "cjk" },
  { value: "mal", label: "Malayalam", group: "indic" },
  { value: "mar", label: "Marathi", group: "indic" },
  { value: "nep", label: "Nepali", group: "indic" },
  { value: "nld", label: "Dutch", group: "latin" },
  { value: "ori", label: "Odia", group: "indic" },
  { value: "pan", label: "Punjabi", group: "indic" },
  { value: "por", label: "Portuguese", group: "latin" },
  { value: "rus", label: "Russian", group: "other" },
  { value: "san", label: "Sanskrit", group: "indic" },
  { value: "snd", label: "Sindhi", group: "indic" },
  { value: "spa", label: "Spanish", group: "latin" },
  { value: "swe", label: "Swedish", group: "latin" },
  { value: "tam", label: "Tamil", group: "indic" },
  { value: "tel", label: "Telugu", group: "indic" },
  { value: "tha", label: "Thai", group: "other" },
  { value: "tur", label: "Turkish", group: "latin" },
  { value: "urd", label: "Urdu", group: "other" },
  { value: "vie", label: "Vietnamese", group: "other" },
];

/**
 * 🔹 Group Helpers
 */
const getLangsByGroup = (group: string) =>
  ALL_LANGS.filter((l) => l.group === group).map((l) => l.value);

/**
 * ✅ YuktAI Plugin
 */
export const ocrSmartPlugin = {
  name: "image.ocr.smart",

  async execute(input: { file: File }) {
    try {
      if (!input?.file) return "❌ No file provided";

      // 🔹 STEP 1: Detect script
      const osd = await Tesseract.recognize(input.file, "osd");
      const script = (osd.data as any)?.script || "";

      let candidates: string[] = [];

      // 🔥 Smart grouping (your logic improved)
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
        candidates = ALL_LANGS.map((l) => l.value);
      }

      let bestText = "";
      let bestConfidence = 0;
      let bestLang = "";

      // 🔹 STEP 2: OCR loop
      for (const lang of candidates) {
        try {
          const res = await Tesseract.recognize(input.file, lang);

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

      if (!bestText) return "⚠️ No text detected";

      // 🔥 Final Output
      return {
        language: bestLang,
        confidence: Math.round(bestConfidence),
        text: bestText,
      };
    } catch {
      return "❌ OCR failed";
    }
  },
};