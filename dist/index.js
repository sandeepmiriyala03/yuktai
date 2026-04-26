"use strict";var Ie=Object.create;var W=Object.defineProperty;var He=Object.getOwnPropertyDescriptor;var We=Object.getOwnPropertyNames;var Fe=Object.getPrototypeOf,Oe=Object.prototype.hasOwnProperty;var Be=(e,t)=>{for(var o in t)W(e,o,{get:t[o],enumerable:!0})},ce=(e,t,o,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of We(t))!Oe.call(e,n)&&n!==o&&W(e,n,{get:()=>t[n],enumerable:!(a=He(t,n))||a.enumerable});return e};var Ne=(e,t,o)=>(o=e!=null?Ie(Fe(e)):{},ce(t||!e||!e.__esModule?W(o,"default",{value:e,enumerable:!0}):o,e)),_e=e=>ce(W({},"__esModule",{value:!0}),e);var mt={};Be(mt,{Runtime:()=>S,YuktAI:()=>ft,YuktAIWrapper:()=>j,aiPlugin:()=>z,default:()=>j,voicePlugin:()=>$,wcag:()=>h,wcagPlugin:()=>h});module.exports=_e(mt);async function Z(){try{return window.ai?.rewriter?(await window.ai.rewriter.capabilities()).available!=="no":!1}catch{return!1}}async function De(e){if(!e||e.trim().length<20)return{success:!1,original:e,rewritten:e,error:"Text too short"};try{let t=await window.ai.rewriter.create({tone:"more-casual",format:"plain-text",length:"as-is"}),o=await t.rewrite(e,{context:"Rewrite this text in simple plain English. Use short sentences. Avoid jargon. Make it easy to understand for everyone."});return t.destroy(),{success:!0,original:e,rewritten:o.trim()}}catch(t){return{success:!1,original:e,rewritten:e,error:t instanceof Error?t.message:"Rewrite failed"}}}async function ue(){if(!await Z())return{fixed:0,error:"Chrome Built-in AI not available on this device. Chrome 127+ required."};let t=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption"),o=0;for(let a of t){let n=a.innerText?.trim();if(!n||n.length<20||a.closest("[data-yuktai-panel]"))continue;let s=await De(n);s.success&&s.rewritten!==n&&(a.dataset.yuktaiOriginal=n,a.innerText=s.rewritten,o++)}return{fixed:o}}function pe(){let e=document.querySelectorAll("[data-yuktai-original]");for(let t of e){let o=t.dataset.yuktaiOriginal;o&&(t.innerText=o,delete t.dataset.yuktaiOriginal)}}var fe="yuktai-summary-box";async function Q(){try{return window.ai?.summarizer?(await window.ai.summarizer.capabilities()).available!=="no":!1}catch{return!1}}function qe(){let e=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, article, section"),t=[];for(let o of e){if(o.closest("[data-yuktai-panel]"))continue;let a=window.getComputedStyle(o);if(a.display==="none"||a.visibility==="hidden")continue;let n=o.innerText?.trim();n&&n.length>10&&t.push(n)}return t.join(" ").slice(0,5e3)}async function me(){if(!await Q())return{success:!1,summary:"",error:"Chrome Built-in AI not available. Chrome 127+ required."};let t=qe();if(!t||t.length<100)return{success:!1,summary:"",error:"Not enough text on this page to summarise."};try{let o=await window.ai.summarizer.create({type:"tl;dr",format:"plain-text",length:"short"}),a=await o.summarize(t,{context:"Summarise this page in 2-3 simple sentences for a screen reader user who wants to know if this page is relevant to them."});return o.destroy(),Ve(a.trim()),{success:!0,summary:a.trim()}}catch(o){return{success:!1,summary:"",error:o instanceof Error?o.message:"Summary failed"}}}function Ve(e){F();let t=document.createElement("div");t.id=fe,t.setAttribute("data-yuktai-panel","true"),t.setAttribute("role","region"),t.setAttribute("aria-label","Page summary by yuktai"),t.style.cssText=`
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
  `;let o=document.createElement("p");o.style.cssText="margin: 0; flex: 1;",o.textContent=`\u{1F4CB} Page summary: ${e}`;let a=document.createElement("button");a.textContent="\xD7",a.setAttribute("aria-label","Close page summary"),a.style.cssText=`
    background: none;
    border: none;
    color: #ffffff;
    font-size: 20px;
    cursor: pointer;
    padding: 0 4px;
    line-height: 1;
    flex-shrink: 0;
  `,a.addEventListener("click",F),t.appendChild(o),t.appendChild(a),document.body.prepend(t)}function F(){let e=document.getElementById(fe);e&&e.remove()}var B=[{code:"en",label:"English"},{code:"hi",label:"Hindi"},{code:"es",label:"Spanish"},{code:"fr",label:"French"},{code:"de",label:"German"},{code:"it",label:"Italian"},{code:"pt",label:"Portuguese"},{code:"nl",label:"Dutch"},{code:"pl",label:"Polish"},{code:"ru",label:"Russian"},{code:"ja",label:"Japanese"},{code:"ko",label:"Korean"},{code:"zh",label:"Chinese"},{code:"ar",label:"Arabic"},{code:"tr",label:"Turkish"},{code:"vi",label:"Vietnamese"},{code:"bn",label:"Bengali"},{code:"id",label:"Indonesian"}],O="en";async function Ge(e){try{return window.translation?await window.translation.canTranslate({sourceLanguage:"en",targetLanguage:e})!=="no":!1}catch{return!1}}async function be(e){if(e===O)return{success:!0,language:e,fixed:0};if(e==="en")return ee(),O="en",{success:!0,language:"en",fixed:0};if(!await Ge(e))return{success:!1,language:e,fixed:0,error:`Translation to ${e} not available. Chrome 127+ required.`};try{let o=await window.translation.createTranslator({sourceLanguage:"en",targetLanguage:e}),a=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption, span, a"),n=0;for(let s of a){if(s.closest("[data-yuktai-panel]")||s.children.length>0)continue;let i=s.innerText?.trim();if(!i||i.length<2)continue;s.dataset.yuktaiTranslationOriginal||(s.dataset.yuktaiTranslationOriginal=i);let d=await o.translate(i);d&&d!==i&&(s.innerText=d,n++)}return o.destroy(),O=e,{success:!0,language:e,fixed:n}}catch(o){return{success:!1,language:e,fixed:0,error:o instanceof Error?o.message:"Translation failed"}}}function ee(){let e=document.querySelectorAll("[data-yuktai-translation-original]");for(let t of e){let o=t.dataset.yuktaiTranslationOriginal;o&&(t.innerText=o,delete t.dataset.yuktaiTranslationOriginal)}O="en"}var je=[{phrases:["go to main","skip to main","main content"],action:"focus-main",label:"Jump to main content"},{phrases:["go to navigation","go to nav","open menu"],action:"focus-nav",label:"Jump to navigation"},{phrases:["go to search","search","find"],action:"focus-search",label:"Jump to search"},{phrases:["scroll down","page down","next"],action:"scroll-down",label:"Scroll down"},{phrases:["scroll up","page up","back up"],action:"scroll-up",label:"Scroll up"},{phrases:["go back","previous page"],action:"go-back",label:"Go back"},{phrases:["click","press","select"],action:"click-focused",label:"Click focused element"},{phrases:["next item","tab forward","tab"],action:"tab-forward",label:"Move to next element"},{phrases:["previous item","tab back","shift tab"],action:"tab-back",label:"Move to previous element"},{phrases:["stop listening","stop voice","quiet"],action:"stop-voice",label:"Stop voice control"}],w=null,N=!1,C=null;function te(){return!!(window.SpeechRecognition||window.webkitSpeechRecognition)}function Ke(e){let t=e.toLowerCase().trim();for(let o of je)for(let a of o.phrases)if(t.includes(a))return{action:o.action,label:o.label};return null}function Ye(e){switch(e){case"focus-main":{let t=document.querySelector("main, [role='main'], #main");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-nav":{let t=document.querySelector("nav, [role='navigation']");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-search":{let t=document.querySelector("input[type='search'], input[role='searchbox'], [aria-label*='search' i]");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"scroll-down":{window.scrollBy({top:400,behavior:"smooth"});break}case"scroll-up":{window.scrollBy({top:-400,behavior:"smooth"});break}case"go-back":{window.history.back();break}case"click-focused":{let t=document.activeElement;t&&t!==document.body&&t.click();break}case"tab-forward":{let t=ge(),o=t.indexOf(document.activeElement),a=t[o+1]||t[0];a&&a.focus();break}case"tab-back":{let t=ge(),o=t.indexOf(document.activeElement),a=t[o-1]||t[t.length-1];a&&a.focus();break}case"stop-voice":{oe();break}}}function ge(){return Array.from(document.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(e=>!e.closest("[data-yuktai-panel]"))}function xe(e){if(!te())return!1;if(N)return!0;e&&(C=e);let t=window.SpeechRecognition||window.webkitSpeechRecognition;return w=new t,w.continuous=!0,w.interimResults=!1,w.lang="en-US",w.onresult=o=>{let a=o.results[o.results.length-1][0].transcript,n=Ke(a);if(n){Ye(n.action);let s={success:!0,command:a,action:n.label};if(C&&C(s),n.action==="stop-voice")return}},w.onend=()=>{N&&w?.start()},w.onerror=o=>{o.error!=="no-speech"&&C&&C({success:!1,command:"",action:"",error:`Voice error: ${o.error}`})},w.start(),N=!0,Ue(),!0}function oe(){N=!1,w&&(w.stop(),w=null),C=null,he()}var ye="yuktai-voice-indicator";function Ue(){he();let e=document.createElement("div");e.id=ye,e.setAttribute("data-yuktai-panel","true"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-label","yuktai voice control is listening"),e.style.cssText=`
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
  `,!document.getElementById("yuktai-pulse-style")){let a=document.createElement("style");a.id="yuktai-pulse-style",a.textContent=`
      @keyframes yuktai-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50%       { opacity: 0.4; transform: scale(0.7); }
      }
    `,document.head.appendChild(a)}let o=document.createElement("span");o.textContent="Listening for commands...",e.appendChild(t),e.appendChild(o),document.body.appendChild(e)}function he(){let e=document.getElementById(ye);e&&e.remove()}var Je=["button:not([aria-label]):not([aria-labelledby])","a:not([aria-label]):not([aria-labelledby])","input:not([aria-label]):not([aria-labelledby]):not([id])","select:not([aria-label]):not([aria-labelledby])","textarea:not([aria-label]):not([aria-labelledby])","[role='button']:not([aria-label])","[role='link']:not([aria-label])","[role='checkbox']:not([aria-label])","[role='tab']:not([aria-label])"].join(", ");async function ie(){try{return window.ai?.writer?(await window.ai.writer.capabilities()).available!=="no":!1}catch{return!1}}function Xe(e){let t=[],o=e.innerText?.trim();o&&t.push(`element text: "${o}"`);let a=e.placeholder?.trim();a&&t.push(`placeholder: "${a}"`);let n=e.getAttribute("name")?.trim();n&&t.push(`name: "${n}"`);let s=e.getAttribute("type")?.trim();s&&t.push(`type: "${s}"`);let i=e.id;if(i){let p=document.querySelector(`label[for="${i}"]`);p&&t.push(`label: "${p.innerText?.trim()}"`)}let d=e.parentElement?.innerText?.trim().slice(0,60);d&&t.push(`parent context: "${d}"`),t.push(`tag: ${e.tagName.toLowerCase()}`);let f=e.getAttribute("role");return f&&t.push(`role: ${f}`),t.join(". ")}async function Ze(e,t){let o=`
    Generate a short, clear aria-label for an HTML element.
    The label must be 2-6 words maximum.
    The label must describe what the element does or what it is.
    Do not include punctuation.
    Do not explain \u2014 just output the label text only.

    Element details:
    ${t}

    Output only the label. Nothing else.
  `.trim();return(await e.write(o)).trim().replace(/^["']|["']$/g,"").replace(/\.$/,"").trim()}async function we(){if(!await ie())return{success:!1,fixed:0,elements:[],error:"Chrome Built-in AI not available. Chrome 127+ required."};let t=document.querySelectorAll(Je);if(t.length===0)return{success:!0,fixed:0,elements:[]};try{let o=await window.ai.writer.create({tone:"neutral",format:"plain-text",length:"short"}),a=0,n=[];for(let s of t){if(s.closest("[data-yuktai-panel]"))continue;let i=window.getComputedStyle(s);if(i.display==="none"||i.visibility==="hidden")continue;let d=Xe(s),f=await Ze(o,d);f&&f.length>0&&(s.dataset.yuktaiLabelOriginal=s.getAttribute("aria-label")||"",s.setAttribute("aria-label",f),a++,n.push({tag:s.tagName.toLowerCase(),label:f}))}return o.destroy(),{success:!0,fixed:a,elements:n}}catch(o){return{success:!1,fixed:0,elements:[],error:o instanceof Error?o.message:"Label generation failed"}}}function ve(){let e=document.querySelectorAll("[data-yuktai-label-original]");for(let t of e){let o=t.dataset.yuktaiLabelOriginal;o?t.setAttribute("aria-label",o):t.removeAttribute("aria-label"),delete t.dataset.yuktaiLabelOriginal}}var q=null,ke=null;var Ae=null,ne=null,m=null,L=null,_=null,ae=null,M=null,D={deuteranopia:"yuktai-cb-d",protanopia:"yuktai-cb-p",tritanopia:"yuktai-cb-t"};var Se=new Set(["input","select","textarea"]);var re={nav:"navigation",header:"banner",footer:"contentinfo",main:"main",aside:"complementary"};function se(e,t="polite"){if(typeof window>"u"||!M?.speechEnabled||!window.speechSynthesis)return;window.speechSynthesis.cancel();let o=new SpeechSynthesisUtterance(e);o.rate=1,o.pitch=1,o.volume=1;let a=window.speechSynthesis.getVoices();a.length>0&&(o.voice=a[0]),window.speechSynthesis.speak(o)}function Pe(e,t="info"){if(typeof document>"u")return;let a={success:{bg:"#0f9d58",border:"#0a7a44",icon:"\u2713"},error:{bg:"#d93025",border:"#b52a1c",icon:"\u2715"},warning:{bg:"#f29900",border:"#c67c00",icon:"\u26A0"},info:{bg:"#1a73e8",border:"#1557b0",icon:"\u2139"}}[t];m||(m=document.createElement("div"),m.setAttribute("role","alert"),m.setAttribute("aria-live","assertive"),m.setAttribute("aria-atomic","true"),m.style.cssText=`
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
    `,document.body.appendChild(m)),m.style.background=a.bg,m.style.border=`1px solid ${a.border}`,m.style.color="#fff",m.innerHTML=`
    <span style="font-size:18px;font-weight:700">${a.icon}</span>
    <span style="flex:1;line-height:1.4">${e}</span>
    <button
      onclick="this.parentElement.style.transform='translateX(120%)';this.parentElement.style.opacity='0'"
      style="background:none;border:none;color:#fff;cursor:pointer;font-size:18px;padding:0;line-height:1"
      aria-label="Close notification">\xD7</button>
  `,window.innerWidth<=480&&(m.style.right="8px",m.style.left="8px",m.style.maxWidth="none",m.style.width="auto"),requestAnimationFrame(()=>{m&&(m.style.transform="translateX(0)",m.style.opacity="1")}),setTimeout(()=>{m&&(m.style.transform="translateX(120%)",m.style.opacity="0")},5e3)}function u(e,t="info",o=!0){q&&(q.textContent=e),Pe(e,t),o&&se(e,t==="error"?"assertive":"polite")}function Qe(){if(typeof document>"u"||Ae)return;let e=[{label:"Skip to main content",selector:"main,[role='main'],#main,#main-content"},{label:"Skip to navigation",selector:"nav,[role='navigation'],#nav,#navigation"},{label:"Skip to search",selector:"[role='search'],#search,input[type='search']"}],t=document.createElement("div");t.setAttribute("data-yuktai-skip-bar","true"),t.setAttribute("role","navigation"),t.setAttribute("aria-label","Skip links"),t.style.cssText=`
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
  `;let o=!1;if(e.forEach(({label:n,selector:s})=>{let i=document.querySelector(s);if(!i)return;o=!0,i.getAttribute("tabindex")||i.setAttribute("tabindex","-1");let d=document.createElement("a");d.href="#",d.textContent=n,d.style.cssText=`
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
    `,d.addEventListener("focus",()=>{t.style.transform="translateY(0)"}),d.addEventListener("blur",()=>{setTimeout(()=>{t.matches(":focus-within")||(t.style.transform="translateY(-100%)")},2e3)}),d.addEventListener("click",f=>{f.preventDefault(),i.focus(),i.scrollIntoView({behavior:"smooth",block:"start"}),u(`Jumped to ${n.replace("Skip to ","")}`,"info"),t.style.transform="translateY(-100%)"}),t.appendChild(d)}),!o)return;window.innerWidth<768&&(t.style.transform="translateY(0)",t.style.position="sticky"),window.addEventListener("resize",()=>{window.innerWidth<768&&(t.style.transform="translateY(0)")}),document.body.insertBefore(t,document.body.firstChild),Ae=t}function et(){if(typeof document>"u"||document.querySelector("[data-yuktai-focus-style]"))return;let e=document.createElement("style");e.setAttribute("data-yuktai-focus-style","true"),e.textContent=`

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
  `,document.head.appendChild(e),document.documentElement.setAttribute("data-yuktai-a11y","true")}function tt(){typeof document>"u"||document.querySelector("[data-yuktai-kb-init]")||(document.documentElement.setAttribute("data-yuktai-kb-init","true"),document.addEventListener("keydown",e=>{let t=document.activeElement;if(!t)return;let o=t.getAttribute("role")||"";if(e.key==="Escape"){let a=t.closest("[role='dialog'],[role='alertdialog']");if(a){a.style.display="none",u("Dialog closed","info");return}let n=t.closest("[role='menu'],[role='menubar']");n&&(n.style.display="none",u("Menu closed","info"))}if(o==="menuitem"||t.closest("[role='menu'],[role='menubar']")){let a=t.closest("[role='menu'],[role='menubar']");if(!a)return;let n=Array.from(a.querySelectorAll("[role='menuitem']:not([disabled])")),s=n.indexOf(t);e.key==="ArrowDown"||e.key==="ArrowRight"?(e.preventDefault(),n[(s+1)%n.length]?.focus()):e.key==="ArrowUp"||e.key==="ArrowLeft"?(e.preventDefault(),n[(s-1+n.length)%n.length]?.focus()):e.key==="Home"?(e.preventDefault(),n[0]?.focus()):e.key==="End"&&(e.preventDefault(),n[n.length-1]?.focus())}if(o==="tab"||t.closest("[role='tablist']")){let a=t.closest("[role='tablist']");if(!a)return;let n=Array.from(a.querySelectorAll("[role='tab']:not([disabled])")),s=n.indexOf(t);if(e.key==="ArrowRight"||e.key==="ArrowDown"){e.preventDefault();let i=n[(s+1)%n.length];i?.focus(),i?.click()}else if(e.key==="ArrowLeft"||e.key==="ArrowUp"){e.preventDefault();let i=n[(s-1+n.length)%n.length];i?.focus(),i?.click()}}if(o==="option"||t.closest("[role='listbox']")){let a=t.closest("[role='listbox']");if(!a)return;let n=Array.from(a.querySelectorAll("[role='option']:not([aria-disabled='true'])")),s=n.indexOf(t);e.key==="ArrowDown"?(e.preventDefault(),n[(s+1)%n.length]?.focus()):e.key==="ArrowUp"?(e.preventDefault(),n[(s-1+n.length)%n.length]?.focus()):(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),t.setAttribute("aria-selected","true"),n.forEach(i=>{i!==t&&i.setAttribute("aria-selected","false")}),u(`Selected: ${t.textContent?.trim()}`,"success"))}e.altKey&&e.key==="a"&&(e.preventDefault(),ot()),e.key==="Tab"&&M?.speechEnabled&&setTimeout(()=>{let a=document.activeElement;if(!a)return;let n=a.getAttribute("aria-label")||a.getAttribute("title")||a.textContent?.trim()||a.tagName.toLowerCase(),s=a.getAttribute("role")||a.tagName.toLowerCase();se(`${n}, ${s}`)},100)}))}function V(e){let t=e.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[role="button"]');if(t.length===0)return;let o=t[0],a=t[t.length-1];o.focus(),e.addEventListener("keydown",n=>{n.key==="Tab"&&(n.shiftKey?document.activeElement===o&&(n.preventDefault(),a.focus()):document.activeElement===a&&(n.preventDefault(),o.focus()))})}function ot(){if(typeof document>"u")return;if(L){L.remove(),L=null;return}let e=document.createElement("div");e.setAttribute("role","dialog"),e.setAttribute("aria-label","Keyboard shortcuts"),e.setAttribute("aria-modal","true"),e.setAttribute("data-yuktai-cheatsheet","true"),e.style.cssText=`
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
    ${t.map(([a,n])=>`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #2a2a4a">
        <kbd style="background:#2a2a4a;color:#74c0fc;padding:3px 8px;border-radius:4px;font-size:12px;font-family:monospace;border:1px solid #3a3a6a">${a}</kbd>
        <span style="font-size:12px;color:#ccc;text-align:right;flex:1;margin-left:12px">${n}</span>
      </div>
    `).join("")}
  `,e.querySelector("[data-yuktai-close]")?.addEventListener("click",()=>{e.remove(),L=null}),e.addEventListener("keydown",a=>{a.key==="Escape"&&(e.remove(),L=null)}),document.body.appendChild(e),L=e,V(e),u("Keyboard shortcuts opened. Press Escape to close.","info")}function it(e){if(typeof document>"u"||!M?.showAuditBadge||typeof window<"u"&&!window.location.hostname.includes("localhost")&&!window.location.hostname.includes("127.0.0.1"))return;ne&&ne.remove();let t=e.score,o=t>=90?"#0f9d58":t>=70?"#f29900":"#d93025",a=t>=90?"\u267F":t>=70?"\u26A0":"\u2715",n=document.createElement("button");n.setAttribute("aria-label",`Accessibility score: ${t} out of 100`),n.setAttribute("data-yuktai-badge","true"),n.style.cssText=`
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
  `,n.innerHTML=`${a} ${t}/100 <span style="font-weight:400;opacity:0.85">${e.details.length} issues</span>`,n.addEventListener("click",()=>nt(e)),document.body.appendChild(n),ne=n}function nt(e){let t=document.querySelector("[data-yuktai-audit-details]");if(t){t.remove();return}let o=document.createElement("div");o.setAttribute("data-yuktai-audit-details","true"),o.setAttribute("role","dialog"),o.setAttribute("aria-label","Accessibility audit details"),o.style.cssText=`
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
  `;let a={critical:"#d93025",serious:"#f29900",moderate:"#1a73e8",minor:"#0f9d58"};o.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <strong style="font-size:14px;color:#74c0fc">Audit report</strong>
      <span style="color:#aaa">${e.fixed} fixed \xB7 ${e.renderTime}ms</span>
    </div>
    ${e.details.slice(0,20).map(n=>`
      <div style="padding:6px 0;border-bottom:1px solid #2a2a4a">
        <div style="display:flex;gap:6px;align-items:center">
          <span style="background:${a[n.severity]};color:#fff;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:700;text-transform:uppercase">${n.severity}</span>
          <code style="color:#74c0fc">&lt;${n.tag}&gt;</code>
        </div>
        <div style="color:#ccc;margin-top:3px">${n.fix}</div>
      </div>
    `).join("")}
    ${e.details.length>20?`<div style="color:#888;padding:8px 0;text-align:center">+${e.details.length-20} more issues</div>`:""}
  `,o.addEventListener("keydown",n=>{n.key==="Escape"&&o.remove()}),document.body.appendChild(o),V(o)}function ze(e){typeof document>"u"||(ae&&clearTimeout(ae),ae=setTimeout(()=>{if(_)return;let t=document.createElement("div");t.setAttribute("role","alertdialog"),t.setAttribute("aria-label","Session timeout warning"),t.setAttribute("aria-modal","true"),t.setAttribute("data-yuktai-timeout","true"),t.style.cssText=`
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
    `;let o=t.querySelector("[data-yuktai-extend]"),a=t.querySelector("[data-yuktai-dismiss]");o?.addEventListener("click",()=>{t.remove(),_=null,u("Session extended. You have more time.","success"),M?.timeoutWarning&&ze(M.timeoutWarning)}),a?.addEventListener("click",()=>{t.remove(),_=null}),document.body.appendChild(t),_=t,V(t),u("Warning: Your session will expire soon. Do you need more time?","warning")},e*1e3))}function at(e){if(typeof document>"u")return;let t=document.documentElement;if(t.toggleAttribute("data-yuktai-high-contrast",!!e.highContrast),t.toggleAttribute("data-yuktai-dark",!!e.darkMode),t.toggleAttribute("data-yuktai-reduce-motion",!!e.reduceMotion),t.toggleAttribute("data-yuktai-large-targets",!!e.largeTargets),t.toggleAttribute("data-yuktai-keyboard",!!e.keyboardHints),t.toggleAttribute("data-yuktai-dyslexia",!!e.dyslexiaFont),e.localFont?document.body.style.fontFamily=`"${e.localFont}", system-ui, sans-serif`:e.dyslexiaFont||(document.body.style.fontFamily=""),e.fontSizeMultiplier&&e.fontSizeMultiplier!==1?document.documentElement.style.fontSize=`${e.fontSizeMultiplier*100}%`:document.documentElement.style.fontSize="",e.colorBlindMode&&e.colorBlindMode!=="none"){let o=e.colorBlindMode==="achromatopsia"?"grayscale(100%)":`url(#${D[e.colorBlindMode]})`;document.body.style.filter=o}else document.body.style.filter=""}function rt(e){try{let t=localStorage.getItem("yuktai-a11y-prefs");t&&Object.assign(e,JSON.parse(t))}catch{}}async function Ee(e){if(e){if(!await Z()){u("Plain English requires Chrome 127+","warning");return}u("Rewriting page in plain English...","info",!1);let o=await ue();u(o.error?`Plain English failed: ${o.error}`:`${o.fixed} sections rewritten in plain English`,o.error?"error":"success",!1)}else pe(),u("Original text restored","info",!1)}async function Te(e){if(e){if(!await Q()){u("Page summariser requires Chrome 127+","warning");return}u("Generating page summary...","info",!1);let o=await me();u(o.error?`Summary failed: ${o.error}`:"Page summary added at top",o.error?"error":"success",!1)}else F(),u("Page summary removed","info",!1)}async function Ce(e){if(e==="en"){ee(),u("Page restored to English","info",!1);return}u(`Translating page to ${e}...`,"info",!1);let t=await be(e);u(t.error?`Translation failed: ${t.error}`:`Page translated to ${e}`,t.error?"error":"success",!1)}async function Le(e){if(e){if(!te()){u("Voice control not supported in this browser","warning");return}xe(t=>{t.success&&u(`Voice: ${t.action}`,"info",!1)}),u("Voice control started. Say a command.","success",!1)}else oe(),u("Voice control stopped","info",!1)}async function Me(e){if(e){if(!await ie()){u("Smart labels requires Chrome 127+","warning");return}u("Generating smart labels...","info",!1);let o=await we();u(o.error?`Smart labels failed: ${o.error}`:`${o.fixed} elements labelled`,o.error?"error":"success",!1)}else ve(),u("Smart labels removed","info",!1)}function st(){if(typeof document>"u"||q)return;let e=document.createElement("div");e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e.setAttribute("aria-relevant","text"),e.style.cssText="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);",document.body.appendChild(e),q=e}function lt(){if(typeof document>"u"||ke)return;let e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("aria-hidden","true"),e.style.cssText="position:absolute;width:0;height:0;overflow:hidden;",e.innerHTML=`
    <defs>
      <filter id="${D.deuteranopia}">
        <feColorMatrix type="matrix"
          values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${D.protanopia}">
        <feColorMatrix type="matrix"
          values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${D.tritanopia}">
        <feColorMatrix type="matrix"
          values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"/>
      </filter>
    </defs>
  `,document.body.appendChild(e),ke=e}function Re(e){let t={critical:20,serious:10,moderate:5,minor:2},o=e.details.reduce((a,n)=>a+(t[n.severity]||0),0);return Math.max(0,Math.min(100,100-o))}var h={name:"yuktai-a11y",version:"4.0.0",observer:null,async execute(e){if(!e.enabled)return this.stopObserver(),"yuktai: disabled.";M=e,rt(e),st(),lt(),et(),tt(),e.showSkipLinks!==!1&&Qe(),e.showPreferencePanel,at(e);let t=this.applyFixes(e);t.score=Re(t),e.showAuditBadge&&it(t),e.timeoutWarning&&ze(e.timeoutWarning),e.autoFix&&this.startObserver(e),e.plainEnglish&&await Ee(!0),e.summarisePage&&await Te(!0),e.translateLanguage&&e.translateLanguage!=="en"&&await Ce(e.translateLanguage),e.voiceControl&&await Le(!0),e.smartLabels&&await Me(!0);let o=`${t.fixed} fixes applied. Score: ${t.score}/100.`;return u(o,t.score>=90?"success":"info",!1),`yuktai v4.0.0: ${o} Scanned ${t.scanned} elements in ${t.renderTime}ms.`},applyFixes(e){let t={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return t;let o=performance.now(),a=document.querySelectorAll("*");t.scanned=a.length;let n=(s,i,d,f)=>{t.details.push({tag:s,fix:i,severity:d,element:f.outerHTML.slice(0,100)}),t.fixed++};return a.forEach(s=>{let i=s,d=i.tagName.toLowerCase();if(d==="html"&&!i.getAttribute("lang")&&(i.setAttribute("lang","en"),n(d,'lang="en" added',"critical",i)),d==="meta"){let p=i.getAttribute("name"),x=i.getAttribute("content")||"";p==="viewport"&&x.includes("user-scalable=no")&&(i.setAttribute("content",x.replace("user-scalable=no","user-scalable=yes")),n(d,"user-scalable=yes restored","serious",i)),p==="viewport"&&/maximum-scale=1(?:[^0-9]|$)/.test(x)&&(i.setAttribute("content",x.replace(/maximum-scale=1(?=[^0-9]|$)/,"maximum-scale=5")),n(d,"maximum-scale=5 restored","serious",i))}if(d==="main"&&!i.getAttribute("tabindex")&&(i.setAttribute("tabindex","-1"),i.getAttribute("id")||i.setAttribute("id","main-content")),d==="img"&&(i.hasAttribute("alt")||(i.setAttribute("alt",""),i.setAttribute("aria-hidden","true"),n(d,'alt="" aria-hidden="true"',"serious",i))),d==="svg"&&(!i.getAttribute("aria-hidden")&&!i.getAttribute("aria-label")&&!s.querySelector("title")&&(i.setAttribute("aria-hidden","true"),n(d,'aria-hidden="true" (decorative svg)',"minor",i)),i.getAttribute("focusable")||i.setAttribute("focusable","false")),d==="iframe"&&!i.getAttribute("title")&&!i.getAttribute("aria-label")&&(i.setAttribute("title","embedded content"),i.setAttribute("aria-label","embedded content"),n(d,"title + aria-label added","serious",i)),d==="button"){if(!i.innerText?.trim()&&!i.getAttribute("aria-label")){let p=i.getAttribute("title")||"button";i.setAttribute("aria-label",p),n(d,`aria-label="${p}" (empty button)`,"critical",i)}i.hasAttribute("disabled")&&!i.getAttribute("aria-disabled")&&(i.setAttribute("aria-disabled","true"),t.fixed++)}if(d==="a"){let p=i;!i.innerText?.trim()&&!i.getAttribute("aria-label")&&(i.setAttribute("aria-label",i.getAttribute("title")||"link"),n(d,"aria-label added (empty link)","critical",i)),p.target==="_blank"&&!p.rel?.includes("noopener")&&(p.rel="noopener noreferrer",t.fixed++)}if(Se.has(d)){let p=i;if(!i.getAttribute("aria-label")&&!i.getAttribute("aria-labelledby")){let x=i.getAttribute("placeholder")||i.getAttribute("name")||d;i.setAttribute("aria-label",x),n(d,`aria-label="${x}"`,"serious",i)}if(i.hasAttribute("required")&&!i.getAttribute("aria-required")&&(i.setAttribute("aria-required","true"),t.fixed++),d==="input"&&!p.autocomplete){let x=p.name||"";p.type==="email"||x.includes("email")?p.autocomplete="email":p.type==="tel"||x.includes("tel")?p.autocomplete="tel":p.type==="password"&&(p.autocomplete="current-password"),t.fixed++}}d==="th"&&!i.getAttribute("scope")&&(i.setAttribute("scope",i.closest("thead")?"col":"row"),n(d,"scope added to <th>","moderate",i)),re[d]&&!i.getAttribute("role")&&(i.setAttribute("role",re[d]),n(d,`role="${re[d]}"`,"minor",i));let f=i.getAttribute("role")||"";f==="tab"&&!i.getAttribute("aria-selected")&&(i.setAttribute("aria-selected","false"),t.fixed++),["alert","status","log"].includes(f)&&!i.getAttribute("aria-live")&&(i.setAttribute("aria-live",f==="alert"?"assertive":"polite"),n(d,`aria-live added on role=${f}`,"moderate",i)),f==="combobox"&&!i.getAttribute("aria-expanded")&&(i.setAttribute("aria-expanded","false"),n(d,'aria-expanded="false" on combobox',"serious",i)),(f==="checkbox"||f==="radio")&&!i.getAttribute("aria-checked")&&(i.setAttribute("aria-checked","false"),n(d,`aria-checked="false" on role=${f}`,"serious",i))}),t.renderTime=parseFloat((performance.now()-o).toFixed(2)),t},scan(){let e={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return e;let t=performance.now(),o=document.querySelectorAll("*");e.scanned=o.length;let a=(n,s,i,d)=>e.details.push({tag:n,fix:s,severity:i,element:d.outerHTML.slice(0,100)});return o.forEach(n=>{let s=n,i=s.tagName.toLowerCase();(i==="a"||i==="button")&&!s.innerText?.trim()&&!s.getAttribute("aria-label")&&a(i,"needs aria-label (empty)","critical",s),i==="img"&&!s.hasAttribute("alt")&&a(i,"needs alt text","serious",s),Se.has(i)&&!s.getAttribute("aria-label")&&!s.getAttribute("aria-labelledby")&&a(i,"needs aria-label","serious",s),i==="iframe"&&!s.getAttribute("title")&&!s.getAttribute("aria-label")&&a(i,"iframe needs title","serious",s)}),e.fixed=e.details.length,e.score=Re(e),e.renderTime=parseFloat((performance.now()-t).toFixed(2)),e},startObserver(e){this.observer||typeof document>"u"||(this.observer=new MutationObserver(()=>this.applyFixes(e)),this.observer.observe(document.body,{childList:!0,subtree:!0,attributes:!1}))},stopObserver(){this.observer?.disconnect(),this.observer=null},announce:u,speak:se,showVisualAlert:Pe,trapFocus:V,handlePlainEnglish:Ee,handleSummarisePage:Te,handleTranslate:Ce,handleVoiceControl:Le,handleSmartLabels:Me,SUPPORTED_LANGUAGES:B};var b=Ne(require("react"));var A=require("react");var r=require("react/jsx-runtime"),le={highContrast:!1,reduceMotion:!1,autoFix:!0,dyslexiaFont:!1,fontScale:100,localFont:"",darkMode:!1,largeTargets:!1,speechEnabled:!1,colorBlindMode:"none",showAuditBadge:!1,timeoutWarning:void 0,plainEnglish:!1,summarisePage:!1,translateLanguage:"en",voiceControl:!1,smartLabels:!1},R=[80,90,100,110,120,130],dt=[{value:"none",label:"None"},{value:"deuteranopia",label:"Deuteranopia"},{value:"protanopia",label:"Protanopia"},{value:"tritanopia",label:"Tritanopia"},{value:"achromatopsia",label:"Greyscale"}];function ct(){let[e,t]=(0,A.useState)(typeof window<"u"?window.innerWidth:1024);return(0,A.useEffect)(()=>{let o=()=>t(window.innerWidth);return window.addEventListener("resize",o),()=>window.removeEventListener("resize",o)},[]),{isMobile:e<=480,isTablet:e>480&&e<=768}}function ut({checked:e,onChange:t,label:o,disabled:a=!1}){return(0,r.jsxs)("label",{"aria-label":o,style:{position:"relative",display:"inline-flex",width:"40px",height:"24px",cursor:a?"not-allowed":"pointer",flexShrink:0,opacity:a?.4:1},children:[(0,r.jsx)("input",{type:"checkbox",checked:e,disabled:a,onChange:n=>t(n.target.checked),style:{opacity:0,width:0,height:0,position:"absolute"}}),(0,r.jsx)("span",{style:{position:"absolute",inset:0,borderRadius:"99px",background:e?"#0d9488":"#cbd5e1",transition:"background 0.2s"}}),(0,r.jsx)("span",{style:{position:"absolute",top:"3px",left:e?"19px":"3px",width:"18px",height:"18px",background:"#fff",borderRadius:"50%",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)",pointerEvents:"none"}})]})}function G({label:e,color:t="#64748b",badge:o}){return(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px",margin:"8px 18px 4px"},children:[(0,r.jsx)("p",{style:{margin:0,fontSize:"10px",fontWeight:600,color:t,letterSpacing:"0.06em",textTransform:"uppercase"},children:e}),o&&(0,r.jsx)("span",{style:{fontSize:"9px",fontWeight:500,padding:"1px 7px",borderRadius:"99px",background:"#f5f3ff",color:"#7c3aed",border:"0.5px solid #c4b5fd",whiteSpace:"nowrap"},children:o})]})}function k({icon:e,label:t,desc:o,checked:a,onChange:n,disabled:s=!1,disabledReason:i}){return(0,r.jsxs)("div",{title:s?i:void 0,style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 18px",gap:"12px"},children:[(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"10px",flex:1,minWidth:0},children:[(0,r.jsx)("span",{"aria-hidden":"true",style:{width:"30px",height:"30px",borderRadius:"8px",background:s?"#f1f5f9":"#f0fdfa",color:s?"#94a3b8":"#0d9488",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",flexShrink:0,fontWeight:700},children:e}),(0,r.jsxs)("div",{style:{minWidth:0},children:[(0,r.jsx)("p",{style:{margin:0,fontSize:"13px",fontWeight:500,color:s?"#94a3b8":"#0f172a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:t}),(0,r.jsx)("p",{style:{margin:0,fontSize:"11px",color:"#94a3b8"},children:s?i:o})]})]}),(0,r.jsx)(ut,{checked:a,onChange:n,label:`Toggle ${t}`,disabled:s})]})}function y(){return(0,r.jsx)("div",{style:{height:"1px",background:"#f1f5f9",margin:"0"}})}var de=(0,A.forwardRef)(({position:e,settings:t,report:o,isActive:a,aiSupported:n,voiceSupported:s,set:i,onApply:d,onReset:f,onClose:p},x)=>{let{isMobile:g,isTablet:K}=ct(),[I,Y]=(0,A.useState)([]);(0,A.useEffect)(()=>{(async()=>{try{let H=window;if(!H.queryLocalFonts)return;let U=await H.queryLocalFonts(),J=[...new Set(U.map(X=>X.family))].sort();Y(J.slice(0,50))}catch{}})()},[]);let P=g?{position:"fixed",bottom:0,left:0,right:0,zIndex:9999,background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px 16px 0 0",boxShadow:"0 -8px 32px rgba(0,0,0,0.12)",maxHeight:"90vh",overflowY:"auto",fontFamily:"system-ui,-apple-system,sans-serif",width:"100%"}:{position:"fixed",bottom:"84px",[e]:"24px",zIndex:9999,width:K?"300px":"320px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",maxHeight:"80vh",overflowY:"auto",fontFamily:"system-ui,-apple-system,sans-serif"};return(0,r.jsxs)("div",{ref:x,role:"dialog","aria-modal":"true","aria-label":"yuktai accessibility preferences","data-yuktai-panel":"true",style:P,children:[(0,r.jsxs)("div",{style:{padding:"14px 18px 12px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"flex-start",justifyContent:"space-between",position:"sticky",top:0,background:"#fff",zIndex:1},children:[(0,r.jsxs)("div",{children:[(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"7px",marginBottom:"5px",flexWrap:"wrap"},children:[(0,r.jsx)("span",{style:{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0d9488",letterSpacing:"0.05em",fontFamily:"monospace"},children:"@yuktishaalaa/yuktai v4.0.0"}),a&&(0,r.jsx)("span",{style:{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0f766e",border:"1px solid #99f6e4"},children:"\u25CF ACTIVE"})]}),(0,r.jsx)("p",{style:{margin:"0 0 2px",fontSize:"15px",fontWeight:600,color:"#0f172a"},children:"Accessibility"}),(0,r.jsx)("p",{style:{margin:0,fontSize:"12px",color:"#64748b"},children:"WCAG 2.2 \xB7 Open source \xB7 Zero cost"})]}),(0,r.jsx)("button",{onClick:p,"aria-label":"Close accessibility panel",style:{background:"none",border:"none",cursor:"pointer",padding:"4px",color:"#94a3b8",fontSize:"20px",lineHeight:1,borderRadius:"6px",flexShrink:0,minWidth:g?"44px":"auto",minHeight:g?"44px":"auto",display:"flex",alignItems:"center",justifyContent:"center"},children:"\xD7"})]}),(0,r.jsx)(G,{label:"Core"}),(0,r.jsx)(k,{icon:"\u267F",label:"Auto-fix ARIA",desc:"Injects missing labels and roles",checked:t.autoFix,onChange:l=>i("autoFix",l)}),(0,r.jsx)(y,{}),(0,r.jsx)(k,{icon:"\u{1F50A}",label:"Speak on focus",desc:"Browser reads elements aloud",checked:t.speechEnabled,onChange:l=>i("speechEnabled",l)}),(0,r.jsx)(y,{}),(0,r.jsx)(k,{icon:"\u{1F399}",label:"Voice control",desc:"Navigate page by voice",checked:t.voiceControl,onChange:l=>i("voiceControl",l),disabled:!s,disabledReason:"Not supported in this browser"}),(0,r.jsx)(y,{}),(0,r.jsx)(G,{label:"AI features",color:"#7c3aed",badge:"Gemini Nano \xB7 Chrome 127+"}),(0,r.jsx)("div",{style:{margin:"4px 18px 8px",padding:"8px 10px",background:"#f5f3ff",borderRadius:"8px",border:"0.5px solid #c4b5fd",fontSize:"10px",color:"#7c3aed",lineHeight:1.5},children:n?"Gemini Nano detected \u2014 AI features ready. Runs privately on your device.":"AI features need Chrome 127+. Install Chrome to unlock these."}),(0,r.jsx)(k,{icon:"\u{1F4DD}",label:"Plain English mode",desc:"Simplifies complex page text",checked:t.plainEnglish,onChange:l=>i("plainEnglish",l),disabled:!n,disabledReason:"Needs Chrome 127+"}),(0,r.jsx)(y,{}),(0,r.jsx)(k,{icon:"\u{1F4CB}",label:"Summarise page",desc:"3-sentence summary at top",checked:t.summarisePage,onChange:l=>i("summarisePage",l),disabled:!n,disabledReason:"Needs Chrome 127+"}),(0,r.jsx)(y,{}),(0,r.jsx)(k,{icon:"\u{1F3F7}",label:"Smart aria-labels",desc:"AI generates meaningful labels",checked:t.smartLabels,onChange:l=>i("smartLabels",l),disabled:!n,disabledReason:"Needs Chrome 127+"}),(0,r.jsx)(y,{}),(0,r.jsx)(G,{label:"Visual"}),(0,r.jsx)(k,{icon:"\u25D1",label:"High contrast",desc:"Boosts contrast for low vision",checked:t.highContrast,onChange:l=>i("highContrast",l)}),(0,r.jsx)(y,{}),(0,r.jsx)(k,{icon:"\u{1F319}",label:"Dark mode",desc:"Inverts colours",checked:t.darkMode,onChange:l=>i("darkMode",l)}),(0,r.jsx)(y,{}),(0,r.jsx)(k,{icon:"\u23F8",label:"Reduce motion",desc:"Disables animations",checked:t.reduceMotion,onChange:l=>i("reduceMotion",l)}),(0,r.jsx)(y,{}),(0,r.jsx)(k,{icon:"\u{1F446}",label:"Large targets",desc:"44\xD744px minimum touch targets",checked:t.largeTargets,onChange:l=>i("largeTargets",l)}),(0,r.jsx)(y,{}),(0,r.jsxs)("div",{style:{padding:"10px 18px"},children:[(0,r.jsx)("p",{style:{margin:"0 0 8px",fontSize:"13px",fontWeight:500,color:"#0f172a"},children:"\u{1F3A8} Colour blindness"}),(0,r.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"},children:dt.map(l=>(0,r.jsx)("button",{onClick:()=>i("colorBlindMode",l.value),"aria-pressed":t.colorBlindMode===l.value,style:{padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500,border:`1px solid ${t.colorBlindMode===l.value?"#0d9488":"#e2e8f0"}`,background:t.colorBlindMode===l.value?"#f0fdfa":"#fff",color:t.colorBlindMode===l.value?"#0d9488":"#64748b",cursor:"pointer",minHeight:g?"36px":"auto"},children:l.label},l.value))})]}),(0,r.jsx)(y,{}),(0,r.jsx)(G,{label:"Font"}),(0,r.jsx)(k,{icon:"Aa",label:"Dyslexia-friendly font",desc:"Atkinson Hyperlegible",checked:t.dyslexiaFont,onChange:l=>i("dyslexiaFont",l)}),(0,r.jsx)(y,{}),(0,r.jsxs)("div",{style:{padding:"10px 18px"},children:[(0,r.jsx)("p",{style:{margin:"0 0 8px",fontSize:"13px",fontWeight:500,color:"#0f172a"},children:"\u{1F524} Local font"}),I.length>0?(0,r.jsxs)("select",{value:t.localFont,onChange:l=>i("localFont",l.target.value),"aria-label":"Choose a font from your device",style:{width:"100%",padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"13px",color:"#0f172a",background:"#fff",cursor:"pointer",height:g?"44px":"36px"},children:[(0,r.jsx)("option",{value:"",children:"System default"}),I.map(l=>(0,r.jsx)("option",{value:l,style:{fontFamily:l},children:l},l))]}):(0,r.jsx)("p",{style:{margin:0,fontSize:"11px",color:"#94a3b8"},children:"Local font access needs Chrome 103+. Allow font access when prompted."})]}),(0,r.jsx)(y,{}),(0,r.jsxs)("div",{style:{padding:"10px 18px 14px"},children:[(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"10px"},children:[(0,r.jsx)("p",{style:{margin:0,fontSize:"13px",fontWeight:500,color:"#0f172a"},children:"Text size"}),(0,r.jsxs)("span",{style:{fontSize:"12px",fontWeight:600,color:"#0d9488",background:"#f0fdfa",padding:"2px 8px",borderRadius:"99px"},children:[t.fontScale,"%"]})]}),(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[(0,r.jsx)("button",{onClick:()=>{let l=R.indexOf(t.fontScale);l>0&&i("fontScale",R[l-1])},disabled:t.fontScale<=80,"aria-label":"Decrease text size",style:{width:g?"44px":"30px",height:g?"44px":"30px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:t.fontScale<=80?"not-allowed":"pointer",fontSize:"16px",color:t.fontScale<=80?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"\u2212"}),(0,r.jsx)("div",{style:{flex:1,display:"flex",gap:"3px"},children:R.map(l=>(0,r.jsx)("button",{onClick:()=>i("fontScale",l),"aria-label":`Set text size to ${l}%`,style:{flex:1,height:"6px",borderRadius:"99px",border:"none",cursor:"pointer",padding:0,background:l<=t.fontScale?"#0d9488":"#e2e8f0",transition:"background 0.15s"}},l))}),(0,r.jsx)("button",{onClick:()=>{let l=R.indexOf(t.fontScale);l<R.length-1&&i("fontScale",R[l+1])},disabled:t.fontScale>=130,"aria-label":"Increase text size",style:{width:g?"44px":"30px",height:g?"44px":"30px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:t.fontScale>=130?"not-allowed":"pointer",fontSize:"16px",color:t.fontScale>=130?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"+"})]})]}),(0,r.jsx)(y,{}),(0,r.jsxs)("div",{style:{padding:"10px 18px"},children:[(0,r.jsxs)("p",{style:{margin:"0 0 8px",fontSize:"13px",fontWeight:500,color:"#0f172a"},children:["\u{1F310} Translate page",(0,r.jsx)("span",{style:{marginLeft:"6px",fontSize:"9px",fontWeight:500,padding:"1px 6px",borderRadius:"99px",background:"#f5f3ff",color:"#7c3aed",border:"0.5px solid #c4b5fd"},children:"Gemini Nano"})]}),(0,r.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"},children:B.slice(0,g?8:18).map(l=>(0,r.jsx)("button",{onClick:()=>i("translateLanguage",l.code),"aria-pressed":t.translateLanguage===l.code,disabled:!n,style:{padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500,border:`1px solid ${t.translateLanguage===l.code?"#7c3aed":"#e2e8f0"}`,background:t.translateLanguage===l.code?"#f5f3ff":"#fff",color:t.translateLanguage===l.code?"#7c3aed":"#64748b",cursor:n?"pointer":"not-allowed",opacity:n?1:.5,minHeight:g?"36px":"auto"},children:l.code.toUpperCase()},l.code))}),!n&&(0,r.jsx)("p",{style:{margin:"6px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Translation needs Chrome 127+"})]}),o&&(0,r.jsx)("div",{role:"status",style:{margin:"0 14px",padding:"8px 12px",background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"8px",fontSize:"12px",color:"#0f766e",fontWeight:500,fontFamily:"monospace"},children:o.fixed>0?`\u2713 ${o.fixed} fixes \xB7 ${o.scanned} nodes \xB7 ${o.renderTime}ms \xB7 Score: ${o.score}/100`:`\u2713 0 auto-fixes needed \xB7 ${o.scanned} nodes \xB7 ${o.renderTime}ms`}),(0,r.jsxs)("div",{style:{display:"flex",gap:"8px",padding:"12px 14px 14px",position:g?"sticky":"relative",bottom:g?0:"auto",background:"#fff",borderTop:"1px solid #f1f5f9"},children:[(0,r.jsx)("button",{onClick:f,style:{flex:1,padding:g?"12px 0":"8px 0",fontSize:"13px",fontWeight:500,borderRadius:"9px",border:"1px solid #e2e8f0",background:"#fff",color:"#64748b",cursor:"pointer"},children:"Reset"}),(0,r.jsx)("button",{onClick:d,style:{flex:2,padding:g?"12px 0":"8px 0",fontSize:"13px",fontWeight:600,borderRadius:"9px",border:"none",background:"#0d9488",color:"#fff",cursor:"pointer"},children:"Apply settings"})]})]})});de.displayName="WidgetPanel";var T=require("react/jsx-runtime");function j({position:e="left",children:t,config:o={}}){let[a,n]=(0,b.useState)(!1),[s,i]=(0,b.useState)(le),[d,f]=(0,b.useState)(null),[p,x]=(0,b.useState)(!1),[g,K]=(0,b.useState)(!1),[I,Y]=(0,b.useState)(!1),P=b.default.useRef(null);(0,b.useEffect)(()=>{if(typeof window>"u")return;let c=!!window.ai;K(c);let v=!!(window.SpeechRecognition||window.webkitSpeechRecognition);Y(v)},[]),(0,b.useEffect)(()=>{if(!(typeof window>"u"))try{let c=localStorage.getItem("yuktai-a11y-prefs");if(c){let v=JSON.parse(c);i(E=>({...E,...v}))}}catch{}},[]);let l=(0,b.useCallback)(async c=>{let v={enabled:!0,highContrast:c.highContrast,darkMode:c.darkMode,reduceMotion:c.reduceMotion,largeTargets:c.largeTargets,speechEnabled:c.speechEnabled,autoFix:c.autoFix,dyslexiaFont:c.dyslexiaFont,localFont:c.localFont,fontSizeMultiplier:c.fontScale/100,colorBlindMode:c.colorBlindMode,showAuditBadge:c.showAuditBadge,showSkipLinks:!0,showPreferencePanel:!1,plainEnglish:c.plainEnglish,summarisePage:c.summarisePage,translateLanguage:c.translateLanguage,voiceControl:c.voiceControl,smartLabels:c.smartLabels,...o};await h.execute(v);let E=h.applyFixes(v);f(E),x(!0)},[o]),H=(0,b.useCallback)(async()=>{try{localStorage.setItem("yuktai-a11y-prefs",JSON.stringify(s))}catch{}await l(s),n(!1)},[s,l]),U=(0,b.useCallback)(()=>{i(le);try{localStorage.removeItem("yuktai-a11y-prefs")}catch{}let c=document.documentElement;["data-yuktai-high-contrast","data-yuktai-dark","data-yuktai-reduce-motion","data-yuktai-large-targets","data-yuktai-keyboard","data-yuktai-dyslexia"].forEach(E=>c.removeAttribute(E)),document.body.style.filter="",document.body.style.fontFamily="",document.documentElement.style.fontSize="",f(null),x(!1)},[]),J=(0,b.useCallback)((c,v)=>{i(E=>({...E,[c]:v}))},[]);(0,b.useEffect)(()=>{let c=v=>{v.key==="Escape"&&a&&n(!1)};return window.addEventListener("keydown",c),()=>window.removeEventListener("keydown",c)},[a]),(0,b.useEffect)(()=>{a&&P.current&&h.trapFocus(P.current)},[a]);let X={position:"fixed",bottom:"24px",[e]:"24px",zIndex:9998,width:"52px",height:"52px",borderRadius:"50%",background:p?"#0d9488":"#1a73e8",color:"#fff",border:"none",cursor:"pointer",fontSize:"22px",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,0,0,0.25)",transition:"transform 0.15s, background 0.2s"};return(0,T.jsxs)(T.Fragment,{children:[t,(0,T.jsx)("button",{style:X,"aria-label":"Open accessibility preferences","aria-haspopup":"dialog","aria-expanded":a,"data-yuktai-pref-toggle":"true",onClick:()=>n(c=>!c),onMouseEnter:c=>{c.currentTarget.style.transform="scale(1.08)"},onMouseLeave:c=>{c.currentTarget.style.transform="scale(1)"},children:"\u267F"}),a&&(0,T.jsx)(de,{ref:P,position:e,settings:s,report:d,isActive:p,aiSupported:g,voiceSupported:I,set:J,onApply:H,onReset:U,onClose:()=>n(!1)})]})}var z={name:"ai.text",async execute(e){return`\u{1F916} YuktAI says: ${e}`}};var $={name:"voice.text",async execute(e){return!e||e.trim()===""?"\u{1F3A4} No speech detected":`\u{1F3A4} You said: ${e}`}};var S=class{plugins=new Map;register(t,o){if(!o||typeof o.execute!="function")throw new Error(`Invalid plugin: ${t}`);this.plugins.set(t,o)}use(t){return this.plugins.get(t)}async run(t,o){try{let a=this.use(t);if(!a)throw new Error(`Plugin not found: ${t}`);return await a.execute(o)}catch(a){throw console.error(`[YuktAI Runtime Error in ${t}]:`,a),a}}getPlugins(){return Array.from(this.plugins.keys())}};function pt(){if(typeof globalThis>"u")return new S;if(!globalThis.__yuktai_runtime__){let e=new S;e.register(h.name,h),e.register(z.name,z),e.register($.name,$),globalThis.__yuktai_runtime__=e}return globalThis.__yuktai_runtime__}var $e=typeof window<"u"?pt():new S,ft={wcagPlugin:h,list(){return $e.getPlugins()},use(e){return $e.use(e)},fix(e){return h.applyFixes({enabled:!0,autoFix:!0,...e})},scan(){return h.scan()}};0&&(module.exports={Runtime,YuktAI,YuktAIWrapper,aiPlugin,voicePlugin,wcag,wcagPlugin});
