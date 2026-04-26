"use strict";var YuktAI=(()=>{var T=Object.defineProperty;var ne=Object.getOwnPropertyDescriptor;var oe=Object.getOwnPropertyNames;var se=Object.prototype.hasOwnProperty;var le=(e,t)=>{for(var i in t)T(e,i,{get:t[i],enumerable:!0})},ce=(e,t,i,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of oe(t))!se.call(e,a)&&a!==i&&T(e,a,{get:()=>t[a],enumerable:!(n=ne(t,a))||n.enumerable});return e};var ue=e=>ce(T({},"__esModule",{value:!0}),e);var Re={};le(Re,{wcagPlugin:()=>He});async function S(){try{return window.ai?.rewriter?(await window.ai.rewriter.capabilities()).available!=="no":!1}catch{return!1}}async function de(e){if(!e||e.trim().length<20)return{success:!1,original:e,rewritten:e,error:"Text too short"};try{let t=await window.ai.rewriter.create({tone:"more-casual",format:"plain-text",length:"as-is"}),i=await t.rewrite(e,{context:"Rewrite this text in simple plain English. Use short sentences. Avoid jargon. Make it easy to understand for everyone."});return t.destroy(),{success:!0,original:e,rewritten:i.trim()}}catch(t){return{success:!1,original:e,rewritten:e,error:t instanceof Error?t.message:"Rewrite failed"}}}async function q(){if(!await S())return{fixed:0,error:"Chrome Built-in AI not available on this device. Chrome 127+ required."};let t=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption"),i=0;for(let n of t){let a=n.innerText?.trim();if(!a||a.length<20||n.closest("[data-yuktai-panel]"))continue;let o=await de(a);o.success&&o.rewritten!==a&&(n.dataset.yuktaiOriginal=a,n.innerText=o.rewritten,i++)}return{fixed:i}}function B(){let e=document.querySelectorAll("[data-yuktai-original]");for(let t of e){let i=t.dataset.yuktaiOriginal;i&&(t.innerText=i,delete t.dataset.yuktaiOriginal)}}var D="yuktai-summary-box";async function L(){try{return window.ai?.summarizer?(await window.ai.summarizer.capabilities()).available!=="no":!1}catch{return!1}}function me(){let e=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, article, section"),t=[];for(let i of e){if(i.closest("[data-yuktai-panel]"))continue;let n=window.getComputedStyle(i);if(n.display==="none"||n.visibility==="hidden")continue;let a=i.innerText?.trim();a&&a.length>10&&t.push(a)}return t.join(" ").slice(0,5e3)}async function N(){if(!await L())return{success:!1,summary:"",error:"Chrome Built-in AI not available. Chrome 127+ required."};let t=me();if(!t||t.length<100)return{success:!1,summary:"",error:"Not enough text on this page to summarise."};try{let i=await window.ai.summarizer.create({type:"tl;dr",format:"plain-text",length:"short"}),n=await i.summarize(t,{context:"Summarise this page in 2-3 simple sentences for a screen reader user who wants to know if this page is relevant to them."});return i.destroy(),pe(n.trim()),{success:!0,summary:n.trim()}}catch(i){return{success:!1,summary:"",error:i instanceof Error?i.message:"Summary failed"}}}function pe(e){h();let t=document.createElement("div");t.id=D,t.setAttribute("data-yuktai-panel","true"),t.setAttribute("role","region"),t.setAttribute("aria-label","Page summary by yuktai"),t.style.cssText=`
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
  `;let i=document.createElement("p");i.style.cssText="margin: 0; flex: 1;",i.textContent=`\u{1F4CB} Page summary: ${e}`;let n=document.createElement("button");n.textContent="\xD7",n.setAttribute("aria-label","Close page summary"),n.style.cssText=`
    background: none;
    border: none;
    color: #ffffff;
    font-size: 20px;
    cursor: pointer;
    padding: 0 4px;
    line-height: 1;
    flex-shrink: 0;
  `,n.addEventListener("click",h),t.appendChild(i),t.appendChild(n),document.body.prepend(t)}function h(){let e=document.getElementById(D);e&&e.remove()}var F=[{code:"en",label:"English"},{code:"hi",label:"Hindi"},{code:"es",label:"Spanish"},{code:"fr",label:"French"},{code:"de",label:"German"},{code:"it",label:"Italian"},{code:"pt",label:"Portuguese"},{code:"nl",label:"Dutch"},{code:"pl",label:"Polish"},{code:"ru",label:"Russian"},{code:"ja",label:"Japanese"},{code:"ko",label:"Korean"},{code:"zh",label:"Chinese"},{code:"ar",label:"Arabic"},{code:"tr",label:"Turkish"},{code:"vi",label:"Vietnamese"},{code:"bn",label:"Bengali"},{code:"id",label:"Indonesian"}],x="en";async function fe(e){try{return window.translation?await window.translation.canTranslate({sourceLanguage:"en",targetLanguage:e})!=="no":!1}catch{return!1}}async function I(e){if(e===x)return{success:!0,language:e,fixed:0};if(e==="en")return C(),x="en",{success:!0,language:"en",fixed:0};if(!await fe(e))return{success:!1,language:e,fixed:0,error:`Translation to ${e} not available. Chrome 127+ required.`};try{let i=await window.translation.createTranslator({sourceLanguage:"en",targetLanguage:e}),n=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption, span, a"),a=0;for(let o of n){if(o.closest("[data-yuktai-panel]")||o.children.length>0)continue;let r=o.innerText?.trim();if(!r||r.length<2)continue;o.dataset.yuktaiTranslationOriginal||(o.dataset.yuktaiTranslationOriginal=r);let s=await i.translate(r);s&&s!==r&&(o.innerText=s,a++)}return i.destroy(),x=e,{success:!0,language:e,fixed:a}}catch(i){return{success:!1,language:e,fixed:0,error:i instanceof Error?i.message:"Translation failed"}}}function C(){let e=document.querySelectorAll("[data-yuktai-translation-original]");for(let t of e){let i=t.dataset.yuktaiTranslationOriginal;i&&(t.innerText=i,delete t.dataset.yuktaiTranslationOriginal)}x="en"}var be=[{phrases:["go to main","skip to main","main content"],action:"focus-main",label:"Jump to main content"},{phrases:["go to navigation","go to nav","open menu"],action:"focus-nav",label:"Jump to navigation"},{phrases:["go to search","search","find"],action:"focus-search",label:"Jump to search"},{phrases:["scroll down","page down","next"],action:"scroll-down",label:"Scroll down"},{phrases:["scroll up","page up","back up"],action:"scroll-up",label:"Scroll up"},{phrases:["go back","previous page"],action:"go-back",label:"Go back"},{phrases:["click","press","select"],action:"click-focused",label:"Click focused element"},{phrases:["next item","tab forward","tab"],action:"tab-forward",label:"Move to next element"},{phrases:["previous item","tab back","shift tab"],action:"tab-back",label:"Move to previous element"},{phrases:["stop listening","stop voice","quiet"],action:"stop-voice",label:"Stop voice control"}],m=null,w=!1,f=null;function M(){return!!(window.SpeechRecognition||window.webkitSpeechRecognition)}function ge(e){let t=e.toLowerCase().trim();for(let i of be)for(let n of i.phrases)if(t.includes(n))return{action:i.action,label:i.label};return null}function ye(e){switch(e){case"focus-main":{let t=document.querySelector("main, [role='main'], #main");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-nav":{let t=document.querySelector("nav, [role='navigation']");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-search":{let t=document.querySelector("input[type='search'], input[role='searchbox'], [aria-label*='search' i]");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"scroll-down":{window.scrollBy({top:400,behavior:"smooth"});break}case"scroll-up":{window.scrollBy({top:-400,behavior:"smooth"});break}case"go-back":{window.history.back();break}case"click-focused":{let t=document.activeElement;t&&t!==document.body&&t.click();break}case"tab-forward":{let t=V(),i=t.indexOf(document.activeElement),n=t[i+1]||t[0];n&&n.focus();break}case"tab-back":{let t=V(),i=t.indexOf(document.activeElement),n=t[i-1]||t[t.length-1];n&&n.focus();break}case"stop-voice":{P();break}}}function V(){return Array.from(document.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(e=>!e.closest("[data-yuktai-panel]"))}function _(e){if(!M())return!1;if(w)return!0;e&&(f=e);let t=window.SpeechRecognition||window.webkitSpeechRecognition;return m=new t,m.continuous=!0,m.interimResults=!1,m.lang="en-US",m.onresult=i=>{let n=i.results[i.results.length-1][0].transcript,a=ge(n);if(a){ye(a.action);let o={success:!0,command:n,action:a.label};if(f&&f(o),a.action==="stop-voice")return}},m.onend=()=>{w&&m?.start()},m.onerror=i=>{i.error!=="no-speech"&&f&&f({success:!1,command:"",action:"",error:`Voice error: ${i.error}`})},m.start(),w=!0,he(),!0}function P(){w=!1,m&&(m.stop(),m=null),f=null,G()}var W="yuktai-voice-indicator";function he(){G();let e=document.createElement("div");e.id=W,e.setAttribute("data-yuktai-panel","true"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-label","yuktai voice control is listening"),e.style.cssText=`
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
  `,!document.getElementById("yuktai-pulse-style")){let n=document.createElement("style");n.id="yuktai-pulse-style",n.textContent=`
      @keyframes yuktai-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50%       { opacity: 0.4; transform: scale(0.7); }
      }
    `,document.head.appendChild(n)}let i=document.createElement("span");i.textContent="Listening for commands...",e.appendChild(t),e.appendChild(i),document.body.appendChild(e)}function G(){let e=document.getElementById(W);e&&e.remove()}var xe=["button:not([aria-label]):not([aria-labelledby])","a:not([aria-label]):not([aria-labelledby])","input:not([aria-label]):not([aria-labelledby]):not([id])","select:not([aria-label]):not([aria-labelledby])","textarea:not([aria-label]):not([aria-labelledby])","[role='button']:not([aria-label])","[role='link']:not([aria-label])","[role='checkbox']:not([aria-label])","[role='tab']:not([aria-label])"].join(", ");async function $(){try{return window.ai?.writer?(await window.ai.writer.capabilities()).available!=="no":!1}catch{return!1}}function we(e){let t=[],i=e.innerText?.trim();i&&t.push(`element text: "${i}"`);let n=e.placeholder?.trim();n&&t.push(`placeholder: "${n}"`);let a=e.getAttribute("name")?.trim();a&&t.push(`name: "${a}"`);let o=e.getAttribute("type")?.trim();o&&t.push(`type: "${o}"`);let r=e.id;if(r){let c=document.querySelector(`label[for="${r}"]`);c&&t.push(`label: "${c.innerText?.trim()}"`)}let s=e.parentElement?.innerText?.trim().slice(0,60);s&&t.push(`parent context: "${s}"`),t.push(`tag: ${e.tagName.toLowerCase()}`);let d=e.getAttribute("role");return d&&t.push(`role: ${d}`),t.join(". ")}async function ve(e,t){let i=`
    Generate a short, clear aria-label for an HTML element.
    The label must be 2-6 words maximum.
    The label must describe what the element does or what it is.
    Do not include punctuation.
    Do not explain \u2014 just output the label text only.

    Element details:
    ${t}

    Output only the label. Nothing else.
  `.trim();return(await e.write(i)).trim().replace(/^["']|["']$/g,"").replace(/\.$/,"").trim()}async function j(){if(!await $())return{success:!1,fixed:0,elements:[],error:"Chrome Built-in AI not available. Chrome 127+ required."};let t=document.querySelectorAll(xe);if(t.length===0)return{success:!0,fixed:0,elements:[]};try{let i=await window.ai.writer.create({tone:"neutral",format:"plain-text",length:"short"}),n=0,a=[];for(let o of t){if(o.closest("[data-yuktai-panel]"))continue;let r=window.getComputedStyle(o);if(r.display==="none"||r.visibility==="hidden")continue;let s=we(o),d=await ve(i,s);d&&d.length>0&&(o.dataset.yuktaiLabelOriginal=o.getAttribute("aria-label")||"",o.setAttribute("aria-label",d),n++,a.push({tag:o.tagName.toLowerCase(),label:d}))}return i.destroy(),{success:!0,fixed:n,elements:a}}catch(i){return{success:!1,fixed:0,elements:[],error:i instanceof Error?i.message:"Label generation failed"}}}function K(){let e=document.querySelectorAll("[data-yuktai-label-original]");for(let t of e){let i=t.dataset.yuktaiLabelOriginal;i?t.setAttribute("aria-label",i):t.removeAttribute("aria-label"),delete t.dataset.yuktaiLabelOriginal}}var A=null,U=null;var Y=null,H=null,u=null,b=null,v=null,R=null,g=null,k={deuteranopia:"yuktai-cb-d",protanopia:"yuktai-cb-p",tritanopia:"yuktai-cb-t"};var J=new Set(["input","select","textarea"]);var z={nav:"navigation",header:"banner",footer:"contentinfo",main:"main",aside:"complementary"};function O(e,t="polite"){if(typeof window>"u"||!g?.speechEnabled||!window.speechSynthesis)return;window.speechSynthesis.cancel();let i=new SpeechSynthesisUtterance(e);i.rate=1,i.pitch=1,i.volume=1;let n=window.speechSynthesis.getVoices();n.length>0&&(i.voice=n[0]),window.speechSynthesis.speak(i)}function re(e,t="info"){if(typeof document>"u")return;let n={success:{bg:"#0f9d58",border:"#0a7a44",icon:"\u2713"},error:{bg:"#d93025",border:"#b52a1c",icon:"\u2715"},warning:{bg:"#f29900",border:"#c67c00",icon:"\u26A0"},info:{bg:"#1a73e8",border:"#1557b0",icon:"\u2139"}}[t];u||(u=document.createElement("div"),u.setAttribute("role","alert"),u.setAttribute("aria-live","assertive"),u.setAttribute("aria-atomic","true"),u.style.cssText=`
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
    `,document.body.appendChild(u)),u.style.background=n.bg,u.style.border=`1px solid ${n.border}`,u.style.color="#fff",u.innerHTML=`
    <span style="font-size:18px;font-weight:700">${n.icon}</span>
    <span style="flex:1;line-height:1.4">${e}</span>
    <button
      onclick="this.parentElement.style.transform='translateX(120%)';this.parentElement.style.opacity='0'"
      style="background:none;border:none;color:#fff;cursor:pointer;font-size:18px;padding:0;line-height:1"
      aria-label="Close notification">\xD7</button>
  `,window.innerWidth<=480&&(u.style.right="8px",u.style.left="8px",u.style.maxWidth="none",u.style.width="auto"),requestAnimationFrame(()=>{u&&(u.style.transform="translateX(0)",u.style.opacity="1")}),setTimeout(()=>{u&&(u.style.transform="translateX(120%)",u.style.opacity="0")},5e3)}function l(e,t="info",i=!0){A&&(A.textContent=e),re(e,t),i&&O(e,t==="error"?"assertive":"polite")}function ke(){if(typeof document>"u"||Y)return;let e=[{label:"Skip to main content",selector:"main,[role='main'],#main,#main-content"},{label:"Skip to navigation",selector:"nav,[role='navigation'],#nav,#navigation"},{label:"Skip to search",selector:"[role='search'],#search,input[type='search']"}],t=document.createElement("div");t.setAttribute("data-yuktai-skip-bar","true"),t.setAttribute("role","navigation"),t.setAttribute("aria-label","Skip links"),t.style.cssText=`
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
  `;let i=!1;if(e.forEach(({label:a,selector:o})=>{let r=document.querySelector(o);if(!r)return;i=!0,r.getAttribute("tabindex")||r.setAttribute("tabindex","-1");let s=document.createElement("a");s.href="#",s.textContent=a,s.style.cssText=`
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
    `,s.addEventListener("focus",()=>{t.style.transform="translateY(0)"}),s.addEventListener("blur",()=>{setTimeout(()=>{t.matches(":focus-within")||(t.style.transform="translateY(-100%)")},2e3)}),s.addEventListener("click",d=>{d.preventDefault(),r.focus(),r.scrollIntoView({behavior:"smooth",block:"start"}),l(`Jumped to ${a.replace("Skip to ","")}`,"info"),t.style.transform="translateY(-100%)"}),t.appendChild(s)}),!i)return;window.innerWidth<768&&(t.style.transform="translateY(0)",t.style.position="sticky"),window.addEventListener("resize",()=>{window.innerWidth<768&&(t.style.transform="translateY(0)")}),document.body.insertBefore(t,document.body.firstChild),Y=t}function Ae(){if(typeof document>"u"||document.querySelector("[data-yuktai-focus-style]"))return;let e=document.createElement("style");e.setAttribute("data-yuktai-focus-style","true"),e.textContent=`

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
  `,document.head.appendChild(e),document.documentElement.setAttribute("data-yuktai-a11y","true")}function Ee(){typeof document>"u"||document.querySelector("[data-yuktai-kb-init]")||(document.documentElement.setAttribute("data-yuktai-kb-init","true"),document.addEventListener("keydown",e=>{let t=document.activeElement;if(!t)return;let i=t.getAttribute("role")||"";if(e.key==="Escape"){let n=t.closest("[role='dialog'],[role='alertdialog']");if(n){n.style.display="none",l("Dialog closed","info");return}let a=t.closest("[role='menu'],[role='menubar']");a&&(a.style.display="none",l("Menu closed","info"))}if(i==="menuitem"||t.closest("[role='menu'],[role='menubar']")){let n=t.closest("[role='menu'],[role='menubar']");if(!n)return;let a=Array.from(n.querySelectorAll("[role='menuitem']:not([disabled])")),o=a.indexOf(t);e.key==="ArrowDown"||e.key==="ArrowRight"?(e.preventDefault(),a[(o+1)%a.length]?.focus()):e.key==="ArrowUp"||e.key==="ArrowLeft"?(e.preventDefault(),a[(o-1+a.length)%a.length]?.focus()):e.key==="Home"?(e.preventDefault(),a[0]?.focus()):e.key==="End"&&(e.preventDefault(),a[a.length-1]?.focus())}if(i==="tab"||t.closest("[role='tablist']")){let n=t.closest("[role='tablist']");if(!n)return;let a=Array.from(n.querySelectorAll("[role='tab']:not([disabled])")),o=a.indexOf(t);if(e.key==="ArrowRight"||e.key==="ArrowDown"){e.preventDefault();let r=a[(o+1)%a.length];r?.focus(),r?.click()}else if(e.key==="ArrowLeft"||e.key==="ArrowUp"){e.preventDefault();let r=a[(o-1+a.length)%a.length];r?.focus(),r?.click()}}if(i==="option"||t.closest("[role='listbox']")){let n=t.closest("[role='listbox']");if(!n)return;let a=Array.from(n.querySelectorAll("[role='option']:not([aria-disabled='true'])")),o=a.indexOf(t);e.key==="ArrowDown"?(e.preventDefault(),a[(o+1)%a.length]?.focus()):e.key==="ArrowUp"?(e.preventDefault(),a[(o-1+a.length)%a.length]?.focus()):(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),t.setAttribute("aria-selected","true"),a.forEach(r=>{r!==t&&r.setAttribute("aria-selected","false")}),l(`Selected: ${t.textContent?.trim()}`,"success"))}e.altKey&&e.key==="a"&&(e.preventDefault(),Te()),e.key==="Tab"&&g?.speechEnabled&&setTimeout(()=>{let n=document.activeElement;if(!n)return;let a=n.getAttribute("aria-label")||n.getAttribute("title")||n.textContent?.trim()||n.tagName.toLowerCase(),o=n.getAttribute("role")||n.tagName.toLowerCase();O(`${a}, ${o}`)},100)}))}function E(e){let t=e.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[role="button"]');if(t.length===0)return;let i=t[0],n=t[t.length-1];i.focus(),e.addEventListener("keydown",a=>{a.key==="Tab"&&(a.shiftKey?document.activeElement===i&&(a.preventDefault(),n.focus()):document.activeElement===n&&(a.preventDefault(),i.focus()))})}function Te(){if(typeof document>"u")return;if(b){b.remove(),b=null;return}let e=document.createElement("div");e.setAttribute("role","dialog"),e.setAttribute("aria-label","Keyboard shortcuts"),e.setAttribute("aria-modal","true"),e.setAttribute("data-yuktai-cheatsheet","true"),e.style.cssText=`
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
    ${t.map(([n,a])=>`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #2a2a4a">
        <kbd style="background:#2a2a4a;color:#74c0fc;padding:3px 8px;border-radius:4px;font-size:12px;font-family:monospace;border:1px solid #3a3a6a">${n}</kbd>
        <span style="font-size:12px;color:#ccc;text-align:right;flex:1;margin-left:12px">${a}</span>
      </div>
    `).join("")}
  `,e.querySelector("[data-yuktai-close]")?.addEventListener("click",()=>{e.remove(),b=null}),e.addEventListener("keydown",n=>{n.key==="Escape"&&(e.remove(),b=null)}),document.body.appendChild(e),b=e,E(e),l("Keyboard shortcuts opened. Press Escape to close.","info")}function Se(e){if(typeof document>"u"||!g?.showAuditBadge||typeof window<"u"&&!window.location.hostname.includes("localhost")&&!window.location.hostname.includes("127.0.0.1"))return;H&&H.remove();let t=e.score,i=t>=90?"#0f9d58":t>=70?"#f29900":"#d93025",n=t>=90?"\u267F":t>=70?"\u26A0":"\u2715",a=document.createElement("button");a.setAttribute("aria-label",`Accessibility score: ${t} out of 100`),a.setAttribute("data-yuktai-badge","true"),a.style.cssText=`
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
  `,a.innerHTML=`${n} ${t}/100 <span style="font-weight:400;opacity:0.85">${e.details.length} issues</span>`,a.addEventListener("click",()=>Le(e)),document.body.appendChild(a),H=a}function Le(e){let t=document.querySelector("[data-yuktai-audit-details]");if(t){t.remove();return}let i=document.createElement("div");i.setAttribute("data-yuktai-audit-details","true"),i.setAttribute("role","dialog"),i.setAttribute("aria-label","Accessibility audit details"),i.style.cssText=`
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
  `;let n={critical:"#d93025",serious:"#f29900",moderate:"#1a73e8",minor:"#0f9d58"};i.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <strong style="font-size:14px;color:#74c0fc">Audit report</strong>
      <span style="color:#aaa">${e.fixed} fixed \xB7 ${e.renderTime}ms</span>
    </div>
    ${e.details.slice(0,20).map(a=>`
      <div style="padding:6px 0;border-bottom:1px solid #2a2a4a">
        <div style="display:flex;gap:6px;align-items:center">
          <span style="background:${n[a.severity]};color:#fff;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:700;text-transform:uppercase">${a.severity}</span>
          <code style="color:#74c0fc">&lt;${a.tag}&gt;</code>
        </div>
        <div style="color:#ccc;margin-top:3px">${a.fix}</div>
      </div>
    `).join("")}
    ${e.details.length>20?`<div style="color:#888;padding:8px 0;text-align:center">+${e.details.length-20} more issues</div>`:""}
  `,i.addEventListener("keydown",a=>{a.key==="Escape"&&i.remove()}),document.body.appendChild(i),E(i)}function ae(e){typeof document>"u"||(R&&clearTimeout(R),R=setTimeout(()=>{if(v)return;let t=document.createElement("div");t.setAttribute("role","alertdialog"),t.setAttribute("aria-label","Session timeout warning"),t.setAttribute("aria-modal","true"),t.setAttribute("data-yuktai-timeout","true"),t.style.cssText=`
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
    `;let i=t.querySelector("[data-yuktai-extend]"),n=t.querySelector("[data-yuktai-dismiss]");i?.addEventListener("click",()=>{t.remove(),v=null,l("Session extended. You have more time.","success"),g?.timeoutWarning&&ae(g.timeoutWarning)}),n?.addEventListener("click",()=>{t.remove(),v=null}),document.body.appendChild(t),v=t,E(t),l("Warning: Your session will expire soon. Do you need more time?","warning")},e*1e3))}function Ce(e){if(typeof document>"u")return;let t=document.documentElement;if(t.toggleAttribute("data-yuktai-high-contrast",!!e.highContrast),t.toggleAttribute("data-yuktai-dark",!!e.darkMode),t.toggleAttribute("data-yuktai-reduce-motion",!!e.reduceMotion),t.toggleAttribute("data-yuktai-large-targets",!!e.largeTargets),t.toggleAttribute("data-yuktai-keyboard",!!e.keyboardHints),t.toggleAttribute("data-yuktai-dyslexia",!!e.dyslexiaFont),e.localFont?document.body.style.fontFamily=`"${e.localFont}", system-ui, sans-serif`:e.dyslexiaFont||(document.body.style.fontFamily=""),e.fontSizeMultiplier&&e.fontSizeMultiplier!==1?document.documentElement.style.fontSize=`${e.fontSizeMultiplier*100}%`:document.documentElement.style.fontSize="",e.colorBlindMode&&e.colorBlindMode!=="none"){let i=e.colorBlindMode==="achromatopsia"?"grayscale(100%)":`url(#${k[e.colorBlindMode]})`;document.body.style.filter=i}else document.body.style.filter=""}function Me(e){try{let t=localStorage.getItem("yuktai-a11y-prefs");t&&Object.assign(e,JSON.parse(t))}catch{}}async function X(e){if(e){if(!await S()){l("Plain English requires Chrome 127+","warning");return}l("Rewriting page in plain English...","info",!1);let i=await q();l(i.error?`Plain English failed: ${i.error}`:`${i.fixed} sections rewritten in plain English`,i.error?"error":"success",!1)}else B(),l("Original text restored","info",!1)}async function Q(e){if(e){if(!await L()){l("Page summariser requires Chrome 127+","warning");return}l("Generating page summary...","info",!1);let i=await N();l(i.error?`Summary failed: ${i.error}`:"Page summary added at top",i.error?"error":"success",!1)}else h(),l("Page summary removed","info",!1)}async function Z(e){if(e==="en"){C(),l("Page restored to English","info",!1);return}l(`Translating page to ${e}...`,"info",!1);let t=await I(e);l(t.error?`Translation failed: ${t.error}`:`Page translated to ${e}`,t.error?"error":"success",!1)}async function ee(e){if(e){if(!M()){l("Voice control not supported in this browser","warning");return}_(t=>{t.success&&l(`Voice: ${t.action}`,"info",!1)}),l("Voice control started. Say a command.","success",!1)}else P(),l("Voice control stopped","info",!1)}async function te(e){if(e){if(!await $()){l("Smart labels requires Chrome 127+","warning");return}l("Generating smart labels...","info",!1);let i=await j();l(i.error?`Smart labels failed: ${i.error}`:`${i.fixed} elements labelled`,i.error?"error":"success",!1)}else K(),l("Smart labels removed","info",!1)}function Pe(){if(typeof document>"u"||A)return;let e=document.createElement("div");e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e.setAttribute("aria-relevant","text"),e.style.cssText="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);",document.body.appendChild(e),A=e}function $e(){if(typeof document>"u"||U)return;let e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("aria-hidden","true"),e.style.cssText="position:absolute;width:0;height:0;overflow:hidden;",e.innerHTML=`
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
  `,document.body.appendChild(e),U=e}function ie(e){let t={critical:20,serious:10,moderate:5,minor:2},i=e.details.reduce((n,a)=>n+(t[a.severity]||0),0);return Math.max(0,Math.min(100,100-i))}var He={name:"yuktai-a11y",version:"4.0.0",observer:null,async execute(e){if(!e.enabled)return this.stopObserver(),"yuktai: disabled.";g=e,Me(e),Pe(),$e(),Ae(),Ee(),e.showSkipLinks!==!1&&ke(),e.showPreferencePanel,Ce(e);let t=this.applyFixes(e);t.score=ie(t),e.showAuditBadge&&Se(t),e.timeoutWarning&&ae(e.timeoutWarning),e.autoFix&&this.startObserver(e),e.plainEnglish&&await X(!0),e.summarisePage&&await Q(!0),e.translateLanguage&&e.translateLanguage!=="en"&&await Z(e.translateLanguage),e.voiceControl&&await ee(!0),e.smartLabels&&await te(!0);let i=`${t.fixed} fixes applied. Score: ${t.score}/100.`;return l(i,t.score>=90?"success":"info",!1),`yuktai v4.0.0: ${i} Scanned ${t.scanned} elements in ${t.renderTime}ms.`},applyFixes(e){let t={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return t;let i=performance.now(),n=document.querySelectorAll("*");t.scanned=n.length;let a=(o,r,s,d)=>{t.details.push({tag:o,fix:r,severity:s,element:d.outerHTML.slice(0,100)}),t.fixed++};return n.forEach(o=>{let r=o,s=r.tagName.toLowerCase();if(s==="html"&&!r.getAttribute("lang")&&(r.setAttribute("lang","en"),a(s,'lang="en" added',"critical",r)),s==="meta"){let c=r.getAttribute("name"),p=r.getAttribute("content")||"";c==="viewport"&&p.includes("user-scalable=no")&&(r.setAttribute("content",p.replace("user-scalable=no","user-scalable=yes")),a(s,"user-scalable=yes restored","serious",r)),c==="viewport"&&/maximum-scale=1(?:[^0-9]|$)/.test(p)&&(r.setAttribute("content",p.replace(/maximum-scale=1(?=[^0-9]|$)/,"maximum-scale=5")),a(s,"maximum-scale=5 restored","serious",r))}if(s==="main"&&!r.getAttribute("tabindex")&&(r.setAttribute("tabindex","-1"),r.getAttribute("id")||r.setAttribute("id","main-content")),s==="img"&&(r.hasAttribute("alt")||(r.setAttribute("alt",""),r.setAttribute("aria-hidden","true"),a(s,'alt="" aria-hidden="true"',"serious",r))),s==="svg"&&(!r.getAttribute("aria-hidden")&&!r.getAttribute("aria-label")&&!o.querySelector("title")&&(r.setAttribute("aria-hidden","true"),a(s,'aria-hidden="true" (decorative svg)',"minor",r)),r.getAttribute("focusable")||r.setAttribute("focusable","false")),s==="iframe"&&!r.getAttribute("title")&&!r.getAttribute("aria-label")&&(r.setAttribute("title","embedded content"),r.setAttribute("aria-label","embedded content"),a(s,"title + aria-label added","serious",r)),s==="button"){if(!r.innerText?.trim()&&!r.getAttribute("aria-label")){let c=r.getAttribute("title")||"button";r.setAttribute("aria-label",c),a(s,`aria-label="${c}" (empty button)`,"critical",r)}r.hasAttribute("disabled")&&!r.getAttribute("aria-disabled")&&(r.setAttribute("aria-disabled","true"),t.fixed++)}if(s==="a"){let c=r;!r.innerText?.trim()&&!r.getAttribute("aria-label")&&(r.setAttribute("aria-label",r.getAttribute("title")||"link"),a(s,"aria-label added (empty link)","critical",r)),c.target==="_blank"&&!c.rel?.includes("noopener")&&(c.rel="noopener noreferrer",t.fixed++)}if(J.has(s)){let c=r;if(!r.getAttribute("aria-label")&&!r.getAttribute("aria-labelledby")){let p=r.getAttribute("placeholder")||r.getAttribute("name")||s;r.setAttribute("aria-label",p),a(s,`aria-label="${p}"`,"serious",r)}if(r.hasAttribute("required")&&!r.getAttribute("aria-required")&&(r.setAttribute("aria-required","true"),t.fixed++),s==="input"&&!c.autocomplete){let p=c.name||"";c.type==="email"||p.includes("email")?c.autocomplete="email":c.type==="tel"||p.includes("tel")?c.autocomplete="tel":c.type==="password"&&(c.autocomplete="current-password"),t.fixed++}}s==="th"&&!r.getAttribute("scope")&&(r.setAttribute("scope",r.closest("thead")?"col":"row"),a(s,"scope added to <th>","moderate",r)),z[s]&&!r.getAttribute("role")&&(r.setAttribute("role",z[s]),a(s,`role="${z[s]}"`,"minor",r));let d=r.getAttribute("role")||"";d==="tab"&&!r.getAttribute("aria-selected")&&(r.setAttribute("aria-selected","false"),t.fixed++),["alert","status","log"].includes(d)&&!r.getAttribute("aria-live")&&(r.setAttribute("aria-live",d==="alert"?"assertive":"polite"),a(s,`aria-live added on role=${d}`,"moderate",r)),d==="combobox"&&!r.getAttribute("aria-expanded")&&(r.setAttribute("aria-expanded","false"),a(s,'aria-expanded="false" on combobox',"serious",r)),(d==="checkbox"||d==="radio")&&!r.getAttribute("aria-checked")&&(r.setAttribute("aria-checked","false"),a(s,`aria-checked="false" on role=${d}`,"serious",r))}),t.renderTime=parseFloat((performance.now()-i).toFixed(2)),t},scan(){let e={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return e;let t=performance.now(),i=document.querySelectorAll("*");e.scanned=i.length;let n=(a,o,r,s)=>e.details.push({tag:a,fix:o,severity:r,element:s.outerHTML.slice(0,100)});return i.forEach(a=>{let o=a,r=o.tagName.toLowerCase();(r==="a"||r==="button")&&!o.innerText?.trim()&&!o.getAttribute("aria-label")&&n(r,"needs aria-label (empty)","critical",o),r==="img"&&!o.hasAttribute("alt")&&n(r,"needs alt text","serious",o),J.has(r)&&!o.getAttribute("aria-label")&&!o.getAttribute("aria-labelledby")&&n(r,"needs aria-label","serious",o),r==="iframe"&&!o.getAttribute("title")&&!o.getAttribute("aria-label")&&n(r,"iframe needs title","serious",o)}),e.fixed=e.details.length,e.score=ie(e),e.renderTime=parseFloat((performance.now()-t).toFixed(2)),e},startObserver(e){this.observer||typeof document>"u"||(this.observer=new MutationObserver(()=>this.applyFixes(e)),this.observer.observe(document.body,{childList:!0,subtree:!0,attributes:!1}))},stopObserver(){this.observer?.disconnect(),this.observer=null},announce:l,speak:O,showVisualAlert:re,trapFocus:E,handlePlainEnglish:X,handleSummarisePage:Q,handleTranslate:Z,handleVoiceControl:ee,handleSmartLabels:te,SUPPORTED_LANGUAGES:F};return ue(Re);})();
