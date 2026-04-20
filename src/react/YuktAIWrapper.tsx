"use client";
// yuktai-a11y · react/YuktAIWrapper.tsx
// import { YuktAIWrapper } from "@yuktishaalaa/yuktai";

import React, { useState, useEffect, useRef, useCallback, ReactNode } from "react";
import { wcagPlugin, A11yReport } from "../core/renderer";
import { WidgetPanel, WidgetSettings, DEFAULT_SETTINGS } from "./WidgetPanel";

let _focusStyleNode: HTMLStyleElement | null = null;
let _dyslexiaStyleNode: HTMLStyleElement | null = null;

export interface YuktAIWrapperProps {
  children?: ReactNode;
  position?: "left" | "right"; // default: "left"
}

export function YuktAIWrapper({ children, position = "left" }: YuktAIWrapperProps) {
  const [mounted,  setMounted]  = useState(false);
  const [open,     setOpen]     = useState(false);
  const [settings, setSettings] = useState<WidgetSettings>(DEFAULT_SETTINGS);
  const [report,   setReport]   = useState<A11yReport | null>(null);
  const [isActive, setIsActive] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const fabRef   = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  // Global focus ring styles
  useEffect(() => {
    if (_focusStyleNode) return;
    const s = document.createElement("style");
    s.innerHTML = `*:focus-visible{outline:3px solid #0d9488!important;outline-offset:2px!important;box-shadow:0 0 0 5px rgba(13,148,136,.25)!important;}`;
    document.head.appendChild(s);
    _focusStyleNode = s;
    return () => { _focusStyleNode?.remove(); _focusStyleNode = null; };
  }, []);

  useEffect(() => () => {
    wcagPlugin.stopObserver();
    wcagPlugin.removeLiveRegion();
    wcagPlugin.removeColorBlindSvg();
  }, []);

  // Outside click
  useEffect(() => {
    if (!open) return;
    const fn = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) &&
          fabRef.current  && !fabRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open]);

  // Escape key
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape" && open) { setOpen(false); fabRef.current?.focus(); } };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [open]);

  const set = <K extends keyof WidgetSettings>(key: K, val: WidgetSettings[K]) =>
    setSettings((p) => ({ ...p, [key]: val }));

  const applySettings = useCallback(async () => {
    const cfg = { enabled:true, highContrast:settings.highContrast, reduceMotion:settings.reduceMotion, autoFix:settings.autoFix };
    const msg = await wcagPlugin.execute(cfg);
    console.log("[yuktai-a11y]", msg);
    setReport(wcagPlugin.applyFixes(cfg));
    document.documentElement.style.fontSize = `${settings.fontScale}%`;
    if (settings.dyslexiaFont) {
      if (!_dyslexiaStyleNode) {
        const s = document.createElement("style");
        s.textContent = `body,body *{font-family:'Georgia',serif!important;letter-spacing:.06em!important;word-spacing:.12em!important;line-height:1.9!important;}`;
        document.head.appendChild(s);
        _dyslexiaStyleNode = s;
      }
    } else { _dyslexiaStyleNode?.remove(); _dyslexiaStyleNode = null; }
    setIsActive(true); setOpen(false);
    wcagPlugin.announce(`yuktai-a11y active.`);
  }, [settings]);

  const resetSettings = useCallback(async () => {
    await wcagPlugin.execute({ enabled: false });
    document.documentElement.style.fontSize = "";
    _dyslexiaStyleNode?.remove(); _dyslexiaStyleNode = null;
    document.querySelectorAll<HTMLElement>("*").forEach((h) => { h.style.filter=""; h.style.transition=""; h.style.animation=""; });
    setSettings(DEFAULT_SETTINGS); setReport(null); setIsActive(false);
    wcagPlugin.announce("yuktai-a11y disabled.");
  }, []);

  if (!mounted) return <>{children}</>;

  const side = position === "left" ? { left: 24 } : { right: 24 };

  return (
    <>
      {children}
      <button ref={fabRef} onClick={() => setOpen((v) => !v)}
        aria-label="Open yuktai-a11y accessibility options"
        aria-expanded={open} aria-haspopup="dialog"
        style={{ position:"fixed", bottom:24, ...side, width:52, height:52, borderRadius:"50%", background: isActive ? "#0f766e" : "#0d9488", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 14px rgba(0,0,0,0.18)", zIndex:9999, transition:"background 0.2s, transform 0.15s", outline:"none" }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onFocus={(e)      => (e.currentTarget.style.boxShadow = "0 0 0 4px rgba(13,148,136,0.45)")}
        onBlur={(e)       => (e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.18)")}>
        <svg viewBox="0 0 24 24" style={{ width:26, height:26, fill:"#fff" }} aria-hidden="true">
          <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm9 4.5l-5-.5-2-.2V5l-4 .5-4-.5v.8L4 6.5 3 7l1 3 4-.5v2.3L6 17h2l2-4.5L12 14l2 2.5L16 17h2l-2-4.2V9.5l4 .5 1-3z"/>
        </svg>
        {isActive && <span aria-hidden="true" style={{ position:"absolute", top:4, right:4, width:10, height:10, borderRadius:"50%", background:"#5eead4", border:"2px solid #fff" }} />}
      </button>
      {open && <WidgetPanel ref={panelRef} position={position} settings={settings} report={report} isActive={isActive} set={set} onApply={applySettings} onReset={resetSettings} onClose={() => setOpen(false)} />}
    </>
  );
}

export default YuktAIWrapper;