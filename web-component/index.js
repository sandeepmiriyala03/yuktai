// yuktai-a11y · web-component/index.js
// <script type="module" src="cdn.../web-component/index.js"></script>
// <yuktai-a11y position="left"></yuktai-a11y>

import { wcagPlugin } from "../core/renderer.js";

const FONT_STEPS = [80,90,100,110,120,130,140,150];
const OPTIONS = [
  { id:"highContrast", label:"High contrast",         desc:"contrast(1.15) brightness on all nodes", icon:"◑"  },
  { id:"reduceMotion", label:"Reduce motion",          desc:"Disables all transitions & animations",   icon:"⏸"  },
  { id:"autoFix",      label:"Auto-fix ARIA",          desc:"MutationObserver on new DOM nodes",       icon:"♿" },
  { id:"dyslexiaFont", label:"Dyslexia-friendly font", desc:"Wider letter & word spacing",             icon:"Aa" },
];

const CSS = `
  :host{display:contents;}
  .fab{position:fixed;bottom:24px;width:52px;height:52px;border-radius:50%;background:#0d9488;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,0.18);z-index:9999;transition:background 0.2s,transform 0.15s;outline:none;}
  .fab:hover{transform:scale(1.08);}
  .fab.active{background:#0f766e;}
  .dot{position:absolute;top:4px;right:4px;width:10px;height:10px;border-radius:50%;background:#5eead4;border:2px solid #fff;display:none;}
  .fab.active .dot{display:block;}
  .panel{position:fixed;bottom:24px;width:312px;background:#fff;border:1px solid #e2e8f0;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.12);z-index:9998;overflow:hidden;font-family:system-ui,-apple-system,sans-serif;display:none;}
  .panel.open{display:block;}
  .track{position:absolute;inset:0;border-radius:99px;background:#cbd5e1;transition:background 0.2s;}
  .thumb{position:absolute;top:3px;left:3px;width:18px;height:18px;background:#fff;border-radius:50%;transition:left 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.2);pointer-events:none;}
  input:checked~.track{background:#0d9488;}
  input:checked~.thumb{left:19px;}
  .fbar{flex:1;height:6px;border-radius:99px;border:none;cursor:pointer;padding:0;background:#e2e8f0;transition:background 0.15s;}
  .fbar.on{background:#0d9488;}
  .rep{margin:0 14px;padding:8px 12px;background:#f0fdfa;border:1px solid #99f6e4;border-radius:8px;font-size:12px;color:#0f766e;font-weight:500;font-family:monospace;display:none;}
  .rep.show{display:block;}
  *:focus-visible{outline:3px solid #0d9488!important;outline-offset:2px!important;}
`;

class YuktAIElement extends HTMLElement {
  static get observedAttributes() { return ["position"]; }
  constructor() {
    super();
    this.attachShadow({ mode:"open" });
    this._s = { highContrast:false, reduceMotion:false, autoFix:true, dyslexiaFont:false, fontScale:100 };
    this._active = false;
    this._dyslexia = null;
    this._kh = (e) => { if (e.key==="Escape") this._close(); };
    this._ch = (e) => { if (!this.shadowRoot.contains(e.composedPath()[0])) this._close(); };
  }
  get pos() { return this.getAttribute("position") || "left"; }
  connectedCallback() { this._render(); document.addEventListener("keydown",this._kh); document.addEventListener("mousedown",this._ch); }
  disconnectedCallback() {
    wcagPlugin.stopObserver(); wcagPlugin.removeLiveRegion(); wcagPlugin.removeColorBlindSvg();
    this._dyslexia?.remove();
    document.removeEventListener("keydown",this._kh); document.removeEventListener("mousedown",this._ch);
  }
  attributeChangedCallback() { this._render(); }

  _render() {
    const p = this.pos;
    this.shadowRoot.innerHTML = `<style>${CSS}</style><slot></slot>
      <button class="fab${this._active?" active":""}" aria-label="Open yuktai-a11y accessibility options" aria-haspopup="dialog" aria-expanded="false" style="${p}:24px;">
        <svg viewBox="0 0 24 24" style="width:26px;height:26px;fill:#fff;" aria-hidden="true"><path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm9 4.5l-5-.5-2-.2V5l-4 .5-4-.5v.8L4 6.5 3 7l1 3 4-.5v2.3L6 17h2l2-4.5L12 14l2 2.5L16 17h2l-2-4.2V9.5l4 .5 1-3z"/></svg>
        <span class="dot" aria-hidden="true"></span>
      </button>
      <div class="panel" role="dialog" aria-modal="true" aria-label="yuktai-a11y accessibility options" style="${p}:88px;">${this._html()}</div>`;
    this._bind();
  }

  _html() {
    const s = this._s;
    const toggles = OPTIONS.map((o,i)=>`
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 18px;gap:12px;">
        <div style="display:flex;align-items:center;gap:10px;flex:1;">
          <span aria-hidden="true" style="width:30px;height:30px;border-radius:8px;background:#f0fdfa;color:#0d9488;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;font-weight:700;">${o.icon}</span>
          <div><p style="margin:0;font-size:13px;font-weight:500;color:#0f172a;">${o.label}</p><p style="margin:0;font-size:11px;color:#94a3b8;">${o.desc}</p></div>
        </div>
        <label aria-label="Toggle ${o.label}" style="position:relative;display:inline-flex;width:40px;height:24px;cursor:pointer;flex-shrink:0;">
          <input type="checkbox" data-k="${o.id}" ${s[o.id]?"checked":""} style="opacity:0;width:0;height:0;position:absolute;"/>
          <span class="track"></span><span class="thumb"></span>
        </label>
      </div>${i<OPTIONS.length-1?'<div style="height:1px;background:#f8fafc;margin:0 18px;"></div>':""}`).join("");
    const bars = FONT_STEPS.map(v=>`<button class="fbar${v<=s.fontScale?" on":""}" data-v="${v}" aria-label="Set text size to ${v}%"></button>`).join("");
    return `
      <div style="padding:14px 18px 12px;border-bottom:1px solid #f1f5f9;display:flex;align-items:flex-start;justify-content:space-between;">
        <div>
          <div style="display:flex;align-items:center;gap:7px;margin-bottom:5px;">
            <span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px;background:#f0fdfa;color:#0d9488;font-family:monospace;">@yuktishaalaa/yuktai v1.0.0</span>
            ${this._active?'<span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px;background:#f0fdfa;color:#0f766e;border:1px solid #99f6e4;">● ACTIVE</span>':""}
          </div>
          <p style="margin:0 0 2px;font-size:15px;font-weight:600;color:#0f172a;">Accessibility</p>
          <p style="margin:0;font-size:12px;color:#64748b;">Zero-config WCAG fixes · Open Source</p>
        </div>
        <button class="x-btn" aria-label="Close panel" style="background:none;border:none;cursor:pointer;padding:4px;color:#94a3b8;font-size:18px;line-height:1;border-radius:6px;">×</button>
      </div>
      <div style="padding:6px 0;">${toggles}</div>
      <div style="padding:10px 18px 14px;border-top:1px solid #f1f5f9;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <p style="margin:0;font-size:13px;font-weight:500;color:#0f172a;">Text size</p>
          <span class="fl" style="font-size:12px;font-weight:600;color:#0d9488;background:#f0fdfa;padding:2px 8px;border-radius:99px;">${s.fontScale}%</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <button class="fd" aria-label="Decrease text size" style="width:30px;height:30px;border-radius:8px;border:1px solid #e2e8f0;background:#fff;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">−</button>
          <div style="flex:1;display:flex;gap:3px;">${bars}</div>
          <button class="fi" aria-label="Increase text size" style="width:30px;height:30px;border-radius:8px;border:1px solid #e2e8f0;background:#fff;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">+</button>
        </div>
      </div>
      <div class="rep"></div>
      <div style="display:flex;gap:8px;padding:12px 14px 14px;">
        <button class="rst" style="flex:1;padding:8px 0;font-size:13px;font-weight:500;border-radius:9px;border:1px solid #e2e8f0;background:#fff;color:#64748b;cursor:pointer;">Reset</button>
        <button class="apl" style="flex:2;padding:8px 0;font-size:13px;font-weight:600;border-radius:9px;border:none;background:#0d9488;color:#fff;cursor:pointer;">Apply settings</button>
      </div>`;
  }

  _bind() {
    const sr = this.shadowRoot;
    const fab   = sr.querySelector(".fab");
    const panel = sr.querySelector(".panel");
    fab.addEventListener("click", () => panel.classList.contains("open") ? this._close() : this._open());
    sr.querySelector(".x-btn").addEventListener("click", () => this._close());
    sr.querySelector(".apl").addEventListener("click",  () => this._apply());
    sr.querySelector(".rst").addEventListener("click",  () => this._reset());
    sr.querySelectorAll("input[data-k]").forEach((inp) => {
      inp.addEventListener("change",(e)=>{ this._s[e.target.dataset.k]=e.target.checked; });
    });
    sr.querySelectorAll(".fbar").forEach((b)=>{
      b.addEventListener("click",()=>{ this._s.fontScale=parseInt(b.dataset.v); this._updateFont(); });
    });
    sr.querySelector(".fd").addEventListener("click",()=>{ const i=FONT_STEPS.indexOf(this._s.fontScale); if(i>0){this._s.fontScale=FONT_STEPS[i-1];this._updateFont();} });
    sr.querySelector(".fi").addEventListener("click",()=>{ const i=FONT_STEPS.indexOf(this._s.fontScale); if(i<FONT_STEPS.length-1){this._s.fontScale=FONT_STEPS[i+1];this._updateFont();} });
  }

  _open()  { this.shadowRoot.querySelector(".panel").classList.add("open");    this.shadowRoot.querySelector(".fab").setAttribute("aria-expanded","true"); }
  _close() { this.shadowRoot.querySelector(".panel")?.classList.remove("open"); this.shadowRoot.querySelector(".fab")?.setAttribute("aria-expanded","false"); }

  _updateFont() {
    const sr = this.shadowRoot;
    sr.querySelector(".fl").textContent = `${this._s.fontScale}%`;
    sr.querySelectorAll(".fbar").forEach((b)=>{ b.classList.toggle("on", parseInt(b.dataset.v)<=this._s.fontScale); });
  }

  async _apply() {
    const c = { enabled:true, highContrast:this._s.highContrast, reduceMotion:this._s.reduceMotion, autoFix:this._s.autoFix };
    console.log("[yuktai-a11y]", await wcagPlugin.execute(c));
    const r = wcagPlugin.applyFixes(c);
    document.documentElement.style.fontSize = `${this._s.fontScale}%`;
    if (this._s.dyslexiaFont && !this._dyslexia) {
      this._dyslexia = document.createElement("style");
      this._dyslexia.textContent = `body,body *{font-family:'Georgia',serif!important;letter-spacing:.06em!important;word-spacing:.12em!important;line-height:1.9!important;}`;
      document.head.appendChild(this._dyslexia);
    } else if (!this._s.dyslexiaFont) { this._dyslexia?.remove(); this._dyslexia=null; }
    this._active = true;
    this.shadowRoot.querySelector(".fab").classList.add("active");
    const rep = this.shadowRoot.querySelector(".rep");
    rep.classList.add("show");
    rep.textContent = r.fixed>0 ? `✓ ${r.fixed} fixes applied · ${r.scanned} nodes · ${r.renderTime}ms` : `✓ 0 fixes needed · ${r.scanned} nodes clean · ${r.renderTime}ms`;
    wcagPlugin.announce("yuktai-a11y active.");
    this._close();
  }

  async _reset() {
    await wcagPlugin.execute({ enabled:false });
    document.documentElement.style.fontSize="";
    this._dyslexia?.remove(); this._dyslexia=null;
    document.querySelectorAll("*").forEach((h)=>{ h.style.filter=""; h.style.transition=""; h.style.animation=""; });
    this._s = { highContrast:false, reduceMotion:false, autoFix:true, dyslexiaFont:false, fontScale:100 };
    this._active=false;
    this.shadowRoot.querySelector(".fab")?.classList.remove("active");
    wcagPlugin.announce("yuktai-a11y disabled.");
    this._close();
  }
}

if (!customElements.get("yuktai-a11y")) customElements.define("yuktai-a11y", YuktAIElement);