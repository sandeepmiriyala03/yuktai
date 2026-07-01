"use strict";var Ko=Object.create;var Le=Object.defineProperty;var Xo=Object.getOwnPropertyDescriptor;var Zo=Object.getOwnPropertyNames;var Jo=Object.getPrototypeOf,Qo=Object.prototype.hasOwnProperty;var re=(e,t)=>()=>(e&&(t=e(e=0)),t);var ue=(e,t)=>{for(var o in t)Le(e,o,{get:t[o],enumerable:!0})},Tt=(e,t,o,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of Zo(t))!Qo.call(e,a)&&a!==o&&Le(e,a,{get:()=>t[a],enumerable:!(r=Xo(t,a))||r.enumerable});return e};var Be=(e,t,o)=>(o=e!=null?Ko(Jo(e)):{},Tt(t||!e||!e.__esModule?Le(o,"default",{value:e,enumerable:!0}):o,e)),en=e=>Tt(Le({},"__esModule",{value:!0}),e);var m=re(()=>{});var Zt={};ue(Zt,{askPage:()=>Ze});function Tn(){return new Promise(e=>{let t=setTimeout(e,1500),o=new MutationObserver(()=>{clearTimeout(t),t=setTimeout(()=>{o.disconnect(),e()},500)});o.observe(document.body,{childList:!0,subtree:!0})})}function En(){let e=[],t=document.querySelectorAll("*");for(let o of t){if(o.closest("[data-yuktai-panel]"))continue;let r=o.innerText?.trim();r&&r.length>30&&e.push(r);let a=o.getAttribute("aria-label");if(a&&a.length>10&&e.push(a),(o instanceof HTMLInputElement||o instanceof HTMLTextAreaElement)&&(o.placeholder&&e.push(o.placeholder),o.value&&e.push(o.value)),o instanceof HTMLButtonElement){let s=o.innerText||o.getAttribute("aria-label");s&&e.push(s)}}return e.join(" ").slice(0,3500)}async function Ze(e){if(!e.trim())return{success:!1,answer:"",error:"Please type a question."};try{let t=window,o=t.LanguageModel||t.ai?.languageModel;if(!o)return{success:!1,answer:"",error:"Gemini Nano not available."};await Tn();let r=En();if(!r||r.length<100)return{success:!1,answer:"",error:"Page content not readable."};let a;try{a=await o.create({systemPrompt:`Answer ONLY using page content.
Keep answer short (2\u20133 sentences).
If not found say: "I could not find that on this page."`,outputLanguage:"en"})}catch{a=await o.create()}let s=`Page:
${r}

Q: ${e}`,n=await a.prompt(s);return a?.destroy&&a.destroy(),{success:!0,answer:n?.trim()||"No answer found."}}catch(t){return{success:!1,answer:"",error:t instanceof Error?t.message:"Error occurred"}}}var Je=re(()=>{"use strict";m()});var tt={};ue(tt,{askPageWithTransformers:()=>et,getModelLoadStatus:()=>me,isTransformersSupported:()=>fe});function to(){return typeof navigator>"u"?!1:/Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(navigator.userAgent)}function Cn(){if(to())return"wasm";try{if(typeof navigator<"u"&&"gpu"in navigator&&navigator.gpu!==void 0)return"webgpu"}catch{}return"wasm"}async function Ln(){if(!Qe){if(le){for(;le;)await new Promise(e=>setTimeout(e,200));return}le=!0;try{let{pipeline:e,env:t}=await import("@huggingface/transformers");t.allowRemoteModels=!0,t.allowLocalModels=!1,typeof window<"u"&&typeof caches<"u"&&(t.useWasmCache=!0);let o=Cn(),r=to();console.log(`yuktai: Transformers.js \u2014 device: ${o}, mobile: ${r}`),Qt=await e("feature-extraction","Xenova/all-MiniLM-L6-v2",{device:o,dtype:r?"q4":"fp32"}),eo=await e("text2text-generation","Xenova/flan-t5-small",{device:o,dtype:r?"q4":"fp32"}),Qe=!0,le=!1,console.log("yuktai: Transformers.js models loaded \u2705")}catch(e){throw le=!1,console.error("yuktai: Transformers.js model load failed",e),e}}}function Mn(){return new Promise(e=>{let t=setTimeout(e,1500),o=new MutationObserver(()=>{clearTimeout(t),t=setTimeout(()=>{o.disconnect(),e()},500)});o.observe(document.body,{childList:!0,subtree:!0})})}function In(){let e=[],t=new Set,o=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, td, th, label, figcaption, blockquote, span, a, button, div");for(let n of o){if(n.closest("[data-yuktai-panel]")||n.querySelector("p, h1, h2, h3, h4, li, td, div"))continue;let c=n.innerText?.trim();if(!c||c.length<15||t.has(c))continue;t.add(c),e.push(c);let d=n.getAttribute("aria-label")?.trim();d&&d.length>8&&!t.has(d)&&(t.add(d),e.push(d))}let r=document.title?.trim();r&&!t.has(r)&&e.unshift(r);let s=document.querySelector('meta[name="description"]')?.getAttribute("content")?.trim();return s&&!t.has(s)&&e.unshift(s),e.join(" ").slice(0,8e3)}function Rn(e,t=150,o=30){if(typeof e!="string")try{e=String(e??"")}catch{return[]}let r=e.trim();if(!r)return[];let a=Math.min(o,Math.floor(t/2)),s=r.split(/\s+/),n=[],i=t-a;for(let c=0;c<s.length;c+=i){let d=s.slice(c,c+t).join(" ");d.trim().length>20&&n.push(d)}return n}function Pn(e,t){let o=0,r=0,a=0;for(let s=0;s<e.length;s++)o+=e[s]*t[s],r+=e[s]*e[s],a+=t[s]*t[s];return o/(Math.sqrt(r)*Math.sqrt(a)+1e-8)}async function Jt(e){let t=await Qt(e,{pooling:"mean",normalize:!0}),o=t?.data??t;return Array.from(o)}async function Nn(e,t,o=3){let r=await Jt(e),a=await Promise.all(t.map(async s=>{let n=await Jt(s),i=Pn(r,n);return{chunk:s,score:i}}));return a.sort((s,n)=>n.score-s.score),a.slice(0,o).map(s=>s.chunk)}async function et(e){if(!e.trim())return{success:!1,answer:"",error:"Please type a question."};try{await Ln(),await Mn();let t=In();if(!t||t.length<50)return{success:!1,answer:"",error:"Not enough content on this page."};let o=Rn(t);if(o.length===0)return{success:!1,answer:"",error:"Could not process page content."};let s=`Answer the question based on the context. Give a complete answer in 2-3 sentences.

Context: ${(await Nn(e,o,3)).join(" ").slice(0,1200)}

Question: ${e}

Answer:`,i=(await eo(s,{max_new_tokens:120,min_new_tokens:10}))?.[0]?.generated_text?.trim()||"";return i?{success:!0,answer:i}:{success:!0,answer:"I could not find a specific answer on this page."}}catch(t){console.error("yuktai: Transformers RAG error",t);let o=t instanceof Error?t.message:"";return o.includes("Out of memory")||o.includes("memory")?{success:!1,answer:"",error:"Not enough device memory. Try on a device with more RAM or use desktop Chrome with Gemini Nano."}:{success:!1,answer:"",error:o||"Transformers.js error."}}}function fe(){try{return typeof WebAssembly<"u"&&typeof Worker<"u"}catch{return!1}}function me(){return Qe?"ready":le?"loading":"idle"}var Qt,eo,le,Qe,ge=re(()=>{"use strict";m();Qt=null,eo=null,le=!1,Qe=!1});function no(e,t){return e.replace(/\{\{SITE_NAME\}\}/g,t.SITE_NAME).replace(/\{\{THEME_COLOR\}\}/g,t.THEME_COLOR).replace(/\{\{TAGLINE\}\}/g,t.TAGLINE).replace(/\{\{YEAR\}\}/g,t.YEAR)}var rt,ro,ao,io,so,lo,co,po,uo,fo,mo,go,bo,yo,ho,xo,vo,wo,ko,So,Ao,To,Eo,Co,Lo,Mo=re(()=>{"use strict";m();rt={blue:"#1a73e8",green:"#0d9488",purple:"#7c3aed",red:"#dc2626",orange:"#ea580c",teal:"#0891b2",indigo:"#4f46e5",gray:"#374151"},ro=e=>`{
  "name": "${e.toLowerCase().replace(/\s+/g,"-")}",
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
`,ao=`/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
}

module.exports = nextConfig
`,io=e=>`/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "${e}",
      },
    },
  },
  plugins: [],
}
`,so=e=>`@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: ${e};
  --primary-dark: ${e}dd;
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
`,lo=`import type { Metadata } from "next"
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
`,co=`"use client"
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
          \u2630
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
`,po=`.navbar {
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
`,uo=`import styles from "./Footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.brand}>{{SITE_NAME}}</p>
        <p className={styles.tagline}>{{TAGLINE}}</p>
        <p className={styles.copy}>\xA9 {{YEAR}} {{SITE_NAME}}. All rights reserved.</p>
      </div>
    </footer>
  )
}
`,fo=`.footer {
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
`,mo=`import styles from "./page.module.css"
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
              { icon: "\u26A1", title: "Fast", desc: "Lightning fast performance on all devices" },
              { icon: "\u{1F512}", title: "Secure", desc: "Enterprise-grade security built in" },
              { icon: "\u{1F4F1}", title: "Responsive", desc: "Works perfectly on mobile and desktop" },
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
`,go=`.page { min-height: 100vh; }

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
`,bo=`import styles from "./page.module.css"

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
              <p>We started with a simple mission \u2014 to provide the best experience for our customers. Built on trust, quality, and dedication, {{SITE_NAME}} has grown to serve thousands of happy customers.</p>
              <p>Our team of experts is committed to delivering excellence in everything we do. We believe in building long-term relationships with our clients.</p>
            </div>
            <div>
              <h2>Our Values</h2>
              <ul className={styles.list}>
                <li>\u2705 Customer first approach</li>
                <li>\u2705 Quality in everything</li>
                <li>\u2705 Transparent communication</li>
                <li>\u2705 Continuous improvement</li>
                <li>\u2705 Community focus</li>
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
`,yo=`.page { min-height: 100vh; }

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
`,ho=`"use client"
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
                <span>\u{1F4CD}</span>
                <div>
                  <strong>Address</strong>
                  <p>123 Business Street, City, State 400001</p>
                </div>
              </div>
              <div className={styles.detail}>
                <span>\u{1F4DE}</span>
                <div>
                  <strong>Phone</strong>
                  <p>+91 98765 43210</p>
                </div>
              </div>
              <div className={styles.detail}>
                <span>\u2709\uFE0F</span>
                <div>
                  <strong>Email</strong>
                  <p>hello@{{SITE_NAME_LOWER}}.com</p>
                </div>
              </div>
            </div>
            <div className={styles.formWrap}>
              {sent ? (
                <div className={styles.success}>
                  \u2705 Message sent! We will get back to you soon.
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
`,xo=`.page { min-height: 100vh; }

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
`,vo=`import styles from "./page.module.css"

const SERVICES = [
  { icon: "\u{1F680}", title: "Service One", desc: "Comprehensive solution designed to meet your business needs efficiently and effectively." },
  { icon: "\u{1F4A1}", title: "Service Two", desc: "Innovative approaches that help your business grow and stay ahead of the competition." },
  { icon: "\u{1F527}", title: "Service Three", desc: "Expert support and maintenance to ensure smooth operations at all times." },
  { icon: "\u{1F4CA}", title: "Service Four", desc: "Data-driven insights and analytics to help you make better business decisions." },
  { icon: "\u{1F91D}", title: "Service Five", desc: "Partnership programs designed to create mutual value and long-term success." },
  { icon: "\u{1F310}", title: "Service Six", desc: "Global reach with local expertise to serve customers worldwide." },
]

export default function ServicesPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>Our Services</h1>
        <p>Everything you need to succeed \u2014 all in one place</p>
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
`,wo=`.page { min-height: 100vh; }

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
`,ko=`import styles from "./page.module.css"
import Link from "next/link"

const PLANS = [
  {
    name: "Starter",
    price: "\u20B9999",
    period: "/month",
    features: ["5 Users", "10GB Storage", "Email Support", "Basic Analytics"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "\u20B92,999",
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
                  {plan.features.map(f => <li key={f}>\u2705 {f}</li>)}
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
`,So=`.page { min-height: 100vh; }

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
`,Ao=`"use client"
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
              type="password" required placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
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
`,To=`.page {
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
`,Eo=`import Link from "next/link"

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
`,Co=`{
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
`,Lo=e=>`# ${e}

Generated by **yuktai Vibe Coder** \u2014 open source AI plugin for Next.js.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Next.js 16** \u2014 React framework
- **Tailwind CSS** \u2014 Utility-first styling
- **CSS Modules** \u2014 Scoped component styles
- **TypeScript** \u2014 Type safety

## Pages

All pages are in \`src/app/\` directory.
Edit any page to customise content.

---

*Built with yuktai \u2014 aksharatantra.vercel.app*
`});var Io={};ue(Io,{generateZip:()=>Xn});function Kn(e,t){return{hotel:`Experience luxury and comfort at ${e}`,ecommerce:`Shop the best products at ${e}`,restaurant:`Delicious food crafted with love at ${e}`,portfolio:`Creative work and professional services by ${e}`,blog:`Insights, stories, and ideas from ${e}`,saas:`Powerful tools to grow your business \u2014 ${e}`,government:`Official services and information \u2014 ${e}`,healthcare:`Quality healthcare you can trust \u2014 ${e}`,education:`Learn, grow, and succeed with ${e}`,realestate:`Find your perfect property with ${e}`,landing:`The smarter way to get things done \u2014 ${e}`,generic:`Welcome to ${e} \u2014 your trusted partner`}[t]||`Welcome to ${e}`}async function Xn(e){let t=(await import("jszip")).default,o=new t,r=rt[e.theme]||rt.blue,a=Kn(e.siteName,e.websiteType),s=new Date().getFullYear().toString(),n={SITE_NAME:e.siteName,THEME_COLOR:r,TAGLINE:a,YEAR:s},i=u=>no(u,n).replace(/\{\{SITE_NAME_LOWER\}\}/g,e.siteName.toLowerCase().replace(/\s+/g,""));o.file("package.json",ro(e.siteName)),o.file("next.config.js",ao),o.file("tailwind.config.js",io(r)),o.file("tsconfig.json",Co),o.file("README.md",Lo(e.siteName)),o.file("postcss.config.js","module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }"),o.file(".gitignore",`node_modules
.next
.env.local
.DS_Store`),o.file("src/app/globals.css",so(r)),o.file("src/app/layout.tsx",i(lo)),o.file("src/app/not-found.tsx",Eo),o.file("src/components/Navbar.tsx",i(co)),o.file("src/components/Navbar.module.css",po),o.file("src/components/Footer.tsx",i(uo)),o.file("src/components/Footer.module.css",fo);for(let u of e.pages)switch(u){case"home":o.file("src/app/page.tsx",i(mo)),o.file("src/app/page.module.css",go);break;case"about":o.file("src/app/about/page.tsx",i(bo)),o.file("src/app/about/page.module.css",yo);break;case"contact":o.file("src/app/contact/page.tsx",i(ho)),o.file("src/app/contact/page.module.css",xo);break;case"services":o.file("src/app/services/page.tsx",i(vo)),o.file("src/app/services/page.module.css",wo);break;case"pricing":o.file("src/app/pricing/page.tsx",i(ko)),o.file("src/app/pricing/page.module.css",So);break;case"auth":o.file("src/app/auth/page.tsx",i(Ao)),o.file("src/app/auth/page.module.css",To);break;default:o.file(`src/app/${u}/page.tsx`,Zn(u,e.siteName,r,n,i));break}let c=await o.generateAsync({type:"blob"}),d=URL.createObjectURL(c),b=document.createElement("a");b.href=d,b.download=`${e.siteName.toLowerCase().replace(/\s+/g,"-")}-nextjs.zip`,document.body.appendChild(b),b.click(),document.body.removeChild(b),URL.revokeObjectURL(d)}function Zn(e,t,o,r,a){let s=e.charAt(0).toUpperCase()+e.slice(1);return`import styles from "./page.module.css"

export default function ${s}Page() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <section style={{
        background: "${o}",
        color: "white",
        padding: "5rem 1rem",
        textAlign: "center"
      }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem" }}>
          ${s}
        </h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.85 }}>
          ${t} \u2014 ${s} page
        </p>
      </section>
      <section style={{ padding: "4rem 1rem", maxWidth: "1100px", margin: "0 auto" }}>
        <p style={{ color: "#64748b", fontSize: "1rem", textAlign: "center" }}>
          This is the ${s} page. Edit this file to add your content.
        </p>
      </section>
    </div>
  )
}
`}var Ro=re(()=>{"use strict";m();Mo()});var Ho={};ue(Ho,{getPageText:()=>Po,highlightField:()=>zo,runAgent:()=>rr,scanFormFields:()=>No,scrollToSection:()=>Fo});function oe(e){try{let t=window.getComputedStyle(e);if(t.display==="none"||t.visibility==="hidden"||t.opacity==="0"||e.hidden)return!1;let o=e.getBoundingClientRect();return!(o.width===0&&o.height===0)}catch{return!0}}function Po(){let e=[],t=new Set,o=n=>{let i=n.trim();i&&i.length>10&&!t.has(i)&&(t.add(i),e.push(i))};document.title&&o(document.title);let r=['meta[name="description"]','meta[name="keywords"]','meta[property="og:title"]','meta[property="og:description"]','meta[name="twitter:title"]','meta[name="twitter:description"]'];for(let n of r){let i=document.querySelector(n)?.getAttribute("content");i&&o(i)}let a=["h1","h2","h3","h4","h5","h6","p","blockquote","q","pre","code","li","dt","dd","th","td","caption","a","b","strong","em","i","u","s","abbr","acronym","cite","dfn","mark","small","sub","sup","ins","del","bdi","bdo","article","section","aside","nav","header","footer","main","summary","details","figcaption","figure","address","time","output","label","legend","option","button","font","center","span","div","[role='heading']","[role='main']","[role='article']","[role='region']","[role='complementary']","[role='contentinfo']","[role='navigation']","[role='banner']","[role='listitem']","[role='cell']","[role='columnheader']","[role='rowheader']"],s=document.querySelectorAll(a.join(","));for(let n of s){if(n.closest("[data-yuktai-panel]")||!oe(n)||n.querySelector("p, h1, h2, h3, h4, h5, h6, li, td, th, div, article, section, blockquote, pre"))continue;let c=n.innerText?.trim();if(c&&c.length>10&&o(c),!c){let M=n.textContent?.trim();M&&M.length>10&&o(M)}let d=n.getAttribute("aria-label")?.trim();d&&d.length>5&&o(d);let b=n.getAttribute("aria-description")?.trim();b&&b.length>5&&o(b);let u=n.getAttribute("aria-valuetext")?.trim();u&&o(u);let N=n.getAttribute("title")?.trim();N&&N.length>5&&o(N);let P=n.getAttribute("data-label")?.trim();P&&o(P);let _=n.getAttribute("data-title")?.trim();_&&o(_),n.querySelectorAll("img").forEach(M=>{let w=M.getAttribute("alt")?.trim();w&&w.length>5&&o(w);let H=M.getAttribute("title")?.trim();H&&H.length>5&&o(H)})}document.querySelectorAll("img").forEach(n=>{if(n.closest("[data-yuktai-panel]")||!oe(n))return;let i=n.getAttribute("alt")?.trim(),c=n.getAttribute("title")?.trim();i&&i.length>5&&o(i),c&&c.length>5&&o(c)}),document.querySelectorAll("input:not([type=hidden]), textarea").forEach(n=>{if(n.closest("[data-yuktai-panel]")||!oe(n))return;n.placeholder&&o(n.placeholder),n.value&&n.value.length>3&&o(n.value);let i=n.getAttribute("aria-label")?.trim();i&&o(i)}),document.querySelectorAll("select").forEach(n=>{n.closest("[data-yuktai-panel]")||oe(n)&&Array.from(n.options).forEach(i=>{i.text?.trim().length>3&&o(i.text.trim())})}),document.querySelectorAll("td, th").forEach(n=>{if(n.closest("[data-yuktai-panel]")||!oe(n))return;let i=n.innerText?.trim();i&&i.length>3&&o(i)});try{document.querySelectorAll("iframe").forEach(n=>{try{let i=n.contentDocument;if(!i)return;let c=i.body?.innerText?.trim();c&&c.length>20&&o(c.slice(0,500))}catch{}})}catch{}return document.querySelectorAll("a").forEach(n=>{if(n.closest("[data-yuktai-panel]")||!oe(n))return;let i=n.innerText?.trim();i&&i.length>3&&i.length<100&&o(i)}),e.join(" ").slice(0,5e3)}function tr(e){let t=e.getAttribute("aria-label")?.trim();if(t)return t;let o=e.getAttribute("aria-labelledby");if(o){let c=document.getElementById(o);if(c)return c.innerText?.trim()||""}if(e.id){let c=document.querySelector(`label[for="${e.id}"]`);if(c)return c.innerText?.trim()||""}let r=e.closest("label");if(r){let c=r.cloneNode(!0);return c.querySelectorAll("input, select, textarea").forEach(d=>d.remove()),c.innerText?.trim()||""}if((e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement)&&e.placeholder)return e.placeholder;if(e.name)return e.name.replace(/[_-]/g," ");let a=e.previousSibling;if(a?.nodeType===Node.TEXT_NODE){let c=a.textContent?.trim();if(c&&c.length>1)return c}let s=e.previousElementSibling;if(s){let c=s.innerText?.trim();if(c&&c.length>1&&c.length<60)return c}let n=e.closest("td, th");if(n){let c=n.previousElementSibling;if(c){let d=c.innerText?.trim();if(d&&d.length>1)return d}}let i=e.getAttribute("title")?.trim();return i||(e instanceof HTMLInputElement?e.type:"field")}function No(){let e=[],t=document.querySelectorAll(["input:not([type=hidden])","input:not([type=submit])","input:not([type=button])","input:not([type=reset])","input:not([type=image])","select","textarea","[contenteditable='true']","[role='textbox']","[role='combobox']","[role='spinbutton']","[role='searchbox']","[role='listbox']"].join(", "));for(let o of t){if(o.closest("[data-yuktai-panel]")||!oe(o))continue;if(o instanceof HTMLInputElement){let a=o.type.toLowerCase();if(["submit","button","reset","image"].includes(a))continue}let r=tr(o);e.push({label:r,type:o instanceof HTMLInputElement?o.type:o.tagName.toLowerCase(),placeholder:(o instanceof HTMLInputElement||o instanceof HTMLTextAreaElement)&&o.placeholder||"",required:o.required||o.getAttribute("aria-required")==="true"||o.getAttribute("data-required")==="true",element:o})}return e}function zo(e,t=3e3){e.scrollIntoView({behavior:"smooth",block:"center"}),e.style.outline="3px solid #0d9488",e.style.outlineOffset="3px";try{e.focus()}catch{}setTimeout(()=>{e.style.outline="",e.style.outlineOffset=""},t)}function Fo(e){let t=e.toLowerCase(),o=document.querySelectorAll("h1, h2, h3, h4, h5, h6, section, article, [id], [aria-label], [role='heading'], [role='region']");for(let r of o){if(r.closest("[data-yuktai-panel]")||!oe(r))continue;if((r.innerText||r.getAttribute("id")||r.getAttribute("aria-label")||r.getAttribute("name")||"").toLowerCase().includes(t))return r.scrollIntoView({behavior:"smooth",block:"center"}),r.style.outline="2px solid #0d9488",r.style.outlineOffset="4px",setTimeout(()=>{r.style.outline="",r.style.outlineOffset=""},2500),!0}return!1}async function or(e,t,o){let r=window,a=r.LanguageModel||r.ai?.languageModel;if(!a)throw new Error("Gemini Nano not available");let s=await a.create({systemPrompt:`You are a helpful web accessibility agent.
Create a simple action plan to help a user complete a task on a webpage.
Rules:
- Maximum 5 steps
- Short and clear \u2014 no jargon
- If filling a form \u2014 list each field and what to enter
- No markdown \u2014 no asterisks, no bold, no headers
- Number each step: 1. 2. 3.`}),i=`Page content: ${e}${o?`
The page has form fields the user may need to fill.`:""}

User task: ${t}

Action plan:`,c=await s.prompt(i);return s.destroy(),c?.trim()||""}async function nr(e,t){let{askPageWithTransformers:o}=await Promise.resolve().then(()=>(ge(),tt));return(await o(`How do I: ${t}`)).answer||"I could not create a plan for this task."}async function rr(e,t,o){if(!e.trim())return{success:!1,steps:[],error:"Please tell me what you want to do."};if(!t)return{success:!1,steps:[],error:"No AI engine available on this device."};let r=[],a=(s,n="info")=>{let i={text:s,type:n};r.push(i),o(i)};try{a("\u{1F4D6} Reading page content...","info");let s=Po(),n=No(),i=n.length>0;s.length<50&&a("\u26A0\uFE0F Page content is very limited. This may be a static image page.","error"),a(i?`\u{1F4CB} Found ${n.length} form field${n.length!==1?"s":""} on this page`:"\u{1F4C4} No form fields found \u2014 this appears to be a content page","info"),a("\u{1F916} Creating action plan...","info");let c="";try{t==="gemini"?c=await or(s,e,i):c=await nr(s,e)}catch{c=i?`1. Locate the form on this page
2. Fill each required field
3. Review your answers
4. Submit the form`:`1. Read the page carefully
2. Find the section relevant to your task
3. Follow the on-page instructions`}if(c&&(a("\u2705 Your action plan:","success"),c.split(/\n/).map(d=>d.replace(/\*\*/g,"").replace(/\*/g,"").trim()).filter(d=>d.length>5).slice(0,6).forEach(d=>a(`   ${d}`,"action"))),i){let d=n[0];a(`\u{1F3AF} First field: "${d.label}"${d.required?" \u2605 required":""}`,"field"),zo(d.element),n.length>1&&a(`\u{1F4DD} All ${n.length} fields: ${n.map(b=>b.label).join(" \u2192 ")}`,"info")}else{let d=e.toLowerCase().split(/\s+/).filter(u=>u.length>3),b=!1;for(let u of d)if(Fo(u)){a(`\u{1F3AF} Scrolled to relevant section: "${u}"`,"action"),b=!0;break}b||a("\u{1F4A1} Scroll through the page to find what you need.","info")}return a("\u2705 Ready. Follow the steps above. Ask me again if you need more help.","success"),{success:!0,steps:r}}catch(s){let n=s instanceof Error?s.message:"Agent error.";return a(`\u26A0\uFE0F ${n}`,"error"),{success:!1,steps:r,error:n}}}var $o=re(()=>{"use strict";m()});var fr={};ue(fr,{CheckIcon:()=>mt,ChevronLeftIcon:()=>dt,ChevronRightIcon:()=>ut,CloseIcon:()=>gt,IconBase:()=>B,Runtime:()=>ne,SearchIcon:()=>it,SortDownIcon:()=>lt,SortUpIcon:()=>st,YuktAI:()=>ur,YuktAIWrapper:()=>$e,YuktaiGrid:()=>Oo,aiPlugin:()=>ye,default:()=>$e,useGrid:()=>Wo,voicePlugin:()=>he,wcag:()=>j,wcagPlugin:()=>j});module.exports=en(fr);m();m();m();function Et(){let e=window;return e.Rewriter||e.ai?.rewriter||null}async function _e(){try{let e=Et();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}async function tn(e){if(!e||e.trim().length<20)return{success:!1,original:e,rewritten:e,error:"Text too short"};try{let t=Et();if(!t)throw new Error("Rewriter API not available");let o=await t.create({tone:"more-casual",format:"plain-text",length:"as-is",outputLanguage:"en"}),r=await o.rewrite(e,{context:"Rewrite this text in simple plain English. Use short sentences. Avoid jargon. Make it easy to understand for everyone."});return o.destroy(),{success:!0,original:e,rewritten:r.trim()}}catch(t){return{success:!1,original:e,rewritten:e,error:t instanceof Error?t.message:"Rewrite failed"}}}async function Ct(){if(!await _e())return{fixed:0,error:"Chrome Built-in AI Rewriter not available. Enable via chrome://flags."};let t=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption"),o=0;for(let r of t){let a=r.innerText?.trim();if(!a||a.length<20||r.closest("[data-yuktai-panel]"))continue;let s=await tn(a);s.success&&s.rewritten!==a&&(r.dataset.yuktaiOriginal=a,r.innerText=s.rewritten,o++)}return{fixed:o}}function Lt(){let e=document.querySelectorAll("[data-yuktai-original]");for(let t of e){let o=t.dataset.yuktaiOriginal;o&&(t.innerText=o,delete t.dataset.yuktaiOriginal)}}m();var Mt="yuktai-summary-box";function It(){let e=window;return e.Summarizer||e.ai?.summarizer||null}async function Ge(){try{let e=It();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}function on(){let e=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, article, section"),t=[];for(let o of e){if(o.closest("[data-yuktai-panel]"))continue;let r=window.getComputedStyle(o);if(r.display==="none"||r.visibility==="hidden")continue;let a=o.innerText?.trim();a&&a.length>10&&t.push(a)}return t.join(" ").slice(0,5e3)}async function Rt(){if(!await Ge())return{success:!1,summary:"",error:"Chrome Built-in AI Summarizer not available. Enable via chrome://flags."};let t=on();if(!t||t.length<100)return{success:!1,summary:"",error:"Not enough text on this page to summarise."};try{let o=It();if(!o)throw new Error("Summarizer API not available");let r=await o.create({type:"tl;dr",format:"plain-text",length:"short",outputLanguage:"en"}),a=await r.summarize(t,{context:"Summarise this page in 2-3 simple sentences for a screen reader user who wants to know if this page is relevant to them."});return r.destroy(),nn(a.trim()),{success:!0,summary:a.trim()}}catch(o){return{success:!1,summary:"",error:o instanceof Error?o.message:"Summary failed"}}}function nn(e){Me();let t=document.createElement("div");t.id=Mt,t.setAttribute("data-yuktai-panel","true"),t.setAttribute("role","region"),t.setAttribute("aria-label","Page summary by yuktai"),t.style.cssText=`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9990;
    background: #0d9488;
    color: #ffffff;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    padding: 10px 20px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  `;let o=document.createElement("p");o.style.cssText="margin: 0; flex: 1;",o.textContent=`\u{1F4CB} Page summary: ${e}`;let r=document.createElement("button");r.textContent="\xD7",r.setAttribute("aria-label","Close page summary"),r.style.cssText=`
    background: none; border: none; color: #ffffff;
    font-size: 20px; cursor: pointer; padding: 0 4px;
    line-height: 1; flex-shrink: 0;
  `,r.addEventListener("click",Me),t.appendChild(o),t.appendChild(r),document.body.prepend(t)}function Me(){let e=document.getElementById(Mt);e&&e.remove()}m();var Re=[{code:"en",label:"English"},{code:"hi",label:"Hindi"},{code:"es",label:"Spanish"},{code:"fr",label:"French"},{code:"de",label:"German"},{code:"it",label:"Italian"},{code:"pt",label:"Portuguese"},{code:"nl",label:"Dutch"},{code:"pl",label:"Polish"},{code:"ru",label:"Russian"},{code:"ja",label:"Japanese"},{code:"ko",label:"Korean"},{code:"zh",label:"Chinese"},{code:"ar",label:"Arabic"},{code:"tr",label:"Turkish"},{code:"vi",label:"Vietnamese"},{code:"bn",label:"Bengali"},{code:"id",label:"Indonesian"}],Ie="en";function rn(){let e=window;return e.Translator||e.translation||null}async function an(e){try{let t=window;if(!rn())return!1;if(t.Translator&&typeof t.Translator.availability=="function")try{let r=await t.Translator.availability({sourceLanguage:"en",targetLanguage:e});return r==="readily"||r==="available"||r==="downloadable"||r==="after-download"}catch{}return t.Translator&&typeof t.Translator.canTranslate=="function"?await t.Translator.canTranslate({sourceLanguage:"en",targetLanguage:e})!=="no":t.translation&&typeof t.translation.canTranslate=="function"?await t.translation.canTranslate({sourceLanguage:"en",targetLanguage:e})!=="no":!1}catch{return!1}}async function sn(e){let t=window,o={sourceLanguage:"en",targetLanguage:e};if(t.Translator&&typeof t.Translator.create=="function")return await t.Translator.create(o);if(t.translation&&typeof t.translation.createTranslator=="function")return await t.translation.createTranslator(o);throw new Error("Translation API not available")}async function Pt(e){if(e===Ie)return{success:!0,language:e,fixed:0};if(e==="en")return De(),Ie="en",{success:!0,language:"en",fixed:0};if(!await an(e))return{success:!1,language:e,fixed:0,error:`Translation to ${e} not available. Enable via chrome://flags.`};try{let o=await sn(e),r=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption, span, a"),a=0;for(let s of r){if(s.closest("[data-yuktai-panel]")||s.children.length>0)continue;let n=s.innerText?.trim();if(!n||n.length<2)continue;s.dataset.yuktaiTranslationOriginal||(s.dataset.yuktaiTranslationOriginal=n);let i=await o.translate(n);i&&i!==n&&(s.innerText=i,a++)}return typeof o.destroy=="function"&&o.destroy(),Ie=e,{success:!0,language:e,fixed:a}}catch(o){return{success:!1,language:e,fixed:0,error:o instanceof Error?o.message:"Translation failed"}}}function De(){let e=document.querySelectorAll("[data-yuktai-translation-original]");for(let t of e){let o=t.dataset.yuktaiTranslationOriginal;o&&(t.innerText=o,delete t.dataset.yuktaiTranslationOriginal)}Ie="en"}m();var ln=[{phrases:["go to main","skip to main","main content"],action:"focus-main",label:"Jump to main content"},{phrases:["go to navigation","go to nav","open menu"],action:"focus-nav",label:"Jump to navigation"},{phrases:["go to search","search","find"],action:"focus-search",label:"Jump to search"},{phrases:["scroll down","page down","next"],action:"scroll-down",label:"Scroll down"},{phrases:["scroll up","page up","back up"],action:"scroll-up",label:"Scroll up"},{phrases:["go back","previous page"],action:"go-back",label:"Go back"},{phrases:["click","press","select"],action:"click-focused",label:"Click focused element"},{phrases:["next item","tab forward","tab"],action:"tab-forward",label:"Move to next element"},{phrases:["previous item","tab back","shift tab"],action:"tab-back",label:"Move to previous element"},{phrases:["stop listening","stop voice","quiet"],action:"stop-voice",label:"Stop voice control"}],Y=null,Pe=!1,ae=null;function qe(){return!!(window.SpeechRecognition||window.webkitSpeechRecognition)}function cn(e){let t=e.toLowerCase().trim();for(let o of ln)for(let r of o.phrases)if(t.includes(r))return{action:o.action,label:o.label};return null}function dn(e){switch(e){case"focus-main":{let t=document.querySelector("main, [role='main'], #main");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-nav":{let t=document.querySelector("nav, [role='navigation']");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-search":{let t=document.querySelector("input[type='search'], input[role='searchbox'], [aria-label*='search' i]");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"scroll-down":{window.scrollBy({top:400,behavior:"smooth"});break}case"scroll-up":{window.scrollBy({top:-400,behavior:"smooth"});break}case"go-back":{window.history.back();break}case"click-focused":{let t=document.activeElement;t&&t!==document.body&&t.click();break}case"tab-forward":{let t=Nt(),o=t.indexOf(document.activeElement),r=t[o+1]||t[0];r&&r.focus();break}case"tab-back":{let t=Nt(),o=t.indexOf(document.activeElement),r=t[o-1]||t[t.length-1];r&&r.focus();break}case"stop-voice":{je();break}}}function Nt(){return Array.from(document.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(e=>!e.closest("[data-yuktai-panel]"))}function zt(e){if(!qe())return!1;if(Pe)return!0;e&&(ae=e);let t=window.SpeechRecognition||window.webkitSpeechRecognition;return Y=new t,Y.continuous=!0,Y.interimResults=!1,Y.lang="en-US",Y.onresult=o=>{let r=o.results[o.results.length-1][0].transcript,a=cn(r);if(a){dn(a.action);let s={success:!0,command:r,action:a.label};if(ae&&ae(s),a.action==="stop-voice")return}},Y.onend=()=>{Pe&&Y?.start()},Y.onerror=o=>{o.error!=="no-speech"&&ae&&ae({success:!1,command:"",action:"",error:`Voice error: ${o.error}`})},Y.start(),Pe=!0,pn(),!0}function je(){Pe=!1,Y&&(Y.stop(),Y=null),ae=null,Ht()}var Ft="yuktai-voice-indicator";function pn(){Ht();let e=document.createElement("div");e.id=Ft,e.setAttribute("data-yuktai-panel","true"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-label","yuktai voice control is listening"),e.style.cssText=`
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9995;
    background: #0d9488;
    color: #ffffff;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 13px;
    font-weight: 500;
    padding: 6px 14px;
    border-radius: 99px;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    pointer-events: none;
  `;let t=document.createElement("span");if(t.style.cssText=`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ffffff;
    animation: yuktai-pulse 1.2s infinite;
    flex-shrink: 0;
  `,!document.getElementById("yuktai-pulse-style")){let r=document.createElement("style");r.id="yuktai-pulse-style",r.textContent=`
      @keyframes yuktai-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50%       { opacity: 0.4; transform: scale(0.7); }
      }
    `,document.head.appendChild(r)}let o=document.createElement("span");o.textContent="Listening for commands...",e.appendChild(t),e.appendChild(o),document.body.appendChild(e)}function Ht(){let e=document.getElementById(Ft);e&&e.remove()}m();var un=["button:not([aria-label]):not([aria-labelledby])","a:not([aria-label]):not([aria-labelledby])","input:not([aria-label]):not([aria-labelledby]):not([id])","select:not([aria-label]):not([aria-labelledby])","textarea:not([aria-label]):not([aria-labelledby])","[role='button']:not([aria-label])","[role='link']:not([aria-label])","[role='checkbox']:not([aria-label])","[role='tab']:not([aria-label])"].join(", ");function $t(){let e=window;return e.Writer||e.ai?.writer||null}async function Ve(){try{let e=$t();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}function fn(e){let t=[],o=e.innerText?.trim();o&&t.push(`element text: "${o}"`);let r=e.placeholder?.trim();r&&t.push(`placeholder: "${r}"`);let a=e.getAttribute("name")?.trim();a&&t.push(`name: "${a}"`);let s=e.getAttribute("type")?.trim();s&&t.push(`type: "${s}"`);let n=e.id;if(n){let d=document.querySelector(`label[for="${n}"]`);d&&t.push(`label: "${d.innerText?.trim()}"`)}let i=e.parentElement?.innerText?.trim().slice(0,60);i&&t.push(`parent context: "${i}"`),t.push(`tag: ${e.tagName.toLowerCase()}`);let c=e.getAttribute("role");return c&&t.push(`role: ${c}`),t.join(". ")}async function mn(e,t){let o=`
    Generate a short, clear aria-label for an HTML element.
    The label must be 2-6 words maximum.
    The label must describe what the element does or what it is.
    Do not include punctuation.
    Do not explain \u2014 just output the label text only.

    Element details:
    ${t}

    Output only the label. Nothing else.
  `.trim();return(await e.write(o)).trim().replace(/^["']|["']$/g,"").replace(/\.$/,"").trim()}async function Ot(){if(!await Ve())return{success:!1,fixed:0,elements:[],error:"Chrome Built-in AI Writer not available. Enable via chrome://flags."};let t=document.querySelectorAll(un);if(t.length===0)return{success:!0,fixed:0,elements:[]};try{let o=$t();if(!o)throw new Error("Writer API not available");let r=await o.create({tone:"neutral",format:"plain-text",length:"short",outputLanguage:"en"}),a=0,s=[];for(let n of t){if(n.closest("[data-yuktai-panel]"))continue;let i=window.getComputedStyle(n);if(i.display==="none"||i.visibility==="hidden")continue;let c=fn(n),d=await mn(r,c);d&&d.length>0&&(n.dataset.yuktaiLabelOriginal=n.getAttribute("aria-label")||"",n.setAttribute("aria-label",d),a++,s.push({tag:n.tagName.toLowerCase(),label:d}))}return r.destroy(),{success:!0,fixed:a,elements:s}}catch(o){return{success:!1,fixed:0,elements:[],error:o instanceof Error?o.message:"Label generation failed"}}}function Wt(){let e=document.querySelectorAll("[data-yuktai-label-original]");for(let t of e){let o=t.dataset.yuktaiLabelOriginal;o?t.setAttribute("aria-label",o):t.removeAttribute("aria-label"),delete t.dataset.yuktaiLabelOriginal}}var Fe=null,Bt=null;var _t=null,Ue=null,z=null,ie=null,Ne=null,Ye=null,se=null,ze={deuteranopia:"yuktai-cb-d",protanopia:"yuktai-cb-p",tritanopia:"yuktai-cb-t"};var Gt=new Set(["input","select","textarea"]);var Ke={nav:"navigation",header:"banner",footer:"contentinfo",main:"main",aside:"complementary"};function Xe(e,t="polite"){if(typeof window>"u"||!se?.speechEnabled||!window.speechSynthesis)return;window.speechSynthesis.cancel();let o=new SpeechSynthesisUtterance(e);o.rate=1,o.pitch=1,o.volume=1;let r=window.speechSynthesis.getVoices();r.length>0&&(o.voice=r[0]),window.speechSynthesis.speak(o)}function Kt(e,t="info"){if(typeof document>"u")return;let r={success:{bg:"#0f9d58",border:"#0a7a44",icon:"\u2713"},error:{bg:"#d93025",border:"#b52a1c",icon:"\u2715"},warning:{bg:"#f29900",border:"#c67c00",icon:"\u26A0"},info:{bg:"#1a73e8",border:"#1557b0",icon:"\u2139"}}[t];z||(z=document.createElement("div"),z.setAttribute("role","alert"),z.setAttribute("aria-live","assertive"),z.setAttribute("aria-atomic","true"),z.style.cssText=`
      position: fixed;
      top: 80px;
      right: 16px;
      left: auto;
      z-index: 999999;
      max-width: 320px;
      width: calc(100% - 32px);
      border-radius: 8px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: system-ui, sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: transform 0.3s, opacity 0.3s;
      transform: translateX(120%);
      opacity: 0;
    `,document.body.appendChild(z)),z.style.background=r.bg,z.style.border=`1px solid ${r.border}`,z.style.color="#fff",z.innerHTML=`
    <span style="font-size:18px;font-weight:700">${r.icon}</span>
    <span style="flex:1;line-height:1.4">${e}</span>
    <button
      onclick="this.parentElement.style.transform='translateX(120%)';this.parentElement.style.opacity='0'"
      style="background:none;border:none;color:#fff;cursor:pointer;font-size:18px;padding:0;line-height:1"
      aria-label="Close notification">\xD7</button>
  `,window.innerWidth<=480&&(z.style.right="8px",z.style.left="8px",z.style.maxWidth="none",z.style.width="auto"),requestAnimationFrame(()=>{z&&(z.style.transform="translateX(0)",z.style.opacity="1")}),setTimeout(()=>{z&&(z.style.transform="translateX(120%)",z.style.opacity="0")},5e3)}function E(e,t="info",o=!0){Fe&&(Fe.textContent=e),Kt(e,t),o&&Xe(e,t==="error"?"assertive":"polite")}function gn(){if(typeof document>"u"||_t)return;let e=[{label:"Skip to main content",selector:"main,[role='main'],#main,#main-content"},{label:"Skip to navigation",selector:"nav,[role='navigation'],#nav,#navigation"},{label:"Skip to search",selector:"[role='search'],#search,input[type='search']"}],t=document.createElement("div");t.setAttribute("data-yuktai-skip-bar","true"),t.setAttribute("role","navigation"),t.setAttribute("aria-label","Skip links"),t.style.cssText=`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999999;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 4px;
    background: #111;
    transform: translateY(-100%);
    transition: transform 0.2s ease;
    font-family: system-ui, sans-serif;
  `;let o=!1;if(e.forEach(({label:a,selector:s})=>{let n=document.querySelector(s);if(!n)return;o=!0,n.getAttribute("tabindex")||n.setAttribute("tabindex","-1");let i=document.createElement("a");i.href="#",i.textContent=a,i.style.cssText=`
      color: #fff;
      background: #1a73e8;
      padding: 8px 14px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      white-space: nowrap;
      border: 2px solid transparent;
      transition: background 0.15s, border-color 0.15s;
    `,i.addEventListener("focus",()=>{t.style.transform="translateY(0)"}),i.addEventListener("blur",()=>{setTimeout(()=>{t.matches(":focus-within")||(t.style.transform="translateY(-100%)")},2e3)}),i.addEventListener("click",c=>{c.preventDefault(),n.focus(),n.scrollIntoView({behavior:"smooth",block:"start"}),E(`Jumped to ${a.replace("Skip to ","")}`,"info"),t.style.transform="translateY(-100%)"}),t.appendChild(i)}),!o)return;window.innerWidth<768&&(t.style.transform="translateY(0)",t.style.position="sticky"),window.addEventListener("resize",()=>{window.innerWidth<768&&(t.style.transform="translateY(0)")}),document.body.insertBefore(t,document.body.firstChild),_t=t}function bn(){if(typeof document>"u"||document.querySelector("[data-yuktai-focus-style]"))return;let e=document.createElement("style");e.setAttribute("data-yuktai-focus-style","true"),e.textContent=`

    /* \u2500\u2500 Focus indicator \u2014 WCAG 2.4.11 minimum 2px solid \u2500\u2500 */
    [data-yuktai-a11y] *:focus-visible {
      outline: 3px solid #1a73e8 !important;
      outline-offset: 3px !important;
      border-radius: 2px !important;
      box-shadow: 0 0 0 6px rgba(26,115,232,0.15) !important;
    }

    /* \u2500\u2500 High contrast focus \u2500\u2500 */
    [data-yuktai-high-contrast] *:focus-visible {
      outline: 3px solid #ffff00 !important;
      outline-offset: 3px !important;
      box-shadow: 0 0 0 6px rgba(255,255,0,0.2) !important;
    }

    /* \u2500\u2500 Keyboard hint mode \u2500\u2500 */
    [data-yuktai-keyboard] *:focus {
      outline: 3px solid #ff6b35 !important;
      outline-offset: 3px !important;
    }

    /* \u2500\u2500 Remove default outline \u2014 replaced above \u2500\u2500 */
    [data-yuktai-a11y] *:focus:not(:focus-visible) {
      outline: none !important;
    }

    /* \u2500\u2500 Large targets \u2014 WCAG 2.5.8 \u2500\u2500 */
    [data-yuktai-large-targets] button,
    [data-yuktai-large-targets] a,
    [data-yuktai-large-targets] input,
    [data-yuktai-large-targets] select,
    [data-yuktai-large-targets] [role="button"] {
      min-height: 44px !important;
      min-width: 44px !important;
    }

    /* \u2500\u2500 Reduce motion \u2014 WCAG 2.3.3 \u2500\u2500 */
    [data-yuktai-reduce-motion] *,
    [data-yuktai-reduce-motion] *::before,
    [data-yuktai-reduce-motion] *::after {
      animation-duration: 0.001ms !important;
      transition-duration: 0.001ms !important;
    }

    /* \u2500\u2500 High contrast mode \u2500\u2500 */
    [data-yuktai-high-contrast] {
      filter: contrast(1.4) brightness(1.05) !important;
    }

    /* \u2500\u2500 Dark mode \u2500\u2500 */
    [data-yuktai-dark] {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    [data-yuktai-dark] img,
    [data-yuktai-dark] video,
    [data-yuktai-dark] canvas {
      filter: invert(1) hue-rotate(180deg) !important;
    }

    /* \u2500\u2500 Dyslexia font \u2500\u2500 */
    [data-yuktai-dyslexia] * {
      font-family: "Atkinson Hyperlegible", "Arial", sans-serif !important;
      letter-spacing: 0.05em !important;
      word-spacing: 0.1em !important;
      line-height: 1.8 !important;
    }

    /* \u2500\u2500 Link underline enforcement \u2500\u2500 */
    [data-yuktai-a11y] a:not([role]):not([class]) {
      text-decoration: underline !important;
    }

    /* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
       RESPONSIVE BREAKPOINTS
    \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

    /* Skip link bar \u2014 wrap on small screens */
    @media (max-width: 768px) {
      [data-yuktai-skip-bar] {
        flex-wrap: wrap;
      }
      [data-yuktai-skip-bar] a {
        font-size: 12px !important;
        padding: 6px 10px !important;
      }
    }

    /* Preference panel \u2014 bottom sheet on mobile */
    @media (max-width: 480px) {
      [data-yuktai-panel] {
        width: 100% !important;
        right: 0 !important;
        left: 0 !important;
        bottom: 0 !important;
        border-radius: 16px 16px 0 0 !important;
        max-height: 85vh !important;
      }
    }

    /* FAB button \u2014 reposition on mobile */
    @media (max-width: 480px) {
      [data-yuktai-pref-toggle] {
        bottom: 12px !important;
        right: 12px !important;
        width: 44px !important;
        height: 44px !important;
      }
    }

    /* Audit badge \u2014 reposition on mobile */
    @media (max-width: 480px) {
      [data-yuktai-badge] {
        bottom: 12px !important;
        left: 12px !important;
        font-size: 11px !important;
        padding: 4px 10px !important;
      }
    }

    /* Keyboard cheatsheet \u2014 full width on mobile */
    @media (max-width: 480px) {
      [data-yuktai-cheatsheet] {
        width: calc(100vw - 32px) !important;
        max-height: 80vh !important;
        overflow-y: auto !important;
      }
    }

    /* Timeout warning \u2014 full width on mobile */
    @media (max-width: 480px) {
      [data-yuktai-timeout] {
        width: calc(100vw - 32px) !important;
      }
    }

    /* Visual alert \u2014 full width on mobile */
    @media (max-width: 480px) {
      [data-yuktai-alert] {
        right: 8px !important;
        left: 8px !important;
        max-width: none !important;
        width: auto !important;
      }
    }
  `,document.head.appendChild(e),document.documentElement.setAttribute("data-yuktai-a11y","true")}function yn(){typeof document>"u"||document.querySelector("[data-yuktai-kb-init]")||(document.documentElement.setAttribute("data-yuktai-kb-init","true"),document.addEventListener("keydown",e=>{let t=document.activeElement;if(!t)return;let o=t.getAttribute("role")||"";if(e.key==="Escape"){let r=t.closest("[role='dialog'],[role='alertdialog']");if(r){r.style.display="none",E("Dialog closed","info");return}let a=t.closest("[role='menu'],[role='menubar']");a&&(a.style.display="none",E("Menu closed","info"))}if(o==="menuitem"||t.closest("[role='menu'],[role='menubar']")){let r=t.closest("[role='menu'],[role='menubar']");if(!r)return;let a=Array.from(r.querySelectorAll("[role='menuitem']:not([disabled])")),s=a.indexOf(t);e.key==="ArrowDown"||e.key==="ArrowRight"?(e.preventDefault(),a[(s+1)%a.length]?.focus()):e.key==="ArrowUp"||e.key==="ArrowLeft"?(e.preventDefault(),a[(s-1+a.length)%a.length]?.focus()):e.key==="Home"?(e.preventDefault(),a[0]?.focus()):e.key==="End"&&(e.preventDefault(),a[a.length-1]?.focus())}if(o==="tab"||t.closest("[role='tablist']")){let r=t.closest("[role='tablist']");if(!r)return;let a=Array.from(r.querySelectorAll("[role='tab']:not([disabled])")),s=a.indexOf(t);if(e.key==="ArrowRight"||e.key==="ArrowDown"){e.preventDefault();let n=a[(s+1)%a.length];n?.focus(),n?.click()}else if(e.key==="ArrowLeft"||e.key==="ArrowUp"){e.preventDefault();let n=a[(s-1+a.length)%a.length];n?.focus(),n?.click()}}if(o==="option"||t.closest("[role='listbox']")){let r=t.closest("[role='listbox']");if(!r)return;let a=Array.from(r.querySelectorAll("[role='option']:not([aria-disabled='true'])")),s=a.indexOf(t);e.key==="ArrowDown"?(e.preventDefault(),a[(s+1)%a.length]?.focus()):e.key==="ArrowUp"?(e.preventDefault(),a[(s-1+a.length)%a.length]?.focus()):(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),t.setAttribute("aria-selected","true"),a.forEach(n=>{n!==t&&n.setAttribute("aria-selected","false")}),E(`Selected: ${t.textContent?.trim()}`,"success"))}e.altKey&&e.key==="a"&&(e.preventDefault(),hn()),e.key==="Tab"&&se?.speechEnabled&&setTimeout(()=>{let r=document.activeElement;if(!r)return;let a=r.getAttribute("aria-label")||r.getAttribute("title")||r.textContent?.trim()||r.tagName.toLowerCase(),s=r.getAttribute("role")||r.tagName.toLowerCase();Xe(`${a}, ${s}`)},100)}))}function He(e){let t=e.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[role="button"]');if(t.length===0)return;let o=t[0],r=t[t.length-1];o.focus(),e.addEventListener("keydown",a=>{a.key==="Tab"&&(a.shiftKey?document.activeElement===o&&(a.preventDefault(),r.focus()):document.activeElement===r&&(a.preventDefault(),o.focus()))})}function hn(){if(typeof document>"u")return;if(ie){ie.remove(),ie=null;return}let e=document.createElement("div");e.setAttribute("role","dialog"),e.setAttribute("aria-label","Keyboard shortcuts"),e.setAttribute("aria-modal","true"),e.setAttribute("data-yuktai-cheatsheet","true"),e.style.cssText=`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999999;
    background: #1a1a2e;
    color: #fff;
    border-radius: 12px;
    padding: 24px;
    width: min(320px, calc(100vw - 32px));
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    font-family: system-ui, sans-serif;
  `;let t=[["Alt + A","Open/close this menu"],["Tab","Next focusable element"],["Shift+Tab","Previous focusable element"],["Enter","Activate button or link"],["Space","Check checkbox / scroll"],["Arrow keys","Navigate lists and menus"],["Escape","Close dialog or menu"],["Home","First item in list"],["End","Last item in list"]];e.innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <h2 style="margin:0;font-size:16px;font-weight:700;color:#74c0fc">
        \u2328 Keyboard shortcuts
      </h2>
      <button data-yuktai-close
        style="background:none;border:none;color:#aaa;cursor:pointer;font-size:20px;padding:0;line-height:1"
        aria-label="Close shortcuts">\xD7</button>
    </div>
    ${t.map(([r,a])=>`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #2a2a4a">
        <kbd style="background:#2a2a4a;color:#74c0fc;padding:3px 8px;border-radius:4px;font-size:12px;font-family:monospace;border:1px solid #3a3a6a">${r}</kbd>
        <span style="font-size:12px;color:#ccc;text-align:right;flex:1;margin-left:12px">${a}</span>
      </div>
    `).join("")}
  `,e.querySelector("[data-yuktai-close]")?.addEventListener("click",()=>{e.remove(),ie=null}),e.addEventListener("keydown",r=>{r.key==="Escape"&&(e.remove(),ie=null)}),document.body.appendChild(e),ie=e,He(e),E("Keyboard shortcuts opened. Press Escape to close.","info")}function xn(e){if(typeof document>"u"||!se?.showAuditBadge||typeof window<"u"&&!window.location.hostname.includes("localhost")&&!window.location.hostname.includes("127.0.0.1"))return;Ue&&Ue.remove();let t=e.score,o=t>=90?"#0f9d58":t>=70?"#f29900":"#d93025",r=t>=90?"\u267F":t>=70?"\u26A0":"\u2715",a=document.createElement("button");a.setAttribute("aria-label",`Accessibility score: ${t} out of 100`),a.setAttribute("data-yuktai-badge","true"),a.style.cssText=`
    position: fixed;
    bottom: 16px;
    left: 16px;
    z-index: 999998;
    background: ${o};
    color: #fff;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 700;
    font-family: system-ui, sans-serif;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    gap: 6px;
    transition: transform 0.15s;
  `,a.innerHTML=`${r} ${t}/100 <span style="font-weight:400;opacity:0.85">${e.details.length} issues</span>`,a.addEventListener("click",()=>vn(e)),document.body.appendChild(a),Ue=a}function vn(e){let t=document.querySelector("[data-yuktai-audit-details]");if(t){t.remove();return}let o=document.createElement("div");o.setAttribute("data-yuktai-audit-details","true"),o.setAttribute("role","dialog"),o.setAttribute("aria-label","Accessibility audit details"),o.style.cssText=`
    position: fixed;
    bottom: 56px;
    left: 16px;
    right: 16px;
    z-index: 999999;
    background: #1a1a2e;
    color: #fff;
    border-radius: 12px;
    padding: 16px;
    width: auto;
    max-width: 340px;
    max-height: 60vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    font-family: system-ui, sans-serif;
    font-size: 12px;
  `;let r={critical:"#d93025",serious:"#f29900",moderate:"#1a73e8",minor:"#0f9d58"};o.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <strong style="font-size:14px;color:#74c0fc">Audit report</strong>
      <span style="color:#aaa">${e.fixed} fixed \xB7 ${e.renderTime}ms</span>
    </div>
    ${e.details.slice(0,20).map(a=>`
      <div style="padding:6px 0;border-bottom:1px solid #2a2a4a">
        <div style="display:flex;gap:6px;align-items:center">
          <span style="background:${r[a.severity]};color:#fff;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:700;text-transform:uppercase">${a.severity}</span>
          <code style="color:#74c0fc">&lt;${a.tag}&gt;</code>
        </div>
        <div style="color:#ccc;margin-top:3px">${a.fix}</div>
      </div>
    `).join("")}
    ${e.details.length>20?`<div style="color:#888;padding:8px 0;text-align:center">+${e.details.length-20} more issues</div>`:""}
  `,o.addEventListener("keydown",a=>{a.key==="Escape"&&o.remove()}),document.body.appendChild(o),He(o)}function Xt(e){typeof document>"u"||(Ye&&clearTimeout(Ye),Ye=setTimeout(()=>{if(Ne)return;let t=document.createElement("div");t.setAttribute("role","alertdialog"),t.setAttribute("aria-label","Session timeout warning"),t.setAttribute("aria-modal","true"),t.setAttribute("data-yuktai-timeout","true"),t.style.cssText=`
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 999999;
      background: #fff;
      color: #111;
      border-radius: 12px;
      padding: 24px;
      width: min(320px, calc(100vw - 32px));
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
      font-family: system-ui, sans-serif;
      border: 2px solid #d93025;
    `,t.innerHTML=`
      <h2 style="margin:0 0 8px;font-size:18px;color:#d93025">\u23F1 Session timeout</h2>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.5;color:#444">
        Your session will expire soon. Do you need more time?
      </p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button data-yuktai-extend
          style="flex:1;min-width:120px;padding:10px;background:#1a73e8;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600">
          Yes, more time
        </button>
        <button data-yuktai-dismiss
          style="flex:1;min-width:120px;padding:10px;background:#f1f3f4;color:#111;border:none;border-radius:8px;cursor:pointer;font-size:14px">
          No, sign out
        </button>
      </div>
    `;let o=t.querySelector("[data-yuktai-extend]"),r=t.querySelector("[data-yuktai-dismiss]");o?.addEventListener("click",()=>{t.remove(),Ne=null,E("Session extended. You have more time.","success"),se?.timeoutWarning&&Xt(se.timeoutWarning)}),r?.addEventListener("click",()=>{t.remove(),Ne=null}),document.body.appendChild(t),Ne=t,He(t),E("Warning: Your session will expire soon. Do you need more time?","warning")},e*1e3))}function wn(e){if(typeof document>"u")return;let t=document.documentElement;if(t.toggleAttribute("data-yuktai-high-contrast",!!e.highContrast),t.toggleAttribute("data-yuktai-dark",!!e.darkMode),t.toggleAttribute("data-yuktai-reduce-motion",!!e.reduceMotion),t.toggleAttribute("data-yuktai-large-targets",!!e.largeTargets),t.toggleAttribute("data-yuktai-keyboard",!!e.keyboardHints),t.toggleAttribute("data-yuktai-dyslexia",!!e.dyslexiaFont),e.localFont?document.body.style.fontFamily=`"${e.localFont}", system-ui, sans-serif`:e.dyslexiaFont||(document.body.style.fontFamily=""),e.fontSizeMultiplier&&e.fontSizeMultiplier!==1?document.documentElement.style.fontSize=`${e.fontSizeMultiplier*100}%`:document.documentElement.style.fontSize="",e.colorBlindMode&&e.colorBlindMode!=="none"){let o=e.colorBlindMode==="achromatopsia"?"grayscale(100%)":`url(#${ze[e.colorBlindMode]})`;document.body.style.filter=o}else document.body.style.filter=""}function kn(e){try{let t=localStorage.getItem("yuktai-a11y-prefs");t&&Object.assign(e,JSON.parse(t))}catch{}}async function Dt(e){if(e){if(!await _e()){E("Plain English requires Chrome 127+","warning");return}E("Rewriting page in plain English...","info",!1);let o=await Ct();E(o.error?`Plain English failed: ${o.error}`:`${o.fixed} sections rewritten in plain English`,o.error?"error":"success",!1)}else Lt(),E("Original text restored","info",!1)}async function qt(e){if(e){if(!await Ge()){E("Page summariser requires Chrome 127+","warning");return}E("Generating page summary...","info",!1);let o=await Rt();E(o.error?`Summary failed: ${o.error}`:"Page summary added at top",o.error?"error":"success",!1)}else Me(),E("Page summary removed","info",!1)}async function jt(e){if(e==="en"){De(),E("Page restored to English","info",!1);return}E(`Translating page to ${e}...`,"info",!1);let t=await Pt(e);E(t.error?`Translation failed: ${t.error}`:`Page translated to ${e}`,t.error?"error":"success",!1)}async function Vt(e){if(e){if(!qe()){E("Voice control not supported in this browser","warning");return}zt(t=>{t.success&&E(`Voice: ${t.action}`,"info",!1)}),E("Voice control started. Say a command.","success",!1)}else je(),E("Voice control stopped","info",!1)}async function Ut(e){if(e){if(!await Ve()){E("Smart labels requires Chrome 127+","warning");return}E("Generating smart labels...","info",!1);let o=await Ot();E(o.error?`Smart labels failed: ${o.error}`:`${o.fixed} elements labelled`,o.error?"error":"success",!1)}else Wt(),E("Smart labels removed","info",!1)}function Sn(){if(typeof document>"u"||Fe)return;let e=document.createElement("div");e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e.setAttribute("aria-relevant","text"),e.style.cssText="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);",document.body.appendChild(e),Fe=e}function An(){if(typeof document>"u"||Bt)return;let e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("aria-hidden","true"),e.style.cssText="position:absolute;width:0;height:0;overflow:hidden;",e.innerHTML=`
    <defs>
      <filter id="${ze.deuteranopia}">
        <feColorMatrix type="matrix"
          values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${ze.protanopia}">
        <feColorMatrix type="matrix"
          values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${ze.tritanopia}">
        <feColorMatrix type="matrix"
          values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"/>
      </filter>
    </defs>
  `,document.body.appendChild(e),Bt=e}function Yt(e){let t={critical:20,serious:10,moderate:5,minor:2},o=e.details.reduce((r,a)=>r+(t[a.severity]||0),0);return Math.max(0,Math.min(100,100-o))}var j={name:"yuktai-a11y",version:"4.0.0",observer:null,async execute(e){if(!e.enabled)return this.stopObserver(),"yuktai: disabled.";se=e,kn(e),Sn(),An(),bn(),yn(),e.showSkipLinks!==!1&&gn(),e.showPreferencePanel,wn(e);let t=this.applyFixes(e);t.score=Yt(t),e.showAuditBadge&&xn(t),e.timeoutWarning&&Xt(e.timeoutWarning),e.autoFix&&this.startObserver(e),e.plainEnglish&&await Dt(!0),e.summarisePage&&await qt(!0),e.translateLanguage&&e.translateLanguage!=="en"&&await jt(e.translateLanguage),e.voiceControl&&await Vt(!0),e.smartLabels&&await Ut(!0);let o=`${t.fixed} fixes applied. Score: ${t.score}/100.`;return E(o,t.score>=90?"success":"info",!1),`yuktai v4.0.0: ${o} Scanned ${t.scanned} elements in ${t.renderTime}ms.`},applyFixes(e){let t={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return t;let o=performance.now(),r=document.querySelectorAll("*");t.scanned=r.length;let a=(s,n,i,c)=>{t.details.push({tag:s,fix:n,severity:i,element:c.outerHTML.slice(0,100)}),t.fixed++};return r.forEach(s=>{let n=s,i=n.tagName.toLowerCase();if(i==="html"&&!n.getAttribute("lang")&&(n.setAttribute("lang","en"),a(i,'lang="en" added',"critical",n)),i==="meta"){let d=n.getAttribute("name"),b=n.getAttribute("content")||"";d==="viewport"&&b.includes("user-scalable=no")&&(n.setAttribute("content",b.replace("user-scalable=no","user-scalable=yes")),a(i,"user-scalable=yes restored","serious",n)),d==="viewport"&&/maximum-scale=1(?:[^0-9]|$)/.test(b)&&(n.setAttribute("content",b.replace(/maximum-scale=1(?=[^0-9]|$)/,"maximum-scale=5")),a(i,"maximum-scale=5 restored","serious",n))}if(i==="main"&&!n.getAttribute("tabindex")&&(n.setAttribute("tabindex","-1"),n.getAttribute("id")||n.setAttribute("id","main-content")),i==="img"&&(n.hasAttribute("alt")||(n.setAttribute("alt",""),n.setAttribute("aria-hidden","true"),a(i,'alt="" aria-hidden="true"',"serious",n))),i==="svg"&&(!n.getAttribute("aria-hidden")&&!n.getAttribute("aria-label")&&!s.querySelector("title")&&(n.setAttribute("aria-hidden","true"),a(i,'aria-hidden="true" (decorative svg)',"minor",n)),n.getAttribute("focusable")||n.setAttribute("focusable","false")),i==="iframe"&&!n.getAttribute("title")&&!n.getAttribute("aria-label")&&(n.setAttribute("title","embedded content"),n.setAttribute("aria-label","embedded content"),a(i,"title + aria-label added","serious",n)),i==="button"){if(!n.innerText?.trim()&&!n.getAttribute("aria-label")){let d=n.getAttribute("title")||"button";n.setAttribute("aria-label",d),a(i,`aria-label="${d}" (empty button)`,"critical",n)}n.hasAttribute("disabled")&&!n.getAttribute("aria-disabled")&&(n.setAttribute("aria-disabled","true"),t.fixed++)}if(i==="a"){let d=n;!n.innerText?.trim()&&!n.getAttribute("aria-label")&&(n.setAttribute("aria-label",n.getAttribute("title")||"link"),a(i,"aria-label added (empty link)","critical",n)),d.target==="_blank"&&!d.rel?.includes("noopener")&&(d.rel="noopener noreferrer",t.fixed++)}if(Gt.has(i)){let d=n;if(!n.getAttribute("aria-label")&&!n.getAttribute("aria-labelledby")){let b=n.getAttribute("placeholder")||n.getAttribute("name")||i;n.setAttribute("aria-label",b),a(i,`aria-label="${b}"`,"serious",n)}if(n.hasAttribute("required")&&!n.getAttribute("aria-required")&&(n.setAttribute("aria-required","true"),t.fixed++),i==="input"&&!d.autocomplete){let b=d.name||"";d.type==="email"||b.includes("email")?d.autocomplete="email":d.type==="tel"||b.includes("tel")?d.autocomplete="tel":d.type==="password"&&(d.autocomplete="current-password"),t.fixed++}}i==="th"&&!n.getAttribute("scope")&&(n.setAttribute("scope",n.closest("thead")?"col":"row"),a(i,"scope added to <th>","moderate",n)),Ke[i]&&!n.getAttribute("role")&&(n.setAttribute("role",Ke[i]),a(i,`role="${Ke[i]}"`,"minor",n));let c=n.getAttribute("role")||"";c==="tab"&&!n.getAttribute("aria-selected")&&(n.setAttribute("aria-selected","false"),t.fixed++),["alert","status","log"].includes(c)&&!n.getAttribute("aria-live")&&(n.setAttribute("aria-live",c==="alert"?"assertive":"polite"),a(i,`aria-live added on role=${c}`,"moderate",n)),c==="combobox"&&!n.getAttribute("aria-expanded")&&(n.setAttribute("aria-expanded","false"),a(i,'aria-expanded="false" on combobox',"serious",n)),(c==="checkbox"||c==="radio")&&!n.getAttribute("aria-checked")&&(n.setAttribute("aria-checked","false"),a(i,`aria-checked="false" on role=${c}`,"serious",n))}),t.renderTime=parseFloat((performance.now()-o).toFixed(2)),t},scan(){let e={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return e;let t=performance.now(),o=document.querySelectorAll("*");e.scanned=o.length;let r=(a,s,n,i)=>e.details.push({tag:a,fix:s,severity:n,element:i.outerHTML.slice(0,100)});return o.forEach(a=>{let s=a,n=s.tagName.toLowerCase();(n==="a"||n==="button")&&!s.innerText?.trim()&&!s.getAttribute("aria-label")&&r(n,"needs aria-label (empty)","critical",s),n==="img"&&!s.hasAttribute("alt")&&r(n,"needs alt text","serious",s),Gt.has(n)&&!s.getAttribute("aria-label")&&!s.getAttribute("aria-labelledby")&&r(n,"needs aria-label","serious",s),n==="iframe"&&!s.getAttribute("title")&&!s.getAttribute("aria-label")&&r(n,"iframe needs title","serious",s)}),e.fixed=e.details.length,e.score=Yt(e),e.renderTime=parseFloat((performance.now()-t).toFixed(2)),e},startObserver(e){this.observer||typeof document>"u"||(this.observer=new MutationObserver(()=>this.applyFixes(e)),this.observer.observe(document.body,{childList:!0,subtree:!0,attributes:!1}))},stopObserver(){this.observer?.disconnect(),this.observer=null},announce:E,speak:Xe,showVisualAlert:Kt,trapFocus:He,handlePlainEnglish:Dt,handleSummarisePage:qt,handleTranslate:jt,handleVoiceControl:Vt,handleSmartLabels:Ut,SUPPORTED_LANGUAGES:Re};m();m();var v=Be(require("react"));m();var D=require("react");Je();ge();var l=require("react/jsx-runtime"),ot={highContrast:!1,reduceMotion:!1,autoFix:!0,dyslexiaFont:!1,fontScale:100,localFont:"",darkMode:!1,largeTargets:!1,speechEnabled:!1,colorBlindMode:"none",showAuditBadge:!1,timeoutWarning:void 0,plainEnglish:!1,summarisePage:!1,translateLanguage:"en",voiceControl:!1,smartLabels:!1},ce=[80,90,100,110,120,130],zn=[{value:"none",label:"None"},{value:"deuteranopia",label:"Deuteranopia"},{value:"protanopia",label:"Protanopia"},{value:"tritanopia",label:"Tritanopia"},{value:"achromatopsia",label:"Greyscale"}],Fn=["Prompt API for Gemini Nano","Summarization API for Gemini Nano","Writer API for Gemini Nano","Rewriter API for Gemini Nano","Translation API"];function Hn(){let[e,t]=(0,D.useState)(typeof window<"u"?window.innerWidth:1024);return(0,D.useEffect)(()=>{let o=()=>t(window.innerWidth);return window.addEventListener("resize",o),()=>window.removeEventListener("resize",o)},[]),{isMobile:e<=480,isTablet:e>480&&e<=768}}function $n({checked:e,onChange:t,label:o,disabled:r=!1}){return(0,l.jsxs)("label",{"aria-label":o,style:{position:"relative",display:"inline-flex",width:"40px",height:"24px",cursor:r?"not-allowed":"pointer",flexShrink:0,opacity:r?.4:1},children:[(0,l.jsx)("input",{type:"checkbox",checked:e,disabled:r,onChange:a=>t(a.target.checked),style:{opacity:0,width:0,height:0,position:"absolute"}}),(0,l.jsx)("span",{style:{position:"absolute",inset:0,borderRadius:"99px",background:e?"#0d9488":"#cbd5e1",transition:"background 0.2s"}}),(0,l.jsx)("span",{style:{position:"absolute",top:"3px",left:e?"19px":"3px",width:"18px",height:"18px",background:"#fff",borderRadius:"50%",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)",pointerEvents:"none"}})]})}function de({label:e,color:t="#64748b",badge:o,concept:r}){return(0,l.jsxs)("div",{style:{margin:"10px 18px 4px"},children:[(0,l.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[(0,l.jsx)("p",{style:{margin:0,fontSize:"10px",fontWeight:600,color:t,letterSpacing:"0.06em",textTransform:"uppercase"},children:e}),o&&(0,l.jsx)("span",{style:{fontSize:"9px",fontWeight:500,padding:"1px 7px",borderRadius:"99px",background:"#f5f3ff",color:"#7c3aed",border:"0.5px solid #c4b5fd",whiteSpace:"nowrap"},children:o})]}),r&&(0,l.jsx)("p",{style:{margin:"2px 0 0",fontSize:"9px",color:"#94a3b8",fontStyle:"italic"},children:r})]})}function K({icon:e,label:t,desc:o,checked:r,onChange:a,disabled:s=!1,disabledReason:n,tip:i}){return(0,l.jsxs)("div",{title:s?n:i,style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 18px",gap:"12px"},children:[(0,l.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"10px",flex:1,minWidth:0},children:[(0,l.jsx)("span",{"aria-hidden":"true",style:{width:"32px",height:"32px",borderRadius:"8px",background:s?"#f1f5f9":"#f0fdfa",color:s?"#94a3b8":"#0d9488",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"15px",flexShrink:0,fontWeight:700},children:e}),(0,l.jsxs)("div",{style:{minWidth:0},children:[(0,l.jsx)("p",{style:{margin:0,fontSize:"13px",fontWeight:500,color:s?"#94a3b8":"#0f172a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:t}),(0,l.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#94a3b8"},children:s?n:o})]})]}),(0,l.jsx)($n,{checked:r,onChange:a,label:`Toggle ${t}`,disabled:s})]})}function G(){return(0,l.jsx)("div",{style:{height:"1px",background:"#f1f5f9"}})}function be({steps:e}){return(0,l.jsxs)("div",{style:{margin:"0 18px 8px",padding:"8px 10px",background:"#f8fafc",borderRadius:"8px",border:"0.5px solid #e2e8f0"},children:[(0,l.jsx)("p",{style:{margin:"0 0 4px",fontSize:"9px",fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.05em"},children:"How to use"}),e.map((t,o)=>(0,l.jsxs)("p",{style:{margin:"0 0 2px",fontSize:"10px",color:"#475569"},children:[o+1,". ",t]},o))]})}var nt=(0,D.forwardRef)(({position:e,settings:t,report:o,isActive:r,aiSupported:a,voiceSupported:s,set:n,onApply:i,onReset:c,onClose:d},b)=>{let{isMobile:u,isTablet:N}=Hn(),[P,_]=(0,D.useState)([]),[M,w]=(0,D.useState)(""),[H,T]=(0,D.useState)(""),[h,$]=(0,D.useState)(!1),[S,R]=(0,D.useState)(null),[x,F]=(0,D.useState)("idle");(0,D.useEffect)(()=>{let p=window;!!(p.LanguageModel||p.ai?.languageModel)&&a?R("gemini"):fe()&&R("transformers")},[a]),(0,D.useEffect)(()=>{if(S!=="transformers")return;let p=setInterval(()=>{F(me())},500);return()=>clearInterval(p)},[S]);let C=async()=>{if(!(!M.trim()||h)){if(!S){T("\u26A0\uFE0F No AI engine available on this device.");return}$(!0),T("");try{let p;S==="gemini"?p=await Ze(M):(F("loading"),p=await et(M),F("ready")),T(p.success&&p.answer?p.answer.replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/#+\s/g,"").trim():"\u26A0\uFE0F "+(p.error||"No answer found on this page"))}catch{T("\u26A0\uFE0F Failed to get answer. Please try again.")}$(!1)}};(0,D.useEffect)(()=>{(async()=>{try{let X=window;if(!X.queryLocalFonts)return;let Q=await X.queryLocalFonts(),Z=[...new Set(Q.map(pe=>pe.family))].sort();_(Z.slice(0,50))}catch{}})()},[]);let k=S==="gemini"?"Gemini Nano":S==="transformers"?"Transformers.js \xB7 All devices":"Detecting...",q=S==="transformers"&&x==="loading"?"Loading AI model... (first time only)":"...",V=u?{position:"fixed",bottom:0,left:0,right:0,zIndex:9999,background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px 16px 0 0",boxShadow:"0 -8px 32px rgba(0,0,0,0.12)",maxHeight:"90vh",overflowY:"auto",fontFamily:"system-ui,-apple-system,sans-serif",width:"100%"}:{position:"fixed",bottom:"84px",[e]:"24px",zIndex:9999,width:N?"300px":"320px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",maxHeight:"80vh",overflowY:"auto",fontFamily:"system-ui,-apple-system,sans-serif"};return(0,l.jsxs)("div",{ref:b,role:"dialog","aria-modal":"true","aria-label":"yuktai accessibility preferences","data-yuktai-panel":"true",style:V,children:[(0,l.jsxs)("div",{style:{padding:"14px 18px 12px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"flex-start",justifyContent:"space-between",position:"sticky",top:0,background:"#fff",zIndex:1},children:[(0,l.jsxs)("div",{children:[(0,l.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"7px",marginBottom:"4px",flexWrap:"wrap"},children:[(0,l.jsx)("span",{style:{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0d9488",letterSpacing:"0.05em",fontFamily:"monospace"},children:"@yuktishaalaa/yuktai"}),r&&(0,l.jsx)("span",{style:{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0f766e",border:"1px solid #99f6e4"},children:"\u25CF ACTIVE"})]}),(0,l.jsx)("p",{style:{margin:"0 0 1px",fontSize:"15px",fontWeight:600,color:"#0f172a"},children:"Accessibility"}),(0,l.jsx)("p",{style:{margin:0,fontSize:"11px",color:"#64748b"},children:"WCAG 2.2 \xB7 Open source \xB7 Zero cost \xB7 All devices"})]}),(0,l.jsx)("button",{onClick:d,"aria-label":"Close accessibility panel",style:{background:"none",border:"none",cursor:"pointer",padding:"4px",color:"#94a3b8",fontSize:"20px",lineHeight:1,borderRadius:"6px",flexShrink:0,minWidth:u?"44px":"auto",minHeight:u?"44px":"auto",display:"flex",alignItems:"center",justifyContent:"center"},children:"\xD7"})]}),(0,l.jsx)(de,{label:"\u267F Core Accessibility",concept:"Rule-based engine \u2014 works on all browsers and devices"}),(0,l.jsx)(be,{steps:["Toggle any feature on","Click Apply settings","Preferences saved automatically"]}),(0,l.jsx)(K,{icon:"\u{1F527}",label:"Auto-fix ARIA",desc:"Injects missing labels and roles automatically",checked:t.autoFix,onChange:p=>n("autoFix",p),tip:"Fixes aria-label, alt text, roles on every element"}),(0,l.jsx)(G,{}),(0,l.jsx)(K,{icon:"\u{1F50A}",label:"Speak on focus",desc:"Browser reads elements aloud as you tab",checked:t.speechEnabled,onChange:p=>n("speechEnabled",p),tip:"Uses browser SpeechSynthesis \u2014 no install needed"}),(0,l.jsx)(G,{}),(0,l.jsx)(K,{icon:"\u{1F399}\uFE0F",label:"Voice control",desc:"Say commands to navigate the page",checked:t.voiceControl,onChange:p=>n("voiceControl",p),disabled:!s,disabledReason:"Not supported in this browser",tip:'Say "scroll down", "go to main", "click"'}),(0,l.jsx)(G,{}),(0,l.jsx)(de,{label:"\u{1F916} AI Features",color:"#7c3aed",badge:"Gemini Nano",concept:"Large Language Model running privately on your device \u2014 Chrome 127+ only"}),(0,l.jsx)("div",{style:{margin:"4px 18px 6px",padding:"8px 10px",background:a?"#f0fdfa":"#f5f3ff",borderRadius:"8px",border:`0.5px solid ${a?"#99f6e4":"#c4b5fd"}`,fontSize:"10px",color:a?"#0f766e":"#7c3aed",lineHeight:1.5},children:a?"\u2705 Gemini Nano detected \u2014 AI features ready. Runs privately on your device.":"\u2699\uFE0F AI features need one-time setup \u2014 see guide below."}),!a&&(0,l.jsxs)("div",{style:{margin:"0 18px 8px",padding:"10px 12px",background:"#fafafa",borderRadius:"8px",border:"0.5px solid #e2e8f0",fontSize:"11px",color:"#475569",lineHeight:1.7},children:[(0,l.jsx)("p",{style:{margin:"0 0 6px",fontWeight:600,color:"#0f172a",fontSize:"11px"},children:"\u{1F6E0} One-time setup \u2014 5 steps:"}),(0,l.jsxs)("p",{style:{margin:"0 0 3px"},children:["1. Open Chrome \u2192 ",(0,l.jsx)("code",{style:{background:"#f1f5f9",padding:"1px 5px",borderRadius:"4px",fontSize:"10px",color:"#0d9488",fontFamily:"monospace"},children:"chrome://flags"})]}),(0,l.jsx)("p",{style:{margin:"0 0 3px"},children:"2. Enable each flag:"}),(0,l.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"2px",margin:"4px 0 6px 10px"},children:Fn.map(p=>(0,l.jsxs)("span",{style:{fontSize:"10px",color:"#7c3aed",fontFamily:"monospace"},children:["\u2192 ",p]},p))}),(0,l.jsxs)("p",{style:{margin:"0 0 3px"},children:["3. Click ",(0,l.jsx)("strong",{style:{color:"#0f172a"},children:"Relaunch"})]}),(0,l.jsxs)("p",{style:{margin:"0 0 3px"},children:["4. ",(0,l.jsx)("code",{style:{background:"#f1f5f9",padding:"1px 5px",borderRadius:"4px",fontSize:"10px",color:"#0d9488",fontFamily:"monospace"},children:"chrome://components"})," \u2192 Optimization Guide On Device Model \u2192 Check for update"]}),(0,l.jsx)("p",{style:{margin:"0"},children:"5. Refresh \u2014 AI features unlock automatically \u2705"})]}),(0,l.jsx)(K,{icon:"\u{1F4DD}",label:"Plain English mode",desc:"Rewrites complex text in simple language",checked:t.plainEnglish,onChange:p=>n("plainEnglish",p),disabled:!a,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: LLM text rewriting"}),(0,l.jsx)(G,{}),(0,l.jsx)(K,{icon:"\u{1F4CB}",label:"Summarise page",desc:"3-sentence summary appears at top",checked:t.summarisePage,onChange:p=>n("summarisePage",p),disabled:!a,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: Abstractive summarisation"}),(0,l.jsx)(G,{}),(0,l.jsx)(K,{icon:"\u{1F3F7}\uFE0F",label:"Smart aria-labels",desc:"AI generates meaningful labels for elements",checked:t.smartLabels,onChange:p=>n("smartLabels",p),disabled:!a,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: Context-aware label generation"}),(0,l.jsx)(G,{}),(0,l.jsx)(de,{label:"\u{1F441}\uFE0F Visual",concept:"CSS filter-based \u2014 works on all browsers and devices"}),(0,l.jsx)(be,{steps:["Toggle any visual mode","Changes apply instantly","Works on mobile and desktop"]}),(0,l.jsx)(K,{icon:"\u25D1",label:"High contrast",desc:"Boosts contrast for low vision users",checked:t.highContrast,onChange:p=>n("highContrast",p),tip:"CSS filter: contrast()"}),(0,l.jsx)(G,{}),(0,l.jsx)(K,{icon:"\u{1F319}",label:"Dark mode",desc:"Inverts colours \u2014 easy on eyes at night",checked:t.darkMode,onChange:p=>n("darkMode",p),tip:"CSS filter: invert + hue-rotate"}),(0,l.jsx)(G,{}),(0,l.jsx)(K,{icon:"\u23F8\uFE0F",label:"Reduce motion",desc:"Disables all animations",checked:t.reduceMotion,onChange:p=>n("reduceMotion",p),tip:"WCAG 2.3.3 \u2014 vestibular disorders"}),(0,l.jsx)(G,{}),(0,l.jsx)(K,{icon:"\u{1F446}",label:"Large targets",desc:"44\xD744px minimum touch targets",checked:t.largeTargets,onChange:p=>n("largeTargets",p),tip:"WCAG 2.5.8 \u2014 motor impaired users"}),(0,l.jsx)(G,{}),(0,l.jsxs)("div",{style:{padding:"10px 18px"},children:[(0,l.jsx)("p",{style:{margin:"0 0 2px",fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F3A8} Colour blindness"}),(0,l.jsx)("p",{style:{margin:"0 0 8px",fontSize:"10px",color:"#94a3b8"},children:"SVG colour matrix filters \u2014 all devices"}),(0,l.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"},children:zn.map(p=>(0,l.jsx)("button",{onClick:()=>n("colorBlindMode",p.value),"aria-pressed":t.colorBlindMode===p.value,style:{padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500,border:`1px solid ${t.colorBlindMode===p.value?"#0d9488":"#e2e8f0"}`,background:t.colorBlindMode===p.value?"#f0fdfa":"#fff",color:t.colorBlindMode===p.value?"#0d9488":"#64748b",cursor:"pointer",minHeight:u?"36px":"auto"},children:p.label},p.value))})]}),(0,l.jsx)(G,{}),(0,l.jsx)(de,{label:"\u{1F524} Font",concept:"Browser Font API + CSS \u2014 Chrome 103+"}),(0,l.jsx)(be,{steps:["Toggle dyslexia font or pick from device","Adjust size with + / \u2212","Saved across visits"]}),(0,l.jsx)(K,{icon:"Aa",label:"Dyslexia-friendly font",desc:"Atkinson Hyperlegible \u2014 research-backed",checked:t.dyslexiaFont,onChange:p=>n("dyslexiaFont",p),tip:"By Braille Institute \u2014 free and open source"}),(0,l.jsx)(G,{}),(0,l.jsxs)("div",{style:{padding:"10px 18px"},children:[(0,l.jsx)("p",{style:{margin:"0 0 2px",fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F5A5}\uFE0F Local font"}),(0,l.jsx)("p",{style:{margin:"0 0 8px",fontSize:"10px",color:"#94a3b8"},children:"window.queryLocalFonts() \u2014 Chrome 103+"}),P.length>0?(0,l.jsxs)("select",{value:t.localFont,onChange:p=>n("localFont",p.target.value),"aria-label":"Choose a font from your device",style:{width:"100%",padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"13px",color:"#0f172a",background:"#fff",cursor:"pointer",height:u?"44px":"36px"},children:[(0,l.jsx)("option",{value:"",children:"System default"}),P.map(p=>(0,l.jsx)("option",{value:p,style:{fontFamily:p},children:p},p))]}):(0,l.jsx)("p",{style:{margin:0,fontSize:"11px",color:"#94a3b8"},children:"Allow font access when Chrome prompts you."})]}),(0,l.jsx)(G,{}),(0,l.jsxs)("div",{style:{padding:"10px 18px 14px"},children:[(0,l.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"10px"},children:[(0,l.jsxs)("div",{children:[(0,l.jsx)("p",{style:{margin:0,fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F4CF} Text size"}),(0,l.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#94a3b8"},children:"Scales all text on the page"})]}),(0,l.jsxs)("span",{style:{fontSize:"12px",fontWeight:600,color:"#0d9488",background:"#f0fdfa",padding:"2px 8px",borderRadius:"99px"},children:[t.fontScale,"%"]})]}),(0,l.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[(0,l.jsx)("button",{onClick:()=>{let p=ce.indexOf(t.fontScale);p>0&&n("fontScale",ce[p-1])},disabled:t.fontScale<=80,"aria-label":"Decrease text size",style:{width:u?"44px":"30px",height:u?"44px":"30px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:t.fontScale<=80?"not-allowed":"pointer",fontSize:"16px",color:t.fontScale<=80?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"\u2212"}),(0,l.jsx)("div",{style:{flex:1,display:"flex",gap:"3px"},children:ce.map(p=>(0,l.jsx)("button",{onClick:()=>n("fontScale",p),"aria-label":`Set text size to ${p}%`,style:{flex:1,height:"6px",borderRadius:"99px",border:"none",cursor:"pointer",padding:0,background:p<=t.fontScale?"#0d9488":"#e2e8f0",transition:"background 0.15s"}},p))}),(0,l.jsx)("button",{onClick:()=>{let p=ce.indexOf(t.fontScale);p<ce.length-1&&n("fontScale",ce[p+1])},disabled:t.fontScale>=130,"aria-label":"Increase text size",style:{width:u?"44px":"30px",height:u?"44px":"30px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:t.fontScale>=130?"not-allowed":"pointer",fontSize:"16px",color:t.fontScale>=130?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"+"})]})]}),(0,l.jsx)(G,{}),(0,l.jsx)(de,{label:"\u{1F310} Translate",color:"#7c3aed",badge:"Gemini Nano",concept:"Chrome Translation API \u2014 on device, no internet after setup"}),(0,l.jsx)(be,{steps:["Enable Gemini Nano first","Pick your language","Full page translates instantly"]}),(0,l.jsxs)("div",{style:{padding:"6px 18px 12px"},children:[(0,l.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"},children:Re.slice(0,u?8:18).map(p=>(0,l.jsx)("button",{onClick:()=>n("translateLanguage",p.code),"aria-pressed":t.translateLanguage===p.code,disabled:!a,style:{padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500,border:`1px solid ${t.translateLanguage===p.code?"#7c3aed":"#e2e8f0"}`,background:t.translateLanguage===p.code?"#f5f3ff":"#fff",color:t.translateLanguage===p.code?"#7c3aed":"#64748b",cursor:a?"pointer":"not-allowed",opacity:a?1:.5,minHeight:u?"36px":"auto"},children:p.label},p.code))}),!a&&(0,l.jsx)("p",{style:{margin:"6px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Enable Gemini Nano using the setup guide above."})]}),(0,l.jsx)(G,{}),(0,l.jsx)(de,{label:"\u{1F4AC} Ask This Page",color:"#0d9488",badge:k,concept:"RAG \u2014 Retrieval Augmented Generation. Works on all devices including mobile."}),(0,l.jsx)(be,{steps:["Type any question about this page","Press Ask or hit Enter",S==="transformers"?"Transformers.js answers \u2014 works on mobile, offline":"Gemini Nano reads page and answers privately","Zero cost. No data leaves your device."]}),(0,l.jsxs)("div",{style:{margin:"0 18px 8px",padding:"6px 10px",background:S==="gemini"?"#f0fdfa":S==="transformers"?"#f5f3ff":"#f8fafc",borderRadius:"8px",border:`0.5px solid ${S==="gemini"?"#99f6e4":S==="transformers"?"#c4b5fd":"#e2e8f0"}`,fontSize:"10px",color:S==="gemini"?"#0f766e":S==="transformers"?"#7c3aed":"#94a3b8"},children:[S==="gemini"&&"\u2705 Using Gemini Nano \u2014 on device, private, instant",S==="transformers"&&"\u2705 Using Transformers.js \u2014 works on mobile and all browsers",!S&&"\u23F3 Detecting AI engine...",S==="transformers"&&x==="loading"&&" \xB7 Loading model...",S==="transformers"&&x==="ready"&&" \xB7 Model ready \u2705"]}),(0,l.jsxs)("div",{style:{padding:"0 18px 14px"},children:[(0,l.jsxs)("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[(0,l.jsx)("input",{type:"text",value:M,onChange:p=>w(p.target.value),onKeyDown:p=>{p.key==="Enter"&&C()},placeholder:"e.g. What does this page do?",disabled:h||!S,"aria-label":"Ask a question about this page",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:S?"#fff":"#f8fafc",outline:"none",height:u?"44px":"36px"}}),(0,l.jsx)("button",{onClick:C,disabled:h||!M.trim()||!S,"aria-label":"Ask question",style:{padding:"8px 14px",borderRadius:"8px",border:"none",background:S&&M.trim()&&!h?"#0d9488":"#e2e8f0",color:S&&M.trim()&&!h?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:S&&M.trim()&&!h?"pointer":"not-allowed",flexShrink:0,height:u?"44px":"36px",minWidth:"52px",transition:"background 0.2s"},children:h?q:"Ask"})]}),H&&(0,l.jsxs)("div",{role:"status","aria-live":"polite",style:{padding:"10px 12px",background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"8px",fontSize:"12px",color:"#0f766e",lineHeight:1.6,maxHeight:"180px",overflowY:"auto"},children:[(0,l.jsx)("strong",{style:{display:"block",marginBottom:"4px",fontSize:"11px",color:"#0d9488"},children:"\u{1F4AC} Answer"}),H,(0,l.jsx)("button",{onClick:()=>{T(""),w("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]})]}),o&&(0,l.jsx)("div",{role:"status",style:{margin:"0 14px 10px",padding:"8px 12px",background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"8px",fontSize:"12px",color:"#0f766e",fontWeight:500,fontFamily:"monospace"},children:o.fixed>0?`\u2713 ${o.fixed} fixes \xB7 ${o.scanned} nodes \xB7 ${o.renderTime}ms \xB7 Score: ${o.score}/100`:`\u2713 0 auto-fixes needed \xB7 ${o.scanned} nodes \xB7 ${o.renderTime}ms`}),(0,l.jsxs)("div",{style:{display:"flex",gap:"8px",padding:"12px 14px 14px",position:u?"sticky":"relative",bottom:u?0:"auto",background:"#fff",borderTop:"1px solid #f1f5f9"},children:[(0,l.jsx)("button",{onClick:c,style:{flex:1,padding:u?"12px 0":"8px 0",fontSize:"13px",fontWeight:500,borderRadius:"9px",border:"1px solid #e2e8f0",background:"#fff",color:"#64748b",cursor:"pointer"},children:"Reset"}),(0,l.jsx)("button",{onClick:i,style:{flex:2,padding:u?"12px 0":"8px 0",fontSize:"13px",fontWeight:600,borderRadius:"9px",border:"none",background:"#0d9488",color:"#fff",cursor:"pointer"},children:"Apply settings"})]})]})});nt.displayName="WidgetPanel";ge();m();var J=require("react");m();var On={hotel:["hotel","resort","motel","inn","accommodation","lodge","stay","room","booking","hospitality"],ecommerce:["shop","store","ecommerce","e-commerce","sell","product","cart","buy","marketplace","retail"],restaurant:["restaurant","food","cafe","cafeteria","menu","dining","eat","cuisine","bistro","takeaway","delivery"],portfolio:["portfolio","freelance","personal","designer","developer","creative","showcase","work","hire me"],blog:["blog","article","post","write","news","magazine","journal","content"],saas:["saas","dashboard","app","software","platform","tool","analytics","admin","manage","crm"],government:["government","govt","portal","citizen","scheme","welfare","municipal","public","official"],healthcare:["hospital","clinic","doctor","health","medical","patient","appointment","pharmacy"],education:["school","college","university","course","learn","education","student","lms","training"],realestate:["real estate","property","house","flat","apartment","rent","buy property","listing"],landing:["landing","startup","launch","product launch","coming soon","waitlist"],generic:[]},Wn={hotel:["home","rooms","booking","about","contact"],ecommerce:["home","products","cart","checkout","about","contact"],restaurant:["home","menu","reservations","about","contact"],portfolio:["home","portfolio","about","contact"],blog:["home","blog","about","contact"],saas:["home","pricing","dashboard","auth","about","contact"],government:["home","services","about","contact","faq"],healthcare:["home","services","booking","team","about","contact"],education:["home","services","pricing","about","contact"],realestate:["home","products","about","contact"],landing:["home","pricing","about","contact"],generic:["home","about","services","contact"]},Bn={home:["home","homepage","main","landing"],about:["about","who we are","our story","company"],contact:["contact","reach us","get in touch","location"],services:["service","what we offer","solution","offering"],pricing:["pricing","price","plan","subscription","cost","fee"],blog:["blog","article","news","post"],auth:["login","register","signup","sign up","sign in","auth","account"],dashboard:["dashboard","admin","panel","manage","analytics"],gallery:["gallery","photo","image","portfolio"],products:["product","shop","store","item","catalogue"],cart:["cart","basket","shopping cart"],checkout:["checkout","payment","pay","order"],rooms:["room","suite","accommodation","stay"],booking:["booking","reserve","reservation","schedule","appointment"],menu:["menu","food","dish","cuisine"],reservations:["reservation","table booking","book table"],portfolio:["portfolio","work","project","case study"],team:["team","staff","member","people","who we are"],faq:["faq","question","answer","help","support"],terms:["terms","condition","legal"],privacy:["privacy","policy","gdpr","data"]},_n={Authentication:["login","register","auth","signup","sign in","account"],Payment:["payment","stripe","pay","checkout","billing"],Search:["search","filter","find"],"Dark mode":["dark mode","dark theme","night mode"],"Multi-language":["multilingual","multi language","translation","i18n"],SEO:["seo","search engine","meta","google"],Analytics:["analytics","tracking","stats","dashboard"],Email:["email","newsletter","contact form","notification"],Map:["map","location","address","google maps"],"Social media":["social","instagram","facebook","twitter","share"],"Image gallery":["gallery","photo","image","carousel"],"Booking system":["booking","reservation","appointment","schedule"],"Shopping cart":["cart","basket","shop","ecommerce"],"Blog/CMS":["blog","cms","content","article","post"]},Gn={blue:["blue","navy","sky","ocean","corporate"],green:["green","nature","eco","environment","health","fresh"],purple:["purple","violet","luxury","creative","royal"],red:["red","bold","energy","passion","food"],orange:["orange","warm","friendly","fun"],teal:["teal","turquoise","modern","tech"],indigo:["indigo","professional","trust","finance","bank"],gray:["gray","minimal","clean","simple","neutral"]},Dn={hotel:"indigo",ecommerce:"blue",restaurant:"red",portfolio:"purple",blog:"gray",saas:"teal",government:"blue",healthcare:"green",education:"indigo",realestate:"orange",landing:"purple",generic:"blue"};function qn(e){let t=[/(?:for|called|named|company|business|brand)\s+["']?([A-Z][a-zA-Z\s]{1,30})["']?/i,/["']([A-Z][a-zA-Z\s]{1,30})["']/,/^([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)?)/m];for(let o of t){let r=e.match(o);if(r?.[1]){let a=r[1].trim();if(a.length>2&&a.length<40)return a}}return"My Business"}function jn(e){let t=e.toLowerCase(),o="generic",r=0;for(let[a,s]of Object.entries(On)){let n=0;for(let i of s)t.includes(i)&&n++;n>r&&(r=n,o=a)}return o}function Vn(e,t){let o=e.toLowerCase(),r=new Set(Wn[t]);for(let[a,s]of Object.entries(Bn))for(let n of s)if(o.includes(n)){r.add(a);break}return r.add("home"),r.add("contact"),Array.from(r)}function Un(e){let t=e.toLowerCase(),o=[];for(let[r,a]of Object.entries(_n))for(let s of a)if(t.includes(s)){o.push(r);break}return o}function Yn(e,t){let o=e.toLowerCase();for(let[r,a]of Object.entries(Gn))for(let s of a)if(o.includes(s))return r;return Dn[t]}function oo(e){let t=jn(e),o=Vn(e,t),r=Un(e),a=Yn(e,t);return{siteName:qn(e),websiteType:t,pages:o,features:r,theme:a,description:e.slice(0,200)}}var g=require("react/jsx-runtime"),Jn=["Hotel booking website for Grand Palace Hotels with rooms, booking and payment","E-commerce store for organic food products with cart and checkout","Restaurant website for Spice Garden with menu and table reservations","Portfolio website for a freelance designer with gallery and contact","SaaS dashboard for project management with pricing and auth","Government portal for citizen services with FAQ and contact"],Qn={home:"\u{1F3E0}",about:"\u2139\uFE0F",contact:"\u{1F4EC}",services:"\u2699\uFE0F",pricing:"\u{1F4B0}",blog:"\u{1F4DD}",auth:"\u{1F510}",dashboard:"\u{1F4CA}",gallery:"\u{1F5BC}\uFE0F",products:"\u{1F6D2}",cart:"\u{1F6CD}\uFE0F",checkout:"\u{1F4B3}",rooms:"\u{1F6CF}\uFE0F",booking:"\u{1F4C5}",menu:"\u{1F37D}\uFE0F",reservations:"\u{1FA91}",portfolio:"\u{1F4BC}",team:"\u{1F465}",faq:"\u2753",terms:"\u{1F4C4}",privacy:"\u{1F512}"},er={hotel:"\u{1F3E8}",ecommerce:"\u{1F6D2}",restaurant:"\u{1F37D}\uFE0F",portfolio:"\u{1F4BC}",blog:"\u{1F4DD}",saas:"\u26A1",government:"\u{1F3DB}\uFE0F",healthcare:"\u{1F3E5}",education:"\u{1F393}",realestate:"\u{1F3E0}",landing:"\u{1F680}",generic:"\u{1F310}"};function at({position:e,onClose:t}){let[o,r]=(0,J.useState)("input"),[a,s]=(0,J.useState)(""),[n,i]=(0,J.useState)(null),[c,d]=(0,J.useState)(0),[b,u]=(0,J.useState)(""),N=(0,J.useCallback)(()=>{if(!a.trim())return;let w=oo(a);i(w),r("preview")},[a]),P=(0,J.useCallback)(async()=>{if(n){r("generating"),d(0),u("");try{let w=[{msg:"Parsing requirement...",pct:15},{msg:"Loading templates...",pct:30},{msg:"Generating pages...",pct:55},{msg:"Building components...",pct:70},{msg:"Creating styles...",pct:85},{msg:"Packaging ZIP...",pct:95}];for(let T of w)d(T.pct),await new Promise(h=>setTimeout(h,200));let{generateZip:H}=await Promise.resolve().then(()=>(Ro(),Io));await H(n),d(100),r("done")}catch(w){u(w instanceof Error?w.message:"Generation failed. Please try again."),r("preview")}}},[n]),_=()=>{r("input"),s(""),i(null),d(0),u("")},M={position:"fixed",bottom:"204px",[e]:"24px",zIndex:9999,width:"340px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.14)",fontFamily:"system-ui,-apple-system,sans-serif",maxHeight:"75vh",overflowY:"auto"};return(0,g.jsxs)("div",{role:"dialog","aria-modal":"true","aria-label":"yuktai Vibe Coder","data-yuktai-panel":"true",style:M,children:[(0,g.jsxs)("div",{style:{padding:"14px 16px 12px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"flex-start",justifyContent:"space-between",position:"sticky",top:0,background:"#fff",zIndex:1},children:[(0,g.jsxs)("div",{children:[(0,g.jsx)("p",{style:{margin:"0 0 2px",fontSize:"13px",fontWeight:700,color:"#0f172a"},children:"\u26A1 Vibe Coder"}),(0,g.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#64748b"},children:"Describe your website \u2192 Download Next.js ZIP"})]}),(0,g.jsx)("button",{onClick:t,"aria-label":"Close vibe coder",style:{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"18px",padding:"2px"},children:"\xD7"})]}),o==="input"&&(0,g.jsxs)("div",{style:{padding:"14px 16px"},children:[(0,g.jsx)("p",{style:{margin:"0 0 10px",fontSize:"11px",color:"#64748b"},children:"Describe your business website in plain English. The plugin will generate a complete Next.js project for you."}),(0,g.jsx)("p",{style:{margin:"0 0 6px",fontSize:"10px",fontWeight:600,color:"#94a3b8",textTransform:"uppercase"},children:"Examples"}),(0,g.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"4px",marginBottom:"12px"},children:Jn.slice(0,3).map(w=>(0,g.jsx)("button",{onClick:()=>s(w),style:{padding:"6px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#f8fafc",color:"#475569",fontSize:"10px",cursor:"pointer",textAlign:"left",lineHeight:1.4},children:w},w))}),(0,g.jsx)("textarea",{value:a,onChange:w=>s(w.target.value),placeholder:"e.g. I need a hotel booking website with rooms, search, and payment for Grand Palace Hotels",rows:4,"aria-label":"Describe your website",style:{width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.5}}),(0,g.jsx)("button",{onClick:N,disabled:!a.trim(),style:{width:"100%",marginTop:"10px",padding:"10px",borderRadius:"8px",border:"none",background:a.trim()?"#f59e0b":"#e2e8f0",color:a.trim()?"#fff":"#94a3b8",fontSize:"13px",fontWeight:700,cursor:a.trim()?"pointer":"not-allowed",transition:"background 0.2s"},children:"Analyse Requirement \u2192"})]}),o==="preview"&&n&&(0,g.jsxs)("div",{style:{padding:"14px 16px"},children:[b&&(0,g.jsxs)("div",{style:{padding:"10px",background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:"8px",marginBottom:"12px",fontSize:"11px",color:"#dc2626"},children:["\u26A0\uFE0F ",b]}),(0,g.jsxs)("div",{style:{background:"#f8fafc",borderRadius:"10px",padding:"12px",marginBottom:"12px"},children:[(0,g.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"},children:[(0,g.jsx)("span",{style:{fontSize:"1.5rem"},children:er[n.websiteType]||"\u{1F310}"}),(0,g.jsxs)("div",{children:[(0,g.jsx)("p",{style:{margin:0,fontSize:"13px",fontWeight:700,color:"#0f172a"},children:n.siteName}),(0,g.jsxs)("p",{style:{margin:0,fontSize:"10px",color:"#64748b",textTransform:"capitalize"},children:[n.websiteType," website \xB7 ",n.theme," theme"]})]})]}),(0,g.jsxs)("p",{style:{margin:"8px 0 6px",fontSize:"10px",fontWeight:600,color:"#94a3b8",textTransform:"uppercase"},children:["Pages to generate (",n.pages.length,")"]}),(0,g.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"4px"},children:n.pages.map(w=>(0,g.jsxs)("span",{style:{padding:"2px 8px",borderRadius:"99px",background:"#f0fdf4",border:"1px solid #86efac",fontSize:"10px",color:"#166534",fontWeight:500},children:[Qn[w]||"\u{1F4C4}"," ",w]},w))}),n.features.length>0&&(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)("p",{style:{margin:"10px 0 6px",fontSize:"10px",fontWeight:600,color:"#94a3b8",textTransform:"uppercase"},children:"Detected features"}),(0,g.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"4px"},children:n.features.map(w=>(0,g.jsx)("span",{style:{padding:"2px 8px",borderRadius:"99px",background:"#f5f3ff",border:"1px solid #c4b5fd",fontSize:"10px",color:"#7c3aed",fontWeight:500},children:w},w))})]})]}),(0,g.jsxs)("div",{style:{margin:"0 0 12px",padding:"10px 12px",background:"#f0fdf4",borderRadius:"8px",border:"1px solid #86efac"},children:[(0,g.jsx)("p",{style:{margin:"0 0 4px",fontSize:"10px",fontWeight:700,color:"#166534"},children:"\u{1F4E6} What you get:"}),(0,g.jsxs)("p",{style:{margin:0,fontSize:"10px",color:"#166534",lineHeight:1.6},children:["\u2705 Complete Next.js 16 project",(0,g.jsx)("br",{}),"\u2705 Tailwind CSS + CSS Modules",(0,g.jsx)("br",{}),"\u2705 TypeScript configured",(0,g.jsx)("br",{}),"\u2705 Navbar + Footer components",(0,g.jsx)("br",{}),"\u2705 All ",n.pages.length," pages ready",(0,g.jsx)("br",{}),"\u2705 Mobile responsive",(0,g.jsx)("br",{}),"\u2705 npm run dev \u2192 works immediately"]})]}),(0,g.jsxs)("div",{style:{display:"flex",gap:"8px"},children:[(0,g.jsx)("button",{onClick:_,style:{flex:1,padding:"9px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",color:"#64748b",fontSize:"12px",fontWeight:600,cursor:"pointer"},children:"\u2190 Edit"}),(0,g.jsx)("button",{onClick:P,style:{flex:2,padding:"9px",borderRadius:"8px",border:"none",background:"#f59e0b",color:"#fff",fontSize:"13px",fontWeight:700,cursor:"pointer"},children:"\u2B07\uFE0F Generate & Download ZIP"})]})]}),o==="generating"&&(0,g.jsxs)("div",{style:{padding:"2rem 16px",textAlign:"center"},children:[(0,g.jsx)("p",{style:{fontSize:"2rem",marginBottom:"1rem"},children:"\u26A1"}),(0,g.jsx)("p",{style:{fontSize:"13px",fontWeight:700,color:"#0f172a",marginBottom:"0.5rem"},children:"Generating your project..."}),(0,g.jsx)("p",{style:{fontSize:"11px",color:"#64748b",marginBottom:"1.5rem"},children:c<30?"Parsing requirement...":c<55?"Loading templates...":c<70?"Generating pages...":c<85?"Building components...":c<95?"Creating styles...":"Packaging ZIP..."}),(0,g.jsx)("div",{style:{height:"8px",background:"#e2e8f0",borderRadius:"99px",overflow:"hidden"},children:(0,g.jsx)("div",{style:{height:"100%",width:`${c}%`,background:"#f59e0b",borderRadius:"99px",transition:"width 0.3s ease"}})}),(0,g.jsxs)("p",{style:{marginTop:"0.5rem",fontSize:"10px",color:"#94a3b8"},children:[c,"%"]})]}),o==="done"&&n&&(0,g.jsxs)("div",{style:{padding:"2rem 16px",textAlign:"center"},children:[(0,g.jsx)("p",{style:{fontSize:"3rem",marginBottom:"0.75rem"},children:"\u2705"}),(0,g.jsxs)("p",{style:{fontSize:"14px",fontWeight:700,color:"#0f172a",marginBottom:"0.5rem"},children:[n.siteName," downloaded!"]}),(0,g.jsx)("p",{style:{fontSize:"11px",color:"#64748b",marginBottom:"1.5rem",lineHeight:1.6},children:"Your ZIP is downloading. Unzip it and run:"}),["npm install","npm run dev"].map(w=>(0,g.jsx)("div",{style:{background:"#0f172a",borderRadius:"8px",padding:"8px 12px",marginBottom:"6px",textAlign:"left"},children:(0,g.jsxs)("code",{style:{fontSize:"12px",color:"#a7f3d0",fontFamily:"monospace"},children:["$ ",w]})},w)),(0,g.jsx)("p",{style:{fontSize:"11px",color:"#10b981",margin:"1rem 0",fontWeight:600},children:"Then open http://localhost:3000 \u{1F680}"}),(0,g.jsxs)("div",{style:{display:"flex",gap:"8px"},children:[(0,g.jsx)("button",{onClick:_,style:{flex:1,padding:"9px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",color:"#64748b",fontSize:"12px",fontWeight:600,cursor:"pointer"},children:"New Project"}),(0,g.jsx)("button",{onClick:P,style:{flex:1,padding:"9px",borderRadius:"8px",border:"none",background:"#f59e0b",color:"#fff",fontSize:"12px",fontWeight:700,cursor:"pointer"},children:"\u2B07\uFE0F Download Again"})]})]})]})}var y=require("react/jsx-runtime");async function ar(){try{if(typeof window>"u")return!1;let e=window;if(e.LanguageModel)try{if(typeof e.LanguageModel.availability=="function"){let o=await e.LanguageModel.availability();if(o==="readily"||o==="available"||o==="downloadable")return!0}else return!0}catch{}if(e.Summarizer)try{let o=await e.Summarizer.availability?.();if(!o||o==="readily"||o==="available")return!0}catch{}if(e.Rewriter)try{let o=await e.Rewriter.availability?.();if(!o||o==="readily"||o==="available")return!0}catch{}if(e.Writer)try{let o=await e.Writer.availability?.();if(!o||o==="readily"||o==="available")return!0}catch{}let t=e.ai||globalThis.ai;if(t){if(t.languageModel?.availability)try{let o=await t.languageModel.availability();if(o==="readily"||o==="available")return!0}catch{}if(t.languageModel&&typeof t.languageModel.create=="function"||t.summarizer||t.rewriter||t.writer||t.languageModel)return!0}return!!(e.Translator||e.translation?.canTranslate)}catch{return!1}}function $e({position:e="left",children:t,config:o={},showRag:r=!1,showAgent:a=!1}){let[s,n]=(0,v.useState)(!1),[i,c]=(0,v.useState)(ot),[d,b]=(0,v.useState)(null),[u,N]=(0,v.useState)(!1),[P,_]=(0,v.useState)(!1),[M,w]=(0,v.useState)(!1),H=v.default.useRef(null),[T,h]=(0,v.useState)(!1),[$,S]=(0,v.useState)(""),[R,x]=(0,v.useState)(""),[F,C]=(0,v.useState)(!1),[k,q]=(0,v.useState)(null),[V,p]=(0,v.useState)("idle"),[X,Q]=(0,v.useState)(!1),[Z,pe]=(0,v.useState)(""),[Go,Se]=(0,v.useState)(""),[ee,bt]=(0,v.useState)(!1),[yt,Oe]=(0,v.useState)([]),[U,ht]=(0,v.useState)(null),Do=24,xt=84,vt=r?144:84,mr=204,[Ae,We]=(0,v.useState)(!1);(0,v.useEffect)(()=>{if(typeof window>"u")return;let f=window;!!(f.LanguageModel||f.ai?.languageModel)&&P?(q("gemini"),ht("gemini")):fe()&&(q("transformers"),ht("transformers"))},[P]),(0,v.useEffect)(()=>{if(k!=="transformers")return;let f=setInterval(()=>p(me()),500);return()=>clearInterval(f)},[k]);let wt=(0,v.useCallback)(async()=>{if(!(!$.trim()||F)){if(!k){x("\u26A0\uFE0F No AI engine available.");return}C(!0),x("");try{let f;if(k==="gemini"){let{askPage:I}=await Promise.resolve().then(()=>(Je(),Zt));f=await I($)}else{p("loading");let{askPageWithTransformers:I}=await Promise.resolve().then(()=>(ge(),tt));f=await I($),p("ready")}x(f.success&&f.answer?f.answer.replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/#+\s/g,"").trim():"\u26A0\uFE0F "+(f.error||"No answer found."))}catch{x("\u26A0\uFE0F Something went wrong.")}C(!1)}},[$,F,k]),kt=(0,v.useCallback)(async()=>{if(!Z.trim()||ee)return;if(!U){Se("\u26A0\uFE0F No AI engine available.");return}bt(!0),Oe([]),Se("");let{runAgent:f}=await Promise.resolve().then(()=>($o(),Ho));await f(Z,U,I=>{Oe(te=>[...te,I.text])}),bt(!1),Se("done")},[Z,ee,U]);(0,v.useEffect)(()=>{if(typeof window>"u")return;let I=setTimeout(async()=>{let te=window,Yo=await ar();_(Yo),w(!!(te.SpeechRecognition||te.webkitSpeechRecognition))},800);return()=>clearTimeout(I)},[]),(0,v.useEffect)(()=>{if(!(typeof window>"u"))try{let f=localStorage.getItem("yuktai-a11y-prefs");f&&c(I=>({...I,...JSON.parse(f)}))}catch{}},[]);let St=(0,v.useCallback)(async f=>{let I={enabled:!0,highContrast:f.highContrast,darkMode:f.darkMode,reduceMotion:f.reduceMotion,largeTargets:f.largeTargets,speechEnabled:f.speechEnabled,autoFix:f.autoFix,dyslexiaFont:f.dyslexiaFont,localFont:f.localFont,fontSizeMultiplier:f.fontScale/100,colorBlindMode:f.colorBlindMode,showAuditBadge:f.showAuditBadge,showSkipLinks:!0,showPreferencePanel:!1,plainEnglish:f.plainEnglish,summarisePage:f.summarisePage,translateLanguage:f.translateLanguage,voiceControl:f.voiceControl,smartLabels:f.smartLabels,...o};await j.execute(I),b(j.applyFixes(I)),N(!0)},[o]),qo=(0,v.useCallback)(async()=>{try{localStorage.setItem("yuktai-a11y-prefs",JSON.stringify(i))}catch{}await St(i),n(!1)},[i,St]),jo=(0,v.useCallback)(()=>{c(ot);try{localStorage.removeItem("yuktai-a11y-prefs")}catch{}let f=document.documentElement;["data-yuktai-high-contrast","data-yuktai-dark","data-yuktai-reduce-motion","data-yuktai-large-targets","data-yuktai-keyboard","data-yuktai-dyslexia"].forEach(I=>f.removeAttribute(I)),document.body.style.filter="",document.body.style.fontFamily="",document.documentElement.style.fontSize="",b(null),N(!1)},[]),Vo=(0,v.useCallback)((f,I)=>{c(te=>({...te,[f]:I}))},[]);(0,v.useEffect)(()=>{let f=I=>{I.key==="Escape"&&(s&&n(!1),T&&h(!1),X&&Q(!1),Ae&&We(!1))};return window.addEventListener("keydown",f),()=>window.removeEventListener("keydown",f)},[s,T,X]),(0,v.useEffect)(()=>{s&&H.current&&j.trapFocus(H.current)},[s]);let Te=(f,I,te)=>({position:"fixed",bottom:`${f}px`,[e]:"24px",zIndex:9998,width:"52px",height:"52px",borderRadius:"50%",background:I,color:"#fff",border:"none",cursor:"pointer",fontSize:"22px",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,0,0,0.25)",transition:"transform 0.15s, background 0.2s"}),Ee=f=>{f.currentTarget.style.transform="scale(1.08)"},Ce=f=>{f.currentTarget.style.transform="scale(1)"},At=k==="gemini"?"Gemini Nano \xB7 On device":k==="transformers"?"Transformers.js \xB7 All devices":"Detecting...",Uo=k==="transformers"&&V==="loading"?"Loading model...":"...";return(0,y.jsxs)(y.Fragment,{children:[t,a&&(0,y.jsx)("button",{style:Te(204,Ae?"#d97706":"#f59e0b",Ae),"aria-label":"Open Vibe Coder",title:"\u26A1 Vibe Coder \u2014 Generate Next.js project",onClick:()=>{We(f=>!f),Q(!1),h(!1),n(!1)},onMouseEnter:Ee,onMouseLeave:Ce,children:"\u26A1"}),a&&Ae&&(0,y.jsx)(at,{position:e,onClose:()=>We(!1)}),a&&(0,y.jsx)("button",{style:Te(vt,X?"#059669":"#10b981",X),"aria-label":"Open AI agent","aria-haspopup":"dialog","aria-expanded":X,title:"\u{1F916} AI Agent \u2014 guide me through this page",onClick:()=>{Q(f=>!f),h(!1),n(!1)},onMouseEnter:Ee,onMouseLeave:Ce,children:"\u{1F916}"}),a&&X&&(0,y.jsxs)("div",{role:"dialog","aria-modal":"true","aria-label":"yuktai AI Agent","data-yuktai-panel":"true",style:{position:"fixed",bottom:`${vt+64}px`,[e]:"24px",zIndex:9999,width:"300px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",fontFamily:"system-ui,-apple-system,sans-serif",padding:"14px",maxHeight:"70vh",overflowY:"auto"},children:[(0,y.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"},children:[(0,y.jsxs)("div",{children:[(0,y.jsx)("p",{style:{margin:"0 0 2px",fontSize:"13px",fontWeight:600,color:"#0f172a"},children:"\u{1F916} AI Agent"}),(0,y.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#10b981"},children:U==="gemini"?"Gemini Nano \xB7 On device":U==="transformers"?"Transformers.js \xB7 All devices":"Detecting..."})]}),(0,y.jsx)("button",{onClick:()=>Q(!1),"aria-label":"Close agent panel",style:{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"18px",lineHeight:1,padding:"2px"},children:"\xD7"})]}),(0,y.jsx)("p",{style:{margin:"0 0 8px",fontSize:"11px",color:"#64748b"},children:"Tell me what you want to do on this page. I will guide you step by step."}),(0,y.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"4px",marginBottom:"8px"},children:["Fill this form","Find contact info","What is this page?","Guide me to apply"].map(f=>(0,y.jsx)("button",{onClick:()=>pe(f),style:{padding:"3px 8px",borderRadius:"20px",fontSize:"10px",border:"1px solid #e2e8f0",background:"#f8fafc",color:"#64748b",cursor:"pointer"},children:f},f))}),(0,y.jsxs)("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[(0,y.jsx)("input",{type:"text",value:Z,onChange:f=>pe(f.target.value),onKeyDown:f=>{f.key==="Enter"&&kt()},placeholder:"e.g. Help me fill this form",disabled:ee||!U,"aria-label":"Tell the agent what to do",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:U?"#fff":"#f8fafc",outline:"none",height:"36px"}}),(0,y.jsx)("button",{onClick:kt,disabled:ee||!Z.trim()||!U,"aria-label":"Run agent",style:{padding:"8px 12px",borderRadius:"8px",border:"none",background:U&&Z.trim()&&!ee?"#10b981":"#e2e8f0",color:U&&Z.trim()&&!ee?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:U&&Z.trim()&&!ee?"pointer":"not-allowed",height:"36px",minWidth:"52px",transition:"background 0.2s"},children:ee?"...":"Go"})]}),yt.length>0&&(0,y.jsxs)("div",{style:{padding:"10px 12px",background:"#f0fdf4",border:"1px solid #86efac",borderRadius:"8px",fontSize:"11px",color:"#166534",lineHeight:1.7},children:[yt.map((f,I)=>(0,y.jsx)("p",{style:{margin:"0 0 2px"},children:f},I)),Go==="done"&&(0,y.jsx)("button",{onClick:()=>{Oe([]),pe(""),Se("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]}),!U&&(0,y.jsx)("p",{style:{margin:"4px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Enable Gemini Nano via chrome://flags for best results."})]}),r&&(0,y.jsx)("button",{style:Te(xt,T?"#7c3aed":"#6d28d9",T),"aria-label":"Ask a question about this page","aria-haspopup":"dialog","aria-expanded":T,title:`\u{1F4AC} Ask this page \xB7 ${At}`,onClick:()=>{h(f=>!f),n(!1),Q(!1)},onMouseEnter:Ee,onMouseLeave:Ce,children:"\u{1F4AC}"}),r&&T&&(0,y.jsxs)("div",{role:"dialog","aria-modal":"true","aria-label":"Ask this page","data-yuktai-panel":"true",style:{position:"fixed",bottom:`${xt+64}px`,[e]:"24px",zIndex:9999,width:"300px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",fontFamily:"system-ui,-apple-system,sans-serif",padding:"14px"},children:[(0,y.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"},children:[(0,y.jsxs)("div",{children:[(0,y.jsx)("p",{style:{margin:"0 0 2px",fontSize:"13px",fontWeight:600,color:"#0f172a"},children:"\u{1F4AC} Ask this page"}),(0,y.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#7c3aed"},children:At}),k==="transformers"&&V==="loading"&&(0,y.jsx)("p",{style:{margin:"2px 0 0",fontSize:"9px",color:"#94a3b8"},children:"Downloading model \u2014 first time only"}),k==="transformers"&&V==="ready"&&(0,y.jsx)("p",{style:{margin:"2px 0 0",fontSize:"9px",color:"#10b981"},children:"Model ready \u2705 \u2014 works offline"})]}),(0,y.jsx)("button",{onClick:()=>h(!1),"aria-label":"Close ask panel",style:{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"18px",lineHeight:1,padding:"2px"},children:"\xD7"})]}),(0,y.jsxs)("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[(0,y.jsx)("input",{type:"text",value:$,onChange:f=>S(f.target.value),onKeyDown:f=>{f.key==="Enter"&&wt()},placeholder:"e.g. What does this page do?",disabled:F||!k,"aria-label":"Ask a question about this page",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:k?"#fff":"#f8fafc",outline:"none",height:"36px"}}),(0,y.jsx)("button",{onClick:wt,disabled:F||!$.trim()||!k,"aria-label":"Submit question",style:{padding:"8px 12px",borderRadius:"8px",border:"none",background:k&&$.trim()&&!F?"#7c3aed":"#e2e8f0",color:k&&$.trim()&&!F?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:k&&$.trim()&&!F?"pointer":"not-allowed",height:"36px",minWidth:"48px",transition:"background 0.2s"},children:F?Uo:"Ask"})]}),R&&(0,y.jsxs)("div",{style:{padding:"10px",background:"#f5f3ff",borderRadius:"8px",fontSize:"12px",color:"#4c1d95",lineHeight:1.6,maxHeight:"180px",overflowY:"auto"},children:[(0,y.jsx)("strong",{style:{display:"block",marginBottom:"4px",fontSize:"11px",color:"#7c3aed"},children:"\u{1F4AC} Answer"}),R,(0,y.jsx)("button",{onClick:()=>{x(""),S("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]}),!k&&(0,y.jsx)("p",{style:{margin:"4px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Detecting AI engine..."})]}),(0,y.jsx)("button",{style:Te(Do,u?"#0d9488":"#1a73e8",s),"aria-label":"Open accessibility preferences","aria-haspopup":"dialog","aria-expanded":s,"data-yuktai-pref-toggle":"true",title:"\u267F Accessibility settings",onClick:()=>{n(f=>!f),h(!1),Q(!1)},onMouseEnter:Ee,onMouseLeave:Ce,children:"\u267F"}),s&&(0,y.jsx)(nt,{ref:H,position:e,settings:i,report:d,isActive:u,aiSupported:P,voiceSupported:M,set:Vo,onApply:qo,onReset:jo,onClose:()=>n(!1)})]})}m();var ye={name:"ai.text",async execute(e){return`\u{1F916} YuktAI says: ${e}`}};m();var he={name:"voice.text",async execute(e){return!e||e.trim()===""?"\u{1F3A4} No speech detected":`\u{1F3A4} You said: ${e}`}};m();var ne=class{plugins=new Map;register(t,o){if(!o||typeof o.execute!="function")throw new Error(`Invalid plugin: ${t}`);this.plugins.set(t,o)}use(t){return this.plugins.get(t)}async run(t,o){try{let r=this.use(t);if(!r)throw new Error(`Plugin not found: ${t}`);return await r.execute(o)}catch(r){throw console.error(`[YuktAI Runtime Error in ${t}]:`,r),r}}getPlugins(){return Array.from(this.plugins.keys())}};m();var O=require("react"),L=require("react/jsx-runtime");function ir(e){let t=e.toLowerCase().trim();if(/^(search|find|show|filter)/.test(t))return{type:"search",payload:t.replace(/^(search|find|show|filter)\s+(for\s+|by\s+)?/,"").trim()};if(/sort/.test(t)){let o=/desc|high|large|top/.test(t)?"desc":"asc";return{type:"sort",payload:{key:t.match(/(name|age|salary|role|email|date)/)?.[1],dir:o}}}return/^(who|what|which|how many|highest|lowest|max|min|average|avg|total|sum)/.test(t)?{type:"question",payload:e}:{type:"search",payload:e}}function sr(e,t,o){if(t.length===0)return"There is no data to analyze.";let r=e.toLowerCase();if(/how many|count|total/.test(r))return`There are ${t.length} rows in the grid.`;let a=o.filter(n=>n.type==="number"),s=o.find(n=>r.includes(n.label.toLowerCase())||r.includes(n.key.toLowerCase()));if(/highest|maximum|max|top|largest/.test(r)){let n=s??a[0];if(!n)return"I could not find a column to analyze.";let i=t.map(u=>({row:u,val:Number(u[n.key])})).filter(u=>!isNaN(u.val)).sort((u,N)=>N.val-u.val);if(i.length===0)return`No numeric data in ${n.label}.`;let c=i[0],d=o.find(u=>u.key==="name"||u.label.toLowerCase()==="name"),b=d?String(c.row[d.key]):`Row ${t.indexOf(c.row)+1}`;return`The highest ${n.label} is ${c.val.toLocaleString("en-IN")}, held by ${b}.`}if(/lowest|minimum|min|smallest|bottom/.test(r)){let n=s??a[0];if(!n)return"I could not find a column to analyze.";let i=t.map(u=>({row:u,val:Number(u[n.key])})).filter(u=>!isNaN(u.val)).sort((u,N)=>u.val-N.val);if(i.length===0)return`No numeric data in ${n.label}.`;let c=i[0],d=o.find(u=>u.key==="name"||u.label.toLowerCase()==="name"),b=d?String(c.row[d.key]):`Row ${t.indexOf(c.row)+1}`;return`The lowest ${n.label} is ${c.val.toLocaleString("en-IN")}, held by ${b}.`}if(/average|avg|mean/.test(r)){let n=s??a[0];if(!n)return"I could not find a column to analyze.";let i=t.map(d=>Number(d[n.key])).filter(d=>!isNaN(d));if(i.length===0)return`No numeric data in ${n.label}.`;let c=i.reduce((d,b)=>d+b,0)/i.length;return`The average ${n.label} is ${Math.round(c).toLocaleString("en-IN")}.`}if(/sum|total/.test(r)){let n=s??a[0];if(!n)return"I could not find a column to analyze.";let i=t.map(d=>Number(d[n.key])).filter(d=>!isNaN(d));if(i.length===0)return`No numeric data in ${n.label}.`;let c=i.reduce((d,b)=>d+b,0);return`The total ${n.label} is ${c.toLocaleString("en-IN")}.`}if(/who|where|which|whose/.test(r)){let n=r.match(/\b([a-z]{3,})\b/g)?.filter(b=>!["who","where","which","whose","is","the","has","have"].includes(b));if(!n)return"I need a name to look up.";let i=n.join(" "),c=t.find(b=>Object.values(b).some(u=>String(u).toLowerCase().includes(i.toLowerCase())));return c?o.map(b=>`${b.label}: ${c[b.key]}`).join(", "):`I could not find anyone matching "${i}".`}return"I understand you have a question. Try asking 'highest salary' or 'how many rows'."}function lr(e="en-US"){let[t,o]=(0,O.useState)(!1),[r,a]=(0,O.useState)(""),[s,n]=(0,O.useState)(!0),i=(0,O.useRef)(null);(0,O.useEffect)(()=>{if(typeof window>"u")return;let b=window.SpeechRecognition||window.webkitSpeechRecognition;if(!b){n(!1);return}let u=new b;u.continuous=!1,u.interimResults=!1,u.lang=e,u.onresult=N=>{let P=N.results[0][0].transcript;a(P),o(!1)},u.onerror=()=>o(!1),u.onend=()=>o(!1),i.current=u},[e]);let c=(0,O.useCallback)(()=>{if(i.current){a(""),o(!0);try{i.current.start()}catch{o(!1)}}},[]),d=(0,O.useCallback)(()=>{i.current?.stop(),o(!1)},[]);return{listening:t,transcript:r,supported:s,start:c,stop:d}}function cr(e,t="en-US"){if(typeof window>"u"||!window.speechSynthesis)return;window.speechSynthesis.cancel();let o=new SpeechSynthesisUtterance(e);o.lang=t,o.rate=1,o.pitch=1,window.speechSynthesis.speak(o)}function Oo({data:e,columns:t,onSearch:o,onSort:r,theme:a="light",language:s="en-US"}){let[n,i]=(0,O.useState)(!1),[c,d]=(0,O.useState)(""),[b,u]=(0,O.useState)([{role:"ai",text:"Hi! Ask me anything about your data \u2014 like 'highest salary' or 'how many rows'. You can also say 'search Sandeep' or 'sort age descending'.",time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]),N=(0,O.useRef)(null),{listening:P,transcript:_,supported:M,start:w,stop:H}=lr(s),T=a==="dark",h={bg:T?"#0F172A":"#FFFFFF",surface:T?"#1E293B":"#F8FAFC",border:T?"#334155":"#E2E8F0",text:T?"#F1F5F9":"#0F172A",muted:T?"#94A3B8":"#64748B",accent:"#10B981",userMsg:T?"#334155":"#DBEAFE",aiMsg:T?"#1E293B":"#F0FDF4"};(0,O.useEffect)(()=>{N.current?.scrollIntoView({behavior:"smooth"})},[b]),(0,O.useEffect)(()=>{_&&$(_)},[_]);let $=x=>{if(!x.trim())return;let F=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});u(q=>[...q,{role:"user",text:x,time:F}]),d("");let C=ir(x),k="";if(C.type==="search")o(C.payload),k=`Searching for "${C.payload}"...`;else if(C.type==="sort"&&r){let{key:q,dir:V}=C.payload;q?(r(q,V),k=`Sorted by ${q} (${V==="asc"?"ascending":"descending"}).`):k="Which column should I sort? Try 'sort by salary'."}else C.type==="question"&&(k=sr(C.payload,e,t));setTimeout(()=>{let q=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});u(V=>[...V,{role:"ai",text:k,time:q}]),cr(k,s)},400)},S=()=>$(c),R=["highest salary","how many rows","average age","search sandeep"];return(0,L.jsxs)(L.Fragment,{children:[(0,L.jsx)("button",{onClick:()=>i(!n),"aria-label":n?"Close AI assistant":"Open AI assistant",style:{position:"fixed",bottom:24,right:24,zIndex:9998,width:56,height:56,borderRadius:28,background:h.accent,color:"#FFFFFF",border:"none",cursor:"pointer",boxShadow:"0 8px 20px rgba(16,185,129,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,transition:"transform 0.2s"},onMouseEnter:x=>x.currentTarget.style.transform="scale(1.1)",onMouseLeave:x=>x.currentTarget.style.transform="scale(1)",children:n?"\u2715":"\u{1F916}"}),n&&(0,L.jsxs)("div",{role:"dialog","aria-label":"AI Grid Assistant",style:{position:"fixed",bottom:90,right:24,width:360,maxWidth:"calc(100vw - 48px)",height:480,maxHeight:"70vh",background:h.bg,border:`1px solid ${h.border}`,borderRadius:16,boxShadow:"0 20px 40px rgba(0,0,0,0.15)",zIndex:9997,display:"flex",flexDirection:"column",overflow:"hidden",fontFamily:"system-ui, sans-serif"},children:[(0,L.jsxs)("div",{style:{padding:"14px 16px",background:h.accent,color:"#FFFFFF",display:"flex",alignItems:"center",gap:10},children:[(0,L.jsx)("span",{style:{fontSize:22},children:"\u{1F916}"}),(0,L.jsxs)("div",{style:{flex:1},children:[(0,L.jsx)("div",{style:{fontWeight:700,fontSize:15},children:"Grid AI Assistant"}),(0,L.jsx)("div",{style:{fontSize:11,opacity:.9},children:M?"Voice + Chat \xB7 Offline \xB7 Free":"Chat only (voice not supported)"})]}),(0,L.jsx)("button",{onClick:()=>i(!1),"aria-label":"Close",style:{background:"transparent",border:"none",color:"#FFFFFF",cursor:"pointer",fontSize:20,padding:4},children:"\u2715"})]}),(0,L.jsxs)("div",{style:{flex:1,overflowY:"auto",padding:12,display:"flex",flexDirection:"column",gap:8},children:[b.map((x,F)=>(0,L.jsxs)("div",{style:{alignSelf:x.role==="user"?"flex-end":"flex-start",maxWidth:"85%",padding:"8px 12px",borderRadius:12,background:x.role==="user"?h.userMsg:h.aiMsg,color:h.text,fontSize:13.5,lineHeight:1.5},children:[(0,L.jsx)("div",{children:x.text}),(0,L.jsx)("div",{style:{fontSize:10,opacity:.6,marginTop:4,textAlign:"right"},children:x.time})]},F)),P&&(0,L.jsx)("div",{style:{alignSelf:"flex-end",padding:"8px 12px",borderRadius:12,background:"#FEE2E2",color:"#991B1B",fontSize:13.5,fontStyle:"italic"},children:"\u{1F3A4} Listening..."}),(0,L.jsx)("div",{ref:N})]}),(0,L.jsx)("div",{style:{padding:"6px 12px",borderTop:`1px solid ${h.border}`,display:"flex",gap:6,overflowX:"auto",flexShrink:0},children:R.map(x=>(0,L.jsx)("button",{onClick:()=>$(x),style:{padding:"4px 10px",borderRadius:12,background:h.surface,border:`1px solid ${h.border}`,color:h.text,fontSize:11.5,cursor:"pointer",whiteSpace:"nowrap"},children:x},x))}),(0,L.jsxs)("div",{style:{padding:10,display:"flex",gap:6,borderTop:`1px solid ${h.border}`,background:h.surface},children:[(0,L.jsx)("input",{type:"text",value:c,onChange:x=>d(x.target.value),onKeyDown:x=>x.key==="Enter"&&S(),placeholder:"Ask or say a command...","aria-label":"Chat input",style:{flex:1,padding:"8px 12px",border:`1px solid ${h.border}`,borderRadius:8,background:h.bg,color:h.text,fontSize:13,outline:"none"}}),M&&(0,L.jsx)("button",{onClick:P?H:w,"aria-label":P?"Stop listening":"Start voice input",style:{width:36,height:36,borderRadius:8,background:P?"#EF4444":h.accent,color:"#FFFFFF",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0,animation:P?"yuktai-pulse 1s ease-in-out infinite":"none"},children:"\u{1F3A4}"}),(0,L.jsx)("button",{onClick:S,"aria-label":"Send",disabled:!c.trim(),style:{padding:"0 14px",background:c.trim()?h.accent:h.muted,color:"#FFFFFF",border:"none",borderRadius:8,cursor:c.trim()?"pointer":"not-allowed",fontSize:13,fontWeight:600,flexShrink:0},children:"Send"})]})]}),(0,L.jsx)("style",{children:`
        @keyframes yuktai-pulse {
          0%, 100% { transform: scale(1);   box-shadow: 0 0 0 0    rgba(239, 68, 68, 0.4); }
          50%      { transform: scale(1.1); box-shadow: 0 0 0 8px  rgba(239, 68, 68, 0);   }
        }
      `})]})}m();var W=require("react");function dr(e){return e===!1?Number.MAX_SAFE_INTEGER:e===!0||e===void 0?10:e.pageSize??10}function Wo(e){let{data:t,columns:o,pagination:r=!0,mobileBreakpoint:a=768}=e,[s,n]=(0,W.useState)(null),[i,c]=(0,W.useState)(""),[d,b]=(0,W.useState)(1),[u,N]=(0,W.useState)(dr(r)),[P,_]=(0,W.useState)(!1);(0,W.useEffect)(()=>{if(typeof window>"u")return;let R=()=>{_(window.innerWidth<a)};return R(),window.addEventListener("resize",R),()=>window.removeEventListener("resize",R)},[a]);let M=(0,W.useCallback)(R=>{n(x=>!x||x.key!==R?{key:R,direction:"asc"}:x.direction==="asc"?{key:R,direction:"desc"}:null),b(1)},[]),w=(0,W.useCallback)(()=>n(null),[]),H=(0,W.useMemo)(()=>{if(!i.trim())return t;let R=i.toLowerCase().trim();return t.filter(x=>o.some(F=>{let C=x[F.key];return C==null?!1:String(C).toLowerCase().includes(R)}))},[t,i,o]),T=(0,W.useMemo)(()=>{if(!s)return H;let R=[...H].sort((x,F)=>{let C=x[s.key],k=F[s.key];if(C===k)return 0;if(C==null)return 1;if(k==null)return-1;if(typeof C=="number"&&typeof k=="number")return C-k;if(C instanceof Date&&k instanceof Date)return C.getTime()-k.getTime();let q=String(C),V=String(k);return q.localeCompare(V,void 0,{sensitivity:"base",numeric:!0})});return s.direction==="desc"?R.reverse():R},[H,s]),h=Math.max(1,Math.ceil(T.length/u)),$=(0,W.useMemo)(()=>{if(r===!1)return T;let R=(d-1)*u;return T.slice(R,R+u)},[T,d,u,r]),S=(0,W.useCallback)(()=>{n(null),c(""),b(1)},[]);return(0,W.useEffect)(()=>{d>h&&b(h)},[d,h]),{displayedData:$,totalCount:t.length,filteredCount:T.length,sort:s,toggleSort:M,clearSort:w,searchQuery:i,setSearchQuery:c,page:d,pageSize:u,totalPages:h,setPage:b,setPageSize:N,isMobile:P,reset:S}}m();m();var Bo=require("react/jsx-runtime");function B({size:e=20,color:t="currentColor",strokeWidth:o=2.5,label:r,children:a,...s}){return(0,Bo.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:o,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!r?"true":void 0,"aria-label":r,role:r?"img":void 0,focusable:"false",...s,children:a})}m();var xe=require("react/jsx-runtime");function it(e){return(0,xe.jsxs)(B,{...e,children:[(0,xe.jsx)("circle",{cx:"11",cy:"11",r:"7"}),(0,xe.jsx)("path",{d:"m20 20-4-4"})]})}m();var ve=require("react/jsx-runtime");function st(e){return(0,ve.jsxs)(B,{...e,children:[(0,ve.jsx)("path",{d:"M12 19V5"}),(0,ve.jsx)("path",{d:"m5 12 7-7 7 7"})]})}m();var we=require("react/jsx-runtime");function lt(e){return(0,we.jsxs)(B,{...e,children:[(0,we.jsx)("path",{d:"M12 5v14"}),(0,we.jsx)("path",{d:"m5 12 7 7 7-7"})]})}m();var ct=require("react/jsx-runtime");function dt(e){return(0,ct.jsx)(B,{...e,children:(0,ct.jsx)("path",{d:"m15 18-6-6 6-6"})})}m();var pt=require("react/jsx-runtime");function ut(e){return(0,pt.jsx)(B,{...e,children:(0,pt.jsx)("path",{d:"m9 18 6-6-6-6"})})}m();var ft=require("react/jsx-runtime");function mt(e){return(0,ft.jsx)(B,{...e,children:(0,ft.jsx)("path",{d:"M5 12.5 10 17.5 19.5 7"})})}m();var ke=require("react/jsx-runtime");function gt(e){return(0,ke.jsxs)(B,{...e,children:[(0,ke.jsx)("path",{d:"M18 6 6 18"}),(0,ke.jsx)("path",{d:"m6 6 12 12"})]})}function pr(){if(typeof globalThis>"u")return new ne;if(!globalThis.__yuktai_runtime__){let e=new ne;e.register(j.name,j),e.register(ye.name,ye),e.register(he.name,he),globalThis.__yuktai_runtime__=e}return globalThis.__yuktai_runtime__}var _o=typeof window<"u"?pr():new ne,ur={wcagPlugin:j,list(){return _o.getPlugins()},use(e){return _o.use(e)},fix(e){return j.applyFixes({enabled:!0,autoFix:!0,...e})},scan(){return j.scan()}};
