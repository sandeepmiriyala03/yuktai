"use strict";var _e=Object.create;var _=Object.defineProperty;var De=Object.getOwnPropertyDescriptor;var qe=Object.getOwnPropertyNames;var Ge=Object.getPrototypeOf,Ve=Object.prototype.hasOwnProperty;var je=(e,t)=>{for(var a in t)_(e,a,{get:t[a],enumerable:!0})},fe=(e,t,a,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of qe(t))!Ve.call(e,o)&&o!==a&&_(e,o,{get:()=>t[o],enumerable:!(i=De(t,o))||i.enumerable});return e};var Ke=(e,t,a)=>(a=e!=null?_e(Ge(e)):{},fe(t||!e||!e.__esModule?_(a,"default",{value:e,enumerable:!0}):a,e)),Ye=e=>fe(_({},"__esModule",{value:!0}),e);var Ct={};je(Ct,{Runtime:()=>E,YuktAI:()=>Et,YuktAIWrapper:()=>J,aiPlugin:()=>F,default:()=>J,voicePlugin:()=>W,wcag:()=>w,wcagPlugin:()=>w});module.exports=Ye(Ct);function me(){let e=window;return e.Rewriter||e.ai?.rewriter||null}async function ee(){try{let e=me();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}async function Ue(e){if(!e||e.trim().length<20)return{success:!1,original:e,rewritten:e,error:"Text too short"};try{let t=me();if(!t)throw new Error("Rewriter API not available");let a=await t.create({tone:"more-casual",format:"plain-text",length:"as-is",outputLanguage:"en"}),i=await a.rewrite(e,{context:"Rewrite this text in simple plain English. Use short sentences. Avoid jargon. Make it easy to understand for everyone."});return a.destroy(),{success:!0,original:e,rewritten:i.trim()}}catch(t){return{success:!1,original:e,rewritten:e,error:t instanceof Error?t.message:"Rewrite failed"}}}async function be(){if(!await ee())return{fixed:0,error:"Chrome Built-in AI Rewriter not available. Enable via chrome://flags."};let t=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption"),a=0;for(let i of t){let o=i.innerText?.trim();if(!o||o.length<20||i.closest("[data-yuktai-panel]"))continue;let l=await Ue(o);l.success&&l.rewritten!==o&&(i.dataset.yuktaiOriginal=o,i.innerText=l.rewritten,a++)}return{fixed:a}}function ge(){let e=document.querySelectorAll("[data-yuktai-original]");for(let t of e){let a=t.dataset.yuktaiOriginal;a&&(t.innerText=a,delete t.dataset.yuktaiOriginal)}}var ye="yuktai-summary-box";function xe(){let e=window;return e.Summarizer||e.ai?.summarizer||null}async function te(){try{let e=xe();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}function Je(){let e=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, article, section"),t=[];for(let a of e){if(a.closest("[data-yuktai-panel]"))continue;let i=window.getComputedStyle(a);if(i.display==="none"||i.visibility==="hidden")continue;let o=a.innerText?.trim();o&&o.length>10&&t.push(o)}return t.join(" ").slice(0,5e3)}async function he(){if(!await te())return{success:!1,summary:"",error:"Chrome Built-in AI Summarizer not available. Enable via chrome://flags."};let t=Je();if(!t||t.length<100)return{success:!1,summary:"",error:"Not enough text on this page to summarise."};try{let a=xe();if(!a)throw new Error("Summarizer API not available");let i=await a.create({type:"tl;dr",format:"plain-text",length:"short",outputLanguage:"en"}),o=await i.summarize(t,{context:"Summarise this page in 2-3 simple sentences for a screen reader user who wants to know if this page is relevant to them."});return i.destroy(),Xe(o.trim()),{success:!0,summary:o.trim()}}catch(a){return{success:!1,summary:"",error:a instanceof Error?a.message:"Summary failed"}}}function Xe(e){D();let t=document.createElement("div");t.id=ye,t.setAttribute("data-yuktai-panel","true"),t.setAttribute("role","region"),t.setAttribute("aria-label","Page summary by yuktai"),t.style.cssText=`
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
  `;let a=document.createElement("p");a.style.cssText="margin: 0; flex: 1;",a.textContent=`\u{1F4CB} Page summary: ${e}`;let i=document.createElement("button");i.textContent="\xD7",i.setAttribute("aria-label","Close page summary"),i.style.cssText=`
    background: none; border: none; color: #ffffff;
    font-size: 20px; cursor: pointer; padding: 0 4px;
    line-height: 1; flex-shrink: 0;
  `,i.addEventListener("click",D),t.appendChild(a),t.appendChild(i),document.body.prepend(t)}function D(){let e=document.getElementById(ye);e&&e.remove()}var G=[{code:"en",label:"English"},{code:"hi",label:"Hindi"},{code:"es",label:"Spanish"},{code:"fr",label:"French"},{code:"de",label:"German"},{code:"it",label:"Italian"},{code:"pt",label:"Portuguese"},{code:"nl",label:"Dutch"},{code:"pl",label:"Polish"},{code:"ru",label:"Russian"},{code:"ja",label:"Japanese"},{code:"ko",label:"Korean"},{code:"zh",label:"Chinese"},{code:"ar",label:"Arabic"},{code:"tr",label:"Turkish"},{code:"vi",label:"Vietnamese"},{code:"bn",label:"Bengali"},{code:"id",label:"Indonesian"}],q="en";function Qe(){let e=window;return e.Translator||e.translation||null}async function Ze(e){try{let t=window;if(!Qe())return!1;if(t.Translator&&typeof t.Translator.availability=="function")try{let i=await t.Translator.availability({sourceLanguage:"en",targetLanguage:e});return i==="readily"||i==="available"||i==="downloadable"||i==="after-download"}catch{}return t.Translator&&typeof t.Translator.canTranslate=="function"?await t.Translator.canTranslate({sourceLanguage:"en",targetLanguage:e})!=="no":t.translation&&typeof t.translation.canTranslate=="function"?await t.translation.canTranslate({sourceLanguage:"en",targetLanguage:e})!=="no":!1}catch{return!1}}async function et(e){let t=window,a={sourceLanguage:"en",targetLanguage:e};if(t.Translator&&typeof t.Translator.create=="function")return await t.Translator.create(a);if(t.translation&&typeof t.translation.createTranslator=="function")return await t.translation.createTranslator(a);throw new Error("Translation API not available")}async function we(e){if(e===q)return{success:!0,language:e,fixed:0};if(e==="en")return ae(),q="en",{success:!0,language:"en",fixed:0};if(!await Ze(e))return{success:!1,language:e,fixed:0,error:`Translation to ${e} not available. Enable via chrome://flags.`};try{let a=await et(e),i=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption, span, a"),o=0;for(let l of i){if(l.closest("[data-yuktai-panel]")||l.children.length>0)continue;let n=l.innerText?.trim();if(!n||n.length<2)continue;l.dataset.yuktaiTranslationOriginal||(l.dataset.yuktaiTranslationOriginal=n);let c=await a.translate(n);c&&c!==n&&(l.innerText=c,o++)}return typeof a.destroy=="function"&&a.destroy(),q=e,{success:!0,language:e,fixed:o}}catch(a){return{success:!1,language:e,fixed:0,error:a instanceof Error?a.message:"Translation failed"}}}function ae(){let e=document.querySelectorAll("[data-yuktai-translation-original]");for(let t of e){let a=t.dataset.yuktaiTranslationOriginal;a&&(t.innerText=a,delete t.dataset.yuktaiTranslationOriginal)}q="en"}var tt=[{phrases:["go to main","skip to main","main content"],action:"focus-main",label:"Jump to main content"},{phrases:["go to navigation","go to nav","open menu"],action:"focus-nav",label:"Jump to navigation"},{phrases:["go to search","search","find"],action:"focus-search",label:"Jump to search"},{phrases:["scroll down","page down","next"],action:"scroll-down",label:"Scroll down"},{phrases:["scroll up","page up","back up"],action:"scroll-up",label:"Scroll up"},{phrases:["go back","previous page"],action:"go-back",label:"Go back"},{phrases:["click","press","select"],action:"click-focused",label:"Click focused element"},{phrases:["next item","tab forward","tab"],action:"tab-forward",label:"Move to next element"},{phrases:["previous item","tab back","shift tab"],action:"tab-back",label:"Move to previous element"},{phrases:["stop listening","stop voice","quiet"],action:"stop-voice",label:"Stop voice control"}],k=null,V=!1,R=null;function oe(){return!!(window.SpeechRecognition||window.webkitSpeechRecognition)}function at(e){let t=e.toLowerCase().trim();for(let a of tt)for(let i of a.phrases)if(t.includes(i))return{action:a.action,label:a.label};return null}function ot(e){switch(e){case"focus-main":{let t=document.querySelector("main, [role='main'], #main");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-nav":{let t=document.querySelector("nav, [role='navigation']");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-search":{let t=document.querySelector("input[type='search'], input[role='searchbox'], [aria-label*='search' i]");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"scroll-down":{window.scrollBy({top:400,behavior:"smooth"});break}case"scroll-up":{window.scrollBy({top:-400,behavior:"smooth"});break}case"go-back":{window.history.back();break}case"click-focused":{let t=document.activeElement;t&&t!==document.body&&t.click();break}case"tab-forward":{let t=ve(),a=t.indexOf(document.activeElement),i=t[a+1]||t[0];i&&i.focus();break}case"tab-back":{let t=ve(),a=t.indexOf(document.activeElement),i=t[a-1]||t[t.length-1];i&&i.focus();break}case"stop-voice":{ne();break}}}function ve(){return Array.from(document.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(e=>!e.closest("[data-yuktai-panel]"))}function ke(e){if(!oe())return!1;if(V)return!0;e&&(R=e);let t=window.SpeechRecognition||window.webkitSpeechRecognition;return k=new t,k.continuous=!0,k.interimResults=!1,k.lang="en-US",k.onresult=a=>{let i=a.results[a.results.length-1][0].transcript,o=at(i);if(o){ot(o.action);let l={success:!0,command:i,action:o.label};if(R&&R(l),o.action==="stop-voice")return}},k.onend=()=>{V&&k?.start()},k.onerror=a=>{a.error!=="no-speech"&&R&&R({success:!1,command:"",action:"",error:`Voice error: ${a.error}`})},k.start(),V=!0,nt(),!0}function ne(){V=!1,k&&(k.stop(),k=null),R=null,Se()}var Ae="yuktai-voice-indicator";function nt(){Se();let e=document.createElement("div");e.id=Ae,e.setAttribute("data-yuktai-panel","true"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-label","yuktai voice control is listening"),e.style.cssText=`
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
  `,!document.getElementById("yuktai-pulse-style")){let i=document.createElement("style");i.id="yuktai-pulse-style",i.textContent=`
      @keyframes yuktai-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50%       { opacity: 0.4; transform: scale(0.7); }
      }
    `,document.head.appendChild(i)}let a=document.createElement("span");a.textContent="Listening for commands...",e.appendChild(t),e.appendChild(a),document.body.appendChild(e)}function Se(){let e=document.getElementById(Ae);e&&e.remove()}var it=["button:not([aria-label]):not([aria-labelledby])","a:not([aria-label]):not([aria-labelledby])","input:not([aria-label]):not([aria-labelledby]):not([id])","select:not([aria-label]):not([aria-labelledby])","textarea:not([aria-label]):not([aria-labelledby])","[role='button']:not([aria-label])","[role='link']:not([aria-label])","[role='checkbox']:not([aria-label])","[role='tab']:not([aria-label])"].join(", ");function Te(){let e=window;return e.Writer||e.ai?.writer||null}async function ie(){try{let e=Te();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}function rt(e){let t=[],a=e.innerText?.trim();a&&t.push(`element text: "${a}"`);let i=e.placeholder?.trim();i&&t.push(`placeholder: "${i}"`);let o=e.getAttribute("name")?.trim();o&&t.push(`name: "${o}"`);let l=e.getAttribute("type")?.trim();l&&t.push(`type: "${l}"`);let n=e.id;if(n){let u=document.querySelector(`label[for="${n}"]`);u&&t.push(`label: "${u.innerText?.trim()}"`)}let c=e.parentElement?.innerText?.trim().slice(0,60);c&&t.push(`parent context: "${c}"`),t.push(`tag: ${e.tagName.toLowerCase()}`);let f=e.getAttribute("role");return f&&t.push(`role: ${f}`),t.join(". ")}async function st(e,t){let a=`
    Generate a short, clear aria-label for an HTML element.
    The label must be 2-6 words maximum.
    The label must describe what the element does or what it is.
    Do not include punctuation.
    Do not explain \u2014 just output the label text only.

    Element details:
    ${t}

    Output only the label. Nothing else.
  `.trim();return(await e.write(a)).trim().replace(/^["']|["']$/g,"").replace(/\.$/,"").trim()}async function Ee(){if(!await ie())return{success:!1,fixed:0,elements:[],error:"Chrome Built-in AI Writer not available. Enable via chrome://flags."};let t=document.querySelectorAll(it);if(t.length===0)return{success:!0,fixed:0,elements:[]};try{let a=Te();if(!a)throw new Error("Writer API not available");let i=await a.create({tone:"neutral",format:"plain-text",length:"short",outputLanguage:"en"}),o=0,l=[];for(let n of t){if(n.closest("[data-yuktai-panel]"))continue;let c=window.getComputedStyle(n);if(c.display==="none"||c.visibility==="hidden")continue;let f=rt(n),u=await st(i,f);u&&u.length>0&&(n.dataset.yuktaiLabelOriginal=n.getAttribute("aria-label")||"",n.setAttribute("aria-label",u),o++,l.push({tag:n.tagName.toLowerCase(),label:u}))}return i.destroy(),{success:!0,fixed:o,elements:l}}catch(a){return{success:!1,fixed:0,elements:[],error:a instanceof Error?a.message:"Label generation failed"}}}function Ce(){let e=document.querySelectorAll("[data-yuktai-label-original]");for(let t of e){let a=t.dataset.yuktaiLabelOriginal;a?t.setAttribute("aria-label",a):t.removeAttribute("aria-label"),delete t.dataset.yuktaiLabelOriginal}}var Y=null,Le=null;var Me=null,re=null,m=null,P=null,j=null,se=null,z=null,K={deuteranopia:"yuktai-cb-d",protanopia:"yuktai-cb-p",tritanopia:"yuktai-cb-t"};var Re=new Set(["input","select","textarea"]);var le={nav:"navigation",header:"banner",footer:"contentinfo",main:"main",aside:"complementary"};function ce(e,t="polite"){if(typeof window>"u"||!z?.speechEnabled||!window.speechSynthesis)return;window.speechSynthesis.cancel();let a=new SpeechSynthesisUtterance(e);a.rate=1,a.pitch=1,a.volume=1;let i=window.speechSynthesis.getVoices();i.length>0&&(a.voice=i[0]),window.speechSynthesis.speak(a)}function We(e,t="info"){if(typeof document>"u")return;let i={success:{bg:"#0f9d58",border:"#0a7a44",icon:"\u2713"},error:{bg:"#d93025",border:"#b52a1c",icon:"\u2715"},warning:{bg:"#f29900",border:"#c67c00",icon:"\u26A0"},info:{bg:"#1a73e8",border:"#1557b0",icon:"\u2139"}}[t];m||(m=document.createElement("div"),m.setAttribute("role","alert"),m.setAttribute("aria-live","assertive"),m.setAttribute("aria-atomic","true"),m.style.cssText=`
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
    `,document.body.appendChild(m)),m.style.background=i.bg,m.style.border=`1px solid ${i.border}`,m.style.color="#fff",m.innerHTML=`
    <span style="font-size:18px;font-weight:700">${i.icon}</span>
    <span style="flex:1;line-height:1.4">${e}</span>
    <button
      onclick="this.parentElement.style.transform='translateX(120%)';this.parentElement.style.opacity='0'"
      style="background:none;border:none;color:#fff;cursor:pointer;font-size:18px;padding:0;line-height:1"
      aria-label="Close notification">\xD7</button>
  `,window.innerWidth<=480&&(m.style.right="8px",m.style.left="8px",m.style.maxWidth="none",m.style.width="auto"),requestAnimationFrame(()=>{m&&(m.style.transform="translateX(0)",m.style.opacity="1")}),setTimeout(()=>{m&&(m.style.transform="translateX(120%)",m.style.opacity="0")},5e3)}function p(e,t="info",a=!0){Y&&(Y.textContent=e),We(e,t),a&&ce(e,t==="error"?"assertive":"polite")}function lt(){if(typeof document>"u"||Me)return;let e=[{label:"Skip to main content",selector:"main,[role='main'],#main,#main-content"},{label:"Skip to navigation",selector:"nav,[role='navigation'],#nav,#navigation"},{label:"Skip to search",selector:"[role='search'],#search,input[type='search']"}],t=document.createElement("div");t.setAttribute("data-yuktai-skip-bar","true"),t.setAttribute("role","navigation"),t.setAttribute("aria-label","Skip links"),t.style.cssText=`
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
  `;let a=!1;if(e.forEach(({label:o,selector:l})=>{let n=document.querySelector(l);if(!n)return;a=!0,n.getAttribute("tabindex")||n.setAttribute("tabindex","-1");let c=document.createElement("a");c.href="#",c.textContent=o,c.style.cssText=`
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
    `,c.addEventListener("focus",()=>{t.style.transform="translateY(0)"}),c.addEventListener("blur",()=>{setTimeout(()=>{t.matches(":focus-within")||(t.style.transform="translateY(-100%)")},2e3)}),c.addEventListener("click",f=>{f.preventDefault(),n.focus(),n.scrollIntoView({behavior:"smooth",block:"start"}),p(`Jumped to ${o.replace("Skip to ","")}`,"info"),t.style.transform="translateY(-100%)"}),t.appendChild(c)}),!a)return;window.innerWidth<768&&(t.style.transform="translateY(0)",t.style.position="sticky"),window.addEventListener("resize",()=>{window.innerWidth<768&&(t.style.transform="translateY(0)")}),document.body.insertBefore(t,document.body.firstChild),Me=t}function ct(){if(typeof document>"u"||document.querySelector("[data-yuktai-focus-style]"))return;let e=document.createElement("style");e.setAttribute("data-yuktai-focus-style","true"),e.textContent=`

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
  `,document.head.appendChild(e),document.documentElement.setAttribute("data-yuktai-a11y","true")}function dt(){typeof document>"u"||document.querySelector("[data-yuktai-kb-init]")||(document.documentElement.setAttribute("data-yuktai-kb-init","true"),document.addEventListener("keydown",e=>{let t=document.activeElement;if(!t)return;let a=t.getAttribute("role")||"";if(e.key==="Escape"){let i=t.closest("[role='dialog'],[role='alertdialog']");if(i){i.style.display="none",p("Dialog closed","info");return}let o=t.closest("[role='menu'],[role='menubar']");o&&(o.style.display="none",p("Menu closed","info"))}if(a==="menuitem"||t.closest("[role='menu'],[role='menubar']")){let i=t.closest("[role='menu'],[role='menubar']");if(!i)return;let o=Array.from(i.querySelectorAll("[role='menuitem']:not([disabled])")),l=o.indexOf(t);e.key==="ArrowDown"||e.key==="ArrowRight"?(e.preventDefault(),o[(l+1)%o.length]?.focus()):e.key==="ArrowUp"||e.key==="ArrowLeft"?(e.preventDefault(),o[(l-1+o.length)%o.length]?.focus()):e.key==="Home"?(e.preventDefault(),o[0]?.focus()):e.key==="End"&&(e.preventDefault(),o[o.length-1]?.focus())}if(a==="tab"||t.closest("[role='tablist']")){let i=t.closest("[role='tablist']");if(!i)return;let o=Array.from(i.querySelectorAll("[role='tab']:not([disabled])")),l=o.indexOf(t);if(e.key==="ArrowRight"||e.key==="ArrowDown"){e.preventDefault();let n=o[(l+1)%o.length];n?.focus(),n?.click()}else if(e.key==="ArrowLeft"||e.key==="ArrowUp"){e.preventDefault();let n=o[(l-1+o.length)%o.length];n?.focus(),n?.click()}}if(a==="option"||t.closest("[role='listbox']")){let i=t.closest("[role='listbox']");if(!i)return;let o=Array.from(i.querySelectorAll("[role='option']:not([aria-disabled='true'])")),l=o.indexOf(t);e.key==="ArrowDown"?(e.preventDefault(),o[(l+1)%o.length]?.focus()):e.key==="ArrowUp"?(e.preventDefault(),o[(l-1+o.length)%o.length]?.focus()):(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),t.setAttribute("aria-selected","true"),o.forEach(n=>{n!==t&&n.setAttribute("aria-selected","false")}),p(`Selected: ${t.textContent?.trim()}`,"success"))}e.altKey&&e.key==="a"&&(e.preventDefault(),ut()),e.key==="Tab"&&z?.speechEnabled&&setTimeout(()=>{let i=document.activeElement;if(!i)return;let o=i.getAttribute("aria-label")||i.getAttribute("title")||i.textContent?.trim()||i.tagName.toLowerCase(),l=i.getAttribute("role")||i.tagName.toLowerCase();ce(`${o}, ${l}`)},100)}))}function U(e){let t=e.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[role="button"]');if(t.length===0)return;let a=t[0],i=t[t.length-1];a.focus(),e.addEventListener("keydown",o=>{o.key==="Tab"&&(o.shiftKey?document.activeElement===a&&(o.preventDefault(),i.focus()):document.activeElement===i&&(o.preventDefault(),a.focus()))})}function ut(){if(typeof document>"u")return;if(P){P.remove(),P=null;return}let e=document.createElement("div");e.setAttribute("role","dialog"),e.setAttribute("aria-label","Keyboard shortcuts"),e.setAttribute("aria-modal","true"),e.setAttribute("data-yuktai-cheatsheet","true"),e.style.cssText=`
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
    ${t.map(([i,o])=>`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #2a2a4a">
        <kbd style="background:#2a2a4a;color:#74c0fc;padding:3px 8px;border-radius:4px;font-size:12px;font-family:monospace;border:1px solid #3a3a6a">${i}</kbd>
        <span style="font-size:12px;color:#ccc;text-align:right;flex:1;margin-left:12px">${o}</span>
      </div>
    `).join("")}
  `,e.querySelector("[data-yuktai-close]")?.addEventListener("click",()=>{e.remove(),P=null}),e.addEventListener("keydown",i=>{i.key==="Escape"&&(e.remove(),P=null)}),document.body.appendChild(e),P=e,U(e),p("Keyboard shortcuts opened. Press Escape to close.","info")}function pt(e){if(typeof document>"u"||!z?.showAuditBadge||typeof window<"u"&&!window.location.hostname.includes("localhost")&&!window.location.hostname.includes("127.0.0.1"))return;re&&re.remove();let t=e.score,a=t>=90?"#0f9d58":t>=70?"#f29900":"#d93025",i=t>=90?"\u267F":t>=70?"\u26A0":"\u2715",o=document.createElement("button");o.setAttribute("aria-label",`Accessibility score: ${t} out of 100`),o.setAttribute("data-yuktai-badge","true"),o.style.cssText=`
    position: fixed;
    bottom: 16px;
    left: 16px;
    z-index: 999998;
    background: ${a};
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
  `,o.innerHTML=`${i} ${t}/100 <span style="font-weight:400;opacity:0.85">${e.details.length} issues</span>`,o.addEventListener("click",()=>ft(e)),document.body.appendChild(o),re=o}function ft(e){let t=document.querySelector("[data-yuktai-audit-details]");if(t){t.remove();return}let a=document.createElement("div");a.setAttribute("data-yuktai-audit-details","true"),a.setAttribute("role","dialog"),a.setAttribute("aria-label","Accessibility audit details"),a.style.cssText=`
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
  `;let i={critical:"#d93025",serious:"#f29900",moderate:"#1a73e8",minor:"#0f9d58"};a.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <strong style="font-size:14px;color:#74c0fc">Audit report</strong>
      <span style="color:#aaa">${e.fixed} fixed \xB7 ${e.renderTime}ms</span>
    </div>
    ${e.details.slice(0,20).map(o=>`
      <div style="padding:6px 0;border-bottom:1px solid #2a2a4a">
        <div style="display:flex;gap:6px;align-items:center">
          <span style="background:${i[o.severity]};color:#fff;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:700;text-transform:uppercase">${o.severity}</span>
          <code style="color:#74c0fc">&lt;${o.tag}&gt;</code>
        </div>
        <div style="color:#ccc;margin-top:3px">${o.fix}</div>
      </div>
    `).join("")}
    ${e.details.length>20?`<div style="color:#888;padding:8px 0;text-align:center">+${e.details.length-20} more issues</div>`:""}
  `,a.addEventListener("keydown",o=>{o.key==="Escape"&&a.remove()}),document.body.appendChild(a),U(a)}function Ne(e){typeof document>"u"||(se&&clearTimeout(se),se=setTimeout(()=>{if(j)return;let t=document.createElement("div");t.setAttribute("role","alertdialog"),t.setAttribute("aria-label","Session timeout warning"),t.setAttribute("aria-modal","true"),t.setAttribute("data-yuktai-timeout","true"),t.style.cssText=`
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
    `;let a=t.querySelector("[data-yuktai-extend]"),i=t.querySelector("[data-yuktai-dismiss]");a?.addEventListener("click",()=>{t.remove(),j=null,p("Session extended. You have more time.","success"),z?.timeoutWarning&&Ne(z.timeoutWarning)}),i?.addEventListener("click",()=>{t.remove(),j=null}),document.body.appendChild(t),j=t,U(t),p("Warning: Your session will expire soon. Do you need more time?","warning")},e*1e3))}function mt(e){if(typeof document>"u")return;let t=document.documentElement;if(t.toggleAttribute("data-yuktai-high-contrast",!!e.highContrast),t.toggleAttribute("data-yuktai-dark",!!e.darkMode),t.toggleAttribute("data-yuktai-reduce-motion",!!e.reduceMotion),t.toggleAttribute("data-yuktai-large-targets",!!e.largeTargets),t.toggleAttribute("data-yuktai-keyboard",!!e.keyboardHints),t.toggleAttribute("data-yuktai-dyslexia",!!e.dyslexiaFont),e.localFont?document.body.style.fontFamily=`"${e.localFont}", system-ui, sans-serif`:e.dyslexiaFont||(document.body.style.fontFamily=""),e.fontSizeMultiplier&&e.fontSizeMultiplier!==1?document.documentElement.style.fontSize=`${e.fontSizeMultiplier*100}%`:document.documentElement.style.fontSize="",e.colorBlindMode&&e.colorBlindMode!=="none"){let a=e.colorBlindMode==="achromatopsia"?"grayscale(100%)":`url(#${K[e.colorBlindMode]})`;document.body.style.filter=a}else document.body.style.filter=""}function bt(e){try{let t=localStorage.getItem("yuktai-a11y-prefs");t&&Object.assign(e,JSON.parse(t))}catch{}}async function Pe(e){if(e){if(!await ee()){p("Plain English requires Chrome 127+","warning");return}p("Rewriting page in plain English...","info",!1);let a=await be();p(a.error?`Plain English failed: ${a.error}`:`${a.fixed} sections rewritten in plain English`,a.error?"error":"success",!1)}else ge(),p("Original text restored","info",!1)}async function ze(e){if(e){if(!await te()){p("Page summariser requires Chrome 127+","warning");return}p("Generating page summary...","info",!1);let a=await he();p(a.error?`Summary failed: ${a.error}`:"Page summary added at top",a.error?"error":"success",!1)}else D(),p("Page summary removed","info",!1)}async function Ie(e){if(e==="en"){ae(),p("Page restored to English","info",!1);return}p(`Translating page to ${e}...`,"info",!1);let t=await we(e);p(t.error?`Translation failed: ${t.error}`:`Page translated to ${e}`,t.error?"error":"success",!1)}async function He(e){if(e){if(!oe()){p("Voice control not supported in this browser","warning");return}ke(t=>{t.success&&p(`Voice: ${t.action}`,"info",!1)}),p("Voice control started. Say a command.","success",!1)}else ne(),p("Voice control stopped","info",!1)}async function $e(e){if(e){if(!await ie()){p("Smart labels requires Chrome 127+","warning");return}p("Generating smart labels...","info",!1);let a=await Ee();p(a.error?`Smart labels failed: ${a.error}`:`${a.fixed} elements labelled`,a.error?"error":"success",!1)}else Ce(),p("Smart labels removed","info",!1)}function gt(){if(typeof document>"u"||Y)return;let e=document.createElement("div");e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e.setAttribute("aria-relevant","text"),e.style.cssText="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);",document.body.appendChild(e),Y=e}function yt(){if(typeof document>"u"||Le)return;let e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("aria-hidden","true"),e.style.cssText="position:absolute;width:0;height:0;overflow:hidden;",e.innerHTML=`
    <defs>
      <filter id="${K.deuteranopia}">
        <feColorMatrix type="matrix"
          values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${K.protanopia}">
        <feColorMatrix type="matrix"
          values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${K.tritanopia}">
        <feColorMatrix type="matrix"
          values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"/>
      </filter>
    </defs>
  `,document.body.appendChild(e),Le=e}function Fe(e){let t={critical:20,serious:10,moderate:5,minor:2},a=e.details.reduce((i,o)=>i+(t[o.severity]||0),0);return Math.max(0,Math.min(100,100-a))}var w={name:"yuktai-a11y",version:"4.0.0",observer:null,async execute(e){if(!e.enabled)return this.stopObserver(),"yuktai: disabled.";z=e,bt(e),gt(),yt(),ct(),dt(),e.showSkipLinks!==!1&&lt(),e.showPreferencePanel,mt(e);let t=this.applyFixes(e);t.score=Fe(t),e.showAuditBadge&&pt(t),e.timeoutWarning&&Ne(e.timeoutWarning),e.autoFix&&this.startObserver(e),e.plainEnglish&&await Pe(!0),e.summarisePage&&await ze(!0),e.translateLanguage&&e.translateLanguage!=="en"&&await Ie(e.translateLanguage),e.voiceControl&&await He(!0),e.smartLabels&&await $e(!0);let a=`${t.fixed} fixes applied. Score: ${t.score}/100.`;return p(a,t.score>=90?"success":"info",!1),`yuktai v4.0.0: ${a} Scanned ${t.scanned} elements in ${t.renderTime}ms.`},applyFixes(e){let t={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return t;let a=performance.now(),i=document.querySelectorAll("*");t.scanned=i.length;let o=(l,n,c,f)=>{t.details.push({tag:l,fix:n,severity:c,element:f.outerHTML.slice(0,100)}),t.fixed++};return i.forEach(l=>{let n=l,c=n.tagName.toLowerCase();if(c==="html"&&!n.getAttribute("lang")&&(n.setAttribute("lang","en"),o(c,'lang="en" added',"critical",n)),c==="meta"){let u=n.getAttribute("name"),x=n.getAttribute("content")||"";u==="viewport"&&x.includes("user-scalable=no")&&(n.setAttribute("content",x.replace("user-scalable=no","user-scalable=yes")),o(c,"user-scalable=yes restored","serious",n)),u==="viewport"&&/maximum-scale=1(?:[^0-9]|$)/.test(x)&&(n.setAttribute("content",x.replace(/maximum-scale=1(?=[^0-9]|$)/,"maximum-scale=5")),o(c,"maximum-scale=5 restored","serious",n))}if(c==="main"&&!n.getAttribute("tabindex")&&(n.setAttribute("tabindex","-1"),n.getAttribute("id")||n.setAttribute("id","main-content")),c==="img"&&(n.hasAttribute("alt")||(n.setAttribute("alt",""),n.setAttribute("aria-hidden","true"),o(c,'alt="" aria-hidden="true"',"serious",n))),c==="svg"&&(!n.getAttribute("aria-hidden")&&!n.getAttribute("aria-label")&&!l.querySelector("title")&&(n.setAttribute("aria-hidden","true"),o(c,'aria-hidden="true" (decorative svg)',"minor",n)),n.getAttribute("focusable")||n.setAttribute("focusable","false")),c==="iframe"&&!n.getAttribute("title")&&!n.getAttribute("aria-label")&&(n.setAttribute("title","embedded content"),n.setAttribute("aria-label","embedded content"),o(c,"title + aria-label added","serious",n)),c==="button"){if(!n.innerText?.trim()&&!n.getAttribute("aria-label")){let u=n.getAttribute("title")||"button";n.setAttribute("aria-label",u),o(c,`aria-label="${u}" (empty button)`,"critical",n)}n.hasAttribute("disabled")&&!n.getAttribute("aria-disabled")&&(n.setAttribute("aria-disabled","true"),t.fixed++)}if(c==="a"){let u=n;!n.innerText?.trim()&&!n.getAttribute("aria-label")&&(n.setAttribute("aria-label",n.getAttribute("title")||"link"),o(c,"aria-label added (empty link)","critical",n)),u.target==="_blank"&&!u.rel?.includes("noopener")&&(u.rel="noopener noreferrer",t.fixed++)}if(Re.has(c)){let u=n;if(!n.getAttribute("aria-label")&&!n.getAttribute("aria-labelledby")){let x=n.getAttribute("placeholder")||n.getAttribute("name")||c;n.setAttribute("aria-label",x),o(c,`aria-label="${x}"`,"serious",n)}if(n.hasAttribute("required")&&!n.getAttribute("aria-required")&&(n.setAttribute("aria-required","true"),t.fixed++),c==="input"&&!u.autocomplete){let x=u.name||"";u.type==="email"||x.includes("email")?u.autocomplete="email":u.type==="tel"||x.includes("tel")?u.autocomplete="tel":u.type==="password"&&(u.autocomplete="current-password"),t.fixed++}}c==="th"&&!n.getAttribute("scope")&&(n.setAttribute("scope",n.closest("thead")?"col":"row"),o(c,"scope added to <th>","moderate",n)),le[c]&&!n.getAttribute("role")&&(n.setAttribute("role",le[c]),o(c,`role="${le[c]}"`,"minor",n));let f=n.getAttribute("role")||"";f==="tab"&&!n.getAttribute("aria-selected")&&(n.setAttribute("aria-selected","false"),t.fixed++),["alert","status","log"].includes(f)&&!n.getAttribute("aria-live")&&(n.setAttribute("aria-live",f==="alert"?"assertive":"polite"),o(c,`aria-live added on role=${f}`,"moderate",n)),f==="combobox"&&!n.getAttribute("aria-expanded")&&(n.setAttribute("aria-expanded","false"),o(c,'aria-expanded="false" on combobox',"serious",n)),(f==="checkbox"||f==="radio")&&!n.getAttribute("aria-checked")&&(n.setAttribute("aria-checked","false"),o(c,`aria-checked="false" on role=${f}`,"serious",n))}),t.renderTime=parseFloat((performance.now()-a).toFixed(2)),t},scan(){let e={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return e;let t=performance.now(),a=document.querySelectorAll("*");e.scanned=a.length;let i=(o,l,n,c)=>e.details.push({tag:o,fix:l,severity:n,element:c.outerHTML.slice(0,100)});return a.forEach(o=>{let l=o,n=l.tagName.toLowerCase();(n==="a"||n==="button")&&!l.innerText?.trim()&&!l.getAttribute("aria-label")&&i(n,"needs aria-label (empty)","critical",l),n==="img"&&!l.hasAttribute("alt")&&i(n,"needs alt text","serious",l),Re.has(n)&&!l.getAttribute("aria-label")&&!l.getAttribute("aria-labelledby")&&i(n,"needs aria-label","serious",l),n==="iframe"&&!l.getAttribute("title")&&!l.getAttribute("aria-label")&&i(n,"iframe needs title","serious",l)}),e.fixed=e.details.length,e.score=Fe(e),e.renderTime=parseFloat((performance.now()-t).toFixed(2)),e},startObserver(e){this.observer||typeof document>"u"||(this.observer=new MutationObserver(()=>this.applyFixes(e)),this.observer.observe(document.body,{childList:!0,subtree:!0,attributes:!1}))},stopObserver(){this.observer?.disconnect(),this.observer=null},announce:p,speak:ce,showVisualAlert:We,trapFocus:U,handlePlainEnglish:Pe,handleSummarisePage:ze,handleTranslate:Ie,handleVoiceControl:He,handleSmartLabels:$e,SUPPORTED_LANGUAGES:G};var y=Ke(require("react"));var S=require("react");function xt(){return new Promise(e=>{let t=setTimeout(e,1500),a=new MutationObserver(()=>{clearTimeout(t),t=setTimeout(()=>{a.disconnect(),e()},500)});a.observe(document.body,{childList:!0,subtree:!0})})}function ht(){let e=[],t=document.querySelectorAll("*");for(let a of t){if(a.closest("[data-yuktai-panel]"))continue;let i=a.innerText?.trim();i&&i.length>30&&e.push(i);let o=a.getAttribute("aria-label");if(o&&o.length>10&&e.push(o),(a instanceof HTMLInputElement||a instanceof HTMLTextAreaElement)&&(a.placeholder&&e.push(a.placeholder),a.value&&e.push(a.value)),a instanceof HTMLButtonElement){let l=a.innerText||a.getAttribute("aria-label");l&&e.push(l)}}return e.join(" ").slice(0,3500)}async function de(e){if(!e.trim())return{success:!1,answer:"",error:"Please type a question."};try{let t=window,a=t.LanguageModel||t.ai?.languageModel;if(!a)return{success:!1,answer:"",error:"Gemini Nano not available."};await xt();let i=ht();if(!i||i.length<100)return{success:!1,answer:"",error:"Page content not readable."};let o;try{o=await a.create({systemPrompt:`Answer ONLY using page content.
Keep answer short (2\u20133 sentences).
If not found say: "I could not find that on this page."`,outputLanguage:"en"})}catch{o=await a.create()}let l=`Page:
${i}

Q: ${e}`,n=await o.prompt(l);return o?.destroy&&o.destroy(),{success:!0,answer:n?.trim()||"No answer found."}}catch(t){return{success:!1,answer:"",error:t instanceof Error?t.message:"Error occurred"}}}var r=require("react/jsx-runtime"),ue={highContrast:!1,reduceMotion:!1,autoFix:!0,dyslexiaFont:!1,fontScale:100,localFont:"",darkMode:!1,largeTargets:!1,speechEnabled:!1,colorBlindMode:"none",showAuditBadge:!1,timeoutWarning:void 0,plainEnglish:!1,summarisePage:!1,translateLanguage:"en",voiceControl:!1,smartLabels:!1},I=[80,90,100,110,120,130],wt=[{value:"none",label:"None"},{value:"deuteranopia",label:"Deuteranopia"},{value:"protanopia",label:"Protanopia"},{value:"tritanopia",label:"Tritanopia"},{value:"achromatopsia",label:"Greyscale"}],vt=["Prompt API for Gemini Nano","Summarization API for Gemini Nano","Writer API for Gemini Nano","Rewriter API for Gemini Nano","Translation API"];function kt(){let[e,t]=(0,S.useState)(typeof window<"u"?window.innerWidth:1024);return(0,S.useEffect)(()=>{let a=()=>t(window.innerWidth);return window.addEventListener("resize",a),()=>window.removeEventListener("resize",a)},[]),{isMobile:e<=480,isTablet:e>480&&e<=768}}function At({checked:e,onChange:t,label:a,disabled:i=!1}){return(0,r.jsxs)("label",{"aria-label":a,style:{position:"relative",display:"inline-flex",width:"40px",height:"24px",cursor:i?"not-allowed":"pointer",flexShrink:0,opacity:i?.4:1},children:[(0,r.jsx)("input",{type:"checkbox",checked:e,disabled:i,onChange:o=>t(o.target.checked),style:{opacity:0,width:0,height:0,position:"absolute"}}),(0,r.jsx)("span",{style:{position:"absolute",inset:0,borderRadius:"99px",background:e?"#0d9488":"#cbd5e1",transition:"background 0.2s"}}),(0,r.jsx)("span",{style:{position:"absolute",top:"3px",left:e?"19px":"3px",width:"18px",height:"18px",background:"#fff",borderRadius:"50%",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)",pointerEvents:"none"}})]})}function $({label:e,color:t="#64748b",badge:a}){return(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px",margin:"8px 18px 4px"},children:[(0,r.jsx)("p",{style:{margin:0,fontSize:"10px",fontWeight:600,color:t,letterSpacing:"0.06em",textTransform:"uppercase"},children:e}),a&&(0,r.jsx)("span",{style:{fontSize:"9px",fontWeight:500,padding:"1px 7px",borderRadius:"99px",background:"#f5f3ff",color:"#7c3aed",border:"0.5px solid #c4b5fd",whiteSpace:"nowrap"},children:a})]})}function A({icon:e,label:t,desc:a,checked:i,onChange:o,disabled:l=!1,disabledReason:n}){return(0,r.jsxs)("div",{title:l?n:void 0,style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 18px",gap:"12px"},children:[(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"10px",flex:1,minWidth:0},children:[(0,r.jsx)("span",{"aria-hidden":"true",style:{width:"30px",height:"30px",borderRadius:"8px",background:l?"#f1f5f9":"#f0fdfa",color:l?"#94a3b8":"#0d9488",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",flexShrink:0,fontWeight:700},children:e}),(0,r.jsxs)("div",{style:{minWidth:0},children:[(0,r.jsx)("p",{style:{margin:0,fontSize:"13px",fontWeight:500,color:l?"#94a3b8":"#0f172a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:t}),(0,r.jsx)("p",{style:{margin:0,fontSize:"11px",color:"#94a3b8"},children:l?n:a})]})]}),(0,r.jsx)(At,{checked:i,onChange:o,label:`Toggle ${t}`,disabled:l})]})}function h(){return(0,r.jsx)("div",{style:{height:"1px",background:"#f1f5f9",margin:"0"}})}var pe=(0,S.forwardRef)(({position:e,settings:t,report:a,isActive:i,aiSupported:o,voiceSupported:l,set:n,onApply:c,onReset:f,onClose:u},x)=>{let{isMobile:b,isTablet:X}=kt(),[N,Q]=(0,S.useState)([]),[v,H]=(0,S.useState)(""),[B,C]=(0,S.useState)(""),[T,M]=(0,S.useState)(!1);(0,S.useEffect)(()=>{(async()=>{try{let g=window;if(!g.queryLocalFonts)return;let O=await g.queryLocalFonts(),Z=[...new Set(O.map(Oe=>Oe.family))].sort();Q(Z.slice(0,50))}catch{}})()},[]);let d=b?{position:"fixed",bottom:0,left:0,right:0,zIndex:9999,background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px 16px 0 0",boxShadow:"0 -8px 32px rgba(0,0,0,0.12)",maxHeight:"90vh",overflowY:"auto",fontFamily:"system-ui,-apple-system,sans-serif",width:"100%"}:{position:"fixed",bottom:"84px",[e]:"24px",zIndex:9999,width:X?"300px":"320px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",maxHeight:"80vh",overflowY:"auto",fontFamily:"system-ui,-apple-system,sans-serif"};return(0,r.jsxs)("div",{ref:x,role:"dialog","aria-modal":"true","aria-label":"yuktai accessibility preferences","data-yuktai-panel":"true",style:d,children:[(0,r.jsxs)("div",{style:{padding:"14px 18px 12px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"flex-start",justifyContent:"space-between",position:"sticky",top:0,background:"#fff",zIndex:1},children:[(0,r.jsxs)("div",{children:[(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"7px",marginBottom:"5px",flexWrap:"wrap"},children:[(0,r.jsx)("span",{style:{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0d9488",letterSpacing:"0.05em",fontFamily:"monospace"},children:"@yuktishaalaa/yuktai v2.0.18"}),i&&(0,r.jsx)("span",{style:{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0f766e",border:"1px solid #99f6e4"},children:"\u25CF ACTIVE"})]}),(0,r.jsx)("p",{style:{margin:"0 0 2px",fontSize:"15px",fontWeight:600,color:"#0f172a"},children:"Accessibility"}),(0,r.jsx)("p",{style:{margin:0,fontSize:"12px",color:"#64748b"},children:"WCAG 2.2 \xB7 Open source \xB7 Zero cost"})]}),(0,r.jsx)("button",{onClick:u,"aria-label":"Close accessibility panel",style:{background:"none",border:"none",cursor:"pointer",padding:"4px",color:"#94a3b8",fontSize:"20px",lineHeight:1,borderRadius:"6px",flexShrink:0,minWidth:b?"44px":"auto",minHeight:b?"44px":"auto",display:"flex",alignItems:"center",justifyContent:"center"},children:"\xD7"})]}),(0,r.jsx)($,{label:"Core"}),(0,r.jsx)(A,{icon:"\u267F",label:"Auto-fix ARIA",desc:"Injects missing labels and roles",checked:t.autoFix,onChange:s=>n("autoFix",s)}),(0,r.jsx)(h,{}),(0,r.jsx)(A,{icon:"\u{1F50A}",label:"Speak on focus",desc:"Browser reads elements aloud",checked:t.speechEnabled,onChange:s=>n("speechEnabled",s)}),(0,r.jsx)(h,{}),(0,r.jsx)(A,{icon:"\u{1F399}",label:"Voice control",desc:"Navigate page by voice",checked:t.voiceControl,onChange:s=>n("voiceControl",s),disabled:!l,disabledReason:"Not supported in this browser"}),(0,r.jsx)(h,{}),(0,r.jsx)($,{label:"AI features",color:"#7c3aed",badge:"Gemini Nano \xB7 Chrome 127+"}),(0,r.jsx)("div",{style:{margin:"4px 18px 6px",padding:"8px 10px",background:"#f5f3ff",borderRadius:"8px",border:"0.5px solid #c4b5fd",fontSize:"10px",color:"#7c3aed",lineHeight:1.5},children:o?"Gemini Nano detected \u2014 AI features ready. Runs privately on your device. No data leaves your browser.":"AI features need setup \u2014 see guide below."}),!o&&(0,r.jsxs)("div",{style:{margin:"0 18px 8px",padding:"10px 12px",background:"#fafafa",borderRadius:"8px",border:"0.5px solid #e2e8f0",fontSize:"11px",color:"#475569",lineHeight:1.7},children:[(0,r.jsx)("p",{style:{margin:"0 0 6px",fontWeight:600,color:"#0f172a",fontSize:"11px"},children:"\u{1F6E0} How to enable AI features:"}),(0,r.jsxs)("p",{style:{margin:"0 0 3px"},children:["1. Open Chrome and go to"," ",(0,r.jsx)("code",{style:{background:"#f1f5f9",padding:"1px 5px",borderRadius:"4px",fontSize:"10px",color:"#0d9488",fontFamily:"monospace"},children:"chrome://flags"})]}),(0,r.jsxs)("p",{style:{margin:"0 0 3px"},children:["2. Search and set each to ",(0,r.jsx)("strong",{style:{color:"#0f172a"},children:"Enabled:"})]}),(0,r.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"2px",margin:"4px 0 6px 10px"},children:vt.map(s=>(0,r.jsxs)("span",{style:{fontSize:"10px",color:"#7c3aed",fontFamily:"monospace"},children:["\u2192 ",s]},s))}),(0,r.jsxs)("p",{style:{margin:"0 0 3px"},children:["3. Click ",(0,r.jsx)("strong",{style:{color:"#0f172a"},children:"Relaunch"})," when Chrome prompts you"]}),(0,r.jsxs)("p",{style:{margin:"0 0 3px"},children:["4. Go to"," ",(0,r.jsx)("code",{style:{background:"#f1f5f9",padding:"1px 5px",borderRadius:"4px",fontSize:"10px",color:"#0d9488",fontFamily:"monospace"},children:"chrome://components"})]}),(0,r.jsxs)("p",{style:{margin:"0 0 3px 10px"},children:["\u2192 Find ",(0,r.jsx)("strong",{style:{color:"#0f172a"},children:"Optimization Guide On Device Model"})]}),(0,r.jsxs)("p",{style:{margin:"0 0 6px 10px"},children:["\u2192 Click ",(0,r.jsx)("strong",{style:{color:"#0f172a"},children:"Check for update"})," and wait for download"]}),(0,r.jsx)("p",{style:{margin:"0"},children:"5. Refresh this page \u2014 AI features will unlock automatically"})]}),(0,r.jsx)(A,{icon:"\u{1F4DD}",label:"Plain English mode",desc:"Simplifies complex page text",checked:t.plainEnglish,onChange:s=>n("plainEnglish",s),disabled:!o,disabledReason:"Enable Gemini Nano \u2014 see setup guide above"}),(0,r.jsx)(h,{}),(0,r.jsx)(A,{icon:"\u{1F4CB}",label:"Summarise page",desc:"3-sentence summary at top",checked:t.summarisePage,onChange:s=>n("summarisePage",s),disabled:!o,disabledReason:"Enable Gemini Nano \u2014 see setup guide above"}),(0,r.jsx)(h,{}),(0,r.jsx)(A,{icon:"\u{1F3F7}",label:"Smart aria-labels",desc:"AI generates meaningful labels",checked:t.smartLabels,onChange:s=>n("smartLabels",s),disabled:!o,disabledReason:"Enable Gemini Nano \u2014 see setup guide above"}),(0,r.jsx)(h,{}),(0,r.jsx)($,{label:"Visual"}),(0,r.jsx)(A,{icon:"\u25D1",label:"High contrast",desc:"Boosts contrast for low vision",checked:t.highContrast,onChange:s=>n("highContrast",s)}),(0,r.jsx)(h,{}),(0,r.jsx)(A,{icon:"\u{1F319}",label:"Dark mode",desc:"Inverts colours",checked:t.darkMode,onChange:s=>n("darkMode",s)}),(0,r.jsx)(h,{}),(0,r.jsx)(A,{icon:"\u23F8",label:"Reduce motion",desc:"Disables animations",checked:t.reduceMotion,onChange:s=>n("reduceMotion",s)}),(0,r.jsx)(h,{}),(0,r.jsx)(A,{icon:"\u{1F446}",label:"Large targets",desc:"44\xD744px minimum touch targets",checked:t.largeTargets,onChange:s=>n("largeTargets",s)}),(0,r.jsx)(h,{}),(0,r.jsxs)("div",{style:{padding:"10px 18px"},children:[(0,r.jsx)("p",{style:{margin:"0 0 8px",fontSize:"13px",fontWeight:500,color:"#0f172a"},children:"\u{1F3A8} Colour blindness"}),(0,r.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"},children:wt.map(s=>(0,r.jsx)("button",{onClick:()=>n("colorBlindMode",s.value),"aria-pressed":t.colorBlindMode===s.value,style:{padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500,border:`1px solid ${t.colorBlindMode===s.value?"#0d9488":"#e2e8f0"}`,background:t.colorBlindMode===s.value?"#f0fdfa":"#fff",color:t.colorBlindMode===s.value?"#0d9488":"#64748b",cursor:"pointer",minHeight:b?"36px":"auto"},children:s.label},s.value))})]}),(0,r.jsx)(h,{}),(0,r.jsx)($,{label:"Font"}),(0,r.jsx)(A,{icon:"Aa",label:"Dyslexia-friendly font",desc:"Atkinson Hyperlegible",checked:t.dyslexiaFont,onChange:s=>n("dyslexiaFont",s)}),(0,r.jsx)(h,{}),(0,r.jsxs)("div",{style:{padding:"10px 18px"},children:[(0,r.jsx)("p",{style:{margin:"0 0 8px",fontSize:"13px",fontWeight:500,color:"#0f172a"},children:"\u{1F524} Local font"}),N.length>0?(0,r.jsxs)("select",{value:t.localFont,onChange:s=>n("localFont",s.target.value),"aria-label":"Choose a font from your device",style:{width:"100%",padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"13px",color:"#0f172a",background:"#fff",cursor:"pointer",height:b?"44px":"36px"},children:[(0,r.jsx)("option",{value:"",children:"System default"}),N.map(s=>(0,r.jsx)("option",{value:s,style:{fontFamily:s},children:s},s))]}):(0,r.jsx)("p",{style:{margin:0,fontSize:"11px",color:"#94a3b8"},children:"Local font access available in Chrome 103+. Allow font access when prompted."})]}),(0,r.jsx)(h,{}),(0,r.jsxs)("div",{style:{padding:"10px 18px 14px"},children:[(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"10px"},children:[(0,r.jsx)("p",{style:{margin:0,fontSize:"13px",fontWeight:500,color:"#0f172a"},children:"Text size"}),(0,r.jsxs)("span",{style:{fontSize:"12px",fontWeight:600,color:"#0d9488",background:"#f0fdfa",padding:"2px 8px",borderRadius:"99px"},children:[t.fontScale,"%"]})]}),(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[(0,r.jsx)("button",{onClick:()=>{let s=I.indexOf(t.fontScale);s>0&&n("fontScale",I[s-1])},disabled:t.fontScale<=80,"aria-label":"Decrease text size",style:{width:b?"44px":"30px",height:b?"44px":"30px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:t.fontScale<=80?"not-allowed":"pointer",fontSize:"16px",color:t.fontScale<=80?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"\u2212"}),(0,r.jsx)("div",{style:{flex:1,display:"flex",gap:"3px"},children:I.map(s=>(0,r.jsx)("button",{onClick:()=>n("fontScale",s),"aria-label":`Set text size to ${s}%`,style:{flex:1,height:"6px",borderRadius:"99px",border:"none",cursor:"pointer",padding:0,background:s<=t.fontScale?"#0d9488":"#e2e8f0",transition:"background 0.15s"}},s))}),(0,r.jsx)("button",{onClick:()=>{let s=I.indexOf(t.fontScale);s<I.length-1&&n("fontScale",I[s+1])},disabled:t.fontScale>=130,"aria-label":"Increase text size",style:{width:b?"44px":"30px",height:b?"44px":"30px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:t.fontScale>=130?"not-allowed":"pointer",fontSize:"16px",color:t.fontScale>=130?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"+"})]})]}),(0,r.jsx)(h,{}),(0,r.jsxs)("div",{style:{padding:"10px 18px"},children:[(0,r.jsxs)("p",{style:{margin:"0 0 8px",fontSize:"13px",fontWeight:500,color:"#0f172a"},children:["\u{1F310} Translate page"," ",(0,r.jsx)("span",{style:{marginLeft:"6px",fontSize:"9px",fontWeight:500,padding:"1px 6px",borderRadius:"99px",background:"#f5f3ff",color:"#7c3aed",border:"0.5px solid #c4b5fd"},children:"Gemini Nano"})]}),(0,r.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"},children:G.slice(0,b?8:18).map(s=>(0,r.jsx)("button",{onClick:()=>n("translateLanguage",s.code),"aria-pressed":t.translateLanguage===s.code,disabled:!o,style:{padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500,border:`1px solid ${t.translateLanguage===s.code?"#7c3aed":"#e2e8f0"}`,background:t.translateLanguage===s.code?"#f5f3ff":"#fff",color:t.translateLanguage===s.code?"#7c3aed":"#64748b",cursor:o?"pointer":"not-allowed",opacity:o?1:.5,minHeight:b?"36px":"auto"},children:s.code.toUpperCase()},s.code))}),!o&&(0,r.jsx)("p",{style:{margin:"6px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Enable Gemini Nano using the setup guide above to unlock translation."})]}),(0,r.jsx)(h,{}),(0,r.jsx)($,{label:"Ask this page",color:"#0d9488",badge:"Gemini Nano"}),(0,r.jsxs)("div",{style:{padding:"10px 18px 14px"},children:[(0,r.jsx)("p",{style:{margin:"0 0 8px",fontSize:"11px",color:"#64748b"},children:"Ask any question \u2014 answered from this page. On device. Zero cost."}),(0,r.jsxs)("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[(0,r.jsx)("input",{type:"text",value:v,onChange:s=>H(s.target.value),onKeyDown:s=>{s.key==="Enter"&&!T&&(M(!0),C(""),de(v).then(g=>{C(g.answer||g.error||""),M(!1)}))},placeholder:"e.g. Am I eligible for this?",disabled:!o||T,"aria-label":"Ask a question about this page",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:o?"#fff":"#f8fafc",outline:"none",height:b?"44px":"36px"}}),(0,r.jsx)("button",{onClick:()=>{!v.trim()||T||!o||(M(!0),C(""),de(v).then(s=>{C(s.answer||s.error||""),M(!1)}))},disabled:!o||T||!v.trim(),"aria-label":"Ask question about this page",style:{padding:"8px 14px",borderRadius:"8px",border:"none",background:o&&v.trim()&&!T?"#0d9488":"#e2e8f0",color:o&&v.trim()&&!T?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:o&&v.trim()&&!T?"pointer":"not-allowed",flexShrink:0,height:b?"44px":"36px",minWidth:"52px",transition:"background 0.2s"},children:T?"...":"Ask"})]}),B&&(0,r.jsxs)("div",{role:"status","aria-live":"polite",style:{padding:"10px 12px",background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"8px",fontSize:"12px",color:"#0f766e",lineHeight:1.6},children:[(0,r.jsx)("strong",{style:{display:"block",marginBottom:"4px",fontSize:"11px",color:"#0d9488"},children:"\u{1F4AC} Answer"}),B,(0,r.jsx)("button",{onClick:()=>{C(""),H("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]}),!o&&(0,r.jsx)("p",{style:{margin:"4px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Enable Gemini Nano using the setup guide above to unlock this."})]}),a&&(0,r.jsx)("div",{role:"status",style:{margin:"0 14px",padding:"8px 12px",background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"8px",fontSize:"12px",color:"#0f766e",fontWeight:500,fontFamily:"monospace"},children:a.fixed>0?`\u2713 ${a.fixed} fixes \xB7 ${a.scanned} nodes \xB7 ${a.renderTime}ms \xB7 Score: ${a.score}/100`:`\u2713 0 auto-fixes needed \xB7 ${a.scanned} nodes \xB7 ${a.renderTime}ms`}),(0,r.jsxs)("div",{style:{display:"flex",gap:"8px",padding:"12px 14px 14px",position:b?"sticky":"relative",bottom:b?0:"auto",background:"#fff",borderTop:"1px solid #f1f5f9"},children:[(0,r.jsx)("button",{onClick:f,style:{flex:1,padding:b?"12px 0":"8px 0",fontSize:"13px",fontWeight:500,borderRadius:"9px",border:"1px solid #e2e8f0",background:"#fff",color:"#64748b",cursor:"pointer"},children:"Reset"}),(0,r.jsx)("button",{onClick:c,style:{flex:2,padding:b?"12px 0":"8px 0",fontSize:"13px",fontWeight:600,borderRadius:"9px",border:"none",background:"#0d9488",color:"#fff",cursor:"pointer"},children:"Apply settings"})]})]})});pe.displayName="WidgetPanel";var L=require("react/jsx-runtime");async function St(){try{if(typeof window>"u")return!1;let e=window;if(e.LanguageModel)try{if(typeof e.LanguageModel.availability=="function"){let a=await e.LanguageModel.availability();if(console.log("yuktai: LanguageModel.availability() =",a),a==="readily"||a==="available"||a==="downloadable")return!0}else return!0}catch{}if(e.Summarizer)try{if(typeof e.Summarizer.availability=="function"){let a=await e.Summarizer.availability();if(a==="readily"||a==="available")return!0}else return!0}catch{}if(e.Rewriter)try{if(typeof e.Rewriter.availability=="function"){let a=await e.Rewriter.availability();if(a==="readily"||a==="available")return!0}else return!0}catch{}if(e.Writer)try{if(typeof e.Writer.availability=="function"){let a=await e.Writer.availability();if(a==="readily"||a==="available")return!0}else return!0}catch{}let t=e.ai||globalThis.ai;if(t){if(t.languageModel?.availability)try{let a=await t.languageModel.availability();if(a==="readily"||a==="downloadable"||a==="available")return!0}catch{}if(t.languageModel?.capabilities)try{let a=await t.languageModel.capabilities();if(a?.available==="readily"||a?.available==="after-download")return!0}catch{}if(t.languageModel&&typeof t.languageModel.create=="function")return!0;if(t.summarizer?.capabilities)try{if((await t.summarizer.capabilities())?.available!=="no")return!0}catch{}if(t.rewriter?.capabilities)try{if((await t.rewriter.capabilities())?.available!=="no")return!0}catch{}if(t.writer?.capabilities)try{if((await t.writer.capabilities())?.available!=="no")return!0}catch{}if(t.summarizer||t.rewriter||t.writer||t.languageModel)return!0}return!!(e.Translator||e.translation?.canTranslate)}catch{return!1}}function J({position:e="left",children:t,config:a={}}){let[i,o]=(0,y.useState)(!1),[l,n]=(0,y.useState)(ue),[c,f]=(0,y.useState)(null),[u,x]=(0,y.useState)(!1),[b,X]=(0,y.useState)(!1),[N,Q]=(0,y.useState)(!1),v=y.default.useRef(null);(0,y.useEffect)(()=>{if(typeof window>"u")return;let s=setTimeout(async()=>{let g=window;console.log("yuktai: Checking AI APIs..."),console.log("yuktai: window.ai =",g.ai),console.log("yuktai: window.LanguageModel =",g.LanguageModel),console.log("yuktai: window.Summarizer =",g.Summarizer),console.log("yuktai: window.Rewriter =",g.Rewriter),console.log("yuktai: window.Writer =",g.Writer);let O=await St();X(O),O?console.log("yuktai: Chrome Built-in AI detected \u2705"):(console.log("yuktai: Chrome Built-in AI not detected \u274C"),console.log("yuktai: Enable flags at chrome://flags and download model at chrome://components"));let Z=!!(g.SpeechRecognition||g.webkitSpeechRecognition);Q(Z)},800);return()=>clearTimeout(s)},[]),(0,y.useEffect)(()=>{if(!(typeof window>"u"))try{let d=localStorage.getItem("yuktai-a11y-prefs");if(d){let s=JSON.parse(d);n(g=>({...g,...s}))}}catch{}},[]);let H=(0,y.useCallback)(async d=>{let s={enabled:!0,highContrast:d.highContrast,darkMode:d.darkMode,reduceMotion:d.reduceMotion,largeTargets:d.largeTargets,speechEnabled:d.speechEnabled,autoFix:d.autoFix,dyslexiaFont:d.dyslexiaFont,localFont:d.localFont,fontSizeMultiplier:d.fontScale/100,colorBlindMode:d.colorBlindMode,showAuditBadge:d.showAuditBadge,showSkipLinks:!0,showPreferencePanel:!1,plainEnglish:d.plainEnglish,summarisePage:d.summarisePage,translateLanguage:d.translateLanguage,voiceControl:d.voiceControl,smartLabels:d.smartLabels,...a};await w.execute(s);let g=w.applyFixes(s);f(g),x(!0)},[a]),B=(0,y.useCallback)(async()=>{try{localStorage.setItem("yuktai-a11y-prefs",JSON.stringify(l))}catch{}await H(l),o(!1)},[l,H]),C=(0,y.useCallback)(()=>{n(ue);try{localStorage.removeItem("yuktai-a11y-prefs")}catch{}let d=document.documentElement;["data-yuktai-high-contrast","data-yuktai-dark","data-yuktai-reduce-motion","data-yuktai-large-targets","data-yuktai-keyboard","data-yuktai-dyslexia"].forEach(s=>d.removeAttribute(s)),document.body.style.filter="",document.body.style.fontFamily="",document.documentElement.style.fontSize="",f(null),x(!1)},[]),T=(0,y.useCallback)((d,s)=>{n(g=>({...g,[d]:s}))},[]);(0,y.useEffect)(()=>{let d=s=>{s.key==="Escape"&&i&&o(!1)};return window.addEventListener("keydown",d),()=>window.removeEventListener("keydown",d)},[i]),(0,y.useEffect)(()=>{i&&v.current&&w.trapFocus(v.current)},[i]);let M={position:"fixed",bottom:"24px",[e]:"24px",zIndex:9998,width:"52px",height:"52px",borderRadius:"50%",background:u?"#0d9488":"#1a73e8",color:"#fff",border:"none",cursor:"pointer",fontSize:"22px",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,0,0,0.25)",transition:"transform 0.15s, background 0.2s"};return(0,L.jsxs)(L.Fragment,{children:[t,(0,L.jsx)("button",{style:M,"aria-label":"Open accessibility preferences","aria-haspopup":"dialog","aria-expanded":i,"data-yuktai-pref-toggle":"true",onClick:()=>o(d=>!d),onMouseEnter:d=>{d.currentTarget.style.transform="scale(1.08)"},onMouseLeave:d=>{d.currentTarget.style.transform="scale(1)"},children:"\u267F"}),i&&(0,L.jsx)(pe,{ref:v,position:e,settings:l,report:c,isActive:u,aiSupported:b,voiceSupported:N,set:T,onApply:B,onReset:C,onClose:()=>o(!1)})]})}var F={name:"ai.text",async execute(e){return`\u{1F916} YuktAI says: ${e}`}};var W={name:"voice.text",async execute(e){return!e||e.trim()===""?"\u{1F3A4} No speech detected":`\u{1F3A4} You said: ${e}`}};var E=class{plugins=new Map;register(t,a){if(!a||typeof a.execute!="function")throw new Error(`Invalid plugin: ${t}`);this.plugins.set(t,a)}use(t){return this.plugins.get(t)}async run(t,a){try{let i=this.use(t);if(!i)throw new Error(`Plugin not found: ${t}`);return await i.execute(a)}catch(i){throw console.error(`[YuktAI Runtime Error in ${t}]:`,i),i}}getPlugins(){return Array.from(this.plugins.keys())}};function Tt(){if(typeof globalThis>"u")return new E;if(!globalThis.__yuktai_runtime__){let e=new E;e.register(w.name,w),e.register(F.name,F),e.register(W.name,W),globalThis.__yuktai_runtime__=e}return globalThis.__yuktai_runtime__}var Be=typeof window<"u"?Tt():new E,Et={wcagPlugin:w,list(){return Be.getPlugins()},use(e){return Be.use(e)},fix(e){return w.applyFixes({enabled:!0,autoFix:!0,...e})},scan(){return w.scan()}};0&&(module.exports={Runtime,YuktAI,YuktAIWrapper,aiPlugin,voicePlugin,wcag,wcagPlugin});
