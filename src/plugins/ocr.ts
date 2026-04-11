"use client";

import Tesseract from "tesseract.js";

const LANG_GROUPS: Record<string, string[]> = {
  indic: ["hin", "tel", "tam", "kan", "mal", "ben", "guj", "pan", "mar"],
  latin: ["eng", "fra", "deu", "spa", "por", "ita", "nld", "swe", "tur"],
  cjk:   ["chi_sim", "chi_tra", "jpn", "kor"],
  other: ["ara", "rus", "tha", "urd", "vie"],
};

// Simple heuristic — checks unicode ranges instead of broken OSD
function detectCandidates(buffer: ArrayBuffer): string[] {
  const bytes = new Uint8Array(buffer.slice(0, 2000));
  const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);

  if (/[\u0C00-\u0C7F]/.test(text)) return LANG_GROUPS.indic; // Telugu
  if (/[\u0900-\u097F]/.test(text)) return LANG_GROUPS.indic; // Devanagari
  if (/[\u0B80-\u0BFF]/.test(text)) return LANG_GROUPS.indic; // Tamil
  if (/[\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/.test(text)) return LANG_GROUPS.cjk;
  if (/[\u0600-\u06FF]/.test(text)) return ["ara", "urd"];
  if (/[\u0400-\u04FF]/.test(text)) return ["rus"];

  // Default: try english + a few indic since you're in India
  return ["eng", "hin", "tel"];
}

export const ocrSmartPlugin = {
  name: "image.ocr.smart",

  async execute(input: { file: any; name?: string; type?: string }) {
    try {
      if (!input?.file) return "❌ No file provided";

      const blob =
        input.file instanceof Blob
          ? input.file
          : new Blob([input.file], { type: input.type ?? "image/png" });

      const candidates = detectCandidates(await blob.arrayBuffer());

      // ✅ v6 API: pass languages directly to createWorker — NO loadLanguage/initialize calls
      const workers = await Promise.all(
        candidates.slice(0, 4).map((lang) =>
          Tesseract.createWorker([lang], 1, {
            // ✅ Remove corePath/workerPath — v6 resolves these automatically
            langPath: "https://tessdata.projectnaptha.com/4.0.0",
            cacheMethod: "readwrite",
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
              confidence: data.confidence ?? 0,
            };
          } catch {
            return { lang: candidates[i], text: "", confidence: 0 };
          } finally {
            await worker.terminate();
          }
        })
      );

      const best = results.reduce((a, b) =>
        b.confidence > a.confidence ? b : a
      );

      if (!best.text) return "⚠️ No text detected";

      return {
        language: best.lang,
        confidence: Math.round(best.confidence),
        text: best.text,
      };
    } catch (err) {
      console.error(err);
      return "❌ OCR failed";
    }
  },
};