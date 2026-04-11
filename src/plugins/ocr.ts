import Tesseract from "tesseract.js";

let worker: any = null;
let currentLang: string | null = null;

// ⚠️ Keep your detectLang (optional, but not very reliable for images)
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

// 🔥 Reusable worker (BIG performance fix)
async function getWorker(lang: string) {
  if (worker && currentLang === lang) return worker;

  if (worker) {
    await worker.terminate();
    worker = null;
  }

  worker = await Tesseract.createWorker({
  
    langPath: "/tessdata", // 🔥 BEST (self-host)
    // OR use:
    // langPath: "https://cdn.jsdelivr.net/npm/@tesseract.js-data/",
    logger: () => {},
  });

  await worker.loadLanguage(lang);
  await worker.initialize(lang);

  currentLang = lang;

  return worker;
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
    lang?: string; // ✅ allow override
  }): Promise<OCRResult | string> {
    try {
      if (!input?.file) return "❌ No file provided";

      // Normalize input → Blob
      const blob =
        input.file instanceof Blob
          ? input.file
          : new Blob([input.file], {
              type: input.type ?? "image/png",
            });

      // ✅ Use user lang OR fallback to detect
      const lang =
        input.lang || detectLang(await blob.arrayBuffer()) || "eng";

      const workerInstance = await getWorker(lang);

      const { data } = await workerInstance.recognize(blob);

      const text = data.text?.trim();

      if (!text) return "⚠️ No text detected";

      return {
        language: lang,
        confidence: Math.round(data.confidence ?? 0),
        text,
      };
    } catch (err) {
      console.error("[ocrSmartPlugin]", err);
      return "❌ OCR failed";
    }
  },
};