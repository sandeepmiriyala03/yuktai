"use client";

/**
 * YuktaiGridWebMCP — exposes grid tools to AI agents through WebMCP
 * (document.modelContext). Renders nothing.
 *
 * What changed from 4.6.x:
 *  - Uses the SAME tool list as the in-page Agent (createGridTools), or a
 *    `tools` list passed in by YuktaiGrid — so what agents can call always
 *    matches what the UI can do.
 *  - Real status: onStatusChange reports "unsupported" | "registering" |
 *    "ready" | "partial" | "error", which tools actually registered, and
 *    per-tool errors. Nothing is swallowed silently any more.
 *  - Data changes do NOT re-register tools. Each registered tool calls the
 *    latest tool through a ref; tools are re-registered only when the tool
 *    list itself changes (names / descriptions / schemas).
 *  - Registrations are serialised: a new round waits until the previous
 *    round has finished and been aborted, so a tool name is never
 *    registered twice at the same moment.
 *
 * Backward compatible: the 4.6.x props (data, columns, name, onSelectRow,
 * onHighlightRows, onOpenRow) still work.
 */

import { useEffect, useMemo, useRef } from "react";
import {
  createGridTools,
  type CreateGridToolsOptions,
  type GridTool,
  type GridToolColumn,
  type GridToolContext,
  type GridToolLocale,
} from "./gridTools";

/* ================= WebMCP typing ================= */

type ModelContextTool = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: any) => Promise<unknown> | unknown;
};

declare global {
  interface Document {
    modelContext?: {
      registerTool: (tool: ModelContextTool, options?: { signal?: AbortSignal }) => Promise<void>;
    };
  }
}

/* ================= Status ================= */

export type WebMCPState = "unsupported" | "registering" | "ready" | "partial" | "error";

export type WebMCPStatus = {
  state: WebMCPState;
  /** Tools that the browser actually accepted */
  registered: string[];
  errors: { tool: string; message: string }[];
};

/* ================= Props ================= */

type WebMCPColumn = {
  key: string;
  label: string;
  type?: "text" | "number" | "date";
};

export type YuktaiGridWebMCPProps<T> = {
  /**
   * Ready-made tools (YuktaiGrid passes its own list here). When given,
   * data/columns/callbacks below are not needed.
   */
  tools?: GridTool[];

  /* ── Standalone use (4.6.x style) ── */
  data?: T[];
  columns?: WebMCPColumn[];
  rowKey?: string;
  locale?: GridToolLocale;
  onSelectRow?: (id: string) => void;
  onHighlightRows?: (ids: string[]) => void;
  onOpenRow?: (id: string) => void;

  /** Tool name prefix (default "yuktai_grid") */
  name?: string;
  /** Agent-facing descriptions per tool, e.g. { search: "Search Telugu poems…" } */
  descriptions?: CreateGridToolsOptions["descriptions"];

  /** Called whenever the registration status changes */
  onStatusChange?: (status: WebMCPStatus) => void;
};

/** Signature of a tool list — changes only when names/descriptions/schemas change. */
function signatureOf(tools: GridTool[]): string {
  return JSON.stringify(tools.map((t) => [t.name, t.title, t.description, t.inputSchema]));
}

export function YuktaiGridWebMCP<T extends Record<string, unknown>>({
  tools: toolsProp,
  data = [],
  columns = [],
  rowKey,
  locale,
  onSelectRow,
  onHighlightRows,
  onOpenRow,
  name = "yuktai_grid",
  descriptions,
  onStatusChange,
}: YuktaiGridWebMCPProps<T>) {
  // Standalone mode: build the tools here from the 4.6.x-style props
  const tools = useMemo<GridTool[]>(() => {
    if (toolsProp) return toolsProp;
    const context: GridToolContext<T> = {
      data,
      columns: columns as GridToolColumn[],
      rowKey,
      locale,
      onSelectRow,
      onHighlightRows,
      onOpenRow,
    };
    return createGridTools(context, { name, descriptions });
  }, [toolsProp, data, columns, rowKey, locale, onSelectRow, onHighlightRows, onOpenRow, name, descriptions]);

  // Registered tools always run the LATEST tool (fresh data), via this ref
  const latestTools = useRef(tools);
  latestTools.current = tools;

  const statusCallback = useRef(onStatusChange);
  statusCallback.current = onStatusChange;

  // Previous registration round; a new round waits for it (no overlapping names)
  const previousRound = useRef<Promise<void>>(Promise.resolve());

  const signature = signatureOf(tools);

  useEffect(() => {
    const report = (status: WebMCPStatus) => statusCallback.current?.(status);
    const modelContext = typeof document !== "undefined" ? document.modelContext : undefined;

    if (!modelContext?.registerTool) {
      report({ state: "unsupported", registered: [], errors: [] });
      return;
    }

    const controller = new AbortController();
    const toRegister = latestTools.current;

    const round = previousRound.current.then(async () => {
      if (controller.signal.aborted) return;
      report({ state: "registering", registered: [], errors: [] });

      const registered: string[] = [];
      const errors: WebMCPStatus["errors"] = [];

      for (const tool of toRegister) {
        if (controller.signal.aborted) return;
        try {
          await modelContext.registerTool(
            {
              name: tool.name,
              title: tool.title,
              description: tool.description,
              inputSchema: tool.inputSchema,
              // Look the tool up at call time, so it always sees current data
              execute: (input: Record<string, unknown>) => {
                const current = latestTools.current.find((t) => t.name === tool.name);
                return current
                  ? current.execute(input ?? {})
                  : {
                      success: false,
                      message: `Tool "${tool.name}" is no longer available.`,
                      error: { code: "NOT_SUPPORTED" },
                    };
              },
            },
            { signal: controller.signal }
          );
          registered.push(tool.name);
        } catch (error) {
          errors.push({ tool: tool.name, message: error instanceof Error ? error.message : String(error) });
        }
      }

      if (controller.signal.aborted) return;
      report({
        state: errors.length === 0 ? "ready" : registered.length > 0 ? "partial" : "error",
        registered,
        errors,
      });
    });

    // The next round starts only after this one has run (and been aborted)
    previousRound.current = round.catch(() => undefined);

    // Aborting the signal unregisters this round's tools
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  return null;
}

export default YuktaiGridWebMCP;