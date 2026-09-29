"use client";

import { useEffect } from "react";

import {
  countGrid,
  getColumns,
  getRow,
  highlightRows,
  openRow,
  searchGrid,
  selectRow,
  type GridColumn,
  type GridToolContext,
} from "./gridTools";

declare global {
  interface Document {
    modelContext?: {
      registerTool: (
        tool: {
          name: string;
          title: string;
          description: string;
          inputSchema: Record<string, unknown>;
          execute: (input: any) => Promise<unknown> | unknown;
        },
        options?: {
          signal?: AbortSignal;
        }
      ) => Promise<void>;
    };
  }
}

type WebMCPColumn = {
  key: string;
  label: string;
  type?: "text" | "number" | "date";
};

export type YuktaiGridWebMCPProps<T> = {
  data: T[];
  columns: WebMCPColumn[];
  name?: string;
  onSelectRow?: (id: string) => void;
  onHighlightRows?: (ids: string[]) => void;
  onOpenRow?: (id: string) => void;
};

export default function YuktaiGridWebMCP<
  T extends Record<string, unknown>
>({
  data,
  columns,
  name = "yuktai_grid",
  onSelectRow,
  onHighlightRows,
  onOpenRow,
}: YuktaiGridWebMCPProps<T>) {
  useEffect(() => {
    const modelContext = document.modelContext;

    if (!modelContext) {
      return;
    }

    const controller = new AbortController();

    const context: GridToolContext<T> = {
      data,
      columns: columns as GridColumn[],
      onSelectRow,
      onHighlightRows,
      onOpenRow,
    };

    const register = async () => {
      await modelContext.registerTool(
        {
          name: `${name}_search`,
          title: "Search Grid",
          description: "Search the grid.",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
              },
            },
            required: ["query"],
          },
          execute: async ({ query }: { query: string }) =>
            searchGrid(context, query),
        },
        {
          signal: controller.signal,
        }
      );

      await modelContext.registerTool(
        {
          name: `${name}_count`,
          title: "Count Grid",
          description: "Count grid rows.",
          inputSchema: {
            type: "object",
            properties: {},
          },
          execute: async () => countGrid(context),
        },
        {
          signal: controller.signal,
        }
      );

      await modelContext.registerTool(
        {
          name: `${name}_columns`,
          title: "Get Grid Columns",
          description: "Get grid columns.",
          inputSchema: {
            type: "object",
            properties: {},
          },
          execute: async () => getColumns(context),
        },
        {
          signal: controller.signal,
        }
      );

      await modelContext.registerTool(
        {
          name: `${name}_get_row`,
          title: "Get Grid Row",
          description: "Get a grid row by ID.",
          inputSchema: {
            type: "object",
            properties: {
              id: {
                type: "string",
              },
            },
            required: ["id"],
          },
          execute: async ({ id }: { id: string }) =>
            getRow(context, id),
        },
        {
          signal: controller.signal,
        }
      );

      await modelContext.registerTool(
        {
          name: `${name}_highlight`,
          title: "Highlight Grid Rows",
          description: "Highlight grid rows.",
          inputSchema: {
            type: "object",
            properties: {
              ids: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            required: ["ids"],
          },
          execute: async ({ ids }: { ids: string[] }) =>
            highlightRows(context, ids),
        },
        {
          signal: controller.signal,
        }
      );

      await modelContext.registerTool(
        {
          name: `${name}_select`,
          title: "Select Grid Row",
          description: "Select a grid row.",
          inputSchema: {
            type: "object",
            properties: {
              id: {
                type: "string",
              },
            },
            required: ["id"],
          },
          execute: async ({ id }: { id: string }) =>
            selectRow(context, id),
        },
        {
          signal: controller.signal,
        }
      );

      await modelContext.registerTool(
        {
          name: `${name}_open`,
          title: "Open Grid Row",
          description: "Open a grid row.",
          inputSchema: {
            type: "object",
            properties: {
              id: {
                type: "string",
              },
            },
            required: ["id"],
          },
          execute: async ({ id }: { id: string }) =>
            openRow(context, id),
        },
        {
          signal: controller.signal,
        }
      );
    };

    register().catch(() => undefined);

    return () => {
      controller.abort();
    };
  }, [
    data,
    columns,
    name,
    onSelectRow,
    onHighlightRows,
    onOpenRow,
  ]);

  return null;
}