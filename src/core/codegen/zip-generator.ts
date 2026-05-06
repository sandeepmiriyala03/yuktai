// ─────────────────────────────────────────────────────────────────────────────
// src/core/codegen/zip-generator.ts
// yuktai Vibe Coder — ZIP Generator
//
// Builds complete Next.js project as ZIP.
// Uses JSZip — loaded dynamically, no bundle cost.
// ─────────────────────────────────────────────────────────────────────────────

import type { ParsedRequirement } from "./requirement-parser"
import {
  fill,
  THEME_COLORS,
  PACKAGE_JSON,
  NEXT_CONFIG,
  TAILWIND_CONFIG,
  GLOBALS_CSS,
  LAYOUT_TSX,
  NAVBAR_TSX,
  NAVBAR_CSS,
  FOOTER_TSX,
  FOOTER_CSS,
  HOME_TSX,
  HOME_CSS,
  ABOUT_TSX,
  ABOUT_CSS,
  CONTACT_TSX,
  CONTACT_CSS,
  SERVICES_TSX,
  SERVICES_CSS,
  PRICING_TSX,
  PRICING_CSS,
  AUTH_TSX,
  AUTH_CSS,
  NOT_FOUND_TSX,
  TSCONFIG,
  README,
  type TemplateVars,
} from "./page-templates"

// ─────────────────────────────────────────────────────────────────────────────
// generateTagline — creates a tagline from site name + type
// ─────────────────────────────────────────────────────────────────────────────
function generateTagline(siteName: string, type: string): string {
  const taglines: Record<string, string> = {
    hotel:      `Experience luxury and comfort at ${siteName}`,
    ecommerce:  `Shop the best products at ${siteName}`,
    restaurant: `Delicious food crafted with love at ${siteName}`,
    portfolio:  `Creative work and professional services by ${siteName}`,
    blog:       `Insights, stories, and ideas from ${siteName}`,
    saas:       `Powerful tools to grow your business — ${siteName}`,
    government: `Official services and information — ${siteName}`,
    healthcare: `Quality healthcare you can trust — ${siteName}`,
    education:  `Learn, grow, and succeed with ${siteName}`,
    realestate: `Find your perfect property with ${siteName}`,
    landing:    `The smarter way to get things done — ${siteName}`,
    generic:    `Welcome to ${siteName} — your trusted partner`,
  }
  return taglines[type] || `Welcome to ${siteName}`
}

// ─────────────────────────────────────────────────────────────────────────────
// generateZip — main function
// ─────────────────────────────────────────────────────────────────────────────
export async function generateZip(req: ParsedRequirement): Promise<void> {
  // Dynamic import JSZip — only loads when user clicks generate
  const JSZip = (await import("jszip")).default
  const zip   = new JSZip()

  const themeColor = THEME_COLORS[req.theme] || THEME_COLORS.blue
  const tagline    = generateTagline(req.siteName, req.websiteType)
  const year       = new Date().getFullYear().toString()

  const vars: TemplateVars = {
    SITE_NAME:   req.siteName,
    THEME_COLOR: themeColor,
    TAGLINE:     tagline,
    YEAR:        year,
  }

  const f = (template: string) =>
    fill(template, vars)
      .replace(/\{\{SITE_NAME_LOWER\}\}/g, req.siteName.toLowerCase().replace(/\s+/g, ""))

  // ── Root files ──────────────────────────────────────────────────────────
  zip.file("package.json",      PACKAGE_JSON(req.siteName))
  zip.file("next.config.js",    NEXT_CONFIG)
  zip.file("tailwind.config.js", TAILWIND_CONFIG(themeColor))
  zip.file("tsconfig.json",     TSCONFIG)
  zip.file("README.md",         README(req.siteName))
  zip.file("postcss.config.js", `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }`)
  zip.file(".gitignore",        `node_modules\n.next\n.env.local\n.DS_Store`)

  // ── src/app ─────────────────────────────────────────────────────────────
  zip.file("src/app/globals.css",    GLOBALS_CSS(themeColor))
  zip.file("src/app/layout.tsx",     f(LAYOUT_TSX))
  zip.file("src/app/not-found.tsx",  NOT_FOUND_TSX)

  // ── Components ──────────────────────────────────────────────────────────
  zip.file("src/components/Navbar.tsx",        f(NAVBAR_TSX))
  zip.file("src/components/Navbar.module.css", NAVBAR_CSS)
  zip.file("src/components/Footer.tsx",        f(FOOTER_TSX))
  zip.file("src/components/Footer.module.css", FOOTER_CSS)

  // ── Pages — based on detected pages ─────────────────────────────────────
  for (const page of req.pages) {
    switch (page) {

      case "home":
        zip.file("src/app/page.tsx",             f(HOME_TSX))
        zip.file("src/app/page.module.css",      HOME_CSS)
        break

      case "about":
        zip.file("src/app/about/page.tsx",       f(ABOUT_TSX))
        zip.file("src/app/about/page.module.css", ABOUT_CSS)
        break

      case "contact":
        zip.file("src/app/contact/page.tsx",      f(CONTACT_TSX))
        zip.file("src/app/contact/page.module.css", CONTACT_CSS)
        break

      case "services":
        zip.file("src/app/services/page.tsx",      f(SERVICES_TSX))
        zip.file("src/app/services/page.module.css", SERVICES_CSS)
        break

      case "pricing":
        zip.file("src/app/pricing/page.tsx",      f(PRICING_TSX))
        zip.file("src/app/pricing/page.module.css", PRICING_CSS)
        break

      case "auth":
        zip.file("src/app/auth/page.tsx",        f(AUTH_TSX))
        zip.file("src/app/auth/page.module.css", AUTH_CSS)
        break

      // For pages not yet templated — generate a placeholder
      default:
        zip.file(`src/app/${page}/page.tsx`, generatePlaceholderPage(page, req.siteName, themeColor, vars, f))
        break
    }
  }

  // ── Generate and download ────────────────────────────────────────────────
  const blob     = await zip.generateAsync({ type: "blob" })
  const url      = URL.createObjectURL(blob)
  const a        = document.createElement("a")
  a.href         = url
  a.download     = `${req.siteName.toLowerCase().replace(/\s+/g, "-")}-nextjs.zip`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ─────────────────────────────────────────────────────────────────────────────
// generatePlaceholderPage — for pages without a full template yet
// ─────────────────────────────────────────────────────────────────────────────
function generatePlaceholderPage(
  page:      string,
  siteName:  string,
  color:     string,
  vars:      TemplateVars,
  f:         (t: string) => string
): string {
  const title = page.charAt(0).toUpperCase() + page.slice(1)
  return `import styles from "./page.module.css"

export default function ${title}Page() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <section style={{
        background: "${color}",
        color: "white",
        padding: "5rem 1rem",
        textAlign: "center"
      }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem" }}>
          ${title}
        </h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.85 }}>
          ${siteName} — ${title} page
        </p>
      </section>
      <section style={{ padding: "4rem 1rem", maxWidth: "1100px", margin: "0 auto" }}>
        <p style={{ color: "#64748b", fontSize: "1rem", textAlign: "center" }}>
          This is the ${title} page. Edit this file to add your content.
        </p>
      </section>
    </div>
  )
}
`
}