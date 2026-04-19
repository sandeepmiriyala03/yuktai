"use client";
import React, { ReactElement } from "react";
import ReactDOM from "react-dom/client";

export interface A11yReport {
  fixes: number;
  nodes: number;
  renderTime: number;
}

/**
 * Universal DOM Accessibility Fixer
 */
export function applyAccessibility(
  element: React.ReactNode, 
  enabled: boolean = true,
  // CRITICAL: We pass the reference through; only default it at the very top level
  report: A11yReport = { fixes: 0, nodes: 0, renderTime: 0 }
): React.ReactNode {
  
  const isRoot = report.nodes === 0;
  const startTime = isRoot ? performance.now() : 0;

  if (!React.isValidElement(element)) {
    return element;
  }

  // Increment total nodes scanned
  report.nodes++;

  const el = element as ReactElement<any>;
  const props = { ...el.props };
  const type = el.type as any;
  let isModified = false;

  if (enabled) {
    // Logic for Forms, Media, and Interactive Elements
    if (["input", "textarea", "select"].includes(type) && !props["aria-label"]) {
      props["aria-label"] = props.placeholder || props.name || `${type} field`;
      isModified = true;
    }

    if (type === "img" && (props.alt === undefined || props.alt === null)) {
      props.alt = ""; 
      props["aria-hidden"] = "true";
      isModified = true;
    }

    if ((type === "div" || type === "span") && props.onClick) {
      if (!props.role) { props.role = "button"; isModified = true; }
      if (props.tabIndex === undefined) { props.tabIndex = 0; isModified = true; }
    }

    // landmarks and list structures logic here...
    
    if (isModified) report.fixes++;
  }

  // RECURSIVE WALK: Pass the existing 'report' object down
  const children = React.Children.map(props.children, (child: React.ReactNode) =>
    React.isValidElement(child) ? applyAccessibility(child, enabled, report) : child
  );

  const finalElement = React.cloneElement(el, props, children);

  // Finalize performance timer only at the root level
  if (isRoot) {
    report.renderTime = parseFloat((performance.now() - startTime).toFixed(2));
  }

  return finalElement;
}

export function render(element: React.ReactNode, selector: string, enabled: boolean = true): void {
  const container = document.querySelector(selector);
  if (!container) return;

  const report: A11yReport = { fixes: 0, nodes: 0, renderTime: 0 };
  const accessibleElement = applyAccessibility(element, enabled, report);
  const root = ReactDOM.createRoot(container as HTMLElement);
  
  root.render(<React.StrictMode>{accessibleElement}</React.StrictMode>);
}