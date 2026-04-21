import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry:    ["src/index.ts"],
    format:   ["esm", "cjs"],
    dts:      true,
    clean:    true,
    minify:   true,
    external: ["react", "react-dom"],
  },
  {
    entry:      { "index.global": "src/index.ts" },
    format:     ["iife"],
    globalName: "YuktAI",
    outDir:     "dist",
    minify:     true,
    dts:        false,
    platform:   "browser",
    external:   ["react", "react-dom", "tesseract.js", "idb-keyval", "wasm-feature-detect"],
    esbuildOptions(options) {
      options.define = {
        "process.env.NODE_ENV": '"production"',
        "process":              '{"env":{"NODE_ENV":"production"}}',
      };
    },
  },
]);