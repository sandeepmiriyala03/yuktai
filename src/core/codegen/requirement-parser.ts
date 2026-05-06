// ─────────────────────────────────────────────────────────────────────────────
// src/core/codegen/requirement-parser.ts
// yuktai Vibe Coder — Requirement Parser
//
// Understands plain English business requirements.
// No API. No LLM. Pure keyword matching + pattern detection.
// Detects: website type, pages needed, features, theme colour, site name.
// ─────────────────────────────────────────────────────────────────────────────

export type WebsiteType =
  | "landing"
  | "ecommerce"
  | "hotel"
  | "restaurant"
  | "portfolio"
  | "blog"
  | "saas"
  | "government"
  | "healthcare"
  | "education"
  | "realestate"
  | "generic"

export type PageType =
  | "home"
  | "about"
  | "contact"
  | "services"
  | "pricing"
  | "blog"
  | "auth"
  | "dashboard"
  | "gallery"
  | "products"
  | "cart"
  | "checkout"
  | "rooms"
  | "booking"
  | "menu"
  | "reservations"
  | "portfolio"
  | "team"
  | "faq"
  | "terms"
  | "privacy"

export type ThemeColour =
  | "blue"
  | "green"
  | "purple"
  | "red"
  | "orange"
  | "teal"
  | "indigo"
  | "gray"

export interface ParsedRequirement {
  siteName:    string
  websiteType: WebsiteType
  pages:       PageType[]
  features:    string[]
  theme:       ThemeColour
  description: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Website type keyword map
// ─────────────────────────────────────────────────────────────────────────────
const TYPE_KEYWORDS: Record<WebsiteType, string[]> = {
  hotel:      ["hotel", "resort", "motel", "inn", "accommodation", "lodge", "stay", "room", "booking", "hospitality"],
  ecommerce:  ["shop", "store", "ecommerce", "e-commerce", "sell", "product", "cart", "buy", "marketplace", "retail"],
  restaurant: ["restaurant", "food", "cafe", "cafeteria", "menu", "dining", "eat", "cuisine", "bistro", "takeaway", "delivery"],
  portfolio:  ["portfolio", "freelance", "personal", "designer", "developer", "creative", "showcase", "work", "hire me"],
  blog:       ["blog", "article", "post", "write", "news", "magazine", "journal", "content"],
  saas:       ["saas", "dashboard", "app", "software", "platform", "tool", "analytics", "admin", "manage", "crm"],
  government: ["government", "govt", "portal", "citizen", "scheme", "welfare", "municipal", "public", "official"],
  healthcare: ["hospital", "clinic", "doctor", "health", "medical", "patient", "appointment", "pharmacy"],
  education:  ["school", "college", "university", "course", "learn", "education", "student", "lms", "training"],
  realestate: ["real estate", "property", "house", "flat", "apartment", "rent", "buy property", "listing"],
  landing:    ["landing", "startup", "launch", "product launch", "coming soon", "waitlist"],
  generic:    [],
}

// ─────────────────────────────────────────────────────────────────────────────
// Default pages per website type
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_PAGES: Record<WebsiteType, PageType[]> = {
  hotel:      ["home", "rooms", "booking", "about", "contact"],
  ecommerce:  ["home", "products", "cart", "checkout", "about", "contact"],
  restaurant: ["home", "menu", "reservations", "about", "contact"],
  portfolio:  ["home", "portfolio", "about", "contact"],
  blog:       ["home", "blog", "about", "contact"],
  saas:       ["home", "pricing", "dashboard", "auth", "about", "contact"],
  government: ["home", "services", "about", "contact", "faq"],
  healthcare: ["home", "services", "booking", "team", "about", "contact"],
  education:  ["home", "services", "pricing", "about", "contact"],
  realestate: ["home", "products", "about", "contact"],
  landing:    ["home", "pricing", "about", "contact"],
  generic:    ["home", "about", "services", "contact"],
}

// ─────────────────────────────────────────────────────────────────────────────
// Page keyword map — detects extra pages from requirement text
// ─────────────────────────────────────────────────────────────────────────────
const PAGE_KEYWORDS: Record<PageType, string[]> = {
  home:         ["home", "homepage", "main", "landing"],
  about:        ["about", "who we are", "our story", "company"],
  contact:      ["contact", "reach us", "get in touch", "location"],
  services:     ["service", "what we offer", "solution", "offering"],
  pricing:      ["pricing", "price", "plan", "subscription", "cost", "fee"],
  blog:         ["blog", "article", "news", "post"],
  auth:         ["login", "register", "signup", "sign up", "sign in", "auth", "account"],
  dashboard:    ["dashboard", "admin", "panel", "manage", "analytics"],
  gallery:      ["gallery", "photo", "image", "portfolio"],
  products:     ["product", "shop", "store", "item", "catalogue"],
  cart:         ["cart", "basket", "shopping cart"],
  checkout:     ["checkout", "payment", "pay", "order"],
  rooms:        ["room", "suite", "accommodation", "stay"],
  booking:      ["booking", "reserve", "reservation", "schedule", "appointment"],
  menu:         ["menu", "food", "dish", "cuisine"],
  reservations: ["reservation", "table booking", "book table"],
  portfolio:    ["portfolio", "work", "project", "case study"],
  team:         ["team", "staff", "member", "people", "who we are"],
  faq:          ["faq", "question", "answer", "help", "support"],
  terms:        ["terms", "condition", "legal"],
  privacy:      ["privacy", "policy", "gdpr", "data"],
}

// ─────────────────────────────────────────────────────────────────────────────
// Feature keyword map
// ─────────────────────────────────────────────────────────────────────────────
const FEATURE_KEYWORDS: Record<string, string[]> = {
  "Authentication":      ["login", "register", "auth", "signup", "sign in", "account"],
  "Payment":             ["payment", "stripe", "pay", "checkout", "billing"],
  "Search":              ["search", "filter", "find"],
  "Dark mode":           ["dark mode", "dark theme", "night mode"],
  "Multi-language":      ["multilingual", "multi language", "translation", "i18n"],
  "SEO":                 ["seo", "search engine", "meta", "google"],
  "Analytics":           ["analytics", "tracking", "stats", "dashboard"],
  "Email":               ["email", "newsletter", "contact form", "notification"],
  "Map":                 ["map", "location", "address", "google maps"],
  "Social media":        ["social", "instagram", "facebook", "twitter", "share"],
  "Image gallery":       ["gallery", "photo", "image", "carousel"],
  "Booking system":      ["booking", "reservation", "appointment", "schedule"],
  "Shopping cart":       ["cart", "basket", "shop", "ecommerce"],
  "Blog/CMS":            ["blog", "cms", "content", "article", "post"],
}

// ─────────────────────────────────────────────────────────────────────────────
// Theme colour detection
// ─────────────────────────────────────────────────────────────────────────────
const COLOUR_KEYWORDS: Record<ThemeColour, string[]> = {
  blue:   ["blue", "navy", "sky", "ocean", "corporate"],
  green:  ["green", "nature", "eco", "environment", "health", "fresh"],
  purple: ["purple", "violet", "luxury", "creative", "royal"],
  red:    ["red", "bold", "energy", "passion", "food"],
  orange: ["orange", "warm", "friendly", "fun"],
  teal:   ["teal", "turquoise", "modern", "tech"],
  indigo: ["indigo", "professional", "trust", "finance", "bank"],
  gray:   ["gray", "minimal", "clean", "simple", "neutral"],
}

// ─────────────────────────────────────────────────────────────────────────────
// Default themes per type
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_THEME: Record<WebsiteType, ThemeColour> = {
  hotel:      "indigo",
  ecommerce:  "blue",
  restaurant: "red",
  portfolio:  "purple",
  blog:       "gray",
  saas:       "teal",
  government: "blue",
  healthcare: "green",
  education:  "indigo",
  realestate: "orange",
  landing:    "purple",
  generic:    "blue",
}

// ─────────────────────────────────────────────────────────────────────────────
// extractSiteName — gets business name from requirement
// ─────────────────────────────────────────────────────────────────────────────
function extractSiteName(text: string): string {
  // Pattern: "for X", "called X", "named X", "company X", "business X"
  const patterns = [
    /(?:for|called|named|company|business|brand)\s+["']?([A-Z][a-zA-Z\s]{1,30})["']?/i,
    /["']([A-Z][a-zA-Z\s]{1,30})["']/,
    /^([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)?)/m,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match?.[1]) {
      const name = match[1].trim()
      if (name.length > 2 && name.length < 40) return name
    }
  }

  return "My Business"
}

// ─────────────────────────────────────────────────────────────────────────────
// detectWebsiteType
// ─────────────────────────────────────────────────────────────────────────────
function detectWebsiteType(text: string): WebsiteType {
  const lower = text.toLowerCase()
  let bestType: WebsiteType = "generic"
  let bestScore = 0

  for (const [type, keywords] of Object.entries(TYPE_KEYWORDS)) {
    let score = 0
    for (const kw of keywords) {
      if (lower.includes(kw)) score++
    }
    if (score > bestScore) {
      bestScore = score
      bestType  = type as WebsiteType
    }
  }

  return bestType
}

// ─────────────────────────────────────────────────────────────────────────────
// detectPages — gets pages from requirement + defaults for type
// ─────────────────────────────────────────────────────────────────────────────
function detectPages(text: string, type: WebsiteType): PageType[] {
  const lower   = text.toLowerCase()
  const pages   = new Set<PageType>(DEFAULT_PAGES[type])

  for (const [page, keywords] of Object.entries(PAGE_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        pages.add(page as PageType)
        break
      }
    }
  }

  // Always include home and contact
  pages.add("home")
  pages.add("contact")

  return Array.from(pages)
}

// ─────────────────────────────────────────────────────────────────────────────
// detectFeatures
// ─────────────────────────────────────────────────────────────────────────────
function detectFeatures(text: string): string[] {
  const lower    = text.toLowerCase()
  const features: string[] = []

  for (const [feature, keywords] of Object.entries(FEATURE_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        features.push(feature)
        break
      }
    }
  }

  return features
}

// ─────────────────────────────────────────────────────────────────────────────
// detectTheme
// ─────────────────────────────────────────────────────────────────────────────
function detectTheme(text: string, type: WebsiteType): ThemeColour {
  const lower = text.toLowerCase()

  for (const [colour, keywords] of Object.entries(COLOUR_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return colour as ThemeColour
    }
  }

  return DEFAULT_THEME[type]
}

// ─────────────────────────────────────────────────────────────────────────────
// parseRequirement — main exported function
// ─────────────────────────────────────────────────────────────────────────────
export function parseRequirement(text: string): ParsedRequirement {
  const websiteType = detectWebsiteType(text)
  const pages       = detectPages(text, websiteType)
  const features    = detectFeatures(text)
  const theme       = detectTheme(text, websiteType)
  const siteName    = extractSiteName(text)

  return {
    siteName,
    websiteType,
    pages,
    features,
    theme,
    description: text.slice(0, 200),
  }
}