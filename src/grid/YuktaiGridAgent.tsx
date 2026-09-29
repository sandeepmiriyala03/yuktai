"use client";

import { useCallback, useState } from "react";

export type GridAgentTool = {
  name: string;
  description: string;
  execute: (
    input: Record<string, unknown>
  ) => Promise<unknown> | unknown;
};

export type YuktaiGridAgentProps = {
  tools: GridAgentTool[];
  onResult?: (result: unknown) => void;
  onError?: (error: Error) => void;
};

export function useYuktaiGridAgent({
  tools,
  onResult,
  onError,
}: YuktaiGridAgentProps) {
  const [loading, setLoading] = useState(false);

  const executeTool = useCallback(
    async (
      name: string,
      input: Record<string, unknown> = {}
    ) => {
      const tool = tools.find(
        (item) => item.name === name
      );

      if (!tool) {
        const error = new Error(
          `Tool "${name}" not found.`
        );

        onError?.(error);

        throw error;
      }

      setLoading(true);

      try {
        const result =
          await tool.execute(input);

        onResult?.(result);

        return result;
      } catch (error) {
        const normalizedError =
          error instanceof Error
            ? error
            : new Error(String(error));

        onError?.(normalizedError);

        throw normalizedError;
      } finally {
        setLoading(false);
      }
    },
    [tools, onResult, onError]
  );

  return {
    loading,
    tools,
    executeTool,
  };
}

export default useYuktaiGridAgent;