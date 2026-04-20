// yuktai-a11y · vanilla/index.js
// Zero framework. One script tag or import.
// <script src="cdn.../vanilla/index.js"></script>
// window.YUKTAI_CONFIG = { position:"right" }  ← optional config

(function () {
  "use strict";
  const { wcagPlugin } = (typeof require !== "undefined")
    ? require("../core/renderer")
    : window.__yuktai_core__;

  const FONT_STEPS = [80,90,100,110,120,130,140,150];
  const OPTIONS = [
    { id:"highContrast", label:"High contrast",         desc:"contrast(1.15) brightness on all nodes", icon:"◑"  },
    { id:"reduceMotion", label:"Reduce motion",          desc:"Disables all transitions & animations",   icon:"⏸"  },
    { id:"autoFix",      label:"Auto-fix ARIA",          desc:"MutationObserver on new DOM nodes",       icon:"♿" },
    { id:"dyslexiaFont", label:"Dyslexia-friendly font", desc:"Wider letter & word spacing",             icon:"Aa" },
  ];
  const cfg = (typeof window !== "undefined" && window.YUKTAI_CONFIG) || {};
  const position = cfg.position || "left";
  const settings = { highContrast:false, reduceMotion:false, autoFix:true, dyslexiaFont:false, fontScale:100 };
  let _dyslexiaNode = null, _focusNode = null, _fabNode = null, _panelNode = null, _isActive = false;

  function init() {
    injectFocus(); buildFAB();
    document.addEventListener("keydown", (e) => { if (e.key==="Escape" && _panelNode) closePanel(); });
  }

  function injectFocus() {
    if (_focusNode) return;
    _focusNode = document.createElement("style");
    _focusNode.textContent = `*:focus-visible{outline:3px solid #0d9488!important;outline-offset:2px!important;}`;
    document.head.appendChild(_focusNode);
  }

  function buildFAB() {
    _fabNode = document.createElement("button");
    _fabNode.setAttribute("aria-label","Open yuktai-a11y accessibility options");
    _fabNode.setAttribute("aria-haspopup","dialog");
    _fabNode.setAttribute("aria-expanded","false");
    Object.assign(_fabNode.style,{ position:"fixed",bottom:"24px",[position]:"24px",width:"52px",height:"52px",borderRadius:"50%",background:"#0d9488",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 14px rgba(0,0,0,0.18)",zIndex:"9999",transition:"background 0.2s, transform 0.15s",outline:"none" });
    _fabNode.innerHTML = `<svg viewBox="0 0 24 24" style="width:26px;height:26px;fill:#fff;" aria-hidden="true"><path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm9 4.5l-5-.5-2-.2V5l-4 .5-4-.5v.8L4 6.5 3 7l1 3 4-.5v2.3L6 17h2l2-4.5L12 14l2 2.5L16 17h2l-2-4.2V9.5l4 .5 1-3z"/></svg>`;
    _fabNode.addEventListener("click", () => _panelNode ? closePanel() : openPanel());
    _fabNode.addEventListener("mouseenter", () => (_fabNode.style.transform="scale(1.08)"));
    _fabNode.addEventListener("mouseleave", () => (_fabNode.style.transform="scale(1)"));
    document.body.appendChild(_fabNode);
  }

  function openPanel() {
    _fabNode.setAttribute("aria-expanded","true");
    _panelNode = document.createElement("div");
    _panelNode.setAttribute("role","dialog");
    _panelNode.setAttribute("aria-modal","true");
    _panelNode.setAttribute("aria-label","yuktai-a11y accessibility options");
    Object.assign(_panelNode.style,{ position:"fixed",bottom:"24px",[position]:"88px",width:"312px",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",zIndex:"9998",overflow:"hidden",fontFamily:"system-ui,-apple-system,sans-serif" });
    _panelNode.innerHTML = buildHTML();
    document.body.appendChild(_panelNode);
    bindEvents();
    document.addEventListener("mousedown", outsideClick);
  }

  function closePanel() {
    _panelNode?.remove(); _panelNode = null;
    _fabNode.setAttribute("aria-expanded","false");
    _fabNode.focus();
    document.removeEventListener("mousedown", outsideClick);
  }

  function outsideClick(e) {
    if (_panelNode && !_panelNode.contains(e.target) && !_fabNode.contains(e.target)) closePanel();
  }

  function buildHTML() {
    const toggles = OPTIONS.map((o,i)=>`
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 18px;gap:12px;">
        <div style="display:flex;align-items:center;gap:10px;flex:1;">
          <span aria-hidden="true" style="width:30px;height:30px;border-radius:8px;background:#f0fdfa;color:#0d9488;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;font-weight:700;">${o.icon}</span>
          <div><p style="margin:0;font-size:13px;font-weight:500;color:#0f172a;">${o.label}</p><p style="margin:0;font-size:11px;color:#94a3b8;">${o.desc}</p></div>
        </div>
        <label aria-label="Toggle ${o.label}" style="position:relative;display:inline-flex;width:40px;height:24px;cursor:pointer;flex-shrink:0;">
          <input type="checkbox" data-s="${o.id}" ${settings[o.id]?"checked":""} style="opacity:0;width:0;height:0;position:absolute;"/>
          <span style="position:absolute;inset:0;border-radius:99px;background:${settings[o.id]?"#0d9488":"#cbd5e1"};transition:background 0.2s;"></span>
          <span style="position:absolute;top:3px;left:${settings[o.id]?"19px":"3px"};width:18px;height:18px;background:#fff;border-radius:50%;transition:left 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.2);pointer-events:none;"></span>
        </label>
      </div>${i<OPTIONS.length-1?'<div style="height:1px;background:#f8fafc;margin:0 18px;"></div>':""}`).join("");

    const bars = FONT_STEPS.map(s=>`<button data-step="${s}" aria-label="Set text size to ${s}%" style="flex:1;height:6px;border-radius:99px;border:none;cursor:pointer;padding:0;background:${s<=settings.fontScale?"#0d9488":"#e2e8f0"};transition:background 0.15s;"></button>`).join("");

    return `
      <div style="padding:14px 18px 12px;border-bottom:1px solid #f1f5f9;display:flex;align-items:flex-start;justify-content:space-between;">
        <div>
          <div style="display:flex;align-items:center;gap:7px;margin-bottom:5px;">
            <span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px;background:#f0fdfa;color:#0d9488;font-family:monospace;">@yuktishaalaa/yuktai v1.0.0</span>
            ${_isActive?'<span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px;background:#f0fdfa;color:#0f766e;border:1px solid #99f6e4;">● ACTIVE</span>':""}
          </div>
          <p style="margin:0 0 2px;font-size:15px;font-weight:600;color:#0f172a;">Accessibility</p>
          <p style="margin:0;font-size:12px;color:#64748b;">Zero-config WCAG fixes · Open Source</p>
        </div>
        <button data-close aria-label="Close panel" style="background:none;border:none;cursor:pointer;padding:4px;color:#94a3b8;font-size:18px;line-height:1;border-radius:6px;">×</button>
      </div>
      <div style="padding:6px 0;">${toggles}</div>
      <div style="padding:10px 18px 14px;border-top:1px solid #f1f5f9;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <p style="margin:0;font-size:13px;font-weight:500;color:#0f172a;">Text size</p>
          <span class="y-fl" style="font-size:12px;font-weight:600;color:#0d9488;background:#f0fdfa;padding:2px 8px;border-radius:99px;">${settings.fontScale}%</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <button data-dec aria-label="Decrease text size" style="width:30px;height:30px;border-radius:8px;border:1px solid #e2e8f0;background:#fff;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">−</button>
          <div style="flex:1;display:flex;gap:3px;">${bars}</div>
          <button data-inc aria-label="Increase text size" style="width:30px;height:30px;border-radius:8px;border:1px solid #e2e8f0;background:#fff;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">+</button>
        </div>
      </div>
      <div class="y-rep" style="display:none;margin:0 14px;padding:8px 12px;background:#f0fdfa;border:1px solid #99f6e4;border-radius:8px;font-size:12px;color:#0f766e;font-weight:500;font-family:monospace;"></div>
      <div style="display:flex;gap:8px;padding:12px 14px 14px;">
        <button data-reset style="flex:1;padding:8px 0;font-size:13px;font-weight:500;border-radius:9px;border:1px solid #e2e8f0;background:#fff;color:#64748b;cursor:pointer;">Reset</button>
        <button data-apply style="flex:2;padding:8px 0;font-size:13px;font-weight:600;border-radius:9px;border:none;background:#0d9488;color:#fff;cursor:pointer;">Apply settings</button>
      </div>`;
  }

  function bindEvents() {
    _panelNode.querySelector("[data-close]").addEventListener("click", closePanel);
    _panelNode.querySelectorAll("input[data-s]").forEach((inp) => {
      inp.addEventListener("change", (e) => {
        const k = e.target.dataset.s; settings[k] = e.target.checked;
        const lbl = e.target.closest("label");
        lbl.querySelectorAll("span")[0].style.background = e.target.checked ? "#0d9488" : "#cbd5e1";
        lbl.querySelectorAll("span")[1].style.left = e.target.checked ? "19px" : "3px";
      });
    });
    _panelNode.querySelectorAll("[data-step]").forEach((b) => b.addEventListener("click",()=>{ settings.fontScale=parseInt(b.dataset.step); updateFont(); }));
    _panelNode.querySelector("[data-dec]").addEventListener("click",()=>{ const i=FONT_STEPS.indexOf(settings.fontScale); if(i>0){settings.fontScale=FONT_STEPS[i-1];updateFont();} });
    _panelNode.querySelector("[data-inc]").addEventListener("click",()=>{ const i=FONT_STEPS.indexOf(settings.fontScale); if(i<FONT_STEPS.length-1){settings.fontScale=FONT_STEPS[i+1];updateFont();} });
    _panelNode.querySelector("[data-apply]").addEventListener("click", applySettings);
    _panelNode.querySelector("[data-reset]").addEventListener("click", resetSettings);
  }

  function updateFont() {
    if (!_panelNode) return;
    _panelNode.querySelector(".y-fl").textContent = `${settings.fontScale}%`;
    _panelNode.querySelectorAll("[data-step]").forEach((b)=>{ b.style.background = parseInt(b.dataset.step)<=settings.fontScale?"#0d9488":"#e2e8f0"; });
  }

  async function applySettings() {
    const c = { enabled:true, highContrast:settings.highContrast, reduceMotion:settings.reduceMotion, autoFix:settings.autoFix };
    console.log("[yuktai-a11y]", await wcagPlugin.execute(c));
    const r = wcagPlugin.applyFixes(c);
    document.documentElement.style.fontSize = `${settings.fontScale}%`;
    if (settings.dyslexiaFont && !_dyslexiaNode) {
      _dyslexiaNode = document.createElement("style");
      _dyslexiaNode.textContent = `body,body *{font-family:'Georgia',serif!important;letter-spacing:.06em!important;word-spacing:.12em!important;line-height:1.9!important;}`;
      document.head.appendChild(_dyslexiaNode);
    } else if (!settings.dyslexiaFont) { _dyslexiaNode?.remove(); _dyslexiaNode=null; }
    _isActive=true; _fabNode.style.background="#0f766e";
    const rep = _panelNode?.querySelector(".y-rep");
    if (rep) { rep.style.display="block"; rep.textContent = r.fixed>0 ? `✓ ${r.fixed} fixes applied · ${r.scanned} nodes · ${r.renderTime}ms` : `✓ 0 fixes needed · ${r.scanned} nodes clean · ${r.renderTime}ms`; }
    wcagPlugin.announce("yuktai-a11y active.");
    closePanel();
  }

  async function resetSettings() {
    await wcagPlugin.execute({ enabled:false });
    document.documentElement.style.fontSize="";
    _dyslexiaNode?.remove(); _dyslexiaNode=null;
    document.querySelectorAll("*").forEach((h)=>{ h.style.filter=""; h.style.transition=""; h.style.animation=""; });
    Object.assign(settings,{ highContrast:false,reduceMotion:false,autoFix:true,dyslexiaFont:false,fontScale:100 });
    _isActive=false; _fabNode.style.background="#0d9488";
    wcagPlugin.announce("yuktai-a11y disabled.");
    closePanel();
  }

  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  if (typeof window !== "undefined") {
    window.yuktai = { apply:applySettings, reset:resetSettings, wcagPlugin };
  }
})();