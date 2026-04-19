"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { applyAccessibility, A11yReport } from "./renderer";

export default function YuktAIWrapper({ children }: { children?: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  
  // State for metrics used in the UI report
  const [stats, setStats] = useState<A11yReport>({ fixes: 0, nodes: 0, renderTime: 0 });

  const panelRef = useRef<HTMLDivElement>(null);

  // Prevent hydration mismatch for Next.js 16.2
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Engine Execution
   * Recursively scans children and accumulates the report data.
   */
  const content = useMemo(() => {
    const report: A11yReport = { fixes: 0, nodes: 0, renderTime: 0 };
    const result = applyAccessibility(children, enabled, report);
    
    // Update stats after the render pass completes
    if (mounted) {
      setTimeout(() => {
        setStats((prev) => {
          // Avoid unnecessary re-renders if the numbers haven't changed
          if (prev.fixes === report.fixes && prev.nodes === report.nodes) return prev;
          return { ...report };
        });
      }, 0);
    }
    
    return result;
  }, [children, enabled, mounted]);

  // Handle outside clicks to dismiss the popup
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!mounted) return <>{children}</>;

  return (
    <>
      {/* Accessible Content */}
      {content}

      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open Accessibility Menu"
        style={{
          position: "fixed", bottom: 25, right: 25, width: 60, height: 60,
          borderRadius: "50%", background: "#1a202c", color: "white",
          border: "none", cursor: "pointer", zIndex: 9999,
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)", display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: "28px"
        }}
      >
        ♿
      </button>

      {/* ADA Popup Menu */}
      {open && (
        <div 
          ref={panelRef}
          style={{
            position: "fixed", bottom: 95, right: 25, width: 340,
            background: "#ffffff", borderRadius: "20px", padding: "24px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)", zIndex: 10000,
            border: "1px solid #f0f0f0", fontFamily: "system-ui, -apple-system, sans-serif"
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "22px" }}>♿</span>
              <strong style={{ fontSize: "18px", color: "#1a202c" }}>ADA accessibility</strong>
            </div>
            <button 
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", fontSize: "24px", color: "#a0aec0", cursor: "pointer" }}
            >
              ×
            </button>
          </div>

          {/* Engine Toggle */}
          <button
            onClick={() => setEnabled(!enabled)}
            style={{
              width: "100%", padding: "16px", borderRadius: "12px", border: "none",
              cursor: "pointer", fontWeight: "700", fontSize: "16px",
              background: enabled ? "#dcfce7" : "#eff6ff",
              color: enabled ? "#065f46" : "#2563eb",
              transition: "all 0.2s ease-in-out", marginBottom: "20px"
            }}
          >
            {enabled ? "Disable ADA Engine" : "Enable ADA Engine"}
          </button>

          {/* Configuration List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#4a5568", cursor: "pointer" }}>
              <input type="checkbox" checked={enabled} readOnly style={{ width: "16px", height: "16px" }} />
              High contrast
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#4a5568", cursor: "pointer" }}>
              <input type="checkbox" checked={enabled} readOnly style={{ width: "16px", height: "16px" }} />
              Keyboard navigation hints
            </label>
          </div>

          {/* Technical Report Footer */}
          <div style={{ borderTop: "1px solid #edf2f7", paddingTop: "16px", fontSize: "12px", lineHeight: "1.5", color: "#718096" }}>
            {enabled ? (
              <>
                <div style={{ color: "#2d3748", fontWeight: "600", marginBottom: "4px" }}>
                  yuktai-a11y: {stats.fixes} fixes applied.
                </div>
                <div>Nodes scanned: {stats.nodes}</div>
                <div>Render time: <span style={{ color: "#4a5568" }}>{stats.renderTime}ms</span></div>
              </>
            ) : (
              <div style={{ color: "#a0aec0", fontStyle: "italic" }}>ADA Engine is offline.</div>
            )}
          </div>
          
          <button 
            onClick={() => setOpen(false)}
            style={{ 
              width: "100%", marginTop: "20px", padding: "12px", 
              background: "#1a202c", color: "#fff", borderRadius: "8px", 
              border: "none", cursor: "pointer", fontWeight: "600" 
            }}
          >
            Done
          </button>
        </div>
      )}
    </>
  );
}