"use client";
import React, { ReactElement } from "react";
import ReactDOM from "react-dom/client";

/**
 * Universal DOM Accessibility Fixer
 * Covers Forms, Media, Structure, Navigation, Tables, and Interactive elements.
 */
export function applyAccessibility(
  element: React.ReactNode, 
  enabled: boolean = true
): React.ReactNode {
  
  if (!enabled || !React.isValidElement(element)) {
    return element;
  }

  const el = element as ReactElement<any>;
  const props = { ...el.props };
  const type = el.type as any;

  // 1. FORMS & INPUTS
  if (["input", "textarea", "select"].includes(type)) {
    if (!props["aria-label"] && !props["aria-labelledby"]) {
      // Logic: Use placeholder or name if label is missing
      props["aria-label"] = props.placeholder || props.name || `${type} input`;
    }
  }

  // 2. INTERACTIVE (Buttons & Links)
  if (type === "button") {
    if (!props["aria-label"] && !props.children) {
      props["aria-label"] = "action button";
    }
  }

  if (type === "a") {
    if (props.href && !props["aria-label"] && !props.children) {
      props["aria-label"] = `Link to ${props.href}`;
    }
    // Security fix for external links
    if (props.target === "_blank" && !props.rel) {
      props.rel = "noopener noreferrer";
    }
  }

  // 3. MEDIA (Images, Video, Audio, Iframe)
  if (type === "img") {
    if (props.alt === undefined || props.alt === null) {
      props.alt = ""; 
      props["aria-hidden"] = "true";
    }
  }

  if (["video", "audio", "iframe"].includes(type)) {
    if (!props.title) {
      props.title = props.name || `${type} content`;
    }
  }

  // 4. LANDMARKS & STRUCTURE
  const landmarks: Record<string, string> = {
    nav: "navigation",
    header: "banner",
    footer: "contentinfo",
    main: "main",
    aside: "complementary",
    section: "region"
  };

  if (landmarks[type]) {
    if (!props.role) props.role = landmarks[type];
    if (type === "section" && !props["aria-label"] && props.title) {
      props["aria-label"] = props.title;
    }
  }

  // 5. DATA STRUCTURES (Tables & Lists)
  if (type === "table") {
    if (!props.role) props.role = "table";
    if (!props["aria-label"]) props["aria-label"] = "Data representation";
  }

  if (["ul", "ol"].includes(type) && !props.role) {
    props.role = "list";
  }

  if (type === "li" && !props.role) {
    props.role = "listitem";
  }

  // 6. CLICKABLE NON-INTERACTIVE (The "Vibe" Fix)
  // Ensures divs/spans used as buttons are focusable and keyboard-friendly
  if ((type === "div" || type === "span" || type === "section") && props.onClick) {
    if (!props.role) props.role = "button";
    if (props.tabIndex === undefined) props.tabIndex = 0;
    
    if (!props.onKeyDown) {
      const originalOnClick = props.onClick;
      props.onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          originalOnClick(e);
        }
      };
    }
  }

  // 7. TYPOGRAPHY & HEADINGS
  if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(type)) {
    if (!props.id && typeof props.children === "string") {
      props.id = props.children.toLowerCase().trim().replace(/\s+/g, "-");
    }
  }

  // 8. DIALOGS & MODALS
  if (type === "dialog") {
    if (!props["aria-modal"]) props["aria-modal"] = "true";
  }

  // 9. RECURSIVE DEEP-WALK
  const children = React.Children.map(props.children, (child: React.ReactNode) =>
    React.isValidElement(child) ? applyAccessibility(child, enabled) : child
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