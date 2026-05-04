import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry:    ["src/index.ts"],
    format:   ["esm", "cjs"],
    dts:      true,
    clean:    true,
    minify:   true,
    external: [
      "react",
      "react-dom",
      // ── Exclude all Transformers.js related packages ──
      // These are browser-loaded dynamically — must NOT be bundled
      "@huggingface/transformers",
      "onnxruntime-node",
      "onnxruntime-web",
      "onnxruntime-common",
    ],
    // ── Ensure browser-compatible build ──
    platform: "browser",
    esbuildOptions(options) {
      options.define = {
        "process.env.NODE_ENV": '"production"',
        "process": '{"env":{"NODE_ENV":"production"}}',
      }
    },
  },
  {
    entry:      ["src/core/renderer.tsx"],
    format:     ["iife"],
    globalName: "YuktAI",
    outDir:     "dist",
    minify:     true,
    dts:        false,
    platform:   "browser",
    outExtension: () => ({ js: ".global.js" }),
    external: [
      "@huggingface/transformers",
      "onnxruntime-node",
      "onnxruntime-web",
      "onnxruntime-common",
    ],
    esbuildOptions(options) {
      options.define = {
        "process.env.NODE_ENV": '"production"',
        "process": '{"env":{"NODE_ENV":"production"}}',
      }
    },
  },
])