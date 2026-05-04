import{a as ze}from"./chunk-3VGU4YGK.mjs";import{a as He,b as te,c as ae}from"./chunk-VYW2VAGT.mjs";function We(){let e=window;return e.Rewriter||e.ai?.rewriter||null}async function xe(){try{let e=We();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}async function ct(e){if(!e||e.trim().length<20)return{success:!1,original:e,rewritten:e,error:"Text too short"};try{let t=We();if(!t)throw new Error("Rewriter API not available");let a=await t.create({tone:"more-casual",format:"plain-text",length:"as-is",outputLanguage:"en"}),i=await a.rewrite(e,{context:"Rewrite this text in simple plain English. Use short sentences. Avoid jargon. Make it easy to understand for everyone."});return a.destroy(),{success:!0,original:e,rewritten:i.trim()}}catch(t){return{success:!1,original:e,rewritten:e,error:t instanceof Error?t.message:"Rewrite failed"}}}async function $e(){if(!await xe())return{fixed:0,error:"Chrome Built-in AI Rewriter not available. Enable via chrome://flags."};let t=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption"),a=0;for(let i of t){let n=i.innerText?.trim();if(!n||n.length<20||i.closest("[data-yuktai-panel]"))continue;let l=await ct(n);l.success&&l.rewritten!==n&&(i.dataset.yuktaiOriginal=n,i.innerText=l.rewritten,a++)}return{fixed:a}}function Fe(){let e=document.querySelectorAll("[data-yuktai-original]");for(let t of e){let a=t.dataset.yuktaiOriginal;a&&(t.innerText=a,delete t.dataset.yuktaiOriginal)}}var Be="yuktai-summary-box";function Ne(){let e=window;return e.Summarizer||e.ai?.summarizer||null}async function he(){try{let e=Ne();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}function ut(){let e=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, article, section"),t=[];for(let a of e){if(a.closest("[data-yuktai-panel]"))continue;let i=window.getComputedStyle(a);if(i.display==="none"||i.visibility==="hidden")continue;let n=a.innerText?.trim();n&&n.length>10&&t.push(n)}return t.join(" ").slice(0,5e3)}async function Oe(){if(!await he())return{success:!1,summary:"",error:"Chrome Built-in AI Summarizer not available. Enable via chrome://flags."};let t=ut();if(!t||t.length<100)return{success:!1,summary:"",error:"Not enough text on this page to summarise."};try{let a=Ne();if(!a)throw new Error("Summarizer API not available");let i=await a.create({type:"tl;dr",format:"plain-text",length:"short",outputLanguage:"en"}),n=await i.summarize(t,{context:"Summarise this page in 2-3 simple sentences for a screen reader user who wants to know if this page is relevant to them."});return i.destroy(),pt(n.trim()),{success:!0,summary:n.trim()}}catch(a){return{success:!1,summary:"",error:a instanceof Error?a.message:"Summary failed"}}}function pt(e){oe();let t=document.createElement("div");t.id=Be,t.setAttribute("data-yuktai-panel","true"),t.setAttribute("role","region"),t.setAttribute("aria-label","Page summary by yuktai"),t.style.cssText=`
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
  `,i.addEventListener("click",oe),t.appendChild(a),t.appendChild(i),document.body.prepend(t)}function oe(){let e=document.getElementById(Be);e&&e.remove()}var ie=[{code:"en",label:"English"},{code:"hi",label:"Hindi"},{code:"es",label:"Spanish"},{code:"fr",label:"French"},{code:"de",label:"German"},{code:"it",label:"Italian"},{code:"pt",label:"Portuguese"},{code:"nl",label:"Dutch"},{code:"pl",label:"Polish"},{code:"ru",label:"Russian"},{code:"ja",label:"Japanese"},{code:"ko",label:"Korean"},{code:"zh",label:"Chinese"},{code:"ar",label:"Arabic"},{code:"tr",label:"Turkish"},{code:"vi",label:"Vietnamese"},{code:"bn",label:"Bengali"},{code:"id",label:"Indonesian"}],ne="en";function ft(){let e=window;return e.Translator||e.translation||null}async function mt(e){try{let t=window;if(!ft())return!1;if(t.Translator&&typeof t.Translator.availability=="function")try{let i=await t.Translator.availability({sourceLanguage:"en",targetLanguage:e});return i==="readily"||i==="available"||i==="downloadable"||i==="after-download"}catch{}return t.Translator&&typeof t.Translator.canTranslate=="function"?await t.Translator.canTranslate({sourceLanguage:"en",targetLanguage:e})!=="no":t.translation&&typeof t.translation.canTranslate=="function"?await t.translation.canTranslate({sourceLanguage:"en",targetLanguage:e})!=="no":!1}catch{return!1}}async function gt(e){let t=window,a={sourceLanguage:"en",targetLanguage:e};if(t.Translator&&typeof t.Translator.create=="function")return await t.Translator.create(a);if(t.translation&&typeof t.translation.createTranslator=="function")return await t.translation.createTranslator(a);throw new Error("Translation API not available")}async function De(e){if(e===ne)return{success:!0,language:e,fixed:0};if(e==="en")return we(),ne="en",{success:!0,language:"en",fixed:0};if(!await mt(e))return{success:!1,language:e,fixed:0,error:`Translation to ${e} not available. Enable via chrome://flags.`};try{let a=await gt(e),i=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption, span, a"),n=0;for(let l of i){if(l.closest("[data-yuktai-panel]")||l.children.length>0)continue;let o=l.innerText?.trim();if(!o||o.length<2)continue;l.dataset.yuktaiTranslationOriginal||(l.dataset.yuktaiTranslationOriginal=o);let d=await a.translate(o);d&&d!==o&&(l.innerText=d,n++)}return typeof a.destroy=="function"&&a.destroy(),ne=e,{success:!0,language:e,fixed:n}}catch(a){return{success:!1,language:e,fixed:0,error:a instanceof Error?a.message:"Translation failed"}}}function we(){let e=document.querySelectorAll("[data-yuktai-translation-original]");for(let t of e){let a=t.dataset.yuktaiTranslationOriginal;a&&(t.innerText=a,delete t.dataset.yuktaiTranslationOriginal)}ne="en"}var bt=[{phrases:["go to main","skip to main","main content"],action:"focus-main",label:"Jump to main content"},{phrases:["go to navigation","go to nav","open menu"],action:"focus-nav",label:"Jump to navigation"},{phrases:["go to search","search","find"],action:"focus-search",label:"Jump to search"},{phrases:["scroll down","page down","next"],action:"scroll-down",label:"Scroll down"},{phrases:["scroll up","page up","back up"],action:"scroll-up",label:"Scroll up"},{phrases:["go back","previous page"],action:"go-back",label:"Go back"},{phrases:["click","press","select"],action:"click-focused",label:"Click focused element"},{phrases:["next item","tab forward","tab"],action:"tab-forward",label:"Move to next element"},{phrases:["previous item","tab back","shift tab"],action:"tab-back",label:"Move to previous element"},{phrases:["stop listening","stop voice","quiet"],action:"stop-voice",label:"Stop voice control"}],E=null,re=!1,N=null;function ve(){return!!(window.SpeechRecognition||window.webkitSpeechRecognition)}function yt(e){let t=e.toLowerCase().trim();for(let a of bt)for(let i of a.phrases)if(t.includes(i))return{action:a.action,label:a.label};return null}function xt(e){switch(e){case"focus-main":{let t=document.querySelector("main, [role='main'], #main");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-nav":{let t=document.querySelector("nav, [role='navigation']");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-search":{let t=document.querySelector("input[type='search'], input[role='searchbox'], [aria-label*='search' i]");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"scroll-down":{window.scrollBy({top:400,behavior:"smooth"});break}case"scroll-up":{window.scrollBy({top:-400,behavior:"smooth"});break}case"go-back":{window.history.back();break}case"click-focused":{let t=document.activeElement;t&&t!==document.body&&t.click();break}case"tab-forward":{let t=Ge(),a=t.indexOf(document.activeElement),i=t[a+1]||t[0];i&&i.focus();break}case"tab-back":{let t=Ge(),a=t.indexOf(document.activeElement),i=t[a-1]||t[t.length-1];i&&i.focus();break}case"stop-voice":{ke();break}}}function Ge(){return Array.from(document.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(e=>!e.closest("[data-yuktai-panel]"))}function _e(e){if(!ve())return!1;if(re)return!0;e&&(N=e);let t=window.SpeechRecognition||window.webkitSpeechRecognition;return E=new t,E.continuous=!0,E.interimResults=!1,E.lang="en-US",E.onresult=a=>{let i=a.results[a.results.length-1][0].transcript,n=yt(i);if(n){xt(n.action);let l={success:!0,command:i,action:n.label};if(N&&N(l),n.action==="stop-voice")return}},E.onend=()=>{re&&E?.start()},E.onerror=a=>{a.error!=="no-speech"&&N&&N({success:!1,command:"",action:"",error:`Voice error: ${a.error}`})},E.start(),re=!0,ht(),!0}function ke(){re=!1,E&&(E.stop(),E=null),N=null,Ve()}var qe="yuktai-voice-indicator";function ht(){Ve();let e=document.createElement("div");e.id=qe,e.setAttribute("data-yuktai-panel","true"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-label","yuktai voice control is listening"),e.style.cssText=`
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
    `,document.head.appendChild(i)}let a=document.createElement("span");a.textContent="Listening for commands...",e.appendChild(t),e.appendChild(a),document.body.appendChild(e)}function Ve(){let e=document.getElementById(qe);e&&e.remove()}var wt=["button:not([aria-label]):not([aria-labelledby])","a:not([aria-label]):not([aria-labelledby])","input:not([aria-label]):not([aria-labelledby]):not([id])","select:not([aria-label]):not([aria-labelledby])","textarea:not([aria-label]):not([aria-labelledby])","[role='button']:not([aria-label])","[role='link']:not([aria-label])","[role='checkbox']:not([aria-label])","[role='tab']:not([aria-label])"].join(", ");function je(){let e=window;return e.Writer||e.ai?.writer||null}async function Ae(){try{let e=je();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}function vt(e){let t=[],a=e.innerText?.trim();a&&t.push(`element text: "${a}"`);let i=e.placeholder?.trim();i&&t.push(`placeholder: "${i}"`);let n=e.getAttribute("name")?.trim();n&&t.push(`name: "${n}"`);let l=e.getAttribute("type")?.trim();l&&t.push(`type: "${l}"`);let o=e.id;if(o){let u=document.querySelector(`label[for="${o}"]`);u&&t.push(`label: "${u.innerText?.trim()}"`)}let d=e.parentElement?.innerText?.trim().slice(0,60);d&&t.push(`parent context: "${d}"`),t.push(`tag: ${e.tagName.toLowerCase()}`);let g=e.getAttribute("role");return g&&t.push(`role: ${g}`),t.join(". ")}async function kt(e,t){let a=`
    Generate a short, clear aria-label for an HTML element.
    The label must be 2-6 words maximum.
    The label must describe what the element does or what it is.
    Do not include punctuation.
    Do not explain \u2014 just output the label text only.

    Element details:
    ${t}

    Output only the label. Nothing else.
  `.trim();return(await e.write(a)).trim().replace(/^["']|["']$/g,"").replace(/\.$/,"").trim()}async function Ke(){if(!await Ae())return{success:!1,fixed:0,elements:[],error:"Chrome Built-in AI Writer not available. Enable via chrome://flags."};let t=document.querySelectorAll(wt);if(t.length===0)return{success:!0,fixed:0,elements:[]};try{let a=je();if(!a)throw new Error("Writer API not available");let i=await a.create({tone:"neutral",format:"plain-text",length:"short",outputLanguage:"en"}),n=0,l=[];for(let o of t){if(o.closest("[data-yuktai-panel]"))continue;let d=window.getComputedStyle(o);if(d.display==="none"||d.visibility==="hidden")continue;let g=vt(o),u=await kt(i,g);u&&u.length>0&&(o.dataset.yuktaiLabelOriginal=o.getAttribute("aria-label")||"",o.setAttribute("aria-label",u),n++,l.push({tag:o.tagName.toLowerCase(),label:u}))}return i.destroy(),{success:!0,fixed:n,elements:l}}catch(a){return{success:!1,fixed:0,elements:[],error:a instanceof Error?a.message:"Label generation failed"}}}function Ye(){let e=document.querySelectorAll("[data-yuktai-label-original]");for(let t of e){let a=t.dataset.yuktaiLabelOriginal;a?t.setAttribute("aria-label",a):t.removeAttribute("aria-label"),delete t.dataset.yuktaiLabelOriginal}}var de=null,Ue=null;var Je=null,Se=null,y=null,O=null,se=null,Te=null,D=null,le={deuteranopia:"yuktai-cb-d",protanopia:"yuktai-cb-p",tritanopia:"yuktai-cb-t"};var Xe=new Set(["input","select","textarea"]);var Ee={nav:"navigation",header:"banner",footer:"contentinfo",main:"main",aside:"complementary"};function Ce(e,t="polite"){if(typeof window>"u"||!D?.speechEnabled||!window.speechSynthesis)return;window.speechSynthesis.cancel();let a=new SpeechSynthesisUtterance(e);a.rate=1,a.pitch=1,a.volume=1;let i=window.speechSynthesis.getVoices();i.length>0&&(a.voice=i[0]),window.speechSynthesis.speak(a)}function nt(e,t="info"){if(typeof document>"u")return;let i={success:{bg:"#0f9d58",border:"#0a7a44",icon:"\u2713"},error:{bg:"#d93025",border:"#b52a1c",icon:"\u2715"},warning:{bg:"#f29900",border:"#c67c00",icon:"\u26A0"},info:{bg:"#1a73e8",border:"#1557b0",icon:"\u2139"}}[t];y||(y=document.createElement("div"),y.setAttribute("role","alert"),y.setAttribute("aria-live","assertive"),y.setAttribute("aria-atomic","true"),y.style.cssText=`
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
    `,document.body.appendChild(y)),y.style.background=i.bg,y.style.border=`1px solid ${i.border}`,y.style.color="#fff",y.innerHTML=`
    <span style="font-size:18px;font-weight:700">${i.icon}</span>
    <span style="flex:1;line-height:1.4">${e}</span>
    <button
      onclick="this.parentElement.style.transform='translateX(120%)';this.parentElement.style.opacity='0'"
      style="background:none;border:none;color:#fff;cursor:pointer;font-size:18px;padding:0;line-height:1"
      aria-label="Close notification">\xD7</button>
  `,window.innerWidth<=480&&(y.style.right="8px",y.style.left="8px",y.style.maxWidth="none",y.style.width="auto"),requestAnimationFrame(()=>{y&&(y.style.transform="translateX(0)",y.style.opacity="1")}),setTimeout(()=>{y&&(y.style.transform="translateX(120%)",y.style.opacity="0")},5e3)}function m(e,t="info",a=!0){de&&(de.textContent=e),nt(e,t),a&&Ce(e,t==="error"?"assertive":"polite")}function At(){if(typeof document>"u"||Je)return;let e=[{label:"Skip to main content",selector:"main,[role='main'],#main,#main-content"},{label:"Skip to navigation",selector:"nav,[role='navigation'],#nav,#navigation"},{label:"Skip to search",selector:"[role='search'],#search,input[type='search']"}],t=document.createElement("div");t.setAttribute("data-yuktai-skip-bar","true"),t.setAttribute("role","navigation"),t.setAttribute("aria-label","Skip links"),t.style.cssText=`
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
  `;let a=!1;if(e.forEach(({label:n,selector:l})=>{let o=document.querySelector(l);if(!o)return;a=!0,o.getAttribute("tabindex")||o.setAttribute("tabindex","-1");let d=document.createElement("a");d.href="#",d.textContent=n,d.style.cssText=`
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
    `,d.addEventListener("focus",()=>{t.style.transform="translateY(0)"}),d.addEventListener("blur",()=>{setTimeout(()=>{t.matches(":focus-within")||(t.style.transform="translateY(-100%)")},2e3)}),d.addEventListener("click",g=>{g.preventDefault(),o.focus(),o.scrollIntoView({behavior:"smooth",block:"start"}),m(`Jumped to ${n.replace("Skip to ","")}`,"info"),t.style.transform="translateY(-100%)"}),t.appendChild(d)}),!a)return;window.innerWidth<768&&(t.style.transform="translateY(0)",t.style.position="sticky"),window.addEventListener("resize",()=>{window.innerWidth<768&&(t.style.transform="translateY(0)")}),document.body.insertBefore(t,document.body.firstChild),Je=t}function St(){if(typeof document>"u"||document.querySelector("[data-yuktai-focus-style]"))return;let e=document.createElement("style");e.setAttribute("data-yuktai-focus-style","true"),e.textContent=`

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
  `,document.head.appendChild(e),document.documentElement.setAttribute("data-yuktai-a11y","true")}function Tt(){typeof document>"u"||document.querySelector("[data-yuktai-kb-init]")||(document.documentElement.setAttribute("data-yuktai-kb-init","true"),document.addEventListener("keydown",e=>{let t=document.activeElement;if(!t)return;let a=t.getAttribute("role")||"";if(e.key==="Escape"){let i=t.closest("[role='dialog'],[role='alertdialog']");if(i){i.style.display="none",m("Dialog closed","info");return}let n=t.closest("[role='menu'],[role='menubar']");n&&(n.style.display="none",m("Menu closed","info"))}if(a==="menuitem"||t.closest("[role='menu'],[role='menubar']")){let i=t.closest("[role='menu'],[role='menubar']");if(!i)return;let n=Array.from(i.querySelectorAll("[role='menuitem']:not([disabled])")),l=n.indexOf(t);e.key==="ArrowDown"||e.key==="ArrowRight"?(e.preventDefault(),n[(l+1)%n.length]?.focus()):e.key==="ArrowUp"||e.key==="ArrowLeft"?(e.preventDefault(),n[(l-1+n.length)%n.length]?.focus()):e.key==="Home"?(e.preventDefault(),n[0]?.focus()):e.key==="End"&&(e.preventDefault(),n[n.length-1]?.focus())}if(a==="tab"||t.closest("[role='tablist']")){let i=t.closest("[role='tablist']");if(!i)return;let n=Array.from(i.querySelectorAll("[role='tab']:not([disabled])")),l=n.indexOf(t);if(e.key==="ArrowRight"||e.key==="ArrowDown"){e.preventDefault();let o=n[(l+1)%n.length];o?.focus(),o?.click()}else if(e.key==="ArrowLeft"||e.key==="ArrowUp"){e.preventDefault();let o=n[(l-1+n.length)%n.length];o?.focus(),o?.click()}}if(a==="option"||t.closest("[role='listbox']")){let i=t.closest("[role='listbox']");if(!i)return;let n=Array.from(i.querySelectorAll("[role='option']:not([aria-disabled='true'])")),l=n.indexOf(t);e.key==="ArrowDown"?(e.preventDefault(),n[(l+1)%n.length]?.focus()):e.key==="ArrowUp"?(e.preventDefault(),n[(l-1+n.length)%n.length]?.focus()):(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),t.setAttribute("aria-selected","true"),n.forEach(o=>{o!==t&&o.setAttribute("aria-selected","false")}),m(`Selected: ${t.textContent?.trim()}`,"success"))}e.altKey&&e.key==="a"&&(e.preventDefault(),Et()),e.key==="Tab"&&D?.speechEnabled&&setTimeout(()=>{let i=document.activeElement;if(!i)return;let n=i.getAttribute("aria-label")||i.getAttribute("title")||i.textContent?.trim()||i.tagName.toLowerCase(),l=i.getAttribute("role")||i.tagName.toLowerCase();Ce(`${n}, ${l}`)},100)}))}function ce(e){let t=e.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[role="button"]');if(t.length===0)return;let a=t[0],i=t[t.length-1];a.focus(),e.addEventListener("keydown",n=>{n.key==="Tab"&&(n.shiftKey?document.activeElement===a&&(n.preventDefault(),i.focus()):document.activeElement===i&&(n.preventDefault(),a.focus()))})}function Et(){if(typeof document>"u")return;if(O){O.remove(),O=null;return}let e=document.createElement("div");e.setAttribute("role","dialog"),e.setAttribute("aria-label","Keyboard shortcuts"),e.setAttribute("aria-modal","true"),e.setAttribute("data-yuktai-cheatsheet","true"),e.style.cssText=`
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
    ${t.map(([i,n])=>`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #2a2a4a">
        <kbd style="background:#2a2a4a;color:#74c0fc;padding:3px 8px;border-radius:4px;font-size:12px;font-family:monospace;border:1px solid #3a3a6a">${i}</kbd>
        <span style="font-size:12px;color:#ccc;text-align:right;flex:1;margin-left:12px">${n}</span>
      </div>
    `).join("")}
  `,e.querySelector("[data-yuktai-close]")?.addEventListener("click",()=>{e.remove(),O=null}),e.addEventListener("keydown",i=>{i.key==="Escape"&&(e.remove(),O=null)}),document.body.appendChild(e),O=e,ce(e),m("Keyboard shortcuts opened. Press Escape to close.","info")}function Ct(e){if(typeof document>"u"||!D?.showAuditBadge||typeof window<"u"&&!window.location.hostname.includes("localhost")&&!window.location.hostname.includes("127.0.0.1"))return;Se&&Se.remove();let t=e.score,a=t>=90?"#0f9d58":t>=70?"#f29900":"#d93025",i=t>=90?"\u267F":t>=70?"\u26A0":"\u2715",n=document.createElement("button");n.setAttribute("aria-label",`Accessibility score: ${t} out of 100`),n.setAttribute("data-yuktai-badge","true"),n.style.cssText=`
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
  `,n.innerHTML=`${i} ${t}/100 <span style="font-weight:400;opacity:0.85">${e.details.length} issues</span>`,n.addEventListener("click",()=>Lt(e)),document.body.appendChild(n),Se=n}function Lt(e){let t=document.querySelector("[data-yuktai-audit-details]");if(t){t.remove();return}let a=document.createElement("div");a.setAttribute("data-yuktai-audit-details","true"),a.setAttribute("role","dialog"),a.setAttribute("aria-label","Accessibility audit details"),a.style.cssText=`
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
    ${e.details.slice(0,20).map(n=>`
      <div style="padding:6px 0;border-bottom:1px solid #2a2a4a">
        <div style="display:flex;gap:6px;align-items:center">
          <span style="background:${i[n.severity]};color:#fff;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:700;text-transform:uppercase">${n.severity}</span>
          <code style="color:#74c0fc">&lt;${n.tag}&gt;</code>
        </div>
        <div style="color:#ccc;margin-top:3px">${n.fix}</div>
      </div>
    `).join("")}
    ${e.details.length>20?`<div style="color:#888;padding:8px 0;text-align:center">+${e.details.length-20} more issues</div>`:""}
  `,a.addEventListener("keydown",n=>{n.key==="Escape"&&a.remove()}),document.body.appendChild(a),ce(a)}function it(e){typeof document>"u"||(Te&&clearTimeout(Te),Te=setTimeout(()=>{if(se)return;let t=document.createElement("div");t.setAttribute("role","alertdialog"),t.setAttribute("aria-label","Session timeout warning"),t.setAttribute("aria-modal","true"),t.setAttribute("data-yuktai-timeout","true"),t.style.cssText=`
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
    `;let a=t.querySelector("[data-yuktai-extend]"),i=t.querySelector("[data-yuktai-dismiss]");a?.addEventListener("click",()=>{t.remove(),se=null,m("Session extended. You have more time.","success"),D?.timeoutWarning&&it(D.timeoutWarning)}),i?.addEventListener("click",()=>{t.remove(),se=null}),document.body.appendChild(t),se=t,ce(t),m("Warning: Your session will expire soon. Do you need more time?","warning")},e*1e3))}function Mt(e){if(typeof document>"u")return;let t=document.documentElement;if(t.toggleAttribute("data-yuktai-high-contrast",!!e.highContrast),t.toggleAttribute("data-yuktai-dark",!!e.darkMode),t.toggleAttribute("data-yuktai-reduce-motion",!!e.reduceMotion),t.toggleAttribute("data-yuktai-large-targets",!!e.largeTargets),t.toggleAttribute("data-yuktai-keyboard",!!e.keyboardHints),t.toggleAttribute("data-yuktai-dyslexia",!!e.dyslexiaFont),e.localFont?document.body.style.fontFamily=`"${e.localFont}", system-ui, sans-serif`:e.dyslexiaFont||(document.body.style.fontFamily=""),e.fontSizeMultiplier&&e.fontSizeMultiplier!==1?document.documentElement.style.fontSize=`${e.fontSizeMultiplier*100}%`:document.documentElement.style.fontSize="",e.colorBlindMode&&e.colorBlindMode!=="none"){let a=e.colorBlindMode==="achromatopsia"?"grayscale(100%)":`url(#${le[e.colorBlindMode]})`;document.body.style.filter=a}else document.body.style.filter=""}function Rt(e){try{let t=localStorage.getItem("yuktai-a11y-prefs");t&&Object.assign(e,JSON.parse(t))}catch{}}async function Qe(e){if(e){if(!await xe()){m("Plain English requires Chrome 127+","warning");return}m("Rewriting page in plain English...","info",!1);let a=await $e();m(a.error?`Plain English failed: ${a.error}`:`${a.fixed} sections rewritten in plain English`,a.error?"error":"success",!1)}else Fe(),m("Original text restored","info",!1)}async function Ze(e){if(e){if(!await he()){m("Page summariser requires Chrome 127+","warning");return}m("Generating page summary...","info",!1);let a=await Oe();m(a.error?`Summary failed: ${a.error}`:"Page summary added at top",a.error?"error":"success",!1)}else oe(),m("Page summary removed","info",!1)}async function et(e){if(e==="en"){we(),m("Page restored to English","info",!1);return}m(`Translating page to ${e}...`,"info",!1);let t=await De(e);m(t.error?`Translation failed: ${t.error}`:`Page translated to ${e}`,t.error?"error":"success",!1)}async function tt(e){if(e){if(!ve()){m("Voice control not supported in this browser","warning");return}_e(t=>{t.success&&m(`Voice: ${t.action}`,"info",!1)}),m("Voice control started. Say a command.","success",!1)}else ke(),m("Voice control stopped","info",!1)}async function at(e){if(e){if(!await Ae()){m("Smart labels requires Chrome 127+","warning");return}m("Generating smart labels...","info",!1);let a=await Ke();m(a.error?`Smart labels failed: ${a.error}`:`${a.fixed} elements labelled`,a.error?"error":"success",!1)}else Ye(),m("Smart labels removed","info",!1)}function Pt(){if(typeof document>"u"||de)return;let e=document.createElement("div");e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e.setAttribute("aria-relevant","text"),e.style.cssText="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);",document.body.appendChild(e),de=e}function It(){if(typeof document>"u"||Ue)return;let e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("aria-hidden","true"),e.style.cssText="position:absolute;width:0;height:0;overflow:hidden;",e.innerHTML=`
    <defs>
      <filter id="${le.deuteranopia}">
        <feColorMatrix type="matrix"
          values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${le.protanopia}">
        <feColorMatrix type="matrix"
          values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${le.tritanopia}">
        <feColorMatrix type="matrix"
          values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"/>
      </filter>
    </defs>
  `,document.body.appendChild(e),Ue=e}function ot(e){let t={critical:20,serious:10,moderate:5,minor:2},a=e.details.reduce((i,n)=>i+(t[n.severity]||0),0);return Math.max(0,Math.min(100,100-a))}var C={name:"yuktai-a11y",version:"4.0.0",observer:null,async execute(e){if(!e.enabled)return this.stopObserver(),"yuktai: disabled.";D=e,Rt(e),Pt(),It(),St(),Tt(),e.showSkipLinks!==!1&&At(),e.showPreferencePanel,Mt(e);let t=this.applyFixes(e);t.score=ot(t),e.showAuditBadge&&Ct(t),e.timeoutWarning&&it(e.timeoutWarning),e.autoFix&&this.startObserver(e),e.plainEnglish&&await Qe(!0),e.summarisePage&&await Ze(!0),e.translateLanguage&&e.translateLanguage!=="en"&&await et(e.translateLanguage),e.voiceControl&&await tt(!0),e.smartLabels&&await at(!0);let a=`${t.fixed} fixes applied. Score: ${t.score}/100.`;return m(a,t.score>=90?"success":"info",!1),`yuktai v4.0.0: ${a} Scanned ${t.scanned} elements in ${t.renderTime}ms.`},applyFixes(e){let t={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return t;let a=performance.now(),i=document.querySelectorAll("*");t.scanned=i.length;let n=(l,o,d,g)=>{t.details.push({tag:l,fix:o,severity:d,element:g.outerHTML.slice(0,100)}),t.fixed++};return i.forEach(l=>{let o=l,d=o.tagName.toLowerCase();if(d==="html"&&!o.getAttribute("lang")&&(o.setAttribute("lang","en"),n(d,'lang="en" added',"critical",o)),d==="meta"){let u=o.getAttribute("name"),v=o.getAttribute("content")||"";u==="viewport"&&v.includes("user-scalable=no")&&(o.setAttribute("content",v.replace("user-scalable=no","user-scalable=yes")),n(d,"user-scalable=yes restored","serious",o)),u==="viewport"&&/maximum-scale=1(?:[^0-9]|$)/.test(v)&&(o.setAttribute("content",v.replace(/maximum-scale=1(?=[^0-9]|$)/,"maximum-scale=5")),n(d,"maximum-scale=5 restored","serious",o))}if(d==="main"&&!o.getAttribute("tabindex")&&(o.setAttribute("tabindex","-1"),o.getAttribute("id")||o.setAttribute("id","main-content")),d==="img"&&(o.hasAttribute("alt")||(o.setAttribute("alt",""),o.setAttribute("aria-hidden","true"),n(d,'alt="" aria-hidden="true"',"serious",o))),d==="svg"&&(!o.getAttribute("aria-hidden")&&!o.getAttribute("aria-label")&&!l.querySelector("title")&&(o.setAttribute("aria-hidden","true"),n(d,'aria-hidden="true" (decorative svg)',"minor",o)),o.getAttribute("focusable")||o.setAttribute("focusable","false")),d==="iframe"&&!o.getAttribute("title")&&!o.getAttribute("aria-label")&&(o.setAttribute("title","embedded content"),o.setAttribute("aria-label","embedded content"),n(d,"title + aria-label added","serious",o)),d==="button"){if(!o.innerText?.trim()&&!o.getAttribute("aria-label")){let u=o.getAttribute("title")||"button";o.setAttribute("aria-label",u),n(d,`aria-label="${u}" (empty button)`,"critical",o)}o.hasAttribute("disabled")&&!o.getAttribute("aria-disabled")&&(o.setAttribute("aria-disabled","true"),t.fixed++)}if(d==="a"){let u=o;!o.innerText?.trim()&&!o.getAttribute("aria-label")&&(o.setAttribute("aria-label",o.getAttribute("title")||"link"),n(d,"aria-label added (empty link)","critical",o)),u.target==="_blank"&&!u.rel?.includes("noopener")&&(u.rel="noopener noreferrer",t.fixed++)}if(Xe.has(d)){let u=o;if(!o.getAttribute("aria-label")&&!o.getAttribute("aria-labelledby")){let v=o.getAttribute("placeholder")||o.getAttribute("name")||d;o.setAttribute("aria-label",v),n(d,`aria-label="${v}"`,"serious",o)}if(o.hasAttribute("required")&&!o.getAttribute("aria-required")&&(o.setAttribute("aria-required","true"),t.fixed++),d==="input"&&!u.autocomplete){let v=u.name||"";u.type==="email"||v.includes("email")?u.autocomplete="email":u.type==="tel"||v.includes("tel")?u.autocomplete="tel":u.type==="password"&&(u.autocomplete="current-password"),t.fixed++}}d==="th"&&!o.getAttribute("scope")&&(o.setAttribute("scope",o.closest("thead")?"col":"row"),n(d,"scope added to <th>","moderate",o)),Ee[d]&&!o.getAttribute("role")&&(o.setAttribute("role",Ee[d]),n(d,`role="${Ee[d]}"`,"minor",o));let g=o.getAttribute("role")||"";g==="tab"&&!o.getAttribute("aria-selected")&&(o.setAttribute("aria-selected","false"),t.fixed++),["alert","status","log"].includes(g)&&!o.getAttribute("aria-live")&&(o.setAttribute("aria-live",g==="alert"?"assertive":"polite"),n(d,`aria-live added on role=${g}`,"moderate",o)),g==="combobox"&&!o.getAttribute("aria-expanded")&&(o.setAttribute("aria-expanded","false"),n(d,'aria-expanded="false" on combobox',"serious",o)),(g==="checkbox"||g==="radio")&&!o.getAttribute("aria-checked")&&(o.setAttribute("aria-checked","false"),n(d,`aria-checked="false" on role=${g}`,"serious",o))}),t.renderTime=parseFloat((performance.now()-a).toFixed(2)),t},scan(){let e={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return e;let t=performance.now(),a=document.querySelectorAll("*");e.scanned=a.length;let i=(n,l,o,d)=>e.details.push({tag:n,fix:l,severity:o,element:d.outerHTML.slice(0,100)});return a.forEach(n=>{let l=n,o=l.tagName.toLowerCase();(o==="a"||o==="button")&&!l.innerText?.trim()&&!l.getAttribute("aria-label")&&i(o,"needs aria-label (empty)","critical",l),o==="img"&&!l.hasAttribute("alt")&&i(o,"needs alt text","serious",l),Xe.has(o)&&!l.getAttribute("aria-label")&&!l.getAttribute("aria-labelledby")&&i(o,"needs aria-label","serious",l),o==="iframe"&&!l.getAttribute("title")&&!l.getAttribute("aria-label")&&i(o,"iframe needs title","serious",l)}),e.fixed=e.details.length,e.score=ot(e),e.renderTime=parseFloat((performance.now()-t).toFixed(2)),e},startObserver(e){this.observer||typeof document>"u"||(this.observer=new MutationObserver(()=>this.applyFixes(e)),this.observer.observe(document.body,{childList:!0,subtree:!0,attributes:!1}))},stopObserver(){this.observer?.disconnect(),this.observer=null},announce:m,speak:Ce,showVisualAlert:nt,trapFocus:ce,handlePlainEnglish:Qe,handleSummarisePage:Ze,handleTranslate:et,handleVoiceControl:tt,handleSmartLabels:at,SUPPORTED_LANGUAGES:ie};import Bt,{useEffect as q,useState as L,useCallback as Q}from"react";import{forwardRef as zt,useEffect as ue,useState as H}from"react";import{jsx as r,jsxs as p}from"react/jsx-runtime";var Le={highContrast:!1,reduceMotion:!1,autoFix:!0,dyslexiaFont:!1,fontScale:100,localFont:"",darkMode:!1,largeTargets:!1,speechEnabled:!1,colorBlindMode:"none",showAuditBadge:!1,timeoutWarning:void 0,plainEnglish:!1,summarisePage:!1,translateLanguage:"en",voiceControl:!1,smartLabels:!1},G=[80,90,100,110,120,130],Ht=[{value:"none",label:"None"},{value:"deuteranopia",label:"Deuteranopia"},{value:"protanopia",label:"Protanopia"},{value:"tritanopia",label:"Tritanopia"},{value:"achromatopsia",label:"Greyscale"}],Wt=["Prompt API for Gemini Nano","Summarization API for Gemini Nano","Writer API for Gemini Nano","Rewriter API for Gemini Nano","Translation API"];function $t(){let[e,t]=H(typeof window<"u"?window.innerWidth:1024);return ue(()=>{let a=()=>t(window.innerWidth);return window.addEventListener("resize",a),()=>window.removeEventListener("resize",a)},[]),{isMobile:e<=480,isTablet:e>480&&e<=768}}function Ft({checked:e,onChange:t,label:a,disabled:i=!1}){return p("label",{"aria-label":a,style:{position:"relative",display:"inline-flex",width:"40px",height:"24px",cursor:i?"not-allowed":"pointer",flexShrink:0,opacity:i?.4:1},children:[r("input",{type:"checkbox",checked:e,disabled:i,onChange:n=>t(n.target.checked),style:{opacity:0,width:0,height:0,position:"absolute"}}),r("span",{style:{position:"absolute",inset:0,borderRadius:"99px",background:e?"#0d9488":"#cbd5e1",transition:"background 0.2s"}}),r("span",{style:{position:"absolute",top:"3px",left:e?"19px":"3px",width:"18px",height:"18px",background:"#fff",borderRadius:"50%",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)",pointerEvents:"none"}})]})}function _({label:e,color:t="#64748b",badge:a,concept:i}){return p("div",{style:{margin:"10px 18px 4px"},children:[p("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[r("p",{style:{margin:0,fontSize:"10px",fontWeight:600,color:t,letterSpacing:"0.06em",textTransform:"uppercase"},children:e}),a&&r("span",{style:{fontSize:"9px",fontWeight:500,padding:"1px 7px",borderRadius:"99px",background:"#f5f3ff",color:"#7c3aed",border:"0.5px solid #c4b5fd",whiteSpace:"nowrap"},children:a})]}),i&&r("p",{style:{margin:"2px 0 0",fontSize:"9px",color:"#94a3b8",fontStyle:"italic"},children:i})]})}function M({icon:e,label:t,desc:a,checked:i,onChange:n,disabled:l=!1,disabledReason:o,tip:d}){return p("div",{title:l?o:d,style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 18px",gap:"12px"},children:[p("div",{style:{display:"flex",alignItems:"center",gap:"10px",flex:1,minWidth:0},children:[r("span",{"aria-hidden":"true",style:{width:"32px",height:"32px",borderRadius:"8px",background:l?"#f1f5f9":"#f0fdfa",color:l?"#94a3b8":"#0d9488",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"15px",flexShrink:0,fontWeight:700},children:e}),p("div",{style:{minWidth:0},children:[r("p",{style:{margin:0,fontSize:"13px",fontWeight:500,color:l?"#94a3b8":"#0f172a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:t}),r("p",{style:{margin:0,fontSize:"10px",color:"#94a3b8"},children:l?o:a})]})]}),r(Ft,{checked:i,onChange:n,label:`Toggle ${t}`,disabled:l})]})}function k(){return r("div",{style:{height:"1px",background:"#f1f5f9"}})}function X({steps:e}){return p("div",{style:{margin:"0 18px 8px",padding:"8px 10px",background:"#f8fafc",borderRadius:"8px",border:"0.5px solid #e2e8f0"},children:[r("p",{style:{margin:"0 0 4px",fontSize:"9px",fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.05em"},children:"How to use"}),e.map((t,a)=>p("p",{style:{margin:"0 0 2px",fontSize:"10px",color:"#475569"},children:[a+1,". ",t]},a))]})}var Me=zt(({position:e,settings:t,report:a,isActive:i,aiSupported:n,voiceSupported:l,set:o,onApply:d,onReset:g,onClose:u},v)=>{let{isMobile:x,isTablet:j}=$t(),[Z,me]=H([]),[R,$]=H(""),[I,P]=H(""),[h,K]=H(!1),[f,z]=H(null),[S,F]=H("idle");ue(()=>{let s=window;!!(s.LanguageModel||s.ai?.languageModel)&&n?z("gemini"):te()&&z("transformers")},[n]),ue(()=>{if(f!=="transformers")return;let s=setInterval(()=>{F(ae())},500);return()=>clearInterval(s)},[f]);let b=async()=>{if(!(!R.trim()||h)){if(!f){P("\u26A0\uFE0F No AI engine available on this device.");return}K(!0),P("");try{let s;f==="gemini"?s=await ze(R):(F("loading"),s=await He(R),F("ready")),P(s.success&&s.answer?s.answer.replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/#+\s/g,"").trim():"\u26A0\uFE0F "+(s.error||"No answer found on this page"))}catch{P("\u26A0\uFE0F Failed to get answer. Please try again.")}K(!1)}};ue(()=>{(async()=>{try{let B=window;if(!B.queryLocalFonts)return;let ge=await B.queryLocalFonts(),be=[...new Set(ge.map(ye=>ye.family))].sort();me(be.slice(0,50))}catch{}})()},[]);let ee=f==="gemini"?"Gemini Nano":f==="transformers"?"Transformers.js \xB7 All devices":"Detecting...",Y=f==="transformers"&&S==="loading"?"Loading AI model... (first time only)":"...",U=x?{position:"fixed",bottom:0,left:0,right:0,zIndex:9999,background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px 16px 0 0",boxShadow:"0 -8px 32px rgba(0,0,0,0.12)",maxHeight:"90vh",overflowY:"auto",fontFamily:"system-ui,-apple-system,sans-serif",width:"100%"}:{position:"fixed",bottom:"84px",[e]:"24px",zIndex:9999,width:j?"300px":"320px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",maxHeight:"80vh",overflowY:"auto",fontFamily:"system-ui,-apple-system,sans-serif"};return p("div",{ref:v,role:"dialog","aria-modal":"true","aria-label":"yuktai accessibility preferences","data-yuktai-panel":"true",style:U,children:[p("div",{style:{padding:"14px 18px 12px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"flex-start",justifyContent:"space-between",position:"sticky",top:0,background:"#fff",zIndex:1},children:[p("div",{children:[p("div",{style:{display:"flex",alignItems:"center",gap:"7px",marginBottom:"4px",flexWrap:"wrap"},children:[r("span",{style:{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0d9488",letterSpacing:"0.05em",fontFamily:"monospace"},children:"@yuktishaalaa/yuktai v2.1.0"}),i&&r("span",{style:{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0f766e",border:"1px solid #99f6e4"},children:"\u25CF ACTIVE"})]}),r("p",{style:{margin:"0 0 1px",fontSize:"15px",fontWeight:600,color:"#0f172a"},children:"Accessibility"}),r("p",{style:{margin:0,fontSize:"11px",color:"#64748b"},children:"WCAG 2.2 \xB7 Open source \xB7 Zero cost \xB7 All devices"})]}),r("button",{onClick:u,"aria-label":"Close accessibility panel",style:{background:"none",border:"none",cursor:"pointer",padding:"4px",color:"#94a3b8",fontSize:"20px",lineHeight:1,borderRadius:"6px",flexShrink:0,minWidth:x?"44px":"auto",minHeight:x?"44px":"auto",display:"flex",alignItems:"center",justifyContent:"center"},children:"\xD7"})]}),r(_,{label:"\u267F Core Accessibility",concept:"Rule-based engine \u2014 works on all browsers and devices"}),r(X,{steps:["Toggle any feature on","Click Apply settings","Preferences saved automatically"]}),r(M,{icon:"\u{1F527}",label:"Auto-fix ARIA",desc:"Injects missing labels and roles automatically",checked:t.autoFix,onChange:s=>o("autoFix",s),tip:"Fixes aria-label, alt text, roles on every element"}),r(k,{}),r(M,{icon:"\u{1F50A}",label:"Speak on focus",desc:"Browser reads elements aloud as you tab",checked:t.speechEnabled,onChange:s=>o("speechEnabled",s),tip:"Uses browser SpeechSynthesis \u2014 no install needed"}),r(k,{}),r(M,{icon:"\u{1F399}\uFE0F",label:"Voice control",desc:"Say commands to navigate the page",checked:t.voiceControl,onChange:s=>o("voiceControl",s),disabled:!l,disabledReason:"Not supported in this browser",tip:'Say "scroll down", "go to main", "click"'}),r(k,{}),r(_,{label:"\u{1F916} AI Features",color:"#7c3aed",badge:"Gemini Nano",concept:"Large Language Model running privately on your device \u2014 Chrome 127+ only"}),r("div",{style:{margin:"4px 18px 6px",padding:"8px 10px",background:n?"#f0fdfa":"#f5f3ff",borderRadius:"8px",border:`0.5px solid ${n?"#99f6e4":"#c4b5fd"}`,fontSize:"10px",color:n?"#0f766e":"#7c3aed",lineHeight:1.5},children:n?"\u2705 Gemini Nano detected \u2014 AI features ready. Runs privately on your device.":"\u2699\uFE0F AI features need one-time setup \u2014 see guide below."}),!n&&p("div",{style:{margin:"0 18px 8px",padding:"10px 12px",background:"#fafafa",borderRadius:"8px",border:"0.5px solid #e2e8f0",fontSize:"11px",color:"#475569",lineHeight:1.7},children:[r("p",{style:{margin:"0 0 6px",fontWeight:600,color:"#0f172a",fontSize:"11px"},children:"\u{1F6E0} One-time setup \u2014 5 steps:"}),p("p",{style:{margin:"0 0 3px"},children:["1. Open Chrome \u2192 ",r("code",{style:{background:"#f1f5f9",padding:"1px 5px",borderRadius:"4px",fontSize:"10px",color:"#0d9488",fontFamily:"monospace"},children:"chrome://flags"})]}),r("p",{style:{margin:"0 0 3px"},children:"2. Enable each flag:"}),r("div",{style:{display:"flex",flexDirection:"column",gap:"2px",margin:"4px 0 6px 10px"},children:Wt.map(s=>p("span",{style:{fontSize:"10px",color:"#7c3aed",fontFamily:"monospace"},children:["\u2192 ",s]},s))}),p("p",{style:{margin:"0 0 3px"},children:["3. Click ",r("strong",{style:{color:"#0f172a"},children:"Relaunch"})]}),p("p",{style:{margin:"0 0 3px"},children:["4. ",r("code",{style:{background:"#f1f5f9",padding:"1px 5px",borderRadius:"4px",fontSize:"10px",color:"#0d9488",fontFamily:"monospace"},children:"chrome://components"})," \u2192 Optimization Guide On Device Model \u2192 Check for update"]}),r("p",{style:{margin:"0"},children:"5. Refresh \u2014 AI features unlock automatically \u2705"})]}),r(M,{icon:"\u{1F4DD}",label:"Plain English mode",desc:"Rewrites complex text in simple language",checked:t.plainEnglish,onChange:s=>o("plainEnglish",s),disabled:!n,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: LLM text rewriting"}),r(k,{}),r(M,{icon:"\u{1F4CB}",label:"Summarise page",desc:"3-sentence summary appears at top",checked:t.summarisePage,onChange:s=>o("summarisePage",s),disabled:!n,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: Abstractive summarisation"}),r(k,{}),r(M,{icon:"\u{1F3F7}\uFE0F",label:"Smart aria-labels",desc:"AI generates meaningful labels for elements",checked:t.smartLabels,onChange:s=>o("smartLabels",s),disabled:!n,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: Context-aware label generation"}),r(k,{}),r(_,{label:"\u{1F441}\uFE0F Visual",concept:"CSS filter-based \u2014 works on all browsers and devices"}),r(X,{steps:["Toggle any visual mode","Changes apply instantly","Works on mobile and desktop"]}),r(M,{icon:"\u25D1",label:"High contrast",desc:"Boosts contrast for low vision users",checked:t.highContrast,onChange:s=>o("highContrast",s),tip:"CSS filter: contrast()"}),r(k,{}),r(M,{icon:"\u{1F319}",label:"Dark mode",desc:"Inverts colours \u2014 easy on eyes at night",checked:t.darkMode,onChange:s=>o("darkMode",s),tip:"CSS filter: invert + hue-rotate"}),r(k,{}),r(M,{icon:"\u23F8\uFE0F",label:"Reduce motion",desc:"Disables all animations",checked:t.reduceMotion,onChange:s=>o("reduceMotion",s),tip:"WCAG 2.3.3 \u2014 vestibular disorders"}),r(k,{}),r(M,{icon:"\u{1F446}",label:"Large targets",desc:"44\xD744px minimum touch targets",checked:t.largeTargets,onChange:s=>o("largeTargets",s),tip:"WCAG 2.5.8 \u2014 motor impaired users"}),r(k,{}),p("div",{style:{padding:"10px 18px"},children:[r("p",{style:{margin:"0 0 2px",fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F3A8} Colour blindness"}),r("p",{style:{margin:"0 0 8px",fontSize:"10px",color:"#94a3b8"},children:"SVG colour matrix filters \u2014 all devices"}),r("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"},children:Ht.map(s=>r("button",{onClick:()=>o("colorBlindMode",s.value),"aria-pressed":t.colorBlindMode===s.value,style:{padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500,border:`1px solid ${t.colorBlindMode===s.value?"#0d9488":"#e2e8f0"}`,background:t.colorBlindMode===s.value?"#f0fdfa":"#fff",color:t.colorBlindMode===s.value?"#0d9488":"#64748b",cursor:"pointer",minHeight:x?"36px":"auto"},children:s.label},s.value))})]}),r(k,{}),r(_,{label:"\u{1F524} Font",concept:"Browser Font API + CSS \u2014 Chrome 103+"}),r(X,{steps:["Toggle dyslexia font or pick from device","Adjust size with + / \u2212","Saved across visits"]}),r(M,{icon:"Aa",label:"Dyslexia-friendly font",desc:"Atkinson Hyperlegible \u2014 research-backed",checked:t.dyslexiaFont,onChange:s=>o("dyslexiaFont",s),tip:"By Braille Institute \u2014 free and open source"}),r(k,{}),p("div",{style:{padding:"10px 18px"},children:[r("p",{style:{margin:"0 0 2px",fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F5A5}\uFE0F Local font"}),r("p",{style:{margin:"0 0 8px",fontSize:"10px",color:"#94a3b8"},children:"window.queryLocalFonts() \u2014 Chrome 103+"}),Z.length>0?p("select",{value:t.localFont,onChange:s=>o("localFont",s.target.value),"aria-label":"Choose a font from your device",style:{width:"100%",padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"13px",color:"#0f172a",background:"#fff",cursor:"pointer",height:x?"44px":"36px"},children:[r("option",{value:"",children:"System default"}),Z.map(s=>r("option",{value:s,style:{fontFamily:s},children:s},s))]}):r("p",{style:{margin:0,fontSize:"11px",color:"#94a3b8"},children:"Allow font access when Chrome prompts you."})]}),r(k,{}),p("div",{style:{padding:"10px 18px 14px"},children:[p("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"10px"},children:[p("div",{children:[r("p",{style:{margin:0,fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F4CF} Text size"}),r("p",{style:{margin:0,fontSize:"10px",color:"#94a3b8"},children:"Scales all text on the page"})]}),p("span",{style:{fontSize:"12px",fontWeight:600,color:"#0d9488",background:"#f0fdfa",padding:"2px 8px",borderRadius:"99px"},children:[t.fontScale,"%"]})]}),p("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[r("button",{onClick:()=>{let s=G.indexOf(t.fontScale);s>0&&o("fontScale",G[s-1])},disabled:t.fontScale<=80,"aria-label":"Decrease text size",style:{width:x?"44px":"30px",height:x?"44px":"30px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:t.fontScale<=80?"not-allowed":"pointer",fontSize:"16px",color:t.fontScale<=80?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"\u2212"}),r("div",{style:{flex:1,display:"flex",gap:"3px"},children:G.map(s=>r("button",{onClick:()=>o("fontScale",s),"aria-label":`Set text size to ${s}%`,style:{flex:1,height:"6px",borderRadius:"99px",border:"none",cursor:"pointer",padding:0,background:s<=t.fontScale?"#0d9488":"#e2e8f0",transition:"background 0.15s"}},s))}),r("button",{onClick:()=>{let s=G.indexOf(t.fontScale);s<G.length-1&&o("fontScale",G[s+1])},disabled:t.fontScale>=130,"aria-label":"Increase text size",style:{width:x?"44px":"30px",height:x?"44px":"30px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:t.fontScale>=130?"not-allowed":"pointer",fontSize:"16px",color:t.fontScale>=130?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"+"})]})]}),r(k,{}),r(_,{label:"\u{1F310} Translate",color:"#7c3aed",badge:"Gemini Nano",concept:"Chrome Translation API \u2014 on device, no internet after setup"}),r(X,{steps:["Enable Gemini Nano first","Pick your language","Full page translates instantly"]}),p("div",{style:{padding:"6px 18px 12px"},children:[r("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"},children:ie.slice(0,x?8:18).map(s=>r("button",{onClick:()=>o("translateLanguage",s.code),"aria-pressed":t.translateLanguage===s.code,disabled:!n,style:{padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500,border:`1px solid ${t.translateLanguage===s.code?"#7c3aed":"#e2e8f0"}`,background:t.translateLanguage===s.code?"#f5f3ff":"#fff",color:t.translateLanguage===s.code?"#7c3aed":"#64748b",cursor:n?"pointer":"not-allowed",opacity:n?1:.5,minHeight:x?"36px":"auto"},children:s.label},s.code))}),!n&&r("p",{style:{margin:"6px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Enable Gemini Nano using the setup guide above."})]}),r(k,{}),r(_,{label:"\u{1F4AC} Ask This Page",color:"#0d9488",badge:ee,concept:"RAG \u2014 Retrieval Augmented Generation. Works on all devices including mobile."}),r(X,{steps:["Type any question about this page","Press Ask or hit Enter",f==="transformers"?"Transformers.js answers \u2014 works on mobile, offline":"Gemini Nano reads page and answers privately","Zero cost. No data leaves your device."]}),p("div",{style:{margin:"0 18px 8px",padding:"6px 10px",background:f==="gemini"?"#f0fdfa":f==="transformers"?"#f5f3ff":"#f8fafc",borderRadius:"8px",border:`0.5px solid ${f==="gemini"?"#99f6e4":f==="transformers"?"#c4b5fd":"#e2e8f0"}`,fontSize:"10px",color:f==="gemini"?"#0f766e":f==="transformers"?"#7c3aed":"#94a3b8"},children:[f==="gemini"&&"\u2705 Using Gemini Nano \u2014 on device, private, instant",f==="transformers"&&"\u2705 Using Transformers.js \u2014 works on mobile and all browsers",!f&&"\u23F3 Detecting AI engine...",f==="transformers"&&S==="loading"&&" \xB7 Loading model...",f==="transformers"&&S==="ready"&&" \xB7 Model ready \u2705"]}),p("div",{style:{padding:"0 18px 14px"},children:[p("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[r("input",{type:"text",value:R,onChange:s=>$(s.target.value),onKeyDown:s=>{s.key==="Enter"&&b()},placeholder:"e.g. What does this page do?",disabled:h||!f,"aria-label":"Ask a question about this page",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:f?"#fff":"#f8fafc",outline:"none",height:x?"44px":"36px"}}),r("button",{onClick:b,disabled:h||!R.trim()||!f,"aria-label":"Ask question",style:{padding:"8px 14px",borderRadius:"8px",border:"none",background:f&&R.trim()&&!h?"#0d9488":"#e2e8f0",color:f&&R.trim()&&!h?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:f&&R.trim()&&!h?"pointer":"not-allowed",flexShrink:0,height:x?"44px":"36px",minWidth:"52px",transition:"background 0.2s"},children:h?Y:"Ask"})]}),I&&p("div",{role:"status","aria-live":"polite",style:{padding:"10px 12px",background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"8px",fontSize:"12px",color:"#0f766e",lineHeight:1.6,maxHeight:"180px",overflowY:"auto"},children:[r("strong",{style:{display:"block",marginBottom:"4px",fontSize:"11px",color:"#0d9488"},children:"\u{1F4AC} Answer"}),I,r("button",{onClick:()=>{P(""),$("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]})]}),a&&r("div",{role:"status",style:{margin:"0 14px 10px",padding:"8px 12px",background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"8px",fontSize:"12px",color:"#0f766e",fontWeight:500,fontFamily:"monospace"},children:a.fixed>0?`\u2713 ${a.fixed} fixes \xB7 ${a.scanned} nodes \xB7 ${a.renderTime}ms \xB7 Score: ${a.score}/100`:`\u2713 0 auto-fixes needed \xB7 ${a.scanned} nodes \xB7 ${a.renderTime}ms`}),p("div",{style:{display:"flex",gap:"8px",padding:"12px 14px 14px",position:x?"sticky":"relative",bottom:x?0:"auto",background:"#fff",borderTop:"1px solid #f1f5f9"},children:[r("button",{onClick:g,style:{flex:1,padding:x?"12px 0":"8px 0",fontSize:"13px",fontWeight:500,borderRadius:"9px",border:"1px solid #e2e8f0",background:"#fff",color:"#64748b",cursor:"pointer"},children:"Reset"}),r("button",{onClick:d,style:{flex:2,padding:x?"12px 0":"8px 0",fontSize:"13px",fontWeight:600,borderRadius:"9px",border:"none",background:"#0d9488",color:"#fff",cursor:"pointer"},children:"Apply settings"})]})]})});Me.displayName="WidgetPanel";import{Fragment as Ot,jsx as A,jsxs as V}from"react/jsx-runtime";async function Nt(){try{if(typeof window>"u")return!1;let e=window;if(e.LanguageModel)try{if(typeof e.LanguageModel.availability=="function"){let a=await e.LanguageModel.availability();if(a==="readily"||a==="available"||a==="downloadable")return!0}else return!0}catch{}if(e.Summarizer)try{let a=await e.Summarizer.availability?.();if(!a||a==="readily"||a==="available")return!0}catch{}if(e.Rewriter)try{let a=await e.Rewriter.availability?.();if(!a||a==="readily"||a==="available")return!0}catch{}if(e.Writer)try{let a=await e.Writer.availability?.();if(!a||a==="readily"||a==="available")return!0}catch{}let t=e.ai||globalThis.ai;if(t){if(t.languageModel?.availability)try{let a=await t.languageModel.availability();if(a==="readily"||a==="available")return!0}catch{}if(t.languageModel&&typeof t.languageModel.create=="function"||t.summarizer||t.rewriter||t.writer||t.languageModel)return!0}return!!(e.Translator||e.translation?.canTranslate)}catch{return!1}}function Re({position:e="left",children:t,config:a={},showRag:i=!1}){let[n,l]=L(!1),[o,d]=L(Le),[g,u]=L(null),[v,x]=L(!1),[j,Z]=L(!1),[me,R]=L(!1),$=Bt.useRef(null),[I,P]=L(!1),[h,K]=L(""),[f,z]=L(""),[S,F]=L(!1),[b,ee]=L(null),[Y,U]=L("idle");q(()=>{if(typeof window>"u")return;let c=window;!!(c.LanguageModel||c.ai?.languageModel)&&j?ee("gemini"):te()&&ee("transformers")},[j]),q(()=>{if(b!=="transformers")return;let c=setInterval(()=>U(ae()),500);return()=>clearInterval(c)},[b]);let s=Q(async()=>{if(!(!h.trim()||S)){if(!b){z("\u26A0\uFE0F No AI engine available on this device.");return}F(!0),z("");try{let c;if(b==="gemini"){let{askPage:w}=await import("./rag-MKBAGH6J.mjs");c=await w(h)}else{U("loading");let{askPageWithTransformers:w}=await import("./transformers-rag-VGPGANGM.mjs");c=await w(h),U("ready")}z(c.success&&c.answer?c.answer.replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/#+\s/g,"").trim():"\u26A0\uFE0F "+(c.error||"No answer found."))}catch{z("\u26A0\uFE0F Something went wrong. Please try again.")}F(!1)}},[h,S,b]);q(()=>{if(typeof window>"u")return;let w=setTimeout(async()=>{let J=window;console.log("yuktai: Checking AI APIs..."),console.log("yuktai: window.LanguageModel =",J.LanguageModel);let Ie=await Nt();Z(Ie),console.log(Ie?"yuktai: Chrome Built-in AI detected \u2705":"yuktai: Chrome Built-in AI not detected \u2014 Transformers.js will handle RAG on mobile"),R(!!(J.SpeechRecognition||J.webkitSpeechRecognition))},800);return()=>clearTimeout(w)},[]),q(()=>{if(!(typeof window>"u"))try{let c=localStorage.getItem("yuktai-a11y-prefs");c&&d(w=>({...w,...JSON.parse(c)}))}catch{}},[]);let B=Q(async c=>{let w={enabled:!0,highContrast:c.highContrast,darkMode:c.darkMode,reduceMotion:c.reduceMotion,largeTargets:c.largeTargets,speechEnabled:c.speechEnabled,autoFix:c.autoFix,dyslexiaFont:c.dyslexiaFont,localFont:c.localFont,fontSizeMultiplier:c.fontScale/100,colorBlindMode:c.colorBlindMode,showAuditBadge:c.showAuditBadge,showSkipLinks:!0,showPreferencePanel:!1,plainEnglish:c.plainEnglish,summarisePage:c.summarisePage,translateLanguage:c.translateLanguage,voiceControl:c.voiceControl,smartLabels:c.smartLabels,...a};await C.execute(w),u(C.applyFixes(w)),x(!0)},[a]),ge=Q(async()=>{try{localStorage.setItem("yuktai-a11y-prefs",JSON.stringify(o))}catch{}await B(o),l(!1)},[o,B]),be=Q(()=>{d(Le);try{localStorage.removeItem("yuktai-a11y-prefs")}catch{}let c=document.documentElement;["data-yuktai-high-contrast","data-yuktai-dark","data-yuktai-reduce-motion","data-yuktai-large-targets","data-yuktai-keyboard","data-yuktai-dyslexia"].forEach(w=>c.removeAttribute(w)),document.body.style.filter="",document.body.style.fontFamily="",document.documentElement.style.fontSize="",u(null),x(!1)},[]),ye=Q((c,w)=>{d(J=>({...J,[c]:w}))},[]);q(()=>{let c=w=>{w.key==="Escape"&&(n&&l(!1),I&&P(!1))};return window.addEventListener("keydown",c),()=>window.removeEventListener("keydown",c)},[n,I]),q(()=>{n&&$.current&&C.trapFocus($.current)},[n]);let st=b==="transformers"&&Y==="loading"?"Loading AI... (first time only)":"...",Pe=b==="gemini"?"Gemini Nano \xB7 On device \xB7 Instant":b==="transformers"?"Transformers.js \xB7 All devices \xB7 Offline":"Detecting engine...",lt={position:"fixed",bottom:"24px",[e]:"24px",zIndex:9998,width:"52px",height:"52px",borderRadius:"50%",background:v?"#0d9488":"#1a73e8",color:"#fff",border:"none",cursor:"pointer",fontSize:"22px",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,0,0,0.25)",transition:"transform 0.15s, background 0.2s"},dt={position:"fixed",bottom:"84px",[e]:"24px",zIndex:9998,width:"52px",height:"52px",borderRadius:"50%",background:I?"#7c3aed":"#6d28d9",color:"#fff",border:"none",cursor:"pointer",fontSize:"22px",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,0,0,0.25)",transition:"transform 0.15s, background 0.2s"};return V(Ot,{children:[t,i&&A("button",{style:dt,"aria-label":"Ask a question about this page","aria-haspopup":"dialog","aria-expanded":I,title:`Ask this page \xB7 ${Pe}`,onClick:()=>{P(c=>!c),l(!1)},onMouseEnter:c=>{c.currentTarget.style.transform="scale(1.08)"},onMouseLeave:c=>{c.currentTarget.style.transform="scale(1)"},children:"\u{1F4AC}"}),i&&I&&V("div",{role:"dialog","aria-modal":"true","aria-label":"Ask this page","data-yuktai-panel":"true",style:{position:"fixed",bottom:"148px",[e]:"24px",zIndex:9999,width:"300px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",fontFamily:"system-ui,-apple-system,sans-serif",padding:"14px"},children:[V("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"},children:[V("div",{children:[A("p",{style:{margin:"0 0 2px",fontSize:"13px",fontWeight:600,color:"#0f172a"},children:"\u{1F4AC} Ask this page"}),A("p",{style:{margin:0,fontSize:"10px",color:b==="gemini"?"#0d9488":"#7c3aed"},children:Pe}),b==="transformers"&&Y==="loading"&&A("p",{style:{margin:"2px 0 0",fontSize:"9px",color:"#94a3b8"},children:"Downloading AI model \u2014 first time only (~90MB)"}),b==="transformers"&&Y==="ready"&&A("p",{style:{margin:"2px 0 0",fontSize:"9px",color:"#0d9488"},children:"Model ready \u2705 \u2014 works offline now"})]}),A("button",{onClick:()=>P(!1),"aria-label":"Close ask panel",style:{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"18px",lineHeight:1,padding:"2px",borderRadius:"4px"},children:"\xD7"})]}),V("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[A("input",{type:"text",value:h,onChange:c=>K(c.target.value),onKeyDown:c=>{c.key==="Enter"&&s()},placeholder:"e.g. What does this page do?",disabled:S||!b,"aria-label":"Ask a question about this page",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:b?"#fff":"#f8fafc",outline:"none",height:"36px"}}),A("button",{onClick:s,disabled:S||!h.trim()||!b,"aria-label":"Submit question",style:{padding:"8px 12px",borderRadius:"8px",border:"none",background:b&&h.trim()&&!S?"#7c3aed":"#e2e8f0",color:b&&h.trim()&&!S?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:b&&h.trim()&&!S?"pointer":"not-allowed",height:"36px",minWidth:"48px",transition:"background 0.2s"},children:S?st:"Ask"})]}),f&&V("div",{style:{padding:"10px",background:"#f5f3ff",borderRadius:"8px",fontSize:"12px",color:"#4c1d95",lineHeight:1.6,maxHeight:"180px",overflowY:"auto"},children:[A("strong",{style:{display:"block",marginBottom:"4px",fontSize:"11px",color:"#7c3aed"},children:"\u{1F4AC} Answer"}),f,A("button",{onClick:()=>{z(""),K("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]}),!b&&A("p",{style:{margin:"4px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Detecting AI engine..."})]}),A("button",{style:lt,"aria-label":"Open accessibility preferences","aria-haspopup":"dialog","aria-expanded":n,"data-yuktai-pref-toggle":"true",onClick:()=>{l(c=>!c),P(!1)},onMouseEnter:c=>{c.currentTarget.style.transform="scale(1.08)"},onMouseLeave:c=>{c.currentTarget.style.transform="scale(1)"},children:"\u267F"}),n&&A(Me,{ref:$,position:e,settings:o,report:g,isActive:v,aiSupported:j,voiceSupported:me,set:ye,onApply:ge,onReset:be,onClose:()=>l(!1)})]})}var pe={name:"ai.text",async execute(e){return`\u{1F916} YuktAI says: ${e}`}};var fe={name:"voice.text",async execute(e){return!e||e.trim()===""?"\u{1F3A4} No speech detected":`\u{1F3A4} You said: ${e}`}};var W=class{plugins=new Map;register(t,a){if(!a||typeof a.execute!="function")throw new Error(`Invalid plugin: ${t}`);this.plugins.set(t,a)}use(t){return this.plugins.get(t)}async run(t,a){try{let i=this.use(t);if(!i)throw new Error(`Plugin not found: ${t}`);return await i.execute(a)}catch(i){throw console.error(`[YuktAI Runtime Error in ${t}]:`,i),i}}getPlugins(){return Array.from(this.plugins.keys())}};function Dt(){if(typeof globalThis>"u")return new W;if(!globalThis.__yuktai_runtime__){let e=new W;e.register(C.name,C),e.register(pe.name,pe),e.register(fe.name,fe),globalThis.__yuktai_runtime__=e}return globalThis.__yuktai_runtime__}var rt=typeof window<"u"?Dt():new W,za={wcagPlugin:C,list(){return rt.getPlugins()},use(e){return rt.use(e)},fix(e){return C.applyFixes({enabled:!0,autoFix:!0,...e})},scan(){return C.scan()}};export{W as Runtime,za as YuktAI,Re as YuktAIWrapper,pe as aiPlugin,Re as default,fe as voicePlugin,C as wcag,C as wcagPlugin};
