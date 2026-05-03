import{a as Me}from"./chunk-56MYCLBI.mjs";function Re(){let e=window;return e.Rewriter||e.ai?.rewriter||null}async function me(){try{let e=Re();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}async function ct(e){if(!e||e.trim().length<20)return{success:!1,original:e,rewritten:e,error:"Text too short"};try{let t=Re();if(!t)throw new Error("Rewriter API not available");let a=await t.create({tone:"more-casual",format:"plain-text",length:"as-is",outputLanguage:"en"}),i=await a.rewrite(e,{context:"Rewrite this text in simple plain English. Use short sentences. Avoid jargon. Make it easy to understand for everyone."});return a.destroy(),{success:!0,original:e,rewritten:i.trim()}}catch(t){return{success:!1,original:e,rewritten:e,error:t instanceof Error?t.message:"Rewrite failed"}}}async function Pe(){if(!await me())return{fixed:0,error:"Chrome Built-in AI Rewriter not available. Enable via chrome://flags."};let t=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption"),a=0;for(let i of t){let n=i.innerText?.trim();if(!n||n.length<20||i.closest("[data-yuktai-panel]"))continue;let r=await ct(n);r.success&&r.rewritten!==n&&(i.dataset.yuktaiOriginal=n,i.innerText=r.rewritten,a++)}return{fixed:a}}function ze(){let e=document.querySelectorAll("[data-yuktai-original]");for(let t of e){let a=t.dataset.yuktaiOriginal;a&&(t.innerText=a,delete t.dataset.yuktaiOriginal)}}var Ie="yuktai-summary-box";function We(){let e=window;return e.Summarizer||e.ai?.summarizer||null}async function ge(){try{let e=We();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}function dt(){let e=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, article, section"),t=[];for(let a of e){if(a.closest("[data-yuktai-panel]"))continue;let i=window.getComputedStyle(a);if(i.display==="none"||i.visibility==="hidden")continue;let n=a.innerText?.trim();n&&n.length>10&&t.push(n)}return t.join(" ").slice(0,5e3)}async function He(){if(!await ge())return{success:!1,summary:"",error:"Chrome Built-in AI Summarizer not available. Enable via chrome://flags."};let t=dt();if(!t||t.length<100)return{success:!1,summary:"",error:"Not enough text on this page to summarise."};try{let a=We();if(!a)throw new Error("Summarizer API not available");let i=await a.create({type:"tl;dr",format:"plain-text",length:"short",outputLanguage:"en"}),n=await i.summarize(t,{context:"Summarise this page in 2-3 simple sentences for a screen reader user who wants to know if this page is relevant to them."});return i.destroy(),ut(n.trim()),{success:!0,summary:n.trim()}}catch(a){return{success:!1,summary:"",error:a instanceof Error?a.message:"Summary failed"}}}function ut(e){Q();let t=document.createElement("div");t.id=Ie,t.setAttribute("data-yuktai-panel","true"),t.setAttribute("role","region"),t.setAttribute("aria-label","Page summary by yuktai"),t.style.cssText=`
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
  `,i.addEventListener("click",Q),t.appendChild(a),t.appendChild(i),document.body.prepend(t)}function Q(){let e=document.getElementById(Ie);e&&e.remove()}var ee=[{code:"en",label:"English"},{code:"hi",label:"Hindi"},{code:"es",label:"Spanish"},{code:"fr",label:"French"},{code:"de",label:"German"},{code:"it",label:"Italian"},{code:"pt",label:"Portuguese"},{code:"nl",label:"Dutch"},{code:"pl",label:"Polish"},{code:"ru",label:"Russian"},{code:"ja",label:"Japanese"},{code:"ko",label:"Korean"},{code:"zh",label:"Chinese"},{code:"ar",label:"Arabic"},{code:"tr",label:"Turkish"},{code:"vi",label:"Vietnamese"},{code:"bn",label:"Bengali"},{code:"id",label:"Indonesian"}],Z="en";function pt(){let e=window;return e.Translator||e.translation||null}async function ft(e){try{let t=window;if(!pt())return!1;if(t.Translator&&typeof t.Translator.availability=="function")try{let i=await t.Translator.availability({sourceLanguage:"en",targetLanguage:e});return i==="readily"||i==="available"||i==="downloadable"||i==="after-download"}catch{}return t.Translator&&typeof t.Translator.canTranslate=="function"?await t.Translator.canTranslate({sourceLanguage:"en",targetLanguage:e})!=="no":t.translation&&typeof t.translation.canTranslate=="function"?await t.translation.canTranslate({sourceLanguage:"en",targetLanguage:e})!=="no":!1}catch{return!1}}async function mt(e){let t=window,a={sourceLanguage:"en",targetLanguage:e};if(t.Translator&&typeof t.Translator.create=="function")return await t.Translator.create(a);if(t.translation&&typeof t.translation.createTranslator=="function")return await t.translation.createTranslator(a);throw new Error("Translation API not available")}async function Fe(e){if(e===Z)return{success:!0,language:e,fixed:0};if(e==="en")return be(),Z="en",{success:!0,language:"en",fixed:0};if(!await ft(e))return{success:!1,language:e,fixed:0,error:`Translation to ${e} not available. Enable via chrome://flags.`};try{let a=await mt(e),i=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption, span, a"),n=0;for(let r of i){if(r.closest("[data-yuktai-panel]")||r.children.length>0)continue;let o=r.innerText?.trim();if(!o||o.length<2)continue;r.dataset.yuktaiTranslationOriginal||(r.dataset.yuktaiTranslationOriginal=o);let c=await a.translate(o);c&&c!==o&&(r.innerText=c,n++)}return typeof a.destroy=="function"&&a.destroy(),Z=e,{success:!0,language:e,fixed:n}}catch(a){return{success:!1,language:e,fixed:0,error:a instanceof Error?a.message:"Translation failed"}}}function be(){let e=document.querySelectorAll("[data-yuktai-translation-original]");for(let t of e){let a=t.dataset.yuktaiTranslationOriginal;a&&(t.innerText=a,delete t.dataset.yuktaiTranslationOriginal)}Z="en"}var gt=[{phrases:["go to main","skip to main","main content"],action:"focus-main",label:"Jump to main content"},{phrases:["go to navigation","go to nav","open menu"],action:"focus-nav",label:"Jump to navigation"},{phrases:["go to search","search","find"],action:"focus-search",label:"Jump to search"},{phrases:["scroll down","page down","next"],action:"scroll-down",label:"Scroll down"},{phrases:["scroll up","page up","back up"],action:"scroll-up",label:"Scroll up"},{phrases:["go back","previous page"],action:"go-back",label:"Go back"},{phrases:["click","press","select"],action:"click-focused",label:"Click focused element"},{phrases:["next item","tab forward","tab"],action:"tab-forward",label:"Move to next element"},{phrases:["previous item","tab back","shift tab"],action:"tab-back",label:"Move to previous element"},{phrases:["stop listening","stop voice","quiet"],action:"stop-voice",label:"Stop voice control"}],T=null,te=!1,B=null;function ye(){return!!(window.SpeechRecognition||window.webkitSpeechRecognition)}function bt(e){let t=e.toLowerCase().trim();for(let a of gt)for(let i of a.phrases)if(t.includes(i))return{action:a.action,label:a.label};return null}function yt(e){switch(e){case"focus-main":{let t=document.querySelector("main, [role='main'], #main");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-nav":{let t=document.querySelector("nav, [role='navigation']");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-search":{let t=document.querySelector("input[type='search'], input[role='searchbox'], [aria-label*='search' i]");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"scroll-down":{window.scrollBy({top:400,behavior:"smooth"});break}case"scroll-up":{window.scrollBy({top:-400,behavior:"smooth"});break}case"go-back":{window.history.back();break}case"click-focused":{let t=document.activeElement;t&&t!==document.body&&t.click();break}case"tab-forward":{let t=$e(),a=t.indexOf(document.activeElement),i=t[a+1]||t[0];i&&i.focus();break}case"tab-back":{let t=$e(),a=t.indexOf(document.activeElement),i=t[a-1]||t[t.length-1];i&&i.focus();break}case"stop-voice":{xe();break}}}function $e(){return Array.from(document.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(e=>!e.closest("[data-yuktai-panel]"))}function Be(e){if(!ye())return!1;if(te)return!0;e&&(B=e);let t=window.SpeechRecognition||window.webkitSpeechRecognition;return T=new t,T.continuous=!0,T.interimResults=!1,T.lang="en-US",T.onresult=a=>{let i=a.results[a.results.length-1][0].transcript,n=bt(i);if(n){yt(n.action);let r={success:!0,command:i,action:n.label};if(B&&B(r),n.action==="stop-voice")return}},T.onend=()=>{te&&T?.start()},T.onerror=a=>{a.error!=="no-speech"&&B&&B({success:!1,command:"",action:"",error:`Voice error: ${a.error}`})},T.start(),te=!0,xt(),!0}function xe(){te=!1,T&&(T.stop(),T=null),B=null,Oe()}var Ne="yuktai-voice-indicator";function xt(){Oe();let e=document.createElement("div");e.id=Ne,e.setAttribute("data-yuktai-panel","true"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-label","yuktai voice control is listening"),e.style.cssText=`
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
    `,document.head.appendChild(i)}let a=document.createElement("span");a.textContent="Listening for commands...",e.appendChild(t),e.appendChild(a),document.body.appendChild(e)}function Oe(){let e=document.getElementById(Ne);e&&e.remove()}var ht=["button:not([aria-label]):not([aria-labelledby])","a:not([aria-label]):not([aria-labelledby])","input:not([aria-label]):not([aria-labelledby]):not([id])","select:not([aria-label]):not([aria-labelledby])","textarea:not([aria-label]):not([aria-labelledby])","[role='button']:not([aria-label])","[role='link']:not([aria-label])","[role='checkbox']:not([aria-label])","[role='tab']:not([aria-label])"].join(", ");function qe(){let e=window;return e.Writer||e.ai?.writer||null}async function he(){try{let e=qe();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}function wt(e){let t=[],a=e.innerText?.trim();a&&t.push(`element text: "${a}"`);let i=e.placeholder?.trim();i&&t.push(`placeholder: "${i}"`);let n=e.getAttribute("name")?.trim();n&&t.push(`name: "${n}"`);let r=e.getAttribute("type")?.trim();r&&t.push(`type: "${r}"`);let o=e.id;if(o){let u=document.querySelector(`label[for="${o}"]`);u&&t.push(`label: "${u.innerText?.trim()}"`)}let c=e.parentElement?.innerText?.trim().slice(0,60);c&&t.push(`parent context: "${c}"`),t.push(`tag: ${e.tagName.toLowerCase()}`);let g=e.getAttribute("role");return g&&t.push(`role: ${g}`),t.join(". ")}async function vt(e,t){let a=`
    Generate a short, clear aria-label for an HTML element.
    The label must be 2-6 words maximum.
    The label must describe what the element does or what it is.
    Do not include punctuation.
    Do not explain \u2014 just output the label text only.

    Element details:
    ${t}

    Output only the label. Nothing else.
  `.trim();return(await e.write(a)).trim().replace(/^["']|["']$/g,"").replace(/\.$/,"").trim()}async function De(){if(!await he())return{success:!1,fixed:0,elements:[],error:"Chrome Built-in AI Writer not available. Enable via chrome://flags."};let t=document.querySelectorAll(ht);if(t.length===0)return{success:!0,fixed:0,elements:[]};try{let a=qe();if(!a)throw new Error("Writer API not available");let i=await a.create({tone:"neutral",format:"plain-text",length:"short",outputLanguage:"en"}),n=0,r=[];for(let o of t){if(o.closest("[data-yuktai-panel]"))continue;let c=window.getComputedStyle(o);if(c.display==="none"||c.visibility==="hidden")continue;let g=wt(o),u=await vt(i,g);u&&u.length>0&&(o.dataset.yuktaiLabelOriginal=o.getAttribute("aria-label")||"",o.setAttribute("aria-label",u),n++,r.push({tag:o.tagName.toLowerCase(),label:u}))}return i.destroy(),{success:!0,fixed:n,elements:r}}catch(a){return{success:!1,fixed:0,elements:[],error:a instanceof Error?a.message:"Label generation failed"}}}function Ge(){let e=document.querySelectorAll("[data-yuktai-label-original]");for(let t of e){let a=t.dataset.yuktaiLabelOriginal;a?t.setAttribute("aria-label",a):t.removeAttribute("aria-label"),delete t.dataset.yuktaiLabelOriginal}}var ne=null,_e=null;var Ve=null,we=null,b=null,N=null,ae=null,ve=null,O=null,oe={deuteranopia:"yuktai-cb-d",protanopia:"yuktai-cb-p",tritanopia:"yuktai-cb-t"};var je=new Set(["input","select","textarea"]);var ke={nav:"navigation",header:"banner",footer:"contentinfo",main:"main",aside:"complementary"};function Ae(e,t="polite"){if(typeof window>"u"||!O?.speechEnabled||!window.speechSynthesis)return;window.speechSynthesis.cancel();let a=new SpeechSynthesisUtterance(e);a.rate=1,a.pitch=1,a.volume=1;let i=window.speechSynthesis.getVoices();i.length>0&&(a.voice=i[0]),window.speechSynthesis.speak(a)}function Ze(e,t="info"){if(typeof document>"u")return;let i={success:{bg:"#0f9d58",border:"#0a7a44",icon:"\u2713"},error:{bg:"#d93025",border:"#b52a1c",icon:"\u2715"},warning:{bg:"#f29900",border:"#c67c00",icon:"\u26A0"},info:{bg:"#1a73e8",border:"#1557b0",icon:"\u2139"}}[t];b||(b=document.createElement("div"),b.setAttribute("role","alert"),b.setAttribute("aria-live","assertive"),b.setAttribute("aria-atomic","true"),b.style.cssText=`
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
    `,document.body.appendChild(b)),b.style.background=i.bg,b.style.border=`1px solid ${i.border}`,b.style.color="#fff",b.innerHTML=`
    <span style="font-size:18px;font-weight:700">${i.icon}</span>
    <span style="flex:1;line-height:1.4">${e}</span>
    <button
      onclick="this.parentElement.style.transform='translateX(120%)';this.parentElement.style.opacity='0'"
      style="background:none;border:none;color:#fff;cursor:pointer;font-size:18px;padding:0;line-height:1"
      aria-label="Close notification">\xD7</button>
  `,window.innerWidth<=480&&(b.style.right="8px",b.style.left="8px",b.style.maxWidth="none",b.style.width="auto"),requestAnimationFrame(()=>{b&&(b.style.transform="translateX(0)",b.style.opacity="1")}),setTimeout(()=>{b&&(b.style.transform="translateX(120%)",b.style.opacity="0")},5e3)}function m(e,t="info",a=!0){ne&&(ne.textContent=e),Ze(e,t),a&&Ae(e,t==="error"?"assertive":"polite")}function kt(){if(typeof document>"u"||Ve)return;let e=[{label:"Skip to main content",selector:"main,[role='main'],#main,#main-content"},{label:"Skip to navigation",selector:"nav,[role='navigation'],#nav,#navigation"},{label:"Skip to search",selector:"[role='search'],#search,input[type='search']"}],t=document.createElement("div");t.setAttribute("data-yuktai-skip-bar","true"),t.setAttribute("role","navigation"),t.setAttribute("aria-label","Skip links"),t.style.cssText=`
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
  `;let a=!1;if(e.forEach(({label:n,selector:r})=>{let o=document.querySelector(r);if(!o)return;a=!0,o.getAttribute("tabindex")||o.setAttribute("tabindex","-1");let c=document.createElement("a");c.href="#",c.textContent=n,c.style.cssText=`
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
    `,c.addEventListener("focus",()=>{t.style.transform="translateY(0)"}),c.addEventListener("blur",()=>{setTimeout(()=>{t.matches(":focus-within")||(t.style.transform="translateY(-100%)")},2e3)}),c.addEventListener("click",g=>{g.preventDefault(),o.focus(),o.scrollIntoView({behavior:"smooth",block:"start"}),m(`Jumped to ${n.replace("Skip to ","")}`,"info"),t.style.transform="translateY(-100%)"}),t.appendChild(c)}),!a)return;window.innerWidth<768&&(t.style.transform="translateY(0)",t.style.position="sticky"),window.addEventListener("resize",()=>{window.innerWidth<768&&(t.style.transform="translateY(0)")}),document.body.insertBefore(t,document.body.firstChild),Ve=t}function At(){if(typeof document>"u"||document.querySelector("[data-yuktai-focus-style]"))return;let e=document.createElement("style");e.setAttribute("data-yuktai-focus-style","true"),e.textContent=`

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
  `,document.head.appendChild(e),document.documentElement.setAttribute("data-yuktai-a11y","true")}function St(){typeof document>"u"||document.querySelector("[data-yuktai-kb-init]")||(document.documentElement.setAttribute("data-yuktai-kb-init","true"),document.addEventListener("keydown",e=>{let t=document.activeElement;if(!t)return;let a=t.getAttribute("role")||"";if(e.key==="Escape"){let i=t.closest("[role='dialog'],[role='alertdialog']");if(i){i.style.display="none",m("Dialog closed","info");return}let n=t.closest("[role='menu'],[role='menubar']");n&&(n.style.display="none",m("Menu closed","info"))}if(a==="menuitem"||t.closest("[role='menu'],[role='menubar']")){let i=t.closest("[role='menu'],[role='menubar']");if(!i)return;let n=Array.from(i.querySelectorAll("[role='menuitem']:not([disabled])")),r=n.indexOf(t);e.key==="ArrowDown"||e.key==="ArrowRight"?(e.preventDefault(),n[(r+1)%n.length]?.focus()):e.key==="ArrowUp"||e.key==="ArrowLeft"?(e.preventDefault(),n[(r-1+n.length)%n.length]?.focus()):e.key==="Home"?(e.preventDefault(),n[0]?.focus()):e.key==="End"&&(e.preventDefault(),n[n.length-1]?.focus())}if(a==="tab"||t.closest("[role='tablist']")){let i=t.closest("[role='tablist']");if(!i)return;let n=Array.from(i.querySelectorAll("[role='tab']:not([disabled])")),r=n.indexOf(t);if(e.key==="ArrowRight"||e.key==="ArrowDown"){e.preventDefault();let o=n[(r+1)%n.length];o?.focus(),o?.click()}else if(e.key==="ArrowLeft"||e.key==="ArrowUp"){e.preventDefault();let o=n[(r-1+n.length)%n.length];o?.focus(),o?.click()}}if(a==="option"||t.closest("[role='listbox']")){let i=t.closest("[role='listbox']");if(!i)return;let n=Array.from(i.querySelectorAll("[role='option']:not([aria-disabled='true'])")),r=n.indexOf(t);e.key==="ArrowDown"?(e.preventDefault(),n[(r+1)%n.length]?.focus()):e.key==="ArrowUp"?(e.preventDefault(),n[(r-1+n.length)%n.length]?.focus()):(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),t.setAttribute("aria-selected","true"),n.forEach(o=>{o!==t&&o.setAttribute("aria-selected","false")}),m(`Selected: ${t.textContent?.trim()}`,"success"))}e.altKey&&e.key==="a"&&(e.preventDefault(),Tt()),e.key==="Tab"&&O?.speechEnabled&&setTimeout(()=>{let i=document.activeElement;if(!i)return;let n=i.getAttribute("aria-label")||i.getAttribute("title")||i.textContent?.trim()||i.tagName.toLowerCase(),r=i.getAttribute("role")||i.tagName.toLowerCase();Ae(`${n}, ${r}`)},100)}))}function ie(e){let t=e.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[role="button"]');if(t.length===0)return;let a=t[0],i=t[t.length-1];a.focus(),e.addEventListener("keydown",n=>{n.key==="Tab"&&(n.shiftKey?document.activeElement===a&&(n.preventDefault(),i.focus()):document.activeElement===i&&(n.preventDefault(),a.focus()))})}function Tt(){if(typeof document>"u")return;if(N){N.remove(),N=null;return}let e=document.createElement("div");e.setAttribute("role","dialog"),e.setAttribute("aria-label","Keyboard shortcuts"),e.setAttribute("aria-modal","true"),e.setAttribute("data-yuktai-cheatsheet","true"),e.style.cssText=`
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
  `,e.querySelector("[data-yuktai-close]")?.addEventListener("click",()=>{e.remove(),N=null}),e.addEventListener("keydown",i=>{i.key==="Escape"&&(e.remove(),N=null)}),document.body.appendChild(e),N=e,ie(e),m("Keyboard shortcuts opened. Press Escape to close.","info")}function Et(e){if(typeof document>"u"||!O?.showAuditBadge||typeof window<"u"&&!window.location.hostname.includes("localhost")&&!window.location.hostname.includes("127.0.0.1"))return;we&&we.remove();let t=e.score,a=t>=90?"#0f9d58":t>=70?"#f29900":"#d93025",i=t>=90?"\u267F":t>=70?"\u26A0":"\u2715",n=document.createElement("button");n.setAttribute("aria-label",`Accessibility score: ${t} out of 100`),n.setAttribute("data-yuktai-badge","true"),n.style.cssText=`
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
  `,n.innerHTML=`${i} ${t}/100 <span style="font-weight:400;opacity:0.85">${e.details.length} issues</span>`,n.addEventListener("click",()=>Ct(e)),document.body.appendChild(n),we=n}function Ct(e){let t=document.querySelector("[data-yuktai-audit-details]");if(t){t.remove();return}let a=document.createElement("div");a.setAttribute("data-yuktai-audit-details","true"),a.setAttribute("role","dialog"),a.setAttribute("aria-label","Accessibility audit details"),a.style.cssText=`
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
  `,a.addEventListener("keydown",n=>{n.key==="Escape"&&a.remove()}),document.body.appendChild(a),ie(a)}function et(e){typeof document>"u"||(ve&&clearTimeout(ve),ve=setTimeout(()=>{if(ae)return;let t=document.createElement("div");t.setAttribute("role","alertdialog"),t.setAttribute("aria-label","Session timeout warning"),t.setAttribute("aria-modal","true"),t.setAttribute("data-yuktai-timeout","true"),t.style.cssText=`
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
    `;let a=t.querySelector("[data-yuktai-extend]"),i=t.querySelector("[data-yuktai-dismiss]");a?.addEventListener("click",()=>{t.remove(),ae=null,m("Session extended. You have more time.","success"),O?.timeoutWarning&&et(O.timeoutWarning)}),i?.addEventListener("click",()=>{t.remove(),ae=null}),document.body.appendChild(t),ae=t,ie(t),m("Warning: Your session will expire soon. Do you need more time?","warning")},e*1e3))}function Lt(e){if(typeof document>"u")return;let t=document.documentElement;if(t.toggleAttribute("data-yuktai-high-contrast",!!e.highContrast),t.toggleAttribute("data-yuktai-dark",!!e.darkMode),t.toggleAttribute("data-yuktai-reduce-motion",!!e.reduceMotion),t.toggleAttribute("data-yuktai-large-targets",!!e.largeTargets),t.toggleAttribute("data-yuktai-keyboard",!!e.keyboardHints),t.toggleAttribute("data-yuktai-dyslexia",!!e.dyslexiaFont),e.localFont?document.body.style.fontFamily=`"${e.localFont}", system-ui, sans-serif`:e.dyslexiaFont||(document.body.style.fontFamily=""),e.fontSizeMultiplier&&e.fontSizeMultiplier!==1?document.documentElement.style.fontSize=`${e.fontSizeMultiplier*100}%`:document.documentElement.style.fontSize="",e.colorBlindMode&&e.colorBlindMode!=="none"){let a=e.colorBlindMode==="achromatopsia"?"grayscale(100%)":`url(#${oe[e.colorBlindMode]})`;document.body.style.filter=a}else document.body.style.filter=""}function Mt(e){try{let t=localStorage.getItem("yuktai-a11y-prefs");t&&Object.assign(e,JSON.parse(t))}catch{}}async function Ke(e){if(e){if(!await me()){m("Plain English requires Chrome 127+","warning");return}m("Rewriting page in plain English...","info",!1);let a=await Pe();m(a.error?`Plain English failed: ${a.error}`:`${a.fixed} sections rewritten in plain English`,a.error?"error":"success",!1)}else ze(),m("Original text restored","info",!1)}async function Ye(e){if(e){if(!await ge()){m("Page summariser requires Chrome 127+","warning");return}m("Generating page summary...","info",!1);let a=await He();m(a.error?`Summary failed: ${a.error}`:"Page summary added at top",a.error?"error":"success",!1)}else Q(),m("Page summary removed","info",!1)}async function Ue(e){if(e==="en"){be(),m("Page restored to English","info",!1);return}m(`Translating page to ${e}...`,"info",!1);let t=await Fe(e);m(t.error?`Translation failed: ${t.error}`:`Page translated to ${e}`,t.error?"error":"success",!1)}async function Je(e){if(e){if(!ye()){m("Voice control not supported in this browser","warning");return}Be(t=>{t.success&&m(`Voice: ${t.action}`,"info",!1)}),m("Voice control started. Say a command.","success",!1)}else xe(),m("Voice control stopped","info",!1)}async function Xe(e){if(e){if(!await he()){m("Smart labels requires Chrome 127+","warning");return}m("Generating smart labels...","info",!1);let a=await De();m(a.error?`Smart labels failed: ${a.error}`:`${a.fixed} elements labelled`,a.error?"error":"success",!1)}else Ge(),m("Smart labels removed","info",!1)}function Rt(){if(typeof document>"u"||ne)return;let e=document.createElement("div");e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e.setAttribute("aria-relevant","text"),e.style.cssText="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);",document.body.appendChild(e),ne=e}function Pt(){if(typeof document>"u"||_e)return;let e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("aria-hidden","true"),e.style.cssText="position:absolute;width:0;height:0;overflow:hidden;",e.innerHTML=`
    <defs>
      <filter id="${oe.deuteranopia}">
        <feColorMatrix type="matrix"
          values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${oe.protanopia}">
        <feColorMatrix type="matrix"
          values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${oe.tritanopia}">
        <feColorMatrix type="matrix"
          values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"/>
      </filter>
    </defs>
  `,document.body.appendChild(e),_e=e}function Qe(e){let t={critical:20,serious:10,moderate:5,minor:2},a=e.details.reduce((i,n)=>i+(t[n.severity]||0),0);return Math.max(0,Math.min(100,100-a))}var E={name:"yuktai-a11y",version:"4.0.0",observer:null,async execute(e){if(!e.enabled)return this.stopObserver(),"yuktai: disabled.";O=e,Mt(e),Rt(),Pt(),At(),St(),e.showSkipLinks!==!1&&kt(),e.showPreferencePanel,Lt(e);let t=this.applyFixes(e);t.score=Qe(t),e.showAuditBadge&&Et(t),e.timeoutWarning&&et(e.timeoutWarning),e.autoFix&&this.startObserver(e),e.plainEnglish&&await Ke(!0),e.summarisePage&&await Ye(!0),e.translateLanguage&&e.translateLanguage!=="en"&&await Ue(e.translateLanguage),e.voiceControl&&await Je(!0),e.smartLabels&&await Xe(!0);let a=`${t.fixed} fixes applied. Score: ${t.score}/100.`;return m(a,t.score>=90?"success":"info",!1),`yuktai v4.0.0: ${a} Scanned ${t.scanned} elements in ${t.renderTime}ms.`},applyFixes(e){let t={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return t;let a=performance.now(),i=document.querySelectorAll("*");t.scanned=i.length;let n=(r,o,c,g)=>{t.details.push({tag:r,fix:o,severity:c,element:g.outerHTML.slice(0,100)}),t.fixed++};return i.forEach(r=>{let o=r,c=o.tagName.toLowerCase();if(c==="html"&&!o.getAttribute("lang")&&(o.setAttribute("lang","en"),n(c,'lang="en" added',"critical",o)),c==="meta"){let u=o.getAttribute("name"),w=o.getAttribute("content")||"";u==="viewport"&&w.includes("user-scalable=no")&&(o.setAttribute("content",w.replace("user-scalable=no","user-scalable=yes")),n(c,"user-scalable=yes restored","serious",o)),u==="viewport"&&/maximum-scale=1(?:[^0-9]|$)/.test(w)&&(o.setAttribute("content",w.replace(/maximum-scale=1(?=[^0-9]|$)/,"maximum-scale=5")),n(c,"maximum-scale=5 restored","serious",o))}if(c==="main"&&!o.getAttribute("tabindex")&&(o.setAttribute("tabindex","-1"),o.getAttribute("id")||o.setAttribute("id","main-content")),c==="img"&&(o.hasAttribute("alt")||(o.setAttribute("alt",""),o.setAttribute("aria-hidden","true"),n(c,'alt="" aria-hidden="true"',"serious",o))),c==="svg"&&(!o.getAttribute("aria-hidden")&&!o.getAttribute("aria-label")&&!r.querySelector("title")&&(o.setAttribute("aria-hidden","true"),n(c,'aria-hidden="true" (decorative svg)',"minor",o)),o.getAttribute("focusable")||o.setAttribute("focusable","false")),c==="iframe"&&!o.getAttribute("title")&&!o.getAttribute("aria-label")&&(o.setAttribute("title","embedded content"),o.setAttribute("aria-label","embedded content"),n(c,"title + aria-label added","serious",o)),c==="button"){if(!o.innerText?.trim()&&!o.getAttribute("aria-label")){let u=o.getAttribute("title")||"button";o.setAttribute("aria-label",u),n(c,`aria-label="${u}" (empty button)`,"critical",o)}o.hasAttribute("disabled")&&!o.getAttribute("aria-disabled")&&(o.setAttribute("aria-disabled","true"),t.fixed++)}if(c==="a"){let u=o;!o.innerText?.trim()&&!o.getAttribute("aria-label")&&(o.setAttribute("aria-label",o.getAttribute("title")||"link"),n(c,"aria-label added (empty link)","critical",o)),u.target==="_blank"&&!u.rel?.includes("noopener")&&(u.rel="noopener noreferrer",t.fixed++)}if(je.has(c)){let u=o;if(!o.getAttribute("aria-label")&&!o.getAttribute("aria-labelledby")){let w=o.getAttribute("placeholder")||o.getAttribute("name")||c;o.setAttribute("aria-label",w),n(c,`aria-label="${w}"`,"serious",o)}if(o.hasAttribute("required")&&!o.getAttribute("aria-required")&&(o.setAttribute("aria-required","true"),t.fixed++),c==="input"&&!u.autocomplete){let w=u.name||"";u.type==="email"||w.includes("email")?u.autocomplete="email":u.type==="tel"||w.includes("tel")?u.autocomplete="tel":u.type==="password"&&(u.autocomplete="current-password"),t.fixed++}}c==="th"&&!o.getAttribute("scope")&&(o.setAttribute("scope",o.closest("thead")?"col":"row"),n(c,"scope added to <th>","moderate",o)),ke[c]&&!o.getAttribute("role")&&(o.setAttribute("role",ke[c]),n(c,`role="${ke[c]}"`,"minor",o));let g=o.getAttribute("role")||"";g==="tab"&&!o.getAttribute("aria-selected")&&(o.setAttribute("aria-selected","false"),t.fixed++),["alert","status","log"].includes(g)&&!o.getAttribute("aria-live")&&(o.setAttribute("aria-live",g==="alert"?"assertive":"polite"),n(c,`aria-live added on role=${g}`,"moderate",o)),g==="combobox"&&!o.getAttribute("aria-expanded")&&(o.setAttribute("aria-expanded","false"),n(c,'aria-expanded="false" on combobox',"serious",o)),(g==="checkbox"||g==="radio")&&!o.getAttribute("aria-checked")&&(o.setAttribute("aria-checked","false"),n(c,`aria-checked="false" on role=${g}`,"serious",o))}),t.renderTime=parseFloat((performance.now()-a).toFixed(2)),t},scan(){let e={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return e;let t=performance.now(),a=document.querySelectorAll("*");e.scanned=a.length;let i=(n,r,o,c)=>e.details.push({tag:n,fix:r,severity:o,element:c.outerHTML.slice(0,100)});return a.forEach(n=>{let r=n,o=r.tagName.toLowerCase();(o==="a"||o==="button")&&!r.innerText?.trim()&&!r.getAttribute("aria-label")&&i(o,"needs aria-label (empty)","critical",r),o==="img"&&!r.hasAttribute("alt")&&i(o,"needs alt text","serious",r),je.has(o)&&!r.getAttribute("aria-label")&&!r.getAttribute("aria-labelledby")&&i(o,"needs aria-label","serious",r),o==="iframe"&&!r.getAttribute("title")&&!r.getAttribute("aria-label")&&i(o,"iframe needs title","serious",r)}),e.fixed=e.details.length,e.score=Qe(e),e.renderTime=parseFloat((performance.now()-t).toFixed(2)),e},startObserver(e){this.observer||typeof document>"u"||(this.observer=new MutationObserver(()=>this.applyFixes(e)),this.observer.observe(document.body,{childList:!0,subtree:!0,attributes:!1}))},stopObserver(){this.observer?.disconnect(),this.observer=null},announce:m,speak:Ae,showVisualAlert:Ze,trapFocus:ie,handlePlainEnglish:Ke,handleSummarisePage:Ye,handleTranslate:Ue,handleVoiceControl:Je,handleSmartLabels:Xe,SUPPORTED_LANGUAGES:ee};import Gt,{useEffect as se,useState as P,useCallback as U}from"react";import{forwardRef as Bt,useEffect as re,useState as W}from"react";var at=null,ot=null,q=!1,Se=!1;async function zt(){if(!Se){if(q){for(;q;)await new Promise(e=>setTimeout(e,200));return}q=!0;try{let{pipeline:e}=await import("@xenova/transformers");at=await e("feature-extraction","Xenova/all-MiniLM-L6-v2",{device:"webgpu"}),ot=await e("question-answering","Xenova/distilbert-base-cased-distilled-squad",{device:"webgpu"}),Se=!0,q=!1,console.log("yuktai: Transformers.js models loaded \u2705")}catch(e){throw q=!1,console.error("yuktai: Transformers.js model load failed",e),e}}}function It(){return new Promise(e=>{let t=setTimeout(e,1500),a=new MutationObserver(()=>{clearTimeout(t),t=setTimeout(()=>{a.disconnect(),e()},500)});a.observe(document.body,{childList:!0,subtree:!0})})}function Wt(){let e=[],t=document.querySelectorAll("*");for(let a of t){if(a.closest("[data-yuktai-panel]"))continue;let i=a.innerText?.trim();i&&i.length>30&&e.push(i);let n=a.getAttribute("aria-label");n&&n.length>10&&e.push(n),(a instanceof HTMLInputElement||a instanceof HTMLTextAreaElement)&&a.placeholder&&e.push(a.placeholder)}return e.join(" ").slice(0,8e3)}function Ht(e,t=200,a=50){let i=e.split(/\s+/),n=[];for(let r=0;r<i.length;r+=t-a){let o=i.slice(r,r+t).join(" ");o.trim().length>20&&n.push(o)}return n}function Ft(e,t){let a=0,i=0,n=0;for(let r=0;r<e.length;r++)a+=e[r]*t[r],i+=e[r]*e[r],n+=t[r]*t[r];return a/(Math.sqrt(i)*Math.sqrt(n)+1e-8)}async function tt(e){let t=await at(e,{pooling:"mean",normalize:!0});return Array.from(t.data)}async function $t(e,t,a=3){let i=await tt(e),n=await Promise.all(t.map(async r=>{let o=await tt(r),c=Ft(i,o);return{chunk:r,score:c}}));return n.sort((r,o)=>o.score-r.score),n.slice(0,a).map(r=>r.chunk)}async function nt(e){if(!e.trim())return{success:!1,answer:"",error:"Please type a question."};try{await zt(),await It();let t=Wt();if(!t||t.length<50)return{success:!1,answer:"",error:"Not enough content on this page to answer from."};let a=Ht(t);if(a.length===0)return{success:!1,answer:"",error:"Could not process page content."};let n=(await $t(e,a,3)).join(" ... "),r=await ot({question:e,context:n});return!r?.answer||r.answer.trim().length===0?{success:!0,answer:"I could not find a specific answer on this page."}:{success:!0,answer:r.answer.trim()}}catch(t){return console.error("yuktai: Transformers RAG error",t),{success:!1,answer:"",error:t instanceof Error?t.message:"Transformers.js error \u2014 please try again."}}}function it(){try{return typeof WebAssembly<"u"&&typeof Worker<"u"}catch{return!1}}function rt(){return Se?"ready":q?"loading":"idle"}import{jsx as s,jsxs as p}from"react/jsx-runtime";var Te={highContrast:!1,reduceMotion:!1,autoFix:!0,dyslexiaFont:!1,fontScale:100,localFont:"",darkMode:!1,largeTargets:!1,speechEnabled:!1,colorBlindMode:"none",showAuditBadge:!1,timeoutWarning:void 0,plainEnglish:!1,summarisePage:!1,translateLanguage:"en",voiceControl:!1,smartLabels:!1},D=[80,90,100,110,120,130],Nt=[{value:"none",label:"None"},{value:"deuteranopia",label:"Deuteranopia"},{value:"protanopia",label:"Protanopia"},{value:"tritanopia",label:"Tritanopia"},{value:"achromatopsia",label:"Greyscale"}],Ot=["Prompt API for Gemini Nano","Summarization API for Gemini Nano","Writer API for Gemini Nano","Rewriter API for Gemini Nano","Translation API"];function qt(){let[e,t]=W(typeof window<"u"?window.innerWidth:1024);return re(()=>{let a=()=>t(window.innerWidth);return window.addEventListener("resize",a),()=>window.removeEventListener("resize",a)},[]),{isMobile:e<=480,isTablet:e>480&&e<=768}}function Dt({checked:e,onChange:t,label:a,disabled:i=!1}){return p("label",{"aria-label":a,style:{position:"relative",display:"inline-flex",width:"40px",height:"24px",cursor:i?"not-allowed":"pointer",flexShrink:0,opacity:i?.4:1},children:[s("input",{type:"checkbox",checked:e,disabled:i,onChange:n=>t(n.target.checked),style:{opacity:0,width:0,height:0,position:"absolute"}}),s("span",{style:{position:"absolute",inset:0,borderRadius:"99px",background:e?"#0d9488":"#cbd5e1",transition:"background 0.2s"}}),s("span",{style:{position:"absolute",top:"3px",left:e?"19px":"3px",width:"18px",height:"18px",background:"#fff",borderRadius:"50%",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)",pointerEvents:"none"}})]})}function G({label:e,color:t="#64748b",badge:a,concept:i}){return p("div",{style:{margin:"10px 18px 4px"},children:[p("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[s("p",{style:{margin:0,fontSize:"10px",fontWeight:600,color:t,letterSpacing:"0.06em",textTransform:"uppercase"},children:e}),a&&s("span",{style:{fontSize:"9px",fontWeight:500,padding:"1px 7px",borderRadius:"99px",background:"#f5f3ff",color:"#7c3aed",border:"0.5px solid #c4b5fd",whiteSpace:"nowrap"},children:a})]}),i&&s("p",{style:{margin:"2px 0 0",fontSize:"9px",color:"#94a3b8",fontStyle:"italic"},children:i})]})}function C({icon:e,label:t,desc:a,checked:i,onChange:n,disabled:r=!1,disabledReason:o,tip:c}){return p("div",{title:r?o:c,style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 18px",gap:"12px"},children:[p("div",{style:{display:"flex",alignItems:"center",gap:"10px",flex:1,minWidth:0},children:[s("span",{"aria-hidden":"true",style:{width:"32px",height:"32px",borderRadius:"8px",background:r?"#f1f5f9":"#f0fdfa",color:r?"#94a3b8":"#0d9488",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"15px",flexShrink:0,fontWeight:700},children:e}),p("div",{style:{minWidth:0},children:[s("p",{style:{margin:0,fontSize:"13px",fontWeight:500,color:r?"#94a3b8":"#0f172a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:t}),s("p",{style:{margin:0,fontSize:"10px",color:"#94a3b8"},children:r?o:a})]})]}),s(Dt,{checked:i,onChange:n,label:`Toggle ${t}`,disabled:r})]})}function v(){return s("div",{style:{height:"1px",background:"#f1f5f9"}})}function Y({steps:e}){return p("div",{style:{margin:"0 18px 8px",padding:"8px 10px",background:"#f8fafc",borderRadius:"8px",border:"0.5px solid #e2e8f0"},children:[s("p",{style:{margin:"0 0 4px",fontSize:"9px",fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.05em"},children:"How to use"}),e.map((t,a)=>p("p",{style:{margin:"0 0 2px",fontSize:"10px",color:"#475569"},children:[a+1,". ",t]},a))]})}var Ee=Bt(({position:e,settings:t,report:a,isActive:i,aiSupported:n,voiceSupported:r,set:o,onApply:c,onReset:g,onClose:u},w)=>{let{isMobile:y,isTablet:A}=qt(),[J,de]=W([]),[M,F]=W(""),[z,R]=W(""),[h,V]=W(!1),[f,I]=W(null),[S,$]=W("idle");re(()=>{let l=window;!!(l.LanguageModel||l.ai?.languageModel)&&n?I("gemini"):it()&&I("transformers")},[n]),re(()=>{if(f!=="transformers")return;let l=setInterval(()=>{$(rt())},500);return()=>clearInterval(l)},[f]);let j=async()=>{if(!(!M.trim()||h)){if(!f){R("\u26A0\uFE0F No AI engine available on this device.");return}V(!0),R("");try{let l;f==="gemini"?l=await Me(M):($("loading"),l=await nt(M),$("ready")),R(l.success&&l.answer?l.answer.replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/#+\s/g,"").trim():"\u26A0\uFE0F "+(l.error||"No answer found on this page"))}catch{R("\u26A0\uFE0F Failed to get answer. Please try again.")}V(!1)}};re(()=>{(async()=>{try{let K=window;if(!K.queryLocalFonts)return;let fe=await K.queryLocalFonts(),d=[...new Set(fe.map(x=>x.family))].sort();de(d.slice(0,50))}catch{}})()},[]);let X=f==="gemini"?"Gemini Nano":f==="transformers"?"Transformers.js \xB7 All devices":"Detecting...",ue=f==="transformers"&&S==="loading"?"Loading AI model... (first time only)":"...",pe=y?{position:"fixed",bottom:0,left:0,right:0,zIndex:9999,background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px 16px 0 0",boxShadow:"0 -8px 32px rgba(0,0,0,0.12)",maxHeight:"90vh",overflowY:"auto",fontFamily:"system-ui,-apple-system,sans-serif",width:"100%"}:{position:"fixed",bottom:"84px",[e]:"24px",zIndex:9999,width:A?"300px":"320px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",maxHeight:"80vh",overflowY:"auto",fontFamily:"system-ui,-apple-system,sans-serif"};return p("div",{ref:w,role:"dialog","aria-modal":"true","aria-label":"yuktai accessibility preferences","data-yuktai-panel":"true",style:pe,children:[p("div",{style:{padding:"14px 18px 12px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"flex-start",justifyContent:"space-between",position:"sticky",top:0,background:"#fff",zIndex:1},children:[p("div",{children:[p("div",{style:{display:"flex",alignItems:"center",gap:"7px",marginBottom:"4px",flexWrap:"wrap"},children:[s("span",{style:{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0d9488",letterSpacing:"0.05em",fontFamily:"monospace"},children:"@yuktishaalaa/yuktai v2.1.0"}),i&&s("span",{style:{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0f766e",border:"1px solid #99f6e4"},children:"\u25CF ACTIVE"})]}),s("p",{style:{margin:"0 0 1px",fontSize:"15px",fontWeight:600,color:"#0f172a"},children:"Accessibility"}),s("p",{style:{margin:0,fontSize:"11px",color:"#64748b"},children:"WCAG 2.2 \xB7 Open source \xB7 Zero cost \xB7 All devices"})]}),s("button",{onClick:u,"aria-label":"Close accessibility panel",style:{background:"none",border:"none",cursor:"pointer",padding:"4px",color:"#94a3b8",fontSize:"20px",lineHeight:1,borderRadius:"6px",flexShrink:0,minWidth:y?"44px":"auto",minHeight:y?"44px":"auto",display:"flex",alignItems:"center",justifyContent:"center"},children:"\xD7"})]}),s(G,{label:"\u267F Core Accessibility",concept:"Rule-based engine \u2014 works on all browsers and devices"}),s(Y,{steps:["Toggle any feature on","Click Apply settings","Preferences saved automatically"]}),s(C,{icon:"\u{1F527}",label:"Auto-fix ARIA",desc:"Injects missing labels and roles automatically",checked:t.autoFix,onChange:l=>o("autoFix",l),tip:"Fixes aria-label, alt text, roles on every element"}),s(v,{}),s(C,{icon:"\u{1F50A}",label:"Speak on focus",desc:"Browser reads elements aloud as you tab",checked:t.speechEnabled,onChange:l=>o("speechEnabled",l),tip:"Uses browser SpeechSynthesis \u2014 no install needed"}),s(v,{}),s(C,{icon:"\u{1F399}\uFE0F",label:"Voice control",desc:"Say commands to navigate the page",checked:t.voiceControl,onChange:l=>o("voiceControl",l),disabled:!r,disabledReason:"Not supported in this browser",tip:'Say "scroll down", "go to main", "click"'}),s(v,{}),s(G,{label:"\u{1F916} AI Features",color:"#7c3aed",badge:"Gemini Nano",concept:"Large Language Model running privately on your device \u2014 Chrome 127+ only"}),s("div",{style:{margin:"4px 18px 6px",padding:"8px 10px",background:n?"#f0fdfa":"#f5f3ff",borderRadius:"8px",border:`0.5px solid ${n?"#99f6e4":"#c4b5fd"}`,fontSize:"10px",color:n?"#0f766e":"#7c3aed",lineHeight:1.5},children:n?"\u2705 Gemini Nano detected \u2014 AI features ready. Runs privately on your device.":"\u2699\uFE0F AI features need one-time setup \u2014 see guide below."}),!n&&p("div",{style:{margin:"0 18px 8px",padding:"10px 12px",background:"#fafafa",borderRadius:"8px",border:"0.5px solid #e2e8f0",fontSize:"11px",color:"#475569",lineHeight:1.7},children:[s("p",{style:{margin:"0 0 6px",fontWeight:600,color:"#0f172a",fontSize:"11px"},children:"\u{1F6E0} One-time setup \u2014 5 steps:"}),p("p",{style:{margin:"0 0 3px"},children:["1. Open Chrome \u2192 ",s("code",{style:{background:"#f1f5f9",padding:"1px 5px",borderRadius:"4px",fontSize:"10px",color:"#0d9488",fontFamily:"monospace"},children:"chrome://flags"})]}),s("p",{style:{margin:"0 0 3px"},children:"2. Enable each flag:"}),s("div",{style:{display:"flex",flexDirection:"column",gap:"2px",margin:"4px 0 6px 10px"},children:Ot.map(l=>p("span",{style:{fontSize:"10px",color:"#7c3aed",fontFamily:"monospace"},children:["\u2192 ",l]},l))}),p("p",{style:{margin:"0 0 3px"},children:["3. Click ",s("strong",{style:{color:"#0f172a"},children:"Relaunch"})]}),p("p",{style:{margin:"0 0 3px"},children:["4. ",s("code",{style:{background:"#f1f5f9",padding:"1px 5px",borderRadius:"4px",fontSize:"10px",color:"#0d9488",fontFamily:"monospace"},children:"chrome://components"})," \u2192 Optimization Guide On Device Model \u2192 Check for update"]}),s("p",{style:{margin:"0"},children:"5. Refresh \u2014 AI features unlock automatically \u2705"})]}),s(C,{icon:"\u{1F4DD}",label:"Plain English mode",desc:"Rewrites complex text in simple language",checked:t.plainEnglish,onChange:l=>o("plainEnglish",l),disabled:!n,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: LLM text rewriting"}),s(v,{}),s(C,{icon:"\u{1F4CB}",label:"Summarise page",desc:"3-sentence summary appears at top",checked:t.summarisePage,onChange:l=>o("summarisePage",l),disabled:!n,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: Abstractive summarisation"}),s(v,{}),s(C,{icon:"\u{1F3F7}\uFE0F",label:"Smart aria-labels",desc:"AI generates meaningful labels for elements",checked:t.smartLabels,onChange:l=>o("smartLabels",l),disabled:!n,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: Context-aware label generation"}),s(v,{}),s(G,{label:"\u{1F441}\uFE0F Visual",concept:"CSS filter-based \u2014 works on all browsers and devices"}),s(Y,{steps:["Toggle any visual mode","Changes apply instantly","Works on mobile and desktop"]}),s(C,{icon:"\u25D1",label:"High contrast",desc:"Boosts contrast for low vision users",checked:t.highContrast,onChange:l=>o("highContrast",l),tip:"CSS filter: contrast()"}),s(v,{}),s(C,{icon:"\u{1F319}",label:"Dark mode",desc:"Inverts colours \u2014 easy on eyes at night",checked:t.darkMode,onChange:l=>o("darkMode",l),tip:"CSS filter: invert + hue-rotate"}),s(v,{}),s(C,{icon:"\u23F8\uFE0F",label:"Reduce motion",desc:"Disables all animations",checked:t.reduceMotion,onChange:l=>o("reduceMotion",l),tip:"WCAG 2.3.3 \u2014 vestibular disorders"}),s(v,{}),s(C,{icon:"\u{1F446}",label:"Large targets",desc:"44\xD744px minimum touch targets",checked:t.largeTargets,onChange:l=>o("largeTargets",l),tip:"WCAG 2.5.8 \u2014 motor impaired users"}),s(v,{}),p("div",{style:{padding:"10px 18px"},children:[s("p",{style:{margin:"0 0 2px",fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F3A8} Colour blindness"}),s("p",{style:{margin:"0 0 8px",fontSize:"10px",color:"#94a3b8"},children:"SVG colour matrix filters \u2014 all devices"}),s("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"},children:Nt.map(l=>s("button",{onClick:()=>o("colorBlindMode",l.value),"aria-pressed":t.colorBlindMode===l.value,style:{padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500,border:`1px solid ${t.colorBlindMode===l.value?"#0d9488":"#e2e8f0"}`,background:t.colorBlindMode===l.value?"#f0fdfa":"#fff",color:t.colorBlindMode===l.value?"#0d9488":"#64748b",cursor:"pointer",minHeight:y?"36px":"auto"},children:l.label},l.value))})]}),s(v,{}),s(G,{label:"\u{1F524} Font",concept:"Browser Font API + CSS \u2014 Chrome 103+"}),s(Y,{steps:["Toggle dyslexia font or pick from device","Adjust size with + / \u2212","Saved across visits"]}),s(C,{icon:"Aa",label:"Dyslexia-friendly font",desc:"Atkinson Hyperlegible \u2014 research-backed",checked:t.dyslexiaFont,onChange:l=>o("dyslexiaFont",l),tip:"By Braille Institute \u2014 free and open source"}),s(v,{}),p("div",{style:{padding:"10px 18px"},children:[s("p",{style:{margin:"0 0 2px",fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F5A5}\uFE0F Local font"}),s("p",{style:{margin:"0 0 8px",fontSize:"10px",color:"#94a3b8"},children:"window.queryLocalFonts() \u2014 Chrome 103+"}),J.length>0?p("select",{value:t.localFont,onChange:l=>o("localFont",l.target.value),"aria-label":"Choose a font from your device",style:{width:"100%",padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"13px",color:"#0f172a",background:"#fff",cursor:"pointer",height:y?"44px":"36px"},children:[s("option",{value:"",children:"System default"}),J.map(l=>s("option",{value:l,style:{fontFamily:l},children:l},l))]}):s("p",{style:{margin:0,fontSize:"11px",color:"#94a3b8"},children:"Allow font access when Chrome prompts you."})]}),s(v,{}),p("div",{style:{padding:"10px 18px 14px"},children:[p("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"10px"},children:[p("div",{children:[s("p",{style:{margin:0,fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F4CF} Text size"}),s("p",{style:{margin:0,fontSize:"10px",color:"#94a3b8"},children:"Scales all text on the page"})]}),p("span",{style:{fontSize:"12px",fontWeight:600,color:"#0d9488",background:"#f0fdfa",padding:"2px 8px",borderRadius:"99px"},children:[t.fontScale,"%"]})]}),p("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[s("button",{onClick:()=>{let l=D.indexOf(t.fontScale);l>0&&o("fontScale",D[l-1])},disabled:t.fontScale<=80,"aria-label":"Decrease text size",style:{width:y?"44px":"30px",height:y?"44px":"30px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:t.fontScale<=80?"not-allowed":"pointer",fontSize:"16px",color:t.fontScale<=80?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"\u2212"}),s("div",{style:{flex:1,display:"flex",gap:"3px"},children:D.map(l=>s("button",{onClick:()=>o("fontScale",l),"aria-label":`Set text size to ${l}%`,style:{flex:1,height:"6px",borderRadius:"99px",border:"none",cursor:"pointer",padding:0,background:l<=t.fontScale?"#0d9488":"#e2e8f0",transition:"background 0.15s"}},l))}),s("button",{onClick:()=>{let l=D.indexOf(t.fontScale);l<D.length-1&&o("fontScale",D[l+1])},disabled:t.fontScale>=130,"aria-label":"Increase text size",style:{width:y?"44px":"30px",height:y?"44px":"30px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:t.fontScale>=130?"not-allowed":"pointer",fontSize:"16px",color:t.fontScale>=130?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"+"})]})]}),s(v,{}),s(G,{label:"\u{1F310} Translate",color:"#7c3aed",badge:"Gemini Nano",concept:"Chrome Translation API \u2014 on device, no internet after setup"}),s(Y,{steps:["Enable Gemini Nano first","Pick your language","Full page translates instantly"]}),p("div",{style:{padding:"6px 18px 12px"},children:[s("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"},children:ee.slice(0,y?8:18).map(l=>s("button",{onClick:()=>o("translateLanguage",l.code),"aria-pressed":t.translateLanguage===l.code,disabled:!n,style:{padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500,border:`1px solid ${t.translateLanguage===l.code?"#7c3aed":"#e2e8f0"}`,background:t.translateLanguage===l.code?"#f5f3ff":"#fff",color:t.translateLanguage===l.code?"#7c3aed":"#64748b",cursor:n?"pointer":"not-allowed",opacity:n?1:.5,minHeight:y?"36px":"auto"},children:l.label},l.code))}),!n&&s("p",{style:{margin:"6px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Enable Gemini Nano using the setup guide above."})]}),s(v,{}),s(G,{label:"\u{1F4AC} Ask This Page",color:"#0d9488",badge:X,concept:"RAG \u2014 Retrieval Augmented Generation. Works on all devices including mobile."}),s(Y,{steps:["Type any question about this page","Press Ask or hit Enter",f==="transformers"?"Transformers.js answers \u2014 works on mobile, offline":"Gemini Nano reads page and answers privately","Zero cost. No data leaves your device."]}),p("div",{style:{margin:"0 18px 8px",padding:"6px 10px",background:f==="gemini"?"#f0fdfa":f==="transformers"?"#f5f3ff":"#f8fafc",borderRadius:"8px",border:`0.5px solid ${f==="gemini"?"#99f6e4":f==="transformers"?"#c4b5fd":"#e2e8f0"}`,fontSize:"10px",color:f==="gemini"?"#0f766e":f==="transformers"?"#7c3aed":"#94a3b8"},children:[f==="gemini"&&"\u2705 Using Gemini Nano \u2014 on device, private, instant",f==="transformers"&&"\u2705 Using Transformers.js \u2014 works on mobile and all browsers",!f&&"\u23F3 Detecting AI engine...",f==="transformers"&&S==="loading"&&" \xB7 Loading model...",f==="transformers"&&S==="ready"&&" \xB7 Model ready \u2705"]}),p("div",{style:{padding:"0 18px 14px"},children:[p("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[s("input",{type:"text",value:M,onChange:l=>F(l.target.value),onKeyDown:l=>{l.key==="Enter"&&j()},placeholder:"e.g. What does this page do?",disabled:h||!f,"aria-label":"Ask a question about this page",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:f?"#fff":"#f8fafc",outline:"none",height:y?"44px":"36px"}}),s("button",{onClick:j,disabled:h||!M.trim()||!f,"aria-label":"Ask question",style:{padding:"8px 14px",borderRadius:"8px",border:"none",background:f&&M.trim()&&!h?"#0d9488":"#e2e8f0",color:f&&M.trim()&&!h?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:f&&M.trim()&&!h?"pointer":"not-allowed",flexShrink:0,height:y?"44px":"36px",minWidth:"52px",transition:"background 0.2s"},children:h?ue:"Ask"})]}),z&&p("div",{role:"status","aria-live":"polite",style:{padding:"10px 12px",background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"8px",fontSize:"12px",color:"#0f766e",lineHeight:1.6,maxHeight:"180px",overflowY:"auto"},children:[s("strong",{style:{display:"block",marginBottom:"4px",fontSize:"11px",color:"#0d9488"},children:"\u{1F4AC} Answer"}),z,s("button",{onClick:()=>{R(""),F("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]})]}),a&&s("div",{role:"status",style:{margin:"0 14px 10px",padding:"8px 12px",background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"8px",fontSize:"12px",color:"#0f766e",fontWeight:500,fontFamily:"monospace"},children:a.fixed>0?`\u2713 ${a.fixed} fixes \xB7 ${a.scanned} nodes \xB7 ${a.renderTime}ms \xB7 Score: ${a.score}/100`:`\u2713 0 auto-fixes needed \xB7 ${a.scanned} nodes \xB7 ${a.renderTime}ms`}),p("div",{style:{display:"flex",gap:"8px",padding:"12px 14px 14px",position:y?"sticky":"relative",bottom:y?0:"auto",background:"#fff",borderTop:"1px solid #f1f5f9"},children:[s("button",{onClick:g,style:{flex:1,padding:y?"12px 0":"8px 0",fontSize:"13px",fontWeight:500,borderRadius:"9px",border:"1px solid #e2e8f0",background:"#fff",color:"#64748b",cursor:"pointer"},children:"Reset"}),s("button",{onClick:c,style:{flex:2,padding:y?"12px 0":"8px 0",fontSize:"13px",fontWeight:600,borderRadius:"9px",border:"none",background:"#0d9488",color:"#fff",cursor:"pointer"},children:"Apply settings"})]})]})});Ee.displayName="WidgetPanel";import{Fragment as Vt,jsx as L,jsxs as _}from"react/jsx-runtime";async function _t(){try{if(typeof window>"u")return!1;let e=window;if(e.LanguageModel)try{if(typeof e.LanguageModel.availability=="function"){let a=await e.LanguageModel.availability();if(console.log("yuktai: LanguageModel.availability() =",a),a==="readily"||a==="available"||a==="downloadable")return!0}else return!0}catch{}if(e.Summarizer)try{if(typeof e.Summarizer.availability=="function"){let a=await e.Summarizer.availability();if(a==="readily"||a==="available")return!0}else return!0}catch{}if(e.Rewriter)try{if(typeof e.Rewriter.availability=="function"){let a=await e.Rewriter.availability();if(a==="readily"||a==="available")return!0}else return!0}catch{}if(e.Writer)try{if(typeof e.Writer.availability=="function"){let a=await e.Writer.availability();if(a==="readily"||a==="available")return!0}else return!0}catch{}let t=e.ai||globalThis.ai;if(t){if(t.languageModel?.availability)try{let a=await t.languageModel.availability();if(a==="readily"||a==="downloadable"||a==="available")return!0}catch{}if(t.languageModel?.capabilities)try{let a=await t.languageModel.capabilities();if(a?.available==="readily"||a?.available==="after-download")return!0}catch{}if(t.languageModel&&typeof t.languageModel.create=="function")return!0;if(t.summarizer?.capabilities)try{if((await t.summarizer.capabilities())?.available!=="no")return!0}catch{}if(t.rewriter?.capabilities)try{if((await t.rewriter.capabilities())?.available!=="no")return!0}catch{}if(t.writer?.capabilities)try{if((await t.writer.capabilities())?.available!=="no")return!0}catch{}if(t.summarizer||t.rewriter||t.writer||t.languageModel)return!0}return!!(e.Translator||e.translation?.canTranslate)}catch{return!1}}function Ce({position:e="left",children:t,config:a={},showRag:i=!1}){let[n,r]=P(!1),[o,c]=P(Te),[g,u]=P(null),[w,y]=P(!1),[A,J]=P(!1),[de,M]=P(!1),F=Gt.useRef(null),[z,R]=P(!1),[h,V]=P(""),[f,I]=P(""),[S,$]=P(!1),j=U(async()=>{if(!(!h.trim()||S||!A)){$(!0),I("");try{let{askPage:d}=await import("./rag-HDO3PUIJ.mjs"),x=await d(h);I(x.success?x.answer.replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/#+\s/g,"").trim():"\u26A0\uFE0F "+(x.error||"No answer found."))}catch{I("\u26A0\uFE0F Something went wrong.")}$(!1)}},[h,S,A]);se(()=>{if(typeof window>"u")return;let x=setTimeout(async()=>{let k=window;console.log("yuktai: Checking AI APIs..."),console.log("yuktai: window.ai =",k.ai),console.log("yuktai: window.LanguageModel =",k.LanguageModel),console.log("yuktai: window.Summarizer =",k.Summarizer),console.log("yuktai: window.Rewriter =",k.Rewriter),console.log("yuktai: window.Writer =",k.Writer);let Le=await _t();J(Le),Le?console.log("yuktai: Chrome Built-in AI detected \u2705"):(console.log("yuktai: Chrome Built-in AI not detected \u274C"),console.log("yuktai: Enable flags at chrome://flags and download model at chrome://components"));let lt=!!(k.SpeechRecognition||k.webkitSpeechRecognition);M(lt)},800);return()=>clearTimeout(x)},[]),se(()=>{if(!(typeof window>"u"))try{let d=localStorage.getItem("yuktai-a11y-prefs");if(d){let x=JSON.parse(d);c(k=>({...k,...x}))}}catch{}},[]);let X=U(async d=>{let x={enabled:!0,highContrast:d.highContrast,darkMode:d.darkMode,reduceMotion:d.reduceMotion,largeTargets:d.largeTargets,speechEnabled:d.speechEnabled,autoFix:d.autoFix,dyslexiaFont:d.dyslexiaFont,localFont:d.localFont,fontSizeMultiplier:d.fontScale/100,colorBlindMode:d.colorBlindMode,showAuditBadge:d.showAuditBadge,showSkipLinks:!0,showPreferencePanel:!1,plainEnglish:d.plainEnglish,summarisePage:d.summarisePage,translateLanguage:d.translateLanguage,voiceControl:d.voiceControl,smartLabels:d.smartLabels,...a};await E.execute(x);let k=E.applyFixes(x);u(k),y(!0)},[a]),ue=U(async()=>{try{localStorage.setItem("yuktai-a11y-prefs",JSON.stringify(o))}catch{}await X(o),r(!1)},[o,X]),pe=U(()=>{c(Te);try{localStorage.removeItem("yuktai-a11y-prefs")}catch{}let d=document.documentElement;["data-yuktai-high-contrast","data-yuktai-dark","data-yuktai-reduce-motion","data-yuktai-large-targets","data-yuktai-keyboard","data-yuktai-dyslexia"].forEach(x=>d.removeAttribute(x)),document.body.style.filter="",document.body.style.fontFamily="",document.documentElement.style.fontSize="",u(null),y(!1)},[]),l=U((d,x)=>{c(k=>({...k,[d]:x}))},[]);se(()=>{let d=x=>{x.key==="Escape"&&(n&&r(!1),z&&R(!1))};return window.addEventListener("keydown",d),()=>window.removeEventListener("keydown",d)},[n,z]),se(()=>{n&&F.current&&E.trapFocus(F.current)},[n]);let K={position:"fixed",bottom:"24px",[e]:"24px",zIndex:9998,width:"52px",height:"52px",borderRadius:"50%",background:w?"#0d9488":"#1a73e8",color:"#fff",border:"none",cursor:"pointer",fontSize:"22px",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,0,0,0.25)",transition:"transform 0.15s, background 0.2s"},fe={position:"fixed",bottom:"84px",[e]:"24px",zIndex:9998,width:"52px",height:"52px",borderRadius:"50%",background:z?"#7c3aed":"#6d28d9",color:"#fff",border:"none",cursor:"pointer",fontSize:"22px",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,0,0,0.25)",transition:"transform 0.15s, background 0.2s"};return _(Vt,{children:[t,i&&L("button",{style:fe,"aria-label":"Ask a question about this page","aria-haspopup":"dialog","aria-expanded":z,onClick:()=>{R(d=>!d),r(!1)},onMouseEnter:d=>{d.currentTarget.style.transform="scale(1.08)"},onMouseLeave:d=>{d.currentTarget.style.transform="scale(1)"},children:"\u{1F4AC}"}),i&&z&&_("div",{role:"dialog","aria-modal":"true","aria-label":"Ask this page","data-yuktai-panel":"true",style:{position:"fixed",bottom:"148px",[e]:"24px",zIndex:9999,width:"300px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",fontFamily:"system-ui,-apple-system,sans-serif",padding:"14px"},children:[_("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"},children:[_("div",{children:[L("p",{style:{margin:"0 0 2px",fontSize:"13px",fontWeight:600,color:"#0f172a"},children:"\u{1F4AC} Ask this page"}),L("p",{style:{margin:0,fontSize:"10px",color:"#7c3aed"},children:"Gemini Nano \xB7 On device \xB7 Zero cost"})]}),L("button",{onClick:()=>R(!1),"aria-label":"Close ask panel",style:{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"18px",lineHeight:1,padding:"2px",borderRadius:"4px"},children:"\xD7"})]}),_("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[L("input",{type:"text",value:h,onChange:d=>V(d.target.value),onKeyDown:d=>{d.key==="Enter"&&j()},placeholder:"e.g. What does this page do?",disabled:!A||S,"aria-label":"Ask a question about this page",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:A?"#fff":"#f8fafc",outline:"none",height:"36px"}}),L("button",{onClick:j,disabled:!A||S||!h.trim(),"aria-label":"Submit question",style:{padding:"8px 12px",borderRadius:"8px",border:"none",background:A&&h.trim()&&!S?"#7c3aed":"#e2e8f0",color:A&&h.trim()&&!S?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:A&&h.trim()&&!S?"pointer":"not-allowed",height:"36px",minWidth:"48px",transition:"background 0.2s"},children:S?"...":"Ask"})]}),f&&_("div",{style:{padding:"10px",background:"#f5f3ff",borderRadius:"8px",fontSize:"12px",color:"#4c1d95",lineHeight:1.6,maxHeight:"180px",overflowY:"auto"},children:[L("strong",{style:{display:"block",marginBottom:"4px",fontSize:"11px",color:"#7c3aed"},children:"\u{1F4AC} Answer"}),f,L("button",{onClick:()=>{I(""),V("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]}),!A&&L("p",{style:{margin:"4px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Enable Gemini Nano via chrome://flags to use this feature."})]}),L("button",{style:K,"aria-label":"Open accessibility preferences","aria-haspopup":"dialog","aria-expanded":n,"data-yuktai-pref-toggle":"true",onClick:()=>{r(d=>!d),R(!1)},onMouseEnter:d=>{d.currentTarget.style.transform="scale(1.08)"},onMouseLeave:d=>{d.currentTarget.style.transform="scale(1)"},children:"\u267F"}),n&&L(Ee,{ref:F,position:e,settings:o,report:g,isActive:w,aiSupported:A,voiceSupported:de,set:l,onApply:ue,onReset:pe,onClose:()=>r(!1)})]})}var le={name:"ai.text",async execute(e){return`\u{1F916} YuktAI says: ${e}`}};var ce={name:"voice.text",async execute(e){return!e||e.trim()===""?"\u{1F3A4} No speech detected":`\u{1F3A4} You said: ${e}`}};var H=class{plugins=new Map;register(t,a){if(!a||typeof a.execute!="function")throw new Error(`Invalid plugin: ${t}`);this.plugins.set(t,a)}use(t){return this.plugins.get(t)}async run(t,a){try{let i=this.use(t);if(!i)throw new Error(`Plugin not found: ${t}`);return await i.execute(a)}catch(i){throw console.error(`[YuktAI Runtime Error in ${t}]:`,i),i}}getPlugins(){return Array.from(this.plugins.keys())}};function jt(){if(typeof globalThis>"u")return new H;if(!globalThis.__yuktai_runtime__){let e=new H;e.register(E.name,E),e.register(le.name,le),e.register(ce.name,ce),globalThis.__yuktai_runtime__=e}return globalThis.__yuktai_runtime__}var st=typeof window<"u"?jt():new H,Ea={wcagPlugin:E,list(){return st.getPlugins()},use(e){return st.use(e)},fix(e){return E.applyFixes({enabled:!0,autoFix:!0,...e})},scan(){return E.scan()}};export{H as Runtime,Ea as YuktAI,Ce as YuktAIWrapper,le as aiPlugin,Ce as default,ce as voicePlugin,E as wcag,E as wcagPlugin};
