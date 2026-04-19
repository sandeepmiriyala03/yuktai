"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { wcagPlugin } from "../plugins/wcag";
import { applyAccessibility } from "./renderer";

interface YuktAIWrapperProps {
  children?: React.ReactNode;
}

type WCAGLevel = "A" | "AA" | "AAA";

interface WidgetSettings {
  enabled: boolean;        // Controls the applyAccessibility engine
  highContrast: boolean;
  dyslexiaFont: boolean;
  fontScale: number;       // 100% to 200%
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
  
  const panelRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  // 1. Initial Mount & Plugin Start
  useEffect(() => {
    setMounted(true);
    const init = async () => {
      // Use 'as any' to bypass the DTS build error for 'level'
      await (wcagPlugin.execute as any)({ 
        enabled: settings.enabled, 
        autoFix: true,
        level: settings.wcagLevel 
      });
    };
    init();
    return () => wcagPlugin.stopObserver();
  }, []);

  // 2. Global Accessibility Application
  const applyGlobalStyles = useCallback(async (updatedSettings: WidgetSettings) => {
    // Update the dynamic observer plugin with type bypass
    await (wcagPlugin.execute as any)({
      enabled: updatedSettings.enabled,
      highContrast: updatedSettings.highContrast,
      autoFix: true,
      level: updatedSettings.wcagLevel
    });

    // Update Font Scaling (Targeting <html> for rem-based scaling)
    document.documentElement.style.fontSize = `${updatedSettings.fontScale}%`;

    // Handle Dyslexia Font Injection
    const styleId = "yuktai-dyslexia-css";
    let styleTag = document.getElementById(styleId);
    if (updatedSettings.dyslexiaFont) {
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = styleId;
        styleTag.textContent = `
          body, body * { 
            font-family: 'OpenDyslexic', 'Georgia', serif !important; 
            line-height: 1.6 !important; 
            letter-spacing: 0.02em !important;
          }
        `;
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
  };

  // 3. Close panel on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node) && !fabRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // 4. VDOM Transformation
  // This passes 'settings.enabled' to the recursive renderer we built
  const content = mounted ? applyAccessibility(children, settings.enabled) : children;

  return (
    <>
      {content}

      {/* Accessibility Floating Action Button */}
      <button
        ref={fabRef}
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        aria-label="Accessibility Menu"
        aria-expanded={open}
        style={{
          position: "fixed", bottom: 20, right: 20, width: 56, height: 56,
          borderRadius: "50%", background: "#0d9488", color: "#fff",
          border: "none", cursor: "pointer", zIndex: 10000,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
          <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
        </svg>
      </button>

      {/* Settings Menu */}
      {open && (
        <div ref={panelRef} role="dialog" aria-modal="true" style={{
          position: "fixed", bottom: 90, right: 20, width: 300,
          background: "#fff", borderRadius: 16, padding: 24,
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)", zIndex: 10001, 
          border: "1px solid #e5e7eb", color: "#111827",
          fontFamily: "system-ui, -apple-system, sans-serif"
        }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700 }}>Accessibility Suite</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Global Engine Toggle */}
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, fontWeight: 500 }}>
              AI Auto-Fix Engine
              <input type="checkbox" checked={settings.enabled} onChange={e => updateSetting('enabled', e.target.checked)} style={{ cursor: 'pointer', width: 18, height: 18 }} />
            </label>

            {/* Font Scaler */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>Font Scale: {settings.fontScale}%</span>
              <input type="range" min="100" max="200" step="10" value={settings.fontScale} onChange={e => updateSetting('fontScale', parseInt(e.target.value))} style={{ cursor: 'pointer', accentColor: '#0d9488' }} />
            </div>

            {/* WCAG Levels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>Compliance Level</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {(["A", "AA", "AAA"] as WCAGLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => updateSetting('wcagLevel', lvl)}
                    style={{
                      flex: 1, padding: '8px 0', borderRadius: 8, cursor: 'pointer',
                      border: settings.wcagLevel === lvl ? '2px solid #0d9488' : '1px solid #e2e8f0',
                      background: settings.wcagLevel === lvl ? '#f0fdfa' : '#fff',
                      color: settings.wcagLevel === lvl ? '#0d9488' : '#64748b',
                      fontSize: 12, fontWeight: 'bold'
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, cursor: 'pointer' }}>
              High Contrast
              <input type="checkbox" checked={settings.highContrast} onChange={e => updateSetting('highContrast', e.target.checked)} />
            </label>

            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, cursor: 'pointer' }}>
              Dyslexia Font
              <input type="checkbox" checked={settings.dyslexiaFont} onChange={e => updateSetting('dyslexiaFont', e.target.checked)} />
            </label>
          </div>
          
          <button onClick={() => setOpen(false)} style={{ width: '100%', marginTop: 24, padding: 12, background: '#0f172a', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>
            Done
          </button>
        </div>
      )}
    </>
  );
}