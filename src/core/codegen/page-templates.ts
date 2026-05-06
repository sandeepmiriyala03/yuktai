// ─────────────────────────────────────────────────────────────────────────────
// src/core/codegen/page-templates.ts
// yuktai Vibe Coder — Next.js Page Templates
//
// All page templates as template strings.
// Variables replaced: {{SITE_NAME}}, {{THEME_COLOR}}, {{TAGLINE}}
// ─────────────────────────────────────────────────────────────────────────────

export interface TemplateVars {
  SITE_NAME:   string
  THEME_COLOR: string
  TAGLINE:     string
  YEAR:        string
}

// ─────────────────────────────────────────────────────────────────────────────
// fill — replaces template variables
// ─────────────────────────────────────────────────────────────────────────────
export function fill(template: string, vars: TemplateVars): string {
  return template
    .replace(/\{\{SITE_NAME\}\}/g,   vars.SITE_NAME)
    .replace(/\{\{THEME_COLOR\}\}/g, vars.THEME_COLOR)
    .replace(/\{\{TAGLINE\}\}/g,     vars.TAGLINE)
    .replace(/\{\{YEAR\}\}/g,        vars.YEAR)
}

// ─────────────────────────────────────────────────────────────────────────────
// THEME COLORS
// ─────────────────────────────────────────────────────────────────────────────
export const THEME_COLORS: Record<string, string> = {
  blue:   "#1a73e8",
  green:  "#0d9488",
  purple: "#7c3aed",
  red:    "#dc2626",
  orange: "#ea580c",
  teal:   "#0891b2",
  indigo: "#4f46e5",
  gray:   "#374151",
}

// ─────────────────────────────────────────────────────────────────────────────
// PACKAGE.JSON
// ─────────────────────────────────────────────────────────────────────────────
export const PACKAGE_JSON = (siteName: string) => `{
  "name": "${siteName.toLowerCase().replace(/\s+/g, "-")}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.0.0"
  }
}
`

// ─────────────────────────────────────────────────────────────────────────────
// NEXT.CONFIG.JS
// ─────────────────────────────────────────────────────────────────────────────
export const NEXT_CONFIG = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
}

module.exports = nextConfig
`

// ─────────────────────────────────────────────────────────────────────────────
// TAILWIND.CONFIG.JS
// ─────────────────────────────────────────────────────────────────────────────
export const TAILWIND_CONFIG = (themeColor: string) => `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "${themeColor}",
      },
    },
  },
  plugins: [],
}
`

// ─────────────────────────────────────────────────────────────────────────────
// GLOBALS.CSS
// ─────────────────────────────────────────────────────────────────────────────
export const GLOBALS_CSS = (themeColor: string) => `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: ${themeColor};
  --primary-dark: ${themeColor}dd;
  --foreground: #0f172a;
  --background: #ffffff;
  --muted: #64748b;
  --border: #e2e8f0;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  color: var(--foreground);
  background: var(--background);
}

a {
  color: inherit;
  text-decoration: none;
}
`

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT — app/layout.tsx
// ─────────────────────────────────────────────────────────────────────────────
export const LAYOUT_TSX = `import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "{{SITE_NAME}}",
  description: "{{TAGLINE}}",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
`

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export const NAVBAR_TSX = `"use client"
import Link from "next/link"
import { useState } from "react"
import styles from "./Navbar.module.css"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          {{SITE_NAME}}
        </Link>
        <button
          className={styles.toggle}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <ul className={\`\${styles.links} \${open ? styles.open : ""}\`}>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/services">Services</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
      </div>
    </nav>
  )
}
`

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR CSS MODULE
// ─────────────────────────────────────────────────────────────────────────────
export const NAVBAR_CSS = `.navbar {
  background: var(--primary);
  color: white;
  padding: 0 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
}

.links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.links a {
  color: rgba(255,255,255,0.9);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.links a:hover {
  color: white;
}

.toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  .toggle { display: block; }
  .links {
    display: none;
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    background: var(--primary);
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
  .links.open { display: flex; }
}
`

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export const FOOTER_TSX = `import styles from "./Footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.brand}>{{SITE_NAME}}</p>
        <p className={styles.tagline}>{{TAGLINE}}</p>
        <p className={styles.copy}>© {{YEAR}} {{SITE_NAME}}. All rights reserved.</p>
      </div>
    </footer>
  )
}
`

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER CSS MODULE
// ─────────────────────────────────────────────────────────────────────────────
export const FOOTER_CSS = `.footer {
  background: #0f172a;
  color: #94a3b8;
  padding: 3rem 1rem;
  margin-top: auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.brand {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
}

.tagline {
  font-size: 0.9rem;
  color: #64748b;
}

.copy {
  font-size: 0.8rem;
  color: #475569;
  margin-top: 1rem;
}
`

// ─────────────────────────────────────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────────────────────────────────────
export const HOME_TSX = `import styles from "./page.module.css"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className={styles.page}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Welcome to {{SITE_NAME}}</h1>
          <p className={styles.heroSubtitle}>{{TAGLINE}}</p>
          <div className={styles.heroActions}>
            <Link href="/contact" className={styles.btnPrimary}>Get Started</Link>
            <Link href="/about" className={styles.btnSecondary}>Learn More</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Why Choose Us</h2>
          <div className={styles.grid}>
            {[
              { icon: "⚡", title: "Fast", desc: "Lightning fast performance on all devices" },
              { icon: "🔒", title: "Secure", desc: "Enterprise-grade security built in" },
              { icon: "📱", title: "Responsive", desc: "Works perfectly on mobile and desktop" },
            ].map(f => (
              <div key={f.title} className={styles.card}>
                <span className={styles.icon}>{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <h2>Ready to get started?</h2>
          <p>Join thousands of happy customers today.</p>
          <Link href="/contact" className={styles.btnPrimary}>Contact Us</Link>
        </div>
      </section>

    </div>
  )
}
`

// ─────────────────────────────────────────────────────────────────────────────
// HOME PAGE CSS
// ─────────────────────────────────────────────────────────────────────────────
export const HOME_CSS = `.page { min-height: 100vh; }

.hero {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  padding: 6rem 1rem;
  text-align: center;
}

.heroContent { max-width: 700px; margin: 0 auto; }

.heroTitle {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.heroSubtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.heroActions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

.btnPrimary {
  background: white;
  color: var(--primary);
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  transition: transform 0.2s;
  display: inline-block;
}

.btnPrimary:hover { transform: translateY(-2px); }

.btnSecondary {
  background: rgba(255,255,255,0.15);
  color: white;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  border: 1px solid rgba(255,255,255,0.3);
  transition: background 0.2s;
  display: inline-block;
}

.btnSecondary:hover { background: rgba(255,255,255,0.25); }

.features { padding: 5rem 1rem; background: #f8fafc; }

.container { max-width: 1200px; margin: 0 auto; }

.sectionTitle {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: #0f172a;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  text-align: center;
}

.icon { font-size: 2.5rem; display: block; margin-bottom: 1rem; }
.card h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; }
.card p { color: #64748b; font-size: 0.9rem; line-height: 1.6; }

.cta {
  background: var(--primary);
  color: white;
  padding: 5rem 1rem;
  text-align: center;
}

.cta h2 { font-size: 2rem; font-weight: 800; margin-bottom: 0.75rem; }
.cta p { font-size: 1.1rem; opacity: 0.85; margin-bottom: 2rem; }
`

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT PAGE
// ─────────────────────────────────────────────────────────────────────────────
export const ABOUT_TSX = `import styles from "./page.module.css"

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>About {{SITE_NAME}}</h1>
        <p>{{TAGLINE}}</p>
      </section>
      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div>
              <h2>Our Story</h2>
              <p>We started with a simple mission — to provide the best experience for our customers. Built on trust, quality, and dedication, {{SITE_NAME}} has grown to serve thousands of happy customers.</p>
              <p>Our team of experts is committed to delivering excellence in everything we do. We believe in building long-term relationships with our clients.</p>
            </div>
            <div>
              <h2>Our Values</h2>
              <ul className={styles.list}>
                <li>✅ Customer first approach</li>
                <li>✅ Quality in everything</li>
                <li>✅ Transparent communication</li>
                <li>✅ Continuous improvement</li>
                <li>✅ Community focus</li>
              </ul>
            </div>
          </div>
          <div className={styles.stats}>
            {[
              { number: "1000+", label: "Happy Customers" },
              { number: "5+", label: "Years Experience" },
              { number: "50+", label: "Team Members" },
              { number: "99%", label: "Satisfaction Rate" },
            ].map(s => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.number}>{s.number}</span>
                <span className={styles.label}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
`

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT CSS
// ─────────────────────────────────────────────────────────────────────────────
export const ABOUT_CSS = `.page { min-height: 100vh; }

.hero {
  background: var(--primary);
  color: white;
  padding: 5rem 1rem;
  text-align: center;
}

.hero h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; }
.hero p  { font-size: 1.1rem; opacity: 0.85; }

.content { padding: 4rem 1rem; }

.container { max-width: 1100px; margin: 0 auto; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  margin-bottom: 4rem;
}

.grid h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: var(--primary); }
.grid p  { color: #475569; line-height: 1.7; margin-bottom: 1rem; }

.list { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; }
.list li { color: #475569; font-size: 0.95rem; }

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  background: #f8fafc;
  padding: 2.5rem;
  border-radius: 16px;
}

.stat { text-align: center; }

.number {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary);
}

.label { font-size: 0.85rem; color: #64748b; }
`

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT PAGE
// ─────────────────────────────────────────────────────────────────────────────
export const CONTACT_TSX = `"use client"
import { useState } from "react"
import styles from "./page.module.css"

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", message: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>Contact Us</h1>
        <p>We would love to hear from you. Get in touch with our team.</p>
      </section>
      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.info}>
              <h2>Get in Touch</h2>
              <div className={styles.detail}>
                <span>📍</span>
                <div>
                  <strong>Address</strong>
                  <p>123 Business Street, City, State 400001</p>
                </div>
              </div>
              <div className={styles.detail}>
                <span>📞</span>
                <div>
                  <strong>Phone</strong>
                  <p>+91 98765 43210</p>
                </div>
              </div>
              <div className={styles.detail}>
                <span>✉️</span>
                <div>
                  <strong>Email</strong>
                  <p>hello@{{SITE_NAME_LOWER}}.com</p>
                </div>
              </div>
            </div>
            <div className={styles.formWrap}>
              {sent ? (
                <div className={styles.success}>
                  ✅ Message sent! We will get back to you soon.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.field}>
                    <label htmlFor="name">Full Name</label>
                    <input
                      id="name" type="text" required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email" type="email" required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message" required rows={5}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button type="submit" className={styles.btn}>Send Message</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
`

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT CSS
// ─────────────────────────────────────────────────────────────────────────────
export const CONTACT_CSS = `.page { min-height: 100vh; }

.hero {
  background: var(--primary);
  color: white;
  padding: 5rem 1rem;
  text-align: center;
}

.hero h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; }
.hero p  { font-size: 1.1rem; opacity: 0.85; }

.content { padding: 4rem 1rem; }
.container { max-width: 1100px; margin: 0 auto; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
}

.info h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem; color: var(--primary); }

.detail {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: flex-start;
}

.detail span { font-size: 1.5rem; }
.detail strong { display: block; font-weight: 600; margin-bottom: 0.25rem; }
.detail p { color: #64748b; font-size: 0.9rem; }

.form { display: flex; flex-direction: column; gap: 1.25rem; }

.field { display: flex; flex-direction: column; gap: 0.4rem; }

.field label { font-size: 0.875rem; font-weight: 600; color: #374151; }

.field input,
.field textarea {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #0f172a;
  font-family: inherit;
  transition: border-color 0.2s;
  outline: none;
}

.field input:focus,
.field textarea:focus { border-color: var(--primary); }

.btn {
  background: var(--primary);
  color: white;
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn:hover { opacity: 0.9; }

.success {
  padding: 2rem;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 12px;
  color: #166534;
  font-size: 1.1rem;
  text-align: center;
}
`

// ─────────────────────────────────────────────────────────────────────────────
// SERVICES PAGE
// ─────────────────────────────────────────────────────────────────────────────
export const SERVICES_TSX = `import styles from "./page.module.css"

const SERVICES = [
  { icon: "🚀", title: "Service One", desc: "Comprehensive solution designed to meet your business needs efficiently and effectively." },
  { icon: "💡", title: "Service Two", desc: "Innovative approaches that help your business grow and stay ahead of the competition." },
  { icon: "🔧", title: "Service Three", desc: "Expert support and maintenance to ensure smooth operations at all times." },
  { icon: "📊", title: "Service Four", desc: "Data-driven insights and analytics to help you make better business decisions." },
  { icon: "🤝", title: "Service Five", desc: "Partnership programs designed to create mutual value and long-term success." },
  { icon: "🌐", title: "Service Six", desc: "Global reach with local expertise to serve customers worldwide." },
]

export default function ServicesPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>Our Services</h1>
        <p>Everything you need to succeed — all in one place</p>
      </section>
      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {SERVICES.map(s => (
              <div key={s.title} className={styles.card}>
                <span className={styles.icon}>{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
`

// ─────────────────────────────────────────────────────────────────────────────
// SERVICES CSS
// ─────────────────────────────────────────────────────────────────────────────
export const SERVICES_CSS = `.page { min-height: 100vh; }

.hero {
  background: var(--primary);
  color: white;
  padding: 5rem 1rem;
  text-align: center;
}

.hero h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; }
.hero p  { font-size: 1.1rem; opacity: 0.85; }

.content { padding: 4rem 1rem; background: #f8fafc; }
.container { max-width: 1100px; margin: 0 auto; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.icon { font-size: 2rem; display: block; margin-bottom: 1rem; }

.card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #0f172a;
}

.card p { color: #64748b; font-size: 0.9rem; line-height: 1.6; }
`

// ─────────────────────────────────────────────────────────────────────────────
// PRICING PAGE
// ─────────────────────────────────────────────────────────────────────────────
export const PRICING_TSX = `import styles from "./page.module.css"
import Link from "next/link"

const PLANS = [
  {
    name: "Starter",
    price: "₹999",
    period: "/month",
    features: ["5 Users", "10GB Storage", "Email Support", "Basic Analytics"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "₹2,999",
    period: "/month",
    features: ["25 Users", "50GB Storage", "Priority Support", "Advanced Analytics", "API Access"],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: ["Unlimited Users", "Unlimited Storage", "24/7 Support", "Custom Analytics", "Dedicated Manager"],
    cta: "Contact Sales",
    highlighted: false,
  },
]

export default function PricingPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>Simple Pricing</h1>
        <p>No hidden fees. Cancel anytime.</p>
      </section>
      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {PLANS.map(plan => (
              <div
                key={plan.name}
                className={\`\${styles.card} \${plan.highlighted ? styles.highlighted : ""}\`}
              >
                {plan.highlighted && <span className={styles.badge}>Most Popular</span>}
                <h3>{plan.name}</h3>
                <div className={styles.price}>
                  <span className={styles.amount}>{plan.price}</span>
                  <span className={styles.period}>{plan.period}</span>
                </div>
                <ul className={styles.features}>
                  {plan.features.map(f => <li key={f}>✅ {f}</li>)}
                </ul>
                <Link href="/contact" className={styles.btn}>{plan.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
`

// ─────────────────────────────────────────────────────────────────────────────
// PRICING CSS
// ─────────────────────────────────────────────────────────────────────────────
export const PRICING_CSS = `.page { min-height: 100vh; }

.hero {
  background: var(--primary);
  color: white;
  padding: 5rem 1rem;
  text-align: center;
}

.hero h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; }
.hero p  { font-size: 1.1rem; opacity: 0.85; }

.content { padding: 4rem 1rem; background: #f8fafc; }
.container { max-width: 1100px; margin: 0 auto; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  align-items: start;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  position: relative;
  border: 2px solid transparent;
}

.highlighted {
  border-color: var(--primary);
  transform: scale(1.03);
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
}

.badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary);
  color: white;
  padding: 2px 16px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
}

.card h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; color: #0f172a; }

.price { display: flex; align-items: baseline; gap: 0.25rem; margin-bottom: 1.5rem; }

.amount { font-size: 2rem; font-weight: 800; color: var(--primary); }
.period { font-size: 0.875rem; color: #64748b; }

.features { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 2rem; }
.features li { font-size: 0.9rem; color: #475569; }

.btn {
  display: block;
  text-align: center;
  background: var(--primary);
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: opacity 0.2s;
}

.btn:hover { opacity: 0.9; }
`

// ─────────────────────────────────────────────────────────────────────────────
// AUTH PAGE
// ─────────────────────────────────────────────────────────────────────────────
export const AUTH_TSX = `"use client"
import { useState } from "react"
import styles from "./page.module.css"

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [form, setForm] = useState({ name: "", email: "", password: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(mode === "login" ? "Login successful!" : "Account created!")
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>{{SITE_NAME}}</h1>
        <div className={styles.tabs}>
          <button
            className={\`\${styles.tab} \${mode === "login" ? styles.active : ""}\`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={\`\${styles.tab} \${mode === "register" ? styles.active : ""}\`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === "register" && (
            <div className={styles.field}>
              <label>Full Name</label>
              <input
                type="text" required placeholder="Your name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
          )}
          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email" required placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password" required placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button type="submit" className={styles.btn}>
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  )
}
`

// ─────────────────────────────────────────────────────────────────────────────
// AUTH CSS
// ─────────────────────────────────────────────────────────────────────────────
export const AUTH_CSS = `.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 2rem;
}

.card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 420px;
}

.title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 1.5rem;
}

.tabs {
  display: flex;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 1.5rem;
}

.tab {
  flex: 1;
  padding: 0.75rem;
  background: none;
  border: none;
  font-size: 0.95rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s;
}

.tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
  font-weight: 700;
}

.form { display: flex; flex-direction: column; gap: 1rem; }

.field { display: flex; flex-direction: column; gap: 0.4rem; }
.field label { font-size: 0.85rem; font-weight: 600; color: #374151; }

.field input {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.field input:focus { border-color: var(--primary); }

.btn {
  background: var(--primary);
  color: white;
  padding: 0.875rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: opacity 0.2s;
}

.btn:hover { opacity: 0.9; }
`

// ─────────────────────────────────────────────────────────────────────────────
// NOT FOUND PAGE
// ─────────────────────────────────────────────────────────────────────────────
export const NOT_FOUND_TSX = `import Link from "next/link"

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem" }}>
      <div>
        <h1 style={{ fontSize: "6rem", fontWeight: 800, color: "var(--primary)", lineHeight: 1 }}>404</h1>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "1rem 0 0.5rem" }}>Page Not Found</h2>
        <p style={{ color: "#64748b", marginBottom: "2rem" }}>The page you are looking for does not exist.</p>
        <Link href="/" style={{ background: "var(--primary)", color: "white", padding: "0.75rem 2rem", borderRadius: "8px", fontWeight: 600 }}>
          Go Home
        </Link>
      </div>
    </div>
  )
}
`

// ─────────────────────────────────────────────────────────────────────────────
// TSCONFIG
// ─────────────────────────────────────────────────────────────────────────────
export const TSCONFIG = `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`

// ─────────────────────────────────────────────────────────────────────────────
// README
// ─────────────────────────────────────────────────────────────────────────────
export const README = (siteName: string) => `# ${siteName}

Generated by **yuktai Vibe Coder** — open source AI plugin for Next.js.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Next.js 16** — React framework
- **Tailwind CSS** — Utility-first styling
- **CSS Modules** — Scoped component styles
- **TypeScript** — Type safety

## Pages

All pages are in \`src/app/\` directory.
Edit any page to customise content.

---

*Built with yuktai — aksharatantra.vercel.app*
`