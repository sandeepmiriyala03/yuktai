"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { applyAccessibility, A11yReport } from "./renderer";

export default function YuktAIWrapper({ children }: { children?: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  
  // Use a local state for reporting
  const [stats, setStats] = useState<A11yReport>({ fixes: 0, nodes: 0, renderTime: 0 });

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * 1. PREPARE THE REPORT OBJECT
   * We create a fresh object reference for every render cycle.
   */
  const currentReport: A11yReport = { fixes: 0, nodes: 0, renderTime: 0 };
  
  /**
   * 2. EXECUTE ENGINE
   * Pass the 'currentReport' by reference into the recursive walker.
   */
  const content = useMemo(() => {
    return applyAccessibility(children, enabled, currentReport);
  }, [children, enabled]);

  /**
   * 3. SYNC STATS (The Critical Wrapper Change)
   * This useEffect captures the data AFTER the engine finishes walking the tree.
   * Without this, the UI shows 0 because the state updates too late or too early.
   */
  useEffect(() => {
    if (mounted && (stats.fixes !== currentReport.fixes || stats.nodes !== currentReport.nodes)) {
      setStats({ ...currentReport });
    }
  }, [content, enabled, mounted]); // Fires after 'content' is generated

  // Outside click handler
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
      {content}

      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(true)}
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

      {open && (
        <div 
          ref={panelRef}
          style={{
            position: "fixed", bottom: 95, right: 25, width: 340,
            background: "#ffffff", borderRadius: "20px", padding: "24px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)", zIndex: 10000,
            border: "1px solid #f0f0f0", fontFamily: "system-ui, sans-serif"
          }}
        >
          {/* Header & Toggle UI */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "22px" }}>♿</span>
              <strong style={{ fontSize: "18px" }}>ADA accessibility</strong>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px" }}>×</button>
          </div>

          <button
            onClick={() => setEnabled(!enabled)}
            style={{
              width: "100%", padding: "16px", borderRadius: "12px", border: "none",
              cursor: "pointer", fontWeight: "700",
              background: enabled ? "#dcfce7" : "#eff6ff",
              color: enabled ? "#065f46" : "#2563eb",
              marginBottom: "20px"
            }}
          >
            {enabled ? "Disable ADA Engine" : "Enable ADA Engine"}
          </button>

          {/* Corrected Technical Report Section */}
          <div style={{ borderTop: "1px solid #edf2f7", paddingTop: "16px", fontSize: "12px", color: "#718096" }}>
            {enabled ? (
              <>
                <div style={{ color: "#2d3748", fontWeight: "600", marginBottom: "4px" }}>
                  yuktai-a11y: {stats.fixes} fixes applied.
                </div>
                <div>Nodes scanned: {stats.nodes}</div>
                <div style={{ marginTop: "4px", color: "#a0aec0" }}>
                  Render time: {stats.renderTime}ms
                </div>
              </>
            ) : (
              <div style={{ fontStyle: "italic" }}>ADA Engine is offline.</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}