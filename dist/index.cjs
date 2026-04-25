"use strict";var be=Object.create;var z=Object.defineProperty;var pe=Object.getOwnPropertyDescriptor;var ge=Object.getOwnPropertyNames;var me=Object.getPrototypeOf,ye=Object.prototype.hasOwnProperty;var xe=(t,i)=>{for(var n in i)z(t,n,{get:i[n],enumerable:!0})},U=(t,i,n,s)=>{if(i&&typeof i=="object"||typeof i=="function")for(let a of ge(i))!ye.call(t,a)&&a!==n&&z(t,a,{get:()=>i[a],enumerable:!(s=pe(i,a))||s.enumerable});return t};var he=(t,i,n)=>(n=t!=null?be(me(t)):{},U(i||!t||!t.__esModule?z(n,"default",{value:t,enumerable:!0}):n,t)),Ae=t=>U(z({},"__esModule",{value:!0}),t);var _e={};xe(_e,{Runtime:()=>v,YuktAI:()=>Pe,YuktAIWrapper:()=>q,aiPlugin:()=>R,default:()=>q,voicePlugin:()=>H,wcag:()=>b,wcagPlugin:()=>b});module.exports=Ae(_e);var W=null,J=null,$=null,X=null,O=null,m=null,w=null,P=null,j=null,S=null,I={deuteranopia:"yuktai-cb-d",protanopia:"yuktai-cb-p",tritanopia:"yuktai-cb-t"},Z=new Set(["h1","h2","h3","h4","h5","h6"]),Q=new Set(["input","select","textarea"]),ve=new Set(["button","a","input","select","textarea","details","summary"]),ke=new Set(["video","audio"]),we=new Set(["ul","ol","dl"]);var K={nav:"navigation",header:"banner",footer:"contentinfo",main:"main",aside:"complementary"};function Y(t,i="polite"){if(typeof window>"u"||!S?.speechEnabled||!window.speechSynthesis)return;window.speechSynthesis.cancel();let n=new SpeechSynthesisUtterance(t);n.rate=1,n.pitch=1,n.volume=1;let s=window.speechSynthesis.getVoices();s.length>0&&(n.voice=s[0]),window.speechSynthesis.speak(n)}function ae(t,i="info"){if(typeof document>"u")return;let s={success:{bg:"#0f9d58",border:"#0a7a44",icon:"\u2713"},error:{bg:"#d93025",border:"#b52a1c",icon:"\u2715"},warning:{bg:"#f29900",border:"#c67c00",icon:"\u26A0"},info:{bg:"#1a73e8",border:"#1557b0",icon:"\u2139"}}[i];m||(m=document.createElement("div"),m.setAttribute("role","alert"),m.setAttribute("aria-live","assertive"),m.setAttribute("aria-atomic","true"),m.style.cssText=`
      position:fixed;top:80px;right:16px;z-index:999999;
      max-width:320px;width:calc(100% - 32px);
      border-radius:8px;padding:12px 16px;
      display:flex;align-items:center;gap:10px;
      font-family:system-ui,sans-serif;font-size:14px;
      box-shadow:0 4px 12px rgba(0,0,0,0.3);
      transition:transform 0.3s,opacity 0.3s;
      transform:translateX(120%);opacity:0;
    `,document.body.appendChild(m)),m.style.background=s.bg,m.style.border=`1px solid ${s.border}`,m.style.color="#fff",m.innerHTML=`
    <span style="font-size:18px;font-weight:700">${s.icon}</span>
    <span style="flex:1;line-height:1.4">${t}</span>
    <button onclick="this.parentElement.style.transform='translateX(120%)';this.parentElement.style.opacity='0'"
      style="background:none;border:none;color:#fff;cursor:pointer;font-size:18px;padding:0;line-height:1"
      aria-label="Close notification">\xD7</button>
  `,requestAnimationFrame(()=>{m&&(m.style.transform="translateX(0)",m.style.opacity="1")}),setTimeout(()=>{m&&(m.style.transform="translateX(120%)",m.style.opacity="0")},5e3)}function p(t,i="info",n=!0){W&&(W.textContent=t),ae(t,i),n&&Y(t,i==="error"?"assertive":"polite")}function Se(){if(typeof document>"u"||X)return;let t=[{label:"Skip to main content",selector:"main,[role='main'],#main,#main-content"},{label:"Skip to navigation",selector:"nav,[role='navigation'],#nav,#navigation"},{label:"Skip to search",selector:"[role='search'],#search,input[type='search']"}],i=document.createElement("div");i.setAttribute("data-yuktai-skip-bar","true"),i.setAttribute("role","navigation"),i.setAttribute("aria-label","Skip links"),i.style.cssText=`
    position:fixed;top:0;left:0;right:0;z-index:999999;
    display:flex;gap:4px;padding:4px;
    background:#111;
    transform:translateY(-100%);
    transition:transform 0.2s ease;
    font-family:system-ui,sans-serif;
  `;let n=!1;if(t.forEach(({label:a,selector:l})=>{let e=document.querySelector(l);if(!e)return;n=!0,e.getAttribute("tabindex")||e.setAttribute("tabindex","-1");let r=document.createElement("a");r.href="#",r.textContent=a,r.style.cssText=`
      color:#fff;background:#1a73e8;
      padding:8px 14px;border-radius:4px;
      font-size:13px;font-weight:600;
      text-decoration:none;white-space:nowrap;
      border:2px solid transparent;
      transition:background 0.15s,border-color 0.15s;
    `,r.addEventListener("focus",()=>{i.style.transform="translateY(0)"}),r.addEventListener("blur",()=>{setTimeout(()=>{i.matches(":focus-within")||(i.style.transform="translateY(-100%)")},2e3)}),r.addEventListener("keydown",y=>{(y.key==="Enter"||y.key===" ")&&(y.preventDefault(),e.focus(),e.scrollIntoView({behavior:"smooth",block:"start"}),p(`Jumped to ${a.replace("Skip to ","")}`,"info"),i.style.transform="translateY(-100%)")}),r.addEventListener("click",y=>{y.preventDefault(),e.focus(),e.scrollIntoView({behavior:"smooth",block:"start"}),p(`Jumped to ${a.replace("Skip to ","")}`,"info"),i.style.transform="translateY(-100%)"}),r.addEventListener("mouseover",()=>{r.style.background="#1557b0",r.style.borderColor="#fff"}),r.addEventListener("mouseout",()=>{r.style.background="#1a73e8",r.style.borderColor="transparent"}),i.appendChild(r)}),!n)return;window.innerWidth<768&&(i.style.transform="translateY(0)",i.style.position="sticky"),document.body.insertBefore(i,document.body.firstChild),X=i}function Ee(){if(typeof document>"u"||document.querySelector("[data-yuktai-focus-style]"))return;let t=document.createElement("style");t.setAttribute("data-yuktai-focus-style","true"),t.textContent=`
    /* WCAG 2.4.11 \u2014 minimum 2px solid focus indicator */
    [data-yuktai-a11y] *:focus-visible {
      outline: 3px solid #1a73e8 !important;
      outline-offset: 3px !important;
      border-radius: 2px !important;
      box-shadow: 0 0 0 6px rgba(26,115,232,0.15) !important;
    }

    /* High contrast focus */
    [data-yuktai-high-contrast] *:focus-visible {
      outline: 3px solid #ffff00 !important;
      outline-offset: 3px !important;
      box-shadow: 0 0 0 6px rgba(255,255,0,0.2) !important;
    }

    /* Keyboard hint mode */
    [data-yuktai-keyboard] *:focus {
      outline: 3px solid #ff6b35 !important;
      outline-offset: 3px !important;
    }

    /* Remove default outline \u2014 replaced by above */
    [data-yuktai-a11y] *:focus:not(:focus-visible) {
      outline: none !important;
    }

    /* Large targets \u2014 WCAG 2.5.8 */
    [data-yuktai-large-targets] button,
    [data-yuktai-large-targets] a,
    [data-yuktai-large-targets] input,
    [data-yuktai-large-targets] select,
    [data-yuktai-large-targets] [role="button"] {
      min-height: 44px !important;
      min-width: 44px !important;
    }

    /* Reduce motion \u2014 WCAG 2.3.3 */
    [data-yuktai-reduce-motion] *,
    [data-yuktai-reduce-motion] *::before,
    [data-yuktai-reduce-motion] *::after {
      animation-duration: 0.001ms !important;
      transition-duration: 0.001ms !important;
    }

    /* High contrast mode */
    [data-yuktai-high-contrast] {
      filter: contrast(1.4) brightness(1.05) !important;
    }

    /* Dark mode */
    [data-yuktai-dark] {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    [data-yuktai-dark] img,
    [data-yuktai-dark] video,
    [data-yuktai-dark] canvas {
      filter: invert(1) hue-rotate(180deg) !important;
    }

    /* Skip link bar responsive */
    @media (max-width: 768px) {
      [data-yuktai-skip-bar] {
        flex-wrap: wrap;
      }
      [data-yuktai-skip-bar] a {
        font-size: 12px !important;
        padding: 6px 10px !important;
      }
    }

    /* Preference panel responsive */
    @media (max-width: 480px) {
      [data-yuktai-panel] {
        width: 100% !important;
        right: 0 !important;
        bottom: 0 !important;
        border-radius: 16px 16px 0 0 !important;
      }
    }

    /* Link underline enforcement */
    [data-yuktai-a11y] a:not([role]):not([class]) {
      text-decoration: underline !important;
    }
  `,document.head.appendChild(t),document.documentElement.setAttribute("data-yuktai-a11y","true")}function Te(){typeof document>"u"||document.querySelector("[data-yuktai-kb-init]")||(document.documentElement.setAttribute("data-yuktai-kb-init","true"),document.addEventListener("keydown",t=>{let i=document.activeElement;if(!i)return;let n=i.getAttribute("role")||"";if(t.key==="Escape"){let s=i.closest("[role='dialog'],[role='alertdialog']");if(s){s.style.display="none";let l=s.getAttribute("data-yuktai-trigger");l&&document.querySelector(`[data-yuktai-id='${l}']`)?.focus(),p("Dialog closed","info");return}let a=i.closest("[role='menu'],[role='menubar']");a&&(a.style.display="none",p("Menu closed","info"))}if(n==="menuitem"||i.closest("[role='menu'],[role='menubar']")){let s=i.closest("[role='menu'],[role='menubar']");if(!s)return;let a=Array.from(s.querySelectorAll("[role='menuitem']:not([disabled])")),l=a.indexOf(i);t.key==="ArrowDown"||t.key==="ArrowRight"?(t.preventDefault(),a[(l+1)%a.length]?.focus()):t.key==="ArrowUp"||t.key==="ArrowLeft"?(t.preventDefault(),a[(l-1+a.length)%a.length]?.focus()):t.key==="Home"?(t.preventDefault(),a[0]?.focus()):t.key==="End"&&(t.preventDefault(),a[a.length-1]?.focus())}if(n==="tab"||i.closest("[role='tablist']")){let s=i.closest("[role='tablist']");if(!s)return;let a=Array.from(s.querySelectorAll("[role='tab']:not([disabled])")),l=a.indexOf(i);if(t.key==="ArrowRight"||t.key==="ArrowDown"){t.preventDefault();let e=a[(l+1)%a.length];e?.focus(),e?.click()}else if(t.key==="ArrowLeft"||t.key==="ArrowUp"){t.preventDefault();let e=a[(l-1+a.length)%a.length];e?.focus(),e?.click()}}if(n==="option"||i.closest("[role='listbox']")){let s=i.closest("[role='listbox']");if(!s)return;let a=Array.from(s.querySelectorAll("[role='option']:not([aria-disabled='true'])")),l=a.indexOf(i);t.key==="ArrowDown"?(t.preventDefault(),a[(l+1)%a.length]?.focus()):t.key==="ArrowUp"?(t.preventDefault(),a[(l-1+a.length)%a.length]?.focus()):(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),i.setAttribute("aria-selected","true"),a.forEach(e=>{e!==i&&e.setAttribute("aria-selected","false")}),p(`Selected: ${i.textContent?.trim()}`,"success"))}t.altKey&&t.key==="a"&&(t.preventDefault(),re()),t.key==="Tab"&&S?.speechEnabled&&setTimeout(()=>{let s=document.activeElement;if(!s)return;let a=s.getAttribute("aria-label")||s.getAttribute("title")||s.textContent?.trim()||s.tagName.toLowerCase(),l=s.getAttribute("role")||s.tagName.toLowerCase();Y(`${a}, ${l}`)},100)}))}function E(t){let i=t.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[role="button"]');if(i.length===0)return;let n=i[0],s=i[i.length-1];n.focus(),t.addEventListener("keydown",a=>{a.key==="Tab"&&(a.shiftKey?document.activeElement===n&&(a.preventDefault(),s.focus()):document.activeElement===s&&(a.preventDefault(),n.focus()))})}function re(){if(typeof document>"u")return;if(w){w.remove(),w=null;return}let t=document.createElement("div");t.setAttribute("role","dialog"),t.setAttribute("aria-label","Keyboard shortcuts"),t.setAttribute("aria-modal","true"),t.style.cssText=`
    position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
    z-index:999999;background:#1a1a2e;color:#fff;
    border-radius:12px;padding:24px;width:320px;max-width:calc(100vw - 32px);
    box-shadow:0 20px 60px rgba(0,0,0,0.5);
    font-family:system-ui,sans-serif;
  `;let i=[["Alt + A","Open/close this menu"],["Tab","Next focusable element"],["Shift+Tab","Previous focusable element"],["Enter","Activate button or link"],["Space","Check checkbox / scroll"],["Arrow keys","Navigate lists and menus"],["Escape","Close dialog or menu"],["Home","First item in list"],["End","Last item in list"]];t.innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <h2 style="margin:0;font-size:16px;font-weight:700;color:#74c0fc">
        \u2328 Keyboard shortcuts
      </h2>
      <button data-yuktai-close style="background:none;border:none;color:#aaa;cursor:pointer;font-size:20px;padding:0;line-height:1" aria-label="Close shortcuts">\xD7</button>
    </div>
    ${i.map(([s,a])=>`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #2a2a4a">
        <kbd style="background:#2a2a4a;color:#74c0fc;padding:3px 8px;border-radius:4px;font-size:12px;font-family:monospace;border:1px solid #3a3a6a">${s}</kbd>
        <span style="font-size:12px;color:#ccc;text-align:right;flex:1;margin-left:12px">${a}</span>
      </div>
    `).join("")}
    <p style="margin:12px 0 0;font-size:11px;color:#888;text-align:center">
      Powered by @yuktai/a11y \xB7 Press Escape to close
    </p>
  `,t.querySelector("[data-yuktai-close]")?.addEventListener("click",()=>{t.remove(),w=null}),t.addEventListener("keydown",s=>{s.key==="Escape"&&(t.remove(),w=null)}),document.body.appendChild(t),w=t,E(t),p("Keyboard shortcuts opened. Press Escape to close.","info")}function Me(t){if(typeof document>"u"||!S?.showAuditBadge||typeof window<"u"&&!window.location.hostname.includes("localhost")&&!window.location.hostname.includes("127.0.0.1"))return;O&&O.remove();let i=t.score,n=i>=90?"#0f9d58":i>=70?"#f29900":"#d93025",s=i>=90?"\u267F":i>=70?"\u26A0":"\u2715",a=document.createElement("button");a.setAttribute("aria-label",`Accessibility score: ${i} out of 100. Click for details.`),a.setAttribute("data-yuktai-badge","true"),a.style.cssText=`
    position:fixed;bottom:16px;left:16px;z-index:999998;
    background:${n};color:#fff;
    border:none;border-radius:20px;cursor:pointer;
    padding:6px 12px;font-size:12px;font-weight:700;
    font-family:system-ui,sans-serif;
    box-shadow:0 2px 8px rgba(0,0,0,0.3);
    display:flex;align-items:center;gap:6px;
    transition:transform 0.15s;
  `,a.innerHTML=`${s} ${i}/100 <span style="font-weight:400;opacity:0.85">${t.details.length} issues</span>`,a.addEventListener("mouseenter",()=>{a.style.transform="scale(1.05)"}),a.addEventListener("mouseleave",()=>{a.style.transform="scale(1)"}),a.addEventListener("click",()=>{Le(t)}),document.body.appendChild(a),O=a}function Le(t){let i=document.querySelector("[data-yuktai-audit-details]");if(i){i.remove();return}let n=document.createElement("div");n.setAttribute("data-yuktai-audit-details","true"),n.setAttribute("role","dialog"),n.setAttribute("aria-label","Accessibility audit details"),n.style.cssText=`
    position:fixed;bottom:56px;left:16px;z-index:999999;
    background:#1a1a2e;color:#fff;border-radius:12px;
    padding:16px;width:340px;max-width:calc(100vw - 32px);
    max-height:60vh;overflow-y:auto;
    box-shadow:0 8px 32px rgba(0,0,0,0.5);
    font-family:system-ui,sans-serif;font-size:12px;
  `;let s={critical:"#d93025",serious:"#f29900",moderate:"#1a73e8",minor:"#0f9d58"};n.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <strong style="font-size:14px;color:#74c0fc">Audit Report</strong>
      <span style="color:#aaa">${t.fixed} fixed \xB7 ${t.renderTime}ms</span>
    </div>
    ${t.details.slice(0,20).map(a=>`
      <div style="padding:6px 0;border-bottom:1px solid #2a2a4a">
        <div style="display:flex;gap:6px;align-items:center">
          <span style="background:${s[a.severity]};color:#fff;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:700;text-transform:uppercase">${a.severity}</span>
          <code style="color:#74c0fc">&lt;${a.tag}&gt;</code>
        </div>
        <div style="color:#ccc;margin-top:3px">${a.fix}</div>
      </div>
    `).join("")}
    ${t.details.length>20?`<div style="color:#888;padding:8px 0;text-align:center">+${t.details.length-20} more issues</div>`:""}
  `,n.addEventListener("keydown",a=>{a.key==="Escape"&&n.remove()}),document.body.appendChild(n),E(n)}function oe(t){typeof document>"u"||(j&&clearTimeout(j),j=setTimeout(()=>{if(P)return;let i=document.createElement("div");i.setAttribute("role","alertdialog"),i.setAttribute("aria-label","Session timeout warning"),i.setAttribute("aria-modal","true"),i.setAttribute("data-yuktai-timeout","true"),i.style.cssText=`
      position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
      z-index:999999;background:#fff;color:#111;
      border-radius:12px;padding:24px;width:320px;max-width:calc(100vw - 32px);
      box-shadow:0 20px 60px rgba(0,0,0,0.4);
      font-family:system-ui,sans-serif;border:2px solid #d93025;
    `,i.innerHTML=`
      <h2 style="margin:0 0 8px;font-size:18px;color:#d93025">\u23F1 Session timeout</h2>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.5;color:#444">
        Your session will expire soon. Do you need more time?
      </p>
      <div style="display:flex;gap:8px">
        <button data-yuktai-extend style="flex:1;padding:10px;background:#1a73e8;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600">
          Yes, more time
        </button>
        <button data-yuktai-dismiss style="flex:1;padding:10px;background:#f1f3f4;color:#111;border:none;border-radius:8px;cursor:pointer;font-size:14px">
          No, sign out
        </button>
      </div>
    `;let n=i.querySelector("[data-yuktai-extend]"),s=i.querySelector("[data-yuktai-dismiss]");n?.addEventListener("click",()=>{i.remove(),P=null,p("Session extended. You have more time.","success"),S?.timeoutWarning&&oe(S.timeoutWarning)}),s?.addEventListener("click",()=>{i.remove(),P=null}),document.body.appendChild(i),P=i,E(i),p("Warning: Your session will expire soon. Do you need more time?","warning")},t*1e3))}function ne(t){if(typeof document>"u"||$)return;try{let a=localStorage.getItem("yuktai-a11y-prefs");if(a){let l=JSON.parse(a);Object.assign(t,l),C(t)}}catch{}let i=document.createElement("button");i.setAttribute("aria-label","Accessibility preferences"),i.setAttribute("aria-haspopup","dialog"),i.setAttribute("data-yuktai-pref-toggle","true"),i.style.cssText=`
    position:fixed;bottom:16px;right:16px;z-index:999998;
    width:48px;height:48px;border-radius:50%;
    background:#1a73e8;color:#fff;border:none;
    cursor:pointer;font-size:22px;
    box-shadow:0 2px 12px rgba(0,0,0,0.3);
    display:flex;align-items:center;justify-content:center;
    transition:transform 0.15s,background 0.15s;
  `,i.innerHTML="\u267F",i.addEventListener("mouseenter",()=>{i.style.transform="scale(1.1)",i.style.background="#1557b0"}),i.addEventListener("mouseleave",()=>{i.style.transform="scale(1)",i.style.background="#1a73e8"});let n=document.createElement("div");n.setAttribute("role","dialog"),n.setAttribute("aria-label","Accessibility preferences"),n.setAttribute("aria-modal","true"),n.setAttribute("data-yuktai-panel","true"),n.style.cssText=`
    position:fixed;bottom:76px;right:16px;z-index:999999;
    width:300px;max-width:calc(100vw - 32px);
    background:#fff;border-radius:16px;
    box-shadow:0 8px 32px rgba(0,0,0,0.2);
    border:1px solid #e0e0e0;
    font-family:system-ui,sans-serif;
    overflow:hidden;display:none;
  `;let s=[{icon:"\u{1F441}",title:"Vision",options:[{key:"highContrast",label:"High contrast",type:"toggle"},{key:"darkMode",label:"Dark mode",type:"toggle"},{key:"largeTargets",label:"Large text & targets",type:"toggle"}]},{icon:"\u{1F3A8}",title:"Colour blindness",options:[{key:"colorBlind_none",label:"None",type:"radio",group:"cb"},{key:"colorBlind_deuteranopia",label:"Deuteranopia",type:"radio",group:"cb"},{key:"colorBlind_protanopia",label:"Protanopia",type:"radio",group:"cb"},{key:"colorBlind_tritanopia",label:"Tritanopia",type:"radio",group:"cb"},{key:"colorBlind_achromatopsia",label:"Greyscale",type:"radio",group:"cb"}]},{icon:"\u2328",title:"Motor",options:[{key:"reduceMotion",label:"Reduce motion",type:"toggle"},{key:"largeTargets",label:"Large click targets",type:"toggle"}]},{icon:"\u{1F50A}",title:"Audio",options:[{key:"speechEnabled",label:"Speak on focus",type:"toggle"}]}];n.innerHTML=`
    <div style="padding:16px 16px 8px;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center">
      <strong style="font-size:15px;color:#111">\u267F Accessibility</strong>
      <button data-yuktai-panel-close style="background:none;border:none;cursor:pointer;font-size:20px;color:#666;padding:0;line-height:1" aria-label="Close preferences">\xD7</button>
    </div>
    <div style="padding:8px 0;max-height:60vh;overflow-y:auto">
      ${s.map(a=>`
        <div style="padding:8px 16px">
          <div style="font-size:11px;font-weight:700;color:#888;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:8px">
            ${a.icon} ${a.title}
          </div>
          ${a.options.map(l=>`
            <label style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;cursor:pointer;gap:8px">
              <span style="font-size:13px;color:#333">${l.label}</span>
              ${l.type==="toggle"?`
                <div data-yuktai-toggle="${l.key}" style="
                  width:40px;height:22px;border-radius:11px;
                  background:${_(t,l.key)?"#1a73e8":"#ccc"};
                  position:relative;cursor:pointer;transition:background 0.2s;flex-shrink:0;
                ">
                  <div style="
                    position:absolute;top:2px;left:${_(t,l.key)?"20px":"2px"};
                    width:18px;height:18px;border-radius:50%;background:#fff;
                    transition:left 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.2);
                  "></div>
                </div>
              `:`
                <input type="radio" name="yuktai-${l.group}" value="${l.key}"
                  ${Ce(t,l.key)?"checked":""}
                  style="width:16px;height:16px;cursor:pointer;accent-color:#1a73e8"
                />
              `}
            </label>
          `).join("")}
        </div>
      `).join("")}
      <div style="padding:8px 16px 4px">
        <div style="font-size:11px;font-weight:700;color:#888;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:8px">
          \u2328 Keyboard
        </div>
        <button data-yuktai-show-keys style="
          width:100%;padding:8px;background:#f8f9fa;border:1px solid #e0e0e0;
          border-radius:8px;cursor:pointer;font-size:13px;color:#333;
          display:flex;align-items:center;justify-content:center;gap:6px;
        ">
          Show keyboard shortcuts <kbd style="background:#e0e0e0;padding:1px 6px;border-radius:4px;font-size:11px">Alt+A</kbd>
        </button>
      </div>
    </div>
    <div style="padding:8px 16px 12px;border-top:1px solid #f0f0f0">
      <button data-yuktai-reset style="
        width:100%;padding:8px;background:#fff;border:1px solid #d93025;
        border-radius:8px;cursor:pointer;font-size:12px;color:#d93025;font-weight:600;
      ">Reset all preferences</button>
    </div>
  `,n.querySelectorAll("[data-yuktai-toggle]").forEach(a=>{a.addEventListener("click",()=>{let l=a.getAttribute("data-yuktai-toggle");t[l]=!_(t,l),te(t),C(t),ee(t),p(`${l.replace(/([A-Z])/g," $1")} ${_(t,l)?"enabled":"disabled"}`,"info")})}),n.querySelectorAll("input[type='radio']").forEach(a=>{a.addEventListener("change",()=>{let l=a.value.replace("colorBlind_","");t.colorBlindMode=l,te(t),C(t),p(`Colour blind mode: ${l}`,"info")})}),n.querySelector("[data-yuktai-show-keys]")?.addEventListener("click",()=>{re()}),n.querySelector("[data-yuktai-reset]")?.addEventListener("click",()=>{localStorage.removeItem("yuktai-a11y-prefs"),t.highContrast=!1,t.darkMode=!1,t.reduceMotion=!1,t.largeTargets=!1,t.speechEnabled=!1,t.colorBlindMode="none",C(t),ee(t),p("Preferences reset to default","info")}),n.querySelector("[data-yuktai-panel-close]")?.addEventListener("click",()=>{n.style.display="none",i.focus(),p("Preferences closed","info")}),n.addEventListener("keydown",a=>{a.key==="Escape"&&(n.style.display="none",i.focus())}),i.addEventListener("click",()=>{let a=n.style.display!=="none";n.style.display=a?"none":"block",i.setAttribute("aria-expanded",String(!a)),a||(E(n),p("Accessibility preferences opened","info"))}),document.body.appendChild(i),document.body.appendChild(n),$=n}function ee(t){$&&($.remove(),$=null),ne(t)}function _(t,i){return!!t[i]}function Ce(t,i){let n=i.replace("colorBlind_","");return t.colorBlindMode===n}function te(t){try{let i={highContrast:t.highContrast,darkMode:t.darkMode,reduceMotion:t.reduceMotion,largeTargets:t.largeTargets,speechEnabled:t.speechEnabled,colorBlindMode:t.colorBlindMode};localStorage.setItem("yuktai-a11y-prefs",JSON.stringify(i))}catch{}}function C(t){if(typeof document>"u")return;let i=document.documentElement;i.toggleAttribute("data-yuktai-high-contrast",!!t.highContrast),i.toggleAttribute("data-yuktai-dark",!!t.darkMode),i.toggleAttribute("data-yuktai-reduce-motion",!!t.reduceMotion),i.toggleAttribute("data-yuktai-large-targets",!!t.largeTargets),i.toggleAttribute("data-yuktai-keyboard",!!t.keyboardHints);let n=document.body;if(t.colorBlindMode&&t.colorBlindMode!=="none"){let s=t.colorBlindMode==="achromatopsia"?"grayscale(100%)":`url(#${I[t.colorBlindMode]})`;n.style.filter=s}else n.style.filter=""}function $e(){if(typeof document>"u"||W)return;let t=document.createElement("div");t.setAttribute("aria-live","polite"),t.setAttribute("aria-atomic","true"),t.setAttribute("aria-relevant","text"),t.style.cssText="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);",document.body.appendChild(t),W=t}function Re(){if(typeof document>"u"||J)return;let t=document.createElementNS("http://www.w3.org/2000/svg","svg");t.setAttribute("aria-hidden","true"),t.style.cssText="position:absolute;width:0;height:0;overflow:hidden;",t.innerHTML=`
    <defs>
      <filter id="${I.deuteranopia}">
        <feColorMatrix type="matrix" values="0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0"/>
      </filter>
      <filter id="${I.protanopia}">
        <feColorMatrix type="matrix" values="0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0"/>
      </filter>
      <filter id="${I.tritanopia}">
        <feColorMatrix type="matrix" values="0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0 0.475 0.525 0 0 0 0 0 1 0"/>
      </filter>
    </defs>
  `,document.body.appendChild(t),J=t}function ie(t){let i={critical:20,serious:10,moderate:5,minor:2},n=t.details.reduce((s,a)=>s+(i[a.severity]||0),0);return Math.max(0,Math.min(100,100-n))}var b={name:"yuktai-a11y",version:"2.0.0",observer:null,async execute(t){if(!t.enabled)return this.stopObserver(),"yuktai-a11y: disabled.";S=t,$e(),Re(),Ee(),Te(),t.showSkipLinks!==!1&&Se(),t.showPreferencePanel!==!1&&ne(t),C(t);let i=this.applyFixes(t);i.score=ie(i),t.showAuditBadge&&Me(i),t.timeoutWarning&&oe(t.timeoutWarning),t.autoFix&&this.startObserver(t);let n=`${i.fixed} accessibility fixes applied. Score: ${i.score}/100.`;return p(n,i.score>=90?"success":"info",!1),`yuktai-a11y v2: ${n} Scanned ${i.scanned} elements in ${i.renderTime}ms.`},applyFixes(t){let i={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return i;let n=performance.now(),s=document.querySelectorAll("*");i.scanned=s.length;let a=(l,e,r,y)=>{i.details.push({tag:l,fix:e,severity:r,element:y.outerHTML.slice(0,100)}),i.fixed++};return s.forEach(l=>{let e=l,r=e.tagName.toLowerCase();if(r==="html"&&!e.getAttribute("lang")&&(e.setAttribute("lang","en"),a(r,'lang="en" added to <html>',"critical",e)),r==="head"&&!document.title&&(document.title=document.querySelector("h1")?.innerText?.trim()||"Page",a(r,`document.title set to "${document.title}"`,"serious",e)),r==="meta"){let o=e.getAttribute("name"),d=e.getAttribute("content")||"";o==="viewport"&&d.includes("user-scalable=no")&&(e.setAttribute("content",d.replace("user-scalable=no","user-scalable=yes")),a(r,"user-scalable=yes restored","serious",e)),o==="viewport"&&/maximum-scale=1(?:[^0-9]|$)/.test(d)&&(e.setAttribute("content",d.replace(/maximum-scale=1(?=[^0-9]|$)/,"maximum-scale=5")),a(r,"maximum-scale=5 restored","serious",e))}if(r==="main"&&!e.getAttribute("tabindex")&&(e.setAttribute("tabindex","-1"),e.getAttribute("id")||e.setAttribute("id","main-content")),r==="body"&&document.querySelectorAll("video[autoplay]:not([muted])").forEach(o=>{o.muted=!0,a("video","autoplay video muted (deaf users)","serious",e)}),t.largeTargets&&(r==="button"||r==="a"||r==="input")){let o=e.getBoundingClientRect();o.width>0&&o.width<24&&(e.style.minWidth="44px",e.style.minHeight="44px",a(r,"min 44px touch target enforced","minor",e))}if(Z.has(r)&&(!e.innerText?.trim()&&!e.getAttribute("aria-label")&&!e.getAttribute("aria-labelledby")&&(e.setAttribute("aria-label",`${r.toUpperCase()} section`),a(r,"aria-label added (empty heading)","moderate",e)),e.hasAttribute("onclick")&&!e.getAttribute("tabindex")&&(e.setAttribute("tabindex","0"),e.onkeydown||(e.onkeydown=o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),e.click())}),a(r,"tabindex=0 + keydown (clickable heading)","minor",e))),r==="img"&&(e.hasAttribute("alt")||(e.setAttribute("alt",""),e.setAttribute("aria-hidden","true"),a(r,'alt="" aria-hidden="true"',"serious",e)),e.getAttribute("role")==="presentation"&&e.getAttribute("alt")!==""&&(e.setAttribute("alt",""),a(r,'alt="" (role=presentation)',"minor",e))),r==="area"&&!e.getAttribute("alt")){let o=e.getAttribute("title")||e.getAttribute("href")||"map area";e.setAttribute("alt",o),a(r,`alt="${o}" on <area>`,"serious",e)}if(r==="svg"){if(!e.getAttribute("aria-hidden")&&!e.getAttribute("aria-label")&&!l.querySelector("title"))if(!e.getAttribute("role")||e.getAttribute("role")==="img"){let o=document.createElementNS("http://www.w3.org/2000/svg","title");o.textContent="graphic",e.prepend(o),e.setAttribute("role","img"),a(r,'role="img" + <title> injected',"moderate",e)}else e.setAttribute("aria-hidden","true"),a(r,'aria-hidden="true" (decorative svg)',"minor",e);e.getAttribute("focusable")||e.setAttribute("focusable","false")}if(r==="canvas"&&(e.getAttribute("role")||(e.setAttribute("role","img"),a(r,'role="img"',"serious",e)),e.getAttribute("aria-label")||(e.setAttribute("aria-label",e.getAttribute("title")||"canvas graphic"),a(r,"aria-label added to canvas","serious",e))),(r==="object"||r==="embed")&&!e.getAttribute("aria-label")&&!e.getAttribute("title")&&(e.setAttribute("aria-label",`embedded ${r} content`),a(r,`aria-label added to <${r}>`,"moderate",e)),r==="video"&&!l.querySelector("track")&&!e.getAttribute("aria-label")&&(e.setAttribute("aria-label",e.getAttribute("title")||"video player"),a(r,"aria-label added (no captions track)","serious",e)),r==="audio"&&!l.querySelector("track")&&!e.getAttribute("aria-label")&&(e.setAttribute("aria-label",e.getAttribute("title")||"audio player"),a(r,"aria-label added to audio","serious",e)),r==="iframe"&&!e.getAttribute("title")&&!e.getAttribute("aria-label")&&(e.setAttribute("title","embedded content"),e.setAttribute("aria-label","embedded content"),a(r,'title + aria-label="embedded content"',"serious",e)),r==="figure"&&!l.querySelector("figcaption")&&!e.getAttribute("aria-label")){let d=l.querySelector("img")?.getAttribute("alt");d&&(e.setAttribute("aria-label",d),a(r,"aria-label from inner img alt","minor",e))}if(r==="button"){if(!e.innerText?.trim()&&!e.getAttribute("aria-label")&&!e.getAttribute("aria-labelledby")){let o=e.getAttribute("title")||e.getAttribute("data-label")||"button";e.setAttribute("aria-label",o),a(r,`aria-label="${o}" (empty button)`,"critical",e)}e.hasAttribute("disabled")&&!e.getAttribute("aria-disabled")&&(e.setAttribute("aria-disabled","true"),i.fixed++),e.getAttribute("data-yuktai-announced")||(e.setAttribute("data-yuktai-announced","true"),e.addEventListener("click",()=>{let o=e.getAttribute("aria-label")||e.textContent?.trim()||"button";setTimeout(()=>{p(`${o} activated`,"success",!1)},100)}))}if(r==="a"){let o=e;if(!e.innerText?.trim()&&!e.getAttribute("aria-label")&&!e.getAttribute("aria-labelledby")){let d=e.getAttribute("title")||"link";e.setAttribute("aria-label",d),a(r,`aria-label="${d}" (empty link)`,"critical",e)}if(o.target==="_blank"){o.rel?.includes("noopener")||(o.rel="noopener noreferrer",i.fixed++);let d=o.getAttribute("aria-label")||o.innerText?.trim()||"link";d.includes("opens in new window")||(o.setAttribute("aria-label",`${d} (opens in new window)`),a(r,"aria-label: new-window warning","moderate",e))}!o.href&&!o.getAttribute("role")&&!o.getAttribute("tabindex")&&(o.setAttribute("role","button"),o.setAttribute("tabindex","0"),a(r,'role="button" tabindex=0 (href-less link)',"serious",e))}if((e.hasAttribute("onclick")||typeof window<"u"&&window.getComputedStyle(e).cursor==="pointer")&&!ve.has(r)&&(e.getAttribute("role")||(e.setAttribute("role","button"),a(r,'role="button" (clickable non-interactive)',"serious",e)),e.tabIndex<0&&(e.tabIndex=0,i.fixed++),e.onkeydown||(e.onkeydown=o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),e.click())})),Q.has(r)){let o=e;if(!e.getAttribute("aria-label")&&!e.getAttribute("aria-labelledby")){let d=e.getAttribute("placeholder")||e.getAttribute("name")||e.getAttribute("title")||r;e.setAttribute("aria-label",d),a(r,`aria-label="${d}"`,"serious",e)}if(e.hasAttribute("required")&&!e.getAttribute("aria-required")&&(e.setAttribute("aria-required","true"),i.fixed++),e.hasAttribute("disabled")&&!e.getAttribute("aria-disabled")&&(e.setAttribute("aria-disabled","true"),i.fixed++),e.hasAttribute("readonly")&&!e.getAttribute("aria-readonly")&&(e.setAttribute("aria-readonly","true"),i.fixed++),e.getAttribute("data-yuktai-validation")||(e.setAttribute("data-yuktai-validation","true"),e.addEventListener("invalid",()=>{let d=e.getAttribute("aria-label")||e.getAttribute("placeholder")||"Field",x=e.validationMessage||"is invalid";p(`Error: ${d} ${x}`,"error")}),e.addEventListener("change",()=>{if(e.validity?.valid){let d=e.getAttribute("aria-label")||e.getAttribute("placeholder")||"Field";p(`${d} looks good`,"success",!1)}})),r==="input"&&!o.autocomplete){let d=o.name||"";o.type==="email"||d.includes("email")?(o.autocomplete="email",i.fixed++):o.type==="tel"||d.includes("tel")?(o.autocomplete="tel",i.fixed++):o.type==="password"?(o.autocomplete="current-password",i.fixed++):d.includes("firstname")||d.includes("fname")?(o.autocomplete="given-name",i.fixed++):d.includes("lastname")||d.includes("lname")?(o.autocomplete="family-name",i.fixed++):d==="name"||d.includes("fullname")?(o.autocomplete="name",i.fixed++):d.includes("zip")||d.includes("postal")?(o.autocomplete="postal-code",i.fixed++):d.includes("city")?(o.autocomplete="address-level2",i.fixed++):d.includes("country")&&(o.autocomplete="country",i.fixed++)}r==="input"&&o.type==="image"&&!e.getAttribute("alt")&&(e.setAttribute("alt",e.getAttribute("value")||"submit"),a(r,"alt added to input[type=image]","serious",e)),r==="input"&&o.type==="range"&&(e.getAttribute("aria-valuemin")||e.setAttribute("aria-valuemin",o.min||"0"),e.getAttribute("aria-valuemax")||e.setAttribute("aria-valuemax",o.max||"100"),e.getAttribute("aria-valuenow")||e.setAttribute("aria-valuenow",o.value||"50"),i.fixed++)}if(r==="fieldset"&&!l.querySelector("legend")&&!e.getAttribute("aria-label")&&!e.getAttribute("aria-labelledby")&&(e.setAttribute("aria-label","form group"),a(r,'aria-label="form group" (no legend)',"moderate",e)),r==="table"&&(!l.querySelector("th")&&!e.getAttribute("role")&&(e.setAttribute("role","grid"),a(r,'role="grid" (no <th>)',"serious",e)),!l.querySelector("caption")&&!e.getAttribute("aria-label")&&(e.setAttribute("aria-label","data table"),a(r,'aria-label="data table"',"moderate",e))),r==="th"&&!e.getAttribute("scope")){let o=e.closest("thead")!==null;e.setAttribute("scope",o?"col":"row"),a(r,`scope="${o?"col":"row"}"`,"moderate",e)}if(we.has(r)&&(e.getAttribute("role")==="presentation"&&(l.querySelectorAll("li").forEach(o=>{o.getAttribute("role")||o.setAttribute("role","presentation")}),i.fixed++),(r==="ul"||r==="ol")&&!e.getAttribute("aria-label"))){let o=e.closest("nav");o&&(e.setAttribute("aria-label",o.getAttribute("aria-label")||"navigation list"),a(r,"aria-label from parent nav","minor",e))}if(K[r]&&!e.getAttribute("role")&&(e.setAttribute("role",K[r]),a(r,`role="${K[r]}"`,"minor",e)),["nav","section","article","aside"].includes(r)){let o=l.parentElement?.querySelectorAll(r);if(o&&o.length>1&&!e.getAttribute("aria-label")&&!e.getAttribute("aria-labelledby")){let x=l.querySelector("h1,h2,h3,h4,h5,h6")?.textContent?.trim();x&&(e.setAttribute("aria-label",x),a(r,"aria-label from inner heading","moderate",e))}}if(r==="details"&&!l.querySelector("summary")){let o=document.createElement("summary");o.textContent=e.getAttribute("aria-label")||"More details",e.prepend(o),a(r,"<summary> injected","moderate",e)}if(r==="summary"&&!e.innerText?.trim()&&!e.getAttribute("aria-label")&&(e.setAttribute("aria-label","Toggle details"),a(r,'aria-label="Toggle details"',"moderate",e)),r==="dialog"){let o=e.getAttribute("role");if(o&&o!=="dialog"&&o!=="alertdialog"&&(e.setAttribute("role","dialog"),a(r,'role corrected to "dialog"',"serious",e)),!e.getAttribute("aria-label")&&!e.getAttribute("aria-labelledby")){let x=l.querySelector("h1,h2,h3,h4,h5,h6")?.textContent?.trim()||"dialog";e.setAttribute("aria-label",x),a(r,"aria-label added to dialog","serious",e)}e.getAttribute("data-yuktai-trap")||(e.setAttribute("data-yuktai-trap","true"),new MutationObserver(()=>{e.style.display!=="none"&&e.style.visibility!=="hidden"&&E(e)}).observe(e,{attributes:!0,attributeFilter:["style","open"]}))}if(r==="abbr"&&!e.getAttribute("title")&&(e.setAttribute("title",e.innerText?.trim()||"abbreviation"),a(r,"title added to <abbr>","minor",e)),r==="time"&&!e.getAttribute("datetime")&&e.innerText?.trim()&&(e.setAttribute("datetime",e.innerText.trim()),a(r,`datetime="${e.innerText.trim()}" added`,"minor",e)),r==="meter"&&!e.getAttribute("aria-label")&&!e.getAttribute("aria-labelledby")&&(e.setAttribute("aria-label",e.getAttribute("title")||"meter"),a(r,"aria-label added to <meter>","moderate",e)),r==="progress"){!e.getAttribute("aria-label")&&!e.getAttribute("aria-labelledby")&&(e.setAttribute("aria-label",e.getAttribute("title")||"progress"),a(r,"aria-label added to <progress>","moderate",e));let o=e;e.getAttribute("aria-valuenow")||e.setAttribute("aria-valuenow",String(o.value)),e.getAttribute("aria-valuemax")||e.setAttribute("aria-valuemax",String(o.max||1)),i.fixed++}let f=e.getAttribute("role")||"";if(f==="tab"&&!e.getAttribute("aria-selected")&&(e.setAttribute("aria-selected","false"),i.fixed++),f==="tabpanel"&&(!e.getAttribute("aria-label")&&!e.getAttribute("aria-labelledby")&&(e.setAttribute("aria-label","tab panel"),a(r,'aria-label="tab panel"',"moderate",e)),e.getAttribute("tabindex")||(e.setAttribute("tabindex","0"),i.fixed++)),["alert","status","log","marquee"].includes(f)){if(!e.getAttribute("aria-live")){let o=f==="alert"?"assertive":"polite";e.setAttribute("aria-live",o),a(r,`aria-live="${o}" on role=${f}`,"moderate",e)}e.getAttribute("aria-atomic")||(e.setAttribute("aria-atomic","true"),i.fixed++)}f==="tooltip"&&!e.getAttribute("aria-live")&&(e.setAttribute("aria-live","polite"),i.fixed++),(f==="menu"||f==="menubar")&&!e.getAttribute("aria-label")&&!e.getAttribute("aria-labelledby")&&(e.setAttribute("aria-label","menu"),a(r,'aria-label="menu"',"moderate",e)),f==="listbox"&&!e.getAttribute("aria-label")&&!e.getAttribute("aria-labelledby")&&(e.setAttribute("aria-label","listbox"),a(r,'aria-label="listbox"',"moderate",e)),f==="option"&&!e.getAttribute("aria-selected")&&(e.setAttribute("aria-selected","false"),i.fixed++),f==="slider"&&(e.getAttribute("aria-valuemin")||e.setAttribute("aria-valuemin","0"),e.getAttribute("aria-valuemax")||e.setAttribute("aria-valuemax","100"),e.getAttribute("aria-valuenow")||e.setAttribute("aria-valuenow","50"),i.fixed++),(f==="checkbox"||f==="radio")&&!e.getAttribute("aria-checked")&&(e.setAttribute("aria-checked","false"),a(r,`aria-checked="false" on role=${f}`,"serious",e)),f==="combobox"&&(e.getAttribute("aria-expanded")||(e.setAttribute("aria-expanded","false"),a(r,'aria-expanded="false" on combobox',"serious",e)),e.getAttribute("aria-haspopup")||(e.setAttribute("aria-haspopup","listbox"),i.fixed++)),(f==="grid"||f==="treegrid")&&!e.getAttribute("aria-label")&&!e.getAttribute("aria-labelledby")&&(e.setAttribute("aria-label","data grid"),a(r,'aria-label="data grid"',"moderate",e)),f==="tree"&&!e.getAttribute("aria-label")&&!e.getAttribute("aria-labelledby")&&(e.setAttribute("aria-label","tree"),a(r,'aria-label="tree"',"moderate",e)),f==="spinbutton"&&(e.getAttribute("aria-valuenow")||e.setAttribute("aria-valuenow","0"),e.getAttribute("aria-valuemin")||e.setAttribute("aria-valuemin","0"),e.getAttribute("aria-valuemax")||e.setAttribute("aria-valuemax","100"),i.fixed++)}),i.renderTime=parseFloat((performance.now()-n).toFixed(2)),i},scan(){let t={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return t;let i=performance.now(),n=document.querySelectorAll("*");t.scanned=n.length;let s=(a,l,e,r)=>t.details.push({tag:a,fix:l,severity:e,element:r.outerHTML.slice(0,100)});return n.forEach(a=>{let l=a,e=l.tagName.toLowerCase();(e==="a"||e==="button")&&!l.innerText?.trim()&&!l.getAttribute("aria-label")&&s(e,"needs aria-label (empty)","critical",l),e==="img"&&!l.hasAttribute("alt")&&s(e,"needs alt text","serious",l),Q.has(e)&&!l.getAttribute("aria-label")&&!l.getAttribute("aria-labelledby")&&s(e,"needs aria-label","serious",l),e==="iframe"&&!l.getAttribute("title")&&!l.getAttribute("aria-label")&&s(e,"iframe needs title","serious",l),ke.has(e)&&!a.querySelector("track")&&!l.getAttribute("aria-label")&&s(e,"media needs captions/aria-label","serious",l),Z.has(e)&&!l.innerText?.trim()&&!l.getAttribute("aria-label")&&s(e,"empty heading","moderate",l)}),t.fixed=t.details.length,t.score=ie(t),t.renderTime=parseFloat((performance.now()-i).toFixed(2)),t},startObserver(t){this.observer||typeof document>"u"||(this.observer=new MutationObserver(()=>this.applyFixes(t)),this.observer.observe(document.body,{childList:!0,subtree:!0,attributes:!1}))},stopObserver(){this.observer?.disconnect(),this.observer=null},announce:p,speak:Y,showVisualAlert:ae,trapFocus:E};var g=require("react");var B=he(require("react"),1),u=require("react/jsx-runtime"),G={highContrast:!1,reduceMotion:!1,autoFix:!0,dyslexiaFont:!1,fontScale:100},T=[80,90,100,110,120,130,140,150],le=[{id:"highContrast",label:"High contrast",description:"contrast(1.15) brightness on all nodes",icon:"\u25D1"},{id:"reduceMotion",label:"Reduce motion",description:"Disables all transitions & animations",icon:"\u23F8"},{id:"autoFix",label:"Auto-fix ARIA",description:"MutationObserver on new DOM nodes",icon:"\u267F"},{id:"dyslexiaFont",label:"Dyslexia-friendly font",description:"Wider letter & word spacing",icon:"Aa"}];function He({checked:t,onChange:i,label:n}){return(0,u.jsxs)("label",{"aria-label":n,style:{position:"relative",display:"inline-flex",width:40,height:24,cursor:"pointer",flexShrink:0},children:[(0,u.jsx)("input",{type:"checkbox",checked:t,onChange:s=>i(s.target.checked),style:{opacity:0,width:0,height:0,position:"absolute"}}),(0,u.jsx)("span",{style:{position:"absolute",inset:0,borderRadius:99,background:t?"#0d9488":"#cbd5e1",transition:"background 0.2s"}}),(0,u.jsx)("span",{style:{position:"absolute",top:3,left:t?19:3,width:18,height:18,background:"#fff",borderRadius:"50%",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)",pointerEvents:"none"}})]})}var V=(0,B.forwardRef)(({position:t,settings:i,report:n,isActive:s,set:a,onApply:l,onReset:e,onClose:r},y)=>(0,u.jsxs)("div",{ref:y,role:"dialog","aria-modal":"true","aria-label":"yuktai-a11y accessibility options",style:{position:"fixed",bottom:24,...t==="left"?{left:88}:{right:88},width:312,background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,boxShadow:"0 8px 32px rgba(0,0,0,0.12)",zIndex:9998,overflow:"hidden",fontFamily:"system-ui,-apple-system,sans-serif"},children:[(0,u.jsxs)("div",{style:{padding:"14px 18px 12px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"flex-start",justifyContent:"space-between"},children:[(0,u.jsxs)("div",{children:[(0,u.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:7,marginBottom:5},children:[(0,u.jsx)("span",{style:{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:99,background:"#f0fdfa",color:"#0d9488",letterSpacing:"0.05em",fontFamily:"monospace"},children:"@yuktishaalaa/yuktai v1.0.0"}),s&&(0,u.jsx)("span",{style:{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:99,background:"#f0fdfa",color:"#0f766e",border:"1px solid #99f6e4"},children:"\u25CF ACTIVE"})]}),(0,u.jsx)("p",{style:{margin:"0 0 2px",fontSize:15,fontWeight:600,color:"#0f172a"},children:"Accessibility"}),(0,u.jsx)("p",{style:{margin:0,fontSize:12,color:"#64748b"},children:"Zero-config WCAG fixes \xB7 Open Source"})]}),(0,u.jsx)("button",{onClick:r,"aria-label":"Close panel",style:{background:"none",border:"none",cursor:"pointer",padding:4,color:"#94a3b8",fontSize:18,lineHeight:1,borderRadius:6},children:"\xD7"})]}),(0,u.jsx)("div",{style:{padding:"6px 0"},children:le.map((o,d)=>(0,u.jsxs)(B.default.Fragment,{children:[(0,u.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 18px",gap:12},children:[(0,u.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:10,flex:1},children:[(0,u.jsx)("span",{"aria-hidden":"true",style:{width:30,height:30,borderRadius:8,background:"#f0fdfa",color:"#0d9488",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0,fontWeight:700},children:o.icon}),(0,u.jsxs)("div",{children:[(0,u.jsx)("p",{style:{margin:0,fontSize:13,fontWeight:500,color:"#0f172a"},children:o.label}),(0,u.jsx)("p",{style:{margin:0,fontSize:11,color:"#94a3b8"},children:o.description})]})]}),(0,u.jsx)(He,{checked:i[o.id],onChange:x=>a(o.id,x),label:`Toggle ${o.label}`})]}),d<le.length-1&&(0,u.jsx)("div",{style:{height:1,background:"#f8fafc",margin:"0 18px"}})]},o.id))}),(0,u.jsxs)("div",{style:{padding:"10px 18px 14px",borderTop:"1px solid #f1f5f9"},children:[(0,u.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10},children:[(0,u.jsx)("p",{style:{margin:0,fontSize:13,fontWeight:500,color:"#0f172a"},children:"Text size"}),(0,u.jsxs)("span",{style:{fontSize:12,fontWeight:600,color:"#0d9488",background:"#f0fdfa",padding:"2px 8px",borderRadius:99},children:[i.fontScale,"%"]})]}),(0,u.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:8},children:[(0,u.jsx)("button",{onClick:()=>{let o=T.indexOf(i.fontScale);o>0&&a("fontScale",T[o-1])},disabled:i.fontScale<=80,"aria-label":"Decrease text size",style:{width:30,height:30,borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",cursor:i.fontScale<=80?"not-allowed":"pointer",fontSize:16,color:i.fontScale<=80?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"\u2212"}),(0,u.jsx)("div",{style:{flex:1,display:"flex",gap:3},children:T.map(o=>(0,u.jsx)("button",{onClick:()=>a("fontScale",o),"aria-label":`Set text size to ${o}%`,style:{flex:1,height:6,borderRadius:99,border:"none",cursor:"pointer",padding:0,background:o<=i.fontScale?"#0d9488":"#e2e8f0",transition:"background 0.15s"}},o))}),(0,u.jsx)("button",{onClick:()=>{let o=T.indexOf(i.fontScale);o<T.length-1&&a("fontScale",T[o+1])},disabled:i.fontScale>=150,"aria-label":"Increase text size",style:{width:30,height:30,borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",cursor:i.fontScale>=150?"not-allowed":"pointer",fontSize:16,color:i.fontScale>=150?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"+"})]})]}),n&&(0,u.jsx)("div",{role:"status",style:{margin:"0 14px",padding:"8px 12px",background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:8,fontSize:12,color:"#0f766e",fontWeight:500,fontFamily:"monospace"},children:n.fixed>0?`\u2713 ${n.fixed} fixes applied \xB7 ${n.scanned} nodes \xB7 ${n.renderTime}ms`:`\u2713 0 fixes needed \xB7 ${n.scanned} nodes clean \xB7 ${n.renderTime}ms`}),(0,u.jsxs)("div",{style:{display:"flex",gap:8,padding:"12px 14px 14px"},children:[(0,u.jsx)("button",{onClick:e,style:{flex:1,padding:"8px 0",fontSize:13,fontWeight:500,borderRadius:9,border:"1px solid #e2e8f0",background:"#fff",color:"#64748b",cursor:"pointer"},children:"Reset"}),(0,u.jsx)("button",{onClick:l,style:{flex:2,padding:"8px 0",fontSize:13,fontWeight:600,borderRadius:9,border:"none",background:"#0d9488",color:"#fff",cursor:"pointer"},children:"Apply settings"})]})]}));V.displayName="WidgetPanel";var h=require("react/jsx-runtime"),F=null,M=null;function q({children:t,position:i="left"}){let[n,s]=(0,g.useState)(!1),[a,l]=(0,g.useState)(!1),[e,r]=(0,g.useState)(G),[y,f]=(0,g.useState)(null),[o,d]=(0,g.useState)(!1),x=(0,g.useRef)(null),k=(0,g.useRef)(null);(0,g.useEffect)(()=>s(!0),[]),(0,g.useEffect)(()=>{if(F)return;let c=document.createElement("style");return c.innerHTML=`
      *:focus-visible {
        outline: 3px solid #0d9488 !important;
        outline-offset: 3px !important;
        box-shadow: 0 0 0 6px rgba(13,148,136,.2) !important;
        border-radius: 2px !important;
      }
      *:focus:not(:focus-visible) {
        outline: none !important;
      }
    `,document.head.appendChild(c),F=c,()=>{F?.remove(),F=null}},[]),(0,g.useEffect)(()=>()=>{b.stopObserver()},[]),(0,g.useEffect)(()=>{if(!a)return;let c=A=>{x.current&&!x.current.contains(A.target)&&k.current&&!k.current.contains(A.target)&&(l(!1),k.current?.focus(),b.announce("Accessibility panel closed","info",!1))};return document.addEventListener("mousedown",c),()=>document.removeEventListener("mousedown",c)},[a]),(0,g.useEffect)(()=>{let c=A=>{A.key==="Escape"&&a&&(l(!1),k.current?.focus(),b.announce("Accessibility panel closed","info",!1))};return document.addEventListener("keydown",c),()=>document.removeEventListener("keydown",c)},[a]);let de=(c,A)=>r(L=>({...L,[c]:A})),ue=(0,g.useCallback)(async()=>{let c={enabled:!0,highContrast:e.highContrast,darkMode:e.darkMode??!1,reduceMotion:e.reduceMotion,autoFix:e.autoFix,largeTargets:e.largeTargets??!1,speechEnabled:e.speechEnabled??!1,colorBlindMode:e.colorBlindMode??"none",showPreferencePanel:!1,showSkipLinks:!0,showAuditBadge:e.showAuditBadge??!1,timeoutWarning:e.timeoutWarning??void 0},A=await b.execute(c);console.log("[yuktai-a11y]",A);let L=b.applyFixes(c);f(L);let fe=Math.min(Math.max(e.fontScale??100,80),130);if(document.documentElement.style.fontSize=`${fe}%`,e.dyslexiaFont){if(!M){let N=document.createElement("link");N.rel="stylesheet",N.href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap",document.head.appendChild(N);let D=document.createElement("style");D.textContent=`
          body, body * {
            font-family: 'Atkinson Hyperlegible', Arial, sans-serif !important;
            letter-spacing: 0.05em !important;
            word-spacing: 0.1em !important;
            line-height: 1.8 !important;
          }
        `,document.head.appendChild(D),M=D}}else M?.remove(),M=null;d(!0),l(!1),b.announce(`Accessibility active. ${L.fixed} fixes applied. Score: ${L.score}/100.`,"success")},[e]),ce=(0,g.useCallback)(async()=>{await b.execute({enabled:!1}),document.documentElement.style.fontSize="",M?.remove(),M=null,document.querySelectorAll("*").forEach(c=>{c.style.filter="",c.style.transition="",c.style.animation=""}),r(G),f(null),d(!1),b.announce("Accessibility reset to default.","info")},[]);return n?(0,h.jsxs)(h.Fragment,{children:[t,(0,h.jsxs)("button",{ref:k,onClick:()=>{let c=!a;l(c),c&&b.announce("Accessibility panel opened","info",!1)},"aria-label":o?"Accessibility options \u2014 currently active. Click to change settings.":"Open accessibility options","aria-expanded":a,"aria-haspopup":"dialog",style:{position:"fixed",bottom:24,...i==="left"?{left:24}:{right:24},width:52,height:52,borderRadius:"50%",background:o?"#0f766e":"#0d9488",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 14px rgba(0,0,0,0.18)",zIndex:9999,transition:"background 0.2s, transform 0.15s",outline:"none"},onMouseEnter:c=>c.currentTarget.style.transform="scale(1.08)",onMouseLeave:c=>c.currentTarget.style.transform="scale(1)",onFocus:c=>c.currentTarget.style.boxShadow="0 0 0 4px rgba(13,148,136,0.45)",onBlur:c=>c.currentTarget.style.boxShadow="0 4px 14px rgba(0,0,0,0.18)",children:[(0,h.jsx)("svg",{viewBox:"0 0 24 24",style:{width:26,height:26,fill:"#fff"},"aria-hidden":"true",focusable:"false",children:(0,h.jsx)("path",{d:"M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm9 4.5l-5-.5-2-.2V5l-4 .5-4-.5v.8L4 6.5 3 7l1 3 4-.5v2.3L6 17h2l2-4.5L12 14l2 2.5L16 17h2l-2-4.2V9.5l4 .5 1-3z"})}),o&&(0,h.jsx)("span",{"aria-hidden":"true",style:{position:"absolute",top:4,right:4,width:10,height:10,borderRadius:"50%",background:"#5eead4",border:"2px solid #fff"}})]}),a&&(0,h.jsx)(V,{ref:x,position:i,settings:e,report:y,isActive:o,set:de,onApply:ue,onReset:ce,onClose:()=>{l(!1),k.current?.focus(),b.announce("Accessibility panel closed","info",!1)}})]}):(0,h.jsx)(h.Fragment,{children:t})}var R={name:"ai.text",async execute(t){return`\u{1F916} YuktAI says: ${t}`}};var H={name:"voice.text",async execute(t){return!t||t.trim()===""?"\u{1F3A4} No speech detected":`\u{1F3A4} You said: ${t}`}};var v=class{plugins=new Map;register(i,n){if(!n||typeof n.execute!="function")throw new Error(`Invalid plugin: ${i}`);this.plugins.set(i,n)}use(i){return this.plugins.get(i)}async run(i,n){try{let s=this.use(i);if(!s)throw new Error(`Plugin not found: ${i}`);return await s.execute(n)}catch(s){throw console.error(`[YuktAI Runtime Error in ${i}]:`,s),s}}getPlugins(){return Array.from(this.plugins.keys())}};function ze(){if(typeof globalThis>"u")return new v;if(!globalThis.__yuktai_runtime__){let t=new v;t.register(b.name,b),t.register(R.name,R),t.register(H.name,H),globalThis.__yuktai_runtime__=t}return globalThis.__yuktai_runtime__}var se=typeof window<"u"?ze():new v,Pe={wcagPlugin:b,list(){return se.getPlugins()},use(t){return se.use(t)},fix(t){return b.applyFixes({enabled:!0,autoFix:!0,...t})},scan(){return b.scan()}};0&&(module.exports={Runtime,YuktAI,YuktAIWrapper,aiPlugin,voicePlugin,wcag,wcagPlugin});
