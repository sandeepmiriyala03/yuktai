"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { render, A11yReport } from "./renderer";

export default function YuktAIWrapper({ children }: { children?: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  
  // State for the UI report
  const [stats, setStats] = useState<A11yReport>({ fixes: 0, nodes: 0, renderTime: 0 });

  const panelRef = useRef<HTMLDivElement>(null);

  // 1. Initial Mount & Global Style Injection (AAA Compliance)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (enabled) {
      // Inject Global CSS for Focus Rings and Contrast (WCAG AA/AAA)
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

  // 2. Execute Engine and Sync Stats
  // We use a fresh report object per render to ensure accurate counts
  const currentReport: A11yReport = { fixes: 0, nodes: 0, renderTime: 0 };
  
  const content = useMemo(() => {
    return render(children, enabled, currentReport);
  }, [children, enabled]);

  // Sync state after the recursive walk completes to avoid "0 nodes" error
  useEffect(() => {
    if (mounted) {
      setStats({ ...currentReport });
    }
  }, [content, enabled, mounted]);

  // Handle outside clicks to close the popup
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

      {/* Trigger Button */}
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

      {/* ADA Popup */}
      {open && (
        <div 
          ref={panelRef}
          style={{
            position: "fixed", bottom: 95, right: 25, width: 340,
            background: "#ffffff", borderRadius: "20px", padding: "24px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)", zIndex: 10000,
            border: "1px solid #f0f0f0", fontFamily: "sans-serif"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22 }}>♿</span>
              <strong style={{ fontSize: 18 }}>ADA accessibility</strong>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", fontSize: 24, color: "#ccc", cursor: "pointer" }}>×</button>
          </div>

          <button
            onClick={() => setEnabled(!enabled)}
            style={{
              width: "100%", padding: 16, borderRadius: 12, border: "none",
              cursor: "pointer", fontWeight: "700",
              background: enabled ? "#dcfce7" : "#eff6ff",
              color: enabled ? "#065f46" : "#2563eb",
              marginBottom: 20, transition: "0.2s"
            }}
          >
            {enabled ? "Disable ADA Engine" : "Enable ADA Engine"}
          </button>

          {/* Report Footer */}
          <div style={{ borderTop: "1px solid #edf2f7", paddingTop: 16, fontSize: 13, color: "#718096" }}>
            {enabled ? (
              <>
                <div style={{ color: "#2d3748", fontWeight: "600", marginBottom: 4 }}>
                  yuktai-a11y: {stats.fixes} fixes applied.
                </div>
                <div>Nodes scanned: {stats.nodes}</div>
                <div style={{ marginTop: 4, color: "#a0aec0", fontSize: 11 }}>
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