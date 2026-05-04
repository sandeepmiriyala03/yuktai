import{a as Ke}from"./chunk-3VGU4YGK.mjs";import{a as Ye,b as se,c as le}from"./chunk-XQMQZMAH.mjs";function Ue(){let e=window;return e.Rewriter||e.ai?.rewriter||null}async function Te(){try{let e=Ue();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}async function Lt(e){if(!e||e.trim().length<20)return{success:!1,original:e,rewritten:e,error:"Text too short"};try{let t=Ue();if(!t)throw new Error("Rewriter API not available");let a=await t.create({tone:"more-casual",format:"plain-text",length:"as-is",outputLanguage:"en"}),i=await a.rewrite(e,{context:"Rewrite this text in simple plain English. Use short sentences. Avoid jargon. Make it easy to understand for everyone."});return a.destroy(),{success:!0,original:e,rewritten:i.trim()}}catch(t){return{success:!1,original:e,rewritten:e,error:t instanceof Error?t.message:"Rewrite failed"}}}async function Je(){if(!await Te())return{fixed:0,error:"Chrome Built-in AI Rewriter not available. Enable via chrome://flags."};let t=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption"),a=0;for(let i of t){let o=i.innerText?.trim();if(!o||o.length<20||i.closest("[data-yuktai-panel]"))continue;let l=await Lt(o);l.success&&l.rewritten!==o&&(i.dataset.yuktaiOriginal=o,i.innerText=l.rewritten,a++)}return{fixed:a}}function Xe(){let e=document.querySelectorAll("[data-yuktai-original]");for(let t of e){let a=t.dataset.yuktaiOriginal;a&&(t.innerText=a,delete t.dataset.yuktaiOriginal)}}var Qe="yuktai-summary-box";function Ze(){let e=window;return e.Summarizer||e.ai?.summarizer||null}async function Ee(){try{let e=Ze();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}function Mt(){let e=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, article, section"),t=[];for(let a of e){if(a.closest("[data-yuktai-panel]"))continue;let i=window.getComputedStyle(a);if(i.display==="none"||i.visibility==="hidden")continue;let o=a.innerText?.trim();o&&o.length>10&&t.push(o)}return t.join(" ").slice(0,5e3)}async function et(){if(!await Ee())return{success:!1,summary:"",error:"Chrome Built-in AI Summarizer not available. Enable via chrome://flags."};let t=Mt();if(!t||t.length<100)return{success:!1,summary:"",error:"Not enough text on this page to summarise."};try{let a=Ze();if(!a)throw new Error("Summarizer API not available");let i=await a.create({type:"tl;dr",format:"plain-text",length:"short",outputLanguage:"en"}),o=await i.summarize(t,{context:"Summarise this page in 2-3 simple sentences for a screen reader user who wants to know if this page is relevant to them."});return i.destroy(),Rt(o.trim()),{success:!0,summary:o.trim()}}catch(a){return{success:!1,summary:"",error:a instanceof Error?a.message:"Summary failed"}}}function Rt(e){de();let t=document.createElement("div");t.id=Qe,t.setAttribute("data-yuktai-panel","true"),t.setAttribute("role","region"),t.setAttribute("aria-label","Page summary by yuktai"),t.style.cssText=`
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
  `,i.addEventListener("click",de),t.appendChild(a),t.appendChild(i),document.body.prepend(t)}function de(){let e=document.getElementById(Qe);e&&e.remove()}var ue=[{code:"en",label:"English"},{code:"hi",label:"Hindi"},{code:"es",label:"Spanish"},{code:"fr",label:"French"},{code:"de",label:"German"},{code:"it",label:"Italian"},{code:"pt",label:"Portuguese"},{code:"nl",label:"Dutch"},{code:"pl",label:"Polish"},{code:"ru",label:"Russian"},{code:"ja",label:"Japanese"},{code:"ko",label:"Korean"},{code:"zh",label:"Chinese"},{code:"ar",label:"Arabic"},{code:"tr",label:"Turkish"},{code:"vi",label:"Vietnamese"},{code:"bn",label:"Bengali"},{code:"id",label:"Indonesian"}],ce="en";function Pt(){let e=window;return e.Translator||e.translation||null}async function zt(e){try{let t=window;if(!Pt())return!1;if(t.Translator&&typeof t.Translator.availability=="function")try{let i=await t.Translator.availability({sourceLanguage:"en",targetLanguage:e});return i==="readily"||i==="available"||i==="downloadable"||i==="after-download"}catch{}return t.Translator&&typeof t.Translator.canTranslate=="function"?await t.Translator.canTranslate({sourceLanguage:"en",targetLanguage:e})!=="no":t.translation&&typeof t.translation.canTranslate=="function"?await t.translation.canTranslate({sourceLanguage:"en",targetLanguage:e})!=="no":!1}catch{return!1}}async function It(e){let t=window,a={sourceLanguage:"en",targetLanguage:e};if(t.Translator&&typeof t.Translator.create=="function")return await t.Translator.create(a);if(t.translation&&typeof t.translation.createTranslator=="function")return await t.translation.createTranslator(a);throw new Error("Translation API not available")}async function tt(e){if(e===ce)return{success:!0,language:e,fixed:0};if(e==="en")return Ce(),ce="en",{success:!0,language:"en",fixed:0};if(!await zt(e))return{success:!1,language:e,fixed:0,error:`Translation to ${e} not available. Enable via chrome://flags.`};try{let a=await It(e),i=document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, label, figcaption, span, a"),o=0;for(let l of i){if(l.closest("[data-yuktai-panel]")||l.children.length>0)continue;let n=l.innerText?.trim();if(!n||n.length<2)continue;l.dataset.yuktaiTranslationOriginal||(l.dataset.yuktaiTranslationOriginal=n);let c=await a.translate(n);c&&c!==n&&(l.innerText=c,o++)}return typeof a.destroy=="function"&&a.destroy(),ce=e,{success:!0,language:e,fixed:o}}catch(a){return{success:!1,language:e,fixed:0,error:a instanceof Error?a.message:"Translation failed"}}}function Ce(){let e=document.querySelectorAll("[data-yuktai-translation-original]");for(let t of e){let a=t.dataset.yuktaiTranslationOriginal;a&&(t.innerText=a,delete t.dataset.yuktaiTranslationOriginal)}ce="en"}var Wt=[{phrases:["go to main","skip to main","main content"],action:"focus-main",label:"Jump to main content"},{phrases:["go to navigation","go to nav","open menu"],action:"focus-nav",label:"Jump to navigation"},{phrases:["go to search","search","find"],action:"focus-search",label:"Jump to search"},{phrases:["scroll down","page down","next"],action:"scroll-down",label:"Scroll down"},{phrases:["scroll up","page up","back up"],action:"scroll-up",label:"Scroll up"},{phrases:["go back","previous page"],action:"go-back",label:"Go back"},{phrases:["click","press","select"],action:"click-focused",label:"Click focused element"},{phrases:["next item","tab forward","tab"],action:"tab-forward",label:"Move to next element"},{phrases:["previous item","tab back","shift tab"],action:"tab-back",label:"Move to previous element"},{phrases:["stop listening","stop voice","quiet"],action:"stop-voice",label:"Stop voice control"}],R=null,pe=!1,V=null;function Le(){return!!(window.SpeechRecognition||window.webkitSpeechRecognition)}function Ht(e){let t=e.toLowerCase().trim();for(let a of Wt)for(let i of a.phrases)if(t.includes(i))return{action:a.action,label:a.label};return null}function $t(e){switch(e){case"focus-main":{let t=document.querySelector("main, [role='main'], #main");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-nav":{let t=document.querySelector("nav, [role='navigation']");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"focus-search":{let t=document.querySelector("input[type='search'], input[role='searchbox'], [aria-label*='search' i]");t&&(t.focus(),t.scrollIntoView({behavior:"smooth"}));break}case"scroll-down":{window.scrollBy({top:400,behavior:"smooth"});break}case"scroll-up":{window.scrollBy({top:-400,behavior:"smooth"});break}case"go-back":{window.history.back();break}case"click-focused":{let t=document.activeElement;t&&t!==document.body&&t.click();break}case"tab-forward":{let t=at(),a=t.indexOf(document.activeElement),i=t[a+1]||t[0];i&&i.focus();break}case"tab-back":{let t=at(),a=t.indexOf(document.activeElement),i=t[a-1]||t[t.length-1];i&&i.focus();break}case"stop-voice":{Me();break}}}function at(){return Array.from(document.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(e=>!e.closest("[data-yuktai-panel]"))}function nt(e){if(!Le())return!1;if(pe)return!0;e&&(V=e);let t=window.SpeechRecognition||window.webkitSpeechRecognition;return R=new t,R.continuous=!0,R.interimResults=!1,R.lang="en-US",R.onresult=a=>{let i=a.results[a.results.length-1][0].transcript,o=Ht(i);if(o){$t(o.action);let l={success:!0,command:i,action:o.label};if(V&&V(l),o.action==="stop-voice")return}},R.onend=()=>{pe&&R?.start()},R.onerror=a=>{a.error!=="no-speech"&&V&&V({success:!1,command:"",action:"",error:`Voice error: ${a.error}`})},R.start(),pe=!0,Ft(),!0}function Me(){pe=!1,R&&(R.stop(),R=null),V=null,it()}var ot="yuktai-voice-indicator";function Ft(){it();let e=document.createElement("div");e.id=ot,e.setAttribute("data-yuktai-panel","true"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-label","yuktai voice control is listening"),e.style.cssText=`
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
    `,document.head.appendChild(i)}let a=document.createElement("span");a.textContent="Listening for commands...",e.appendChild(t),e.appendChild(a),document.body.appendChild(e)}function it(){let e=document.getElementById(ot);e&&e.remove()}var Bt=["button:not([aria-label]):not([aria-labelledby])","a:not([aria-label]):not([aria-labelledby])","input:not([aria-label]):not([aria-labelledby]):not([id])","select:not([aria-label]):not([aria-labelledby])","textarea:not([aria-label]):not([aria-labelledby])","[role='button']:not([aria-label])","[role='link']:not([aria-label])","[role='checkbox']:not([aria-label])","[role='tab']:not([aria-label])"].join(", ");function rt(){let e=window;return e.Writer||e.ai?.writer||null}async function Re(){try{let e=rt();if(!e)return!1;if(typeof e.availability=="function"){let t=await e.availability();return t==="readily"||t==="available"||t==="downloadable"}return typeof e.capabilities=="function"?(await e.capabilities())?.available!=="no":typeof e.create=="function"}catch{return!1}}function Nt(e){let t=[],a=e.innerText?.trim();a&&t.push(`element text: "${a}"`);let i=e.placeholder?.trim();i&&t.push(`placeholder: "${i}"`);let o=e.getAttribute("name")?.trim();o&&t.push(`name: "${o}"`);let l=e.getAttribute("type")?.trim();l&&t.push(`type: "${l}"`);let n=e.id;if(n){let p=document.querySelector(`label[for="${n}"]`);p&&t.push(`label: "${p.innerText?.trim()}"`)}let c=e.parentElement?.innerText?.trim().slice(0,60);c&&t.push(`parent context: "${c}"`),t.push(`tag: ${e.tagName.toLowerCase()}`);let y=e.getAttribute("role");return y&&t.push(`role: ${y}`),t.join(". ")}async function Ot(e,t){let a=`
    Generate a short, clear aria-label for an HTML element.
    The label must be 2-6 words maximum.
    The label must describe what the element does or what it is.
    Do not include punctuation.
    Do not explain \u2014 just output the label text only.

    Element details:
    ${t}

    Output only the label. Nothing else.
  `.trim();return(await e.write(a)).trim().replace(/^["']|["']$/g,"").replace(/\.$/,"").trim()}async function st(){if(!await Re())return{success:!1,fixed:0,elements:[],error:"Chrome Built-in AI Writer not available. Enable via chrome://flags."};let t=document.querySelectorAll(Bt);if(t.length===0)return{success:!0,fixed:0,elements:[]};try{let a=rt();if(!a)throw new Error("Writer API not available");let i=await a.create({tone:"neutral",format:"plain-text",length:"short",outputLanguage:"en"}),o=0,l=[];for(let n of t){if(n.closest("[data-yuktai-panel]"))continue;let c=window.getComputedStyle(n);if(c.display==="none"||c.visibility==="hidden")continue;let y=Nt(n),p=await Ot(i,y);p&&p.length>0&&(n.dataset.yuktaiLabelOriginal=n.getAttribute("aria-label")||"",n.setAttribute("aria-label",p),o++,l.push({tag:n.tagName.toLowerCase(),label:p}))}return i.destroy(),{success:!0,fixed:o,elements:l}}catch(a){return{success:!1,fixed:0,elements:[],error:a instanceof Error?a.message:"Label generation failed"}}}function lt(){let e=document.querySelectorAll("[data-yuktai-label-original]");for(let t of e){let a=t.dataset.yuktaiLabelOriginal;a?t.setAttribute("aria-label",a):t.removeAttribute("aria-label"),delete t.dataset.yuktaiLabelOriginal}}var ge=null,dt=null;var ct=null,Pe=null,x=null,j=null,fe=null,ze=null,K=null,me={deuteranopia:"yuktai-cb-d",protanopia:"yuktai-cb-p",tritanopia:"yuktai-cb-t"};var ut=new Set(["input","select","textarea"]);var Ie={nav:"navigation",header:"banner",footer:"contentinfo",main:"main",aside:"complementary"};function We(e,t="polite"){if(typeof window>"u"||!K?.speechEnabled||!window.speechSynthesis)return;window.speechSynthesis.cancel();let a=new SpeechSynthesisUtterance(e);a.rate=1,a.pitch=1,a.volume=1;let i=window.speechSynthesis.getVoices();i.length>0&&(a.voice=i[0]),window.speechSynthesis.speak(a)}function xt(e,t="info"){if(typeof document>"u")return;let i={success:{bg:"#0f9d58",border:"#0a7a44",icon:"\u2713"},error:{bg:"#d93025",border:"#b52a1c",icon:"\u2715"},warning:{bg:"#f29900",border:"#c67c00",icon:"\u26A0"},info:{bg:"#1a73e8",border:"#1557b0",icon:"\u2139"}}[t];x||(x=document.createElement("div"),x.setAttribute("role","alert"),x.setAttribute("aria-live","assertive"),x.setAttribute("aria-atomic","true"),x.style.cssText=`
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
    `,document.body.appendChild(x)),x.style.background=i.bg,x.style.border=`1px solid ${i.border}`,x.style.color="#fff",x.innerHTML=`
    <span style="font-size:18px;font-weight:700">${i.icon}</span>
    <span style="flex:1;line-height:1.4">${e}</span>
    <button
      onclick="this.parentElement.style.transform='translateX(120%)';this.parentElement.style.opacity='0'"
      style="background:none;border:none;color:#fff;cursor:pointer;font-size:18px;padding:0;line-height:1"
      aria-label="Close notification">\xD7</button>
  `,window.innerWidth<=480&&(x.style.right="8px",x.style.left="8px",x.style.maxWidth="none",x.style.width="auto"),requestAnimationFrame(()=>{x&&(x.style.transform="translateX(0)",x.style.opacity="1")}),setTimeout(()=>{x&&(x.style.transform="translateX(120%)",x.style.opacity="0")},5e3)}function m(e,t="info",a=!0){ge&&(ge.textContent=e),xt(e,t),a&&We(e,t==="error"?"assertive":"polite")}function Dt(){if(typeof document>"u"||ct)return;let e=[{label:"Skip to main content",selector:"main,[role='main'],#main,#main-content"},{label:"Skip to navigation",selector:"nav,[role='navigation'],#nav,#navigation"},{label:"Skip to search",selector:"[role='search'],#search,input[type='search']"}],t=document.createElement("div");t.setAttribute("data-yuktai-skip-bar","true"),t.setAttribute("role","navigation"),t.setAttribute("aria-label","Skip links"),t.style.cssText=`
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
    `,c.addEventListener("focus",()=>{t.style.transform="translateY(0)"}),c.addEventListener("blur",()=>{setTimeout(()=>{t.matches(":focus-within")||(t.style.transform="translateY(-100%)")},2e3)}),c.addEventListener("click",y=>{y.preventDefault(),n.focus(),n.scrollIntoView({behavior:"smooth",block:"start"}),m(`Jumped to ${o.replace("Skip to ","")}`,"info"),t.style.transform="translateY(-100%)"}),t.appendChild(c)}),!a)return;window.innerWidth<768&&(t.style.transform="translateY(0)",t.style.position="sticky"),window.addEventListener("resize",()=>{window.innerWidth<768&&(t.style.transform="translateY(0)")}),document.body.insertBefore(t,document.body.firstChild),ct=t}function Gt(){if(typeof document>"u"||document.querySelector("[data-yuktai-focus-style]"))return;let e=document.createElement("style");e.setAttribute("data-yuktai-focus-style","true"),e.textContent=`

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
  `,document.head.appendChild(e),document.documentElement.setAttribute("data-yuktai-a11y","true")}function _t(){typeof document>"u"||document.querySelector("[data-yuktai-kb-init]")||(document.documentElement.setAttribute("data-yuktai-kb-init","true"),document.addEventListener("keydown",e=>{let t=document.activeElement;if(!t)return;let a=t.getAttribute("role")||"";if(e.key==="Escape"){let i=t.closest("[role='dialog'],[role='alertdialog']");if(i){i.style.display="none",m("Dialog closed","info");return}let o=t.closest("[role='menu'],[role='menubar']");o&&(o.style.display="none",m("Menu closed","info"))}if(a==="menuitem"||t.closest("[role='menu'],[role='menubar']")){let i=t.closest("[role='menu'],[role='menubar']");if(!i)return;let o=Array.from(i.querySelectorAll("[role='menuitem']:not([disabled])")),l=o.indexOf(t);e.key==="ArrowDown"||e.key==="ArrowRight"?(e.preventDefault(),o[(l+1)%o.length]?.focus()):e.key==="ArrowUp"||e.key==="ArrowLeft"?(e.preventDefault(),o[(l-1+o.length)%o.length]?.focus()):e.key==="Home"?(e.preventDefault(),o[0]?.focus()):e.key==="End"&&(e.preventDefault(),o[o.length-1]?.focus())}if(a==="tab"||t.closest("[role='tablist']")){let i=t.closest("[role='tablist']");if(!i)return;let o=Array.from(i.querySelectorAll("[role='tab']:not([disabled])")),l=o.indexOf(t);if(e.key==="ArrowRight"||e.key==="ArrowDown"){e.preventDefault();let n=o[(l+1)%o.length];n?.focus(),n?.click()}else if(e.key==="ArrowLeft"||e.key==="ArrowUp"){e.preventDefault();let n=o[(l-1+o.length)%o.length];n?.focus(),n?.click()}}if(a==="option"||t.closest("[role='listbox']")){let i=t.closest("[role='listbox']");if(!i)return;let o=Array.from(i.querySelectorAll("[role='option']:not([aria-disabled='true'])")),l=o.indexOf(t);e.key==="ArrowDown"?(e.preventDefault(),o[(l+1)%o.length]?.focus()):e.key==="ArrowUp"?(e.preventDefault(),o[(l-1+o.length)%o.length]?.focus()):(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),t.setAttribute("aria-selected","true"),o.forEach(n=>{n!==t&&n.setAttribute("aria-selected","false")}),m(`Selected: ${t.textContent?.trim()}`,"success"))}e.altKey&&e.key==="a"&&(e.preventDefault(),qt()),e.key==="Tab"&&K?.speechEnabled&&setTimeout(()=>{let i=document.activeElement;if(!i)return;let o=i.getAttribute("aria-label")||i.getAttribute("title")||i.textContent?.trim()||i.tagName.toLowerCase(),l=i.getAttribute("role")||i.tagName.toLowerCase();We(`${o}, ${l}`)},100)}))}function be(e){let t=e.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[role="button"]');if(t.length===0)return;let a=t[0],i=t[t.length-1];a.focus(),e.addEventListener("keydown",o=>{o.key==="Tab"&&(o.shiftKey?document.activeElement===a&&(o.preventDefault(),i.focus()):document.activeElement===i&&(o.preventDefault(),a.focus()))})}function qt(){if(typeof document>"u")return;if(j){j.remove(),j=null;return}let e=document.createElement("div");e.setAttribute("role","dialog"),e.setAttribute("aria-label","Keyboard shortcuts"),e.setAttribute("aria-modal","true"),e.setAttribute("data-yuktai-cheatsheet","true"),e.style.cssText=`
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
  `,e.querySelector("[data-yuktai-close]")?.addEventListener("click",()=>{e.remove(),j=null}),e.addEventListener("keydown",i=>{i.key==="Escape"&&(e.remove(),j=null)}),document.body.appendChild(e),j=e,be(e),m("Keyboard shortcuts opened. Press Escape to close.","info")}function Vt(e){if(typeof document>"u"||!K?.showAuditBadge||typeof window<"u"&&!window.location.hostname.includes("localhost")&&!window.location.hostname.includes("127.0.0.1"))return;Pe&&Pe.remove();let t=e.score,a=t>=90?"#0f9d58":t>=70?"#f29900":"#d93025",i=t>=90?"\u267F":t>=70?"\u26A0":"\u2715",o=document.createElement("button");o.setAttribute("aria-label",`Accessibility score: ${t} out of 100`),o.setAttribute("data-yuktai-badge","true"),o.style.cssText=`
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
  `,o.innerHTML=`${i} ${t}/100 <span style="font-weight:400;opacity:0.85">${e.details.length} issues</span>`,o.addEventListener("click",()=>jt(e)),document.body.appendChild(o),Pe=o}function jt(e){let t=document.querySelector("[data-yuktai-audit-details]");if(t){t.remove();return}let a=document.createElement("div");a.setAttribute("data-yuktai-audit-details","true"),a.setAttribute("role","dialog"),a.setAttribute("aria-label","Accessibility audit details"),a.style.cssText=`
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
  `,a.addEventListener("keydown",o=>{o.key==="Escape"&&a.remove()}),document.body.appendChild(a),be(a)}function ht(e){typeof document>"u"||(ze&&clearTimeout(ze),ze=setTimeout(()=>{if(fe)return;let t=document.createElement("div");t.setAttribute("role","alertdialog"),t.setAttribute("aria-label","Session timeout warning"),t.setAttribute("aria-modal","true"),t.setAttribute("data-yuktai-timeout","true"),t.style.cssText=`
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
    `;let a=t.querySelector("[data-yuktai-extend]"),i=t.querySelector("[data-yuktai-dismiss]");a?.addEventListener("click",()=>{t.remove(),fe=null,m("Session extended. You have more time.","success"),K?.timeoutWarning&&ht(K.timeoutWarning)}),i?.addEventListener("click",()=>{t.remove(),fe=null}),document.body.appendChild(t),fe=t,be(t),m("Warning: Your session will expire soon. Do you need more time?","warning")},e*1e3))}function Kt(e){if(typeof document>"u")return;let t=document.documentElement;if(t.toggleAttribute("data-yuktai-high-contrast",!!e.highContrast),t.toggleAttribute("data-yuktai-dark",!!e.darkMode),t.toggleAttribute("data-yuktai-reduce-motion",!!e.reduceMotion),t.toggleAttribute("data-yuktai-large-targets",!!e.largeTargets),t.toggleAttribute("data-yuktai-keyboard",!!e.keyboardHints),t.toggleAttribute("data-yuktai-dyslexia",!!e.dyslexiaFont),e.localFont?document.body.style.fontFamily=`"${e.localFont}", system-ui, sans-serif`:e.dyslexiaFont||(document.body.style.fontFamily=""),e.fontSizeMultiplier&&e.fontSizeMultiplier!==1?document.documentElement.style.fontSize=`${e.fontSizeMultiplier*100}%`:document.documentElement.style.fontSize="",e.colorBlindMode&&e.colorBlindMode!=="none"){let a=e.colorBlindMode==="achromatopsia"?"grayscale(100%)":`url(#${me[e.colorBlindMode]})`;document.body.style.filter=a}else document.body.style.filter=""}function Yt(e){try{let t=localStorage.getItem("yuktai-a11y-prefs");t&&Object.assign(e,JSON.parse(t))}catch{}}async function pt(e){if(e){if(!await Te()){m("Plain English requires Chrome 127+","warning");return}m("Rewriting page in plain English...","info",!1);let a=await Je();m(a.error?`Plain English failed: ${a.error}`:`${a.fixed} sections rewritten in plain English`,a.error?"error":"success",!1)}else Xe(),m("Original text restored","info",!1)}async function ft(e){if(e){if(!await Ee()){m("Page summariser requires Chrome 127+","warning");return}m("Generating page summary...","info",!1);let a=await et();m(a.error?`Summary failed: ${a.error}`:"Page summary added at top",a.error?"error":"success",!1)}else de(),m("Page summary removed","info",!1)}async function mt(e){if(e==="en"){Ce(),m("Page restored to English","info",!1);return}m(`Translating page to ${e}...`,"info",!1);let t=await tt(e);m(t.error?`Translation failed: ${t.error}`:`Page translated to ${e}`,t.error?"error":"success",!1)}async function gt(e){if(e){if(!Le()){m("Voice control not supported in this browser","warning");return}nt(t=>{t.success&&m(`Voice: ${t.action}`,"info",!1)}),m("Voice control started. Say a command.","success",!1)}else Me(),m("Voice control stopped","info",!1)}async function bt(e){if(e){if(!await Re()){m("Smart labels requires Chrome 127+","warning");return}m("Generating smart labels...","info",!1);let a=await st();m(a.error?`Smart labels failed: ${a.error}`:`${a.fixed} elements labelled`,a.error?"error":"success",!1)}else lt(),m("Smart labels removed","info",!1)}function Ut(){if(typeof document>"u"||ge)return;let e=document.createElement("div");e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e.setAttribute("aria-relevant","text"),e.style.cssText="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);",document.body.appendChild(e),ge=e}function Jt(){if(typeof document>"u"||dt)return;let e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("aria-hidden","true"),e.style.cssText="position:absolute;width:0;height:0;overflow:hidden;",e.innerHTML=`
    <defs>
      <filter id="${me.deuteranopia}">
        <feColorMatrix type="matrix"
          values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${me.protanopia}">
        <feColorMatrix type="matrix"
          values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="${me.tritanopia}">
        <feColorMatrix type="matrix"
          values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"/>
      </filter>
    </defs>
  `,document.body.appendChild(e),dt=e}function yt(e){let t={critical:20,serious:10,moderate:5,minor:2},a=e.details.reduce((i,o)=>i+(t[o.severity]||0),0);return Math.max(0,Math.min(100,100-a))}var P={name:"yuktai-a11y",version:"4.0.0",observer:null,async execute(e){if(!e.enabled)return this.stopObserver(),"yuktai: disabled.";K=e,Yt(e),Ut(),Jt(),Gt(),_t(),e.showSkipLinks!==!1&&Dt(),e.showPreferencePanel,Kt(e);let t=this.applyFixes(e);t.score=yt(t),e.showAuditBadge&&Vt(t),e.timeoutWarning&&ht(e.timeoutWarning),e.autoFix&&this.startObserver(e),e.plainEnglish&&await pt(!0),e.summarisePage&&await ft(!0),e.translateLanguage&&e.translateLanguage!=="en"&&await mt(e.translateLanguage),e.voiceControl&&await gt(!0),e.smartLabels&&await bt(!0);let a=`${t.fixed} fixes applied. Score: ${t.score}/100.`;return m(a,t.score>=90?"success":"info",!1),`yuktai v4.0.0: ${a} Scanned ${t.scanned} elements in ${t.renderTime}ms.`},applyFixes(e){let t={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return t;let a=performance.now(),i=document.querySelectorAll("*");t.scanned=i.length;let o=(l,n,c,y)=>{t.details.push({tag:l,fix:n,severity:c,element:y.outerHTML.slice(0,100)}),t.fixed++};return i.forEach(l=>{let n=l,c=n.tagName.toLowerCase();if(c==="html"&&!n.getAttribute("lang")&&(n.setAttribute("lang","en"),o(c,'lang="en" added',"critical",n)),c==="meta"){let p=n.getAttribute("name"),k=n.getAttribute("content")||"";p==="viewport"&&k.includes("user-scalable=no")&&(n.setAttribute("content",k.replace("user-scalable=no","user-scalable=yes")),o(c,"user-scalable=yes restored","serious",n)),p==="viewport"&&/maximum-scale=1(?:[^0-9]|$)/.test(k)&&(n.setAttribute("content",k.replace(/maximum-scale=1(?=[^0-9]|$)/,"maximum-scale=5")),o(c,"maximum-scale=5 restored","serious",n))}if(c==="main"&&!n.getAttribute("tabindex")&&(n.setAttribute("tabindex","-1"),n.getAttribute("id")||n.setAttribute("id","main-content")),c==="img"&&(n.hasAttribute("alt")||(n.setAttribute("alt",""),n.setAttribute("aria-hidden","true"),o(c,'alt="" aria-hidden="true"',"serious",n))),c==="svg"&&(!n.getAttribute("aria-hidden")&&!n.getAttribute("aria-label")&&!l.querySelector("title")&&(n.setAttribute("aria-hidden","true"),o(c,'aria-hidden="true" (decorative svg)',"minor",n)),n.getAttribute("focusable")||n.setAttribute("focusable","false")),c==="iframe"&&!n.getAttribute("title")&&!n.getAttribute("aria-label")&&(n.setAttribute("title","embedded content"),n.setAttribute("aria-label","embedded content"),o(c,"title + aria-label added","serious",n)),c==="button"){if(!n.innerText?.trim()&&!n.getAttribute("aria-label")){let p=n.getAttribute("title")||"button";n.setAttribute("aria-label",p),o(c,`aria-label="${p}" (empty button)`,"critical",n)}n.hasAttribute("disabled")&&!n.getAttribute("aria-disabled")&&(n.setAttribute("aria-disabled","true"),t.fixed++)}if(c==="a"){let p=n;!n.innerText?.trim()&&!n.getAttribute("aria-label")&&(n.setAttribute("aria-label",n.getAttribute("title")||"link"),o(c,"aria-label added (empty link)","critical",n)),p.target==="_blank"&&!p.rel?.includes("noopener")&&(p.rel="noopener noreferrer",t.fixed++)}if(ut.has(c)){let p=n;if(!n.getAttribute("aria-label")&&!n.getAttribute("aria-labelledby")){let k=n.getAttribute("placeholder")||n.getAttribute("name")||c;n.setAttribute("aria-label",k),o(c,`aria-label="${k}"`,"serious",n)}if(n.hasAttribute("required")&&!n.getAttribute("aria-required")&&(n.setAttribute("aria-required","true"),t.fixed++),c==="input"&&!p.autocomplete){let k=p.name||"";p.type==="email"||k.includes("email")?p.autocomplete="email":p.type==="tel"||k.includes("tel")?p.autocomplete="tel":p.type==="password"&&(p.autocomplete="current-password"),t.fixed++}}c==="th"&&!n.getAttribute("scope")&&(n.setAttribute("scope",n.closest("thead")?"col":"row"),o(c,"scope added to <th>","moderate",n)),Ie[c]&&!n.getAttribute("role")&&(n.setAttribute("role",Ie[c]),o(c,`role="${Ie[c]}"`,"minor",n));let y=n.getAttribute("role")||"";y==="tab"&&!n.getAttribute("aria-selected")&&(n.setAttribute("aria-selected","false"),t.fixed++),["alert","status","log"].includes(y)&&!n.getAttribute("aria-live")&&(n.setAttribute("aria-live",y==="alert"?"assertive":"polite"),o(c,`aria-live added on role=${y}`,"moderate",n)),y==="combobox"&&!n.getAttribute("aria-expanded")&&(n.setAttribute("aria-expanded","false"),o(c,'aria-expanded="false" on combobox',"serious",n)),(y==="checkbox"||y==="radio")&&!n.getAttribute("aria-checked")&&(n.setAttribute("aria-checked","false"),o(c,`aria-checked="false" on role=${y}`,"serious",n))}),t.renderTime=parseFloat((performance.now()-a).toFixed(2)),t},scan(){let e={fixed:0,scanned:0,renderTime:0,score:100,details:[]};if(typeof document>"u")return e;let t=performance.now(),a=document.querySelectorAll("*");e.scanned=a.length;let i=(o,l,n,c)=>e.details.push({tag:o,fix:l,severity:n,element:c.outerHTML.slice(0,100)});return a.forEach(o=>{let l=o,n=l.tagName.toLowerCase();(n==="a"||n==="button")&&!l.innerText?.trim()&&!l.getAttribute("aria-label")&&i(n,"needs aria-label (empty)","critical",l),n==="img"&&!l.hasAttribute("alt")&&i(n,"needs alt text","serious",l),ut.has(n)&&!l.getAttribute("aria-label")&&!l.getAttribute("aria-labelledby")&&i(n,"needs aria-label","serious",l),n==="iframe"&&!l.getAttribute("title")&&!l.getAttribute("aria-label")&&i(n,"iframe needs title","serious",l)}),e.fixed=e.details.length,e.score=yt(e),e.renderTime=parseFloat((performance.now()-t).toFixed(2)),e},startObserver(e){this.observer||typeof document>"u"||(this.observer=new MutationObserver(()=>this.applyFixes(e)),this.observer.observe(document.body,{childList:!0,subtree:!0,attributes:!1}))},stopObserver(){this.observer?.disconnect(),this.observer=null},announce:m,speak:We,showVisualAlert:xt,trapFocus:be,handlePlainEnglish:pt,handleSummarisePage:ft,handleTranslate:mt,handleVoiceControl:gt,handleSmartLabels:bt,SUPPORTED_LANGUAGES:ue};import aa,{useEffect as J,useState as w,useCallback as X}from"react";import{forwardRef as Xt,useEffect as ye,useState as D}from"react";import{jsx as r,jsxs as u}from"react/jsx-runtime";var He={highContrast:!1,reduceMotion:!1,autoFix:!0,dyslexiaFont:!1,fontScale:100,localFont:"",darkMode:!1,largeTargets:!1,speechEnabled:!1,colorBlindMode:"none",showAuditBadge:!1,timeoutWarning:void 0,plainEnglish:!1,summarisePage:!1,translateLanguage:"en",voiceControl:!1,smartLabels:!1},Y=[80,90,100,110,120,130],Qt=[{value:"none",label:"None"},{value:"deuteranopia",label:"Deuteranopia"},{value:"protanopia",label:"Protanopia"},{value:"tritanopia",label:"Tritanopia"},{value:"achromatopsia",label:"Greyscale"}],Zt=["Prompt API for Gemini Nano","Summarization API for Gemini Nano","Writer API for Gemini Nano","Rewriter API for Gemini Nano","Translation API"];function ea(){let[e,t]=D(typeof window<"u"?window.innerWidth:1024);return ye(()=>{let a=()=>t(window.innerWidth);return window.addEventListener("resize",a),()=>window.removeEventListener("resize",a)},[]),{isMobile:e<=480,isTablet:e>480&&e<=768}}function ta({checked:e,onChange:t,label:a,disabled:i=!1}){return u("label",{"aria-label":a,style:{position:"relative",display:"inline-flex",width:"40px",height:"24px",cursor:i?"not-allowed":"pointer",flexShrink:0,opacity:i?.4:1},children:[r("input",{type:"checkbox",checked:e,disabled:i,onChange:o=>t(o.target.checked),style:{opacity:0,width:0,height:0,position:"absolute"}}),r("span",{style:{position:"absolute",inset:0,borderRadius:"99px",background:e?"#0d9488":"#cbd5e1",transition:"background 0.2s"}}),r("span",{style:{position:"absolute",top:"3px",left:e?"19px":"3px",width:"18px",height:"18px",background:"#fff",borderRadius:"50%",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)",pointerEvents:"none"}})]})}function U({label:e,color:t="#64748b",badge:a,concept:i}){return u("div",{style:{margin:"10px 18px 4px"},children:[u("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[r("p",{style:{margin:0,fontSize:"10px",fontWeight:600,color:t,letterSpacing:"0.06em",textTransform:"uppercase"},children:e}),a&&r("span",{style:{fontSize:"9px",fontWeight:500,padding:"1px 7px",borderRadius:"99px",background:"#f5f3ff",color:"#7c3aed",border:"0.5px solid #c4b5fd",whiteSpace:"nowrap"},children:a})]}),i&&r("p",{style:{margin:"2px 0 0",fontSize:"9px",color:"#94a3b8",fontStyle:"italic"},children:i})]})}function z({icon:e,label:t,desc:a,checked:i,onChange:o,disabled:l=!1,disabledReason:n,tip:c}){return u("div",{title:l?n:c,style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 18px",gap:"12px"},children:[u("div",{style:{display:"flex",alignItems:"center",gap:"10px",flex:1,minWidth:0},children:[r("span",{"aria-hidden":"true",style:{width:"32px",height:"32px",borderRadius:"8px",background:l?"#f1f5f9":"#f0fdfa",color:l?"#94a3b8":"#0d9488",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"15px",flexShrink:0,fontWeight:700},children:e}),u("div",{style:{minWidth:0},children:[r("p",{style:{margin:0,fontSize:"13px",fontWeight:500,color:l?"#94a3b8":"#0f172a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:t}),r("p",{style:{margin:0,fontSize:"10px",color:"#94a3b8"},children:l?n:a})]})]}),r(ta,{checked:i,onChange:o,label:`Toggle ${t}`,disabled:l})]})}function A(){return r("div",{style:{height:"1px",background:"#f1f5f9"}})}function ae({steps:e}){return u("div",{style:{margin:"0 18px 8px",padding:"8px 10px",background:"#f8fafc",borderRadius:"8px",border:"0.5px solid #e2e8f0"},children:[r("p",{style:{margin:"0 0 4px",fontSize:"9px",fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.05em"},children:"How to use"}),e.map((t,a)=>u("p",{style:{margin:"0 0 2px",fontSize:"10px",color:"#475569"},children:[a+1,". ",t]},a))]})}var $e=Xt(({position:e,settings:t,report:a,isActive:i,aiSupported:o,voiceSupported:l,set:n,onApply:c,onReset:y,onClose:p},k)=>{let{isMobile:h,isTablet:ne}=ea(),[_,ve]=D([]),[W,oe]=D(""),[q,T]=D(""),[S,E]=D(!1),[f,Q]=D(null),[F,C]=D("idle");ye(()=>{let s=window;!!(s.LanguageModel||s.ai?.languageModel)&&o?Q("gemini"):se()&&Q("transformers")},[o]),ye(()=>{if(f!=="transformers")return;let s=setInterval(()=>{C(le())},500);return()=>clearInterval(s)},[f]);let Z=async()=>{if(!(!W.trim()||S)){if(!f){T("\u26A0\uFE0F No AI engine available on this device.");return}E(!0),T("");try{let s;f==="gemini"?s=await Ke(W):(C("loading"),s=await Ye(W),C("ready")),T(s.success&&s.answer?s.answer.replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/#+\s/g,"").trim():"\u26A0\uFE0F "+(s.error||"No answer found on this page"))}catch{T("\u26A0\uFE0F Failed to get answer. Please try again.")}E(!1)}};ye(()=>{(async()=>{try{let H=window;if(!H.queryLocalFonts)return;let O=await H.queryLocalFonts(),$=[...new Set(O.map(te=>te.family))].sort();ve($.slice(0,50))}catch{}})()},[]);let v=f==="gemini"?"Gemini Nano":f==="transformers"?"Transformers.js \xB7 All devices":"Detecting...",ie=f==="transformers"&&F==="loading"?"Loading AI model... (first time only)":"...",ee=h?{position:"fixed",bottom:0,left:0,right:0,zIndex:9999,background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px 16px 0 0",boxShadow:"0 -8px 32px rgba(0,0,0,0.12)",maxHeight:"90vh",overflowY:"auto",fontFamily:"system-ui,-apple-system,sans-serif",width:"100%"}:{position:"fixed",bottom:"84px",[e]:"24px",zIndex:9999,width:ne?"300px":"320px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",maxHeight:"80vh",overflowY:"auto",fontFamily:"system-ui,-apple-system,sans-serif"};return u("div",{ref:k,role:"dialog","aria-modal":"true","aria-label":"yuktai accessibility preferences","data-yuktai-panel":"true",style:ee,children:[u("div",{style:{padding:"14px 18px 12px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"flex-start",justifyContent:"space-between",position:"sticky",top:0,background:"#fff",zIndex:1},children:[u("div",{children:[u("div",{style:{display:"flex",alignItems:"center",gap:"7px",marginBottom:"4px",flexWrap:"wrap"},children:[r("span",{style:{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0d9488",letterSpacing:"0.05em",fontFamily:"monospace"},children:"@yuktishaalaa/yuktai"}),i&&r("span",{style:{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0f766e",border:"1px solid #99f6e4"},children:"\u25CF ACTIVE"})]}),r("p",{style:{margin:"0 0 1px",fontSize:"15px",fontWeight:600,color:"#0f172a"},children:"Accessibility"}),r("p",{style:{margin:0,fontSize:"11px",color:"#64748b"},children:"WCAG 2.2 \xB7 Open source \xB7 Zero cost \xB7 All devices"})]}),r("button",{onClick:p,"aria-label":"Close accessibility panel",style:{background:"none",border:"none",cursor:"pointer",padding:"4px",color:"#94a3b8",fontSize:"20px",lineHeight:1,borderRadius:"6px",flexShrink:0,minWidth:h?"44px":"auto",minHeight:h?"44px":"auto",display:"flex",alignItems:"center",justifyContent:"center"},children:"\xD7"})]}),r(U,{label:"\u267F Core Accessibility",concept:"Rule-based engine \u2014 works on all browsers and devices"}),r(ae,{steps:["Toggle any feature on","Click Apply settings","Preferences saved automatically"]}),r(z,{icon:"\u{1F527}",label:"Auto-fix ARIA",desc:"Injects missing labels and roles automatically",checked:t.autoFix,onChange:s=>n("autoFix",s),tip:"Fixes aria-label, alt text, roles on every element"}),r(A,{}),r(z,{icon:"\u{1F50A}",label:"Speak on focus",desc:"Browser reads elements aloud as you tab",checked:t.speechEnabled,onChange:s=>n("speechEnabled",s),tip:"Uses browser SpeechSynthesis \u2014 no install needed"}),r(A,{}),r(z,{icon:"\u{1F399}\uFE0F",label:"Voice control",desc:"Say commands to navigate the page",checked:t.voiceControl,onChange:s=>n("voiceControl",s),disabled:!l,disabledReason:"Not supported in this browser",tip:'Say "scroll down", "go to main", "click"'}),r(A,{}),r(U,{label:"\u{1F916} AI Features",color:"#7c3aed",badge:"Gemini Nano",concept:"Large Language Model running privately on your device \u2014 Chrome 127+ only"}),r("div",{style:{margin:"4px 18px 6px",padding:"8px 10px",background:o?"#f0fdfa":"#f5f3ff",borderRadius:"8px",border:`0.5px solid ${o?"#99f6e4":"#c4b5fd"}`,fontSize:"10px",color:o?"#0f766e":"#7c3aed",lineHeight:1.5},children:o?"\u2705 Gemini Nano detected \u2014 AI features ready. Runs privately on your device.":"\u2699\uFE0F AI features need one-time setup \u2014 see guide below."}),!o&&u("div",{style:{margin:"0 18px 8px",padding:"10px 12px",background:"#fafafa",borderRadius:"8px",border:"0.5px solid #e2e8f0",fontSize:"11px",color:"#475569",lineHeight:1.7},children:[r("p",{style:{margin:"0 0 6px",fontWeight:600,color:"#0f172a",fontSize:"11px"},children:"\u{1F6E0} One-time setup \u2014 5 steps:"}),u("p",{style:{margin:"0 0 3px"},children:["1. Open Chrome \u2192 ",r("code",{style:{background:"#f1f5f9",padding:"1px 5px",borderRadius:"4px",fontSize:"10px",color:"#0d9488",fontFamily:"monospace"},children:"chrome://flags"})]}),r("p",{style:{margin:"0 0 3px"},children:"2. Enable each flag:"}),r("div",{style:{display:"flex",flexDirection:"column",gap:"2px",margin:"4px 0 6px 10px"},children:Zt.map(s=>u("span",{style:{fontSize:"10px",color:"#7c3aed",fontFamily:"monospace"},children:["\u2192 ",s]},s))}),u("p",{style:{margin:"0 0 3px"},children:["3. Click ",r("strong",{style:{color:"#0f172a"},children:"Relaunch"})]}),u("p",{style:{margin:"0 0 3px"},children:["4. ",r("code",{style:{background:"#f1f5f9",padding:"1px 5px",borderRadius:"4px",fontSize:"10px",color:"#0d9488",fontFamily:"monospace"},children:"chrome://components"})," \u2192 Optimization Guide On Device Model \u2192 Check for update"]}),r("p",{style:{margin:"0"},children:"5. Refresh \u2014 AI features unlock automatically \u2705"})]}),r(z,{icon:"\u{1F4DD}",label:"Plain English mode",desc:"Rewrites complex text in simple language",checked:t.plainEnglish,onChange:s=>n("plainEnglish",s),disabled:!o,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: LLM text rewriting"}),r(A,{}),r(z,{icon:"\u{1F4CB}",label:"Summarise page",desc:"3-sentence summary appears at top",checked:t.summarisePage,onChange:s=>n("summarisePage",s),disabled:!o,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: Abstractive summarisation"}),r(A,{}),r(z,{icon:"\u{1F3F7}\uFE0F",label:"Smart aria-labels",desc:"AI generates meaningful labels for elements",checked:t.smartLabels,onChange:s=>n("smartLabels",s),disabled:!o,disabledReason:"Enable Gemini Nano \u2014 see setup above",tip:"AI concept: Context-aware label generation"}),r(A,{}),r(U,{label:"\u{1F441}\uFE0F Visual",concept:"CSS filter-based \u2014 works on all browsers and devices"}),r(ae,{steps:["Toggle any visual mode","Changes apply instantly","Works on mobile and desktop"]}),r(z,{icon:"\u25D1",label:"High contrast",desc:"Boosts contrast for low vision users",checked:t.highContrast,onChange:s=>n("highContrast",s),tip:"CSS filter: contrast()"}),r(A,{}),r(z,{icon:"\u{1F319}",label:"Dark mode",desc:"Inverts colours \u2014 easy on eyes at night",checked:t.darkMode,onChange:s=>n("darkMode",s),tip:"CSS filter: invert + hue-rotate"}),r(A,{}),r(z,{icon:"\u23F8\uFE0F",label:"Reduce motion",desc:"Disables all animations",checked:t.reduceMotion,onChange:s=>n("reduceMotion",s),tip:"WCAG 2.3.3 \u2014 vestibular disorders"}),r(A,{}),r(z,{icon:"\u{1F446}",label:"Large targets",desc:"44\xD744px minimum touch targets",checked:t.largeTargets,onChange:s=>n("largeTargets",s),tip:"WCAG 2.5.8 \u2014 motor impaired users"}),r(A,{}),u("div",{style:{padding:"10px 18px"},children:[r("p",{style:{margin:"0 0 2px",fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F3A8} Colour blindness"}),r("p",{style:{margin:"0 0 8px",fontSize:"10px",color:"#94a3b8"},children:"SVG colour matrix filters \u2014 all devices"}),r("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"},children:Qt.map(s=>r("button",{onClick:()=>n("colorBlindMode",s.value),"aria-pressed":t.colorBlindMode===s.value,style:{padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500,border:`1px solid ${t.colorBlindMode===s.value?"#0d9488":"#e2e8f0"}`,background:t.colorBlindMode===s.value?"#f0fdfa":"#fff",color:t.colorBlindMode===s.value?"#0d9488":"#64748b",cursor:"pointer",minHeight:h?"36px":"auto"},children:s.label},s.value))})]}),r(A,{}),r(U,{label:"\u{1F524} Font",concept:"Browser Font API + CSS \u2014 Chrome 103+"}),r(ae,{steps:["Toggle dyslexia font or pick from device","Adjust size with + / \u2212","Saved across visits"]}),r(z,{icon:"Aa",label:"Dyslexia-friendly font",desc:"Atkinson Hyperlegible \u2014 research-backed",checked:t.dyslexiaFont,onChange:s=>n("dyslexiaFont",s),tip:"By Braille Institute \u2014 free and open source"}),r(A,{}),u("div",{style:{padding:"10px 18px"},children:[r("p",{style:{margin:"0 0 2px",fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F5A5}\uFE0F Local font"}),r("p",{style:{margin:"0 0 8px",fontSize:"10px",color:"#94a3b8"},children:"window.queryLocalFonts() \u2014 Chrome 103+"}),_.length>0?u("select",{value:t.localFont,onChange:s=>n("localFont",s.target.value),"aria-label":"Choose a font from your device",style:{width:"100%",padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"13px",color:"#0f172a",background:"#fff",cursor:"pointer",height:h?"44px":"36px"},children:[r("option",{value:"",children:"System default"}),_.map(s=>r("option",{value:s,style:{fontFamily:s},children:s},s))]}):r("p",{style:{margin:0,fontSize:"11px",color:"#94a3b8"},children:"Allow font access when Chrome prompts you."})]}),r(A,{}),u("div",{style:{padding:"10px 18px 14px"},children:[u("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"10px"},children:[u("div",{children:[r("p",{style:{margin:0,fontSize:"12px",fontWeight:500,color:"#0f172a"},children:"\u{1F4CF} Text size"}),r("p",{style:{margin:0,fontSize:"10px",color:"#94a3b8"},children:"Scales all text on the page"})]}),u("span",{style:{fontSize:"12px",fontWeight:600,color:"#0d9488",background:"#f0fdfa",padding:"2px 8px",borderRadius:"99px"},children:[t.fontScale,"%"]})]}),u("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[r("button",{onClick:()=>{let s=Y.indexOf(t.fontScale);s>0&&n("fontScale",Y[s-1])},disabled:t.fontScale<=80,"aria-label":"Decrease text size",style:{width:h?"44px":"30px",height:h?"44px":"30px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:t.fontScale<=80?"not-allowed":"pointer",fontSize:"16px",color:t.fontScale<=80?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"\u2212"}),r("div",{style:{flex:1,display:"flex",gap:"3px"},children:Y.map(s=>r("button",{onClick:()=>n("fontScale",s),"aria-label":`Set text size to ${s}%`,style:{flex:1,height:"6px",borderRadius:"99px",border:"none",cursor:"pointer",padding:0,background:s<=t.fontScale?"#0d9488":"#e2e8f0",transition:"background 0.15s"}},s))}),r("button",{onClick:()=>{let s=Y.indexOf(t.fontScale);s<Y.length-1&&n("fontScale",Y[s+1])},disabled:t.fontScale>=130,"aria-label":"Increase text size",style:{width:h?"44px":"30px",height:h?"44px":"30px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:t.fontScale>=130?"not-allowed":"pointer",fontSize:"16px",color:t.fontScale>=130?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:"+"})]})]}),r(A,{}),r(U,{label:"\u{1F310} Translate",color:"#7c3aed",badge:"Gemini Nano",concept:"Chrome Translation API \u2014 on device, no internet after setup"}),r(ae,{steps:["Enable Gemini Nano first","Pick your language","Full page translates instantly"]}),u("div",{style:{padding:"6px 18px 12px"},children:[r("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"},children:ue.slice(0,h?8:18).map(s=>r("button",{onClick:()=>n("translateLanguage",s.code),"aria-pressed":t.translateLanguage===s.code,disabled:!o,style:{padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500,border:`1px solid ${t.translateLanguage===s.code?"#7c3aed":"#e2e8f0"}`,background:t.translateLanguage===s.code?"#f5f3ff":"#fff",color:t.translateLanguage===s.code?"#7c3aed":"#64748b",cursor:o?"pointer":"not-allowed",opacity:o?1:.5,minHeight:h?"36px":"auto"},children:s.label},s.code))}),!o&&r("p",{style:{margin:"6px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Enable Gemini Nano using the setup guide above."})]}),r(A,{}),r(U,{label:"\u{1F4AC} Ask This Page",color:"#0d9488",badge:v,concept:"RAG \u2014 Retrieval Augmented Generation. Works on all devices including mobile."}),r(ae,{steps:["Type any question about this page","Press Ask or hit Enter",f==="transformers"?"Transformers.js answers \u2014 works on mobile, offline":"Gemini Nano reads page and answers privately","Zero cost. No data leaves your device."]}),u("div",{style:{margin:"0 18px 8px",padding:"6px 10px",background:f==="gemini"?"#f0fdfa":f==="transformers"?"#f5f3ff":"#f8fafc",borderRadius:"8px",border:`0.5px solid ${f==="gemini"?"#99f6e4":f==="transformers"?"#c4b5fd":"#e2e8f0"}`,fontSize:"10px",color:f==="gemini"?"#0f766e":f==="transformers"?"#7c3aed":"#94a3b8"},children:[f==="gemini"&&"\u2705 Using Gemini Nano \u2014 on device, private, instant",f==="transformers"&&"\u2705 Using Transformers.js \u2014 works on mobile and all browsers",!f&&"\u23F3 Detecting AI engine...",f==="transformers"&&F==="loading"&&" \xB7 Loading model...",f==="transformers"&&F==="ready"&&" \xB7 Model ready \u2705"]}),u("div",{style:{padding:"0 18px 14px"},children:[u("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[r("input",{type:"text",value:W,onChange:s=>oe(s.target.value),onKeyDown:s=>{s.key==="Enter"&&Z()},placeholder:"e.g. What does this page do?",disabled:S||!f,"aria-label":"Ask a question about this page",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:f?"#fff":"#f8fafc",outline:"none",height:h?"44px":"36px"}}),r("button",{onClick:Z,disabled:S||!W.trim()||!f,"aria-label":"Ask question",style:{padding:"8px 14px",borderRadius:"8px",border:"none",background:f&&W.trim()&&!S?"#0d9488":"#e2e8f0",color:f&&W.trim()&&!S?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:f&&W.trim()&&!S?"pointer":"not-allowed",flexShrink:0,height:h?"44px":"36px",minWidth:"52px",transition:"background 0.2s"},children:S?ie:"Ask"})]}),q&&u("div",{role:"status","aria-live":"polite",style:{padding:"10px 12px",background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"8px",fontSize:"12px",color:"#0f766e",lineHeight:1.6,maxHeight:"180px",overflowY:"auto"},children:[r("strong",{style:{display:"block",marginBottom:"4px",fontSize:"11px",color:"#0d9488"},children:"\u{1F4AC} Answer"}),q,r("button",{onClick:()=>{T(""),oe("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]})]}),a&&r("div",{role:"status",style:{margin:"0 14px 10px",padding:"8px 12px",background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"8px",fontSize:"12px",color:"#0f766e",fontWeight:500,fontFamily:"monospace"},children:a.fixed>0?`\u2713 ${a.fixed} fixes \xB7 ${a.scanned} nodes \xB7 ${a.renderTime}ms \xB7 Score: ${a.score}/100`:`\u2713 0 auto-fixes needed \xB7 ${a.scanned} nodes \xB7 ${a.renderTime}ms`}),u("div",{style:{display:"flex",gap:"8px",padding:"12px 14px 14px",position:h?"sticky":"relative",bottom:h?0:"auto",background:"#fff",borderTop:"1px solid #f1f5f9"},children:[r("button",{onClick:y,style:{flex:1,padding:h?"12px 0":"8px 0",fontSize:"13px",fontWeight:500,borderRadius:"9px",border:"1px solid #e2e8f0",background:"#fff",color:"#64748b",cursor:"pointer"},children:"Reset"}),r("button",{onClick:c,style:{flex:2,padding:h?"12px 0":"8px 0",fontSize:"13px",fontWeight:600,borderRadius:"9px",border:"none",background:"#0d9488",color:"#fff",cursor:"pointer"},children:"Apply settings"})]})]})});$e.displayName="WidgetPanel";import{Fragment as oa,jsx as g,jsxs as I}from"react/jsx-runtime";async function na(){try{if(typeof window>"u")return!1;let e=window;if(e.LanguageModel)try{if(typeof e.LanguageModel.availability=="function"){let a=await e.LanguageModel.availability();if(a==="readily"||a==="available"||a==="downloadable")return!0}else return!0}catch{}if(e.Summarizer)try{let a=await e.Summarizer.availability?.();if(!a||a==="readily"||a==="available")return!0}catch{}if(e.Rewriter)try{let a=await e.Rewriter.availability?.();if(!a||a==="readily"||a==="available")return!0}catch{}if(e.Writer)try{let a=await e.Writer.availability?.();if(!a||a==="readily"||a==="available")return!0}catch{}let t=e.ai||globalThis.ai;if(t){if(t.languageModel?.availability)try{let a=await t.languageModel.availability();if(a==="readily"||a==="available")return!0}catch{}if(t.languageModel&&typeof t.languageModel.create=="function"||t.summarizer||t.rewriter||t.writer||t.languageModel)return!0}return!!(e.Translator||e.translation?.canTranslate)}catch{return!1}}function Fe({position:e="left",children:t,config:a={},showRag:i=!1,showAgent:o=!1}){let[l,n]=w(!1),[c,y]=w(He),[p,k]=w(null),[h,ne]=w(!1),[_,ve]=w(!1),[W,oe]=w(!1),q=aa.useRef(null),[T,S]=w(!1),[E,f]=w(""),[Q,F]=w(""),[C,Z]=w(!1),[v,ie]=w(null),[ee,s]=w("idle"),[H,O]=w(!1),[$,te]=w(""),[wt,re]=w(""),[B,Be]=w(!1),[Ne,we]=w([]),[L,Oe]=w(null),kt=24,De=84,Ge=i?144:84;J(()=>{if(typeof window>"u")return;let d=window;!!(d.LanguageModel||d.ai?.languageModel)&&_?(ie("gemini"),Oe("gemini")):se()&&(ie("transformers"),Oe("transformers"))},[_]),J(()=>{if(v!=="transformers")return;let d=setInterval(()=>s(le()),500);return()=>clearInterval(d)},[v]);let _e=X(async()=>{if(!(!E.trim()||C)){if(!v){F("\u26A0\uFE0F No AI engine available.");return}Z(!0),F("");try{let d;if(v==="gemini"){let{askPage:b}=await import("./rag-MKBAGH6J.mjs");d=await b(E)}else{s("loading");let{askPageWithTransformers:b}=await import("./transformers-rag-HW4QKA5T.mjs");d=await b(E),s("ready")}F(d.success&&d.answer?d.answer.replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/#+\s/g,"").trim():"\u26A0\uFE0F "+(d.error||"No answer found."))}catch{F("\u26A0\uFE0F Something went wrong.")}Z(!1)}},[E,C,v]),qe=X(async()=>{if(!$.trim()||B)return;if(!L){re("\u26A0\uFE0F No AI engine available.");return}Be(!0),we([]),re("");let{runAgent:d}=await import("./agent-JGLAYQMX.mjs");await d($,L,b=>{we(N=>[...N,b.text])}),Be(!1),re("done")},[$,B,L]);J(()=>{if(typeof window>"u")return;let b=setTimeout(async()=>{let N=window,Ct=await na();ve(Ct),oe(!!(N.SpeechRecognition||N.webkitSpeechRecognition))},800);return()=>clearTimeout(b)},[]),J(()=>{if(!(typeof window>"u"))try{let d=localStorage.getItem("yuktai-a11y-prefs");d&&y(b=>({...b,...JSON.parse(d)}))}catch{}},[]);let Ve=X(async d=>{let b={enabled:!0,highContrast:d.highContrast,darkMode:d.darkMode,reduceMotion:d.reduceMotion,largeTargets:d.largeTargets,speechEnabled:d.speechEnabled,autoFix:d.autoFix,dyslexiaFont:d.dyslexiaFont,localFont:d.localFont,fontSizeMultiplier:d.fontScale/100,colorBlindMode:d.colorBlindMode,showAuditBadge:d.showAuditBadge,showSkipLinks:!0,showPreferencePanel:!1,plainEnglish:d.plainEnglish,summarisePage:d.summarisePage,translateLanguage:d.translateLanguage,voiceControl:d.voiceControl,smartLabels:d.smartLabels,...a};await P.execute(b),k(P.applyFixes(b)),ne(!0)},[a]),At=X(async()=>{try{localStorage.setItem("yuktai-a11y-prefs",JSON.stringify(c))}catch{}await Ve(c),n(!1)},[c,Ve]),St=X(()=>{y(He);try{localStorage.removeItem("yuktai-a11y-prefs")}catch{}let d=document.documentElement;["data-yuktai-high-contrast","data-yuktai-dark","data-yuktai-reduce-motion","data-yuktai-large-targets","data-yuktai-keyboard","data-yuktai-dyslexia"].forEach(b=>d.removeAttribute(b)),document.body.style.filter="",document.body.style.fontFamily="",document.documentElement.style.fontSize="",k(null),ne(!1)},[]),Tt=X((d,b)=>{y(N=>({...N,[d]:b}))},[]);J(()=>{let d=b=>{b.key==="Escape"&&(l&&n(!1),T&&S(!1),H&&O(!1))};return window.addEventListener("keydown",d),()=>window.removeEventListener("keydown",d)},[l,T,H]),J(()=>{l&&q.current&&P.trapFocus(q.current)},[l]);let ke=(d,b,N)=>({position:"fixed",bottom:`${d}px`,[e]:"24px",zIndex:9998,width:"52px",height:"52px",borderRadius:"50%",background:b,color:"#fff",border:"none",cursor:"pointer",fontSize:"22px",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,0,0,0.25)",transition:"transform 0.15s, background 0.2s"}),Ae=d=>{d.currentTarget.style.transform="scale(1.08)"},Se=d=>{d.currentTarget.style.transform="scale(1)"},je=v==="gemini"?"Gemini Nano \xB7 On device":v==="transformers"?"Transformers.js \xB7 All devices":"Detecting...",Et=v==="transformers"&&ee==="loading"?"Loading model...":"...";return I(oa,{children:[t,o&&g("button",{style:ke(Ge,H?"#059669":"#10b981",H),"aria-label":"Open AI agent","aria-haspopup":"dialog","aria-expanded":H,title:"\u{1F916} AI Agent \u2014 guide me through this page",onClick:()=>{O(d=>!d),S(!1),n(!1)},onMouseEnter:Ae,onMouseLeave:Se,children:"\u{1F916}"}),o&&H&&I("div",{role:"dialog","aria-modal":"true","aria-label":"yuktai AI Agent","data-yuktai-panel":"true",style:{position:"fixed",bottom:`${Ge+64}px`,[e]:"24px",zIndex:9999,width:"300px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",fontFamily:"system-ui,-apple-system,sans-serif",padding:"14px",maxHeight:"70vh",overflowY:"auto"},children:[I("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"},children:[I("div",{children:[g("p",{style:{margin:"0 0 2px",fontSize:"13px",fontWeight:600,color:"#0f172a"},children:"\u{1F916} AI Agent"}),g("p",{style:{margin:0,fontSize:"10px",color:"#10b981"},children:L==="gemini"?"Gemini Nano \xB7 On device":L==="transformers"?"Transformers.js \xB7 All devices":"Detecting..."})]}),g("button",{onClick:()=>O(!1),"aria-label":"Close agent panel",style:{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"18px",lineHeight:1,padding:"2px"},children:"\xD7"})]}),g("p",{style:{margin:"0 0 8px",fontSize:"11px",color:"#64748b"},children:"Tell me what you want to do on this page. I will guide you step by step."}),g("div",{style:{display:"flex",flexWrap:"wrap",gap:"4px",marginBottom:"8px"},children:["Fill this form","Find contact info","What is this page?","Guide me to apply"].map(d=>g("button",{onClick:()=>te(d),style:{padding:"3px 8px",borderRadius:"20px",fontSize:"10px",border:"1px solid #e2e8f0",background:"#f8fafc",color:"#64748b",cursor:"pointer"},children:d},d))}),I("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[g("input",{type:"text",value:$,onChange:d=>te(d.target.value),onKeyDown:d=>{d.key==="Enter"&&qe()},placeholder:"e.g. Help me fill this form",disabled:B||!L,"aria-label":"Tell the agent what to do",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:L?"#fff":"#f8fafc",outline:"none",height:"36px"}}),g("button",{onClick:qe,disabled:B||!$.trim()||!L,"aria-label":"Run agent",style:{padding:"8px 12px",borderRadius:"8px",border:"none",background:L&&$.trim()&&!B?"#10b981":"#e2e8f0",color:L&&$.trim()&&!B?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:L&&$.trim()&&!B?"pointer":"not-allowed",height:"36px",minWidth:"52px",transition:"background 0.2s"},children:B?"...":"Go"})]}),Ne.length>0&&I("div",{style:{padding:"10px 12px",background:"#f0fdf4",border:"1px solid #86efac",borderRadius:"8px",fontSize:"11px",color:"#166534",lineHeight:1.7},children:[Ne.map((d,b)=>g("p",{style:{margin:"0 0 2px"},children:d},b)),wt==="done"&&g("button",{onClick:()=>{we([]),te(""),re("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]}),!L&&g("p",{style:{margin:"4px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Enable Gemini Nano via chrome://flags for best results."})]}),i&&g("button",{style:ke(De,T?"#7c3aed":"#6d28d9",T),"aria-label":"Ask a question about this page","aria-haspopup":"dialog","aria-expanded":T,title:`\u{1F4AC} Ask this page \xB7 ${je}`,onClick:()=>{S(d=>!d),n(!1),O(!1)},onMouseEnter:Ae,onMouseLeave:Se,children:"\u{1F4AC}"}),i&&T&&I("div",{role:"dialog","aria-modal":"true","aria-label":"Ask this page","data-yuktai-panel":"true",style:{position:"fixed",bottom:`${De+64}px`,[e]:"24px",zIndex:9999,width:"300px",maxWidth:"calc(100vw - 48px)",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",fontFamily:"system-ui,-apple-system,sans-serif",padding:"14px"},children:[I("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"},children:[I("div",{children:[g("p",{style:{margin:"0 0 2px",fontSize:"13px",fontWeight:600,color:"#0f172a"},children:"\u{1F4AC} Ask this page"}),g("p",{style:{margin:0,fontSize:"10px",color:"#7c3aed"},children:je}),v==="transformers"&&ee==="loading"&&g("p",{style:{margin:"2px 0 0",fontSize:"9px",color:"#94a3b8"},children:"Downloading model \u2014 first time only"}),v==="transformers"&&ee==="ready"&&g("p",{style:{margin:"2px 0 0",fontSize:"9px",color:"#10b981"},children:"Model ready \u2705 \u2014 works offline"})]}),g("button",{onClick:()=>S(!1),"aria-label":"Close ask panel",style:{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"18px",lineHeight:1,padding:"2px"},children:"\xD7"})]}),I("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[g("input",{type:"text",value:E,onChange:d=>f(d.target.value),onKeyDown:d=>{d.key==="Enter"&&_e()},placeholder:"e.g. What does this page do?",disabled:C||!v,"aria-label":"Ask a question about this page",style:{flex:1,padding:"8px 10px",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px",color:"#0f172a",background:v?"#fff":"#f8fafc",outline:"none",height:"36px"}}),g("button",{onClick:_e,disabled:C||!E.trim()||!v,"aria-label":"Submit question",style:{padding:"8px 12px",borderRadius:"8px",border:"none",background:v&&E.trim()&&!C?"#7c3aed":"#e2e8f0",color:v&&E.trim()&&!C?"#fff":"#94a3b8",fontSize:"12px",fontWeight:600,cursor:v&&E.trim()&&!C?"pointer":"not-allowed",height:"36px",minWidth:"48px",transition:"background 0.2s"},children:C?Et:"Ask"})]}),Q&&I("div",{style:{padding:"10px",background:"#f5f3ff",borderRadius:"8px",fontSize:"12px",color:"#4c1d95",lineHeight:1.6,maxHeight:"180px",overflowY:"auto"},children:[g("strong",{style:{display:"block",marginBottom:"4px",fontSize:"11px",color:"#7c3aed"},children:"\u{1F4AC} Answer"}),Q,g("button",{onClick:()=>{F(""),f("")},style:{display:"block",marginTop:"6px",background:"none",border:"none",color:"#94a3b8",fontSize:"10px",cursor:"pointer",padding:0},children:"Clear"})]}),!v&&g("p",{style:{margin:"4px 0 0",fontSize:"10px",color:"#94a3b8"},children:"Detecting AI engine..."})]}),g("button",{style:ke(kt,h?"#0d9488":"#1a73e8",l),"aria-label":"Open accessibility preferences","aria-haspopup":"dialog","aria-expanded":l,"data-yuktai-pref-toggle":"true",title:"\u267F Accessibility settings",onClick:()=>{n(d=>!d),S(!1),O(!1)},onMouseEnter:Ae,onMouseLeave:Se,children:"\u267F"}),l&&g($e,{ref:q,position:e,settings:c,report:p,isActive:h,aiSupported:_,voiceSupported:W,set:Tt,onApply:At,onReset:St,onClose:()=>n(!1)})]})}var xe={name:"ai.text",async execute(e){return`\u{1F916} YuktAI says: ${e}`}};var he={name:"voice.text",async execute(e){return!e||e.trim()===""?"\u{1F3A4} No speech detected":`\u{1F3A4} You said: ${e}`}};var G=class{plugins=new Map;register(t,a){if(!a||typeof a.execute!="function")throw new Error(`Invalid plugin: ${t}`);this.plugins.set(t,a)}use(t){return this.plugins.get(t)}async run(t,a){try{let i=this.use(t);if(!i)throw new Error(`Plugin not found: ${t}`);return await i.execute(a)}catch(i){throw console.error(`[YuktAI Runtime Error in ${t}]:`,i),i}}getPlugins(){return Array.from(this.plugins.keys())}};function ia(){if(typeof globalThis>"u")return new G;if(!globalThis.__yuktai_runtime__){let e=new G;e.register(P.name,P),e.register(xe.name,xe),e.register(he.name,he),globalThis.__yuktai_runtime__=e}return globalThis.__yuktai_runtime__}var vt=typeof window<"u"?ia():new G,Xa={wcagPlugin:P,list(){return vt.getPlugins()},use(e){return vt.use(e)},fix(e){return P.applyFixes({enabled:!0,autoFix:!0,...e})},scan(){return P.scan()}};export{G as Runtime,Xa as YuktAI,Fe as YuktAIWrapper,xe as aiPlugin,Fe as default,he as voicePlugin,P as wcag,P as wcagPlugin};
