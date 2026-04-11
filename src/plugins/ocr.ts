import Tesseract from "tesseract.js";

function detectLang(buffer: ArrayBuffer): string {
  const text = new TextDecoder("utf-8", { fatal: false }).decode(
    new Uint8Array(buffer.slice(0, 2000))
  );
  if (/[\u0C00-\u0C7F]/.test(text)) return "tel"; // Telugu
  if (/[\u0900-\u097F]/.test(text)) return "hin"; // Hindi
  if (/[\u0B80-\u0BFF]/.test(text)) return "tam"; // Tamil
  if (/[\u4E00-\u9FFF]/.test(text)) return "chi_sim"; // Chinese Simplified
  if (/[\u3040-\u30FF]/.test(text)) return "jpn"; // Japanese
  if (/[\u0600-\u06FF]/.test(text)) return "ara"; // Arabic
  if (/[\u0400-\u04FF]/.test(text)) return "rus"; // Russian
  return "eng"; // Default: English
}

export interface OCRResult {
  language: string;
  confidence: number;
  text: string;
}

export const ocrSmartPlugin = {
  name: "image.ocr.smart",

  async execute(input: {
    file: Blob | File | Uint8Array | ArrayBuffer;
    name?: string;
    type?: string;
  }): Promise<OCRResult | string> {
    try {
      if (!input?.file) return "❌ No file provided";

      // Normalize to Blob regardless of what was passed in
      const blob =
        input.file instanceof Blob
          ? input.file
          : new Blob([input.file], { type: input.type ?? "image/png" });

      const lang = detectLang(await blob.arrayBuffer());

      const worker = await Tesseract.createWorker(lang, 1, {
        langPath: "https://unpkg.com/@tesseract.js-data",
        cacheMethod: "none",
        logger: () => {}, // suppress console noise
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
      console.error("[ocrSmartPlugin]", err);
      return "❌ OCR failed";
    }
  },
};