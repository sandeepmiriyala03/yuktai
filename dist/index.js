"use strict";var pr=Object.create;var mt=Object.defineProperty;var fr=Object.getOwnPropertyDescriptor;var gr=Object.getOwnPropertyNames;var mr=Object.getPrototypeOf,br=Object.prototype.hasOwnProperty;var He=(e,t)=>()=>(e&&(t=e(e=0)),t);var Je=(e,t)=>{for(var n in t)mt(e,n,{get:t[n],enumerable:!0})},Rn=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of gr(t))!br.call(e,r)&&r!==n&&mt(e,r,{get:()=>t[r],enumerable:!(o=fr(t,r))||o.enumerable});return e};var Nt=(e,t,n)=>(n=e!=null?pr(mr(e)):{},Rn(t||!e||!e.__esModule?mt(n,"default",{value:e,enumerable:!0}):n,e)),hr=e=>Rn(mt({},"__esModule",{value:!0}),e);var h=He(()=>{});var to={};Je(to,{askPage:()=>_t});function Dr(){return new Promise(e=>{let t=setTimeout(e,1500),n=new MutationObserver(()=>{clearTimeout(t),t=setTimeout(()=>{n.disconnect(),e()},500)});n.observe(document.body,{childList:!0,subtree:!0})})}function _r(){let e=[],t=document.querySelectorAll("*");for(let n of t){if(n.closest("[data-yuktai-panel]"))continue;let o=n.innerText?.trim();o&&o.length>30&&e.push(o);let r=n.getAttribute("aria-label");if(r&&r.length>10&&e.push(r),(n instanceof HTMLInputElement||n instanceof HTMLTextAreaElement)&&(n.placeholder&&e.push(n.placeholder),n.value&&e.push(n.value)),n instanceof HTMLButtonElement){let a=n.innerText||n.getAttribute("aria-label");a&&e.push(a)}}return e.join(" ").slice(0,3500)}async function _t(e){if(!e.trim())return{success:!1,answer:"",error:"Please type a question."};try{let t=window,n=t.LanguageModel||t.ai?.languageModel;if(!n)return{success:!1,answer:"",error:"Gemini Nano not available."};await Dr();let o=_r();if(!o||o.length<100)return{success:!1,answer:"",error:"Page content not readable."};let r;try{r=await n.create({systemPrompt:`Answer ONLY using page content.
Keep answer short (2\u20133 sentences).
If not found say: "I could not find that on this page."`,outputLanguage:"en"})}catch{r=await n.create()}let a=`Page:
${o}

Q: ${e}`,i=await r.prompt(a);return r?.destroy&&r.destroy(),{success:!0,answer:i?.trim()||"No answer found."}}catch(t){return{success:!1,answer:"",error:t instanceof Error?t.message:"Error occurred"}}}var Bt=He(()=>{"use strict";h()});var jt={};Je(jt,{askPageWithTransformers:()=>Ut,getModelLoadStatus:()=>tt,isTransformersSupported:()=>et});function io(){return typeof navigator>"u"?!1:/Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(navigator.userAgent)}function Br(){if(io())return"wasm";try{if(typeof navigator<"u"&&"gpu"in navigator&&navigator.gpu!==void 0)return"webgpu"}catch{}return"wasm"}async function qr(){if(!qt){if(qe){for(;qe;)await new Promise(e=>setTimeout(e,200));return}qe=!0;try{let{pipeline:e,env:t}=await import("@huggingface/transformers");t.allowRemoteModels=!0,t.allowLocalModels=!1,typeof window<"u"&&typeof caches<"u"&&(t.useWasmCache=!0);let n=Br(),o=io();console.log(`yuktai: Transformers.js \u2014 device: ${n}, mobile: ${o}`),oo=await e("feature-extraction","Xenova/all-MiniLM-L6-v2",{device:n,dtype:o?"q4":"fp32"}),ro=await e("text2text-generation","Xenova/flan-t5-small",{device:n,dtype:o?"q4":"fp32"}),qt=!0,qe=!1,console.log("yuktai: Transformers.js models loaded \u2705")}catch(e){throw qe=!1,console.error("yuktai: Transformers.js model load failed",e),e}}}function Ur(){return new Promise(e=>{let t=setTimeout(e,1500),n=new MutationObserver(()=>{clearTimeout(t),t=setTimeout(()=>{n.disconnect(),e()},500)});n.observe(document.body,{childList:!0,subtree:!0})})}function jr(){let e=[],t=new Set,n=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, td, th, label, figcaption, blockquote, span, a, button, div");for(let i of n){if(i.closest("[data-yuktai-panel]")||i.querySelector("p, h1, h2, h3, h4, li, td, div"))continue;let l=i.innerText?.trim();if(!l||l.length<15||t.has(l))continue;t.add(l),e.push(l);let p=i.getAttribute("aria-label")?.trim();p&&p.length>8&&!t.has(p)&&(t.add(p),e.push(p))}let o=document.title?.trim();o&&!t.has(o)&&e.unshift(o);let a=document.querySelector('meta[name="description"]')?.getAttribute("content")?.trim();return a&&!t.has(a)&&e.unshift(a),e.join(" ").slice(0,8e3)}function Vr(e,t=150,n=30){if(typeof e!="string")try{e=String(e??"")}catch{return[]}let o=e.trim();if(!o)return[];let r=Math.min(n,Math.floor(t/2)),a=o.split(/\s+/),i=[],s=t-r;for(let l=0;l<a.length;l+=s){let p=a.slice(l,l+t).join(" ");p.trim().length>20&&i.push(p)}return i}function Yr(e,t){let n=0,o=0,r=0;for(let a=0;a<e.length;a++)n+=e[a]*t[a],o+=e[a]*e[a],r+=t[a]*t[a];return n/(Math.sqrt(o)*Math.sqrt(r)+1e-8)}async function no(e){let t=await oo(e,{pooling:"mean",normalize:!0}),n=t?.data??t;return Array.from(n)}async function Xr(e,t,n=3){let o=await no(e),r=await Promise.all(t.map(async a=>{let i=await no(a),s=Yr(o,i);return{chunk:a,score:s}}));return r.sort((a,i)=>i.score-a.score),r.slice(0,n).map(a=>a.chunk)}async function Ut(e){if(!e.trim())return{success:!1,answer:"",error:"Please type a question."};try{await qr(),await Ur();let t=jr();if(!t||t.length<50)return{success:!1,answer:"",error:"Not enough content on this page."};let n=Vr(t);if(n.length===0)return{success:!1,answer:"",error:"Could not process page content."};let a=`Answer the question based on the context. Give a complete answer in 2-3 sentences.

Context: ${(await Xr(e,n,3)).join(" ").slice(0,1200)}

Question: ${e}

Answer:`,s=(await ro(a,{max_new_tokens:120,min_new_tokens:10}))?.[0]?.generated_text?.trim()||"";return s?{success:!0,answer:s}:{success:!0,answer:"I could not find a specific answer on this page."}}catch(t){console.error("yuktai: Transformers RAG error",t);let n=t instanceof Error?t.message:"";return n.includes("Out of memory")||n.includes("memory")?{success:!1,answer:"",error:"Not enough device memory. Try on a device with more RAM or use desktop Chrome with Gemini Nano."}:{success:!1,answer:"",error:n||"Transformers.js error."}}}function et(){try{return typeof WebAssembly<"u"&&typeof Worker<"u"}catch{return!1}}function tt(){return qt?"ready":qe?"loading":"idle"}var oo,ro,qe,qt,nt=He(()=>{"use strict";h();oo=null,ro=null,qe=!1,qt=!1});function so(e,t){return e.replace(/\{\{SITE_NAME\}\}/g,t.SITE_NAME).replace(/\{\{THEME_COLOR\}\}/g,t.THEME_COLOR).replace(/\{\{TAGLINE\}\}/g,t.TAGLINE).replace(/\{\{YEAR\}\}/g,t.YEAR)}var Xt,lo,co,uo,po,fo,go,mo,bo,ho,yo,xo,vo,wo,ko,So,To,Ao,Co,Eo,Io,Ro,Lo,No,Mo,Po=He(()=>{"use strict";h();Xt={blue:"#1a73e8",green:"#0d9488",purple:"#7c3aed",red:"#dc2626",orange:"#ea580c",teal:"#0891b2",indigo:"#4f46e5",gray:"#374151"},lo=e=>`{
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
`,co=`/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
}

module.exports = nextConfig
`,uo=e=>`/** @type {import('tailwindcss').Config} */
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
`,po=e=>`@tailwind base;
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
`,fo=`import type { Metadata } from "next"
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
`,go=`"use client"
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
`,mo=`.navbar {
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
`,bo=`import styles from "./Footer.module.css"

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
`,ho=`.footer {
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
`,yo=`import styles from "./page.module.css"
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
`,xo=`.page { min-height: 100vh; }

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
`,vo=`import styles from "./page.module.css"

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
`,wo=`.page { min-height: 100vh; }

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
`,ko=`"use client"
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
`,So=`.page { min-height: 100vh; }

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
`,To=`import styles from "./page.module.css"

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
`,Ao=`.page { min-height: 100vh; }

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
`,Co=`import styles from "./page.module.css"
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
`,Eo=`.page { min-height: 100vh; }

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
`,Io=`"use client"
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
`,Ro=`.page {
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
`,Lo=`import Link from "next/link"

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
`,No=`{
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
`,Mo=e=>`# ${e}

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
`});var Go={};Je(Go,{generateZip:()=>pi});function ui(e,t){return{hotel:`Experience luxury and comfort at ${e}`,ecommerce:`Shop the best products at ${e}`,restaurant:`Delicious food crafted with love at ${e}`,portfolio:`Creative work and professional services by ${e}`,blog:`Insights, stories, and ideas from ${e}`,saas:`Powerful tools to grow your business \u2014 ${e}`,government:`Official services and information \u2014 ${e}`,healthcare:`Quality healthcare you can trust \u2014 ${e}`,education:`Learn, grow, and succeed with ${e}`,realestate:`Find your perfect property with ${e}`,landing:`The smarter way to get things done \u2014 ${e}`,generic:`Welcome to ${e} \u2014 your trusted partner`}[t]||`Welcome to ${e}`}async function pi(e){let t=(await import("jszip")).default,n=new t,o=Xt[e.theme]||Xt.blue,r=ui(e.siteName,e.websiteType),a=new Date().getFullYear().toString(),i={SITE_NAME:e.siteName,THEME_COLOR:o,TAGLINE:r,YEAR:a},s=y=>so(y,i).replace(/\{\{SITE_NAME_LOWER\}\}/g,e.siteName.toLowerCase().replace(/\s+/g,""));n.file("package.json",lo(e.siteName)),n.file("next.config.js",co),n.file("tailwind.config.js",uo(o)),n.file("tsconfig.json",No),n.file("README.md",Mo(e.siteName)),n.file("postcss.config.js","module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }"),n.file(".gitignore",`node_modules
.next
.env.local
.DS_Store`),n.file("src/app/globals.css",po(o)),n.file("src/app/layout.tsx",s(fo)),n.file("src/app/not-found.tsx",Lo),n.file("src/components/Navbar.tsx",s(go)),n.file("src/components/Navbar.module.css",mo),n.file("src/components/Footer.tsx",s(bo)),n.file("src/components/Footer.module.css",ho);for(let y of e.pages)switch(y){case"home":n.file("src/app/page.tsx",s(yo)),n.file("src/app/page.module.css",xo);break;case"about":n.file("src/app/about/page.tsx",s(vo)),n.file("src/app/about/page.module.css",wo);break;case"contact":n.file("src/app/contact/page.tsx",s(ko)),n.file("src/app/contact/page.module.css",So);break;case"services":n.file("src/app/services/page.tsx",s(To)),n.file("src/app/services/page.module.css",Ao);break;case"pricing":n.file("src/app/pricing/page.tsx",s(Co)),n.file("src/app/pricing/page.module.css",Eo);break;case"auth":n.file("src/app/auth/page.tsx",s(Io)),n.file("src/app/auth/page.module.css",Ro);break;default:n.file(`src/app/${y}/page.tsx`,fi(y,e.siteName,o,i,s));break}let l=await n.generateAsync({type:"blob"}),p=URL.createObjectURL(l),g=document.createElement("a");g.href=p,g.download=`${e.siteName.toLowerCase().replace(/\s+/g,"-")}-nextjs.zip`,document.body.appendChild(g),g.click(),document.body.removeChild(g),URL.revokeObjectURL(p)}function fi(e,t,n,o,r){let a=e.charAt(0).toUpperCase()+e.slice(1);return`import styles from "./page.module.css"

export default function ${a}Page() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <section style={{
        background: "${n}",
        color: "white",
        padding: "5rem 1rem",
        textAlign: "center"
      }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem" }}>
          ${a}
        </h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.85 }}>
          ${t} \u2014 ${a} page
        </p>
      </section>
      <section style={{ padding: "4rem 1rem", maxWidth: "1100px", margin: "0 auto" }}>
        <p style={{ color: "#64748b", fontSize: "1rem", textAlign: "center" }}>
          This is the ${a} page. Edit this file to add your content.
        </p>
      </section>
    </div>
  )
}
`}var Fo=He(()=>{"use strict";h();Po()});var Ho={};Je(Ho,{getPageText:()=>zo,highlightField:()=>Oo,runAgent:()=>vi,scanFormFields:()=>$o,scrollToSection:()=>Wo});function Ne(e){try{let t=window.getComputedStyle(e);if(t.display==="none"||t.visibility==="hidden"||t.opacity==="0"||e.hidden)return!1;let n=e.getBoundingClientRect();return!(n.width===0&&n.height===0)}catch{return!0}}function zo(){let e=[],t=new Set,n=i=>{let s=i.trim();s&&s.length>10&&!t.has(s)&&(t.add(s),e.push(s))};document.title&&n(document.title);let o=['meta[name="description"]','meta[name="keywords"]','meta[property="og:title"]','meta[property="og:description"]','meta[name="twitter:title"]','meta[name="twitter:description"]'];for(let i of o){let s=document.querySelector(i)?.getAttribute("content");s&&n(s)}let r=["h1","h2","h3","h4","h5","h6","p","blockquote","q","pre","code","li","dt","dd","th","td","caption","a","b","strong","em","i","u","s","abbr","acronym","cite","dfn","mark","small","sub","sup","ins","del","bdi","bdo","article","section","aside","nav","header","footer","main","summary","details","figcaption","figure","address","time","output","label","legend","option","button","font","center","span","div","[role='heading']","[role='main']","[role='article']","[role='region']","[role='complementary']","[role='contentinfo']","[role='navigation']","[role='banner']","[role='listitem']","[role='cell']","[role='columnheader']","[role='rowheader']"],a=document.querySelectorAll(r.join(","));for(let i of a){if(i.closest("[data-yuktai-panel]")||!Ne(i)||i.querySelector("p, h1, h2, h3, h4, h5, h6, li, td, th, div, article, section, blockquote, pre"))continue;let l=i.innerText?.trim();if(l&&l.length>10&&n(l),!l){let L=i.textContent?.trim();L&&L.length>10&&n(L)}let p=i.getAttribute("aria-label")?.trim();p&&p.length>5&&n(p);let g=i.getAttribute("aria-description")?.trim();g&&g.length>5&&n(g);let y=i.getAttribute("aria-valuetext")?.trim();y&&n(y);let M=i.getAttribute("title")?.trim();M&&M.length>5&&n(M);let _=i.getAttribute("data-label")?.trim();_&&n(_);let z=i.getAttribute("data-title")?.trim();z&&n(z),i.querySelectorAll("img").forEach(L=>{let A=L.getAttribute("alt")?.trim();A&&A.length>5&&n(A);let H=L.getAttribute("title")?.trim();H&&H.length>5&&n(H)})}document.querySelectorAll("img").forEach(i=>{if(i.closest("[data-yuktai-panel]")||!Ne(i))return;let s=i.getAttribute("alt")?.trim(),l=i.getAttribute("title")?.trim();s&&s.length>5&&n(s),l&&l.length>5&&n(l)}),document.querySelectorAll("input:not([type=hidden]), textarea").forEach(i=>{if(i.closest("[data-yuktai-panel]")||!Ne(i))return;i.placeholder&&n(i.placeholder),i.value&&i.value.length>3&&n(i.value);let s=i.getAttribute("aria-label")?.trim();s&&n(s)}),document.querySelectorAll("select").forEach(i=>{i.closest("[data-yuktai-panel]")||Ne(i)&&Array.from(i.options).forEach(s=>{s.text?.trim().length>3&&n(s.text.trim())})}),document.querySelectorAll("td, th").forEach(i=>{if(i.closest("[data-yuktai-panel]")||!Ne(i))return;let s=i.innerText?.trim();s&&s.length>3&&n(s)});try{document.querySelectorAll("iframe").forEach(i=>{try{let s=i.contentDocument;if(!s)return;let l=s.body?.innerText?.trim();l&&l.length>20&&n(l.slice(0,500))}catch{}})}catch{}return document.querySelectorAll("a").forEach(i=>{if(i.closest("[data-yuktai-panel]")||!Ne(i))return;let s=i.innerText?.trim();s&&s.length>3&&s.length<100&&n(s)}),e.join(" ").slice(0,5e3)}function hi(e){let t=e.getAttribute("aria-label")?.trim();if(t)return t;let n=e.getAttribute("aria-labelledby");if(n){let l=document.getElementById(n);if(l)return l.innerText?.trim()||""}if(e.id){let l=document.querySelector(`label[for="${e.id}"]`);if(l)return l.innerText?.trim()||""}let o=e.closest("label");if(o){let l=o.cloneNode(!0);return l.querySelectorAll("input, select, textarea").forEach(p=>p.remove()),l.innerText?.trim()||""}if((e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement)&&e.placeholder)return e.placeholder;if(e.name)return e.name.replace(/[_-]/g," ");let r=e.previousSibling;if(r?.nodeType===Node.TEXT_NODE){let l=r.textContent?.trim();if(l&&l.length>1)return l}let a=e.previousElementSibling;if(a){let l=a.innerText?.trim();if(l&&l.length>1&&l.length<60)return l}let i=e.closest("td, th");if(i){let l=i.previousElementSibling;if(l){let p=l.innerText?.trim();if(p&&p.length>1)return p}}let s=e.getAttribute("title")?.trim();return s||(e instanceof HTMLInputElement?e.type:"field")}function $o(){let e=[],t=document.querySelectorAll(["input:not([type=hidden])","input:not([type=submit])","input:not([type=button])","input:not([type=reset])","input:not([type=image])","select","textarea","[contenteditable='true']","[role='textbox']","[role='combobox']","[role='spinbutton']","[role='searchbox']","[role='listbox']"].join(", "));for(let n of t){if(n.closest("[data-yuktai-panel]")||!Ne(n))continue;if(n instanceof HTMLInputElement){let r=n.type.toLowerCase();if(["submit","button","reset","image"].includes(r))continue}let o=hi(n);e.push({label:o,type:n instanceof HTMLInputElement?n.type:n.tagName.toLowerCase(),placeholder:(n instanceof HTMLInputElement||n instanceof HTMLTextAreaElement)&&n.placeholder||"",required:n.required||n.getAttribute("aria-required")==="true"||n.getAttribute("data-required")==="true",element:n})}return e}function Oo(e,t=3e3){e.scrollIntoView({behavior:"smooth",block:"center"}),e.style.outline="3px solid #0d9488",e.style.outlineOffset="3px";try{e.focus()}catch{}setTimeout(()=>{e.style.outline="",e.style.outlineOffset=""},t)}function Wo(e){let t=e.toLowerCase(),n=document.querySelectorAll("h1, h2, h3, h4, h5, h6, section, article, [id], [aria-label], [role='heading'], [role='region']");for(let o of n){if(o.closest("[data-yuktai-panel]")||!Ne(o))continue;if((o.innerText||o.getAttribute("id")||o.getAttribute("aria-label")||o.getAttribute("name")||"").toLowerCase().includes(t))return o.scrollIntoView({behavior:"smooth",block:"center"}),o.style.outline="2px solid #0d9488",o.style.outlineOffset="4px",setTimeout(()=>{o.style.outline="",o.style.outlineOffset=""},2500),!0}return!1}async function yi(e,t,n){let o=window,r=o.LanguageModel||o.ai?.languageModel;if(!r)throw new Error("Gemini Nano not available");let a=await r.create({systemPrompt:`You are a helpful web accessibility agent.
Create a simple action plan to help a user complete a task on a webpage.
Rules:
- Maximum 5 steps
- Short and clear \u2014 no jargon
- If filling a form \u2014 list each field and what to enter
- No markdown \u2014 no asterisks, no bold, no headers
- Number each step: 1. 2. 3.`}),s=`Page content: ${e}${n?`
The page has form fields the user may need to fill.`:""}

User task: ${t}

Action plan:`,l=await a.prompt(s);return a.destroy(),l?.trim()||""}async function xi(e,t){let{askPageWithTransformers:n}=await Promise.resolve().then(()=>(nt(),jt));return(await n(`How do I: ${t}`)).answer||"I could not create a plan for this task."}async function vi(e,t,n){if(!e.trim())return{success:!1,steps:[],error:"Please tell me what you want to do."};if(!t)return{success:!1,steps:[],error:"No AI engine available on this device."};let o=[],r=(a,i="info")=>{let s={text:a,type:i};o.push(s),n(s)};try{r("\u{1F4D6} Reading page content...","info");let a=zo(),i=$o(),s=i.length>0;a.length<50&&r("\u26A0\uFE0F Page content is very limited. This may be a static image page.","error"),r(s?`\u{1F4CB} Found ${i.length} form field${i.length!==1?"s":""} on this page`:"\u{1F4C4} No form fields found \u2014 this appears to be a content page","info"),r("\u{1F916} Creating action plan...","info");let l="";try{t==="gemini"?l=await yi(a,e,s):l=await xi(a,e)}catch{l=s?`1. Locate the form on this page
2. Fill each required field
3. Review your answers
4. Submit the form`:`1. Read the page carefully
2. Find the section relevant to your task
3. Follow the on-page instructions`}if(l&&(r("\u2705 Your action plan:","success"),l.split(/\n/).map(p=>p.replace(/\*\*/g,"").replace(/\*/g,"").trim()).filter(p=>p.length>5).slice(0,6).forEach(p=>r(`   ${p}`,"action"))),s){let p=i[0];r(`\u{1F3AF} First field: "${p.label}"${p.required?" \u2605 required":""}`,"field"),Oo(p.element),i.length>1&&r(`\u{1F4DD} All ${i.length} fields: ${i.map(g=>g.label).join(" \u2192 ")}`,"info")}else{let p=e.toLowerCase().split(/\s+/).filter(y=>y.length>3),g=!1;for(let y of p)if(Wo(y)){r(`\u{1F3AF} Scrolled to relevant section: "${y}"`,"action"),g=!0;break}g||r("\u{1F4A1} Scroll through the page to find what you need.","info")}return r("\u2705 Ready. Follow the steps above. Ask me again if you need more help.","success"),{success:!0,steps:o}}catch(a){let i=a instanceof Error?a.message:"Agent error.";return r(`\u26A0\uFE0F ${i}`,"error"),{success:!1,steps:o,error:i}}}var Do=He(()=>{"use strict";h()});var ea={};Je(ea,{CheckIcon:()=>xn,ChevronLeftIcon:()=>mn,ChevronRightIcon:()=>hn,CloseIcon:()=>vn,IconBase:()=>ue,Runtime:()=>Me,SearchIcon:()=>un,SortDownIcon:()=>fn,SortUpIcon:()=>pn,YuktAI:()=>Ji,YuktAIWrapper:()=>Tt,YuktaiGrid:()=>er,YuktaiGridAI:()=>Ct,YuktaiGridAgent:()=>Zo,YuktaiGridWebMCP:()=>st,aiPlugin:()=>rt,applyGridFilters:()=>Ye,clearFilters:()=>sn,clearSort:()=>cn,countGrid:()=>Jt,createGridTools:()=>Ke,default:()=>Tt,filterGrid:()=>an,getColumns:()=>en,getRow:()=>tn,getRowId:()=>Ve,highlightRows:()=>nn,openRow:()=>rn,parseGridIntent:()=>dn,searchGrid:()=>Zt,selectRow:()=>on,sortGrid:()=>ln,toGridToolColumns:()=>Xe,useGrid:()=>ar,useYuktaiGridAgent:()=>at,voicePlugin:()=>it,wcag:()=>xe,wcagPlugin:()=>xe});module.exports=hr(ea);h();h();h();function Ln(){let e=window;return e.Rewriter||e.ai?.rewriter||null}async function Mt(){try{let e=Ln();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}async function yr(e){if(!e||e.trim().length<20)return{success:!1,original:e,rewritten:e,error:"Text too short"};try{let t=Ln();if(!t)throw new Error("Rewriter API not available");let n=await t.create({tone:"more-casual",format:"plain-text",length:"as-is",outputLanguage:"en"}),o=await n.rewrite(e,{context:"Rewrite this text in simple plain English. Use short sentences. Avoid jargon. Make it easy to understand for everyone."});return n.destroy(),{success:!0,original:e,rewritten:o.trim()}}catch(t){return{success:!1,original:e,rewritten:e,error:t instanceof Error?t.message:"Rewrite failed"}}}async function Nn(){if(!await Mt())return{fixed:0,error:"Chrome Built-in AI Rewriter not available. Enable via chrome://flags."};let t=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption"),n=0;for(let o of t){let r=o.innerText?.trim();if(!r||r.length<20||o.closest("[data-yuktai-panel]"))continue;let a=await yr(r);a.success&&a.rewritten!==r&&(o.dataset.yuktaiOriginal=r,o.innerText=a.rewritten,n++)}return{fixed:n}}function Mn(){let e=document.querySelectorAll("[data-yuktai-original]");for(let t of e){let n=t.dataset.yuktaiOriginal;n&&(t.innerText=n,delete t.dataset.yuktaiOriginal)}}h();var Pn="yuktai-summary-box";function Gn(){let e=window;return e.Summarizer||e.ai?.summarizer||null}async function Pt(){try{let e=Gn();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}function xr(){let e=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, article, section"),t=[];for(let n of e){if(n.closest("[data-yuktai-panel]"))continue;let o=window.getComputedStyle(n);if(o.display==="none"||o.visibility==="hidden")continue;let r=n.innerText?.trim();r&&r.length>10&&t.push(r)}return t.join(" ").slice(0,5e3)}async function Fn(){if(!await Pt())return{success:!1,summary:"",error:"Chrome Built-in AI Summarizer not available. Enable via chrome://flags."};let t=xr();if(!t||t.length<100)return{success:!1,summary:"",error:"Not enough text on this page to summarise."};try{let n=Gn();if(!n)throw new Error("Summarizer API not available");let o=await n.create({type:"tl;dr",format:"plain-text",length:"short",outputLanguage:"en"}),r=await o.summarize(t,{context:"Summarise this page in 2-3 simple sentences for a screen reader user who wants to know if this page is relevant to them."});return o.destroy(),vr(r.trim()),{success:!0,summary:r.trim()}}catch(n){return{success:!1,summary:"",error:n instanceof Error?n.message:"Summary failed"}}}function vr(e){bt();let t=document.createElement("div");t.id=Pn,t.setAttribute("data-yuktai-panel","true"),t.setAttribute("role","region"),t.setAttribute("aria-label","Page summary by yuktai"),t.style.cssText=`
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
  `;let n=document.createElement("p");n.style.cssText="margin: 0; flex: 1;",n.textContent=`\u{1F4CB} Page summary: ${e}`;let o=document.createElement("button");o.textContent="\xD7",o.setAttribute("aria-label","Close page summary"),o.style.cssText=`
    background: none; border: none; color: #ffffff;
    font-size: 20px; cursor: pointer; padding: 0 4px;
    line-height: 1; flex-shrink: 0;
  `,o.addEventListener("click",bt),t.appendChild(n),t.appendChild(o),document.body.prepend(t)}function bt(){let e=document.getElementById(Pn);e&&e.remove()}h();var yt=[{code:"en",label:"English"},{code:"hi",label:"Hindi"},{code:"es",label:"Spanish"},{code:"fr",label:"French"},{code:"de",label:"German"},{code:"it",label:"Italian"},{code:"pt",label:"Portuguese"},{code:"nl",label:"Dutch"},{code:"pl",label:"Polish"},{code:"ru",label:"Russian"},{code:"ja",label:"Japanese"},{code:"ko",label:"Korean"},{code:"zh",label:"Chinese"},{code:"ar",label:"Arabic"},{code:"tr",label:"Turkish"},{code:"vi",label:"Vietnamese"},{code:"bn",label:"Bengali"},{code:"id",label:"Indonesian"}],ht="en";function wr(){let e=window;return e.Translator||e.translation||null}async function kr(e){try{let t=window;if(!wr())return!1;if(t.Translator&&typeof t.Translator.availability=="function")try{let o=await t.Translator.availability({sourceLanguage:"en",targetLanguage:e});return o==="readily"||o==="available"||o==="downloadable"||o==="after-download"}catch{}return t.Translator&&typeof t.Translator.canTranslate=="function"?await t.Translator.canTranslate({sourceLanguage:"en",targetLanguage:e})!=="no":t.translation&&typeof t.translation.canTranslate=="function"?await t.translation.canTranslate({sourceLanguage:"en",targetLanguage:e})!=="no":!1}catch{return!1}}async function Sr(e){let t=window,n={sourceLanguage:"en",targetLanguage:e};if(t.Translator&&typeof t.Translator.create=="function")return await t.Translator.create(n);if(t.translation&&typeof t.translation.createTranslator=="function")return await t.translation.createTranslator(n);throw new Error("Translation API not available")}async function zn(e){if(e===ht)return{success:!0,language:e,fixed:0};if(e==="en")return Gt(),ht="en",{success:!0,language:"en",fixed:0};if(!await kr(e))return{success:!1,language:e,fixed:0,error:`Translation to ${e} not available. Enable via chrome://flags.`};try{let n=await Sr(e),o=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption, span, a"),r=0;for(let a of o){if(a.closest("[data-yuktai-panel]")||a.children.length>0)continue;let i=a.innerText?.trim();if(!i||i.length<2)continue;a.dataset.yuktaiTranslationOriginal||(a.dataset.yuktaiTranslationOriginal=i);let s=await n.translate(i);s&&s!==i&&(a.innerText=s,r++)}return typeof n.destroy=="function"&&n.destroy(),ht=e,{success:!0,language:e,fixed:r}}catch(n){return{success:!1,language:e,fixed:0,error:n instanceof Error?n.message:"Translation failed"}}}function Gt(){let e=document.querySelectorAll("[data-yuktai-translation-original]");for(let t of e){let n=t.dataset.yuktaiTranslationOriginal;n&&(t.innerText=n,delete t.dataset.yuktaiTranslationOriginal)}ht="en"}h();var Tr=[{phrases:["go to main","skip to main","main content"],action:"focus-main",label:"Jump to main content"},{phrases:["go to navigation","go to nav","open menu"],action:"focus-nav",label:"Jump to navigation"},{phrases:["go to search","search","find"],action:"focus-search",label:"Jump to search"},{phrases:["scroll down","page down","next"],action:"scroll-down",label:"Scroll down"},{phrases:["scroll up","page up","back up"],action:"scroll-up",label:"Scroll up"},{phrases:["go back","previous page"],action:"go-back",label:"Go back"},{phrases:["click","press","select"],action:"click-focused",label:"Click focused element"},{phrases:["next item","tab forward","tab"],action:"tab-forward",label:"Move to next element"},{phrases:["previous item","tab back","shift tab"],action:"tab-back",label:"Move to previous element"},{phrases:["stop listening","stop voice","quiet"],action:"stop-voice",label:"Stop voice control"}],ve=null,xt=!1,De=null;function Ft(){return!!(window.SpeechRecognition||window.webkitSpeechRecognition)}function Ar(e){let t=e.toLowerCase().trim();for(let n of Tr)for(let o of n.phrases)if(t.includes(o))return{action:n.action,label:n.label};return null}function Cr(e){switch(e){case"focus-main":{let t=document.querySelector("main, [role='main'], #main");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-nav":{let t=document.querySelector("nav, [role='navigation']");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-search":{let t=document.querySelector("input[type='search'], input[role='searchbox'], [aria-label*='search' i]");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"scroll-down":{window.scrollBy({top:400,behavior:"smooth"});break}case"scroll-up":{window.scrollBy({top:-400,behavior:"smooth"});break}case"go-back":{window.history.back();break}case"click-focused":{let t=document.activeElement;t&&t!==document.body&&t.click();break}case"tab-forward":{let t=$n(),n=t.indexOf(document.activeElement),o=t[n+1]||t[0];o&&o.focus();break}case"tab-back":{let t=$n(),n=t.indexOf(document.activeElement),o=t[n-1]||t[t.length-1];o&&o.focus();break}case"stop-voice":{zt();break}}}function $n(){return Array.from(document.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(e=>!e.closest("[data-yuktai-panel]"))}function On(e){if(!Ft())return!1;if(xt)return!0;e&&(De=e);let t=window.SpeechRecognition||window.webkitSpeechRecognition;return ve=new t,ve.continuous=!0,ve.interimResults=!1,ve.lang="en-US",ve.onresult=n=>{let o=n.results[n.results.length-1][0].transcript,r=Ar(o);if(r){Cr(r.action);let a={success:!0,command:o,action:r.label};if(De&&De(a),r.action==="stop-voice")return}},ve.onend=()=>{xt&&ve?.start()},ve.onerror=n=>{n.error!=="no-speech"&&De&&De({success:!1,command:"",action:"",error:`Voice error: ${n.error}`})},ve.start(),xt=!0,Er(),!0}function zt(){xt=!1,ve&&(ve.stop(),ve=null),De=null,Hn()}var Wn="yuktai-voice-indicator";function Er(){Hn();let e=document.createElement("div");e.id=Wn,e.setAttribute("data-yuktai-panel","true"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-label","yuktai voice control is listening"),e.style.cssText=`
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
  `,!document.getElementById("yuktai-pulse-style")){let o=document.createElement("style");o.id="yuktai-pulse-style",o.textContent=`
      @keyframes yuktai-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50%       { opacity: 0.4; transform: scale(0.7); }
      }
    `,document.head.appendChild(o)}let n=document.createElement("span");n.textContent="Listening for commands...",e.appendChild(t),e.appendChild(n),document.body.appendChild(e)}function Hn(){let e=document.getElementById(Wn);e&&e.remove()}h();var Ir=["button:not([aria-label]):not([aria-labelledby])","a:not([aria-label]):not([aria-labelledby])","input:not([aria-label]):not([aria-labelledby]):not([id])","select:not([aria-label]):not([aria-labelledby])","textarea:not([aria-label]):not([aria-labelledby])","[role='button']:not([aria-label])","[role='link']:not([aria-label])","[role='checkbox']:not([aria-label])","[role='tab']:not([aria-label])"].join(", ");function Dn(){let e=window;return e.Writer||e.ai?.writer||null}async function $t(){try{let e=Dn();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}function Rr(e){let t=[],n=e.innerText?.trim();n&&t.push(`element text: "${n}"`);let o=e.placeholder?.trim();o&&t.push(`placeholder: "${o}"`);let r=e.getAttribute("name")?.trim();r&&t.push(`name: "${r}"`);let a=e.getAttribute("type")?.trim();a&&t.push(`type: "${a}"`);let i=e.id;if(i){let p=document.querySelector(`label[for="${i}"]`);p&&t.push(`label: "${p.innerText?.trim()}"`)}let s=e.parentElement?.innerText?.trim().slice(0,60);s&&t.push(`parent context: "${s}"`),t.push(`tag: ${e.tagName.toLowerCase()}`);let l=e.getAttribute("role");return l&&t.push(`role: ${l}`),t.join(". ")}async function Lr(e,t){let n=`
    Generate a short, clear aria-label for an HTML element.
    The label must be 2-6 words maximum.
    The label must describe what the element does or what it is.
    Do not include punctuation.
    Do not explain \u2014 just output the label text only.

    Element details:
    ${t}

    Output only the label. Nothing else.
  `.trim();return(await e.write(n)).trim().replace(/^["']|["']$/g,"").replace(/\.$/,"").trim()}async function _n(){if(!await $t())return{success:!1,fixed:0,elements:[],error:"Chrome Built-in AI Writer not available. Enable via chrome://flags."};let t=document.querySelectorAll(Ir);if(t.length===0)return{success:!0,fixed:0,elements:[]};try{let n=Dn();if(!n)throw new Error("Writer API not available");let o=await n.create({tone:"neutral",format:"plain-text",length:"short",outputLanguage:"en"}),r=0,a=[];for(let i of t){if(i.closest("[data-yuktai-panel]"))continue;let s=window.getComputedStyle(i);if(s.display==="none"||s.visibility==="hidden")continue;let l=Rr(i),p=await Lr(o,l);p&&p.length>0&&(i.dataset.yuktaiLabelOriginal=i.getAttribute("aria-label")||"",i.setAttribute("aria-label",p),r++,a.push({tag:i.tagName.toLowerCase(),label:p}))}return o.destroy(),{success:!0,fixed:r,elements:a}}catch(n){return{success:!1,fixed:0,elements:[],error:n instanceof Error?n.message:"Label generation failed"}}}function Bn(){let e=document.querySelectorAll("[data-yuktai-label-original]");for(let t of e){let n=t.dataset.yuktaiLabelOriginal;n?t.setAttribute("aria-label",n):t.removeAttribute("aria-label"),delete t.dataset.yuktaiLabelOriginal}}var kt=null,qn=null;var Un=null,Ot=null,ae=null,_e=null,vt=null,Wt=null,Be=null,wt={deuteranopia:"yuktai-cb-d",protanopia:"yuktai-cb-p",tritanopia:"yuktai-cb-t"};var jn=new Set(["input","select","textarea"]);var Ht={nav:"navigation",header:"banner",footer:"contentinfo",main:"main",aside:"complementary"};function Dt(e,t="polite"){if(typeof window>"u"||!Be?.speechEnabled||!window.speechSynthesis)return;window.speechSynthesis.cancel();let n=new SpeechSynthesisUtterance(e);n.rate=1,n.pitch=1,n.volume=1;let o=window.speechSynthesis.getVoices();o.length>0&&(n.voice=o[0]),window.speechSynthesis.speak(n)}function Jn(e,t="info"){if(typeof document>"u")return;let o={success:{bg:"#0f9d58",border:"#0a7a44",icon:"\u2713"},error:{bg:"#d93025",border:"#b52a1c",icon:"\u2715"},warning:{bg:"#f29900",border:"#c67c00",icon:"\u26A0"},info:{bg:"#1a73e8",border:"#1557b0",icon:"\u2139"}}[t];ae||(ae=document.createElement("div"),ae.setAttribute("role","alert"),ae.setAttribute("aria-live","assertive"),ae.setAttribute("aria-atomic","true"),ae.style.cssText=`
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
    `,document.body.appendChild(ae)),ae.style.background=o.bg,ae.style.border=`1px solid ${o.border}`,ae.style.color="#fff",ae.innerHTML=`
    <span style="font-size:18px;font-weight:700">${o.icon}</span>
    <span style="flex:1;line-height:1.4">${e}</span>
    <button
      onclick="this.parentElement.style.transform='translateX(120%)';this.parentElement.style.opacity='0'"
      style="background:none;border:none;color:#fff;cursor:pointer;font-size:18px;padding:0;line-height:1"
      aria-label="Close notification">\xD7</button>
  `,window.innerWidth<=480&&(ae.style.right="8px",ae.style.left="8px",ae.style.maxWidth="none",ae.style.width="auto"),requestAnimationFrame(()=>{ae&&(ae.style.transform="translateX(0)",ae.style.opacity="1")}),setTimeout(()=>{ae&&(ae.style.transform="translateX(120%)",ae.style.opacity="0")},5e3)}function Q(e,t="info",n=!0){kt&&(kt.textContent=e),Jn(e,t),n&&Dt(e,t==="error"?"assertive":"polite")}function Nr(){if(typeof document>"u"||Un)return;let e=[{label:"Skip to main content",selector:"main,[role='main'],#main,#main-content"},{label:"Skip to navigation",selector:"nav,[role='navigation'],#nav,#navigation"},{label:"Skip to search",selector:"[role='search'],#search,input[type='search']"}],t=document.createElement("div");t.setAttribute("data-yuktai-skip-bar","true"),t.setAttribute("role","navigation"),t.setAttribute("aria-label","Skip links"),t.style.cssText=`
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
  `;let n=!1;if(e.forEach(({label:r,selector:a})=>{let i=document.querySelector(a);if(!i)return;n=!0,i.getAttribute("tabindex")||i.setAttribute("tabindex","-1");let s=document.createElement("a");s.href="#",s.textContent=r,s.style.cssText=`
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
    `,s.addEventListener("focus",()=>{t.style.transform="translateY(0)"}),s.addEventListener("blur",()=>{setTimeout(()=>{t.matches(":focus-within")||(t.style.transform="translateY(-100%)")},2e3)}),s.addEventListener("click",l=>{l.preventDefault(),i.focus(),i.scrollIntoView({behavior:"smooth",block:"start"}),Q(`Jumped to ${r.replace("Skip to ","")}`,"info"),t.style.transform="translateY(-100%)"}),t.appendChild(s)}),!n)return;window.innerWidth<768&&(t.style.transform="translateY(0)",t.style.position="sticky"),window.addEventListener("resize",()=>{window.innerWidth<768&&(t.style.transform="translateY(0)")}),document.body.insertBefore(t,document.body.firstChild),Un=t}function Mr(){if(typeof document>"u"||document.querySelector("[data-yuktai-focus-style]"))return;let e=document.createElement("style");e.setAttribute("data-yuktai-focus-style","true"),e.textContent=`

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
  `,document.head.appendChild(e),document.documentElement.setAttribute("data-yuktai-a11y","true")}function Pr(){typeof document>"u"||document.querySelector("[data-yuktai-kb-init]")||(document.documentElement.setAttribute("data-yuktai-kb-init","true"),document.addEventListener("keydown",e=>{let t=document.activeElement;if(!t)return;let n=t.getAttribute("role")||"";if(e.key==="Escape"){let o=t.closest("[role='dialog'],[role='alertdialog']");if(o){o.style.display="none",Q("Dialog closed","info");return}let r=t.closest("[role='menu'],[role='menubar']");r&&(r.style.display="none",Q("Menu closed","info"))}if(n==="menuitem"||t.closest("[role='menu'],[role='menubar']")){let o=t.closest("[role='menu'],[role='menubar']");if(!o)return;let r=Array.from(o.querySelectorAll("[role='menuitem']:not([disabled])")),a=r.indexOf(t);e.key==="ArrowDown"||e.key==="ArrowRight"?(e.preventDefault(),r[(a+1)%r.length]?.focus()):e.key==="ArrowUp"||e.key==="ArrowLeft"?(e.preventDefault(),r[(a-1+r.length)%r.length]?.focus()):e.key==="Home"?(e.preventDefault(),r[0]?.focus()):e.key==="End"&&(e.preventDefault(),r[r.length-1]?.focus())}if(n==="tab"||t.closest("[role='tablist']")){let o=t.closest("[role='tablist']");if(!o)return;let r=Array.from(o.querySelectorAll("[role='tab']:not([disabled])")),a=r.indexOf(t);if(e.key==="ArrowRight"||e.key==="ArrowDown"){e.preventDefault();let i=r[(a+1)%r.length];i?.focus(),i?.click()}else if(e.key==="ArrowLeft"||e.key==="ArrowUp"){e.preventDefault();let i=r[(a-1+r.length)%r.length];i?.focus(),i?.click()}}if(n==="option"||t.closest("[role='listbox']")){let o=t.closest("[role='listbox']");if(!o)return;let r=Array.from(o.querySelectorAll("[role='option']:not([aria-disabled='true'])")),a=r.indexOf(t);e.key==="ArrowDown"?(e.preventDefault(),r[(a+1)%r.length]?.focus()):e.key==="ArrowUp"?(e.preventDefault(),r[(a-1+r.length)%r.length]?.focus()):(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),t.setAttribute("aria-selected","true"),r.forEach(i=>{i!==t&&i.setAttribute("aria-selected","false")}),Q(`Selected: ${t.textContent?.trim()}`,"success"))}e.altKey&&e.key==="a"&&(e.preventDefault(),Gr()),e.key==="Tab"&&Be?.speechEnabled&&setTimeout(()=>{let o=document.activeElement;if(!o)return;let r=o.getAttribute("aria-label")||o.getAttribute("title")||o.textContent?.trim()||o.tagName.toLowerCase(),a=o.getAttribute("role")||o.tagName.toLowerCase();Dt(`${r}, ${a}`)},100)}))}function St(e){let t=e.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[role="button"]');if(t.length===0)return;let n=t[0],o=t[t.length-1];n.focus(),e.addEventListener("keydown",r=>{r.key==="Tab"&&(r.shiftKey?document.activeElement===n&&(r.preventDefault(),o.focus()):document.activeElement===o&&(r.preventDefault(),n.focus()))})}function Gr(){if(typeof document>"u")return;if(_e){_e.remove(),_e=null;return}let e=document.createElement("div");e.setAttribute("role","dialog"),e.setAttribute("aria-label","Keyboard shortcuts"),e.setAttribute("aria-modal","true"),e.setAttribute("data-yuktai-cheatsheet","true"),e.style.cssText=`
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
    ${t.map(([o,r])=>`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #2a2a4a">
        <kbd style="background:#2a2a4a;color:#74c0fc;padding:3px 8px;border-radius:4px;font-size:12px;font-family:monospace;border:1px solid #3a3a6a">${o}</kbd>
        <span style="font-size:12px;color:#ccc;text-align:right;flex:1;margin-left:12px">${r}</span>
      </div>
    `).join("")}
  `,e.querySelector("[data-yuktai-close]")?.addEventListener("click",()=>{e.remove(),_e=null}),e.addEventListener("keydown",o=>{o.key==="Escape"&&(e.remove(),_e=null)}),document.body.appendChild(e),_e=e,St(e),Q("Keyboard shortcuts opened. Press Escape to close.","info")}function Fr(e){if(typeof document>"u"||!Be?.showAuditBadge||typeof window<"u"&&!window.location.hostname.includes("localhost")&&!window.location.hostname.includes("127.0.0.1"))return;Ot&&Ot.remove();let t=e.score,n=t>=90?"#0f9d58":t>=70?"#f29900":"#d93025",o=t>=90?"\u267F":t>=70?"\u26A0":"\u2715",r=document.createElement("button");r.setAttribute("aria-label",`Accessibility score: ${t} out of 100`),r.setAttribute("data-yuktai-badge","true"),r.style.cssText=`
    position: fixed;
    bottom: 16px;
    left: 16px;
    z-index: 999998;
    background: ${n};
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
  `,r.innerHTML=`${o} ${t}/100 <span style="font-weight:400;opacity:0.85">${e.details.length} issues</span>`,r.addEventListener("click",()=>zr(e)),document.body.appendChild(r),Ot=r}function zr(e){let t=document.querySelector("[data-yuktai-audit-details]");if(t){t.remove();return}let n=document.createElement("div");n.setAttribute("data-yuktai-audit-details","true"),n.setAttribute("role","dialog"),n.setAttribute("aria-label","Accessibility audit details"),n.style.cssText=`
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
  `;let o={critical:"#d93025",serious:"#f29900",moderate:"#1a73e8",minor:"#0f9d58"};n.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <strong style="font-size:14px;color:#74c0fc">Audit report</strong>
      <span style="color:#aaa">${e.fixed} fixed \xB7 ${e.renderTime}ms</span>
    </div>
    ${e.details.slice(0,20).map(r=>`
      <div style="padding:6px 0;border-bottom:1px solid #2a2a4a">
        <div style="display:flex;gap:6px;align-items:center">
          <span style="background:${o[r.severity]};color:#fff;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:700;text-transform:uppercase">${r.severity}</span>
          <code style="color:#74c0fc">&lt;${r.tag}&gt;</code>
        </div>
        <div style="color:#ccc;margin-top:3px">${r.fix}</div>
      </div>
    `).join("")}
    ${e.details.length>20?`<div style="color:#888;padding:8px 0;text-align:center">+${e.details.length-20} more issues</div>`:""}
  `,n.addEventListener("keydown",r=>{r.key==="Escape"&&n.remove()}),document.body.appendChild(n),St(n)}function eo(e){typeof document>"u"||(Wt&&clearTimeout(Wt),Wt=setTimeout(()=>{if(vt)return;let t=document.createElement("div");t.setAttribute("role","alertdialog"),t.setAttribute("aria-label","Session timeout warning"),t.setAttribute("aria-modal","true"),t.setAttribute("data-yuktai-timeout","true"),t.style.cssText=`
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
    `;let n=t.querySelector("[data-yuktai-extend]"),o=t.querySelector("[data-yuktai-dismiss]");n?.addEventListener("click",()=>{t.remove(),vt=null,Q("Session extended. You have more time.","success"),Be?.timeoutWarning&&eo(Be.timeoutWarning)}),o?.addEventListener("click",()=>{t.remove(),vt=null}),document.body.appendChild(t),vt=t,St(t),Q("Warning: Your session will expire soon. Do you need more time?","warning")},e*1e3))}function $r(e){if(typeof document>"u")return;let t=document.documentElement;if(t.toggleAttribute("data-yuktai-high-contrast",!!e.highContrast),t.toggleAttribute("data-yuktai-dark",!!e.darkMode),t.toggleAttribute("data-yuktai-reduce-motion",!!e.reduceMotion),t.toggleAttribute("data-yuktai-large-targets",!!e.largeTargets),t.toggleAttribute("data-yuktai-keyboard",!!e.keyboardHints),t.toggleAttribute("data-yuktai-dyslexia",!!e.dyslexiaFont),e.localFont?document.body.style.fontFamily=`"${e.localFont}", system-ui, sans-serif`:e.dyslexiaFont||(document.body.style.fontFamily=""),e.fontSizeMultiplier&&e.fontSizeMultiplier!==1?document.documentElement.style.fontSize=`${e.fontSizeMultiplier*100}%`:document.documentElement.style.fontSize="",e.colorBlindMode&&e.colorBlindMode!=="none"){let n=e.colorBlindMode==="achromatopsia"?"grayscale(100%)":`url(#${wt[e.colorBlindMode]})`;document.body.style.filter=n}else document.body.style.filter=""}function Or(e){try{let t=localStorage.getItem("yuktai-a11y-prefs");t&&Object.assign(e,JSON.parse(t))}catch{}}async function Vn(e){if(e){if(!await Mt()){Q("Plain English requires Chrome 127+","warning");return}Q("Rewriting page in plain English...","info",!1);let n=await Nn();Q(n.error?`Plain English failed: ${n.error}`:`${n.fixed} sections rewritten in plain English`,n.error?"error":"success",!1)}else Mn(),Q("Original text restored","info",!1)}async function Yn(e){if(e){if(!await Pt()){Q("Page summariser requires Chrome 127+","warning");return}Q("Generating page summary...","info",!1);let n=await Fn();Q(n.error?`Summary failed: ${n.error}`:"Page summary added at top",n.error?"error":"success",!1)}else bt(),Q("Page summary removed","info",!1)}async function Xn(e){if(e==="en"){Gt(),Q("Page restored to English","info",!1);return}Q(`Translating page to ${e}...`,"info",!1);let t=await zn(e);Q(t.error?`Translation failed: ${t.error}`:`Page translated to ${e}`,t.error?"error":"success",!1)}async function Kn(e){if(e){if(!Ft()){Q("Voice control not supported in this browser","warning");return}On(t=>{t.success&&Q(`Voice: ${t.action}`,"info",!1)}),Q("Voice control started. Say a command.","success",!1)}else zt(),Q("Voice control stopped","info",!1)}async function Qn(e){if(e){if(!await $t()){Q("Smart labels requires Chrome 127+","warning");return}Q("Generating smart labels...","info",!1);let n=await _n();Q(n.error?`Smart labels failed: ${n.error}`:`${n.fixed} elements labelled`,n.error?"error":"success",!1)}else Bn(),Q("Smart labels removed","info",!1)}function Wr(){if(typeof document>"u"||kt)return;let e=document.createElement("div");e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e.setAttribute("aria-relevant","text"),e.style.cssText="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);",document.body.appendChild(e),kt=e}function Hr(){if(typeof document>"u"||qn)return;let e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("aria-hidden","true"),e.style.cssText="position:absolute;width:0;height:0;overflow:hidden;",e.innerHTML=`
    <defs>
      <filter id="${wt.deuteranopia}">
        <feColorMatrix type="matrix"
          values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${wt.protanopia}">
        <feColorMatrix type="matrix"
          values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${wt.tritanopia}">
        <feColorMatrix type="matrix"
          values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"/>
      </filter>
    </defs>
  `,document.body.appendChild(e),qn=e}function Zn(e){let t={critical:20,serious:10,moderate:5,minor:2},n=e.details.reduce((o,r)=>o+(t[r.severity]||0),0);return Math.max(0,Math.min(100,100-n))}var xe={name:"yuktai-a11y",version:"4.0.0",observer:null,async execute(e){if(!e.enabled)return this.stopObserver(),"yuktai: disabled.";Be=e,Or(e),Wr(),Hr(),Mr(),Pr(),e.showSkipLinks!==!1&&Nr(),e.showPreferencePanel,$r(e);let t=this.applyFixes(e);t.score=Zn(t),e.showAuditBadge&&Fr(t),e.timeoutWarning&&eo(e.timeoutWarning),e.autoFix&&this.startObserver(e),e.plainEnglish&&await Vn(!0),e.summarisePage&&await Yn(!0),e.translateLanguage&&e.translateLanguage!=="en"&&await Xn(e.translateLanguage),e.voiceControl&&await Kn(!0),e.smartLabels&&await Qn(!0);let n=`${t.fixed} fixes applied. Score: ${t.score}/100.`;return Q(n,t.score>=90?"success":"info",!1),`yuktai v4.0.0: ${n} Scanned ${t.scanned} elements in ${t.renderTime}ms.`},applyFixes(e){let t={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return t;let n=performance.now(),o=document.querySelectorAll("*");t.scanned=o.length;let r=(a,i,s,l)=>{t.details.push({tag:a,fix:i,severity:s,element:l.outerHTML.slice(0,100)}),t.fixed++};return o.forEach(a=>{let i=a,s=i.tagName.toLowerCase();if(s==="html"&&!i.getAttribute("lang")&&(i.setAttribute("lang","en"),r(s,'lang="en" added',"critical",i)),s==="meta"){let p=i.getAttribute("name"),g=i.getAttribute("content")||"";p==="viewport"&&g.includes("user-scalable=no")&&(i.setAttribute("content",g.replace("user-scalable=no","user-scalable=yes")),r(s,"user-scalable=yes restored","serious",i)),p==="viewport"&&/maximum-scale=1(?:[^0-9]|$)/.test(g)&&(i.setAttribute("content",g.replace(/maximum-scale=1(?=[^0-9]|$)/,"maximum-scale=5")),r(s,"maximum-scale=5 restored","serious",i))}if(s==="main"&&!i.getAttribute("tabindex")&&(i.setAttribute("tabindex","-1"),i.getAttribute("id")||i.setAttribute("id","main-content")),s==="img"&&(i.hasAttribute("alt")||(i.setAttribute("alt",""),i.setAttribute("aria-hidden","true"),r(s,'alt="" aria-hidden="true"',"serious",i))),s==="svg"&&(!i.getAttribute("aria-hidden")&&!i.getAttribute("aria-label")&&!a.querySelector("title")&&(i.setAttribute("aria-hidden","true"),r(s,'aria-hidden="true" (decorative svg)',"minor",i)),i.getAttribute("focusable")||i.setAttribute("focusable","false")),s==="iframe"&&!i.getAttribute("title")&&!i.getAttribute("aria-label")&&(i.setAttribute("title","embedded content"),i.setAttribute("aria-label","embedded content"),r(s,"title + aria-label added","serious",i)),s==="button"){if(!i.innerText?.trim()&&!i.getAttribute("aria-label")){let p=i.getAttribute("title")||"button";i.setAttribute("aria-label",p),r(s,`aria-label="${p}" (empty button)`,"critical",i)}i.hasAttribute("disabled")&&!i.getAttribute("aria-disabled")&&(i.setAttribute("aria-disabled","true"),t.fixed++)}if(s==="a"){let p=i;!i.innerText?.trim()&&!i.getAttribute("aria-label")&&(i.setAttribute("aria-label",i.getAttribute("title")||"link"),r(s,"aria-label added (empty link)","critical",i)),p.target==="_blank"&&!p.rel?.includes("noopener")&&(p.rel="noopener noreferrer",t.fixed++)}if(jn.has(s)){let p=i;if(!i.getAttribute("aria-label")&&!i.getAttribute("aria-labelledby")){let g=i.getAttribute("placeholder")||i.getAttribute("name")||s;i.setAttribute("aria-label",g),r(s,`aria-label="${g}"`,"serious",i)}if(i.hasAttribute("required")&&!i.getAttribute("aria-required")&&(i.setAttribute("aria-required","true"),t.fixed++),s==="input"&&!p.autocomplete){let g=p.name||"";p.type==="email"||g.includes("email")?p.autocomplete="email":p.type==="tel"||g.includes("tel")?p.autocomplete="tel":p.type==="password"&&(p.autocomplete="current-password"),t.fixed++}}s==="th"&&!i.getAttribute("scope")&&(i.setAttribute("scope",i.closest("thead")?"col":"row"),r(s,"scope added to <th>","moderate",i)),Ht[s]&&!i.getAttribute("role")&&(i.setAttribute("role",Ht[s]),r(s,`role="${Ht[s]}"`,"minor",i));let l=i.getAttribute("role")||"";l==="tab"&&!i.getAttribute("aria-selected")&&(i.setAttribute("aria-selected","false"),t.fixed++),["alert","status","log"].includes(l)&&!i.getAttribute("aria-live")&&(i.setAttribute("aria-live",l==="alert"?"assertive":"polite"),r(s,`aria-live added on role=${l}`,"moderate",i)),l==="combobox"&&!i.getAttribute("aria-expanded")&&(i.setAttribute("aria-expanded","false"),r(s,'aria-expanded="false" on combobox',"serious",i)),(l==="checkbox"||l==="radio")&&!i.getAttribute("aria-checked")&&(i.setAttribute("aria-checked","false"),r(s,`aria-checked="false" on role=${l}`,"serious",i))}),t.renderTime=parseFloat((performance.now()-n).toFixed(2)),t},scan(){let e={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return e;let t=performance.now(),n=document.querySelectorAll("*");e.scanned=n.length;let o=(r,a,i,s)=>e.details.push({tag:r,fix:a,severity:i,element:s.outerHTML.slice(0,100)});return n.forEach(r=>{let a=r,i=a.tagName.toLowerCase();(i==="a"||i==="button")&&!a.innerText?.trim()&&!a.getAttribute("aria-label")&&o(i,"needs aria-label (empty)","critical",a),i==="img"&&!a.hasAttribute("alt")&&o(i,"needs alt text","serious",a),jn.has(i)&&!a.getAttribute("aria-label")&&!a.getAttribute("aria-labelledby")&&o(i,"needs aria-label","serious",a),i==="iframe"&&!a.getAttribute("title")&&!a.getAttribute("aria-label")&&o(i,"iframe needs title","serious",a)}),e.fixed=e.details.length,e.score=Zn(e),e.renderTime=parseFloat((performance.now()-t).toFixed(2)),e},startObserver(e){this.observer||typeof document>"u"||(this.observer=new MutationObserver(()=>this.applyFixes(e)),this.observer.observe(document.body,{childList:!0,subtree:!0,attributes:!1}))},stopObserver(){this.observer?.disconnect(),this.observer=null},announce:Q,speak:Dt,showVisualAlert:Jn,trapFocus:St,handlePlainEnglish:Vn,handleSummarisePage:Yn,handleTranslate:Xn,handleVoiceControl:Kn,handleSmartLabels:Qn,SUPPORTED_LANGUAGES:yt};h();h();var W=Nt(require("react"));h();var ge=require("react");Bt();nt();var c=require("react/jsx-runtime"),Vt={highContrast:!1,reduceMotion:!1,autoFix:!0,dyslexiaFont:!1,fontScale:100,localFont:"",darkMode:!1,largeTargets:!1,speechEnabled:!1,colorBlindMode:"none",showAuditBadge:!1,timeoutWarning:void 0,plainEnglish:!1,summarisePage:!1,translateLanguage:"en",voiceControl:!1,smartLabels:!1},Ue=[80,90,100,110,120,130],Kr=[{value:"none",label:"None"},{value:"deuteranopia",label:"Deuteranopia"},{value:"protanopia",label:"Protanopia"},{value:"tritanopia",label:"Tritanopia"},{value:"achromatopsia",label:"Greyscale"}],Qr=["Prompt API for Gemini Nano","Summarization API for Gemini Nano","Writer API for Gemini Nano","Rewriter API for Gemini Nano","Translation API"];function Zr(){let[e,t]=(0,ge.useState)(typeof window<"u"?window.innerWidth:1024);return(0,ge.useEffect)(()=>{let n=()=>t(window.innerWidth);return window.addEventListener("resize",n),()=>window.removeEventListener("resize",n)},[]),{isMobile:e<=480,isTablet:e>480&&e<=768}}function Jr({checked:e,onChange:t,label:n,disabled:o=!1}){return(0,c.jsxs)("label",{"aria-label":n,style:{position:"relative",display:"inline-flex",width:"40px",height:"24px",cursor:o?"not-allowed":"pointer",flexShrink:0,opacity:o?.4:1},children:[(0,c.jsx)("input",{type:"checkbox",checked:e,disabled:o,onChange:r=>t(r.target.checked),style:{opacity:0,width:0,height:0,position:"absolute"}}),(0,c.jsx)("span",{style:{position:"absolute",inset:0,borderRadius:"99px",background:e?"#0d9488":"#cbd5e1",transition:"background 0.2s"}}),(0,c.jsx)("span",{style:{position:"absolute",top:"3px",left:e?"19px":"3px",width:"18px",height:"18px",background:"#fff",borderRadius:"50%",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)",pointerEvents:"none"}})]})}function je({label:e,color:t="#64748b",badge:n,concept:o}){return(0,c.jsxs)("div",{style:{margin:"10px 18px 4px"},children:[(0,c.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[(0,c.jsx)("p",{style:{margin:0,fontSize:"10px",fontWeight:600,color:t,letterSpacing:"0.06em",textTransform:"uppercase"},children:e}),n&&(0,c.jsx)("span",{style:{fontSize:"9px",fontWeight:500,padding:"1px 7px",borderRadius:"99px",background:"#f5f3ff",color:"#7c3aed",border:"0.5px solid #c4b5fd",whiteSpace:"nowrap"},children:n})]}),o&&(0,c.jsx)("p",{style:{margin:"2px 0 0",fontSize:"9px",color:"#94a3b8",fontStyle:"italic"},children:o})]})}function ke({icon:e,label:t,desc:n,checked:o,onChange:r,disabled:a=!1,disabledReason:i,tip:s}){return(0,c.jsxs)("div",{title:a?i:s,style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 18px",gap:"12px"},children:[(0,c.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"10px",flex:1,minWidth:0},children:[(0,c.jsx)("span",{"aria-hidden":"true",style:{width:"32px",height:"32px",borderRadius:"8px",background:a?"#f1f5f9":"#f0fdfa",color:a?"#94a3b8":"#0d9488",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"15px",flexShrink:0,fontWeight:700},children:e}),(0,c.jsxs)("div",{style:{minWidth:0},children:[(0,c.jsx)("p",{style:{margin:0,fontSize:"13px",fontWeight:500,color:a?"#94a3b8":"#0f172a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:t}),(0,c.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#94a3b8"},children:a?i:n})]})]}),(0,c.jsx)(Jr,{checked:o,onChange:r,label:`Toggle ${t}`,disabled:a})]})}function fe(){return(0,c.jsx)("div",{style:{height:"1px",background:"#f1f5f9"}})}function ot({steps:e}){return(0,c.jsxs)("div",{style:{margin:"0 18px 8px",padding:"8px 10px",background:"#f8fafc",borderRadius:"8px",border:"0.5px solid #e2e8f0"},children:[(0,c.jsx)("p",{style:{margin:"0 0 4px",fontSize:"9px",fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.05em"},children:"How to use"}),e.map((t,n)=>(0,c.jsxs)("p",{style:{margin:"0 0 2px",fontSize:"10px",color:"#475569"},children:[n+1,". ",t]},n))]})}var Yt=(0,ge.forwardRef)(({position:e,settings:t,report:n,isActive:o,aiSupported:r,voiceSupported:a,set:i,onApply:s,onReset:l,onClose:p},g)=>{let{isMobile:y,isTablet:M}=Zr(),[_,z]=(0,ge.useState)([]),[L,A]=(0,ge.useState)(""),[H,v]=(0,ge.useState)(""),[E,N]=(0,ge.useState)(!1),[x,$]=(0,ge.useState)(null),[S,D]=(0,ge.useState)("idle");(0,ge.useEffect)(()=>{let d=window;!!(d.LanguageModel||d.ai?.languageModel)&&r?$("gemini"):et()&&$("transformers")},[r]),(0,ge.useEffect)(()=>{if(x!=="transformers")return;let d=setInterval(()=>{D(tt())},500);return()=>clearInterval(d)},[x]);let le=async()=>{if(!(!L.trim()||E)){if(!x){v("\u26A0\uFE0F No AI engine available on this device.");return}N(!0),v("");try{let d;x==="gemini"?d=await _t(L):(D("loading"),d=await Ut(L),D("ready")),v(d.success&&d.answer?d.answer.replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/#+\s/g,"").trim():"\u26A0\uFE0F "+(d.error||"No answer found on this page"))}catch{v("\u26A0\uFE0F Failed to get answer. Please try again.")}N(!1)}};(0,ge.useEffect)(()=>{(async()=>{try{let ee=window;if(!ee.queryLocalFonts)return;let q=await ee.queryLocalFonts(),j=[...new Set(q.map(te=>te.family))].sort();z(j.slice(0,50))}catch{}})()},[]);let V=x==="gemini"?"Gemini Nano":x==="transformers"?"Transformers.js \xB7 All devices":"Detecting...",J=x==="transformers"&&S==="loading"?"Loading AI model... (first time only)":"...",T=y?{position:"fixed",bottom:0,left:0,right:0,zIndex:9999,background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px 16px 0 0",boxShadow:"0 -8px 32px rgba(0,0,0,0.12)",maxHeight:"90vh",overflowY:"auto",fontFamily:"system-ui,-apple-system,sans-serif",width:"100%"}:{position:"fixed",bottom:"84px",[e]:"24px",zIndex:9999,width:M?"300px":"320px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",maxHeight:"80vh",overflowY:"auto",fontFamily:"system-ui,-apple-system,sans-serif"};return(0,c.jsxs)("div",{ref:g,role:"dialog","aria-modal":"true","aria-label":"yuktai accessibility preferences","data-yuktai-panel":"true",style:T,children:[(0,c.jsxs)("div",{style:{padding:"14px 18px 12px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"flex-start",justifyContent:"space-between",position:"sticky",top:0,background:"#fff",zIndex:1},children:[(0,c.jsxs)("div",{children:[(0,c.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"7px",marginBottom:"4px",flexWrap:"wrap"},children:[(0,c.jsx)("span",{style:{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0d9488",letterSpacing:"0.05em",fontFamily:"monospace"},children:"@yuktishaalaa/yuktai"}),o&&(0,c.jsx)("span",{style:{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0f766e",border:"1px solid #99f6e4"},children:"\u25CF ACTIVE"})]}),(0,c.jsx)("p",{style:{margin:"0 0 1px",fontSize:"15px",fontWeight:600,color:"#0f172a"},children:"Accessibility"}),(0,c.jsx)("p",{style:{margin:0,fontSize:"11px",color:"#64748b"},children:"WCAG 2.2 \xB7 Open source \xB7 Zero cost \xB7 All devices"})]}),(0,c.jsx)("button",{onClick:p,"aria-label":"Close accessibility panel",style:{background:"none",border:"none",cursor:"pointer",padding:"4px",color:"#94a3b8",fontSize:"20px",lineHeight:1,borderRadius:"6px",flexShrink:0,minWidth:y?"44px":"auto",minHeight:y?"44px":"auto",display:"flex",alignItems:"center",justifyContent:"center"},children:"\xD7"})]}),(0,c.jsx)(je,{label:"\u267F Core Accessibility",concept:"Rule-based engine \u2014 works on all browsers and devices"}),(0,c.jsx)(ot,{steps:["Toggle any feature on","Click Apply settings","Preferences saved automatically"]}),(0,c.jsx)(ke,{icon:"\u{1F527}",label:"Auto-fix ARIA",desc:"Injects missing labels and roles automatically",checked:t.autoFix,onChange:d=>i("autoFix",d),tip:"Fixes aria-label, alt text, roles on every element"}),(0,c.jsx)(fe,{}),(0,c.jsx)(ke,{icon:"\u{1F50A}",label:"Speak on focus",desc:"Browser reads elements aloud as you tab",checked:t.speechEnabled,onChange:d=>i("speechEnabled",d),tip:"Uses browser SpeechSynthesis \u2014 no install needed"}),(0,c.jsx)(fe,{}),(0,c.jsx)(ke,{icon:"\u{1F399}\uFE0F",label:"Voice control",desc:"Say commands to navigate the page",checked:t.voiceControl,onChange:d=>i("voiceControl",d),disabled:!a,disabledReason:"Not supported in this browser",tip:'Say "scroll down", "go to main", "click"'}),(0,c.jsx)(fe,{}),(0,c.jsx)(je,{label:"\u{1F916} AI Features",color:"#7c3aed",badge:"Gemini Nano",concept:"Large Language Model running privately on your device \u2014 Chrome 127+ only"}),(0,c.jsx)("div",{style:{margin:"4px 18px 6px",padding:"8px 10px",background:r?"#f0fdfa":"#f5f3ff",borderRadius:"8px",border:`0.5px solid ${r?"#99f6e4":"#c4b5fd"}`,fontSize:"10px",color:r?"#0f766e":"#7c3aed",lineHeight:1.5},children:r?"\u2705 Gemini Nano detected \u2014 AI features ready. Runs privately on your device.":"\u2699\uFE0F AI features need one-time setup \u2014 see guide below."}),!r&&(0,c.jsxs)("div",{style:{margin:"0 18px 8px",padding:"10px 12px",background:"#fafafa",borderRadius:"8px",border:"0.5px solid #e2e8f0",fontSize:"11px",color:"#475569",lineHeight:1.7},children:[(0,c.jsx)("p",{style:{margin:"0 0 6px",fontWeight:600,color:"#0f172a",fontSize:"11px"},children:"\u{1F6E0} One-time setup \u2014 5 steps:"}),(0,c.jsxs)("p",{style:{margin:"0 0 3px"},children:["1. Open Chrome \u2192 ",(0,c.jsx)("code",{style:{background:"#f1f5f9",padding:"1px 5px",borderRadius:"4px",fontSize:"10px",color:"#0d9488",fontFamily:"monospace"},children:"chrome://flags"})]}),(0,c.jsx)("p",{style:{margin:"0 0 3px"},children:"2. Enable each flag:"}),(0,c.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"2px",margin:"4px 0 6px 10px"},children:Qr.map(d=>(0,c.jsxs)("span",{style:{fontSize:"10px",color:"#7c3aed",fontFamily:"monospace"},children:["\u2192 ",d]},d))}),(0,c.jsxs)("p",{style:{margin:"0 0 3px"},children:["3. Click ",(0,c.jsx)("strong",{style:{color:"#0f172a"},children:"Relaunch"})]}),(0,c.jsxs)("p",{style:{margin:"0 0 3px"},children:["4. ",(0,c.jsx)("code",{style:{background:"#f1f5f9",padding:"1px 5px",borderRadius:"4px",fontSize:"10px",color:"#0d9488",fontFamily:"monospace"},children:"chrome://components"})," \u2192 Optimization Guide On Device Model \u2192 Check for update"]}),(0,c.jsx)("p",{style:{margin:"0"},children:"5. Refresh \u2014 AI features unlock automatically \u2705"})]}),(0,c.jsx)(ke,{icon:"\u{1F4DD}",label:"Plain English mode",desc:"Rewrites complex text in simple language",checked:t.plainEnglish,onChange:d=>i("plainEnglish",d),disabled:!r,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: LLM text rewriting"}),(0,c.jsx)(fe,{}),(0,c.jsx)(ke,{icon:"\u{1F4CB}",label:"Summarise page",desc:"3-sentence summary appears at top",checked:t.summarisePage,onChange:d=>i("summarisePage",d),disabled:!r,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: Abstractive summarisation"}),(0,c.jsx)(fe,{}),(0,c.jsx)(ke,{icon:"\u{1F3F7}\uFE0F",label:"Smart aria-labels",desc:"AI generates meaningful labels for elements",checked:t.smartLabels,onChange:d=>i("smartLabels",d),disabled:!r,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: Context-aware label generation"}),(0,c.jsx)(fe,{}),(0,c.jsx)(je,{label:"\u{1F441}\uFE0F Visual",concept:"CSS filter-based \u2014 works on all browsers and devices"}),(0,c.jsx)(ot,{steps:["Toggle any visual mode","Changes apply instantly","Works on mobile and desktop"]}),(0,c.jsx)(ke,{icon:"\u25D1",label:"High contrast",desc:"Boosts contrast for low vision users",checked:t.highContrast,onChange:d=>i("highContrast",d),tip:"CSS filter: contrast()"}),(0,c.jsx)(fe,{}),(0,c.jsx)(ke,{icon:"\u{1F319}",label:"Dark mode",desc:"Inverts colours \u2014 easy on eyes at night",checked:t.darkMode,onChange:d=>i("darkMode",d),tip:"CSS filter: invert + hue-rotate"}),(0,c.jsx)(fe,{}),(0,c.jsx)(ke,{icon:"\u23F8\uFE0F",label:"Reduce motion",desc:"Disables all animations",checked:t.reduceMotion,onChange:d=>i("reduceMotion",d),tip:"WCAG 2.3.3 \u2014 vestibular disorders"}),(0,c.jsx)(fe,{}),(0,c.jsx)(ke,{icon:"\u{1F446}",label:"Large targets",desc:"44\xD744px minimum touch targets",checked:t.largeTargets,onChange:d=>i("largeTargets",d),tip:"WCAG 2.5.8 \u2014 motor impaired users"}),(0,c.jsx)(fe,{}),(0,c.jsxs)("div",{style:{padding:"10px 18px"},children:[(0,c.jsx)("p",{style:{margin:"0 0 2px",fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F3A8} Colour blindness"}),(0,c.jsx)("p",{style:{margin:"0 0 8px",fontSize:"10px",color:"#94a3b8"},children:"SVG colour matrix filters \u2014 all devices"}),(0,c.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"},children:Kr.map(d=>(0,c.jsx)("button",{onClick:()=>i("colorBlindMode",d.value),"aria-pressed":t.colorBlindMode===d.value,style:{padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500,border:`1px solid ${t.colorBlindMode===d.value?"#0d9488":"#e2e8f0"}`,background:t.colorBlindMode===d.value?"#f0fdfa":"#fff",color:t.colorBlindMode===d.value?"#0d9488":"#64748b",cursor:"pointer",minHeight:y?"36px":"auto"},children:d.label},d.value))})]}),(0,c.jsx)(fe,{}),(0,c.jsx)(je,{label:"\u{1F524} Font",concept:"Browser Font API + CSS \u2014 Chrome 103+"}),(0,c.jsx)(ot,{steps:["Toggle dyslexia font or pick from device","Adjust size with + / \u2212","Saved across visits"]}),(0,c.jsx)(ke,{icon:"Aa",label:"Dyslexia-friendly font",desc:"Atkinson Hyperlegible \u2014 research-backed",checked:t.dyslexiaFont,onChange:d=>i("dyslexiaFont",d),tip:"By Braille Institute \u2014 free and open source"}),(0,c.jsx)(fe,{}),(0,c.jsxs)("div",{style:{padding:"10px 18px"},children:[(0,c.jsx)("p",{style:{margin:"0 0 2px",fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F5A5}\uFE0F Local font"}),(0,c.jsx)("p",{style:{margin:"0 0 8px",fontSize:"10px",color:"#94a3b8"},children:"window.queryLocalFonts() \u2014 Chrome 103+"}),_.length>0?(0,c.jsxs)("select",{value:t.localFont,onChange:d=>i("localFont",d.target.value),"aria-label":"Choose a font from your device",style:{width:"100%",padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"13px",color:"#0f172a",background:"#fff",cursor:"pointer",height:y?"44px":"36px"},children:[(0,c.jsx)("option",{value:"",children:"System default"}),_.map(d=>(0,c.jsx)("option",{value:d,style:{fontFamily:d},children:d},d))]}):(0,c.jsx)("p",{style:{margin:0,fontSize:"11px",color:"#94a3b8"},children:"Allow font access when Chrome prompts you."})]}),(0,c.jsx)(fe,{}),(0,c.jsxs)("div",{style:{padding:"10px 18px 14px"},children:[(0,c.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"10px"},children:[(0,c.jsxs)("div",{children:[(0,c.jsx)("p",{style:{margin:0,fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F4CF} Text size"}),(0,c.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#94a3b8"},children:"Scales all text on the page"})]}),(0,c.jsxs)("span",{style:{fontSize:"12px",fontWeight:600,color:"#0d9488",background:"#f0fdfa",padding:"2px 8px",borderRadius:"99px"},children:[t.fontScale,"%"]})]}),(0,c.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[(0,c.jsx)("button",{onClick:()=>{let d=Ue.indexOf(t.fontScale);d>0&&i("fontScale",Ue[d-1])},disabled:t.fontScale<=80,"aria-label":"Decrease text size",style:{width:y?"44px":"30px",height:y?"44px":"30px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:t.fontScale<=80?"not-allowed":"pointer",fontSize:"16px",color:t.fontScale<=80?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"\u2212"}),(0,c.jsx)("div",{style:{flex:1,display:"flex",gap:"3px"},children:Ue.map(d=>(0,c.jsx)("button",{onClick:()=>i("fontScale",d),"aria-label":`Set text size to ${d}%`,style:{flex:1,height:"6px",borderRadius:"99px",border:"none",cursor:"pointer",padding:0,background:d<=t.fontScale?"#0d9488":"#e2e8f0",transition:"background 0.15s"}},d))}),(0,c.jsx)("button",{onClick:()=>{let d=Ue.indexOf(t.fontScale);d<Ue.length-1&&i("fontScale",Ue[d+1])},disabled:t.fontScale>=130,"aria-label":"Increase text size",style:{width:y?"44px":"30px",height:y?"44px":"30px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:t.fontScale>=130?"not-allowed":"pointer",fontSize:"16px",color:t.fontScale>=130?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"+"})]})]}),(0,c.jsx)(fe,{}),(0,c.jsx)(je,{label:"\u{1F310} Translate",color:"#7c3aed",badge:"Gemini Nano",concept:"Chrome Translation API \u2014 on device, no internet after setup"}),(0,c.jsx)(ot,{steps:["Enable Gemini Nano first","Pick your language","Full page translates instantly"]}),(0,c.jsxs)("div",{style:{padding:"6px 18px 12px"},children:[(0,c.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"},children:yt.slice(0,y?8:18).map(d=>(0,c.jsx)("button",{onClick:()=>i("translateLanguage",d.code),"aria-pressed":t.translateLanguage===d.code,disabled:!r,style:{padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500,border:`1px solid ${t.translateLanguage===d.code?"#7c3aed":"#e2e8f0"}`,background:t.translateLanguage===d.code?"#f5f3ff":"#fff",color:t.translateLanguage===d.code?"#7c3aed":"#64748b",cursor:r?"pointer":"not-allowed",opacity:r?1:.5,minHeight:y?"36px":"auto"},children:d.label},d.code))}),!r&&(0,c.jsx)("p",{style:{margin:"6px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Enable Gemini Nano using the setup guide above."})]}),(0,c.jsx)(fe,{}),(0,c.jsx)(je,{label:"\u{1F4AC} Ask This Page",color:"#0d9488",badge:V,concept:"RAG \u2014 Retrieval Augmented Generation. Works on all devices including mobile."}),(0,c.jsx)(ot,{steps:["Type any question about this page","Press Ask or hit Enter",x==="transformers"?"Transformers.js answers \u2014 works on mobile, offline":"Gemini Nano reads page and answers privately","Zero cost. No data leaves your device."]}),(0,c.jsxs)("div",{style:{margin:"0 18px 8px",padding:"6px 10px",background:x==="gemini"?"#f0fdfa":x==="transformers"?"#f5f3ff":"#f8fafc",borderRadius:"8px",border:`0.5px solid ${x==="gemini"?"#99f6e4":x==="transformers"?"#c4b5fd":"#e2e8f0"}`,fontSize:"10px",color:x==="gemini"?"#0f766e":x==="transformers"?"#7c3aed":"#94a3b8"},children:[x==="gemini"&&"\u2705 Using Gemini Nano \u2014 on device, private, instant",x==="transformers"&&"\u2705 Using Transformers.js \u2014 works on mobile and all browsers",!x&&"\u23F3 Detecting AI engine...",x==="transformers"&&S==="loading"&&" \xB7 Loading model...",x==="transformers"&&S==="ready"&&" \xB7 Model ready \u2705"]}),(0,c.jsxs)("div",{style:{padding:"0 18px 14px"},children:[(0,c.jsxs)("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[(0,c.jsx)("input",{type:"text",value:L,onChange:d=>A(d.target.value),onKeyDown:d=>{d.key==="Enter"&&le()},placeholder:"e.g. What does this page do?",disabled:E||!x,"aria-label":"Ask a question about this page",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:x?"#fff":"#f8fafc",outline:"none",height:y?"44px":"36px"}}),(0,c.jsx)("button",{onClick:le,disabled:E||!L.trim()||!x,"aria-label":"Ask question",style:{padding:"8px 14px",borderRadius:"8px",border:"none",background:x&&L.trim()&&!E?"#0d9488":"#e2e8f0",color:x&&L.trim()&&!E?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:x&&L.trim()&&!E?"pointer":"not-allowed",flexShrink:0,height:y?"44px":"36px",minWidth:"52px",transition:"background 0.2s"},children:E?J:"Ask"})]}),H&&(0,c.jsxs)("div",{role:"status","aria-live":"polite",style:{padding:"10px 12px",background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"8px",fontSize:"12px",color:"#0f766e",lineHeight:1.6,maxHeight:"180px",overflowY:"auto"},children:[(0,c.jsx)("strong",{style:{display:"block",marginBottom:"4px",fontSize:"11px",color:"#0d9488"},children:"\u{1F4AC} Answer"}),H,(0,c.jsx)("button",{onClick:()=>{v(""),A("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]})]}),n&&(0,c.jsx)("div",{role:"status",style:{margin:"0 14px 10px",padding:"8px 12px",background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"8px",fontSize:"12px",color:"#0f766e",fontWeight:500,fontFamily:"monospace"},children:n.fixed>0?`\u2713 ${n.fixed} fixes \xB7 ${n.scanned} nodes \xB7 ${n.renderTime}ms \xB7 Score: ${n.score}/100`:`\u2713 0 auto-fixes needed \xB7 ${n.scanned} nodes \xB7 ${n.renderTime}ms`}),(0,c.jsxs)("div",{style:{display:"flex",gap:"8px",padding:"12px 14px 14px",position:y?"sticky":"relative",bottom:y?0:"auto",background:"#fff",borderTop:"1px solid #f1f5f9"},children:[(0,c.jsx)("button",{onClick:l,style:{flex:1,padding:y?"12px 0":"8px 0",fontSize:"13px",fontWeight:500,borderRadius:"9px",border:"1px solid #e2e8f0",background:"#fff",color:"#64748b",cursor:"pointer"},children:"Reset"}),(0,c.jsx)("button",{onClick:s,style:{flex:2,padding:y?"12px 0":"8px 0",fontSize:"13px",fontWeight:600,borderRadius:"9px",border:"none",background:"#0d9488",color:"#fff",cursor:"pointer"},children:"Apply settings"})]})]})});Yt.displayName="WidgetPanel";nt();h();var Ie=require("react");h();var ei={hotel:["hotel","resort","motel","inn","accommodation","lodge","stay","room","booking","hospitality"],ecommerce:["shop","store","ecommerce","e-commerce","sell","product","cart","buy","marketplace","retail"],restaurant:["restaurant","food","cafe","cafeteria","menu","dining","eat","cuisine","bistro","takeaway","delivery"],portfolio:["portfolio","freelance","personal","designer","developer","creative","showcase","work","hire me"],blog:["blog","article","post","write","news","magazine","journal","content"],saas:["saas","dashboard","app","software","platform","tool","analytics","admin","manage","crm"],government:["government","govt","portal","citizen","scheme","welfare","municipal","public","official"],healthcare:["hospital","clinic","doctor","health","medical","patient","appointment","pharmacy"],education:["school","college","university","course","learn","education","student","lms","training"],realestate:["real estate","property","house","flat","apartment","rent","buy property","listing"],landing:["landing","startup","launch","product launch","coming soon","waitlist"],generic:[]},ti={hotel:["home","rooms","booking","about","contact"],ecommerce:["home","products","cart","checkout","about","contact"],restaurant:["home","menu","reservations","about","contact"],portfolio:["home","portfolio","about","contact"],blog:["home","blog","about","contact"],saas:["home","pricing","dashboard","auth","about","contact"],government:["home","services","about","contact","faq"],healthcare:["home","services","booking","team","about","contact"],education:["home","services","pricing","about","contact"],realestate:["home","products","about","contact"],landing:["home","pricing","about","contact"],generic:["home","about","services","contact"]},ni={home:["home","homepage","main","landing"],about:["about","who we are","our story","company"],contact:["contact","reach us","get in touch","location"],services:["service","what we offer","solution","offering"],pricing:["pricing","price","plan","subscription","cost","fee"],blog:["blog","article","news","post"],auth:["login","register","signup","sign up","sign in","auth","account"],dashboard:["dashboard","admin","panel","manage","analytics"],gallery:["gallery","photo","image","portfolio"],products:["product","shop","store","item","catalogue"],cart:["cart","basket","shopping cart"],checkout:["checkout","payment","pay","order"],rooms:["room","suite","accommodation","stay"],booking:["booking","reserve","reservation","schedule","appointment"],menu:["menu","food","dish","cuisine"],reservations:["reservation","table booking","book table"],portfolio:["portfolio","work","project","case study"],team:["team","staff","member","people","who we are"],faq:["faq","question","answer","help","support"],terms:["terms","condition","legal"],privacy:["privacy","policy","gdpr","data"]},oi={Authentication:["login","register","auth","signup","sign in","account"],Payment:["payment","stripe","pay","checkout","billing"],Search:["search","filter","find"],"Dark mode":["dark mode","dark theme","night mode"],"Multi-language":["multilingual","multi language","translation","i18n"],SEO:["seo","search engine","meta","google"],Analytics:["analytics","tracking","stats","dashboard"],Email:["email","newsletter","contact form","notification"],Map:["map","location","address","google maps"],"Social media":["social","instagram","facebook","twitter","share"],"Image gallery":["gallery","photo","image","carousel"],"Booking system":["booking","reservation","appointment","schedule"],"Shopping cart":["cart","basket","shop","ecommerce"],"Blog/CMS":["blog","cms","content","article","post"]},ri={blue:["blue","navy","sky","ocean","corporate"],green:["green","nature","eco","environment","health","fresh"],purple:["purple","violet","luxury","creative","royal"],red:["red","bold","energy","passion","food"],orange:["orange","warm","friendly","fun"],teal:["teal","turquoise","modern","tech"],indigo:["indigo","professional","trust","finance","bank"],gray:["gray","minimal","clean","simple","neutral"]},ii={hotel:"indigo",ecommerce:"blue",restaurant:"red",portfolio:"purple",blog:"gray",saas:"teal",government:"blue",healthcare:"green",education:"indigo",realestate:"orange",landing:"purple",generic:"blue"};function ai(e){let t=[/(?:for|called|named|company|business|brand)\s+["']?([A-Z][a-zA-Z\s]{1,30})["']?/i,/["']([A-Z][a-zA-Z\s]{1,30})["']/,/^([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)?)/m];for(let n of t){let o=e.match(n);if(o?.[1]){let r=o[1].trim();if(r.length>2&&r.length<40)return r}}return"My Business"}function si(e){let t=e.toLowerCase(),n="generic",o=0;for(let[r,a]of Object.entries(ei)){let i=0;for(let s of a)t.includes(s)&&i++;i>o&&(o=i,n=r)}return n}function li(e,t){let n=e.toLowerCase(),o=new Set(ti[t]);for(let[r,a]of Object.entries(ni))for(let i of a)if(n.includes(i)){o.add(r);break}return o.add("home"),o.add("contact"),Array.from(o)}function ci(e){let t=e.toLowerCase(),n=[];for(let[o,r]of Object.entries(oi))for(let a of r)if(t.includes(a)){n.push(o);break}return n}function di(e,t){let n=e.toLowerCase();for(let[o,r]of Object.entries(ri))for(let a of r)if(n.includes(a))return o;return ii[t]}function ao(e){let t=si(e),n=li(e,t),o=ci(e),r=di(e,t);return{siteName:ai(e),websiteType:t,pages:n,features:o,theme:r,description:e.slice(0,200)}}var k=require("react/jsx-runtime"),gi=["Hotel booking website for Grand Palace Hotels with rooms, booking and payment","E-commerce store for organic food products with cart and checkout","Restaurant website for Spice Garden with menu and table reservations","Portfolio website for a freelance designer with gallery and contact","SaaS dashboard for project management with pricing and auth","Government portal for citizen services with FAQ and contact"],mi={home:"\u{1F3E0}",about:"\u2139\uFE0F",contact:"\u{1F4EC}",services:"\u2699\uFE0F",pricing:"\u{1F4B0}",blog:"\u{1F4DD}",auth:"\u{1F510}",dashboard:"\u{1F4CA}",gallery:"\u{1F5BC}\uFE0F",products:"\u{1F6D2}",cart:"\u{1F6CD}\uFE0F",checkout:"\u{1F4B3}",rooms:"\u{1F6CF}\uFE0F",booking:"\u{1F4C5}",menu:"\u{1F37D}\uFE0F",reservations:"\u{1FA91}",portfolio:"\u{1F4BC}",team:"\u{1F465}",faq:"\u2753",terms:"\u{1F4C4}",privacy:"\u{1F512}"},bi={hotel:"\u{1F3E8}",ecommerce:"\u{1F6D2}",restaurant:"\u{1F37D}\uFE0F",portfolio:"\u{1F4BC}",blog:"\u{1F4DD}",saas:"\u26A1",government:"\u{1F3DB}\uFE0F",healthcare:"\u{1F3E5}",education:"\u{1F393}",realestate:"\u{1F3E0}",landing:"\u{1F680}",generic:"\u{1F310}"};function Kt({position:e,onClose:t}){let[n,o]=(0,Ie.useState)("input"),[r,a]=(0,Ie.useState)(""),[i,s]=(0,Ie.useState)(null),[l,p]=(0,Ie.useState)(0),[g,y]=(0,Ie.useState)(""),M=(0,Ie.useCallback)(()=>{if(!r.trim())return;let A=ao(r);s(A),o("preview")},[r]),_=(0,Ie.useCallback)(async()=>{if(i){o("generating"),p(0),y("");try{let A=[{msg:"Parsing requirement...",pct:15},{msg:"Loading templates...",pct:30},{msg:"Generating pages...",pct:55},{msg:"Building components...",pct:70},{msg:"Creating styles...",pct:85},{msg:"Packaging ZIP...",pct:95}];for(let v of A)p(v.pct),await new Promise(E=>setTimeout(E,200));let{generateZip:H}=await Promise.resolve().then(()=>(Fo(),Go));await H(i),p(100),o("done")}catch(A){y(A instanceof Error?A.message:"Generation failed. Please try again."),o("preview")}}},[i]),z=()=>{o("input"),a(""),s(null),p(0),y("")},L={position:"fixed",bottom:"204px",[e]:"24px",zIndex:9999,width:"340px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.14)",fontFamily:"system-ui,-apple-system,sans-serif",maxHeight:"75vh",overflowY:"auto"};return(0,k.jsxs)("div",{role:"dialog","aria-modal":"true","aria-label":"yuktai Vibe Coder","data-yuktai-panel":"true",style:L,children:[(0,k.jsxs)("div",{style:{padding:"14px 16px 12px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"flex-start",justifyContent:"space-between",position:"sticky",top:0,background:"#fff",zIndex:1},children:[(0,k.jsxs)("div",{children:[(0,k.jsx)("p",{style:{margin:"0 0 2px",fontSize:"13px",fontWeight:700,color:"#0f172a"},children:"\u26A1 Vibe Coder"}),(0,k.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#64748b"},children:"Describe your website \u2192 Download Next.js ZIP"})]}),(0,k.jsx)("button",{onClick:t,"aria-label":"Close vibe coder",style:{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"18px",padding:"2px"},children:"\xD7"})]}),n==="input"&&(0,k.jsxs)("div",{style:{padding:"14px 16px"},children:[(0,k.jsx)("p",{style:{margin:"0 0 10px",fontSize:"11px",color:"#64748b"},children:"Describe your business website in plain English. The plugin will generate a complete Next.js project for you."}),(0,k.jsx)("p",{style:{margin:"0 0 6px",fontSize:"10px",fontWeight:600,color:"#94a3b8",textTransform:"uppercase"},children:"Examples"}),(0,k.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"4px",marginBottom:"12px"},children:gi.slice(0,3).map(A=>(0,k.jsx)("button",{onClick:()=>a(A),style:{padding:"6px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#f8fafc",color:"#475569",fontSize:"10px",cursor:"pointer",textAlign:"left",lineHeight:1.4},children:A},A))}),(0,k.jsx)("textarea",{value:r,onChange:A=>a(A.target.value),placeholder:"e.g. I need a hotel booking website with rooms, search, and payment for Grand Palace Hotels",rows:4,"aria-label":"Describe your website",style:{width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.5}}),(0,k.jsx)("button",{onClick:M,disabled:!r.trim(),style:{width:"100%",marginTop:"10px",padding:"10px",borderRadius:"8px",border:"none",background:r.trim()?"#f59e0b":"#e2e8f0",color:r.trim()?"#fff":"#94a3b8",fontSize:"13px",fontWeight:700,cursor:r.trim()?"pointer":"not-allowed",transition:"background 0.2s"},children:"Analyse Requirement \u2192"})]}),n==="preview"&&i&&(0,k.jsxs)("div",{style:{padding:"14px 16px"},children:[g&&(0,k.jsxs)("div",{style:{padding:"10px",background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:"8px",marginBottom:"12px",fontSize:"11px",color:"#dc2626"},children:["\u26A0\uFE0F ",g]}),(0,k.jsxs)("div",{style:{background:"#f8fafc",borderRadius:"10px",padding:"12px",marginBottom:"12px"},children:[(0,k.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"},children:[(0,k.jsx)("span",{style:{fontSize:"1.5rem"},children:bi[i.websiteType]||"\u{1F310}"}),(0,k.jsxs)("div",{children:[(0,k.jsx)("p",{style:{margin:0,fontSize:"13px",fontWeight:700,color:"#0f172a"},children:i.siteName}),(0,k.jsxs)("p",{style:{margin:0,fontSize:"10px",color:"#64748b",textTransform:"capitalize"},children:[i.websiteType," website \xB7 ",i.theme," theme"]})]})]}),(0,k.jsxs)("p",{style:{margin:"8px 0 6px",fontSize:"10px",fontWeight:600,color:"#94a3b8",textTransform:"uppercase"},children:["Pages to generate (",i.pages.length,")"]}),(0,k.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"4px"},children:i.pages.map(A=>(0,k.jsxs)("span",{style:{padding:"2px 8px",borderRadius:"99px",background:"#f0fdf4",border:"1px solid #86efac",fontSize:"10px",color:"#166534",fontWeight:500},children:[mi[A]||"\u{1F4C4}"," ",A]},A))}),i.features.length>0&&(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)("p",{style:{margin:"10px 0 6px",fontSize:"10px",fontWeight:600,color:"#94a3b8",textTransform:"uppercase"},children:"Detected features"}),(0,k.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"4px"},children:i.features.map(A=>(0,k.jsx)("span",{style:{padding:"2px 8px",borderRadius:"99px",background:"#f5f3ff",border:"1px solid #c4b5fd",fontSize:"10px",color:"#7c3aed",fontWeight:500},children:A},A))})]})]}),(0,k.jsxs)("div",{style:{margin:"0 0 12px",padding:"10px 12px",background:"#f0fdf4",borderRadius:"8px",border:"1px solid #86efac"},children:[(0,k.jsx)("p",{style:{margin:"0 0 4px",fontSize:"10px",fontWeight:700,color:"#166534"},children:"\u{1F4E6} What you get:"}),(0,k.jsxs)("p",{style:{margin:0,fontSize:"10px",color:"#166534",lineHeight:1.6},children:["\u2705 Complete Next.js 16 project",(0,k.jsx)("br",{}),"\u2705 Tailwind CSS + CSS Modules",(0,k.jsx)("br",{}),"\u2705 TypeScript configured",(0,k.jsx)("br",{}),"\u2705 Navbar + Footer components",(0,k.jsx)("br",{}),"\u2705 All ",i.pages.length," pages ready",(0,k.jsx)("br",{}),"\u2705 Mobile responsive",(0,k.jsx)("br",{}),"\u2705 npm run dev \u2192 works immediately"]})]}),(0,k.jsxs)("div",{style:{display:"flex",gap:"8px"},children:[(0,k.jsx)("button",{onClick:z,style:{flex:1,padding:"9px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",color:"#64748b",fontSize:"12px",fontWeight:600,cursor:"pointer"},children:"\u2190 Edit"}),(0,k.jsx)("button",{onClick:_,style:{flex:2,padding:"9px",borderRadius:"8px",border:"none",background:"#f59e0b",color:"#fff",fontSize:"13px",fontWeight:700,cursor:"pointer"},children:"\u2B07\uFE0F Generate & Download ZIP"})]})]}),n==="generating"&&(0,k.jsxs)("div",{style:{padding:"2rem 16px",textAlign:"center"},children:[(0,k.jsx)("p",{style:{fontSize:"2rem",marginBottom:"1rem"},children:"\u26A1"}),(0,k.jsx)("p",{style:{fontSize:"13px",fontWeight:700,color:"#0f172a",marginBottom:"0.5rem"},children:"Generating your project..."}),(0,k.jsx)("p",{style:{fontSize:"11px",color:"#64748b",marginBottom:"1.5rem"},children:l<30?"Parsing requirement...":l<55?"Loading templates...":l<70?"Generating pages...":l<85?"Building components...":l<95?"Creating styles...":"Packaging ZIP..."}),(0,k.jsx)("div",{style:{height:"8px",background:"#e2e8f0",borderRadius:"99px",overflow:"hidden"},children:(0,k.jsx)("div",{style:{height:"100%",width:`${l}%`,background:"#f59e0b",borderRadius:"99px",transition:"width 0.3s ease"}})}),(0,k.jsxs)("p",{style:{marginTop:"0.5rem",fontSize:"10px",color:"#94a3b8"},children:[l,"%"]})]}),n==="done"&&i&&(0,k.jsxs)("div",{style:{padding:"2rem 16px",textAlign:"center"},children:[(0,k.jsx)("p",{style:{fontSize:"3rem",marginBottom:"0.75rem"},children:"\u2705"}),(0,k.jsxs)("p",{style:{fontSize:"14px",fontWeight:700,color:"#0f172a",marginBottom:"0.5rem"},children:[i.siteName," downloaded!"]}),(0,k.jsx)("p",{style:{fontSize:"11px",color:"#64748b",marginBottom:"1.5rem",lineHeight:1.6},children:"Your ZIP is downloading. Unzip it and run:"}),["npm install","npm run dev"].map(A=>(0,k.jsx)("div",{style:{background:"#0f172a",borderRadius:"8px",padding:"8px 12px",marginBottom:"6px",textAlign:"left"},children:(0,k.jsxs)("code",{style:{fontSize:"12px",color:"#a7f3d0",fontFamily:"monospace"},children:["$ ",A]})},A)),(0,k.jsx)("p",{style:{fontSize:"11px",color:"#10b981",margin:"1rem 0",fontWeight:600},children:"Then open http://localhost:3000 \u{1F680}"}),(0,k.jsxs)("div",{style:{display:"flex",gap:"8px"},children:[(0,k.jsx)("button",{onClick:z,style:{flex:1,padding:"9px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",color:"#64748b",fontSize:"12px",fontWeight:600,cursor:"pointer"},children:"New Project"}),(0,k.jsx)("button",{onClick:_,style:{flex:1,padding:"9px",borderRadius:"8px",border:"none",background:"#f59e0b",color:"#fff",fontSize:"12px",fontWeight:700,cursor:"pointer"},children:"\u2B07\uFE0F Download Again"})]})]})]})}var P=require("react/jsx-runtime");async function wi(){try{if(typeof window>"u")return!1;let e=window;if(e.LanguageModel)try{if(typeof e.LanguageModel.availability=="function"){let n=await e.LanguageModel.availability();if(n==="readily"||n==="available"||n==="downloadable")return!0}else return!0}catch{}if(e.Summarizer)try{let n=await e.Summarizer.availability?.();if(!n||n==="readily"||n==="available")return!0}catch{}if(e.Rewriter)try{let n=await e.Rewriter.availability?.();if(!n||n==="readily"||n==="available")return!0}catch{}if(e.Writer)try{let n=await e.Writer.availability?.();if(!n||n==="readily"||n==="available")return!0}catch{}let t=e.ai||globalThis.ai;if(t){if(t.languageModel?.availability)try{let n=await t.languageModel.availability();if(n==="readily"||n==="available")return!0}catch{}if(t.languageModel&&typeof t.languageModel.create=="function"||t.summarizer||t.rewriter||t.writer||t.languageModel)return!0}return!!(e.Translator||e.translation?.canTranslate)}catch{return!1}}function Tt({position:e="left",children:t,config:n={},showRag:o=!1,showAgent:r=!1}){let[a,i]=(0,W.useState)(!1),[s,l]=(0,W.useState)(Vt),[p,g]=(0,W.useState)(null),[y,M]=(0,W.useState)(!1),[_,z]=(0,W.useState)(!1),[L,A]=(0,W.useState)(!1),H=W.default.useRef(null),[v,E]=(0,W.useState)(!1),[N,x]=(0,W.useState)(""),[$,S]=(0,W.useState)(""),[D,le]=(0,W.useState)(!1),[V,J]=(0,W.useState)(null),[T,d]=(0,W.useState)("idle"),[ee,q]=(0,W.useState)(!1),[j,te]=(0,W.useState)(""),[se,R]=(0,W.useState)(""),[F,f]=(0,W.useState)(!1),[C,Y]=(0,W.useState)([]),[G,ie]=(0,W.useState)(null),ce=24,be=84,Ce=o?144:84,wn=204,[he,$e]=(0,W.useState)(!1);(0,W.useEffect)(()=>{if(typeof window>"u")return;let b=window;!!(b.LanguageModel||b.ai?.languageModel)&&_?(J("gemini"),ie("gemini")):et()&&(J("transformers"),ie("transformers"))},[_]),(0,W.useEffect)(()=>{if(V!=="transformers")return;let b=setInterval(()=>d(tt()),500);return()=>clearInterval(b)},[V]);let Qe=(0,W.useCallback)(async()=>{if(!(!N.trim()||D)){if(!V){S("\u26A0\uFE0F No AI engine available.");return}le(!0),S("");try{let b;if(V==="gemini"){let{askPage:Z}=await Promise.resolve().then(()=>(Bt(),to));b=await Z(N)}else{d("loading");let{askPageWithTransformers:Z}=await Promise.resolve().then(()=>(nt(),jt));b=await Z(N),d("ready")}S(b.success&&b.answer?b.answer.replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/#+\s/g,"").trim():"\u26A0\uFE0F "+(b.error||"No answer found."))}catch{S("\u26A0\uFE0F Something went wrong.")}le(!1)}},[N,D,V]),pt=(0,W.useCallback)(async()=>{if(!j.trim()||F)return;if(!G){R("\u26A0\uFE0F No AI engine available.");return}f(!0),Y([]),R("");let{runAgent:b}=await Promise.resolve().then(()=>(Do(),Ho));await b(j,G,Z=>{Y(Ae=>[...Ae,Z.text])}),f(!1),R("done")},[j,F,G]);(0,W.useEffect)(()=>{if(typeof window>"u")return;let Z=setTimeout(async()=>{let Ae=window,It=await wi();z(It),A(!!(Ae.SpeechRecognition||Ae.webkitSpeechRecognition))},800);return()=>clearTimeout(Z)},[]),(0,W.useEffect)(()=>{if(!(typeof window>"u"))try{let b=localStorage.getItem("yuktai-a11y-prefs");b&&l(Z=>({...Z,...JSON.parse(b)}))}catch{}},[]);let Re=(0,W.useCallback)(async b=>{let Z={enabled:!0,highContrast:b.highContrast,darkMode:b.darkMode,reduceMotion:b.reduceMotion,largeTargets:b.largeTargets,speechEnabled:b.speechEnabled,autoFix:b.autoFix,dyslexiaFont:b.dyslexiaFont,localFont:b.localFont,fontSizeMultiplier:b.fontScale/100,colorBlindMode:b.colorBlindMode,showAuditBadge:b.showAuditBadge,showSkipLinks:!0,showPreferencePanel:!1,plainEnglish:b.plainEnglish,summarisePage:b.summarisePage,translateLanguage:b.translateLanguage,voiceControl:b.voiceControl,smartLabels:b.smartLabels,...n};await xe.execute(Z),g(xe.applyFixes(Z)),M(!0)},[n]),me=(0,W.useCallback)(async()=>{try{localStorage.setItem("yuktai-a11y-prefs",JSON.stringify(s))}catch{}await Re(s),i(!1)},[s,Re]),Ee=(0,W.useCallback)(()=>{l(Vt);try{localStorage.removeItem("yuktai-a11y-prefs")}catch{}let b=document.documentElement;["data-yuktai-high-contrast","data-yuktai-dark","data-yuktai-reduce-motion","data-yuktai-large-targets","data-yuktai-keyboard","data-yuktai-dyslexia"].forEach(Z=>b.removeAttribute(Z)),document.body.style.filter="",document.body.style.fontFamily="",document.documentElement.style.fontSize="",g(null),M(!1)},[]),Ze=(0,W.useCallback)((b,Z)=>{l(Ae=>({...Ae,[b]:Z}))},[]);(0,W.useEffect)(()=>{let b=Z=>{Z.key==="Escape"&&(a&&i(!1),v&&E(!1),ee&&q(!1),he&&$e(!1))};return window.addEventListener("keydown",b),()=>window.removeEventListener("keydown",b)},[a,v,ee]),(0,W.useEffect)(()=>{a&&H.current&&xe.trapFocus(H.current)},[a]);let Fe=(b,Z,Ae)=>({position:"fixed",bottom:`${b}px`,[e]:"24px",zIndex:9998,width:"52px",height:"52px",borderRadius:"50%",background:Z,color:"#fff",border:"none",cursor:"pointer",fontSize:"22px",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,0,0,0.25)",transition:"transform 0.15s, background 0.2s"}),Oe=b=>{b.currentTarget.style.transform="scale(1.08)"},Le=b=>{b.currentTarget.style.transform="scale(1)"},We=V==="gemini"?"Gemini Nano \xB7 On device":V==="transformers"?"Transformers.js \xB7 All devices":"Detecting...",ft=V==="transformers"&&T==="loading"?"Loading model...":"...";return(0,P.jsxs)(P.Fragment,{children:[t,r&&(0,P.jsx)("button",{style:Fe(204,he?"#d97706":"#f59e0b",he),"aria-label":"Open Vibe Coder",title:"\u26A1 Vibe Coder \u2014 Generate Next.js project",onClick:()=>{$e(b=>!b),q(!1),E(!1),i(!1)},onMouseEnter:Oe,onMouseLeave:Le,children:"\u26A1"}),r&&he&&(0,P.jsx)(Kt,{position:e,onClose:()=>$e(!1)}),r&&(0,P.jsx)("button",{style:Fe(Ce,ee?"#059669":"#10b981",ee),"aria-label":"Open AI agent","aria-haspopup":"dialog","aria-expanded":ee,title:"\u{1F916} AI Agent \u2014 guide me through this page",onClick:()=>{q(b=>!b),E(!1),i(!1)},onMouseEnter:Oe,onMouseLeave:Le,children:"\u{1F916}"}),r&&ee&&(0,P.jsxs)("div",{role:"dialog","aria-modal":"true","aria-label":"yuktai AI Agent","data-yuktai-panel":"true",style:{position:"fixed",bottom:`${Ce+64}px`,[e]:"24px",zIndex:9999,width:"300px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",fontFamily:"system-ui,-apple-system,sans-serif",padding:"14px",maxHeight:"70vh",overflowY:"auto"},children:[(0,P.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"},children:[(0,P.jsxs)("div",{children:[(0,P.jsx)("p",{style:{margin:"0 0 2px",fontSize:"13px",fontWeight:600,color:"#0f172a"},children:"\u{1F916} AI Agent"}),(0,P.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#10b981"},children:G==="gemini"?"Gemini Nano \xB7 On device":G==="transformers"?"Transformers.js \xB7 All devices":"Detecting..."})]}),(0,P.jsx)("button",{onClick:()=>q(!1),"aria-label":"Close agent panel",style:{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"18px",lineHeight:1,padding:"2px"},children:"\xD7"})]}),(0,P.jsx)("p",{style:{margin:"0 0 8px",fontSize:"11px",color:"#64748b"},children:"Tell me what you want to do on this page. I will guide you step by step."}),(0,P.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"4px",marginBottom:"8px"},children:["Fill this form","Find contact info","What is this page?","Guide me to apply"].map(b=>(0,P.jsx)("button",{onClick:()=>te(b),style:{padding:"3px 8px",borderRadius:"20px",fontSize:"10px",border:"1px solid #e2e8f0",background:"#f8fafc",color:"#64748b",cursor:"pointer"},children:b},b))}),(0,P.jsxs)("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[(0,P.jsx)("input",{type:"text",value:j,onChange:b=>te(b.target.value),onKeyDown:b=>{b.key==="Enter"&&pt()},placeholder:"e.g. Help me fill this form",disabled:F||!G,"aria-label":"Tell the agent what to do",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:G?"#fff":"#f8fafc",outline:"none",height:"36px"}}),(0,P.jsx)("button",{onClick:pt,disabled:F||!j.trim()||!G,"aria-label":"Run agent",style:{padding:"8px 12px",borderRadius:"8px",border:"none",background:G&&j.trim()&&!F?"#10b981":"#e2e8f0",color:G&&j.trim()&&!F?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:G&&j.trim()&&!F?"pointer":"not-allowed",height:"36px",minWidth:"52px",transition:"background 0.2s"},children:F?"...":"Go"})]}),C.length>0&&(0,P.jsxs)("div",{style:{padding:"10px 12px",background:"#f0fdf4",border:"1px solid #86efac",borderRadius:"8px",fontSize:"11px",color:"#166534",lineHeight:1.7},children:[C.map((b,Z)=>(0,P.jsx)("p",{style:{margin:"0 0 2px"},children:b},Z)),se==="done"&&(0,P.jsx)("button",{onClick:()=>{Y([]),te(""),R("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]}),!G&&(0,P.jsx)("p",{style:{margin:"4px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Enable Gemini Nano via chrome://flags for best results."})]}),o&&(0,P.jsx)("button",{style:Fe(be,v?"#7c3aed":"#6d28d9",v),"aria-label":"Ask a question about this page","aria-haspopup":"dialog","aria-expanded":v,title:`\u{1F4AC} Ask this page \xB7 ${We}`,onClick:()=>{E(b=>!b),i(!1),q(!1)},onMouseEnter:Oe,onMouseLeave:Le,children:"\u{1F4AC}"}),o&&v&&(0,P.jsxs)("div",{role:"dialog","aria-modal":"true","aria-label":"Ask this page","data-yuktai-panel":"true",style:{position:"fixed",bottom:`${be+64}px`,[e]:"24px",zIndex:9999,width:"300px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",fontFamily:"system-ui,-apple-system,sans-serif",padding:"14px"},children:[(0,P.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"},children:[(0,P.jsxs)("div",{children:[(0,P.jsx)("p",{style:{margin:"0 0 2px",fontSize:"13px",fontWeight:600,color:"#0f172a"},children:"\u{1F4AC} Ask this page"}),(0,P.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#7c3aed"},children:We}),V==="transformers"&&T==="loading"&&(0,P.jsx)("p",{style:{margin:"2px 0 0",fontSize:"9px",color:"#94a3b8"},children:"Downloading model \u2014 first time only"}),V==="transformers"&&T==="ready"&&(0,P.jsx)("p",{style:{margin:"2px 0 0",fontSize:"9px",color:"#10b981"},children:"Model ready \u2705 \u2014 works offline"})]}),(0,P.jsx)("button",{onClick:()=>E(!1),"aria-label":"Close ask panel",style:{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"18px",lineHeight:1,padding:"2px"},children:"\xD7"})]}),(0,P.jsxs)("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[(0,P.jsx)("input",{type:"text",value:N,onChange:b=>x(b.target.value),onKeyDown:b=>{b.key==="Enter"&&Qe()},placeholder:"e.g. What does this page do?",disabled:D||!V,"aria-label":"Ask a question about this page",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:V?"#fff":"#f8fafc",outline:"none",height:"36px"}}),(0,P.jsx)("button",{onClick:Qe,disabled:D||!N.trim()||!V,"aria-label":"Submit question",style:{padding:"8px 12px",borderRadius:"8px",border:"none",background:V&&N.trim()&&!D?"#7c3aed":"#e2e8f0",color:V&&N.trim()&&!D?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:V&&N.trim()&&!D?"pointer":"not-allowed",height:"36px",minWidth:"48px",transition:"background 0.2s"},children:D?ft:"Ask"})]}),$&&(0,P.jsxs)("div",{style:{padding:"10px",background:"#f5f3ff",borderRadius:"8px",fontSize:"12px",color:"#4c1d95",lineHeight:1.6,maxHeight:"180px",overflowY:"auto"},children:[(0,P.jsx)("strong",{style:{display:"block",marginBottom:"4px",fontSize:"11px",color:"#7c3aed"},children:"\u{1F4AC} Answer"}),$,(0,P.jsx)("button",{onClick:()=>{S(""),x("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]}),!V&&(0,P.jsx)("p",{style:{margin:"4px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Detecting AI engine..."})]}),(0,P.jsx)("button",{style:Fe(ce,y?"#0d9488":"#1a73e8",a),"aria-label":"Open accessibility preferences","aria-haspopup":"dialog","aria-expanded":a,"data-yuktai-pref-toggle":"true",title:"\u267F Accessibility settings",onClick:()=>{i(b=>!b),E(!1),q(!1)},onMouseEnter:Oe,onMouseLeave:Le,children:"\u267F"}),a&&(0,P.jsx)(Yt,{ref:H,position:e,settings:s,report:p,isActive:y,aiSupported:_,voiceSupported:L,set:Ze,onApply:me,onReset:Ee,onClose:()=>i(!1)})]})}h();var rt={name:"ai.text",async execute(e){return`\u{1F916} YuktAI says: ${e}`}};h();var it={name:"voice.text",async execute(e){return!e||e.trim()===""?"\u{1F3A4} No speech detected":`\u{1F3A4} You said: ${e}`}};h();var Me=class{plugins=new Map;register(t,n){if(!n||typeof n.execute!="function")throw new Error(`Invalid plugin: ${t}`);this.plugins.set(t,n)}use(t){return this.plugins.get(t)}async run(t,n){try{let o=this.use(t);if(!o)throw new Error(`Plugin not found: ${t}`);return await o.execute(n)}catch(o){throw console.error(`[YuktAI Runtime Error in ${t}]:`,o),o}}getPlugins(){return Array.from(this.plugins.keys())}};h();var oe=require("react");h();var ne=require("react"),m=require("react/jsx-runtime"),_o={"en-US":{title:"Grid AI Assistant",subtitle:"Ask about your data",ask:"Ask",placeholder:"Ask or type a command...",listening:"Listening...",send:"Send",close:"Close",open:"Open AI assistant",inputLanguage:"Input language",speakNow:"Speak your question",working:"Working on it\u2026",english:"English",telugu:"\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41",searchStarted:e=>`Searching for "${e}".`,sortedAscending:e=>`Sorted by ${e} in ascending order.`,sortedDescending:e=>`Sorted by ${e} in descending order.`,count:e=>`There are ${e} rows in the grid.`,highest:(e,t,n)=>`The highest ${e} is ${t}, held by ${n}.`,lowest:(e,t,n)=>`The lowest ${e} is ${t}, held by ${n}.`,average:(e,t)=>`The average ${e} is ${t}.`,total:(e,t)=>`The total ${e} is ${t}.`,noData:"There is no data to analyze.",noColumn:"I could not find a column to analyze.",noNumericData:e=>`There is no numeric data in ${e}.`,notFound:e=>`I could not find anything matching "${e}".`,needName:"Please provide a value to look up.",fallback:"I can search, sort, count, and analyze the grid data.",unsupportedVoice:"Voice input is not supported in this browser."},"te-IN":{title:"\u0C17\u0C4D\u0C30\u0C3F\u0C21\u0C4D AI \u0C38\u0C39\u0C3E\u0C2F\u0C15\u0C41\u0C21\u0C41",subtitle:"\u0C2E\u0C40 \u0C21\u0C47\u0C1F\u0C3E \u0C17\u0C41\u0C30\u0C3F\u0C02\u0C1A\u0C3F \u0C05\u0C21\u0C17\u0C02\u0C21\u0C3F",ask:"\u0C05\u0C21\u0C17\u0C02\u0C21\u0C3F",placeholder:"\u0C2A\u0C4D\u0C30\u0C36\u0C4D\u0C28 \u0C32\u0C47\u0C26\u0C3E \u0C06\u0C26\u0C47\u0C36\u0C02 \u0C1F\u0C48\u0C2A\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F...",listening:"\u0C35\u0C3F\u0C02\u0C1F\u0C41\u0C28\u0C4D\u0C28\u0C3E\u0C28\u0C41...",send:"\u0C2A\u0C02\u0C2A\u0C02\u0C21\u0C3F",close:"\u0C2E\u0C42\u0C38\u0C3F\u0C35\u0C47\u0C2F\u0C02\u0C21\u0C3F",open:"AI \u0C38\u0C39\u0C3E\u0C2F\u0C15\u0C41\u0C21\u0C3F\u0C28\u0C3F \u0C24\u0C46\u0C30\u0C35\u0C02\u0C21\u0C3F",inputLanguage:"\u0C07\u0C28\u0C4D\u200C\u0C2A\u0C41\u0C1F\u0C4D \u0C2D\u0C3E\u0C37",speakNow:"\u0C2E\u0C40 \u0C2A\u0C4D\u0C30\u0C36\u0C4D\u0C28 \u0C1A\u0C46\u0C2A\u0C4D\u0C2A\u0C02\u0C21\u0C3F",working:"\u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C41\u0C28\u0C4D\u0C28\u0C3E\u0C28\u0C41\u2026",english:"English",telugu:"\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41",searchStarted:e=>`\u201C${e}\u201D \u0C15\u0C4B\u0C38\u0C02 \u0C36\u0C4B\u0C27\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C28\u0C4D\u0C28\u0C3E\u0C28\u0C41.`,sortedAscending:e=>`${e}\u0C28\u0C41 \u0C06\u0C30\u0C4B\u0C39\u0C23 \u0C15\u0C4D\u0C30\u0C2E\u0C02\u0C32\u0C4B \u0C05\u0C2E\u0C30\u0C4D\u0C1A\u0C3E\u0C28\u0C41.`,sortedDescending:e=>`${e}\u0C28\u0C41 \u0C05\u0C35\u0C30\u0C4B\u0C39\u0C23 \u0C15\u0C4D\u0C30\u0C2E\u0C02\u0C32\u0C4B \u0C05\u0C2E\u0C30\u0C4D\u0C1A\u0C3E\u0C28\u0C41.`,count:e=>`\u0C17\u0C4D\u0C30\u0C3F\u0C21\u0C4D\u200C\u0C32\u0C4B \u0C2E\u0C4A\u0C24\u0C4D\u0C24\u0C02 ${e} \u0C35\u0C30\u0C41\u0C38\u0C32\u0C41 \u0C09\u0C28\u0C4D\u0C28\u0C3E\u0C2F\u0C3F.`,highest:(e,t,n)=>`\u0C05\u0C24\u0C4D\u0C2F\u0C27\u0C3F\u0C15 ${e} \u0C35\u0C3F\u0C32\u0C41\u0C35 ${t}. \u0C07\u0C26\u0C3F ${n}\u0C15\u0C41 \u0C38\u0C02\u0C2C\u0C02\u0C27\u0C3F\u0C02\u0C1A\u0C3F\u0C28\u0C26\u0C3F.`,lowest:(e,t,n)=>`\u0C05\u0C24\u0C4D\u0C2F\u0C32\u0C4D\u0C2A ${e} \u0C35\u0C3F\u0C32\u0C41\u0C35 ${t}. \u0C07\u0C26\u0C3F ${n}\u0C15\u0C41 \u0C38\u0C02\u0C2C\u0C02\u0C27\u0C3F\u0C02\u0C1A\u0C3F\u0C28\u0C26\u0C3F.`,average:(e,t)=>`${e} \u0C38\u0C17\u0C1F\u0C41 \u0C35\u0C3F\u0C32\u0C41\u0C35 ${t}.`,total:(e,t)=>`${e} \u0C2E\u0C4A\u0C24\u0C4D\u0C24\u0C02 \u0C35\u0C3F\u0C32\u0C41\u0C35 ${t}.`,noData:"\u0C35\u0C3F\u0C36\u0C4D\u0C32\u0C47\u0C37\u0C3F\u0C02\u0C1A\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C21\u0C47\u0C1F\u0C3E \u0C32\u0C47\u0C26\u0C41.",noColumn:"\u0C35\u0C3F\u0C36\u0C4D\u0C32\u0C47\u0C37\u0C3F\u0C02\u0C1A\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C24\u0C17\u0C3F\u0C28 \u0C15\u0C3E\u0C32\u0C2E\u0C4D \u0C15\u0C28\u0C2C\u0C21\u0C32\u0C47\u0C26\u0C41.",noNumericData:e=>`${e}\u0C32\u0C4B \u0C38\u0C02\u0C16\u0C4D\u0C2F\u0C3E \u0C38\u0C2E\u0C3E\u0C1A\u0C3E\u0C30\u0C02 \u0C32\u0C47\u0C26\u0C41.`,notFound:e=>`\u201C${e}\u201D\u0C15\u0C41 \u0C38\u0C30\u0C3F\u0C2A\u0C4B\u0C32\u0C47 \u0C38\u0C2E\u0C3E\u0C1A\u0C3E\u0C30\u0C02 \u0C15\u0C28\u0C2C\u0C21\u0C32\u0C47\u0C26\u0C41.`,needName:"\u0C36\u0C4B\u0C27\u0C3F\u0C02\u0C1A\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C12\u0C15 \u0C35\u0C3F\u0C32\u0C41\u0C35 \u0C07\u0C35\u0C4D\u0C35\u0C02\u0C21\u0C3F.",fallback:"\u0C17\u0C4D\u0C30\u0C3F\u0C21\u0C4D\u200C\u0C32\u0C4B \u0C36\u0C4B\u0C27\u0C28, \u0C15\u0C4D\u0C30\u0C2E\u0C2C\u0C26\u0C4D\u0C27\u0C40\u0C15\u0C30\u0C23, \u0C32\u0C46\u0C15\u0C4D\u0C15\u0C3F\u0C02\u0C2A\u0C41 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C21\u0C47\u0C1F\u0C3E \u0C35\u0C3F\u0C36\u0C4D\u0C32\u0C47\u0C37\u0C23 \u0C1A\u0C47\u0C2F\u0C17\u0C32\u0C28\u0C41.",unsupportedVoice:"\u0C08 \u0C2C\u0C4D\u0C30\u0C4C\u0C1C\u0C30\u0C4D\u200C\u0C32\u0C4B \u0C35\u0C3E\u0C2F\u0C3F\u0C38\u0C4D \u0C07\u0C28\u0C4D\u200C\u0C2A\u0C41\u0C1F\u0C4D\u200C\u0C15\u0C41 \u0C2E\u0C26\u0C4D\u0C26\u0C24\u0C41 \u0C32\u0C47\u0C26\u0C41."}};function Se(e){return e.toLowerCase().trim().replace(/\s+/g," ")}function ki(e,t){let n=Se(e);if(t==="te-IN")return/^(శోధించు|శోధించండి|వెతుకు|వెతకండి|చూపించు|చూపించండి|ఫిల్టర్)/.test(n)?{type:"search",payload:n.replace(/^(శోధించు|శోధించండి|వెతుకు|వెతకండి|చూపించు|చూపించండి|ఫిల్టర్)\s*/u,"").trim()||e}:/క్రమబద్ధీకర|అమర్చ|సార్ట్/.test(n)?{type:"sort",payload:{key:void 0,dir:/అవరోహణ|పెద్ద|అధిక|చివర/.test(n)?"desc":"asc"}}:/ఎన్ని|ఎంతమంది|లెక్క|మొత్తం వరుస|వరుసలు/.test(n)?{type:"question",payload:e}:/అత్యధిక|గరిష్ఠ|పెద్ద|ఎక్కువ/.test(n)?{type:"question",payload:e}:/అత్యల్ప|కనిష్ఠ|చిన్న|తక్కువ/.test(n)?{type:"question",payload:e}:/సగటు|సగటు విలువ/.test(n)?{type:"question",payload:e}:/మొత్తం|కలిపి/.test(n)?{type:"question",payload:e}:{type:"search",payload:e};if(/^(search|find|show|filter)/.test(n))return{type:"search",payload:n.replace(/^(search|find|show|filter)\s+(for\s+|by\s+)?/,"").trim()||e};if(/sort/.test(n)){let o=/desc|descending|high|higher|large|largest|top/.test(n);return{type:"sort",payload:{key:n.match(/(?:by|on)\s+([a-z0-9_-]+)/)?.[1],dir:o?"desc":"asc"}}}return/how many|count|highest|maximum|max|top|largest|lowest|minimum|min|smallest|bottom|average|avg|mean|sum|total|who|which|where|whose/.test(n)?{type:"question",payload:e}:{type:"search",payload:e}}function Bo(e,t){let n=Se(e);return t.find(o=>{let r=Se(o.key),a=Se(o.label);return n.includes(r)||n.includes(a)})}function At(e,t){return e.toLocaleString(t==="te-IN"?"te-IN":"en-IN")}function Si(e,t,n,o){let r=_o[o];if(t.length===0)return r.noData;let a=Se(e),i=n.filter(v=>v.type==="number"),s=Bo(e,n),l=s?.type==="number"?s:i[0],p=/how many|count|rows|ఎన్ని|ఎంతమంది|లెక్క|వరుసలు/.test(a);if(p)return r.count(t.length);if(/highest|maximum|max|top|largest|అత్యధిక|గరిష్ఠ|పెద్ద|ఎక్కువ/.test(a)){let v=s??l;if(!v)return r.noColumn;let E=t.map(S=>({row:S,value:Number(S[v.key])})).filter(S=>!Number.isNaN(S.value)).sort((S,D)=>D.value-S.value);if(E.length===0)return r.noNumericData(v.label);let N=E[0],x=n.find(S=>S.key==="name"||Se(S.label)==="name"),$=x?String(N.row[x.key]??""):o==="te-IN"?"\u0C08 \u0C35\u0C30\u0C41\u0C38":"this row";return r.highest(v.label,At(N.value,o),$)}if(/lowest|minimum|min|smallest|bottom|అత్యల్ప|కనిష్ఠ|చిన్న|తక్కువ/.test(a)){let v=s??l;if(!v)return r.noColumn;let E=t.map(S=>({row:S,value:Number(S[v.key])})).filter(S=>!Number.isNaN(S.value)).sort((S,D)=>S.value-D.value);if(E.length===0)return r.noNumericData(v.label);let N=E[0],x=n.find(S=>S.key==="name"||Se(S.label)==="name"),$=x?String(N.row[x.key]??""):o==="te-IN"?"\u0C08 \u0C35\u0C30\u0C41\u0C38":"this row";return r.lowest(v.label,At(N.value,o),$)}if(/average|avg|mean|సగటు/.test(a)){let v=s??l;if(!v)return r.noColumn;let E=t.map(x=>Number(x[v.key])).filter(x=>!Number.isNaN(x));if(E.length===0)return r.noNumericData(v.label);let N=E.reduce((x,$)=>x+$,0)/E.length;return r.average(v.label,At(Math.round(N*100)/100,o))}if(/sum|total|మొత్తం|కలిపి/.test(a)&&!p){let v=s??l;if(!v)return r.noColumn;let E=t.map(x=>Number(x[v.key])).filter(x=>!Number.isNaN(x));if(E.length===0)return r.noNumericData(v.label);let N=E.reduce((x,$)=>x+$,0);return r.total(v.label,At(N,o))}let z=a.match(/[\p{L}\p{N}_-]+/gu)??[],L=new Set(["who","what","which","where","whose","is","the","has","have","show","find","search","for","by","about"]),H=z.filter(v=>!L.has(v)).join(" ").trim();if(H){let v=t.find(E=>Object.values(E).some(N=>String(N??"").toLowerCase().includes(H.toLowerCase())));return v?n.map(E=>`${E.label}: ${String(v[E.key]??"")}`).join(o==="te-IN"?" \xB7 ":", "):r.notFound(H)}return r.fallback}function Ti(e,t){if(typeof window>"u"||!window.speechSynthesis)return;window.speechSynthesis.cancel();let n=new SpeechSynthesisUtterance(e);n.lang=t,n.rate=1,n.pitch=1,window.speechSynthesis.speak(n)}function Ai(e){let[t,n]=(0,ne.useState)(!1),[o,r]=(0,ne.useState)(""),[a,i]=(0,ne.useState)(!0),s=(0,ne.useRef)(null);(0,ne.useEffect)(()=>{if(typeof window>"u")return;let g=window.SpeechRecognition||window.webkitSpeechRecognition;if(!g){i(!1),s.current=null;return}let y=new g;return y.continuous=!1,y.interimResults=!1,y.lang=e,y.onresult=M=>{let _=M?.results?.[0]?.[0]?.transcript??"";r(_),n(!1)},y.onerror=()=>{n(!1)},y.onend=()=>{n(!1)},s.current=y,()=>{try{y.stop()}catch{}s.current=null}},[e]);let l=(0,ne.useCallback)(()=>{if(s.current){r(""),n(!0);try{s.current.start()}catch{n(!1)}}},[]),p=(0,ne.useCallback)(()=>{try{s.current?.stop()}catch{}n(!1)},[]);return{listening:t,transcript:o,supported:a,start:l,stop:p}}function Ci(){return(0,m.jsxs)("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,m.jsx)("circle",{cx:"11",cy:"11",r:"6.5"}),(0,m.jsx)("path",{d:"m16 16 5 5"})]})}function Ei(){return(0,m.jsxs)("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,m.jsx)("rect",{x:"8",y:"3",width:"8",height:"12",rx:"4"}),(0,m.jsx)("path",{d:"M5 11a7 7 0 0 0 14 0"}),(0,m.jsx)("path",{d:"M12 18v3"}),(0,m.jsx)("path",{d:"M8 21h8"})]})}function Ii(){return(0,m.jsxs)("svg",{width:"17",height:"17",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,m.jsx)("path",{d:"m4 4 16 8-16 8 4-8-4-8Z"}),(0,m.jsx)("path",{d:"M8 12h12"})]})}function Ri(){return(0,m.jsxs)("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,m.jsx)("path",{d:"m6 6 12 12"}),(0,m.jsx)("path",{d:"m18 6-12 12"})]})}function Li({data:e,columns:t,onSearch:n,onSort:o,theme:r="light",language:a="en-US",inputLanguage:i="en-US",embedded:s=!1,agent:l,onInputLanguageChange:p}){let g=_o[a],[y,M]=(0,ne.useState)(i);(0,ne.useEffect)(()=>{M(i)},[i]);let[_,z]=(0,ne.useState)(!1),L=r==="dark",[A,H]=(0,ne.useState)(s),[v,E]=(0,ne.useState)(""),[N,x]=(0,ne.useState)([]),$=(0,ne.useRef)(null),{listening:S,transcript:D,supported:le,start:V,stop:J}=Ai(y),T=(0,ne.useMemo)(()=>({bg:L?"#0F172A":"#FFFFFF",surface:L?"#1E293B":"#F8FAFC",border:L?"#334155":"#E2E8F0",text:L?"#F1F5F9":"#0F172A",muted:L?"#94A3B8":"#64748B",accent:"#10B981",userMsg:L?"#334155":"#DBEAFE",aiMsg:L?"#1E293B":"#F0FDF4"}),[L]),d=(0,ne.useMemo)(()=>({role:"ai",text:a==="te-IN"?"\u0C2E\u0C40 \u0C17\u0C4D\u0C30\u0C3F\u0C21\u0C4D \u0C21\u0C47\u0C1F\u0C3E \u0C17\u0C41\u0C30\u0C3F\u0C02\u0C1A\u0C3F \u0C2A\u0C4D\u0C30\u0C36\u0C4D\u0C28 \u0C05\u0C21\u0C17\u0C02\u0C21\u0C3F.":"Ask me about your grid data.",time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}),[a]);(0,ne.useEffect)(()=>{x(R=>R.length>0?R:[d])},[d]),(0,ne.useEffect)(()=>{$.current?.scrollIntoView({behavior:"smooth"})},[N]);let ee=()=>new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),q=(0,ne.useCallback)(async R=>{let F=R.trim();if(!F)return;x(C=>[...C,{role:"user",text:F,time:ee()}]),E("");let f="";if(l){z(!0);try{f=(await l.ask(F)).message}catch{f=g.fallback}finally{z(!1)}}else{let C=ki(F,a);if(C.type==="question")f=Si(C.payload??F,e,t,a);else if(C.type==="search"){let Y=String(C.payload??F);n?.(Y),f=g.searchStarted(Y)}else if(C.type==="sort"){let Y=C.payload?.key,G=Y?t.find(ie=>Se(ie.key)===Se(Y)||Se(ie.label)===Se(Y)):void 0;if(G||(G=Bo(F,t)),G&&o){let ie=C.payload?.dir==="desc"?"desc":"asc";o(String(G.key),ie),f=ie==="asc"?g.sortedAscending(G.label):g.sortedDescending(G.label)}else f=g.noColumn}}f||(f=g.fallback),x(C=>[...C,{role:"ai",text:f,time:ee()}]),Ti(f,a)},[l,t,e,a,n,o,g]);(0,ne.useEffect)(()=>{D&&q(D)},[D,q]);let j=()=>{q(v)},te=a==="te-IN"?["\u0C0E\u0C28\u0C4D\u0C28\u0C3F \u0C35\u0C30\u0C41\u0C38\u0C32\u0C41","\u0C36\u0C4B\u0C27\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F","\u0C15\u0C4D\u0C30\u0C2E\u0C02"]:["how many rows","search","sort"],se=(0,m.jsxs)("div",{style:{width:s?"100%":360,maxWidth:s?"100%":"calc(100vw - 48px)",height:s?390:480,maxHeight:"70vh",background:T.bg,border:`1px solid ${T.border}`,borderRadius:s?12:16,boxShadow:s?"none":"0 20px 40px rgba(0,0,0,0.15)",display:"flex",flexDirection:"column",overflow:"hidden"},children:[(0,m.jsxs)("div",{style:{padding:"12px 14px",background:T.accent,color:"#FFFFFF",display:"flex",alignItems:"center",gap:10},children:[(0,m.jsx)("div",{style:{width:34,height:34,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.18)",fontSize:17},children:"AI"}),(0,m.jsxs)("div",{style:{flex:1,minWidth:0},children:[(0,m.jsx)("div",{style:{fontWeight:700,fontSize:14},children:g.title}),(0,m.jsx)("div",{style:{fontSize:11,opacity:.9},children:g.subtitle})]}),!s&&(0,m.jsx)("button",{type:"button",onClick:()=>H(!1),"aria-label":g.close,title:g.close,style:{width:32,height:32,border:"none",borderRadius:8,background:"rgba(255,255,255,0.12)",color:"#FFFFFF",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"},children:(0,m.jsx)(Ri,{})})]}),(0,m.jsxs)("div",{style:{padding:"8px 10px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:8,background:T.surface},children:[(0,m.jsx)("span",{style:{fontSize:11,color:T.muted},children:g.inputLanguage}),(0,m.jsxs)("select",{value:y,onChange:R=>{let F=R.target.value;M(F),p?.(F)},disabled:S,"aria-label":g.inputLanguage,style:{padding:"5px 8px",borderRadius:7,border:`1px solid ${T.border}`,background:T.bg,color:T.text,fontSize:11},children:[(0,m.jsx)("option",{value:"en-US",children:"English (US)"}),(0,m.jsx)("option",{value:"en-IN",children:"English (India)"}),(0,m.jsx)("option",{value:"as-IN",children:"Assamese"}),(0,m.jsx)("option",{value:"bn-IN",children:"Bengali"}),(0,m.jsx)("option",{value:"brx-IN",children:"Bodo"}),(0,m.jsx)("option",{value:"doi-IN",children:"Dogri"}),(0,m.jsx)("option",{value:"gu-IN",children:"Gujarati"}),(0,m.jsx)("option",{value:"hi-IN",children:"Hindi"}),(0,m.jsx)("option",{value:"kn-IN",children:"Kannada"}),(0,m.jsx)("option",{value:"ks-IN",children:"Kashmiri"}),(0,m.jsx)("option",{value:"kok-IN",children:"Konkani"}),(0,m.jsx)("option",{value:"mai-IN",children:"Maithili"}),(0,m.jsx)("option",{value:"ml-IN",children:"Malayalam"}),(0,m.jsx)("option",{value:"mni-IN",children:"Manipuri"}),(0,m.jsx)("option",{value:"mr-IN",children:"Marathi"}),(0,m.jsx)("option",{value:"ne-IN",children:"Nepali"}),(0,m.jsx)("option",{value:"or-IN",children:"Odia"}),(0,m.jsx)("option",{value:"pa-IN",children:"Punjabi"}),(0,m.jsx)("option",{value:"sa-IN",children:"Sanskrit"}),(0,m.jsx)("option",{value:"sat-IN",children:"Santali"}),(0,m.jsx)("option",{value:"sd-IN",children:"Sindhi"}),(0,m.jsx)("option",{value:"ta-IN",children:"Tamil"}),(0,m.jsx)("option",{value:"te-IN",children:"Telugu"}),(0,m.jsx)("option",{value:"ur-IN",children:"Urdu"})]})]}),(0,m.jsxs)("div",{style:{flex:1,overflowY:"auto",padding:10,display:"flex",flexDirection:"column",gap:8},children:[N.map((R,F)=>(0,m.jsxs)("div",{style:{alignSelf:R.role==="user"?"flex-end":"flex-start",maxWidth:"88%",padding:"8px 11px",borderRadius:11,background:R.role==="user"?T.userMsg:T.aiMsg,color:T.text,fontSize:13,lineHeight:1.5},children:[(0,m.jsx)("div",{children:R.text}),(0,m.jsx)("div",{style:{marginTop:3,fontSize:10,opacity:.55,textAlign:"right"},children:R.time})]},`${R.time}-${F}`)),S&&(0,m.jsx)("div",{style:{alignSelf:"flex-end",padding:"8px 11px",borderRadius:11,background:L?"#3F1D2E":"#FEE2E2",color:L?"#FCA5A5":"#991B1B",fontSize:13},children:g.listening}),(_||l?.loading)&&(0,m.jsx)("div",{role:"status","aria-live":"polite",style:{alignSelf:"flex-start",padding:"8px 11px",borderRadius:11,background:T.aiMsg,color:T.muted,fontSize:13},children:g.working}),(0,m.jsx)("div",{ref:$})]}),(0,m.jsx)("div",{style:{padding:"7px 10px",borderTop:`1px solid ${T.border}`,display:"flex",gap:6,overflowX:"auto",flexShrink:0},children:te.map(R=>(0,m.jsx)("button",{type:"button",onClick:()=>q(R),style:{padding:"5px 9px",borderRadius:12,border:`1px solid ${T.border}`,background:T.surface,color:T.text,fontSize:10.5,cursor:"pointer",whiteSpace:"nowrap"},children:R},R))}),(0,m.jsxs)("div",{style:{padding:9,display:"flex",gap:6,borderTop:`1px solid ${T.border}`,background:T.surface},children:[(0,m.jsxs)("div",{style:{position:"relative",flex:1},children:[(0,m.jsx)(Ci,{}),(0,m.jsx)("input",{type:"text",value:v,onChange:R=>E(R.target.value),onKeyDown:R=>{R.key==="Enter"&&j()},placeholder:g.placeholder,"aria-label":g.ask,style:{width:"100%",boxSizing:"border-box",padding:"9px 10px 9px 34px",borderRadius:8,border:`1px solid ${T.border}`,background:T.bg,color:T.text,fontSize:12,outline:"none"}})]}),le?(0,m.jsx)("button",{type:"button",onClick:S?J:V,"aria-label":S?g.listening:g.speakNow,title:S?g.listening:g.speakNow,style:{width:38,height:38,border:"none",borderRadius:8,background:S?"#EF4444":T.accent,color:"#FFFFFF",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0},children:(0,m.jsx)(Ei,{})}):null,(0,m.jsx)("button",{type:"button",onClick:j,disabled:!v.trim(),"aria-label":g.send,title:g.send,style:{width:38,height:38,border:"none",borderRadius:8,background:v.trim()?T.accent:T.muted,color:"#FFFFFF",display:"flex",alignItems:"center",justifyContent:"center",cursor:v.trim()?"pointer":"not-allowed",opacity:v.trim()?1:.6,flexShrink:0},children:(0,m.jsx)(Ii,{})})]})]});return s?(0,m.jsx)("div",{style:{width:"100%",minWidth:0},children:A?se:(0,m.jsxs)("button",{type:"button",onClick:()=>H(!0),"aria-label":g.open,style:{minHeight:40,padding:"8px 13px",borderRadius:9,border:"1px solid #10B981",background:L?"#064E3B":"#ECFDF5",color:L?"#A7F3D0":"#047857",display:"inline-flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:12,fontWeight:600},children:[(0,m.jsx)("span",{"aria-hidden":"true",children:"AI"}),g.ask]})}):(0,m.jsxs)(m.Fragment,{children:[!A&&(0,m.jsx)("button",{type:"button",onClick:()=>H(!0),"aria-label":g.open,title:g.title,style:{position:"fixed",bottom:24,right:24,zIndex:9998,width:56,height:56,borderRadius:28,background:T.accent,color:"#FFFFFF",border:"none",cursor:"pointer",boxShadow:"0 8px 20px rgba(16,185,129,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14},children:"AI"}),A&&(0,m.jsx)("div",{style:{position:"fixed",bottom:90,right:24,zIndex:9997},children:se}),(0,m.jsx)("style",{children:`
        @keyframes yuktai-ai-pulse {
          0%, 100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.05);
          }
        }
      `})]})}var Ct=Li;h();var de=require("react");h();var Ni={en:{found:e=>`${e} row(s) found.`,count:e=>`${e} row(s).`,columns:"Grid columns retrieved.",rowFound:"Row found.",notFound:e=>`Row "${e}" not found.`,noneFound:"None of the given rows were found.",highlighted:e=>`${e} row(s) highlighted.`,selected:e=>`Row "${e}" selected.`,opened:e=>`Row "${e}" opened.`,notSupported:e=>`This grid does not support "${e}".`,emptyQuery:"Please enter something to search.",noIds:"No row IDs were given.",unknownColumn:e=>`Unknown column "${e}".`,badOperator:e=>`Unknown filter operator "${e}".`,badValue:"The filter value is not valid for this column.",filtered:e=>`Filter applied: ${e} row(s) match.`,filtersCleared:"All filters cleared.",sorted:(e,t)=>`Sorted by ${e} (${t==="asc"?"ascending":"descending"}).`,sortCleared:"Sorting cleared.",internal:"Something went wrong while running this action."},te:{found:e=>`${e} \u0C35\u0C30\u0C41\u0C38(\u0C32\u0C41) \u0C26\u0C4A\u0C30\u0C3F\u0C15\u0C3E\u0C2F\u0C3F.`,count:e=>`\u0C2E\u0C4A\u0C24\u0C4D\u0C24\u0C02 ${e} \u0C35\u0C30\u0C41\u0C38\u0C32\u0C41.`,columns:"\u0C15\u0C3E\u0C32\u0C2E\u0C4D\u200C\u0C32 \u0C35\u0C3F\u0C35\u0C30\u0C3E\u0C32\u0C41.",rowFound:"\u0C35\u0C30\u0C41\u0C38 \u0C26\u0C4A\u0C30\u0C3F\u0C15\u0C3F\u0C02\u0C26\u0C3F.",notFound:e=>`"${e}" \u0C35\u0C30\u0C41\u0C38 \u0C26\u0C4A\u0C30\u0C15\u0C32\u0C47\u0C26\u0C41.`,noneFound:"\u0C07\u0C1A\u0C4D\u0C1A\u0C3F\u0C28 \u0C35\u0C30\u0C41\u0C38\u0C32\u0C47\u0C35\u0C40 \u0C26\u0C4A\u0C30\u0C15\u0C32\u0C47\u0C26\u0C41.",highlighted:e=>`${e} \u0C35\u0C30\u0C41\u0C38(\u0C32\u0C41) \u0C39\u0C48\u0C32\u0C48\u0C1F\u0C4D \u0C1A\u0C47\u0C36\u0C3E\u0C28\u0C41.`,selected:e=>`"${e}" \u0C0E\u0C02\u0C1A\u0C41\u0C15\u0C41\u0C28\u0C4D\u0C28\u0C3E\u0C28\u0C41.`,opened:e=>`"${e}" \u0C24\u0C46\u0C30\u0C3F\u0C1A\u0C3E\u0C28\u0C41.`,notSupported:e=>`\u0C08 \u0C2A\u0C1F\u0C4D\u0C1F\u0C3F\u0C15\u0C32\u0C4B "${e}" \u0C38\u0C4C\u0C15\u0C30\u0C4D\u0C2F\u0C02 \u0C32\u0C47\u0C26\u0C41.`,emptyQuery:"\u0C35\u0C46\u0C24\u0C15\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C0F\u0C26\u0C48\u0C28\u0C3E \u0C30\u0C3E\u0C2F\u0C02\u0C21\u0C3F.",noIds:"\u0C35\u0C30\u0C41\u0C38 ID\u0C32\u0C41 \u0C07\u0C35\u0C4D\u0C35\u0C32\u0C47\u0C26\u0C41.",unknownColumn:e=>`"${e}" \u0C05\u0C28\u0C47 \u0C15\u0C3E\u0C32\u0C2E\u0C4D \u0C32\u0C47\u0C26\u0C41.`,badOperator:e=>`"${e}" \u0C05\u0C28\u0C47 \u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D \u0C35\u0C3F\u0C27\u0C3E\u0C28\u0C02 \u0C32\u0C47\u0C26\u0C41.`,badValue:"\u0C08 \u0C15\u0C3E\u0C32\u0C2E\u0C4D\u200C\u0C15\u0C3F \u0C08 \u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D \u0C35\u0C3F\u0C32\u0C41\u0C35 \u0C38\u0C30\u0C3F\u0C2A\u0C4B\u0C26\u0C41.",filtered:e=>`\u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D \u0C35\u0C47\u0C36\u0C3E\u0C28\u0C41: ${e} \u0C35\u0C30\u0C41\u0C38\u0C32\u0C41 \u0C38\u0C30\u0C3F\u0C2A\u0C4B\u0C2F\u0C3E\u0C2F\u0C3F.`,filtersCleared:"\u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D\u0C32\u0C28\u0C4D\u0C28\u0C40 \u0C24\u0C40\u0C38\u0C47\u0C36\u0C3E\u0C28\u0C41.",sorted:(e,t)=>`${e} \u0C2A\u0C4D\u0C30\u0C15\u0C3E\u0C30\u0C02 \u0C15\u0C4D\u0C30\u0C2E\u0C02 (${t==="asc"?"\u0C06\u0C30\u0C4B\u0C39\u0C23":"\u0C05\u0C35\u0C30\u0C4B\u0C39\u0C23"}).`,sortCleared:"\u0C15\u0C4D\u0C30\u0C2E\u0C02 \u0C24\u0C40\u0C38\u0C47\u0C36\u0C3E\u0C28\u0C41.",internal:"\u0C08 \u0C2A\u0C28\u0C3F \u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C21\u0C17\u0C3E \u0C38\u0C2E\u0C38\u0C4D\u0C2F \u0C35\u0C1A\u0C4D\u0C1A\u0C3F\u0C02\u0C26\u0C3F."}};function we(e){return Ni[e.locale??"en"]}function Te(e,t){return{success:!0,message:e,data:t}}function re(e,t){return{success:!1,message:t,error:{code:e}}}var Uo=["contains","equals","startsWith","endsWith","greaterThan","lessThan","between"];function Ve(e,t="id"){let n=e?.[t];return n==null?"":String(n)}function ze(e){return String(e??"").normalize("NFC").toLowerCase().trim()}function jo(e){if(typeof e=="number")return Number.isFinite(e)?e:null;let t=String(e??"").trim();if(t==="")return null;let n=Number(t);return Number.isFinite(n)?n:null}function Vo(e){if(e instanceof Date)return e.getTime();let t=new Date(String(e??"")).getTime();return Number.isFinite(t)?t:null}function Yo(e){return(Array.isArray(e)?e:typeof e=="string"?e.split(","):[]).map(n=>String(n).trim()).filter(Boolean)}function Qt(e,t){let n=ze(t);return e.columns.find(o=>ze(o.key)===n||ze(o.label)===n)}function Et(e,t){return e.data.find(n=>Ve(n,e.rowKey)===t)}function Mi(e,t){return e[t]}function Pi(e,t,n){let o=Mi(e,n.key),r=n.type??"text";if(r==="number"||r==="date"){let s=r==="number"?jo:Vo,l=s(o);if(l===null)return!1;if(t.operator==="between"){let[g,y]=t.value,M=s(g),_=s(y);return M!==null&&_!==null&&l>=Math.min(M,_)&&l<=Math.max(M,_)}let p=s(t.value);if(p===null)return!1;switch(t.operator){case"equals":return l===p;case"greaterThan":return l>p;case"lessThan":return l<p;default:break}}let a=ze(o),i=ze(t.value);switch(t.operator){case"equals":return a===i;case"startsWith":return a.startsWith(i);case"endsWith":return a.endsWith(i);case"contains":return a.includes(i);default:return!1}}function Gi(e,t){let n=t.type??"text",o=n==="date"?Vo:jo;return e.operator==="between"?n==="text"||!Array.isArray(e.value)||e.value.length!==2?!1:o(e.value[0])!==null&&o(e.value[1])!==null:e.operator==="greaterThan"||e.operator==="lessThan"?n!=="text"&&o(e.value)!==null:!Array.isArray(e.value)&&String(e.value).trim()!==""}function Ye(e,t,n){return n.length?Xo({data:e,columns:t},n):e}function Xe(e){return e.map(t=>({key:String(t.key),label:t.label,type:t.type==="number"?"number":t.type==="date"?"date":"text"}))}function Xo(e,t){return e.data.filter(n=>t.every(o=>{let r=Qt(e,o.key);return r?Pi(n,o,r):!0}))}function Zt(e,t){let n=we(e),o=ze(t);if(!o)return re("INVALID_INPUT",n.emptyQuery);let r=e.data.filter(i=>e.columns.some(s=>ze(i[s.key]).includes(o))),a=r.map(i=>Ve(i,e.rowKey)).filter(Boolean);return e.onHighlightRows?.(a),Te(n.found(r.length),r)}function Jt(e){return Te(we(e).count(e.data.length),e.data.length)}function en(e){return Te(we(e).columns,e.columns)}function tn(e,t){let n=we(e),o=String(t??"").trim();if(!o)return re("INVALID_INPUT",n.noIds);let r=Et(e,o);return r?Te(n.rowFound,r):re("NOT_FOUND",n.notFound(o))}function nn(e,t){let n=we(e),o=Yo(t);if(o.length===0)return re("INVALID_INPUT",n.noIds);if(!e.onHighlightRows)return re("NOT_SUPPORTED",n.notSupported("highlight"));let r=o.filter(a=>Et(e,a)!==void 0);return r.length===0?re("NOT_FOUND",n.noneFound):(e.onHighlightRows(r),Te(n.highlighted(r.length),r))}function on(e,t){let n=we(e),o=String(t??"").trim();return o?e.onSelectRow?Et(e,o)?(e.onSelectRow(o),Te(n.selected(o),o)):re("NOT_FOUND",n.notFound(o)):re("NOT_SUPPORTED",n.notSupported("select")):re("INVALID_INPUT",n.noIds)}function rn(e,t){let n=we(e),o=String(t??"").trim();return o?e.onOpenRow?Et(e,o)?(e.onOpenRow(o),Te(n.opened(o),o)):re("NOT_FOUND",n.notFound(o)):re("NOT_SUPPORTED",n.notSupported("open")):re("INVALID_INPUT",n.noIds)}function an(e,t){let n=we(e),o=Qt(e,t?.key??"");if(!o)return re("INVALID_INPUT",n.unknownColumn(String(t?.key??"")));if(!Uo.includes(t.operator))return re("INVALID_INPUT",n.badOperator(String(t.operator)));let r={...t,key:o.key};if(!Gi(r,o))return re("INVALID_INPUT",n.badValue);if(!e.onFiltersChange)return re("NOT_SUPPORTED",n.notSupported("filter"));let a=[...(e.filters??[]).filter(s=>s.key!==o.key),r],i=Xo(e,a).length;return e.onFiltersChange(a),Te(n.filtered(i),{filters:a,count:i})}function sn(e){let t=we(e);return e.onFiltersChange?(e.onFiltersChange([]),Te(t.filtersCleared,[])):re("NOT_SUPPORTED",t.notSupported("clear filters"))}function ln(e,t,n="asc"){let o=we(e),r=Qt(e,t);if(!r)return re("INVALID_INPUT",o.unknownColumn(String(t)));if(n!=="asc"&&n!=="desc")return re("INVALID_INPUT",o.badValue);if(!e.onSortChange)return re("NOT_SUPPORTED",o.notSupported("sort"));let a={key:r.key,direction:n};return e.onSortChange(a),Te(o.sorted(r.label,n),a)}function cn(e){let t=we(e);return e.onSortChange?(e.onSortChange(null),Te(t.sortCleared,null)):re("NOT_SUPPORTED",t.notSupported("clear sort"))}var Fi={search:"Search all columns for text. Matching rows are highlighted.",count:"Count the rows currently in the grid.",columns:"List the grid's columns with their keys, labels and types.",get_row:"Get one row by its ID.",highlight:"Highlight one or more rows by ID without filtering the grid.",select:"Select one row by ID.",open:"Open one row by ID to show its full details.",filter:"Filter the grid by one column. Replaces any existing filter on that column.",clear_filters:"Remove all filters.",sort:"Sort the grid by one column, ascending or descending.",clear_sort:"Remove sorting."},qo={en:{search:"Search",count:"Count",columns:"Columns",get_row:"Get row",highlight:"Highlight",select:"Select",open:"Open",filter:"Filter",clear_filters:"Clear filters",sort:"Sort",clear_sort:"Clear sort"},te:{search:"\u0C35\u0C46\u0C24\u0C41\u0C15\u0C41",count:"\u0C32\u0C46\u0C15\u0C4D\u0C15",columns:"\u0C15\u0C3E\u0C32\u0C2E\u0C4D\u200C\u0C32\u0C41",get_row:"\u0C35\u0C30\u0C41\u0C38 \u0C1A\u0C42\u0C2A\u0C41",highlight:"\u0C39\u0C48\u0C32\u0C48\u0C1F\u0C4D",select:"\u0C0E\u0C02\u0C1A\u0C41\u0C15\u0C4B",open:"\u0C24\u0C46\u0C30\u0C41\u0C35\u0C41",filter:"\u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D",clear_filters:"\u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D\u0C32\u0C41 \u0C24\u0C40\u0C38\u0C47\u0C2F\u0C3F",sort:"\u0C15\u0C4D\u0C30\u0C2E\u0C02",clear_sort:"\u0C15\u0C4D\u0C30\u0C2E\u0C02 \u0C24\u0C40\u0C38\u0C47\u0C2F\u0C3F"}};async function zi(e,t){try{return t()}catch{return re("INTERNAL",we(e).internal)}}function Ke(e,t={}){let n=t.name??"yuktai_grid",o=qo[e.locale??"en"],r=l=>t.descriptions?.[l]??Fi[l],a={id:{type:"string",description:"Row ID"}},i=e.columns.map(l=>l.key);return[{id:"search",available:!0,schema:{type:"object",properties:{query:{type:"string"}},required:["query"]},run:l=>Zt(e,String(l.query??""))},{id:"count",available:!0,schema:{type:"object",properties:{}},run:()=>Jt(e)},{id:"columns",available:!0,schema:{type:"object",properties:{}},run:()=>en(e)},{id:"get_row",available:!0,schema:{type:"object",properties:a,required:["id"]},run:l=>tn(e,String(l.id??""))},{id:"highlight",available:!!e.onHighlightRows,schema:{type:"object",properties:{ids:{type:"array",items:{type:"string"},description:"Row IDs"}},required:["ids"]},run:l=>nn(e,Yo(l.ids))},{id:"select",available:!!e.onSelectRow,schema:{type:"object",properties:a,required:["id"]},run:l=>on(e,String(l.id??""))},{id:"open",available:!!e.onOpenRow,schema:{type:"object",properties:a,required:["id"]},run:l=>rn(e,String(l.id??""))},{id:"filter",available:!!e.onFiltersChange,schema:{type:"object",properties:{key:{type:"string",enum:i},operator:{type:"string",enum:Uo},value:{description:"Text or number; for 'between' an array of two numbers or dates"}},required:["key","operator","value"]},run:l=>an(e,{key:String(l.key??""),operator:String(l.operator??""),value:l.value})},{id:"clear_filters",available:!!e.onFiltersChange,schema:{type:"object",properties:{}},run:()=>sn(e)},{id:"sort",available:!!e.onSortChange,schema:{type:"object",properties:{key:{type:"string",enum:i},direction:{type:"string",enum:["asc","desc"]}},required:["key"]},run:l=>ln(e,String(l.key??""),l.direction==="desc"?"desc":"asc")},{id:"clear_sort",available:!!e.onSortChange,schema:{type:"object",properties:{}},run:()=>cn(e)}].filter(l=>l.available).map(l=>({name:`${n}_${l.id}`,title:qo.en[l.id],description:r(l.id),label:o[l.id],inputSchema:l.schema,execute:p=>zi(e,()=>l.run(p??{}))}))}var $i={en:{done:"Done.",toolMissing:e=>`The action "${e}" is not available here.`,missingInput:e=>`Missing: ${e}.`,notUnderstood:"Sorry, I didn't understand. Try: a word to search, \u201Csort by <column>\u201D, or \u201Cclear filters\u201D.",noMatch:e=>`Nothing matched "${e}".`,failed:"Something went wrong while running this action."},te:{done:"\u0C2A\u0C42\u0C30\u0C4D\u0C24\u0C2F\u0C3F\u0C02\u0C26\u0C3F.",toolMissing:e=>`"${e}" \u0C38\u0C4C\u0C15\u0C30\u0C4D\u0C2F\u0C02 \u0C07\u0C15\u0C4D\u0C15\u0C21 \u0C05\u0C02\u0C26\u0C41\u0C2C\u0C3E\u0C1F\u0C41\u0C32\u0C4B \u0C32\u0C47\u0C26\u0C41.`,missingInput:e=>`\u0C07\u0C35\u0C3F \u0C15\u0C3E\u0C35\u0C3E\u0C32\u0C3F: ${e}.`,notUnderstood:"\u0C15\u0C4D\u0C37\u0C2E\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F, \u0C05\u0C30\u0C4D\u0C25\u0C02 \u0C15\u0C3E\u0C32\u0C47\u0C26\u0C41. \u0C07\u0C32\u0C3E \u0C2A\u0C4D\u0C30\u0C2F\u0C24\u0C4D\u0C28\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F: \u0C35\u0C46\u0C24\u0C15\u0C3E\u0C32\u0C4D\u0C38\u0C3F\u0C28 \u0C2A\u0C26\u0C02, \u201C<\u0C15\u0C3E\u0C32\u0C2E\u0C4D> \u0C2A\u0C4D\u0C30\u0C15\u0C3E\u0C30\u0C02 \u0C15\u0C4D\u0C30\u0C2E\u0C02\u201D, \u0C32\u0C47\u0C26\u0C3E \u201C\u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D\u0C32\u0C41 \u0C24\u0C40\u0C38\u0C47\u0C2F\u0C3F\u201D.",noMatch:e=>`"${e}" \u0C15\u0C3F \u0C0F\u0C2E\u0C40 \u0C38\u0C30\u0C3F\u0C2A\u0C4B\u0C32\u0C47\u0C26\u0C41.`,failed:"\u0C08 \u0C2A\u0C28\u0C3F \u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C21\u0C17\u0C3E \u0C38\u0C2E\u0C38\u0C4D\u0C2F \u0C35\u0C1A\u0C4D\u0C1A\u0C3F\u0C02\u0C26\u0C3F."}},Ko=e=>e.normalize("NFC").toLowerCase().trim(),Pe={clearFilters:/\b(clear|remove|reset)\b.*\bfilters?\b|ఫిల్టర్.*(తీసే|తొలగ)/i,clearSort:/\b(clear|remove|reset)\b.*\bsort(ing)?\b|క్రమం.*(తీసే|తొలగ)/i,count:/^\s*(how many|count)\b|ఎన్ని|లెక్క/i,sort:/\bsort\b|\border by\b|క్రమ|అమర్చ|సార్ట్/i,desc:/\b(desc|descending|z\s*-\s*a|highest|largest|most)\b|అవరోహణ|తగ్గే|పెద్ద|అధిక|చివర|ఎక్కువ నుండి/i,openEn:/^\s*open\s+(.+?)\s*$/i,openTe:/^\s*(.+?)\s*(తెరువు|తెరవండి|తెరవు)\s*$/,searchFiller:/^\s*(search(\s+for)?|find|show(\s+me)?|filter(\s+by)?|look\s+for|వెతుకు|వెతకండి|శోధించు|శోధించండి|చూపించు|చూపించండి)\s+|\s+(వెతుకు|వెతకండి|శోధించు|శోధించండి|చూపించు|చూపించండి)\s*$/gi};function Oi(e,t){let n=Ko(e),o=null;for(let r of t)for(let a of[r.label,r.key]){let i=Ko(a);i&&n.includes(i)&&(!o||i.length>o.len)&&(o={key:r.key,len:i.length})}return o?.key??null}function dn(e,t){let n=(e??"").trim();if(!n)return null;if(Pe.clearFilters.test(n))return{kind:"tool",tool:"clear_filters",input:{}};if(Pe.clearSort.test(n))return{kind:"tool",tool:"clear_sort",input:{}};if(Pe.count.test(n))return{kind:"tool",tool:"count",input:{}};if(Pe.sort.test(n)){let a=Oi(n,t.columns);return a?{kind:"tool",tool:"sort",input:{key:a,direction:Pe.desc.test(n)?"desc":"asc"}}:null}let o=n.match(Pe.openEn)??n.match(Pe.openTe);if(o?.[1])return{kind:"open",text:o[1].trim()};let r=n.replace(Pe.searchFiller,"").trim();return r?{kind:"tool",tool:"search",input:{query:r}}:null}function Wi(e){return!!e&&typeof e=="object"&&typeof e.success=="boolean"&&typeof e.message=="string"}function Hi(e,t){let n=e.inputSchema?.required;return Array.isArray(n)?n.map(String).filter(o=>t[o]===void 0||t[o]===null||String(t[o]).trim()===""):[]}function Di(e,t){let n=e.find(r=>r.name===t);if(n)return n;let o=e.filter(r=>r.name.endsWith(`_${t}`)).sort((r,a)=>r.name.length-a.name.length);if(o.length!==0&&!(o.length>1&&o[0].name.length===o[1].name.length))return o[0]}function Qo(e){return e.normalize("NFC").trim().toLocaleLowerCase()}function _i(e,t){let n=Qo(e);return t.find(o=>o.phrases.some(r=>{let a=Qo(r);return a.length>0&&n.includes(a)}))}function at({tools:e,data:t=[],onResult:n,onError:o,locale:r="en",columns:a=[],rowKey:i="id",parseIntent:s,customRules:l=[],historyLimit:p=20}){let g=$i[r],[y,M]=(0,de.useState)(0),[_,z]=(0,de.useState)(null),[L,A]=(0,de.useState)(null),[H,v]=(0,de.useState)([]),E=(0,de.useRef)({tools:e,data:t,onResult:n,onError:o,columns:a,rowKey:i,parseIntent:s,customRules:l,historyLimit:p,m:g,locale:r});E.current={tools:e,data:t,onResult:n,onError:o,columns:a,rowKey:i,parseIntent:s,customRules:l,historyLimit:p,m:g,locale:r};let N=(0,de.useRef)(!0),x=(0,de.useRef)(0);(0,de.useEffect)(()=>(N.current=!0,()=>{N.current=!1}),[]);let $=(0,de.useCallback)((J,T,d,ee,q)=>{N.current&&(q===x.current&&z(d),v(j=>[...j,{id:q,tool:J,input:T,result:d,source:ee,at:Date.now()}].slice(-E.current.historyLimit)))},[]),S=(0,de.useCallback)(async(J,T,d)=>{let{tools:ee,onResult:q,onError:j,m:te}=E.current,se=++x.current,R=Di(ee,J);if(!R){let f={success:!1,message:te.toolMissing(J),error:{code:"NOT_SUPPORTED"}},C=new Error(f.message);return N.current&&A(C),j?.(C),$(J,T,f,d,se),f}let F=Hi(R,T);if(F.length){let f={success:!1,message:te.missingInput(F.join(", ")),error:{code:"INVALID_INPUT"},tool:R.name};return $(R.name,T,f,d,se),q?.(f),f}N.current&&M(f=>f+1);try{let f=await R.execute(T),C=Wi(f)?{...f,tool:R.name}:{success:!0,message:te.done,data:f,tool:R.name};return N.current&&C.success&&A(null),$(R.name,T,C,d,se),q?.(C),C}catch(f){let C=f instanceof Error?f:new Error(String(f)),Y={success:!1,message:te.failed,error:{code:"INTERNAL"},tool:R.name};return N.current&&A(C),j?.(C),$(R.name,T,Y,d,se),Y}finally{N.current&&M(f=>Math.max(0,f-1))}},[$]),D=(0,de.useCallback)((J,T={})=>S(J,T??{},"tool"),[S]),le=(0,de.useCallback)(async J=>{let{columns:T,locale:d,parseIntent:ee,customRules:q,data:j,m:te,rowKey:se}=E.current,R=_i(J,q??[]);if(R){let G={input:J,data:j,columns:T,executeTool:D};try{let ce={success:!0,message:await R.execute(G),tool:`rule:${R.name}`};return $(`rule:${R.name}`,{text:J},ce,"ask",++x.current),E.current.onResult?.(ce),ce}catch(ie){let ce=ie instanceof Error?ie:new Error(String(ie)),be={success:!1,message:te.failed,error:{code:"INTERNAL"},tool:`rule:${R.name}`};return N.current&&A(ce),E.current.onError?.(ce),$(`rule:${R.name}`,{text:J},be,"ask",++x.current),be}}let f=(ee??dn)(J,{columns:T,locale:d});if(!f){let G={success:!1,message:te.notUnderstood,error:{code:"NOT_UNDERSTOOD"}};return $("ask",{text:J},G,"ask",++x.current),G}if(f.kind==="tool")return S(f.tool,f.input,"ask");let C=await S("search",{query:f.text},"ask"),Y=Array.isArray(C.data)?C.data:[];if(!C.success)return C;if(Y.length===0){let G={success:!1,message:te.noMatch(f.text),error:{code:"NOT_FOUND"},tool:C.tool};return $("open",{text:f.text},G,"ask",++x.current),G}return S("open",{id:Ve(Y[0],se)},"ask")},[D,$,S]),V=(0,de.useCallback)(()=>{v([]),z(null),A(null)},[]);return{loading:y>0,tools:e,executeTool:D,ask:le,lastResult:_,lastError:L,history:H,clearHistory:V}}var Zo=at;h();var Ge=require("react");function Bi(e){return JSON.stringify(e.map(t=>[t.name,t.title,t.description,t.inputSchema]))}function qi({tools:e,data:t=[],columns:n=[],rowKey:o,locale:r,onSelectRow:a,onHighlightRows:i,onOpenRow:s,name:l="yuktai_grid",descriptions:p,onStatusChange:g}){let y=(0,Ge.useMemo)(()=>e||Ke({data:t,columns:n,rowKey:o,locale:r,onSelectRow:a,onHighlightRows:i,onOpenRow:s},{name:l,descriptions:p}),[e,t,n,o,r,a,i,s,l,p]),M=(0,Ge.useRef)(y);M.current=y;let _=(0,Ge.useRef)(g);_.current=g;let z=(0,Ge.useRef)(Promise.resolve()),L=Bi(y);return(0,Ge.useEffect)(()=>{let A=x=>_.current?.(x),H=typeof document<"u"?document.modelContext:void 0;if(!H?.registerTool){A({state:"unsupported",registered:[],errors:[]});return}let v=new AbortController,E=M.current,N=z.current.then(async()=>{if(v.signal.aborted)return;A({state:"registering",registered:[],errors:[]});let x=[],$=[];for(let S of E){if(v.signal.aborted)return;try{await H.registerTool({name:S.name,title:S.title,description:S.description,inputSchema:S.inputSchema,execute:D=>{let le=M.current.find(V=>V.name===S.name);return le?le.execute(D??{}):{success:!1,message:`Tool "${S.name}" is no longer available.`,error:{code:"NOT_SUPPORTED"}}}},{signal:v.signal}),x.push(S.name)}catch(D){$.push({tool:S.name,message:D instanceof Error?D.message:String(D)})}}v.signal.aborted||A({state:$.length===0?"ready":x.length>0?"partial":"error",registered:x,errors:$})});return z.current=N.catch(()=>{}),()=>v.abort()},[L]),null}var st=qi;var w=require("react/jsx-runtime"),Ui={"en-US":{search:"Search...",searchAria:"Search grid",rows:"rows",row:"row",loading:"Loading...",noData:"No data found.",selectRow:"Select row",pageSize:"Page size",page:"Page",of:"of",previous:"Previous",next:"Next",yes:"Yes",no:"No",sortAscending:"Sort ascending",sortDescending:"Sort descending",filtersActive:e=>`${e} filter(s) applied`,clearFilters:"Clear filters"},"te-IN":{search:"\u0C36\u0C4B\u0C27\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F...",searchAria:"\u0C17\u0C4D\u0C30\u0C3F\u0C21\u0C4D\u200C\u0C32\u0C4B \u0C36\u0C4B\u0C27\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F",rows:"\u0C35\u0C30\u0C41\u0C38\u0C32\u0C41",row:"\u0C35\u0C30\u0C41\u0C38",loading:"\u0C32\u0C4B\u0C21\u0C4D \u0C05\u0C35\u0C41\u0C24\u0C4B\u0C02\u0C26\u0C3F...",noData:"\u0C21\u0C47\u0C1F\u0C3E \u0C15\u0C28\u0C2C\u0C21\u0C32\u0C47\u0C26\u0C41.",selectRow:"\u0C35\u0C30\u0C41\u0C38\u0C28\u0C41 \u0C0E\u0C02\u0C1A\u0C41\u0C15\u0C4B\u0C02\u0C21\u0C3F",pageSize:"\u0C2A\u0C47\u0C1C\u0C40 \u0C2A\u0C30\u0C3F\u0C2E\u0C3E\u0C23\u0C02",page:"\u0C2A\u0C47\u0C1C\u0C40",of:"\u0C32\u0C4B",previous:"\u0C35\u0C46\u0C28\u0C41\u0C15\u0C15\u0C41",next:"\u0C2E\u0C41\u0C02\u0C26\u0C41\u0C15\u0C41",yes:"\u0C05\u0C35\u0C41\u0C28\u0C41",no:"\u0C15\u0C3E\u0C26\u0C41",sortAscending:"\u0C06\u0C30\u0C4B\u0C39\u0C23 \u0C15\u0C4D\u0C30\u0C2E\u0C02\u0C32\u0C4B \u0C05\u0C2E\u0C30\u0C4D\u0C1A\u0C02\u0C21\u0C3F",sortDescending:"\u0C05\u0C35\u0C30\u0C4B\u0C39\u0C23 \u0C15\u0C4D\u0C30\u0C2E\u0C02\u0C32\u0C4B \u0C05\u0C2E\u0C30\u0C4D\u0C1A\u0C02\u0C21\u0C3F",filtersActive:e=>`${e} \u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D(\u0C32\u0C41) \u0C35\u0C47\u0C36\u0C3E\u0C30\u0C41`,clearFilters:"\u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D\u0C32\u0C41 \u0C24\u0C40\u0C38\u0C47\u0C2F\u0C02\u0C21\u0C3F"}};function ji({size:e=20,color:t="currentColor",strokeWidth:n=2.4}){return(0,w.jsxs)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:n,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,w.jsx)("circle",{cx:"11",cy:"11",r:"6.5"}),(0,w.jsx)("path",{d:"m16 16 5 5"})]})}function Vi({size:e=18,color:t="currentColor",strokeWidth:n=2.4,label:o}){return(0,w.jsxs)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:n,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":o?void 0:!0,"aria-label":o,role:o?"img":void 0,children:[o?(0,w.jsx)("title",{children:o}):null,(0,w.jsx)("path",{d:"m6 15 6-6 6 6"})]})}function Yi({size:e=18,color:t="currentColor",strokeWidth:n=2.4,label:o}){return(0,w.jsxs)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:n,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":o?void 0:!0,"aria-label":o,role:o?"img":void 0,children:[o?(0,w.jsx)("title",{children:o}):null,(0,w.jsx)("path",{d:"m6 9 6 6 6-6"})]})}function Xi({size:e=20,color:t="currentColor",strokeWidth:n=2.4}){return(0,w.jsx)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:n,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,w.jsx)("path",{d:"m15 18-6-6 6-6"})})}function Ki({size:e=20,color:t="currentColor",strokeWidth:n=2.4}){return(0,w.jsx)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:n,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,w.jsx)("path",{d:"m9 18 6-6-6-6"})})}function Jo({size:e=18,color:t="currentColor",strokeWidth:n=2.4}){return(0,w.jsx)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:n,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,w.jsx)("path",{d:"m5 12 4 4L19 6"})})}function er({data:e,columns:t,rowKey:n="id",view:o="auto",mobileBreakpoint:r=768,theme:a="default",locale:i="en-US",ai:s=!1,search:l=!0,selectable:p=!1,selectedKeys:g=[],onSelectionChange:y,pagination:M,loading:_=!1,highlightIds:z=[],highlightColor:L="#fff3a3",autoScrollToHighlight:A=!1,onRowClick:H,onSortChange:v,empty:E,className:N="",inputLanguage:x,toolName:$="yuktai_grid",toolDescriptions:S,webmcp:D=!1,onWebMCPStatusChange:le,onAgentResult:V,customRules:J=[]}){let T=i==="te-IN"?"te-IN":"en-US",d=Ui[T],ee=s===!0||typeof s=="object"&&s!==null,q=M!==!1&&M!==void 0,j=typeof M=="object"?M.pageSize??20:20,te=typeof M=="object"&&M.sizeOptions&&M.sizeOptions.length>0?M.sizeOptions:[10,20,50,100],[se,R]=(0,oe.useState)(""),[F,f]=(0,oe.useState)(1),[C,Y]=(0,oe.useState)(j),[G,ie]=(0,oe.useState)(),[ce,be]=(0,oe.useState)("asc"),[Ce,wn]=(0,oe.useState)(!1),[he,$e]=(0,oe.useState)([]),[Qe,pt]=(0,oe.useState)([]),Re=(0,oe.useMemo)(()=>Xe(t.map(u=>({key:String(u.key),label:u.label,type:u.type}))),[t]);(0,oe.useEffect)(()=>{Y(j),f(1)},[j]),(0,oe.useEffect)(()=>{let u=()=>{wn(window.innerWidth<=r)};return u(),window.addEventListener("resize",u),()=>{window.removeEventListener("resize",u)}},[r]);let me=(0,oe.useMemo)(()=>{let u=[...e];if(se.trim()){let I=se.trim().toLowerCase();u=u.filter(U=>t.some(O=>String(U[O.key]??"").toLowerCase().includes(I)))}return he.length&&(u=Ye(u,Re,he)),G&&u.sort((I,U)=>{let O=I[G],ye=U[G];if(O==null&&ye==null)return 0;if(O==null)return 1;if(ye==null)return-1;if(typeof O=="number"&&typeof ye=="number")return ce==="asc"?O-ye:ye-O;let pe=String(O).localeCompare(String(ye),i,{numeric:!0,sensitivity:"base"});return ce==="asc"?pe:-pe}),u},[e,t,se,he,Re,G,ce,i]),Ee=q?Math.max(1,Math.ceil(me.length/C)):1;(0,oe.useEffect)(()=>{F>Ee&&f(Ee)},[F,Ee]);let Ze=(0,oe.useMemo)(()=>{let u=[...z.map(String),...Qe];return Array.from(new Set(u))},[z,Qe]);(0,oe.useEffect)(()=>{if(!A)return;let u=Ze[0];if(u==null)return;let I=typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(String(u)):String(u).replace(/["\\]/g,"\\$&");document.querySelector(`[data-yuktai-row-id="${I}"]`)?.scrollIntoView({behavior:"smooth",block:"center"})},[Ze,A,F]);let Fe=(0,oe.useMemo)(()=>{if(!q)return me;let u=(F-1)*C;return me.slice(u,u+C)},[me,q,F,C]),Oe=o==="card"||o==="auto"&&Ce,Le=u=>String(u[n]??""),We=u=>g.some(I=>String(I)===u),ft=u=>Ze.some(I=>String(I)===u),b=u=>{if(!p)return;let I=Le(u),U=We(I)?g.filter(O=>String(O)!==I):[...g,I];y?.(U)},Z=u=>{if(u.sortable===!1)return;let I=String(u.key),U=G===I&&ce==="asc"?"desc":"asc";ie(I),be(U),f(1),v?.({key:I,direction:U})},Ae=u=>{R(u),f(1)},It=(u,I)=>{let U=t.find(O=>String(O.key)===u||O.label.toLowerCase()===u.toLowerCase());U&&(ie(String(U.key)),be(I),f(1),v?.({key:String(U.key),direction:I}))},Rt=T==="te-IN"?"te":"en",kn=(0,oe.useCallback)(u=>{u?(ie(u.key),be(u.direction)):(ie(void 0),be("asc")),f(1),v?.(u)},[v]),Sn=(0,oe.useCallback)(u=>{$e(u),f(1)},[]),Tn=(0,oe.useCallback)(u=>{if(pt(u),q&&u.length){let I=me.findIndex(U=>String(U[n]??"")===u[0]);I>=0&&f(Math.floor(I/C)+1)}},[q,me,n,C]),Lt=(0,oe.useMemo)(()=>Ke({data:e,columns:Re,rowKey:String(n),locale:Rt,filters:he,onHighlightRows:Tn,onFiltersChange:Sn,onSortChange:kn,onOpenRow:H?u=>{let I=me.findIndex(O=>String(O[n]??"")===u),U=I>=0?me[I]:e.find(O=>String(O[n]??"")===u);U&&H(U,Math.max(I,0))}:void 0,onSelectRow:p&&y?u=>{g.some(I=>String(I)===u)||y([...g.map(String),u])}:void 0},{name:$,descriptions:S}),[e,Re,n,Rt,he,Tn,Sn,kn,H,me,p,y,g,$,S]),gt=at({tools:Lt,data:e,locale:Rt,columns:Re,rowKey:String(n),customRules:J,onResult:V}),An=(0,oe.useMemo)(()=>Lt.map(u=>({...u,execute:I=>gt.executeTool(u.name,I)})),[Lt,gt.executeTool]),cr=()=>{$e([]),f(1)},Cn=(u,I,U)=>{if(I.render)return I.render(u[I.key],u,U);let O=u[I.key];if(O==null)return"";if(I.type==="date"){let ye=new Date(String(O));if(!Number.isNaN(ye.getTime()))return ye.toLocaleDateString(i)}return I.type==="boolean"?O?d.yes:d.no:String(O)},K=a==="dark",En={width:"100%",overflow:"hidden",border:a==="high-contrast"?"2px solid #000000":K?"1px solid #334155":"1px solid #e2e8f0",borderRadius:12,background:K?"#0f172a":"#ffffff",color:K?"#f8fafc":"#0f172a",fontFamily:a==="dyslexia"?"Arial, sans-serif":void 0},dr={padding:12,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",borderBottom:K?"1px solid #334155":"1px solid #e2e8f0"},In=u=>({width:40,height:40,minWidth:40,display:"inline-flex",alignItems:"center",justifyContent:"center",padding:0,borderRadius:8,border:K?"1px solid #475569":"1px solid #cbd5e1",background:u?K?"#1e293b":"#f8fafc":K?"#1e293b":"#ffffff",color:u?"#94a3b8":K?"#f8fafc":"#0f172a",cursor:u?"not-allowed":"pointer",opacity:u?.55:1});if(_)return(0,w.jsxs)("div",{className:N,style:En,children:[D&&(0,w.jsx)(st,{tools:An,onStatusChange:le}),(0,w.jsx)("div",{style:{padding:32,textAlign:"center"},children:d.loading})]});let ur=t.map(u=>({key:String(u.key),label:u.label,type:u.type==="number"?"number":u.type==="date"?"date":"text"}));return(0,w.jsxs)("div",{className:N,style:En,children:[D&&(0,w.jsx)(st,{tools:An,onStatusChange:le}),(l||ee||he.length>0)&&(0,w.jsxs)("div",{style:dr,children:[l&&(0,w.jsxs)("div",{style:{position:"relative",width:"100%",maxWidth:420},children:[(0,w.jsx)("div",{style:{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",display:"flex",alignItems:"center",color:K?"#cbd5e1":"#64748b",pointerEvents:"none"},children:(0,w.jsx)(ji,{size:19})}),(0,w.jsx)("input",{value:se,onChange:u=>{R(u.target.value),f(1)},placeholder:d.search,"aria-label":d.searchAria,style:{width:"100%",padding:"10px 12px 10px 40px",borderRadius:8,border:K?"1px solid #475569":"1px solid #cbd5e1",background:K?"#1e293b":"#ffffff",color:K?"#ffffff":"#0f172a",outline:"none",boxSizing:"border-box"}})]}),he.length>0&&(0,w.jsxs)("button",{type:"button",onClick:cr,title:d.clearFilters,style:{padding:"6px 10px",borderRadius:999,border:K?"1px solid #475569":"1px solid #cbd5e1",background:K?"#1e293b":"#f1f5f9",color:"inherit",fontSize:12,cursor:"pointer"},children:[d.filtersActive(he.length)," \u2715"]}),(0,w.jsxs)("div",{style:{marginLeft:"auto",fontSize:13,opacity:.7,whiteSpace:"nowrap"},children:[me.length," ",me.length===1?d.row:d.rows]}),ee&&(0,w.jsx)(Ct,{data:e,columns:ur,onSearch:Ae,onSort:It,theme:K?"dark":"light",language:T,inputLanguage:x??T,agent:{ask:gt.ask,loading:gt.loading},embedded:!0})]}),me.length===0?(0,w.jsx)("div",{style:{padding:40,textAlign:"center",opacity:.7},children:E??d.noData}):Oe?(0,w.jsx)("div",{style:{display:"grid",gap:12,padding:12},children:Fe.map((u,I)=>{let U=Le(u),O=We(U),ye=ft(U);return(0,w.jsxs)("div",{"data-yuktai-row-id":U,onClick:()=>H?.(u,I),style:{padding:14,borderRadius:10,border:K?"1px solid #334155":"1px solid #e2e8f0",background:ye?L:O?K?"#1e3a5f":"#eff6ff":K?"#1e293b":"#ffffff",cursor:H?"pointer":"default"},children:[p&&(0,w.jsx)("button",{type:"button",onClick:pe=>{pe.stopPropagation(),b(u)},"aria-label":`${d.selectRow} ${U}`,"aria-pressed":O,style:{width:32,height:32,display:"inline-flex",alignItems:"center",justifyContent:"center",padding:0,marginBottom:10,borderRadius:7,border:O?"1px solid #2563eb":"1px solid #cbd5e1",background:O?"#2563eb":"transparent",color:O?"#ffffff":"currentColor",cursor:"pointer"},children:O&&(0,w.jsx)(Jo,{size:17})}),t.map(pe=>(0,w.jsxs)("div",{style:{display:"flex",gap:8,padding:"5px 0",alignItems:"flex-start"},children:[(0,w.jsx)("strong",{style:{minWidth:100,opacity:.7},children:pe.label}),(0,w.jsx)("span",{children:Cn(u,pe,I)})]},String(pe.key)))]},U)})}):(0,w.jsx)("div",{style:{width:"100%",overflowX:"auto"},children:(0,w.jsxs)("table",{style:{width:"100%",borderCollapse:"collapse"},children:[(0,w.jsx)("thead",{children:(0,w.jsxs)("tr",{children:[p&&(0,w.jsx)("th",{style:{padding:10,borderBottom:K?"1px solid #334155":"1px solid #e2e8f0",width:52}}),t.filter(u=>!(Ce&&u.hiddenOnMobile)).map(u=>{let I=G===String(u.key);return(0,w.jsx)("th",{onClick:()=>Z(u),style:{padding:10,textAlign:u.align??"left",borderBottom:K?"1px solid #334155":"1px solid #e2e8f0",whiteSpace:"nowrap",cursor:u.sortable===!1?"default":"pointer",width:u.width,userSelect:"none"},children:(0,w.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:5},children:[u.label,I&&(ce==="asc"?(0,w.jsx)(Vi,{size:17,label:d.sortAscending}):(0,w.jsx)(Yi,{size:17,label:d.sortDescending}))]})},String(u.key))})]})}),(0,w.jsx)("tbody",{children:Fe.map((u,I)=>{let U=Le(u),O=We(U),ye=ft(U);return(0,w.jsxs)("tr",{"data-yuktai-row-id":U,onClick:()=>H?.(u,I),style:{background:ye?L:O?K?"#1e3a5f":"#eff6ff":"transparent",cursor:H?"pointer":"default"},children:[p&&(0,w.jsx)("td",{style:{padding:10,borderBottom:K?"1px solid #334155":"1px solid #e2e8f0"},children:(0,w.jsx)("button",{type:"button",onClick:pe=>{pe.stopPropagation(),b(u)},"aria-label":`${d.selectRow} ${U}`,"aria-pressed":O,style:{width:28,height:28,display:"inline-flex",alignItems:"center",justifyContent:"center",padding:0,borderRadius:6,border:O?"1px solid #2563eb":K?"1px solid #64748b":"1px solid #cbd5e1",background:O?"#2563eb":"transparent",color:O?"#ffffff":"currentColor",cursor:"pointer"},children:O&&(0,w.jsx)(Jo,{size:16})})}),t.filter(pe=>!(Ce&&pe.hiddenOnMobile)).map(pe=>(0,w.jsx)("td",{style:{padding:10,textAlign:pe.align??"left",borderBottom:K?"1px solid #334155":"1px solid #e2e8f0"},children:Cn(u,pe,I)},String(pe.key)))]},U)})})]})}),q&&(0,w.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap",padding:12,borderTop:K?"1px solid #334155":"1px solid #e2e8f0"},children:[(0,w.jsxs)("span",{style:{fontSize:13,opacity:.7},children:[d.page," ",F," ",d.of," ",Ee]}),(0,w.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"},children:[typeof M=="object"&&M.showSizeChanger&&(0,w.jsx)("select",{value:C,onChange:u=>{let I=Number(u.target.value);!Number.isFinite(I)||I<=0||(Y(I),f(1))},"aria-label":d.pageSize,style:{minHeight:40,padding:"7px 10px",borderRadius:8,border:K?"1px solid #475569":"1px solid #cbd5e1",background:K?"#1e293b":"#ffffff",color:K?"#ffffff":"#0f172a"},children:te.map(u=>(0,w.jsx)("option",{value:u,children:u},u))}),(0,w.jsx)("button",{type:"button",disabled:F<=1,onClick:()=>f(u=>Math.max(1,u-1)),"aria-label":d.previous,title:d.previous,style:In(F<=1),children:(0,w.jsx)(Xi,{size:20})}),(0,w.jsx)("button",{type:"button",disabled:F>=Ee,onClick:()=>f(u=>Math.min(Ee,u+1)),"aria-label":d.next,title:d.next,style:In(F>=Ee),children:(0,w.jsx)(Ki,{size:20})})]})]})]})}h();var X=require("react");function tr(e){return e===!1?Number.MAX_SAFE_INTEGER:e===!0||e===void 0?10:e.pageSize??10}function nr(e){return String(e??"").normalize("NFC").toLowerCase().trim()}function or(e){return e==null||typeof e=="string"&&e.trim()===""}function rr(e){if(typeof e=="number")return Number.isFinite(e)?e:null;let t=String(e??"").trim();if(t==="")return null;let n=Number(t);return Number.isFinite(n)?n:null}function ir(e){let t=e instanceof Date?e.getTime():new Date(String(e)).getTime();return Number.isFinite(t)?t:null}function Qi(e,t,n,o){if(n==="number"||typeof e=="number"&&typeof t=="number"){let r=rr(e),a=rr(t);if(r!==null&&a!==null)return r-a}if(n==="date"||e instanceof Date&&t instanceof Date){let r=ir(e),a=ir(t);if(r!==null&&a!==null)return r-a}return typeof e=="boolean"&&typeof t=="boolean"?e===t?0:e?1:-1:String(e).localeCompare(String(t),o,{sensitivity:"base",numeric:!0})}function ar(e){let{data:t,columns:n,pagination:o=!0,mobileBreakpoint:r=768,locale:a,initialFilters:i=[]}=e,[s,l]=(0,X.useState)(null),[p,g]=(0,X.useState)(""),[y,M]=(0,X.useState)(i),[_,z]=(0,X.useState)(1),[L,A]=(0,X.useState)(tr(o)),[H,v]=(0,X.useState)(!1),E=tr(o);(0,X.useEffect)(()=>{A(E),z(1)},[E]),(0,X.useEffect)(()=>{if(typeof window>"u")return;let f=()=>{v(window.innerWidth<=r)};return f(),window.addEventListener("resize",f),()=>window.removeEventListener("resize",f)},[r]);let N=(0,X.useMemo)(()=>Xe(n.map(f=>({key:String(f.key),label:f.label,type:f.type}))),[n]),x=(0,X.useCallback)(f=>{l(C=>!C||C.key!==f?{key:f,direction:"asc"}:C.direction==="asc"?{key:f,direction:"desc"}:null),z(1)},[]),$=(0,X.useCallback)(f=>{l(f&&f.direction?f:null),z(1)},[]),S=(0,X.useCallback)(()=>{l(null),z(1)},[]),D=(0,X.useCallback)(f=>{g(f),z(1)},[]),le=(0,X.useCallback)(f=>{M(f),z(1)},[]),V=(0,X.useCallback)(f=>{M(C=>[...C.filter(Y=>Y.key!==f.key),f]),z(1)},[]),J=(0,X.useCallback)(f=>{M(C=>C.filter(Y=>Y.key!==f)),z(1)},[]),T=(0,X.useCallback)(()=>{M([]),z(1)},[]),d=(0,X.useCallback)(f=>{A(Math.max(1,Math.floor(f)||1)),z(1)},[]),ee=(0,X.useMemo)(()=>{let f=nr(p);return f?t.filter(C=>n.some(Y=>{let G=C[Y.key];return G==null?!1:nr(G).includes(f)})):t},[t,p,n]),q=(0,X.useMemo)(()=>Ye(ee,N,y),[ee,N,y]),j=(0,X.useMemo)(()=>{if(!s||!s.direction)return q;let f=n.find(Y=>String(Y.key)===s.key),C=s.direction==="desc"?-1:1;return[...q].sort((Y,G)=>{let ie=Y[s.key],ce=G[s.key],be=or(ie),Ce=or(ce);return be&&Ce?0:be?1:Ce?-1:C*Qi(ie,ce,f?.type,a)})},[q,s,n,a]),te=Math.max(1,Math.ceil(j.length/L)),se=(0,X.useMemo)(()=>{if(o===!1)return j;let f=(_-1)*L;return j.slice(f,f+L)},[j,_,L,o]);(0,X.useEffect)(()=>{_>te&&z(te)},[_,te]);let R=(0,X.useCallback)(f=>z(Math.min(Math.max(1,Math.floor(f)||1),te)),[te]),F=(0,X.useCallback)(()=>{l(null),g(""),M([]),z(1)},[]);return{displayedData:se,rows:j,totalCount:t.length,filteredCount:j.length,sort:s,toggleSort:x,setSort:$,clearSort:S,searchQuery:p,setSearchQuery:D,filters:y,setFilters:le,setFilter:V,removeFilter:J,clearFilters:T,page:_,pageSize:L,totalPages:te,setPage:R,setPageSize:d,isMobile:H,reset:F}}h();h();var sr=require("react/jsx-runtime");function ue({size:e=20,color:t="currentColor",strokeWidth:n=2.5,label:o,children:r,...a}){return(0,sr.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:n,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!o?"true":void 0,"aria-label":o,role:o?"img":void 0,focusable:"false",...a,children:r})}h();var lt=require("react/jsx-runtime");function un(e){return(0,lt.jsxs)(ue,{...e,children:[(0,lt.jsx)("circle",{cx:"11",cy:"11",r:"7"}),(0,lt.jsx)("path",{d:"m20 20-4-4"})]})}h();var ct=require("react/jsx-runtime");function pn(e){return(0,ct.jsxs)(ue,{...e,children:[(0,ct.jsx)("path",{d:"M12 19V5"}),(0,ct.jsx)("path",{d:"m5 12 7-7 7 7"})]})}h();var dt=require("react/jsx-runtime");function fn(e){return(0,dt.jsxs)(ue,{...e,children:[(0,dt.jsx)("path",{d:"M12 5v14"}),(0,dt.jsx)("path",{d:"m5 12 7 7 7-7"})]})}h();var gn=require("react/jsx-runtime");function mn(e){return(0,gn.jsx)(ue,{...e,children:(0,gn.jsx)("path",{d:"m15 18-6-6 6-6"})})}h();var bn=require("react/jsx-runtime");function hn(e){return(0,bn.jsx)(ue,{...e,children:(0,bn.jsx)("path",{d:"m9 18 6-6-6-6"})})}h();var yn=require("react/jsx-runtime");function xn(e){return(0,yn.jsx)(ue,{...e,children:(0,yn.jsx)("path",{d:"M5 12.5 10 17.5 19.5 7"})})}h();var ut=require("react/jsx-runtime");function vn(e){return(0,ut.jsxs)(ue,{...e,children:[(0,ut.jsx)("path",{d:"M18 6 6 18"}),(0,ut.jsx)("path",{d:"m6 6 12 12"})]})}function Zi(){if(typeof globalThis>"u")return new Me;if(!globalThis.__yuktai_runtime__){let e=new Me;e.register(xe.name,xe),e.register(rt.name,rt),e.register(it.name,it),globalThis.__yuktai_runtime__=e}return globalThis.__yuktai_runtime__}var lr=typeof window<"u"?Zi():new Me,Ji={wcagPlugin:xe,list(){return lr.getPlugins()},use(e){return lr.use(e)},fix(e){return xe.applyFixes({enabled:!0,autoFix:!0,...e})},scan(){return xe.scan()}};
