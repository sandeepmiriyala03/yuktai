"use strict";var yn=Object.create;var Ve=Object.defineProperty;var xn=Object.getOwnPropertyDescriptor;var vn=Object.getOwnPropertyNames;var wn=Object.getPrototypeOf,kn=Object.prototype.hasOwnProperty;var ke=(e,t)=>()=>(e&&(t=e(e=0)),t);var Pe=(e,t)=>{for(var o in t)Ve(e,o,{get:t[o],enumerable:!0})},Kt=(e,t,o,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of vn(t))!kn.call(e,i)&&i!==o&&Ve(e,i,{get:()=>t[i],enumerable:!(r=xn(t,i))||r.enumerable});return e};var gt=(e,t,o)=>(o=e!=null?yn(wn(e)):{},Kt(t||!e||!e.__esModule?Ve(o,"default",{value:e,enumerable:!0}):o,e)),Sn=e=>Kt(Ve({},"__esModule",{value:!0}),e);var g=ke(()=>{});var ko={};Pe(ko,{askPage:()=>Ct});function Vn(){return new Promise(e=>{let t=setTimeout(e,1500),o=new MutationObserver(()=>{clearTimeout(t),t=setTimeout(()=>{o.disconnect(),e()},500)});o.observe(document.body,{childList:!0,subtree:!0})})}function Un(){let e=[],t=document.querySelectorAll("*");for(let o of t){if(o.closest("[data-yuktai-panel]"))continue;let r=o.innerText?.trim();r&&r.length>30&&e.push(r);let i=o.getAttribute("aria-label");if(i&&i.length>10&&e.push(i),(o instanceof HTMLInputElement||o instanceof HTMLTextAreaElement)&&(o.placeholder&&e.push(o.placeholder),o.value&&e.push(o.value)),o instanceof HTMLButtonElement){let a=o.innerText||o.getAttribute("aria-label");a&&e.push(a)}}return e.join(" ").slice(0,3500)}async function Ct(e){if(!e.trim())return{success:!1,answer:"",error:"Please type a question."};try{let t=window,o=t.LanguageModel||t.ai?.languageModel;if(!o)return{success:!1,answer:"",error:"Gemini Nano not available."};await Vn();let r=Un();if(!r||r.length<100)return{success:!1,answer:"",error:"Page content not readable."};let i;try{i=await o.create({systemPrompt:`Answer ONLY using page content.
Keep answer short (2\u20133 sentences).
If not found say: "I could not find that on this page."`,outputLanguage:"en"})}catch{i=await o.create()}let a=`Page:
${r}

Q: ${e}`,n=await i.prompt(a);return i?.destroy&&i.destroy(),{success:!0,answer:n?.trim()||"No answer found."}}catch(t){return{success:!1,answer:"",error:t instanceof Error?t.message:"Error occurred"}}}var Et=ke(()=>{"use strict";g()});var It={};Pe(It,{askPageWithTransformers:()=>Rt,getModelLoadStatus:()=>ze,isTransformersSupported:()=>Ne});function Co(){return typeof navigator>"u"?!1:/Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(navigator.userAgent)}function Kn(){if(Co())return"wasm";try{if(typeof navigator<"u"&&"gpu"in navigator&&navigator.gpu!==void 0)return"webgpu"}catch{}return"wasm"}async function Xn(){if(!Lt){if(Ce){for(;Ce;)await new Promise(e=>setTimeout(e,200));return}Ce=!0;try{let{pipeline:e,env:t}=await import("@huggingface/transformers");t.allowRemoteModels=!0,t.allowLocalModels=!1,typeof window<"u"&&typeof caches<"u"&&(t.useWasmCache=!0);let o=Kn(),r=Co();console.log(`yuktai: Transformers.js \u2014 device: ${o}, mobile: ${r}`),To=await e("feature-extraction","Xenova/all-MiniLM-L6-v2",{device:o,dtype:r?"q4":"fp32"}),Ao=await e("text2text-generation","Xenova/flan-t5-small",{device:o,dtype:r?"q4":"fp32"}),Lt=!0,Ce=!1,console.log("yuktai: Transformers.js models loaded \u2705")}catch(e){throw Ce=!1,console.error("yuktai: Transformers.js model load failed",e),e}}}function Zn(){return new Promise(e=>{let t=setTimeout(e,1500),o=new MutationObserver(()=>{clearTimeout(t),t=setTimeout(()=>{o.disconnect(),e()},500)});o.observe(document.body,{childList:!0,subtree:!0})})}function Jn(){let e=[],t=new Set,o=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, td, th, label, figcaption, blockquote, span, a, button, div");for(let n of o){if(n.closest("[data-yuktai-panel]")||n.querySelector("p, h1, h2, h3, h4, li, td, div"))continue;let l=n.innerText?.trim();if(!l||l.length<15||t.has(l))continue;t.add(l),e.push(l);let d=n.getAttribute("aria-label")?.trim();d&&d.length>8&&!t.has(d)&&(t.add(d),e.push(d))}let r=document.title?.trim();r&&!t.has(r)&&e.unshift(r);let a=document.querySelector('meta[name="description"]')?.getAttribute("content")?.trim();return a&&!t.has(a)&&e.unshift(a),e.join(" ").slice(0,8e3)}function Qn(e,t=150,o=30){if(typeof e!="string")try{e=String(e??"")}catch{return[]}let r=e.trim();if(!r)return[];let i=Math.min(o,Math.floor(t/2)),a=r.split(/\s+/),n=[],s=t-i;for(let l=0;l<a.length;l+=s){let d=a.slice(l,l+t).join(" ");d.trim().length>20&&n.push(d)}return n}function er(e,t){let o=0,r=0,i=0;for(let a=0;a<e.length;a++)o+=e[a]*t[a],r+=e[a]*e[a],i+=t[a]*t[a];return o/(Math.sqrt(r)*Math.sqrt(i)+1e-8)}async function So(e){let t=await To(e,{pooling:"mean",normalize:!0}),o=t?.data??t;return Array.from(o)}async function tr(e,t,o=3){let r=await So(e),i=await Promise.all(t.map(async a=>{let n=await So(a),s=er(r,n);return{chunk:a,score:s}}));return i.sort((a,n)=>n.score-a.score),i.slice(0,o).map(a=>a.chunk)}async function Rt(e){if(!e.trim())return{success:!1,answer:"",error:"Please type a question."};try{await Xn(),await Zn();let t=Jn();if(!t||t.length<50)return{success:!1,answer:"",error:"Not enough content on this page."};let o=Qn(t);if(o.length===0)return{success:!1,answer:"",error:"Could not process page content."};let a=`Answer the question based on the context. Give a complete answer in 2-3 sentences.

Context: ${(await tr(e,o,3)).join(" ").slice(0,1200)}

Question: ${e}

Answer:`,s=(await Ao(a,{max_new_tokens:120,min_new_tokens:10}))?.[0]?.generated_text?.trim()||"";return s?{success:!0,answer:s}:{success:!0,answer:"I could not find a specific answer on this page."}}catch(t){console.error("yuktai: Transformers RAG error",t);let o=t instanceof Error?t.message:"";return o.includes("Out of memory")||o.includes("memory")?{success:!1,answer:"",error:"Not enough device memory. Try on a device with more RAM or use desktop Chrome with Gemini Nano."}:{success:!1,answer:"",error:o||"Transformers.js error."}}}function Ne(){try{return typeof WebAssembly<"u"&&typeof Worker<"u"}catch{return!1}}function ze(){return Lt?"ready":Ce?"loading":"idle"}var To,Ao,Ce,Lt,Fe=ke(()=>{"use strict";g();To=null,Ao=null,Ce=!1,Lt=!1});function Lo(e,t){return e.replace(/\{\{SITE_NAME\}\}/g,t.SITE_NAME).replace(/\{\{THEME_COLOR\}\}/g,t.THEME_COLOR).replace(/\{\{TAGLINE\}\}/g,t.TAGLINE).replace(/\{\{YEAR\}\}/g,t.YEAR)}var Nt,Ro,Io,Mo,Po,No,zo,Fo,$o,Go,Wo,Ho,Bo,Oo,_o,Do,qo,jo,Yo,Vo,Uo,Ko,Xo,Zo,Jo,Qo=ke(()=>{"use strict";g();Nt={blue:"#1a73e8",green:"#0d9488",purple:"#7c3aed",red:"#dc2626",orange:"#ea580c",teal:"#0891b2",indigo:"#4f46e5",gray:"#374151"},Ro=e=>`{
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
`,Io=`/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
}

module.exports = nextConfig
`,Mo=e=>`/** @type {import('tailwindcss').Config} */
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
`,Po=e=>`@tailwind base;
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
`,No=`import type { Metadata } from "next"
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
`,zo=`"use client"
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
`,Fo=`.navbar {
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
`,$o=`import styles from "./Footer.module.css"

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
`,Go=`.footer {
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
`,Wo=`import styles from "./page.module.css"
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
`,Ho=`.page { min-height: 100vh; }

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
`,Bo=`import styles from "./page.module.css"

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
`,Oo=`.page { min-height: 100vh; }

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
`,_o=`"use client"
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
`,Do=`.page { min-height: 100vh; }

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
`,qo=`import styles from "./page.module.css"

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
`,jo=`.page { min-height: 100vh; }

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
`,Yo=`import styles from "./page.module.css"
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
`,Vo=`.page { min-height: 100vh; }

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
`,Uo=`"use client"
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
`,Ko=`.page {
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
`,Xo=`import Link from "next/link"

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
`,Zo=`{
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
`,Jo=e=>`# ${e}

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
`});var en={};Pe(en,{generateZip:()=>yr});function hr(e,t){return{hotel:`Experience luxury and comfort at ${e}`,ecommerce:`Shop the best products at ${e}`,restaurant:`Delicious food crafted with love at ${e}`,portfolio:`Creative work and professional services by ${e}`,blog:`Insights, stories, and ideas from ${e}`,saas:`Powerful tools to grow your business \u2014 ${e}`,government:`Official services and information \u2014 ${e}`,healthcare:`Quality healthcare you can trust \u2014 ${e}`,education:`Learn, grow, and succeed with ${e}`,realestate:`Find your perfect property with ${e}`,landing:`The smarter way to get things done \u2014 ${e}`,generic:`Welcome to ${e} \u2014 your trusted partner`}[t]||`Welcome to ${e}`}async function yr(e){let t=(await import("jszip")).default,o=new t,r=Nt[e.theme]||Nt.blue,i=hr(e.siteName,e.websiteType),a=new Date().getFullYear().toString(),n={SITE_NAME:e.siteName,THEME_COLOR:r,TAGLINE:i,YEAR:a},s=y=>Lo(y,n).replace(/\{\{SITE_NAME_LOWER\}\}/g,e.siteName.toLowerCase().replace(/\s+/g,""));o.file("package.json",Ro(e.siteName)),o.file("next.config.js",Io),o.file("tailwind.config.js",Mo(r)),o.file("tsconfig.json",Zo),o.file("README.md",Jo(e.siteName)),o.file("postcss.config.js","module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }"),o.file(".gitignore",`node_modules
.next
.env.local
.DS_Store`),o.file("src/app/globals.css",Po(r)),o.file("src/app/layout.tsx",s(No)),o.file("src/app/not-found.tsx",Xo),o.file("src/components/Navbar.tsx",s(zo)),o.file("src/components/Navbar.module.css",Fo),o.file("src/components/Footer.tsx",s($o)),o.file("src/components/Footer.module.css",Go);for(let y of e.pages)switch(y){case"home":o.file("src/app/page.tsx",s(Wo)),o.file("src/app/page.module.css",Ho);break;case"about":o.file("src/app/about/page.tsx",s(Bo)),o.file("src/app/about/page.module.css",Oo);break;case"contact":o.file("src/app/contact/page.tsx",s(_o)),o.file("src/app/contact/page.module.css",Do);break;case"services":o.file("src/app/services/page.tsx",s(qo)),o.file("src/app/services/page.module.css",jo);break;case"pricing":o.file("src/app/pricing/page.tsx",s(Yo)),o.file("src/app/pricing/page.module.css",Vo);break;case"auth":o.file("src/app/auth/page.tsx",s(Uo)),o.file("src/app/auth/page.module.css",Ko);break;default:o.file(`src/app/${y}/page.tsx`,xr(y,e.siteName,r,n,s));break}let l=await o.generateAsync({type:"blob"}),d=URL.createObjectURL(l),b=document.createElement("a");b.href=d,b.download=`${e.siteName.toLowerCase().replace(/\s+/g,"-")}-nextjs.zip`,document.body.appendChild(b),b.click(),document.body.removeChild(b),URL.revokeObjectURL(d)}function xr(e,t,o,r,i){let a=e.charAt(0).toUpperCase()+e.slice(1);return`import styles from "./page.module.css"

export default function ${a}Page() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <section style={{
        background: "${o}",
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
`}var tn=ke(()=>{"use strict";g();Qo()});var sn={};Pe(sn,{getPageText:()=>on,highlightField:()=>rn,runAgent:()=>Cr,scanFormFields:()=>nn,scrollToSection:()=>an});function fe(e){try{let t=window.getComputedStyle(e);if(t.display==="none"||t.visibility==="hidden"||t.opacity==="0"||e.hidden)return!1;let o=e.getBoundingClientRect();return!(o.width===0&&o.height===0)}catch{return!0}}function on(){let e=[],t=new Set,o=n=>{let s=n.trim();s&&s.length>10&&!t.has(s)&&(t.add(s),e.push(s))};document.title&&o(document.title);let r=['meta[name="description"]','meta[name="keywords"]','meta[property="og:title"]','meta[property="og:description"]','meta[name="twitter:title"]','meta[name="twitter:description"]'];for(let n of r){let s=document.querySelector(n)?.getAttribute("content");s&&o(s)}let i=["h1","h2","h3","h4","h5","h6","p","blockquote","q","pre","code","li","dt","dd","th","td","caption","a","b","strong","em","i","u","s","abbr","acronym","cite","dfn","mark","small","sub","sup","ins","del","bdi","bdo","article","section","aside","nav","header","footer","main","summary","details","figcaption","figure","address","time","output","label","legend","option","button","font","center","span","div","[role='heading']","[role='main']","[role='article']","[role='region']","[role='complementary']","[role='contentinfo']","[role='navigation']","[role='banner']","[role='listitem']","[role='cell']","[role='columnheader']","[role='rowheader']"],a=document.querySelectorAll(i.join(","));for(let n of a){if(n.closest("[data-yuktai-panel]")||!fe(n)||n.querySelector("p, h1, h2, h3, h4, h5, h6, li, td, th, div, article, section, blockquote, pre"))continue;let l=n.innerText?.trim();if(l&&l.length>10&&o(l),!l){let F=n.textContent?.trim();F&&F.length>10&&o(F)}let d=n.getAttribute("aria-label")?.trim();d&&d.length>5&&o(d);let b=n.getAttribute("aria-description")?.trim();b&&b.length>5&&o(b);let y=n.getAttribute("aria-valuetext")?.trim();y&&o(y);let M=n.getAttribute("title")?.trim();M&&M.length>5&&o(M);let _=n.getAttribute("data-label")?.trim();_&&o(_);let U=n.getAttribute("data-title")?.trim();U&&o(U),n.querySelectorAll("img").forEach(F=>{let L=F.getAttribute("alt")?.trim();L&&L.length>5&&o(L);let N=F.getAttribute("title")?.trim();N&&N.length>5&&o(N)})}document.querySelectorAll("img").forEach(n=>{if(n.closest("[data-yuktai-panel]")||!fe(n))return;let s=n.getAttribute("alt")?.trim(),l=n.getAttribute("title")?.trim();s&&s.length>5&&o(s),l&&l.length>5&&o(l)}),document.querySelectorAll("input:not([type=hidden]), textarea").forEach(n=>{if(n.closest("[data-yuktai-panel]")||!fe(n))return;n.placeholder&&o(n.placeholder),n.value&&n.value.length>3&&o(n.value);let s=n.getAttribute("aria-label")?.trim();s&&o(s)}),document.querySelectorAll("select").forEach(n=>{n.closest("[data-yuktai-panel]")||fe(n)&&Array.from(n.options).forEach(s=>{s.text?.trim().length>3&&o(s.text.trim())})}),document.querySelectorAll("td, th").forEach(n=>{if(n.closest("[data-yuktai-panel]")||!fe(n))return;let s=n.innerText?.trim();s&&s.length>3&&o(s)});try{document.querySelectorAll("iframe").forEach(n=>{try{let s=n.contentDocument;if(!s)return;let l=s.body?.innerText?.trim();l&&l.length>20&&o(l.slice(0,500))}catch{}})}catch{}return document.querySelectorAll("a").forEach(n=>{if(n.closest("[data-yuktai-panel]")||!fe(n))return;let s=n.innerText?.trim();s&&s.length>3&&s.length<100&&o(s)}),e.join(" ").slice(0,5e3)}function Sr(e){let t=e.getAttribute("aria-label")?.trim();if(t)return t;let o=e.getAttribute("aria-labelledby");if(o){let l=document.getElementById(o);if(l)return l.innerText?.trim()||""}if(e.id){let l=document.querySelector(`label[for="${e.id}"]`);if(l)return l.innerText?.trim()||""}let r=e.closest("label");if(r){let l=r.cloneNode(!0);return l.querySelectorAll("input, select, textarea").forEach(d=>d.remove()),l.innerText?.trim()||""}if((e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement)&&e.placeholder)return e.placeholder;if(e.name)return e.name.replace(/[_-]/g," ");let i=e.previousSibling;if(i?.nodeType===Node.TEXT_NODE){let l=i.textContent?.trim();if(l&&l.length>1)return l}let a=e.previousElementSibling;if(a){let l=a.innerText?.trim();if(l&&l.length>1&&l.length<60)return l}let n=e.closest("td, th");if(n){let l=n.previousElementSibling;if(l){let d=l.innerText?.trim();if(d&&d.length>1)return d}}let s=e.getAttribute("title")?.trim();return s||(e instanceof HTMLInputElement?e.type:"field")}function nn(){let e=[],t=document.querySelectorAll(["input:not([type=hidden])","input:not([type=submit])","input:not([type=button])","input:not([type=reset])","input:not([type=image])","select","textarea","[contenteditable='true']","[role='textbox']","[role='combobox']","[role='spinbutton']","[role='searchbox']","[role='listbox']"].join(", "));for(let o of t){if(o.closest("[data-yuktai-panel]")||!fe(o))continue;if(o instanceof HTMLInputElement){let i=o.type.toLowerCase();if(["submit","button","reset","image"].includes(i))continue}let r=Sr(o);e.push({label:r,type:o instanceof HTMLInputElement?o.type:o.tagName.toLowerCase(),placeholder:(o instanceof HTMLInputElement||o instanceof HTMLTextAreaElement)&&o.placeholder||"",required:o.required||o.getAttribute("aria-required")==="true"||o.getAttribute("data-required")==="true",element:o})}return e}function rn(e,t=3e3){e.scrollIntoView({behavior:"smooth",block:"center"}),e.style.outline="3px solid #0d9488",e.style.outlineOffset="3px";try{e.focus()}catch{}setTimeout(()=>{e.style.outline="",e.style.outlineOffset=""},t)}function an(e){let t=e.toLowerCase(),o=document.querySelectorAll("h1, h2, h3, h4, h5, h6, section, article, [id], [aria-label], [role='heading'], [role='region']");for(let r of o){if(r.closest("[data-yuktai-panel]")||!fe(r))continue;if((r.innerText||r.getAttribute("id")||r.getAttribute("aria-label")||r.getAttribute("name")||"").toLowerCase().includes(t))return r.scrollIntoView({behavior:"smooth",block:"center"}),r.style.outline="2px solid #0d9488",r.style.outlineOffset="4px",setTimeout(()=>{r.style.outline="",r.style.outlineOffset=""},2500),!0}return!1}async function Tr(e,t,o){let r=window,i=r.LanguageModel||r.ai?.languageModel;if(!i)throw new Error("Gemini Nano not available");let a=await i.create({systemPrompt:`You are a helpful web accessibility agent.
Create a simple action plan to help a user complete a task on a webpage.
Rules:
- Maximum 5 steps
- Short and clear \u2014 no jargon
- If filling a form \u2014 list each field and what to enter
- No markdown \u2014 no asterisks, no bold, no headers
- Number each step: 1. 2. 3.`}),s=`Page content: ${e}${o?`
The page has form fields the user may need to fill.`:""}

User task: ${t}

Action plan:`,l=await a.prompt(s);return a.destroy(),l?.trim()||""}async function Ar(e,t){let{askPageWithTransformers:o}=await Promise.resolve().then(()=>(Fe(),It));return(await o(`How do I: ${t}`)).answer||"I could not create a plan for this task."}async function Cr(e,t,o){if(!e.trim())return{success:!1,steps:[],error:"Please tell me what you want to do."};if(!t)return{success:!1,steps:[],error:"No AI engine available on this device."};let r=[],i=(a,n="info")=>{let s={text:a,type:n};r.push(s),o(s)};try{i("\u{1F4D6} Reading page content...","info");let a=on(),n=nn(),s=n.length>0;a.length<50&&i("\u26A0\uFE0F Page content is very limited. This may be a static image page.","error"),i(s?`\u{1F4CB} Found ${n.length} form field${n.length!==1?"s":""} on this page`:"\u{1F4C4} No form fields found \u2014 this appears to be a content page","info"),i("\u{1F916} Creating action plan...","info");let l="";try{t==="gemini"?l=await Tr(a,e,s):l=await Ar(a,e)}catch{l=s?`1. Locate the form on this page
2. Fill each required field
3. Review your answers
4. Submit the form`:`1. Read the page carefully
2. Find the section relevant to your task
3. Follow the on-page instructions`}if(l&&(i("\u2705 Your action plan:","success"),l.split(/\n/).map(d=>d.replace(/\*\*/g,"").replace(/\*/g,"").trim()).filter(d=>d.length>5).slice(0,6).forEach(d=>i(`   ${d}`,"action"))),s){let d=n[0];i(`\u{1F3AF} First field: "${d.label}"${d.required?" \u2605 required":""}`,"field"),rn(d.element),n.length>1&&i(`\u{1F4DD} All ${n.length} fields: ${n.map(b=>b.label).join(" \u2192 ")}`,"info")}else{let d=e.toLowerCase().split(/\s+/).filter(y=>y.length>3),b=!1;for(let y of d)if(an(y)){i(`\u{1F3AF} Scrolled to relevant section: "${y}"`,"action"),b=!0;break}b||i("\u{1F4A1} Scroll through the page to find what you need.","info")}return i("\u2705 Ready. Follow the steps above. Ask me again if you need more help.","success"),{success:!0,steps:r}}catch(a){let n=a instanceof Error?a.message:"Agent error.";return i(`\u26A0\uFE0F ${n}`,"error"),{success:!1,steps:r,error:n}}}var ln=ke(()=>{"use strict";g()});var Yr={};Pe(Yr,{CheckIcon:()=>jt,ChevronLeftIcon:()=>Ot,ChevronRightIcon:()=>Dt,CloseIcon:()=>Yt,IconBase:()=>Z,Runtime:()=>me,SearchIcon:()=>Gt,SortDownIcon:()=>Ht,SortUpIcon:()=>Wt,YuktAI:()=>jr,YuktAIWrapper:()=>ot,YuktaiGrid:()=>pn,YuktaiGridAI:()=>rt,YuktaiGridAgent:()=>gn,YuktaiGridWebMCP:()=>Ft,aiPlugin:()=>Ge,countGrid:()=>at,default:()=>ot,getColumns:()=>st,getRow:()=>lt,highlightRows:()=>ct,openRow:()=>ut,searchGrid:()=>it,selectRow:()=>dt,useGrid:()=>fn,useYuktaiGridAgent:()=>$t,voicePlugin:()=>We,wcag:()=>ae,wcagPlugin:()=>ae});module.exports=Sn(Yr);g();g();g();function Xt(){let e=window;return e.Rewriter||e.ai?.rewriter||null}async function bt(){try{let e=Xt();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}async function Tn(e){if(!e||e.trim().length<20)return{success:!1,original:e,rewritten:e,error:"Text too short"};try{let t=Xt();if(!t)throw new Error("Rewriter API not available");let o=await t.create({tone:"more-casual",format:"plain-text",length:"as-is",outputLanguage:"en"}),r=await o.rewrite(e,{context:"Rewrite this text in simple plain English. Use short sentences. Avoid jargon. Make it easy to understand for everyone."});return o.destroy(),{success:!0,original:e,rewritten:r.trim()}}catch(t){return{success:!1,original:e,rewritten:e,error:t instanceof Error?t.message:"Rewrite failed"}}}async function Zt(){if(!await bt())return{fixed:0,error:"Chrome Built-in AI Rewriter not available. Enable via chrome://flags."};let t=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption"),o=0;for(let r of t){let i=r.innerText?.trim();if(!i||i.length<20||r.closest("[data-yuktai-panel]"))continue;let a=await Tn(i);a.success&&a.rewritten!==i&&(r.dataset.yuktaiOriginal=i,r.innerText=a.rewritten,o++)}return{fixed:o}}function Jt(){let e=document.querySelectorAll("[data-yuktai-original]");for(let t of e){let o=t.dataset.yuktaiOriginal;o&&(t.innerText=o,delete t.dataset.yuktaiOriginal)}}g();var Qt="yuktai-summary-box";function eo(){let e=window;return e.Summarizer||e.ai?.summarizer||null}async function ht(){try{let e=eo();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}function An(){let e=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, article, section"),t=[];for(let o of e){if(o.closest("[data-yuktai-panel]"))continue;let r=window.getComputedStyle(o);if(r.display==="none"||r.visibility==="hidden")continue;let i=o.innerText?.trim();i&&i.length>10&&t.push(i)}return t.join(" ").slice(0,5e3)}async function to(){if(!await ht())return{success:!1,summary:"",error:"Chrome Built-in AI Summarizer not available. Enable via chrome://flags."};let t=An();if(!t||t.length<100)return{success:!1,summary:"",error:"Not enough text on this page to summarise."};try{let o=eo();if(!o)throw new Error("Summarizer API not available");let r=await o.create({type:"tl;dr",format:"plain-text",length:"short",outputLanguage:"en"}),i=await r.summarize(t,{context:"Summarise this page in 2-3 simple sentences for a screen reader user who wants to know if this page is relevant to them."});return r.destroy(),Cn(i.trim()),{success:!0,summary:i.trim()}}catch(o){return{success:!1,summary:"",error:o instanceof Error?o.message:"Summary failed"}}}function Cn(e){Ue();let t=document.createElement("div");t.id=Qt,t.setAttribute("data-yuktai-panel","true"),t.setAttribute("role","region"),t.setAttribute("aria-label","Page summary by yuktai"),t.style.cssText=`
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
  `,r.addEventListener("click",Ue),t.appendChild(o),t.appendChild(r),document.body.prepend(t)}function Ue(){let e=document.getElementById(Qt);e&&e.remove()}g();var Xe=[{code:"en",label:"English"},{code:"hi",label:"Hindi"},{code:"es",label:"Spanish"},{code:"fr",label:"French"},{code:"de",label:"German"},{code:"it",label:"Italian"},{code:"pt",label:"Portuguese"},{code:"nl",label:"Dutch"},{code:"pl",label:"Polish"},{code:"ru",label:"Russian"},{code:"ja",label:"Japanese"},{code:"ko",label:"Korean"},{code:"zh",label:"Chinese"},{code:"ar",label:"Arabic"},{code:"tr",label:"Turkish"},{code:"vi",label:"Vietnamese"},{code:"bn",label:"Bengali"},{code:"id",label:"Indonesian"}],Ke="en";function En(){let e=window;return e.Translator||e.translation||null}async function Ln(e){try{let t=window;if(!En())return!1;if(t.Translator&&typeof t.Translator.availability=="function")try{let r=await t.Translator.availability({sourceLanguage:"en",targetLanguage:e});return r==="readily"||r==="available"||r==="downloadable"||r==="after-download"}catch{}return t.Translator&&typeof t.Translator.canTranslate=="function"?await t.Translator.canTranslate({sourceLanguage:"en",targetLanguage:e})!=="no":t.translation&&typeof t.translation.canTranslate=="function"?await t.translation.canTranslate({sourceLanguage:"en",targetLanguage:e})!=="no":!1}catch{return!1}}async function Rn(e){let t=window,o={sourceLanguage:"en",targetLanguage:e};if(t.Translator&&typeof t.Translator.create=="function")return await t.Translator.create(o);if(t.translation&&typeof t.translation.createTranslator=="function")return await t.translation.createTranslator(o);throw new Error("Translation API not available")}async function oo(e){if(e===Ke)return{success:!0,language:e,fixed:0};if(e==="en")return yt(),Ke="en",{success:!0,language:"en",fixed:0};if(!await Ln(e))return{success:!1,language:e,fixed:0,error:`Translation to ${e} not available. Enable via chrome://flags.`};try{let o=await Rn(e),r=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption, span, a"),i=0;for(let a of r){if(a.closest("[data-yuktai-panel]")||a.children.length>0)continue;let n=a.innerText?.trim();if(!n||n.length<2)continue;a.dataset.yuktaiTranslationOriginal||(a.dataset.yuktaiTranslationOriginal=n);let s=await o.translate(n);s&&s!==n&&(a.innerText=s,i++)}return typeof o.destroy=="function"&&o.destroy(),Ke=e,{success:!0,language:e,fixed:i}}catch(o){return{success:!1,language:e,fixed:0,error:o instanceof Error?o.message:"Translation failed"}}}function yt(){let e=document.querySelectorAll("[data-yuktai-translation-original]");for(let t of e){let o=t.dataset.yuktaiTranslationOriginal;o&&(t.innerText=o,delete t.dataset.yuktaiTranslationOriginal)}Ke="en"}g();var In=[{phrases:["go to main","skip to main","main content"],action:"focus-main",label:"Jump to main content"},{phrases:["go to navigation","go to nav","open menu"],action:"focus-nav",label:"Jump to navigation"},{phrases:["go to search","search","find"],action:"focus-search",label:"Jump to search"},{phrases:["scroll down","page down","next"],action:"scroll-down",label:"Scroll down"},{phrases:["scroll up","page up","back up"],action:"scroll-up",label:"Scroll up"},{phrases:["go back","previous page"],action:"go-back",label:"Go back"},{phrases:["click","press","select"],action:"click-focused",label:"Click focused element"},{phrases:["next item","tab forward","tab"],action:"tab-forward",label:"Move to next element"},{phrases:["previous item","tab back","shift tab"],action:"tab-back",label:"Move to previous element"},{phrases:["stop listening","stop voice","quiet"],action:"stop-voice",label:"Stop voice control"}],se=null,Ze=!1,Se=null;function xt(){return!!(window.SpeechRecognition||window.webkitSpeechRecognition)}function Mn(e){let t=e.toLowerCase().trim();for(let o of In)for(let r of o.phrases)if(t.includes(r))return{action:o.action,label:o.label};return null}function Pn(e){switch(e){case"focus-main":{let t=document.querySelector("main, [role='main'], #main");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-nav":{let t=document.querySelector("nav, [role='navigation']");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-search":{let t=document.querySelector("input[type='search'], input[role='searchbox'], [aria-label*='search' i]");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"scroll-down":{window.scrollBy({top:400,behavior:"smooth"});break}case"scroll-up":{window.scrollBy({top:-400,behavior:"smooth"});break}case"go-back":{window.history.back();break}case"click-focused":{let t=document.activeElement;t&&t!==document.body&&t.click();break}case"tab-forward":{let t=no(),o=t.indexOf(document.activeElement),r=t[o+1]||t[0];r&&r.focus();break}case"tab-back":{let t=no(),o=t.indexOf(document.activeElement),r=t[o-1]||t[t.length-1];r&&r.focus();break}case"stop-voice":{vt();break}}}function no(){return Array.from(document.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(e=>!e.closest("[data-yuktai-panel]"))}function ro(e){if(!xt())return!1;if(Ze)return!0;e&&(Se=e);let t=window.SpeechRecognition||window.webkitSpeechRecognition;return se=new t,se.continuous=!0,se.interimResults=!1,se.lang="en-US",se.onresult=o=>{let r=o.results[o.results.length-1][0].transcript,i=Mn(r);if(i){Pn(i.action);let a={success:!0,command:r,action:i.label};if(Se&&Se(a),i.action==="stop-voice")return}},se.onend=()=>{Ze&&se?.start()},se.onerror=o=>{o.error!=="no-speech"&&Se&&Se({success:!1,command:"",action:"",error:`Voice error: ${o.error}`})},se.start(),Ze=!0,Nn(),!0}function vt(){Ze=!1,se&&(se.stop(),se=null),Se=null,ao()}var io="yuktai-voice-indicator";function Nn(){ao();let e=document.createElement("div");e.id=io,e.setAttribute("data-yuktai-panel","true"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-label","yuktai voice control is listening"),e.style.cssText=`
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
    `,document.head.appendChild(r)}let o=document.createElement("span");o.textContent="Listening for commands...",e.appendChild(t),e.appendChild(o),document.body.appendChild(e)}function ao(){let e=document.getElementById(io);e&&e.remove()}g();var zn=["button:not([aria-label]):not([aria-labelledby])","a:not([aria-label]):not([aria-labelledby])","input:not([aria-label]):not([aria-labelledby]):not([id])","select:not([aria-label]):not([aria-labelledby])","textarea:not([aria-label]):not([aria-labelledby])","[role='button']:not([aria-label])","[role='link']:not([aria-label])","[role='checkbox']:not([aria-label])","[role='tab']:not([aria-label])"].join(", ");function so(){let e=window;return e.Writer||e.ai?.writer||null}async function wt(){try{let e=so();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}function Fn(e){let t=[],o=e.innerText?.trim();o&&t.push(`element text: "${o}"`);let r=e.placeholder?.trim();r&&t.push(`placeholder: "${r}"`);let i=e.getAttribute("name")?.trim();i&&t.push(`name: "${i}"`);let a=e.getAttribute("type")?.trim();a&&t.push(`type: "${a}"`);let n=e.id;if(n){let d=document.querySelector(`label[for="${n}"]`);d&&t.push(`label: "${d.innerText?.trim()}"`)}let s=e.parentElement?.innerText?.trim().slice(0,60);s&&t.push(`parent context: "${s}"`),t.push(`tag: ${e.tagName.toLowerCase()}`);let l=e.getAttribute("role");return l&&t.push(`role: ${l}`),t.join(". ")}async function $n(e,t){let o=`
    Generate a short, clear aria-label for an HTML element.
    The label must be 2-6 words maximum.
    The label must describe what the element does or what it is.
    Do not include punctuation.
    Do not explain \u2014 just output the label text only.

    Element details:
    ${t}

    Output only the label. Nothing else.
  `.trim();return(await e.write(o)).trim().replace(/^["']|["']$/g,"").replace(/\.$/,"").trim()}async function lo(){if(!await wt())return{success:!1,fixed:0,elements:[],error:"Chrome Built-in AI Writer not available. Enable via chrome://flags."};let t=document.querySelectorAll(zn);if(t.length===0)return{success:!0,fixed:0,elements:[]};try{let o=so();if(!o)throw new Error("Writer API not available");let r=await o.create({tone:"neutral",format:"plain-text",length:"short",outputLanguage:"en"}),i=0,a=[];for(let n of t){if(n.closest("[data-yuktai-panel]"))continue;let s=window.getComputedStyle(n);if(s.display==="none"||s.visibility==="hidden")continue;let l=Fn(n),d=await $n(r,l);d&&d.length>0&&(n.dataset.yuktaiLabelOriginal=n.getAttribute("aria-label")||"",n.setAttribute("aria-label",d),i++,a.push({tag:n.tagName.toLowerCase(),label:d}))}return r.destroy(),{success:!0,fixed:i,elements:a}}catch(o){return{success:!1,fixed:0,elements:[],error:o instanceof Error?o.message:"Label generation failed"}}}function co(){let e=document.querySelectorAll("[data-yuktai-label-original]");for(let t of e){let o=t.dataset.yuktaiLabelOriginal;o?t.setAttribute("aria-label",o):t.removeAttribute("aria-label"),delete t.dataset.yuktaiLabelOriginal}}var et=null,uo=null;var po=null,kt=null,V=null,Te=null,Je=null,St=null,Ae=null,Qe={deuteranopia:"yuktai-cb-d",protanopia:"yuktai-cb-p",tritanopia:"yuktai-cb-t"};var fo=new Set(["input","select","textarea"]);var Tt={nav:"navigation",header:"banner",footer:"contentinfo",main:"main",aside:"complementary"};function At(e,t="polite"){if(typeof window>"u"||!Ae?.speechEnabled||!window.speechSynthesis)return;window.speechSynthesis.cancel();let o=new SpeechSynthesisUtterance(e);o.rate=1,o.pitch=1,o.volume=1;let r=window.speechSynthesis.getVoices();r.length>0&&(o.voice=r[0]),window.speechSynthesis.speak(o)}function vo(e,t="info"){if(typeof document>"u")return;let r={success:{bg:"#0f9d58",border:"#0a7a44",icon:"\u2713"},error:{bg:"#d93025",border:"#b52a1c",icon:"\u2715"},warning:{bg:"#f29900",border:"#c67c00",icon:"\u26A0"},info:{bg:"#1a73e8",border:"#1557b0",icon:"\u2139"}}[t];V||(V=document.createElement("div"),V.setAttribute("role","alert"),V.setAttribute("aria-live","assertive"),V.setAttribute("aria-atomic","true"),V.style.cssText=`
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
    `,document.body.appendChild(V)),V.style.background=r.bg,V.style.border=`1px solid ${r.border}`,V.style.color="#fff",V.innerHTML=`
    <span style="font-size:18px;font-weight:700">${r.icon}</span>
    <span style="flex:1;line-height:1.4">${e}</span>
    <button
      onclick="this.parentElement.style.transform='translateX(120%)';this.parentElement.style.opacity='0'"
      style="background:none;border:none;color:#fff;cursor:pointer;font-size:18px;padding:0;line-height:1"
      aria-label="Close notification">\xD7</button>
  `,window.innerWidth<=480&&(V.style.right="8px",V.style.left="8px",V.style.maxWidth="none",V.style.width="auto"),requestAnimationFrame(()=>{V&&(V.style.transform="translateX(0)",V.style.opacity="1")}),setTimeout(()=>{V&&(V.style.transform="translateX(120%)",V.style.opacity="0")},5e3)}function H(e,t="info",o=!0){et&&(et.textContent=e),vo(e,t),o&&At(e,t==="error"?"assertive":"polite")}function Gn(){if(typeof document>"u"||po)return;let e=[{label:"Skip to main content",selector:"main,[role='main'],#main,#main-content"},{label:"Skip to navigation",selector:"nav,[role='navigation'],#nav,#navigation"},{label:"Skip to search",selector:"[role='search'],#search,input[type='search']"}],t=document.createElement("div");t.setAttribute("data-yuktai-skip-bar","true"),t.setAttribute("role","navigation"),t.setAttribute("aria-label","Skip links"),t.style.cssText=`
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
  `;let o=!1;if(e.forEach(({label:i,selector:a})=>{let n=document.querySelector(a);if(!n)return;o=!0,n.getAttribute("tabindex")||n.setAttribute("tabindex","-1");let s=document.createElement("a");s.href="#",s.textContent=i,s.style.cssText=`
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
    `,s.addEventListener("focus",()=>{t.style.transform="translateY(0)"}),s.addEventListener("blur",()=>{setTimeout(()=>{t.matches(":focus-within")||(t.style.transform="translateY(-100%)")},2e3)}),s.addEventListener("click",l=>{l.preventDefault(),n.focus(),n.scrollIntoView({behavior:"smooth",block:"start"}),H(`Jumped to ${i.replace("Skip to ","")}`,"info"),t.style.transform="translateY(-100%)"}),t.appendChild(s)}),!o)return;window.innerWidth<768&&(t.style.transform="translateY(0)",t.style.position="sticky"),window.addEventListener("resize",()=>{window.innerWidth<768&&(t.style.transform="translateY(0)")}),document.body.insertBefore(t,document.body.firstChild),po=t}function Wn(){if(typeof document>"u"||document.querySelector("[data-yuktai-focus-style]"))return;let e=document.createElement("style");e.setAttribute("data-yuktai-focus-style","true"),e.textContent=`

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
  `,document.head.appendChild(e),document.documentElement.setAttribute("data-yuktai-a11y","true")}function Hn(){typeof document>"u"||document.querySelector("[data-yuktai-kb-init]")||(document.documentElement.setAttribute("data-yuktai-kb-init","true"),document.addEventListener("keydown",e=>{let t=document.activeElement;if(!t)return;let o=t.getAttribute("role")||"";if(e.key==="Escape"){let r=t.closest("[role='dialog'],[role='alertdialog']");if(r){r.style.display="none",H("Dialog closed","info");return}let i=t.closest("[role='menu'],[role='menubar']");i&&(i.style.display="none",H("Menu closed","info"))}if(o==="menuitem"||t.closest("[role='menu'],[role='menubar']")){let r=t.closest("[role='menu'],[role='menubar']");if(!r)return;let i=Array.from(r.querySelectorAll("[role='menuitem']:not([disabled])")),a=i.indexOf(t);e.key==="ArrowDown"||e.key==="ArrowRight"?(e.preventDefault(),i[(a+1)%i.length]?.focus()):e.key==="ArrowUp"||e.key==="ArrowLeft"?(e.preventDefault(),i[(a-1+i.length)%i.length]?.focus()):e.key==="Home"?(e.preventDefault(),i[0]?.focus()):e.key==="End"&&(e.preventDefault(),i[i.length-1]?.focus())}if(o==="tab"||t.closest("[role='tablist']")){let r=t.closest("[role='tablist']");if(!r)return;let i=Array.from(r.querySelectorAll("[role='tab']:not([disabled])")),a=i.indexOf(t);if(e.key==="ArrowRight"||e.key==="ArrowDown"){e.preventDefault();let n=i[(a+1)%i.length];n?.focus(),n?.click()}else if(e.key==="ArrowLeft"||e.key==="ArrowUp"){e.preventDefault();let n=i[(a-1+i.length)%i.length];n?.focus(),n?.click()}}if(o==="option"||t.closest("[role='listbox']")){let r=t.closest("[role='listbox']");if(!r)return;let i=Array.from(r.querySelectorAll("[role='option']:not([aria-disabled='true'])")),a=i.indexOf(t);e.key==="ArrowDown"?(e.preventDefault(),i[(a+1)%i.length]?.focus()):e.key==="ArrowUp"?(e.preventDefault(),i[(a-1+i.length)%i.length]?.focus()):(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),t.setAttribute("aria-selected","true"),i.forEach(n=>{n!==t&&n.setAttribute("aria-selected","false")}),H(`Selected: ${t.textContent?.trim()}`,"success"))}e.altKey&&e.key==="a"&&(e.preventDefault(),Bn()),e.key==="Tab"&&Ae?.speechEnabled&&setTimeout(()=>{let r=document.activeElement;if(!r)return;let i=r.getAttribute("aria-label")||r.getAttribute("title")||r.textContent?.trim()||r.tagName.toLowerCase(),a=r.getAttribute("role")||r.tagName.toLowerCase();At(`${i}, ${a}`)},100)}))}function tt(e){let t=e.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[role="button"]');if(t.length===0)return;let o=t[0],r=t[t.length-1];o.focus(),e.addEventListener("keydown",i=>{i.key==="Tab"&&(i.shiftKey?document.activeElement===o&&(i.preventDefault(),r.focus()):document.activeElement===r&&(i.preventDefault(),o.focus()))})}function Bn(){if(typeof document>"u")return;if(Te){Te.remove(),Te=null;return}let e=document.createElement("div");e.setAttribute("role","dialog"),e.setAttribute("aria-label","Keyboard shortcuts"),e.setAttribute("aria-modal","true"),e.setAttribute("data-yuktai-cheatsheet","true"),e.style.cssText=`
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
  `,e.querySelector("[data-yuktai-close]")?.addEventListener("click",()=>{e.remove(),Te=null}),e.addEventListener("keydown",r=>{r.key==="Escape"&&(e.remove(),Te=null)}),document.body.appendChild(e),Te=e,tt(e),H("Keyboard shortcuts opened. Press Escape to close.","info")}function On(e){if(typeof document>"u"||!Ae?.showAuditBadge||typeof window<"u"&&!window.location.hostname.includes("localhost")&&!window.location.hostname.includes("127.0.0.1"))return;kt&&kt.remove();let t=e.score,o=t>=90?"#0f9d58":t>=70?"#f29900":"#d93025",r=t>=90?"\u267F":t>=70?"\u26A0":"\u2715",i=document.createElement("button");i.setAttribute("aria-label",`Accessibility score: ${t} out of 100`),i.setAttribute("data-yuktai-badge","true"),i.style.cssText=`
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
  `,i.innerHTML=`${r} ${t}/100 <span style="font-weight:400;opacity:0.85">${e.details.length} issues</span>`,i.addEventListener("click",()=>_n(e)),document.body.appendChild(i),kt=i}function _n(e){let t=document.querySelector("[data-yuktai-audit-details]");if(t){t.remove();return}let o=document.createElement("div");o.setAttribute("data-yuktai-audit-details","true"),o.setAttribute("role","dialog"),o.setAttribute("aria-label","Accessibility audit details"),o.style.cssText=`
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
  `,o.addEventListener("keydown",i=>{i.key==="Escape"&&o.remove()}),document.body.appendChild(o),tt(o)}function wo(e){typeof document>"u"||(St&&clearTimeout(St),St=setTimeout(()=>{if(Je)return;let t=document.createElement("div");t.setAttribute("role","alertdialog"),t.setAttribute("aria-label","Session timeout warning"),t.setAttribute("aria-modal","true"),t.setAttribute("data-yuktai-timeout","true"),t.style.cssText=`
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
    `;let o=t.querySelector("[data-yuktai-extend]"),r=t.querySelector("[data-yuktai-dismiss]");o?.addEventListener("click",()=>{t.remove(),Je=null,H("Session extended. You have more time.","success"),Ae?.timeoutWarning&&wo(Ae.timeoutWarning)}),r?.addEventListener("click",()=>{t.remove(),Je=null}),document.body.appendChild(t),Je=t,tt(t),H("Warning: Your session will expire soon. Do you need more time?","warning")},e*1e3))}function Dn(e){if(typeof document>"u")return;let t=document.documentElement;if(t.toggleAttribute("data-yuktai-high-contrast",!!e.highContrast),t.toggleAttribute("data-yuktai-dark",!!e.darkMode),t.toggleAttribute("data-yuktai-reduce-motion",!!e.reduceMotion),t.toggleAttribute("data-yuktai-large-targets",!!e.largeTargets),t.toggleAttribute("data-yuktai-keyboard",!!e.keyboardHints),t.toggleAttribute("data-yuktai-dyslexia",!!e.dyslexiaFont),e.localFont?document.body.style.fontFamily=`"${e.localFont}", system-ui, sans-serif`:e.dyslexiaFont||(document.body.style.fontFamily=""),e.fontSizeMultiplier&&e.fontSizeMultiplier!==1?document.documentElement.style.fontSize=`${e.fontSizeMultiplier*100}%`:document.documentElement.style.fontSize="",e.colorBlindMode&&e.colorBlindMode!=="none"){let o=e.colorBlindMode==="achromatopsia"?"grayscale(100%)":`url(#${Qe[e.colorBlindMode]})`;document.body.style.filter=o}else document.body.style.filter=""}function qn(e){try{let t=localStorage.getItem("yuktai-a11y-prefs");t&&Object.assign(e,JSON.parse(t))}catch{}}async function mo(e){if(e){if(!await bt()){H("Plain English requires Chrome 127+","warning");return}H("Rewriting page in plain English...","info",!1);let o=await Zt();H(o.error?`Plain English failed: ${o.error}`:`${o.fixed} sections rewritten in plain English`,o.error?"error":"success",!1)}else Jt(),H("Original text restored","info",!1)}async function go(e){if(e){if(!await ht()){H("Page summariser requires Chrome 127+","warning");return}H("Generating page summary...","info",!1);let o=await to();H(o.error?`Summary failed: ${o.error}`:"Page summary added at top",o.error?"error":"success",!1)}else Ue(),H("Page summary removed","info",!1)}async function bo(e){if(e==="en"){yt(),H("Page restored to English","info",!1);return}H(`Translating page to ${e}...`,"info",!1);let t=await oo(e);H(t.error?`Translation failed: ${t.error}`:`Page translated to ${e}`,t.error?"error":"success",!1)}async function ho(e){if(e){if(!xt()){H("Voice control not supported in this browser","warning");return}ro(t=>{t.success&&H(`Voice: ${t.action}`,"info",!1)}),H("Voice control started. Say a command.","success",!1)}else vt(),H("Voice control stopped","info",!1)}async function yo(e){if(e){if(!await wt()){H("Smart labels requires Chrome 127+","warning");return}H("Generating smart labels...","info",!1);let o=await lo();H(o.error?`Smart labels failed: ${o.error}`:`${o.fixed} elements labelled`,o.error?"error":"success",!1)}else co(),H("Smart labels removed","info",!1)}function jn(){if(typeof document>"u"||et)return;let e=document.createElement("div");e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e.setAttribute("aria-relevant","text"),e.style.cssText="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);",document.body.appendChild(e),et=e}function Yn(){if(typeof document>"u"||uo)return;let e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("aria-hidden","true"),e.style.cssText="position:absolute;width:0;height:0;overflow:hidden;",e.innerHTML=`
    <defs>
      <filter id="${Qe.deuteranopia}">
        <feColorMatrix type="matrix"
          values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${Qe.protanopia}">
        <feColorMatrix type="matrix"
          values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${Qe.tritanopia}">
        <feColorMatrix type="matrix"
          values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"/>
      </filter>
    </defs>
  `,document.body.appendChild(e),uo=e}function xo(e){let t={critical:20,serious:10,moderate:5,minor:2},o=e.details.reduce((r,i)=>r+(t[i.severity]||0),0);return Math.max(0,Math.min(100,100-o))}var ae={name:"yuktai-a11y",version:"4.0.0",observer:null,async execute(e){if(!e.enabled)return this.stopObserver(),"yuktai: disabled.";Ae=e,qn(e),jn(),Yn(),Wn(),Hn(),e.showSkipLinks!==!1&&Gn(),e.showPreferencePanel,Dn(e);let t=this.applyFixes(e);t.score=xo(t),e.showAuditBadge&&On(t),e.timeoutWarning&&wo(e.timeoutWarning),e.autoFix&&this.startObserver(e),e.plainEnglish&&await mo(!0),e.summarisePage&&await go(!0),e.translateLanguage&&e.translateLanguage!=="en"&&await bo(e.translateLanguage),e.voiceControl&&await ho(!0),e.smartLabels&&await yo(!0);let o=`${t.fixed} fixes applied. Score: ${t.score}/100.`;return H(o,t.score>=90?"success":"info",!1),`yuktai v4.0.0: ${o} Scanned ${t.scanned} elements in ${t.renderTime}ms.`},applyFixes(e){let t={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return t;let o=performance.now(),r=document.querySelectorAll("*");t.scanned=r.length;let i=(a,n,s,l)=>{t.details.push({tag:a,fix:n,severity:s,element:l.outerHTML.slice(0,100)}),t.fixed++};return r.forEach(a=>{let n=a,s=n.tagName.toLowerCase();if(s==="html"&&!n.getAttribute("lang")&&(n.setAttribute("lang","en"),i(s,'lang="en" added',"critical",n)),s==="meta"){let d=n.getAttribute("name"),b=n.getAttribute("content")||"";d==="viewport"&&b.includes("user-scalable=no")&&(n.setAttribute("content",b.replace("user-scalable=no","user-scalable=yes")),i(s,"user-scalable=yes restored","serious",n)),d==="viewport"&&/maximum-scale=1(?:[^0-9]|$)/.test(b)&&(n.setAttribute("content",b.replace(/maximum-scale=1(?=[^0-9]|$)/,"maximum-scale=5")),i(s,"maximum-scale=5 restored","serious",n))}if(s==="main"&&!n.getAttribute("tabindex")&&(n.setAttribute("tabindex","-1"),n.getAttribute("id")||n.setAttribute("id","main-content")),s==="img"&&(n.hasAttribute("alt")||(n.setAttribute("alt",""),n.setAttribute("aria-hidden","true"),i(s,'alt="" aria-hidden="true"',"serious",n))),s==="svg"&&(!n.getAttribute("aria-hidden")&&!n.getAttribute("aria-label")&&!a.querySelector("title")&&(n.setAttribute("aria-hidden","true"),i(s,'aria-hidden="true" (decorative svg)',"minor",n)),n.getAttribute("focusable")||n.setAttribute("focusable","false")),s==="iframe"&&!n.getAttribute("title")&&!n.getAttribute("aria-label")&&(n.setAttribute("title","embedded content"),n.setAttribute("aria-label","embedded content"),i(s,"title + aria-label added","serious",n)),s==="button"){if(!n.innerText?.trim()&&!n.getAttribute("aria-label")){let d=n.getAttribute("title")||"button";n.setAttribute("aria-label",d),i(s,`aria-label="${d}" (empty button)`,"critical",n)}n.hasAttribute("disabled")&&!n.getAttribute("aria-disabled")&&(n.setAttribute("aria-disabled","true"),t.fixed++)}if(s==="a"){let d=n;!n.innerText?.trim()&&!n.getAttribute("aria-label")&&(n.setAttribute("aria-label",n.getAttribute("title")||"link"),i(s,"aria-label added (empty link)","critical",n)),d.target==="_blank"&&!d.rel?.includes("noopener")&&(d.rel="noopener noreferrer",t.fixed++)}if(fo.has(s)){let d=n;if(!n.getAttribute("aria-label")&&!n.getAttribute("aria-labelledby")){let b=n.getAttribute("placeholder")||n.getAttribute("name")||s;n.setAttribute("aria-label",b),i(s,`aria-label="${b}"`,"serious",n)}if(n.hasAttribute("required")&&!n.getAttribute("aria-required")&&(n.setAttribute("aria-required","true"),t.fixed++),s==="input"&&!d.autocomplete){let b=d.name||"";d.type==="email"||b.includes("email")?d.autocomplete="email":d.type==="tel"||b.includes("tel")?d.autocomplete="tel":d.type==="password"&&(d.autocomplete="current-password"),t.fixed++}}s==="th"&&!n.getAttribute("scope")&&(n.setAttribute("scope",n.closest("thead")?"col":"row"),i(s,"scope added to <th>","moderate",n)),Tt[s]&&!n.getAttribute("role")&&(n.setAttribute("role",Tt[s]),i(s,`role="${Tt[s]}"`,"minor",n));let l=n.getAttribute("role")||"";l==="tab"&&!n.getAttribute("aria-selected")&&(n.setAttribute("aria-selected","false"),t.fixed++),["alert","status","log"].includes(l)&&!n.getAttribute("aria-live")&&(n.setAttribute("aria-live",l==="alert"?"assertive":"polite"),i(s,`aria-live added on role=${l}`,"moderate",n)),l==="combobox"&&!n.getAttribute("aria-expanded")&&(n.setAttribute("aria-expanded","false"),i(s,'aria-expanded="false" on combobox',"serious",n)),(l==="checkbox"||l==="radio")&&!n.getAttribute("aria-checked")&&(n.setAttribute("aria-checked","false"),i(s,`aria-checked="false" on role=${l}`,"serious",n))}),t.renderTime=parseFloat((performance.now()-o).toFixed(2)),t},scan(){let e={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return e;let t=performance.now(),o=document.querySelectorAll("*");e.scanned=o.length;let r=(i,a,n,s)=>e.details.push({tag:i,fix:a,severity:n,element:s.outerHTML.slice(0,100)});return o.forEach(i=>{let a=i,n=a.tagName.toLowerCase();(n==="a"||n==="button")&&!a.innerText?.trim()&&!a.getAttribute("aria-label")&&r(n,"needs aria-label (empty)","critical",a),n==="img"&&!a.hasAttribute("alt")&&r(n,"needs alt text","serious",a),fo.has(n)&&!a.getAttribute("aria-label")&&!a.getAttribute("aria-labelledby")&&r(n,"needs aria-label","serious",a),n==="iframe"&&!a.getAttribute("title")&&!a.getAttribute("aria-label")&&r(n,"iframe needs title","serious",a)}),e.fixed=e.details.length,e.score=xo(e),e.renderTime=parseFloat((performance.now()-t).toFixed(2)),e},startObserver(e){this.observer||typeof document>"u"||(this.observer=new MutationObserver(()=>this.applyFixes(e)),this.observer.observe(document.body,{childList:!0,subtree:!0,attributes:!1}))},stopObserver(){this.observer?.disconnect(),this.observer=null},announce:H,speak:At,showVisualAlert:vo,trapFocus:tt,handlePlainEnglish:mo,handleSummarisePage:go,handleTranslate:bo,handleVoiceControl:ho,handleSmartLabels:yo,SUPPORTED_LANGUAGES:Xe};g();g();var R=gt(require("react"));g();var oe=require("react");Et();Fe();var c=require("react/jsx-runtime"),Mt={highContrast:!1,reduceMotion:!1,autoFix:!0,dyslexiaFont:!1,fontScale:100,localFont:"",darkMode:!1,largeTargets:!1,speechEnabled:!1,colorBlindMode:"none",showAuditBadge:!1,timeoutWarning:void 0,plainEnglish:!1,summarisePage:!1,translateLanguage:"en",voiceControl:!1,smartLabels:!1},Ee=[80,90,100,110,120,130],or=[{value:"none",label:"None"},{value:"deuteranopia",label:"Deuteranopia"},{value:"protanopia",label:"Protanopia"},{value:"tritanopia",label:"Tritanopia"},{value:"achromatopsia",label:"Greyscale"}],nr=["Prompt API for Gemini Nano","Summarization API for Gemini Nano","Writer API for Gemini Nano","Rewriter API for Gemini Nano","Translation API"];function rr(){let[e,t]=(0,oe.useState)(typeof window<"u"?window.innerWidth:1024);return(0,oe.useEffect)(()=>{let o=()=>t(window.innerWidth);return window.addEventListener("resize",o),()=>window.removeEventListener("resize",o)},[]),{isMobile:e<=480,isTablet:e>480&&e<=768}}function ir({checked:e,onChange:t,label:o,disabled:r=!1}){return(0,c.jsxs)("label",{"aria-label":o,style:{position:"relative",display:"inline-flex",width:"40px",height:"24px",cursor:r?"not-allowed":"pointer",flexShrink:0,opacity:r?.4:1},children:[(0,c.jsx)("input",{type:"checkbox",checked:e,disabled:r,onChange:i=>t(i.target.checked),style:{opacity:0,width:0,height:0,position:"absolute"}}),(0,c.jsx)("span",{style:{position:"absolute",inset:0,borderRadius:"99px",background:e?"#0d9488":"#cbd5e1",transition:"background 0.2s"}}),(0,c.jsx)("span",{style:{position:"absolute",top:"3px",left:e?"19px":"3px",width:"18px",height:"18px",background:"#fff",borderRadius:"50%",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)",pointerEvents:"none"}})]})}function Le({label:e,color:t="#64748b",badge:o,concept:r}){return(0,c.jsxs)("div",{style:{margin:"10px 18px 4px"},children:[(0,c.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[(0,c.jsx)("p",{style:{margin:0,fontSize:"10px",fontWeight:600,color:t,letterSpacing:"0.06em",textTransform:"uppercase"},children:e}),o&&(0,c.jsx)("span",{style:{fontSize:"9px",fontWeight:500,padding:"1px 7px",borderRadius:"99px",background:"#f5f3ff",color:"#7c3aed",border:"0.5px solid #c4b5fd",whiteSpace:"nowrap"},children:o})]}),r&&(0,c.jsx)("p",{style:{margin:"2px 0 0",fontSize:"9px",color:"#94a3b8",fontStyle:"italic"},children:r})]})}function de({icon:e,label:t,desc:o,checked:r,onChange:i,disabled:a=!1,disabledReason:n,tip:s}){return(0,c.jsxs)("div",{title:a?n:s,style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 18px",gap:"12px"},children:[(0,c.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"10px",flex:1,minWidth:0},children:[(0,c.jsx)("span",{"aria-hidden":"true",style:{width:"32px",height:"32px",borderRadius:"8px",background:a?"#f1f5f9":"#f0fdfa",color:a?"#94a3b8":"#0d9488",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"15px",flexShrink:0,fontWeight:700},children:e}),(0,c.jsxs)("div",{style:{minWidth:0},children:[(0,c.jsx)("p",{style:{margin:0,fontSize:"13px",fontWeight:500,color:a?"#94a3b8":"#0f172a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:t}),(0,c.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#94a3b8"},children:a?n:o})]})]}),(0,c.jsx)(ir,{checked:r,onChange:i,label:`Toggle ${t}`,disabled:a})]})}function te(){return(0,c.jsx)("div",{style:{height:"1px",background:"#f1f5f9"}})}function $e({steps:e}){return(0,c.jsxs)("div",{style:{margin:"0 18px 8px",padding:"8px 10px",background:"#f8fafc",borderRadius:"8px",border:"0.5px solid #e2e8f0"},children:[(0,c.jsx)("p",{style:{margin:"0 0 4px",fontSize:"9px",fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.05em"},children:"How to use"}),e.map((t,o)=>(0,c.jsxs)("p",{style:{margin:"0 0 2px",fontSize:"10px",color:"#475569"},children:[o+1,". ",t]},o))]})}var Pt=(0,oe.forwardRef)(({position:e,settings:t,report:o,isActive:r,aiSupported:i,voiceSupported:a,set:n,onApply:s,onReset:l,onClose:d},b)=>{let{isMobile:y,isTablet:M}=rr(),[_,U]=(0,oe.useState)([]),[F,L]=(0,oe.useState)(""),[N,v]=(0,oe.useState)(""),[T,z]=(0,oe.useState)(!1),[k,m]=(0,oe.useState)(null),[A,$]=(0,oe.useState)("idle");(0,oe.useEffect)(()=>{let p=window;!!(p.LanguageModel||p.ai?.languageModel)&&i?m("gemini"):Ne()&&m("transformers")},[i]),(0,oe.useEffect)(()=>{if(k!=="transformers")return;let p=setInterval(()=>{$(ze())},500);return()=>clearInterval(p)},[k]);let B=async()=>{if(!(!F.trim()||T)){if(!k){v("\u26A0\uFE0F No AI engine available on this device.");return}z(!0),v("");try{let p;k==="gemini"?p=await Ct(F):($("loading"),p=await Rt(F),$("ready")),v(p.success&&p.answer?p.answer.replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/#+\s/g,"").trim():"\u26A0\uFE0F "+(p.error||"No answer found on this page"))}catch{v("\u26A0\uFE0F Failed to get answer. Please try again.")}z(!1)}};(0,oe.useEffect)(()=>{(async()=>{try{let D=window;if(!D.queryLocalFonts)return;let q=await D.queryLocalFonts(),j=[...new Set(q.map(O=>O.family))].sort();U(j.slice(0,50))}catch{}})()},[]);let P=k==="gemini"?"Gemini Nano":k==="transformers"?"Transformers.js \xB7 All devices":"Detecting...",re=k==="transformers"&&A==="loading"?"Loading AI model... (first time only)":"...",G=y?{position:"fixed",bottom:0,left:0,right:0,zIndex:9999,background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px 16px 0 0",boxShadow:"0 -8px 32px rgba(0,0,0,0.12)",maxHeight:"90vh",overflowY:"auto",fontFamily:"system-ui,-apple-system,sans-serif",width:"100%"}:{position:"fixed",bottom:"84px",[e]:"24px",zIndex:9999,width:M?"300px":"320px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",maxHeight:"80vh",overflowY:"auto",fontFamily:"system-ui,-apple-system,sans-serif"};return(0,c.jsxs)("div",{ref:b,role:"dialog","aria-modal":"true","aria-label":"yuktai accessibility preferences","data-yuktai-panel":"true",style:G,children:[(0,c.jsxs)("div",{style:{padding:"14px 18px 12px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"flex-start",justifyContent:"space-between",position:"sticky",top:0,background:"#fff",zIndex:1},children:[(0,c.jsxs)("div",{children:[(0,c.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"7px",marginBottom:"4px",flexWrap:"wrap"},children:[(0,c.jsx)("span",{style:{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0d9488",letterSpacing:"0.05em",fontFamily:"monospace"},children:"@yuktishaalaa/yuktai"}),r&&(0,c.jsx)("span",{style:{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0f766e",border:"1px solid #99f6e4"},children:"\u25CF ACTIVE"})]}),(0,c.jsx)("p",{style:{margin:"0 0 1px",fontSize:"15px",fontWeight:600,color:"#0f172a"},children:"Accessibility"}),(0,c.jsx)("p",{style:{margin:0,fontSize:"11px",color:"#64748b"},children:"WCAG 2.2 \xB7 Open source \xB7 Zero cost \xB7 All devices"})]}),(0,c.jsx)("button",{onClick:d,"aria-label":"Close accessibility panel",style:{background:"none",border:"none",cursor:"pointer",padding:"4px",color:"#94a3b8",fontSize:"20px",lineHeight:1,borderRadius:"6px",flexShrink:0,minWidth:y?"44px":"auto",minHeight:y?"44px":"auto",display:"flex",alignItems:"center",justifyContent:"center"},children:"\xD7"})]}),(0,c.jsx)(Le,{label:"\u267F Core Accessibility",concept:"Rule-based engine \u2014 works on all browsers and devices"}),(0,c.jsx)($e,{steps:["Toggle any feature on","Click Apply settings","Preferences saved automatically"]}),(0,c.jsx)(de,{icon:"\u{1F527}",label:"Auto-fix ARIA",desc:"Injects missing labels and roles automatically",checked:t.autoFix,onChange:p=>n("autoFix",p),tip:"Fixes aria-label, alt text, roles on every element"}),(0,c.jsx)(te,{}),(0,c.jsx)(de,{icon:"\u{1F50A}",label:"Speak on focus",desc:"Browser reads elements aloud as you tab",checked:t.speechEnabled,onChange:p=>n("speechEnabled",p),tip:"Uses browser SpeechSynthesis \u2014 no install needed"}),(0,c.jsx)(te,{}),(0,c.jsx)(de,{icon:"\u{1F399}\uFE0F",label:"Voice control",desc:"Say commands to navigate the page",checked:t.voiceControl,onChange:p=>n("voiceControl",p),disabled:!a,disabledReason:"Not supported in this browser",tip:'Say "scroll down", "go to main", "click"'}),(0,c.jsx)(te,{}),(0,c.jsx)(Le,{label:"\u{1F916} AI Features",color:"#7c3aed",badge:"Gemini Nano",concept:"Large Language Model running privately on your device \u2014 Chrome 127+ only"}),(0,c.jsx)("div",{style:{margin:"4px 18px 6px",padding:"8px 10px",background:i?"#f0fdfa":"#f5f3ff",borderRadius:"8px",border:`0.5px solid ${i?"#99f6e4":"#c4b5fd"}`,fontSize:"10px",color:i?"#0f766e":"#7c3aed",lineHeight:1.5},children:i?"\u2705 Gemini Nano detected \u2014 AI features ready. Runs privately on your device.":"\u2699\uFE0F AI features need one-time setup \u2014 see guide below."}),!i&&(0,c.jsxs)("div",{style:{margin:"0 18px 8px",padding:"10px 12px",background:"#fafafa",borderRadius:"8px",border:"0.5px solid #e2e8f0",fontSize:"11px",color:"#475569",lineHeight:1.7},children:[(0,c.jsx)("p",{style:{margin:"0 0 6px",fontWeight:600,color:"#0f172a",fontSize:"11px"},children:"\u{1F6E0} One-time setup \u2014 5 steps:"}),(0,c.jsxs)("p",{style:{margin:"0 0 3px"},children:["1. Open Chrome \u2192 ",(0,c.jsx)("code",{style:{background:"#f1f5f9",padding:"1px 5px",borderRadius:"4px",fontSize:"10px",color:"#0d9488",fontFamily:"monospace"},children:"chrome://flags"})]}),(0,c.jsx)("p",{style:{margin:"0 0 3px"},children:"2. Enable each flag:"}),(0,c.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"2px",margin:"4px 0 6px 10px"},children:nr.map(p=>(0,c.jsxs)("span",{style:{fontSize:"10px",color:"#7c3aed",fontFamily:"monospace"},children:["\u2192 ",p]},p))}),(0,c.jsxs)("p",{style:{margin:"0 0 3px"},children:["3. Click ",(0,c.jsx)("strong",{style:{color:"#0f172a"},children:"Relaunch"})]}),(0,c.jsxs)("p",{style:{margin:"0 0 3px"},children:["4. ",(0,c.jsx)("code",{style:{background:"#f1f5f9",padding:"1px 5px",borderRadius:"4px",fontSize:"10px",color:"#0d9488",fontFamily:"monospace"},children:"chrome://components"})," \u2192 Optimization Guide On Device Model \u2192 Check for update"]}),(0,c.jsx)("p",{style:{margin:"0"},children:"5. Refresh \u2014 AI features unlock automatically \u2705"})]}),(0,c.jsx)(de,{icon:"\u{1F4DD}",label:"Plain English mode",desc:"Rewrites complex text in simple language",checked:t.plainEnglish,onChange:p=>n("plainEnglish",p),disabled:!i,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: LLM text rewriting"}),(0,c.jsx)(te,{}),(0,c.jsx)(de,{icon:"\u{1F4CB}",label:"Summarise page",desc:"3-sentence summary appears at top",checked:t.summarisePage,onChange:p=>n("summarisePage",p),disabled:!i,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: Abstractive summarisation"}),(0,c.jsx)(te,{}),(0,c.jsx)(de,{icon:"\u{1F3F7}\uFE0F",label:"Smart aria-labels",desc:"AI generates meaningful labels for elements",checked:t.smartLabels,onChange:p=>n("smartLabels",p),disabled:!i,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: Context-aware label generation"}),(0,c.jsx)(te,{}),(0,c.jsx)(Le,{label:"\u{1F441}\uFE0F Visual",concept:"CSS filter-based \u2014 works on all browsers and devices"}),(0,c.jsx)($e,{steps:["Toggle any visual mode","Changes apply instantly","Works on mobile and desktop"]}),(0,c.jsx)(de,{icon:"\u25D1",label:"High contrast",desc:"Boosts contrast for low vision users",checked:t.highContrast,onChange:p=>n("highContrast",p),tip:"CSS filter: contrast()"}),(0,c.jsx)(te,{}),(0,c.jsx)(de,{icon:"\u{1F319}",label:"Dark mode",desc:"Inverts colours \u2014 easy on eyes at night",checked:t.darkMode,onChange:p=>n("darkMode",p),tip:"CSS filter: invert + hue-rotate"}),(0,c.jsx)(te,{}),(0,c.jsx)(de,{icon:"\u23F8\uFE0F",label:"Reduce motion",desc:"Disables all animations",checked:t.reduceMotion,onChange:p=>n("reduceMotion",p),tip:"WCAG 2.3.3 \u2014 vestibular disorders"}),(0,c.jsx)(te,{}),(0,c.jsx)(de,{icon:"\u{1F446}",label:"Large targets",desc:"44\xD744px minimum touch targets",checked:t.largeTargets,onChange:p=>n("largeTargets",p),tip:"WCAG 2.5.8 \u2014 motor impaired users"}),(0,c.jsx)(te,{}),(0,c.jsxs)("div",{style:{padding:"10px 18px"},children:[(0,c.jsx)("p",{style:{margin:"0 0 2px",fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F3A8} Colour blindness"}),(0,c.jsx)("p",{style:{margin:"0 0 8px",fontSize:"10px",color:"#94a3b8"},children:"SVG colour matrix filters \u2014 all devices"}),(0,c.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"},children:or.map(p=>(0,c.jsx)("button",{onClick:()=>n("colorBlindMode",p.value),"aria-pressed":t.colorBlindMode===p.value,style:{padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500,border:`1px solid ${t.colorBlindMode===p.value?"#0d9488":"#e2e8f0"}`,background:t.colorBlindMode===p.value?"#f0fdfa":"#fff",color:t.colorBlindMode===p.value?"#0d9488":"#64748b",cursor:"pointer",minHeight:y?"36px":"auto"},children:p.label},p.value))})]}),(0,c.jsx)(te,{}),(0,c.jsx)(Le,{label:"\u{1F524} Font",concept:"Browser Font API + CSS \u2014 Chrome 103+"}),(0,c.jsx)($e,{steps:["Toggle dyslexia font or pick from device","Adjust size with + / \u2212","Saved across visits"]}),(0,c.jsx)(de,{icon:"Aa",label:"Dyslexia-friendly font",desc:"Atkinson Hyperlegible \u2014 research-backed",checked:t.dyslexiaFont,onChange:p=>n("dyslexiaFont",p),tip:"By Braille Institute \u2014 free and open source"}),(0,c.jsx)(te,{}),(0,c.jsxs)("div",{style:{padding:"10px 18px"},children:[(0,c.jsx)("p",{style:{margin:"0 0 2px",fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F5A5}\uFE0F Local font"}),(0,c.jsx)("p",{style:{margin:"0 0 8px",fontSize:"10px",color:"#94a3b8"},children:"window.queryLocalFonts() \u2014 Chrome 103+"}),_.length>0?(0,c.jsxs)("select",{value:t.localFont,onChange:p=>n("localFont",p.target.value),"aria-label":"Choose a font from your device",style:{width:"100%",padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"13px",color:"#0f172a",background:"#fff",cursor:"pointer",height:y?"44px":"36px"},children:[(0,c.jsx)("option",{value:"",children:"System default"}),_.map(p=>(0,c.jsx)("option",{value:p,style:{fontFamily:p},children:p},p))]}):(0,c.jsx)("p",{style:{margin:0,fontSize:"11px",color:"#94a3b8"},children:"Allow font access when Chrome prompts you."})]}),(0,c.jsx)(te,{}),(0,c.jsxs)("div",{style:{padding:"10px 18px 14px"},children:[(0,c.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"10px"},children:[(0,c.jsxs)("div",{children:[(0,c.jsx)("p",{style:{margin:0,fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F4CF} Text size"}),(0,c.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#94a3b8"},children:"Scales all text on the page"})]}),(0,c.jsxs)("span",{style:{fontSize:"12px",fontWeight:600,color:"#0d9488",background:"#f0fdfa",padding:"2px 8px",borderRadius:"99px"},children:[t.fontScale,"%"]})]}),(0,c.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[(0,c.jsx)("button",{onClick:()=>{let p=Ee.indexOf(t.fontScale);p>0&&n("fontScale",Ee[p-1])},disabled:t.fontScale<=80,"aria-label":"Decrease text size",style:{width:y?"44px":"30px",height:y?"44px":"30px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:t.fontScale<=80?"not-allowed":"pointer",fontSize:"16px",color:t.fontScale<=80?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"\u2212"}),(0,c.jsx)("div",{style:{flex:1,display:"flex",gap:"3px"},children:Ee.map(p=>(0,c.jsx)("button",{onClick:()=>n("fontScale",p),"aria-label":`Set text size to ${p}%`,style:{flex:1,height:"6px",borderRadius:"99px",border:"none",cursor:"pointer",padding:0,background:p<=t.fontScale?"#0d9488":"#e2e8f0",transition:"background 0.15s"}},p))}),(0,c.jsx)("button",{onClick:()=>{let p=Ee.indexOf(t.fontScale);p<Ee.length-1&&n("fontScale",Ee[p+1])},disabled:t.fontScale>=130,"aria-label":"Increase text size",style:{width:y?"44px":"30px",height:y?"44px":"30px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:t.fontScale>=130?"not-allowed":"pointer",fontSize:"16px",color:t.fontScale>=130?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"+"})]})]}),(0,c.jsx)(te,{}),(0,c.jsx)(Le,{label:"\u{1F310} Translate",color:"#7c3aed",badge:"Gemini Nano",concept:"Chrome Translation API \u2014 on device, no internet after setup"}),(0,c.jsx)($e,{steps:["Enable Gemini Nano first","Pick your language","Full page translates instantly"]}),(0,c.jsxs)("div",{style:{padding:"6px 18px 12px"},children:[(0,c.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"},children:Xe.slice(0,y?8:18).map(p=>(0,c.jsx)("button",{onClick:()=>n("translateLanguage",p.code),"aria-pressed":t.translateLanguage===p.code,disabled:!i,style:{padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500,border:`1px solid ${t.translateLanguage===p.code?"#7c3aed":"#e2e8f0"}`,background:t.translateLanguage===p.code?"#f5f3ff":"#fff",color:t.translateLanguage===p.code?"#7c3aed":"#64748b",cursor:i?"pointer":"not-allowed",opacity:i?1:.5,minHeight:y?"36px":"auto"},children:p.label},p.code))}),!i&&(0,c.jsx)("p",{style:{margin:"6px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Enable Gemini Nano using the setup guide above."})]}),(0,c.jsx)(te,{}),(0,c.jsx)(Le,{label:"\u{1F4AC} Ask This Page",color:"#0d9488",badge:P,concept:"RAG \u2014 Retrieval Augmented Generation. Works on all devices including mobile."}),(0,c.jsx)($e,{steps:["Type any question about this page","Press Ask or hit Enter",k==="transformers"?"Transformers.js answers \u2014 works on mobile, offline":"Gemini Nano reads page and answers privately","Zero cost. No data leaves your device."]}),(0,c.jsxs)("div",{style:{margin:"0 18px 8px",padding:"6px 10px",background:k==="gemini"?"#f0fdfa":k==="transformers"?"#f5f3ff":"#f8fafc",borderRadius:"8px",border:`0.5px solid ${k==="gemini"?"#99f6e4":k==="transformers"?"#c4b5fd":"#e2e8f0"}`,fontSize:"10px",color:k==="gemini"?"#0f766e":k==="transformers"?"#7c3aed":"#94a3b8"},children:[k==="gemini"&&"\u2705 Using Gemini Nano \u2014 on device, private, instant",k==="transformers"&&"\u2705 Using Transformers.js \u2014 works on mobile and all browsers",!k&&"\u23F3 Detecting AI engine...",k==="transformers"&&A==="loading"&&" \xB7 Loading model...",k==="transformers"&&A==="ready"&&" \xB7 Model ready \u2705"]}),(0,c.jsxs)("div",{style:{padding:"0 18px 14px"},children:[(0,c.jsxs)("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[(0,c.jsx)("input",{type:"text",value:F,onChange:p=>L(p.target.value),onKeyDown:p=>{p.key==="Enter"&&B()},placeholder:"e.g. What does this page do?",disabled:T||!k,"aria-label":"Ask a question about this page",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:k?"#fff":"#f8fafc",outline:"none",height:y?"44px":"36px"}}),(0,c.jsx)("button",{onClick:B,disabled:T||!F.trim()||!k,"aria-label":"Ask question",style:{padding:"8px 14px",borderRadius:"8px",border:"none",background:k&&F.trim()&&!T?"#0d9488":"#e2e8f0",color:k&&F.trim()&&!T?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:k&&F.trim()&&!T?"pointer":"not-allowed",flexShrink:0,height:y?"44px":"36px",minWidth:"52px",transition:"background 0.2s"},children:T?re:"Ask"})]}),N&&(0,c.jsxs)("div",{role:"status","aria-live":"polite",style:{padding:"10px 12px",background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"8px",fontSize:"12px",color:"#0f766e",lineHeight:1.6,maxHeight:"180px",overflowY:"auto"},children:[(0,c.jsx)("strong",{style:{display:"block",marginBottom:"4px",fontSize:"11px",color:"#0d9488"},children:"\u{1F4AC} Answer"}),N,(0,c.jsx)("button",{onClick:()=>{v(""),L("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]})]}),o&&(0,c.jsx)("div",{role:"status",style:{margin:"0 14px 10px",padding:"8px 12px",background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"8px",fontSize:"12px",color:"#0f766e",fontWeight:500,fontFamily:"monospace"},children:o.fixed>0?`\u2713 ${o.fixed} fixes \xB7 ${o.scanned} nodes \xB7 ${o.renderTime}ms \xB7 Score: ${o.score}/100`:`\u2713 0 auto-fixes needed \xB7 ${o.scanned} nodes \xB7 ${o.renderTime}ms`}),(0,c.jsxs)("div",{style:{display:"flex",gap:"8px",padding:"12px 14px 14px",position:y?"sticky":"relative",bottom:y?0:"auto",background:"#fff",borderTop:"1px solid #f1f5f9"},children:[(0,c.jsx)("button",{onClick:l,style:{flex:1,padding:y?"12px 0":"8px 0",fontSize:"13px",fontWeight:500,borderRadius:"9px",border:"1px solid #e2e8f0",background:"#fff",color:"#64748b",cursor:"pointer"},children:"Reset"}),(0,c.jsx)("button",{onClick:s,style:{flex:2,padding:y?"12px 0":"8px 0",fontSize:"13px",fontWeight:600,borderRadius:"9px",border:"none",background:"#0d9488",color:"#fff",cursor:"pointer"},children:"Apply settings"})]})]})});Pt.displayName="WidgetPanel";Fe();g();var pe=require("react");g();var ar={hotel:["hotel","resort","motel","inn","accommodation","lodge","stay","room","booking","hospitality"],ecommerce:["shop","store","ecommerce","e-commerce","sell","product","cart","buy","marketplace","retail"],restaurant:["restaurant","food","cafe","cafeteria","menu","dining","eat","cuisine","bistro","takeaway","delivery"],portfolio:["portfolio","freelance","personal","designer","developer","creative","showcase","work","hire me"],blog:["blog","article","post","write","news","magazine","journal","content"],saas:["saas","dashboard","app","software","platform","tool","analytics","admin","manage","crm"],government:["government","govt","portal","citizen","scheme","welfare","municipal","public","official"],healthcare:["hospital","clinic","doctor","health","medical","patient","appointment","pharmacy"],education:["school","college","university","course","learn","education","student","lms","training"],realestate:["real estate","property","house","flat","apartment","rent","buy property","listing"],landing:["landing","startup","launch","product launch","coming soon","waitlist"],generic:[]},sr={hotel:["home","rooms","booking","about","contact"],ecommerce:["home","products","cart","checkout","about","contact"],restaurant:["home","menu","reservations","about","contact"],portfolio:["home","portfolio","about","contact"],blog:["home","blog","about","contact"],saas:["home","pricing","dashboard","auth","about","contact"],government:["home","services","about","contact","faq"],healthcare:["home","services","booking","team","about","contact"],education:["home","services","pricing","about","contact"],realestate:["home","products","about","contact"],landing:["home","pricing","about","contact"],generic:["home","about","services","contact"]},lr={home:["home","homepage","main","landing"],about:["about","who we are","our story","company"],contact:["contact","reach us","get in touch","location"],services:["service","what we offer","solution","offering"],pricing:["pricing","price","plan","subscription","cost","fee"],blog:["blog","article","news","post"],auth:["login","register","signup","sign up","sign in","auth","account"],dashboard:["dashboard","admin","panel","manage","analytics"],gallery:["gallery","photo","image","portfolio"],products:["product","shop","store","item","catalogue"],cart:["cart","basket","shopping cart"],checkout:["checkout","payment","pay","order"],rooms:["room","suite","accommodation","stay"],booking:["booking","reserve","reservation","schedule","appointment"],menu:["menu","food","dish","cuisine"],reservations:["reservation","table booking","book table"],portfolio:["portfolio","work","project","case study"],team:["team","staff","member","people","who we are"],faq:["faq","question","answer","help","support"],terms:["terms","condition","legal"],privacy:["privacy","policy","gdpr","data"]},cr={Authentication:["login","register","auth","signup","sign in","account"],Payment:["payment","stripe","pay","checkout","billing"],Search:["search","filter","find"],"Dark mode":["dark mode","dark theme","night mode"],"Multi-language":["multilingual","multi language","translation","i18n"],SEO:["seo","search engine","meta","google"],Analytics:["analytics","tracking","stats","dashboard"],Email:["email","newsletter","contact form","notification"],Map:["map","location","address","google maps"],"Social media":["social","instagram","facebook","twitter","share"],"Image gallery":["gallery","photo","image","carousel"],"Booking system":["booking","reservation","appointment","schedule"],"Shopping cart":["cart","basket","shop","ecommerce"],"Blog/CMS":["blog","cms","content","article","post"]},dr={blue:["blue","navy","sky","ocean","corporate"],green:["green","nature","eco","environment","health","fresh"],purple:["purple","violet","luxury","creative","royal"],red:["red","bold","energy","passion","food"],orange:["orange","warm","friendly","fun"],teal:["teal","turquoise","modern","tech"],indigo:["indigo","professional","trust","finance","bank"],gray:["gray","minimal","clean","simple","neutral"]},ur={hotel:"indigo",ecommerce:"blue",restaurant:"red",portfolio:"purple",blog:"gray",saas:"teal",government:"blue",healthcare:"green",education:"indigo",realestate:"orange",landing:"purple",generic:"blue"};function pr(e){let t=[/(?:for|called|named|company|business|brand)\s+["']?([A-Z][a-zA-Z\s]{1,30})["']?/i,/["']([A-Z][a-zA-Z\s]{1,30})["']/,/^([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)?)/m];for(let o of t){let r=e.match(o);if(r?.[1]){let i=r[1].trim();if(i.length>2&&i.length<40)return i}}return"My Business"}function fr(e){let t=e.toLowerCase(),o="generic",r=0;for(let[i,a]of Object.entries(ar)){let n=0;for(let s of a)t.includes(s)&&n++;n>r&&(r=n,o=i)}return o}function mr(e,t){let o=e.toLowerCase(),r=new Set(sr[t]);for(let[i,a]of Object.entries(lr))for(let n of a)if(o.includes(n)){r.add(i);break}return r.add("home"),r.add("contact"),Array.from(r)}function gr(e){let t=e.toLowerCase(),o=[];for(let[r,i]of Object.entries(cr))for(let a of i)if(t.includes(a)){o.push(r);break}return o}function br(e,t){let o=e.toLowerCase();for(let[r,i]of Object.entries(dr))for(let a of i)if(o.includes(a))return r;return ur[t]}function Eo(e){let t=fr(e),o=mr(e,t),r=gr(e),i=br(e,t);return{siteName:pr(e),websiteType:t,pages:o,features:r,theme:i,description:e.slice(0,200)}}var h=require("react/jsx-runtime"),vr=["Hotel booking website for Grand Palace Hotels with rooms, booking and payment","E-commerce store for organic food products with cart and checkout","Restaurant website for Spice Garden with menu and table reservations","Portfolio website for a freelance designer with gallery and contact","SaaS dashboard for project management with pricing and auth","Government portal for citizen services with FAQ and contact"],wr={home:"\u{1F3E0}",about:"\u2139\uFE0F",contact:"\u{1F4EC}",services:"\u2699\uFE0F",pricing:"\u{1F4B0}",blog:"\u{1F4DD}",auth:"\u{1F510}",dashboard:"\u{1F4CA}",gallery:"\u{1F5BC}\uFE0F",products:"\u{1F6D2}",cart:"\u{1F6CD}\uFE0F",checkout:"\u{1F4B3}",rooms:"\u{1F6CF}\uFE0F",booking:"\u{1F4C5}",menu:"\u{1F37D}\uFE0F",reservations:"\u{1FA91}",portfolio:"\u{1F4BC}",team:"\u{1F465}",faq:"\u2753",terms:"\u{1F4C4}",privacy:"\u{1F512}"},kr={hotel:"\u{1F3E8}",ecommerce:"\u{1F6D2}",restaurant:"\u{1F37D}\uFE0F",portfolio:"\u{1F4BC}",blog:"\u{1F4DD}",saas:"\u26A1",government:"\u{1F3DB}\uFE0F",healthcare:"\u{1F3E5}",education:"\u{1F393}",realestate:"\u{1F3E0}",landing:"\u{1F680}",generic:"\u{1F310}"};function zt({position:e,onClose:t}){let[o,r]=(0,pe.useState)("input"),[i,a]=(0,pe.useState)(""),[n,s]=(0,pe.useState)(null),[l,d]=(0,pe.useState)(0),[b,y]=(0,pe.useState)(""),M=(0,pe.useCallback)(()=>{if(!i.trim())return;let L=Eo(i);s(L),r("preview")},[i]),_=(0,pe.useCallback)(async()=>{if(n){r("generating"),d(0),y("");try{let L=[{msg:"Parsing requirement...",pct:15},{msg:"Loading templates...",pct:30},{msg:"Generating pages...",pct:55},{msg:"Building components...",pct:70},{msg:"Creating styles...",pct:85},{msg:"Packaging ZIP...",pct:95}];for(let v of L)d(v.pct),await new Promise(T=>setTimeout(T,200));let{generateZip:N}=await Promise.resolve().then(()=>(tn(),en));await N(n),d(100),r("done")}catch(L){y(L instanceof Error?L.message:"Generation failed. Please try again."),r("preview")}}},[n]),U=()=>{r("input"),a(""),s(null),d(0),y("")},F={position:"fixed",bottom:"204px",[e]:"24px",zIndex:9999,width:"340px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.14)",fontFamily:"system-ui,-apple-system,sans-serif",maxHeight:"75vh",overflowY:"auto"};return(0,h.jsxs)("div",{role:"dialog","aria-modal":"true","aria-label":"yuktai Vibe Coder","data-yuktai-panel":"true",style:F,children:[(0,h.jsxs)("div",{style:{padding:"14px 16px 12px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"flex-start",justifyContent:"space-between",position:"sticky",top:0,background:"#fff",zIndex:1},children:[(0,h.jsxs)("div",{children:[(0,h.jsx)("p",{style:{margin:"0 0 2px",fontSize:"13px",fontWeight:700,color:"#0f172a"},children:"\u26A1 Vibe Coder"}),(0,h.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#64748b"},children:"Describe your website \u2192 Download Next.js ZIP"})]}),(0,h.jsx)("button",{onClick:t,"aria-label":"Close vibe coder",style:{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"18px",padding:"2px"},children:"\xD7"})]}),o==="input"&&(0,h.jsxs)("div",{style:{padding:"14px 16px"},children:[(0,h.jsx)("p",{style:{margin:"0 0 10px",fontSize:"11px",color:"#64748b"},children:"Describe your business website in plain English. The plugin will generate a complete Next.js project for you."}),(0,h.jsx)("p",{style:{margin:"0 0 6px",fontSize:"10px",fontWeight:600,color:"#94a3b8",textTransform:"uppercase"},children:"Examples"}),(0,h.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"4px",marginBottom:"12px"},children:vr.slice(0,3).map(L=>(0,h.jsx)("button",{onClick:()=>a(L),style:{padding:"6px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#f8fafc",color:"#475569",fontSize:"10px",cursor:"pointer",textAlign:"left",lineHeight:1.4},children:L},L))}),(0,h.jsx)("textarea",{value:i,onChange:L=>a(L.target.value),placeholder:"e.g. I need a hotel booking website with rooms, search, and payment for Grand Palace Hotels",rows:4,"aria-label":"Describe your website",style:{width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.5}}),(0,h.jsx)("button",{onClick:M,disabled:!i.trim(),style:{width:"100%",marginTop:"10px",padding:"10px",borderRadius:"8px",border:"none",background:i.trim()?"#f59e0b":"#e2e8f0",color:i.trim()?"#fff":"#94a3b8",fontSize:"13px",fontWeight:700,cursor:i.trim()?"pointer":"not-allowed",transition:"background 0.2s"},children:"Analyse Requirement \u2192"})]}),o==="preview"&&n&&(0,h.jsxs)("div",{style:{padding:"14px 16px"},children:[b&&(0,h.jsxs)("div",{style:{padding:"10px",background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:"8px",marginBottom:"12px",fontSize:"11px",color:"#dc2626"},children:["\u26A0\uFE0F ",b]}),(0,h.jsxs)("div",{style:{background:"#f8fafc",borderRadius:"10px",padding:"12px",marginBottom:"12px"},children:[(0,h.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"},children:[(0,h.jsx)("span",{style:{fontSize:"1.5rem"},children:kr[n.websiteType]||"\u{1F310}"}),(0,h.jsxs)("div",{children:[(0,h.jsx)("p",{style:{margin:0,fontSize:"13px",fontWeight:700,color:"#0f172a"},children:n.siteName}),(0,h.jsxs)("p",{style:{margin:0,fontSize:"10px",color:"#64748b",textTransform:"capitalize"},children:[n.websiteType," website \xB7 ",n.theme," theme"]})]})]}),(0,h.jsxs)("p",{style:{margin:"8px 0 6px",fontSize:"10px",fontWeight:600,color:"#94a3b8",textTransform:"uppercase"},children:["Pages to generate (",n.pages.length,")"]}),(0,h.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"4px"},children:n.pages.map(L=>(0,h.jsxs)("span",{style:{padding:"2px 8px",borderRadius:"99px",background:"#f0fdf4",border:"1px solid #86efac",fontSize:"10px",color:"#166534",fontWeight:500},children:[wr[L]||"\u{1F4C4}"," ",L]},L))}),n.features.length>0&&(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("p",{style:{margin:"10px 0 6px",fontSize:"10px",fontWeight:600,color:"#94a3b8",textTransform:"uppercase"},children:"Detected features"}),(0,h.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"4px"},children:n.features.map(L=>(0,h.jsx)("span",{style:{padding:"2px 8px",borderRadius:"99px",background:"#f5f3ff",border:"1px solid #c4b5fd",fontSize:"10px",color:"#7c3aed",fontWeight:500},children:L},L))})]})]}),(0,h.jsxs)("div",{style:{margin:"0 0 12px",padding:"10px 12px",background:"#f0fdf4",borderRadius:"8px",border:"1px solid #86efac"},children:[(0,h.jsx)("p",{style:{margin:"0 0 4px",fontSize:"10px",fontWeight:700,color:"#166534"},children:"\u{1F4E6} What you get:"}),(0,h.jsxs)("p",{style:{margin:0,fontSize:"10px",color:"#166534",lineHeight:1.6},children:["\u2705 Complete Next.js 16 project",(0,h.jsx)("br",{}),"\u2705 Tailwind CSS + CSS Modules",(0,h.jsx)("br",{}),"\u2705 TypeScript configured",(0,h.jsx)("br",{}),"\u2705 Navbar + Footer components",(0,h.jsx)("br",{}),"\u2705 All ",n.pages.length," pages ready",(0,h.jsx)("br",{}),"\u2705 Mobile responsive",(0,h.jsx)("br",{}),"\u2705 npm run dev \u2192 works immediately"]})]}),(0,h.jsxs)("div",{style:{display:"flex",gap:"8px"},children:[(0,h.jsx)("button",{onClick:U,style:{flex:1,padding:"9px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",color:"#64748b",fontSize:"12px",fontWeight:600,cursor:"pointer"},children:"\u2190 Edit"}),(0,h.jsx)("button",{onClick:_,style:{flex:2,padding:"9px",borderRadius:"8px",border:"none",background:"#f59e0b",color:"#fff",fontSize:"13px",fontWeight:700,cursor:"pointer"},children:"\u2B07\uFE0F Generate & Download ZIP"})]})]}),o==="generating"&&(0,h.jsxs)("div",{style:{padding:"2rem 16px",textAlign:"center"},children:[(0,h.jsx)("p",{style:{fontSize:"2rem",marginBottom:"1rem"},children:"\u26A1"}),(0,h.jsx)("p",{style:{fontSize:"13px",fontWeight:700,color:"#0f172a",marginBottom:"0.5rem"},children:"Generating your project..."}),(0,h.jsx)("p",{style:{fontSize:"11px",color:"#64748b",marginBottom:"1.5rem"},children:l<30?"Parsing requirement...":l<55?"Loading templates...":l<70?"Generating pages...":l<85?"Building components...":l<95?"Creating styles...":"Packaging ZIP..."}),(0,h.jsx)("div",{style:{height:"8px",background:"#e2e8f0",borderRadius:"99px",overflow:"hidden"},children:(0,h.jsx)("div",{style:{height:"100%",width:`${l}%`,background:"#f59e0b",borderRadius:"99px",transition:"width 0.3s ease"}})}),(0,h.jsxs)("p",{style:{marginTop:"0.5rem",fontSize:"10px",color:"#94a3b8"},children:[l,"%"]})]}),o==="done"&&n&&(0,h.jsxs)("div",{style:{padding:"2rem 16px",textAlign:"center"},children:[(0,h.jsx)("p",{style:{fontSize:"3rem",marginBottom:"0.75rem"},children:"\u2705"}),(0,h.jsxs)("p",{style:{fontSize:"14px",fontWeight:700,color:"#0f172a",marginBottom:"0.5rem"},children:[n.siteName," downloaded!"]}),(0,h.jsx)("p",{style:{fontSize:"11px",color:"#64748b",marginBottom:"1.5rem",lineHeight:1.6},children:"Your ZIP is downloading. Unzip it and run:"}),["npm install","npm run dev"].map(L=>(0,h.jsx)("div",{style:{background:"#0f172a",borderRadius:"8px",padding:"8px 12px",marginBottom:"6px",textAlign:"left"},children:(0,h.jsxs)("code",{style:{fontSize:"12px",color:"#a7f3d0",fontFamily:"monospace"},children:["$ ",L]})},L)),(0,h.jsx)("p",{style:{fontSize:"11px",color:"#10b981",margin:"1rem 0",fontWeight:600},children:"Then open http://localhost:3000 \u{1F680}"}),(0,h.jsxs)("div",{style:{display:"flex",gap:"8px"},children:[(0,h.jsx)("button",{onClick:U,style:{flex:1,padding:"9px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",color:"#64748b",fontSize:"12px",fontWeight:600,cursor:"pointer"},children:"New Project"}),(0,h.jsx)("button",{onClick:_,style:{flex:1,padding:"9px",borderRadius:"8px",border:"none",background:"#f59e0b",color:"#fff",fontSize:"12px",fontWeight:700,cursor:"pointer"},children:"\u2B07\uFE0F Download Again"})]})]})]})}var C=require("react/jsx-runtime");async function Er(){try{if(typeof window>"u")return!1;let e=window;if(e.LanguageModel)try{if(typeof e.LanguageModel.availability=="function"){let o=await e.LanguageModel.availability();if(o==="readily"||o==="available"||o==="downloadable")return!0}else return!0}catch{}if(e.Summarizer)try{let o=await e.Summarizer.availability?.();if(!o||o==="readily"||o==="available")return!0}catch{}if(e.Rewriter)try{let o=await e.Rewriter.availability?.();if(!o||o==="readily"||o==="available")return!0}catch{}if(e.Writer)try{let o=await e.Writer.availability?.();if(!o||o==="readily"||o==="available")return!0}catch{}let t=e.ai||globalThis.ai;if(t){if(t.languageModel?.availability)try{let o=await t.languageModel.availability();if(o==="readily"||o==="available")return!0}catch{}if(t.languageModel&&typeof t.languageModel.create=="function"||t.summarizer||t.rewriter||t.writer||t.languageModel)return!0}return!!(e.Translator||e.translation?.canTranslate)}catch{return!1}}function ot({position:e="left",children:t,config:o={},showRag:r=!1,showAgent:i=!1}){let[a,n]=(0,R.useState)(!1),[s,l]=(0,R.useState)(Mt),[d,b]=(0,R.useState)(null),[y,M]=(0,R.useState)(!1),[_,U]=(0,R.useState)(!1),[F,L]=(0,R.useState)(!1),N=R.default.useRef(null),[v,T]=(0,R.useState)(!1),[z,k]=(0,R.useState)(""),[m,A]=(0,R.useState)(""),[$,B]=(0,R.useState)(!1),[P,re]=(0,R.useState)(null),[G,p]=(0,R.useState)("idle"),[D,q]=(0,R.useState)(!1),[j,O]=(0,R.useState)(""),[ie,J]=(0,R.useState)(""),[le,ye]=(0,R.useState)(!1),[De,ce]=(0,R.useState)([]),[K,Re]=(0,R.useState)(null),ft=24,xe=84,ve=r?144:84,mt=204,[ge,Ie]=(0,R.useState)(!1);(0,R.useEffect)(()=>{if(typeof window>"u")return;let u=window;!!(u.LanguageModel||u.ai?.languageModel)&&_?(re("gemini"),Re("gemini")):Ne()&&(re("transformers"),Re("transformers"))},[_]),(0,R.useEffect)(()=>{if(P!=="transformers")return;let u=setInterval(()=>p(ze()),500);return()=>clearInterval(u)},[P]);let qe=(0,R.useCallback)(async()=>{if(!(!z.trim()||$)){if(!P){A("\u26A0\uFE0F No AI engine available.");return}B(!0),A("");try{let u;if(P==="gemini"){let{askPage:S}=await Promise.resolve().then(()=>(Et(),ko));u=await S(z)}else{p("loading");let{askPageWithTransformers:S}=await Promise.resolve().then(()=>(Fe(),It));u=await S(z),p("ready")}A(u.success&&u.answer?u.answer.replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/#+\s/g,"").trim():"\u26A0\uFE0F "+(u.error||"No answer found."))}catch{A("\u26A0\uFE0F Something went wrong.")}B(!1)}},[z,$,P]),je=(0,R.useCallback)(async()=>{if(!j.trim()||le)return;if(!K){J("\u26A0\uFE0F No AI engine available.");return}ye(!0),ce([]),J("");let{runAgent:u}=await Promise.resolve().then(()=>(ln(),sn));await u(j,K,S=>{ce(E=>[...E,S.text])}),ye(!1),J("done")},[j,le,K]);(0,R.useEffect)(()=>{if(typeof window>"u")return;let S=setTimeout(async()=>{let E=window,ee=await Er();U(ee),L(!!(E.SpeechRecognition||E.webkitSpeechRecognition))},800);return()=>clearTimeout(S)},[]),(0,R.useEffect)(()=>{if(!(typeof window>"u"))try{let u=localStorage.getItem("yuktai-a11y-prefs");u&&l(S=>({...S,...JSON.parse(u)}))}catch{}},[]);let Me=(0,R.useCallback)(async u=>{let S={enabled:!0,highContrast:u.highContrast,darkMode:u.darkMode,reduceMotion:u.reduceMotion,largeTargets:u.largeTargets,speechEnabled:u.speechEnabled,autoFix:u.autoFix,dyslexiaFont:u.dyslexiaFont,localFont:u.localFont,fontSizeMultiplier:u.fontScale/100,colorBlindMode:u.colorBlindMode,showAuditBadge:u.showAuditBadge,showSkipLinks:!0,showPreferencePanel:!1,plainEnglish:u.plainEnglish,summarisePage:u.summarisePage,translateLanguage:u.translateLanguage,voiceControl:u.voiceControl,smartLabels:u.smartLabels,...o};await ae.execute(S),b(ae.applyFixes(S)),M(!0)},[o]),W=(0,R.useCallback)(async()=>{try{localStorage.setItem("yuktai-a11y-prefs",JSON.stringify(s))}catch{}await Me(s),n(!1)},[s,Me]),Vt=(0,R.useCallback)(()=>{l(Mt);try{localStorage.removeItem("yuktai-a11y-prefs")}catch{}let u=document.documentElement;["data-yuktai-high-contrast","data-yuktai-dark","data-yuktai-reduce-motion","data-yuktai-large-targets","data-yuktai-keyboard","data-yuktai-dyslexia"].forEach(S=>u.removeAttribute(S)),document.body.style.filter="",document.body.style.fontFamily="",document.documentElement.style.fontSize="",b(null),M(!1)},[]),Ut=(0,R.useCallback)((u,S)=>{l(E=>({...E,[u]:S}))},[]);(0,R.useEffect)(()=>{let u=S=>{S.key==="Escape"&&(a&&n(!1),v&&T(!1),D&&q(!1),ge&&Ie(!1))};return window.addEventListener("keydown",u),()=>window.removeEventListener("keydown",u)},[a,v,D]),(0,R.useEffect)(()=>{a&&N.current&&ae.trapFocus(N.current)},[a]);let be=(u,S,E)=>({position:"fixed",bottom:`${u}px`,[e]:"24px",zIndex:9998,width:"52px",height:"52px",borderRadius:"50%",background:S,color:"#fff",border:"none",cursor:"pointer",fontSize:"22px",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,0,0,0.25)",transition:"transform 0.15s, background 0.2s"}),we=u=>{u.currentTarget.style.transform="scale(1.08)"},he=u=>{u.currentTarget.style.transform="scale(1)"},Ye=P==="gemini"?"Gemini Nano \xB7 On device":P==="transformers"?"Transformers.js \xB7 All devices":"Detecting...",f=P==="transformers"&&G==="loading"?"Loading model...":"...";return(0,C.jsxs)(C.Fragment,{children:[t,i&&(0,C.jsx)("button",{style:be(204,ge?"#d97706":"#f59e0b",ge),"aria-label":"Open Vibe Coder",title:"\u26A1 Vibe Coder \u2014 Generate Next.js project",onClick:()=>{Ie(u=>!u),q(!1),T(!1),n(!1)},onMouseEnter:we,onMouseLeave:he,children:"\u26A1"}),i&&ge&&(0,C.jsx)(zt,{position:e,onClose:()=>Ie(!1)}),i&&(0,C.jsx)("button",{style:be(ve,D?"#059669":"#10b981",D),"aria-label":"Open AI agent","aria-haspopup":"dialog","aria-expanded":D,title:"\u{1F916} AI Agent \u2014 guide me through this page",onClick:()=>{q(u=>!u),T(!1),n(!1)},onMouseEnter:we,onMouseLeave:he,children:"\u{1F916}"}),i&&D&&(0,C.jsxs)("div",{role:"dialog","aria-modal":"true","aria-label":"yuktai AI Agent","data-yuktai-panel":"true",style:{position:"fixed",bottom:`${ve+64}px`,[e]:"24px",zIndex:9999,width:"300px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",fontFamily:"system-ui,-apple-system,sans-serif",padding:"14px",maxHeight:"70vh",overflowY:"auto"},children:[(0,C.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"},children:[(0,C.jsxs)("div",{children:[(0,C.jsx)("p",{style:{margin:"0 0 2px",fontSize:"13px",fontWeight:600,color:"#0f172a"},children:"\u{1F916} AI Agent"}),(0,C.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#10b981"},children:K==="gemini"?"Gemini Nano \xB7 On device":K==="transformers"?"Transformers.js \xB7 All devices":"Detecting..."})]}),(0,C.jsx)("button",{onClick:()=>q(!1),"aria-label":"Close agent panel",style:{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"18px",lineHeight:1,padding:"2px"},children:"\xD7"})]}),(0,C.jsx)("p",{style:{margin:"0 0 8px",fontSize:"11px",color:"#64748b"},children:"Tell me what you want to do on this page. I will guide you step by step."}),(0,C.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"4px",marginBottom:"8px"},children:["Fill this form","Find contact info","What is this page?","Guide me to apply"].map(u=>(0,C.jsx)("button",{onClick:()=>O(u),style:{padding:"3px 8px",borderRadius:"20px",fontSize:"10px",border:"1px solid #e2e8f0",background:"#f8fafc",color:"#64748b",cursor:"pointer"},children:u},u))}),(0,C.jsxs)("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[(0,C.jsx)("input",{type:"text",value:j,onChange:u=>O(u.target.value),onKeyDown:u=>{u.key==="Enter"&&je()},placeholder:"e.g. Help me fill this form",disabled:le||!K,"aria-label":"Tell the agent what to do",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:K?"#fff":"#f8fafc",outline:"none",height:"36px"}}),(0,C.jsx)("button",{onClick:je,disabled:le||!j.trim()||!K,"aria-label":"Run agent",style:{padding:"8px 12px",borderRadius:"8px",border:"none",background:K&&j.trim()&&!le?"#10b981":"#e2e8f0",color:K&&j.trim()&&!le?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:K&&j.trim()&&!le?"pointer":"not-allowed",height:"36px",minWidth:"52px",transition:"background 0.2s"},children:le?"...":"Go"})]}),De.length>0&&(0,C.jsxs)("div",{style:{padding:"10px 12px",background:"#f0fdf4",border:"1px solid #86efac",borderRadius:"8px",fontSize:"11px",color:"#166534",lineHeight:1.7},children:[De.map((u,S)=>(0,C.jsx)("p",{style:{margin:"0 0 2px"},children:u},S)),ie==="done"&&(0,C.jsx)("button",{onClick:()=>{ce([]),O(""),J("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]}),!K&&(0,C.jsx)("p",{style:{margin:"4px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Enable Gemini Nano via chrome://flags for best results."})]}),r&&(0,C.jsx)("button",{style:be(xe,v?"#7c3aed":"#6d28d9",v),"aria-label":"Ask a question about this page","aria-haspopup":"dialog","aria-expanded":v,title:`\u{1F4AC} Ask this page \xB7 ${Ye}`,onClick:()=>{T(u=>!u),n(!1),q(!1)},onMouseEnter:we,onMouseLeave:he,children:"\u{1F4AC}"}),r&&v&&(0,C.jsxs)("div",{role:"dialog","aria-modal":"true","aria-label":"Ask this page","data-yuktai-panel":"true",style:{position:"fixed",bottom:`${xe+64}px`,[e]:"24px",zIndex:9999,width:"300px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",fontFamily:"system-ui,-apple-system,sans-serif",padding:"14px"},children:[(0,C.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"},children:[(0,C.jsxs)("div",{children:[(0,C.jsx)("p",{style:{margin:"0 0 2px",fontSize:"13px",fontWeight:600,color:"#0f172a"},children:"\u{1F4AC} Ask this page"}),(0,C.jsx)("p",{style:{margin:0,fontSize:"10px",color:"#7c3aed"},children:Ye}),P==="transformers"&&G==="loading"&&(0,C.jsx)("p",{style:{margin:"2px 0 0",fontSize:"9px",color:"#94a3b8"},children:"Downloading model \u2014 first time only"}),P==="transformers"&&G==="ready"&&(0,C.jsx)("p",{style:{margin:"2px 0 0",fontSize:"9px",color:"#10b981"},children:"Model ready \u2705 \u2014 works offline"})]}),(0,C.jsx)("button",{onClick:()=>T(!1),"aria-label":"Close ask panel",style:{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"18px",lineHeight:1,padding:"2px"},children:"\xD7"})]}),(0,C.jsxs)("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[(0,C.jsx)("input",{type:"text",value:z,onChange:u=>k(u.target.value),onKeyDown:u=>{u.key==="Enter"&&qe()},placeholder:"e.g. What does this page do?",disabled:$||!P,"aria-label":"Ask a question about this page",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:P?"#fff":"#f8fafc",outline:"none",height:"36px"}}),(0,C.jsx)("button",{onClick:qe,disabled:$||!z.trim()||!P,"aria-label":"Submit question",style:{padding:"8px 12px",borderRadius:"8px",border:"none",background:P&&z.trim()&&!$?"#7c3aed":"#e2e8f0",color:P&&z.trim()&&!$?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:P&&z.trim()&&!$?"pointer":"not-allowed",height:"36px",minWidth:"48px",transition:"background 0.2s"},children:$?f:"Ask"})]}),m&&(0,C.jsxs)("div",{style:{padding:"10px",background:"#f5f3ff",borderRadius:"8px",fontSize:"12px",color:"#4c1d95",lineHeight:1.6,maxHeight:"180px",overflowY:"auto"},children:[(0,C.jsx)("strong",{style:{display:"block",marginBottom:"4px",fontSize:"11px",color:"#7c3aed"},children:"\u{1F4AC} Answer"}),m,(0,C.jsx)("button",{onClick:()=>{A(""),k("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]}),!P&&(0,C.jsx)("p",{style:{margin:"4px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Detecting AI engine..."})]}),(0,C.jsx)("button",{style:be(ft,y?"#0d9488":"#1a73e8",a),"aria-label":"Open accessibility preferences","aria-haspopup":"dialog","aria-expanded":a,"data-yuktai-pref-toggle":"true",title:"\u267F Accessibility settings",onClick:()=>{n(u=>!u),T(!1),q(!1)},onMouseEnter:we,onMouseLeave:he,children:"\u267F"}),a&&(0,C.jsx)(Pt,{ref:N,position:e,settings:s,report:d,isActive:y,aiSupported:_,voiceSupported:F,set:Ut,onApply:W,onReset:Vt,onClose:()=>n(!1)})]})}g();var Ge={name:"ai.text",async execute(e){return`\u{1F916} YuktAI says: ${e}`}};g();var We={name:"voice.text",async execute(e){return!e||e.trim()===""?"\u{1F3A4} No speech detected":`\u{1F3A4} You said: ${e}`}};g();var me=class{plugins=new Map;register(t,o){if(!o||typeof o.execute!="function")throw new Error(`Invalid plugin: ${t}`);this.plugins.set(t,o)}use(t){return this.plugins.get(t)}async run(t,o){try{let r=this.use(t);if(!r)throw new Error(`Plugin not found: ${t}`);return await r.execute(o)}catch(r){throw console.error(`[YuktAI Runtime Error in ${t}]:`,r),r}}getPlugins(){return Array.from(this.plugins.keys())}};g();var ne=require("react");g();var Y=require("react"),w=require("react/jsx-runtime"),cn={"en-US":{title:"Grid AI Assistant",subtitle:"Ask about your data",ask:"Ask",placeholder:"Ask or type a command...",listening:"Listening...",send:"Send",close:"Close",open:"Open AI assistant",inputLanguage:"Input language",english:"English",telugu:"\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41",searchStarted:e=>`Searching for "${e}".`,sortedAscending:e=>`Sorted by ${e} in ascending order.`,sortedDescending:e=>`Sorted by ${e} in descending order.`,count:e=>`There are ${e} rows in the grid.`,highest:(e,t,o)=>`The highest ${e} is ${t}, held by ${o}.`,lowest:(e,t,o)=>`The lowest ${e} is ${t}, held by ${o}.`,average:(e,t)=>`The average ${e} is ${t}.`,total:(e,t)=>`The total ${e} is ${t}.`,noData:"There is no data to analyze.",noColumn:"I could not find a column to analyze.",noNumericData:e=>`There is no numeric data in ${e}.`,notFound:e=>`I could not find anything matching "${e}".`,needName:"Please provide a value to look up.",fallback:"I can search, sort, count, and analyze the grid data.",unsupportedVoice:"Voice input is not supported in this browser."},"te-IN":{title:"\u0C17\u0C4D\u0C30\u0C3F\u0C21\u0C4D AI \u0C38\u0C39\u0C3E\u0C2F\u0C15\u0C41\u0C21\u0C41",subtitle:"\u0C2E\u0C40 \u0C21\u0C47\u0C1F\u0C3E \u0C17\u0C41\u0C30\u0C3F\u0C02\u0C1A\u0C3F \u0C05\u0C21\u0C17\u0C02\u0C21\u0C3F",ask:"\u0C05\u0C21\u0C17\u0C02\u0C21\u0C3F",placeholder:"\u0C2A\u0C4D\u0C30\u0C36\u0C4D\u0C28 \u0C32\u0C47\u0C26\u0C3E \u0C06\u0C26\u0C47\u0C36\u0C02 \u0C1F\u0C48\u0C2A\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F...",listening:"\u0C35\u0C3F\u0C02\u0C1F\u0C41\u0C28\u0C4D\u0C28\u0C3E\u0C28\u0C41...",send:"\u0C2A\u0C02\u0C2A\u0C02\u0C21\u0C3F",close:"\u0C2E\u0C42\u0C38\u0C3F\u0C35\u0C47\u0C2F\u0C02\u0C21\u0C3F",open:"AI \u0C38\u0C39\u0C3E\u0C2F\u0C15\u0C41\u0C21\u0C3F\u0C28\u0C3F \u0C24\u0C46\u0C30\u0C35\u0C02\u0C21\u0C3F",inputLanguage:"\u0C07\u0C28\u0C4D\u200C\u0C2A\u0C41\u0C1F\u0C4D \u0C2D\u0C3E\u0C37",english:"English",telugu:"\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41",searchStarted:e=>`\u201C${e}\u201D \u0C15\u0C4B\u0C38\u0C02 \u0C36\u0C4B\u0C27\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C28\u0C4D\u0C28\u0C3E\u0C28\u0C41.`,sortedAscending:e=>`${e}\u0C28\u0C41 \u0C06\u0C30\u0C4B\u0C39\u0C23 \u0C15\u0C4D\u0C30\u0C2E\u0C02\u0C32\u0C4B \u0C05\u0C2E\u0C30\u0C4D\u0C1A\u0C3E\u0C28\u0C41.`,sortedDescending:e=>`${e}\u0C28\u0C41 \u0C05\u0C35\u0C30\u0C4B\u0C39\u0C23 \u0C15\u0C4D\u0C30\u0C2E\u0C02\u0C32\u0C4B \u0C05\u0C2E\u0C30\u0C4D\u0C1A\u0C3E\u0C28\u0C41.`,count:e=>`\u0C17\u0C4D\u0C30\u0C3F\u0C21\u0C4D\u200C\u0C32\u0C4B \u0C2E\u0C4A\u0C24\u0C4D\u0C24\u0C02 ${e} \u0C35\u0C30\u0C41\u0C38\u0C32\u0C41 \u0C09\u0C28\u0C4D\u0C28\u0C3E\u0C2F\u0C3F.`,highest:(e,t,o)=>`\u0C05\u0C24\u0C4D\u0C2F\u0C27\u0C3F\u0C15 ${e} \u0C35\u0C3F\u0C32\u0C41\u0C35 ${t}. \u0C07\u0C26\u0C3F ${o}\u0C15\u0C41 \u0C38\u0C02\u0C2C\u0C02\u0C27\u0C3F\u0C02\u0C1A\u0C3F\u0C28\u0C26\u0C3F.`,lowest:(e,t,o)=>`\u0C05\u0C24\u0C4D\u0C2F\u0C32\u0C4D\u0C2A ${e} \u0C35\u0C3F\u0C32\u0C41\u0C35 ${t}. \u0C07\u0C26\u0C3F ${o}\u0C15\u0C41 \u0C38\u0C02\u0C2C\u0C02\u0C27\u0C3F\u0C02\u0C1A\u0C3F\u0C28\u0C26\u0C3F.`,average:(e,t)=>`${e} \u0C38\u0C17\u0C1F\u0C41 \u0C35\u0C3F\u0C32\u0C41\u0C35 ${t}.`,total:(e,t)=>`${e} \u0C2E\u0C4A\u0C24\u0C4D\u0C24\u0C02 \u0C35\u0C3F\u0C32\u0C41\u0C35 ${t}.`,noData:"\u0C35\u0C3F\u0C36\u0C4D\u0C32\u0C47\u0C37\u0C3F\u0C02\u0C1A\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C21\u0C47\u0C1F\u0C3E \u0C32\u0C47\u0C26\u0C41.",noColumn:"\u0C35\u0C3F\u0C36\u0C4D\u0C32\u0C47\u0C37\u0C3F\u0C02\u0C1A\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C24\u0C17\u0C3F\u0C28 \u0C15\u0C3E\u0C32\u0C2E\u0C4D \u0C15\u0C28\u0C2C\u0C21\u0C32\u0C47\u0C26\u0C41.",noNumericData:e=>`${e}\u0C32\u0C4B \u0C38\u0C02\u0C16\u0C4D\u0C2F\u0C3E \u0C38\u0C2E\u0C3E\u0C1A\u0C3E\u0C30\u0C02 \u0C32\u0C47\u0C26\u0C41.`,notFound:e=>`\u201C${e}\u201D\u0C15\u0C41 \u0C38\u0C30\u0C3F\u0C2A\u0C4B\u0C32\u0C47 \u0C38\u0C2E\u0C3E\u0C1A\u0C3E\u0C30\u0C02 \u0C15\u0C28\u0C2C\u0C21\u0C32\u0C47\u0C26\u0C41.`,needName:"\u0C36\u0C4B\u0C27\u0C3F\u0C02\u0C1A\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C12\u0C15 \u0C35\u0C3F\u0C32\u0C41\u0C35 \u0C07\u0C35\u0C4D\u0C35\u0C02\u0C21\u0C3F.",fallback:"\u0C17\u0C4D\u0C30\u0C3F\u0C21\u0C4D\u200C\u0C32\u0C4B \u0C36\u0C4B\u0C27\u0C28, \u0C15\u0C4D\u0C30\u0C2E\u0C2C\u0C26\u0C4D\u0C27\u0C40\u0C15\u0C30\u0C23, \u0C32\u0C46\u0C15\u0C4D\u0C15\u0C3F\u0C02\u0C2A\u0C41 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C21\u0C47\u0C1F\u0C3E \u0C35\u0C3F\u0C36\u0C4D\u0C32\u0C47\u0C37\u0C23 \u0C1A\u0C47\u0C2F\u0C17\u0C32\u0C28\u0C41.",unsupportedVoice:"\u0C08 \u0C2C\u0C4D\u0C30\u0C4C\u0C1C\u0C30\u0C4D\u200C\u0C32\u0C4B \u0C35\u0C3E\u0C2F\u0C3F\u0C38\u0C4D \u0C07\u0C28\u0C4D\u200C\u0C2A\u0C41\u0C1F\u0C4D\u200C\u0C15\u0C41 \u0C2E\u0C26\u0C4D\u0C26\u0C24\u0C41 \u0C32\u0C47\u0C26\u0C41."}};function ue(e){return e.toLowerCase().trim().replace(/\s+/g," ")}function Lr(e,t){let o=ue(e);if(t==="te-IN")return/^(శోధించు|శోధించండి|వెతుకు|వెతకండి|చూపించు|చూపించండి|ఫిల్టర్)/.test(o)?{type:"search",payload:o.replace(/^(శోధించు|శోధించండి|వెతుకు|వెతకండి|చూపించు|చూపించండి|ఫిల్టర్)\s*/u,"").trim()||e}:/క్రమబద్ధీకర|అమర్చ|సార్ట్/.test(o)?{type:"sort",payload:{key:void 0,dir:/అవరోహణ|పెద్ద|అధిక|చివర/.test(o)?"desc":"asc"}}:/ఎన్ని|ఎంతమంది|లెక్క|మొత్తం వరుస|వరుసలు/.test(o)?{type:"question",payload:e}:/అత్యధిక|గరిష్ఠ|పెద్ద|ఎక్కువ/.test(o)?{type:"question",payload:e}:/అత్యల్ప|కనిష్ఠ|చిన్న|తక్కువ/.test(o)?{type:"question",payload:e}:/సగటు|సగటు విలువ/.test(o)?{type:"question",payload:e}:/మొత్తం|కలిపి/.test(o)?{type:"question",payload:e}:{type:"search",payload:e};if(/^(search|find|show|filter)/.test(o))return{type:"search",payload:o.replace(/^(search|find|show|filter)\s+(for\s+|by\s+)?/,"").trim()||e};if(/sort/.test(o)){let r=/desc|descending|high|higher|large|largest|top/.test(o);return{type:"sort",payload:{key:o.match(/(?:by|on)\s+([a-z0-9_-]+)/)?.[1],dir:r?"desc":"asc"}}}return/how many|count|highest|maximum|max|top|largest|lowest|minimum|min|smallest|bottom|average|avg|mean|sum|total|who|which|where|whose/.test(o)?{type:"question",payload:e}:{type:"search",payload:e}}function dn(e,t){let o=ue(e);return t.find(r=>{let i=ue(r.key),a=ue(r.label);return o.includes(i)||o.includes(a)})}function nt(e,t){return e.toLocaleString(t==="te-IN"?"te-IN":"en-IN")}function Rr(e,t,o,r){let i=cn[r];if(t.length===0)return i.noData;let a=ue(e),n=o.filter(v=>v.type==="number"),s=dn(e,o),l=s?.type==="number"?s:n[0],d=/how many|count|rows|ఎన్ని|ఎంతమంది|లెక్క|వరుసలు/.test(a);if(d)return i.count(t.length);if(/highest|maximum|max|top|largest|అత్యధిక|గరిష్ఠ|పెద్ద|ఎక్కువ/.test(a)){let v=s??l;if(!v)return i.noColumn;let T=t.map(A=>({row:A,value:Number(A[v.key])})).filter(A=>!Number.isNaN(A.value)).sort((A,$)=>$.value-A.value);if(T.length===0)return i.noNumericData(v.label);let z=T[0],k=o.find(A=>A.key==="name"||ue(A.label)==="name"),m=k?String(z.row[k.key]??""):r==="te-IN"?"\u0C08 \u0C35\u0C30\u0C41\u0C38":"this row";return i.highest(v.label,nt(z.value,r),m)}if(/lowest|minimum|min|smallest|bottom|అత్యల్ప|కనిష్ఠ|చిన్న|తక్కువ/.test(a)){let v=s??l;if(!v)return i.noColumn;let T=t.map(A=>({row:A,value:Number(A[v.key])})).filter(A=>!Number.isNaN(A.value)).sort((A,$)=>A.value-$.value);if(T.length===0)return i.noNumericData(v.label);let z=T[0],k=o.find(A=>A.key==="name"||ue(A.label)==="name"),m=k?String(z.row[k.key]??""):r==="te-IN"?"\u0C08 \u0C35\u0C30\u0C41\u0C38":"this row";return i.lowest(v.label,nt(z.value,r),m)}if(/average|avg|mean|సగటు/.test(a)){let v=s??l;if(!v)return i.noColumn;let T=t.map(k=>Number(k[v.key])).filter(k=>!Number.isNaN(k));if(T.length===0)return i.noNumericData(v.label);let z=T.reduce((k,m)=>k+m,0)/T.length;return i.average(v.label,nt(Math.round(z*100)/100,r))}if(/sum|total|మొత్తం|కలిపి/.test(a)&&!d){let v=s??l;if(!v)return i.noColumn;let T=t.map(k=>Number(k[v.key])).filter(k=>!Number.isNaN(k));if(T.length===0)return i.noNumericData(v.label);let z=T.reduce((k,m)=>k+m,0);return i.total(v.label,nt(z,r))}let U=a.match(/[\p{L}\p{N}_-]+/gu)??[],F=new Set(["who","what","which","where","whose","is","the","has","have","show","find","search","for","by","about"]),N=U.filter(v=>!F.has(v)).join(" ").trim();if(N){let v=t.find(T=>Object.values(T).some(z=>String(z??"").toLowerCase().includes(N.toLowerCase())));return v?o.map(T=>`${T.label}: ${String(v[T.key]??"")}`).join(r==="te-IN"?" \xB7 ":", "):i.notFound(N)}return i.fallback}function Ir(e,t){if(typeof window>"u"||!window.speechSynthesis)return;window.speechSynthesis.cancel();let o=new SpeechSynthesisUtterance(e);o.lang=t,o.rate=1,o.pitch=1,window.speechSynthesis.speak(o)}function Mr(e){let[t,o]=(0,Y.useState)(!1),[r,i]=(0,Y.useState)(""),[a,n]=(0,Y.useState)(!0),s=(0,Y.useRef)(null);(0,Y.useEffect)(()=>{if(typeof window>"u")return;let b=window.SpeechRecognition||window.webkitSpeechRecognition;if(!b){n(!1),s.current=null;return}let y=new b;return y.continuous=!1,y.interimResults=!1,y.lang=e,y.onresult=M=>{let _=M?.results?.[0]?.[0]?.transcript??"";i(_),o(!1)},y.onerror=()=>{o(!1)},y.onend=()=>{o(!1)},s.current=y,()=>{try{y.stop()}catch{}s.current=null}},[e]);let l=(0,Y.useCallback)(()=>{if(s.current){i(""),o(!0);try{s.current.start()}catch{o(!1)}}},[]),d=(0,Y.useCallback)(()=>{try{s.current?.stop()}catch{}o(!1)},[]);return{listening:t,transcript:r,supported:a,start:l,stop:d}}function Pr(){return(0,w.jsxs)("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,w.jsx)("circle",{cx:"11",cy:"11",r:"6.5"}),(0,w.jsx)("path",{d:"m16 16 5 5"})]})}function Nr(){return(0,w.jsxs)("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,w.jsx)("rect",{x:"8",y:"3",width:"8",height:"12",rx:"4"}),(0,w.jsx)("path",{d:"M5 11a7 7 0 0 0 14 0"}),(0,w.jsx)("path",{d:"M12 18v3"}),(0,w.jsx)("path",{d:"M8 21h8"})]})}function zr(){return(0,w.jsxs)("svg",{width:"17",height:"17",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,w.jsx)("path",{d:"m4 4 16 8-16 8 4-8-4-8Z"}),(0,w.jsx)("path",{d:"M8 12h12"})]})}function Fr(){return(0,w.jsxs)("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,w.jsx)("path",{d:"m6 6 12 12"}),(0,w.jsx)("path",{d:"m18 6-12 12"})]})}function $r({data:e,columns:t,onSearch:o,onSort:r,theme:i="light",language:a="en-US",inputLanguage:n="en-US",embedded:s=!1}){let l=cn[a],d=i==="dark",[b,y]=(0,Y.useState)(s),[M,_]=(0,Y.useState)(""),[U,F]=(0,Y.useState)([]),L=(0,Y.useRef)(null),{listening:N,transcript:v,supported:T,start:z,stop:k}=Mr(n),m=(0,Y.useMemo)(()=>({bg:d?"#0F172A":"#FFFFFF",surface:d?"#1E293B":"#F8FAFC",border:d?"#334155":"#E2E8F0",text:d?"#F1F5F9":"#0F172A",muted:d?"#94A3B8":"#64748B",accent:"#10B981",userMsg:d?"#334155":"#DBEAFE",aiMsg:d?"#1E293B":"#F0FDF4"}),[d]),A=(0,Y.useMemo)(()=>({role:"ai",text:a==="te-IN"?"\u0C2E\u0C40 \u0C17\u0C4D\u0C30\u0C3F\u0C21\u0C4D \u0C21\u0C47\u0C1F\u0C3E \u0C17\u0C41\u0C30\u0C3F\u0C02\u0C1A\u0C3F \u0C2A\u0C4D\u0C30\u0C36\u0C4D\u0C28 \u0C05\u0C21\u0C17\u0C02\u0C21\u0C3F.":"Ask me about your grid data.",time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}),[a]);(0,Y.useEffect)(()=>{F(G=>G.length>0?G:[A])},[A]),(0,Y.useEffect)(()=>{L.current?.scrollIntoView({behavior:"smooth"})},[U]);let $=(0,Y.useCallback)(G=>{let p=G.trim();if(!p)return;let D=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});F(O=>[...O,{role:"user",text:p,time:D}]),_("");let q=Lr(p,a),j="";if(q.type==="search"){let O=String(q.payload??p);o(O),j=l.searchStarted(O)}if(q.type==="sort"){let O=q.payload?.key,ie=O?t.find(J=>ue(J.key)===ue(O)||ue(J.label)===ue(O)):void 0;if(ie||(ie=dn(p,t)),ie&&r){let J=q.payload?.dir==="desc"?"desc":"asc";r(String(ie.key),J),j=J==="asc"?l.sortedAscending(ie.label):l.sortedDescending(ie.label)}else j=l.noColumn}q.type==="question"&&(j=Rr(q.payload??p,e,t,a)),j||(j=l.fallback),window.setTimeout(()=>{let O=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});F(ie=>[...ie,{role:"ai",text:j,time:O}]),Ir(j,a)},250)},[t,e,a,o,r,l]);(0,Y.useEffect)(()=>{v&&$(v)},[v,$]);let B=()=>{$(M)},P=a==="te-IN"?["\u0C05\u0C24\u0C4D\u0C2F\u0C27\u0C3F\u0C15 \u0C35\u0C3F\u0C32\u0C41\u0C35","\u0C0E\u0C28\u0C4D\u0C28\u0C3F \u0C35\u0C30\u0C41\u0C38\u0C32\u0C41","\u0C38\u0C17\u0C1F\u0C41 \u0C35\u0C3F\u0C32\u0C41\u0C35","\u0C36\u0C4B\u0C27\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F"]:["highest value","how many rows","average value","search"],re=(0,w.jsxs)("div",{style:{width:s?"100%":360,maxWidth:s?"100%":"calc(100vw - 48px)",height:s?390:480,maxHeight:"70vh",background:m.bg,border:`1px solid ${m.border}`,borderRadius:s?12:16,boxShadow:s?"none":"0 20px 40px rgba(0,0,0,0.15)",display:"flex",flexDirection:"column",overflow:"hidden"},children:[(0,w.jsxs)("div",{style:{padding:"12px 14px",background:m.accent,color:"#FFFFFF",display:"flex",alignItems:"center",gap:10},children:[(0,w.jsx)("div",{style:{width:34,height:34,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.18)",fontSize:17},children:"AI"}),(0,w.jsxs)("div",{style:{flex:1,minWidth:0},children:[(0,w.jsx)("div",{style:{fontWeight:700,fontSize:14},children:l.title}),(0,w.jsx)("div",{style:{fontSize:11,opacity:.9},children:l.subtitle})]}),!s&&(0,w.jsx)("button",{type:"button",onClick:()=>y(!1),"aria-label":l.close,title:l.close,style:{width:32,height:32,border:"none",borderRadius:8,background:"rgba(255,255,255,0.12)",color:"#FFFFFF",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"},children:(0,w.jsx)(Fr,{})})]}),(0,w.jsxs)("div",{style:{padding:"8px 10px",borderBottom:`1px solid ${m.border}`,display:"flex",alignItems:"center",gap:8,background:m.surface},children:[(0,w.jsx)("span",{style:{fontSize:11,color:m.muted},children:l.inputLanguage}),(0,w.jsxs)("select",{value:n,disabled:!0,"aria-label":l.inputLanguage,style:{padding:"5px 8px",borderRadius:7,border:`1px solid ${m.border}`,background:m.bg,color:m.text,fontSize:11},children:[(0,w.jsx)("option",{value:"en-US",children:l.english}),(0,w.jsx)("option",{value:"te-IN",children:l.telugu})]})]}),(0,w.jsxs)("div",{style:{flex:1,overflowY:"auto",padding:10,display:"flex",flexDirection:"column",gap:8},children:[U.map((G,p)=>(0,w.jsxs)("div",{style:{alignSelf:G.role==="user"?"flex-end":"flex-start",maxWidth:"88%",padding:"8px 11px",borderRadius:11,background:G.role==="user"?m.userMsg:m.aiMsg,color:m.text,fontSize:13,lineHeight:1.5},children:[(0,w.jsx)("div",{children:G.text}),(0,w.jsx)("div",{style:{marginTop:3,fontSize:10,opacity:.55,textAlign:"right"},children:G.time})]},`${G.time}-${p}`)),N&&(0,w.jsx)("div",{style:{alignSelf:"flex-end",padding:"8px 11px",borderRadius:11,background:d?"#3F1D2E":"#FEE2E2",color:d?"#FCA5A5":"#991B1B",fontSize:13},children:l.listening}),(0,w.jsx)("div",{ref:L})]}),(0,w.jsx)("div",{style:{padding:"7px 10px",borderTop:`1px solid ${m.border}`,display:"flex",gap:6,overflowX:"auto",flexShrink:0},children:P.map(G=>(0,w.jsx)("button",{type:"button",onClick:()=>$(G),style:{padding:"5px 9px",borderRadius:12,border:`1px solid ${m.border}`,background:m.surface,color:m.text,fontSize:10.5,cursor:"pointer",whiteSpace:"nowrap"},children:G},G))}),(0,w.jsxs)("div",{style:{padding:9,display:"flex",gap:6,borderTop:`1px solid ${m.border}`,background:m.surface},children:[(0,w.jsxs)("div",{style:{position:"relative",flex:1},children:[(0,w.jsx)(Pr,{}),(0,w.jsx)("input",{type:"text",value:M,onChange:G=>_(G.target.value),onKeyDown:G=>{G.key==="Enter"&&B()},placeholder:l.placeholder,"aria-label":l.ask,style:{width:"100%",boxSizing:"border-box",padding:"9px 10px 9px 34px",borderRadius:8,border:`1px solid ${m.border}`,background:m.bg,color:m.text,fontSize:12,outline:"none"}})]}),T?(0,w.jsx)("button",{type:"button",onClick:N?k:z,"aria-label":N?l.listening:l.inputLanguage,title:N?l.listening:l.inputLanguage,style:{width:38,height:38,border:"none",borderRadius:8,background:N?"#EF4444":m.accent,color:"#FFFFFF",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0},children:(0,w.jsx)(Nr,{})}):null,(0,w.jsx)("button",{type:"button",onClick:B,disabled:!M.trim(),"aria-label":l.send,title:l.send,style:{width:38,height:38,border:"none",borderRadius:8,background:M.trim()?m.accent:m.muted,color:"#FFFFFF",display:"flex",alignItems:"center",justifyContent:"center",cursor:M.trim()?"pointer":"not-allowed",opacity:M.trim()?1:.6,flexShrink:0},children:(0,w.jsx)(zr,{})})]})]});return s?(0,w.jsx)("div",{style:{width:"100%",minWidth:0},children:b?re:(0,w.jsxs)("button",{type:"button",onClick:()=>y(!0),"aria-label":l.open,style:{minHeight:40,padding:"8px 13px",borderRadius:9,border:"1px solid #10B981",background:d?"#064E3B":"#ECFDF5",color:d?"#A7F3D0":"#047857",display:"inline-flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:12,fontWeight:600},children:[(0,w.jsx)("span",{"aria-hidden":"true",children:"AI"}),l.ask]})}):(0,w.jsxs)(w.Fragment,{children:[!b&&(0,w.jsx)("button",{type:"button",onClick:()=>y(!0),"aria-label":l.open,title:l.title,style:{position:"fixed",bottom:24,right:24,zIndex:9998,width:56,height:56,borderRadius:28,background:m.accent,color:"#FFFFFF",border:"none",cursor:"pointer",boxShadow:"0 8px 20px rgba(16,185,129,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14},children:"AI"}),b&&(0,w.jsx)("div",{style:{position:"fixed",bottom:90,right:24,zIndex:9997},children:re}),(0,w.jsx)("style",{children:`
        @keyframes yuktai-ai-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `})]})}var rt=$r;var x=require("react/jsx-runtime"),Gr={"en-US":{search:"Search...",searchAria:"Search grid",rows:"rows",row:"row",loading:"Loading...",noData:"No data found.",selectRow:"Select row",pageSize:"Page size",page:"Page",of:"of",previous:"Previous",next:"Next",yes:"Yes",no:"No",sortAscending:"Sort ascending",sortDescending:"Sort descending"},"te-IN":{search:"\u0C36\u0C4B\u0C27\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F...",searchAria:"\u0C17\u0C4D\u0C30\u0C3F\u0C21\u0C4D\u200C\u0C32\u0C4B \u0C36\u0C4B\u0C27\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F",rows:"\u0C35\u0C30\u0C41\u0C38\u0C32\u0C41",row:"\u0C35\u0C30\u0C41\u0C38",loading:"\u0C32\u0C4B\u0C21\u0C4D \u0C05\u0C35\u0C41\u0C24\u0C4B\u0C02\u0C26\u0C3F...",noData:"\u0C21\u0C47\u0C1F\u0C3E \u0C15\u0C28\u0C2C\u0C21\u0C32\u0C47\u0C26\u0C41.",selectRow:"\u0C35\u0C30\u0C41\u0C38\u0C28\u0C41 \u0C0E\u0C02\u0C1A\u0C41\u0C15\u0C4B\u0C02\u0C21\u0C3F",pageSize:"\u0C2A\u0C47\u0C1C\u0C40 \u0C2A\u0C30\u0C3F\u0C2E\u0C3E\u0C23\u0C02",page:"\u0C2A\u0C47\u0C1C\u0C40",of:"\u0C32\u0C4B",previous:"\u0C35\u0C46\u0C28\u0C41\u0C15\u0C15\u0C41",next:"\u0C2E\u0C41\u0C02\u0C26\u0C41\u0C15\u0C41",yes:"\u0C05\u0C35\u0C41\u0C28\u0C41",no:"\u0C15\u0C3E\u0C26\u0C41",sortAscending:"\u0C06\u0C30\u0C4B\u0C39\u0C23 \u0C15\u0C4D\u0C30\u0C2E\u0C02\u0C32\u0C4B \u0C05\u0C2E\u0C30\u0C4D\u0C1A\u0C02\u0C21\u0C3F",sortDescending:"\u0C05\u0C35\u0C30\u0C4B\u0C39\u0C23 \u0C15\u0C4D\u0C30\u0C2E\u0C02\u0C32\u0C4B \u0C05\u0C2E\u0C30\u0C4D\u0C1A\u0C02\u0C21\u0C3F"}};function Wr({size:e=20,color:t="currentColor",strokeWidth:o=2.4}){return(0,x.jsxs)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:o,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,x.jsx)("circle",{cx:"11",cy:"11",r:"6.5"}),(0,x.jsx)("path",{d:"m16 16 5 5"})]})}function Hr({size:e=18,color:t="currentColor",strokeWidth:o=2.4,label:r}){return(0,x.jsxs)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:o,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":r?void 0:!0,"aria-label":r,role:r?"img":void 0,children:[r?(0,x.jsx)("title",{children:r}):null,(0,x.jsx)("path",{d:"m6 15 6-6 6 6"})]})}function Br({size:e=18,color:t="currentColor",strokeWidth:o=2.4,label:r}){return(0,x.jsxs)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:o,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":r?void 0:!0,"aria-label":r,role:r?"img":void 0,children:[r?(0,x.jsx)("title",{children:r}):null,(0,x.jsx)("path",{d:"m6 9 6 6 6-6"})]})}function Or({size:e=20,color:t="currentColor",strokeWidth:o=2.4}){return(0,x.jsx)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:o,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,x.jsx)("path",{d:"m15 18-6-6 6-6"})})}function _r({size:e=20,color:t="currentColor",strokeWidth:o=2.4}){return(0,x.jsx)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:o,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,x.jsx)("path",{d:"m9 18 6-6-6-6"})})}function un({size:e=18,color:t="currentColor",strokeWidth:o=2.4}){return(0,x.jsx)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:o,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,x.jsx)("path",{d:"m5 12 4 4L19 6"})})}function pn({data:e,columns:t,rowKey:o="id",view:r="auto",mobileBreakpoint:i=768,theme:a="default",locale:n="en-US",ai:s=!1,search:l=!0,selectable:d=!1,selectedKeys:b=[],onSelectionChange:y,pagination:M,loading:_=!1,highlightIds:U=[],highlightColor:F="#fff3a3",autoScrollToHighlight:L=!1,onRowClick:N,onSortChange:v,empty:T,className:z=""}){let k=n==="te-IN"?"te-IN":"en-US",m=Gr[k],A=s===!0||typeof s=="object"&&s!==null,$=M!==!1&&M!==void 0,B=typeof M=="object"?M.pageSize??20:20,P=typeof M=="object"&&M.sizeOptions&&M.sizeOptions.length>0?M.sizeOptions:[10,20,50,100],[re,G]=(0,ne.useState)(""),[p,D]=(0,ne.useState)(1),[q,j]=(0,ne.useState)(B),[O,ie]=(0,ne.useState)(),[J,le]=(0,ne.useState)("asc"),[ye,De]=(0,ne.useState)(!1);(0,ne.useEffect)(()=>{j(B),D(1)},[B]),(0,ne.useEffect)(()=>{let f=()=>{De(window.innerWidth<=i)};return f(),window.addEventListener("resize",f),()=>{window.removeEventListener("resize",f)}},[i]);let ce=(0,ne.useMemo)(()=>{let f=[...e];if(re.trim()){let u=re.trim().toLowerCase();f=f.filter(S=>t.some(E=>String(S[E.key]??"").toLowerCase().includes(u)))}return O&&f.sort((u,S)=>{let E=u[O],ee=S[O];if(E==null&&ee==null)return 0;if(E==null)return 1;if(ee==null)return-1;if(typeof E=="number"&&typeof ee=="number")return J==="asc"?E-ee:ee-E;let Q=String(E).localeCompare(String(ee),n,{numeric:!0,sensitivity:"base"});return J==="asc"?Q:-Q}),f},[e,t,re,O,J,n]),K=$?Math.max(1,Math.ceil(ce.length/q)):1;(0,ne.useEffect)(()=>{p>K&&D(K)},[p,K]),(0,ne.useEffect)(()=>{if(!L)return;let f=U[0];if(f==null)return;let u=typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(String(f)):String(f).replace(/["\\]/g,"\\$&");document.querySelector(`[data-yuktai-row-id="${u}"]`)?.scrollIntoView({behavior:"smooth",block:"center"})},[U,L,p]);let Re=(0,ne.useMemo)(()=>{if(!$)return ce;let f=(p-1)*q;return ce.slice(f,f+q)},[ce,$,p,q]),ft=r==="card"||r==="auto"&&ye,xe=f=>String(f[o]??""),ve=f=>b.some(u=>String(u)===f),mt=f=>U.some(u=>String(u)===f),ge=f=>{if(!d)return;let u=xe(f),S=ve(u)?b.filter(E=>String(E)!==u):[...b,u];y?.(S)},Ie=f=>{if(f.sortable===!1)return;let u=String(f.key),S=O===u&&J==="asc"?"desc":"asc";ie(u),le(S),D(1),v?.({key:u,direction:S})},qe=f=>{G(f),D(1)},je=(f,u)=>{let S=t.find(E=>String(E.key)===f||E.label.toLowerCase()===f.toLowerCase());S&&(ie(String(S.key)),le(u),D(1),v?.({key:String(S.key),direction:u}))},Me=(f,u,S)=>{if(u.render)return u.render(f[u.key],f,S);let E=f[u.key];if(E==null)return"";if(u.type==="date"){let ee=new Date(String(E));if(!Number.isNaN(ee.getTime()))return ee.toLocaleDateString(n)}return u.type==="boolean"?E?m.yes:m.no:String(E)},W=a==="dark",be={width:"100%",overflow:"hidden",border:a==="high-contrast"?"2px solid #000000":W?"1px solid #334155":"1px solid #e2e8f0",borderRadius:12,background:W?"#0f172a":"#ffffff",color:W?"#f8fafc":"#0f172a",fontFamily:a==="dyslexia"?"Arial, sans-serif":void 0},we={padding:12,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",borderBottom:W?"1px solid #334155":"1px solid #e2e8f0"},he=f=>({width:40,height:40,minWidth:40,display:"inline-flex",alignItems:"center",justifyContent:"center",padding:0,borderRadius:8,border:W?"1px solid #475569":"1px solid #cbd5e1",background:f?W?"#1e293b":"#f8fafc":W?"#1e293b":"#ffffff",color:f?"#94a3b8":W?"#f8fafc":"#0f172a",cursor:f?"not-allowed":"pointer",opacity:f?.55:1});if(_)return(0,x.jsx)("div",{className:z,style:be,children:(0,x.jsx)("div",{style:{padding:32,textAlign:"center"},children:m.loading})});let Ye=t.map(f=>({key:String(f.key),label:f.label,type:f.type==="number"?"number":f.type==="date"?"date":"text"}));return(0,x.jsxs)("div",{className:z,style:be,children:[(l||A)&&(0,x.jsxs)("div",{style:we,children:[l&&(0,x.jsxs)("div",{style:{position:"relative",width:"100%",maxWidth:420},children:[(0,x.jsx)("div",{style:{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",display:"flex",alignItems:"center",color:W?"#cbd5e1":"#64748b",pointerEvents:"none"},children:(0,x.jsx)(Wr,{size:19})}),(0,x.jsx)("input",{value:re,onChange:f=>{G(f.target.value),D(1)},placeholder:m.search,"aria-label":m.searchAria,style:{width:"100%",padding:"10px 12px 10px 40px",borderRadius:8,border:W?"1px solid #475569":"1px solid #cbd5e1",background:W?"#1e293b":"#ffffff",color:W?"#ffffff":"#0f172a",outline:"none",boxSizing:"border-box"}})]}),(0,x.jsxs)("div",{style:{marginLeft:"auto",fontSize:13,opacity:.7,whiteSpace:"nowrap"},children:[ce.length," ",ce.length===1?m.row:m.rows]}),A&&(0,x.jsx)(rt,{data:e,columns:Ye,onSearch:qe,onSort:je,theme:W?"dark":"light",language:k,inputLanguage:"en-US",embedded:!0})]}),ce.length===0?(0,x.jsx)("div",{style:{padding:40,textAlign:"center",opacity:.7},children:T??m.noData}):ft?(0,x.jsx)("div",{style:{display:"grid",gap:12,padding:12},children:Re.map((f,u)=>{let S=xe(f),E=ve(S),ee=mt(S);return(0,x.jsxs)("div",{"data-yuktai-row-id":S,onClick:()=>N?.(f,u),style:{padding:14,borderRadius:10,border:W?"1px solid #334155":"1px solid #e2e8f0",background:ee?F:E?W?"#1e3a5f":"#eff6ff":W?"#1e293b":"#ffffff",cursor:N?"pointer":"default"},children:[d&&(0,x.jsx)("button",{type:"button",onClick:Q=>{Q.stopPropagation(),ge(f)},"aria-label":`${m.selectRow} ${S}`,"aria-pressed":E,style:{width:32,height:32,display:"inline-flex",alignItems:"center",justifyContent:"center",padding:0,marginBottom:10,borderRadius:7,border:E?"1px solid #2563eb":"1px solid #cbd5e1",background:E?"#2563eb":"transparent",color:E?"#ffffff":"currentColor",cursor:"pointer"},children:E&&(0,x.jsx)(un,{size:17})}),t.map(Q=>(0,x.jsxs)("div",{style:{display:"flex",gap:8,padding:"5px 0",alignItems:"flex-start"},children:[(0,x.jsx)("strong",{style:{minWidth:100,opacity:.7},children:Q.label}),(0,x.jsx)("span",{children:Me(f,Q,u)})]},String(Q.key)))]},S)})}):(0,x.jsx)("div",{style:{width:"100%",overflowX:"auto"},children:(0,x.jsxs)("table",{style:{width:"100%",borderCollapse:"collapse"},children:[(0,x.jsx)("thead",{children:(0,x.jsxs)("tr",{children:[d&&(0,x.jsx)("th",{style:{padding:10,borderBottom:W?"1px solid #334155":"1px solid #e2e8f0",width:52}}),t.filter(f=>!(ye&&f.hiddenOnMobile)).map(f=>{let u=O===String(f.key);return(0,x.jsx)("th",{onClick:()=>Ie(f),style:{padding:10,textAlign:f.align??"left",borderBottom:W?"1px solid #334155":"1px solid #e2e8f0",whiteSpace:"nowrap",cursor:f.sortable===!1?"default":"pointer",width:f.width,userSelect:"none"},children:(0,x.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:5},children:[f.label,u&&(J==="asc"?(0,x.jsx)(Hr,{size:17,label:m.sortAscending}):(0,x.jsx)(Br,{size:17,label:m.sortDescending}))]})},String(f.key))})]})}),(0,x.jsx)("tbody",{children:Re.map((f,u)=>{let S=xe(f),E=ve(S),ee=mt(S);return(0,x.jsxs)("tr",{"data-yuktai-row-id":S,onClick:()=>N?.(f,u),style:{background:ee?F:E?W?"#1e3a5f":"#eff6ff":"transparent",cursor:N?"pointer":"default"},children:[d&&(0,x.jsx)("td",{style:{padding:10,borderBottom:W?"1px solid #334155":"1px solid #e2e8f0"},children:(0,x.jsx)("button",{type:"button",onClick:Q=>{Q.stopPropagation(),ge(f)},"aria-label":`${m.selectRow} ${S}`,"aria-pressed":E,style:{width:28,height:28,display:"inline-flex",alignItems:"center",justifyContent:"center",padding:0,borderRadius:6,border:E?"1px solid #2563eb":W?"1px solid #64748b":"1px solid #cbd5e1",background:E?"#2563eb":"transparent",color:E?"#ffffff":"currentColor",cursor:"pointer"},children:E&&(0,x.jsx)(un,{size:16})})}),t.filter(Q=>!(ye&&Q.hiddenOnMobile)).map(Q=>(0,x.jsx)("td",{style:{padding:10,textAlign:Q.align??"left",borderBottom:W?"1px solid #334155":"1px solid #e2e8f0"},children:Me(f,Q,u)},String(Q.key)))]},S)})})]})}),$&&(0,x.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap",padding:12,borderTop:W?"1px solid #334155":"1px solid #e2e8f0"},children:[(0,x.jsxs)("span",{style:{fontSize:13,opacity:.7},children:[m.page," ",p," ",m.of," ",K]}),(0,x.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"},children:[typeof M=="object"&&M.showSizeChanger&&(0,x.jsx)("select",{value:q,onChange:f=>{let u=Number(f.target.value);!Number.isFinite(u)||u<=0||(j(u),D(1))},"aria-label":m.pageSize,style:{minHeight:40,padding:"7px 10px",borderRadius:8,border:W?"1px solid #475569":"1px solid #cbd5e1",background:W?"#1e293b":"#ffffff",color:W?"#ffffff":"#0f172a"},children:P.map(f=>(0,x.jsx)("option",{value:f,children:f},f))}),(0,x.jsx)("button",{type:"button",disabled:p<=1,onClick:()=>D(f=>Math.max(1,f-1)),"aria-label":m.previous,title:m.previous,style:he(p<=1),children:(0,x.jsx)(Or,{size:20})}),(0,x.jsx)("button",{type:"button",disabled:p>=K,onClick:()=>D(f=>Math.min(K,f+1)),"aria-label":m.next,title:m.next,style:he(p>=K),children:(0,x.jsx)(_r,{size:20})})]})]})]})}g();var X=require("react");function Dr(e){return e===!1?Number.MAX_SAFE_INTEGER:e===!0||e===void 0?10:e.pageSize??10}function fn(e){let{data:t,columns:o,pagination:r=!0,mobileBreakpoint:i=768}=e,[a,n]=(0,X.useState)(null),[s,l]=(0,X.useState)(""),[d,b]=(0,X.useState)(1),[y,M]=(0,X.useState)(Dr(r)),[_,U]=(0,X.useState)(!1);(0,X.useEffect)(()=>{if(typeof window>"u")return;let m=()=>{U(window.innerWidth<i)};return m(),window.addEventListener("resize",m),()=>window.removeEventListener("resize",m)},[i]);let F=(0,X.useCallback)(m=>{n(A=>!A||A.key!==m?{key:m,direction:"asc"}:A.direction==="asc"?{key:m,direction:"desc"}:null),b(1)},[]),L=(0,X.useCallback)(()=>n(null),[]),N=(0,X.useMemo)(()=>{if(!s.trim())return t;let m=s.toLowerCase().trim();return t.filter(A=>o.some($=>{let B=A[$.key];return B==null?!1:String(B).toLowerCase().includes(m)}))},[t,s,o]),v=(0,X.useMemo)(()=>{if(!a)return N;let m=[...N].sort((A,$)=>{let B=A[a.key],P=$[a.key];if(B===P)return 0;if(B==null)return 1;if(P==null)return-1;if(typeof B=="number"&&typeof P=="number")return B-P;if(B instanceof Date&&P instanceof Date)return B.getTime()-P.getTime();let re=String(B),G=String(P);return re.localeCompare(G,void 0,{sensitivity:"base",numeric:!0})});return a.direction==="desc"?m.reverse():m},[N,a]),T=Math.max(1,Math.ceil(v.length/y)),z=(0,X.useMemo)(()=>{if(r===!1)return v;let m=(d-1)*y;return v.slice(m,m+y)},[v,d,y,r]),k=(0,X.useCallback)(()=>{n(null),l(""),b(1)},[]);return(0,X.useEffect)(()=>{d>T&&b(T)},[d,T]),{displayedData:z,totalCount:t.length,filteredCount:v.length,sort:a,toggleSort:F,clearSort:L,searchQuery:s,setSearchQuery:l,page:d,pageSize:y,totalPages:T,setPage:b,setPageSize:M,isMobile:_,reset:k}}g();var mn=require("react");g();function it(e,t){let o=t.trim().toLowerCase(),r=e.data.filter(a=>e.columns.some(n=>String(a[n.key]??"").toLowerCase().includes(o))),i=r.map(a=>String(a.id??"")).filter(Boolean);return e.onHighlightRows?.(i),{success:!0,message:`${r.length} row(s) found.`,data:r}}function at(e){return{success:!0,message:`${e.data.length} row(s).`,data:e.data.length}}function st(e){return{success:!0,message:"Grid columns retrieved.",data:e.columns}}function lt(e,t){let o=e.data.find(r=>String(r.id??"")===t);return o?{success:!0,message:"Row found.",data:o}:{success:!1,message:`Row "${t}" not found.`}}function ct(e,t){return e.onHighlightRows?.(t),{success:!0,message:`${t.length} row(s) highlighted.`,data:t}}function dt(e,t){return e.onSelectRow?.(t),{success:!0,message:`Row "${t}" selected.`,data:t}}function ut(e,t){return e.onOpenRow?.(t),{success:!0,message:`Row "${t}" opened.`,data:t}}function Ft({data:e,columns:t,name:o="yuktai_grid",onSelectRow:r,onHighlightRows:i,onOpenRow:a}){return(0,mn.useEffect)(()=>{let n=document.modelContext;if(!n)return;let s=new AbortController,l={data:e,columns:t,onSelectRow:r,onHighlightRows:i,onOpenRow:a};return(async()=>{await n.registerTool({name:`${o}_search`,title:"Search Grid",description:"Search the grid.",inputSchema:{type:"object",properties:{query:{type:"string"}},required:["query"]},execute:async({query:b})=>it(l,b)},{signal:s.signal}),await n.registerTool({name:`${o}_count`,title:"Count Grid",description:"Count grid rows.",inputSchema:{type:"object",properties:{}},execute:async()=>at(l)},{signal:s.signal}),await n.registerTool({name:`${o}_columns`,title:"Get Grid Columns",description:"Get grid columns.",inputSchema:{type:"object",properties:{}},execute:async()=>st(l)},{signal:s.signal}),await n.registerTool({name:`${o}_get_row`,title:"Get Grid Row",description:"Get a grid row by ID.",inputSchema:{type:"object",properties:{id:{type:"string"}},required:["id"]},execute:async({id:b})=>lt(l,b)},{signal:s.signal}),await n.registerTool({name:`${o}_highlight`,title:"Highlight Grid Rows",description:"Highlight grid rows.",inputSchema:{type:"object",properties:{ids:{type:"array",items:{type:"string"}}},required:["ids"]},execute:async({ids:b})=>ct(l,b)},{signal:s.signal}),await n.registerTool({name:`${o}_select`,title:"Select Grid Row",description:"Select a grid row.",inputSchema:{type:"object",properties:{id:{type:"string"}},required:["id"]},execute:async({id:b})=>dt(l,b)},{signal:s.signal}),await n.registerTool({name:`${o}_open`,title:"Open Grid Row",description:"Open a grid row.",inputSchema:{type:"object",properties:{id:{type:"string"}},required:["id"]},execute:async({id:b})=>ut(l,b)},{signal:s.signal})})().catch(()=>{}),()=>{s.abort()}},[e,t,o,r,i,a]),null}g();var pt=require("react");function $t({tools:e,onResult:t,onError:o}){let[r,i]=(0,pt.useState)(!1),a=(0,pt.useCallback)(async(n,s={})=>{let l=e.find(d=>d.name===n);if(!l){let d=new Error(`Tool "${n}" not found.`);throw o?.(d),d}i(!0);try{let d=await l.execute(s);return t?.(d),d}catch(d){let b=d instanceof Error?d:new Error(String(d));throw o?.(b),b}finally{i(!1)}},[e,t,o]);return{loading:r,tools:e,executeTool:a}}var gn=$t;g();g();var bn=require("react/jsx-runtime");function Z({size:e=20,color:t="currentColor",strokeWidth:o=2.5,label:r,children:i,...a}){return(0,bn.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:o,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!r?"true":void 0,"aria-label":r,role:r?"img":void 0,focusable:"false",...a,children:i})}g();var He=require("react/jsx-runtime");function Gt(e){return(0,He.jsxs)(Z,{...e,children:[(0,He.jsx)("circle",{cx:"11",cy:"11",r:"7"}),(0,He.jsx)("path",{d:"m20 20-4-4"})]})}g();var Be=require("react/jsx-runtime");function Wt(e){return(0,Be.jsxs)(Z,{...e,children:[(0,Be.jsx)("path",{d:"M12 19V5"}),(0,Be.jsx)("path",{d:"m5 12 7-7 7 7"})]})}g();var Oe=require("react/jsx-runtime");function Ht(e){return(0,Oe.jsxs)(Z,{...e,children:[(0,Oe.jsx)("path",{d:"M12 5v14"}),(0,Oe.jsx)("path",{d:"m5 12 7 7 7-7"})]})}g();var Bt=require("react/jsx-runtime");function Ot(e){return(0,Bt.jsx)(Z,{...e,children:(0,Bt.jsx)("path",{d:"m15 18-6-6 6-6"})})}g();var _t=require("react/jsx-runtime");function Dt(e){return(0,_t.jsx)(Z,{...e,children:(0,_t.jsx)("path",{d:"m9 18 6-6-6-6"})})}g();var qt=require("react/jsx-runtime");function jt(e){return(0,qt.jsx)(Z,{...e,children:(0,qt.jsx)("path",{d:"M5 12.5 10 17.5 19.5 7"})})}g();var _e=require("react/jsx-runtime");function Yt(e){return(0,_e.jsxs)(Z,{...e,children:[(0,_e.jsx)("path",{d:"M18 6 6 18"}),(0,_e.jsx)("path",{d:"m6 6 12 12"})]})}function qr(){if(typeof globalThis>"u")return new me;if(!globalThis.__yuktai_runtime__){let e=new me;e.register(ae.name,ae),e.register(Ge.name,Ge),e.register(We.name,We),globalThis.__yuktai_runtime__=e}return globalThis.__yuktai_runtime__}var hn=typeof window<"u"?qr():new me,jr={wcagPlugin:ae,list(){return hn.getPlugins()},use(e){return hn.use(e)},fix(e){return ae.applyFixes({enabled:!0,autoFix:!0,...e})},scan(){return ae.scan()}};
