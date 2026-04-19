import React, { ReactElement } from "react";
import ReactDOM from "react-dom/client";

/**
 * Layer 1: React Virtual DOM Fixer
 * Recursively injects ARIA attributes into React elements before they hit the DOM.
 */
export function applyAccessibility(element: React.ReactNode): React.ReactNode {
  // 1. Type Guard: If not a valid React element (string, null, etc.), return as-is
  if (!React.isValidElement(element)) {
    return element;
  }

  // 2. Cast to ReactElement to safely access props and avoid spread errors
  const el = element as ReactElement<any>;
  const props = { ...el.props };

  // 🔹 Handle Form Elements
  if (el.type === "input" || el.type === "textarea" || el.type === "select") {
    if (!props["aria-label"] && !props["aria-labelledby"]) {
      props["aria-label"] = props.placeholder || props.name || `${el.type} field`;
    }
  }

  // 🔹 Handle Buttons
  if (el.type === "button") {
    if (!props["aria-label"] && !props.children) {
      props["aria-label"] = "Interactive button";
    }
  }

  // 🔹 Handle Images
  if (el.type === "img") {
    if (!props.alt) {
      props.alt = ""; 
      props["aria-hidden"] = "true";
    }
  }

  // 🔹 Handle Clickable Non-Interactive Elements (The "Vibe" fix)
  if ((el.type === "div" || el.type === "span") && props.onClick) {
    props.role = "button";
    props.tabIndex = 0;
    const originalOnClick = props.onClick;
    props.onKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        originalOnClick(e);
      }
    };
  }

  // 3. Recursive walk through the tree with explicit child type
  const children = React.Children.map(props.children, (child: React.ReactNode) =>
    React.isValidElement(child) ? applyAccessibility(child) : child
  );

  return React.cloneElement(el, props, children);
}

/**
 * Layer 2: Global DOM Renderer
 * Renders React into the DOM with auto-fixes applied.
 */
export function render(element: React.ReactNode, selector: string): void {
  const container = document.querySelector(selector);
  if (!container) {
    throw new Error(`[YuktAI] Target container not found: ${selector}`);
  }

  // Apply React-level fixes
  const accessibleElement = applyAccessibility(element);

  // Initialize React 18 Root
  const root = ReactDOM.createRoot(container as HTMLElement);
  root.render(
    <React.StrictMode>
      {accessibleElement}
    </React.StrictMode>
  );
}