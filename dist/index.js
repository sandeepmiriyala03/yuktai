"use strict";var un=Object.create;var Be=Object.defineProperty;var fn=Object.getOwnPropertyDescriptor;var mn=Object.getOwnPropertyNames;var gn=Object.getPrototypeOf,bn=Object.prototype.hasOwnProperty;var ye=(e,t)=>()=>(e&&(t=e(e=0)),t);var Ee=(e,t)=>{for(var o in t)Be(e,o,{get:t[o],enumerable:!0})},Bt=(e,t,o,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of mn(t))!bn.call(e,i)&&i!==o&&Be(e,i,{get:()=>t[i],enumerable:!(r=fn(t,i))||r.enumerable});return e};var st=(e,t,o)=>(o=e!=null?un(gn(e)):{},Bt(t||!e||!e.__esModule?Be(o,"default",{value:e,enumerable:!0}):o,e)),yn=e=>Bt(Be({},"__esModule",{value:!0}),e);var f=ye(()=>{});var mo={};Ee(mo,{askPage:()=>ht});function Bn(){return new Promise(e=>{let t=setTimeout(e,1500),o=new MutationObserver(()=>{clearTimeout(t),t=setTimeout(()=>{o.disconnect(),e()},500)});o.observe(document.body,{childList:!0,subtree:!0})})}function _n(){let e=[],t=document.querySelectorAll("*");for(let o of t){if(o.closest("[data-yuktai-panel]"))continue;let r=o.innerText?.trim();r&&r.length>30&&e.push(r);let i=o.getAttribute("aria-label");if(i&&i.length>10&&e.push(i),(o instanceof HTMLInputElement||o instanceof HTMLTextAreaElement)&&(o.placeholder&&e.push(o.placeholder),o.value&&e.push(o.value)),o instanceof HTMLButtonElement){let s=o.innerText||o.getAttribute("aria-label");s&&e.push(s)}}return e.join(" ").slice(0,3500)}async function ht(e){if(!e.trim())return{success:!1,answer:"",error:"Please type a question."};try{let t=window,o=t.LanguageModel||t.ai?.languageModel;if(!o)return{success:!1,answer:"",error:"Gemini Nano not available."};await Bn();let r=_n();if(!r||r.length<100)return{success:!1,answer:"",error:"Page content not readable."};let i;try{i=await o.create({systemPrompt:`Answer ONLY using page content.
Keep answer short (2\u20133 sentences).
If not found say: "I could not find that on this page."`,outputLanguage:"en"})}catch{i=await o.create()}let s=`Page:
${r}

Q: ${e}`,n=await i.prompt(s);return i?.destroy&&i.destroy(),{success:!0,answer:n?.trim()||"No answer found."}}catch(t){return{success:!1,answer:"",error:t instanceof Error?t.message:"Error occurred"}}}var xt=ye(()=>{"use strict";f()});var kt={};Ee(kt,{askPageWithTransformers:()=>wt,getModelLoadStatus:()=>Re,isTransformersSupported:()=>Le});function ho(){return typeof navigator>"u"?!1:/Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(navigator.userAgent)}function Dn(){if(ho())return"wasm";try{if(typeof navigator<"u"&&"gpu"in navigator&&navigator.gpu!==void 0)return"webgpu"}catch{}return"wasm"}async function qn(){if(!vt){if(we){for(;we;)await new Promise(e=>setTimeout(e,200));return}we=!0;try{let{pipeline:e,env:t}=await import("@huggingface/transformers");t.allowRemoteModels=!0,t.allowLocalModels=!1,typeof window<"u"&&typeof caches<"u"&&(t.useWasmCache=!0);let o=Dn(),r=ho();console.log(`yuktai: Transformers.js \u2014 device: ${o}, mobile: ${r}`),bo=await e("feature-extraction","Xenova/all-MiniLM-L6-v2",{device:o,dtype:r?"q4":"fp32"}),yo=await e("text2text-generation","Xenova/flan-t5-small",{device:o,dtype:r?"q4":"fp32"}),vt=!0,we=!1,console.log("yuktai: Transformers.js models loaded \u2705")}catch(e){throw we=!1,console.error("yuktai: Transformers.js model load failed",e),e}}}function jn(){return new Promise(e=>{let t=setTimeout(e,1500),o=new MutationObserver(()=>{clearTimeout(t),t=setTimeout(()=>{o.disconnect(),e()},500)});o.observe(document.body,{childList:!0,subtree:!0})})}function Yn(){let e=[],t=new Set,o=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, td, th, label, figcaption, blockquote, span, a, button, div");for(let n of o){if(n.closest("[data-yuktai-panel]")||n.querySelector("p, h1, h2, h3, h4, li, td, div"))continue;let l=n.innerText?.trim();if(!l||l.length<15||t.has(l))continue;t.add(l),e.push(l);let c=n.getAttribute("aria-label")?.trim();c&&c.length>8&&!t.has(c)&&(t.add(c),e.push(c))}let r=document.title?.trim();r&&!t.has(r)&&e.unshift(r);let s=document.querySelector('meta[name="description"]')?.getAttribute("content")?.trim();return s&&!t.has(s)&&e.unshift(s),e.join(" ").slice(0,8e3)}function Vn(e,t=150,o=30){if(typeof e!="string")try{e=String(e??"")}catch{return[]}let r=e.trim();if(!r)return[];let i=Math.min(o,Math.floor(t/2)),s=r.split(/\s+/),n=[],a=t-i;for(let l=0;l<s.length;l+=a){let c=s.slice(l,l+t).join(" ");c.trim().length>20&&n.push(c)}return n}function Un(e,t){let o=0,r=0,i=0;for(let s=0;s<e.length;s++)o+=e[s]*t[s],r+=e[s]*e[s],i+=t[s]*t[s];return o/(Math.sqrt(r)*Math.sqrt(i)+1e-8)}async function go(e){let t=await bo(e,{pooling:"mean",normalize:!0}),o=t?.data??t;return Array.from(o)}async function Xn(e,t,o=3){let r=await go(e),i=await Promise.all(t.map(async s=>{let n=await go(s),a=Un(r,n);return{chunk:s,score:a}}));return i.sort((s,n)=>n.score-s.score),i.slice(0,o).map(s=>s.chunk)}async function wt(e){if(!e.trim())return{success:!1,answer:"",error:"Please type a question."};try{await qn(),await jn();let t=Yn();if(!t||t.length<50)return{success:!1,answer:"",error:"Not enough content on this page."};let o=Vn(t);if(o.length===0)return{success:!1,answer:"",error:"Could not process page content."};let s=`Answer the question based on the context. Give a complete answer in 2-3 sentences.

Context: ${(await Xn(e,o,3)).join(" ").slice(0,1200)}

Question: ${e}

Answer:`,a=(await yo(s,{max_new_tokens:120,min_new_tokens:10}))?.[0]?.generated_text?.trim()||"";return a?{success:!0,answer:a}:{success:!0,answer:"I could not find a specific answer on this page."}}catch(t){console.error("yuktai: Transformers RAG error",t);let o=t instanceof Error?t.message:"";return o.includes("Out of memory")||o.includes("memory")?{success:!1,answer:"",error:"Not enough device memory. Try on a device with more RAM or use desktop Chrome with Gemini Nano."}:{success:!1,answer:"",error:o||"Transformers.js error."}}}function Le(){try{return typeof WebAssembly<"u"&&typeof Worker<"u"}catch{return!1}}function Re(){return vt?"ready":we?"loading":"idle"}var bo,yo,we,vt,Me=ye(()=>{"use strict";f();bo=null,yo=null,we=!1,vt=!1});function vo(e,t){return e.replace(/\{\{SITE_NAME\}\}/g,t.SITE_NAME).replace(/\{\{THEME_COLOR\}\}/g,t.THEME_COLOR).replace(/\{\{TAGLINE\}\}/g,t.TAGLINE).replace(/\{\{YEAR\}\}/g,t.YEAR)}var At,wo,ko,So,To,Ao,Co,Eo,Lo,Ro,Mo,Io,Po,No,zo,Fo,Go,Ho,$o,Wo,Oo,Bo,_o,Do,qo,jo=ye(()=>{"use strict";f();At={blue:"#1a73e8",green:"#0d9488",purple:"#7c3aed",red:"#dc2626",orange:"#ea580c",teal:"#0891b2",indigo:"#4f46e5",gray:"#374151"},wo=e=>`{
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
`,ko=`/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
}

module.exports = nextConfig
`,So=e=>`/** @type {import('tailwindcss').Config} */
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
`,To=e=>`@tailwind base;
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
`,Ao=`import type { Metadata } from "next"
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
`,Co=`"use client"
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
`,Eo=`.navbar {
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
`,Lo=`import styles from "./Footer.module.css"

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
`,Ro=`.footer {
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
`,Mo=`import styles from "./page.module.css"
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
`,Io=`.page { min-height: 100vh; }

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
`,Po=`import styles from "./page.module.css"

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
`,No=`.page { min-height: 100vh; }

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
`,zo=`"use client"
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
`,Fo=`.page { min-height: 100vh; }

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
`,Go=`import styles from "./page.module.css"

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
`,Ho=`.page { min-height: 100vh; }

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
`,$o=`import styles from "./page.module.css"
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
`,Wo=`.page { min-height: 100vh; }

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
`,Oo=`"use client"
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
`,Bo=`.page {
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
`,_o=`import Link from "next/link"

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
`,Do=`{
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
`,qo=e=>`# ${e}

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
`});var Yo={};Ee(Yo,{generateZip:()=>ur});function pr(e,t){return{hotel:`Experience luxury and comfort at ${e}`,ecommerce:`Shop the best products at ${e}`,restaurant:`Delicious food crafted with love at ${e}`,portfolio:`Creative work and professional services by ${e}`,blog:`Insights, stories, and ideas from ${e}`,saas:`Powerful tools to grow your business \u2014 ${e}`,government:`Official services and information \u2014 ${e}`,healthcare:`Quality healthcare you can trust \u2014 ${e}`,education:`Learn, grow, and succeed with ${e}`,realestate:`Find your perfect property with ${e}`,landing:`The smarter way to get things done \u2014 ${e}`,generic:`Welcome to ${e} \u2014 your trusted partner`}[t]||`Welcome to ${e}`}async function ur(e){let t=(await import("jszip")).default,o=new t,r=At[e.theme]||At.blue,i=pr(e.siteName,e.websiteType),s=new Date().getFullYear().toString(),n={SITE_NAME:e.siteName,THEME_COLOR:r,TAGLINE:i,YEAR:s},a=p=>vo(p,n).replace(/\{\{SITE_NAME_LOWER\}\}/g,e.siteName.toLowerCase().replace(/\s+/g,""));o.file("package.json",wo(e.siteName)),o.file("next.config.js",ko),o.file("tailwind.config.js",So(r)),o.file("tsconfig.json",Do),o.file("README.md",qo(e.siteName)),o.file("postcss.config.js","module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }"),o.file(".gitignore",`node_modules
.next
.env.local
.DS_Store`),o.file("src/app/globals.css",To(r)),o.file("src/app/layout.tsx",a(Ao)),o.file("src/app/not-found.tsx",_o),o.file("src/components/Navbar.tsx",a(Co)),o.file("src/components/Navbar.module.css",Eo),o.file("src/components/Footer.tsx",a(Lo)),o.file("src/components/Footer.module.css",Ro);for(let p of e.pages)switch(p){case"home":o.file("src/app/page.tsx",a(Mo)),o.file("src/app/page.module.css",Io);break;case"about":o.file("src/app/about/page.tsx",a(Po)),o.file("src/app/about/page.module.css",No);break;case"contact":o.file("src/app/contact/page.tsx",a(zo)),o.file("src/app/contact/page.module.css",Fo);break;case"services":o.file("src/app/services/page.tsx",a(Go)),o.file("src/app/services/page.module.css",Ho);break;case"pricing":o.file("src/app/pricing/page.tsx",a($o)),o.file("src/app/pricing/page.module.css",Wo);break;case"auth":o.file("src/app/auth/page.tsx",a(Oo)),o.file("src/app/auth/page.module.css",Bo);break;default:o.file(`src/app/${p}/page.tsx`,fr(p,e.siteName,r,n,a));break}let l=await o.generateAsync({type:"blob"}),c=URL.createObjectURL(l),m=document.createElement("a");m.href=c,m.download=`${e.siteName.toLowerCase().replace(/\s+/g,"-")}-nextjs.zip`,document.body.appendChild(m),m.click(),document.body.removeChild(m),URL.revokeObjectURL(c)}function fr(e,t,o,r,i){let s=e.charAt(0).toUpperCase()+e.slice(1);return`import styles from "./page.module.css"

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
`}var Vo=ye(()=>{"use strict";f();jo()});var Jo={};Ee(Jo,{getPageText:()=>Uo,highlightField:()=>Ko,runAgent:()=>vr,scanFormFields:()=>Xo,scrollToSection:()=>Zo});function ue(e){try{let t=window.getComputedStyle(e);if(t.display==="none"||t.visibility==="hidden"||t.opacity==="0"||e.hidden)return!1;let o=e.getBoundingClientRect();return!(o.width===0&&o.height===0)}catch{return!0}}function Uo(){let e=[],t=new Set,o=n=>{let a=n.trim();a&&a.length>10&&!t.has(a)&&(t.add(a),e.push(a))};document.title&&o(document.title);let r=['meta[name="description"]','meta[name="keywords"]','meta[property="og:title"]','meta[property="og:description"]','meta[name="twitter:title"]','meta[name="twitter:description"]'];for(let n of r){let a=document.querySelector(n)?.getAttribute("content");a&&o(a)}let i=["h1","h2","h3","h4","h5","h6","p","blockquote","q","pre","code","li","dt","dd","th","td","caption","a","b","strong","em","i","u","s","abbr","acronym","cite","dfn","mark","small","sub","sup","ins","del","bdi","bdo","article","section","aside","nav","header","footer","main","summary","details","figcaption","figure","address","time","output","label","legend","option","button","font","center","span","div","[role='heading']","[role='main']","[role='article']","[role='region']","[role='complementary']","[role='contentinfo']","[role='navigation']","[role='banner']","[role='listitem']","[role='cell']","[role='columnheader']","[role='rowheader']"],s=document.querySelectorAll(i.join(","));for(let n of s){if(n.closest("[data-yuktai-panel]")||!ue(n)||n.querySelector("p, h1, h2, h3, h4, h5, h6, li, td, th, div, article, section, blockquote, pre"))continue;let l=n.innerText?.trim();if(l&&l.length>10&&o(l),!l){let P=n.textContent?.trim();P&&P.length>10&&o(P)}let c=n.getAttribute("aria-label")?.trim();c&&c.length>5&&o(c);let m=n.getAttribute("aria-description")?.trim();m&&m.length>5&&o(m);let p=n.getAttribute("aria-valuetext")?.trim();p&&o(p);let O=n.getAttribute("title")?.trim();O&&O.length>5&&o(O);let F=n.getAttribute("data-label")?.trim();F&&o(F);let D=n.getAttribute("data-title")?.trim();D&&o(D),n.querySelectorAll("img").forEach(P=>{let k=P.getAttribute("alt")?.trim();k&&k.length>5&&o(k);let _=P.getAttribute("title")?.trim();_&&_.length>5&&o(_)})}document.querySelectorAll("img").forEach(n=>{if(n.closest("[data-yuktai-panel]")||!ue(n))return;let a=n.getAttribute("alt")?.trim(),l=n.getAttribute("title")?.trim();a&&a.length>5&&o(a),l&&l.length>5&&o(l)}),document.querySelectorAll("input:not([type=hidden]), textarea").forEach(n=>{if(n.closest("[data-yuktai-panel]")||!ue(n))return;n.placeholder&&o(n.placeholder),n.value&&n.value.length>3&&o(n.value);let a=n.getAttribute("aria-label")?.trim();a&&o(a)}),document.querySelectorAll("select").forEach(n=>{n.closest("[data-yuktai-panel]")||ue(n)&&Array.from(n.options).forEach(a=>{a.text?.trim().length>3&&o(a.text.trim())})}),document.querySelectorAll("td, th").forEach(n=>{if(n.closest("[data-yuktai-panel]")||!ue(n))return;let a=n.innerText?.trim();a&&a.length>3&&o(a)});try{document.querySelectorAll("iframe").forEach(n=>{try{let a=n.contentDocument;if(!a)return;let l=a.body?.innerText?.trim();l&&l.length>20&&o(l.slice(0,500))}catch{}})}catch{}return document.querySelectorAll("a").forEach(n=>{if(n.closest("[data-yuktai-panel]")||!ue(n))return;let a=n.innerText?.trim();a&&a.length>3&&a.length<100&&o(a)}),e.join(" ").slice(0,5e3)}function yr(e){let t=e.getAttribute("aria-label")?.trim();if(t)return t;let o=e.getAttribute("aria-labelledby");if(o){let l=document.getElementById(o);if(l)return l.innerText?.trim()||""}if(e.id){let l=document.querySelector(`label[for="${e.id}"]`);if(l)return l.innerText?.trim()||""}let r=e.closest("label");if(r){let l=r.cloneNode(!0);return l.querySelectorAll("input, select, textarea").forEach(c=>c.remove()),l.innerText?.trim()||""}if((e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement)&&e.placeholder)return e.placeholder;if(e.name)return e.name.replace(/[_-]/g," ");let i=e.previousSibling;if(i?.nodeType===Node.TEXT_NODE){let l=i.textContent?.trim();if(l&&l.length>1)return l}let s=e.previousElementSibling;if(s){let l=s.innerText?.trim();if(l&&l.length>1&&l.length<60)return l}let n=e.closest("td, th");if(n){let l=n.previousElementSibling;if(l){let c=l.innerText?.trim();if(c&&c.length>1)return c}}let a=e.getAttribute("title")?.trim();return a||(e instanceof HTMLInputElement?e.type:"field")}function Xo(){let e=[],t=document.querySelectorAll(["input:not([type=hidden])","input:not([type=submit])","input:not([type=button])","input:not([type=reset])","input:not([type=image])","select","textarea","[contenteditable='true']","[role='textbox']","[role='combobox']","[role='spinbutton']","[role='searchbox']","[role='listbox']"].join(", "));for(let o of t){if(o.closest("[data-yuktai-panel]")||!ue(o))continue;if(o instanceof HTMLInputElement){let i=o.type.toLowerCase();if(["submit","button","reset","image"].includes(i))continue}let r=yr(o);e.push({label:r,type:o instanceof HTMLInputElement?o.type:o.tagName.toLowerCase(),placeholder:(o instanceof HTMLInputElement||o instanceof HTMLTextAreaElement)&&o.placeholder||"",required:o.required||o.getAttribute("aria-required")==="true"||o.getAttribute("data-required")==="true",element:o})}return e}function Ko(e,t=3e3){e.scrollIntoView({behavior:"smooth",block:"center"}),e.style.outline="3px solid #0d9488",e.style.outlineOffset="3px";try{e.focus()}catch{}setTimeout(()=>{e.style.outline="",e.style.outlineOffset=""},t)}function Zo(e){let t=e.toLowerCase(),o=document.querySelectorAll("h1, h2, h3, h4, h5, h6, section, article, [id], [aria-label], [role='heading'], [role='region']");for(let r of o){if(r.closest("[data-yuktai-panel]")||!ue(r))continue;if((r.innerText||r.getAttribute("id")||r.getAttribute("aria-label")||r.getAttribute("name")||"").toLowerCase().includes(t))return r.scrollIntoView({behavior:"smooth",block:"center"}),r.style.outline="2px solid #0d9488",r.style.outlineOffset="4px",setTimeout(()=>{r.style.outline="",r.style.outlineOffset=""},2500),!0}return!1}async function hr(e,t,o){let r=window,i=r.LanguageModel||r.ai?.languageModel;if(!i)throw new Error("Gemini Nano not available");let s=await i.create({systemPrompt:`You are a helpful web accessibility agent.
Create a simple action plan to help a user complete a task on a webpage.
Rules:
- Maximum 5 steps
- Short and clear \u2014 no jargon
- If filling a form \u2014 list each field and what to enter
- No markdown \u2014 no asterisks, no bold, no headers
- Number each step: 1. 2. 3.`}),a=`Page content: ${e}${o?`
The page has form fields the user may need to fill.`:""}

User task: ${t}

Action plan:`,l=await s.prompt(a);return s.destroy(),l?.trim()||""}async function xr(e,t){let{askPageWithTransformers:o}=await Promise.resolve().then(()=>(Me(),kt));return(await o(`How do I: ${t}`)).answer||"I could not create a plan for this task."}async function vr(e,t,o){if(!e.trim())return{success:!1,steps:[],error:"Please tell me what you want to do."};if(!t)return{success:!1,steps:[],error:"No AI engine available on this device."};let r=[],i=(s,n="info")=>{let a={text:s,type:n};r.push(a),o(a)};try{i("\u{1F4D6} Reading page content...","info");let s=Uo(),n=Xo(),a=n.length>0;s.length<50&&i("\u26A0\uFE0F Page content is very limited. This may be a static image page.","error"),i(a?`\u{1F4CB} Found ${n.length} form field${n.length!==1?"s":""} on this page`:"\u{1F4C4} No form fields found \u2014 this appears to be a content page","info"),i("\u{1F916} Creating action plan...","info");let l="";try{t==="gemini"?l=await hr(s,e,a):l=await xr(s,e)}catch{l=a?`1. Locate the form on this page
2. Fill each required field
3. Review your answers
4. Submit the form`:`1. Read the page carefully
2. Find the section relevant to your task
3. Follow the on-page instructions`}if(l&&(i("\u2705 Your action plan:","success"),l.split(/\n/).map(c=>c.replace(/\*\*/g,"").replace(/\*/g,"").trim()).filter(c=>c.length>5).slice(0,6).forEach(c=>i(`   ${c}`,"action"))),a){let c=n[0];i(`\u{1F3AF} First field: "${c.label}"${c.required?" \u2605 required":""}`,"field"),Ko(c.element),n.length>1&&i(`\u{1F4DD} All ${n.length} fields: ${n.map(m=>m.label).join(" \u2192 ")}`,"info")}else{let c=e.toLowerCase().split(/\s+/).filter(p=>p.length>3),m=!1;for(let p of c)if(Zo(p)){i(`\u{1F3AF} Scrolled to relevant section: "${p}"`,"action"),m=!0;break}m||i("\u{1F4A1} Scroll through the page to find what you need.","info")}return i("\u2705 Ready. Follow the steps above. Ask me again if you need more help.","success"),{success:!0,steps:r}}catch(s){let n=s instanceof Error?s.message:"Agent error.";return i(`\u26A0\uFE0F ${n}`,"error"),{success:!1,steps:r,error:n}}}var Qo=ye(()=>{"use strict";f()});var Mr={};Ee(Mr,{CheckIcon:()=>Ht,ChevronLeftIcon:()=>Nt,ChevronRightIcon:()=>Ft,CloseIcon:()=>$t,IconBase:()=>K,Runtime:()=>fe,SearchIcon:()=>Rt,SortDownIcon:()=>It,SortUpIcon:()=>Mt,YuktAI:()=>Rr,YuktAIWrapper:()=>Ke,YuktaiGrid:()=>en,YuktaiGridAI:()=>on,YuktaiGridAgent:()=>rn,YuktaiGridWebMCP:()=>Et,aiPlugin:()=>Pe,countGrid:()=>Je,default:()=>Ke,getColumns:()=>Qe,getRow:()=>et,highlightRows:()=>tt,openRow:()=>nt,searchGrid:()=>Ze,selectRow:()=>ot,useGrid:()=>tn,useYuktaiGridAgent:()=>Lt,voicePlugin:()=>Ne,wcag:()=>re,wcagPlugin:()=>re});module.exports=yn(Mr);f();f();f();function _t(){let e=window;return e.Rewriter||e.ai?.rewriter||null}async function lt(){try{let e=_t();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}async function hn(e){if(!e||e.trim().length<20)return{success:!1,original:e,rewritten:e,error:"Text too short"};try{let t=_t();if(!t)throw new Error("Rewriter API not available");let o=await t.create({tone:"more-casual",format:"plain-text",length:"as-is",outputLanguage:"en"}),r=await o.rewrite(e,{context:"Rewrite this text in simple plain English. Use short sentences. Avoid jargon. Make it easy to understand for everyone."});return o.destroy(),{success:!0,original:e,rewritten:r.trim()}}catch(t){return{success:!1,original:e,rewritten:e,error:t instanceof Error?t.message:"Rewrite failed"}}}async function Dt(){if(!await lt())return{fixed:0,error:"Chrome Built-in AI Rewriter not available. Enable via chrome://flags."};let t=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption"),o=0;for(let r of t){let i=r.innerText?.trim();if(!i||i.length<20||r.closest("[data-yuktai-panel]"))continue;let s=await hn(i);s.success&&s.rewritten!==i&&(r.dataset.yuktaiOriginal=i,r.innerText=s.rewritten,o++)}return{fixed:o}}function qt(){let e=document.querySelectorAll("[data-yuktai-original]");for(let t of e){let o=t.dataset.yuktaiOriginal;o&&(t.innerText=o,delete t.dataset.yuktaiOriginal)}}f();var jt="yuktai-summary-box";function Yt(){let e=window;return e.Summarizer||e.ai?.summarizer||null}async function ct(){try{let e=Yt();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}function xn(){let e=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, article, section"),t=[];for(let o of e){if(o.closest("[data-yuktai-panel]"))continue;let r=window.getComputedStyle(o);if(r.display==="none"||r.visibility==="hidden")continue;let i=o.innerText?.trim();i&&i.length>10&&t.push(i)}return t.join(" ").slice(0,5e3)}async function Vt(){if(!await ct())return{success:!1,summary:"",error:"Chrome Built-in AI Summarizer not available. Enable via chrome://flags."};let t=xn();if(!t||t.length<100)return{success:!1,summary:"",error:"Not enough text on this page to summarise."};try{let o=Yt();if(!o)throw new Error("Summarizer API not available");let r=await o.create({type:"tl;dr",format:"plain-text",length:"short",outputLanguage:"en"}),i=await r.summarize(t,{context:"Summarise this page in 2-3 simple sentences for a screen reader user who wants to know if this page is relevant to them."});return r.destroy(),vn(i.trim()),{success:!0,summary:i.trim()}}catch(o){return{success:!1,summary:"",error:o instanceof Error?o.message:"Summary failed"}}}function vn(e){_e();let t=document.createElement("div");t.id=jt,t.setAttribute("data-yuktai-panel","true"),t.setAttribute("role","region"),t.setAttribute("aria-label","Page summary by yuktai"),t.style.cssText=`
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
  `,r.addEventListener("click",_e),t.appendChild(o),t.appendChild(r),document.body.prepend(t)}function _e(){let e=document.getElementById(jt);e&&e.remove()}f();var qe=[{code:"en",label:"English"},{code:"hi",label:"Hindi"},{code:"es",label:"Spanish"},{code:"fr",label:"French"},{code:"de",label:"German"},{code:"it",label:"Italian"},{code:"pt",label:"Portuguese"},{code:"nl",label:"Dutch"},{code:"pl",label:"Polish"},{code:"ru",label:"Russian"},{code:"ja",label:"Japanese"},{code:"ko",label:"Korean"},{code:"zh",label:"Chinese"},{code:"ar",label:"Arabic"},{code:"tr",label:"Turkish"},{code:"vi",label:"Vietnamese"},{code:"bn",label:"Bengali"},{code:"id",label:"Indonesian"}],De="en";function wn(){let e=window;return e.Translator||e.translation||null}async function kn(e){try{let t=window;if(!wn())return!1;if(t.Translator&&typeof t.Translator.availability=="function")try{let r=await t.Translator.availability({sourceLanguage:"en",targetLanguage:e});return r==="readily"||r==="available"||r==="downloadable"||r==="after-download"}catch{}return t.Translator&&typeof t.Translator.canTranslate=="function"?await t.Translator.canTranslate({sourceLanguage:"en",targetLanguage:e})!=="no":t.translation&&typeof t.translation.canTranslate=="function"?await t.translation.canTranslate({sourceLanguage:"en",targetLanguage:e})!=="no":!1}catch{return!1}}async function Sn(e){let t=window,o={sourceLanguage:"en",targetLanguage:e};if(t.Translator&&typeof t.Translator.create=="function")return await t.Translator.create(o);if(t.translation&&typeof t.translation.createTranslator=="function")return await t.translation.createTranslator(o);throw new Error("Translation API not available")}async function Ut(e){if(e===De)return{success:!0,language:e,fixed:0};if(e==="en")return dt(),De="en",{success:!0,language:"en",fixed:0};if(!await kn(e))return{success:!1,language:e,fixed:0,error:`Translation to ${e} not available. Enable via chrome://flags.`};try{let o=await Sn(e),r=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption, span, a"),i=0;for(let s of r){if(s.closest("[data-yuktai-panel]")||s.children.length>0)continue;let n=s.innerText?.trim();if(!n||n.length<2)continue;s.dataset.yuktaiTranslationOriginal||(s.dataset.yuktaiTranslationOriginal=n);let a=await o.translate(n);a&&a!==n&&(s.innerText=a,i++)}return typeof o.destroy=="function"&&o.destroy(),De=e,{success:!0,language:e,fixed:i}}catch(o){return{success:!1,language:e,fixed:0,error:o instanceof Error?o.message:"Translation failed"}}}function dt(){let e=document.querySelectorAll("[data-yuktai-translation-original]");for(let t of e){let o=t.dataset.yuktaiTranslationOriginal;o&&(t.innerText=o,delete t.dataset.yuktaiTranslationOriginal)}De="en"}f();var Tn=[{phrases:["go to main","skip to main","main content"],action:"focus-main",label:"Jump to main content"},{phrases:["go to navigation","go to nav","open menu"],action:"focus-nav",label:"Jump to navigation"},{phrases:["go to search","search","find"],action:"focus-search",label:"Jump to search"},{phrases:["scroll down","page down","next"],action:"scroll-down",label:"Scroll down"},{phrases:["scroll up","page up","back up"],action:"scroll-up",label:"Scroll up"},{phrases:["go back","previous page"],action:"go-back",label:"Go back"},{phrases:["click","press","select"],action:"click-focused",label:"Click focused element"},{phrases:["next item","tab forward","tab"],action:"tab-forward",label:"Move to next element"},{phrases:["previous item","tab back","shift tab"],action:"tab-back",label:"Move to previous element"},{phrases:["stop listening","stop voice","quiet"],action:"stop-voice",label:"Stop voice control"}],se=null,je=!1,he=null;function pt(){return!!(window.SpeechRecognition||window.webkitSpeechRecognition)}function An(e){let t=e.toLowerCase().trim();for(let o of Tn)for(let r of o.phrases)if(t.includes(r))return{action:o.action,label:o.label};return null}function Cn(e){switch(e){case"focus-main":{let t=document.querySelector("main, [role='main'], #main");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-nav":{let t=document.querySelector("nav, [role='navigation']");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-search":{let t=document.querySelector("input[type='search'], input[role='searchbox'], [aria-label*='search' i]");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"scroll-down":{window.scrollBy({top:400,behavior:"smooth"});break}case"scroll-up":{window.scrollBy({top:-400,behavior:"smooth"});break}case"go-back":{window.history.back();break}case"click-focused":{let t=document.activeElement;t&&t!==document.body&&t.click();break}case"tab-forward":{let t=Xt(),o=t.indexOf(document.activeElement),r=t[o+1]||t[0];r&&r.focus();break}case"tab-back":{let t=Xt(),o=t.indexOf(document.activeElement),r=t[o-1]||t[t.length-1];r&&r.focus();break}case"stop-voice":{ut();break}}}function Xt(){return Array.from(document.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(e=>!e.closest("[data-yuktai-panel]"))}function Kt(e){if(!pt())return!1;if(je)return!0;e&&(he=e);let t=window.SpeechRecognition||window.webkitSpeechRecognition;return se=new t,se.continuous=!0,se.interimResults=!1,se.lang="en-US",se.onresult=o=>{let r=o.results[o.results.length-1][0].transcript,i=An(r);if(i){Cn(i.action);let s={success:!0,command:r,action:i.label};if(he&&he(s),i.action==="stop-voice")return}},se.onend=()=>{je&&se?.start()},se.onerror=o=>{o.error!=="no-speech"&&he&&he({success:!1,command:"",action:"",error:`Voice error: ${o.error}`})},se.start(),je=!0,En(),!0}function ut(){je=!1,se&&(se.stop(),se=null),he=null,Jt()}var Zt="yuktai-voice-indicator";function En(){Jt();let e=document.createElement("div");e.id=Zt,e.setAttribute("data-yuktai-panel","true"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-label","yuktai voice control is listening"),e.style.cssText=`
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
    `,document.head.appendChild(r)}let o=document.createElement("span");o.textContent="Listening for commands...",e.appendChild(t),e.appendChild(o),document.body.appendChild(e)}function Jt(){let e=document.getElementById(Zt);e&&e.remove()}f();var Ln=["button:not([aria-label]):not([aria-labelledby])","a:not([aria-label]):not([aria-labelledby])","input:not([aria-label]):not([aria-labelledby]):not([id])","select:not([aria-label]):not([aria-labelledby])","textarea:not([aria-label]):not([aria-labelledby])","[role='button']:not([aria-label])","[role='link']:not([aria-label])","[role='checkbox']:not([aria-label])","[role='tab']:not([aria-label])"].join(", ");function Qt(){let e=window;return e.Writer||e.ai?.writer||null}async function ft(){try{let e=Qt();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}function Rn(e){let t=[],o=e.innerText?.trim();o&&t.push(`element text: "${o}"`);let r=e.placeholder?.trim();r&&t.push(`placeholder: "${r}"`);let i=e.getAttribute("name")?.trim();i&&t.push(`name: "${i}"`);let s=e.getAttribute("type")?.trim();s&&t.push(`type: "${s}"`);let n=e.id;if(n){let c=document.querySelector(`label[for="${n}"]`);c&&t.push(`label: "${c.innerText?.trim()}"`)}let a=e.parentElement?.innerText?.trim().slice(0,60);a&&t.push(`parent context: "${a}"`),t.push(`tag: ${e.tagName.toLowerCase()}`);let l=e.getAttribute("role");return l&&t.push(`role: ${l}`),t.join(". ")}async function Mn(e,t){let o=`
    Generate a short, clear aria-label for an HTML element.
    The label must be 2-6 words maximum.
    The label must describe what the element does or what it is.
    Do not include punctuation.
    Do not explain \u2014 just output the label text only.

    Element details:
    ${t}

    Output only the label. Nothing else.
  `.trim();return(await e.write(o)).trim().replace(/^["']|["']$/g,"").replace(/\.$/,"").trim()}async function eo(){if(!await ft())return{success:!1,fixed:0,elements:[],error:"Chrome Built-in AI Writer not available. Enable via chrome://flags."};let t=document.querySelectorAll(Ln);if(t.length===0)return{success:!0,fixed:0,elements:[]};try{let o=Qt();if(!o)throw new Error("Writer API not available");let r=await o.create({tone:"neutral",format:"plain-text",length:"short",outputLanguage:"en"}),i=0,s=[];for(let n of t){if(n.closest("[data-yuktai-panel]"))continue;let a=window.getComputedStyle(n);if(a.display==="none"||a.visibility==="hidden")continue;let l=Rn(n),c=await Mn(r,l);c&&c.length>0&&(n.dataset.yuktaiLabelOriginal=n.getAttribute("aria-label")||"",n.setAttribute("aria-label",c),i++,s.push({tag:n.tagName.toLowerCase(),label:c}))}return r.destroy(),{success:!0,fixed:i,elements:s}}catch(o){return{success:!1,fixed:0,elements:[],error:o instanceof Error?o.message:"Label generation failed"}}}function to(){let e=document.querySelectorAll("[data-yuktai-label-original]");for(let t of e){let o=t.dataset.yuktaiLabelOriginal;o?t.setAttribute("aria-label",o):t.removeAttribute("aria-label"),delete t.dataset.yuktaiLabelOriginal}}var Ue=null,oo=null;var no=null,mt=null,B=null,xe=null,Ye=null,gt=null,ve=null,Ve={deuteranopia:"yuktai-cb-d",protanopia:"yuktai-cb-p",tritanopia:"yuktai-cb-t"};var ro=new Set(["input","select","textarea"]);var bt={nav:"navigation",header:"banner",footer:"contentinfo",main:"main",aside:"complementary"};function yt(e,t="polite"){if(typeof window>"u"||!ve?.speechEnabled||!window.speechSynthesis)return;window.speechSynthesis.cancel();let o=new SpeechSynthesisUtterance(e);o.rate=1,o.pitch=1,o.volume=1;let r=window.speechSynthesis.getVoices();r.length>0&&(o.voice=r[0]),window.speechSynthesis.speak(o)}function uo(e,t="info"){if(typeof document>"u")return;let r={success:{bg:"#0f9d58",border:"#0a7a44",icon:"\u2713"},error:{bg:"#d93025",border:"#b52a1c",icon:"\u2715"},warning:{bg:"#f29900",border:"#c67c00",icon:"\u26A0"},info:{bg:"#1a73e8",border:"#1557b0",icon:"\u2139"}}[t];B||(B=document.createElement("div"),B.setAttribute("role","alert"),B.setAttribute("aria-live","assertive"),B.setAttribute("aria-atomic","true"),B.style.cssText=`
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
    `,document.body.appendChild(B)),B.style.background=r.bg,B.style.border=`1px solid ${r.border}`,B.style.color="#fff",B.innerHTML=`
    <span style="font-size:18px;font-weight:700">${r.icon}</span>
    <span style="flex:1;line-height:1.4">${e}</span>
    <button
      onclick="this.parentElement.style.transform='translateX(120%)';this.parentElement.style.opacity='0'"
      style="background:none;border:none;color:#fff;cursor:pointer;font-size:18px;padding:0;line-height:1"
      aria-label="Close notification">\xD7</button>
  `,window.innerWidth<=480&&(B.style.right="8px",B.style.left="8px",B.style.maxWidth="none",B.style.width="auto"),requestAnimationFrame(()=>{B&&(B.style.transform="translateX(0)",B.style.opacity="1")}),setTimeout(()=>{B&&(B.style.transform="translateX(120%)",B.style.opacity="0")},5e3)}function I(e,t="info",o=!0){Ue&&(Ue.textContent=e),uo(e,t),o&&yt(e,t==="error"?"assertive":"polite")}function In(){if(typeof document>"u"||no)return;let e=[{label:"Skip to main content",selector:"main,[role='main'],#main,#main-content"},{label:"Skip to navigation",selector:"nav,[role='navigation'],#nav,#navigation"},{label:"Skip to search",selector:"[role='search'],#search,input[type='search']"}],t=document.createElement("div");t.setAttribute("data-yuktai-skip-bar","true"),t.setAttribute("role","navigation"),t.setAttribute("aria-label","Skip links"),t.style.cssText=`
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
  `;let o=!1;if(e.forEach(({label:i,selector:s})=>{let n=document.querySelector(s);if(!n)return;o=!0,n.getAttribute("tabindex")||n.setAttribute("tabindex","-1");let a=document.createElement("a");a.href="#",a.textContent=i,a.style.cssText=`
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
    `,a.addEventListener("focus",()=>{t.style.transform="translateY(0)"}),a.addEventListener("blur",()=>{setTimeout(()=>{t.matches(":focus-within")||(t.style.transform="translateY(-100%)")},2e3)}),a.addEventListener("click",l=>{l.preventDefault(),n.focus(),n.scrollIntoView({behavior:"smooth",block:"start"}),I(`Jumped to ${i.replace("Skip to ","")}`,"info"),t.style.transform="translateY(-100%)"}),t.appendChild(a)}),!o)return;window.innerWidth<768&&(t.style.transform="translateY(0)",t.style.position="sticky"),window.addEventListener("resize",()=>{window.innerWidth<768&&(t.style.transform="translateY(0)")}),document.body.insertBefore(t,document.body.firstChild),no=t}function Pn(){if(typeof document>"u"||document.querySelector("[data-yuktai-focus-style]"))return;let e=document.createElement("style");e.setAttribute("data-yuktai-focus-style","true"),e.textContent=`

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
  `,document.head.appendChild(e),document.documentElement.setAttribute("data-yuktai-a11y","true")}function Nn(){typeof document>"u"||document.querySelector("[data-yuktai-kb-init]")||(document.documentElement.setAttribute("data-yuktai-kb-init","true"),document.addEventListener("keydown",e=>{let t=document.activeElement;if(!t)return;let o=t.getAttribute("role")||"";if(e.key==="Escape"){let r=t.closest("[role='dialog'],[role='alertdialog']");if(r){r.style.display="none",I("Dialog closed","info");return}let i=t.closest("[role='menu'],[role='menubar']");i&&(i.style.display="none",I("Menu closed","info"))}if(o==="menuitem"||t.closest("[role='menu'],[role='menubar']")){let r=t.closest("[role='menu'],[role='menubar']");if(!r)return;let i=Array.from(r.querySelectorAll("[role='menuitem']:not([disabled])")),s=i.indexOf(t);e.key==="ArrowDown"||e.key==="ArrowRight"?(e.preventDefault(),i[(s+1)%i.length]?.focus()):e.key==="ArrowUp"||e.key==="ArrowLeft"?(e.preventDefault(),i[(s-1+i.length)%i.length]?.focus()):e.key==="Home"?(e.preventDefault(),i[0]?.focus()):e.key==="End"&&(e.preventDefault(),i[i.length-1]?.focus())}if(o==="tab"||t.closest("[role='tablist']")){let r=t.closest("[role='tablist']");if(!r)return;let i=Array.from(r.querySelectorAll("[role='tab']:not([disabled])")),s=i.indexOf(t);if(e.key==="ArrowRight"||e.key==="ArrowDown"){e.preventDefault();let n=i[(s+1)%i.length];n?.focus(),n?.click()}else if(e.key==="ArrowLeft"||e.key==="ArrowUp"){e.preventDefault();let n=i[(s-1+i.length)%i.length];n?.focus(),n?.click()}}if(o==="option"||t.closest("[role='listbox']")){let r=t.closest("[role='listbox']");if(!r)return;let i=Array.from(r.querySelectorAll("[role='option']:not([aria-disabled='true'])")),s=i.indexOf(t);e.key==="ArrowDown"?(e.preventDefault(),i[(s+1)%i.length]?.focus()):e.key==="ArrowUp"?(e.preventDefault(),i[(s-1+i.length)%i.length]?.focus()):(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),t.setAttribute("aria-selected","true"),i.forEach(n=>{n!==t&&n.setAttribute("aria-selected","false")}),I(`Selected: ${t.textContent?.trim()}`,"success"))}e.altKey&&e.key==="a"&&(e.preventDefault(),zn()),e.key==="Tab"&&ve?.speechEnabled&&setTimeout(()=>{let r=document.activeElement;if(!r)return;let i=r.getAttribute("aria-label")||r.getAttribute("title")||r.textContent?.trim()||r.tagName.toLowerCase(),s=r.getAttribute("role")||r.tagName.toLowerCase();yt(`${i}, ${s}`)},100)}))}function Xe(e){let t=e.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[role="button"]');if(t.length===0)return;let o=t[0],r=t[t.length-1];o.focus(),e.addEventListener("keydown",i=>{i.key==="Tab"&&(i.shiftKey?document.activeElement===o&&(i.preventDefault(),r.focus()):document.activeElement===r&&(i.preventDefault(),o.focus()))})}function zn(){if(typeof document>"u")return;if(xe){xe.remove(),xe=null;return}let e=document.createElement("div");e.setAttribute("role","dialog"),e.setAttribute("aria-label","Keyboard shortcuts"),e.setAttribute("aria-modal","true"),e.setAttribute("data-yuktai-cheatsheet","true"),e.style.cssText=`
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
    ${t.map(([r,i])=>`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #2a2a4a">
        <kbd style="background:#2a2a4a;color:#74c0fc;padding:3px 8px;border-radius:4px;font-size:12px;font-family:monospace;border:1px solid #3a3a6a">${r}</kbd>
        <span style="font-size:12px;color:#ccc;text-align:right;flex:1;margin-left:12px">${i}</span>
      </div>
    `).join("")}
  `,e.querySelector("[data-yuktai-close]")?.addEventListener("click",()=>{e.remove(),xe=null}),e.addEventListener("keydown",r=>{r.key==="Escape"&&(e.remove(),xe=null)}),document.body.appendChild(e),xe=e,Xe(e),I("Keyboard shortcuts opened. Press Escape to close.","info")}function Fn(e){if(typeof document>"u"||!ve?.showAuditBadge||typeof window<"u"&&!window.location.hostname.includes("localhost")&&!window.location.hostname.includes("127.0.0.1"))return;mt&&mt.remove();let t=e.score,o=t>=90?"#0f9d58":t>=70?"#f29900":"#d93025",r=t>=90?"\u267F":t>=70?"\u26A0":"\u2715",i=document.createElement("button");i.setAttribute("aria-label",`Accessibility score: ${t} out of 100`),i.setAttribute("data-yuktai-badge","true"),i.style.cssText=`
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
  `,i.innerHTML=`${r} ${t}/100 <span style="font-weight:400;opacity:0.85">${e.details.length} issues</span>`,i.addEventListener("click",()=>Gn(e)),document.body.appendChild(i),mt=i}function Gn(e){let t=document.querySelector("[data-yuktai-audit-details]");if(t){t.remove();return}let o=document.createElement("div");o.setAttribute("data-yuktai-audit-details","true"),o.setAttribute("role","dialog"),o.setAttribute("aria-label","Accessibility audit details"),o.style.cssText=`
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
    ${e.details.slice(0,20).map(i=>`
      <div style="padding:6px 0;border-bottom:1px solid #2a2a4a">
        <div style="display:flex;gap:6px;align-items:center">
          <span style="background:${r[i.severity]};color:#fff;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:700;text-transform:uppercase">${i.severity}</span>
          <code style="color:#74c0fc">&lt;${i.tag}&gt;</code>
        </div>
        <div style="color:#ccc;margin-top:3px">${i.fix}</div>
      </div>
    `).join("")}
    ${e.details.length>20?`<div style="color:#888;padding:8px 0;text-align:center">+${e.details.length-20} more issues</div>`:""}
  `,o.addEventListener("keydown",i=>{i.key==="Escape"&&o.remove()}),document.body.appendChild(o),Xe(o)}function fo(e){typeof document>"u"||(gt&&clearTimeout(gt),gt=setTimeout(()=>{if(Ye)return;let t=document.createElement("div");t.setAttribute("role","alertdialog"),t.setAttribute("aria-label","Session timeout warning"),t.setAttribute("aria-modal","true"),t.setAttribute("data-yuktai-timeout","true"),t.style.cssText=`
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
    `;let o=t.querySelector("[data-yuktai-extend]"),r=t.querySelector("[data-yuktai-dismiss]");o?.addEventListener("click",()=>{t.remove(),Ye=null,I("Session extended. You have more time.","success"),ve?.timeoutWarning&&fo(ve.timeoutWarning)}),r?.addEventListener("click",()=>{t.remove(),Ye=null}),document.body.appendChild(t),Ye=t,Xe(t),I("Warning: Your session will expire soon. Do you need more time?","warning")},e*1e3))}function Hn(e){if(typeof document>"u")return;let t=document.documentElement;if(t.toggleAttribute("data-yuktai-high-contrast",!!e.highContrast),t.toggleAttribute("data-yuktai-dark",!!e.darkMode),t.toggleAttribute("data-yuktai-reduce-motion",!!e.reduceMotion),t.toggleAttribute("data-yuktai-large-targets",!!e.largeTargets),t.toggleAttribute("data-yuktai-keyboard",!!e.keyboardHints),t.toggleAttribute("data-yuktai-dyslexia",!!e.dyslexiaFont),e.localFont?document.body.style.fontFamily=`"${e.localFont}", system-ui, sans-serif`:e.dyslexiaFont||(document.body.style.fontFamily=""),e.fontSizeMultiplier&&e.fontSizeMultiplier!==1?document.documentElement.style.fontSize=`${e.fontSizeMultiplier*100}%`:document.documentElement.style.fontSize="",e.colorBlindMode&&e.colorBlindMode!=="none"){let o=e.colorBlindMode==="achromatopsia"?"grayscale(100%)":`url(#${Ve[e.colorBlindMode]})`;document.body.style.filter=o}else document.body.style.filter=""}function $n(e){try{let t=localStorage.getItem("yuktai-a11y-prefs");t&&Object.assign(e,JSON.parse(t))}catch{}}async function io(e){if(e){if(!await lt()){I("Plain English requires Chrome 127+","warning");return}I("Rewriting page in plain English...","info",!1);let o=await Dt();I(o.error?`Plain English failed: ${o.error}`:`${o.fixed} sections rewritten in plain English`,o.error?"error":"success",!1)}else qt(),I("Original text restored","info",!1)}async function ao(e){if(e){if(!await ct()){I("Page summariser requires Chrome 127+","warning");return}I("Generating page summary...","info",!1);let o=await Vt();I(o.error?`Summary failed: ${o.error}`:"Page summary added at top",o.error?"error":"success",!1)}else _e(),I("Page summary removed","info",!1)}async function so(e){if(e==="en"){dt(),I("Page restored to English","info",!1);return}I(`Translating page to ${e}...`,"info",!1);let t=await Ut(e);I(t.error?`Translation failed: ${t.error}`:`Page translated to ${e}`,t.error?"error":"success",!1)}async function lo(e){if(e){if(!pt()){I("Voice control not supported in this browser","warning");return}Kt(t=>{t.success&&I(`Voice: ${t.action}`,"info",!1)}),I("Voice control started. Say a command.","success",!1)}else ut(),I("Voice control stopped","info",!1)}async function co(e){if(e){if(!await ft()){I("Smart labels requires Chrome 127+","warning");return}I("Generating smart labels...","info",!1);let o=await eo();I(o.error?`Smart labels failed: ${o.error}`:`${o.fixed} elements labelled`,o.error?"error":"success",!1)}else to(),I("Smart labels removed","info",!1)}function Wn(){if(typeof document>"u"||Ue)return;let e=document.createElement("div");e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e.setAttribute("aria-relevant","text"),e.style.cssText="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);",document.body.appendChild(e),Ue=e}function On(){if(typeof document>"u"||oo)return;let e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("aria-hidden","true"),e.style.cssText="position:absolute;width:0;height:0;overflow:hidden;",e.innerHTML=`
    <defs>
      <filter id="${Ve.deuteranopia}">
        <feColorMatrix type="matrix"
          values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${Ve.protanopia}">
        <feColorMatrix type="matrix"
          values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${Ve.tritanopia}">
        <feColorMatrix type="matrix"
          values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"/>
      </filter>
    </defs>
  `,document.body.appendChild(e),oo=e}function po(e){let t={critical:20,serious:10,moderate:5,minor:2},o=e.details.reduce((r,i)=>r+(t[i.severity]||0),0);return Math.max(0,Math.min(100,100-o))}var re={name:"yuktai-a11y",version:"4.0.0",observer:null,async execute(e){if(!e.enabled)return this.stopObserver(),"yuktai: disabled.";ve=e,$n(e),Wn(),On(),Pn(),Nn(),e.showSkipLinks!==!1&&In(),e.showPreferencePanel,Hn(e);let t=this.applyFixes(e);t.score=po(t),e.showAuditBadge&&Fn(t),e.timeoutWarning&&fo(e.timeoutWarning),e.autoFix&&this.startObserver(e),e.plainEnglish&&await io(!0),e.summarisePage&&await ao(!0),e.translateLanguage&&e.translateLanguage!=="en"&&await so(e.translateLanguage),e.voiceControl&&await lo(!0),e.smartLabels&&await co(!0);let o=`${t.fixed} fixes applied. Score: ${t.score}/100.`;return I(o,t.score>=90?"success":"info",!1),`yuktai v4.0.0: ${o} Scanned ${t.scanned} elements in ${t.renderTime}ms.`},applyFixes(e){let t={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return t;let o=performance.now(),r=document.querySelectorAll("*");t.scanned=r.length;let i=(s,n,a,l)=>{t.details.push({tag:s,fix:n,severity:a,element:l.outerHTML.slice(0,100)}),t.fixed++};return r.forEach(s=>{let n=s,a=n.tagName.toLowerCase();if(a==="html"&&!n.getAttribute("lang")&&(n.setAttribute("lang","en"),i(a,'lang="en" added',"critical",n)),a==="meta"){let c=n.getAttribute("name"),m=n.getAttribute("content")||"";c==="viewport"&&m.includes("user-scalable=no")&&(n.setAttribute("content",m.replace("user-scalable=no","user-scalable=yes")),i(a,"user-scalable=yes restored","serious",n)),c==="viewport"&&/maximum-scale=1(?:[^0-9]|$)/.test(m)&&(n.setAttribute("content",m.replace(/maximum-scale=1(?=[^0-9]|$)/,"maximum-scale=5")),i(a,"maximum-scale=5 restored","serious",n))}if(a==="main"&&!n.getAttribute("tabindex")&&(n.setAttribute("tabindex","-1"),n.getAttribute("id")||n.setAttribute("id","main-content")),a==="img"&&(n.hasAttribute("alt")||(n.setAttribute("alt",""),n.setAttribute("aria-hidden","true"),i(a,'alt="" aria-hidden="true"',"serious",n))),a==="svg"&&(!n.getAttribute("aria-hidden")&&!n.getAttribute("aria-label")&&!s.querySelector("title")&&(n.setAttribute("aria-hidden","true"),i(a,'aria-hidden="true" (decorative svg)',"minor",n)),n.getAttribute("focusable")||n.setAttribute("focusable","false")),a==="iframe"&&!n.getAttribute("title")&&!n.getAttribute("aria-label")&&(n.setAttribute("title","embedded content"),n.setAttribute("aria-label","embedded content"),i(a,"title + aria-label added","serious",n)),a==="button"){if(!n.innerText?.trim()&&!n.getAttribute("aria-label")){let c=n.getAttribute("title")||"button";n.setAttribute("aria-label",c),i(a,`aria-label="${c}" (empty button)`,"critical",n)}n.hasAttribute("disabled")&&!n.getAttribute("aria-disabled")&&(n.setAttribute("aria-disabled","true"),t.fixed++)}if(a==="a"){let c=n;!n.innerText?.trim()&&!n.getAttribute("aria-label")&&(n.setAttribute("aria-label",n.getAttribute("title")||"link"),i(a,"aria-label added (empty link)","critical",n)),c.target==="_blank"&&!c.rel?.includes("noopener")&&(c.rel="noopener noreferrer",t.fixed++)}if(ro.has(a)){let c=n;if(!n.getAttribute("aria-label")&&!n.getAttribute("aria-labelledby")){let m=n.getAttribute("placeholder")||n.getAttribute("name")||a;n.setAttribute("aria-label",m),i(a,`aria-label="${m}"`,"serious",n)}if(n.hasAttribute("required")&&!n.getAttribute("aria-required")&&(n.setAttribute("aria-required","true"),t.fixed++),a==="input"&&!c.autocomplete){let m=c.name||"";c.type==="email"||m.includes("email")?c.autocomplete="email":c.type==="tel"||m.includes("tel")?c.autocomplete="tel":c.type==="password"&&(c.autocomplete="current-password"),t.fixed++}}a==="th"&&!n.getAttribute("scope")&&(n.setAttribute("scope",n.closest("thead")?"col":"row"),i(a,"scope added to <th>","moderate",n)),bt[a]&&!n.getAttribute("role")&&(n.setAttribute("role",bt[a]),i(a,`role="${bt[a]}"`,"minor",n));let l=n.getAttribute("role")||"";l==="tab"&&!n.getAttribute("aria-selected")&&(n.setAttribute("aria-selected","false"),t.fixed++),["alert","status","log"].includes(l)&&!n.getAttribute("aria-live")&&(n.setAttribute("aria-live",l==="alert"?"assertive":"polite"),i(a,`aria-live added on role=${l}`,"moderate",n)),l==="combobox"&&!n.getAttribute("aria-expanded")&&(n.setAttribute("aria-expanded","false"),i(a,'aria-expanded="false" on combobox',"serious",n)),(l==="checkbox"||l==="radio")&&!n.getAttribute("aria-checked")&&(n.setAttribute("aria-checked","false"),i(a,`aria-checked="false" on role=${l}`,"serious",n))}),t.renderTime=parseFloat((performance.now()-o).toFixed(2)),t},scan(){let e={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return e;let t=performance.now(),o=document.querySelectorAll("*");e.scanned=o.length;let r=(i,s,n,a)=>e.details.push({tag:i,fix:s,severity:n,element:a.outerHTML.slice(0,100)});return o.forEach(i=>{let s=i,n=s.tagName.toLowerCase();(n==="a"||n==="button")&&!s.innerText?.trim()&&!s.getAttribute("aria-label")&&r(n,"needs aria-label (empty)","critical",s),n==="img"&&!s.hasAttribute("alt")&&r(n,"needs alt text","serious",s),ro.has(n)&&!s.getAttribute("aria-label")&&!s.getAttribute("aria-labelledby")&&r(n,"needs aria-label","serious",s),n==="iframe"&&!s.getAttribute("title")&&!s.getAttribute("aria-label")&&r(n,"iframe needs title","serious",s)}),e.fixed=e.details.length,e.score=po(e),e.renderTime=parseFloat((performance.now()-t).toFixed(2)),e},startObserver(e){this.observer||typeof document>"u"||(this.observer=new MutationObserver(()=>this.applyFixes(e)),this.observer.observe(document.body,{childList:!0,subtree:!0,attributes:!1}))},stopObserver(){this.observer?.disconnect(),this.observer=null},announce:I,speak:yt,showVisualAlert:uo,trapFocus:Xe,handlePlainEnglish:io,handleSummarisePage:ao,handleTranslate:so,handleVoiceControl:lo,handleSmartLabels:co,SUPPORTED_LANGUAGES:qe};f();f();var S=st(require("react"));f();var te=require("react");xt();Me();var d=require("react/jsx-runtime"),St={highContrast:!1,reduceMotion:!1,autoFix:!0,dyslexiaFont:!1,fontScale:100,localFont:"",darkMode:!1,largeTargets:!1,speechEnabled:!1,colorBlindMode:"none",showAuditBadge:!1,timeoutWarning:void 0,plainEnglish:!1,summarisePage:!1,translateLanguage:"en",voiceControl:!1,smartLabels:!1},ke=[80,90,100,110,120,130],Kn=[{value:"none",label:"None"},{value:"deuteranopia",label:"Deuteranopia"},{value:"protanopia",label:"Protanopia"},{value:"tritanopia",label:"Tritanopia"},{value:"achromatopsia",label:"Greyscale"}],Zn=["Prompt API for Gemini Nano","Summarization API for Gemini Nano","Writer API for Gemini Nano","Rewriter API for Gemini Nano","Translation API"];function Jn(){let[e,t]=(0,te.useState)(typeof window<"u"?window.innerWidth:1024);return(0,te.useEffect)(()=>{let o=()=>t(window.innerWidth);return window.addEventListener("resize",o),()=>window.removeEventListener("resize",o)},[]),{isMobile:e<=480,isTablet:e>480&&e<=768}}function Qn({checked:e,onChange:t,label:o,disabled:r=!1}){return(0,d.jsxs)("label",{"aria-label":o,style:{position:"relative",display:"inline-flex",width:"40px",height:"24px",cursor:r?"not-allowed":"pointer",flexShrink:0,opacity:r?.4:1},children:[(0,d.jsx)("input",{type:"checkbox",checked:e,disabled:r,onChange:i=>t(i.target.checked),style:{opacity:0,width:0,height:0,position:"absolute"}}),(0,d.jsx)("span",{style:{position:"absolute",inset:0,borderRadius:"99px",background:e?"#0d9488":"#cbd5e1",transition:"background 0.2s"}}),(0,d.jsx)("span",{style:{position:"absolute",top:"3px",left:e?"19px":"3px",width:"18px",height:"18px",background:"#fff",borderRadius:"50%",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)",pointerEvents:"none"}})]})}function Se({label:e,color:t="#64748b",badge:o,concept:r}){return(0,d.jsxs)("div",{style:{margin:"10px 18px 4px"},children:[(0,d.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[(0,d.jsx)("p",{style:{margin:0,fontSize:"10px",fontWeight:600,color:t,letterSpacing:"0.06em",textTransform:"uppercase"},children:e}),o&&(0,d.jsx)("span",{style:{fontSize:"9px",fontWeight:500,padding:"1px 7px",borderRadius:"99px",background:"#f5f3ff",color:"#7c3aed",border:"0.5px solid #c4b5fd",whiteSpace:"nowrap"},children:o})]}),r&&(0,d.jsx)("p",{style:{margin:"2px 0 0",fontSize:"9px",color:"#94a3b8",fontStyle:"italic"},children:r})]})}function le({icon:e,label:t,desc:o,checked:r,onChange:i,disabled:s=!1,disabledReason:n,tip:a}){return(0,d.jsxs)("div",{title:s?n:a,style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 18px",gap:"12px"},children:[(0,d.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"10px",flex:1,minWidth:0},children:[(0,d.jsx)("span",{"aria-hidden":"true",style:{width:"32px",height:"32px",borderRadius:"8px",background:s?"#f1f5f9":"#f0fdfa",color:s?"#94a3b8":"#0d9488",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"15px",flexShrink:0,fontWeight:700},children:e}),(0,d.jsxs)("div",{style:{minWidth:0},children:[(0,d.jsx)("p",{style:{margin:0,fontSize:"13px",fontWeight:500,color:s?"#94a3b8":"#0f172a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:t}),(0,d.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#94a3b8"},children:s?n:o})]})]}),(0,d.jsx)(Qn,{checked:r,onChange:i,label:`Toggle ${t}`,disabled:s})]})}function ee(){return(0,d.jsx)("div",{style:{height:"1px",background:"#f1f5f9"}})}function Ie({steps:e}){return(0,d.jsxs)("div",{style:{margin:"0 18px 8px",padding:"8px 10px",background:"#f8fafc",borderRadius:"8px",border:"0.5px solid #e2e8f0"},children:[(0,d.jsx)("p",{style:{margin:"0 0 4px",fontSize:"9px",fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.05em"},children:"How to use"}),e.map((t,o)=>(0,d.jsxs)("p",{style:{margin:"0 0 2px",fontSize:"10px",color:"#475569"},children:[o+1,". ",t]},o))]})}var Tt=(0,te.forwardRef)(({position:e,settings:t,report:o,isActive:r,aiSupported:i,voiceSupported:s,set:n,onApply:a,onReset:l,onClose:c},m)=>{let{isMobile:p,isTablet:O}=Jn(),[F,D]=(0,te.useState)([]),[P,k]=(0,te.useState)(""),[_,R]=(0,te.useState)(""),[h,H]=(0,te.useState)(!1),[T,L]=(0,te.useState)(null),[x,N]=(0,te.useState)("idle");(0,te.useEffect)(()=>{let u=window;!!(u.LanguageModel||u.ai?.languageModel)&&i?L("gemini"):Le()&&L("transformers")},[i]),(0,te.useEffect)(()=>{if(T!=="transformers")return;let u=setInterval(()=>{N(Re())},500);return()=>clearInterval(u)},[T]);let M=async()=>{if(!(!P.trim()||h)){if(!T){R("\u26A0\uFE0F No AI engine available on this device.");return}H(!0),R("");try{let u;T==="gemini"?u=await ht(P):(N("loading"),u=await wt(P),N("ready")),R(u.success&&u.answer?u.answer.replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/#+\s/g,"").trim():"\u26A0\uFE0F "+(u.error||"No answer found on this page"))}catch{R("\u26A0\uFE0F Failed to get answer. Please try again.")}H(!1)}};(0,te.useEffect)(()=>{(async()=>{try{let U=window;if(!U.queryLocalFonts)return;let Q=await U.queryLocalFonts(),ne=[...new Set(Q.map(ce=>ce.family))].sort();D(ne.slice(0,50))}catch{}})()},[]);let v=T==="gemini"?"Gemini Nano":T==="transformers"?"Transformers.js \xB7 All devices":"Detecting...",Z=T==="transformers"&&x==="loading"?"Loading AI model... (first time only)":"...",V=p?{position:"fixed",bottom:0,left:0,right:0,zIndex:9999,background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px 16px 0 0",boxShadow:"0 -8px 32px rgba(0,0,0,0.12)",maxHeight:"90vh",overflowY:"auto",fontFamily:"system-ui,-apple-system,sans-serif",width:"100%"}:{position:"fixed",bottom:"84px",[e]:"24px",zIndex:9999,width:O?"300px":"320px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",maxHeight:"80vh",overflowY:"auto",fontFamily:"system-ui,-apple-system,sans-serif"};return(0,d.jsxs)("div",{ref:m,role:"dialog","aria-modal":"true","aria-label":"yuktai accessibility preferences","data-yuktai-panel":"true",style:V,children:[(0,d.jsxs)("div",{style:{padding:"14px 18px 12px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"flex-start",justifyContent:"space-between",position:"sticky",top:0,background:"#fff",zIndex:1},children:[(0,d.jsxs)("div",{children:[(0,d.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"7px",marginBottom:"4px",flexWrap:"wrap"},children:[(0,d.jsx)("span",{style:{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0d9488",letterSpacing:"0.05em",fontFamily:"monospace"},children:"@yuktishaalaa/yuktai"}),r&&(0,d.jsx)("span",{style:{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0f766e",border:"1px solid #99f6e4"},children:"\u25CF ACTIVE"})]}),(0,d.jsx)("p",{style:{margin:"0 0 1px",fontSize:"15px",fontWeight:600,color:"#0f172a"},children:"Accessibility"}),(0,d.jsx)("p",{style:{margin:0,fontSize:"11px",color:"#64748b"},children:"WCAG 2.2 \xB7 Open source \xB7 Zero cost \xB7 All devices"})]}),(0,d.jsx)("button",{onClick:c,"aria-label":"Close accessibility panel",style:{background:"none",border:"none",cursor:"pointer",padding:"4px",color:"#94a3b8",fontSize:"20px",lineHeight:1,borderRadius:"6px",flexShrink:0,minWidth:p?"44px":"auto",minHeight:p?"44px":"auto",display:"flex",alignItems:"center",justifyContent:"center"},children:"\xD7"})]}),(0,d.jsx)(Se,{label:"\u267F Core Accessibility",concept:"Rule-based engine \u2014 works on all browsers and devices"}),(0,d.jsx)(Ie,{steps:["Toggle any feature on","Click Apply settings","Preferences saved automatically"]}),(0,d.jsx)(le,{icon:"\u{1F527}",label:"Auto-fix ARIA",desc:"Injects missing labels and roles automatically",checked:t.autoFix,onChange:u=>n("autoFix",u),tip:"Fixes aria-label, alt text, roles on every element"}),(0,d.jsx)(ee,{}),(0,d.jsx)(le,{icon:"\u{1F50A}",label:"Speak on focus",desc:"Browser reads elements aloud as you tab",checked:t.speechEnabled,onChange:u=>n("speechEnabled",u),tip:"Uses browser SpeechSynthesis \u2014 no install needed"}),(0,d.jsx)(ee,{}),(0,d.jsx)(le,{icon:"\u{1F399}\uFE0F",label:"Voice control",desc:"Say commands to navigate the page",checked:t.voiceControl,onChange:u=>n("voiceControl",u),disabled:!s,disabledReason:"Not supported in this browser",tip:'Say "scroll down", "go to main", "click"'}),(0,d.jsx)(ee,{}),(0,d.jsx)(Se,{label:"\u{1F916} AI Features",color:"#7c3aed",badge:"Gemini Nano",concept:"Large Language Model running privately on your device \u2014 Chrome 127+ only"}),(0,d.jsx)("div",{style:{margin:"4px 18px 6px",padding:"8px 10px",background:i?"#f0fdfa":"#f5f3ff",borderRadius:"8px",border:`0.5px solid ${i?"#99f6e4":"#c4b5fd"}`,fontSize:"10px",color:i?"#0f766e":"#7c3aed",lineHeight:1.5},children:i?"\u2705 Gemini Nano detected \u2014 AI features ready. Runs privately on your device.":"\u2699\uFE0F AI features need one-time setup \u2014 see guide below."}),!i&&(0,d.jsxs)("div",{style:{margin:"0 18px 8px",padding:"10px 12px",background:"#fafafa",borderRadius:"8px",border:"0.5px solid #e2e8f0",fontSize:"11px",color:"#475569",lineHeight:1.7},children:[(0,d.jsx)("p",{style:{margin:"0 0 6px",fontWeight:600,color:"#0f172a",fontSize:"11px"},children:"\u{1F6E0} One-time setup \u2014 5 steps:"}),(0,d.jsxs)("p",{style:{margin:"0 0 3px"},children:["1. Open Chrome \u2192 ",(0,d.jsx)("code",{style:{background:"#f1f5f9",padding:"1px 5px",borderRadius:"4px",fontSize:"10px",color:"#0d9488",fontFamily:"monospace"},children:"chrome://flags"})]}),(0,d.jsx)("p",{style:{margin:"0 0 3px"},children:"2. Enable each flag:"}),(0,d.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"2px",margin:"4px 0 6px 10px"},children:Zn.map(u=>(0,d.jsxs)("span",{style:{fontSize:"10px",color:"#7c3aed",fontFamily:"monospace"},children:["\u2192 ",u]},u))}),(0,d.jsxs)("p",{style:{margin:"0 0 3px"},children:["3. Click ",(0,d.jsx)("strong",{style:{color:"#0f172a"},children:"Relaunch"})]}),(0,d.jsxs)("p",{style:{margin:"0 0 3px"},children:["4. ",(0,d.jsx)("code",{style:{background:"#f1f5f9",padding:"1px 5px",borderRadius:"4px",fontSize:"10px",color:"#0d9488",fontFamily:"monospace"},children:"chrome://components"})," \u2192 Optimization Guide On Device Model \u2192 Check for update"]}),(0,d.jsx)("p",{style:{margin:"0"},children:"5. Refresh \u2014 AI features unlock automatically \u2705"})]}),(0,d.jsx)(le,{icon:"\u{1F4DD}",label:"Plain English mode",desc:"Rewrites complex text in simple language",checked:t.plainEnglish,onChange:u=>n("plainEnglish",u),disabled:!i,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: LLM text rewriting"}),(0,d.jsx)(ee,{}),(0,d.jsx)(le,{icon:"\u{1F4CB}",label:"Summarise page",desc:"3-sentence summary appears at top",checked:t.summarisePage,onChange:u=>n("summarisePage",u),disabled:!i,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: Abstractive summarisation"}),(0,d.jsx)(ee,{}),(0,d.jsx)(le,{icon:"\u{1F3F7}\uFE0F",label:"Smart aria-labels",desc:"AI generates meaningful labels for elements",checked:t.smartLabels,onChange:u=>n("smartLabels",u),disabled:!i,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: Context-aware label generation"}),(0,d.jsx)(ee,{}),(0,d.jsx)(Se,{label:"\u{1F441}\uFE0F Visual",concept:"CSS filter-based \u2014 works on all browsers and devices"}),(0,d.jsx)(Ie,{steps:["Toggle any visual mode","Changes apply instantly","Works on mobile and desktop"]}),(0,d.jsx)(le,{icon:"\u25D1",label:"High contrast",desc:"Boosts contrast for low vision users",checked:t.highContrast,onChange:u=>n("highContrast",u),tip:"CSS filter: contrast()"}),(0,d.jsx)(ee,{}),(0,d.jsx)(le,{icon:"\u{1F319}",label:"Dark mode",desc:"Inverts colours \u2014 easy on eyes at night",checked:t.darkMode,onChange:u=>n("darkMode",u),tip:"CSS filter: invert + hue-rotate"}),(0,d.jsx)(ee,{}),(0,d.jsx)(le,{icon:"\u23F8\uFE0F",label:"Reduce motion",desc:"Disables all animations",checked:t.reduceMotion,onChange:u=>n("reduceMotion",u),tip:"WCAG 2.3.3 \u2014 vestibular disorders"}),(0,d.jsx)(ee,{}),(0,d.jsx)(le,{icon:"\u{1F446}",label:"Large targets",desc:"44\xD744px minimum touch targets",checked:t.largeTargets,onChange:u=>n("largeTargets",u),tip:"WCAG 2.5.8 \u2014 motor impaired users"}),(0,d.jsx)(ee,{}),(0,d.jsxs)("div",{style:{padding:"10px 18px"},children:[(0,d.jsx)("p",{style:{margin:"0 0 2px",fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F3A8} Colour blindness"}),(0,d.jsx)("p",{style:{margin:"0 0 8px",fontSize:"10px",color:"#94a3b8"},children:"SVG colour matrix filters \u2014 all devices"}),(0,d.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"},children:Kn.map(u=>(0,d.jsx)("button",{onClick:()=>n("colorBlindMode",u.value),"aria-pressed":t.colorBlindMode===u.value,style:{padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500,border:`1px solid ${t.colorBlindMode===u.value?"#0d9488":"#e2e8f0"}`,background:t.colorBlindMode===u.value?"#f0fdfa":"#fff",color:t.colorBlindMode===u.value?"#0d9488":"#64748b",cursor:"pointer",minHeight:p?"36px":"auto"},children:u.label},u.value))})]}),(0,d.jsx)(ee,{}),(0,d.jsx)(Se,{label:"\u{1F524} Font",concept:"Browser Font API + CSS \u2014 Chrome 103+"}),(0,d.jsx)(Ie,{steps:["Toggle dyslexia font or pick from device","Adjust size with + / \u2212","Saved across visits"]}),(0,d.jsx)(le,{icon:"Aa",label:"Dyslexia-friendly font",desc:"Atkinson Hyperlegible \u2014 research-backed",checked:t.dyslexiaFont,onChange:u=>n("dyslexiaFont",u),tip:"By Braille Institute \u2014 free and open source"}),(0,d.jsx)(ee,{}),(0,d.jsxs)("div",{style:{padding:"10px 18px"},children:[(0,d.jsx)("p",{style:{margin:"0 0 2px",fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F5A5}\uFE0F Local font"}),(0,d.jsx)("p",{style:{margin:"0 0 8px",fontSize:"10px",color:"#94a3b8"},children:"window.queryLocalFonts() \u2014 Chrome 103+"}),F.length>0?(0,d.jsxs)("select",{value:t.localFont,onChange:u=>n("localFont",u.target.value),"aria-label":"Choose a font from your device",style:{width:"100%",padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"13px",color:"#0f172a",background:"#fff",cursor:"pointer",height:p?"44px":"36px"},children:[(0,d.jsx)("option",{value:"",children:"System default"}),F.map(u=>(0,d.jsx)("option",{value:u,style:{fontFamily:u},children:u},u))]}):(0,d.jsx)("p",{style:{margin:0,fontSize:"11px",color:"#94a3b8"},children:"Allow font access when Chrome prompts you."})]}),(0,d.jsx)(ee,{}),(0,d.jsxs)("div",{style:{padding:"10px 18px 14px"},children:[(0,d.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"10px"},children:[(0,d.jsxs)("div",{children:[(0,d.jsx)("p",{style:{margin:0,fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F4CF} Text size"}),(0,d.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#94a3b8"},children:"Scales all text on the page"})]}),(0,d.jsxs)("span",{style:{fontSize:"12px",fontWeight:600,color:"#0d9488",background:"#f0fdfa",padding:"2px 8px",borderRadius:"99px"},children:[t.fontScale,"%"]})]}),(0,d.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[(0,d.jsx)("button",{onClick:()=>{let u=ke.indexOf(t.fontScale);u>0&&n("fontScale",ke[u-1])},disabled:t.fontScale<=80,"aria-label":"Decrease text size",style:{width:p?"44px":"30px",height:p?"44px":"30px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:t.fontScale<=80?"not-allowed":"pointer",fontSize:"16px",color:t.fontScale<=80?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"\u2212"}),(0,d.jsx)("div",{style:{flex:1,display:"flex",gap:"3px"},children:ke.map(u=>(0,d.jsx)("button",{onClick:()=>n("fontScale",u),"aria-label":`Set text size to ${u}%`,style:{flex:1,height:"6px",borderRadius:"99px",border:"none",cursor:"pointer",padding:0,background:u<=t.fontScale?"#0d9488":"#e2e8f0",transition:"background 0.15s"}},u))}),(0,d.jsx)("button",{onClick:()=>{let u=ke.indexOf(t.fontScale);u<ke.length-1&&n("fontScale",ke[u+1])},disabled:t.fontScale>=130,"aria-label":"Increase text size",style:{width:p?"44px":"30px",height:p?"44px":"30px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:t.fontScale>=130?"not-allowed":"pointer",fontSize:"16px",color:t.fontScale>=130?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"+"})]})]}),(0,d.jsx)(ee,{}),(0,d.jsx)(Se,{label:"\u{1F310} Translate",color:"#7c3aed",badge:"Gemini Nano",concept:"Chrome Translation API \u2014 on device, no internet after setup"}),(0,d.jsx)(Ie,{steps:["Enable Gemini Nano first","Pick your language","Full page translates instantly"]}),(0,d.jsxs)("div",{style:{padding:"6px 18px 12px"},children:[(0,d.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"},children:qe.slice(0,p?8:18).map(u=>(0,d.jsx)("button",{onClick:()=>n("translateLanguage",u.code),"aria-pressed":t.translateLanguage===u.code,disabled:!i,style:{padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500,border:`1px solid ${t.translateLanguage===u.code?"#7c3aed":"#e2e8f0"}`,background:t.translateLanguage===u.code?"#f5f3ff":"#fff",color:t.translateLanguage===u.code?"#7c3aed":"#64748b",cursor:i?"pointer":"not-allowed",opacity:i?1:.5,minHeight:p?"36px":"auto"},children:u.label},u.code))}),!i&&(0,d.jsx)("p",{style:{margin:"6px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Enable Gemini Nano using the setup guide above."})]}),(0,d.jsx)(ee,{}),(0,d.jsx)(Se,{label:"\u{1F4AC} Ask This Page",color:"#0d9488",badge:v,concept:"RAG \u2014 Retrieval Augmented Generation. Works on all devices including mobile."}),(0,d.jsx)(Ie,{steps:["Type any question about this page","Press Ask or hit Enter",T==="transformers"?"Transformers.js answers \u2014 works on mobile, offline":"Gemini Nano reads page and answers privately","Zero cost. No data leaves your device."]}),(0,d.jsxs)("div",{style:{margin:"0 18px 8px",padding:"6px 10px",background:T==="gemini"?"#f0fdfa":T==="transformers"?"#f5f3ff":"#f8fafc",borderRadius:"8px",border:`0.5px solid ${T==="gemini"?"#99f6e4":T==="transformers"?"#c4b5fd":"#e2e8f0"}`,fontSize:"10px",color:T==="gemini"?"#0f766e":T==="transformers"?"#7c3aed":"#94a3b8"},children:[T==="gemini"&&"\u2705 Using Gemini Nano \u2014 on device, private, instant",T==="transformers"&&"\u2705 Using Transformers.js \u2014 works on mobile and all browsers",!T&&"\u23F3 Detecting AI engine...",T==="transformers"&&x==="loading"&&" \xB7 Loading model...",T==="transformers"&&x==="ready"&&" \xB7 Model ready \u2705"]}),(0,d.jsxs)("div",{style:{padding:"0 18px 14px"},children:[(0,d.jsxs)("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[(0,d.jsx)("input",{type:"text",value:P,onChange:u=>k(u.target.value),onKeyDown:u=>{u.key==="Enter"&&M()},placeholder:"e.g. What does this page do?",disabled:h||!T,"aria-label":"Ask a question about this page",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:T?"#fff":"#f8fafc",outline:"none",height:p?"44px":"36px"}}),(0,d.jsx)("button",{onClick:M,disabled:h||!P.trim()||!T,"aria-label":"Ask question",style:{padding:"8px 14px",borderRadius:"8px",border:"none",background:T&&P.trim()&&!h?"#0d9488":"#e2e8f0",color:T&&P.trim()&&!h?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:T&&P.trim()&&!h?"pointer":"not-allowed",flexShrink:0,height:p?"44px":"36px",minWidth:"52px",transition:"background 0.2s"},children:h?Z:"Ask"})]}),_&&(0,d.jsxs)("div",{role:"status","aria-live":"polite",style:{padding:"10px 12px",background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"8px",fontSize:"12px",color:"#0f766e",lineHeight:1.6,maxHeight:"180px",overflowY:"auto"},children:[(0,d.jsx)("strong",{style:{display:"block",marginBottom:"4px",fontSize:"11px",color:"#0d9488"},children:"\u{1F4AC} Answer"}),_,(0,d.jsx)("button",{onClick:()=>{R(""),k("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]})]}),o&&(0,d.jsx)("div",{role:"status",style:{margin:"0 14px 10px",padding:"8px 12px",background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"8px",fontSize:"12px",color:"#0f766e",fontWeight:500,fontFamily:"monospace"},children:o.fixed>0?`\u2713 ${o.fixed} fixes \xB7 ${o.scanned} nodes \xB7 ${o.renderTime}ms \xB7 Score: ${o.score}/100`:`\u2713 0 auto-fixes needed \xB7 ${o.scanned} nodes \xB7 ${o.renderTime}ms`}),(0,d.jsxs)("div",{style:{display:"flex",gap:"8px",padding:"12px 14px 14px",position:p?"sticky":"relative",bottom:p?0:"auto",background:"#fff",borderTop:"1px solid #f1f5f9"},children:[(0,d.jsx)("button",{onClick:l,style:{flex:1,padding:p?"12px 0":"8px 0",fontSize:"13px",fontWeight:500,borderRadius:"9px",border:"1px solid #e2e8f0",background:"#fff",color:"#64748b",cursor:"pointer"},children:"Reset"}),(0,d.jsx)("button",{onClick:a,style:{flex:2,padding:p?"12px 0":"8px 0",fontSize:"13px",fontWeight:600,borderRadius:"9px",border:"none",background:"#0d9488",color:"#fff",cursor:"pointer"},children:"Apply settings"})]})]})});Tt.displayName="WidgetPanel";Me();f();var de=require("react");f();var er={hotel:["hotel","resort","motel","inn","accommodation","lodge","stay","room","booking","hospitality"],ecommerce:["shop","store","ecommerce","e-commerce","sell","product","cart","buy","marketplace","retail"],restaurant:["restaurant","food","cafe","cafeteria","menu","dining","eat","cuisine","bistro","takeaway","delivery"],portfolio:["portfolio","freelance","personal","designer","developer","creative","showcase","work","hire me"],blog:["blog","article","post","write","news","magazine","journal","content"],saas:["saas","dashboard","app","software","platform","tool","analytics","admin","manage","crm"],government:["government","govt","portal","citizen","scheme","welfare","municipal","public","official"],healthcare:["hospital","clinic","doctor","health","medical","patient","appointment","pharmacy"],education:["school","college","university","course","learn","education","student","lms","training"],realestate:["real estate","property","house","flat","apartment","rent","buy property","listing"],landing:["landing","startup","launch","product launch","coming soon","waitlist"],generic:[]},tr={hotel:["home","rooms","booking","about","contact"],ecommerce:["home","products","cart","checkout","about","contact"],restaurant:["home","menu","reservations","about","contact"],portfolio:["home","portfolio","about","contact"],blog:["home","blog","about","contact"],saas:["home","pricing","dashboard","auth","about","contact"],government:["home","services","about","contact","faq"],healthcare:["home","services","booking","team","about","contact"],education:["home","services","pricing","about","contact"],realestate:["home","products","about","contact"],landing:["home","pricing","about","contact"],generic:["home","about","services","contact"]},or={home:["home","homepage","main","landing"],about:["about","who we are","our story","company"],contact:["contact","reach us","get in touch","location"],services:["service","what we offer","solution","offering"],pricing:["pricing","price","plan","subscription","cost","fee"],blog:["blog","article","news","post"],auth:["login","register","signup","sign up","sign in","auth","account"],dashboard:["dashboard","admin","panel","manage","analytics"],gallery:["gallery","photo","image","portfolio"],products:["product","shop","store","item","catalogue"],cart:["cart","basket","shopping cart"],checkout:["checkout","payment","pay","order"],rooms:["room","suite","accommodation","stay"],booking:["booking","reserve","reservation","schedule","appointment"],menu:["menu","food","dish","cuisine"],reservations:["reservation","table booking","book table"],portfolio:["portfolio","work","project","case study"],team:["team","staff","member","people","who we are"],faq:["faq","question","answer","help","support"],terms:["terms","condition","legal"],privacy:["privacy","policy","gdpr","data"]},nr={Authentication:["login","register","auth","signup","sign in","account"],Payment:["payment","stripe","pay","checkout","billing"],Search:["search","filter","find"],"Dark mode":["dark mode","dark theme","night mode"],"Multi-language":["multilingual","multi language","translation","i18n"],SEO:["seo","search engine","meta","google"],Analytics:["analytics","tracking","stats","dashboard"],Email:["email","newsletter","contact form","notification"],Map:["map","location","address","google maps"],"Social media":["social","instagram","facebook","twitter","share"],"Image gallery":["gallery","photo","image","carousel"],"Booking system":["booking","reservation","appointment","schedule"],"Shopping cart":["cart","basket","shop","ecommerce"],"Blog/CMS":["blog","cms","content","article","post"]},rr={blue:["blue","navy","sky","ocean","corporate"],green:["green","nature","eco","environment","health","fresh"],purple:["purple","violet","luxury","creative","royal"],red:["red","bold","energy","passion","food"],orange:["orange","warm","friendly","fun"],teal:["teal","turquoise","modern","tech"],indigo:["indigo","professional","trust","finance","bank"],gray:["gray","minimal","clean","simple","neutral"]},ir={hotel:"indigo",ecommerce:"blue",restaurant:"red",portfolio:"purple",blog:"gray",saas:"teal",government:"blue",healthcare:"green",education:"indigo",realestate:"orange",landing:"purple",generic:"blue"};function ar(e){let t=[/(?:for|called|named|company|business|brand)\s+["']?([A-Z][a-zA-Z\s]{1,30})["']?/i,/["']([A-Z][a-zA-Z\s]{1,30})["']/,/^([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)?)/m];for(let o of t){let r=e.match(o);if(r?.[1]){let i=r[1].trim();if(i.length>2&&i.length<40)return i}}return"My Business"}function sr(e){let t=e.toLowerCase(),o="generic",r=0;for(let[i,s]of Object.entries(er)){let n=0;for(let a of s)t.includes(a)&&n++;n>r&&(r=n,o=i)}return o}function lr(e,t){let o=e.toLowerCase(),r=new Set(tr[t]);for(let[i,s]of Object.entries(or))for(let n of s)if(o.includes(n)){r.add(i);break}return r.add("home"),r.add("contact"),Array.from(r)}function cr(e){let t=e.toLowerCase(),o=[];for(let[r,i]of Object.entries(nr))for(let s of i)if(t.includes(s)){o.push(r);break}return o}function dr(e,t){let o=e.toLowerCase();for(let[r,i]of Object.entries(rr))for(let s of i)if(o.includes(s))return r;return ir[t]}function xo(e){let t=sr(e),o=lr(e,t),r=cr(e),i=dr(e,t);return{siteName:ar(e),websiteType:t,pages:o,features:r,theme:i,description:e.slice(0,200)}}var y=require("react/jsx-runtime"),mr=["Hotel booking website for Grand Palace Hotels with rooms, booking and payment","E-commerce store for organic food products with cart and checkout","Restaurant website for Spice Garden with menu and table reservations","Portfolio website for a freelance designer with gallery and contact","SaaS dashboard for project management with pricing and auth","Government portal for citizen services with FAQ and contact"],gr={home:"\u{1F3E0}",about:"\u2139\uFE0F",contact:"\u{1F4EC}",services:"\u2699\uFE0F",pricing:"\u{1F4B0}",blog:"\u{1F4DD}",auth:"\u{1F510}",dashboard:"\u{1F4CA}",gallery:"\u{1F5BC}\uFE0F",products:"\u{1F6D2}",cart:"\u{1F6CD}\uFE0F",checkout:"\u{1F4B3}",rooms:"\u{1F6CF}\uFE0F",booking:"\u{1F4C5}",menu:"\u{1F37D}\uFE0F",reservations:"\u{1FA91}",portfolio:"\u{1F4BC}",team:"\u{1F465}",faq:"\u2753",terms:"\u{1F4C4}",privacy:"\u{1F512}"},br={hotel:"\u{1F3E8}",ecommerce:"\u{1F6D2}",restaurant:"\u{1F37D}\uFE0F",portfolio:"\u{1F4BC}",blog:"\u{1F4DD}",saas:"\u26A1",government:"\u{1F3DB}\uFE0F",healthcare:"\u{1F3E5}",education:"\u{1F393}",realestate:"\u{1F3E0}",landing:"\u{1F680}",generic:"\u{1F310}"};function Ct({position:e,onClose:t}){let[o,r]=(0,de.useState)("input"),[i,s]=(0,de.useState)(""),[n,a]=(0,de.useState)(null),[l,c]=(0,de.useState)(0),[m,p]=(0,de.useState)(""),O=(0,de.useCallback)(()=>{if(!i.trim())return;let k=xo(i);a(k),r("preview")},[i]),F=(0,de.useCallback)(async()=>{if(n){r("generating"),c(0),p("");try{let k=[{msg:"Parsing requirement...",pct:15},{msg:"Loading templates...",pct:30},{msg:"Generating pages...",pct:55},{msg:"Building components...",pct:70},{msg:"Creating styles...",pct:85},{msg:"Packaging ZIP...",pct:95}];for(let R of k)c(R.pct),await new Promise(h=>setTimeout(h,200));let{generateZip:_}=await Promise.resolve().then(()=>(Vo(),Yo));await _(n),c(100),r("done")}catch(k){p(k instanceof Error?k.message:"Generation failed. Please try again."),r("preview")}}},[n]),D=()=>{r("input"),s(""),a(null),c(0),p("")},P={position:"fixed",bottom:"204px",[e]:"24px",zIndex:9999,width:"340px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.14)",fontFamily:"system-ui,-apple-system,sans-serif",maxHeight:"75vh",overflowY:"auto"};return(0,y.jsxs)("div",{role:"dialog","aria-modal":"true","aria-label":"yuktai Vibe Coder","data-yuktai-panel":"true",style:P,children:[(0,y.jsxs)("div",{style:{padding:"14px 16px 12px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"flex-start",justifyContent:"space-between",position:"sticky",top:0,background:"#fff",zIndex:1},children:[(0,y.jsxs)("div",{children:[(0,y.jsx)("p",{style:{margin:"0 0 2px",fontSize:"13px",fontWeight:700,color:"#0f172a"},children:"\u26A1 Vibe Coder"}),(0,y.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#64748b"},children:"Describe your website \u2192 Download Next.js ZIP"})]}),(0,y.jsx)("button",{onClick:t,"aria-label":"Close vibe coder",style:{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"18px",padding:"2px"},children:"\xD7"})]}),o==="input"&&(0,y.jsxs)("div",{style:{padding:"14px 16px"},children:[(0,y.jsx)("p",{style:{margin:"0 0 10px",fontSize:"11px",color:"#64748b"},children:"Describe your business website in plain English. The plugin will generate a complete Next.js project for you."}),(0,y.jsx)("p",{style:{margin:"0 0 6px",fontSize:"10px",fontWeight:600,color:"#94a3b8",textTransform:"uppercase"},children:"Examples"}),(0,y.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"4px",marginBottom:"12px"},children:mr.slice(0,3).map(k=>(0,y.jsx)("button",{onClick:()=>s(k),style:{padding:"6px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#f8fafc",color:"#475569",fontSize:"10px",cursor:"pointer",textAlign:"left",lineHeight:1.4},children:k},k))}),(0,y.jsx)("textarea",{value:i,onChange:k=>s(k.target.value),placeholder:"e.g. I need a hotel booking website with rooms, search, and payment for Grand Palace Hotels",rows:4,"aria-label":"Describe your website",style:{width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.5}}),(0,y.jsx)("button",{onClick:O,disabled:!i.trim(),style:{width:"100%",marginTop:"10px",padding:"10px",borderRadius:"8px",border:"none",background:i.trim()?"#f59e0b":"#e2e8f0",color:i.trim()?"#fff":"#94a3b8",fontSize:"13px",fontWeight:700,cursor:i.trim()?"pointer":"not-allowed",transition:"background 0.2s"},children:"Analyse Requirement \u2192"})]}),o==="preview"&&n&&(0,y.jsxs)("div",{style:{padding:"14px 16px"},children:[m&&(0,y.jsxs)("div",{style:{padding:"10px",background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:"8px",marginBottom:"12px",fontSize:"11px",color:"#dc2626"},children:["\u26A0\uFE0F ",m]}),(0,y.jsxs)("div",{style:{background:"#f8fafc",borderRadius:"10px",padding:"12px",marginBottom:"12px"},children:[(0,y.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"},children:[(0,y.jsx)("span",{style:{fontSize:"1.5rem"},children:br[n.websiteType]||"\u{1F310}"}),(0,y.jsxs)("div",{children:[(0,y.jsx)("p",{style:{margin:0,fontSize:"13px",fontWeight:700,color:"#0f172a"},children:n.siteName}),(0,y.jsxs)("p",{style:{margin:0,fontSize:"10px",color:"#64748b",textTransform:"capitalize"},children:[n.websiteType," website \xB7 ",n.theme," theme"]})]})]}),(0,y.jsxs)("p",{style:{margin:"8px 0 6px",fontSize:"10px",fontWeight:600,color:"#94a3b8",textTransform:"uppercase"},children:["Pages to generate (",n.pages.length,")"]}),(0,y.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"4px"},children:n.pages.map(k=>(0,y.jsxs)("span",{style:{padding:"2px 8px",borderRadius:"99px",background:"#f0fdf4",border:"1px solid #86efac",fontSize:"10px",color:"#166534",fontWeight:500},children:[gr[k]||"\u{1F4C4}"," ",k]},k))}),n.features.length>0&&(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)("p",{style:{margin:"10px 0 6px",fontSize:"10px",fontWeight:600,color:"#94a3b8",textTransform:"uppercase"},children:"Detected features"}),(0,y.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"4px"},children:n.features.map(k=>(0,y.jsx)("span",{style:{padding:"2px 8px",borderRadius:"99px",background:"#f5f3ff",border:"1px solid #c4b5fd",fontSize:"10px",color:"#7c3aed",fontWeight:500},children:k},k))})]})]}),(0,y.jsxs)("div",{style:{margin:"0 0 12px",padding:"10px 12px",background:"#f0fdf4",borderRadius:"8px",border:"1px solid #86efac"},children:[(0,y.jsx)("p",{style:{margin:"0 0 4px",fontSize:"10px",fontWeight:700,color:"#166534"},children:"\u{1F4E6} What you get:"}),(0,y.jsxs)("p",{style:{margin:0,fontSize:"10px",color:"#166534",lineHeight:1.6},children:["\u2705 Complete Next.js 16 project",(0,y.jsx)("br",{}),"\u2705 Tailwind CSS + CSS Modules",(0,y.jsx)("br",{}),"\u2705 TypeScript configured",(0,y.jsx)("br",{}),"\u2705 Navbar + Footer components",(0,y.jsx)("br",{}),"\u2705 All ",n.pages.length," pages ready",(0,y.jsx)("br",{}),"\u2705 Mobile responsive",(0,y.jsx)("br",{}),"\u2705 npm run dev \u2192 works immediately"]})]}),(0,y.jsxs)("div",{style:{display:"flex",gap:"8px"},children:[(0,y.jsx)("button",{onClick:D,style:{flex:1,padding:"9px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",color:"#64748b",fontSize:"12px",fontWeight:600,cursor:"pointer"},children:"\u2190 Edit"}),(0,y.jsx)("button",{onClick:F,style:{flex:2,padding:"9px",borderRadius:"8px",border:"none",background:"#f59e0b",color:"#fff",fontSize:"13px",fontWeight:700,cursor:"pointer"},children:"\u2B07\uFE0F Generate & Download ZIP"})]})]}),o==="generating"&&(0,y.jsxs)("div",{style:{padding:"2rem 16px",textAlign:"center"},children:[(0,y.jsx)("p",{style:{fontSize:"2rem",marginBottom:"1rem"},children:"\u26A1"}),(0,y.jsx)("p",{style:{fontSize:"13px",fontWeight:700,color:"#0f172a",marginBottom:"0.5rem"},children:"Generating your project..."}),(0,y.jsx)("p",{style:{fontSize:"11px",color:"#64748b",marginBottom:"1.5rem"},children:l<30?"Parsing requirement...":l<55?"Loading templates...":l<70?"Generating pages...":l<85?"Building components...":l<95?"Creating styles...":"Packaging ZIP..."}),(0,y.jsx)("div",{style:{height:"8px",background:"#e2e8f0",borderRadius:"99px",overflow:"hidden"},children:(0,y.jsx)("div",{style:{height:"100%",width:`${l}%`,background:"#f59e0b",borderRadius:"99px",transition:"width 0.3s ease"}})}),(0,y.jsxs)("p",{style:{marginTop:"0.5rem",fontSize:"10px",color:"#94a3b8"},children:[l,"%"]})]}),o==="done"&&n&&(0,y.jsxs)("div",{style:{padding:"2rem 16px",textAlign:"center"},children:[(0,y.jsx)("p",{style:{fontSize:"3rem",marginBottom:"0.75rem"},children:"\u2705"}),(0,y.jsxs)("p",{style:{fontSize:"14px",fontWeight:700,color:"#0f172a",marginBottom:"0.5rem"},children:[n.siteName," downloaded!"]}),(0,y.jsx)("p",{style:{fontSize:"11px",color:"#64748b",marginBottom:"1.5rem",lineHeight:1.6},children:"Your ZIP is downloading. Unzip it and run:"}),["npm install","npm run dev"].map(k=>(0,y.jsx)("div",{style:{background:"#0f172a",borderRadius:"8px",padding:"8px 12px",marginBottom:"6px",textAlign:"left"},children:(0,y.jsxs)("code",{style:{fontSize:"12px",color:"#a7f3d0",fontFamily:"monospace"},children:["$ ",k]})},k)),(0,y.jsx)("p",{style:{fontSize:"11px",color:"#10b981",margin:"1rem 0",fontWeight:600},children:"Then open http://localhost:3000 \u{1F680}"}),(0,y.jsxs)("div",{style:{display:"flex",gap:"8px"},children:[(0,y.jsx)("button",{onClick:D,style:{flex:1,padding:"9px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",color:"#64748b",fontSize:"12px",fontWeight:600,cursor:"pointer"},children:"New Project"}),(0,y.jsx)("button",{onClick:F,style:{flex:1,padding:"9px",borderRadius:"8px",border:"none",background:"#f59e0b",color:"#fff",fontSize:"12px",fontWeight:700,cursor:"pointer"},children:"\u2B07\uFE0F Download Again"})]})]})]})}var w=require("react/jsx-runtime");async function wr(){try{if(typeof window>"u")return!1;let e=window;if(e.LanguageModel)try{if(typeof e.LanguageModel.availability=="function"){let o=await e.LanguageModel.availability();if(o==="readily"||o==="available"||o==="downloadable")return!0}else return!0}catch{}if(e.Summarizer)try{let o=await e.Summarizer.availability?.();if(!o||o==="readily"||o==="available")return!0}catch{}if(e.Rewriter)try{let o=await e.Rewriter.availability?.();if(!o||o==="readily"||o==="available")return!0}catch{}if(e.Writer)try{let o=await e.Writer.availability?.();if(!o||o==="readily"||o==="available")return!0}catch{}let t=e.ai||globalThis.ai;if(t){if(t.languageModel?.availability)try{let o=await t.languageModel.availability();if(o==="readily"||o==="available")return!0}catch{}if(t.languageModel&&typeof t.languageModel.create=="function"||t.summarizer||t.rewriter||t.writer||t.languageModel)return!0}return!!(e.Translator||e.translation?.canTranslate)}catch{return!1}}function Ke({position:e="left",children:t,config:o={},showRag:r=!1,showAgent:i=!1}){let[s,n]=(0,S.useState)(!1),[a,l]=(0,S.useState)(St),[c,m]=(0,S.useState)(null),[p,O]=(0,S.useState)(!1),[F,D]=(0,S.useState)(!1),[P,k]=(0,S.useState)(!1),_=S.default.useRef(null),[R,h]=(0,S.useState)(!1),[H,T]=(0,S.useState)(""),[L,x]=(0,S.useState)(""),[N,M]=(0,S.useState)(!1),[v,Z]=(0,S.useState)(null),[V,u]=(0,S.useState)("idle"),[U,Q]=(0,S.useState)(!1),[ne,ce]=(0,S.useState)(""),[it,me]=(0,S.useState)(""),[ae,ge]=(0,S.useState)(!1),[Te,be]=(0,S.useState)([]),[oe,Ae]=(0,S.useState)(null),q=24,at=84,Ce=r?144:84,Wt=204,[b,E]=(0,S.useState)(!1);(0,S.useEffect)(()=>{if(typeof window>"u")return;let g=window;!!(g.LanguageModel||g.ai?.languageModel)&&F?(Z("gemini"),Ae("gemini")):Le()&&(Z("transformers"),Ae("transformers"))},[F]),(0,S.useEffect)(()=>{if(v!=="transformers")return;let g=setInterval(()=>u(Re()),500);return()=>clearInterval(g)},[v]);let G=(0,S.useCallback)(async()=>{if(!(!H.trim()||N)){if(!v){x("\u26A0\uFE0F No AI engine available.");return}M(!0),x("");try{let g;if(v==="gemini"){let{askPage:W}=await Promise.resolve().then(()=>(xt(),mo));g=await W(H)}else{u("loading");let{askPageWithTransformers:W}=await Promise.resolve().then(()=>(Me(),kt));g=await W(H),u("ready")}x(g.success&&g.answer?g.answer.replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/#+\s/g,"").trim():"\u26A0\uFE0F "+(g.error||"No answer found."))}catch{x("\u26A0\uFE0F Something went wrong.")}M(!1)}},[H,N,v]),$=(0,S.useCallback)(async()=>{if(!ne.trim()||ae)return;if(!oe){me("\u26A0\uFE0F No AI engine available.");return}ge(!0),be([]),me("");let{runAgent:g}=await Promise.resolve().then(()=>(Qo(),Jo));await g(ne,oe,W=>{be(pe=>[...pe,W.text])}),ge(!1),me("done")},[ne,ae,oe]);(0,S.useEffect)(()=>{if(typeof window>"u")return;let W=setTimeout(async()=>{let pe=window,pn=await wr();D(pn),k(!!(pe.SpeechRecognition||pe.webkitSpeechRecognition))},800);return()=>clearTimeout(W)},[]),(0,S.useEffect)(()=>{if(!(typeof window>"u"))try{let g=localStorage.getItem("yuktai-a11y-prefs");g&&l(W=>({...W,...JSON.parse(g)}))}catch{}},[]);let J=(0,S.useCallback)(async g=>{let W={enabled:!0,highContrast:g.highContrast,darkMode:g.darkMode,reduceMotion:g.reduceMotion,largeTargets:g.largeTargets,speechEnabled:g.speechEnabled,autoFix:g.autoFix,dyslexiaFont:g.dyslexiaFont,localFont:g.localFont,fontSizeMultiplier:g.fontScale/100,colorBlindMode:g.colorBlindMode,showAuditBadge:g.showAuditBadge,showSkipLinks:!0,showPreferencePanel:!1,plainEnglish:g.plainEnglish,summarisePage:g.summarisePage,translateLanguage:g.translateLanguage,voiceControl:g.voiceControl,smartLabels:g.smartLabels,...o};await re.execute(W),m(re.applyFixes(W)),O(!0)},[o]),j=(0,S.useCallback)(async()=>{try{localStorage.setItem("yuktai-a11y-prefs",JSON.stringify(a))}catch{}await J(a),n(!1)},[a,J]),ln=(0,S.useCallback)(()=>{l(St);try{localStorage.removeItem("yuktai-a11y-prefs")}catch{}let g=document.documentElement;["data-yuktai-high-contrast","data-yuktai-dark","data-yuktai-reduce-motion","data-yuktai-large-targets","data-yuktai-keyboard","data-yuktai-dyslexia"].forEach(W=>g.removeAttribute(W)),document.body.style.filter="",document.body.style.fontFamily="",document.documentElement.style.fontSize="",m(null),O(!1)},[]),cn=(0,S.useCallback)((g,W)=>{l(pe=>({...pe,[g]:W}))},[]);(0,S.useEffect)(()=>{let g=W=>{W.key==="Escape"&&(s&&n(!1),R&&h(!1),U&&Q(!1),b&&E(!1))};return window.addEventListener("keydown",g),()=>window.removeEventListener("keydown",g)},[s,R,U]),(0,S.useEffect)(()=>{s&&_.current&&re.trapFocus(_.current)},[s]);let $e=(g,W,pe)=>({position:"fixed",bottom:`${g}px`,[e]:"24px",zIndex:9998,width:"52px",height:"52px",borderRadius:"50%",background:W,color:"#fff",border:"none",cursor:"pointer",fontSize:"22px",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,0,0,0.25)",transition:"transform 0.15s, background 0.2s"}),We=g=>{g.currentTarget.style.transform="scale(1.08)"},Oe=g=>{g.currentTarget.style.transform="scale(1)"},Ot=v==="gemini"?"Gemini Nano \xB7 On device":v==="transformers"?"Transformers.js \xB7 All devices":"Detecting...",dn=v==="transformers"&&V==="loading"?"Loading model...":"...";return(0,w.jsxs)(w.Fragment,{children:[t,i&&(0,w.jsx)("button",{style:$e(204,b?"#d97706":"#f59e0b",b),"aria-label":"Open Vibe Coder",title:"\u26A1 Vibe Coder \u2014 Generate Next.js project",onClick:()=>{E(g=>!g),Q(!1),h(!1),n(!1)},onMouseEnter:We,onMouseLeave:Oe,children:"\u26A1"}),i&&b&&(0,w.jsx)(Ct,{position:e,onClose:()=>E(!1)}),i&&(0,w.jsx)("button",{style:$e(Ce,U?"#059669":"#10b981",U),"aria-label":"Open AI agent","aria-haspopup":"dialog","aria-expanded":U,title:"\u{1F916} AI Agent \u2014 guide me through this page",onClick:()=>{Q(g=>!g),h(!1),n(!1)},onMouseEnter:We,onMouseLeave:Oe,children:"\u{1F916}"}),i&&U&&(0,w.jsxs)("div",{role:"dialog","aria-modal":"true","aria-label":"yuktai AI Agent","data-yuktai-panel":"true",style:{position:"fixed",bottom:`${Ce+64}px`,[e]:"24px",zIndex:9999,width:"300px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",fontFamily:"system-ui,-apple-system,sans-serif",padding:"14px",maxHeight:"70vh",overflowY:"auto"},children:[(0,w.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"},children:[(0,w.jsxs)("div",{children:[(0,w.jsx)("p",{style:{margin:"0 0 2px",fontSize:"13px",fontWeight:600,color:"#0f172a"},children:"\u{1F916} AI Agent"}),(0,w.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#10b981"},children:oe==="gemini"?"Gemini Nano \xB7 On device":oe==="transformers"?"Transformers.js \xB7 All devices":"Detecting..."})]}),(0,w.jsx)("button",{onClick:()=>Q(!1),"aria-label":"Close agent panel",style:{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"18px",lineHeight:1,padding:"2px"},children:"\xD7"})]}),(0,w.jsx)("p",{style:{margin:"0 0 8px",fontSize:"11px",color:"#64748b"},children:"Tell me what you want to do on this page. I will guide you step by step."}),(0,w.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"4px",marginBottom:"8px"},children:["Fill this form","Find contact info","What is this page?","Guide me to apply"].map(g=>(0,w.jsx)("button",{onClick:()=>ce(g),style:{padding:"3px 8px",borderRadius:"20px",fontSize:"10px",border:"1px solid #e2e8f0",background:"#f8fafc",color:"#64748b",cursor:"pointer"},children:g},g))}),(0,w.jsxs)("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[(0,w.jsx)("input",{type:"text",value:ne,onChange:g=>ce(g.target.value),onKeyDown:g=>{g.key==="Enter"&&$()},placeholder:"e.g. Help me fill this form",disabled:ae||!oe,"aria-label":"Tell the agent what to do",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:oe?"#fff":"#f8fafc",outline:"none",height:"36px"}}),(0,w.jsx)("button",{onClick:$,disabled:ae||!ne.trim()||!oe,"aria-label":"Run agent",style:{padding:"8px 12px",borderRadius:"8px",border:"none",background:oe&&ne.trim()&&!ae?"#10b981":"#e2e8f0",color:oe&&ne.trim()&&!ae?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:oe&&ne.trim()&&!ae?"pointer":"not-allowed",height:"36px",minWidth:"52px",transition:"background 0.2s"},children:ae?"...":"Go"})]}),Te.length>0&&(0,w.jsxs)("div",{style:{padding:"10px 12px",background:"#f0fdf4",border:"1px solid #86efac",borderRadius:"8px",fontSize:"11px",color:"#166534",lineHeight:1.7},children:[Te.map((g,W)=>(0,w.jsx)("p",{style:{margin:"0 0 2px"},children:g},W)),it==="done"&&(0,w.jsx)("button",{onClick:()=>{be([]),ce(""),me("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]}),!oe&&(0,w.jsx)("p",{style:{margin:"4px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Enable Gemini Nano via chrome://flags for best results."})]}),r&&(0,w.jsx)("button",{style:$e(at,R?"#7c3aed":"#6d28d9",R),"aria-label":"Ask a question about this page","aria-haspopup":"dialog","aria-expanded":R,title:`\u{1F4AC} Ask this page \xB7 ${Ot}`,onClick:()=>{h(g=>!g),n(!1),Q(!1)},onMouseEnter:We,onMouseLeave:Oe,children:"\u{1F4AC}"}),r&&R&&(0,w.jsxs)("div",{role:"dialog","aria-modal":"true","aria-label":"Ask this page","data-yuktai-panel":"true",style:{position:"fixed",bottom:`${at+64}px`,[e]:"24px",zIndex:9999,width:"300px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",fontFamily:"system-ui,-apple-system,sans-serif",padding:"14px"},children:[(0,w.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"},children:[(0,w.jsxs)("div",{children:[(0,w.jsx)("p",{style:{margin:"0 0 2px",fontSize:"13px",fontWeight:600,color:"#0f172a"},children:"\u{1F4AC} Ask this page"}),(0,w.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#7c3aed"},children:Ot}),v==="transformers"&&V==="loading"&&(0,w.jsx)("p",{style:{margin:"2px 0 0",fontSize:"9px",color:"#94a3b8"},children:"Downloading model \u2014 first time only"}),v==="transformers"&&V==="ready"&&(0,w.jsx)("p",{style:{margin:"2px 0 0",fontSize:"9px",color:"#10b981"},children:"Model ready \u2705 \u2014 works offline"})]}),(0,w.jsx)("button",{onClick:()=>h(!1),"aria-label":"Close ask panel",style:{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"18px",lineHeight:1,padding:"2px"},children:"\xD7"})]}),(0,w.jsxs)("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[(0,w.jsx)("input",{type:"text",value:H,onChange:g=>T(g.target.value),onKeyDown:g=>{g.key==="Enter"&&G()},placeholder:"e.g. What does this page do?",disabled:N||!v,"aria-label":"Ask a question about this page",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:v?"#fff":"#f8fafc",outline:"none",height:"36px"}}),(0,w.jsx)("button",{onClick:G,disabled:N||!H.trim()||!v,"aria-label":"Submit question",style:{padding:"8px 12px",borderRadius:"8px",border:"none",background:v&&H.trim()&&!N?"#7c3aed":"#e2e8f0",color:v&&H.trim()&&!N?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:v&&H.trim()&&!N?"pointer":"not-allowed",height:"36px",minWidth:"48px",transition:"background 0.2s"},children:N?dn:"Ask"})]}),L&&(0,w.jsxs)("div",{style:{padding:"10px",background:"#f5f3ff",borderRadius:"8px",fontSize:"12px",color:"#4c1d95",lineHeight:1.6,maxHeight:"180px",overflowY:"auto"},children:[(0,w.jsx)("strong",{style:{display:"block",marginBottom:"4px",fontSize:"11px",color:"#7c3aed"},children:"\u{1F4AC} Answer"}),L,(0,w.jsx)("button",{onClick:()=>{x(""),T("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]}),!v&&(0,w.jsx)("p",{style:{margin:"4px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Detecting AI engine..."})]}),(0,w.jsx)("button",{style:$e(q,p?"#0d9488":"#1a73e8",s),"aria-label":"Open accessibility preferences","aria-haspopup":"dialog","aria-expanded":s,"data-yuktai-pref-toggle":"true",title:"\u267F Accessibility settings",onClick:()=>{n(g=>!g),h(!1),Q(!1)},onMouseEnter:We,onMouseLeave:Oe,children:"\u267F"}),s&&(0,w.jsx)(Tt,{ref:_,position:e,settings:a,report:c,isActive:p,aiSupported:F,voiceSupported:P,set:cn,onApply:j,onReset:ln,onClose:()=>n(!1)})]})}f();var Pe={name:"ai.text",async execute(e){return`\u{1F916} YuktAI says: ${e}`}};f();var Ne={name:"voice.text",async execute(e){return!e||e.trim()===""?"\u{1F3A4} No speech detected":`\u{1F3A4} You said: ${e}`}};f();var fe=class{plugins=new Map;register(t,o){if(!o||typeof o.execute!="function")throw new Error(`Invalid plugin: ${t}`);this.plugins.set(t,o)}use(t){return this.plugins.get(t)}async run(t,o){try{let r=this.use(t);if(!r)throw new Error(`Plugin not found: ${t}`);return await r.execute(o)}catch(r){throw console.error(`[YuktAI Runtime Error in ${t}]:`,r),r}}getPlugins(){return Array.from(this.plugins.keys())}};f();var ie=require("react"),C=require("react/jsx-runtime");function en({data:e,columns:t,rowKey:o="id",view:r="auto",mobileBreakpoint:i=768,theme:s="default",locale:n="en-US",search:a=!0,selectable:l=!1,selectedKeys:c=[],onSelectionChange:m,pagination:p,loading:O=!1,highlightIds:F=[],highlightColor:D="#fff3a3",autoScrollToHighlight:P=!1,onRowClick:k,onSortChange:_,empty:R="No data found.",className:h=""}){let[H,T]=(0,ie.useState)(""),[L,x]=(0,ie.useState)(1),[N,M]=(0,ie.useState)(),[v,Z]=(0,ie.useState)("asc"),V=p!==!1&&p!==void 0,u=typeof p=="object"?p.pageSize??20:20,U=(0,ie.useMemo)(()=>{let b=[...e];if(H.trim()){let E=H.trim().toLowerCase();b=b.filter(G=>t.some($=>String(G[$.key]??"").toLowerCase().includes(E)))}return N&&b.sort((E,G)=>{let $=E[N],J=G[N];if($==null&&J==null)return 0;if($==null)return 1;if(J==null)return-1;if(typeof $=="number"&&typeof J=="number")return v==="asc"?$-J:J-$;let j=String($).localeCompare(String(J),n,{numeric:!0,sensitivity:"base"});return v==="asc"?j:-j}),b},[e,t,H,N,v,n]),Q=V?Math.max(1,Math.ceil(U.length/u)):1;(0,ie.useEffect)(()=>{L>Q&&x(Q)},[L,Q]),(0,ie.useEffect)(()=>{if(!P)return;let b=F[0];if(b==null)return;document.querySelector(`[data-yuktai-row-id="${CSS.escape(String(b))}"]`)?.scrollIntoView({behavior:"smooth",block:"center"})},[F,P]);let ne=(0,ie.useMemo)(()=>{if(!V)return U;let b=(L-1)*u;return U.slice(b,b+u)},[U,V,L,u]),[ce,it]=(0,ie.useState)(!1);(0,ie.useEffect)(()=>{let b=()=>{it(window.innerWidth<=i)};return b(),window.addEventListener("resize",b),()=>{window.removeEventListener("resize",b)}},[i]);let me=r==="card"||r==="auto"&&ce,ae=b=>String(b[o]??""),ge=b=>c.some(E=>String(E)===b),Te=b=>F.some(E=>String(E)===b),be=b=>{if(!l)return;let E=ae(b),G=ge(E)?c.filter($=>String($)!==E):[...c,E];m?.(G)},oe=b=>{if(b.sortable===!1)return;let E=String(b.key),G=N===E&&v==="asc"?"desc":"asc";M(E),Z(G),x(1),_?.({key:E,direction:G})},Ae=(b,E,G)=>{if(E.render)return E.render(b[E.key],b,G);let $=b[E.key];if($==null)return"";if(E.type==="date"){let J=new Date(String($));if(!Number.isNaN(J.getTime()))return J.toLocaleDateString(n)}return E.type==="boolean"?$?"Yes":"No":String($)},q=s==="dark",Ce={width:"100%",overflow:"hidden",border:s==="high-contrast"?"2px solid #000000":q?"1px solid #334155":"1px solid #e2e8f0",borderRadius:12,background:q?"#0f172a":"#ffffff",color:q?"#f8fafc":"#0f172a"},Wt={padding:12,display:"flex",alignItems:"center",gap:12,borderBottom:q?"1px solid #334155":"1px solid #e2e8f0"};return O?(0,C.jsx)("div",{className:h,style:Ce,children:(0,C.jsx)("div",{style:{padding:32,textAlign:"center"},children:"Loading..."})}):(0,C.jsxs)("div",{className:h,style:Ce,children:[a&&(0,C.jsxs)("div",{style:Wt,children:[(0,C.jsx)("input",{value:H,onChange:b=>{T(b.target.value),x(1)},placeholder:"Search...","aria-label":"Search grid",style:{width:"100%",maxWidth:360,padding:"9px 12px",borderRadius:8,border:q?"1px solid #475569":"1px solid #cbd5e1",background:q?"#1e293b":"#ffffff",color:q?"#ffffff":"#0f172a",outline:"none"}}),(0,C.jsxs)("div",{style:{marginLeft:"auto",fontSize:13,opacity:.7},children:[U.length," rows"]})]}),U.length===0?(0,C.jsx)("div",{style:{padding:40,textAlign:"center",opacity:.7},children:R}):me?(0,C.jsx)("div",{style:{display:"grid",gap:12,padding:12},children:ne.map((b,E)=>{let G=ae(b),$=ge(G),J=Te(G);return(0,C.jsxs)("div",{"data-yuktai-row-id":G,onClick:()=>k?.(b,E),style:{padding:14,borderRadius:10,border:q?"1px solid #334155":"1px solid #e2e8f0",background:J?D:$?q?"#1e3a5f":"#eff6ff":q?"#1e293b":"#ffffff",cursor:k?"pointer":"default"},children:[l&&(0,C.jsx)("input",{type:"checkbox",checked:$,onChange:()=>be(b),onClick:j=>j.stopPropagation(),"aria-label":`Select row ${G}`,style:{marginBottom:10}}),t.map(j=>(0,C.jsxs)("div",{style:{display:"flex",gap:8,padding:"5px 0"},children:[(0,C.jsx)("strong",{style:{minWidth:100,opacity:.7},children:j.label}),(0,C.jsx)("span",{children:Ae(b,j,E)})]},String(j.key)))]},G)})}):(0,C.jsx)("div",{style:{width:"100%",overflowX:"auto"},children:(0,C.jsxs)("table",{style:{width:"100%",borderCollapse:"collapse"},children:[(0,C.jsx)("thead",{children:(0,C.jsxs)("tr",{children:[l&&(0,C.jsx)("th",{style:{padding:10,borderBottom:q?"1px solid #334155":"1px solid #e2e8f0",width:44}}),t.filter(b=>!(ce&&b.hiddenOnMobile)).map(b=>(0,C.jsxs)("th",{onClick:()=>oe(b),style:{padding:10,textAlign:b.align??"left",borderBottom:q?"1px solid #334155":"1px solid #e2e8f0",whiteSpace:"nowrap",cursor:b.sortable===!1?"default":"pointer",width:b.width},children:[b.label,N===String(b.key)&&(0,C.jsx)("span",{style:{marginLeft:6},"aria-hidden":"true",children:v==="asc"?"\u2191":"\u2193"})]},String(b.key)))]})}),(0,C.jsx)("tbody",{children:ne.map((b,E)=>{let G=ae(b),$=ge(G),J=Te(G);return(0,C.jsxs)("tr",{"data-yuktai-row-id":G,onClick:()=>k?.(b,E),style:{background:J?D:$?q?"#1e3a5f":"#eff6ff":"transparent",cursor:k?"pointer":"default"},children:[l&&(0,C.jsx)("td",{style:{padding:10,borderBottom:q?"1px solid #334155":"1px solid #e2e8f0"},children:(0,C.jsx)("input",{type:"checkbox",checked:$,onChange:()=>be(b),onClick:j=>j.stopPropagation(),"aria-label":`Select row ${G}`})}),t.filter(j=>!(ce&&j.hiddenOnMobile)).map(j=>(0,C.jsx)("td",{style:{padding:10,textAlign:j.align??"left",borderBottom:q?"1px solid #334155":"1px solid #e2e8f0"},children:Ae(b,j,E)},String(j.key)))]},G)})})]})}),V&&(0,C.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,padding:12,borderTop:q?"1px solid #334155":"1px solid #e2e8f0"},children:[(0,C.jsxs)("span",{style:{fontSize:13,opacity:.7},children:["Page ",L," of"," ",Q]}),(0,C.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:6},children:[typeof p=="object"&&p.showSizeChanger&&p.sizeOptions&&p.sizeOptions.length>0&&(0,C.jsx)("select",{value:u,onChange:()=>{},"aria-label":"Page size",style:{padding:"6px 8px"},children:p.sizeOptions.map(b=>(0,C.jsx)("option",{value:b,children:b},b))}),(0,C.jsx)("button",{type:"button",disabled:L<=1,onClick:()=>x(b=>Math.max(1,b-1)),children:"Previous"}),(0,C.jsx)("button",{type:"button",disabled:L>=Q,onClick:()=>x(b=>Math.min(Q,b+1)),children:"Next"})]})]})]})}f();var X=require("react");function kr(e){return e===!1?Number.MAX_SAFE_INTEGER:e===!0||e===void 0?10:e.pageSize??10}function tn(e){let{data:t,columns:o,pagination:r=!0,mobileBreakpoint:i=768}=e,[s,n]=(0,X.useState)(null),[a,l]=(0,X.useState)(""),[c,m]=(0,X.useState)(1),[p,O]=(0,X.useState)(kr(r)),[F,D]=(0,X.useState)(!1);(0,X.useEffect)(()=>{if(typeof window>"u")return;let L=()=>{D(window.innerWidth<i)};return L(),window.addEventListener("resize",L),()=>window.removeEventListener("resize",L)},[i]);let P=(0,X.useCallback)(L=>{n(x=>!x||x.key!==L?{key:L,direction:"asc"}:x.direction==="asc"?{key:L,direction:"desc"}:null),m(1)},[]),k=(0,X.useCallback)(()=>n(null),[]),_=(0,X.useMemo)(()=>{if(!a.trim())return t;let L=a.toLowerCase().trim();return t.filter(x=>o.some(N=>{let M=x[N.key];return M==null?!1:String(M).toLowerCase().includes(L)}))},[t,a,o]),R=(0,X.useMemo)(()=>{if(!s)return _;let L=[..._].sort((x,N)=>{let M=x[s.key],v=N[s.key];if(M===v)return 0;if(M==null)return 1;if(v==null)return-1;if(typeof M=="number"&&typeof v=="number")return M-v;if(M instanceof Date&&v instanceof Date)return M.getTime()-v.getTime();let Z=String(M),V=String(v);return Z.localeCompare(V,void 0,{sensitivity:"base",numeric:!0})});return s.direction==="desc"?L.reverse():L},[_,s]),h=Math.max(1,Math.ceil(R.length/p)),H=(0,X.useMemo)(()=>{if(r===!1)return R;let L=(c-1)*p;return R.slice(L,L+p)},[R,c,p,r]),T=(0,X.useCallback)(()=>{n(null),l(""),m(1)},[]);return(0,X.useEffect)(()=>{c>h&&m(h)},[c,h]),{displayedData:H,totalCount:t.length,filteredCount:R.length,sort:s,toggleSort:P,clearSort:k,searchQuery:a,setSearchQuery:l,page:c,pageSize:p,totalPages:h,setPage:m,setPageSize:O,isMobile:F,reset:T}}f();var Y=require("react"),z=require("react/jsx-runtime");function Sr(e){let t=e.toLowerCase().trim();if(/^(search|find|show|filter)/.test(t))return{type:"search",payload:t.replace(/^(search|find|show|filter)\s+(for\s+|by\s+)?/,"").trim()};if(/sort/.test(t)){let o=/desc|high|large|top/.test(t)?"desc":"asc";return{type:"sort",payload:{key:t.match(/(name|age|salary|role|email|date)/)?.[1],dir:o}}}return/^(who|what|which|how many|highest|lowest|max|min|average|avg|total|sum)/.test(t)?{type:"question",payload:e}:{type:"search",payload:e}}function Tr(e,t,o){if(t.length===0)return"There is no data to analyze.";let r=e.toLowerCase();if(/how many|count|total/.test(r))return`There are ${t.length} rows in the grid.`;let i=o.filter(n=>n.type==="number"),s=o.find(n=>r.includes(n.label.toLowerCase())||r.includes(n.key.toLowerCase()));if(/highest|maximum|max|top|largest/.test(r)){let n=s??i[0];if(!n)return"I could not find a column to analyze.";let a=t.map(p=>({row:p,val:Number(p[n.key])})).filter(p=>!isNaN(p.val)).sort((p,O)=>O.val-p.val);if(a.length===0)return`No numeric data in ${n.label}.`;let l=a[0],c=o.find(p=>p.key==="name"||p.label.toLowerCase()==="name"),m=c?String(l.row[c.key]):`Row ${t.indexOf(l.row)+1}`;return`The highest ${n.label} is ${l.val.toLocaleString("en-IN")}, held by ${m}.`}if(/lowest|minimum|min|smallest|bottom/.test(r)){let n=s??i[0];if(!n)return"I could not find a column to analyze.";let a=t.map(p=>({row:p,val:Number(p[n.key])})).filter(p=>!isNaN(p.val)).sort((p,O)=>p.val-O.val);if(a.length===0)return`No numeric data in ${n.label}.`;let l=a[0],c=o.find(p=>p.key==="name"||p.label.toLowerCase()==="name"),m=c?String(l.row[c.key]):`Row ${t.indexOf(l.row)+1}`;return`The lowest ${n.label} is ${l.val.toLocaleString("en-IN")}, held by ${m}.`}if(/average|avg|mean/.test(r)){let n=s??i[0];if(!n)return"I could not find a column to analyze.";let a=t.map(c=>Number(c[n.key])).filter(c=>!isNaN(c));if(a.length===0)return`No numeric data in ${n.label}.`;let l=a.reduce((c,m)=>c+m,0)/a.length;return`The average ${n.label} is ${Math.round(l).toLocaleString("en-IN")}.`}if(/sum|total/.test(r)){let n=s??i[0];if(!n)return"I could not find a column to analyze.";let a=t.map(c=>Number(c[n.key])).filter(c=>!isNaN(c));if(a.length===0)return`No numeric data in ${n.label}.`;let l=a.reduce((c,m)=>c+m,0);return`The total ${n.label} is ${l.toLocaleString("en-IN")}.`}if(/who|where|which|whose/.test(r)){let n=r.match(/\b([a-z]{3,})\b/g)?.filter(c=>!["who","where","which","whose","what","is","the","has","have"].includes(c));if(!n)return"I need a name to look up.";let a=n.join(" "),l=t.find(c=>Object.values(c).some(m=>String(m).toLowerCase().includes(a)));return l?o.map(c=>`${c.label}: ${String(l[c.key]??"")}`).join(", "):`I could not find anyone matching "${a}".`}return"I understand you have a question. Try asking 'highest salary' or 'how many rows'."}function Ar(e="en-US"){let[t,o]=(0,Y.useState)(!1),[r,i]=(0,Y.useState)(""),[s,n]=(0,Y.useState)(!0),a=(0,Y.useRef)(null);(0,Y.useEffect)(()=>{if(typeof window>"u")return;let m=window.SpeechRecognition||window.webkitSpeechRecognition;if(!m){n(!1);return}let p=new m;return p.continuous=!1,p.interimResults=!1,p.lang=e,p.onresult=O=>{let F=O.results[0][0].transcript;i(F),o(!1)},p.onerror=()=>{o(!1)},p.onend=()=>{o(!1)},a.current=p,()=>{p.stop?.()}},[e]);let l=(0,Y.useCallback)(()=>{if(a.current){i(""),o(!0);try{a.current.start()}catch{o(!1)}}},[]),c=(0,Y.useCallback)(()=>{a.current?.stop(),o(!1)},[]);return{listening:t,transcript:r,supported:s,start:l,stop:c}}function Cr(e,t){if(typeof window>"u"||!window.speechSynthesis)return;window.speechSynthesis.cancel();let o=new SpeechSynthesisUtterance(e);o.lang=t,o.rate=1,o.pitch=1,window.speechSynthesis.speak(o)}function Er({data:e,columns:t,onSearch:o,onSort:r,theme:i="light",language:s="en-US"}){let[n,a]=(0,Y.useState)(!1),[l,c]=(0,Y.useState)(""),[m,p]=(0,Y.useState)([{role:"ai",text:"Hi! Ask me anything about your data \u2014 like 'highest salary' or 'how many rows'. You can also say 'search Sandeep' or 'sort age descending'.",time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]),O=(0,Y.useRef)(null),{listening:F,transcript:D,supported:P,start:k,stop:_}=Ar(s),R=i==="dark",h={bg:R?"#0F172A":"#FFFFFF",surface:R?"#1E293B":"#F8FAFC",border:R?"#334155":"#E2E8F0",text:R?"#F1F5F9":"#0F172A",muted:R?"#94A3B8":"#64748B",accent:"#10B981",userMsg:R?"#334155":"#DBEAFE",aiMsg:R?"#1E293B":"#F0FDF4"};(0,Y.useEffect)(()=>{O.current?.scrollIntoView({behavior:"smooth"})},[m]);let H=(0,Y.useCallback)(x=>{if(!x.trim())return;let N=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});p(Z=>[...Z,{role:"user",text:x,time:N}]),c("");let M=Sr(x),v="";if(M.type==="search")o(M.payload),v=`Searching for "${M.payload}"...`;else if(M.type==="sort"&&r){let{key:Z,dir:V}=M.payload;Z?(r(Z,V),v=`Sorted by ${Z} (${V==="asc"?"ascending":"descending"}).`):v="Which column should I sort? Try 'sort by salary'."}else M.type==="question"?v=Tr(M.payload,e,t):v="I could not understand that request.";setTimeout(()=>{let Z=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});p(V=>[...V,{role:"ai",text:v,time:Z}]),Cr(v,s)},400)},[e,t,s,o,r]);(0,Y.useEffect)(()=>{D&&H(D)},[D,H]);let T=()=>{H(l)},L=["highest salary","how many rows","average age","search sandeep"];return(0,z.jsxs)(z.Fragment,{children:[(0,z.jsx)("button",{type:"button",onClick:()=>a(x=>!x),"aria-label":n?"Close AI assistant":"Open AI assistant",style:{position:"fixed",bottom:24,right:24,zIndex:9998,width:56,height:56,borderRadius:28,background:h.accent,color:"#FFFFFF",border:"none",cursor:"pointer",boxShadow:"0 8px 20px rgba(16,185,129,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20},children:n?"\u2715":"\u{1F916}"}),n&&(0,z.jsxs)("div",{role:"dialog","aria-label":"AI Grid Assistant",style:{position:"fixed",bottom:90,right:24,width:360,maxWidth:"calc(100vw - 48px)",height:480,maxHeight:"70vh",background:h.bg,border:`1px solid ${h.border}`,borderRadius:16,boxShadow:"0 20px 40px rgba(0,0,0,0.15)",zIndex:9997,display:"flex",flexDirection:"column",overflow:"hidden",fontFamily:"system-ui, sans-serif"},children:[(0,z.jsxs)("div",{style:{padding:"14px 16px",background:h.accent,color:"#FFFFFF",display:"flex",alignItems:"center",gap:10},children:[(0,z.jsx)("span",{style:{fontSize:22},children:"\u{1F916}"}),(0,z.jsxs)("div",{style:{flex:1},children:[(0,z.jsx)("div",{style:{fontWeight:700,fontSize:15},children:"Grid AI Assistant"}),(0,z.jsx)("div",{style:{fontSize:11,opacity:.9},children:P?"Voice + Chat \xB7 Offline \xB7 Free":"Chat only (voice not supported)"})]}),(0,z.jsx)("button",{type:"button",onClick:()=>a(!1),"aria-label":"Close",style:{background:"transparent",border:"none",color:"#FFFFFF",cursor:"pointer",fontSize:20,padding:4},children:"\u2715"})]}),(0,z.jsxs)("div",{style:{flex:1,overflowY:"auto",padding:12,display:"flex",flexDirection:"column",gap:8},children:[m.map((x,N)=>(0,z.jsxs)("div",{style:{alignSelf:x.role==="user"?"flex-end":"flex-start",maxWidth:"85%",padding:"8px 12px",borderRadius:12,background:x.role==="user"?h.userMsg:h.aiMsg,color:h.text,fontSize:13.5,lineHeight:1.5},children:[(0,z.jsx)("div",{children:x.text}),(0,z.jsx)("div",{style:{fontSize:10,opacity:.6,marginTop:4,textAlign:"right"},children:x.time})]},N)),F&&(0,z.jsx)("div",{style:{alignSelf:"flex-end",padding:"8px 12px",borderRadius:12,background:"#FEE2E2",color:"#991B1B",fontSize:13.5,fontStyle:"italic"},children:"\u{1F3A4} Listening..."}),(0,z.jsx)("div",{ref:O})]}),(0,z.jsx)("div",{style:{padding:"6px 12px",borderTop:`1px solid ${h.border}`,display:"flex",gap:6,overflowX:"auto",flexShrink:0},children:L.map(x=>(0,z.jsx)("button",{type:"button",onClick:()=>H(x),style:{padding:"4px 10px",borderRadius:12,background:h.surface,border:`1px solid ${h.border}`,color:h.text,fontSize:11.5,cursor:"pointer",whiteSpace:"nowrap"},children:x},x))}),(0,z.jsxs)("div",{style:{padding:10,display:"flex",gap:6,borderTop:`1px solid ${h.border}`,background:h.surface},children:[(0,z.jsx)("input",{type:"text",value:l,onChange:x=>c(x.target.value),onKeyDown:x=>{x.key==="Enter"&&T()},placeholder:"Ask or say a command...","aria-label":"Chat input",style:{flex:1,padding:"8px 12px",border:`1px solid ${h.border}`,borderRadius:8,background:h.bg,color:h.text,fontSize:13,outline:"none"}}),P&&(0,z.jsx)("button",{type:"button",onClick:F?_:k,"aria-label":F?"Stop listening":"Start voice input",style:{width:36,height:36,borderRadius:8,background:F?"#EF4444":h.accent,color:"#FFFFFF",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0},children:"\u{1F3A4}"}),(0,z.jsx)("button",{type:"button",onClick:T,"aria-label":"Send",disabled:!l.trim(),style:{padding:"0 14px",background:l.trim()?h.accent:h.muted,color:"#FFFFFF",border:"none",borderRadius:8,cursor:l.trim()?"pointer":"not-allowed",fontSize:13,fontWeight:600,flexShrink:0},children:"Send"})]})]}),(0,z.jsx)("style",{children:`
        @keyframes yuktai-pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
          }

          50% {
            transform: scale(1.1);
            box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
          }
        }
      `})]})}var on=Er;f();var nn=require("react");f();function Ze(e,t){let o=t.trim().toLowerCase(),r=e.data.filter(s=>e.columns.some(n=>String(s[n.key]??"").toLowerCase().includes(o))),i=r.map(s=>String(s.id??"")).filter(Boolean);return e.onHighlightRows?.(i),{success:!0,message:`${r.length} row(s) found.`,data:r}}function Je(e){return{success:!0,message:`${e.data.length} row(s).`,data:e.data.length}}function Qe(e){return{success:!0,message:"Grid columns retrieved.",data:e.columns}}function et(e,t){let o=e.data.find(r=>String(r.id??"")===t);return o?{success:!0,message:"Row found.",data:o}:{success:!1,message:`Row "${t}" not found.`}}function tt(e,t){return e.onHighlightRows?.(t),{success:!0,message:`${t.length} row(s) highlighted.`,data:t}}function ot(e,t){return e.onSelectRow?.(t),{success:!0,message:`Row "${t}" selected.`,data:t}}function nt(e,t){return e.onOpenRow?.(t),{success:!0,message:`Row "${t}" opened.`,data:t}}function Et({data:e,columns:t,name:o="yuktai_grid",onSelectRow:r,onHighlightRows:i,onOpenRow:s}){return(0,nn.useEffect)(()=>{let n=document.modelContext;if(!n)return;let a=new AbortController,l={data:e,columns:t,onSelectRow:r,onHighlightRows:i,onOpenRow:s};return(async()=>{await n.registerTool({name:`${o}_search`,title:"Search Grid",description:"Search the grid.",inputSchema:{type:"object",properties:{query:{type:"string"}},required:["query"]},execute:async({query:m})=>Ze(l,m)},{signal:a.signal}),await n.registerTool({name:`${o}_count`,title:"Count Grid",description:"Count grid rows.",inputSchema:{type:"object",properties:{}},execute:async()=>Je(l)},{signal:a.signal}),await n.registerTool({name:`${o}_columns`,title:"Get Grid Columns",description:"Get grid columns.",inputSchema:{type:"object",properties:{}},execute:async()=>Qe(l)},{signal:a.signal}),await n.registerTool({name:`${o}_get_row`,title:"Get Grid Row",description:"Get a grid row by ID.",inputSchema:{type:"object",properties:{id:{type:"string"}},required:["id"]},execute:async({id:m})=>et(l,m)},{signal:a.signal}),await n.registerTool({name:`${o}_highlight`,title:"Highlight Grid Rows",description:"Highlight grid rows.",inputSchema:{type:"object",properties:{ids:{type:"array",items:{type:"string"}}},required:["ids"]},execute:async({ids:m})=>tt(l,m)},{signal:a.signal}),await n.registerTool({name:`${o}_select`,title:"Select Grid Row",description:"Select a grid row.",inputSchema:{type:"object",properties:{id:{type:"string"}},required:["id"]},execute:async({id:m})=>ot(l,m)},{signal:a.signal}),await n.registerTool({name:`${o}_open`,title:"Open Grid Row",description:"Open a grid row.",inputSchema:{type:"object",properties:{id:{type:"string"}},required:["id"]},execute:async({id:m})=>nt(l,m)},{signal:a.signal})})().catch(()=>{}),()=>{a.abort()}},[e,t,o,r,i,s]),null}f();var rt=require("react");function Lt({tools:e,onResult:t,onError:o}){let[r,i]=(0,rt.useState)(!1),s=(0,rt.useCallback)(async(n,a={})=>{let l=e.find(c=>c.name===n);if(!l){let c=new Error(`Tool "${n}" not found.`);throw o?.(c),c}i(!0);try{let c=await l.execute(a);return t?.(c),c}catch(c){let m=c instanceof Error?c:new Error(String(c));throw o?.(m),m}finally{i(!1)}},[e,t,o]);return{loading:r,tools:e,executeTool:s}}var rn=Lt;f();f();var an=require("react/jsx-runtime");function K({size:e=20,color:t="currentColor",strokeWidth:o=2.5,label:r,children:i,...s}){return(0,an.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:o,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!r?"true":void 0,"aria-label":r,role:r?"img":void 0,focusable:"false",...s,children:i})}f();var ze=require("react/jsx-runtime");function Rt(e){return(0,ze.jsxs)(K,{...e,children:[(0,ze.jsx)("circle",{cx:"11",cy:"11",r:"7"}),(0,ze.jsx)("path",{d:"m20 20-4-4"})]})}f();var Fe=require("react/jsx-runtime");function Mt(e){return(0,Fe.jsxs)(K,{...e,children:[(0,Fe.jsx)("path",{d:"M12 19V5"}),(0,Fe.jsx)("path",{d:"m5 12 7-7 7 7"})]})}f();var Ge=require("react/jsx-runtime");function It(e){return(0,Ge.jsxs)(K,{...e,children:[(0,Ge.jsx)("path",{d:"M12 5v14"}),(0,Ge.jsx)("path",{d:"m5 12 7 7 7-7"})]})}f();var Pt=require("react/jsx-runtime");function Nt(e){return(0,Pt.jsx)(K,{...e,children:(0,Pt.jsx)("path",{d:"m15 18-6-6 6-6"})})}f();var zt=require("react/jsx-runtime");function Ft(e){return(0,zt.jsx)(K,{...e,children:(0,zt.jsx)("path",{d:"m9 18 6-6-6-6"})})}f();var Gt=require("react/jsx-runtime");function Ht(e){return(0,Gt.jsx)(K,{...e,children:(0,Gt.jsx)("path",{d:"M5 12.5 10 17.5 19.5 7"})})}f();var He=require("react/jsx-runtime");function $t(e){return(0,He.jsxs)(K,{...e,children:[(0,He.jsx)("path",{d:"M18 6 6 18"}),(0,He.jsx)("path",{d:"m6 6 12 12"})]})}function Lr(){if(typeof globalThis>"u")return new fe;if(!globalThis.__yuktai_runtime__){let e=new fe;e.register(re.name,re),e.register(Pe.name,Pe),e.register(Ne.name,Ne),globalThis.__yuktai_runtime__=e}return globalThis.__yuktai_runtime__}var sn=typeof window<"u"?Lr():new fe,Rr={wcagPlugin:re,list(){return sn.getPlugins()},use(e){return sn.use(e)},fix(e){return re.applyFixes({enabled:!0,autoFix:!0,...e})},scan(){return re.scan()}};
