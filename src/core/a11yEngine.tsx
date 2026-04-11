import React from "react";

/**
 * Apply accessibility improvements to React elements
 */
export function applyAccessibility(
  element: React.ReactNode
): React.ReactNode {
  // If not a valid React element, return as-is
  if (!React.isValidElement(element)) return element;

  const props: any = { ...element.props };

  // 🔹 Handle INPUT
  if (element.type === "input") {
    if (!props["aria-label"]) {
      props["aria-label"] =
        props.placeholder || "Input field";
    }
  }

  // 🔹 Handle TEXTAREA
  if (element.type === "textarea") {
    if (!props["aria-label"]) {
      props["aria-label"] =
        props.placeholder || "Textarea field";
    }
  }

  // 🔹 Handle BUTTON
  if (element.type === "button") {
    if (!props["aria-label"]) {
      const text =
        typeof props.children === "string"
          ? props.children
          : "Button";
      props["aria-label"] = text;
    }
  }

  // 🔹 Handle IMG
  if (element.type === "img") {
    if (!props.alt) {
      props.alt = "Image";
    }
  }

  // 🔹 Handle clickable DIV (add role + keyboard)
  if (element.type === "div" && props.onClick) {
    props.role = "button";
    props.tabIndex = 0;

    props.onKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        props.onClick(e);
      }
    };
  }

  // 🔹 Recursively apply to children
  const children = React.Children.map(
    props.children,
    (child) => applyAccessibility(child)
  );

  return React.cloneElement(element, props, children);
}