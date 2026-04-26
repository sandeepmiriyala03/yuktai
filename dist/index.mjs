function ue(){let e=window;return e.Rewriter||e.ai?.rewriter||null}async function X(){try{let e=ue();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}async function _e(e){if(!e||e.trim().length<20)return{success:!1,original:e,rewritten:e,error:"Text too short"};try{let t=ue();if(!t)throw new Error("Rewriter API not available");let a=await t.create({tone:"more-casual",format:"plain-text",length:"as-is",outputLanguage:"en"}),i=await a.rewrite(e,{context:"Rewrite this text in simple plain English. Use short sentences. Avoid jargon. Make it easy to understand for everyone."});return a.destroy(),{success:!0,original:e,rewritten:i.trim()}}catch(t){return{success:!1,original:e,rewritten:e,error:t instanceof Error?t.message:"Rewrite failed"}}}async function pe(){if(!await X())return{fixed:0,error:"Chrome Built-in AI Rewriter not available. Enable via chrome://flags."};let t=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption"),a=0;for(let i of t){let n=i.innerText?.trim();if(!n||n.length<20||i.closest("[data-yuktai-panel]"))continue;let s=await _e(n);s.success&&s.rewritten!==n&&(i.dataset.yuktaiOriginal=n,i.innerText=s.rewritten,a++)}return{fixed:a}}function fe(){let e=document.querySelectorAll("[data-yuktai-original]");for(let t of e){let a=t.dataset.yuktaiOriginal;a&&(t.innerText=a,delete t.dataset.yuktaiOriginal)}}var me="yuktai-summary-box";function be(){let e=window;return e.Summarizer||e.ai?.summarizer||null}async function Z(){try{let e=be();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}function De(){let e=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, article, section"),t=[];for(let a of e){if(a.closest("[data-yuktai-panel]"))continue;let i=window.getComputedStyle(a);if(i.display==="none"||i.visibility==="hidden")continue;let n=a.innerText?.trim();n&&n.length>10&&t.push(n)}return t.join(" ").slice(0,5e3)}async function ge(){if(!await Z())return{success:!1,summary:"",error:"Chrome Built-in AI Summarizer not available. Enable via chrome://flags."};let t=De();if(!t||t.length<100)return{success:!1,summary:"",error:"Not enough text on this page to summarise."};try{let a=be();if(!a)throw new Error("Summarizer API not available");let i=await a.create({type:"tl;dr",format:"plain-text",length:"short",outputLanguage:"en"}),n=await i.summarize(t,{context:"Summarise this page in 2-3 simple sentences for a screen reader user who wants to know if this page is relevant to them."});return i.destroy(),qe(n.trim()),{success:!0,summary:n.trim()}}catch(a){return{success:!1,summary:"",error:a instanceof Error?a.message:"Summary failed"}}}function qe(e){I();let t=document.createElement("div");t.id=me,t.setAttribute("data-yuktai-panel","true"),t.setAttribute("role","region"),t.setAttribute("aria-label","Page summary by yuktai"),t.style.cssText=`
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
  `,i.addEventListener("click",I),t.appendChild(a),t.appendChild(i),document.body.prepend(t)}function I(){let e=document.getElementById(me);e&&e.remove()}var $=[{code:"en",label:"English"},{code:"hi",label:"Hindi"},{code:"es",label:"Spanish"},{code:"fr",label:"French"},{code:"de",label:"German"},{code:"it",label:"Italian"},{code:"pt",label:"Portuguese"},{code:"nl",label:"Dutch"},{code:"pl",label:"Polish"},{code:"ru",label:"Russian"},{code:"ja",label:"Japanese"},{code:"ko",label:"Korean"},{code:"zh",label:"Chinese"},{code:"ar",label:"Arabic"},{code:"tr",label:"Turkish"},{code:"vi",label:"Vietnamese"},{code:"bn",label:"Bengali"},{code:"id",label:"Indonesian"}],H="en";function Ge(){let e=window;return e.Translator||e.translation||null}async function Ve(e){try{let t=window;if(!Ge())return!1;if(t.Translator&&typeof t.Translator.availability=="function")try{let i=await t.Translator.availability({sourceLanguage:"en",targetLanguage:e});return i==="readily"||i==="available"||i==="downloadable"||i==="after-download"}catch{}return t.Translator&&typeof t.Translator.canTranslate=="function"?await t.Translator.canTranslate({sourceLanguage:"en",targetLanguage:e})!=="no":t.translation&&typeof t.translation.canTranslate=="function"?await t.translation.canTranslate({sourceLanguage:"en",targetLanguage:e})!=="no":!1}catch{return!1}}async function je(e){let t=window,a={sourceLanguage:"en",targetLanguage:e};if(t.Translator&&typeof t.Translator.create=="function")return await t.Translator.create(a);if(t.translation&&typeof t.translation.createTranslator=="function")return await t.translation.createTranslator(a);throw new Error("Translation API not available")}async function ye(e){if(e===H)return{success:!0,language:e,fixed:0};if(e==="en")return Q(),H="en",{success:!0,language:"en",fixed:0};if(!await Ve(e))return{success:!1,language:e,fixed:0,error:`Translation to ${e} not available. Enable via chrome://flags.`};try{let a=await je(e),i=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption, span, a"),n=0;for(let s of i){if(s.closest("[data-yuktai-panel]")||s.children.length>0)continue;let o=s.innerText?.trim();if(!o||o.length<2)continue;s.dataset.yuktaiTranslationOriginal||(s.dataset.yuktaiTranslationOriginal=o);let c=await a.translate(o);c&&c!==o&&(s.innerText=c,n++)}return typeof a.destroy=="function"&&a.destroy(),H=e,{success:!0,language:e,fixed:n}}catch(a){return{success:!1,language:e,fixed:0,error:a instanceof Error?a.message:"Translation failed"}}}function Q(){let e=document.querySelectorAll("[data-yuktai-translation-original]");for(let t of e){let a=t.dataset.yuktaiTranslationOriginal;a&&(t.innerText=a,delete t.dataset.yuktaiTranslationOriginal)}H="en"}var Ke=[{phrases:["go to main","skip to main","main content"],action:"focus-main",label:"Jump to main content"},{phrases:["go to navigation","go to nav","open menu"],action:"focus-nav",label:"Jump to navigation"},{phrases:["go to search","search","find"],action:"focus-search",label:"Jump to search"},{phrases:["scroll down","page down","next"],action:"scroll-down",label:"Scroll down"},{phrases:["scroll up","page up","back up"],action:"scroll-up",label:"Scroll up"},{phrases:["go back","previous page"],action:"go-back",label:"Go back"},{phrases:["click","press","select"],action:"click-focused",label:"Click focused element"},{phrases:["next item","tab forward","tab"],action:"tab-forward",label:"Move to next element"},{phrases:["previous item","tab back","shift tab"],action:"tab-back",label:"Move to previous element"},{phrases:["stop listening","stop voice","quiet"],action:"stop-voice",label:"Stop voice control"}],v=null,F=!1,E=null;function ee(){return!!(window.SpeechRecognition||window.webkitSpeechRecognition)}function Ye(e){let t=e.toLowerCase().trim();for(let a of Ke)for(let i of a.phrases)if(t.includes(i))return{action:a.action,label:a.label};return null}function Ue(e){switch(e){case"focus-main":{let t=document.querySelector("main, [role='main'], #main");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-nav":{let t=document.querySelector("nav, [role='navigation']");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-search":{let t=document.querySelector("input[type='search'], input[role='searchbox'], [aria-label*='search' i]");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"scroll-down":{window.scrollBy({top:400,behavior:"smooth"});break}case"scroll-up":{window.scrollBy({top:-400,behavior:"smooth"});break}case"go-back":{window.history.back();break}case"click-focused":{let t=document.activeElement;t&&t!==document.body&&t.click();break}case"tab-forward":{let t=xe(),a=t.indexOf(document.activeElement),i=t[a+1]||t[0];i&&i.focus();break}case"tab-back":{let t=xe(),a=t.indexOf(document.activeElement),i=t[a-1]||t[t.length-1];i&&i.focus();break}case"stop-voice":{te();break}}}function xe(){return Array.from(document.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(e=>!e.closest("[data-yuktai-panel]"))}function he(e){if(!ee())return!1;if(F)return!0;e&&(E=e);let t=window.SpeechRecognition||window.webkitSpeechRecognition;return v=new t,v.continuous=!0,v.interimResults=!1,v.lang="en-US",v.onresult=a=>{let i=a.results[a.results.length-1][0].transcript,n=Ye(i);if(n){Ue(n.action);let s={success:!0,command:i,action:n.label};if(E&&E(s),n.action==="stop-voice")return}},v.onend=()=>{F&&v?.start()},v.onerror=a=>{a.error!=="no-speech"&&E&&E({success:!1,command:"",action:"",error:`Voice error: ${a.error}`})},v.start(),F=!0,Je(),!0}function te(){F=!1,v&&(v.stop(),v=null),E=null,ve()}var we="yuktai-voice-indicator";function Je(){ve();let e=document.createElement("div");e.id=we,e.setAttribute("data-yuktai-panel","true"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-label","yuktai voice control is listening"),e.style.cssText=`
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
    `,document.head.appendChild(i)}let a=document.createElement("span");a.textContent="Listening for commands...",e.appendChild(t),e.appendChild(a),document.body.appendChild(e)}function ve(){let e=document.getElementById(we);e&&e.remove()}var Xe=["button:not([aria-label]):not([aria-labelledby])","a:not([aria-label]):not([aria-labelledby])","input:not([aria-label]):not([aria-labelledby]):not([id])","select:not([aria-label]):not([aria-labelledby])","textarea:not([aria-label]):not([aria-labelledby])","[role='button']:not([aria-label])","[role='link']:not([aria-label])","[role='checkbox']:not([aria-label])","[role='tab']:not([aria-label])"].join(", ");function ke(){let e=window;return e.Writer||e.ai?.writer||null}async function ae(){try{let e=ke();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}function Ze(e){let t=[],a=e.innerText?.trim();a&&t.push(`element text: "${a}"`);let i=e.placeholder?.trim();i&&t.push(`placeholder: "${i}"`);let n=e.getAttribute("name")?.trim();n&&t.push(`name: "${n}"`);let s=e.getAttribute("type")?.trim();s&&t.push(`type: "${s}"`);let o=e.id;if(o){let u=document.querySelector(`label[for="${o}"]`);u&&t.push(`label: "${u.innerText?.trim()}"`)}let c=e.parentElement?.innerText?.trim().slice(0,60);c&&t.push(`parent context: "${c}"`),t.push(`tag: ${e.tagName.toLowerCase()}`);let m=e.getAttribute("role");return m&&t.push(`role: ${m}`),t.join(". ")}async function Qe(e,t){let a=`
    Generate a short, clear aria-label for an HTML element.
    The label must be 2-6 words maximum.
    The label must describe what the element does or what it is.
    Do not include punctuation.
    Do not explain \u2014 just output the label text only.

    Element details:
    ${t}

    Output only the label. Nothing else.
  `.trim();return(await e.write(a)).trim().replace(/^["']|["']$/g,"").replace(/\.$/,"").trim()}async function Ae(){if(!await ae())return{success:!1,fixed:0,elements:[],error:"Chrome Built-in AI Writer not available. Enable via chrome://flags."};let t=document.querySelectorAll(Xe);if(t.length===0)return{success:!0,fixed:0,elements:[]};try{let a=ke();if(!a)throw new Error("Writer API not available");let i=await a.create({tone:"neutral",format:"plain-text",length:"short",outputLanguage:"en"}),n=0,s=[];for(let o of t){if(o.closest("[data-yuktai-panel]"))continue;let c=window.getComputedStyle(o);if(c.display==="none"||c.visibility==="hidden")continue;let m=Ze(o),u=await Qe(i,m);u&&u.length>0&&(o.dataset.yuktaiLabelOriginal=o.getAttribute("aria-label")||"",o.setAttribute("aria-label",u),n++,s.push({tag:o.tagName.toLowerCase(),label:u}))}return i.destroy(),{success:!0,fixed:n,elements:s}}catch(a){return{success:!1,fixed:0,elements:[],error:a instanceof Error?a.message:"Label generation failed"}}}function Se(){let e=document.querySelectorAll("[data-yuktai-label-original]");for(let t of e){let a=t.dataset.yuktaiLabelOriginal;a?t.setAttribute("aria-label",a):t.removeAttribute("aria-label"),delete t.dataset.yuktaiLabelOriginal}}var N=null,Ee=null;var Te=null,oe=null,b=null,T=null,W=null,ie=null,C=null,B={deuteranopia:"yuktai-cb-d",protanopia:"yuktai-cb-p",tritanopia:"yuktai-cb-t"};var Ce=new Set(["input","select","textarea"]);var ne={nav:"navigation",header:"banner",footer:"contentinfo",main:"main",aside:"complementary"};function re(e,t="polite"){if(typeof window>"u"||!C?.speechEnabled||!window.speechSynthesis)return;window.speechSynthesis.cancel();let a=new SpeechSynthesisUtterance(e);a.rate=1,a.pitch=1,a.volume=1;let i=window.speechSynthesis.getVoices();i.length>0&&(a.voice=i[0]),window.speechSynthesis.speak(a)}function He(e,t="info"){if(typeof document>"u")return;let i={success:{bg:"#0f9d58",border:"#0a7a44",icon:"\u2713"},error:{bg:"#d93025",border:"#b52a1c",icon:"\u2715"},warning:{bg:"#f29900",border:"#c67c00",icon:"\u26A0"},info:{bg:"#1a73e8",border:"#1557b0",icon:"\u2139"}}[t];b||(b=document.createElement("div"),b.setAttribute("role","alert"),b.setAttribute("aria-live","assertive"),b.setAttribute("aria-atomic","true"),b.style.cssText=`
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
  `,window.innerWidth<=480&&(b.style.right="8px",b.style.left="8px",b.style.maxWidth="none",b.style.width="auto"),requestAnimationFrame(()=>{b&&(b.style.transform="translateX(0)",b.style.opacity="1")}),setTimeout(()=>{b&&(b.style.transform="translateX(120%)",b.style.opacity="0")},5e3)}function p(e,t="info",a=!0){N&&(N.textContent=e),He(e,t),a&&re(e,t==="error"?"assertive":"polite")}function et(){if(typeof document>"u"||Te)return;let e=[{label:"Skip to main content",selector:"main,[role='main'],#main,#main-content"},{label:"Skip to navigation",selector:"nav,[role='navigation'],#nav,#navigation"},{label:"Skip to search",selector:"[role='search'],#search,input[type='search']"}],t=document.createElement("div");t.setAttribute("data-yuktai-skip-bar","true"),t.setAttribute("role","navigation"),t.setAttribute("aria-label","Skip links"),t.style.cssText=`
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
  `;let a=!1;if(e.forEach(({label:n,selector:s})=>{let o=document.querySelector(s);if(!o)return;a=!0,o.getAttribute("tabindex")||o.setAttribute("tabindex","-1");let c=document.createElement("a");c.href="#",c.textContent=n,c.style.cssText=`
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
    `,c.addEventListener("focus",()=>{t.style.transform="translateY(0)"}),c.addEventListener("blur",()=>{setTimeout(()=>{t.matches(":focus-within")||(t.style.transform="translateY(-100%)")},2e3)}),c.addEventListener("click",m=>{m.preventDefault(),o.focus(),o.scrollIntoView({behavior:"smooth",block:"start"}),p(`Jumped to ${n.replace("Skip to ","")}`,"info"),t.style.transform="translateY(-100%)"}),t.appendChild(c)}),!a)return;window.innerWidth<768&&(t.style.transform="translateY(0)",t.style.position="sticky"),window.addEventListener("resize",()=>{window.innerWidth<768&&(t.style.transform="translateY(0)")}),document.body.insertBefore(t,document.body.firstChild),Te=t}function tt(){if(typeof document>"u"||document.querySelector("[data-yuktai-focus-style]"))return;let e=document.createElement("style");e.setAttribute("data-yuktai-focus-style","true"),e.textContent=`

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
  `,document.head.appendChild(e),document.documentElement.setAttribute("data-yuktai-a11y","true")}function at(){typeof document>"u"||document.querySelector("[data-yuktai-kb-init]")||(document.documentElement.setAttribute("data-yuktai-kb-init","true"),document.addEventListener("keydown",e=>{let t=document.activeElement;if(!t)return;let a=t.getAttribute("role")||"";if(e.key==="Escape"){let i=t.closest("[role='dialog'],[role='alertdialog']");if(i){i.style.display="none",p("Dialog closed","info");return}let n=t.closest("[role='menu'],[role='menubar']");n&&(n.style.display="none",p("Menu closed","info"))}if(a==="menuitem"||t.closest("[role='menu'],[role='menubar']")){let i=t.closest("[role='menu'],[role='menubar']");if(!i)return;let n=Array.from(i.querySelectorAll("[role='menuitem']:not([disabled])")),s=n.indexOf(t);e.key==="ArrowDown"||e.key==="ArrowRight"?(e.preventDefault(),n[(s+1)%n.length]?.focus()):e.key==="ArrowUp"||e.key==="ArrowLeft"?(e.preventDefault(),n[(s-1+n.length)%n.length]?.focus()):e.key==="Home"?(e.preventDefault(),n[0]?.focus()):e.key==="End"&&(e.preventDefault(),n[n.length-1]?.focus())}if(a==="tab"||t.closest("[role='tablist']")){let i=t.closest("[role='tablist']");if(!i)return;let n=Array.from(i.querySelectorAll("[role='tab']:not([disabled])")),s=n.indexOf(t);if(e.key==="ArrowRight"||e.key==="ArrowDown"){e.preventDefault();let o=n[(s+1)%n.length];o?.focus(),o?.click()}else if(e.key==="ArrowLeft"||e.key==="ArrowUp"){e.preventDefault();let o=n[(s-1+n.length)%n.length];o?.focus(),o?.click()}}if(a==="option"||t.closest("[role='listbox']")){let i=t.closest("[role='listbox']");if(!i)return;let n=Array.from(i.querySelectorAll("[role='option']:not([aria-disabled='true'])")),s=n.indexOf(t);e.key==="ArrowDown"?(e.preventDefault(),n[(s+1)%n.length]?.focus()):e.key==="ArrowUp"?(e.preventDefault(),n[(s-1+n.length)%n.length]?.focus()):(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),t.setAttribute("aria-selected","true"),n.forEach(o=>{o!==t&&o.setAttribute("aria-selected","false")}),p(`Selected: ${t.textContent?.trim()}`,"success"))}e.altKey&&e.key==="a"&&(e.preventDefault(),ot()),e.key==="Tab"&&C?.speechEnabled&&setTimeout(()=>{let i=document.activeElement;if(!i)return;let n=i.getAttribute("aria-label")||i.getAttribute("title")||i.textContent?.trim()||i.tagName.toLowerCase(),s=i.getAttribute("role")||i.tagName.toLowerCase();re(`${n}, ${s}`)},100)}))}function O(e){let t=e.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[role="button"]');if(t.length===0)return;let a=t[0],i=t[t.length-1];a.focus(),e.addEventListener("keydown",n=>{n.key==="Tab"&&(n.shiftKey?document.activeElement===a&&(n.preventDefault(),i.focus()):document.activeElement===i&&(n.preventDefault(),a.focus()))})}function ot(){if(typeof document>"u")return;if(T){T.remove(),T=null;return}let e=document.createElement("div");e.setAttribute("role","dialog"),e.setAttribute("aria-label","Keyboard shortcuts"),e.setAttribute("aria-modal","true"),e.setAttribute("data-yuktai-cheatsheet","true"),e.style.cssText=`
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
  `,e.querySelector("[data-yuktai-close]")?.addEventListener("click",()=>{e.remove(),T=null}),e.addEventListener("keydown",i=>{i.key==="Escape"&&(e.remove(),T=null)}),document.body.appendChild(e),T=e,O(e),p("Keyboard shortcuts opened. Press Escape to close.","info")}function it(e){if(typeof document>"u"||!C?.showAuditBadge||typeof window<"u"&&!window.location.hostname.includes("localhost")&&!window.location.hostname.includes("127.0.0.1"))return;oe&&oe.remove();let t=e.score,a=t>=90?"#0f9d58":t>=70?"#f29900":"#d93025",i=t>=90?"\u267F":t>=70?"\u26A0":"\u2715",n=document.createElement("button");n.setAttribute("aria-label",`Accessibility score: ${t} out of 100`),n.setAttribute("data-yuktai-badge","true"),n.style.cssText=`
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
  `,n.innerHTML=`${i} ${t}/100 <span style="font-weight:400;opacity:0.85">${e.details.length} issues</span>`,n.addEventListener("click",()=>nt(e)),document.body.appendChild(n),oe=n}function nt(e){let t=document.querySelector("[data-yuktai-audit-details]");if(t){t.remove();return}let a=document.createElement("div");a.setAttribute("data-yuktai-audit-details","true"),a.setAttribute("role","dialog"),a.setAttribute("aria-label","Accessibility audit details"),a.style.cssText=`
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
  `,a.addEventListener("keydown",n=>{n.key==="Escape"&&a.remove()}),document.body.appendChild(a),O(a)}function $e(e){typeof document>"u"||(ie&&clearTimeout(ie),ie=setTimeout(()=>{if(W)return;let t=document.createElement("div");t.setAttribute("role","alertdialog"),t.setAttribute("aria-label","Session timeout warning"),t.setAttribute("aria-modal","true"),t.setAttribute("data-yuktai-timeout","true"),t.style.cssText=`
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
    `;let a=t.querySelector("[data-yuktai-extend]"),i=t.querySelector("[data-yuktai-dismiss]");a?.addEventListener("click",()=>{t.remove(),W=null,p("Session extended. You have more time.","success"),C?.timeoutWarning&&$e(C.timeoutWarning)}),i?.addEventListener("click",()=>{t.remove(),W=null}),document.body.appendChild(t),W=t,O(t),p("Warning: Your session will expire soon. Do you need more time?","warning")},e*1e3))}function rt(e){if(typeof document>"u")return;let t=document.documentElement;if(t.toggleAttribute("data-yuktai-high-contrast",!!e.highContrast),t.toggleAttribute("data-yuktai-dark",!!e.darkMode),t.toggleAttribute("data-yuktai-reduce-motion",!!e.reduceMotion),t.toggleAttribute("data-yuktai-large-targets",!!e.largeTargets),t.toggleAttribute("data-yuktai-keyboard",!!e.keyboardHints),t.toggleAttribute("data-yuktai-dyslexia",!!e.dyslexiaFont),e.localFont?document.body.style.fontFamily=`"${e.localFont}", system-ui, sans-serif`:e.dyslexiaFont||(document.body.style.fontFamily=""),e.fontSizeMultiplier&&e.fontSizeMultiplier!==1?document.documentElement.style.fontSize=`${e.fontSizeMultiplier*100}%`:document.documentElement.style.fontSize="",e.colorBlindMode&&e.colorBlindMode!=="none"){let a=e.colorBlindMode==="achromatopsia"?"grayscale(100%)":`url(#${B[e.colorBlindMode]})`;document.body.style.filter=a}else document.body.style.filter=""}function st(e){try{let t=localStorage.getItem("yuktai-a11y-prefs");t&&Object.assign(e,JSON.parse(t))}catch{}}async function Le(e){if(e){if(!await X()){p("Plain English requires Chrome 127+","warning");return}p("Rewriting page in plain English...","info",!1);let a=await pe();p(a.error?`Plain English failed: ${a.error}`:`${a.fixed} sections rewritten in plain English`,a.error?"error":"success",!1)}else fe(),p("Original text restored","info",!1)}async function Me(e){if(e){if(!await Z()){p("Page summariser requires Chrome 127+","warning");return}p("Generating page summary...","info",!1);let a=await ge();p(a.error?`Summary failed: ${a.error}`:"Page summary added at top",a.error?"error":"success",!1)}else I(),p("Page summary removed","info",!1)}async function Re(e){if(e==="en"){Q(),p("Page restored to English","info",!1);return}p(`Translating page to ${e}...`,"info",!1);let t=await ye(e);p(t.error?`Translation failed: ${t.error}`:`Page translated to ${e}`,t.error?"error":"success",!1)}async function Pe(e){if(e){if(!ee()){p("Voice control not supported in this browser","warning");return}he(t=>{t.success&&p(`Voice: ${t.action}`,"info",!1)}),p("Voice control started. Say a command.","success",!1)}else te(),p("Voice control stopped","info",!1)}async function ze(e){if(e){if(!await ae()){p("Smart labels requires Chrome 127+","warning");return}p("Generating smart labels...","info",!1);let a=await Ae();p(a.error?`Smart labels failed: ${a.error}`:`${a.fixed} elements labelled`,a.error?"error":"success",!1)}else Se(),p("Smart labels removed","info",!1)}function lt(){if(typeof document>"u"||N)return;let e=document.createElement("div");e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e.setAttribute("aria-relevant","text"),e.style.cssText="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);",document.body.appendChild(e),N=e}function ct(){if(typeof document>"u"||Ee)return;let e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("aria-hidden","true"),e.style.cssText="position:absolute;width:0;height:0;overflow:hidden;",e.innerHTML=`
    <defs>
      <filter id="${B.deuteranopia}">
        <feColorMatrix type="matrix"
          values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${B.protanopia}">
        <feColorMatrix type="matrix"
          values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${B.tritanopia}">
        <feColorMatrix type="matrix"
          values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"/>
      </filter>
    </defs>
  `,document.body.appendChild(e),Ee=e}function Ie(e){let t={critical:20,serious:10,moderate:5,minor:2},a=e.details.reduce((i,n)=>i+(t[n.severity]||0),0);return Math.max(0,Math.min(100,100-a))}var k={name:"yuktai-a11y",version:"4.0.0",observer:null,async execute(e){if(!e.enabled)return this.stopObserver(),"yuktai: disabled.";C=e,st(e),lt(),ct(),tt(),at(),e.showSkipLinks!==!1&&et(),e.showPreferencePanel,rt(e);let t=this.applyFixes(e);t.score=Ie(t),e.showAuditBadge&&it(t),e.timeoutWarning&&$e(e.timeoutWarning),e.autoFix&&this.startObserver(e),e.plainEnglish&&await Le(!0),e.summarisePage&&await Me(!0),e.translateLanguage&&e.translateLanguage!=="en"&&await Re(e.translateLanguage),e.voiceControl&&await Pe(!0),e.smartLabels&&await ze(!0);let a=`${t.fixed} fixes applied. Score: ${t.score}/100.`;return p(a,t.score>=90?"success":"info",!1),`yuktai v4.0.0: ${a} Scanned ${t.scanned} elements in ${t.renderTime}ms.`},applyFixes(e){let t={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return t;let a=performance.now(),i=document.querySelectorAll("*");t.scanned=i.length;let n=(s,o,c,m)=>{t.details.push({tag:s,fix:o,severity:c,element:m.outerHTML.slice(0,100)}),t.fixed++};return i.forEach(s=>{let o=s,c=o.tagName.toLowerCase();if(c==="html"&&!o.getAttribute("lang")&&(o.setAttribute("lang","en"),n(c,'lang="en" added',"critical",o)),c==="meta"){let u=o.getAttribute("name"),y=o.getAttribute("content")||"";u==="viewport"&&y.includes("user-scalable=no")&&(o.setAttribute("content",y.replace("user-scalable=no","user-scalable=yes")),n(c,"user-scalable=yes restored","serious",o)),u==="viewport"&&/maximum-scale=1(?:[^0-9]|$)/.test(y)&&(o.setAttribute("content",y.replace(/maximum-scale=1(?=[^0-9]|$)/,"maximum-scale=5")),n(c,"maximum-scale=5 restored","serious",o))}if(c==="main"&&!o.getAttribute("tabindex")&&(o.setAttribute("tabindex","-1"),o.getAttribute("id")||o.setAttribute("id","main-content")),c==="img"&&(o.hasAttribute("alt")||(o.setAttribute("alt",""),o.setAttribute("aria-hidden","true"),n(c,'alt="" aria-hidden="true"',"serious",o))),c==="svg"&&(!o.getAttribute("aria-hidden")&&!o.getAttribute("aria-label")&&!s.querySelector("title")&&(o.setAttribute("aria-hidden","true"),n(c,'aria-hidden="true" (decorative svg)',"minor",o)),o.getAttribute("focusable")||o.setAttribute("focusable","false")),c==="iframe"&&!o.getAttribute("title")&&!o.getAttribute("aria-label")&&(o.setAttribute("title","embedded content"),o.setAttribute("aria-label","embedded content"),n(c,"title + aria-label added","serious",o)),c==="button"){if(!o.innerText?.trim()&&!o.getAttribute("aria-label")){let u=o.getAttribute("title")||"button";o.setAttribute("aria-label",u),n(c,`aria-label="${u}" (empty button)`,"critical",o)}o.hasAttribute("disabled")&&!o.getAttribute("aria-disabled")&&(o.setAttribute("aria-disabled","true"),t.fixed++)}if(c==="a"){let u=o;!o.innerText?.trim()&&!o.getAttribute("aria-label")&&(o.setAttribute("aria-label",o.getAttribute("title")||"link"),n(c,"aria-label added (empty link)","critical",o)),u.target==="_blank"&&!u.rel?.includes("noopener")&&(u.rel="noopener noreferrer",t.fixed++)}if(Ce.has(c)){let u=o;if(!o.getAttribute("aria-label")&&!o.getAttribute("aria-labelledby")){let y=o.getAttribute("placeholder")||o.getAttribute("name")||c;o.setAttribute("aria-label",y),n(c,`aria-label="${y}"`,"serious",o)}if(o.hasAttribute("required")&&!o.getAttribute("aria-required")&&(o.setAttribute("aria-required","true"),t.fixed++),c==="input"&&!u.autocomplete){let y=u.name||"";u.type==="email"||y.includes("email")?u.autocomplete="email":u.type==="tel"||y.includes("tel")?u.autocomplete="tel":u.type==="password"&&(u.autocomplete="current-password"),t.fixed++}}c==="th"&&!o.getAttribute("scope")&&(o.setAttribute("scope",o.closest("thead")?"col":"row"),n(c,"scope added to <th>","moderate",o)),ne[c]&&!o.getAttribute("role")&&(o.setAttribute("role",ne[c]),n(c,`role="${ne[c]}"`,"minor",o));let m=o.getAttribute("role")||"";m==="tab"&&!o.getAttribute("aria-selected")&&(o.setAttribute("aria-selected","false"),t.fixed++),["alert","status","log"].includes(m)&&!o.getAttribute("aria-live")&&(o.setAttribute("aria-live",m==="alert"?"assertive":"polite"),n(c,`aria-live added on role=${m}`,"moderate",o)),m==="combobox"&&!o.getAttribute("aria-expanded")&&(o.setAttribute("aria-expanded","false"),n(c,'aria-expanded="false" on combobox',"serious",o)),(m==="checkbox"||m==="radio")&&!o.getAttribute("aria-checked")&&(o.setAttribute("aria-checked","false"),n(c,`aria-checked="false" on role=${m}`,"serious",o))}),t.renderTime=parseFloat((performance.now()-a).toFixed(2)),t},scan(){let e={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return e;let t=performance.now(),a=document.querySelectorAll("*");e.scanned=a.length;let i=(n,s,o,c)=>e.details.push({tag:n,fix:s,severity:o,element:c.outerHTML.slice(0,100)});return a.forEach(n=>{let s=n,o=s.tagName.toLowerCase();(o==="a"||o==="button")&&!s.innerText?.trim()&&!s.getAttribute("aria-label")&&i(o,"needs aria-label (empty)","critical",s),o==="img"&&!s.hasAttribute("alt")&&i(o,"needs alt text","serious",s),Ce.has(o)&&!s.getAttribute("aria-label")&&!s.getAttribute("aria-labelledby")&&i(o,"needs aria-label","serious",s),o==="iframe"&&!s.getAttribute("title")&&!s.getAttribute("aria-label")&&i(o,"iframe needs title","serious",s)}),e.fixed=e.details.length,e.score=Ie(e),e.renderTime=parseFloat((performance.now()-t).toFixed(2)),e},startObserver(e){this.observer||typeof document>"u"||(this.observer=new MutationObserver(()=>this.applyFixes(e)),this.observer.observe(document.body,{childList:!0,subtree:!0,attributes:!1}))},stopObserver(){this.observer?.disconnect(),this.observer=null},announce:p,speak:re,showVisualAlert:He,trapFocus:O,handlePlainEnglish:Le,handleSummarisePage:Me,handleTranslate:Re,handleVoiceControl:Pe,handleSmartLabels:ze,SUPPORTED_LANGUAGES:$};import bt,{useEffect as D,useState as M,useCallback as q}from"react";import{forwardRef as dt,useEffect as Fe,useState as We}from"react";import{jsx as r,jsxs as f}from"react/jsx-runtime";var se={highContrast:!1,reduceMotion:!1,autoFix:!0,dyslexiaFont:!1,fontScale:100,localFont:"",darkMode:!1,largeTargets:!1,speechEnabled:!1,colorBlindMode:"none",showAuditBadge:!1,timeoutWarning:void 0,plainEnglish:!1,summarisePage:!1,translateLanguage:"en",voiceControl:!1,smartLabels:!1},L=[80,90,100,110,120,130],ut=[{value:"none",label:"None"},{value:"deuteranopia",label:"Deuteranopia"},{value:"protanopia",label:"Protanopia"},{value:"tritanopia",label:"Tritanopia"},{value:"achromatopsia",label:"Greyscale"}],pt=["Prompt API for Gemini Nano","Summarization API for Gemini Nano","Writer API for Gemini Nano","Rewriter API for Gemini Nano","Translation API"];function ft(){let[e,t]=We(typeof window<"u"?window.innerWidth:1024);return Fe(()=>{let a=()=>t(window.innerWidth);return window.addEventListener("resize",a),()=>window.removeEventListener("resize",a)},[]),{isMobile:e<=480,isTablet:e>480&&e<=768}}function mt({checked:e,onChange:t,label:a,disabled:i=!1}){return f("label",{"aria-label":a,style:{position:"relative",display:"inline-flex",width:"40px",height:"24px",cursor:i?"not-allowed":"pointer",flexShrink:0,opacity:i?.4:1},children:[r("input",{type:"checkbox",checked:e,disabled:i,onChange:n=>t(n.target.checked),style:{opacity:0,width:0,height:0,position:"absolute"}}),r("span",{style:{position:"absolute",inset:0,borderRadius:"99px",background:e?"#0d9488":"#cbd5e1",transition:"background 0.2s"}}),r("span",{style:{position:"absolute",top:"3px",left:e?"19px":"3px",width:"18px",height:"18px",background:"#fff",borderRadius:"50%",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)",pointerEvents:"none"}})]})}function _({label:e,color:t="#64748b",badge:a}){return f("div",{style:{display:"flex",alignItems:"center",gap:"8px",margin:"8px 18px 4px"},children:[r("p",{style:{margin:0,fontSize:"10px",fontWeight:600,color:t,letterSpacing:"0.06em",textTransform:"uppercase"},children:e}),a&&r("span",{style:{fontSize:"9px",fontWeight:500,padding:"1px 7px",borderRadius:"99px",background:"#f5f3ff",color:"#7c3aed",border:"0.5px solid #c4b5fd",whiteSpace:"nowrap"},children:a})]})}function A({icon:e,label:t,desc:a,checked:i,onChange:n,disabled:s=!1,disabledReason:o}){return f("div",{title:s?o:void 0,style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 18px",gap:"12px"},children:[f("div",{style:{display:"flex",alignItems:"center",gap:"10px",flex:1,minWidth:0},children:[r("span",{"aria-hidden":"true",style:{width:"30px",height:"30px",borderRadius:"8px",background:s?"#f1f5f9":"#f0fdfa",color:s?"#94a3b8":"#0d9488",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",flexShrink:0,fontWeight:700},children:e}),f("div",{style:{minWidth:0},children:[r("p",{style:{margin:0,fontSize:"13px",fontWeight:500,color:s?"#94a3b8":"#0f172a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:t}),r("p",{style:{margin:0,fontSize:"11px",color:"#94a3b8"},children:s?o:a})]})]}),r(mt,{checked:i,onChange:n,label:`Toggle ${t}`,disabled:s})]})}function x(){return r("div",{style:{height:"1px",background:"#f1f5f9",margin:"0"}})}var le=dt(({position:e,settings:t,report:a,isActive:i,aiSupported:n,voiceSupported:s,set:o,onApply:c,onReset:m,onClose:u},y)=>{let{isMobile:g,isTablet:j}=ft(),[P,K]=We([]);Fe(()=>{(async()=>{try{let z=window;if(!z.queryLocalFonts)return;let Y=await z.queryLocalFonts(),U=[...new Set(Y.map(J=>J.family))].sort();K(U.slice(0,50))}catch{}})()},[]);let R=g?{position:"fixed",bottom:0,left:0,right:0,zIndex:9999,background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px 16px 0 0",boxShadow:"0 -8px 32px rgba(0,0,0,0.12)",maxHeight:"90vh",overflowY:"auto",fontFamily:"system-ui,-apple-system,sans-serif",width:"100%"}:{position:"fixed",bottom:"84px",[e]:"24px",zIndex:9999,width:j?"300px":"320px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",maxHeight:"80vh",overflowY:"auto",fontFamily:"system-ui,-apple-system,sans-serif"};return f("div",{ref:y,role:"dialog","aria-modal":"true","aria-label":"yuktai accessibility preferences","data-yuktai-panel":"true",style:R,children:[f("div",{style:{padding:"14px 18px 12px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"flex-start",justifyContent:"space-between",position:"sticky",top:0,background:"#fff",zIndex:1},children:[f("div",{children:[f("div",{style:{display:"flex",alignItems:"center",gap:"7px",marginBottom:"5px",flexWrap:"wrap"},children:[r("span",{style:{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0d9488",letterSpacing:"0.05em",fontFamily:"monospace"},children:"@yuktishaalaa/yuktai v2.0.18"}),i&&r("span",{style:{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0f766e",border:"1px solid #99f6e4"},children:"\u25CF ACTIVE"})]}),r("p",{style:{margin:"0 0 2px",fontSize:"15px",fontWeight:600,color:"#0f172a"},children:"Accessibility"}),r("p",{style:{margin:0,fontSize:"12px",color:"#64748b"},children:"WCAG 2.2 \xB7 Open source \xB7 Zero cost"})]}),r("button",{onClick:u,"aria-label":"Close accessibility panel",style:{background:"none",border:"none",cursor:"pointer",padding:"4px",color:"#94a3b8",fontSize:"20px",lineHeight:1,borderRadius:"6px",flexShrink:0,minWidth:g?"44px":"auto",minHeight:g?"44px":"auto",display:"flex",alignItems:"center",justifyContent:"center"},children:"\xD7"})]}),r(_,{label:"Core"}),r(A,{icon:"\u267F",label:"Auto-fix ARIA",desc:"Injects missing labels and roles",checked:t.autoFix,onChange:l=>o("autoFix",l)}),r(x,{}),r(A,{icon:"\u{1F50A}",label:"Speak on focus",desc:"Browser reads elements aloud",checked:t.speechEnabled,onChange:l=>o("speechEnabled",l)}),r(x,{}),r(A,{icon:"\u{1F399}",label:"Voice control",desc:"Navigate page by voice",checked:t.voiceControl,onChange:l=>o("voiceControl",l),disabled:!s,disabledReason:"Not supported in this browser"}),r(x,{}),r(_,{label:"AI features",color:"#7c3aed",badge:"Gemini Nano \xB7 Chrome 127+"}),r("div",{style:{margin:"4px 18px 6px",padding:"8px 10px",background:"#f5f3ff",borderRadius:"8px",border:"0.5px solid #c4b5fd",fontSize:"10px",color:"#7c3aed",lineHeight:1.5},children:n?"Gemini Nano detected \u2014 AI features ready. Runs privately on your device. No data leaves your browser.":"AI features need setup \u2014 see guide below."}),!n&&f("div",{style:{margin:"0 18px 8px",padding:"10px 12px",background:"#fafafa",borderRadius:"8px",border:"0.5px solid #e2e8f0",fontSize:"11px",color:"#475569",lineHeight:1.7},children:[r("p",{style:{margin:"0 0 6px",fontWeight:600,color:"#0f172a",fontSize:"11px"},children:"\u{1F6E0} How to enable AI features:"}),f("p",{style:{margin:"0 0 3px"},children:["1. Open Chrome and go to"," ",r("code",{style:{background:"#f1f5f9",padding:"1px 5px",borderRadius:"4px",fontSize:"10px",color:"#0d9488",fontFamily:"monospace"},children:"chrome://flags"})]}),f("p",{style:{margin:"0 0 3px"},children:["2. Search and set each to ",r("strong",{style:{color:"#0f172a"},children:"Enabled:"})]}),r("div",{style:{display:"flex",flexDirection:"column",gap:"2px",margin:"4px 0 6px 10px"},children:pt.map(l=>f("span",{style:{fontSize:"10px",color:"#7c3aed",fontFamily:"monospace"},children:["\u2192 ",l]},l))}),f("p",{style:{margin:"0 0 3px"},children:["3. Click ",r("strong",{style:{color:"#0f172a"},children:"Relaunch"})," when Chrome prompts you"]}),f("p",{style:{margin:"0 0 3px"},children:["4. Go to"," ",r("code",{style:{background:"#f1f5f9",padding:"1px 5px",borderRadius:"4px",fontSize:"10px",color:"#0d9488",fontFamily:"monospace"},children:"chrome://components"})]}),f("p",{style:{margin:"0 0 3px 10px"},children:["\u2192 Find ",r("strong",{style:{color:"#0f172a"},children:"Optimization Guide On Device Model"})]}),f("p",{style:{margin:"0 0 6px 10px"},children:["\u2192 Click ",r("strong",{style:{color:"#0f172a"},children:"Check for update"})," and wait for download"]}),r("p",{style:{margin:"0"},children:"5. Refresh this page \u2014 AI features will unlock automatically"})]}),r(A,{icon:"\u{1F4DD}",label:"Plain English mode",desc:"Simplifies complex page text",checked:t.plainEnglish,onChange:l=>o("plainEnglish",l),disabled:!n,disabledReason:"Enable Gemini Nano \u2014 see setup guide above"}),r(x,{}),r(A,{icon:"\u{1F4CB}",label:"Summarise page",desc:"3-sentence summary at top",checked:t.summarisePage,onChange:l=>o("summarisePage",l),disabled:!n,disabledReason:"Enable Gemini Nano \u2014 see setup guide above"}),r(x,{}),r(A,{icon:"\u{1F3F7}",label:"Smart aria-labels",desc:"AI generates meaningful labels",checked:t.smartLabels,onChange:l=>o("smartLabels",l),disabled:!n,disabledReason:"Enable Gemini Nano \u2014 see setup guide above"}),r(x,{}),r(_,{label:"Visual"}),r(A,{icon:"\u25D1",label:"High contrast",desc:"Boosts contrast for low vision",checked:t.highContrast,onChange:l=>o("highContrast",l)}),r(x,{}),r(A,{icon:"\u{1F319}",label:"Dark mode",desc:"Inverts colours",checked:t.darkMode,onChange:l=>o("darkMode",l)}),r(x,{}),r(A,{icon:"\u23F8",label:"Reduce motion",desc:"Disables animations",checked:t.reduceMotion,onChange:l=>o("reduceMotion",l)}),r(x,{}),r(A,{icon:"\u{1F446}",label:"Large targets",desc:"44\xD744px minimum touch targets",checked:t.largeTargets,onChange:l=>o("largeTargets",l)}),r(x,{}),f("div",{style:{padding:"10px 18px"},children:[r("p",{style:{margin:"0 0 8px",fontSize:"13px",fontWeight:500,color:"#0f172a"},children:"\u{1F3A8} Colour blindness"}),r("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"},children:ut.map(l=>r("button",{onClick:()=>o("colorBlindMode",l.value),"aria-pressed":t.colorBlindMode===l.value,style:{padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500,border:`1px solid ${t.colorBlindMode===l.value?"#0d9488":"#e2e8f0"}`,background:t.colorBlindMode===l.value?"#f0fdfa":"#fff",color:t.colorBlindMode===l.value?"#0d9488":"#64748b",cursor:"pointer",minHeight:g?"36px":"auto"},children:l.label},l.value))})]}),r(x,{}),r(_,{label:"Font"}),r(A,{icon:"Aa",label:"Dyslexia-friendly font",desc:"Atkinson Hyperlegible",checked:t.dyslexiaFont,onChange:l=>o("dyslexiaFont",l)}),r(x,{}),f("div",{style:{padding:"10px 18px"},children:[r("p",{style:{margin:"0 0 8px",fontSize:"13px",fontWeight:500,color:"#0f172a"},children:"\u{1F524} Local font"}),P.length>0?f("select",{value:t.localFont,onChange:l=>o("localFont",l.target.value),"aria-label":"Choose a font from your device",style:{width:"100%",padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"13px",color:"#0f172a",background:"#fff",cursor:"pointer",height:g?"44px":"36px"},children:[r("option",{value:"",children:"System default"}),P.map(l=>r("option",{value:l,style:{fontFamily:l},children:l},l))]}):r("p",{style:{margin:0,fontSize:"11px",color:"#94a3b8"},children:"Local font access available in Chrome 103+. Allow font access when prompted."})]}),r(x,{}),f("div",{style:{padding:"10px 18px 14px"},children:[f("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"10px"},children:[r("p",{style:{margin:0,fontSize:"13px",fontWeight:500,color:"#0f172a"},children:"Text size"}),f("span",{style:{fontSize:"12px",fontWeight:600,color:"#0d9488",background:"#f0fdfa",padding:"2px 8px",borderRadius:"99px"},children:[t.fontScale,"%"]})]}),f("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[r("button",{onClick:()=>{let l=L.indexOf(t.fontScale);l>0&&o("fontScale",L[l-1])},disabled:t.fontScale<=80,"aria-label":"Decrease text size",style:{width:g?"44px":"30px",height:g?"44px":"30px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:t.fontScale<=80?"not-allowed":"pointer",fontSize:"16px",color:t.fontScale<=80?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"\u2212"}),r("div",{style:{flex:1,display:"flex",gap:"3px"},children:L.map(l=>r("button",{onClick:()=>o("fontScale",l),"aria-label":`Set text size to ${l}%`,style:{flex:1,height:"6px",borderRadius:"99px",border:"none",cursor:"pointer",padding:0,background:l<=t.fontScale?"#0d9488":"#e2e8f0",transition:"background 0.15s"}},l))}),r("button",{onClick:()=>{let l=L.indexOf(t.fontScale);l<L.length-1&&o("fontScale",L[l+1])},disabled:t.fontScale>=130,"aria-label":"Increase text size",style:{width:g?"44px":"30px",height:g?"44px":"30px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:t.fontScale>=130?"not-allowed":"pointer",fontSize:"16px",color:t.fontScale>=130?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"+"})]})]}),r(x,{}),f("div",{style:{padding:"10px 18px"},children:[f("p",{style:{margin:"0 0 8px",fontSize:"13px",fontWeight:500,color:"#0f172a"},children:["\u{1F310} Translate page"," ",r("span",{style:{marginLeft:"6px",fontSize:"9px",fontWeight:500,padding:"1px 6px",borderRadius:"99px",background:"#f5f3ff",color:"#7c3aed",border:"0.5px solid #c4b5fd"},children:"Gemini Nano"})]}),r("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"},children:$.slice(0,g?8:18).map(l=>r("button",{onClick:()=>o("translateLanguage",l.code),"aria-pressed":t.translateLanguage===l.code,disabled:!n,style:{padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500,border:`1px solid ${t.translateLanguage===l.code?"#7c3aed":"#e2e8f0"}`,background:t.translateLanguage===l.code?"#f5f3ff":"#fff",color:t.translateLanguage===l.code?"#7c3aed":"#64748b",cursor:n?"pointer":"not-allowed",opacity:n?1:.5,minHeight:g?"36px":"auto"},children:l.code.toUpperCase()},l.code))}),!n&&r("p",{style:{margin:"6px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Enable Gemini Nano using the setup guide above to unlock translation."})]}),a&&r("div",{role:"status",style:{margin:"0 14px",padding:"8px 12px",background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"8px",fontSize:"12px",color:"#0f766e",fontWeight:500,fontFamily:"monospace"},children:a.fixed>0?`\u2713 ${a.fixed} fixes \xB7 ${a.scanned} nodes \xB7 ${a.renderTime}ms \xB7 Score: ${a.score}/100`:`\u2713 0 auto-fixes needed \xB7 ${a.scanned} nodes \xB7 ${a.renderTime}ms`}),f("div",{style:{display:"flex",gap:"8px",padding:"12px 14px 14px",position:g?"sticky":"relative",bottom:g?0:"auto",background:"#fff",borderTop:"1px solid #f1f5f9"},children:[r("button",{onClick:m,style:{flex:1,padding:g?"12px 0":"8px 0",fontSize:"13px",fontWeight:500,borderRadius:"9px",border:"1px solid #e2e8f0",background:"#fff",color:"#64748b",cursor:"pointer"},children:"Reset"}),r("button",{onClick:c,style:{flex:2,padding:g?"12px 0":"8px 0",fontSize:"13px",fontWeight:600,borderRadius:"9px",border:"none",background:"#0d9488",color:"#fff",cursor:"pointer"},children:"Apply settings"})]})]})});le.displayName="WidgetPanel";import{Fragment as yt,jsx as Be,jsxs as xt}from"react/jsx-runtime";async function gt(){try{if(typeof window>"u")return!1;let e=window;if(e.LanguageModel)try{if(typeof e.LanguageModel.availability=="function"){let a=await e.LanguageModel.availability();if(console.log("yuktai: LanguageModel.availability() =",a),a==="readily"||a==="available"||a==="downloadable")return!0}else return!0}catch{}if(e.Summarizer)try{if(typeof e.Summarizer.availability=="function"){let a=await e.Summarizer.availability();if(a==="readily"||a==="available")return!0}else return!0}catch{}if(e.Rewriter)try{if(typeof e.Rewriter.availability=="function"){let a=await e.Rewriter.availability();if(a==="readily"||a==="available")return!0}else return!0}catch{}if(e.Writer)try{if(typeof e.Writer.availability=="function"){let a=await e.Writer.availability();if(a==="readily"||a==="available")return!0}else return!0}catch{}let t=e.ai||globalThis.ai;if(t){if(t.languageModel?.availability)try{let a=await t.languageModel.availability();if(a==="readily"||a==="downloadable"||a==="available")return!0}catch{}if(t.languageModel?.capabilities)try{let a=await t.languageModel.capabilities();if(a?.available==="readily"||a?.available==="after-download")return!0}catch{}if(t.languageModel&&typeof t.languageModel.create=="function")return!0;if(t.summarizer?.capabilities)try{if((await t.summarizer.capabilities())?.available!=="no")return!0}catch{}if(t.rewriter?.capabilities)try{if((await t.rewriter.capabilities())?.available!=="no")return!0}catch{}if(t.writer?.capabilities)try{if((await t.writer.capabilities())?.available!=="no")return!0}catch{}if(t.summarizer||t.rewriter||t.writer||t.languageModel)return!0}return!!(e.Translator||e.translation?.canTranslate)}catch{return!1}}function ce({position:e="left",children:t,config:a={}}){let[i,n]=M(!1),[s,o]=M(se),[c,m]=M(null),[u,y]=M(!1),[g,j]=M(!1),[P,K]=M(!1),R=bt.useRef(null);D(()=>{if(typeof window>"u")return;let w=setTimeout(async()=>{let h=window;console.log("yuktai: Checking AI APIs..."),console.log("yuktai: window.ai =",h.ai),console.log("yuktai: window.LanguageModel =",h.LanguageModel),console.log("yuktai: window.Summarizer =",h.Summarizer),console.log("yuktai: window.Rewriter =",h.Rewriter),console.log("yuktai: window.Writer =",h.Writer);let de=await gt();j(de),de?console.log("yuktai: Chrome Built-in AI detected \u2705"):(console.log("yuktai: Chrome Built-in AI not detected \u274C"),console.log("yuktai: Enable flags at chrome://flags and download model at chrome://components"));let Oe=!!(h.SpeechRecognition||h.webkitSpeechRecognition);K(Oe)},800);return()=>clearTimeout(w)},[]),D(()=>{if(!(typeof window>"u"))try{let d=localStorage.getItem("yuktai-a11y-prefs");if(d){let w=JSON.parse(d);o(h=>({...h,...w}))}}catch{}},[]);let l=q(async d=>{let w={enabled:!0,highContrast:d.highContrast,darkMode:d.darkMode,reduceMotion:d.reduceMotion,largeTargets:d.largeTargets,speechEnabled:d.speechEnabled,autoFix:d.autoFix,dyslexiaFont:d.dyslexiaFont,localFont:d.localFont,fontSizeMultiplier:d.fontScale/100,colorBlindMode:d.colorBlindMode,showAuditBadge:d.showAuditBadge,showSkipLinks:!0,showPreferencePanel:!1,plainEnglish:d.plainEnglish,summarisePage:d.summarisePage,translateLanguage:d.translateLanguage,voiceControl:d.voiceControl,smartLabels:d.smartLabels,...a};await k.execute(w);let h=k.applyFixes(w);m(h),y(!0)},[a]),z=q(async()=>{try{localStorage.setItem("yuktai-a11y-prefs",JSON.stringify(s))}catch{}await l(s),n(!1)},[s,l]),Y=q(()=>{o(se);try{localStorage.removeItem("yuktai-a11y-prefs")}catch{}let d=document.documentElement;["data-yuktai-high-contrast","data-yuktai-dark","data-yuktai-reduce-motion","data-yuktai-large-targets","data-yuktai-keyboard","data-yuktai-dyslexia"].forEach(w=>d.removeAttribute(w)),document.body.style.filter="",document.body.style.fontFamily="",document.documentElement.style.fontSize="",m(null),y(!1)},[]),U=q((d,w)=>{o(h=>({...h,[d]:w}))},[]);D(()=>{let d=w=>{w.key==="Escape"&&i&&n(!1)};return window.addEventListener("keydown",d),()=>window.removeEventListener("keydown",d)},[i]),D(()=>{i&&R.current&&k.trapFocus(R.current)},[i]);let J={position:"fixed",bottom:"24px",[e]:"24px",zIndex:9998,width:"52px",height:"52px",borderRadius:"50%",background:u?"#0d9488":"#1a73e8",color:"#fff",border:"none",cursor:"pointer",fontSize:"22px",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,0,0,0.25)",transition:"transform 0.15s, background 0.2s"};return xt(yt,{children:[t,Be("button",{style:J,"aria-label":"Open accessibility preferences","aria-haspopup":"dialog","aria-expanded":i,"data-yuktai-pref-toggle":"true",onClick:()=>n(d=>!d),onMouseEnter:d=>{d.currentTarget.style.transform="scale(1.08)"},onMouseLeave:d=>{d.currentTarget.style.transform="scale(1)"},children:"\u267F"}),i&&Be(le,{ref:R,position:e,settings:s,report:c,isActive:u,aiSupported:g,voiceSupported:P,set:U,onApply:z,onReset:Y,onClose:()=>n(!1)})]})}var G={name:"ai.text",async execute(e){return`\u{1F916} YuktAI says: ${e}`}};var V={name:"voice.text",async execute(e){return!e||e.trim()===""?"\u{1F3A4} No speech detected":`\u{1F3A4} You said: ${e}`}};var S=class{plugins=new Map;register(t,a){if(!a||typeof a.execute!="function")throw new Error(`Invalid plugin: ${t}`);this.plugins.set(t,a)}use(t){return this.plugins.get(t)}async run(t,a){try{let i=this.use(t);if(!i)throw new Error(`Plugin not found: ${t}`);return await i.execute(a)}catch(i){throw console.error(`[YuktAI Runtime Error in ${t}]:`,i),i}}getPlugins(){return Array.from(this.plugins.keys())}};function ht(){if(typeof globalThis>"u")return new S;if(!globalThis.__yuktai_runtime__){let e=new S;e.register(k.name,k),e.register(G.name,G),e.register(V.name,V),globalThis.__yuktai_runtime__=e}return globalThis.__yuktai_runtime__}var Ne=typeof window<"u"?ht():new S,Jt={wcagPlugin:k,list(){return Ne.getPlugins()},use(e){return Ne.use(e)},fix(e){return k.applyFixes({enabled:!0,autoFix:!0,...e})},scan(){return k.scan()}};export{S as Runtime,Jt as YuktAI,ce as YuktAIWrapper,G as aiPlugin,ce as default,V as voicePlugin,k as wcag,k as wcagPlugin};
