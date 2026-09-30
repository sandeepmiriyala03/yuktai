"use strict";var dr=Object.create;var ht=Object.defineProperty;var ur=Object.getOwnPropertyDescriptor;var pr=Object.getOwnPropertyNames;var fr=Object.getPrototypeOf,gr=Object.prototype.hasOwnProperty;var He=(e,t)=>()=>(e&&(t=e(e=0)),t);var et=(e,t)=>{for(var n in t)ht(e,n,{get:t[n],enumerable:!0})},Rn=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of pr(t))!gr.call(e,i)&&i!==n&&ht(e,i,{get:()=>t[i],enumerable:!(o=ur(t,i))||o.enumerable});return e};var Nt=(e,t,n)=>(n=e!=null?dr(fr(e)):{},Rn(t||!e||!e.__esModule?ht(n,"default",{value:e,enumerable:!0}):n,e)),mr=e=>Rn(ht({},"__esModule",{value:!0}),e);var m=He(()=>{});var eo={};et(eo,{askPage:()=>_t});function Wr(){return new Promise(e=>{let t=setTimeout(e,1500),n=new MutationObserver(()=>{clearTimeout(t),t=setTimeout(()=>{n.disconnect(),e()},500)});n.observe(document.body,{childList:!0,subtree:!0})})}function Hr(){let e=[],t=document.querySelectorAll("*");for(let n of t){if(n.closest("[data-yuktai-panel]"))continue;let o=n.innerText?.trim();o&&o.length>30&&e.push(o);let i=n.getAttribute("aria-label");if(i&&i.length>10&&e.push(i),(n instanceof HTMLInputElement||n instanceof HTMLTextAreaElement)&&(n.placeholder&&e.push(n.placeholder),n.value&&e.push(n.value)),n instanceof HTMLButtonElement){let a=n.innerText||n.getAttribute("aria-label");a&&e.push(a)}}return e.join(" ").slice(0,3500)}async function _t(e){if(!e.trim())return{success:!1,answer:"",error:"Please type a question."};try{let t=window,n=t.LanguageModel||t.ai?.languageModel;if(!n)return{success:!1,answer:"",error:"Gemini Nano not available."};await Wr();let o=Hr();if(!o||o.length<100)return{success:!1,answer:"",error:"Page content not readable."};let i;try{i=await n.create({systemPrompt:`Answer ONLY using page content.
Keep answer short (2\u20133 sentences).
If not found say: "I could not find that on this page."`,outputLanguage:"en"})}catch{i=await n.create()}let a=`Page:
${o}

Q: ${e}`,r=await i.prompt(a);return i?.destroy&&i.destroy(),{success:!0,answer:r?.trim()||"No answer found."}}catch(t){return{success:!1,answer:"",error:t instanceof Error?t.message:"Error occurred"}}}var Bt=He(()=>{"use strict";m()});var Ut={};et(Ut,{askPageWithTransformers:()=>jt,getModelLoadStatus:()=>nt,isTransformersSupported:()=>tt});function ro(){return typeof navigator>"u"?!1:/Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(navigator.userAgent)}function Dr(){if(ro())return"wasm";try{if(typeof navigator<"u"&&"gpu"in navigator&&navigator.gpu!==void 0)return"webgpu"}catch{}return"wasm"}async function _r(){if(!qt){if(qe){for(;qe;)await new Promise(e=>setTimeout(e,200));return}qe=!0;try{let{pipeline:e,env:t}=await import("@huggingface/transformers");t.allowRemoteModels=!0,t.allowLocalModels=!1,typeof window<"u"&&typeof caches<"u"&&(t.useWasmCache=!0);let n=Dr(),o=ro();console.log(`yuktai: Transformers.js \u2014 device: ${n}, mobile: ${o}`),no=await e("feature-extraction","Xenova/all-MiniLM-L6-v2",{device:n,dtype:o?"q4":"fp32"}),oo=await e("text2text-generation","Xenova/flan-t5-small",{device:n,dtype:o?"q4":"fp32"}),qt=!0,qe=!1,console.log("yuktai: Transformers.js models loaded \u2705")}catch(e){throw qe=!1,console.error("yuktai: Transformers.js model load failed",e),e}}}function Br(){return new Promise(e=>{let t=setTimeout(e,1500),n=new MutationObserver(()=>{clearTimeout(t),t=setTimeout(()=>{n.disconnect(),e()},500)});n.observe(document.body,{childList:!0,subtree:!0})})}function qr(){let e=[],t=new Set,n=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, td, th, label, figcaption, blockquote, span, a, button, div");for(let r of n){if(r.closest("[data-yuktai-panel]")||r.querySelector("p, h1, h2, h3, h4, li, td, div"))continue;let l=r.innerText?.trim();if(!l||l.length<15||t.has(l))continue;t.add(l),e.push(l);let u=r.getAttribute("aria-label")?.trim();u&&u.length>8&&!t.has(u)&&(t.add(u),e.push(u))}let o=document.title?.trim();o&&!t.has(o)&&e.unshift(o);let a=document.querySelector('meta[name="description"]')?.getAttribute("content")?.trim();return a&&!t.has(a)&&e.unshift(a),e.join(" ").slice(0,8e3)}function jr(e,t=150,n=30){if(typeof e!="string")try{e=String(e??"")}catch{return[]}let o=e.trim();if(!o)return[];let i=Math.min(n,Math.floor(t/2)),a=o.split(/\s+/),r=[],s=t-i;for(let l=0;l<a.length;l+=s){let u=a.slice(l,l+t).join(" ");u.trim().length>20&&r.push(u)}return r}function Ur(e,t){let n=0,o=0,i=0;for(let a=0;a<e.length;a++)n+=e[a]*t[a],o+=e[a]*e[a],i+=t[a]*t[a];return n/(Math.sqrt(o)*Math.sqrt(i)+1e-8)}async function to(e){let t=await no(e,{pooling:"mean",normalize:!0}),n=t?.data??t;return Array.from(n)}async function Vr(e,t,n=3){let o=await to(e),i=await Promise.all(t.map(async a=>{let r=await to(a),s=Ur(o,r);return{chunk:a,score:s}}));return i.sort((a,r)=>r.score-a.score),i.slice(0,n).map(a=>a.chunk)}async function jt(e){if(!e.trim())return{success:!1,answer:"",error:"Please type a question."};try{await _r(),await Br();let t=qr();if(!t||t.length<50)return{success:!1,answer:"",error:"Not enough content on this page."};let n=jr(t);if(n.length===0)return{success:!1,answer:"",error:"Could not process page content."};let a=`Answer the question based on the context. Give a complete answer in 2-3 sentences.

Context: ${(await Vr(e,n,3)).join(" ").slice(0,1200)}

Question: ${e}

Answer:`,s=(await oo(a,{max_new_tokens:120,min_new_tokens:10}))?.[0]?.generated_text?.trim()||"";return s?{success:!0,answer:s}:{success:!0,answer:"I could not find a specific answer on this page."}}catch(t){console.error("yuktai: Transformers RAG error",t);let n=t instanceof Error?t.message:"";return n.includes("Out of memory")||n.includes("memory")?{success:!1,answer:"",error:"Not enough device memory. Try on a device with more RAM or use desktop Chrome with Gemini Nano."}:{success:!1,answer:"",error:n||"Transformers.js error."}}}function tt(){try{return typeof WebAssembly<"u"&&typeof Worker<"u"}catch{return!1}}function nt(){return qt?"ready":qe?"loading":"idle"}var no,oo,qe,qt,ot=He(()=>{"use strict";m();no=null,oo=null,qe=!1,qt=!1});function ao(e,t){return e.replace(/\{\{SITE_NAME\}\}/g,t.SITE_NAME).replace(/\{\{THEME_COLOR\}\}/g,t.THEME_COLOR).replace(/\{\{TAGLINE\}\}/g,t.TAGLINE).replace(/\{\{YEAR\}\}/g,t.YEAR)}var Xt,so,lo,co,uo,po,fo,go,mo,bo,ho,yo,xo,vo,wo,ko,So,To,Ao,Co,Eo,Ro,Lo,Io,No,Mo=He(()=>{"use strict";m();Xt={blue:"#1a73e8",green:"#0d9488",purple:"#7c3aed",red:"#dc2626",orange:"#ea580c",teal:"#0891b2",indigo:"#4f46e5",gray:"#374151"},so=e=>`{
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
`,lo=`/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
}

module.exports = nextConfig
`,co=e=>`/** @type {import('tailwindcss').Config} */
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
`,uo=e=>`@tailwind base;
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
`,po=`import type { Metadata } from "next"
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
`,fo=`"use client"
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
`,go=`.navbar {
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
`,mo=`import styles from "./Footer.module.css"

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
`,bo=`.footer {
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
`,ho=`import styles from "./page.module.css"
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
`,yo=`.page { min-height: 100vh; }

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
`,xo=`import styles from "./page.module.css"

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
`,vo=`.page { min-height: 100vh; }

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
`,wo=`"use client"
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
`,ko=`.page { min-height: 100vh; }

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
`,So=`import styles from "./page.module.css"

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
`,To=`.page { min-height: 100vh; }

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
`,Ao=`import styles from "./page.module.css"
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
`,Co=`.page { min-height: 100vh; }

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
`,Eo=`"use client"
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
`,Io=`{
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
`,No=e=>`# ${e}

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
`});var Po={};et(Po,{generateZip:()=>di});function ci(e,t){return{hotel:`Experience luxury and comfort at ${e}`,ecommerce:`Shop the best products at ${e}`,restaurant:`Delicious food crafted with love at ${e}`,portfolio:`Creative work and professional services by ${e}`,blog:`Insights, stories, and ideas from ${e}`,saas:`Powerful tools to grow your business \u2014 ${e}`,government:`Official services and information \u2014 ${e}`,healthcare:`Quality healthcare you can trust \u2014 ${e}`,education:`Learn, grow, and succeed with ${e}`,realestate:`Find your perfect property with ${e}`,landing:`The smarter way to get things done \u2014 ${e}`,generic:`Welcome to ${e} \u2014 your trusted partner`}[t]||`Welcome to ${e}`}async function di(e){let t=(await import("jszip")).default,n=new t,o=Xt[e.theme]||Xt.blue,i=ci(e.siteName,e.websiteType),a=new Date().getFullYear().toString(),r={SITE_NAME:e.siteName,THEME_COLOR:o,TAGLINE:i,YEAR:a},s=h=>ao(h,r).replace(/\{\{SITE_NAME_LOWER\}\}/g,e.siteName.toLowerCase().replace(/\s+/g,""));n.file("package.json",so(e.siteName)),n.file("next.config.js",lo),n.file("tailwind.config.js",co(o)),n.file("tsconfig.json",Io),n.file("README.md",No(e.siteName)),n.file("postcss.config.js","module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }"),n.file(".gitignore",`node_modules
.next
.env.local
.DS_Store`),n.file("src/app/globals.css",uo(o)),n.file("src/app/layout.tsx",s(po)),n.file("src/app/not-found.tsx",Lo),n.file("src/components/Navbar.tsx",s(fo)),n.file("src/components/Navbar.module.css",go),n.file("src/components/Footer.tsx",s(mo)),n.file("src/components/Footer.module.css",bo);for(let h of e.pages)switch(h){case"home":n.file("src/app/page.tsx",s(ho)),n.file("src/app/page.module.css",yo);break;case"about":n.file("src/app/about/page.tsx",s(xo)),n.file("src/app/about/page.module.css",vo);break;case"contact":n.file("src/app/contact/page.tsx",s(wo)),n.file("src/app/contact/page.module.css",ko);break;case"services":n.file("src/app/services/page.tsx",s(So)),n.file("src/app/services/page.module.css",To);break;case"pricing":n.file("src/app/pricing/page.tsx",s(Ao)),n.file("src/app/pricing/page.module.css",Co);break;case"auth":n.file("src/app/auth/page.tsx",s(Eo)),n.file("src/app/auth/page.module.css",Ro);break;default:n.file(`src/app/${h}/page.tsx`,ui(h,e.siteName,o,r,s));break}let l=await n.generateAsync({type:"blob"}),u=URL.createObjectURL(l),f=document.createElement("a");f.href=u,f.download=`${e.siteName.toLowerCase().replace(/\s+/g,"-")}-nextjs.zip`,document.body.appendChild(f),f.click(),document.body.removeChild(f),URL.revokeObjectURL(u)}function ui(e,t,n,o,i){let a=e.charAt(0).toUpperCase()+e.slice(1);return`import styles from "./page.module.css"

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
`}var Go=He(()=>{"use strict";m();Mo()});var Wo={};et(Wo,{getPageText:()=>Fo,highlightField:()=>$o,runAgent:()=>yi,scanFormFields:()=>zo,scrollToSection:()=>Oo});function Ne(e){try{let t=window.getComputedStyle(e);if(t.display==="none"||t.visibility==="hidden"||t.opacity==="0"||e.hidden)return!1;let n=e.getBoundingClientRect();return!(n.width===0&&n.height===0)}catch{return!0}}function Fo(){let e=[],t=new Set,n=r=>{let s=r.trim();s&&s.length>10&&!t.has(s)&&(t.add(s),e.push(s))};document.title&&n(document.title);let o=['meta[name="description"]','meta[name="keywords"]','meta[property="og:title"]','meta[property="og:description"]','meta[name="twitter:title"]','meta[name="twitter:description"]'];for(let r of o){let s=document.querySelector(r)?.getAttribute("content");s&&n(s)}let i=["h1","h2","h3","h4","h5","h6","p","blockquote","q","pre","code","li","dt","dd","th","td","caption","a","b","strong","em","i","u","s","abbr","acronym","cite","dfn","mark","small","sub","sup","ins","del","bdi","bdo","article","section","aside","nav","header","footer","main","summary","details","figcaption","figure","address","time","output","label","legend","option","button","font","center","span","div","[role='heading']","[role='main']","[role='article']","[role='region']","[role='complementary']","[role='contentinfo']","[role='navigation']","[role='banner']","[role='listitem']","[role='cell']","[role='columnheader']","[role='rowheader']"],a=document.querySelectorAll(i.join(","));for(let r of a){if(r.closest("[data-yuktai-panel]")||!Ne(r)||r.querySelector("p, h1, h2, h3, h4, h5, h6, li, td, th, div, article, section, blockquote, pre"))continue;let l=r.innerText?.trim();if(l&&l.length>10&&n(l),!l){let I=r.textContent?.trim();I&&I.length>10&&n(I)}let u=r.getAttribute("aria-label")?.trim();u&&u.length>5&&n(u);let f=r.getAttribute("aria-description")?.trim();f&&f.length>5&&n(f);let h=r.getAttribute("aria-valuetext")?.trim();h&&n(h);let N=r.getAttribute("title")?.trim();N&&N.length>5&&n(N);let D=r.getAttribute("data-label")?.trim();D&&n(D);let F=r.getAttribute("data-title")?.trim();F&&n(F),r.querySelectorAll("img").forEach(I=>{let C=I.getAttribute("alt")?.trim();C&&C.length>5&&n(C);let z=I.getAttribute("title")?.trim();z&&z.length>5&&n(z)})}document.querySelectorAll("img").forEach(r=>{if(r.closest("[data-yuktai-panel]")||!Ne(r))return;let s=r.getAttribute("alt")?.trim(),l=r.getAttribute("title")?.trim();s&&s.length>5&&n(s),l&&l.length>5&&n(l)}),document.querySelectorAll("input:not([type=hidden]), textarea").forEach(r=>{if(r.closest("[data-yuktai-panel]")||!Ne(r))return;r.placeholder&&n(r.placeholder),r.value&&r.value.length>3&&n(r.value);let s=r.getAttribute("aria-label")?.trim();s&&n(s)}),document.querySelectorAll("select").forEach(r=>{r.closest("[data-yuktai-panel]")||Ne(r)&&Array.from(r.options).forEach(s=>{s.text?.trim().length>3&&n(s.text.trim())})}),document.querySelectorAll("td, th").forEach(r=>{if(r.closest("[data-yuktai-panel]")||!Ne(r))return;let s=r.innerText?.trim();s&&s.length>3&&n(s)});try{document.querySelectorAll("iframe").forEach(r=>{try{let s=r.contentDocument;if(!s)return;let l=s.body?.innerText?.trim();l&&l.length>20&&n(l.slice(0,500))}catch{}})}catch{}return document.querySelectorAll("a").forEach(r=>{if(r.closest("[data-yuktai-panel]")||!Ne(r))return;let s=r.innerText?.trim();s&&s.length>3&&s.length<100&&n(s)}),e.join(" ").slice(0,5e3)}function mi(e){let t=e.getAttribute("aria-label")?.trim();if(t)return t;let n=e.getAttribute("aria-labelledby");if(n){let l=document.getElementById(n);if(l)return l.innerText?.trim()||""}if(e.id){let l=document.querySelector(`label[for="${e.id}"]`);if(l)return l.innerText?.trim()||""}let o=e.closest("label");if(o){let l=o.cloneNode(!0);return l.querySelectorAll("input, select, textarea").forEach(u=>u.remove()),l.innerText?.trim()||""}if((e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement)&&e.placeholder)return e.placeholder;if(e.name)return e.name.replace(/[_-]/g," ");let i=e.previousSibling;if(i?.nodeType===Node.TEXT_NODE){let l=i.textContent?.trim();if(l&&l.length>1)return l}let a=e.previousElementSibling;if(a){let l=a.innerText?.trim();if(l&&l.length>1&&l.length<60)return l}let r=e.closest("td, th");if(r){let l=r.previousElementSibling;if(l){let u=l.innerText?.trim();if(u&&u.length>1)return u}}let s=e.getAttribute("title")?.trim();return s||(e instanceof HTMLInputElement?e.type:"field")}function zo(){let e=[],t=document.querySelectorAll(["input:not([type=hidden])","input:not([type=submit])","input:not([type=button])","input:not([type=reset])","input:not([type=image])","select","textarea","[contenteditable='true']","[role='textbox']","[role='combobox']","[role='spinbutton']","[role='searchbox']","[role='listbox']"].join(", "));for(let n of t){if(n.closest("[data-yuktai-panel]")||!Ne(n))continue;if(n instanceof HTMLInputElement){let i=n.type.toLowerCase();if(["submit","button","reset","image"].includes(i))continue}let o=mi(n);e.push({label:o,type:n instanceof HTMLInputElement?n.type:n.tagName.toLowerCase(),placeholder:(n instanceof HTMLInputElement||n instanceof HTMLTextAreaElement)&&n.placeholder||"",required:n.required||n.getAttribute("aria-required")==="true"||n.getAttribute("data-required")==="true",element:n})}return e}function $o(e,t=3e3){e.scrollIntoView({behavior:"smooth",block:"center"}),e.style.outline="3px solid #0d9488",e.style.outlineOffset="3px";try{e.focus()}catch{}setTimeout(()=>{e.style.outline="",e.style.outlineOffset=""},t)}function Oo(e){let t=e.toLowerCase(),n=document.querySelectorAll("h1, h2, h3, h4, h5, h6, section, article, [id], [aria-label], [role='heading'], [role='region']");for(let o of n){if(o.closest("[data-yuktai-panel]")||!Ne(o))continue;if((o.innerText||o.getAttribute("id")||o.getAttribute("aria-label")||o.getAttribute("name")||"").toLowerCase().includes(t))return o.scrollIntoView({behavior:"smooth",block:"center"}),o.style.outline="2px solid #0d9488",o.style.outlineOffset="4px",setTimeout(()=>{o.style.outline="",o.style.outlineOffset=""},2500),!0}return!1}async function bi(e,t,n){let o=window,i=o.LanguageModel||o.ai?.languageModel;if(!i)throw new Error("Gemini Nano not available");let a=await i.create({systemPrompt:`You are a helpful web accessibility agent.
Create a simple action plan to help a user complete a task on a webpage.
Rules:
- Maximum 5 steps
- Short and clear \u2014 no jargon
- If filling a form \u2014 list each field and what to enter
- No markdown \u2014 no asterisks, no bold, no headers
- Number each step: 1. 2. 3.`}),s=`Page content: ${e}${n?`
The page has form fields the user may need to fill.`:""}

User task: ${t}

Action plan:`,l=await a.prompt(s);return a.destroy(),l?.trim()||""}async function hi(e,t){let{askPageWithTransformers:n}=await Promise.resolve().then(()=>(ot(),Ut));return(await n(`How do I: ${t}`)).answer||"I could not create a plan for this task."}async function yi(e,t,n){if(!e.trim())return{success:!1,steps:[],error:"Please tell me what you want to do."};if(!t)return{success:!1,steps:[],error:"No AI engine available on this device."};let o=[],i=(a,r="info")=>{let s={text:a,type:r};o.push(s),n(s)};try{i("\u{1F4D6} Reading page content...","info");let a=Fo(),r=zo(),s=r.length>0;a.length<50&&i("\u26A0\uFE0F Page content is very limited. This may be a static image page.","error"),i(s?`\u{1F4CB} Found ${r.length} form field${r.length!==1?"s":""} on this page`:"\u{1F4C4} No form fields found \u2014 this appears to be a content page","info"),i("\u{1F916} Creating action plan...","info");let l="";try{t==="gemini"?l=await bi(a,e,s):l=await hi(a,e)}catch{l=s?`1. Locate the form on this page
2. Fill each required field
3. Review your answers
4. Submit the form`:`1. Read the page carefully
2. Find the section relevant to your task
3. Follow the on-page instructions`}if(l&&(i("\u2705 Your action plan:","success"),l.split(/\n/).map(u=>u.replace(/\*\*/g,"").replace(/\*/g,"").trim()).filter(u=>u.length>5).slice(0,6).forEach(u=>i(`   ${u}`,"action"))),s){let u=r[0];i(`\u{1F3AF} First field: "${u.label}"${u.required?" \u2605 required":""}`,"field"),$o(u.element),r.length>1&&i(`\u{1F4DD} All ${r.length} fields: ${r.map(f=>f.label).join(" \u2192 ")}`,"info")}else{let u=e.toLowerCase().split(/\s+/).filter(h=>h.length>3),f=!1;for(let h of u)if(Oo(h)){i(`\u{1F3AF} Scrolled to relevant section: "${h}"`,"action"),f=!0;break}f||i("\u{1F4A1} Scroll through the page to find what you need.","info")}return i("\u2705 Ready. Follow the steps above. Ask me again if you need more help.","success"),{success:!0,steps:o}}catch(a){let r=a instanceof Error?a.message:"Agent error.";return i(`\u26A0\uFE0F ${r}`,"error"),{success:!1,steps:o,error:r}}}var Ho=He(()=>{"use strict";m()});var Qi={};et(Qi,{CheckIcon:()=>xn,ChevronLeftIcon:()=>mn,ChevronRightIcon:()=>hn,CloseIcon:()=>vn,IconBase:()=>ce,Runtime:()=>Me,SearchIcon:()=>un,SortDownIcon:()=>fn,SortUpIcon:()=>pn,YuktAI:()=>Ki,YuktAIWrapper:()=>Ct,YuktaiGrid:()=>Zo,YuktaiGridAI:()=>Rt,YuktaiGridAgent:()=>Ko,YuktaiGridWebMCP:()=>lt,aiPlugin:()=>it,applyGridFilters:()=>Ye,clearFilters:()=>sn,clearSort:()=>cn,countGrid:()=>Jt,createGridTools:()=>Ke,default:()=>Ct,filterGrid:()=>an,getColumns:()=>en,getRow:()=>tn,getRowId:()=>Ve,highlightRows:()=>nn,openRow:()=>rn,parseGridIntent:()=>dn,searchGrid:()=>Zt,selectRow:()=>on,sortGrid:()=>ln,toGridToolColumns:()=>Xe,useGrid:()=>rr,useYuktaiGridAgent:()=>st,voicePlugin:()=>at,wcag:()=>be,wcagPlugin:()=>be});module.exports=mr(Qi);m();m();m();function Ln(){let e=window;return e.Rewriter||e.ai?.rewriter||null}async function Mt(){try{let e=Ln();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}async function br(e){if(!e||e.trim().length<20)return{success:!1,original:e,rewritten:e,error:"Text too short"};try{let t=Ln();if(!t)throw new Error("Rewriter API not available");let n=await t.create({tone:"more-casual",format:"plain-text",length:"as-is",outputLanguage:"en"}),o=await n.rewrite(e,{context:"Rewrite this text in simple plain English. Use short sentences. Avoid jargon. Make it easy to understand for everyone."});return n.destroy(),{success:!0,original:e,rewritten:o.trim()}}catch(t){return{success:!1,original:e,rewritten:e,error:t instanceof Error?t.message:"Rewrite failed"}}}async function In(){if(!await Mt())return{fixed:0,error:"Chrome Built-in AI Rewriter not available. Enable via chrome://flags."};let t=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption"),n=0;for(let o of t){let i=o.innerText?.trim();if(!i||i.length<20||o.closest("[data-yuktai-panel]"))continue;let a=await br(i);a.success&&a.rewritten!==i&&(o.dataset.yuktaiOriginal=i,o.innerText=a.rewritten,n++)}return{fixed:n}}function Nn(){let e=document.querySelectorAll("[data-yuktai-original]");for(let t of e){let n=t.dataset.yuktaiOriginal;n&&(t.innerText=n,delete t.dataset.yuktaiOriginal)}}m();var Mn="yuktai-summary-box";function Pn(){let e=window;return e.Summarizer||e.ai?.summarizer||null}async function Pt(){try{let e=Pn();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}function hr(){let e=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, article, section"),t=[];for(let n of e){if(n.closest("[data-yuktai-panel]"))continue;let o=window.getComputedStyle(n);if(o.display==="none"||o.visibility==="hidden")continue;let i=n.innerText?.trim();i&&i.length>10&&t.push(i)}return t.join(" ").slice(0,5e3)}async function Gn(){if(!await Pt())return{success:!1,summary:"",error:"Chrome Built-in AI Summarizer not available. Enable via chrome://flags."};let t=hr();if(!t||t.length<100)return{success:!1,summary:"",error:"Not enough text on this page to summarise."};try{let n=Pn();if(!n)throw new Error("Summarizer API not available");let o=await n.create({type:"tl;dr",format:"plain-text",length:"short",outputLanguage:"en"}),i=await o.summarize(t,{context:"Summarise this page in 2-3 simple sentences for a screen reader user who wants to know if this page is relevant to them."});return o.destroy(),yr(i.trim()),{success:!0,summary:i.trim()}}catch(n){return{success:!1,summary:"",error:n instanceof Error?n.message:"Summary failed"}}}function yr(e){yt();let t=document.createElement("div");t.id=Mn,t.setAttribute("data-yuktai-panel","true"),t.setAttribute("role","region"),t.setAttribute("aria-label","Page summary by yuktai"),t.style.cssText=`
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
  `,o.addEventListener("click",yt),t.appendChild(n),t.appendChild(o),document.body.prepend(t)}function yt(){let e=document.getElementById(Mn);e&&e.remove()}m();var vt=[{code:"en",label:"English"},{code:"hi",label:"Hindi"},{code:"es",label:"Spanish"},{code:"fr",label:"French"},{code:"de",label:"German"},{code:"it",label:"Italian"},{code:"pt",label:"Portuguese"},{code:"nl",label:"Dutch"},{code:"pl",label:"Polish"},{code:"ru",label:"Russian"},{code:"ja",label:"Japanese"},{code:"ko",label:"Korean"},{code:"zh",label:"Chinese"},{code:"ar",label:"Arabic"},{code:"tr",label:"Turkish"},{code:"vi",label:"Vietnamese"},{code:"bn",label:"Bengali"},{code:"id",label:"Indonesian"}],xt="en";function xr(){let e=window;return e.Translator||e.translation||null}async function vr(e){try{let t=window;if(!xr())return!1;if(t.Translator&&typeof t.Translator.availability=="function")try{let o=await t.Translator.availability({sourceLanguage:"en",targetLanguage:e});return o==="readily"||o==="available"||o==="downloadable"||o==="after-download"}catch{}return t.Translator&&typeof t.Translator.canTranslate=="function"?await t.Translator.canTranslate({sourceLanguage:"en",targetLanguage:e})!=="no":t.translation&&typeof t.translation.canTranslate=="function"?await t.translation.canTranslate({sourceLanguage:"en",targetLanguage:e})!=="no":!1}catch{return!1}}async function wr(e){let t=window,n={sourceLanguage:"en",targetLanguage:e};if(t.Translator&&typeof t.Translator.create=="function")return await t.Translator.create(n);if(t.translation&&typeof t.translation.createTranslator=="function")return await t.translation.createTranslator(n);throw new Error("Translation API not available")}async function Fn(e){if(e===xt)return{success:!0,language:e,fixed:0};if(e==="en")return Gt(),xt="en",{success:!0,language:"en",fixed:0};if(!await vr(e))return{success:!1,language:e,fixed:0,error:`Translation to ${e} not available. Enable via chrome://flags.`};try{let n=await wr(e),o=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption, span, a"),i=0;for(let a of o){if(a.closest("[data-yuktai-panel]")||a.children.length>0)continue;let r=a.innerText?.trim();if(!r||r.length<2)continue;a.dataset.yuktaiTranslationOriginal||(a.dataset.yuktaiTranslationOriginal=r);let s=await n.translate(r);s&&s!==r&&(a.innerText=s,i++)}return typeof n.destroy=="function"&&n.destroy(),xt=e,{success:!0,language:e,fixed:i}}catch(n){return{success:!1,language:e,fixed:0,error:n instanceof Error?n.message:"Translation failed"}}}function Gt(){let e=document.querySelectorAll("[data-yuktai-translation-original]");for(let t of e){let n=t.dataset.yuktaiTranslationOriginal;n&&(t.innerText=n,delete t.dataset.yuktaiTranslationOriginal)}xt="en"}m();var kr=[{phrases:["go to main","skip to main","main content"],action:"focus-main",label:"Jump to main content"},{phrases:["go to navigation","go to nav","open menu"],action:"focus-nav",label:"Jump to navigation"},{phrases:["go to search","search","find"],action:"focus-search",label:"Jump to search"},{phrases:["scroll down","page down","next"],action:"scroll-down",label:"Scroll down"},{phrases:["scroll up","page up","back up"],action:"scroll-up",label:"Scroll up"},{phrases:["go back","previous page"],action:"go-back",label:"Go back"},{phrases:["click","press","select"],action:"click-focused",label:"Click focused element"},{phrases:["next item","tab forward","tab"],action:"tab-forward",label:"Move to next element"},{phrases:["previous item","tab back","shift tab"],action:"tab-back",label:"Move to previous element"},{phrases:["stop listening","stop voice","quiet"],action:"stop-voice",label:"Stop voice control"}],he=null,wt=!1,De=null;function Ft(){return!!(window.SpeechRecognition||window.webkitSpeechRecognition)}function Sr(e){let t=e.toLowerCase().trim();for(let n of kr)for(let o of n.phrases)if(t.includes(o))return{action:n.action,label:n.label};return null}function Tr(e){switch(e){case"focus-main":{let t=document.querySelector("main, [role='main'], #main");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-nav":{let t=document.querySelector("nav, [role='navigation']");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-search":{let t=document.querySelector("input[type='search'], input[role='searchbox'], [aria-label*='search' i]");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"scroll-down":{window.scrollBy({top:400,behavior:"smooth"});break}case"scroll-up":{window.scrollBy({top:-400,behavior:"smooth"});break}case"go-back":{window.history.back();break}case"click-focused":{let t=document.activeElement;t&&t!==document.body&&t.click();break}case"tab-forward":{let t=zn(),n=t.indexOf(document.activeElement),o=t[n+1]||t[0];o&&o.focus();break}case"tab-back":{let t=zn(),n=t.indexOf(document.activeElement),o=t[n-1]||t[t.length-1];o&&o.focus();break}case"stop-voice":{zt();break}}}function zn(){return Array.from(document.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(e=>!e.closest("[data-yuktai-panel]"))}function $n(e){if(!Ft())return!1;if(wt)return!0;e&&(De=e);let t=window.SpeechRecognition||window.webkitSpeechRecognition;return he=new t,he.continuous=!0,he.interimResults=!1,he.lang="en-US",he.onresult=n=>{let o=n.results[n.results.length-1][0].transcript,i=Sr(o);if(i){Tr(i.action);let a={success:!0,command:o,action:i.label};if(De&&De(a),i.action==="stop-voice")return}},he.onend=()=>{wt&&he?.start()},he.onerror=n=>{n.error!=="no-speech"&&De&&De({success:!1,command:"",action:"",error:`Voice error: ${n.error}`})},he.start(),wt=!0,Ar(),!0}function zt(){wt=!1,he&&(he.stop(),he=null),De=null,Wn()}var On="yuktai-voice-indicator";function Ar(){Wn();let e=document.createElement("div");e.id=On,e.setAttribute("data-yuktai-panel","true"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-label","yuktai voice control is listening"),e.style.cssText=`
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
    `,document.head.appendChild(o)}let n=document.createElement("span");n.textContent="Listening for commands...",e.appendChild(t),e.appendChild(n),document.body.appendChild(e)}function Wn(){let e=document.getElementById(On);e&&e.remove()}m();var Cr=["button:not([aria-label]):not([aria-labelledby])","a:not([aria-label]):not([aria-labelledby])","input:not([aria-label]):not([aria-labelledby]):not([id])","select:not([aria-label]):not([aria-labelledby])","textarea:not([aria-label]):not([aria-labelledby])","[role='button']:not([aria-label])","[role='link']:not([aria-label])","[role='checkbox']:not([aria-label])","[role='tab']:not([aria-label])"].join(", ");function Hn(){let e=window;return e.Writer||e.ai?.writer||null}async function $t(){try{let e=Hn();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}function Er(e){let t=[],n=e.innerText?.trim();n&&t.push(`element text: "${n}"`);let o=e.placeholder?.trim();o&&t.push(`placeholder: "${o}"`);let i=e.getAttribute("name")?.trim();i&&t.push(`name: "${i}"`);let a=e.getAttribute("type")?.trim();a&&t.push(`type: "${a}"`);let r=e.id;if(r){let u=document.querySelector(`label[for="${r}"]`);u&&t.push(`label: "${u.innerText?.trim()}"`)}let s=e.parentElement?.innerText?.trim().slice(0,60);s&&t.push(`parent context: "${s}"`),t.push(`tag: ${e.tagName.toLowerCase()}`);let l=e.getAttribute("role");return l&&t.push(`role: ${l}`),t.join(". ")}async function Rr(e,t){let n=`
    Generate a short, clear aria-label for an HTML element.
    The label must be 2-6 words maximum.
    The label must describe what the element does or what it is.
    Do not include punctuation.
    Do not explain \u2014 just output the label text only.

    Element details:
    ${t}

    Output only the label. Nothing else.
  `.trim();return(await e.write(n)).trim().replace(/^["']|["']$/g,"").replace(/\.$/,"").trim()}async function Dn(){if(!await $t())return{success:!1,fixed:0,elements:[],error:"Chrome Built-in AI Writer not available. Enable via chrome://flags."};let t=document.querySelectorAll(Cr);if(t.length===0)return{success:!0,fixed:0,elements:[]};try{let n=Hn();if(!n)throw new Error("Writer API not available");let o=await n.create({tone:"neutral",format:"plain-text",length:"short",outputLanguage:"en"}),i=0,a=[];for(let r of t){if(r.closest("[data-yuktai-panel]"))continue;let s=window.getComputedStyle(r);if(s.display==="none"||s.visibility==="hidden")continue;let l=Er(r),u=await Rr(o,l);u&&u.length>0&&(r.dataset.yuktaiLabelOriginal=r.getAttribute("aria-label")||"",r.setAttribute("aria-label",u),i++,a.push({tag:r.tagName.toLowerCase(),label:u}))}return o.destroy(),{success:!0,fixed:i,elements:a}}catch(n){return{success:!1,fixed:0,elements:[],error:n instanceof Error?n.message:"Label generation failed"}}}function _n(){let e=document.querySelectorAll("[data-yuktai-label-original]");for(let t of e){let n=t.dataset.yuktaiLabelOriginal;n?t.setAttribute("aria-label",n):t.removeAttribute("aria-label"),delete t.dataset.yuktaiLabelOriginal}}var Tt=null,Bn=null;var qn=null,Ot=null,ae=null,_e=null,kt=null,Wt=null,Be=null,St={deuteranopia:"yuktai-cb-d",protanopia:"yuktai-cb-p",tritanopia:"yuktai-cb-t"};var jn=new Set(["input","select","textarea"]);var Ht={nav:"navigation",header:"banner",footer:"contentinfo",main:"main",aside:"complementary"};function Dt(e,t="polite"){if(typeof window>"u"||!Be?.speechEnabled||!window.speechSynthesis)return;window.speechSynthesis.cancel();let n=new SpeechSynthesisUtterance(e);n.rate=1,n.pitch=1,n.volume=1;let o=window.speechSynthesis.getVoices();o.length>0&&(n.voice=o[0]),window.speechSynthesis.speak(n)}function Zn(e,t="info"){if(typeof document>"u")return;let o={success:{bg:"#0f9d58",border:"#0a7a44",icon:"\u2713"},error:{bg:"#d93025",border:"#b52a1c",icon:"\u2715"},warning:{bg:"#f29900",border:"#c67c00",icon:"\u26A0"},info:{bg:"#1a73e8",border:"#1557b0",icon:"\u2139"}}[t];ae||(ae=document.createElement("div"),ae.setAttribute("role","alert"),ae.setAttribute("aria-live","assertive"),ae.setAttribute("aria-atomic","true"),ae.style.cssText=`
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
  `,window.innerWidth<=480&&(ae.style.right="8px",ae.style.left="8px",ae.style.maxWidth="none",ae.style.width="auto"),requestAnimationFrame(()=>{ae&&(ae.style.transform="translateX(0)",ae.style.opacity="1")}),setTimeout(()=>{ae&&(ae.style.transform="translateX(120%)",ae.style.opacity="0")},5e3)}function Q(e,t="info",n=!0){Tt&&(Tt.textContent=e),Zn(e,t),n&&Dt(e,t==="error"?"assertive":"polite")}function Lr(){if(typeof document>"u"||qn)return;let e=[{label:"Skip to main content",selector:"main,[role='main'],#main,#main-content"},{label:"Skip to navigation",selector:"nav,[role='navigation'],#nav,#navigation"},{label:"Skip to search",selector:"[role='search'],#search,input[type='search']"}],t=document.createElement("div");t.setAttribute("data-yuktai-skip-bar","true"),t.setAttribute("role","navigation"),t.setAttribute("aria-label","Skip links"),t.style.cssText=`
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
  `;let n=!1;if(e.forEach(({label:i,selector:a})=>{let r=document.querySelector(a);if(!r)return;n=!0,r.getAttribute("tabindex")||r.setAttribute("tabindex","-1");let s=document.createElement("a");s.href="#",s.textContent=i,s.style.cssText=`
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
    `,s.addEventListener("focus",()=>{t.style.transform="translateY(0)"}),s.addEventListener("blur",()=>{setTimeout(()=>{t.matches(":focus-within")||(t.style.transform="translateY(-100%)")},2e3)}),s.addEventListener("click",l=>{l.preventDefault(),r.focus(),r.scrollIntoView({behavior:"smooth",block:"start"}),Q(`Jumped to ${i.replace("Skip to ","")}`,"info"),t.style.transform="translateY(-100%)"}),t.appendChild(s)}),!n)return;window.innerWidth<768&&(t.style.transform="translateY(0)",t.style.position="sticky"),window.addEventListener("resize",()=>{window.innerWidth<768&&(t.style.transform="translateY(0)")}),document.body.insertBefore(t,document.body.firstChild),qn=t}function Ir(){if(typeof document>"u"||document.querySelector("[data-yuktai-focus-style]"))return;let e=document.createElement("style");e.setAttribute("data-yuktai-focus-style","true"),e.textContent=`

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
  `,document.head.appendChild(e),document.documentElement.setAttribute("data-yuktai-a11y","true")}function Nr(){typeof document>"u"||document.querySelector("[data-yuktai-kb-init]")||(document.documentElement.setAttribute("data-yuktai-kb-init","true"),document.addEventListener("keydown",e=>{let t=document.activeElement;if(!t)return;let n=t.getAttribute("role")||"";if(e.key==="Escape"){let o=t.closest("[role='dialog'],[role='alertdialog']");if(o){o.style.display="none",Q("Dialog closed","info");return}let i=t.closest("[role='menu'],[role='menubar']");i&&(i.style.display="none",Q("Menu closed","info"))}if(n==="menuitem"||t.closest("[role='menu'],[role='menubar']")){let o=t.closest("[role='menu'],[role='menubar']");if(!o)return;let i=Array.from(o.querySelectorAll("[role='menuitem']:not([disabled])")),a=i.indexOf(t);e.key==="ArrowDown"||e.key==="ArrowRight"?(e.preventDefault(),i[(a+1)%i.length]?.focus()):e.key==="ArrowUp"||e.key==="ArrowLeft"?(e.preventDefault(),i[(a-1+i.length)%i.length]?.focus()):e.key==="Home"?(e.preventDefault(),i[0]?.focus()):e.key==="End"&&(e.preventDefault(),i[i.length-1]?.focus())}if(n==="tab"||t.closest("[role='tablist']")){let o=t.closest("[role='tablist']");if(!o)return;let i=Array.from(o.querySelectorAll("[role='tab']:not([disabled])")),a=i.indexOf(t);if(e.key==="ArrowRight"||e.key==="ArrowDown"){e.preventDefault();let r=i[(a+1)%i.length];r?.focus(),r?.click()}else if(e.key==="ArrowLeft"||e.key==="ArrowUp"){e.preventDefault();let r=i[(a-1+i.length)%i.length];r?.focus(),r?.click()}}if(n==="option"||t.closest("[role='listbox']")){let o=t.closest("[role='listbox']");if(!o)return;let i=Array.from(o.querySelectorAll("[role='option']:not([aria-disabled='true'])")),a=i.indexOf(t);e.key==="ArrowDown"?(e.preventDefault(),i[(a+1)%i.length]?.focus()):e.key==="ArrowUp"?(e.preventDefault(),i[(a-1+i.length)%i.length]?.focus()):(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),t.setAttribute("aria-selected","true"),i.forEach(r=>{r!==t&&r.setAttribute("aria-selected","false")}),Q(`Selected: ${t.textContent?.trim()}`,"success"))}e.altKey&&e.key==="a"&&(e.preventDefault(),Mr()),e.key==="Tab"&&Be?.speechEnabled&&setTimeout(()=>{let o=document.activeElement;if(!o)return;let i=o.getAttribute("aria-label")||o.getAttribute("title")||o.textContent?.trim()||o.tagName.toLowerCase(),a=o.getAttribute("role")||o.tagName.toLowerCase();Dt(`${i}, ${a}`)},100)}))}function At(e){let t=e.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[role="button"]');if(t.length===0)return;let n=t[0],o=t[t.length-1];n.focus(),e.addEventListener("keydown",i=>{i.key==="Tab"&&(i.shiftKey?document.activeElement===n&&(i.preventDefault(),o.focus()):document.activeElement===o&&(i.preventDefault(),n.focus()))})}function Mr(){if(typeof document>"u")return;if(_e){_e.remove(),_e=null;return}let e=document.createElement("div");e.setAttribute("role","dialog"),e.setAttribute("aria-label","Keyboard shortcuts"),e.setAttribute("aria-modal","true"),e.setAttribute("data-yuktai-cheatsheet","true"),e.style.cssText=`
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
    ${t.map(([o,i])=>`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #2a2a4a">
        <kbd style="background:#2a2a4a;color:#74c0fc;padding:3px 8px;border-radius:4px;font-size:12px;font-family:monospace;border:1px solid #3a3a6a">${o}</kbd>
        <span style="font-size:12px;color:#ccc;text-align:right;flex:1;margin-left:12px">${i}</span>
      </div>
    `).join("")}
  `,e.querySelector("[data-yuktai-close]")?.addEventListener("click",()=>{e.remove(),_e=null}),e.addEventListener("keydown",o=>{o.key==="Escape"&&(e.remove(),_e=null)}),document.body.appendChild(e),_e=e,At(e),Q("Keyboard shortcuts opened. Press Escape to close.","info")}function Pr(e){if(typeof document>"u"||!Be?.showAuditBadge||typeof window<"u"&&!window.location.hostname.includes("localhost")&&!window.location.hostname.includes("127.0.0.1"))return;Ot&&Ot.remove();let t=e.score,n=t>=90?"#0f9d58":t>=70?"#f29900":"#d93025",o=t>=90?"\u267F":t>=70?"\u26A0":"\u2715",i=document.createElement("button");i.setAttribute("aria-label",`Accessibility score: ${t} out of 100`),i.setAttribute("data-yuktai-badge","true"),i.style.cssText=`
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
  `,i.innerHTML=`${o} ${t}/100 <span style="font-weight:400;opacity:0.85">${e.details.length} issues</span>`,i.addEventListener("click",()=>Gr(e)),document.body.appendChild(i),Ot=i}function Gr(e){let t=document.querySelector("[data-yuktai-audit-details]");if(t){t.remove();return}let n=document.createElement("div");n.setAttribute("data-yuktai-audit-details","true"),n.setAttribute("role","dialog"),n.setAttribute("aria-label","Accessibility audit details"),n.style.cssText=`
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
    ${e.details.slice(0,20).map(i=>`
      <div style="padding:6px 0;border-bottom:1px solid #2a2a4a">
        <div style="display:flex;gap:6px;align-items:center">
          <span style="background:${o[i.severity]};color:#fff;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:700;text-transform:uppercase">${i.severity}</span>
          <code style="color:#74c0fc">&lt;${i.tag}&gt;</code>
        </div>
        <div style="color:#ccc;margin-top:3px">${i.fix}</div>
      </div>
    `).join("")}
    ${e.details.length>20?`<div style="color:#888;padding:8px 0;text-align:center">+${e.details.length-20} more issues</div>`:""}
  `,n.addEventListener("keydown",i=>{i.key==="Escape"&&n.remove()}),document.body.appendChild(n),At(n)}function Jn(e){typeof document>"u"||(Wt&&clearTimeout(Wt),Wt=setTimeout(()=>{if(kt)return;let t=document.createElement("div");t.setAttribute("role","alertdialog"),t.setAttribute("aria-label","Session timeout warning"),t.setAttribute("aria-modal","true"),t.setAttribute("data-yuktai-timeout","true"),t.style.cssText=`
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
    `;let n=t.querySelector("[data-yuktai-extend]"),o=t.querySelector("[data-yuktai-dismiss]");n?.addEventListener("click",()=>{t.remove(),kt=null,Q("Session extended. You have more time.","success"),Be?.timeoutWarning&&Jn(Be.timeoutWarning)}),o?.addEventListener("click",()=>{t.remove(),kt=null}),document.body.appendChild(t),kt=t,At(t),Q("Warning: Your session will expire soon. Do you need more time?","warning")},e*1e3))}function Fr(e){if(typeof document>"u")return;let t=document.documentElement;if(t.toggleAttribute("data-yuktai-high-contrast",!!e.highContrast),t.toggleAttribute("data-yuktai-dark",!!e.darkMode),t.toggleAttribute("data-yuktai-reduce-motion",!!e.reduceMotion),t.toggleAttribute("data-yuktai-large-targets",!!e.largeTargets),t.toggleAttribute("data-yuktai-keyboard",!!e.keyboardHints),t.toggleAttribute("data-yuktai-dyslexia",!!e.dyslexiaFont),e.localFont?document.body.style.fontFamily=`"${e.localFont}", system-ui, sans-serif`:e.dyslexiaFont||(document.body.style.fontFamily=""),e.fontSizeMultiplier&&e.fontSizeMultiplier!==1?document.documentElement.style.fontSize=`${e.fontSizeMultiplier*100}%`:document.documentElement.style.fontSize="",e.colorBlindMode&&e.colorBlindMode!=="none"){let n=e.colorBlindMode==="achromatopsia"?"grayscale(100%)":`url(#${St[e.colorBlindMode]})`;document.body.style.filter=n}else document.body.style.filter=""}function zr(e){try{let t=localStorage.getItem("yuktai-a11y-prefs");t&&Object.assign(e,JSON.parse(t))}catch{}}async function Un(e){if(e){if(!await Mt()){Q("Plain English requires Chrome 127+","warning");return}Q("Rewriting page in plain English...","info",!1);let n=await In();Q(n.error?`Plain English failed: ${n.error}`:`${n.fixed} sections rewritten in plain English`,n.error?"error":"success",!1)}else Nn(),Q("Original text restored","info",!1)}async function Vn(e){if(e){if(!await Pt()){Q("Page summariser requires Chrome 127+","warning");return}Q("Generating page summary...","info",!1);let n=await Gn();Q(n.error?`Summary failed: ${n.error}`:"Page summary added at top",n.error?"error":"success",!1)}else yt(),Q("Page summary removed","info",!1)}async function Yn(e){if(e==="en"){Gt(),Q("Page restored to English","info",!1);return}Q(`Translating page to ${e}...`,"info",!1);let t=await Fn(e);Q(t.error?`Translation failed: ${t.error}`:`Page translated to ${e}`,t.error?"error":"success",!1)}async function Xn(e){if(e){if(!Ft()){Q("Voice control not supported in this browser","warning");return}$n(t=>{t.success&&Q(`Voice: ${t.action}`,"info",!1)}),Q("Voice control started. Say a command.","success",!1)}else zt(),Q("Voice control stopped","info",!1)}async function Kn(e){if(e){if(!await $t()){Q("Smart labels requires Chrome 127+","warning");return}Q("Generating smart labels...","info",!1);let n=await Dn();Q(n.error?`Smart labels failed: ${n.error}`:`${n.fixed} elements labelled`,n.error?"error":"success",!1)}else _n(),Q("Smart labels removed","info",!1)}function $r(){if(typeof document>"u"||Tt)return;let e=document.createElement("div");e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e.setAttribute("aria-relevant","text"),e.style.cssText="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);",document.body.appendChild(e),Tt=e}function Or(){if(typeof document>"u"||Bn)return;let e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("aria-hidden","true"),e.style.cssText="position:absolute;width:0;height:0;overflow:hidden;",e.innerHTML=`
    <defs>
      <filter id="${St.deuteranopia}">
        <feColorMatrix type="matrix"
          values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${St.protanopia}">
        <feColorMatrix type="matrix"
          values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${St.tritanopia}">
        <feColorMatrix type="matrix"
          values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"/>
      </filter>
    </defs>
  `,document.body.appendChild(e),Bn=e}function Qn(e){let t={critical:20,serious:10,moderate:5,minor:2},n=e.details.reduce((o,i)=>o+(t[i.severity]||0),0);return Math.max(0,Math.min(100,100-n))}var be={name:"yuktai-a11y",version:"4.0.0",observer:null,async execute(e){if(!e.enabled)return this.stopObserver(),"yuktai: disabled.";Be=e,zr(e),$r(),Or(),Ir(),Nr(),e.showSkipLinks!==!1&&Lr(),e.showPreferencePanel,Fr(e);let t=this.applyFixes(e);t.score=Qn(t),e.showAuditBadge&&Pr(t),e.timeoutWarning&&Jn(e.timeoutWarning),e.autoFix&&this.startObserver(e),e.plainEnglish&&await Un(!0),e.summarisePage&&await Vn(!0),e.translateLanguage&&e.translateLanguage!=="en"&&await Yn(e.translateLanguage),e.voiceControl&&await Xn(!0),e.smartLabels&&await Kn(!0);let n=`${t.fixed} fixes applied. Score: ${t.score}/100.`;return Q(n,t.score>=90?"success":"info",!1),`yuktai v4.0.0: ${n} Scanned ${t.scanned} elements in ${t.renderTime}ms.`},applyFixes(e){let t={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return t;let n=performance.now(),o=document.querySelectorAll("*");t.scanned=o.length;let i=(a,r,s,l)=>{t.details.push({tag:a,fix:r,severity:s,element:l.outerHTML.slice(0,100)}),t.fixed++};return o.forEach(a=>{let r=a,s=r.tagName.toLowerCase();if(s==="html"&&!r.getAttribute("lang")&&(r.setAttribute("lang","en"),i(s,'lang="en" added',"critical",r)),s==="meta"){let u=r.getAttribute("name"),f=r.getAttribute("content")||"";u==="viewport"&&f.includes("user-scalable=no")&&(r.setAttribute("content",f.replace("user-scalable=no","user-scalable=yes")),i(s,"user-scalable=yes restored","serious",r)),u==="viewport"&&/maximum-scale=1(?:[^0-9]|$)/.test(f)&&(r.setAttribute("content",f.replace(/maximum-scale=1(?=[^0-9]|$)/,"maximum-scale=5")),i(s,"maximum-scale=5 restored","serious",r))}if(s==="main"&&!r.getAttribute("tabindex")&&(r.setAttribute("tabindex","-1"),r.getAttribute("id")||r.setAttribute("id","main-content")),s==="img"&&(r.hasAttribute("alt")||(r.setAttribute("alt",""),r.setAttribute("aria-hidden","true"),i(s,'alt="" aria-hidden="true"',"serious",r))),s==="svg"&&(!r.getAttribute("aria-hidden")&&!r.getAttribute("aria-label")&&!a.querySelector("title")&&(r.setAttribute("aria-hidden","true"),i(s,'aria-hidden="true" (decorative svg)',"minor",r)),r.getAttribute("focusable")||r.setAttribute("focusable","false")),s==="iframe"&&!r.getAttribute("title")&&!r.getAttribute("aria-label")&&(r.setAttribute("title","embedded content"),r.setAttribute("aria-label","embedded content"),i(s,"title + aria-label added","serious",r)),s==="button"){if(!r.innerText?.trim()&&!r.getAttribute("aria-label")){let u=r.getAttribute("title")||"button";r.setAttribute("aria-label",u),i(s,`aria-label="${u}" (empty button)`,"critical",r)}r.hasAttribute("disabled")&&!r.getAttribute("aria-disabled")&&(r.setAttribute("aria-disabled","true"),t.fixed++)}if(s==="a"){let u=r;!r.innerText?.trim()&&!r.getAttribute("aria-label")&&(r.setAttribute("aria-label",r.getAttribute("title")||"link"),i(s,"aria-label added (empty link)","critical",r)),u.target==="_blank"&&!u.rel?.includes("noopener")&&(u.rel="noopener noreferrer",t.fixed++)}if(jn.has(s)){let u=r;if(!r.getAttribute("aria-label")&&!r.getAttribute("aria-labelledby")){let f=r.getAttribute("placeholder")||r.getAttribute("name")||s;r.setAttribute("aria-label",f),i(s,`aria-label="${f}"`,"serious",r)}if(r.hasAttribute("required")&&!r.getAttribute("aria-required")&&(r.setAttribute("aria-required","true"),t.fixed++),s==="input"&&!u.autocomplete){let f=u.name||"";u.type==="email"||f.includes("email")?u.autocomplete="email":u.type==="tel"||f.includes("tel")?u.autocomplete="tel":u.type==="password"&&(u.autocomplete="current-password"),t.fixed++}}s==="th"&&!r.getAttribute("scope")&&(r.setAttribute("scope",r.closest("thead")?"col":"row"),i(s,"scope added to <th>","moderate",r)),Ht[s]&&!r.getAttribute("role")&&(r.setAttribute("role",Ht[s]),i(s,`role="${Ht[s]}"`,"minor",r));let l=r.getAttribute("role")||"";l==="tab"&&!r.getAttribute("aria-selected")&&(r.setAttribute("aria-selected","false"),t.fixed++),["alert","status","log"].includes(l)&&!r.getAttribute("aria-live")&&(r.setAttribute("aria-live",l==="alert"?"assertive":"polite"),i(s,`aria-live added on role=${l}`,"moderate",r)),l==="combobox"&&!r.getAttribute("aria-expanded")&&(r.setAttribute("aria-expanded","false"),i(s,'aria-expanded="false" on combobox',"serious",r)),(l==="checkbox"||l==="radio")&&!r.getAttribute("aria-checked")&&(r.setAttribute("aria-checked","false"),i(s,`aria-checked="false" on role=${l}`,"serious",r))}),t.renderTime=parseFloat((performance.now()-n).toFixed(2)),t},scan(){let e={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return e;let t=performance.now(),n=document.querySelectorAll("*");e.scanned=n.length;let o=(i,a,r,s)=>e.details.push({tag:i,fix:a,severity:r,element:s.outerHTML.slice(0,100)});return n.forEach(i=>{let a=i,r=a.tagName.toLowerCase();(r==="a"||r==="button")&&!a.innerText?.trim()&&!a.getAttribute("aria-label")&&o(r,"needs aria-label (empty)","critical",a),r==="img"&&!a.hasAttribute("alt")&&o(r,"needs alt text","serious",a),jn.has(r)&&!a.getAttribute("aria-label")&&!a.getAttribute("aria-labelledby")&&o(r,"needs aria-label","serious",a),r==="iframe"&&!a.getAttribute("title")&&!a.getAttribute("aria-label")&&o(r,"iframe needs title","serious",a)}),e.fixed=e.details.length,e.score=Qn(e),e.renderTime=parseFloat((performance.now()-t).toFixed(2)),e},startObserver(e){this.observer||typeof document>"u"||(this.observer=new MutationObserver(()=>this.applyFixes(e)),this.observer.observe(document.body,{childList:!0,subtree:!0,attributes:!1}))},stopObserver(){this.observer?.disconnect(),this.observer=null},announce:Q,speak:Dt,showVisualAlert:Zn,trapFocus:At,handlePlainEnglish:Un,handleSummarisePage:Vn,handleTranslate:Yn,handleVoiceControl:Xn,handleSmartLabels:Kn,SUPPORTED_LANGUAGES:vt};m();m();var W=Nt(require("react"));m();var ge=require("react");Bt();ot();var c=require("react/jsx-runtime"),Vt={highContrast:!1,reduceMotion:!1,autoFix:!0,dyslexiaFont:!1,fontScale:100,localFont:"",darkMode:!1,largeTargets:!1,speechEnabled:!1,colorBlindMode:"none",showAuditBadge:!1,timeoutWarning:void 0,plainEnglish:!1,summarisePage:!1,translateLanguage:"en",voiceControl:!1,smartLabels:!1},je=[80,90,100,110,120,130],Yr=[{value:"none",label:"None"},{value:"deuteranopia",label:"Deuteranopia"},{value:"protanopia",label:"Protanopia"},{value:"tritanopia",label:"Tritanopia"},{value:"achromatopsia",label:"Greyscale"}],Xr=["Prompt API for Gemini Nano","Summarization API for Gemini Nano","Writer API for Gemini Nano","Rewriter API for Gemini Nano","Translation API"];function Kr(){let[e,t]=(0,ge.useState)(typeof window<"u"?window.innerWidth:1024);return(0,ge.useEffect)(()=>{let n=()=>t(window.innerWidth);return window.addEventListener("resize",n),()=>window.removeEventListener("resize",n)},[]),{isMobile:e<=480,isTablet:e>480&&e<=768}}function Qr({checked:e,onChange:t,label:n,disabled:o=!1}){return(0,c.jsxs)("label",{"aria-label":n,style:{position:"relative",display:"inline-flex",width:"40px",height:"24px",cursor:o?"not-allowed":"pointer",flexShrink:0,opacity:o?.4:1},children:[(0,c.jsx)("input",{type:"checkbox",checked:e,disabled:o,onChange:i=>t(i.target.checked),style:{opacity:0,width:0,height:0,position:"absolute"}}),(0,c.jsx)("span",{style:{position:"absolute",inset:0,borderRadius:"99px",background:e?"#0d9488":"#cbd5e1",transition:"background 0.2s"}}),(0,c.jsx)("span",{style:{position:"absolute",top:"3px",left:e?"19px":"3px",width:"18px",height:"18px",background:"#fff",borderRadius:"50%",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)",pointerEvents:"none"}})]})}function Ue({label:e,color:t="#64748b",badge:n,concept:o}){return(0,c.jsxs)("div",{style:{margin:"10px 18px 4px"},children:[(0,c.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[(0,c.jsx)("p",{style:{margin:0,fontSize:"10px",fontWeight:600,color:t,letterSpacing:"0.06em",textTransform:"uppercase"},children:e}),n&&(0,c.jsx)("span",{style:{fontSize:"9px",fontWeight:500,padding:"1px 7px",borderRadius:"99px",background:"#f5f3ff",color:"#7c3aed",border:"0.5px solid #c4b5fd",whiteSpace:"nowrap"},children:n})]}),o&&(0,c.jsx)("p",{style:{margin:"2px 0 0",fontSize:"9px",color:"#94a3b8",fontStyle:"italic"},children:o})]})}function xe({icon:e,label:t,desc:n,checked:o,onChange:i,disabled:a=!1,disabledReason:r,tip:s}){return(0,c.jsxs)("div",{title:a?r:s,style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 18px",gap:"12px"},children:[(0,c.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"10px",flex:1,minWidth:0},children:[(0,c.jsx)("span",{"aria-hidden":"true",style:{width:"32px",height:"32px",borderRadius:"8px",background:a?"#f1f5f9":"#f0fdfa",color:a?"#94a3b8":"#0d9488",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"15px",flexShrink:0,fontWeight:700},children:e}),(0,c.jsxs)("div",{style:{minWidth:0},children:[(0,c.jsx)("p",{style:{margin:0,fontSize:"13px",fontWeight:500,color:a?"#94a3b8":"#0f172a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:t}),(0,c.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#94a3b8"},children:a?r:n})]})]}),(0,c.jsx)(Qr,{checked:o,onChange:i,label:`Toggle ${t}`,disabled:a})]})}function fe(){return(0,c.jsx)("div",{style:{height:"1px",background:"#f1f5f9"}})}function rt({steps:e}){return(0,c.jsxs)("div",{style:{margin:"0 18px 8px",padding:"8px 10px",background:"#f8fafc",borderRadius:"8px",border:"0.5px solid #e2e8f0"},children:[(0,c.jsx)("p",{style:{margin:"0 0 4px",fontSize:"9px",fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.05em"},children:"How to use"}),e.map((t,n)=>(0,c.jsxs)("p",{style:{margin:"0 0 2px",fontSize:"10px",color:"#475569"},children:[n+1,". ",t]},n))]})}var Yt=(0,ge.forwardRef)(({position:e,settings:t,report:n,isActive:o,aiSupported:i,voiceSupported:a,set:r,onApply:s,onReset:l,onClose:u},f)=>{let{isMobile:h,isTablet:N}=Kr(),[D,F]=(0,ge.useState)([]),[I,C]=(0,ge.useState)(""),[z,b]=(0,ge.useState)(""),[R,M]=(0,ge.useState)(!1),[y,Z]=(0,ge.useState)(null),[A,B]=(0,ge.useState)("idle");(0,ge.useEffect)(()=>{let p=window;!!(p.LanguageModel||p.ai?.languageModel)&&i?Z("gemini"):tt()&&Z("transformers")},[i]),(0,ge.useEffect)(()=>{if(y!=="transformers")return;let p=setInterval(()=>{B(nt())},500);return()=>clearInterval(p)},[y]);let ee=async()=>{if(!(!I.trim()||R)){if(!y){b("\u26A0\uFE0F No AI engine available on this device.");return}M(!0),b("");try{let p;y==="gemini"?p=await _t(I):(B("loading"),p=await jt(I),B("ready")),b(p.success&&p.answer?p.answer.replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/#+\s/g,"").trim():"\u26A0\uFE0F "+(p.error||"No answer found on this page"))}catch{b("\u26A0\uFE0F Failed to get answer. Please try again.")}M(!1)}};(0,ge.useEffect)(()=>{(async()=>{try{let U=window;if(!U.queryLocalFonts)return;let J=await U.queryLocalFonts(),H=[...new Set(J.map($=>$.family))].sort();F(H.slice(0,50))}catch{}})()},[]);let G=y==="gemini"?"Gemini Nano":y==="transformers"?"Transformers.js \xB7 All devices":"Detecting...",re=y==="transformers"&&A==="loading"?"Loading AI model... (first time only)":"...",v=h?{position:"fixed",bottom:0,left:0,right:0,zIndex:9999,background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px 16px 0 0",boxShadow:"0 -8px 32px rgba(0,0,0,0.12)",maxHeight:"90vh",overflowY:"auto",fontFamily:"system-ui,-apple-system,sans-serif",width:"100%"}:{position:"fixed",bottom:"84px",[e]:"24px",zIndex:9999,width:N?"300px":"320px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",maxHeight:"80vh",overflowY:"auto",fontFamily:"system-ui,-apple-system,sans-serif"};return(0,c.jsxs)("div",{ref:f,role:"dialog","aria-modal":"true","aria-label":"yuktai accessibility preferences","data-yuktai-panel":"true",style:v,children:[(0,c.jsxs)("div",{style:{padding:"14px 18px 12px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"flex-start",justifyContent:"space-between",position:"sticky",top:0,background:"#fff",zIndex:1},children:[(0,c.jsxs)("div",{children:[(0,c.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"7px",marginBottom:"4px",flexWrap:"wrap"},children:[(0,c.jsx)("span",{style:{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0d9488",letterSpacing:"0.05em",fontFamily:"monospace"},children:"@yuktishaalaa/yuktai"}),o&&(0,c.jsx)("span",{style:{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0f766e",border:"1px solid #99f6e4"},children:"\u25CF ACTIVE"})]}),(0,c.jsx)("p",{style:{margin:"0 0 1px",fontSize:"15px",fontWeight:600,color:"#0f172a"},children:"Accessibility"}),(0,c.jsx)("p",{style:{margin:0,fontSize:"11px",color:"#64748b"},children:"WCAG 2.2 \xB7 Open source \xB7 Zero cost \xB7 All devices"})]}),(0,c.jsx)("button",{onClick:u,"aria-label":"Close accessibility panel",style:{background:"none",border:"none",cursor:"pointer",padding:"4px",color:"#94a3b8",fontSize:"20px",lineHeight:1,borderRadius:"6px",flexShrink:0,minWidth:h?"44px":"auto",minHeight:h?"44px":"auto",display:"flex",alignItems:"center",justifyContent:"center"},children:"\xD7"})]}),(0,c.jsx)(Ue,{label:"\u267F Core Accessibility",concept:"Rule-based engine \u2014 works on all browsers and devices"}),(0,c.jsx)(rt,{steps:["Toggle any feature on","Click Apply settings","Preferences saved automatically"]}),(0,c.jsx)(xe,{icon:"\u{1F527}",label:"Auto-fix ARIA",desc:"Injects missing labels and roles automatically",checked:t.autoFix,onChange:p=>r("autoFix",p),tip:"Fixes aria-label, alt text, roles on every element"}),(0,c.jsx)(fe,{}),(0,c.jsx)(xe,{icon:"\u{1F50A}",label:"Speak on focus",desc:"Browser reads elements aloud as you tab",checked:t.speechEnabled,onChange:p=>r("speechEnabled",p),tip:"Uses browser SpeechSynthesis \u2014 no install needed"}),(0,c.jsx)(fe,{}),(0,c.jsx)(xe,{icon:"\u{1F399}\uFE0F",label:"Voice control",desc:"Say commands to navigate the page",checked:t.voiceControl,onChange:p=>r("voiceControl",p),disabled:!a,disabledReason:"Not supported in this browser",tip:'Say "scroll down", "go to main", "click"'}),(0,c.jsx)(fe,{}),(0,c.jsx)(Ue,{label:"\u{1F916} AI Features",color:"#7c3aed",badge:"Gemini Nano",concept:"Large Language Model running privately on your device \u2014 Chrome 127+ only"}),(0,c.jsx)("div",{style:{margin:"4px 18px 6px",padding:"8px 10px",background:i?"#f0fdfa":"#f5f3ff",borderRadius:"8px",border:`0.5px solid ${i?"#99f6e4":"#c4b5fd"}`,fontSize:"10px",color:i?"#0f766e":"#7c3aed",lineHeight:1.5},children:i?"\u2705 Gemini Nano detected \u2014 AI features ready. Runs privately on your device.":"\u2699\uFE0F AI features need one-time setup \u2014 see guide below."}),!i&&(0,c.jsxs)("div",{style:{margin:"0 18px 8px",padding:"10px 12px",background:"#fafafa",borderRadius:"8px",border:"0.5px solid #e2e8f0",fontSize:"11px",color:"#475569",lineHeight:1.7},children:[(0,c.jsx)("p",{style:{margin:"0 0 6px",fontWeight:600,color:"#0f172a",fontSize:"11px"},children:"\u{1F6E0} One-time setup \u2014 5 steps:"}),(0,c.jsxs)("p",{style:{margin:"0 0 3px"},children:["1. Open Chrome \u2192 ",(0,c.jsx)("code",{style:{background:"#f1f5f9",padding:"1px 5px",borderRadius:"4px",fontSize:"10px",color:"#0d9488",fontFamily:"monospace"},children:"chrome://flags"})]}),(0,c.jsx)("p",{style:{margin:"0 0 3px"},children:"2. Enable each flag:"}),(0,c.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"2px",margin:"4px 0 6px 10px"},children:Xr.map(p=>(0,c.jsxs)("span",{style:{fontSize:"10px",color:"#7c3aed",fontFamily:"monospace"},children:["\u2192 ",p]},p))}),(0,c.jsxs)("p",{style:{margin:"0 0 3px"},children:["3. Click ",(0,c.jsx)("strong",{style:{color:"#0f172a"},children:"Relaunch"})]}),(0,c.jsxs)("p",{style:{margin:"0 0 3px"},children:["4. ",(0,c.jsx)("code",{style:{background:"#f1f5f9",padding:"1px 5px",borderRadius:"4px",fontSize:"10px",color:"#0d9488",fontFamily:"monospace"},children:"chrome://components"})," \u2192 Optimization Guide On Device Model \u2192 Check for update"]}),(0,c.jsx)("p",{style:{margin:"0"},children:"5. Refresh \u2014 AI features unlock automatically \u2705"})]}),(0,c.jsx)(xe,{icon:"\u{1F4DD}",label:"Plain English mode",desc:"Rewrites complex text in simple language",checked:t.plainEnglish,onChange:p=>r("plainEnglish",p),disabled:!i,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: LLM text rewriting"}),(0,c.jsx)(fe,{}),(0,c.jsx)(xe,{icon:"\u{1F4CB}",label:"Summarise page",desc:"3-sentence summary appears at top",checked:t.summarisePage,onChange:p=>r("summarisePage",p),disabled:!i,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: Abstractive summarisation"}),(0,c.jsx)(fe,{}),(0,c.jsx)(xe,{icon:"\u{1F3F7}\uFE0F",label:"Smart aria-labels",desc:"AI generates meaningful labels for elements",checked:t.smartLabels,onChange:p=>r("smartLabels",p),disabled:!i,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: Context-aware label generation"}),(0,c.jsx)(fe,{}),(0,c.jsx)(Ue,{label:"\u{1F441}\uFE0F Visual",concept:"CSS filter-based \u2014 works on all browsers and devices"}),(0,c.jsx)(rt,{steps:["Toggle any visual mode","Changes apply instantly","Works on mobile and desktop"]}),(0,c.jsx)(xe,{icon:"\u25D1",label:"High contrast",desc:"Boosts contrast for low vision users",checked:t.highContrast,onChange:p=>r("highContrast",p),tip:"CSS filter: contrast()"}),(0,c.jsx)(fe,{}),(0,c.jsx)(xe,{icon:"\u{1F319}",label:"Dark mode",desc:"Inverts colours \u2014 easy on eyes at night",checked:t.darkMode,onChange:p=>r("darkMode",p),tip:"CSS filter: invert + hue-rotate"}),(0,c.jsx)(fe,{}),(0,c.jsx)(xe,{icon:"\u23F8\uFE0F",label:"Reduce motion",desc:"Disables all animations",checked:t.reduceMotion,onChange:p=>r("reduceMotion",p),tip:"WCAG 2.3.3 \u2014 vestibular disorders"}),(0,c.jsx)(fe,{}),(0,c.jsx)(xe,{icon:"\u{1F446}",label:"Large targets",desc:"44\xD744px minimum touch targets",checked:t.largeTargets,onChange:p=>r("largeTargets",p),tip:"WCAG 2.5.8 \u2014 motor impaired users"}),(0,c.jsx)(fe,{}),(0,c.jsxs)("div",{style:{padding:"10px 18px"},children:[(0,c.jsx)("p",{style:{margin:"0 0 2px",fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F3A8} Colour blindness"}),(0,c.jsx)("p",{style:{margin:"0 0 8px",fontSize:"10px",color:"#94a3b8"},children:"SVG colour matrix filters \u2014 all devices"}),(0,c.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"},children:Yr.map(p=>(0,c.jsx)("button",{onClick:()=>r("colorBlindMode",p.value),"aria-pressed":t.colorBlindMode===p.value,style:{padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500,border:`1px solid ${t.colorBlindMode===p.value?"#0d9488":"#e2e8f0"}`,background:t.colorBlindMode===p.value?"#f0fdfa":"#fff",color:t.colorBlindMode===p.value?"#0d9488":"#64748b",cursor:"pointer",minHeight:h?"36px":"auto"},children:p.label},p.value))})]}),(0,c.jsx)(fe,{}),(0,c.jsx)(Ue,{label:"\u{1F524} Font",concept:"Browser Font API + CSS \u2014 Chrome 103+"}),(0,c.jsx)(rt,{steps:["Toggle dyslexia font or pick from device","Adjust size with + / \u2212","Saved across visits"]}),(0,c.jsx)(xe,{icon:"Aa",label:"Dyslexia-friendly font",desc:"Atkinson Hyperlegible \u2014 research-backed",checked:t.dyslexiaFont,onChange:p=>r("dyslexiaFont",p),tip:"By Braille Institute \u2014 free and open source"}),(0,c.jsx)(fe,{}),(0,c.jsxs)("div",{style:{padding:"10px 18px"},children:[(0,c.jsx)("p",{style:{margin:"0 0 2px",fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F5A5}\uFE0F Local font"}),(0,c.jsx)("p",{style:{margin:"0 0 8px",fontSize:"10px",color:"#94a3b8"},children:"window.queryLocalFonts() \u2014 Chrome 103+"}),D.length>0?(0,c.jsxs)("select",{value:t.localFont,onChange:p=>r("localFont",p.target.value),"aria-label":"Choose a font from your device",style:{width:"100%",padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"13px",color:"#0f172a",background:"#fff",cursor:"pointer",height:h?"44px":"36px"},children:[(0,c.jsx)("option",{value:"",children:"System default"}),D.map(p=>(0,c.jsx)("option",{value:p,style:{fontFamily:p},children:p},p))]}):(0,c.jsx)("p",{style:{margin:0,fontSize:"11px",color:"#94a3b8"},children:"Allow font access when Chrome prompts you."})]}),(0,c.jsx)(fe,{}),(0,c.jsxs)("div",{style:{padding:"10px 18px 14px"},children:[(0,c.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"10px"},children:[(0,c.jsxs)("div",{children:[(0,c.jsx)("p",{style:{margin:0,fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F4CF} Text size"}),(0,c.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#94a3b8"},children:"Scales all text on the page"})]}),(0,c.jsxs)("span",{style:{fontSize:"12px",fontWeight:600,color:"#0d9488",background:"#f0fdfa",padding:"2px 8px",borderRadius:"99px"},children:[t.fontScale,"%"]})]}),(0,c.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[(0,c.jsx)("button",{onClick:()=>{let p=je.indexOf(t.fontScale);p>0&&r("fontScale",je[p-1])},disabled:t.fontScale<=80,"aria-label":"Decrease text size",style:{width:h?"44px":"30px",height:h?"44px":"30px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:t.fontScale<=80?"not-allowed":"pointer",fontSize:"16px",color:t.fontScale<=80?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"\u2212"}),(0,c.jsx)("div",{style:{flex:1,display:"flex",gap:"3px"},children:je.map(p=>(0,c.jsx)("button",{onClick:()=>r("fontScale",p),"aria-label":`Set text size to ${p}%`,style:{flex:1,height:"6px",borderRadius:"99px",border:"none",cursor:"pointer",padding:0,background:p<=t.fontScale?"#0d9488":"#e2e8f0",transition:"background 0.15s"}},p))}),(0,c.jsx)("button",{onClick:()=>{let p=je.indexOf(t.fontScale);p<je.length-1&&r("fontScale",je[p+1])},disabled:t.fontScale>=130,"aria-label":"Increase text size",style:{width:h?"44px":"30px",height:h?"44px":"30px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:t.fontScale>=130?"not-allowed":"pointer",fontSize:"16px",color:t.fontScale>=130?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"+"})]})]}),(0,c.jsx)(fe,{}),(0,c.jsx)(Ue,{label:"\u{1F310} Translate",color:"#7c3aed",badge:"Gemini Nano",concept:"Chrome Translation API \u2014 on device, no internet after setup"}),(0,c.jsx)(rt,{steps:["Enable Gemini Nano first","Pick your language","Full page translates instantly"]}),(0,c.jsxs)("div",{style:{padding:"6px 18px 12px"},children:[(0,c.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"},children:vt.slice(0,h?8:18).map(p=>(0,c.jsx)("button",{onClick:()=>r("translateLanguage",p.code),"aria-pressed":t.translateLanguage===p.code,disabled:!i,style:{padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500,border:`1px solid ${t.translateLanguage===p.code?"#7c3aed":"#e2e8f0"}`,background:t.translateLanguage===p.code?"#f5f3ff":"#fff",color:t.translateLanguage===p.code?"#7c3aed":"#64748b",cursor:i?"pointer":"not-allowed",opacity:i?1:.5,minHeight:h?"36px":"auto"},children:p.label},p.code))}),!i&&(0,c.jsx)("p",{style:{margin:"6px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Enable Gemini Nano using the setup guide above."})]}),(0,c.jsx)(fe,{}),(0,c.jsx)(Ue,{label:"\u{1F4AC} Ask This Page",color:"#0d9488",badge:G,concept:"RAG \u2014 Retrieval Augmented Generation. Works on all devices including mobile."}),(0,c.jsx)(rt,{steps:["Type any question about this page","Press Ask or hit Enter",y==="transformers"?"Transformers.js answers \u2014 works on mobile, offline":"Gemini Nano reads page and answers privately","Zero cost. No data leaves your device."]}),(0,c.jsxs)("div",{style:{margin:"0 18px 8px",padding:"6px 10px",background:y==="gemini"?"#f0fdfa":y==="transformers"?"#f5f3ff":"#f8fafc",borderRadius:"8px",border:`0.5px solid ${y==="gemini"?"#99f6e4":y==="transformers"?"#c4b5fd":"#e2e8f0"}`,fontSize:"10px",color:y==="gemini"?"#0f766e":y==="transformers"?"#7c3aed":"#94a3b8"},children:[y==="gemini"&&"\u2705 Using Gemini Nano \u2014 on device, private, instant",y==="transformers"&&"\u2705 Using Transformers.js \u2014 works on mobile and all browsers",!y&&"\u23F3 Detecting AI engine...",y==="transformers"&&A==="loading"&&" \xB7 Loading model...",y==="transformers"&&A==="ready"&&" \xB7 Model ready \u2705"]}),(0,c.jsxs)("div",{style:{padding:"0 18px 14px"},children:[(0,c.jsxs)("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[(0,c.jsx)("input",{type:"text",value:I,onChange:p=>C(p.target.value),onKeyDown:p=>{p.key==="Enter"&&ee()},placeholder:"e.g. What does this page do?",disabled:R||!y,"aria-label":"Ask a question about this page",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:y?"#fff":"#f8fafc",outline:"none",height:h?"44px":"36px"}}),(0,c.jsx)("button",{onClick:ee,disabled:R||!I.trim()||!y,"aria-label":"Ask question",style:{padding:"8px 14px",borderRadius:"8px",border:"none",background:y&&I.trim()&&!R?"#0d9488":"#e2e8f0",color:y&&I.trim()&&!R?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:y&&I.trim()&&!R?"pointer":"not-allowed",flexShrink:0,height:h?"44px":"36px",minWidth:"52px",transition:"background 0.2s"},children:R?re:"Ask"})]}),z&&(0,c.jsxs)("div",{role:"status","aria-live":"polite",style:{padding:"10px 12px",background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"8px",fontSize:"12px",color:"#0f766e",lineHeight:1.6,maxHeight:"180px",overflowY:"auto"},children:[(0,c.jsx)("strong",{style:{display:"block",marginBottom:"4px",fontSize:"11px",color:"#0d9488"},children:"\u{1F4AC} Answer"}),z,(0,c.jsx)("button",{onClick:()=>{b(""),C("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]})]}),n&&(0,c.jsx)("div",{role:"status",style:{margin:"0 14px 10px",padding:"8px 12px",background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"8px",fontSize:"12px",color:"#0f766e",fontWeight:500,fontFamily:"monospace"},children:n.fixed>0?`\u2713 ${n.fixed} fixes \xB7 ${n.scanned} nodes \xB7 ${n.renderTime}ms \xB7 Score: ${n.score}/100`:`\u2713 0 auto-fixes needed \xB7 ${n.scanned} nodes \xB7 ${n.renderTime}ms`}),(0,c.jsxs)("div",{style:{display:"flex",gap:"8px",padding:"12px 14px 14px",position:h?"sticky":"relative",bottom:h?0:"auto",background:"#fff",borderTop:"1px solid #f1f5f9"},children:[(0,c.jsx)("button",{onClick:l,style:{flex:1,padding:h?"12px 0":"8px 0",fontSize:"13px",fontWeight:500,borderRadius:"9px",border:"1px solid #e2e8f0",background:"#fff",color:"#64748b",cursor:"pointer"},children:"Reset"}),(0,c.jsx)("button",{onClick:s,style:{flex:2,padding:h?"12px 0":"8px 0",fontSize:"13px",fontWeight:600,borderRadius:"9px",border:"none",background:"#0d9488",color:"#fff",cursor:"pointer"},children:"Apply settings"})]})]})});Yt.displayName="WidgetPanel";ot();m();var Ee=require("react");m();var Zr={hotel:["hotel","resort","motel","inn","accommodation","lodge","stay","room","booking","hospitality"],ecommerce:["shop","store","ecommerce","e-commerce","sell","product","cart","buy","marketplace","retail"],restaurant:["restaurant","food","cafe","cafeteria","menu","dining","eat","cuisine","bistro","takeaway","delivery"],portfolio:["portfolio","freelance","personal","designer","developer","creative","showcase","work","hire me"],blog:["blog","article","post","write","news","magazine","journal","content"],saas:["saas","dashboard","app","software","platform","tool","analytics","admin","manage","crm"],government:["government","govt","portal","citizen","scheme","welfare","municipal","public","official"],healthcare:["hospital","clinic","doctor","health","medical","patient","appointment","pharmacy"],education:["school","college","university","course","learn","education","student","lms","training"],realestate:["real estate","property","house","flat","apartment","rent","buy property","listing"],landing:["landing","startup","launch","product launch","coming soon","waitlist"],generic:[]},Jr={hotel:["home","rooms","booking","about","contact"],ecommerce:["home","products","cart","checkout","about","contact"],restaurant:["home","menu","reservations","about","contact"],portfolio:["home","portfolio","about","contact"],blog:["home","blog","about","contact"],saas:["home","pricing","dashboard","auth","about","contact"],government:["home","services","about","contact","faq"],healthcare:["home","services","booking","team","about","contact"],education:["home","services","pricing","about","contact"],realestate:["home","products","about","contact"],landing:["home","pricing","about","contact"],generic:["home","about","services","contact"]},ei={home:["home","homepage","main","landing"],about:["about","who we are","our story","company"],contact:["contact","reach us","get in touch","location"],services:["service","what we offer","solution","offering"],pricing:["pricing","price","plan","subscription","cost","fee"],blog:["blog","article","news","post"],auth:["login","register","signup","sign up","sign in","auth","account"],dashboard:["dashboard","admin","panel","manage","analytics"],gallery:["gallery","photo","image","portfolio"],products:["product","shop","store","item","catalogue"],cart:["cart","basket","shopping cart"],checkout:["checkout","payment","pay","order"],rooms:["room","suite","accommodation","stay"],booking:["booking","reserve","reservation","schedule","appointment"],menu:["menu","food","dish","cuisine"],reservations:["reservation","table booking","book table"],portfolio:["portfolio","work","project","case study"],team:["team","staff","member","people","who we are"],faq:["faq","question","answer","help","support"],terms:["terms","condition","legal"],privacy:["privacy","policy","gdpr","data"]},ti={Authentication:["login","register","auth","signup","sign in","account"],Payment:["payment","stripe","pay","checkout","billing"],Search:["search","filter","find"],"Dark mode":["dark mode","dark theme","night mode"],"Multi-language":["multilingual","multi language","translation","i18n"],SEO:["seo","search engine","meta","google"],Analytics:["analytics","tracking","stats","dashboard"],Email:["email","newsletter","contact form","notification"],Map:["map","location","address","google maps"],"Social media":["social","instagram","facebook","twitter","share"],"Image gallery":["gallery","photo","image","carousel"],"Booking system":["booking","reservation","appointment","schedule"],"Shopping cart":["cart","basket","shop","ecommerce"],"Blog/CMS":["blog","cms","content","article","post"]},ni={blue:["blue","navy","sky","ocean","corporate"],green:["green","nature","eco","environment","health","fresh"],purple:["purple","violet","luxury","creative","royal"],red:["red","bold","energy","passion","food"],orange:["orange","warm","friendly","fun"],teal:["teal","turquoise","modern","tech"],indigo:["indigo","professional","trust","finance","bank"],gray:["gray","minimal","clean","simple","neutral"]},oi={hotel:"indigo",ecommerce:"blue",restaurant:"red",portfolio:"purple",blog:"gray",saas:"teal",government:"blue",healthcare:"green",education:"indigo",realestate:"orange",landing:"purple",generic:"blue"};function ri(e){let t=[/(?:for|called|named|company|business|brand)\s+["']?([A-Z][a-zA-Z\s]{1,30})["']?/i,/["']([A-Z][a-zA-Z\s]{1,30})["']/,/^([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)?)/m];for(let n of t){let o=e.match(n);if(o?.[1]){let i=o[1].trim();if(i.length>2&&i.length<40)return i}}return"My Business"}function ii(e){let t=e.toLowerCase(),n="generic",o=0;for(let[i,a]of Object.entries(Zr)){let r=0;for(let s of a)t.includes(s)&&r++;r>o&&(o=r,n=i)}return n}function ai(e,t){let n=e.toLowerCase(),o=new Set(Jr[t]);for(let[i,a]of Object.entries(ei))for(let r of a)if(n.includes(r)){o.add(i);break}return o.add("home"),o.add("contact"),Array.from(o)}function si(e){let t=e.toLowerCase(),n=[];for(let[o,i]of Object.entries(ti))for(let a of i)if(t.includes(a)){n.push(o);break}return n}function li(e,t){let n=e.toLowerCase();for(let[o,i]of Object.entries(ni))for(let a of i)if(n.includes(a))return o;return oi[t]}function io(e){let t=ii(e),n=ai(e,t),o=si(e),i=li(e,t);return{siteName:ri(e),websiteType:t,pages:n,features:o,theme:i,description:e.slice(0,200)}}var k=require("react/jsx-runtime"),pi=["Hotel booking website for Grand Palace Hotels with rooms, booking and payment","E-commerce store for organic food products with cart and checkout","Restaurant website for Spice Garden with menu and table reservations","Portfolio website for a freelance designer with gallery and contact","SaaS dashboard for project management with pricing and auth","Government portal for citizen services with FAQ and contact"],fi={home:"\u{1F3E0}",about:"\u2139\uFE0F",contact:"\u{1F4EC}",services:"\u2699\uFE0F",pricing:"\u{1F4B0}",blog:"\u{1F4DD}",auth:"\u{1F510}",dashboard:"\u{1F4CA}",gallery:"\u{1F5BC}\uFE0F",products:"\u{1F6D2}",cart:"\u{1F6CD}\uFE0F",checkout:"\u{1F4B3}",rooms:"\u{1F6CF}\uFE0F",booking:"\u{1F4C5}",menu:"\u{1F37D}\uFE0F",reservations:"\u{1FA91}",portfolio:"\u{1F4BC}",team:"\u{1F465}",faq:"\u2753",terms:"\u{1F4C4}",privacy:"\u{1F512}"},gi={hotel:"\u{1F3E8}",ecommerce:"\u{1F6D2}",restaurant:"\u{1F37D}\uFE0F",portfolio:"\u{1F4BC}",blog:"\u{1F4DD}",saas:"\u26A1",government:"\u{1F3DB}\uFE0F",healthcare:"\u{1F3E5}",education:"\u{1F393}",realestate:"\u{1F3E0}",landing:"\u{1F680}",generic:"\u{1F310}"};function Kt({position:e,onClose:t}){let[n,o]=(0,Ee.useState)("input"),[i,a]=(0,Ee.useState)(""),[r,s]=(0,Ee.useState)(null),[l,u]=(0,Ee.useState)(0),[f,h]=(0,Ee.useState)(""),N=(0,Ee.useCallback)(()=>{if(!i.trim())return;let C=io(i);s(C),o("preview")},[i]),D=(0,Ee.useCallback)(async()=>{if(r){o("generating"),u(0),h("");try{let C=[{msg:"Parsing requirement...",pct:15},{msg:"Loading templates...",pct:30},{msg:"Generating pages...",pct:55},{msg:"Building components...",pct:70},{msg:"Creating styles...",pct:85},{msg:"Packaging ZIP...",pct:95}];for(let b of C)u(b.pct),await new Promise(R=>setTimeout(R,200));let{generateZip:z}=await Promise.resolve().then(()=>(Go(),Po));await z(r),u(100),o("done")}catch(C){h(C instanceof Error?C.message:"Generation failed. Please try again."),o("preview")}}},[r]),F=()=>{o("input"),a(""),s(null),u(0),h("")},I={position:"fixed",bottom:"204px",[e]:"24px",zIndex:9999,width:"340px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.14)",fontFamily:"system-ui,-apple-system,sans-serif",maxHeight:"75vh",overflowY:"auto"};return(0,k.jsxs)("div",{role:"dialog","aria-modal":"true","aria-label":"yuktai Vibe Coder","data-yuktai-panel":"true",style:I,children:[(0,k.jsxs)("div",{style:{padding:"14px 16px 12px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"flex-start",justifyContent:"space-between",position:"sticky",top:0,background:"#fff",zIndex:1},children:[(0,k.jsxs)("div",{children:[(0,k.jsx)("p",{style:{margin:"0 0 2px",fontSize:"13px",fontWeight:700,color:"#0f172a"},children:"\u26A1 Vibe Coder"}),(0,k.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#64748b"},children:"Describe your website \u2192 Download Next.js ZIP"})]}),(0,k.jsx)("button",{onClick:t,"aria-label":"Close vibe coder",style:{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"18px",padding:"2px"},children:"\xD7"})]}),n==="input"&&(0,k.jsxs)("div",{style:{padding:"14px 16px"},children:[(0,k.jsx)("p",{style:{margin:"0 0 10px",fontSize:"11px",color:"#64748b"},children:"Describe your business website in plain English. The plugin will generate a complete Next.js project for you."}),(0,k.jsx)("p",{style:{margin:"0 0 6px",fontSize:"10px",fontWeight:600,color:"#94a3b8",textTransform:"uppercase"},children:"Examples"}),(0,k.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"4px",marginBottom:"12px"},children:pi.slice(0,3).map(C=>(0,k.jsx)("button",{onClick:()=>a(C),style:{padding:"6px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#f8fafc",color:"#475569",fontSize:"10px",cursor:"pointer",textAlign:"left",lineHeight:1.4},children:C},C))}),(0,k.jsx)("textarea",{value:i,onChange:C=>a(C.target.value),placeholder:"e.g. I need a hotel booking website with rooms, search, and payment for Grand Palace Hotels",rows:4,"aria-label":"Describe your website",style:{width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.5}}),(0,k.jsx)("button",{onClick:N,disabled:!i.trim(),style:{width:"100%",marginTop:"10px",padding:"10px",borderRadius:"8px",border:"none",background:i.trim()?"#f59e0b":"#e2e8f0",color:i.trim()?"#fff":"#94a3b8",fontSize:"13px",fontWeight:700,cursor:i.trim()?"pointer":"not-allowed",transition:"background 0.2s"},children:"Analyse Requirement \u2192"})]}),n==="preview"&&r&&(0,k.jsxs)("div",{style:{padding:"14px 16px"},children:[f&&(0,k.jsxs)("div",{style:{padding:"10px",background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:"8px",marginBottom:"12px",fontSize:"11px",color:"#dc2626"},children:["\u26A0\uFE0F ",f]}),(0,k.jsxs)("div",{style:{background:"#f8fafc",borderRadius:"10px",padding:"12px",marginBottom:"12px"},children:[(0,k.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"},children:[(0,k.jsx)("span",{style:{fontSize:"1.5rem"},children:gi[r.websiteType]||"\u{1F310}"}),(0,k.jsxs)("div",{children:[(0,k.jsx)("p",{style:{margin:0,fontSize:"13px",fontWeight:700,color:"#0f172a"},children:r.siteName}),(0,k.jsxs)("p",{style:{margin:0,fontSize:"10px",color:"#64748b",textTransform:"capitalize"},children:[r.websiteType," website \xB7 ",r.theme," theme"]})]})]}),(0,k.jsxs)("p",{style:{margin:"8px 0 6px",fontSize:"10px",fontWeight:600,color:"#94a3b8",textTransform:"uppercase"},children:["Pages to generate (",r.pages.length,")"]}),(0,k.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"4px"},children:r.pages.map(C=>(0,k.jsxs)("span",{style:{padding:"2px 8px",borderRadius:"99px",background:"#f0fdf4",border:"1px solid #86efac",fontSize:"10px",color:"#166534",fontWeight:500},children:[fi[C]||"\u{1F4C4}"," ",C]},C))}),r.features.length>0&&(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)("p",{style:{margin:"10px 0 6px",fontSize:"10px",fontWeight:600,color:"#94a3b8",textTransform:"uppercase"},children:"Detected features"}),(0,k.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"4px"},children:r.features.map(C=>(0,k.jsx)("span",{style:{padding:"2px 8px",borderRadius:"99px",background:"#f5f3ff",border:"1px solid #c4b5fd",fontSize:"10px",color:"#7c3aed",fontWeight:500},children:C},C))})]})]}),(0,k.jsxs)("div",{style:{margin:"0 0 12px",padding:"10px 12px",background:"#f0fdf4",borderRadius:"8px",border:"1px solid #86efac"},children:[(0,k.jsx)("p",{style:{margin:"0 0 4px",fontSize:"10px",fontWeight:700,color:"#166534"},children:"\u{1F4E6} What you get:"}),(0,k.jsxs)("p",{style:{margin:0,fontSize:"10px",color:"#166534",lineHeight:1.6},children:["\u2705 Complete Next.js 16 project",(0,k.jsx)("br",{}),"\u2705 Tailwind CSS + CSS Modules",(0,k.jsx)("br",{}),"\u2705 TypeScript configured",(0,k.jsx)("br",{}),"\u2705 Navbar + Footer components",(0,k.jsx)("br",{}),"\u2705 All ",r.pages.length," pages ready",(0,k.jsx)("br",{}),"\u2705 Mobile responsive",(0,k.jsx)("br",{}),"\u2705 npm run dev \u2192 works immediately"]})]}),(0,k.jsxs)("div",{style:{display:"flex",gap:"8px"},children:[(0,k.jsx)("button",{onClick:F,style:{flex:1,padding:"9px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",color:"#64748b",fontSize:"12px",fontWeight:600,cursor:"pointer"},children:"\u2190 Edit"}),(0,k.jsx)("button",{onClick:D,style:{flex:2,padding:"9px",borderRadius:"8px",border:"none",background:"#f59e0b",color:"#fff",fontSize:"13px",fontWeight:700,cursor:"pointer"},children:"\u2B07\uFE0F Generate & Download ZIP"})]})]}),n==="generating"&&(0,k.jsxs)("div",{style:{padding:"2rem 16px",textAlign:"center"},children:[(0,k.jsx)("p",{style:{fontSize:"2rem",marginBottom:"1rem"},children:"\u26A1"}),(0,k.jsx)("p",{style:{fontSize:"13px",fontWeight:700,color:"#0f172a",marginBottom:"0.5rem"},children:"Generating your project..."}),(0,k.jsx)("p",{style:{fontSize:"11px",color:"#64748b",marginBottom:"1.5rem"},children:l<30?"Parsing requirement...":l<55?"Loading templates...":l<70?"Generating pages...":l<85?"Building components...":l<95?"Creating styles...":"Packaging ZIP..."}),(0,k.jsx)("div",{style:{height:"8px",background:"#e2e8f0",borderRadius:"99px",overflow:"hidden"},children:(0,k.jsx)("div",{style:{height:"100%",width:`${l}%`,background:"#f59e0b",borderRadius:"99px",transition:"width 0.3s ease"}})}),(0,k.jsxs)("p",{style:{marginTop:"0.5rem",fontSize:"10px",color:"#94a3b8"},children:[l,"%"]})]}),n==="done"&&r&&(0,k.jsxs)("div",{style:{padding:"2rem 16px",textAlign:"center"},children:[(0,k.jsx)("p",{style:{fontSize:"3rem",marginBottom:"0.75rem"},children:"\u2705"}),(0,k.jsxs)("p",{style:{fontSize:"14px",fontWeight:700,color:"#0f172a",marginBottom:"0.5rem"},children:[r.siteName," downloaded!"]}),(0,k.jsx)("p",{style:{fontSize:"11px",color:"#64748b",marginBottom:"1.5rem",lineHeight:1.6},children:"Your ZIP is downloading. Unzip it and run:"}),["npm install","npm run dev"].map(C=>(0,k.jsx)("div",{style:{background:"#0f172a",borderRadius:"8px",padding:"8px 12px",marginBottom:"6px",textAlign:"left"},children:(0,k.jsxs)("code",{style:{fontSize:"12px",color:"#a7f3d0",fontFamily:"monospace"},children:["$ ",C]})},C)),(0,k.jsx)("p",{style:{fontSize:"11px",color:"#10b981",margin:"1rem 0",fontWeight:600},children:"Then open http://localhost:3000 \u{1F680}"}),(0,k.jsxs)("div",{style:{display:"flex",gap:"8px"},children:[(0,k.jsx)("button",{onClick:F,style:{flex:1,padding:"9px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",color:"#64748b",fontSize:"12px",fontWeight:600,cursor:"pointer"},children:"New Project"}),(0,k.jsx)("button",{onClick:D,style:{flex:1,padding:"9px",borderRadius:"8px",border:"none",background:"#f59e0b",color:"#fff",fontSize:"12px",fontWeight:700,cursor:"pointer"},children:"\u2B07\uFE0F Download Again"})]})]})]})}var P=require("react/jsx-runtime");async function xi(){try{if(typeof window>"u")return!1;let e=window;if(e.LanguageModel)try{if(typeof e.LanguageModel.availability=="function"){let n=await e.LanguageModel.availability();if(n==="readily"||n==="available"||n==="downloadable")return!0}else return!0}catch{}if(e.Summarizer)try{let n=await e.Summarizer.availability?.();if(!n||n==="readily"||n==="available")return!0}catch{}if(e.Rewriter)try{let n=await e.Rewriter.availability?.();if(!n||n==="readily"||n==="available")return!0}catch{}if(e.Writer)try{let n=await e.Writer.availability?.();if(!n||n==="readily"||n==="available")return!0}catch{}let t=e.ai||globalThis.ai;if(t){if(t.languageModel?.availability)try{let n=await t.languageModel.availability();if(n==="readily"||n==="available")return!0}catch{}if(t.languageModel&&typeof t.languageModel.create=="function"||t.summarizer||t.rewriter||t.writer||t.languageModel)return!0}return!!(e.Translator||e.translation?.canTranslate)}catch{return!1}}function Ct({position:e="left",children:t,config:n={},showRag:o=!1,showAgent:i=!1}){let[a,r]=(0,W.useState)(!1),[s,l]=(0,W.useState)(Vt),[u,f]=(0,W.useState)(null),[h,N]=(0,W.useState)(!1),[D,F]=(0,W.useState)(!1),[I,C]=(0,W.useState)(!1),z=W.default.useRef(null),[b,R]=(0,W.useState)(!1),[M,y]=(0,W.useState)(""),[Z,A]=(0,W.useState)(""),[B,ee]=(0,W.useState)(!1),[G,re]=(0,W.useState)(null),[v,p]=(0,W.useState)("idle"),[U,J]=(0,W.useState)(!1),[H,$]=(0,W.useState)(""),[ue,x]=(0,W.useState)(""),[L,S]=(0,W.useState)(!1),[X,q]=(0,W.useState)([]),[V,se]=(0,W.useState)(null),Se=24,Te=84,Fe=o?144:84,Ae=204,[ze,Oe]=(0,W.useState)(!1);(0,W.useEffect)(()=>{if(typeof window>"u")return;let g=window;!!(g.LanguageModel||g.ai?.languageModel)&&D?(re("gemini"),se("gemini")):tt()&&(re("transformers"),se("transformers"))},[D]),(0,W.useEffect)(()=>{if(G!=="transformers")return;let g=setInterval(()=>p(nt()),500);return()=>clearInterval(g)},[G]);let ft=(0,W.useCallback)(async()=>{if(!(!M.trim()||B)){if(!G){A("\u26A0\uFE0F No AI engine available.");return}ee(!0),A("");try{let g;if(G==="gemini"){let{askPage:te}=await Promise.resolve().then(()=>(Bt(),eo));g=await te(M)}else{p("loading");let{askPageWithTransformers:te}=await Promise.resolve().then(()=>(ot(),Ut));g=await te(M),p("ready")}A(g.success&&g.answer?g.answer.replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/#+\s/g,"").trim():"\u26A0\uFE0F "+(g.error||"No answer found."))}catch{A("\u26A0\uFE0F Something went wrong.")}ee(!1)}},[M,B,G]),Re=(0,W.useCallback)(async()=>{if(!H.trim()||L)return;if(!V){x("\u26A0\uFE0F No AI engine available.");return}S(!0),q([]),x("");let{runAgent:g}=await Promise.resolve().then(()=>(Ho(),Wo));await g(H,V,te=>{q(ke=>[...ke,te.text])}),S(!1),x("done")},[H,L,V]);(0,W.useEffect)(()=>{if(typeof window>"u")return;let te=setTimeout(async()=>{let ke=window,Je=await xi();F(Je),C(!!(ke.SpeechRecognition||ke.webkitSpeechRecognition))},800);return()=>clearTimeout(te)},[]),(0,W.useEffect)(()=>{if(!(typeof window>"u"))try{let g=localStorage.getItem("yuktai-a11y-prefs");g&&l(te=>({...te,...JSON.parse(g)}))}catch{}},[]);let pe=(0,W.useCallback)(async g=>{let te={enabled:!0,highContrast:g.highContrast,darkMode:g.darkMode,reduceMotion:g.reduceMotion,largeTargets:g.largeTargets,speechEnabled:g.speechEnabled,autoFix:g.autoFix,dyslexiaFont:g.dyslexiaFont,localFont:g.localFont,fontSizeMultiplier:g.fontScale/100,colorBlindMode:g.colorBlindMode,showAuditBadge:g.showAuditBadge,showSkipLinks:!0,showPreferencePanel:!1,plainEnglish:g.plainEnglish,summarisePage:g.summarisePage,translateLanguage:g.translateLanguage,voiceControl:g.voiceControl,smartLabels:g.smartLabels,...n};await be.execute(te),f(be.applyFixes(te)),N(!0)},[n]),Ce=(0,W.useCallback)(async()=>{try{localStorage.setItem("yuktai-a11y-prefs",JSON.stringify(s))}catch{}await pe(s),r(!1)},[s,pe]),Qe=(0,W.useCallback)(()=>{l(Vt);try{localStorage.removeItem("yuktai-a11y-prefs")}catch{}let g=document.documentElement;["data-yuktai-high-contrast","data-yuktai-dark","data-yuktai-reduce-motion","data-yuktai-large-targets","data-yuktai-keyboard","data-yuktai-dyslexia"].forEach(te=>g.removeAttribute(te)),document.body.style.filter="",document.body.style.fontFamily="",document.documentElement.style.fontSize="",f(null),N(!1)},[]),gt=(0,W.useCallback)((g,te)=>{l(ke=>({...ke,[g]:te}))},[]);(0,W.useEffect)(()=>{let g=te=>{te.key==="Escape"&&(a&&r(!1),b&&R(!1),U&&J(!1),ze&&Oe(!1))};return window.addEventListener("keydown",g),()=>window.removeEventListener("keydown",g)},[a,b,U]),(0,W.useEffect)(()=>{a&&z.current&&be.trapFocus(z.current)},[a]);let We=(g,te,ke)=>({position:"fixed",bottom:`${g}px`,[e]:"24px",zIndex:9998,width:"52px",height:"52px",borderRadius:"50%",background:te,color:"#fff",border:"none",cursor:"pointer",fontSize:"22px",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,0,0,0.25)",transition:"transform 0.15s, background 0.2s"}),Le=g=>{g.currentTarget.style.transform="scale(1.08)"},Ie=g=>{g.currentTarget.style.transform="scale(1)"},Ze=G==="gemini"?"Gemini Nano \xB7 On device":G==="transformers"?"Transformers.js \xB7 All devices":"Detecting...",mt=G==="transformers"&&v==="loading"?"Loading model...":"...";return(0,P.jsxs)(P.Fragment,{children:[t,i&&(0,P.jsx)("button",{style:We(204,ze?"#d97706":"#f59e0b",ze),"aria-label":"Open Vibe Coder",title:"\u26A1 Vibe Coder \u2014 Generate Next.js project",onClick:()=>{Oe(g=>!g),J(!1),R(!1),r(!1)},onMouseEnter:Le,onMouseLeave:Ie,children:"\u26A1"}),i&&ze&&(0,P.jsx)(Kt,{position:e,onClose:()=>Oe(!1)}),i&&(0,P.jsx)("button",{style:We(Fe,U?"#059669":"#10b981",U),"aria-label":"Open AI agent","aria-haspopup":"dialog","aria-expanded":U,title:"\u{1F916} AI Agent \u2014 guide me through this page",onClick:()=>{J(g=>!g),R(!1),r(!1)},onMouseEnter:Le,onMouseLeave:Ie,children:"\u{1F916}"}),i&&U&&(0,P.jsxs)("div",{role:"dialog","aria-modal":"true","aria-label":"yuktai AI Agent","data-yuktai-panel":"true",style:{position:"fixed",bottom:`${Fe+64}px`,[e]:"24px",zIndex:9999,width:"300px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",fontFamily:"system-ui,-apple-system,sans-serif",padding:"14px",maxHeight:"70vh",overflowY:"auto"},children:[(0,P.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"},children:[(0,P.jsxs)("div",{children:[(0,P.jsx)("p",{style:{margin:"0 0 2px",fontSize:"13px",fontWeight:600,color:"#0f172a"},children:"\u{1F916} AI Agent"}),(0,P.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#10b981"},children:V==="gemini"?"Gemini Nano \xB7 On device":V==="transformers"?"Transformers.js \xB7 All devices":"Detecting..."})]}),(0,P.jsx)("button",{onClick:()=>J(!1),"aria-label":"Close agent panel",style:{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"18px",lineHeight:1,padding:"2px"},children:"\xD7"})]}),(0,P.jsx)("p",{style:{margin:"0 0 8px",fontSize:"11px",color:"#64748b"},children:"Tell me what you want to do on this page. I will guide you step by step."}),(0,P.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"4px",marginBottom:"8px"},children:["Fill this form","Find contact info","What is this page?","Guide me to apply"].map(g=>(0,P.jsx)("button",{onClick:()=>$(g),style:{padding:"3px 8px",borderRadius:"20px",fontSize:"10px",border:"1px solid #e2e8f0",background:"#f8fafc",color:"#64748b",cursor:"pointer"},children:g},g))}),(0,P.jsxs)("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[(0,P.jsx)("input",{type:"text",value:H,onChange:g=>$(g.target.value),onKeyDown:g=>{g.key==="Enter"&&Re()},placeholder:"e.g. Help me fill this form",disabled:L||!V,"aria-label":"Tell the agent what to do",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:V?"#fff":"#f8fafc",outline:"none",height:"36px"}}),(0,P.jsx)("button",{onClick:Re,disabled:L||!H.trim()||!V,"aria-label":"Run agent",style:{padding:"8px 12px",borderRadius:"8px",border:"none",background:V&&H.trim()&&!L?"#10b981":"#e2e8f0",color:V&&H.trim()&&!L?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:V&&H.trim()&&!L?"pointer":"not-allowed",height:"36px",minWidth:"52px",transition:"background 0.2s"},children:L?"...":"Go"})]}),X.length>0&&(0,P.jsxs)("div",{style:{padding:"10px 12px",background:"#f0fdf4",border:"1px solid #86efac",borderRadius:"8px",fontSize:"11px",color:"#166534",lineHeight:1.7},children:[X.map((g,te)=>(0,P.jsx)("p",{style:{margin:"0 0 2px"},children:g},te)),ue==="done"&&(0,P.jsx)("button",{onClick:()=>{q([]),$(""),x("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]}),!V&&(0,P.jsx)("p",{style:{margin:"4px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Enable Gemini Nano via chrome://flags for best results."})]}),o&&(0,P.jsx)("button",{style:We(Te,b?"#7c3aed":"#6d28d9",b),"aria-label":"Ask a question about this page","aria-haspopup":"dialog","aria-expanded":b,title:`\u{1F4AC} Ask this page \xB7 ${Ze}`,onClick:()=>{R(g=>!g),r(!1),J(!1)},onMouseEnter:Le,onMouseLeave:Ie,children:"\u{1F4AC}"}),o&&b&&(0,P.jsxs)("div",{role:"dialog","aria-modal":"true","aria-label":"Ask this page","data-yuktai-panel":"true",style:{position:"fixed",bottom:`${Te+64}px`,[e]:"24px",zIndex:9999,width:"300px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",fontFamily:"system-ui,-apple-system,sans-serif",padding:"14px"},children:[(0,P.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"},children:[(0,P.jsxs)("div",{children:[(0,P.jsx)("p",{style:{margin:"0 0 2px",fontSize:"13px",fontWeight:600,color:"#0f172a"},children:"\u{1F4AC} Ask this page"}),(0,P.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#7c3aed"},children:Ze}),G==="transformers"&&v==="loading"&&(0,P.jsx)("p",{style:{margin:"2px 0 0",fontSize:"9px",color:"#94a3b8"},children:"Downloading model \u2014 first time only"}),G==="transformers"&&v==="ready"&&(0,P.jsx)("p",{style:{margin:"2px 0 0",fontSize:"9px",color:"#10b981"},children:"Model ready \u2705 \u2014 works offline"})]}),(0,P.jsx)("button",{onClick:()=>R(!1),"aria-label":"Close ask panel",style:{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"18px",lineHeight:1,padding:"2px"},children:"\xD7"})]}),(0,P.jsxs)("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[(0,P.jsx)("input",{type:"text",value:M,onChange:g=>y(g.target.value),onKeyDown:g=>{g.key==="Enter"&&ft()},placeholder:"e.g. What does this page do?",disabled:B||!G,"aria-label":"Ask a question about this page",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:G?"#fff":"#f8fafc",outline:"none",height:"36px"}}),(0,P.jsx)("button",{onClick:ft,disabled:B||!M.trim()||!G,"aria-label":"Submit question",style:{padding:"8px 12px",borderRadius:"8px",border:"none",background:G&&M.trim()&&!B?"#7c3aed":"#e2e8f0",color:G&&M.trim()&&!B?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:G&&M.trim()&&!B?"pointer":"not-allowed",height:"36px",minWidth:"48px",transition:"background 0.2s"},children:B?mt:"Ask"})]}),Z&&(0,P.jsxs)("div",{style:{padding:"10px",background:"#f5f3ff",borderRadius:"8px",fontSize:"12px",color:"#4c1d95",lineHeight:1.6,maxHeight:"180px",overflowY:"auto"},children:[(0,P.jsx)("strong",{style:{display:"block",marginBottom:"4px",fontSize:"11px",color:"#7c3aed"},children:"\u{1F4AC} Answer"}),Z,(0,P.jsx)("button",{onClick:()=>{A(""),y("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]}),!G&&(0,P.jsx)("p",{style:{margin:"4px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Detecting AI engine..."})]}),(0,P.jsx)("button",{style:We(Se,h?"#0d9488":"#1a73e8",a),"aria-label":"Open accessibility preferences","aria-haspopup":"dialog","aria-expanded":a,"data-yuktai-pref-toggle":"true",title:"\u267F Accessibility settings",onClick:()=>{r(g=>!g),R(!1),J(!1)},onMouseEnter:Le,onMouseLeave:Ie,children:"\u267F"}),a&&(0,P.jsx)(Yt,{ref:z,position:e,settings:s,report:u,isActive:h,aiSupported:D,voiceSupported:I,set:gt,onApply:Ce,onReset:Qe,onClose:()=>r(!1)})]})}m();var it={name:"ai.text",async execute(e){return`\u{1F916} YuktAI says: ${e}`}};m();var at={name:"voice.text",async execute(e){return!e||e.trim()===""?"\u{1F3A4} No speech detected":`\u{1F3A4} You said: ${e}`}};m();var Me=class{plugins=new Map;register(t,n){if(!n||typeof n.execute!="function")throw new Error(`Invalid plugin: ${t}`);this.plugins.set(t,n)}use(t){return this.plugins.get(t)}async run(t,n){try{let o=this.use(t);if(!o)throw new Error(`Plugin not found: ${t}`);return await o.execute(n)}catch(o){throw console.error(`[YuktAI Runtime Error in ${t}]:`,o),o}}getPlugins(){return Array.from(this.plugins.keys())}};m();var oe=require("react");m();var ne=require("react"),T=require("react/jsx-runtime"),Do={"en-US":{title:"Grid AI Assistant",subtitle:"Ask about your data",ask:"Ask",placeholder:"Ask or type a command...",listening:"Listening...",send:"Send",close:"Close",open:"Open AI assistant",inputLanguage:"Input language",speakNow:"Speak your question",working:"Working on it\u2026",english:"English",telugu:"\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41",searchStarted:e=>`Searching for "${e}".`,sortedAscending:e=>`Sorted by ${e} in ascending order.`,sortedDescending:e=>`Sorted by ${e} in descending order.`,count:e=>`There are ${e} rows in the grid.`,highest:(e,t,n)=>`The highest ${e} is ${t}, held by ${n}.`,lowest:(e,t,n)=>`The lowest ${e} is ${t}, held by ${n}.`,average:(e,t)=>`The average ${e} is ${t}.`,total:(e,t)=>`The total ${e} is ${t}.`,noData:"There is no data to analyze.",noColumn:"I could not find a column to analyze.",noNumericData:e=>`There is no numeric data in ${e}.`,notFound:e=>`I could not find anything matching "${e}".`,needName:"Please provide a value to look up.",fallback:"I can search, sort, count, and analyze the grid data.",unsupportedVoice:"Voice input is not supported in this browser."},"te-IN":{title:"\u0C17\u0C4D\u0C30\u0C3F\u0C21\u0C4D AI \u0C38\u0C39\u0C3E\u0C2F\u0C15\u0C41\u0C21\u0C41",subtitle:"\u0C2E\u0C40 \u0C21\u0C47\u0C1F\u0C3E \u0C17\u0C41\u0C30\u0C3F\u0C02\u0C1A\u0C3F \u0C05\u0C21\u0C17\u0C02\u0C21\u0C3F",ask:"\u0C05\u0C21\u0C17\u0C02\u0C21\u0C3F",placeholder:"\u0C2A\u0C4D\u0C30\u0C36\u0C4D\u0C28 \u0C32\u0C47\u0C26\u0C3E \u0C06\u0C26\u0C47\u0C36\u0C02 \u0C1F\u0C48\u0C2A\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F...",listening:"\u0C35\u0C3F\u0C02\u0C1F\u0C41\u0C28\u0C4D\u0C28\u0C3E\u0C28\u0C41...",send:"\u0C2A\u0C02\u0C2A\u0C02\u0C21\u0C3F",close:"\u0C2E\u0C42\u0C38\u0C3F\u0C35\u0C47\u0C2F\u0C02\u0C21\u0C3F",open:"AI \u0C38\u0C39\u0C3E\u0C2F\u0C15\u0C41\u0C21\u0C3F\u0C28\u0C3F \u0C24\u0C46\u0C30\u0C35\u0C02\u0C21\u0C3F",inputLanguage:"\u0C07\u0C28\u0C4D\u200C\u0C2A\u0C41\u0C1F\u0C4D \u0C2D\u0C3E\u0C37",speakNow:"\u0C2E\u0C40 \u0C2A\u0C4D\u0C30\u0C36\u0C4D\u0C28 \u0C1A\u0C46\u0C2A\u0C4D\u0C2A\u0C02\u0C21\u0C3F",working:"\u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C41\u0C28\u0C4D\u0C28\u0C3E\u0C28\u0C41\u2026",english:"English",telugu:"\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41",searchStarted:e=>`\u201C${e}\u201D \u0C15\u0C4B\u0C38\u0C02 \u0C36\u0C4B\u0C27\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C28\u0C4D\u0C28\u0C3E\u0C28\u0C41.`,sortedAscending:e=>`${e}\u0C28\u0C41 \u0C06\u0C30\u0C4B\u0C39\u0C23 \u0C15\u0C4D\u0C30\u0C2E\u0C02\u0C32\u0C4B \u0C05\u0C2E\u0C30\u0C4D\u0C1A\u0C3E\u0C28\u0C41.`,sortedDescending:e=>`${e}\u0C28\u0C41 \u0C05\u0C35\u0C30\u0C4B\u0C39\u0C23 \u0C15\u0C4D\u0C30\u0C2E\u0C02\u0C32\u0C4B \u0C05\u0C2E\u0C30\u0C4D\u0C1A\u0C3E\u0C28\u0C41.`,count:e=>`\u0C17\u0C4D\u0C30\u0C3F\u0C21\u0C4D\u200C\u0C32\u0C4B \u0C2E\u0C4A\u0C24\u0C4D\u0C24\u0C02 ${e} \u0C35\u0C30\u0C41\u0C38\u0C32\u0C41 \u0C09\u0C28\u0C4D\u0C28\u0C3E\u0C2F\u0C3F.`,highest:(e,t,n)=>`\u0C05\u0C24\u0C4D\u0C2F\u0C27\u0C3F\u0C15 ${e} \u0C35\u0C3F\u0C32\u0C41\u0C35 ${t}. \u0C07\u0C26\u0C3F ${n}\u0C15\u0C41 \u0C38\u0C02\u0C2C\u0C02\u0C27\u0C3F\u0C02\u0C1A\u0C3F\u0C28\u0C26\u0C3F.`,lowest:(e,t,n)=>`\u0C05\u0C24\u0C4D\u0C2F\u0C32\u0C4D\u0C2A ${e} \u0C35\u0C3F\u0C32\u0C41\u0C35 ${t}. \u0C07\u0C26\u0C3F ${n}\u0C15\u0C41 \u0C38\u0C02\u0C2C\u0C02\u0C27\u0C3F\u0C02\u0C1A\u0C3F\u0C28\u0C26\u0C3F.`,average:(e,t)=>`${e} \u0C38\u0C17\u0C1F\u0C41 \u0C35\u0C3F\u0C32\u0C41\u0C35 ${t}.`,total:(e,t)=>`${e} \u0C2E\u0C4A\u0C24\u0C4D\u0C24\u0C02 \u0C35\u0C3F\u0C32\u0C41\u0C35 ${t}.`,noData:"\u0C35\u0C3F\u0C36\u0C4D\u0C32\u0C47\u0C37\u0C3F\u0C02\u0C1A\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C21\u0C47\u0C1F\u0C3E \u0C32\u0C47\u0C26\u0C41.",noColumn:"\u0C35\u0C3F\u0C36\u0C4D\u0C32\u0C47\u0C37\u0C3F\u0C02\u0C1A\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C24\u0C17\u0C3F\u0C28 \u0C15\u0C3E\u0C32\u0C2E\u0C4D \u0C15\u0C28\u0C2C\u0C21\u0C32\u0C47\u0C26\u0C41.",noNumericData:e=>`${e}\u0C32\u0C4B \u0C38\u0C02\u0C16\u0C4D\u0C2F\u0C3E \u0C38\u0C2E\u0C3E\u0C1A\u0C3E\u0C30\u0C02 \u0C32\u0C47\u0C26\u0C41.`,notFound:e=>`\u201C${e}\u201D\u0C15\u0C41 \u0C38\u0C30\u0C3F\u0C2A\u0C4B\u0C32\u0C47 \u0C38\u0C2E\u0C3E\u0C1A\u0C3E\u0C30\u0C02 \u0C15\u0C28\u0C2C\u0C21\u0C32\u0C47\u0C26\u0C41.`,needName:"\u0C36\u0C4B\u0C27\u0C3F\u0C02\u0C1A\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C12\u0C15 \u0C35\u0C3F\u0C32\u0C41\u0C35 \u0C07\u0C35\u0C4D\u0C35\u0C02\u0C21\u0C3F.",fallback:"\u0C17\u0C4D\u0C30\u0C3F\u0C21\u0C4D\u200C\u0C32\u0C4B \u0C36\u0C4B\u0C27\u0C28, \u0C15\u0C4D\u0C30\u0C2E\u0C2C\u0C26\u0C4D\u0C27\u0C40\u0C15\u0C30\u0C23, \u0C32\u0C46\u0C15\u0C4D\u0C15\u0C3F\u0C02\u0C2A\u0C41 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C21\u0C47\u0C1F\u0C3E \u0C35\u0C3F\u0C36\u0C4D\u0C32\u0C47\u0C37\u0C23 \u0C1A\u0C47\u0C2F\u0C17\u0C32\u0C28\u0C41.",unsupportedVoice:"\u0C08 \u0C2C\u0C4D\u0C30\u0C4C\u0C1C\u0C30\u0C4D\u200C\u0C32\u0C4B \u0C35\u0C3E\u0C2F\u0C3F\u0C38\u0C4D \u0C07\u0C28\u0C4D\u200C\u0C2A\u0C41\u0C1F\u0C4D\u200C\u0C15\u0C41 \u0C2E\u0C26\u0C4D\u0C26\u0C24\u0C41 \u0C32\u0C47\u0C26\u0C41."}};function ve(e){return e.toLowerCase().trim().replace(/\s+/g," ")}function vi(e,t){let n=ve(e);if(t==="te-IN")return/^(శోధించు|శోధించండి|వెతుకు|వెతకండి|చూపించు|చూపించండి|ఫిల్టర్)/.test(n)?{type:"search",payload:n.replace(/^(శోధించు|శోధించండి|వెతుకు|వెతకండి|చూపించు|చూపించండి|ఫిల్టర్)\s*/u,"").trim()||e}:/క్రమబద్ధీకర|అమర్చ|సార్ట్/.test(n)?{type:"sort",payload:{key:void 0,dir:/అవరోహణ|పెద్ద|అధిక|చివర/.test(n)?"desc":"asc"}}:/ఎన్ని|ఎంతమంది|లెక్క|మొత్తం వరుస|వరుసలు/.test(n)?{type:"question",payload:e}:/అత్యధిక|గరిష్ఠ|పెద్ద|ఎక్కువ/.test(n)?{type:"question",payload:e}:/అత్యల్ప|కనిష్ఠ|చిన్న|తక్కువ/.test(n)?{type:"question",payload:e}:/సగటు|సగటు విలువ/.test(n)?{type:"question",payload:e}:/మొత్తం|కలిపి/.test(n)?{type:"question",payload:e}:{type:"search",payload:e};if(/^(search|find|show|filter)/.test(n))return{type:"search",payload:n.replace(/^(search|find|show|filter)\s+(for\s+|by\s+)?/,"").trim()||e};if(/sort/.test(n)){let o=/desc|descending|high|higher|large|largest|top/.test(n);return{type:"sort",payload:{key:n.match(/(?:by|on)\s+([a-z0-9_-]+)/)?.[1],dir:o?"desc":"asc"}}}return/how many|count|highest|maximum|max|top|largest|lowest|minimum|min|smallest|bottom|average|avg|mean|sum|total|who|which|where|whose/.test(n)?{type:"question",payload:e}:{type:"search",payload:e}}function _o(e,t){let n=ve(e);return t.find(o=>{let i=ve(o.key),a=ve(o.label);return n.includes(i)||n.includes(a)})}function Et(e,t){return e.toLocaleString(t==="te-IN"?"te-IN":"en-IN")}function wi(e,t,n,o){let i=Do[o];if(t.length===0)return i.noData;let a=ve(e),r=n.filter(b=>b.type==="number"),s=_o(e,n),l=s?.type==="number"?s:r[0],u=/how many|count|rows|ఎన్ని|ఎంతమంది|లెక్క|వరుసలు/.test(a);if(u)return i.count(t.length);if(/highest|maximum|max|top|largest|అత్యధిక|గరిష్ఠ|పెద్ద|ఎక్కువ/.test(a)){let b=s??l;if(!b)return i.noColumn;let R=t.map(A=>({row:A,value:Number(A[b.key])})).filter(A=>!Number.isNaN(A.value)).sort((A,B)=>B.value-A.value);if(R.length===0)return i.noNumericData(b.label);let M=R[0],y=n.find(A=>A.key==="name"||ve(A.label)==="name"),Z=y?String(M.row[y.key]??""):o==="te-IN"?"\u0C08 \u0C35\u0C30\u0C41\u0C38":"this row";return i.highest(b.label,Et(M.value,o),Z)}if(/lowest|minimum|min|smallest|bottom|అత్యల్ప|కనిష్ఠ|చిన్న|తక్కువ/.test(a)){let b=s??l;if(!b)return i.noColumn;let R=t.map(A=>({row:A,value:Number(A[b.key])})).filter(A=>!Number.isNaN(A.value)).sort((A,B)=>A.value-B.value);if(R.length===0)return i.noNumericData(b.label);let M=R[0],y=n.find(A=>A.key==="name"||ve(A.label)==="name"),Z=y?String(M.row[y.key]??""):o==="te-IN"?"\u0C08 \u0C35\u0C30\u0C41\u0C38":"this row";return i.lowest(b.label,Et(M.value,o),Z)}if(/average|avg|mean|సగటు/.test(a)){let b=s??l;if(!b)return i.noColumn;let R=t.map(y=>Number(y[b.key])).filter(y=>!Number.isNaN(y));if(R.length===0)return i.noNumericData(b.label);let M=R.reduce((y,Z)=>y+Z,0)/R.length;return i.average(b.label,Et(Math.round(M*100)/100,o))}if(/sum|total|మొత్తం|కలిపి/.test(a)&&!u){let b=s??l;if(!b)return i.noColumn;let R=t.map(y=>Number(y[b.key])).filter(y=>!Number.isNaN(y));if(R.length===0)return i.noNumericData(b.label);let M=R.reduce((y,Z)=>y+Z,0);return i.total(b.label,Et(M,o))}let F=a.match(/[\p{L}\p{N}_-]+/gu)??[],I=new Set(["who","what","which","where","whose","is","the","has","have","show","find","search","for","by","about"]),z=F.filter(b=>!I.has(b)).join(" ").trim();if(z){let b=t.find(R=>Object.values(R).some(M=>String(M??"").toLowerCase().includes(z.toLowerCase())));return b?n.map(R=>`${R.label}: ${String(b[R.key]??"")}`).join(o==="te-IN"?" \xB7 ":", "):i.notFound(z)}return i.fallback}function ki(e,t){if(typeof window>"u"||!window.speechSynthesis)return;window.speechSynthesis.cancel();let n=new SpeechSynthesisUtterance(e);n.lang=t,n.rate=1,n.pitch=1,window.speechSynthesis.speak(n)}function Si(e){let[t,n]=(0,ne.useState)(!1),[o,i]=(0,ne.useState)(""),[a,r]=(0,ne.useState)(!0),s=(0,ne.useRef)(null);(0,ne.useEffect)(()=>{if(typeof window>"u")return;let f=window.SpeechRecognition||window.webkitSpeechRecognition;if(!f){r(!1),s.current=null;return}let h=new f;return h.continuous=!1,h.interimResults=!1,h.lang=e,h.onresult=N=>{let D=N?.results?.[0]?.[0]?.transcript??"";i(D),n(!1)},h.onerror=()=>{n(!1)},h.onend=()=>{n(!1)},s.current=h,()=>{try{h.stop()}catch{}s.current=null}},[e]);let l=(0,ne.useCallback)(()=>{if(s.current){i(""),n(!0);try{s.current.start()}catch{n(!1)}}},[]),u=(0,ne.useCallback)(()=>{try{s.current?.stop()}catch{}n(!1)},[]);return{listening:t,transcript:o,supported:a,start:l,stop:u}}function Ti(){return(0,T.jsxs)("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,T.jsx)("circle",{cx:"11",cy:"11",r:"6.5"}),(0,T.jsx)("path",{d:"m16 16 5 5"})]})}function Ai(){return(0,T.jsxs)("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,T.jsx)("rect",{x:"8",y:"3",width:"8",height:"12",rx:"4"}),(0,T.jsx)("path",{d:"M5 11a7 7 0 0 0 14 0"}),(0,T.jsx)("path",{d:"M12 18v3"}),(0,T.jsx)("path",{d:"M8 21h8"})]})}function Ci(){return(0,T.jsxs)("svg",{width:"17",height:"17",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,T.jsx)("path",{d:"m4 4 16 8-16 8 4-8-4-8Z"}),(0,T.jsx)("path",{d:"M8 12h12"})]})}function Ei(){return(0,T.jsxs)("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,T.jsx)("path",{d:"m6 6 12 12"}),(0,T.jsx)("path",{d:"m18 6-12 12"})]})}function Ri({data:e,columns:t,onSearch:n,onSort:o,theme:i="light",language:a="en-US",inputLanguage:r="en-US",embedded:s=!1,agent:l,onInputLanguageChange:u}){let f=Do[a],[h,N]=(0,ne.useState)(r);(0,ne.useEffect)(()=>{N(r)},[r]);let[D,F]=(0,ne.useState)(!1),I=i==="dark",[C,z]=(0,ne.useState)(s),[b,R]=(0,ne.useState)(""),[M,y]=(0,ne.useState)([]),Z=(0,ne.useRef)(null),{listening:A,transcript:B,supported:ee,start:G,stop:re}=Si(h),v=(0,ne.useMemo)(()=>({bg:I?"#0F172A":"#FFFFFF",surface:I?"#1E293B":"#F8FAFC",border:I?"#334155":"#E2E8F0",text:I?"#F1F5F9":"#0F172A",muted:I?"#94A3B8":"#64748B",accent:"#10B981",userMsg:I?"#334155":"#DBEAFE",aiMsg:I?"#1E293B":"#F0FDF4"}),[I]),p=(0,ne.useMemo)(()=>({role:"ai",text:a==="te-IN"?"\u0C2E\u0C40 \u0C17\u0C4D\u0C30\u0C3F\u0C21\u0C4D \u0C21\u0C47\u0C1F\u0C3E \u0C17\u0C41\u0C30\u0C3F\u0C02\u0C1A\u0C3F \u0C2A\u0C4D\u0C30\u0C36\u0C4D\u0C28 \u0C05\u0C21\u0C17\u0C02\u0C21\u0C3F.":"Ask me about your grid data.",time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}),[a]);(0,ne.useEffect)(()=>{y(x=>x.length>0?x:[p])},[p]),(0,ne.useEffect)(()=>{Z.current?.scrollIntoView({behavior:"smooth"})},[M]);let U=()=>new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),J=(0,ne.useCallback)(async x=>{let L=x.trim();if(!L)return;y(q=>[...q,{role:"user",text:L,time:U()}]),R("");let S=vi(L,a),X="";if(S.type==="question")X=wi(S.payload??L,e,t,a);else if(l){F(!0);try{X=(await l.ask(L)).message}catch{X=f.fallback}finally{F(!1)}}else if(S.type==="search"){let q=String(S.payload??L);n?.(q),X=f.searchStarted(q)}else if(S.type==="sort"){let q=S.payload?.key,V=q?t.find(se=>ve(se.key)===ve(q)||ve(se.label)===ve(q)):void 0;if(V||(V=_o(L,t)),V&&o){let se=S.payload?.dir==="desc"?"desc":"asc";o(String(V.key),se),X=se==="asc"?f.sortedAscending(V.label):f.sortedDescending(V.label)}else X=f.noColumn}X||(X=f.fallback),y(q=>[...q,{role:"ai",text:X,time:U()}]),ki(X,a)},[l,t,e,a,n,o,f]);(0,ne.useEffect)(()=>{B&&J(B)},[B,J]);let H=()=>{J(b)},$=a==="te-IN"?["\u0C05\u0C24\u0C4D\u0C2F\u0C27\u0C3F\u0C15 \u0C35\u0C3F\u0C32\u0C41\u0C35","\u0C0E\u0C28\u0C4D\u0C28\u0C3F \u0C35\u0C30\u0C41\u0C38\u0C32\u0C41","\u0C38\u0C17\u0C1F\u0C41 \u0C35\u0C3F\u0C32\u0C41\u0C35","\u0C36\u0C4B\u0C27\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F"]:["highest value","how many rows","average value","search"],ue=(0,T.jsxs)("div",{style:{width:s?"100%":360,maxWidth:s?"100%":"calc(100vw - 48px)",height:s?390:480,maxHeight:"70vh",background:v.bg,border:`1px solid ${v.border}`,borderRadius:s?12:16,boxShadow:s?"none":"0 20px 40px rgba(0,0,0,0.15)",display:"flex",flexDirection:"column",overflow:"hidden"},children:[(0,T.jsxs)("div",{style:{padding:"12px 14px",background:v.accent,color:"#FFFFFF",display:"flex",alignItems:"center",gap:10},children:[(0,T.jsx)("div",{style:{width:34,height:34,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.18)",fontSize:17},children:"AI"}),(0,T.jsxs)("div",{style:{flex:1,minWidth:0},children:[(0,T.jsx)("div",{style:{fontWeight:700,fontSize:14},children:f.title}),(0,T.jsx)("div",{style:{fontSize:11,opacity:.9},children:f.subtitle})]}),!s&&(0,T.jsx)("button",{type:"button",onClick:()=>z(!1),"aria-label":f.close,title:f.close,style:{width:32,height:32,border:"none",borderRadius:8,background:"rgba(255,255,255,0.12)",color:"#FFFFFF",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"},children:(0,T.jsx)(Ei,{})})]}),(0,T.jsxs)("div",{style:{padding:"8px 10px",borderBottom:`1px solid ${v.border}`,display:"flex",alignItems:"center",gap:8,background:v.surface},children:[(0,T.jsx)("span",{style:{fontSize:11,color:v.muted},children:f.inputLanguage}),(0,T.jsxs)("select",{value:h,onChange:x=>{let L=x.target.value;N(L),u?.(L)},disabled:A,"aria-label":f.inputLanguage,style:{padding:"5px 8px",borderRadius:7,border:`1px solid ${v.border}`,background:v.bg,color:v.text,fontSize:11},children:[(0,T.jsx)("option",{value:"en-US",children:f.english}),(0,T.jsx)("option",{value:"te-IN",children:f.telugu})]})]}),(0,T.jsxs)("div",{style:{flex:1,overflowY:"auto",padding:10,display:"flex",flexDirection:"column",gap:8},children:[M.map((x,L)=>(0,T.jsxs)("div",{style:{alignSelf:x.role==="user"?"flex-end":"flex-start",maxWidth:"88%",padding:"8px 11px",borderRadius:11,background:x.role==="user"?v.userMsg:v.aiMsg,color:v.text,fontSize:13,lineHeight:1.5},children:[(0,T.jsx)("div",{children:x.text}),(0,T.jsx)("div",{style:{marginTop:3,fontSize:10,opacity:.55,textAlign:"right"},children:x.time})]},`${x.time}-${L}`)),A&&(0,T.jsx)("div",{style:{alignSelf:"flex-end",padding:"8px 11px",borderRadius:11,background:I?"#3F1D2E":"#FEE2E2",color:I?"#FCA5A5":"#991B1B",fontSize:13},children:f.listening}),(D||l?.loading)&&(0,T.jsx)("div",{role:"status","aria-live":"polite",style:{alignSelf:"flex-start",padding:"8px 11px",borderRadius:11,background:v.aiMsg,color:v.muted,fontSize:13},children:f.working}),(0,T.jsx)("div",{ref:Z})]}),(0,T.jsx)("div",{style:{padding:"7px 10px",borderTop:`1px solid ${v.border}`,display:"flex",gap:6,overflowX:"auto",flexShrink:0},children:$.map(x=>(0,T.jsx)("button",{type:"button",onClick:()=>J(x),style:{padding:"5px 9px",borderRadius:12,border:`1px solid ${v.border}`,background:v.surface,color:v.text,fontSize:10.5,cursor:"pointer",whiteSpace:"nowrap"},children:x},x))}),(0,T.jsxs)("div",{style:{padding:9,display:"flex",gap:6,borderTop:`1px solid ${v.border}`,background:v.surface},children:[(0,T.jsxs)("div",{style:{position:"relative",flex:1},children:[(0,T.jsx)(Ti,{}),(0,T.jsx)("input",{type:"text",value:b,onChange:x=>R(x.target.value),onKeyDown:x=>{x.key==="Enter"&&H()},placeholder:f.placeholder,"aria-label":f.ask,style:{width:"100%",boxSizing:"border-box",padding:"9px 10px 9px 34px",borderRadius:8,border:`1px solid ${v.border}`,background:v.bg,color:v.text,fontSize:12,outline:"none"}})]}),ee?(0,T.jsx)("button",{type:"button",onClick:A?re:G,"aria-label":A?f.listening:f.speakNow,title:A?f.listening:f.speakNow,style:{width:38,height:38,border:"none",borderRadius:8,background:A?"#EF4444":v.accent,color:"#FFFFFF",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0},children:(0,T.jsx)(Ai,{})}):null,(0,T.jsx)("button",{type:"button",onClick:H,disabled:!b.trim(),"aria-label":f.send,title:f.send,style:{width:38,height:38,border:"none",borderRadius:8,background:b.trim()?v.accent:v.muted,color:"#FFFFFF",display:"flex",alignItems:"center",justifyContent:"center",cursor:b.trim()?"pointer":"not-allowed",opacity:b.trim()?1:.6,flexShrink:0},children:(0,T.jsx)(Ci,{})})]})]});return s?(0,T.jsx)("div",{style:{width:"100%",minWidth:0},children:C?ue:(0,T.jsxs)("button",{type:"button",onClick:()=>z(!0),"aria-label":f.open,style:{minHeight:40,padding:"8px 13px",borderRadius:9,border:"1px solid #10B981",background:I?"#064E3B":"#ECFDF5",color:I?"#A7F3D0":"#047857",display:"inline-flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:12,fontWeight:600},children:[(0,T.jsx)("span",{"aria-hidden":"true",children:"AI"}),f.ask]})}):(0,T.jsxs)(T.Fragment,{children:[!C&&(0,T.jsx)("button",{type:"button",onClick:()=>z(!0),"aria-label":f.open,title:f.title,style:{position:"fixed",bottom:24,right:24,zIndex:9998,width:56,height:56,borderRadius:28,background:v.accent,color:"#FFFFFF",border:"none",cursor:"pointer",boxShadow:"0 8px 20px rgba(16,185,129,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14},children:"AI"}),C&&(0,T.jsx)("div",{style:{position:"fixed",bottom:90,right:24,zIndex:9997},children:ue}),(0,T.jsx)("style",{children:`
        @keyframes yuktai-ai-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `})]})}var Rt=Ri;m();var le=require("react");m();var Li={en:{found:e=>`${e} row(s) found.`,count:e=>`${e} row(s).`,columns:"Grid columns retrieved.",rowFound:"Row found.",notFound:e=>`Row "${e}" not found.`,noneFound:"None of the given rows were found.",highlighted:e=>`${e} row(s) highlighted.`,selected:e=>`Row "${e}" selected.`,opened:e=>`Row "${e}" opened.`,notSupported:e=>`This grid does not support "${e}".`,emptyQuery:"Please enter something to search.",noIds:"No row IDs were given.",unknownColumn:e=>`Unknown column "${e}".`,badOperator:e=>`Unknown filter operator "${e}".`,badValue:"The filter value is not valid for this column.",filtered:e=>`Filter applied: ${e} row(s) match.`,filtersCleared:"All filters cleared.",sorted:(e,t)=>`Sorted by ${e} (${t==="asc"?"ascending":"descending"}).`,sortCleared:"Sorting cleared.",internal:"Something went wrong while running this action."},te:{found:e=>`${e} \u0C35\u0C30\u0C41\u0C38(\u0C32\u0C41) \u0C26\u0C4A\u0C30\u0C3F\u0C15\u0C3E\u0C2F\u0C3F.`,count:e=>`\u0C2E\u0C4A\u0C24\u0C4D\u0C24\u0C02 ${e} \u0C35\u0C30\u0C41\u0C38\u0C32\u0C41.`,columns:"\u0C15\u0C3E\u0C32\u0C2E\u0C4D\u200C\u0C32 \u0C35\u0C3F\u0C35\u0C30\u0C3E\u0C32\u0C41.",rowFound:"\u0C35\u0C30\u0C41\u0C38 \u0C26\u0C4A\u0C30\u0C3F\u0C15\u0C3F\u0C02\u0C26\u0C3F.",notFound:e=>`"${e}" \u0C35\u0C30\u0C41\u0C38 \u0C26\u0C4A\u0C30\u0C15\u0C32\u0C47\u0C26\u0C41.`,noneFound:"\u0C07\u0C1A\u0C4D\u0C1A\u0C3F\u0C28 \u0C35\u0C30\u0C41\u0C38\u0C32\u0C47\u0C35\u0C40 \u0C26\u0C4A\u0C30\u0C15\u0C32\u0C47\u0C26\u0C41.",highlighted:e=>`${e} \u0C35\u0C30\u0C41\u0C38(\u0C32\u0C41) \u0C39\u0C48\u0C32\u0C48\u0C1F\u0C4D \u0C1A\u0C47\u0C36\u0C3E\u0C28\u0C41.`,selected:e=>`"${e}" \u0C0E\u0C02\u0C1A\u0C41\u0C15\u0C41\u0C28\u0C4D\u0C28\u0C3E\u0C28\u0C41.`,opened:e=>`"${e}" \u0C24\u0C46\u0C30\u0C3F\u0C1A\u0C3E\u0C28\u0C41.`,notSupported:e=>`\u0C08 \u0C2A\u0C1F\u0C4D\u0C1F\u0C3F\u0C15\u0C32\u0C4B "${e}" \u0C38\u0C4C\u0C15\u0C30\u0C4D\u0C2F\u0C02 \u0C32\u0C47\u0C26\u0C41.`,emptyQuery:"\u0C35\u0C46\u0C24\u0C15\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C0F\u0C26\u0C48\u0C28\u0C3E \u0C30\u0C3E\u0C2F\u0C02\u0C21\u0C3F.",noIds:"\u0C35\u0C30\u0C41\u0C38 ID\u0C32\u0C41 \u0C07\u0C35\u0C4D\u0C35\u0C32\u0C47\u0C26\u0C41.",unknownColumn:e=>`"${e}" \u0C05\u0C28\u0C47 \u0C15\u0C3E\u0C32\u0C2E\u0C4D \u0C32\u0C47\u0C26\u0C41.`,badOperator:e=>`"${e}" \u0C05\u0C28\u0C47 \u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D \u0C35\u0C3F\u0C27\u0C3E\u0C28\u0C02 \u0C32\u0C47\u0C26\u0C41.`,badValue:"\u0C08 \u0C15\u0C3E\u0C32\u0C2E\u0C4D\u200C\u0C15\u0C3F \u0C08 \u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D \u0C35\u0C3F\u0C32\u0C41\u0C35 \u0C38\u0C30\u0C3F\u0C2A\u0C4B\u0C26\u0C41.",filtered:e=>`\u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D \u0C35\u0C47\u0C36\u0C3E\u0C28\u0C41: ${e} \u0C35\u0C30\u0C41\u0C38\u0C32\u0C41 \u0C38\u0C30\u0C3F\u0C2A\u0C4B\u0C2F\u0C3E\u0C2F\u0C3F.`,filtersCleared:"\u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D\u0C32\u0C28\u0C4D\u0C28\u0C40 \u0C24\u0C40\u0C38\u0C47\u0C36\u0C3E\u0C28\u0C41.",sorted:(e,t)=>`${e} \u0C2A\u0C4D\u0C30\u0C15\u0C3E\u0C30\u0C02 \u0C15\u0C4D\u0C30\u0C2E\u0C02 (${t==="asc"?"\u0C06\u0C30\u0C4B\u0C39\u0C23":"\u0C05\u0C35\u0C30\u0C4B\u0C39\u0C23"}).`,sortCleared:"\u0C15\u0C4D\u0C30\u0C2E\u0C02 \u0C24\u0C40\u0C38\u0C47\u0C36\u0C3E\u0C28\u0C41.",internal:"\u0C08 \u0C2A\u0C28\u0C3F \u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C21\u0C17\u0C3E \u0C38\u0C2E\u0C38\u0C4D\u0C2F \u0C35\u0C1A\u0C4D\u0C1A\u0C3F\u0C02\u0C26\u0C3F."}};function ye(e){return Li[e.locale??"en"]}function we(e,t){return{success:!0,message:e,data:t}}function ie(e,t){return{success:!1,message:t,error:{code:e}}}var qo=["contains","equals","startsWith","endsWith","greaterThan","lessThan","between"];function Ve(e,t="id"){let n=e?.[t];return n==null?"":String(n)}function $e(e){return String(e??"").normalize("NFC").toLowerCase().trim()}function jo(e){if(typeof e=="number")return Number.isFinite(e)?e:null;let t=String(e??"").trim();if(t==="")return null;let n=Number(t);return Number.isFinite(n)?n:null}function Uo(e){if(e instanceof Date)return e.getTime();let t=new Date(String(e??"")).getTime();return Number.isFinite(t)?t:null}function Vo(e){return(Array.isArray(e)?e:typeof e=="string"?e.split(","):[]).map(n=>String(n).trim()).filter(Boolean)}function Qt(e,t){let n=$e(t);return e.columns.find(o=>$e(o.key)===n||$e(o.label)===n)}function Lt(e,t){return e.data.find(n=>Ve(n,e.rowKey)===t)}function Ii(e,t){return e[t]}function Ni(e,t,n){let o=Ii(e,n.key),i=n.type??"text";if(i==="number"||i==="date"){let s=i==="number"?jo:Uo,l=s(o);if(l===null)return!1;if(t.operator==="between"){let[f,h]=t.value,N=s(f),D=s(h);return N!==null&&D!==null&&l>=Math.min(N,D)&&l<=Math.max(N,D)}let u=s(t.value);if(u===null)return!1;switch(t.operator){case"equals":return l===u;case"greaterThan":return l>u;case"lessThan":return l<u;default:break}}let a=$e(o),r=$e(t.value);switch(t.operator){case"equals":return a===r;case"startsWith":return a.startsWith(r);case"endsWith":return a.endsWith(r);case"contains":return a.includes(r);default:return!1}}function Mi(e,t){let n=t.type??"text",o=n==="date"?Uo:jo;return e.operator==="between"?n==="text"||!Array.isArray(e.value)||e.value.length!==2?!1:o(e.value[0])!==null&&o(e.value[1])!==null:e.operator==="greaterThan"||e.operator==="lessThan"?n!=="text"&&o(e.value)!==null:!Array.isArray(e.value)&&String(e.value).trim()!==""}function Ye(e,t,n){return n.length?Yo({data:e,columns:t},n):e}function Xe(e){return e.map(t=>({key:String(t.key),label:t.label,type:t.type==="number"?"number":t.type==="date"?"date":"text"}))}function Yo(e,t){return e.data.filter(n=>t.every(o=>{let i=Qt(e,o.key);return i?Ni(n,o,i):!0}))}function Zt(e,t){let n=ye(e),o=$e(t);if(!o)return ie("INVALID_INPUT",n.emptyQuery);let i=e.data.filter(r=>e.columns.some(s=>$e(r[s.key]).includes(o))),a=i.map(r=>Ve(r,e.rowKey)).filter(Boolean);return e.onHighlightRows?.(a),we(n.found(i.length),i)}function Jt(e){return we(ye(e).count(e.data.length),e.data.length)}function en(e){return we(ye(e).columns,e.columns)}function tn(e,t){let n=ye(e),o=String(t??"").trim();if(!o)return ie("INVALID_INPUT",n.noIds);let i=Lt(e,o);return i?we(n.rowFound,i):ie("NOT_FOUND",n.notFound(o))}function nn(e,t){let n=ye(e),o=Vo(t);if(o.length===0)return ie("INVALID_INPUT",n.noIds);if(!e.onHighlightRows)return ie("NOT_SUPPORTED",n.notSupported("highlight"));let i=o.filter(a=>Lt(e,a)!==void 0);return i.length===0?ie("NOT_FOUND",n.noneFound):(e.onHighlightRows(i),we(n.highlighted(i.length),i))}function on(e,t){let n=ye(e),o=String(t??"").trim();return o?e.onSelectRow?Lt(e,o)?(e.onSelectRow(o),we(n.selected(o),o)):ie("NOT_FOUND",n.notFound(o)):ie("NOT_SUPPORTED",n.notSupported("select")):ie("INVALID_INPUT",n.noIds)}function rn(e,t){let n=ye(e),o=String(t??"").trim();return o?e.onOpenRow?Lt(e,o)?(e.onOpenRow(o),we(n.opened(o),o)):ie("NOT_FOUND",n.notFound(o)):ie("NOT_SUPPORTED",n.notSupported("open")):ie("INVALID_INPUT",n.noIds)}function an(e,t){let n=ye(e),o=Qt(e,t?.key??"");if(!o)return ie("INVALID_INPUT",n.unknownColumn(String(t?.key??"")));if(!qo.includes(t.operator))return ie("INVALID_INPUT",n.badOperator(String(t.operator)));let i={...t,key:o.key};if(!Mi(i,o))return ie("INVALID_INPUT",n.badValue);if(!e.onFiltersChange)return ie("NOT_SUPPORTED",n.notSupported("filter"));let a=[...(e.filters??[]).filter(s=>s.key!==o.key),i],r=Yo(e,a).length;return e.onFiltersChange(a),we(n.filtered(r),{filters:a,count:r})}function sn(e){let t=ye(e);return e.onFiltersChange?(e.onFiltersChange([]),we(t.filtersCleared,[])):ie("NOT_SUPPORTED",t.notSupported("clear filters"))}function ln(e,t,n="asc"){let o=ye(e),i=Qt(e,t);if(!i)return ie("INVALID_INPUT",o.unknownColumn(String(t)));if(n!=="asc"&&n!=="desc")return ie("INVALID_INPUT",o.badValue);if(!e.onSortChange)return ie("NOT_SUPPORTED",o.notSupported("sort"));let a={key:i.key,direction:n};return e.onSortChange(a),we(o.sorted(i.label,n),a)}function cn(e){let t=ye(e);return e.onSortChange?(e.onSortChange(null),we(t.sortCleared,null)):ie("NOT_SUPPORTED",t.notSupported("clear sort"))}var Pi={search:"Search all columns for text. Matching rows are highlighted.",count:"Count the rows currently in the grid.",columns:"List the grid's columns with their keys, labels and types.",get_row:"Get one row by its ID.",highlight:"Highlight one or more rows by ID without filtering the grid.",select:"Select one row by ID.",open:"Open one row by ID to show its full details.",filter:"Filter the grid by one column. Replaces any existing filter on that column.",clear_filters:"Remove all filters.",sort:"Sort the grid by one column, ascending or descending.",clear_sort:"Remove sorting."},Bo={en:{search:"Search",count:"Count",columns:"Columns",get_row:"Get row",highlight:"Highlight",select:"Select",open:"Open",filter:"Filter",clear_filters:"Clear filters",sort:"Sort",clear_sort:"Clear sort"},te:{search:"\u0C35\u0C46\u0C24\u0C41\u0C15\u0C41",count:"\u0C32\u0C46\u0C15\u0C4D\u0C15",columns:"\u0C15\u0C3E\u0C32\u0C2E\u0C4D\u200C\u0C32\u0C41",get_row:"\u0C35\u0C30\u0C41\u0C38 \u0C1A\u0C42\u0C2A\u0C41",highlight:"\u0C39\u0C48\u0C32\u0C48\u0C1F\u0C4D",select:"\u0C0E\u0C02\u0C1A\u0C41\u0C15\u0C4B",open:"\u0C24\u0C46\u0C30\u0C41\u0C35\u0C41",filter:"\u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D",clear_filters:"\u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D\u0C32\u0C41 \u0C24\u0C40\u0C38\u0C47\u0C2F\u0C3F",sort:"\u0C15\u0C4D\u0C30\u0C2E\u0C02",clear_sort:"\u0C15\u0C4D\u0C30\u0C2E\u0C02 \u0C24\u0C40\u0C38\u0C47\u0C2F\u0C3F"}};async function Gi(e,t){try{return t()}catch{return ie("INTERNAL",ye(e).internal)}}function Ke(e,t={}){let n=t.name??"yuktai_grid",o=Bo[e.locale??"en"],i=l=>t.descriptions?.[l]??Pi[l],a={id:{type:"string",description:"Row ID"}},r=e.columns.map(l=>l.key);return[{id:"search",available:!0,schema:{type:"object",properties:{query:{type:"string"}},required:["query"]},run:l=>Zt(e,String(l.query??""))},{id:"count",available:!0,schema:{type:"object",properties:{}},run:()=>Jt(e)},{id:"columns",available:!0,schema:{type:"object",properties:{}},run:()=>en(e)},{id:"get_row",available:!0,schema:{type:"object",properties:a,required:["id"]},run:l=>tn(e,String(l.id??""))},{id:"highlight",available:!!e.onHighlightRows,schema:{type:"object",properties:{ids:{type:"array",items:{type:"string"},description:"Row IDs"}},required:["ids"]},run:l=>nn(e,Vo(l.ids))},{id:"select",available:!!e.onSelectRow,schema:{type:"object",properties:a,required:["id"]},run:l=>on(e,String(l.id??""))},{id:"open",available:!!e.onOpenRow,schema:{type:"object",properties:a,required:["id"]},run:l=>rn(e,String(l.id??""))},{id:"filter",available:!!e.onFiltersChange,schema:{type:"object",properties:{key:{type:"string",enum:r},operator:{type:"string",enum:qo},value:{description:"Text or number; for 'between' an array of two numbers or dates"}},required:["key","operator","value"]},run:l=>an(e,{key:String(l.key??""),operator:String(l.operator??""),value:l.value})},{id:"clear_filters",available:!!e.onFiltersChange,schema:{type:"object",properties:{}},run:()=>sn(e)},{id:"sort",available:!!e.onSortChange,schema:{type:"object",properties:{key:{type:"string",enum:r},direction:{type:"string",enum:["asc","desc"]}},required:["key"]},run:l=>ln(e,String(l.key??""),l.direction==="desc"?"desc":"asc")},{id:"clear_sort",available:!!e.onSortChange,schema:{type:"object",properties:{}},run:()=>cn(e)}].filter(l=>l.available).map(l=>({name:`${n}_${l.id}`,title:Bo.en[l.id],description:i(l.id),label:o[l.id],inputSchema:l.schema,execute:u=>Gi(e,()=>l.run(u??{}))}))}var Fi={en:{done:"Done.",toolMissing:e=>`The action "${e}" is not available here.`,missingInput:e=>`Missing: ${e}.`,notUnderstood:"Sorry, I didn't understand. Try: a word to search, \u201Csort by <column>\u201D, or \u201Cclear filters\u201D.",noMatch:e=>`Nothing matched "${e}".`,failed:"Something went wrong while running this action."},te:{done:"\u0C2A\u0C42\u0C30\u0C4D\u0C24\u0C2F\u0C3F\u0C02\u0C26\u0C3F.",toolMissing:e=>`"${e}" \u0C38\u0C4C\u0C15\u0C30\u0C4D\u0C2F\u0C02 \u0C07\u0C15\u0C4D\u0C15\u0C21 \u0C05\u0C02\u0C26\u0C41\u0C2C\u0C3E\u0C1F\u0C41\u0C32\u0C4B \u0C32\u0C47\u0C26\u0C41.`,missingInput:e=>`\u0C07\u0C35\u0C3F \u0C15\u0C3E\u0C35\u0C3E\u0C32\u0C3F: ${e}.`,notUnderstood:"\u0C15\u0C4D\u0C37\u0C2E\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F, \u0C05\u0C30\u0C4D\u0C25\u0C02 \u0C15\u0C3E\u0C32\u0C47\u0C26\u0C41. \u0C07\u0C32\u0C3E \u0C2A\u0C4D\u0C30\u0C2F\u0C24\u0C4D\u0C28\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F: \u0C35\u0C46\u0C24\u0C15\u0C3E\u0C32\u0C4D\u0C38\u0C3F\u0C28 \u0C2A\u0C26\u0C02, \u201C<\u0C15\u0C3E\u0C32\u0C2E\u0C4D> \u0C2A\u0C4D\u0C30\u0C15\u0C3E\u0C30\u0C02 \u0C15\u0C4D\u0C30\u0C2E\u0C02\u201D, \u0C32\u0C47\u0C26\u0C3E \u201C\u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D\u0C32\u0C41 \u0C24\u0C40\u0C38\u0C47\u0C2F\u0C3F\u201D.",noMatch:e=>`"${e}" \u0C15\u0C3F \u0C0F\u0C2E\u0C40 \u0C38\u0C30\u0C3F\u0C2A\u0C4B\u0C32\u0C47\u0C26\u0C41.`,failed:"\u0C08 \u0C2A\u0C28\u0C3F \u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C21\u0C17\u0C3E \u0C38\u0C2E\u0C38\u0C4D\u0C2F \u0C35\u0C1A\u0C4D\u0C1A\u0C3F\u0C02\u0C26\u0C3F."}},Xo=e=>e.normalize("NFC").toLowerCase().trim(),Pe={clearFilters:/\b(clear|remove|reset)\b.*\bfilters?\b|ఫిల్టర్.*(తీసే|తొలగ)/i,clearSort:/\b(clear|remove|reset)\b.*\bsort(ing)?\b|క్రమం.*(తీసే|తొలగ)/i,count:/^\s*(how many|count)\b|ఎన్ని|లెక్క/i,sort:/\bsort\b|\border by\b|క్రమ|అమర్చ|సార్ట్/i,desc:/\b(desc|descending|z\s*-\s*a|highest|largest|most)\b|అవరోహణ|తగ్గే|పెద్ద|అధిక|చివర|ఎక్కువ నుండి/i,openEn:/^\s*open\s+(.+?)\s*$/i,openTe:/^\s*(.+?)\s*(తెరువు|తెరవండి|తెరవు)\s*$/,searchFiller:/^\s*(search(\s+for)?|find|show(\s+me)?|filter(\s+by)?|look\s+for|వెతుకు|వెతకండి|శోధించు|శోధించండి|చూపించు|చూపించండి)\s+|\s+(వెతుకు|వెతకండి|శోధించు|శోధించండి|చూపించు|చూపించండి)\s*$/gi};function zi(e,t){let n=Xo(e),o=null;for(let i of t)for(let a of[i.label,i.key]){let r=Xo(a);r&&n.includes(r)&&(!o||r.length>o.len)&&(o={key:i.key,len:r.length})}return o?.key??null}function dn(e,t){let n=(e??"").trim();if(!n)return null;if(Pe.clearFilters.test(n))return{kind:"tool",tool:"clear_filters",input:{}};if(Pe.clearSort.test(n))return{kind:"tool",tool:"clear_sort",input:{}};if(Pe.count.test(n))return{kind:"tool",tool:"count",input:{}};if(Pe.sort.test(n)){let a=zi(n,t.columns);return a?{kind:"tool",tool:"sort",input:{key:a,direction:Pe.desc.test(n)?"desc":"asc"}}:null}let o=n.match(Pe.openEn)??n.match(Pe.openTe);if(o?.[1])return{kind:"open",text:o[1].trim()};let i=n.replace(Pe.searchFiller,"").trim();return i?{kind:"tool",tool:"search",input:{query:i}}:null}function $i(e){return!!e&&typeof e=="object"&&typeof e.success=="boolean"&&typeof e.message=="string"}function Oi(e,t){let n=e.inputSchema?.required;return Array.isArray(n)?n.map(String).filter(o=>t[o]===void 0||t[o]===null||String(t[o]).trim()===""):[]}function Wi(e,t){let n=e.find(i=>i.name===t);if(n)return n;let o=e.filter(i=>i.name.endsWith(`_${t}`)).sort((i,a)=>i.name.length-a.name.length);if(o.length!==0&&!(o.length>1&&o[0].name.length===o[1].name.length))return o[0]}function st({tools:e,onResult:t,onError:n,locale:o="en",columns:i=[],rowKey:a="id",parseIntent:r,historyLimit:s=20}){let l=Fi[o],[u,f]=(0,le.useState)(0),[h,N]=(0,le.useState)(null),[D,F]=(0,le.useState)(null),[I,C]=(0,le.useState)([]),z=(0,le.useRef)({tools:e,onResult:t,onError:n,columns:i,rowKey:a,parseIntent:r,historyLimit:s,m:l,locale:o});z.current={tools:e,onResult:t,onError:n,columns:i,rowKey:a,parseIntent:r,historyLimit:s,m:l,locale:o};let b=(0,le.useRef)(!0),R=(0,le.useRef)(0);(0,le.useEffect)(()=>(b.current=!0,()=>{b.current=!1}),[]);let M=(0,le.useCallback)((ee,G,re,v,p)=>{b.current&&(p===R.current&&N(re),C(U=>[...U,{id:p,tool:ee,input:G,result:re,source:v,at:Date.now()}].slice(-z.current.historyLimit)))},[]),y=(0,le.useCallback)(async(ee,G,re)=>{let{tools:v,onResult:p,onError:U,m:J}=z.current,H=++R.current,$=Wi(v,ee);if(!$){let x={success:!1,message:J.toolMissing(ee),error:{code:"NOT_SUPPORTED"}},L=new Error(x.message);return b.current&&F(L),U?.(L),M(ee,G,x,re,H),x}let ue=Oi($,G);if(ue.length){let x={success:!1,message:J.missingInput(ue.join(", ")),error:{code:"INVALID_INPUT"},tool:$.name};return M($.name,G,x,re,H),p?.(x),x}b.current&&f(x=>x+1);try{let x=await $.execute(G),L=$i(x)?{...x,tool:$.name}:{success:!0,message:J.done,data:x,tool:$.name};return b.current&&L.success&&F(null),M($.name,G,L,re,H),p?.(L),L}catch(x){let L=x instanceof Error?x:new Error(String(x)),S={success:!1,message:J.failed,error:{code:"INTERNAL"},tool:$.name};return b.current&&F(L),U?.(L),M($.name,G,S,re,H),S}finally{b.current&&f(x=>Math.max(0,x-1))}},[M]),Z=(0,le.useCallback)((ee,G={})=>y(ee,G??{},"tool"),[y]),A=(0,le.useCallback)(async ee=>{let{columns:G,locale:re,parseIntent:v,m:p,rowKey:U}=z.current,H=(v??dn)(ee,{columns:G,locale:re});if(!H){let x={success:!1,message:p.notUnderstood,error:{code:"NOT_UNDERSTOOD"}};return M("ask",{text:ee},x,"ask",++R.current),x}if(H.kind==="tool")return y(H.tool,H.input,"ask");let $=await y("search",{query:H.text},"ask"),ue=Array.isArray($.data)?$.data:[];if(!$.success)return $;if(ue.length===0){let x={success:!1,message:p.noMatch(H.text),error:{code:"NOT_FOUND"},tool:$.tool};return M("open",{text:H.text},x,"ask",++R.current),x}return y("open",{id:Ve(ue[0],U)},"ask")},[M,y]),B=(0,le.useCallback)(()=>{C([]),N(null),F(null)},[]);return{loading:u>0,tools:e,executeTool:Z,ask:A,lastResult:h,lastError:D,history:I,clearHistory:B}}var Ko=st;m();var Ge=require("react");function Hi(e){return JSON.stringify(e.map(t=>[t.name,t.title,t.description,t.inputSchema]))}function Di({tools:e,data:t=[],columns:n=[],rowKey:o,locale:i,onSelectRow:a,onHighlightRows:r,onOpenRow:s,name:l="yuktai_grid",descriptions:u,onStatusChange:f}){let h=(0,Ge.useMemo)(()=>e||Ke({data:t,columns:n,rowKey:o,locale:i,onSelectRow:a,onHighlightRows:r,onOpenRow:s},{name:l,descriptions:u}),[e,t,n,o,i,a,r,s,l,u]),N=(0,Ge.useRef)(h);N.current=h;let D=(0,Ge.useRef)(f);D.current=f;let F=(0,Ge.useRef)(Promise.resolve()),I=Hi(h);return(0,Ge.useEffect)(()=>{let C=y=>D.current?.(y),z=typeof document<"u"?document.modelContext:void 0;if(!z?.registerTool){C({state:"unsupported",registered:[],errors:[]});return}let b=new AbortController,R=N.current,M=F.current.then(async()=>{if(b.signal.aborted)return;C({state:"registering",registered:[],errors:[]});let y=[],Z=[];for(let A of R){if(b.signal.aborted)return;try{await z.registerTool({name:A.name,title:A.title,description:A.description,inputSchema:A.inputSchema,execute:B=>{let ee=N.current.find(G=>G.name===A.name);return ee?ee.execute(B??{}):{success:!1,message:`Tool "${A.name}" is no longer available.`,error:{code:"NOT_SUPPORTED"}}}},{signal:b.signal}),y.push(A.name)}catch(B){Z.push({tool:A.name,message:B instanceof Error?B.message:String(B)})}}b.signal.aborted||C({state:Z.length===0?"ready":y.length>0?"partial":"error",registered:y,errors:Z})});return F.current=M.catch(()=>{}),()=>b.abort()},[I]),null}var lt=Di;var w=require("react/jsx-runtime"),_i={"en-US":{search:"Search...",searchAria:"Search grid",rows:"rows",row:"row",loading:"Loading...",noData:"No data found.",selectRow:"Select row",pageSize:"Page size",page:"Page",of:"of",previous:"Previous",next:"Next",yes:"Yes",no:"No",sortAscending:"Sort ascending",sortDescending:"Sort descending",filtersActive:e=>`${e} filter(s) applied`,clearFilters:"Clear filters"},"te-IN":{search:"\u0C36\u0C4B\u0C27\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F...",searchAria:"\u0C17\u0C4D\u0C30\u0C3F\u0C21\u0C4D\u200C\u0C32\u0C4B \u0C36\u0C4B\u0C27\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F",rows:"\u0C35\u0C30\u0C41\u0C38\u0C32\u0C41",row:"\u0C35\u0C30\u0C41\u0C38",loading:"\u0C32\u0C4B\u0C21\u0C4D \u0C05\u0C35\u0C41\u0C24\u0C4B\u0C02\u0C26\u0C3F...",noData:"\u0C21\u0C47\u0C1F\u0C3E \u0C15\u0C28\u0C2C\u0C21\u0C32\u0C47\u0C26\u0C41.",selectRow:"\u0C35\u0C30\u0C41\u0C38\u0C28\u0C41 \u0C0E\u0C02\u0C1A\u0C41\u0C15\u0C4B\u0C02\u0C21\u0C3F",pageSize:"\u0C2A\u0C47\u0C1C\u0C40 \u0C2A\u0C30\u0C3F\u0C2E\u0C3E\u0C23\u0C02",page:"\u0C2A\u0C47\u0C1C\u0C40",of:"\u0C32\u0C4B",previous:"\u0C35\u0C46\u0C28\u0C41\u0C15\u0C15\u0C41",next:"\u0C2E\u0C41\u0C02\u0C26\u0C41\u0C15\u0C41",yes:"\u0C05\u0C35\u0C41\u0C28\u0C41",no:"\u0C15\u0C3E\u0C26\u0C41",sortAscending:"\u0C06\u0C30\u0C4B\u0C39\u0C23 \u0C15\u0C4D\u0C30\u0C2E\u0C02\u0C32\u0C4B \u0C05\u0C2E\u0C30\u0C4D\u0C1A\u0C02\u0C21\u0C3F",sortDescending:"\u0C05\u0C35\u0C30\u0C4B\u0C39\u0C23 \u0C15\u0C4D\u0C30\u0C2E\u0C02\u0C32\u0C4B \u0C05\u0C2E\u0C30\u0C4D\u0C1A\u0C02\u0C21\u0C3F",filtersActive:e=>`${e} \u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D(\u0C32\u0C41) \u0C35\u0C47\u0C36\u0C3E\u0C30\u0C41`,clearFilters:"\u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D\u0C32\u0C41 \u0C24\u0C40\u0C38\u0C47\u0C2F\u0C02\u0C21\u0C3F"}};function Bi({size:e=20,color:t="currentColor",strokeWidth:n=2.4}){return(0,w.jsxs)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:n,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,w.jsx)("circle",{cx:"11",cy:"11",r:"6.5"}),(0,w.jsx)("path",{d:"m16 16 5 5"})]})}function qi({size:e=18,color:t="currentColor",strokeWidth:n=2.4,label:o}){return(0,w.jsxs)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:n,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":o?void 0:!0,"aria-label":o,role:o?"img":void 0,children:[o?(0,w.jsx)("title",{children:o}):null,(0,w.jsx)("path",{d:"m6 15 6-6 6 6"})]})}function ji({size:e=18,color:t="currentColor",strokeWidth:n=2.4,label:o}){return(0,w.jsxs)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:n,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":o?void 0:!0,"aria-label":o,role:o?"img":void 0,children:[o?(0,w.jsx)("title",{children:o}):null,(0,w.jsx)("path",{d:"m6 9 6 6 6-6"})]})}function Ui({size:e=20,color:t="currentColor",strokeWidth:n=2.4}){return(0,w.jsx)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:n,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,w.jsx)("path",{d:"m15 18-6-6 6-6"})})}function Vi({size:e=20,color:t="currentColor",strokeWidth:n=2.4}){return(0,w.jsx)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:n,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,w.jsx)("path",{d:"m9 18 6-6-6-6"})})}function Qo({size:e=18,color:t="currentColor",strokeWidth:n=2.4}){return(0,w.jsx)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:n,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,w.jsx)("path",{d:"m5 12 4 4L19 6"})})}function Zo({data:e,columns:t,rowKey:n="id",view:o="auto",mobileBreakpoint:i=768,theme:a="default",locale:r="en-US",ai:s=!1,search:l=!0,selectable:u=!1,selectedKeys:f=[],onSelectionChange:h,pagination:N,loading:D=!1,highlightIds:F=[],highlightColor:I="#fff3a3",autoScrollToHighlight:C=!1,onRowClick:z,onSortChange:b,empty:R,className:M="",inputLanguage:y,toolName:Z="yuktai_grid",toolDescriptions:A,webmcp:B=!1,onWebMCPStatusChange:ee,onAgentResult:G}){let re=r==="te-IN"?"te-IN":"en-US",v=_i[re],p=s===!0||typeof s=="object"&&s!==null,U=N!==!1&&N!==void 0,J=typeof N=="object"?N.pageSize??20:20,H=typeof N=="object"&&N.sizeOptions&&N.sizeOptions.length>0?N.sizeOptions:[10,20,50,100],[$,ue]=(0,oe.useState)(""),[x,L]=(0,oe.useState)(1),[S,X]=(0,oe.useState)(J),[q,V]=(0,oe.useState)(),[se,Se]=(0,oe.useState)("asc"),[Te,Fe]=(0,oe.useState)(!1),[Ae,ze]=(0,oe.useState)([]),[Oe,ft]=(0,oe.useState)([]),Re=(0,oe.useMemo)(()=>Xe(t.map(d=>({key:String(d.key),label:d.label,type:d.type}))),[t]);(0,oe.useEffect)(()=>{X(J),L(1)},[J]),(0,oe.useEffect)(()=>{let d=()=>{Fe(window.innerWidth<=i)};return d(),window.addEventListener("resize",d),()=>{window.removeEventListener("resize",d)}},[i]);let pe=(0,oe.useMemo)(()=>{let d=[...e];if($.trim()){let E=$.trim().toLowerCase();d=d.filter(j=>t.some(O=>String(j[O.key]??"").toLowerCase().includes(E)))}return Ae.length&&(d=Ye(d,Re,Ae)),q&&d.sort((E,j)=>{let O=E[q],me=j[q];if(O==null&&me==null)return 0;if(O==null)return 1;if(me==null)return-1;if(typeof O=="number"&&typeof me=="number")return se==="asc"?O-me:me-O;let de=String(O).localeCompare(String(me),r,{numeric:!0,sensitivity:"base"});return se==="asc"?de:-de}),d},[e,t,$,Ae,Re,q,se,r]),Ce=U?Math.max(1,Math.ceil(pe.length/S)):1;(0,oe.useEffect)(()=>{x>Ce&&L(Ce)},[x,Ce]);let Qe=(0,oe.useMemo)(()=>{let d=[...F.map(String),...Oe];return Array.from(new Set(d))},[F,Oe]);(0,oe.useEffect)(()=>{if(!C)return;let d=Qe[0];if(d==null)return;let E=typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(String(d)):String(d).replace(/["\\]/g,"\\$&");document.querySelector(`[data-yuktai-row-id="${E}"]`)?.scrollIntoView({behavior:"smooth",block:"center"})},[Qe,C,x]);let gt=(0,oe.useMemo)(()=>{if(!U)return pe;let d=(x-1)*S;return pe.slice(d,d+S)},[pe,U,x,S]),We=o==="card"||o==="auto"&&Te,Le=d=>String(d[n]??""),Ie=d=>f.some(E=>String(E)===d),Ze=d=>Qe.some(E=>String(E)===d),mt=d=>{if(!u)return;let E=Le(d),j=Ie(E)?f.filter(O=>String(O)!==E):[...f,E];h?.(j)},g=d=>{if(d.sortable===!1)return;let E=String(d.key),j=q===E&&se==="asc"?"desc":"asc";V(E),Se(j),L(1),b?.({key:E,direction:j})},te=d=>{ue(d),L(1)},ke=(d,E)=>{let j=t.find(O=>String(O.key)===d||O.label.toLowerCase()===d.toLowerCase());j&&(V(String(j.key)),Se(E),L(1),b?.({key:String(j.key),direction:E}))},Je=re==="te-IN"?"te":"en",wn=(0,oe.useCallback)(d=>{d?(V(d.key),Se(d.direction)):(V(void 0),Se("asc")),L(1),b?.(d)},[b]),kn=(0,oe.useCallback)(d=>{ze(d),L(1)},[]),Sn=(0,oe.useCallback)(d=>{if(ft(d),U&&d.length){let E=pe.findIndex(j=>String(j[n]??"")===d[0]);E>=0&&L(Math.floor(E/S)+1)}},[U,pe,n,S]),It=(0,oe.useMemo)(()=>Ke({data:e,columns:Re,rowKey:String(n),locale:Je,filters:Ae,onHighlightRows:Sn,onFiltersChange:kn,onSortChange:wn,onOpenRow:z?d=>{let E=pe.findIndex(O=>String(O[n]??"")===d),j=E>=0?pe[E]:e.find(O=>String(O[n]??"")===d);j&&z(j,Math.max(E,0))}:void 0,onSelectRow:u&&h?d=>{f.some(E=>String(E)===d)||h([...f.map(String),d])}:void 0},{name:Z,descriptions:A}),[e,Re,n,Je,Ae,Sn,kn,wn,z,pe,u,h,f,Z,A]),bt=st({tools:It,locale:Je,columns:Re,rowKey:String(n),onResult:G}),Tn=(0,oe.useMemo)(()=>It.map(d=>({...d,execute:E=>bt.executeTool(d.name,E)})),[It,bt.executeTool]),sr=()=>{ze([]),L(1)},An=(d,E,j)=>{if(E.render)return E.render(d[E.key],d,j);let O=d[E.key];if(O==null)return"";if(E.type==="date"){let me=new Date(String(O));if(!Number.isNaN(me.getTime()))return me.toLocaleDateString(r)}return E.type==="boolean"?O?v.yes:v.no:String(O)},K=a==="dark",Cn={width:"100%",overflow:"hidden",border:a==="high-contrast"?"2px solid #000000":K?"1px solid #334155":"1px solid #e2e8f0",borderRadius:12,background:K?"#0f172a":"#ffffff",color:K?"#f8fafc":"#0f172a",fontFamily:a==="dyslexia"?"Arial, sans-serif":void 0},lr={padding:12,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",borderBottom:K?"1px solid #334155":"1px solid #e2e8f0"},En=d=>({width:40,height:40,minWidth:40,display:"inline-flex",alignItems:"center",justifyContent:"center",padding:0,borderRadius:8,border:K?"1px solid #475569":"1px solid #cbd5e1",background:d?K?"#1e293b":"#f8fafc":K?"#1e293b":"#ffffff",color:d?"#94a3b8":K?"#f8fafc":"#0f172a",cursor:d?"not-allowed":"pointer",opacity:d?.55:1});if(D)return(0,w.jsxs)("div",{className:M,style:Cn,children:[B&&(0,w.jsx)(lt,{tools:Tn,onStatusChange:ee}),(0,w.jsx)("div",{style:{padding:32,textAlign:"center"},children:v.loading})]});let cr=t.map(d=>({key:String(d.key),label:d.label,type:d.type==="number"?"number":d.type==="date"?"date":"text"}));return(0,w.jsxs)("div",{className:M,style:Cn,children:[B&&(0,w.jsx)(lt,{tools:Tn,onStatusChange:ee}),(l||p||Ae.length>0)&&(0,w.jsxs)("div",{style:lr,children:[l&&(0,w.jsxs)("div",{style:{position:"relative",width:"100%",maxWidth:420},children:[(0,w.jsx)("div",{style:{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",display:"flex",alignItems:"center",color:K?"#cbd5e1":"#64748b",pointerEvents:"none"},children:(0,w.jsx)(Bi,{size:19})}),(0,w.jsx)("input",{value:$,onChange:d=>{ue(d.target.value),L(1)},placeholder:v.search,"aria-label":v.searchAria,style:{width:"100%",padding:"10px 12px 10px 40px",borderRadius:8,border:K?"1px solid #475569":"1px solid #cbd5e1",background:K?"#1e293b":"#ffffff",color:K?"#ffffff":"#0f172a",outline:"none",boxSizing:"border-box"}})]}),Ae.length>0&&(0,w.jsxs)("button",{type:"button",onClick:sr,title:v.clearFilters,style:{padding:"6px 10px",borderRadius:999,border:K?"1px solid #475569":"1px solid #cbd5e1",background:K?"#1e293b":"#f1f5f9",color:"inherit",fontSize:12,cursor:"pointer"},children:[v.filtersActive(Ae.length)," \u2715"]}),(0,w.jsxs)("div",{style:{marginLeft:"auto",fontSize:13,opacity:.7,whiteSpace:"nowrap"},children:[pe.length," ",pe.length===1?v.row:v.rows]}),p&&(0,w.jsx)(Rt,{data:e,columns:cr,onSearch:te,onSort:ke,theme:K?"dark":"light",language:re,inputLanguage:y??re,agent:{ask:bt.ask,loading:bt.loading},embedded:!0})]}),pe.length===0?(0,w.jsx)("div",{style:{padding:40,textAlign:"center",opacity:.7},children:R??v.noData}):We?(0,w.jsx)("div",{style:{display:"grid",gap:12,padding:12},children:gt.map((d,E)=>{let j=Le(d),O=Ie(j),me=Ze(j);return(0,w.jsxs)("div",{"data-yuktai-row-id":j,onClick:()=>z?.(d,E),style:{padding:14,borderRadius:10,border:K?"1px solid #334155":"1px solid #e2e8f0",background:me?I:O?K?"#1e3a5f":"#eff6ff":K?"#1e293b":"#ffffff",cursor:z?"pointer":"default"},children:[u&&(0,w.jsx)("button",{type:"button",onClick:de=>{de.stopPropagation(),mt(d)},"aria-label":`${v.selectRow} ${j}`,"aria-pressed":O,style:{width:32,height:32,display:"inline-flex",alignItems:"center",justifyContent:"center",padding:0,marginBottom:10,borderRadius:7,border:O?"1px solid #2563eb":"1px solid #cbd5e1",background:O?"#2563eb":"transparent",color:O?"#ffffff":"currentColor",cursor:"pointer"},children:O&&(0,w.jsx)(Qo,{size:17})}),t.map(de=>(0,w.jsxs)("div",{style:{display:"flex",gap:8,padding:"5px 0",alignItems:"flex-start"},children:[(0,w.jsx)("strong",{style:{minWidth:100,opacity:.7},children:de.label}),(0,w.jsx)("span",{children:An(d,de,E)})]},String(de.key)))]},j)})}):(0,w.jsx)("div",{style:{width:"100%",overflowX:"auto"},children:(0,w.jsxs)("table",{style:{width:"100%",borderCollapse:"collapse"},children:[(0,w.jsx)("thead",{children:(0,w.jsxs)("tr",{children:[u&&(0,w.jsx)("th",{style:{padding:10,borderBottom:K?"1px solid #334155":"1px solid #e2e8f0",width:52}}),t.filter(d=>!(Te&&d.hiddenOnMobile)).map(d=>{let E=q===String(d.key);return(0,w.jsx)("th",{onClick:()=>g(d),style:{padding:10,textAlign:d.align??"left",borderBottom:K?"1px solid #334155":"1px solid #e2e8f0",whiteSpace:"nowrap",cursor:d.sortable===!1?"default":"pointer",width:d.width,userSelect:"none"},children:(0,w.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:5},children:[d.label,E&&(se==="asc"?(0,w.jsx)(qi,{size:17,label:v.sortAscending}):(0,w.jsx)(ji,{size:17,label:v.sortDescending}))]})},String(d.key))})]})}),(0,w.jsx)("tbody",{children:gt.map((d,E)=>{let j=Le(d),O=Ie(j),me=Ze(j);return(0,w.jsxs)("tr",{"data-yuktai-row-id":j,onClick:()=>z?.(d,E),style:{background:me?I:O?K?"#1e3a5f":"#eff6ff":"transparent",cursor:z?"pointer":"default"},children:[u&&(0,w.jsx)("td",{style:{padding:10,borderBottom:K?"1px solid #334155":"1px solid #e2e8f0"},children:(0,w.jsx)("button",{type:"button",onClick:de=>{de.stopPropagation(),mt(d)},"aria-label":`${v.selectRow} ${j}`,"aria-pressed":O,style:{width:28,height:28,display:"inline-flex",alignItems:"center",justifyContent:"center",padding:0,borderRadius:6,border:O?"1px solid #2563eb":K?"1px solid #64748b":"1px solid #cbd5e1",background:O?"#2563eb":"transparent",color:O?"#ffffff":"currentColor",cursor:"pointer"},children:O&&(0,w.jsx)(Qo,{size:16})})}),t.filter(de=>!(Te&&de.hiddenOnMobile)).map(de=>(0,w.jsx)("td",{style:{padding:10,textAlign:de.align??"left",borderBottom:K?"1px solid #334155":"1px solid #e2e8f0"},children:An(d,de,E)},String(de.key)))]},j)})})]})}),U&&(0,w.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap",padding:12,borderTop:K?"1px solid #334155":"1px solid #e2e8f0"},children:[(0,w.jsxs)("span",{style:{fontSize:13,opacity:.7},children:[v.page," ",x," ",v.of," ",Ce]}),(0,w.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"},children:[typeof N=="object"&&N.showSizeChanger&&(0,w.jsx)("select",{value:S,onChange:d=>{let E=Number(d.target.value);!Number.isFinite(E)||E<=0||(X(E),L(1))},"aria-label":v.pageSize,style:{minHeight:40,padding:"7px 10px",borderRadius:8,border:K?"1px solid #475569":"1px solid #cbd5e1",background:K?"#1e293b":"#ffffff",color:K?"#ffffff":"#0f172a"},children:H.map(d=>(0,w.jsx)("option",{value:d,children:d},d))}),(0,w.jsx)("button",{type:"button",disabled:x<=1,onClick:()=>L(d=>Math.max(1,d-1)),"aria-label":v.previous,title:v.previous,style:En(x<=1),children:(0,w.jsx)(Ui,{size:20})}),(0,w.jsx)("button",{type:"button",disabled:x>=Ce,onClick:()=>L(d=>Math.min(Ce,d+1)),"aria-label":v.next,title:v.next,style:En(x>=Ce),children:(0,w.jsx)(Vi,{size:20})})]})]})]})}m();var Y=require("react");function Jo(e){return e===!1?Number.MAX_SAFE_INTEGER:e===!0||e===void 0?10:e.pageSize??10}function er(e){return String(e??"").normalize("NFC").toLowerCase().trim()}function tr(e){return e==null||typeof e=="string"&&e.trim()===""}function nr(e){if(typeof e=="number")return Number.isFinite(e)?e:null;let t=String(e??"").trim();if(t==="")return null;let n=Number(t);return Number.isFinite(n)?n:null}function or(e){let t=e instanceof Date?e.getTime():new Date(String(e)).getTime();return Number.isFinite(t)?t:null}function Yi(e,t,n,o){if(n==="number"||typeof e=="number"&&typeof t=="number"){let i=nr(e),a=nr(t);if(i!==null&&a!==null)return i-a}if(n==="date"||e instanceof Date&&t instanceof Date){let i=or(e),a=or(t);if(i!==null&&a!==null)return i-a}return typeof e=="boolean"&&typeof t=="boolean"?e===t?0:e?1:-1:String(e).localeCompare(String(t),o,{sensitivity:"base",numeric:!0})}function rr(e){let{data:t,columns:n,pagination:o=!0,mobileBreakpoint:i=768,locale:a,initialFilters:r=[]}=e,[s,l]=(0,Y.useState)(null),[u,f]=(0,Y.useState)(""),[h,N]=(0,Y.useState)(r),[D,F]=(0,Y.useState)(1),[I,C]=(0,Y.useState)(Jo(o)),[z,b]=(0,Y.useState)(!1),R=Jo(o);(0,Y.useEffect)(()=>{C(R),F(1)},[R]),(0,Y.useEffect)(()=>{if(typeof window>"u")return;let S=()=>{b(window.innerWidth<=i)};return S(),window.addEventListener("resize",S),()=>window.removeEventListener("resize",S)},[i]);let M=(0,Y.useMemo)(()=>Xe(n.map(S=>({key:String(S.key),label:S.label,type:S.type}))),[n]),y=(0,Y.useCallback)(S=>{l(X=>!X||X.key!==S?{key:S,direction:"asc"}:X.direction==="asc"?{key:S,direction:"desc"}:null),F(1)},[]),Z=(0,Y.useCallback)(S=>{l(S&&S.direction?S:null),F(1)},[]),A=(0,Y.useCallback)(()=>{l(null),F(1)},[]),B=(0,Y.useCallback)(S=>{f(S),F(1)},[]),ee=(0,Y.useCallback)(S=>{N(S),F(1)},[]),G=(0,Y.useCallback)(S=>{N(X=>[...X.filter(q=>q.key!==S.key),S]),F(1)},[]),re=(0,Y.useCallback)(S=>{N(X=>X.filter(q=>q.key!==S)),F(1)},[]),v=(0,Y.useCallback)(()=>{N([]),F(1)},[]),p=(0,Y.useCallback)(S=>{C(Math.max(1,Math.floor(S)||1)),F(1)},[]),U=(0,Y.useMemo)(()=>{let S=er(u);return S?t.filter(X=>n.some(q=>{let V=X[q.key];return V==null?!1:er(V).includes(S)})):t},[t,u,n]),J=(0,Y.useMemo)(()=>Ye(U,M,h),[U,M,h]),H=(0,Y.useMemo)(()=>{if(!s||!s.direction)return J;let S=n.find(q=>String(q.key)===s.key),X=s.direction==="desc"?-1:1;return[...J].sort((q,V)=>{let se=q[s.key],Se=V[s.key],Te=tr(se),Fe=tr(Se);return Te&&Fe?0:Te?1:Fe?-1:X*Yi(se,Se,S?.type,a)})},[J,s,n,a]),$=Math.max(1,Math.ceil(H.length/I)),ue=(0,Y.useMemo)(()=>{if(o===!1)return H;let S=(D-1)*I;return H.slice(S,S+I)},[H,D,I,o]);(0,Y.useEffect)(()=>{D>$&&F($)},[D,$]);let x=(0,Y.useCallback)(S=>F(Math.min(Math.max(1,Math.floor(S)||1),$)),[$]),L=(0,Y.useCallback)(()=>{l(null),f(""),N([]),F(1)},[]);return{displayedData:ue,rows:H,totalCount:t.length,filteredCount:H.length,sort:s,toggleSort:y,setSort:Z,clearSort:A,searchQuery:u,setSearchQuery:B,filters:h,setFilters:ee,setFilter:G,removeFilter:re,clearFilters:v,page:D,pageSize:I,totalPages:$,setPage:x,setPageSize:p,isMobile:z,reset:L}}m();m();var ir=require("react/jsx-runtime");function ce({size:e=20,color:t="currentColor",strokeWidth:n=2.5,label:o,children:i,...a}){return(0,ir.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:n,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!o?"true":void 0,"aria-label":o,role:o?"img":void 0,focusable:"false",...a,children:i})}m();var ct=require("react/jsx-runtime");function un(e){return(0,ct.jsxs)(ce,{...e,children:[(0,ct.jsx)("circle",{cx:"11",cy:"11",r:"7"}),(0,ct.jsx)("path",{d:"m20 20-4-4"})]})}m();var dt=require("react/jsx-runtime");function pn(e){return(0,dt.jsxs)(ce,{...e,children:[(0,dt.jsx)("path",{d:"M12 19V5"}),(0,dt.jsx)("path",{d:"m5 12 7-7 7 7"})]})}m();var ut=require("react/jsx-runtime");function fn(e){return(0,ut.jsxs)(ce,{...e,children:[(0,ut.jsx)("path",{d:"M12 5v14"}),(0,ut.jsx)("path",{d:"m5 12 7 7 7-7"})]})}m();var gn=require("react/jsx-runtime");function mn(e){return(0,gn.jsx)(ce,{...e,children:(0,gn.jsx)("path",{d:"m15 18-6-6 6-6"})})}m();var bn=require("react/jsx-runtime");function hn(e){return(0,bn.jsx)(ce,{...e,children:(0,bn.jsx)("path",{d:"m9 18 6-6-6-6"})})}m();var yn=require("react/jsx-runtime");function xn(e){return(0,yn.jsx)(ce,{...e,children:(0,yn.jsx)("path",{d:"M5 12.5 10 17.5 19.5 7"})})}m();var pt=require("react/jsx-runtime");function vn(e){return(0,pt.jsxs)(ce,{...e,children:[(0,pt.jsx)("path",{d:"M18 6 6 18"}),(0,pt.jsx)("path",{d:"m6 6 12 12"})]})}function Xi(){if(typeof globalThis>"u")return new Me;if(!globalThis.__yuktai_runtime__){let e=new Me;e.register(be.name,be),e.register(it.name,it),e.register(at.name,at),globalThis.__yuktai_runtime__=e}return globalThis.__yuktai_runtime__}var ar=typeof window<"u"?Xi():new Me,Ki={wcagPlugin:be,list(){return ar.getPlugins()},use(e){return ar.use(e)},fix(e){return be.applyFixes({enabled:!0,autoFix:!0,...e})},scan(){return be.scan()}};
