"use strict";var YuktAI=(()=>{var T=Object.defineProperty;var le=Object.getOwnPropertyDescriptor;var ce=Object.getOwnPropertyNames;var ue=Object.prototype.hasOwnProperty;var de=(e,t)=>{for(var i in t)T(e,i,{get:t[i],enumerable:!0})},pe=(e,t,i,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of ce(t))!ue.call(e,n)&&n!==i&&T(e,n,{get:()=>t[n],enumerable:!(r=le(t,n))||r.enumerable});return e};var me=e=>pe(T({},"__esModule",{value:!0}),e);var Oe={};de(Oe,{wcagPlugin:()=>Ie});function O(){let e=window;return e.Rewriter||e.ai?.rewriter||null}async function S(){try{let e=O();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}async function fe(e){if(!e||e.trim().length<20)return{success:!1,original:e,rewritten:e,error:"Text too short"};try{let t=O();if(!t)throw new Error("Rewriter API not available");let i=await t.create({tone:"more-casual",format:"plain-text",length:"as-is",outputLanguage:"en"}),r=await i.rewrite(e,{context:"Rewrite this text in simple plain English. Use short sentences. Avoid jargon. Make it easy to understand for everyone."});return i.destroy(),{success:!0,original:e,rewritten:r.trim()}}catch(t){return{success:!1,original:e,rewritten:e,error:t instanceof Error?t.message:"Rewrite failed"}}}async function q(){if(!await S())return{fixed:0,error:"Chrome Built-in AI Rewriter not available. Enable via chrome://flags."};let t=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption"),i=0;for(let r of t){let n=r.innerText?.trim();if(!n||n.length<20||r.closest("[data-yuktai-panel]"))continue;let o=await fe(n);o.success&&o.rewritten!==n&&(r.dataset.yuktaiOriginal=n,r.innerText=o.rewritten,i++)}return{fixed:i}}function B(){let e=document.querySelectorAll("[data-yuktai-original]");for(let t of e){let i=t.dataset.yuktaiOriginal;i&&(t.innerText=i,delete t.dataset.yuktaiOriginal)}}var D="yuktai-summary-box";function N(){let e=window;return e.Summarizer||e.ai?.summarizer||null}async function L(){try{let e=N();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}function be(){let e=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, article, section"),t=[];for(let i of e){if(i.closest("[data-yuktai-panel]"))continue;let r=window.getComputedStyle(i);if(r.display==="none"||r.visibility==="hidden")continue;let n=i.innerText?.trim();n&&n.length>10&&t.push(n)}return t.join(" ").slice(0,5e3)}async function F(){if(!await L())return{success:!1,summary:"",error:"Chrome Built-in AI Summarizer not available. Enable via chrome://flags."};let t=be();if(!t||t.length<100)return{success:!1,summary:"",error:"Not enough text on this page to summarise."};try{let i=N();if(!i)throw new Error("Summarizer API not available");let r=await i.create({type:"tl;dr",format:"plain-text",length:"short",outputLanguage:"en"}),n=await r.summarize(t,{context:"Summarise this page in 2-3 simple sentences for a screen reader user who wants to know if this page is relevant to them."});return r.destroy(),ye(n.trim()),{success:!0,summary:n.trim()}}catch(i){return{success:!1,summary:"",error:i instanceof Error?i.message:"Summary failed"}}}function ye(e){h();let t=document.createElement("div");t.id=D,t.setAttribute("data-yuktai-panel","true"),t.setAttribute("role","region"),t.setAttribute("aria-label","Page summary by yuktai"),t.style.cssText=`
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
  `;let i=document.createElement("p");i.style.cssText="margin: 0; flex: 1;",i.textContent=`\u{1F4CB} Page summary: ${e}`;let r=document.createElement("button");r.textContent="\xD7",r.setAttribute("aria-label","Close page summary"),r.style.cssText=`
    background: none; border: none; color: #ffffff;
    font-size: 20px; cursor: pointer; padding: 0 4px;
    line-height: 1; flex-shrink: 0;
  `,r.addEventListener("click",h),t.appendChild(i),t.appendChild(r),document.body.prepend(t)}function h(){let e=document.getElementById(D);e&&e.remove()}var V=[{code:"en",label:"English"},{code:"hi",label:"Hindi"},{code:"es",label:"Spanish"},{code:"fr",label:"French"},{code:"de",label:"German"},{code:"it",label:"Italian"},{code:"pt",label:"Portuguese"},{code:"nl",label:"Dutch"},{code:"pl",label:"Polish"},{code:"ru",label:"Russian"},{code:"ja",label:"Japanese"},{code:"ko",label:"Korean"},{code:"zh",label:"Chinese"},{code:"ar",label:"Arabic"},{code:"tr",label:"Turkish"},{code:"vi",label:"Vietnamese"},{code:"bn",label:"Bengali"},{code:"id",label:"Indonesian"}],x="en";async function ge(e){try{return window.translation?await window.translation.canTranslate({sourceLanguage:"en",targetLanguage:e})!=="no":!1}catch{return!1}}async function _(e){if(e===x)return{success:!0,language:e,fixed:0};if(e==="en")return M(),x="en",{success:!0,language:"en",fixed:0};if(!await ge(e))return{success:!1,language:e,fixed:0,error:`Translation to ${e} not available. Chrome 127+ required.`};try{let i=await window.translation.createTranslator({sourceLanguage:"en",targetLanguage:e}),r=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption, span, a"),n=0;for(let o of r){if(o.closest("[data-yuktai-panel]")||o.children.length>0)continue;let a=o.innerText?.trim();if(!a||a.length<2)continue;o.dataset.yuktaiTranslationOriginal||(o.dataset.yuktaiTranslationOriginal=a);let s=await i.translate(a);s&&s!==a&&(o.innerText=s,n++)}return i.destroy(),x=e,{success:!0,language:e,fixed:n}}catch(i){return{success:!1,language:e,fixed:0,error:i instanceof Error?i.message:"Translation failed"}}}function M(){let e=document.querySelectorAll("[data-yuktai-translation-original]");for(let t of e){let i=t.dataset.yuktaiTranslationOriginal;i&&(t.innerText=i,delete t.dataset.yuktaiTranslationOriginal)}x="en"}var he=[{phrases:["go to main","skip to main","main content"],action:"focus-main",label:"Jump to main content"},{phrases:["go to navigation","go to nav","open menu"],action:"focus-nav",label:"Jump to navigation"},{phrases:["go to search","search","find"],action:"focus-search",label:"Jump to search"},{phrases:["scroll down","page down","next"],action:"scroll-down",label:"Scroll down"},{phrases:["scroll up","page up","back up"],action:"scroll-up",label:"Scroll up"},{phrases:["go back","previous page"],action:"go-back",label:"Go back"},{phrases:["click","press","select"],action:"click-focused",label:"Click focused element"},{phrases:["next item","tab forward","tab"],action:"tab-forward",label:"Move to next element"},{phrases:["previous item","tab back","shift tab"],action:"tab-back",label:"Move to previous element"},{phrases:["stop listening","stop voice","quiet"],action:"stop-voice",label:"Stop voice control"}],p=null,w=!1,f=null;function C(){return!!(window.SpeechRecognition||window.webkitSpeechRecognition)}function xe(e){let t=e.toLowerCase().trim();for(let i of he)for(let r of i.phrases)if(t.includes(r))return{action:i.action,label:i.label};return null}function we(e){switch(e){case"focus-main":{let t=document.querySelector("main, [role='main'], #main");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-nav":{let t=document.querySelector("nav, [role='navigation']");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-search":{let t=document.querySelector("input[type='search'], input[role='searchbox'], [aria-label*='search' i]");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"scroll-down":{window.scrollBy({top:400,behavior:"smooth"});break}case"scroll-up":{window.scrollBy({top:-400,behavior:"smooth"});break}case"go-back":{window.history.back();break}case"click-focused":{let t=document.activeElement;t&&t!==document.body&&t.click();break}case"tab-forward":{let t=G(),i=t.indexOf(document.activeElement),r=t[i+1]||t[0];r&&r.focus();break}case"tab-back":{let t=G(),i=t.indexOf(document.activeElement),r=t[i-1]||t[t.length-1];r&&r.focus();break}case"stop-voice":{P();break}}}function G(){return Array.from(document.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(e=>!e.closest("[data-yuktai-panel]"))}function W(e){if(!C())return!1;if(w)return!0;e&&(f=e);let t=window.SpeechRecognition||window.webkitSpeechRecognition;return p=new t,p.continuous=!0,p.interimResults=!1,p.lang="en-US",p.onresult=i=>{let r=i.results[i.results.length-1][0].transcript,n=xe(r);if(n){we(n.action);let o={success:!0,command:r,action:n.label};if(f&&f(o),n.action==="stop-voice")return}},p.onend=()=>{w&&p?.start()},p.onerror=i=>{i.error!=="no-speech"&&f&&f({success:!1,command:"",action:"",error:`Voice error: ${i.error}`})},p.start(),w=!0,ve(),!0}function P(){w=!1,p&&(p.stop(),p=null),f=null,K()}var j="yuktai-voice-indicator";function ve(){K();let e=document.createElement("div");e.id=j,e.setAttribute("data-yuktai-panel","true"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-label","yuktai voice control is listening"),e.style.cssText=`
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
    `,document.head.appendChild(r)}let i=document.createElement("span");i.textContent="Listening for commands...",e.appendChild(t),e.appendChild(i),document.body.appendChild(e)}function K(){let e=document.getElementById(j);e&&e.remove()}var ke=["button:not([aria-label]):not([aria-labelledby])","a:not([aria-label]):not([aria-labelledby])","input:not([aria-label]):not([aria-labelledby]):not([id])","select:not([aria-label]):not([aria-labelledby])","textarea:not([aria-label]):not([aria-labelledby])","[role='button']:not([aria-label])","[role='link']:not([aria-label])","[role='checkbox']:not([aria-label])","[role='tab']:not([aria-label])"].join(", ");function U(){let e=window;return e.Writer||e.ai?.writer||null}async function $(){try{let e=U();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}function Ae(e){let t=[],i=e.innerText?.trim();i&&t.push(`element text: "${i}"`);let r=e.placeholder?.trim();r&&t.push(`placeholder: "${r}"`);let n=e.getAttribute("name")?.trim();n&&t.push(`name: "${n}"`);let o=e.getAttribute("type")?.trim();o&&t.push(`type: "${o}"`);let a=e.id;if(a){let c=document.querySelector(`label[for="${a}"]`);c&&t.push(`label: "${c.innerText?.trim()}"`)}let s=e.parentElement?.innerText?.trim().slice(0,60);s&&t.push(`parent context: "${s}"`),t.push(`tag: ${e.tagName.toLowerCase()}`);let d=e.getAttribute("role");return d&&t.push(`role: ${d}`),t.join(". ")}async function Ee(e,t){let i=`
    Generate a short, clear aria-label for an HTML element.
    The label must be 2-6 words maximum.
    The label must describe what the element does or what it is.
    Do not include punctuation.
    Do not explain \u2014 just output the label text only.

    Element details:
    ${t}

    Output only the label. Nothing else.
  `.trim();return(await e.write(i)).trim().replace(/^["']|["']$/g,"").replace(/\.$/,"").trim()}async function Y(){if(!await $())return{success:!1,fixed:0,elements:[],error:"Chrome Built-in AI Writer not available. Enable via chrome://flags."};let t=document.querySelectorAll(ke);if(t.length===0)return{success:!0,fixed:0,elements:[]};try{let i=U();if(!i)throw new Error("Writer API not available");let r=await i.create({tone:"neutral",format:"plain-text",length:"short",outputLanguage:"en"}),n=0,o=[];for(let a of t){if(a.closest("[data-yuktai-panel]"))continue;let s=window.getComputedStyle(a);if(s.display==="none"||s.visibility==="hidden")continue;let d=Ae(a),c=await Ee(r,d);c&&c.length>0&&(a.dataset.yuktaiLabelOriginal=a.getAttribute("aria-label")||"",a.setAttribute("aria-label",c),n++,o.push({tag:a.tagName.toLowerCase(),label:c}))}return r.destroy(),{success:!0,fixed:n,elements:o}}catch(i){return{success:!1,fixed:0,elements:[],error:i instanceof Error?i.message:"Label generation failed"}}}function J(){let e=document.querySelectorAll("[data-yuktai-label-original]");for(let t of e){let i=t.dataset.yuktaiLabelOriginal;i?t.setAttribute("aria-label",i):t.removeAttribute("aria-label"),delete t.dataset.yuktaiLabelOriginal}}var A=null,X=null;var Q=null,H=null,u=null,b=null,v=null,R=null,y=null,k={deuteranopia:"yuktai-cb-d",protanopia:"yuktai-cb-p",tritanopia:"yuktai-cb-t"};var Z=new Set(["input","select","textarea"]);var z={nav:"navigation",header:"banner",footer:"contentinfo",main:"main",aside:"complementary"};function I(e,t="polite"){if(typeof window>"u"||!y?.speechEnabled||!window.speechSynthesis)return;window.speechSynthesis.cancel();let i=new SpeechSynthesisUtterance(e);i.rate=1,i.pitch=1,i.volume=1;let r=window.speechSynthesis.getVoices();r.length>0&&(i.voice=r[0]),window.speechSynthesis.speak(i)}function oe(e,t="info"){if(typeof document>"u")return;let r={success:{bg:"#0f9d58",border:"#0a7a44",icon:"\u2713"},error:{bg:"#d93025",border:"#b52a1c",icon:"\u2715"},warning:{bg:"#f29900",border:"#c67c00",icon:"\u26A0"},info:{bg:"#1a73e8",border:"#1557b0",icon:"\u2139"}}[t];u||(u=document.createElement("div"),u.setAttribute("role","alert"),u.setAttribute("aria-live","assertive"),u.setAttribute("aria-atomic","true"),u.style.cssText=`
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
    `,document.body.appendChild(u)),u.style.background=r.bg,u.style.border=`1px solid ${r.border}`,u.style.color="#fff",u.innerHTML=`
    <span style="font-size:18px;font-weight:700">${r.icon}</span>
    <span style="flex:1;line-height:1.4">${e}</span>
    <button
      onclick="this.parentElement.style.transform='translateX(120%)';this.parentElement.style.opacity='0'"
      style="background:none;border:none;color:#fff;cursor:pointer;font-size:18px;padding:0;line-height:1"
      aria-label="Close notification">\xD7</button>
  `,window.innerWidth<=480&&(u.style.right="8px",u.style.left="8px",u.style.maxWidth="none",u.style.width="auto"),requestAnimationFrame(()=>{u&&(u.style.transform="translateX(0)",u.style.opacity="1")}),setTimeout(()=>{u&&(u.style.transform="translateX(120%)",u.style.opacity="0")},5e3)}function l(e,t="info",i=!0){A&&(A.textContent=e),oe(e,t),i&&I(e,t==="error"?"assertive":"polite")}function Te(){if(typeof document>"u"||Q)return;let e=[{label:"Skip to main content",selector:"main,[role='main'],#main,#main-content"},{label:"Skip to navigation",selector:"nav,[role='navigation'],#nav,#navigation"},{label:"Skip to search",selector:"[role='search'],#search,input[type='search']"}],t=document.createElement("div");t.setAttribute("data-yuktai-skip-bar","true"),t.setAttribute("role","navigation"),t.setAttribute("aria-label","Skip links"),t.style.cssText=`
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
  `;let i=!1;if(e.forEach(({label:n,selector:o})=>{let a=document.querySelector(o);if(!a)return;i=!0,a.getAttribute("tabindex")||a.setAttribute("tabindex","-1");let s=document.createElement("a");s.href="#",s.textContent=n,s.style.cssText=`
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
    `,s.addEventListener("focus",()=>{t.style.transform="translateY(0)"}),s.addEventListener("blur",()=>{setTimeout(()=>{t.matches(":focus-within")||(t.style.transform="translateY(-100%)")},2e3)}),s.addEventListener("click",d=>{d.preventDefault(),a.focus(),a.scrollIntoView({behavior:"smooth",block:"start"}),l(`Jumped to ${n.replace("Skip to ","")}`,"info"),t.style.transform="translateY(-100%)"}),t.appendChild(s)}),!i)return;window.innerWidth<768&&(t.style.transform="translateY(0)",t.style.position="sticky"),window.addEventListener("resize",()=>{window.innerWidth<768&&(t.style.transform="translateY(0)")}),document.body.insertBefore(t,document.body.firstChild),Q=t}function Se(){if(typeof document>"u"||document.querySelector("[data-yuktai-focus-style]"))return;let e=document.createElement("style");e.setAttribute("data-yuktai-focus-style","true"),e.textContent=`

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
  `,document.head.appendChild(e),document.documentElement.setAttribute("data-yuktai-a11y","true")}function Le(){typeof document>"u"||document.querySelector("[data-yuktai-kb-init]")||(document.documentElement.setAttribute("data-yuktai-kb-init","true"),document.addEventListener("keydown",e=>{let t=document.activeElement;if(!t)return;let i=t.getAttribute("role")||"";if(e.key==="Escape"){let r=t.closest("[role='dialog'],[role='alertdialog']");if(r){r.style.display="none",l("Dialog closed","info");return}let n=t.closest("[role='menu'],[role='menubar']");n&&(n.style.display="none",l("Menu closed","info"))}if(i==="menuitem"||t.closest("[role='menu'],[role='menubar']")){let r=t.closest("[role='menu'],[role='menubar']");if(!r)return;let n=Array.from(r.querySelectorAll("[role='menuitem']:not([disabled])")),o=n.indexOf(t);e.key==="ArrowDown"||e.key==="ArrowRight"?(e.preventDefault(),n[(o+1)%n.length]?.focus()):e.key==="ArrowUp"||e.key==="ArrowLeft"?(e.preventDefault(),n[(o-1+n.length)%n.length]?.focus()):e.key==="Home"?(e.preventDefault(),n[0]?.focus()):e.key==="End"&&(e.preventDefault(),n[n.length-1]?.focus())}if(i==="tab"||t.closest("[role='tablist']")){let r=t.closest("[role='tablist']");if(!r)return;let n=Array.from(r.querySelectorAll("[role='tab']:not([disabled])")),o=n.indexOf(t);if(e.key==="ArrowRight"||e.key==="ArrowDown"){e.preventDefault();let a=n[(o+1)%n.length];a?.focus(),a?.click()}else if(e.key==="ArrowLeft"||e.key==="ArrowUp"){e.preventDefault();let a=n[(o-1+n.length)%n.length];a?.focus(),a?.click()}}if(i==="option"||t.closest("[role='listbox']")){let r=t.closest("[role='listbox']");if(!r)return;let n=Array.from(r.querySelectorAll("[role='option']:not([aria-disabled='true'])")),o=n.indexOf(t);e.key==="ArrowDown"?(e.preventDefault(),n[(o+1)%n.length]?.focus()):e.key==="ArrowUp"?(e.preventDefault(),n[(o-1+n.length)%n.length]?.focus()):(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),t.setAttribute("aria-selected","true"),n.forEach(a=>{a!==t&&a.setAttribute("aria-selected","false")}),l(`Selected: ${t.textContent?.trim()}`,"success"))}e.altKey&&e.key==="a"&&(e.preventDefault(),Me()),e.key==="Tab"&&y?.speechEnabled&&setTimeout(()=>{let r=document.activeElement;if(!r)return;let n=r.getAttribute("aria-label")||r.getAttribute("title")||r.textContent?.trim()||r.tagName.toLowerCase(),o=r.getAttribute("role")||r.tagName.toLowerCase();I(`${n}, ${o}`)},100)}))}function E(e){let t=e.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[role="button"]');if(t.length===0)return;let i=t[0],r=t[t.length-1];i.focus(),e.addEventListener("keydown",n=>{n.key==="Tab"&&(n.shiftKey?document.activeElement===i&&(n.preventDefault(),r.focus()):document.activeElement===r&&(n.preventDefault(),i.focus()))})}function Me(){if(typeof document>"u")return;if(b){b.remove(),b=null;return}let e=document.createElement("div");e.setAttribute("role","dialog"),e.setAttribute("aria-label","Keyboard shortcuts"),e.setAttribute("aria-modal","true"),e.setAttribute("data-yuktai-cheatsheet","true"),e.style.cssText=`
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
    ${t.map(([r,n])=>`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #2a2a4a">
        <kbd style="background:#2a2a4a;color:#74c0fc;padding:3px 8px;border-radius:4px;font-size:12px;font-family:monospace;border:1px solid #3a3a6a">${r}</kbd>
        <span style="font-size:12px;color:#ccc;text-align:right;flex:1;margin-left:12px">${n}</span>
      </div>
    `).join("")}
  `,e.querySelector("[data-yuktai-close]")?.addEventListener("click",()=>{e.remove(),b=null}),e.addEventListener("keydown",r=>{r.key==="Escape"&&(e.remove(),b=null)}),document.body.appendChild(e),b=e,E(e),l("Keyboard shortcuts opened. Press Escape to close.","info")}function Ce(e){if(typeof document>"u"||!y?.showAuditBadge||typeof window<"u"&&!window.location.hostname.includes("localhost")&&!window.location.hostname.includes("127.0.0.1"))return;H&&H.remove();let t=e.score,i=t>=90?"#0f9d58":t>=70?"#f29900":"#d93025",r=t>=90?"\u267F":t>=70?"\u26A0":"\u2715",n=document.createElement("button");n.setAttribute("aria-label",`Accessibility score: ${t} out of 100`),n.setAttribute("data-yuktai-badge","true"),n.style.cssText=`
    position: fixed;
    bottom: 16px;
    left: 16px;
    z-index: 999998;
    background: ${i};
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
  `,n.innerHTML=`${r} ${t}/100 <span style="font-weight:400;opacity:0.85">${e.details.length} issues</span>`,n.addEventListener("click",()=>Pe(e)),document.body.appendChild(n),H=n}function Pe(e){let t=document.querySelector("[data-yuktai-audit-details]");if(t){t.remove();return}let i=document.createElement("div");i.setAttribute("data-yuktai-audit-details","true"),i.setAttribute("role","dialog"),i.setAttribute("aria-label","Accessibility audit details"),i.style.cssText=`
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
  `;let r={critical:"#d93025",serious:"#f29900",moderate:"#1a73e8",minor:"#0f9d58"};i.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <strong style="font-size:14px;color:#74c0fc">Audit report</strong>
      <span style="color:#aaa">${e.fixed} fixed \xB7 ${e.renderTime}ms</span>
    </div>
    ${e.details.slice(0,20).map(n=>`
      <div style="padding:6px 0;border-bottom:1px solid #2a2a4a">
        <div style="display:flex;gap:6px;align-items:center">
          <span style="background:${r[n.severity]};color:#fff;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:700;text-transform:uppercase">${n.severity}</span>
          <code style="color:#74c0fc">&lt;${n.tag}&gt;</code>
        </div>
        <div style="color:#ccc;margin-top:3px">${n.fix}</div>
      </div>
    `).join("")}
    ${e.details.length>20?`<div style="color:#888;padding:8px 0;text-align:center">+${e.details.length-20} more issues</div>`:""}
  `,i.addEventListener("keydown",n=>{n.key==="Escape"&&i.remove()}),document.body.appendChild(i),E(i)}function se(e){typeof document>"u"||(R&&clearTimeout(R),R=setTimeout(()=>{if(v)return;let t=document.createElement("div");t.setAttribute("role","alertdialog"),t.setAttribute("aria-label","Session timeout warning"),t.setAttribute("aria-modal","true"),t.setAttribute("data-yuktai-timeout","true"),t.style.cssText=`
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
    `;let i=t.querySelector("[data-yuktai-extend]"),r=t.querySelector("[data-yuktai-dismiss]");i?.addEventListener("click",()=>{t.remove(),v=null,l("Session extended. You have more time.","success"),y?.timeoutWarning&&se(y.timeoutWarning)}),r?.addEventListener("click",()=>{t.remove(),v=null}),document.body.appendChild(t),v=t,E(t),l("Warning: Your session will expire soon. Do you need more time?","warning")},e*1e3))}function $e(e){if(typeof document>"u")return;let t=document.documentElement;if(t.toggleAttribute("data-yuktai-high-contrast",!!e.highContrast),t.toggleAttribute("data-yuktai-dark",!!e.darkMode),t.toggleAttribute("data-yuktai-reduce-motion",!!e.reduceMotion),t.toggleAttribute("data-yuktai-large-targets",!!e.largeTargets),t.toggleAttribute("data-yuktai-keyboard",!!e.keyboardHints),t.toggleAttribute("data-yuktai-dyslexia",!!e.dyslexiaFont),e.localFont?document.body.style.fontFamily=`"${e.localFont}", system-ui, sans-serif`:e.dyslexiaFont||(document.body.style.fontFamily=""),e.fontSizeMultiplier&&e.fontSizeMultiplier!==1?document.documentElement.style.fontSize=`${e.fontSizeMultiplier*100}%`:document.documentElement.style.fontSize="",e.colorBlindMode&&e.colorBlindMode!=="none"){let i=e.colorBlindMode==="achromatopsia"?"grayscale(100%)":`url(#${k[e.colorBlindMode]})`;document.body.style.filter=i}else document.body.style.filter=""}function He(e){try{let t=localStorage.getItem("yuktai-a11y-prefs");t&&Object.assign(e,JSON.parse(t))}catch{}}async function ee(e){if(e){if(!await S()){l("Plain English requires Chrome 127+","warning");return}l("Rewriting page in plain English...","info",!1);let i=await q();l(i.error?`Plain English failed: ${i.error}`:`${i.fixed} sections rewritten in plain English`,i.error?"error":"success",!1)}else B(),l("Original text restored","info",!1)}async function te(e){if(e){if(!await L()){l("Page summariser requires Chrome 127+","warning");return}l("Generating page summary...","info",!1);let i=await F();l(i.error?`Summary failed: ${i.error}`:"Page summary added at top",i.error?"error":"success",!1)}else h(),l("Page summary removed","info",!1)}async function ie(e){if(e==="en"){M(),l("Page restored to English","info",!1);return}l(`Translating page to ${e}...`,"info",!1);let t=await _(e);l(t.error?`Translation failed: ${t.error}`:`Page translated to ${e}`,t.error?"error":"success",!1)}async function ae(e){if(e){if(!C()){l("Voice control not supported in this browser","warning");return}W(t=>{t.success&&l(`Voice: ${t.action}`,"info",!1)}),l("Voice control started. Say a command.","success",!1)}else P(),l("Voice control stopped","info",!1)}async function ne(e){if(e){if(!await $()){l("Smart labels requires Chrome 127+","warning");return}l("Generating smart labels...","info",!1);let i=await Y();l(i.error?`Smart labels failed: ${i.error}`:`${i.fixed} elements labelled`,i.error?"error":"success",!1)}else J(),l("Smart labels removed","info",!1)}function Re(){if(typeof document>"u"||A)return;let e=document.createElement("div");e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e.setAttribute("aria-relevant","text"),e.style.cssText="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);",document.body.appendChild(e),A=e}function ze(){if(typeof document>"u"||X)return;let e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("aria-hidden","true"),e.style.cssText="position:absolute;width:0;height:0;overflow:hidden;",e.innerHTML=`
    <defs>
      <filter id="${k.deuteranopia}">
        <feColorMatrix type="matrix"
          values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${k.protanopia}">
        <feColorMatrix type="matrix"
          values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${k.tritanopia}">
        <feColorMatrix type="matrix"
          values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"/>
      </filter>
    </defs>
  `,document.body.appendChild(e),X=e}function re(e){let t={critical:20,serious:10,moderate:5,minor:2},i=e.details.reduce((r,n)=>r+(t[n.severity]||0),0);return Math.max(0,Math.min(100,100-i))}var Ie={name:"yuktai-a11y",version:"4.0.0",observer:null,async execute(e){if(!e.enabled)return this.stopObserver(),"yuktai: disabled.";y=e,He(e),Re(),ze(),Se(),Le(),e.showSkipLinks!==!1&&Te(),e.showPreferencePanel,$e(e);let t=this.applyFixes(e);t.score=re(t),e.showAuditBadge&&Ce(t),e.timeoutWarning&&se(e.timeoutWarning),e.autoFix&&this.startObserver(e),e.plainEnglish&&await ee(!0),e.summarisePage&&await te(!0),e.translateLanguage&&e.translateLanguage!=="en"&&await ie(e.translateLanguage),e.voiceControl&&await ae(!0),e.smartLabels&&await ne(!0);let i=`${t.fixed} fixes applied. Score: ${t.score}/100.`;return l(i,t.score>=90?"success":"info",!1),`yuktai v4.0.0: ${i} Scanned ${t.scanned} elements in ${t.renderTime}ms.`},applyFixes(e){let t={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return t;let i=performance.now(),r=document.querySelectorAll("*");t.scanned=r.length;let n=(o,a,s,d)=>{t.details.push({tag:o,fix:a,severity:s,element:d.outerHTML.slice(0,100)}),t.fixed++};return r.forEach(o=>{let a=o,s=a.tagName.toLowerCase();if(s==="html"&&!a.getAttribute("lang")&&(a.setAttribute("lang","en"),n(s,'lang="en" added',"critical",a)),s==="meta"){let c=a.getAttribute("name"),m=a.getAttribute("content")||"";c==="viewport"&&m.includes("user-scalable=no")&&(a.setAttribute("content",m.replace("user-scalable=no","user-scalable=yes")),n(s,"user-scalable=yes restored","serious",a)),c==="viewport"&&/maximum-scale=1(?:[^0-9]|$)/.test(m)&&(a.setAttribute("content",m.replace(/maximum-scale=1(?=[^0-9]|$)/,"maximum-scale=5")),n(s,"maximum-scale=5 restored","serious",a))}if(s==="main"&&!a.getAttribute("tabindex")&&(a.setAttribute("tabindex","-1"),a.getAttribute("id")||a.setAttribute("id","main-content")),s==="img"&&(a.hasAttribute("alt")||(a.setAttribute("alt",""),a.setAttribute("aria-hidden","true"),n(s,'alt="" aria-hidden="true"',"serious",a))),s==="svg"&&(!a.getAttribute("aria-hidden")&&!a.getAttribute("aria-label")&&!o.querySelector("title")&&(a.setAttribute("aria-hidden","true"),n(s,'aria-hidden="true" (decorative svg)',"minor",a)),a.getAttribute("focusable")||a.setAttribute("focusable","false")),s==="iframe"&&!a.getAttribute("title")&&!a.getAttribute("aria-label")&&(a.setAttribute("title","embedded content"),a.setAttribute("aria-label","embedded content"),n(s,"title + aria-label added","serious",a)),s==="button"){if(!a.innerText?.trim()&&!a.getAttribute("aria-label")){let c=a.getAttribute("title")||"button";a.setAttribute("aria-label",c),n(s,`aria-label="${c}" (empty button)`,"critical",a)}a.hasAttribute("disabled")&&!a.getAttribute("aria-disabled")&&(a.setAttribute("aria-disabled","true"),t.fixed++)}if(s==="a"){let c=a;!a.innerText?.trim()&&!a.getAttribute("aria-label")&&(a.setAttribute("aria-label",a.getAttribute("title")||"link"),n(s,"aria-label added (empty link)","critical",a)),c.target==="_blank"&&!c.rel?.includes("noopener")&&(c.rel="noopener noreferrer",t.fixed++)}if(Z.has(s)){let c=a;if(!a.getAttribute("aria-label")&&!a.getAttribute("aria-labelledby")){let m=a.getAttribute("placeholder")||a.getAttribute("name")||s;a.setAttribute("aria-label",m),n(s,`aria-label="${m}"`,"serious",a)}if(a.hasAttribute("required")&&!a.getAttribute("aria-required")&&(a.setAttribute("aria-required","true"),t.fixed++),s==="input"&&!c.autocomplete){let m=c.name||"";c.type==="email"||m.includes("email")?c.autocomplete="email":c.type==="tel"||m.includes("tel")?c.autocomplete="tel":c.type==="password"&&(c.autocomplete="current-password"),t.fixed++}}s==="th"&&!a.getAttribute("scope")&&(a.setAttribute("scope",a.closest("thead")?"col":"row"),n(s,"scope added to <th>","moderate",a)),z[s]&&!a.getAttribute("role")&&(a.setAttribute("role",z[s]),n(s,`role="${z[s]}"`,"minor",a));let d=a.getAttribute("role")||"";d==="tab"&&!a.getAttribute("aria-selected")&&(a.setAttribute("aria-selected","false"),t.fixed++),["alert","status","log"].includes(d)&&!a.getAttribute("aria-live")&&(a.setAttribute("aria-live",d==="alert"?"assertive":"polite"),n(s,`aria-live added on role=${d}`,"moderate",a)),d==="combobox"&&!a.getAttribute("aria-expanded")&&(a.setAttribute("aria-expanded","false"),n(s,'aria-expanded="false" on combobox',"serious",a)),(d==="checkbox"||d==="radio")&&!a.getAttribute("aria-checked")&&(a.setAttribute("aria-checked","false"),n(s,`aria-checked="false" on role=${d}`,"serious",a))}),t.renderTime=parseFloat((performance.now()-i).toFixed(2)),t},scan(){let e={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return e;let t=performance.now(),i=document.querySelectorAll("*");e.scanned=i.length;let r=(n,o,a,s)=>e.details.push({tag:n,fix:o,severity:a,element:s.outerHTML.slice(0,100)});return i.forEach(n=>{let o=n,a=o.tagName.toLowerCase();(a==="a"||a==="button")&&!o.innerText?.trim()&&!o.getAttribute("aria-label")&&r(a,"needs aria-label (empty)","critical",o),a==="img"&&!o.hasAttribute("alt")&&r(a,"needs alt text","serious",o),Z.has(a)&&!o.getAttribute("aria-label")&&!o.getAttribute("aria-labelledby")&&r(a,"needs aria-label","serious",o),a==="iframe"&&!o.getAttribute("title")&&!o.getAttribute("aria-label")&&r(a,"iframe needs title","serious",o)}),e.fixed=e.details.length,e.score=re(e),e.renderTime=parseFloat((performance.now()-t).toFixed(2)),e},startObserver(e){this.observer||typeof document>"u"||(this.observer=new MutationObserver(()=>this.applyFixes(e)),this.observer.observe(document.body,{childList:!0,subtree:!0,attributes:!1}))},stopObserver(){this.observer?.disconnect(),this.observer=null},announce:l,speak:I,showVisualAlert:oe,trapFocus:E,handlePlainEnglish:ee,handleSummarisePage:te,handleTranslate:ie,handleVoiceControl:ae,handleSmartLabels:ne,SUPPORTED_LANGUAGES:V};return me(Oe);})();
