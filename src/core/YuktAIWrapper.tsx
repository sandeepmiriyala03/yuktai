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
  enabled: true,
  highContrast: false,
  reduceMotion: false,
  autoFix: true,
  dyslexiaFont: false,
  fontScale: 100,
};

export default function YuktAIWrapper({ children }: YuktAIWrapperProps) {
  const accessibleChildren = children ? applyAccessibility(children) : null;

  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<WidgetSettings>(DEFAULT_SETTINGS);
  const panelRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  const set = <K extends keyof WidgetSettings>(key: K, val: WidgetSettings[K]) =>
    setSettings((prev) => ({ ...prev, [key]: val }));

  useEffect(() => {
    const init = async () => {
      await wcagPlugin.execute({ enabled: true, autoFix: true });
    };
    init();
    return () => wcagPlugin.stopObserver();
  }, []);

  // Handle Outside Click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      // Ensure we check if the click was on the FAB or the Panel
      const isFabClick = fabRef.current?.contains(e.target as Node);
      const isPanelClick = panelRef.current?.contains(e.target as Node);
      
      if (!isFabClick && !isPanelClick) {
        setOpen(false);
      }
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

      {/* FAB - Using pointer-events on child ensures button always gets the click */}
      <button
        ref={fabRef}
        onClick={(e) => {
          e.stopPropagation(); // Prevent bubbling issues
          setOpen((prev) => !prev);
        }}
        aria-label="Accessibility Menu"
        style={{
          position: "fixed", bottom: 20, right: 20, width: 56, height: 56,
          borderRadius: "50%", background: "#0d9488", color: "#fff",
          border: "none", cursor: "pointer", zIndex: 10000, // Higher Z-Index
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        <svg 
          viewBox="0 0 24 24" 
          width="32" 
          height="32" 
          fill="currentColor" 
          style={{ pointerEvents: 'none' }} // 🔹 CRITICAL: Icon won't block click
        >
          <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
        </svg>
      </button>

      {/* Settings Panel */}
      {open && (
        <div 
          ref={panelRef} 
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside menu
          style={{
            position: "fixed", bottom: 90, right: 20, width: 280,
            background: "#ffffff", borderRadius: 16, padding: 20,
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)", zIndex: 10001, 
            border: "1px solid #e5e7eb", color: "#111827",
            fontFamily: "sans-serif"
          }}
        >
          <h4 style={{ margin: "0 0 15px", fontSize: 18, fontWeight: 600 }}>Accessibility Menu</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
             <label style={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
               High Contrast 
               <input type="checkbox" style={{ width: 18, height: 18 }} checked={settings.highContrast} onChange={e => set('highContrast', e.target.checked)} />
             </label>
             <label style={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
               Dyslexia Font 
               <input type="checkbox" style={{ width: 18, height: 18 }} checked={settings.dyslexiaFont} onChange={e => set('dyslexiaFont', e.target.checked)} />
             </label>
             <button 
                onClick={applySettings} 
                style={{ 
                  marginTop: 10, padding: "12px", background: "#0d9488", 
                  color: "#fff", border: 'none', borderRadius: 8, 
                  fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' 
                }}
             >
               Apply Changes
             </button>
          </div>
        </div>
      )}
    </>
  );
}