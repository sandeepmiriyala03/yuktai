"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { wcagPlugin } from "../plugins/wcag";
import { applyAccessibility } from "./renderer";

interface YuktAIWrapperProps {
  children?: React.ReactNode;
}

type WCAGLevel = "A" | "AA" | "AAA";

interface WidgetSettings {
  enabled: boolean;        
  highContrast: boolean;
  dyslexiaFont: boolean;
  fontScale: number;       
  wcagLevel: WCAGLevel;    
}

const DEFAULT_SETTINGS: WidgetSettings = {
  enabled: true,
  highContrast: false,
  dyslexiaFont: false,
  fontScale: 100,
  wcagLevel: "AA",
};

export default function YuktAIWrapper({ children }: YuktAIWrapperProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<WidgetSettings>(DEFAULT_SETTINGS);
  const [fixCount, setFixCount] = useState(0); // 🔹 Tracks applied fixes
  
  const panelRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  // 1. Initial Mount
  useEffect(() => {
    setMounted(true);
    const init = async () => {
      await (wcagPlugin.execute as any)({ 
        enabled: settings.enabled, 
        autoFix: true,
        level: settings.wcagLevel 
      });
    };
    init();
    return () => wcagPlugin.stopObserver();
  }, []);

  // 2. Global Styles (Contrast, Fonts, Scaling)
  const applyGlobalStyles = useCallback(async (updatedSettings: WidgetSettings) => {
    await (wcagPlugin.execute as any)({
      enabled: updatedSettings.enabled,
      highContrast: updatedSettings.highContrast,
      autoFix: true,
      level: updatedSettings.wcagLevel
    });

    document.documentElement.style.fontSize = `${updatedSettings.fontScale}%`;

    const styleId = "yuktai-dyslexia-css";
    let styleTag = document.getElementById(styleId);
    if (updatedSettings.dyslexiaFont) {
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = styleId;
        styleTag.textContent = `body, body * { font-family: 'OpenDyslexic', 'Georgia', serif !important; line-height: 1.6 !important; }`;
        document.head.appendChild(styleTag);
      }
    } else {
      styleTag?.remove();
    }
  }, []);

  const updateSetting = <K extends keyof WidgetSettings>(key: K, val: WidgetSettings[K]) => {
    const newSettings = { ...settings, [key]: val };
    setSettings(newSettings);
    applyGlobalStyles(newSettings);
    // Reset fix count on toggle so it recalculates
    if (key === 'enabled') setFixCount(0);
  };

  // 3. Transformation Logic with Counter
  // This passes a 'tick' function to the renderer to count changes
  const content = mounted 
    ? applyAccessibility(children, settings.enabled, 
        () => setFixCount(prev => prev + 1)) 
    : children;

  return (
    <>
      {content}

      {/* Floating Action Button with Notification Badge */}
      <button
        ref={fabRef}
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        aria-label="Accessibility Menu"
        style={{
          position: "fixed", bottom: 20, right: 20, width: 60, height: 60,
          borderRadius: "50%", background: settings.enabled ? "#0d9488" : "#4b5563", 
          color: "#fff", border: "none", cursor: "pointer", zIndex: 10000,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
          <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
        </svg>
        {settings.enabled && fixCount > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4, background: '#ef4444',
            color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: 10, fontWeight: 'bold'
          }}>
            {fixCount}
          </span>
        )}
      </button>

      {open && (
        <div ref={panelRef} style={{
          position: "fixed", bottom: 90, right: 20, width: 320,
          background: "#fff", borderRadius: 16, padding: 24,
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)", zIndex: 10001, 
          border: "1px solid #e5e7eb", color: "#111827", fontFamily: "sans-serif"
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 18 }}>YuktAI Engine</h3>
            <span style={{ fontSize: 11, fontWeight: 700, color: settings.enabled ? '#0d9488' : '#94a3b8' }}>
              {settings.enabled ? "● ONLINE" : "○ OFFLINE"}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            
            {/* MASTER ADA TOGGLE */}
            <button 
              onClick={() => updateSetting('enabled', !settings.enabled)}
              style={{
                width: '100%', padding: '12px', borderRadius: 10, cursor: 'pointer',
                background: settings.enabled ? '#f0fdf4' : '#f8fafc',
                border: settings.enabled ? '2px solid #0d9488' : '1px solid #cbd5e1',
                color: settings.enabled ? '#065f46' : '#475569',
                fontWeight: 600, display: 'flex', justifyContent: 'space-between'
              }}
            >
              {settings.enabled ? "Disable ADA Engine" : "Enable ADA Engine"}
              <span>{settings.enabled ? "✓" : "→"}</span>
            </button>

            {/* LIVE INFORMATION */}
            {settings.enabled && (
              <div style={{ padding: '10px', background: '#f1f5f9', borderRadius: 8, fontSize: 12 }}>
                🚀 <strong>{fixCount}</strong> potential accessibility issues auto-fixed.
              </div>
            )}

            <div style={{ borderBottom: '1px solid #f1f5f9', margin: '8px 0' }} />

            {/* FONT SCALER */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 12, color: '#64748b' }}>Zoom Level: {settings.fontScale}%</span>
              <input type="range" min="100" max="200" step="10" value={settings.fontScale} onChange={e => updateSetting('fontScale', parseInt(e.target.value))} style={{ accentColor: '#0d9488' }} />
            </div>

            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              Contrast Mode <input type="checkbox" checked={settings.highContrast} onChange={e => updateSetting('highContrast', e.target.checked)} />
            </label>

            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              Dyslexia Font <input type="checkbox" checked={settings.dyslexiaFont} onChange={e => updateSetting('dyslexiaFont', e.target.checked)} />
            </label>
          </div>
          
          <button onClick={() => setOpen(false)} style={{ width: '100%', marginTop: 24, padding: 12, background: '#0f172a', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
            Done
          </button>
        </div>
      )}
    </>
  );
}