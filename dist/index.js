"use client";

// src/runtime/runtime.ts
var Runtime = class {
  plugins = /* @__PURE__ */ new Map();
  register(name, plugin) {
    if (!plugin || typeof plugin.execute !== "function") {
      throw new Error(`Invalid plugin: ${name}`);
    }
    this.plugins.set(name, plugin);
  }
  /**
   * 🔹 Direct Plugin Access
   * This is what YuktAI.use(name) calls.
   */
  use(name) {
    return this.plugins.get(name);
  }
  /**
   * 🔹 Run task
   */
  async run(task, input) {
    try {
      const plugin = this.use(task);
      if (!plugin) {
        throw new Error(`Plugin not found: ${task}`);
      }
      return await plugin.execute(input);
    } catch (err) {
      console.error(`[YuktAI Runtime Error in ${task}]:`, err);
      throw err;
    }
  }
  getPlugins() {
    return Array.from(this.plugins.keys());
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
import Tesseract from "tesseract.js";
var worker = null;
var currentLang = null;
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
async function getWorker(lang) {
  if (worker && currentLang === lang) return worker;
  if (worker) {
    await worker.terminate();
    worker = null;
  }
  worker = await Tesseract.createWorker({
    langPath: "/tessdata",
    // 🔥 BEST (self-host)
    // OR use:
    // langPath: "https://cdn.jsdelivr.net/npm/@tesseract.js-data/",
    logger: () => {
    }
  });
  await worker.loadLanguage(lang);
  await worker.initialize(lang);
  currentLang = lang;
  return worker;
}
var ocrSmartPlugin = {
  name: "image.ocr.smart",
  async execute(input) {
    try {
      if (!input?.file) return "\u274C No file provided";
      const blob = input.file instanceof Blob ? input.file : new Blob([input.file], {
        type: input.type ?? "image/png"
      });
      const lang = input.lang || detectLang(await blob.arrayBuffer()) || "eng";
      const workerInstance = await getWorker(lang);
      const { data } = await workerInstance.recognize(blob);
      const text = data.text?.trim();
      if (!text) return "\u26A0\uFE0F No text detected";
      return {
        language: lang,
        confidence: Math.round(data.confidence ?? 0),
        text
      };
    } catch (err) {
      console.error("[ocrSmartPlugin]", err);
      return "\u274C OCR failed";
    }
  }
};

// src/plugins/wcag.ts
var wcagPlugin = {
  name: "ui.a11y.pro",
  version: "1.0.1",
  observer: null,
  /**
   * Main entry point for the accessibility plugin.
   * @param config Configuration options
   * @returns Promise resolving to a report or status message
   */
  async execute(config) {
    if (!config?.enabled) {
      this.stopObserver();
      return "yuktai-a11y: disabled";
    }
    try {
      const report = this.applyFixes(config);
      if (config.autoFix) {
        this.startObserver(config);
      }
      this.ensureLiveRegion();
      this.announce(`Accessibility active. ${report.fixed} fixes applied.`);
      if (config.validate) {
        const validation = this.validatePage();
        return { ...report, validation };
      }
      return report;
    } catch (error) {
      console.error("WCAG Plugin execution error:", error);
      return { fixed: 0, scanned: 0, errors: [error.message] };
    }
  },
  /**
   * Applies accessibility fixes to DOM elements.
   * IMPORTANT: Never modifies 'id' attributes — developer owns those.
   * @param config Configuration options
   * @returns Report of fixes applied
   */
  applyFixes(config) {
    const report = { fixed: 0, scanned: 0, errors: [] };
    if (typeof document === "undefined") return report;
    const root = config.root || document;
    const skipFixes = config.skipFixes || [];
    try {
      const elements = root.querySelectorAll(
        "a,button,input,select,textarea,img,table,[onclick],[tabindex],h1,h2,h3,h4,h5,h6,iframe,video,audio,[role],[aria-label],[aria-labelledby]"
      );
      report.scanned = elements.length;
      let lastHeadingLevel = 0;
      elements.forEach((el) => {
        try {
          const h = el;
          const tag = h.tagName.toLowerCase();
          if (!skipFixes.includes("headings") && /^h[1-6]$/.test(tag)) {
            const level = parseInt(tag[1]);
            if (level > lastHeadingLevel + 1 && lastHeadingLevel !== 0) {
              h.setAttribute("aria-level", String(lastHeadingLevel + 1));
              report.fixed++;
            }
            lastHeadingLevel = level;
          }
          if (!skipFixes.includes("buttons") && (tag === "a" || tag === "button") && !h.innerText.trim()) {
            if (!h.getAttribute("aria-label")) {
              const label = h.getAttribute("title") || h.getAttribute("aria-label") || "Interactive element";
              h.setAttribute("aria-label", label);
              report.fixed++;
            }
          }
          if (!skipFixes.includes("clickables")) {
            const isClickable = h.hasAttribute("onclick") || typeof window !== "undefined" && window.getComputedStyle(h).cursor === "pointer";
            if (isClickable && !["button", "a", "input", "select", "textarea"].includes(tag)) {
              if (!h.getAttribute("role")) {
                h.setAttribute("role", "button");
                report.fixed++;
              }
              if (h.tabIndex < 0) {
                h.tabIndex = 0;
                report.fixed++;
              }
              if (!h._yuktKeyBound) {
                h.addEventListener("keydown", (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    h.click();
                  }
                });
                h._yuktKeyBound = true;
              }
            }
          }
          if (!skipFixes.includes("forms") && ["input", "select", "textarea"].includes(tag)) {
            if (!h.getAttribute("aria-label") && !h.getAttribute("aria-labelledby")) {
              const label = h.getAttribute("placeholder") || h.getAttribute("name") || h.getAttribute("title") || tag;
              h.setAttribute("aria-label", label);
              report.fixed++;
            }
            if (h.hasAttribute("required") && !h.getAttribute("aria-required")) {
              h.setAttribute("aria-required", "true");
              report.fixed++;
            }
          }
          if (!skipFixes.includes("images") && tag === "img" && !h.hasAttribute("alt")) {
            h.setAttribute("alt", "");
            h.setAttribute("aria-hidden", "true");
            report.fixed++;
          }
          if (!skipFixes.includes("tables") && tag === "table" && !el.querySelector("th")) {
            if (!h.getAttribute("role")) {
              h.setAttribute("role", "grid");
              report.fixed++;
            }
          }
          if (!skipFixes.includes("media") && ["video", "audio"].includes(tag)) {
            if (!h.hasAttribute("controls")) {
              h.setAttribute("controls", "true");
              report.fixed++;
            }
          }
          if (!skipFixes.includes("iframes") && tag === "iframe" && !h.getAttribute("title")) {
            h.setAttribute("title", "Embedded content");
            report.fixed++;
          }
        } catch (elementError) {
          report.errors.push(`Error fixing element ${el.tagName}: ${elementError.message}`);
        }
      });
      if (config.highContrast) {
        document.documentElement.style.filter = "contrast(1.15) brightness(1.05)";
      }
      if (config.reduceMotion) {
        document.documentElement.style.scrollBehavior = "auto";
        if (!document.getElementById("yukt-reduce-motion")) {
          const style = document.createElement("style");
          style.id = "yukt-reduce-motion";
          style.textContent = `*, *::before, *::after { transition: none !important; animation: none !important; }`;
          document.head.appendChild(style);
        }
      }
    } catch (error) {
      report.errors.push(`General error in applyFixes: ${error.message}`);
    }
    return report;
  },
  /**
   * Starts observing DOM mutations to apply fixes to new elements.
   * @param config Configuration options
   */
  startObserver(config) {
    if (this.observer || typeof document === "undefined") return;
    this.observer = new MutationObserver((mutations) => {
      clearTimeout(this._mutationTimer);
      this._mutationTimer = setTimeout(() => {
        mutations.forEach((m) => {
          m.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              this.applyFixes({ ...config, root: node });
            }
          });
        });
      }, 100);
    });
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false
      // Only care about new elements
    });
  },
  /**
   * Stops the DOM mutation observer.
   */
  stopObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this._mutationTimer) {
      clearTimeout(this._mutationTimer);
    }
  },
  /**
   * Cleans up all resources and resets the plugin state.
   */
  cleanup() {
    this.stopObserver();
    this.removeLiveRegion();
    const style = document.getElementById("yukt-reduce-motion");
    if (style) style.remove();
    if (typeof document !== "undefined") {
      document.documentElement.style.filter = "";
      document.documentElement.style.scrollBehavior = "";
    }
  },
  /**
   * Ensures a screen reader live region exists for announcements.
   */
  ensureLiveRegion() {
    if (typeof document === "undefined") return;
    if (document.getElementById("yukt-sr-announcer")) return;
    const node = document.createElement("div");
    node.id = "yukt-sr-announcer";
    node.setAttribute("aria-live", "polite");
    node.setAttribute("aria-atomic", "true");
    node.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;";
    document.body.appendChild(node);
  },
  /**
   * Removes the screen reader live region.
   */
  removeLiveRegion() {
    if (typeof document === "undefined") return;
    const node = document.getElementById("yukt-sr-announcer");
    if (node) node.remove();
  },
  /**
   * Announces a message to screen readers.
   * @param msg Message to announce
   */
  announce(msg) {
    if (typeof document === "undefined") return;
    const node = document.getElementById("yukt-sr-announcer");
    if (!node) return;
    node.textContent = "";
    setTimeout(() => {
      node.textContent = msg;
    }, 50);
  },
  /**
   * Checks if two colors have sufficient contrast ratio.
   * @param fg Foreground color (hex, rgb, or color name)
   * @param bg Background color (hex, rgb, or color name)
   * @param ratio Minimum contrast ratio (default 4.5 for normal text)
   * @returns True if contrast is sufficient
   */
  checkContrast(fg, bg, ratio = 4.5) {
    try {
      const getLuminance = (color) => {
        const temp = document.createElement("div");
        temp.style.color = color;
        temp.style.backgroundColor = bg;
        document.body.appendChild(temp);
        const fgRgb = window.getComputedStyle(temp).color;
        const bgRgb = window.getComputedStyle(temp).backgroundColor;
        temp.remove();
        const fgMatch = fgRgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        const bgMatch = bgRgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (!fgMatch || !bgMatch) return 1;
        const fgL = this.rgbToLuminance(parseInt(fgMatch[1]), parseInt(fgMatch[2]), parseInt(fgMatch[3]));
        const bgL = this.rgbToLuminance(parseInt(bgMatch[1]), parseInt(bgMatch[2]), parseInt(bgMatch[3]));
        const lighter = Math.max(fgL, bgL);
        const darker = Math.min(fgL, bgL);
        return (lighter + 0.05) / (darker + 0.05);
      };
      return getLuminance(fg) >= ratio;
    } catch (error) {
      console.warn("Contrast check failed:", error);
      return true;
    }
  },
  /**
   * Validates the current page for accessibility issues.
   * @returns Detailed report of accessibility status
   */
  validatePage() {
    const issues = [];
    const recommendations = [];
    if (typeof document === "undefined") {
      return { score: 0, issues: ["Server-side rendering detected"], recommendations: [] };
    }
    if (!document.documentElement.getAttribute("lang")) {
      issues.push("Missing lang attribute on html element");
      recommendations.push('Add lang attribute to <html> element (e.g., <html lang="en">)');
    }
    if (!document.title) {
      issues.push("Missing page title");
      recommendations.push("Add a descriptive <title> element");
    }
    const focusableElements = document.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
    if (focusableElements.length === 0) {
      issues.push("No keyboard-focusable elements found");
      recommendations.push("Ensure interactive elements are keyboard accessible");
    }
    const imagesWithoutAlt = document.querySelectorAll("img:not([alt])");
    if (imagesWithoutAlt.length > 0) {
      issues.push(`${imagesWithoutAlt.length} images missing alt text`);
      recommendations.push("Add descriptive alt text to all images");
    }
    const headings = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6"));
    let lastLevel = 0;
    headings.forEach((h, index) => {
      const level = parseInt(h.tagName[1]);
      if (index > 0 && level > lastLevel + 1) {
        issues.push(`Skipped heading level: ${h.tagName} after h${lastLevel}`);
        recommendations.push("Ensure heading hierarchy is sequential");
      }
      lastLevel = level;
    });
    const score = Math.max(0, 100 - issues.length * 10);
    return { score, issues, recommendations };
  }
};

// src/core/renderer.tsx
import React from "react";
function render(element, enabled = true, report = { fixes: 0, nodes: 0, renderTime: 0 }) {
  const isRoot = report.nodes === 0;
  const startTime = isRoot ? performance.now() : 0;
  if (!React.isValidElement(element)) return element;
  report.nodes++;
  const el = element;
  const props = { ...el.props };
  const type = el.type;
  let isModified = false;
  if (enabled) {
    if (["input", "textarea", "select"].includes(type)) {
      if (!props["aria-label"] && !props["aria-labelledby"]) {
        props["aria-label"] = props.placeholder || props.name || `${type} field`;
        isModified = true;
      }
    }
    if (type === "img" && (props.alt === void 0 || props.alt === null)) {
      props.alt = "";
      props["aria-hidden"] = "true";
      isModified = true;
    }
    if (props.onClick && !["button", "a", "input"].includes(type)) {
      if (!props.role) props.role = "button";
      if (props.tabIndex === void 0) props.tabIndex = 0;
      if (!props.onKeyDown) {
        const originalOnClick = props.onClick;
        props.onKeyDown = (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            originalOnClick(e);
          }
        };
        isModified = true;
      }
    }
    if (type === "input" && !props.autoComplete) {
      if (props.name?.includes("email")) props.autoComplete = "email";
      if (props.name?.includes("tel")) props.autoComplete = "tel";
    }
    if (type === "a" && props.target === "_blank") {
      if (!props.rel?.includes("noopener")) {
        props.rel = "noopener noreferrer";
        isModified = true;
      }
      const currentLabel = props["aria-label"] || (typeof props.children === "string" ? props.children : "link");
      if (!currentLabel.includes("opens in new window")) {
        props["aria-label"] = `${currentLabel} (opens in new window)`;
        isModified = true;
      }
    }
    const landmarks = {
      nav: "navigation",
      header: "banner",
      footer: "contentinfo",
      main: "main"
    };
    if (landmarks[type] && !props.role) {
      props.role = landmarks[type];
      isModified = true;
    }
    if (isModified) report.fixes++;
  }
  const children = React.Children.map(
    props.children,
    (child) => React.isValidElement(child) ? render(child, enabled, report) : child
  );
  const finalElement = React.cloneElement(el, props, children);
  if (isRoot) {
    report.renderTime = parseFloat((performance.now() - startTime).toFixed(2));
  }
  return finalElement;
}

// src/core/YuktAIWrapper.tsx
import { useState, useEffect, useRef, useMemo } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function YuktAIWrapper({ children }) {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState({ fixes: 0, nodes: 0, renderTime: 0 });
  const panelRef = useRef(null);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (enabled) {
      const style = document.createElement("style");
      style.id = "yuktai-dynamic-styles";
      style.innerHTML = `
        /* Level AA: Force visible focus rings for keyboard users */
        *:focus-visible { 
          outline: 3px solid #2563eb !important; 
          outline-offset: 2px !important; 
          box-shadow: 0 0 0 5px rgba(37, 99, 235, 0.3) !important;
        }
        /* Level AAA: High Contrast Mode */
        .yuktai-aaa-active {
          filter: contrast(1.1);
        }
      `;
      document.head.appendChild(style);
      document.body.classList.add("yuktai-aaa-active");
    } else {
      document.getElementById("yuktai-dynamic-styles")?.remove();
      document.body.classList.remove("yuktai-aaa-active");
    }
  }, [enabled]);
  const currentReport = { fixes: 0, nodes: 0, renderTime: 0 };
  const content = useMemo(() => {
    return render(children, enabled, currentReport);
  }, [children, enabled]);
  useEffect(() => {
    if (mounted) {
      setStats({ ...currentReport });
    }
  }, [content, enabled, mounted]);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  if (!mounted) return /* @__PURE__ */ jsx(Fragment, { children });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    content,
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setOpen(true),
        style: {
          position: "fixed",
          bottom: 25,
          right: 25,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#1a202c",
          color: "white",
          border: "none",
          cursor: "pointer",
          zIndex: 9999,
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px"
        },
        children: "\u267F"
      }
    ),
    open && /* @__PURE__ */ jsxs(
      "div",
      {
        ref: panelRef,
        style: {
          position: "fixed",
          bottom: 95,
          right: 25,
          width: 340,
          background: "#ffffff",
          borderRadius: "20px",
          padding: "24px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          zIndex: 1e4,
          border: "1px solid #f0f0f0",
          fontFamily: "sans-serif"
        },
        children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 20 }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: 22 }, children: "\u267F" }),
              /* @__PURE__ */ jsx("strong", { style: { fontSize: 18 }, children: "ADA accessibility" })
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: () => setOpen(false), style: { background: "none", border: "none", fontSize: 24, color: "#ccc", cursor: "pointer" }, children: "\xD7" })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setEnabled(!enabled),
              style: {
                width: "100%",
                padding: 16,
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                fontWeight: "700",
                background: enabled ? "#dcfce7" : "#eff6ff",
                color: enabled ? "#065f46" : "#2563eb",
                marginBottom: 20,
                transition: "0.2s"
              },
              children: enabled ? "Disable ADA Engine" : "Enable ADA Engine"
            }
          ),
          /* @__PURE__ */ jsx("div", { style: { borderTop: "1px solid #edf2f7", paddingTop: 16, fontSize: 13, color: "#718096" }, children: enabled ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { style: { color: "#2d3748", fontWeight: "600", marginBottom: 4 }, children: [
              "yuktai-a11y: ",
              stats.fixes,
              " fixes applied."
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              "Nodes scanned: ",
              stats.nodes
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { marginTop: 4, color: "#a0aec0", fontSize: 11 }, children: [
              "Render time: ",
              stats.renderTime,
              "ms"
            ] })
          ] }) : /* @__PURE__ */ jsx("div", { style: { fontStyle: "italic" }, children: "ADA Engine is offline." }) })
        ]
      }
    )
  ] });
}

// src/index.ts
function getRuntime() {
  if (!globalThis.__yuktai_runtime__) {
    const runtime2 = new Runtime();
    runtime2.register(aiPlugin.name, aiPlugin);
    runtime2.register(voicePlugin.name, voicePlugin);
    runtime2.register(ocrSmartPlugin.name, ocrSmartPlugin);
    runtime2.register(wcagPlugin.name, wcagPlugin);
    globalThis.__yuktai_runtime__ = runtime2;
  }
  return globalThis.__yuktai_runtime__;
}
var runtime = getRuntime();
var YuktAI = {
  render,
  list() {
    return runtime.getPlugins();
  },
  use(name) {
    return runtime.use(name);
  }
};
var index_default = YuktAI;
export {
  YuktAI,
  YuktAIWrapper,
  index_default as default
};
