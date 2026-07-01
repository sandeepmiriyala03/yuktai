"use client";

// ─────────────────────────────────────────────────────────────────────────────
// @yuktishaalaa/yuktai · src/grid/YuktaiGridAI.tsx
//
// AI features for YuktaiGrid — Voice search + Chat with data
// v4.2.0
//
// Features:
// 1. 🎤 Voice input  — Web Speech API (no cost, no LLM)
// 2. 💬 Chat panel   — ask questions about grid data
// 3. 🔊 TTS response — reads answers aloud
//
// No LLM. No downloads. No API keys. 100% free forever.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect, useCallback } from "react";

// ── Types ─────────────────────────────────────────────────────
interface ChatMessage {
  role: "user" | "ai";
  text: string;
  time: string;
}

export interface YuktaiGridAIProps<T> {
  data:       T[];
  columns:    { key: string; label: string; type?: "number" | "text" | "date" }[];
  onSearch:   (query: string) => void;   // fires when voice search detected
  onSort?:    (key: string, dir: "asc" | "desc") => void;
  theme?:     "light" | "dark";
  language?:  "en-US" | "en-IN" | "hi-IN" | "te-IN";
}

// ─────────────────────────────────────────────────────────────
// Simple NLP parser — understands intent from natural language
// No AI model needed — just clever pattern matching
// ─────────────────────────────────────────────────────────────
function parseIntent(text: string): { type: string; payload?: any } {
  const t = text.toLowerCase().trim();

  // Command intents
  if (/^(search|find|show|filter)/.test(t)) {
    const term = t.replace(/^(search|find|show|filter)\s+(for\s+|by\s+)?/, "").trim();
    return { type: "search", payload: term };
  }

  if (/sort/.test(t)) {
    const dir = /desc|high|large|top/.test(t) ? "desc" : "asc";
    const key = t.match(/(name|age|salary|role|email|date)/)?.[1];
    return { type: "sort", payload: { key, dir } };
  }

  // Question intents (chat)
  if (/^(who|what|which|how many|highest|lowest|max|min|average|avg|total|sum)/.test(t)) {
    return { type: "question", payload: text };
  }

  // Everything else = plain search
  return { type: "search", payload: text };
}

// ─────────────────────────────────────────────────────────────
// Data analyzer — answers questions using row data
// No LLM — just Math + string matching
// ─────────────────────────────────────────────────────────────
function answerQuestion<T extends Record<string, unknown>>(
  question: string,
  data: T[],
  columns: YuktaiGridAIProps<T>["columns"]
): string {
  if (data.length === 0) return "There is no data to analyze.";

  const q = question.toLowerCase();

  // Count questions
  if (/how many|count|total/.test(q)) {
    return `There are ${data.length} rows in the grid.`;
  }

  // Find numeric column referenced
  const numericCols = columns.filter(c => c.type === "number");
  const referencedCol = columns.find(c => q.includes(c.label.toLowerCase()) || q.includes(c.key.toLowerCase()));

  // Highest / max
  if (/highest|maximum|max|top|largest/.test(q)) {
    const col = referencedCol ?? numericCols[0];
    if (!col) return "I could not find a column to analyze.";
    const values = data
      .map(r => ({ row: r, val: Number(r[col.key]) }))
      .filter(x => !isNaN(x.val))
      .sort((a, b) => b.val - a.val);
    if (values.length === 0) return `No numeric data in ${col.label}.`;
    const top = values[0];
    const nameCol = columns.find(c => c.key === "name" || c.label.toLowerCase() === "name");
    const name = nameCol ? String(top.row[nameCol.key]) : `Row ${data.indexOf(top.row) + 1}`;
    return `The highest ${col.label} is ${top.val.toLocaleString("en-IN")}, held by ${name}.`;
  }

  // Lowest / min
  if (/lowest|minimum|min|smallest|bottom/.test(q)) {
    const col = referencedCol ?? numericCols[0];
    if (!col) return "I could not find a column to analyze.";
    const values = data
      .map(r => ({ row: r, val: Number(r[col.key]) }))
      .filter(x => !isNaN(x.val))
      .sort((a, b) => a.val - b.val);
    if (values.length === 0) return `No numeric data in ${col.label}.`;
    const bottom = values[0];
    const nameCol = columns.find(c => c.key === "name" || c.label.toLowerCase() === "name");
    const name = nameCol ? String(bottom.row[nameCol.key]) : `Row ${data.indexOf(bottom.row) + 1}`;
    return `The lowest ${col.label} is ${bottom.val.toLocaleString("en-IN")}, held by ${name}.`;
  }

  // Average
  if (/average|avg|mean/.test(q)) {
    const col = referencedCol ?? numericCols[0];
    if (!col) return "I could not find a column to analyze.";
    const values = data.map(r => Number(r[col.key])).filter(v => !isNaN(v));
    if (values.length === 0) return `No numeric data in ${col.label}.`;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return `The average ${col.label} is ${Math.round(avg).toLocaleString("en-IN")}.`;
  }

  // Sum / total
  if (/sum|total/.test(q)) {
    const col = referencedCol ?? numericCols[0];
    if (!col) return "I could not find a column to analyze.";
    const values = data.map(r => Number(r[col.key])).filter(v => !isNaN(v));
    if (values.length === 0) return `No numeric data in ${col.label}.`;
    const sum = values.reduce((a, b) => a + b, 0);
    return `The total ${col.label} is ${sum.toLocaleString("en-IN")}.`;
  }

  // Who / where / which — name lookup
  if (/who|where|which|whose/.test(q)) {
    const nameMatch = q.match(/\b([a-z]{3,})\b/g)?.filter(w =>
      !["who", "where", "which", "whose", "is", "the", "has", "have"].includes(w)
    );
    if (!nameMatch) return "I need a name to look up.";
    const searchTerm = nameMatch.join(" ");
    const found = data.find(r =>
      Object.values(r).some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase()))
    );
    if (!found) return `I could not find anyone matching "${searchTerm}".`;
    const summary = columns
      .map(c => `${c.label}: ${found[c.key]}`)
      .join(", ");
    return summary;
  }

  return "I understand you have a question. Try asking 'highest salary' or 'how many rows'.";
}

// ─────────────────────────────────────────────────────────────
// Speech Recognition hook — Web Speech API wrapper
// ─────────────────────────────────────────────────────────────
function useSpeechRecognition(language: string = "en-US") {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(true);
  const recogRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }
    const recog = new SR();
    recog.continuous = false;
    recog.interimResults = false;
    recog.lang = language;
    recog.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setListening(false);
    };
    recog.onerror = () => setListening(false);
    recog.onend = () => setListening(false);
    recogRef.current = recog;
  }, [language]);

  const start = useCallback(() => {
    if (!recogRef.current) return;
    setTranscript("");
    setListening(true);
    try {
      recogRef.current.start();
    } catch {
      setListening(false);
    }
  }, []);

  const stop = useCallback(() => {
    recogRef.current?.stop();
    setListening(false);
  }, []);

  return { listening, transcript, supported, start, stop };
}

// ─────────────────────────────────────────────────────────────
// Text-to-Speech helper
// ─────────────────────────────────────────────────────────────
function speak(text: string, lang: string = "en-US") {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

// ─────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────
export function YuktaiGridAI<T extends Record<string, unknown>>({
  data,
  columns,
  onSearch,
  onSort,
  theme    = "light",
  language = "en-US",
}: YuktaiGridAIProps<T>) {

  const [chatOpen, setChatOpen]     = useState(false);
  const [input, setInput]           = useState("");
  const [messages, setMessages]     = useState<ChatMessage[]>([
    {
      role: "ai",
      text: "Hi! Ask me anything about your data — like 'highest salary' or 'how many rows'. You can also say 'search Sandeep' or 'sort age descending'.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { listening, transcript, supported, start, stop } = useSpeechRecognition(language);

  const dark = theme === "dark";
  const colors = {
    bg:       dark ? "#0F172A" : "#FFFFFF",
    surface:  dark ? "#1E293B" : "#F8FAFC",
    border:   dark ? "#334155" : "#E2E8F0",
    text:     dark ? "#F1F5F9" : "#0F172A",
    muted:    dark ? "#94A3B8" : "#64748B",
    accent:   "#10B981",
    userMsg:  dark ? "#334155" : "#DBEAFE",
    aiMsg:    dark ? "#1E293B" : "#F0FDF4",
  };

  // ── Auto-scroll chat ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Handle voice transcript ──
  useEffect(() => {
    if (!transcript) return;
    handleUserInput(transcript);
  }, [transcript]);

  // ── Process user input (typed or spoken) ──
  const handleUserInput = (text: string) => {
    if (!text.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { role: "user", text, time }]);
    setInput("");

    const intent = parseIntent(text);

    // Execute action based on intent
    let aiResponse = "";

    if (intent.type === "search") {
      onSearch(intent.payload);
      aiResponse = `Searching for "${intent.payload}"...`;
    } else if (intent.type === "sort" && onSort) {
      const { key, dir } = intent.payload;
      if (key) {
        onSort(key, dir);
        aiResponse = `Sorted by ${key} (${dir === "asc" ? "ascending" : "descending"}).`;
      } else {
        aiResponse = "Which column should I sort? Try 'sort by salary'.";
      }
    } else if (intent.type === "question") {
      aiResponse = answerQuestion(intent.payload, data, columns);
    }

    // Add AI response
    setTimeout(() => {
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages(prev => [...prev, { role: "ai", text: aiResponse, time }]);
      speak(aiResponse, language);
    }, 400);
  };

  const handleSubmit = () => handleUserInput(input);

  const suggestions = [
    "highest salary",
    "how many rows",
    "average age",
    "search sandeep",
  ];

  return (
    <>
      {/* ── Floating AI button ── */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        aria-label={chatOpen ? "Close AI assistant" : "Open AI assistant"}
        style={{
          position:     "fixed",
          bottom:       24,
          right:        24,
          zIndex:       9998,
          width:        56,
          height:       56,
          borderRadius: 28,
          background:   colors.accent,
          color:        "#FFFFFF",
          border:       "none",
          cursor:       "pointer",
          boxShadow:    "0 8px 20px rgba(16,185,129,0.3)",
          display:      "flex",
          alignItems:   "center",
          justifyContent:"center",
          fontSize:     20,
          transition:   "transform 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        {chatOpen ? "✕" : "🤖"}
      </button>

      {/* ── Chat panel ── */}
      {chatOpen && (
        <div
          role="dialog"
          aria-label="AI Grid Assistant"
          style={{
            position:      "fixed",
            bottom:        90,
            right:         24,
            width:         360,
            maxWidth:      "calc(100vw - 48px)",
            height:        480,
            maxHeight:     "70vh",
            background:    colors.bg,
            border:        `1px solid ${colors.border}`,
            borderRadius:  16,
            boxShadow:     "0 20px 40px rgba(0,0,0,0.15)",
            zIndex:        9997,
            display:       "flex",
            flexDirection: "column",
            overflow:      "hidden",
            fontFamily:    "system-ui, sans-serif",
          }}
        >
          {/* Header */}
          <div style={{
            padding:      "14px 16px",
            background:   colors.accent,
            color:        "#FFFFFF",
            display:      "flex",
            alignItems:   "center",
            gap:          10,
          }}>
            <span style={{ fontSize: 22 }}>🤖</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Grid AI Assistant</div>
              <div style={{ fontSize: 11, opacity: 0.9 }}>
                {supported ? "Voice + Chat · Offline · Free" : "Chat only (voice not supported)"}
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              aria-label="Close"
              style={{
                background: "transparent",
                border:     "none",
                color:      "#FFFFFF",
                cursor:     "pointer",
                fontSize:   20,
                padding:    4,
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex:       1,
            overflowY:  "auto",
            padding:    12,
            display:    "flex",
            flexDirection: "column",
            gap:        8,
          }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf:      msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth:       "85%",
                  padding:        "8px 12px",
                  borderRadius:   12,
                  background:     msg.role === "user" ? colors.userMsg : colors.aiMsg,
                  color:          colors.text,
                  fontSize:       13.5,
                  lineHeight:     1.5,
                }}
              >
                <div>{msg.text}</div>
                <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: "right" }}>
                  {msg.time}
                </div>
              </div>
            ))}
            {listening && (
              <div style={{
                alignSelf:    "flex-end",
                padding:      "8px 12px",
                borderRadius: 12,
                background:   "#FEE2E2",
                color:        "#991B1B",
                fontSize:     13.5,
                fontStyle:    "italic",
              }}>
                🎤 Listening...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion chips */}
          <div style={{
            padding:    "6px 12px",
            borderTop:  `1px solid ${colors.border}`,
            display:    "flex",
            gap:        6,
            overflowX:  "auto",
            flexShrink: 0,
          }}>
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => handleUserInput(s)}
                style={{
                  padding:      "4px 10px",
                  borderRadius: 12,
                  background:   colors.surface,
                  border:       `1px solid ${colors.border}`,
                  color:        colors.text,
                  fontSize:     11.5,
                  cursor:       "pointer",
                  whiteSpace:   "nowrap",
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input area */}
          <div style={{
            padding:    10,
            display:    "flex",
            gap:        6,
            borderTop:  `1px solid ${colors.border}`,
            background: colors.surface,
          }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="Ask or say a command..."
              aria-label="Chat input"
              style={{
                flex:         1,
                padding:      "8px 12px",
                border:       `1px solid ${colors.border}`,
                borderRadius: 8,
                background:   colors.bg,
                color:        colors.text,
                fontSize:     13,
                outline:      "none",
              }}
            />

            {/* Mic button */}
            {supported && (
              <button
                onClick={listening ? stop : start}
                aria-label={listening ? "Stop listening" : "Start voice input"}
                style={{
                  width:        36,
                  height:       36,
                  borderRadius: 8,
                  background:   listening ? "#EF4444" : colors.accent,
                  color:        "#FFFFFF",
                  border:       "none",
                  cursor:       "pointer",
                  display:      "flex",
                  alignItems:   "center",
                  justifyContent:"center",
                  fontSize:     16,
                  flexShrink:   0,
                  animation:    listening ? "yuktai-pulse 1s ease-in-out infinite" : "none",
                }}
              >
                🎤
              </button>
            )}

            <button
              onClick={handleSubmit}
              aria-label="Send"
              disabled={!input.trim()}
              style={{
                padding:      "0 14px",
                background:   input.trim() ? colors.accent : colors.muted,
                color:        "#FFFFFF",
                border:       "none",
                borderRadius: 8,
                cursor:       input.trim() ? "pointer" : "not-allowed",
                fontSize:     13,
                fontWeight:   600,
                flexShrink:   0,
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes yuktai-pulse {
          0%, 100% { transform: scale(1);   box-shadow: 0 0 0 0    rgba(239, 68, 68, 0.4); }
          50%      { transform: scale(1.1); box-shadow: 0 0 0 8px  rgba(239, 68, 68, 0);   }
        }
      `}</style>
    </>
  );
}

export default YuktaiGridAI;