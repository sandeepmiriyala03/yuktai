"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { wcagPlugin } from "../plugins/wcag";
import { applyAccessibility } from "./renderer";

interface YuktAIWrapperProps {
  children?: React.ReactNode;
}

interface WidgetSettings {
  enabled: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  autoFix: boolean;
  dyslexiaFont: boolean;
  fontScale: number;
}

const DEFAULT_SETTINGS: WidgetSettings = {
  enabled: true, // Active by default
  highContrast: false,
  reduceMotion: false,
  autoFix: true,
  dyslexiaFont: false,
  fontScale: 100,
};

export default function YuktAIWrapper({ children }: YuktAIWrapperProps) {
  // 1. Layer 1: Static React Fixes (Runs during render)
  const accessibleChildren = children ? applyAccessibility(children) : null;

  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<WidgetSettings>(DEFAULT_SETTINGS);
  const [isActive, setIsActive] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  const set = <K extends keyof WidgetSettings>(key: K, val: WidgetSettings[K]) =>
    setSettings((prev) => ({ ...prev, [key]: val }));

  // 2. Layer 2 & 3: Runtime DOM Observer (Runs on mount)
  useEffect(() => {
    const init = async () => {
      await wcagPlugin.execute({ enabled: true, autoFix: true });
      setIsActive(true);
    };
    init();
    return () => wcagPlugin.stopObserver();
  }, []);

  // Handle Outside Click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) &&
          fabRef.current && !fabRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const applySettings = useCallback(async () => {
    const config = {
      enabled: true,
      highContrast: settings.highContrast,
      reduceMotion: settings.reduceMotion,
      autoFix: settings.autoFix,
    };

    await wcagPlugin.execute(config);
    document.documentElement.style.fontSize = `${settings.fontScale}%`;

    // Dyslexia Mode
    const existingStyle = document.getElementById("yuktai-dyslexia");
    if (settings.dyslexiaFont) {
      if (!existingStyle) {
        const s = document.createElement("style");
        s.id = "yuktai-dyslexia";
        s.textContent = `body, body * { font-family: 'Georgia', serif !important; letter-spacing: 0.05em !important; line-height: 1.8 !important; }`;
        document.head.appendChild(s);
      }
    } else {
      existingStyle?.remove();
    }
    setOpen(false);
  }, [settings]);

  return (
    <>
      {accessibleChildren}

      {/* FAB */}
      <button
        ref={fabRef}
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed", bottom: 20, right: 20, width: 50, height: 50,
          borderRadius: "50%", background: "#0d9488", color: "#fff",
          border: "none", cursor: "pointer", zIndex: 9999,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
        }}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
        </svg>
      </button>

      {/* Settings Panel */}
      {open && (
        <div ref={panelRef} style={{
          position: "fixed", bottom: 80, right: 20, width: 280,
          background: "#fff", borderRadius: 12, padding: 16,
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)", zIndex: 9999, border: "1px solid #eee"
        }}>
          <h4 style={{ margin: "0 0 15px", color: "#333" }}>Accessibility Menu</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
             <label style={{ fontSize: 13, display: 'flex', justifyContent: 'space-between' }}>
               High Contrast <input type="checkbox" checked={settings.highContrast} onChange={e => set('highContrast', e.target.checked)} />
             </label>
             <label style={{ fontSize: 13, display: 'flex', justifyContent: 'space-between' }}>
               Dyslexia Font <input type="checkbox" checked={settings.dyslexiaFont} onChange={e => set('dyslexiaFont', e.target.checked)} />
             </label>
             <button onClick={applySettings} style={{ marginTop: 10, padding: 8, background: "#0d9488", color: "#fff", border: 'none', borderRadius: 4, cursor: 'pointer' }}>
               Save Settings
             </button>
          </div>
        </div>
      )}
    </>
  );
}