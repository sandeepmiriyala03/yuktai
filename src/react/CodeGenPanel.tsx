// ─────────────────────────────────────────────────────────────────────────────
// src/react/CodeGenPanel.tsx
// yuktai Vibe Coder — Code Generation Panel
//
// User types business requirement → plugin generates Next.js ZIP
// No API. No LLM. Pure template generation.
// ─────────────────────────────────────────────────────────────────────────────

"use client"

import React, { useState, useCallback } from "react"
import { parseRequirement, type ParsedRequirement } from "../core/codegen/requirement-parser"

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
interface Props {
  position: "left" | "right"
  onClose:  () => void
}

type Step = "input" | "preview" | "generating" | "done"

// ─────────────────────────────────────────────────────────────────────────────
// Example prompts
// ─────────────────────────────────────────────────────────────────────────────
const EXAMPLES = [
  "Hotel booking website for Grand Palace Hotels with rooms, booking and payment",
  "E-commerce store for organic food products with cart and checkout",
  "Restaurant website for Spice Garden with menu and table reservations",
  "Portfolio website for a freelance designer with gallery and contact",
  "SaaS dashboard for project management with pricing and auth",
  "Government portal for citizen services with FAQ and contact",
]

// ─────────────────────────────────────────────────────────────────────────────
// PAGE ICONS
// ─────────────────────────────────────────────────────────────────────────────
const PAGE_ICONS: Record<string, string> = {
  home: "🏠", about: "ℹ️", contact: "📬", services: "⚙️",
  pricing: "💰", blog: "📝", auth: "🔐", dashboard: "📊",
  gallery: "🖼️", products: "🛒", cart: "🛍️", checkout: "💳",
  rooms: "🛏️", booking: "📅", menu: "🍽️", reservations: "🪑",
  portfolio: "💼", team: "👥", faq: "❓", terms: "📄", privacy: "🔒",
}

const TYPE_ICONS: Record<string, string> = {
  hotel: "🏨", ecommerce: "🛒", restaurant: "🍽️", portfolio: "💼",
  blog: "📝", saas: "⚡", government: "🏛️", healthcare: "🏥",
  education: "🎓", realestate: "🏠", landing: "🚀", generic: "🌐",
}

// ─────────────────────────────────────────────────────────────────────────────
// CodeGenPanel
// ─────────────────────────────────────────────────────────────────────────────
export default function CodeGenPanel({ position, onClose }: Props) {
  const [step,        setStep]        = useState<Step>("input")
  const [requirement, setRequirement] = useState("")
  const [parsed,      setParsed]      = useState<ParsedRequirement | null>(null)
  const [progress,    setProgress]    = useState(0)
  const [error,       setError]       = useState("")

  // ─────────────────────────────────────────────────────────────────────────
  // handleAnalyse — parses requirement and shows preview
  // ─────────────────────────────────────────────────────────────────────────
  const handleAnalyse = useCallback(() => {
    if (!requirement.trim()) return
    const result = parseRequirement(requirement)
    setParsed(result)
    setStep("preview")
  }, [requirement])

  // ─────────────────────────────────────────────────────────────────────────
  // handleGenerate — generates ZIP and downloads
  // ─────────────────────────────────────────────────────────────────────────
  const handleGenerate = useCallback(async () => {
    if (!parsed) return
    setStep("generating")
    setProgress(0)
    setError("")

    try {
      // Simulate progress steps
      const steps = [
        { msg: "Parsing requirement...",    pct: 15  },
        { msg: "Loading templates...",      pct: 30  },
        { msg: "Generating pages...",       pct: 55  },
        { msg: "Building components...",    pct: 70  },
        { msg: "Creating styles...",        pct: 85  },
        { msg: "Packaging ZIP...",          pct: 95  },
      ]

      for (const s of steps) {
        setProgress(s.pct)
        await new Promise(r => setTimeout(r, 200))
      }

      const { generateZip } = await import("../core/codegen/zip-generator")
      await generateZip(parsed)

      setProgress(100)
      setStep("done")

    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed. Please try again.")
      setStep("preview")
    }
  }, [parsed])

  // ─────────────────────────────────────────────────────────────────────────
  // handleReset
  // ─────────────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setStep("input")
    setRequirement("")
    setParsed(null)
    setProgress(0)
    setError("")
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Panel styles
  // ─────────────────────────────────────────────────────────────────────────
  const panelStyle: React.CSSProperties = {
    position:     "fixed",
    bottom:       "204px",
    [position]:   "24px",
    zIndex:       9999,
    width:        "340px",
    maxWidth:     "calc(100vw - 48px)",
    background:   "#fff",
    border:       "1px solid #e2e8f0",
    borderRadius: "16px",
    boxShadow:    "0 8px 32px rgba(0,0,0,0.14)",
    fontFamily:   "system-ui,-apple-system,sans-serif",
    maxHeight:    "75vh",
    overflowY:    "auto",
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="yuktai Vibe Coder"
      data-yuktai-panel="true"
      style={panelStyle}
    >

      {/* ── Header ── */}
      <div style={{
        padding:      "14px 16px 12px",
        borderBottom: "1px solid #f1f5f9",
        display:      "flex",
        alignItems:   "flex-start",
        justifyContent: "space-between",
        position:     "sticky",
        top:          0,
        background:   "#fff",
        zIndex:       1,
      }}>
        <div>
          <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
            ⚡ Vibe Coder
          </p>
          <p style={{ margin: 0, fontSize: "10px", color: "#64748b" }}>
            Describe your website → Download Next.js ZIP
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close vibe coder"
          style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: "18px", padding: "2px" }}
        >
          ×
        </button>
      </div>

      {/* ── STEP 1: INPUT ── */}
      {step === "input" && (
        <div style={{ padding: "14px 16px" }}>

          <p style={{ margin: "0 0 10px", fontSize: "11px", color: "#64748b" }}>
            Describe your business website in plain English.
            The plugin will generate a complete Next.js project for you.
          </p>

          {/* Examples */}
          <p style={{ margin: "0 0 6px", fontSize: "10px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>
            Examples
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px" }}>
            {EXAMPLES.slice(0, 3).map(ex => (
              <button
                key={ex}
                onClick={() => setRequirement(ex)}
                style={{
                  padding:     "6px 10px",
                  borderRadius: "8px",
                  border:      "1px solid #e2e8f0",
                  background:  "#f8fafc",
                  color:       "#475569",
                  fontSize:    "10px",
                  cursor:      "pointer",
                  textAlign:   "left",
                  lineHeight:  1.4,
                }}
              >
                {ex}
              </button>
            ))}
          </div>

          {/* Input */}
          <textarea
            value={requirement}
            onChange={e => setRequirement(e.target.value)}
            placeholder="e.g. I need a hotel booking website with rooms, search, and payment for Grand Palace Hotels"
            rows={4}
            aria-label="Describe your website"
            style={{
              width:        "100%",
              padding:      "10px",
              borderRadius: "8px",
              border:       "1px solid #e2e8f0",
              fontSize:     "12px",
              color:        "#0f172a",
              resize:       "vertical",
              outline:      "none",
              fontFamily:   "inherit",
              lineHeight:   1.5,
            }}
          />

          <button
            onClick={handleAnalyse}
            disabled={!requirement.trim()}
            style={{
              width:        "100%",
              marginTop:    "10px",
              padding:      "10px",
              borderRadius: "8px",
              border:       "none",
              background:   requirement.trim() ? "#f59e0b" : "#e2e8f0",
              color:        requirement.trim() ? "#fff" : "#94a3b8",
              fontSize:     "13px",
              fontWeight:   700,
              cursor:       requirement.trim() ? "pointer" : "not-allowed",
              transition:   "background 0.2s",
            }}
          >
            Analyse Requirement →
          </button>

        </div>
      )}

      {/* ── STEP 2: PREVIEW ── */}
      {step === "preview" && parsed && (
        <div style={{ padding: "14px 16px" }}>

          {error && (
            <div style={{ padding: "10px", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", marginBottom: "12px", fontSize: "11px", color: "#dc2626" }}>
              ⚠️ {error}
            </div>
          )}

          {/* Detected info */}
          <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "12px", marginBottom: "12px" }}>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontSize: "1.5rem" }}>{TYPE_ICONS[parsed.websiteType] || "🌐"}</span>
              <div>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>{parsed.siteName}</p>
                <p style={{ margin: 0, fontSize: "10px", color: "#64748b", textTransform: "capitalize" }}>
                  {parsed.websiteType} website · {parsed.theme} theme
                </p>
              </div>
            </div>

            {/* Pages */}
            <p style={{ margin: "8px 0 6px", fontSize: "10px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>
              Pages to generate ({parsed.pages.length})
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {parsed.pages.map(page => (
                <span
                  key={page}
                  style={{
                    padding:      "2px 8px",
                    borderRadius: "99px",
                    background:   "#f0fdf4",
                    border:       "1px solid #86efac",
                    fontSize:     "10px",
                    color:        "#166534",
                    fontWeight:   500,
                  }}
                >
                  {PAGE_ICONS[page] || "📄"} {page}
                </span>
              ))}
            </div>

            {/* Features */}
            {parsed.features.length > 0 && (
              <>
                <p style={{ margin: "10px 0 6px", fontSize: "10px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>
                  Detected features
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {parsed.features.map(f => (
                    <span
                      key={f}
                      style={{
                        padding:      "2px 8px",
                        borderRadius: "99px",
                        background:   "#f5f3ff",
                        border:       "1px solid #c4b5fd",
                        fontSize:     "10px",
                        color:        "#7c3aed",
                        fontWeight:   500,
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* What you get */}
          <div style={{ margin: "0 0 12px", padding: "10px 12px", background: "#f0fdf4", borderRadius: "8px", border: "1px solid #86efac" }}>
            <p style={{ margin: "0 0 4px", fontSize: "10px", fontWeight: 700, color: "#166534" }}>📦 What you get:</p>
            <p style={{ margin: 0, fontSize: "10px", color: "#166534", lineHeight: 1.6 }}>
              ✅ Complete Next.js 16 project<br />
              ✅ Tailwind CSS + CSS Modules<br />
              ✅ TypeScript configured<br />
              ✅ Navbar + Footer components<br />
              ✅ All {parsed.pages.length} pages ready<br />
              ✅ Mobile responsive<br />
              ✅ npm run dev → works immediately
            </p>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleReset}
              style={{
                flex:         1,
                padding:      "9px",
                borderRadius: "8px",
                border:       "1px solid #e2e8f0",
                background:   "#fff",
                color:        "#64748b",
                fontSize:     "12px",
                fontWeight:   600,
                cursor:       "pointer",
              }}
            >
              ← Edit
            </button>
            <button
              onClick={handleGenerate}
              style={{
                flex:         2,
                padding:      "9px",
                borderRadius: "8px",
                border:       "none",
                background:   "#f59e0b",
                color:        "#fff",
                fontSize:     "13px",
                fontWeight:   700,
                cursor:       "pointer",
              }}
            >
              ⬇️ Generate & Download ZIP
            </button>
          </div>

        </div>
      )}

      {/* ── STEP 3: GENERATING ── */}
      {step === "generating" && (
        <div style={{ padding: "2rem 16px", textAlign: "center" }}>
          <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚡</p>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>
            Generating your project...
          </p>
          <p style={{ fontSize: "11px", color: "#64748b", marginBottom: "1.5rem" }}>
            {progress < 30  ? "Parsing requirement..." :
             progress < 55  ? "Loading templates..." :
             progress < 70  ? "Generating pages..." :
             progress < 85  ? "Building components..." :
             progress < 95  ? "Creating styles..." :
             "Packaging ZIP..."}
          </p>
          {/* Progress bar */}
          <div style={{ height: "8px", background: "#e2e8f0", borderRadius: "99px", overflow: "hidden" }}>
            <div style={{
              height:     "100%",
              width:      `${progress}%`,
              background: "#f59e0b",
              borderRadius: "99px",
              transition: "width 0.3s ease",
            }} />
          </div>
          <p style={{ marginTop: "0.5rem", fontSize: "10px", color: "#94a3b8" }}>{progress}%</p>
        </div>
      )}

      {/* ── STEP 4: DONE ── */}
      {step === "done" && parsed && (
        <div style={{ padding: "2rem 16px", textAlign: "center" }}>
          <p style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>✅</p>
          <p style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>
            {parsed.siteName} downloaded!
          </p>
          <p style={{ fontSize: "11px", color: "#64748b", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            Your ZIP is downloading. Unzip it and run:
          </p>

          {/* Commands */}
          {["npm install", "npm run dev"].map(cmd => (
            <div
              key={cmd}
              style={{
                background:   "#0f172a",
                borderRadius: "8px",
                padding:      "8px 12px",
                marginBottom: "6px",
                textAlign:    "left",
              }}
            >
              <code style={{ fontSize: "12px", color: "#a7f3d0", fontFamily: "monospace" }}>
                $ {cmd}
              </code>
            </div>
          ))}

          <p style={{ fontSize: "11px", color: "#10b981", margin: "1rem 0", fontWeight: 600 }}>
            Then open http://localhost:3000 🚀
          </p>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleReset}
              style={{
                flex:         1,
                padding:      "9px",
                borderRadius: "8px",
                border:       "1px solid #e2e8f0",
                background:   "#fff",
                color:        "#64748b",
                fontSize:     "12px",
                fontWeight:   600,
                cursor:       "pointer",
              }}
            >
              New Project
            </button>
            <button
              onClick={handleGenerate}
              style={{
                flex:         1,
                padding:      "9px",
                borderRadius: "8px",
                border:       "none",
                background:   "#f59e0b",
                color:        "#fff",
                fontSize:     "12px",
                fontWeight:   700,
                cursor:       "pointer",
              }}
            >
              ⬇️ Download Again
            </button>
          </div>
        </div>
      )}

    </div>
  )
}