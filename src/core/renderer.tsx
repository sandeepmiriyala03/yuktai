import React from "react";
import ReactDOM from "react-dom/client";

/**
 * Render React element into DOM
 */
export function render(
  element: React.ReactNode,
  selector: string
): void {
  const container = document.querySelector(selector);

  if (!container) {
    throw new Error(`Element not found: ${selector}`);
  }

  // Create root (React 18+)
  const root = ReactDOM.createRoot(container as HTMLElement);

  root.render(<React.StrictMode>{element}</React.StrictMode>);
}