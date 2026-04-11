import Tesseract from "tesseract.js";

function detectLang(buffer: ArrayBuffer): string {
  const text = new TextDecoder("utf-8", { fatal: false }).decode(
    new Uint8Array(buffer.slice(0, 2000))
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

export const ocrSmartPlugin = {
  name: "image.ocr.smart",

  async execute(input: { file: any; name?: string; type?: string }) {
    try {
      if (!input?.file) return "❌ No file provided";

      const blob =
        input.file instanceof Blob
          ? input.file
          : new Blob([input.file], { type: input.type ?? "image/png" });

      const lang = detectLang(await blob.arrayBuffer());

      // ✅ FIXES:
      // 1. lang is a STRING not an array — v4/v5 createWorker takes string
      // 2. langPath uses unpkg (reliable), not tessdata.projectnaptha.com
      // 3. cacheMethod: "none" prevents stale/corrupt cache causing map errors
      const worker = await Tesseract.createWorker(lang, 1, {
        langPath: "https://unpkg.com/@tesseract.js-data",
        cacheMethod: "none",
        logger: () => {},
      });

      try {
        const { data } = await worker.recognize(blob);
        const text = data.text?.trim();

        if (!text) return "⚠️ No text detected";

        return {
          language: lang,
          confidence: Math.round(data.confidence ?? 0),
          text,
        };
      } finally {
        await worker.terminate();
      }
    } catch (err) {
      console.error(err);
      return "❌ OCR failed";
    }
  },
};