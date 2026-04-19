"use client";
import React, { ReactElement } from "react";
import ReactDOM from "react-dom/client";

/**
 * Metadata for the YuktAI reporting engine
 */
export interface A11yReport {
  fixes: number;      // Total accessibility remediations
  nodes: number;      // Total DOM nodes scanned
  renderTime: number; // Processing time in milliseconds
}

/**
 * Universal DOM Accessibility Fixer
 * Deep-walks the React tree to inject ADA compliance attributes.
 */
export function applyAccessibility(
  element: React.ReactNode, 
  enabled: boolean = true,
  report: A11yReport = { fixes: 0, nodes: 0, renderTime: 0 }
): React.ReactNode {
  
  // 1. START PERFORMANCE TIMER (Root Level Only)
  const startTime = report.nodes === 0 ? performance.now() : 0;

  if (!React.isValidElement(element)) {
    return element;
  }

  // Increment total nodes scanned
  report.nodes++;

  const el = element as ReactElement<any>;
  const props = { ...el.props };
  const type = el.type as any;
  let isModified = false;

  // Process rules only if ADA Engine is enabled
  if (enabled) {
    // A. Forms & Inputs
    if (["input", "textarea", "select"].includes(type)) {
      if (!props["aria-label"] && !props["aria-labelledby"]) {
        props["aria-label"] = props.placeholder || props.name || `${type} field`;
        isModified = true;
      }
    }

    // B. Media & Images
    if (type === "img" && (props.alt === undefined || props.alt === null)) {
      props.alt = ""; 
      props["aria-hidden"] = "true";
      isModified = true;
    }
    if (["video", "audio", "iframe"].includes(type) && !props.title) {
      props.title = props.name || `${type} content`;
      isModified = true;
    }

    // C. Interactive Elements (Buttons/Links)
    if (type === "a") {
      if (props.target === "_blank" && !props.rel) {
        props.rel = "noopener noreferrer";
        isModified = true;
      }
    }

    // D. Vibe-Fix: Clickable Non-Interactive Elements
    if ((type === "div" || type === "span") && props.onClick) {
      if (!props.role) { props.role = "button"; isModified = true; }
      if (props.tabIndex === undefined) { props.tabIndex = 0; isModified = true; }
      
      if (!props.onKeyDown) {
        const originalOnClick = props.onClick;
        props.onKeyDown = (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            originalOnClick(e);
          }
        };
        isModified = true;
      }
    }

    // E. Structural Landmarks
    const landmarks: Record<string, string> = { nav: "navigation", header: "banner", footer: "contentinfo", main: "main" };
    if (landmarks[type] && !props.role) {
      props.role = landmarks[type];
      isModified = true;
    }

    // F. Data Structures
    if (["ul", "ol"].includes(type) && !props.role) { props.role = "list"; isModified = true; }
    if (type === "li" && !props.role) { props.role = "listitem"; isModified = true; }

    // If any change was made to this node, update the report
    if (isModified) report.fixes++;
  }

  // 2. RECURSIVE WALK (Process children while maintaining report state)
  const children = React.Children.map(props.children, (child: React.ReactNode) =>
    React.isValidElement(child) ? applyAccessibility(child, enabled, report) : child
  );

  const finalElement = React.cloneElement(el, props, children);

  // 3. FINALIZE PERFORMANCE TIMER (Root Level Only)
  if (startTime > 0) {
    report.renderTime = parseFloat((performance.now() - startTime).toFixed(2));
  }

  return finalElement;
}

/**
 * Standard DOM Mount Renderer
 */
export function render(
  element: React.ReactNode, 
  selector: string, 
  enabled: boolean = true
): void {
  const container = document.querySelector(selector);
  if (!container) return;

  const report: A11yReport = { fixes: 0, nodes: 0, renderTime: 0 };
  const accessibleElement = applyAccessibility(element, enabled, report);
  const root = ReactDOM.createRoot(container as HTMLElement);
  
  root.render(
    <React.StrictMode>
      {accessibleElement}
    </React.StrictMode>
  );
}