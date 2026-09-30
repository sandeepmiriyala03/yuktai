"use client";

/**
 * useYuktaiGridAgent — the ONE execution pipeline for grid actions.
 *
 *   Assistant (YuktaiGridAI) ── ask(text) ──►  intent  ──► executeTool()
 *   Your own buttons         ── executeTool(name, input) ─┘      │
 *                                                                ▼
 *                                         tools from createGridTools()
 *
 * What changed from 4.6.x:
 *  - executeTool NEVER throws. It always resolves to a structured result
 *    { success, message, data?, error?: { code }, tool? } that a UI can show
 *    directly — no raw JSON, no try/catch around every call.
 *  - ask(text) maps plain Telugu/English requests to tools (regex first, no
 *    LLM needed): "sort by lines desc", "పంక్తులు ప్రకారం క్రమం",
 *    "clear filters", "ఎన్ని", "open గర్వం", "గర్వం తెరువు", else → search.
 *  - Tools can be called by full name ("ratnalabala_poems_search") or by
 *    short id ("search").
 *  - Required inputs are checked before a tool runs.
 *  - lastResult / lastError / history are exposed for the Assistant UI.
 *  - loading is correct even when calls overlap; an older call can never
 *    overwrite the result of a newer one.
 *
 * Backward compatible: same hook name, same props (tools, onResult, onError),
 * same return fields (loading, tools, executeTool) plus new ones.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { getRowId, type GridToolErrorCode, type GridToolLocale, type GridToolResult } from "./gridTools";

/* ================= TYPES ================= */

export type GridAgentTool = {
  name: string;
  description: string;
  /** Optional UI label (e.g. Telugu). createGridTools() provides it. */
  label?: string;
  /** Optional JSON schema; its `required` list is checked before running. */
  inputSchema?: Record<string, unknown>;
  execute: (input: Record<string, unknown>) => Promise<unknown> | unknown;
};

export type GridAgentErrorCode = GridToolErrorCode | "NOT_UNDERSTOOD";

export type GridAgentResult<T = unknown> = Omit<GridToolResult<T>, "error"> & {
  error?: { code: GridAgentErrorCode };
  /** Full name of the tool that produced this result */
  tool?: string;
};

export type GridAgentStep = {
  id: number;
  tool: string;
  input: Record<string, unknown>;
  result: GridAgentResult;
  source: "tool" | "ask";
  at: number;
};

export type GridIntent =
  | { kind: "tool"; tool: string; input: Record<string, unknown> }
  /** "open <something>": search for it, then open the first match */
  | { kind: "open"; text: string };

export type GridIntentContext = {
  columns: { key: string; label: string }[];
  locale: GridToolLocale;
};

export type YuktaiGridAgentProps = {
  tools: GridAgentTool[];
  onResult?: (result: GridAgentResult) => void;
  onError?: (error: Error) => void;
  /** Language of the agent's own messages (default "en"). */
  locale?: GridToolLocale;
  /** Columns, so ask() can understand "sort by <column>". */
  columns?: { key: string; label: string }[];
  /** Row ID field — must match the grid's rowKey (default "id"). */
  rowKey?: string;
  /** Replace the built-in regex intent parser (e.g. with an on-device LLM). */
  parseIntent?: (text: string, context: GridIntentContext) => GridIntent | null;
  /** How many steps to keep in history (default 20). */
  historyLimit?: number;
};

/* ================= MESSAGES ================= */

const MESSAGES = {
  en: {
    done: "Done.",
    toolMissing: (name: string) => `The action "${name}" is not available here.`,
    missingInput: (fields: string) => `Missing: ${fields}.`,
    notUnderstood: "Sorry, I didn't understand. Try: a word to search, “sort by <column>”, or “clear filters”.",
    noMatch: (text: string) => `Nothing matched "${text}".`,
    failed: "Something went wrong while running this action.",
  },
  te: {
    done: "పూర్తయింది.",
    toolMissing: (name: string) => `"${name}" సౌకర్యం ఇక్కడ అందుబాటులో లేదు.`,
    missingInput: (fields: string) => `ఇవి కావాలి: ${fields}.`,
    notUnderstood: "క్షమించండి, అర్థం కాలేదు. ఇలా ప్రయత్నించండి: వెతకాల్సిన పదం, “<కాలమ్> ప్రకారం క్రమం”, లేదా “ఫిల్టర్లు తీసేయి”.",
    noMatch: (text: string) => `"${text}" కి ఏమీ సరిపోలేదు.`,
    failed: "ఈ పని చేస్తుండగా సమస్య వచ్చింది.",
  },
};

/* ================= INTENT PARSER (regex first) ================= */

const norm = (s: string) => s.normalize("NFC").toLowerCase().trim();

const RX = {
  clearFilters: /\b(clear|remove|reset)\b.*\bfilters?\b|ఫిల్టర్.*(తీసే|తొలగ)/i,
  clearSort: /\b(clear|remove|reset)\b.*\bsort(ing)?\b|క్రమం.*(తీసే|తొలగ)/i,
  count: /^\s*(how many|count)\b|ఎన్ని|లెక్క/i,
  // "క్రమ" also matches క్రమబద్ధీకరించు; "అమర్చ" matches అమర్చు / అమర్చండి
  sort: /\bsort\b|\border by\b|క్రమ|అమర్చ|సార్ట్/i,
  desc: /\b(desc|descending|z\s*-\s*a|highest|largest|most)\b|అవరోహణ|తగ్గే|పెద్ద|అధిక|చివర|ఎక్కువ నుండి/i,
  openEn: /^\s*open\s+(.+?)\s*$/i,
  openTe: /^\s*(.+?)\s*(తెరువు|తెరవండి|తెరవు)\s*$/,
  searchFiller:
    /^\s*(search(\s+for)?|find|show(\s+me)?|filter(\s+by)?|look\s+for|వెతుకు|వెతకండి|శోధించు|శోధించండి|చూపించు|చూపించండి)\s+|\s+(వెతుకు|వెతకండి|శోధించు|శోధించండి|చూపించు|చూపించండి)\s*$/gi,
};

/** Finds the column mentioned in the text (longest label/key wins). */
function findMentionedColumn(text: string, columns: GridIntentContext["columns"]) {
  const t = norm(text);
  let best: { key: string; len: number } | null = null;
  for (const c of columns) {
    for (const name of [c.label, c.key]) {
      const n = norm(name);
      if (n && t.includes(n) && (!best || n.length > best.len)) best = { key: c.key, len: n.length };
    }
  }
  return best?.key ?? null;
}

/** Built-in parser: exported so it can be tested and reused. */
export function parseGridIntent(text: string, context: GridIntentContext): GridIntent | null {
  const raw = (text ?? "").trim();
  if (!raw) return null;

  if (RX.clearFilters.test(raw)) return { kind: "tool", tool: "clear_filters", input: {} };
  if (RX.clearSort.test(raw)) return { kind: "tool", tool: "clear_sort", input: {} };
  if (RX.count.test(raw)) return { kind: "tool", tool: "count", input: {} };

  if (RX.sort.test(raw)) {
    const key = findMentionedColumn(raw, context.columns);
    if (!key) return null; // "sort" but no known column → ask the person to rephrase
    return { kind: "tool", tool: "sort", input: { key, direction: RX.desc.test(raw) ? "desc" : "asc" } };
  }

  const open = raw.match(RX.openEn) ?? raw.match(RX.openTe);
  if (open?.[1]) return { kind: "open", text: open[1].trim() };

  const query = raw.replace(RX.searchFiller, "").trim();
  return query ? { kind: "tool", tool: "search", input: { query } } : null;
}

/* ================= HELPERS ================= */

function isStructured(value: unknown): value is GridAgentResult {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as GridAgentResult).success === "boolean" &&
    typeof (value as GridAgentResult).message === "string"
  );
}

function missingRequired(tool: GridAgentTool, input: Record<string, unknown>): string[] {
  const required = (tool.inputSchema as { required?: unknown } | undefined)?.required;
  if (!Array.isArray(required)) return [];
  return required
    .map(String)
    .filter((k) => input[k] === undefined || input[k] === null || String(input[k]).trim() === "");
}

/**
 * Exact name first, then "<prefix>_<shortId>". Several tools can share an
 * ending ("…_sort" and "…_clear_sort"), so the shortest name wins — that is
 * the one whose short id is exactly `name`. A tie means it's ambiguous.
 */
function findTool(tools: GridAgentTool[], name: string): GridAgentTool | undefined {
  const exact = tools.find((t) => t.name === name);
  if (exact) return exact;
  const matches = tools
    .filter((t) => t.name.endsWith(`_${name}`))
    .sort((a, b) => a.name.length - b.name.length);
  if (matches.length === 0) return undefined;
  if (matches.length > 1 && matches[0].name.length === matches[1].name.length) return undefined;
  return matches[0];
}

/* ================= HOOK ================= */

export function useYuktaiGridAgent({
  tools,
  onResult,
  onError,
  locale = "en",
  columns = [],
  rowKey = "id",
  parseIntent,
  historyLimit = 20,
}: YuktaiGridAgentProps) {
  const m = MESSAGES[locale];

  const [pending, setPending] = useState(0);
  const [lastResult, setLastResult] = useState<GridAgentResult | null>(null);
  const [lastError, setLastError] = useState<Error | null>(null);
  const [history, setHistory] = useState<GridAgentStep[]>([]);

  // Latest values in refs, so executeTool/ask keep a stable identity even
  // when the parent passes new arrays/callbacks on every render.
  const latest = useRef({ tools, onResult, onError, columns, rowKey, parseIntent, historyLimit, m, locale });
  latest.current = { tools, onResult, onError, columns, rowKey, parseIntent, historyLimit, m, locale };

  const mounted = useRef(true);
  const stepId = useRef(0);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const record = useCallback(
    (tool: string, input: Record<string, unknown>, result: GridAgentResult, source: GridAgentStep["source"], id: number) => {
      if (!mounted.current) return;
      // Only the newest call may set lastResult (older overlapping calls can't overwrite it)
      if (id === stepId.current) setLastResult(result);
      setHistory((h) =>
        [...h, { id, tool, input, result, source, at: Date.now() }].slice(-latest.current.historyLimit)
      );
    },
    []
  );

  const run = useCallback(
    async (name: string, input: Record<string, unknown>, source: GridAgentStep["source"]): Promise<GridAgentResult> => {
      const { tools: list, onResult: onRes, onError: onErr, m: msg } = latest.current;
      const id = ++stepId.current;
      const tool = findTool(list, name);

      if (!tool) {
        const result: GridAgentResult = { success: false, message: msg.toolMissing(name), error: { code: "NOT_SUPPORTED" } };
        const err = new Error(result.message);
        if (mounted.current) setLastError(err);
        onErr?.(err);
        record(name, input, result, source, id);
        return result;
      }

      const missing = missingRequired(tool, input);
      if (missing.length) {
        const result: GridAgentResult = {
          success: false,
          message: msg.missingInput(missing.join(", ")),
          error: { code: "INVALID_INPUT" },
          tool: tool.name,
        };
        record(tool.name, input, result, source, id);
        onRes?.(result);
        return result;
      }

      if (mounted.current) setPending((p) => p + 1);
      try {
        const raw = await tool.execute(input);
        const result: GridAgentResult = isStructured(raw)
          ? { ...raw, tool: tool.name }
          : { success: true, message: msg.done, data: raw, tool: tool.name };
        if (mounted.current && result.success) setLastError(null);
        record(tool.name, input, result, source, id);
        onRes?.(result);
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        const result: GridAgentResult = { success: false, message: msg.failed, error: { code: "INTERNAL" }, tool: tool.name };
        if (mounted.current) setLastError(err);
        onErr?.(err);
        record(tool.name, input, result, source, id);
        return result;
      } finally {
        if (mounted.current) setPending((p) => Math.max(0, p - 1));
      }
    },
    [record]
  );

  /** Run one tool by full name or short id. Never throws. */
  const executeTool = useCallback(
    (name: string, input: Record<string, unknown> = {}) => run(name, input ?? {}, "tool"),
    [run]
  );

  /** Understand a plain-language request and run the matching tool(s). */
  const ask = useCallback(
    async (text: string): Promise<GridAgentResult> => {
      const { columns: cols, locale: loc, parseIntent: custom, m: msg, rowKey: key } = latest.current;
      const context: GridIntentContext = { columns: cols, locale: loc };
      const intent = (custom ?? parseGridIntent)(text, context);

      if (!intent) {
        const result: GridAgentResult = { success: false, message: msg.notUnderstood, error: { code: "NOT_UNDERSTOOD" } };
        record("ask", { text }, result, "ask", ++stepId.current);
        return result;
      }

      if (intent.kind === "tool") return run(intent.tool, intent.input, "ask");

      // "open X": search first, then open the first match
      const found = await run("search", { query: intent.text }, "ask");
      const rows = Array.isArray(found.data) ? found.data : [];
      if (!found.success) return found;
      if (rows.length === 0) {
        const result: GridAgentResult = { success: false, message: msg.noMatch(intent.text), error: { code: "NOT_FOUND" }, tool: found.tool };
        record("open", { text: intent.text }, result, "ask", ++stepId.current);
        return result;
      }
      return run("open", { id: getRowId(rows[0], key) }, "ask");
    },
    [record, run]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    setLastResult(null);
    setLastError(null);
  }, []);

  return {
    loading: pending > 0,
    tools,
    executeTool,
    ask,
    lastResult,
    lastError,
    history,
    clearHistory,
  };
}

export default useYuktaiGridAgent;