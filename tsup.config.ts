import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    minify: true,
    external: ["react", "react-dom"],
  },
  {
    entry: ["src/core/renderer.tsx"],
    format: ["iife"],
    globalName: "YuktAI",
    outDir: "dist",
    minify: true,
    dts: false,
    platform: "browser",
    outExtension: () => ({ js: ".global.js" }),
    esbuildOptions(options) {
      options.define = {
        "process.env.NODE_ENV": '"production"',
        "process": '{"env":{"NODE_ENV":"production"}}',
      };
    },
  },
]);