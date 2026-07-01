// ─────────────────────────────────────────────────────────────────────────────
// @yuktishaalaa/yuktai · src/icons/IconBase.tsx
//
// Shared wrapper for all yuktai icons.
// Style: bold line (2.5px stroke), rounded caps, 24x24 viewBox.
// Color: inherits from parent via currentColor.
// Accessibility: aria-hidden by default (decorative).
// ─────────────────────────────────────────────────────────────────────────────

import React from "react"

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Size in pixels — applied to both width and height. Default: 20 */
  size?:    number | string

  /** Stroke color — defaults to currentColor (inherits from parent) */
  color?:   string

  /** Stroke width override — default: 2.5 */
  strokeWidth?: number

  /** Accessible label — if provided, icon becomes non-decorative */
  label?:   string
}

/**
 * Shared base for all yuktai icons.
 * Children should be SVG path/circle/rect elements.
 */
export function IconBase({
  size        = 20,
  color       = "currentColor",
  strokeWidth = 2.5,
  label,
  children,
  ...rest
}: IconProps & { children: React.ReactNode }) {
  const isDecorative = !label

  return (
    <svg
      xmlns          = "http://www.w3.org/2000/svg"
      width          = {size}
      height         = {size}
      viewBox        = "0 0 24 24"
      fill           = "none"
      stroke         = {color}
      strokeWidth    = {strokeWidth}
      strokeLinecap  = "round"
      strokeLinejoin = "round"
      aria-hidden    = {isDecorative ? "true" : undefined}
      aria-label     = {label}
      role           = {label ? "img" : undefined}
      focusable      = "false"
      {...rest}
    >
      {children}
    </svg>
  )
}
