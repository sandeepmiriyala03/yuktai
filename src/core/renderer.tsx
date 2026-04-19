"use client";
import React, { ReactElement } from "react";
import ReactDOM from "react-dom/client";

/**
 * Universal DOM Accessibility Fixer
 * @param onFix Callback to increment the global fix counter in the Wrapper
 */
export function applyAccessibility(
  element: React.ReactNode, 
  enabled: boolean = true,
  onFix?: () => void
): React.ReactNode {
  
  if (!enabled || !React.isValidElement(element)) {
    return element;
  }

  const el = element as ReactElement<any>;
  const props = { ...el.props };
  const type = el.type as any;
  let hasBeenFixed = false;

  // 1. FORMS & INPUTS
  if (["input", "textarea", "select"].includes(type)) {
    if (!props["aria-label"] && !props["aria-labelledby"]) {
      props["aria-label"] = props.placeholder || props.name || `${type} input`;
      hasBeenFixed = true;
    }
  }

  // 2. INTERACTIVE (Buttons & Links)
  if (type === "button") {
    if (!props["aria-label"] && !props.children) {
      props["aria-label"] = "action button";
      hasBeenFixed = true;
    }
  }

  if (type === "a") {
    if (props.href && !props["aria-label"] && !props.children) {
      props["aria-label"] = `Link to ${props.href}`;
      hasBeenFixed = true;
    }
    if (props.target === "_blank" && !props.rel) {
      props.rel = "noopener noreferrer";
      hasBeenFixed = true;
    }
  }

  // 3. MEDIA
  if (type === "img") {
    if (props.alt === undefined || props.alt === null) {
      props.alt = ""; 
      props["aria-hidden"] = "true";
      hasBeenFixed = true;
    }
  }

  if (["video", "audio", "iframe"].includes(type)) {
    if (!props.title) {
      props.title = props.name || `${type} content`;
      hasBeenFixed = true;
    }
  }

  // 4. LANDMARKS
  const landmarks: Record<string, string> = {
    nav: "navigation",
    header: "banner",
    footer: "contentinfo",
    main: "main",
    aside: "complementary",
    section: "region"
  };

  if (landmarks[type]) {
    if (!props.role) {
      props.role = landmarks[type];
      hasBeenFixed = true;
    }
  }

  // 5. DATA STRUCTURES
  if (type === "table") {
    if (!props.role) {
      props.role = "table";
      hasBeenFixed = true;
    }
  }

  if (["ul", "ol"].includes(type) && !props.role) {
    props.role = "list";
    hasBeenFixed = true;
  }

  // 6. CLICKABLE NON-INTERACTIVE (The "Vibe" Fix)
  if ((type === "div" || type === "span") && props.onClick) {
    if (!props.role) {
      props.role = "button";
      hasBeenFixed = true;
    }
    if (props.tabIndex === undefined) {
      props.tabIndex = 0;
      hasBeenFixed = true;
    }
    
    if (!props.onKeyDown) {
      const originalOnClick = props.onClick;
      props.onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          originalOnClick(e);
        }
      };
      hasBeenFixed = true;
    }
  }

  // 7. TYPOGRAPHY
  if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(type)) {
    if (!props.id && typeof props.children === "string") {
      props.id = props.children.toLowerCase().trim().replace(/\s+/g, "-");
      hasBeenFixed = true;
    }
  }

  // If this specific element was touched, notify the counter
  if (hasBeenFixed && onFix) {
    onFix();
  }

  // RECURSIVE DEEP-WALK
  const children = React.Children.map(props.children, (child: React.ReactNode) =>
    React.isValidElement(child) ? applyAccessibility(child, enabled, onFix) : child
  );

  return React.cloneElement(el, props, children);
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

  const accessibleElement = applyAccessibility(element, enabled);
  const root = ReactDOM.createRoot(container as HTMLElement);
  
  root.render(
    <React.StrictMode>
      {accessibleElement}
    </React.StrictMode>
  );
}