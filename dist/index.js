"use strict";var zo=Object.create;var Ce=Object.defineProperty;var Io=Object.getOwnPropertyDescriptor;var Ho=Object.getOwnPropertyNames;var Wo=Object.getPrototypeOf,Oo=Object.prototype.hasOwnProperty;var le=(e,t)=>()=>(e&&(t=e(e=0)),t);var be=(e,t)=>{for(var o in t)Ce(e,o,{get:t[o],enumerable:!0})},mt=(e,t,o,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of Ho(t))!Oo.call(e,a)&&a!==o&&Ce(e,a,{get:()=>t[a],enumerable:!(r=Io(t,a))||r.enumerable});return e};var Be=(e,t,o)=>(o=e!=null?zo(Wo(e)):{},mt(t||!e||!e.__esModule?Ce(o,"default",{value:e,enumerable:!0}):o,e)),$o=e=>mt(Ce({},"__esModule",{value:!0}),e);var b=le(()=>{});var $t={};be($t,{askPage:()=>Ze});function dn(){return new Promise(e=>{let t=setTimeout(e,1500),o=new MutationObserver(()=>{clearTimeout(t),t=setTimeout(()=>{o.disconnect(),e()},500)});o.observe(document.body,{childList:!0,subtree:!0})})}function pn(){let e=[],t=document.querySelectorAll("*");for(let o of t){if(o.closest("[data-yuktai-panel]"))continue;let r=o.innerText?.trim();r&&r.length>30&&e.push(r);let a=o.getAttribute("aria-label");if(a&&a.length>10&&e.push(a),(o instanceof HTMLInputElement||o instanceof HTMLTextAreaElement)&&(o.placeholder&&e.push(o.placeholder),o.value&&e.push(o.value)),o instanceof HTMLButtonElement){let i=o.innerText||o.getAttribute("aria-label");i&&e.push(i)}}return e.join(" ").slice(0,3500)}async function Ze(e){if(!e.trim())return{success:!1,answer:"",error:"Please type a question."};try{let t=window,o=t.LanguageModel||t.ai?.languageModel;if(!o)return{success:!1,answer:"",error:"Gemini Nano not available."};await dn();let r=pn();if(!r||r.length<100)return{success:!1,answer:"",error:"Page content not readable."};let a;try{a=await o.create({systemPrompt:`Answer ONLY using page content.
Keep answer short (2\u20133 sentences).
If not found say: "I could not find that on this page."`,outputLanguage:"en"})}catch{a=await o.create()}let i=`Page:
${r}

Q: ${e}`,n=await a.prompt(i);return a?.destroy&&a.destroy(),{success:!0,answer:n?.trim()||"No answer found."}}catch(t){return{success:!1,answer:"",error:t instanceof Error?t.message:"Error occurred"}}}var Je=le(()=>{"use strict";b()});var tt={};be(tt,{askPageWithTransformers:()=>et,getModelLoadStatus:()=>he,isTransformersSupported:()=>ye});function Dt(){return typeof navigator>"u"?!1:/Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(navigator.userAgent)}function un(){if(Dt())return"wasm";try{if(typeof navigator<"u"&&"gpu"in navigator&&navigator.gpu!==void 0)return"webgpu"}catch{}return"wasm"}async function mn(){if(!Qe){if(ue){for(;ue;)await new Promise(e=>setTimeout(e,200));return}ue=!0;try{let{pipeline:e,env:t}=await import("@huggingface/transformers");t.allowRemoteModels=!0,t.allowLocalModels=!1,typeof window<"u"&&typeof caches<"u"&&(t.useWasmCache=!0);let o=un(),r=Dt();console.log(`yuktai: Transformers.js \u2014 device: ${o}, mobile: ${r}`),_t=await e("feature-extraction","Xenova/all-MiniLM-L6-v2",{device:o,dtype:r?"q4":"fp32"}),Gt=await e("text2text-generation","Xenova/flan-t5-small",{device:o,dtype:r?"q4":"fp32"}),Qe=!0,ue=!1,console.log("yuktai: Transformers.js models loaded \u2705")}catch(e){throw ue=!1,console.error("yuktai: Transformers.js model load failed",e),e}}}function fn(){return new Promise(e=>{let t=setTimeout(e,1500),o=new MutationObserver(()=>{clearTimeout(t),t=setTimeout(()=>{o.disconnect(),e()},500)});o.observe(document.body,{childList:!0,subtree:!0})})}function gn(){let e=[],t=new Set,o=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, td, th, label, figcaption, blockquote, span, a, button, div");for(let n of o){if(n.closest("[data-yuktai-panel]")||n.querySelector("p, h1, h2, h3, h4, li, td, div"))continue;let c=n.innerText?.trim();if(!c||c.length<15||t.has(c))continue;t.add(c),e.push(c);let p=n.getAttribute("aria-label")?.trim();p&&p.length>8&&!t.has(p)&&(t.add(p),e.push(p))}let r=document.title?.trim();r&&!t.has(r)&&e.unshift(r);let i=document.querySelector('meta[name="description"]')?.getAttribute("content")?.trim();return i&&!t.has(i)&&e.unshift(i),e.join(" ").slice(0,8e3)}function bn(e,t=150,o=30){if(typeof e!="string")try{e=String(e??"")}catch{return[]}let r=e.trim();if(!r)return[];let a=Math.min(o,Math.floor(t/2)),i=r.split(/\s+/),n=[],s=t-a;for(let c=0;c<i.length;c+=s){let p=i.slice(c,c+t).join(" ");p.trim().length>20&&n.push(p)}return n}function yn(e,t){let o=0,r=0,a=0;for(let i=0;i<e.length;i++)o+=e[i]*t[i],r+=e[i]*e[i],a+=t[i]*t[i];return o/(Math.sqrt(r)*Math.sqrt(a)+1e-8)}async function Bt(e){let t=await _t(e,{pooling:"mean",normalize:!0}),o=t?.data??t;return Array.from(o)}async function hn(e,t,o=3){let r=await Bt(e),a=await Promise.all(t.map(async i=>{let n=await Bt(i),s=yn(r,n);return{chunk:i,score:s}}));return a.sort((i,n)=>n.score-i.score),a.slice(0,o).map(i=>i.chunk)}async function et(e){if(!e.trim())return{success:!1,answer:"",error:"Please type a question."};try{await mn(),await fn();let t=gn();if(!t||t.length<50)return{success:!1,answer:"",error:"Not enough content on this page."};let o=bn(t);if(o.length===0)return{success:!1,answer:"",error:"Could not process page content."};let i=`Answer the question based on the context. Give a complete answer in 2-3 sentences.

Context: ${(await hn(e,o,3)).join(" ").slice(0,1200)}

Question: ${e}

Answer:`,s=(await Gt(i,{max_new_tokens:120,min_new_tokens:10}))?.[0]?.generated_text?.trim()||"";return s?{success:!0,answer:s}:{success:!0,answer:"I could not find a specific answer on this page."}}catch(t){console.error("yuktai: Transformers RAG error",t);let o=t instanceof Error?t.message:"";return o.includes("Out of memory")||o.includes("memory")?{success:!1,answer:"",error:"Not enough device memory. Try on a device with more RAM or use desktop Chrome with Gemini Nano."}:{success:!1,answer:"",error:o||"Transformers.js error."}}}function ye(){try{return typeof WebAssembly<"u"&&typeof Worker<"u"}catch{return!1}}function he(){return Qe?"ready":ue?"loading":"idle"}var _t,Gt,ue,Qe,xe=le(()=>{"use strict";b();_t=null,Gt=null,ue=!1,Qe=!1});function jt(e,t){return e.replace(/\{\{SITE_NAME\}\}/g,t.SITE_NAME).replace(/\{\{THEME_COLOR\}\}/g,t.THEME_COLOR).replace(/\{\{TAGLINE\}\}/g,t.TAGLINE).replace(/\{\{YEAR\}\}/g,t.YEAR)}var rt,Vt,Ut,Yt,Kt,Xt,Zt,Jt,Qt,eo,to,oo,no,ro,ao,io,so,lo,co,po,uo,mo,fo,go,bo,yo=le(()=>{"use strict";b();rt={blue:"#1a73e8",green:"#0d9488",purple:"#7c3aed",red:"#dc2626",orange:"#ea580c",teal:"#0891b2",indigo:"#4f46e5",gray:"#374151"},Vt=e=>`{
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
`,Ut=`/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
}

module.exports = nextConfig
`,Yt=e=>`/** @type {import('tailwindcss').Config} */
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
`,Kt=e=>`@tailwind base;
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
`,Xt=`import type { Metadata } from "next"
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
`,Zt=`"use client"
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
`,Jt=`.navbar {
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
`,Qt=`import styles from "./Footer.module.css"

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
`,eo=`.footer {
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
`,to=`import styles from "./page.module.css"
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
`,oo=`.page { min-height: 100vh; }

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
`,no=`import styles from "./page.module.css"

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
`,ro=`.page { min-height: 100vh; }

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
`,ao=`"use client"
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
`,io=`.page { min-height: 100vh; }

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
`,so=`import styles from "./page.module.css"

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
`,lo=`.page { min-height: 100vh; }

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
`,co=`import styles from "./page.module.css"
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
`,po=`.page { min-height: 100vh; }

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
`,uo=`"use client"
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
`,mo=`.page {
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
`,fo=`import Link from "next/link"

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
`,go=`{
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
`,bo=e=>`# ${e}

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
`});var ho={};be(ho,{generateZip:()=>In});function zn(e,t){return{hotel:`Experience luxury and comfort at ${e}`,ecommerce:`Shop the best products at ${e}`,restaurant:`Delicious food crafted with love at ${e}`,portfolio:`Creative work and professional services by ${e}`,blog:`Insights, stories, and ideas from ${e}`,saas:`Powerful tools to grow your business \u2014 ${e}`,government:`Official services and information \u2014 ${e}`,healthcare:`Quality healthcare you can trust \u2014 ${e}`,education:`Learn, grow, and succeed with ${e}`,realestate:`Find your perfect property with ${e}`,landing:`The smarter way to get things done \u2014 ${e}`,generic:`Welcome to ${e} \u2014 your trusted partner`}[t]||`Welcome to ${e}`}async function In(e){let t=(await import("jszip")).default,o=new t,r=rt[e.theme]||rt.blue,a=zn(e.siteName,e.websiteType),i=new Date().getFullYear().toString(),n={SITE_NAME:e.siteName,THEME_COLOR:r,TAGLINE:a,YEAR:i},s=g=>jt(g,n).replace(/\{\{SITE_NAME_LOWER\}\}/g,e.siteName.toLowerCase().replace(/\s+/g,""));o.file("package.json",Vt(e.siteName)),o.file("next.config.js",Ut),o.file("tailwind.config.js",Yt(r)),o.file("tsconfig.json",go),o.file("README.md",bo(e.siteName)),o.file("postcss.config.js","module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }"),o.file(".gitignore",`node_modules
.next
.env.local
.DS_Store`),o.file("src/app/globals.css",Kt(r)),o.file("src/app/layout.tsx",s(Xt)),o.file("src/app/not-found.tsx",fo),o.file("src/components/Navbar.tsx",s(Zt)),o.file("src/components/Navbar.module.css",Jt),o.file("src/components/Footer.tsx",s(Qt)),o.file("src/components/Footer.module.css",eo);for(let g of e.pages)switch(g){case"home":o.file("src/app/page.tsx",s(to)),o.file("src/app/page.module.css",oo);break;case"about":o.file("src/app/about/page.tsx",s(no)),o.file("src/app/about/page.module.css",ro);break;case"contact":o.file("src/app/contact/page.tsx",s(ao)),o.file("src/app/contact/page.module.css",io);break;case"services":o.file("src/app/services/page.tsx",s(so)),o.file("src/app/services/page.module.css",lo);break;case"pricing":o.file("src/app/pricing/page.tsx",s(co)),o.file("src/app/pricing/page.module.css",po);break;case"auth":o.file("src/app/auth/page.tsx",s(uo)),o.file("src/app/auth/page.module.css",mo);break;default:o.file(`src/app/${g}/page.tsx`,Hn(g,e.siteName,r,n,s));break}let c=await o.generateAsync({type:"blob"}),p=URL.createObjectURL(c),y=document.createElement("a");y.href=p,y.download=`${e.siteName.toLowerCase().replace(/\s+/g,"-")}-nextjs.zip`,document.body.appendChild(y),y.click(),document.body.removeChild(y),URL.revokeObjectURL(p)}function Hn(e,t,o,r,a){let i=e.charAt(0).toUpperCase()+e.slice(1);return`import styles from "./page.module.css"

export default function ${i}Page() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <section style={{
        background: "${o}",
        color: "white",
        padding: "5rem 1rem",
        textAlign: "center"
      }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem" }}>
          ${i}
        </h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.85 }}>
          ${t} \u2014 ${i} page
        </p>
      </section>
      <section style={{ padding: "4rem 1rem", maxWidth: "1100px", margin: "0 auto" }}>
        <p style={{ color: "#64748b", fontSize: "1rem", textAlign: "center" }}>
          This is the ${i} page. Edit this file to add your content.
        </p>
      </section>
    </div>
  )
}
`}var xo=le(()=>{"use strict";b();yo()});var Ao={};be(Ao,{getPageText:()=>vo,highlightField:()=>ko,runAgent:()=>Dn,scanFormFields:()=>wo,scrollToSection:()=>So});function ae(e){try{let t=window.getComputedStyle(e);if(t.display==="none"||t.visibility==="hidden"||t.opacity==="0"||e.hidden)return!1;let o=e.getBoundingClientRect();return!(o.width===0&&o.height===0)}catch{return!0}}function vo(){let e=[],t=new Set,o=n=>{let s=n.trim();s&&s.length>10&&!t.has(s)&&(t.add(s),e.push(s))};document.title&&o(document.title);let r=['meta[name="description"]','meta[name="keywords"]','meta[property="og:title"]','meta[property="og:description"]','meta[name="twitter:title"]','meta[name="twitter:description"]'];for(let n of r){let s=document.querySelector(n)?.getAttribute("content");s&&o(s)}let a=["h1","h2","h3","h4","h5","h6","p","blockquote","q","pre","code","li","dt","dd","th","td","caption","a","b","strong","em","i","u","s","abbr","acronym","cite","dfn","mark","small","sub","sup","ins","del","bdi","bdo","article","section","aside","nav","header","footer","main","summary","details","figcaption","figure","address","time","output","label","legend","option","button","font","center","span","div","[role='heading']","[role='main']","[role='article']","[role='region']","[role='complementary']","[role='contentinfo']","[role='navigation']","[role='banner']","[role='listitem']","[role='cell']","[role='columnheader']","[role='rowheader']"],i=document.querySelectorAll(a.join(","));for(let n of i){if(n.closest("[data-yuktai-panel]")||!ae(n)||n.querySelector("p, h1, h2, h3, h4, h5, h6, li, td, th, div, article, section, blockquote, pre"))continue;let c=n.innerText?.trim();if(c&&c.length>10&&o(c),!c){let L=n.textContent?.trim();L&&L.length>10&&o(L)}let p=n.getAttribute("aria-label")?.trim();p&&p.length>5&&o(p);let y=n.getAttribute("aria-description")?.trim();y&&y.length>5&&o(y);let g=n.getAttribute("aria-valuetext")?.trim();g&&o(g);let V=n.getAttribute("title")?.trim();V&&V.length>5&&o(V);let $=n.getAttribute("data-label")?.trim();$&&o($);let G=n.getAttribute("data-title")?.trim();G&&o(G),n.querySelectorAll("img").forEach(L=>{let w=L.getAttribute("alt")?.trim();w&&w.length>5&&o(w);let P=L.getAttribute("title")?.trim();P&&P.length>5&&o(P)})}document.querySelectorAll("img").forEach(n=>{if(n.closest("[data-yuktai-panel]")||!ae(n))return;let s=n.getAttribute("alt")?.trim(),c=n.getAttribute("title")?.trim();s&&s.length>5&&o(s),c&&c.length>5&&o(c)}),document.querySelectorAll("input:not([type=hidden]), textarea").forEach(n=>{if(n.closest("[data-yuktai-panel]")||!ae(n))return;n.placeholder&&o(n.placeholder),n.value&&n.value.length>3&&o(n.value);let s=n.getAttribute("aria-label")?.trim();s&&o(s)}),document.querySelectorAll("select").forEach(n=>{n.closest("[data-yuktai-panel]")||ae(n)&&Array.from(n.options).forEach(s=>{s.text?.trim().length>3&&o(s.text.trim())})}),document.querySelectorAll("td, th").forEach(n=>{if(n.closest("[data-yuktai-panel]")||!ae(n))return;let s=n.innerText?.trim();s&&s.length>3&&o(s)});try{document.querySelectorAll("iframe").forEach(n=>{try{let s=n.contentDocument;if(!s)return;let c=s.body?.innerText?.trim();c&&c.length>20&&o(c.slice(0,500))}catch{}})}catch{}return document.querySelectorAll("a").forEach(n=>{if(n.closest("[data-yuktai-panel]")||!ae(n))return;let s=n.innerText?.trim();s&&s.length>3&&s.length<100&&o(s)}),e.join(" ").slice(0,5e3)}function Bn(e){let t=e.getAttribute("aria-label")?.trim();if(t)return t;let o=e.getAttribute("aria-labelledby");if(o){let c=document.getElementById(o);if(c)return c.innerText?.trim()||""}if(e.id){let c=document.querySelector(`label[for="${e.id}"]`);if(c)return c.innerText?.trim()||""}let r=e.closest("label");if(r){let c=r.cloneNode(!0);return c.querySelectorAll("input, select, textarea").forEach(p=>p.remove()),c.innerText?.trim()||""}if((e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement)&&e.placeholder)return e.placeholder;if(e.name)return e.name.replace(/[_-]/g," ");let a=e.previousSibling;if(a?.nodeType===Node.TEXT_NODE){let c=a.textContent?.trim();if(c&&c.length>1)return c}let i=e.previousElementSibling;if(i){let c=i.innerText?.trim();if(c&&c.length>1&&c.length<60)return c}let n=e.closest("td, th");if(n){let c=n.previousElementSibling;if(c){let p=c.innerText?.trim();if(p&&p.length>1)return p}}let s=e.getAttribute("title")?.trim();return s||(e instanceof HTMLInputElement?e.type:"field")}function wo(){let e=[],t=document.querySelectorAll(["input:not([type=hidden])","input:not([type=submit])","input:not([type=button])","input:not([type=reset])","input:not([type=image])","select","textarea","[contenteditable='true']","[role='textbox']","[role='combobox']","[role='spinbutton']","[role='searchbox']","[role='listbox']"].join(", "));for(let o of t){if(o.closest("[data-yuktai-panel]")||!ae(o))continue;if(o instanceof HTMLInputElement){let a=o.type.toLowerCase();if(["submit","button","reset","image"].includes(a))continue}let r=Bn(o);e.push({label:r,type:o instanceof HTMLInputElement?o.type:o.tagName.toLowerCase(),placeholder:(o instanceof HTMLInputElement||o instanceof HTMLTextAreaElement)&&o.placeholder||"",required:o.required||o.getAttribute("aria-required")==="true"||o.getAttribute("data-required")==="true",element:o})}return e}function ko(e,t=3e3){e.scrollIntoView({behavior:"smooth",block:"center"}),e.style.outline="3px solid #0d9488",e.style.outlineOffset="3px";try{e.focus()}catch{}setTimeout(()=>{e.style.outline="",e.style.outlineOffset=""},t)}function So(e){let t=e.toLowerCase(),o=document.querySelectorAll("h1, h2, h3, h4, h5, h6, section, article, [id], [aria-label], [role='heading'], [role='region']");for(let r of o){if(r.closest("[data-yuktai-panel]")||!ae(r))continue;if((r.innerText||r.getAttribute("id")||r.getAttribute("aria-label")||r.getAttribute("name")||"").toLowerCase().includes(t))return r.scrollIntoView({behavior:"smooth",block:"center"}),r.style.outline="2px solid #0d9488",r.style.outlineOffset="4px",setTimeout(()=>{r.style.outline="",r.style.outlineOffset=""},2500),!0}return!1}async function _n(e,t,o){let r=window,a=r.LanguageModel||r.ai?.languageModel;if(!a)throw new Error("Gemini Nano not available");let i=await a.create({systemPrompt:`You are a helpful web accessibility agent.
Create a simple action plan to help a user complete a task on a webpage.
Rules:
- Maximum 5 steps
- Short and clear \u2014 no jargon
- If filling a form \u2014 list each field and what to enter
- No markdown \u2014 no asterisks, no bold, no headers
- Number each step: 1. 2. 3.`}),s=`Page content: ${e}${o?`
The page has form fields the user may need to fill.`:""}

User task: ${t}

Action plan:`,c=await i.prompt(s);return i.destroy(),c?.trim()||""}async function Gn(e,t){let{askPageWithTransformers:o}=await Promise.resolve().then(()=>(xe(),tt));return(await o(`How do I: ${t}`)).answer||"I could not create a plan for this task."}async function Dn(e,t,o){if(!e.trim())return{success:!1,steps:[],error:"Please tell me what you want to do."};if(!t)return{success:!1,steps:[],error:"No AI engine available on this device."};let r=[],a=(i,n="info")=>{let s={text:i,type:n};r.push(s),o(s)};try{a("\u{1F4D6} Reading page content...","info");let i=vo(),n=wo(),s=n.length>0;i.length<50&&a("\u26A0\uFE0F Page content is very limited. This may be a static image page.","error"),a(s?`\u{1F4CB} Found ${n.length} form field${n.length!==1?"s":""} on this page`:"\u{1F4C4} No form fields found \u2014 this appears to be a content page","info"),a("\u{1F916} Creating action plan...","info");let c="";try{t==="gemini"?c=await _n(i,e,s):c=await Gn(i,e)}catch{c=s?`1. Locate the form on this page
2. Fill each required field
3. Review your answers
4. Submit the form`:`1. Read the page carefully
2. Find the section relevant to your task
3. Follow the on-page instructions`}if(c&&(a("\u2705 Your action plan:","success"),c.split(/\n/).map(p=>p.replace(/\*\*/g,"").replace(/\*/g,"").trim()).filter(p=>p.length>5).slice(0,6).forEach(p=>a(`   ${p}`,"action"))),s){let p=n[0];a(`\u{1F3AF} First field: "${p.label}"${p.required?" \u2605 required":""}`,"field"),ko(p.element),n.length>1&&a(`\u{1F4DD} All ${n.length} fields: ${n.map(y=>y.label).join(" \u2192 ")}`,"info")}else{let p=e.toLowerCase().split(/\s+/).filter(g=>g.length>3),y=!1;for(let g of p)if(So(g)){a(`\u{1F3AF} Scrolled to relevant section: "${g}"`,"action"),y=!0;break}y||a("\u{1F4A1} Scroll through the page to find what you need.","info")}return a("\u2705 Ready. Follow the steps above. Ask me again if you need more help.","success"),{success:!0,steps:r}}catch(i){let n=i instanceof Error?i.message:"Agent error.";return a(`\u26A0\uFE0F ${n}`,"error"),{success:!1,steps:r,error:n}}}var To=le(()=>{"use strict";b()});var Kn={};be(Kn,{Runtime:()=>ie,YuktAI:()=>Yn,YuktAIWrapper:()=>He,YuktaiGrid:()=>Eo,aiPlugin:()=>we,default:()=>He,useGrid:()=>We,voicePlugin:()=>ke,wcag:()=>K,wcagPlugin:()=>K});module.exports=$o(Kn);b();b();b();function ft(){let e=window;return e.Rewriter||e.ai?.rewriter||null}async function _e(){try{let e=ft();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}async function Bo(e){if(!e||e.trim().length<20)return{success:!1,original:e,rewritten:e,error:"Text too short"};try{let t=ft();if(!t)throw new Error("Rewriter API not available");let o=await t.create({tone:"more-casual",format:"plain-text",length:"as-is",outputLanguage:"en"}),r=await o.rewrite(e,{context:"Rewrite this text in simple plain English. Use short sentences. Avoid jargon. Make it easy to understand for everyone."});return o.destroy(),{success:!0,original:e,rewritten:r.trim()}}catch(t){return{success:!1,original:e,rewritten:e,error:t instanceof Error?t.message:"Rewrite failed"}}}async function gt(){if(!await _e())return{fixed:0,error:"Chrome Built-in AI Rewriter not available. Enable via chrome://flags."};let t=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption"),o=0;for(let r of t){let a=r.innerText?.trim();if(!a||a.length<20||r.closest("[data-yuktai-panel]"))continue;let i=await Bo(a);i.success&&i.rewritten!==a&&(r.dataset.yuktaiOriginal=a,r.innerText=i.rewritten,o++)}return{fixed:o}}function bt(){let e=document.querySelectorAll("[data-yuktai-original]");for(let t of e){let o=t.dataset.yuktaiOriginal;o&&(t.innerText=o,delete t.dataset.yuktaiOriginal)}}b();var yt="yuktai-summary-box";function ht(){let e=window;return e.Summarizer||e.ai?.summarizer||null}async function Ge(){try{let e=ht();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}function _o(){let e=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, article, section"),t=[];for(let o of e){if(o.closest("[data-yuktai-panel]"))continue;let r=window.getComputedStyle(o);if(r.display==="none"||r.visibility==="hidden")continue;let a=o.innerText?.trim();a&&a.length>10&&t.push(a)}return t.join(" ").slice(0,5e3)}async function xt(){if(!await Ge())return{success:!1,summary:"",error:"Chrome Built-in AI Summarizer not available. Enable via chrome://flags."};let t=_o();if(!t||t.length<100)return{success:!1,summary:"",error:"Not enough text on this page to summarise."};try{let o=ht();if(!o)throw new Error("Summarizer API not available");let r=await o.create({type:"tl;dr",format:"plain-text",length:"short",outputLanguage:"en"}),a=await r.summarize(t,{context:"Summarise this page in 2-3 simple sentences for a screen reader user who wants to know if this page is relevant to them."});return r.destroy(),Go(a.trim()),{success:!0,summary:a.trim()}}catch(o){return{success:!1,summary:"",error:o instanceof Error?o.message:"Summary failed"}}}function Go(e){Le();let t=document.createElement("div");t.id=yt,t.setAttribute("data-yuktai-panel","true"),t.setAttribute("role","region"),t.setAttribute("aria-label","Page summary by yuktai"),t.style.cssText=`
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
  `,r.addEventListener("click",Le),t.appendChild(o),t.appendChild(r),document.body.prepend(t)}function Le(){let e=document.getElementById(yt);e&&e.remove()}b();var Re=[{code:"en",label:"English"},{code:"hi",label:"Hindi"},{code:"es",label:"Spanish"},{code:"fr",label:"French"},{code:"de",label:"German"},{code:"it",label:"Italian"},{code:"pt",label:"Portuguese"},{code:"nl",label:"Dutch"},{code:"pl",label:"Polish"},{code:"ru",label:"Russian"},{code:"ja",label:"Japanese"},{code:"ko",label:"Korean"},{code:"zh",label:"Chinese"},{code:"ar",label:"Arabic"},{code:"tr",label:"Turkish"},{code:"vi",label:"Vietnamese"},{code:"bn",label:"Bengali"},{code:"id",label:"Indonesian"}],Me="en";function Do(){let e=window;return e.Translator||e.translation||null}async function qo(e){try{let t=window;if(!Do())return!1;if(t.Translator&&typeof t.Translator.availability=="function")try{let r=await t.Translator.availability({sourceLanguage:"en",targetLanguage:e});return r==="readily"||r==="available"||r==="downloadable"||r==="after-download"}catch{}return t.Translator&&typeof t.Translator.canTranslate=="function"?await t.Translator.canTranslate({sourceLanguage:"en",targetLanguage:e})!=="no":t.translation&&typeof t.translation.canTranslate=="function"?await t.translation.canTranslate({sourceLanguage:"en",targetLanguage:e})!=="no":!1}catch{return!1}}async function jo(e){let t=window,o={sourceLanguage:"en",targetLanguage:e};if(t.Translator&&typeof t.Translator.create=="function")return await t.Translator.create(o);if(t.translation&&typeof t.translation.createTranslator=="function")return await t.translation.createTranslator(o);throw new Error("Translation API not available")}async function vt(e){if(e===Me)return{success:!0,language:e,fixed:0};if(e==="en")return De(),Me="en",{success:!0,language:"en",fixed:0};if(!await qo(e))return{success:!1,language:e,fixed:0,error:`Translation to ${e} not available. Enable via chrome://flags.`};try{let o=await jo(e),r=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption, span, a"),a=0;for(let i of r){if(i.closest("[data-yuktai-panel]")||i.children.length>0)continue;let n=i.innerText?.trim();if(!n||n.length<2)continue;i.dataset.yuktaiTranslationOriginal||(i.dataset.yuktaiTranslationOriginal=n);let s=await o.translate(n);s&&s!==n&&(i.innerText=s,a++)}return typeof o.destroy=="function"&&o.destroy(),Me=e,{success:!0,language:e,fixed:a}}catch(o){return{success:!1,language:e,fixed:0,error:o instanceof Error?o.message:"Translation failed"}}}function De(){let e=document.querySelectorAll("[data-yuktai-translation-original]");for(let t of e){let o=t.dataset.yuktaiTranslationOriginal;o&&(t.innerText=o,delete t.dataset.yuktaiTranslationOriginal)}Me="en"}b();var Vo=[{phrases:["go to main","skip to main","main content"],action:"focus-main",label:"Jump to main content"},{phrases:["go to navigation","go to nav","open menu"],action:"focus-nav",label:"Jump to navigation"},{phrases:["go to search","search","find"],action:"focus-search",label:"Jump to search"},{phrases:["scroll down","page down","next"],action:"scroll-down",label:"Scroll down"},{phrases:["scroll up","page up","back up"],action:"scroll-up",label:"Scroll up"},{phrases:["go back","previous page"],action:"go-back",label:"Go back"},{phrases:["click","press","select"],action:"click-focused",label:"Click focused element"},{phrases:["next item","tab forward","tab"],action:"tab-forward",label:"Move to next element"},{phrases:["previous item","tab back","shift tab"],action:"tab-back",label:"Move to previous element"},{phrases:["stop listening","stop voice","quiet"],action:"stop-voice",label:"Stop voice control"}],Q=null,Fe=!1,ce=null;function qe(){return!!(window.SpeechRecognition||window.webkitSpeechRecognition)}function Uo(e){let t=e.toLowerCase().trim();for(let o of Vo)for(let r of o.phrases)if(t.includes(r))return{action:o.action,label:o.label};return null}function Yo(e){switch(e){case"focus-main":{let t=document.querySelector("main, [role='main'], #main");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-nav":{let t=document.querySelector("nav, [role='navigation']");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-search":{let t=document.querySelector("input[type='search'], input[role='searchbox'], [aria-label*='search' i]");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"scroll-down":{window.scrollBy({top:400,behavior:"smooth"});break}case"scroll-up":{window.scrollBy({top:-400,behavior:"smooth"});break}case"go-back":{window.history.back();break}case"click-focused":{let t=document.activeElement;t&&t!==document.body&&t.click();break}case"tab-forward":{let t=wt(),o=t.indexOf(document.activeElement),r=t[o+1]||t[0];r&&r.focus();break}case"tab-back":{let t=wt(),o=t.indexOf(document.activeElement),r=t[o-1]||t[t.length-1];r&&r.focus();break}case"stop-voice":{je();break}}}function wt(){return Array.from(document.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(e=>!e.closest("[data-yuktai-panel]"))}function kt(e){if(!qe())return!1;if(Fe)return!0;e&&(ce=e);let t=window.SpeechRecognition||window.webkitSpeechRecognition;return Q=new t,Q.continuous=!0,Q.interimResults=!1,Q.lang="en-US",Q.onresult=o=>{let r=o.results[o.results.length-1][0].transcript,a=Uo(r);if(a){Yo(a.action);let i={success:!0,command:r,action:a.label};if(ce&&ce(i),a.action==="stop-voice")return}},Q.onend=()=>{Fe&&Q?.start()},Q.onerror=o=>{o.error!=="no-speech"&&ce&&ce({success:!1,command:"",action:"",error:`Voice error: ${o.error}`})},Q.start(),Fe=!0,Ko(),!0}function je(){Fe=!1,Q&&(Q.stop(),Q=null),ce=null,At()}var St="yuktai-voice-indicator";function Ko(){At();let e=document.createElement("div");e.id=St,e.setAttribute("data-yuktai-panel","true"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-label","yuktai voice control is listening"),e.style.cssText=`
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
    `,document.head.appendChild(r)}let o=document.createElement("span");o.textContent="Listening for commands...",e.appendChild(t),e.appendChild(o),document.body.appendChild(e)}function At(){let e=document.getElementById(St);e&&e.remove()}b();var Xo=["button:not([aria-label]):not([aria-labelledby])","a:not([aria-label]):not([aria-labelledby])","input:not([aria-label]):not([aria-labelledby]):not([id])","select:not([aria-label]):not([aria-labelledby])","textarea:not([aria-label]):not([aria-labelledby])","[role='button']:not([aria-label])","[role='link']:not([aria-label])","[role='checkbox']:not([aria-label])","[role='tab']:not([aria-label])"].join(", ");function Tt(){let e=window;return e.Writer||e.ai?.writer||null}async function Ve(){try{let e=Tt();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}function Zo(e){let t=[],o=e.innerText?.trim();o&&t.push(`element text: "${o}"`);let r=e.placeholder?.trim();r&&t.push(`placeholder: "${r}"`);let a=e.getAttribute("name")?.trim();a&&t.push(`name: "${a}"`);let i=e.getAttribute("type")?.trim();i&&t.push(`type: "${i}"`);let n=e.id;if(n){let p=document.querySelector(`label[for="${n}"]`);p&&t.push(`label: "${p.innerText?.trim()}"`)}let s=e.parentElement?.innerText?.trim().slice(0,60);s&&t.push(`parent context: "${s}"`),t.push(`tag: ${e.tagName.toLowerCase()}`);let c=e.getAttribute("role");return c&&t.push(`role: ${c}`),t.join(". ")}async function Jo(e,t){let o=`
    Generate a short, clear aria-label for an HTML element.
    The label must be 2-6 words maximum.
    The label must describe what the element does or what it is.
    Do not include punctuation.
    Do not explain \u2014 just output the label text only.

    Element details:
    ${t}

    Output only the label. Nothing else.
  `.trim();return(await e.write(o)).trim().replace(/^["']|["']$/g,"").replace(/\.$/,"").trim()}async function Et(){if(!await Ve())return{success:!1,fixed:0,elements:[],error:"Chrome Built-in AI Writer not available. Enable via chrome://flags."};let t=document.querySelectorAll(Xo);if(t.length===0)return{success:!0,fixed:0,elements:[]};try{let o=Tt();if(!o)throw new Error("Writer API not available");let r=await o.create({tone:"neutral",format:"plain-text",length:"short",outputLanguage:"en"}),a=0,i=[];for(let n of t){if(n.closest("[data-yuktai-panel]"))continue;let s=window.getComputedStyle(n);if(s.display==="none"||s.visibility==="hidden")continue;let c=Zo(n),p=await Jo(r,c);p&&p.length>0&&(n.dataset.yuktaiLabelOriginal=n.getAttribute("aria-label")||"",n.setAttribute("aria-label",p),a++,i.push({tag:n.tagName.toLowerCase(),label:p}))}return r.destroy(),{success:!0,fixed:a,elements:i}}catch(o){return{success:!1,fixed:0,elements:[],error:o instanceof Error?o.message:"Label generation failed"}}}function Ct(){let e=document.querySelectorAll("[data-yuktai-label-original]");for(let t of e){let o=t.dataset.yuktaiLabelOriginal;o?t.setAttribute("aria-label",o):t.removeAttribute("aria-label"),delete t.dataset.yuktaiLabelOriginal}}var ze=null,Lt=null;var Mt=null,Ue=null,I=null,de=null,Pe=null,Ye=null,pe=null,Ne={deuteranopia:"yuktai-cb-d",protanopia:"yuktai-cb-p",tritanopia:"yuktai-cb-t"};var Rt=new Set(["input","select","textarea"]);var Ke={nav:"navigation",header:"banner",footer:"contentinfo",main:"main",aside:"complementary"};function Xe(e,t="polite"){if(typeof window>"u"||!pe?.speechEnabled||!window.speechSynthesis)return;window.speechSynthesis.cancel();let o=new SpeechSynthesisUtterance(e);o.rate=1,o.pitch=1,o.volume=1;let r=window.speechSynthesis.getVoices();r.length>0&&(o.voice=r[0]),window.speechSynthesis.speak(o)}function Wt(e,t="info"){if(typeof document>"u")return;let r={success:{bg:"#0f9d58",border:"#0a7a44",icon:"\u2713"},error:{bg:"#d93025",border:"#b52a1c",icon:"\u2715"},warning:{bg:"#f29900",border:"#c67c00",icon:"\u26A0"},info:{bg:"#1a73e8",border:"#1557b0",icon:"\u2139"}}[t];I||(I=document.createElement("div"),I.setAttribute("role","alert"),I.setAttribute("aria-live","assertive"),I.setAttribute("aria-atomic","true"),I.style.cssText=`
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
    `,document.body.appendChild(I)),I.style.background=r.bg,I.style.border=`1px solid ${r.border}`,I.style.color="#fff",I.innerHTML=`
    <span style="font-size:18px;font-weight:700">${r.icon}</span>
    <span style="flex:1;line-height:1.4">${e}</span>
    <button
      onclick="this.parentElement.style.transform='translateX(120%)';this.parentElement.style.opacity='0'"
      style="background:none;border:none;color:#fff;cursor:pointer;font-size:18px;padding:0;line-height:1"
      aria-label="Close notification">\xD7</button>
  `,window.innerWidth<=480&&(I.style.right="8px",I.style.left="8px",I.style.maxWidth="none",I.style.width="auto"),requestAnimationFrame(()=>{I&&(I.style.transform="translateX(0)",I.style.opacity="1")}),setTimeout(()=>{I&&(I.style.transform="translateX(120%)",I.style.opacity="0")},5e3)}function E(e,t="info",o=!0){ze&&(ze.textContent=e),Wt(e,t),o&&Xe(e,t==="error"?"assertive":"polite")}function Qo(){if(typeof document>"u"||Mt)return;let e=[{label:"Skip to main content",selector:"main,[role='main'],#main,#main-content"},{label:"Skip to navigation",selector:"nav,[role='navigation'],#nav,#navigation"},{label:"Skip to search",selector:"[role='search'],#search,input[type='search']"}],t=document.createElement("div");t.setAttribute("data-yuktai-skip-bar","true"),t.setAttribute("role","navigation"),t.setAttribute("aria-label","Skip links"),t.style.cssText=`
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
  `;let o=!1;if(e.forEach(({label:a,selector:i})=>{let n=document.querySelector(i);if(!n)return;o=!0,n.getAttribute("tabindex")||n.setAttribute("tabindex","-1");let s=document.createElement("a");s.href="#",s.textContent=a,s.style.cssText=`
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
    `,s.addEventListener("focus",()=>{t.style.transform="translateY(0)"}),s.addEventListener("blur",()=>{setTimeout(()=>{t.matches(":focus-within")||(t.style.transform="translateY(-100%)")},2e3)}),s.addEventListener("click",c=>{c.preventDefault(),n.focus(),n.scrollIntoView({behavior:"smooth",block:"start"}),E(`Jumped to ${a.replace("Skip to ","")}`,"info"),t.style.transform="translateY(-100%)"}),t.appendChild(s)}),!o)return;window.innerWidth<768&&(t.style.transform="translateY(0)",t.style.position="sticky"),window.addEventListener("resize",()=>{window.innerWidth<768&&(t.style.transform="translateY(0)")}),document.body.insertBefore(t,document.body.firstChild),Mt=t}function en(){if(typeof document>"u"||document.querySelector("[data-yuktai-focus-style]"))return;let e=document.createElement("style");e.setAttribute("data-yuktai-focus-style","true"),e.textContent=`

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
  `,document.head.appendChild(e),document.documentElement.setAttribute("data-yuktai-a11y","true")}function tn(){typeof document>"u"||document.querySelector("[data-yuktai-kb-init]")||(document.documentElement.setAttribute("data-yuktai-kb-init","true"),document.addEventListener("keydown",e=>{let t=document.activeElement;if(!t)return;let o=t.getAttribute("role")||"";if(e.key==="Escape"){let r=t.closest("[role='dialog'],[role='alertdialog']");if(r){r.style.display="none",E("Dialog closed","info");return}let a=t.closest("[role='menu'],[role='menubar']");a&&(a.style.display="none",E("Menu closed","info"))}if(o==="menuitem"||t.closest("[role='menu'],[role='menubar']")){let r=t.closest("[role='menu'],[role='menubar']");if(!r)return;let a=Array.from(r.querySelectorAll("[role='menuitem']:not([disabled])")),i=a.indexOf(t);e.key==="ArrowDown"||e.key==="ArrowRight"?(e.preventDefault(),a[(i+1)%a.length]?.focus()):e.key==="ArrowUp"||e.key==="ArrowLeft"?(e.preventDefault(),a[(i-1+a.length)%a.length]?.focus()):e.key==="Home"?(e.preventDefault(),a[0]?.focus()):e.key==="End"&&(e.preventDefault(),a[a.length-1]?.focus())}if(o==="tab"||t.closest("[role='tablist']")){let r=t.closest("[role='tablist']");if(!r)return;let a=Array.from(r.querySelectorAll("[role='tab']:not([disabled])")),i=a.indexOf(t);if(e.key==="ArrowRight"||e.key==="ArrowDown"){e.preventDefault();let n=a[(i+1)%a.length];n?.focus(),n?.click()}else if(e.key==="ArrowLeft"||e.key==="ArrowUp"){e.preventDefault();let n=a[(i-1+a.length)%a.length];n?.focus(),n?.click()}}if(o==="option"||t.closest("[role='listbox']")){let r=t.closest("[role='listbox']");if(!r)return;let a=Array.from(r.querySelectorAll("[role='option']:not([aria-disabled='true'])")),i=a.indexOf(t);e.key==="ArrowDown"?(e.preventDefault(),a[(i+1)%a.length]?.focus()):e.key==="ArrowUp"?(e.preventDefault(),a[(i-1+a.length)%a.length]?.focus()):(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),t.setAttribute("aria-selected","true"),a.forEach(n=>{n!==t&&n.setAttribute("aria-selected","false")}),E(`Selected: ${t.textContent?.trim()}`,"success"))}e.altKey&&e.key==="a"&&(e.preventDefault(),on()),e.key==="Tab"&&pe?.speechEnabled&&setTimeout(()=>{let r=document.activeElement;if(!r)return;let a=r.getAttribute("aria-label")||r.getAttribute("title")||r.textContent?.trim()||r.tagName.toLowerCase(),i=r.getAttribute("role")||r.tagName.toLowerCase();Xe(`${a}, ${i}`)},100)}))}function Ie(e){let t=e.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[role="button"]');if(t.length===0)return;let o=t[0],r=t[t.length-1];o.focus(),e.addEventListener("keydown",a=>{a.key==="Tab"&&(a.shiftKey?document.activeElement===o&&(a.preventDefault(),r.focus()):document.activeElement===r&&(a.preventDefault(),o.focus()))})}function on(){if(typeof document>"u")return;if(de){de.remove(),de=null;return}let e=document.createElement("div");e.setAttribute("role","dialog"),e.setAttribute("aria-label","Keyboard shortcuts"),e.setAttribute("aria-modal","true"),e.setAttribute("data-yuktai-cheatsheet","true"),e.style.cssText=`
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
  `,e.querySelector("[data-yuktai-close]")?.addEventListener("click",()=>{e.remove(),de=null}),e.addEventListener("keydown",r=>{r.key==="Escape"&&(e.remove(),de=null)}),document.body.appendChild(e),de=e,Ie(e),E("Keyboard shortcuts opened. Press Escape to close.","info")}function nn(e){if(typeof document>"u"||!pe?.showAuditBadge||typeof window<"u"&&!window.location.hostname.includes("localhost")&&!window.location.hostname.includes("127.0.0.1"))return;Ue&&Ue.remove();let t=e.score,o=t>=90?"#0f9d58":t>=70?"#f29900":"#d93025",r=t>=90?"\u267F":t>=70?"\u26A0":"\u2715",a=document.createElement("button");a.setAttribute("aria-label",`Accessibility score: ${t} out of 100`),a.setAttribute("data-yuktai-badge","true"),a.style.cssText=`
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
  `,a.innerHTML=`${r} ${t}/100 <span style="font-weight:400;opacity:0.85">${e.details.length} issues</span>`,a.addEventListener("click",()=>rn(e)),document.body.appendChild(a),Ue=a}function rn(e){let t=document.querySelector("[data-yuktai-audit-details]");if(t){t.remove();return}let o=document.createElement("div");o.setAttribute("data-yuktai-audit-details","true"),o.setAttribute("role","dialog"),o.setAttribute("aria-label","Accessibility audit details"),o.style.cssText=`
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
  `,o.addEventListener("keydown",a=>{a.key==="Escape"&&o.remove()}),document.body.appendChild(o),Ie(o)}function Ot(e){typeof document>"u"||(Ye&&clearTimeout(Ye),Ye=setTimeout(()=>{if(Pe)return;let t=document.createElement("div");t.setAttribute("role","alertdialog"),t.setAttribute("aria-label","Session timeout warning"),t.setAttribute("aria-modal","true"),t.setAttribute("data-yuktai-timeout","true"),t.style.cssText=`
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
    `;let o=t.querySelector("[data-yuktai-extend]"),r=t.querySelector("[data-yuktai-dismiss]");o?.addEventListener("click",()=>{t.remove(),Pe=null,E("Session extended. You have more time.","success"),pe?.timeoutWarning&&Ot(pe.timeoutWarning)}),r?.addEventListener("click",()=>{t.remove(),Pe=null}),document.body.appendChild(t),Pe=t,Ie(t),E("Warning: Your session will expire soon. Do you need more time?","warning")},e*1e3))}function an(e){if(typeof document>"u")return;let t=document.documentElement;if(t.toggleAttribute("data-yuktai-high-contrast",!!e.highContrast),t.toggleAttribute("data-yuktai-dark",!!e.darkMode),t.toggleAttribute("data-yuktai-reduce-motion",!!e.reduceMotion),t.toggleAttribute("data-yuktai-large-targets",!!e.largeTargets),t.toggleAttribute("data-yuktai-keyboard",!!e.keyboardHints),t.toggleAttribute("data-yuktai-dyslexia",!!e.dyslexiaFont),e.localFont?document.body.style.fontFamily=`"${e.localFont}", system-ui, sans-serif`:e.dyslexiaFont||(document.body.style.fontFamily=""),e.fontSizeMultiplier&&e.fontSizeMultiplier!==1?document.documentElement.style.fontSize=`${e.fontSizeMultiplier*100}%`:document.documentElement.style.fontSize="",e.colorBlindMode&&e.colorBlindMode!=="none"){let o=e.colorBlindMode==="achromatopsia"?"grayscale(100%)":`url(#${Ne[e.colorBlindMode]})`;document.body.style.filter=o}else document.body.style.filter=""}function sn(e){try{let t=localStorage.getItem("yuktai-a11y-prefs");t&&Object.assign(e,JSON.parse(t))}catch{}}async function Ft(e){if(e){if(!await _e()){E("Plain English requires Chrome 127+","warning");return}E("Rewriting page in plain English...","info",!1);let o=await gt();E(o.error?`Plain English failed: ${o.error}`:`${o.fixed} sections rewritten in plain English`,o.error?"error":"success",!1)}else bt(),E("Original text restored","info",!1)}async function Pt(e){if(e){if(!await Ge()){E("Page summariser requires Chrome 127+","warning");return}E("Generating page summary...","info",!1);let o=await xt();E(o.error?`Summary failed: ${o.error}`:"Page summary added at top",o.error?"error":"success",!1)}else Le(),E("Page summary removed","info",!1)}async function Nt(e){if(e==="en"){De(),E("Page restored to English","info",!1);return}E(`Translating page to ${e}...`,"info",!1);let t=await vt(e);E(t.error?`Translation failed: ${t.error}`:`Page translated to ${e}`,t.error?"error":"success",!1)}async function zt(e){if(e){if(!qe()){E("Voice control not supported in this browser","warning");return}kt(t=>{t.success&&E(`Voice: ${t.action}`,"info",!1)}),E("Voice control started. Say a command.","success",!1)}else je(),E("Voice control stopped","info",!1)}async function It(e){if(e){if(!await Ve()){E("Smart labels requires Chrome 127+","warning");return}E("Generating smart labels...","info",!1);let o=await Et();E(o.error?`Smart labels failed: ${o.error}`:`${o.fixed} elements labelled`,o.error?"error":"success",!1)}else Ct(),E("Smart labels removed","info",!1)}function ln(){if(typeof document>"u"||ze)return;let e=document.createElement("div");e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e.setAttribute("aria-relevant","text"),e.style.cssText="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);",document.body.appendChild(e),ze=e}function cn(){if(typeof document>"u"||Lt)return;let e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("aria-hidden","true"),e.style.cssText="position:absolute;width:0;height:0;overflow:hidden;",e.innerHTML=`
    <defs>
      <filter id="${Ne.deuteranopia}">
        <feColorMatrix type="matrix"
          values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${Ne.protanopia}">
        <feColorMatrix type="matrix"
          values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${Ne.tritanopia}">
        <feColorMatrix type="matrix"
          values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"/>
      </filter>
    </defs>
  `,document.body.appendChild(e),Lt=e}function Ht(e){let t={critical:20,serious:10,moderate:5,minor:2},o=e.details.reduce((r,a)=>r+(t[a.severity]||0),0);return Math.max(0,Math.min(100,100-o))}var K={name:"yuktai-a11y",version:"4.0.0",observer:null,async execute(e){if(!e.enabled)return this.stopObserver(),"yuktai: disabled.";pe=e,sn(e),ln(),cn(),en(),tn(),e.showSkipLinks!==!1&&Qo(),e.showPreferencePanel,an(e);let t=this.applyFixes(e);t.score=Ht(t),e.showAuditBadge&&nn(t),e.timeoutWarning&&Ot(e.timeoutWarning),e.autoFix&&this.startObserver(e),e.plainEnglish&&await Ft(!0),e.summarisePage&&await Pt(!0),e.translateLanguage&&e.translateLanguage!=="en"&&await Nt(e.translateLanguage),e.voiceControl&&await zt(!0),e.smartLabels&&await It(!0);let o=`${t.fixed} fixes applied. Score: ${t.score}/100.`;return E(o,t.score>=90?"success":"info",!1),`yuktai v4.0.0: ${o} Scanned ${t.scanned} elements in ${t.renderTime}ms.`},applyFixes(e){let t={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return t;let o=performance.now(),r=document.querySelectorAll("*");t.scanned=r.length;let a=(i,n,s,c)=>{t.details.push({tag:i,fix:n,severity:s,element:c.outerHTML.slice(0,100)}),t.fixed++};return r.forEach(i=>{let n=i,s=n.tagName.toLowerCase();if(s==="html"&&!n.getAttribute("lang")&&(n.setAttribute("lang","en"),a(s,'lang="en" added',"critical",n)),s==="meta"){let p=n.getAttribute("name"),y=n.getAttribute("content")||"";p==="viewport"&&y.includes("user-scalable=no")&&(n.setAttribute("content",y.replace("user-scalable=no","user-scalable=yes")),a(s,"user-scalable=yes restored","serious",n)),p==="viewport"&&/maximum-scale=1(?:[^0-9]|$)/.test(y)&&(n.setAttribute("content",y.replace(/maximum-scale=1(?=[^0-9]|$)/,"maximum-scale=5")),a(s,"maximum-scale=5 restored","serious",n))}if(s==="main"&&!n.getAttribute("tabindex")&&(n.setAttribute("tabindex","-1"),n.getAttribute("id")||n.setAttribute("id","main-content")),s==="img"&&(n.hasAttribute("alt")||(n.setAttribute("alt",""),n.setAttribute("aria-hidden","true"),a(s,'alt="" aria-hidden="true"',"serious",n))),s==="svg"&&(!n.getAttribute("aria-hidden")&&!n.getAttribute("aria-label")&&!i.querySelector("title")&&(n.setAttribute("aria-hidden","true"),a(s,'aria-hidden="true" (decorative svg)',"minor",n)),n.getAttribute("focusable")||n.setAttribute("focusable","false")),s==="iframe"&&!n.getAttribute("title")&&!n.getAttribute("aria-label")&&(n.setAttribute("title","embedded content"),n.setAttribute("aria-label","embedded content"),a(s,"title + aria-label added","serious",n)),s==="button"){if(!n.innerText?.trim()&&!n.getAttribute("aria-label")){let p=n.getAttribute("title")||"button";n.setAttribute("aria-label",p),a(s,`aria-label="${p}" (empty button)`,"critical",n)}n.hasAttribute("disabled")&&!n.getAttribute("aria-disabled")&&(n.setAttribute("aria-disabled","true"),t.fixed++)}if(s==="a"){let p=n;!n.innerText?.trim()&&!n.getAttribute("aria-label")&&(n.setAttribute("aria-label",n.getAttribute("title")||"link"),a(s,"aria-label added (empty link)","critical",n)),p.target==="_blank"&&!p.rel?.includes("noopener")&&(p.rel="noopener noreferrer",t.fixed++)}if(Rt.has(s)){let p=n;if(!n.getAttribute("aria-label")&&!n.getAttribute("aria-labelledby")){let y=n.getAttribute("placeholder")||n.getAttribute("name")||s;n.setAttribute("aria-label",y),a(s,`aria-label="${y}"`,"serious",n)}if(n.hasAttribute("required")&&!n.getAttribute("aria-required")&&(n.setAttribute("aria-required","true"),t.fixed++),s==="input"&&!p.autocomplete){let y=p.name||"";p.type==="email"||y.includes("email")?p.autocomplete="email":p.type==="tel"||y.includes("tel")?p.autocomplete="tel":p.type==="password"&&(p.autocomplete="current-password"),t.fixed++}}s==="th"&&!n.getAttribute("scope")&&(n.setAttribute("scope",n.closest("thead")?"col":"row"),a(s,"scope added to <th>","moderate",n)),Ke[s]&&!n.getAttribute("role")&&(n.setAttribute("role",Ke[s]),a(s,`role="${Ke[s]}"`,"minor",n));let c=n.getAttribute("role")||"";c==="tab"&&!n.getAttribute("aria-selected")&&(n.setAttribute("aria-selected","false"),t.fixed++),["alert","status","log"].includes(c)&&!n.getAttribute("aria-live")&&(n.setAttribute("aria-live",c==="alert"?"assertive":"polite"),a(s,`aria-live added on role=${c}`,"moderate",n)),c==="combobox"&&!n.getAttribute("aria-expanded")&&(n.setAttribute("aria-expanded","false"),a(s,'aria-expanded="false" on combobox',"serious",n)),(c==="checkbox"||c==="radio")&&!n.getAttribute("aria-checked")&&(n.setAttribute("aria-checked","false"),a(s,`aria-checked="false" on role=${c}`,"serious",n))}),t.renderTime=parseFloat((performance.now()-o).toFixed(2)),t},scan(){let e={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return e;let t=performance.now(),o=document.querySelectorAll("*");e.scanned=o.length;let r=(a,i,n,s)=>e.details.push({tag:a,fix:i,severity:n,element:s.outerHTML.slice(0,100)});return o.forEach(a=>{let i=a,n=i.tagName.toLowerCase();(n==="a"||n==="button")&&!i.innerText?.trim()&&!i.getAttribute("aria-label")&&r(n,"needs aria-label (empty)","critical",i),n==="img"&&!i.hasAttribute("alt")&&r(n,"needs alt text","serious",i),Rt.has(n)&&!i.getAttribute("aria-label")&&!i.getAttribute("aria-labelledby")&&r(n,"needs aria-label","serious",i),n==="iframe"&&!i.getAttribute("title")&&!i.getAttribute("aria-label")&&r(n,"iframe needs title","serious",i)}),e.fixed=e.details.length,e.score=Ht(e),e.renderTime=parseFloat((performance.now()-t).toFixed(2)),e},startObserver(e){this.observer||typeof document>"u"||(this.observer=new MutationObserver(()=>this.applyFixes(e)),this.observer.observe(document.body,{childList:!0,subtree:!0,attributes:!1}))},stopObserver(){this.observer?.disconnect(),this.observer=null},announce:E,speak:Xe,showVisualAlert:Wt,trapFocus:Ie,handlePlainEnglish:Ft,handleSummarisePage:Pt,handleTranslate:Nt,handleVoiceControl:zt,handleSmartLabels:It,SUPPORTED_LANGUAGES:Re};b();b();var v=Be(require("react"));b();var j=require("react");Je();xe();var l=require("react/jsx-runtime"),ot={highContrast:!1,reduceMotion:!1,autoFix:!0,dyslexiaFont:!1,fontScale:100,localFont:"",darkMode:!1,largeTargets:!1,speechEnabled:!1,colorBlindMode:"none",showAuditBadge:!1,timeoutWarning:void 0,plainEnglish:!1,summarisePage:!1,translateLanguage:"en",voiceControl:!1,smartLabels:!1},me=[80,90,100,110,120,130],xn=[{value:"none",label:"None"},{value:"deuteranopia",label:"Deuteranopia"},{value:"protanopia",label:"Protanopia"},{value:"tritanopia",label:"Tritanopia"},{value:"achromatopsia",label:"Greyscale"}],vn=["Prompt API for Gemini Nano","Summarization API for Gemini Nano","Writer API for Gemini Nano","Rewriter API for Gemini Nano","Translation API"];function wn(){let[e,t]=(0,j.useState)(typeof window<"u"?window.innerWidth:1024);return(0,j.useEffect)(()=>{let o=()=>t(window.innerWidth);return window.addEventListener("resize",o),()=>window.removeEventListener("resize",o)},[]),{isMobile:e<=480,isTablet:e>480&&e<=768}}function kn({checked:e,onChange:t,label:o,disabled:r=!1}){return(0,l.jsxs)("label",{"aria-label":o,style:{position:"relative",display:"inline-flex",width:"40px",height:"24px",cursor:r?"not-allowed":"pointer",flexShrink:0,opacity:r?.4:1},children:[(0,l.jsx)("input",{type:"checkbox",checked:e,disabled:r,onChange:a=>t(a.target.checked),style:{opacity:0,width:0,height:0,position:"absolute"}}),(0,l.jsx)("span",{style:{position:"absolute",inset:0,borderRadius:"99px",background:e?"#0d9488":"#cbd5e1",transition:"background 0.2s"}}),(0,l.jsx)("span",{style:{position:"absolute",top:"3px",left:e?"19px":"3px",width:"18px",height:"18px",background:"#fff",borderRadius:"50%",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)",pointerEvents:"none"}})]})}function fe({label:e,color:t="#64748b",badge:o,concept:r}){return(0,l.jsxs)("div",{style:{margin:"10px 18px 4px"},children:[(0,l.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[(0,l.jsx)("p",{style:{margin:0,fontSize:"10px",fontWeight:600,color:t,letterSpacing:"0.06em",textTransform:"uppercase"},children:e}),o&&(0,l.jsx)("span",{style:{fontSize:"9px",fontWeight:500,padding:"1px 7px",borderRadius:"99px",background:"#f5f3ff",color:"#7c3aed",border:"0.5px solid #c4b5fd",whiteSpace:"nowrap"},children:o})]}),r&&(0,l.jsx)("p",{style:{margin:"2px 0 0",fontSize:"9px",color:"#94a3b8",fontStyle:"italic"},children:r})]})}function ee({icon:e,label:t,desc:o,checked:r,onChange:a,disabled:i=!1,disabledReason:n,tip:s}){return(0,l.jsxs)("div",{title:i?n:s,style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 18px",gap:"12px"},children:[(0,l.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"10px",flex:1,minWidth:0},children:[(0,l.jsx)("span",{"aria-hidden":"true",style:{width:"32px",height:"32px",borderRadius:"8px",background:i?"#f1f5f9":"#f0fdfa",color:i?"#94a3b8":"#0d9488",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"15px",flexShrink:0,fontWeight:700},children:e}),(0,l.jsxs)("div",{style:{minWidth:0},children:[(0,l.jsx)("p",{style:{margin:0,fontSize:"13px",fontWeight:500,color:i?"#94a3b8":"#0f172a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:t}),(0,l.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#94a3b8"},children:i?n:o})]})]}),(0,l.jsx)(kn,{checked:r,onChange:a,label:`Toggle ${t}`,disabled:i})]})}function q(){return(0,l.jsx)("div",{style:{height:"1px",background:"#f1f5f9"}})}function ve({steps:e}){return(0,l.jsxs)("div",{style:{margin:"0 18px 8px",padding:"8px 10px",background:"#f8fafc",borderRadius:"8px",border:"0.5px solid #e2e8f0"},children:[(0,l.jsx)("p",{style:{margin:"0 0 4px",fontSize:"9px",fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.05em"},children:"How to use"}),e.map((t,o)=>(0,l.jsxs)("p",{style:{margin:"0 0 2px",fontSize:"10px",color:"#475569"},children:[o+1,". ",t]},o))]})}var nt=(0,j.forwardRef)(({position:e,settings:t,report:o,isActive:r,aiSupported:a,voiceSupported:i,set:n,onApply:s,onReset:c,onClose:p},y)=>{let{isMobile:g,isTablet:V}=wn(),[$,G]=(0,j.useState)([]),[L,w]=(0,j.useState)(""),[P,M]=(0,j.useState)(""),[C,B]=(0,j.useState)(!1),[x,R]=(0,j.useState)(null),[H,O]=(0,j.useState)("idle");(0,j.useEffect)(()=>{let d=window;!!(d.LanguageModel||d.ai?.languageModel)&&a?R("gemini"):ye()&&R("transformers")},[a]),(0,j.useEffect)(()=>{if(x!=="transformers")return;let d=setInterval(()=>{O(he())},500);return()=>clearInterval(d)},[x]);let A=async()=>{if(!(!L.trim()||C)){if(!x){M("\u26A0\uFE0F No AI engine available on this device.");return}B(!0),M("");try{let d;x==="gemini"?d=await Ze(L):(O("loading"),d=await et(L),O("ready")),M(d.success&&d.answer?d.answer.replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/#+\s/g,"").trim():"\u26A0\uFE0F "+(d.error||"No answer found on this page"))}catch{M("\u26A0\uFE0F Failed to get answer. Please try again.")}B(!1)}};(0,j.useEffect)(()=>{(async()=>{try{let J=window;if(!J.queryLocalFonts)return;let T=await J.queryLocalFonts(),U=[...new Set(T.map(oe=>oe.family))].sort();G(U.slice(0,50))}catch{}})()},[]);let S=x==="gemini"?"Gemini Nano":x==="transformers"?"Transformers.js \xB7 All devices":"Detecting...",Z=x==="transformers"&&H==="loading"?"Loading AI model... (first time only)":"...",te=g?{position:"fixed",bottom:0,left:0,right:0,zIndex:9999,background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px 16px 0 0",boxShadow:"0 -8px 32px rgba(0,0,0,0.12)",maxHeight:"90vh",overflowY:"auto",fontFamily:"system-ui,-apple-system,sans-serif",width:"100%"}:{position:"fixed",bottom:"84px",[e]:"24px",zIndex:9999,width:V?"300px":"320px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",maxHeight:"80vh",overflowY:"auto",fontFamily:"system-ui,-apple-system,sans-serif"};return(0,l.jsxs)("div",{ref:y,role:"dialog","aria-modal":"true","aria-label":"yuktai accessibility preferences","data-yuktai-panel":"true",style:te,children:[(0,l.jsxs)("div",{style:{padding:"14px 18px 12px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"flex-start",justifyContent:"space-between",position:"sticky",top:0,background:"#fff",zIndex:1},children:[(0,l.jsxs)("div",{children:[(0,l.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"7px",marginBottom:"4px",flexWrap:"wrap"},children:[(0,l.jsx)("span",{style:{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0d9488",letterSpacing:"0.05em",fontFamily:"monospace"},children:"@yuktishaalaa/yuktai"}),r&&(0,l.jsx)("span",{style:{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0f766e",border:"1px solid #99f6e4"},children:"\u25CF ACTIVE"})]}),(0,l.jsx)("p",{style:{margin:"0 0 1px",fontSize:"15px",fontWeight:600,color:"#0f172a"},children:"Accessibility"}),(0,l.jsx)("p",{style:{margin:0,fontSize:"11px",color:"#64748b"},children:"WCAG 2.2 \xB7 Open source \xB7 Zero cost \xB7 All devices"})]}),(0,l.jsx)("button",{onClick:p,"aria-label":"Close accessibility panel",style:{background:"none",border:"none",cursor:"pointer",padding:"4px",color:"#94a3b8",fontSize:"20px",lineHeight:1,borderRadius:"6px",flexShrink:0,minWidth:g?"44px":"auto",minHeight:g?"44px":"auto",display:"flex",alignItems:"center",justifyContent:"center"},children:"\xD7"})]}),(0,l.jsx)(fe,{label:"\u267F Core Accessibility",concept:"Rule-based engine \u2014 works on all browsers and devices"}),(0,l.jsx)(ve,{steps:["Toggle any feature on","Click Apply settings","Preferences saved automatically"]}),(0,l.jsx)(ee,{icon:"\u{1F527}",label:"Auto-fix ARIA",desc:"Injects missing labels and roles automatically",checked:t.autoFix,onChange:d=>n("autoFix",d),tip:"Fixes aria-label, alt text, roles on every element"}),(0,l.jsx)(q,{}),(0,l.jsx)(ee,{icon:"\u{1F50A}",label:"Speak on focus",desc:"Browser reads elements aloud as you tab",checked:t.speechEnabled,onChange:d=>n("speechEnabled",d),tip:"Uses browser SpeechSynthesis \u2014 no install needed"}),(0,l.jsx)(q,{}),(0,l.jsx)(ee,{icon:"\u{1F399}\uFE0F",label:"Voice control",desc:"Say commands to navigate the page",checked:t.voiceControl,onChange:d=>n("voiceControl",d),disabled:!i,disabledReason:"Not supported in this browser",tip:'Say "scroll down", "go to main", "click"'}),(0,l.jsx)(q,{}),(0,l.jsx)(fe,{label:"\u{1F916} AI Features",color:"#7c3aed",badge:"Gemini Nano",concept:"Large Language Model running privately on your device \u2014 Chrome 127+ only"}),(0,l.jsx)("div",{style:{margin:"4px 18px 6px",padding:"8px 10px",background:a?"#f0fdfa":"#f5f3ff",borderRadius:"8px",border:`0.5px solid ${a?"#99f6e4":"#c4b5fd"}`,fontSize:"10px",color:a?"#0f766e":"#7c3aed",lineHeight:1.5},children:a?"\u2705 Gemini Nano detected \u2014 AI features ready. Runs privately on your device.":"\u2699\uFE0F AI features need one-time setup \u2014 see guide below."}),!a&&(0,l.jsxs)("div",{style:{margin:"0 18px 8px",padding:"10px 12px",background:"#fafafa",borderRadius:"8px",border:"0.5px solid #e2e8f0",fontSize:"11px",color:"#475569",lineHeight:1.7},children:[(0,l.jsx)("p",{style:{margin:"0 0 6px",fontWeight:600,color:"#0f172a",fontSize:"11px"},children:"\u{1F6E0} One-time setup \u2014 5 steps:"}),(0,l.jsxs)("p",{style:{margin:"0 0 3px"},children:["1. Open Chrome \u2192 ",(0,l.jsx)("code",{style:{background:"#f1f5f9",padding:"1px 5px",borderRadius:"4px",fontSize:"10px",color:"#0d9488",fontFamily:"monospace"},children:"chrome://flags"})]}),(0,l.jsx)("p",{style:{margin:"0 0 3px"},children:"2. Enable each flag:"}),(0,l.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"2px",margin:"4px 0 6px 10px"},children:vn.map(d=>(0,l.jsxs)("span",{style:{fontSize:"10px",color:"#7c3aed",fontFamily:"monospace"},children:["\u2192 ",d]},d))}),(0,l.jsxs)("p",{style:{margin:"0 0 3px"},children:["3. Click ",(0,l.jsx)("strong",{style:{color:"#0f172a"},children:"Relaunch"})]}),(0,l.jsxs)("p",{style:{margin:"0 0 3px"},children:["4. ",(0,l.jsx)("code",{style:{background:"#f1f5f9",padding:"1px 5px",borderRadius:"4px",fontSize:"10px",color:"#0d9488",fontFamily:"monospace"},children:"chrome://components"})," \u2192 Optimization Guide On Device Model \u2192 Check for update"]}),(0,l.jsx)("p",{style:{margin:"0"},children:"5. Refresh \u2014 AI features unlock automatically \u2705"})]}),(0,l.jsx)(ee,{icon:"\u{1F4DD}",label:"Plain English mode",desc:"Rewrites complex text in simple language",checked:t.plainEnglish,onChange:d=>n("plainEnglish",d),disabled:!a,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: LLM text rewriting"}),(0,l.jsx)(q,{}),(0,l.jsx)(ee,{icon:"\u{1F4CB}",label:"Summarise page",desc:"3-sentence summary appears at top",checked:t.summarisePage,onChange:d=>n("summarisePage",d),disabled:!a,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: Abstractive summarisation"}),(0,l.jsx)(q,{}),(0,l.jsx)(ee,{icon:"\u{1F3F7}\uFE0F",label:"Smart aria-labels",desc:"AI generates meaningful labels for elements",checked:t.smartLabels,onChange:d=>n("smartLabels",d),disabled:!a,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: Context-aware label generation"}),(0,l.jsx)(q,{}),(0,l.jsx)(fe,{label:"\u{1F441}\uFE0F Visual",concept:"CSS filter-based \u2014 works on all browsers and devices"}),(0,l.jsx)(ve,{steps:["Toggle any visual mode","Changes apply instantly","Works on mobile and desktop"]}),(0,l.jsx)(ee,{icon:"\u25D1",label:"High contrast",desc:"Boosts contrast for low vision users",checked:t.highContrast,onChange:d=>n("highContrast",d),tip:"CSS filter: contrast()"}),(0,l.jsx)(q,{}),(0,l.jsx)(ee,{icon:"\u{1F319}",label:"Dark mode",desc:"Inverts colours \u2014 easy on eyes at night",checked:t.darkMode,onChange:d=>n("darkMode",d),tip:"CSS filter: invert + hue-rotate"}),(0,l.jsx)(q,{}),(0,l.jsx)(ee,{icon:"\u23F8\uFE0F",label:"Reduce motion",desc:"Disables all animations",checked:t.reduceMotion,onChange:d=>n("reduceMotion",d),tip:"WCAG 2.3.3 \u2014 vestibular disorders"}),(0,l.jsx)(q,{}),(0,l.jsx)(ee,{icon:"\u{1F446}",label:"Large targets",desc:"44\xD744px minimum touch targets",checked:t.largeTargets,onChange:d=>n("largeTargets",d),tip:"WCAG 2.5.8 \u2014 motor impaired users"}),(0,l.jsx)(q,{}),(0,l.jsxs)("div",{style:{padding:"10px 18px"},children:[(0,l.jsx)("p",{style:{margin:"0 0 2px",fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F3A8} Colour blindness"}),(0,l.jsx)("p",{style:{margin:"0 0 8px",fontSize:"10px",color:"#94a3b8"},children:"SVG colour matrix filters \u2014 all devices"}),(0,l.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"},children:xn.map(d=>(0,l.jsx)("button",{onClick:()=>n("colorBlindMode",d.value),"aria-pressed":t.colorBlindMode===d.value,style:{padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500,border:`1px solid ${t.colorBlindMode===d.value?"#0d9488":"#e2e8f0"}`,background:t.colorBlindMode===d.value?"#f0fdfa":"#fff",color:t.colorBlindMode===d.value?"#0d9488":"#64748b",cursor:"pointer",minHeight:g?"36px":"auto"},children:d.label},d.value))})]}),(0,l.jsx)(q,{}),(0,l.jsx)(fe,{label:"\u{1F524} Font",concept:"Browser Font API + CSS \u2014 Chrome 103+"}),(0,l.jsx)(ve,{steps:["Toggle dyslexia font or pick from device","Adjust size with + / \u2212","Saved across visits"]}),(0,l.jsx)(ee,{icon:"Aa",label:"Dyslexia-friendly font",desc:"Atkinson Hyperlegible \u2014 research-backed",checked:t.dyslexiaFont,onChange:d=>n("dyslexiaFont",d),tip:"By Braille Institute \u2014 free and open source"}),(0,l.jsx)(q,{}),(0,l.jsxs)("div",{style:{padding:"10px 18px"},children:[(0,l.jsx)("p",{style:{margin:"0 0 2px",fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F5A5}\uFE0F Local font"}),(0,l.jsx)("p",{style:{margin:"0 0 8px",fontSize:"10px",color:"#94a3b8"},children:"window.queryLocalFonts() \u2014 Chrome 103+"}),$.length>0?(0,l.jsxs)("select",{value:t.localFont,onChange:d=>n("localFont",d.target.value),"aria-label":"Choose a font from your device",style:{width:"100%",padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"13px",color:"#0f172a",background:"#fff",cursor:"pointer",height:g?"44px":"36px"},children:[(0,l.jsx)("option",{value:"",children:"System default"}),$.map(d=>(0,l.jsx)("option",{value:d,style:{fontFamily:d},children:d},d))]}):(0,l.jsx)("p",{style:{margin:0,fontSize:"11px",color:"#94a3b8"},children:"Allow font access when Chrome prompts you."})]}),(0,l.jsx)(q,{}),(0,l.jsxs)("div",{style:{padding:"10px 18px 14px"},children:[(0,l.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"10px"},children:[(0,l.jsxs)("div",{children:[(0,l.jsx)("p",{style:{margin:0,fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F4CF} Text size"}),(0,l.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#94a3b8"},children:"Scales all text on the page"})]}),(0,l.jsxs)("span",{style:{fontSize:"12px",fontWeight:600,color:"#0d9488",background:"#f0fdfa",padding:"2px 8px",borderRadius:"99px"},children:[t.fontScale,"%"]})]}),(0,l.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[(0,l.jsx)("button",{onClick:()=>{let d=me.indexOf(t.fontScale);d>0&&n("fontScale",me[d-1])},disabled:t.fontScale<=80,"aria-label":"Decrease text size",style:{width:g?"44px":"30px",height:g?"44px":"30px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:t.fontScale<=80?"not-allowed":"pointer",fontSize:"16px",color:t.fontScale<=80?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"\u2212"}),(0,l.jsx)("div",{style:{flex:1,display:"flex",gap:"3px"},children:me.map(d=>(0,l.jsx)("button",{onClick:()=>n("fontScale",d),"aria-label":`Set text size to ${d}%`,style:{flex:1,height:"6px",borderRadius:"99px",border:"none",cursor:"pointer",padding:0,background:d<=t.fontScale?"#0d9488":"#e2e8f0",transition:"background 0.15s"}},d))}),(0,l.jsx)("button",{onClick:()=>{let d=me.indexOf(t.fontScale);d<me.length-1&&n("fontScale",me[d+1])},disabled:t.fontScale>=130,"aria-label":"Increase text size",style:{width:g?"44px":"30px",height:g?"44px":"30px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:t.fontScale>=130?"not-allowed":"pointer",fontSize:"16px",color:t.fontScale>=130?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"+"})]})]}),(0,l.jsx)(q,{}),(0,l.jsx)(fe,{label:"\u{1F310} Translate",color:"#7c3aed",badge:"Gemini Nano",concept:"Chrome Translation API \u2014 on device, no internet after setup"}),(0,l.jsx)(ve,{steps:["Enable Gemini Nano first","Pick your language","Full page translates instantly"]}),(0,l.jsxs)("div",{style:{padding:"6px 18px 12px"},children:[(0,l.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"},children:Re.slice(0,g?8:18).map(d=>(0,l.jsx)("button",{onClick:()=>n("translateLanguage",d.code),"aria-pressed":t.translateLanguage===d.code,disabled:!a,style:{padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500,border:`1px solid ${t.translateLanguage===d.code?"#7c3aed":"#e2e8f0"}`,background:t.translateLanguage===d.code?"#f5f3ff":"#fff",color:t.translateLanguage===d.code?"#7c3aed":"#64748b",cursor:a?"pointer":"not-allowed",opacity:a?1:.5,minHeight:g?"36px":"auto"},children:d.label},d.code))}),!a&&(0,l.jsx)("p",{style:{margin:"6px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Enable Gemini Nano using the setup guide above."})]}),(0,l.jsx)(q,{}),(0,l.jsx)(fe,{label:"\u{1F4AC} Ask This Page",color:"#0d9488",badge:S,concept:"RAG \u2014 Retrieval Augmented Generation. Works on all devices including mobile."}),(0,l.jsx)(ve,{steps:["Type any question about this page","Press Ask or hit Enter",x==="transformers"?"Transformers.js answers \u2014 works on mobile, offline":"Gemini Nano reads page and answers privately","Zero cost. No data leaves your device."]}),(0,l.jsxs)("div",{style:{margin:"0 18px 8px",padding:"6px 10px",background:x==="gemini"?"#f0fdfa":x==="transformers"?"#f5f3ff":"#f8fafc",borderRadius:"8px",border:`0.5px solid ${x==="gemini"?"#99f6e4":x==="transformers"?"#c4b5fd":"#e2e8f0"}`,fontSize:"10px",color:x==="gemini"?"#0f766e":x==="transformers"?"#7c3aed":"#94a3b8"},children:[x==="gemini"&&"\u2705 Using Gemini Nano \u2014 on device, private, instant",x==="transformers"&&"\u2705 Using Transformers.js \u2014 works on mobile and all browsers",!x&&"\u23F3 Detecting AI engine...",x==="transformers"&&H==="loading"&&" \xB7 Loading model...",x==="transformers"&&H==="ready"&&" \xB7 Model ready \u2705"]}),(0,l.jsxs)("div",{style:{padding:"0 18px 14px"},children:[(0,l.jsxs)("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[(0,l.jsx)("input",{type:"text",value:L,onChange:d=>w(d.target.value),onKeyDown:d=>{d.key==="Enter"&&A()},placeholder:"e.g. What does this page do?",disabled:C||!x,"aria-label":"Ask a question about this page",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:x?"#fff":"#f8fafc",outline:"none",height:g?"44px":"36px"}}),(0,l.jsx)("button",{onClick:A,disabled:C||!L.trim()||!x,"aria-label":"Ask question",style:{padding:"8px 14px",borderRadius:"8px",border:"none",background:x&&L.trim()&&!C?"#0d9488":"#e2e8f0",color:x&&L.trim()&&!C?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:x&&L.trim()&&!C?"pointer":"not-allowed",flexShrink:0,height:g?"44px":"36px",minWidth:"52px",transition:"background 0.2s"},children:C?Z:"Ask"})]}),P&&(0,l.jsxs)("div",{role:"status","aria-live":"polite",style:{padding:"10px 12px",background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"8px",fontSize:"12px",color:"#0f766e",lineHeight:1.6,maxHeight:"180px",overflowY:"auto"},children:[(0,l.jsx)("strong",{style:{display:"block",marginBottom:"4px",fontSize:"11px",color:"#0d9488"},children:"\u{1F4AC} Answer"}),P,(0,l.jsx)("button",{onClick:()=>{M(""),w("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]})]}),o&&(0,l.jsx)("div",{role:"status",style:{margin:"0 14px 10px",padding:"8px 12px",background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"8px",fontSize:"12px",color:"#0f766e",fontWeight:500,fontFamily:"monospace"},children:o.fixed>0?`\u2713 ${o.fixed} fixes \xB7 ${o.scanned} nodes \xB7 ${o.renderTime}ms \xB7 Score: ${o.score}/100`:`\u2713 0 auto-fixes needed \xB7 ${o.scanned} nodes \xB7 ${o.renderTime}ms`}),(0,l.jsxs)("div",{style:{display:"flex",gap:"8px",padding:"12px 14px 14px",position:g?"sticky":"relative",bottom:g?0:"auto",background:"#fff",borderTop:"1px solid #f1f5f9"},children:[(0,l.jsx)("button",{onClick:c,style:{flex:1,padding:g?"12px 0":"8px 0",fontSize:"13px",fontWeight:500,borderRadius:"9px",border:"1px solid #e2e8f0",background:"#fff",color:"#64748b",cursor:"pointer"},children:"Reset"}),(0,l.jsx)("button",{onClick:s,style:{flex:2,padding:g?"12px 0":"8px 0",fontSize:"13px",fontWeight:600,borderRadius:"9px",border:"none",background:"#0d9488",color:"#fff",cursor:"pointer"},children:"Apply settings"})]})]})});nt.displayName="WidgetPanel";xe();b();var ne=require("react");b();var Sn={hotel:["hotel","resort","motel","inn","accommodation","lodge","stay","room","booking","hospitality"],ecommerce:["shop","store","ecommerce","e-commerce","sell","product","cart","buy","marketplace","retail"],restaurant:["restaurant","food","cafe","cafeteria","menu","dining","eat","cuisine","bistro","takeaway","delivery"],portfolio:["portfolio","freelance","personal","designer","developer","creative","showcase","work","hire me"],blog:["blog","article","post","write","news","magazine","journal","content"],saas:["saas","dashboard","app","software","platform","tool","analytics","admin","manage","crm"],government:["government","govt","portal","citizen","scheme","welfare","municipal","public","official"],healthcare:["hospital","clinic","doctor","health","medical","patient","appointment","pharmacy"],education:["school","college","university","course","learn","education","student","lms","training"],realestate:["real estate","property","house","flat","apartment","rent","buy property","listing"],landing:["landing","startup","launch","product launch","coming soon","waitlist"],generic:[]},An={hotel:["home","rooms","booking","about","contact"],ecommerce:["home","products","cart","checkout","about","contact"],restaurant:["home","menu","reservations","about","contact"],portfolio:["home","portfolio","about","contact"],blog:["home","blog","about","contact"],saas:["home","pricing","dashboard","auth","about","contact"],government:["home","services","about","contact","faq"],healthcare:["home","services","booking","team","about","contact"],education:["home","services","pricing","about","contact"],realestate:["home","products","about","contact"],landing:["home","pricing","about","contact"],generic:["home","about","services","contact"]},Tn={home:["home","homepage","main","landing"],about:["about","who we are","our story","company"],contact:["contact","reach us","get in touch","location"],services:["service","what we offer","solution","offering"],pricing:["pricing","price","plan","subscription","cost","fee"],blog:["blog","article","news","post"],auth:["login","register","signup","sign up","sign in","auth","account"],dashboard:["dashboard","admin","panel","manage","analytics"],gallery:["gallery","photo","image","portfolio"],products:["product","shop","store","item","catalogue"],cart:["cart","basket","shopping cart"],checkout:["checkout","payment","pay","order"],rooms:["room","suite","accommodation","stay"],booking:["booking","reserve","reservation","schedule","appointment"],menu:["menu","food","dish","cuisine"],reservations:["reservation","table booking","book table"],portfolio:["portfolio","work","project","case study"],team:["team","staff","member","people","who we are"],faq:["faq","question","answer","help","support"],terms:["terms","condition","legal"],privacy:["privacy","policy","gdpr","data"]},En={Authentication:["login","register","auth","signup","sign in","account"],Payment:["payment","stripe","pay","checkout","billing"],Search:["search","filter","find"],"Dark mode":["dark mode","dark theme","night mode"],"Multi-language":["multilingual","multi language","translation","i18n"],SEO:["seo","search engine","meta","google"],Analytics:["analytics","tracking","stats","dashboard"],Email:["email","newsletter","contact form","notification"],Map:["map","location","address","google maps"],"Social media":["social","instagram","facebook","twitter","share"],"Image gallery":["gallery","photo","image","carousel"],"Booking system":["booking","reservation","appointment","schedule"],"Shopping cart":["cart","basket","shop","ecommerce"],"Blog/CMS":["blog","cms","content","article","post"]},Cn={blue:["blue","navy","sky","ocean","corporate"],green:["green","nature","eco","environment","health","fresh"],purple:["purple","violet","luxury","creative","royal"],red:["red","bold","energy","passion","food"],orange:["orange","warm","friendly","fun"],teal:["teal","turquoise","modern","tech"],indigo:["indigo","professional","trust","finance","bank"],gray:["gray","minimal","clean","simple","neutral"]},Ln={hotel:"indigo",ecommerce:"blue",restaurant:"red",portfolio:"purple",blog:"gray",saas:"teal",government:"blue",healthcare:"green",education:"indigo",realestate:"orange",landing:"purple",generic:"blue"};function Mn(e){let t=[/(?:for|called|named|company|business|brand)\s+["']?([A-Z][a-zA-Z\s]{1,30})["']?/i,/["']([A-Z][a-zA-Z\s]{1,30})["']/,/^([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)?)/m];for(let o of t){let r=e.match(o);if(r?.[1]){let a=r[1].trim();if(a.length>2&&a.length<40)return a}}return"My Business"}function Rn(e){let t=e.toLowerCase(),o="generic",r=0;for(let[a,i]of Object.entries(Sn)){let n=0;for(let s of i)t.includes(s)&&n++;n>r&&(r=n,o=a)}return o}function Fn(e,t){let o=e.toLowerCase(),r=new Set(An[t]);for(let[a,i]of Object.entries(Tn))for(let n of i)if(o.includes(n)){r.add(a);break}return r.add("home"),r.add("contact"),Array.from(r)}function Pn(e){let t=e.toLowerCase(),o=[];for(let[r,a]of Object.entries(En))for(let i of a)if(t.includes(i)){o.push(r);break}return o}function Nn(e,t){let o=e.toLowerCase();for(let[r,a]of Object.entries(Cn))for(let i of a)if(o.includes(i))return r;return Ln[t]}function qt(e){let t=Rn(e),o=Fn(e,t),r=Pn(e),a=Nn(e,t);return{siteName:Mn(e),websiteType:t,pages:o,features:r,theme:a,description:e.slice(0,200)}}var m=require("react/jsx-runtime"),Wn=["Hotel booking website for Grand Palace Hotels with rooms, booking and payment","E-commerce store for organic food products with cart and checkout","Restaurant website for Spice Garden with menu and table reservations","Portfolio website for a freelance designer with gallery and contact","SaaS dashboard for project management with pricing and auth","Government portal for citizen services with FAQ and contact"],On={home:"\u{1F3E0}",about:"\u2139\uFE0F",contact:"\u{1F4EC}",services:"\u2699\uFE0F",pricing:"\u{1F4B0}",blog:"\u{1F4DD}",auth:"\u{1F510}",dashboard:"\u{1F4CA}",gallery:"\u{1F5BC}\uFE0F",products:"\u{1F6D2}",cart:"\u{1F6CD}\uFE0F",checkout:"\u{1F4B3}",rooms:"\u{1F6CF}\uFE0F",booking:"\u{1F4C5}",menu:"\u{1F37D}\uFE0F",reservations:"\u{1FA91}",portfolio:"\u{1F4BC}",team:"\u{1F465}",faq:"\u2753",terms:"\u{1F4C4}",privacy:"\u{1F512}"},$n={hotel:"\u{1F3E8}",ecommerce:"\u{1F6D2}",restaurant:"\u{1F37D}\uFE0F",portfolio:"\u{1F4BC}",blog:"\u{1F4DD}",saas:"\u26A1",government:"\u{1F3DB}\uFE0F",healthcare:"\u{1F3E5}",education:"\u{1F393}",realestate:"\u{1F3E0}",landing:"\u{1F680}",generic:"\u{1F310}"};function at({position:e,onClose:t}){let[o,r]=(0,ne.useState)("input"),[a,i]=(0,ne.useState)(""),[n,s]=(0,ne.useState)(null),[c,p]=(0,ne.useState)(0),[y,g]=(0,ne.useState)(""),V=(0,ne.useCallback)(()=>{if(!a.trim())return;let w=qt(a);s(w),r("preview")},[a]),$=(0,ne.useCallback)(async()=>{if(n){r("generating"),p(0),g("");try{let w=[{msg:"Parsing requirement...",pct:15},{msg:"Loading templates...",pct:30},{msg:"Generating pages...",pct:55},{msg:"Building components...",pct:70},{msg:"Creating styles...",pct:85},{msg:"Packaging ZIP...",pct:95}];for(let M of w)p(M.pct),await new Promise(C=>setTimeout(C,200));let{generateZip:P}=await Promise.resolve().then(()=>(xo(),ho));await P(n),p(100),r("done")}catch(w){g(w instanceof Error?w.message:"Generation failed. Please try again."),r("preview")}}},[n]),G=()=>{r("input"),i(""),s(null),p(0),g("")},L={position:"fixed",bottom:"204px",[e]:"24px",zIndex:9999,width:"340px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.14)",fontFamily:"system-ui,-apple-system,sans-serif",maxHeight:"75vh",overflowY:"auto"};return(0,m.jsxs)("div",{role:"dialog","aria-modal":"true","aria-label":"yuktai Vibe Coder","data-yuktai-panel":"true",style:L,children:[(0,m.jsxs)("div",{style:{padding:"14px 16px 12px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"flex-start",justifyContent:"space-between",position:"sticky",top:0,background:"#fff",zIndex:1},children:[(0,m.jsxs)("div",{children:[(0,m.jsx)("p",{style:{margin:"0 0 2px",fontSize:"13px",fontWeight:700,color:"#0f172a"},children:"\u26A1 Vibe Coder"}),(0,m.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#64748b"},children:"Describe your website \u2192 Download Next.js ZIP"})]}),(0,m.jsx)("button",{onClick:t,"aria-label":"Close vibe coder",style:{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"18px",padding:"2px"},children:"\xD7"})]}),o==="input"&&(0,m.jsxs)("div",{style:{padding:"14px 16px"},children:[(0,m.jsx)("p",{style:{margin:"0 0 10px",fontSize:"11px",color:"#64748b"},children:"Describe your business website in plain English. The plugin will generate a complete Next.js project for you."}),(0,m.jsx)("p",{style:{margin:"0 0 6px",fontSize:"10px",fontWeight:600,color:"#94a3b8",textTransform:"uppercase"},children:"Examples"}),(0,m.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"4px",marginBottom:"12px"},children:Wn.slice(0,3).map(w=>(0,m.jsx)("button",{onClick:()=>i(w),style:{padding:"6px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#f8fafc",color:"#475569",fontSize:"10px",cursor:"pointer",textAlign:"left",lineHeight:1.4},children:w},w))}),(0,m.jsx)("textarea",{value:a,onChange:w=>i(w.target.value),placeholder:"e.g. I need a hotel booking website with rooms, search, and payment for Grand Palace Hotels",rows:4,"aria-label":"Describe your website",style:{width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.5}}),(0,m.jsx)("button",{onClick:V,disabled:!a.trim(),style:{width:"100%",marginTop:"10px",padding:"10px",borderRadius:"8px",border:"none",background:a.trim()?"#f59e0b":"#e2e8f0",color:a.trim()?"#fff":"#94a3b8",fontSize:"13px",fontWeight:700,cursor:a.trim()?"pointer":"not-allowed",transition:"background 0.2s"},children:"Analyse Requirement \u2192"})]}),o==="preview"&&n&&(0,m.jsxs)("div",{style:{padding:"14px 16px"},children:[y&&(0,m.jsxs)("div",{style:{padding:"10px",background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:"8px",marginBottom:"12px",fontSize:"11px",color:"#dc2626"},children:["\u26A0\uFE0F ",y]}),(0,m.jsxs)("div",{style:{background:"#f8fafc",borderRadius:"10px",padding:"12px",marginBottom:"12px"},children:[(0,m.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"},children:[(0,m.jsx)("span",{style:{fontSize:"1.5rem"},children:$n[n.websiteType]||"\u{1F310}"}),(0,m.jsxs)("div",{children:[(0,m.jsx)("p",{style:{margin:0,fontSize:"13px",fontWeight:700,color:"#0f172a"},children:n.siteName}),(0,m.jsxs)("p",{style:{margin:0,fontSize:"10px",color:"#64748b",textTransform:"capitalize"},children:[n.websiteType," website \xB7 ",n.theme," theme"]})]})]}),(0,m.jsxs)("p",{style:{margin:"8px 0 6px",fontSize:"10px",fontWeight:600,color:"#94a3b8",textTransform:"uppercase"},children:["Pages to generate (",n.pages.length,")"]}),(0,m.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"4px"},children:n.pages.map(w=>(0,m.jsxs)("span",{style:{padding:"2px 8px",borderRadius:"99px",background:"#f0fdf4",border:"1px solid #86efac",fontSize:"10px",color:"#166534",fontWeight:500},children:[On[w]||"\u{1F4C4}"," ",w]},w))}),n.features.length>0&&(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("p",{style:{margin:"10px 0 6px",fontSize:"10px",fontWeight:600,color:"#94a3b8",textTransform:"uppercase"},children:"Detected features"}),(0,m.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"4px"},children:n.features.map(w=>(0,m.jsx)("span",{style:{padding:"2px 8px",borderRadius:"99px",background:"#f5f3ff",border:"1px solid #c4b5fd",fontSize:"10px",color:"#7c3aed",fontWeight:500},children:w},w))})]})]}),(0,m.jsxs)("div",{style:{margin:"0 0 12px",padding:"10px 12px",background:"#f0fdf4",borderRadius:"8px",border:"1px solid #86efac"},children:[(0,m.jsx)("p",{style:{margin:"0 0 4px",fontSize:"10px",fontWeight:700,color:"#166534"},children:"\u{1F4E6} What you get:"}),(0,m.jsxs)("p",{style:{margin:0,fontSize:"10px",color:"#166534",lineHeight:1.6},children:["\u2705 Complete Next.js 16 project",(0,m.jsx)("br",{}),"\u2705 Tailwind CSS + CSS Modules",(0,m.jsx)("br",{}),"\u2705 TypeScript configured",(0,m.jsx)("br",{}),"\u2705 Navbar + Footer components",(0,m.jsx)("br",{}),"\u2705 All ",n.pages.length," pages ready",(0,m.jsx)("br",{}),"\u2705 Mobile responsive",(0,m.jsx)("br",{}),"\u2705 npm run dev \u2192 works immediately"]})]}),(0,m.jsxs)("div",{style:{display:"flex",gap:"8px"},children:[(0,m.jsx)("button",{onClick:G,style:{flex:1,padding:"9px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",color:"#64748b",fontSize:"12px",fontWeight:600,cursor:"pointer"},children:"\u2190 Edit"}),(0,m.jsx)("button",{onClick:$,style:{flex:2,padding:"9px",borderRadius:"8px",border:"none",background:"#f59e0b",color:"#fff",fontSize:"13px",fontWeight:700,cursor:"pointer"},children:"\u2B07\uFE0F Generate & Download ZIP"})]})]}),o==="generating"&&(0,m.jsxs)("div",{style:{padding:"2rem 16px",textAlign:"center"},children:[(0,m.jsx)("p",{style:{fontSize:"2rem",marginBottom:"1rem"},children:"\u26A1"}),(0,m.jsx)("p",{style:{fontSize:"13px",fontWeight:700,color:"#0f172a",marginBottom:"0.5rem"},children:"Generating your project..."}),(0,m.jsx)("p",{style:{fontSize:"11px",color:"#64748b",marginBottom:"1.5rem"},children:c<30?"Parsing requirement...":c<55?"Loading templates...":c<70?"Generating pages...":c<85?"Building components...":c<95?"Creating styles...":"Packaging ZIP..."}),(0,m.jsx)("div",{style:{height:"8px",background:"#e2e8f0",borderRadius:"99px",overflow:"hidden"},children:(0,m.jsx)("div",{style:{height:"100%",width:`${c}%`,background:"#f59e0b",borderRadius:"99px",transition:"width 0.3s ease"}})}),(0,m.jsxs)("p",{style:{marginTop:"0.5rem",fontSize:"10px",color:"#94a3b8"},children:[c,"%"]})]}),o==="done"&&n&&(0,m.jsxs)("div",{style:{padding:"2rem 16px",textAlign:"center"},children:[(0,m.jsx)("p",{style:{fontSize:"3rem",marginBottom:"0.75rem"},children:"\u2705"}),(0,m.jsxs)("p",{style:{fontSize:"14px",fontWeight:700,color:"#0f172a",marginBottom:"0.5rem"},children:[n.siteName," downloaded!"]}),(0,m.jsx)("p",{style:{fontSize:"11px",color:"#64748b",marginBottom:"1.5rem",lineHeight:1.6},children:"Your ZIP is downloading. Unzip it and run:"}),["npm install","npm run dev"].map(w=>(0,m.jsx)("div",{style:{background:"#0f172a",borderRadius:"8px",padding:"8px 12px",marginBottom:"6px",textAlign:"left"},children:(0,m.jsxs)("code",{style:{fontSize:"12px",color:"#a7f3d0",fontFamily:"monospace"},children:["$ ",w]})},w)),(0,m.jsx)("p",{style:{fontSize:"11px",color:"#10b981",margin:"1rem 0",fontWeight:600},children:"Then open http://localhost:3000 \u{1F680}"}),(0,m.jsxs)("div",{style:{display:"flex",gap:"8px"},children:[(0,m.jsx)("button",{onClick:G,style:{flex:1,padding:"9px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",color:"#64748b",fontSize:"12px",fontWeight:600,cursor:"pointer"},children:"New Project"}),(0,m.jsx)("button",{onClick:$,style:{flex:1,padding:"9px",borderRadius:"8px",border:"none",background:"#f59e0b",color:"#fff",fontSize:"12px",fontWeight:700,cursor:"pointer"},children:"\u2B07\uFE0F Download Again"})]})]})]})}var h=require("react/jsx-runtime");async function qn(){try{if(typeof window>"u")return!1;let e=window;if(e.LanguageModel)try{if(typeof e.LanguageModel.availability=="function"){let o=await e.LanguageModel.availability();if(o==="readily"||o==="available"||o==="downloadable")return!0}else return!0}catch{}if(e.Summarizer)try{let o=await e.Summarizer.availability?.();if(!o||o==="readily"||o==="available")return!0}catch{}if(e.Rewriter)try{let o=await e.Rewriter.availability?.();if(!o||o==="readily"||o==="available")return!0}catch{}if(e.Writer)try{let o=await e.Writer.availability?.();if(!o||o==="readily"||o==="available")return!0}catch{}let t=e.ai||globalThis.ai;if(t){if(t.languageModel?.availability)try{let o=await t.languageModel.availability();if(o==="readily"||o==="available")return!0}catch{}if(t.languageModel&&typeof t.languageModel.create=="function"||t.summarizer||t.rewriter||t.writer||t.languageModel)return!0}return!!(e.Translator||e.translation?.canTranslate)}catch{return!1}}function He({position:e="left",children:t,config:o={},showRag:r=!1,showAgent:a=!1}){let[i,n]=(0,v.useState)(!1),[s,c]=(0,v.useState)(ot),[p,y]=(0,v.useState)(null),[g,V]=(0,v.useState)(!1),[$,G]=(0,v.useState)(!1),[L,w]=(0,v.useState)(!1),P=v.default.useRef(null),[M,C]=(0,v.useState)(!1),[B,x]=(0,v.useState)(""),[R,H]=(0,v.useState)(""),[O,A]=(0,v.useState)(!1),[S,Z]=(0,v.useState)(null),[te,d]=(0,v.useState)("idle"),[J,T]=(0,v.useState)(!1),[U,oe]=(0,v.useState)(""),[Oe,se]=(0,v.useState)(""),[f,W]=(0,v.useState)(!1),[Y,D]=(0,v.useState)([]),[N,it]=(0,v.useState)(null),Lo=24,st=84,lt=r?144:84,Xn=204,[Se,$e]=(0,v.useState)(!1);(0,v.useEffect)(()=>{if(typeof window>"u")return;let u=window;!!(u.LanguageModel||u.ai?.languageModel)&&$?(Z("gemini"),it("gemini")):ye()&&(Z("transformers"),it("transformers"))},[$]),(0,v.useEffect)(()=>{if(S!=="transformers")return;let u=setInterval(()=>d(he()),500);return()=>clearInterval(u)},[S]);let ct=(0,v.useCallback)(async()=>{if(!(!B.trim()||O)){if(!S){H("\u26A0\uFE0F No AI engine available.");return}A(!0),H("");try{let u;if(S==="gemini"){let{askPage:F}=await Promise.resolve().then(()=>(Je(),$t));u=await F(B)}else{d("loading");let{askPageWithTransformers:F}=await Promise.resolve().then(()=>(xe(),tt));u=await F(B),d("ready")}H(u.success&&u.answer?u.answer.replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/#+\s/g,"").trim():"\u26A0\uFE0F "+(u.error||"No answer found."))}catch{H("\u26A0\uFE0F Something went wrong.")}A(!1)}},[B,O,S]),dt=(0,v.useCallback)(async()=>{if(!U.trim()||f)return;if(!N){se("\u26A0\uFE0F No AI engine available.");return}W(!0),D([]),se("");let{runAgent:u}=await Promise.resolve().then(()=>(To(),Ao));await u(U,N,F=>{D(re=>[...re,F.text])}),W(!1),se("done")},[U,f,N]);(0,v.useEffect)(()=>{if(typeof window>"u")return;let F=setTimeout(async()=>{let re=window,No=await qn();G(No),w(!!(re.SpeechRecognition||re.webkitSpeechRecognition))},800);return()=>clearTimeout(F)},[]),(0,v.useEffect)(()=>{if(!(typeof window>"u"))try{let u=localStorage.getItem("yuktai-a11y-prefs");u&&c(F=>({...F,...JSON.parse(u)}))}catch{}},[]);let pt=(0,v.useCallback)(async u=>{let F={enabled:!0,highContrast:u.highContrast,darkMode:u.darkMode,reduceMotion:u.reduceMotion,largeTargets:u.largeTargets,speechEnabled:u.speechEnabled,autoFix:u.autoFix,dyslexiaFont:u.dyslexiaFont,localFont:u.localFont,fontSizeMultiplier:u.fontScale/100,colorBlindMode:u.colorBlindMode,showAuditBadge:u.showAuditBadge,showSkipLinks:!0,showPreferencePanel:!1,plainEnglish:u.plainEnglish,summarisePage:u.summarisePage,translateLanguage:u.translateLanguage,voiceControl:u.voiceControl,smartLabels:u.smartLabels,...o};await K.execute(F),y(K.applyFixes(F)),V(!0)},[o]),Mo=(0,v.useCallback)(async()=>{try{localStorage.setItem("yuktai-a11y-prefs",JSON.stringify(s))}catch{}await pt(s),n(!1)},[s,pt]),Ro=(0,v.useCallback)(()=>{c(ot);try{localStorage.removeItem("yuktai-a11y-prefs")}catch{}let u=document.documentElement;["data-yuktai-high-contrast","data-yuktai-dark","data-yuktai-reduce-motion","data-yuktai-large-targets","data-yuktai-keyboard","data-yuktai-dyslexia"].forEach(F=>u.removeAttribute(F)),document.body.style.filter="",document.body.style.fontFamily="",document.documentElement.style.fontSize="",y(null),V(!1)},[]),Fo=(0,v.useCallback)((u,F)=>{c(re=>({...re,[u]:F}))},[]);(0,v.useEffect)(()=>{let u=F=>{F.key==="Escape"&&(i&&n(!1),M&&C(!1),J&&T(!1),Se&&$e(!1))};return window.addEventListener("keydown",u),()=>window.removeEventListener("keydown",u)},[i,M,J]),(0,v.useEffect)(()=>{i&&P.current&&K.trapFocus(P.current)},[i]);let Ae=(u,F,re)=>({position:"fixed",bottom:`${u}px`,[e]:"24px",zIndex:9998,width:"52px",height:"52px",borderRadius:"50%",background:F,color:"#fff",border:"none",cursor:"pointer",fontSize:"22px",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,0,0,0.25)",transition:"transform 0.15s, background 0.2s"}),Te=u=>{u.currentTarget.style.transform="scale(1.08)"},Ee=u=>{u.currentTarget.style.transform="scale(1)"},ut=S==="gemini"?"Gemini Nano \xB7 On device":S==="transformers"?"Transformers.js \xB7 All devices":"Detecting...",Po=S==="transformers"&&te==="loading"?"Loading model...":"...";return(0,h.jsxs)(h.Fragment,{children:[t,a&&(0,h.jsx)("button",{style:Ae(204,Se?"#d97706":"#f59e0b",Se),"aria-label":"Open Vibe Coder",title:"\u26A1 Vibe Coder \u2014 Generate Next.js project",onClick:()=>{$e(u=>!u),T(!1),C(!1),n(!1)},onMouseEnter:Te,onMouseLeave:Ee,children:"\u26A1"}),a&&Se&&(0,h.jsx)(at,{position:e,onClose:()=>$e(!1)}),a&&(0,h.jsx)("button",{style:Ae(lt,J?"#059669":"#10b981",J),"aria-label":"Open AI agent","aria-haspopup":"dialog","aria-expanded":J,title:"\u{1F916} AI Agent \u2014 guide me through this page",onClick:()=>{T(u=>!u),C(!1),n(!1)},onMouseEnter:Te,onMouseLeave:Ee,children:"\u{1F916}"}),a&&J&&(0,h.jsxs)("div",{role:"dialog","aria-modal":"true","aria-label":"yuktai AI Agent","data-yuktai-panel":"true",style:{position:"fixed",bottom:`${lt+64}px`,[e]:"24px",zIndex:9999,width:"300px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",fontFamily:"system-ui,-apple-system,sans-serif",padding:"14px",maxHeight:"70vh",overflowY:"auto"},children:[(0,h.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"},children:[(0,h.jsxs)("div",{children:[(0,h.jsx)("p",{style:{margin:"0 0 2px",fontSize:"13px",fontWeight:600,color:"#0f172a"},children:"\u{1F916} AI Agent"}),(0,h.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#10b981"},children:N==="gemini"?"Gemini Nano \xB7 On device":N==="transformers"?"Transformers.js \xB7 All devices":"Detecting..."})]}),(0,h.jsx)("button",{onClick:()=>T(!1),"aria-label":"Close agent panel",style:{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"18px",lineHeight:1,padding:"2px"},children:"\xD7"})]}),(0,h.jsx)("p",{style:{margin:"0 0 8px",fontSize:"11px",color:"#64748b"},children:"Tell me what you want to do on this page. I will guide you step by step."}),(0,h.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"4px",marginBottom:"8px"},children:["Fill this form","Find contact info","What is this page?","Guide me to apply"].map(u=>(0,h.jsx)("button",{onClick:()=>oe(u),style:{padding:"3px 8px",borderRadius:"20px",fontSize:"10px",border:"1px solid #e2e8f0",background:"#f8fafc",color:"#64748b",cursor:"pointer"},children:u},u))}),(0,h.jsxs)("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[(0,h.jsx)("input",{type:"text",value:U,onChange:u=>oe(u.target.value),onKeyDown:u=>{u.key==="Enter"&&dt()},placeholder:"e.g. Help me fill this form",disabled:f||!N,"aria-label":"Tell the agent what to do",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:N?"#fff":"#f8fafc",outline:"none",height:"36px"}}),(0,h.jsx)("button",{onClick:dt,disabled:f||!U.trim()||!N,"aria-label":"Run agent",style:{padding:"8px 12px",borderRadius:"8px",border:"none",background:N&&U.trim()&&!f?"#10b981":"#e2e8f0",color:N&&U.trim()&&!f?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:N&&U.trim()&&!f?"pointer":"not-allowed",height:"36px",minWidth:"52px",transition:"background 0.2s"},children:f?"...":"Go"})]}),Y.length>0&&(0,h.jsxs)("div",{style:{padding:"10px 12px",background:"#f0fdf4",border:"1px solid #86efac",borderRadius:"8px",fontSize:"11px",color:"#166534",lineHeight:1.7},children:[Y.map((u,F)=>(0,h.jsx)("p",{style:{margin:"0 0 2px"},children:u},F)),Oe==="done"&&(0,h.jsx)("button",{onClick:()=>{D([]),oe(""),se("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]}),!N&&(0,h.jsx)("p",{style:{margin:"4px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Enable Gemini Nano via chrome://flags for best results."})]}),r&&(0,h.jsx)("button",{style:Ae(st,M?"#7c3aed":"#6d28d9",M),"aria-label":"Ask a question about this page","aria-haspopup":"dialog","aria-expanded":M,title:`\u{1F4AC} Ask this page \xB7 ${ut}`,onClick:()=>{C(u=>!u),n(!1),T(!1)},onMouseEnter:Te,onMouseLeave:Ee,children:"\u{1F4AC}"}),r&&M&&(0,h.jsxs)("div",{role:"dialog","aria-modal":"true","aria-label":"Ask this page","data-yuktai-panel":"true",style:{position:"fixed",bottom:`${st+64}px`,[e]:"24px",zIndex:9999,width:"300px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",fontFamily:"system-ui,-apple-system,sans-serif",padding:"14px"},children:[(0,h.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"},children:[(0,h.jsxs)("div",{children:[(0,h.jsx)("p",{style:{margin:"0 0 2px",fontSize:"13px",fontWeight:600,color:"#0f172a"},children:"\u{1F4AC} Ask this page"}),(0,h.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#7c3aed"},children:ut}),S==="transformers"&&te==="loading"&&(0,h.jsx)("p",{style:{margin:"2px 0 0",fontSize:"9px",color:"#94a3b8"},children:"Downloading model \u2014 first time only"}),S==="transformers"&&te==="ready"&&(0,h.jsx)("p",{style:{margin:"2px 0 0",fontSize:"9px",color:"#10b981"},children:"Model ready \u2705 \u2014 works offline"})]}),(0,h.jsx)("button",{onClick:()=>C(!1),"aria-label":"Close ask panel",style:{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"18px",lineHeight:1,padding:"2px"},children:"\xD7"})]}),(0,h.jsxs)("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[(0,h.jsx)("input",{type:"text",value:B,onChange:u=>x(u.target.value),onKeyDown:u=>{u.key==="Enter"&&ct()},placeholder:"e.g. What does this page do?",disabled:O||!S,"aria-label":"Ask a question about this page",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:S?"#fff":"#f8fafc",outline:"none",height:"36px"}}),(0,h.jsx)("button",{onClick:ct,disabled:O||!B.trim()||!S,"aria-label":"Submit question",style:{padding:"8px 12px",borderRadius:"8px",border:"none",background:S&&B.trim()&&!O?"#7c3aed":"#e2e8f0",color:S&&B.trim()&&!O?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:S&&B.trim()&&!O?"pointer":"not-allowed",height:"36px",minWidth:"48px",transition:"background 0.2s"},children:O?Po:"Ask"})]}),R&&(0,h.jsxs)("div",{style:{padding:"10px",background:"#f5f3ff",borderRadius:"8px",fontSize:"12px",color:"#4c1d95",lineHeight:1.6,maxHeight:"180px",overflowY:"auto"},children:[(0,h.jsx)("strong",{style:{display:"block",marginBottom:"4px",fontSize:"11px",color:"#7c3aed"},children:"\u{1F4AC} Answer"}),R,(0,h.jsx)("button",{onClick:()=>{H(""),x("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]}),!S&&(0,h.jsx)("p",{style:{margin:"4px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Detecting AI engine..."})]}),(0,h.jsx)("button",{style:Ae(Lo,g?"#0d9488":"#1a73e8",i),"aria-label":"Open accessibility preferences","aria-haspopup":"dialog","aria-expanded":i,"data-yuktai-pref-toggle":"true",title:"\u267F Accessibility settings",onClick:()=>{n(u=>!u),C(!1),T(!1)},onMouseEnter:Te,onMouseLeave:Ee,children:"\u267F"}),i&&(0,h.jsx)(nt,{ref:P,position:e,settings:s,report:p,isActive:g,aiSupported:$,voiceSupported:L,set:Fo,onApply:Mo,onReset:Ro,onClose:()=>n(!1)})]})}b();var we={name:"ai.text",async execute(e){return`\u{1F916} YuktAI says: ${e}`}};b();var ke={name:"voice.text",async execute(e){return!e||e.trim()===""?"\u{1F3A4} No speech detected":`\u{1F3A4} You said: ${e}`}};b();var ie=class{plugins=new Map;register(t,o){if(!o||typeof o.execute!="function")throw new Error(`Invalid plugin: ${t}`);this.plugins.set(t,o)}use(t){return this.plugins.get(t)}async run(t,o){try{let r=this.use(t);if(!r)throw new Error(`Plugin not found: ${t}`);return await r.execute(o)}catch(r){throw console.error(`[YuktAI Runtime Error in ${t}]:`,r),r}}getPlugins(){return Array.from(this.plugins.keys())}};b();var ge=require("react");b();var _=require("react");function jn(e){return e===!1?Number.MAX_SAFE_INTEGER:e===!0||e===void 0?10:e.pageSize??10}function We(e){let{data:t,columns:o,pagination:r=!0,mobileBreakpoint:a=768}=e,[i,n]=(0,_.useState)(null),[s,c]=(0,_.useState)(""),[p,y]=(0,_.useState)(1),[g,V]=(0,_.useState)(jn(r)),[$,G]=(0,_.useState)(!1);(0,_.useEffect)(()=>{if(typeof window>"u")return;let R=()=>{G(window.innerWidth<a)};return R(),window.addEventListener("resize",R),()=>window.removeEventListener("resize",R)},[a]);let L=(0,_.useCallback)(R=>{n(H=>!H||H.key!==R?{key:R,direction:"asc"}:H.direction==="asc"?{key:R,direction:"desc"}:null),y(1)},[]),w=(0,_.useCallback)(()=>n(null),[]),P=(0,_.useMemo)(()=>{if(!s.trim())return t;let R=s.toLowerCase().trim();return t.filter(H=>o.some(O=>{let A=H[O.key];return A==null?!1:String(A).toLowerCase().includes(R)}))},[t,s,o]),M=(0,_.useMemo)(()=>{if(!i)return P;let R=[...P].sort((H,O)=>{let A=H[i.key],S=O[i.key];if(A===S)return 0;if(A==null)return 1;if(S==null)return-1;if(typeof A=="number"&&typeof S=="number")return A-S;if(A instanceof Date&&S instanceof Date)return A.getTime()-S.getTime();let Z=String(A),te=String(S);return Z.localeCompare(te,void 0,{sensitivity:"base",numeric:!0})});return i.direction==="desc"?R.reverse():R},[P,i]),C=Math.max(1,Math.ceil(M.length/g)),B=(0,_.useMemo)(()=>{if(r===!1)return M;let R=(p-1)*g;return M.slice(R,R+g)},[M,p,g,r]),x=(0,_.useCallback)(()=>{n(null),c(""),y(1)},[]);return(0,_.useEffect)(()=>{p>C&&y(C)},[p,C]),{displayedData:B,totalCount:t.length,filteredCount:M.length,sort:i,toggleSort:L,clearSort:w,searchQuery:s,setSearchQuery:c,page:p,pageSize:g,totalPages:C,setPage:y,setPageSize:V,isMobile:$,reset:x}}var k=require("react/jsx-runtime"),Vn={default:{container:{background:"#FFFFFF",color:"#0F172A",fontFamily:"system-ui, -apple-system, sans-serif"},header:{background:"#F8FAFC",color:"#475569",borderBottom:"1px solid #E2E8F0"},row:{borderBottom:"1px solid #F1F5F9"},rowHover:{background:"#F8FAFC"},cell:{color:"#0F172A"},button:{background:"#0D9488",color:"#FFFFFF"},border:"#E2E8F0"},"high-contrast":{container:{background:"#000000",color:"#FFFFFF",fontFamily:"system-ui, sans-serif",fontWeight:600},header:{background:"#000000",color:"#FFFF00",borderBottom:"2px solid #FFFFFF",fontWeight:700},row:{borderBottom:"1px solid #FFFFFF"},rowHover:{background:"#1A1A1A"},cell:{color:"#FFFFFF"},button:{background:"#FFFF00",color:"#000000",border:"2px solid #FFFFFF"},border:"#FFFFFF"},dark:{container:{background:"#0F172A",color:"#F1F5F9",fontFamily:"system-ui, sans-serif"},header:{background:"#1E293B",color:"#94A3B8",borderBottom:"1px solid #334155"},row:{borderBottom:"1px solid #1E293B"},rowHover:{background:"#1E293B"},cell:{color:"#F1F5F9"},button:{background:"#14B8A6",color:"#0F172A"},border:"#334155"},"color-blind":{container:{background:"#FFFFFF",color:"#0F172A",fontFamily:"system-ui, sans-serif"},header:{background:"#F8FAFC",color:"#475569",borderBottom:"1px solid #E2E8F0"},row:{borderBottom:"1px solid #F1F5F9"},rowHover:{background:"#F8FAFC"},cell:{color:"#0F172A"},button:{background:"#1F2937",color:"#FFFFFF"},border:"#E2E8F0"},dyslexia:{container:{background:"#FDF6E3",color:"#3D3424",fontFamily:"'Atkinson Hyperlegible', system-ui, sans-serif",letterSpacing:"0.3px",lineHeight:1.7},header:{background:"#FAF0D7",color:"#5C4F37",borderBottom:"1px solid #D7CFB8",letterSpacing:"0.5px"},row:{borderBottom:"1px solid #ECE0C2"},rowHover:{background:"#FAF0D7"},cell:{color:"#3D3424"},button:{background:"#92400E",color:"#FDF6E3"},border:"#D7CFB8"}},X={search:"Search...",noData:"No data to display",loading:"Loading...",rowsSelected:"rows selected",page:"Page",of:"of",showing:"Showing",to:"to",results:"results",prev:"Previous",next:"Next"};function Eo(e){let{data:t,columns:o,view:r="auto",mobileBreakpoint:a=768,theme:i="default",pagination:n=!0,search:s=!0,selectable:c=!1,selectedKeys:p=[],rowKey:y,loading:g=!1,empty:V,onSelectionChange:$,onRowClick:G,onSortChange:L,className:w}=e,[P,M]=(0,ge.useState)(p),{displayedData:C,filteredCount:B,sort:x,toggleSort:R,searchQuery:H,setSearchQuery:O,page:A,pageSize:S,totalPages:Z,setPage:te,isMobile:d}=We({data:t,columns:o,pagination:n,mobileBreakpoint:a}),J=r==="card"||r==="auto"&&d,T=Vn[i],U=o.filter(f=>!(d&&f.hiddenOnMobile)),oe=(0,ge.useCallback)((f,W)=>y&&f[y]!==void 0?String(f[y]):f.id!==void 0?String(f.id):String(W),[y]),Oe=(0,ge.useCallback)(f=>{R(f),L?.(x)},[R,L,x]),se=(0,ge.useCallback)(f=>{M(W=>{let Y=W.includes(f)?W.filter(D=>D!==f):[...W,f];return $?.(Y),Y})},[$]);return g?(0,k.jsx)("div",{role:"status","aria-live":"polite",style:{...T.container,padding:"2rem",textAlign:"center",borderRadius:8,border:`1px solid ${T.border}`},children:X.loading}):t.length===0?(0,k.jsx)("div",{role:"status",style:{...T.container,padding:"2rem",textAlign:"center",borderRadius:8,border:`1px solid ${T.border}`},children:V??X.noData}):(0,k.jsxs)("div",{className:w,style:{...T.container,borderRadius:8,border:`1px solid ${T.border}`,overflow:"hidden"},"data-yuktai-grid":!0,"data-theme":i,children:[s&&(0,k.jsxs)("div",{style:{...T.header,padding:"12px 16px",display:"flex",gap:12,alignItems:"center"},children:[(0,k.jsx)("input",{type:"search",value:H,onChange:f=>O(f.target.value),placeholder:X.search,"aria-label":X.search,style:{flex:1,padding:"8px 12px",fontSize:14,border:`1px solid ${T.border}`,borderRadius:6,background:"transparent",color:"inherit",minHeight:44}}),c&&P.length>0&&(0,k.jsxs)("span",{style:{fontSize:13,color:"inherit"},children:[P.length," ",X.rowsSelected]})]}),J?(0,k.jsx)("div",{role:"list",style:{padding:8},children:C.map((f,W)=>{let Y=oe(f,W);return(0,k.jsx)("div",{role:"listitem",onClick:()=>G?.(f,W),style:{padding:12,marginBottom:8,border:`1px solid ${T.border}`,borderRadius:8,background:"transparent",cursor:G?"pointer":"default",minHeight:44},tabIndex:0,children:U.map(D=>(0,k.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:13},children:[(0,k.jsxs)("span",{style:{fontWeight:500,opacity:.7},children:[D.label,":"]}),(0,k.jsx)("span",{style:T.cell,children:D.render?D.render(f[D.key],f,W):String(f[D.key]??"")})]},D.key))},Y)})}):(0,k.jsx)("div",{style:{overflowX:"auto"},children:(0,k.jsxs)("table",{role:"grid",style:{width:"100%",borderCollapse:"collapse",fontSize:14},children:[(0,k.jsx)("thead",{children:(0,k.jsxs)("tr",{role:"row",children:[c&&(0,k.jsx)("th",{style:{...T.header,padding:"10px 14px",width:44},children:(0,k.jsx)("input",{type:"checkbox","aria-label":"Select all",checked:P.length===C.length&&C.length>0,onChange:f=>{f.target.checked?M(C.map((W,Y)=>oe(W,Y))):M([])},style:{minWidth:20,minHeight:20,cursor:"pointer"}})}),U.map(f=>(0,k.jsxs)("th",{role:"columnheader","aria-sort":x?.key===f.key?x.direction==="asc"?"ascending":"descending":"none",onClick:()=>f.sortable!==!1&&Oe(f.key),style:{...T.header,padding:"10px 14px",textAlign:f.align??"left",cursor:f.sortable!==!1?"pointer":"default",userSelect:"none",width:f.width,fontWeight:500,fontSize:12,textTransform:"uppercase",letterSpacing:"0.5px"},children:[f.label,x?.key===f.key&&(0,k.jsx)("span",{"aria-hidden":"true",style:{marginLeft:6},children:x.direction==="asc"?"\u25B2":"\u25BC"})]},f.key))]})}),(0,k.jsx)("tbody",{children:C.map((f,W)=>{let Y=oe(f,W),D=P.includes(Y);return(0,k.jsxs)("tr",{role:"row","aria-selected":D,onClick:()=>G?.(f,W),style:{...T.row,cursor:G?"pointer":"default",background:D?T.rowHover.background:"transparent"},children:[c&&(0,k.jsx)("td",{style:{padding:"10px 14px"},children:(0,k.jsx)("input",{type:"checkbox","aria-label":`Select row ${W+1}`,checked:D,onChange:()=>se(Y),onClick:N=>N.stopPropagation(),style:{minWidth:20,minHeight:20,cursor:"pointer"}})}),U.map(N=>(0,k.jsx)("td",{role:"gridcell",style:{...T.cell,padding:"10px 14px",textAlign:N.align??"left"},children:N.render?N.render(f[N.key],f,W):String(f[N.key]??"")},N.key))]},Y)})})]})}),n!==!1&&Z>1&&(0,k.jsxs)("div",{style:{...T.header,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:`1px solid ${T.border}`,borderBottom:"none",fontSize:13,flexWrap:"wrap",gap:8},children:[(0,k.jsxs)("span",{children:[X.showing," ",(A-1)*S+1," ",X.to," ",Math.min(A*S,B)," ",X.of," ",B," ",X.results]}),(0,k.jsxs)("div",{style:{display:"flex",gap:6,alignItems:"center"},children:[(0,k.jsx)("button",{onClick:()=>te(A-1),disabled:A===1,"aria-label":X.prev,style:{...T.button,padding:"6px 12px",border:`1px solid ${T.border}`,borderRadius:4,cursor:A===1?"not-allowed":"pointer",opacity:A===1?.5:1,minHeight:44,minWidth:44},children:"\u2190"}),(0,k.jsxs)("span",{style:{padding:"0 8px"},children:[X.page," ",A," ",X.of," ",Z]}),(0,k.jsx)("button",{onClick:()=>te(A+1),disabled:A===Z,"aria-label":X.next,style:{...T.button,padding:"6px 12px",border:`1px solid ${T.border}`,borderRadius:4,cursor:A===Z?"not-allowed":"pointer",opacity:A===Z?.5:1,minHeight:44,minWidth:44},children:"\u2192"})]})]})]})}function Un(){if(typeof globalThis>"u")return new ie;if(!globalThis.__yuktai_runtime__){let e=new ie;e.register(K.name,K),e.register(we.name,we),e.register(ke.name,ke),globalThis.__yuktai_runtime__=e}return globalThis.__yuktai_runtime__}var Co=typeof window<"u"?Un():new ie,Yn={wcagPlugin:K,list(){return Co.getPlugins()},use(e){return Co.use(e)},fix(e){return K.applyFixes({enabled:!0,autoFix:!0,...e})},scan(){return K.scan()}};
