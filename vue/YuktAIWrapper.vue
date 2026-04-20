<template>
  <!--
    yuktai-a11y · vue/YuktAIWrapper.vue
    import YuktAIWrapper from "@yuktishaalaa/yuktai/vue";
    <YuktAIWrapper position="left"><RouterView /></YuktAIWrapper>
  -->
  <slot />

  <!-- FAB -->
  <button ref="fabRef" @click="open = !open"
    aria-label="Open yuktai-a11y accessibility options"
    :aria-expanded="open" aria-haspopup="dialog"
    :style="fabStyle"
    @mouseenter="fabScale='scale(1.08)'" @mouseleave="fabScale='scale(1)'"
    @focus="fabShadow='0 0 0 4px rgba(13,148,136,0.45)'" @blur="fabShadow='0 4px 14px rgba(0,0,0,0.18)'">
    <svg viewBox="0 0 24 24" :style="{width:'26px',height:'26px',fill:'#fff'}" aria-hidden="true">
      <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm9 4.5l-5-.5-2-.2V5l-4 .5-4-.5v.8L4 6.5 3 7l1 3 4-.5v2.3L6 17h2l2-4.5L12 14l2 2.5L16 17h2l-2-4.2V9.5l4 .5 1-3z"/>
    </svg>
    <span v-if="isActive" aria-hidden="true" :style="dotStyle" />
  </button>

  <!-- Panel -->
  <div v-if="open" ref="panelRef" role="dialog" aria-modal="true"
    aria-label="yuktai-a11y accessibility options" :style="panelStyle">

    <!-- Header -->
    <div :style="headerStyle">
      <div>
        <div style="display:flex;align-items:center;gap:7px;margin-bottom:5px;">
          <span :style="badgeStyle">@yuktishaalaa/yuktai v1.0.0</span>
          <span v-if="isActive" :style="activeBadgeStyle">● ACTIVE</span>
        </div>
        <p style="margin:0 0 2px;font-size:15px;font-weight:600;color:#0f172a;">Accessibility</p>
        <p style="margin:0;font-size:12px;color:#64748b;">Zero-config WCAG fixes · Open Source</p>
      </div>
      <button @click="open=false" aria-label="Close panel" :style="closeBtnStyle">×</button>
    </div>

    <!-- Toggles -->
    <div style="padding:6px 0;">
      <template v-for="(opt, i) in OPTIONS" :key="opt.id">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 18px;gap:12px;">
          <div style="display:flex;align-items:center;gap:10px;flex:1;">
            <span aria-hidden="true" :style="iconStyle">{{ opt.icon }}</span>
            <div>
              <p style="margin:0;font-size:13px;font-weight:500;color:#0f172a;">{{ opt.label }}</p>
              <p style="margin:0;font-size:11px;color:#94a3b8;">{{ opt.description }}</p>
            </div>
          </div>
          <label :aria-label="`Toggle ${opt.label}`" :style="toggleLabelStyle">
            <input type="checkbox" :checked="(settings as any)[opt.id]"
              @change="(e:any) => set(opt.id, e.target.checked)"
              style="opacity:0;width:0;height:0;position:absolute;" />
            <span :style="{position:'absolute',inset:0,borderRadius:'99px',background:(settings as any)[opt.id]?'#0d9488':'#cbd5e1',transition:'background 0.2s'}" />
            <span :style="{position:'absolute',top:'3px',left:(settings as any)[opt.id]?'19px':'3px',width:'18px',height:'18px',background:'#fff',borderRadius:'50%',transition:'left 0.2s',boxShadow:'0 1px 3px rgba(0,0,0,0.2)',pointerEvents:'none'}" />
          </label>
        </div>
        <div v-if="i < OPTIONS.length-1" style="height:1px;background:#f8fafc;margin:0 18px;" />
      </template>
    </div>

    <!-- Font size -->
    <div style="padding:10px 18px 14px;border-top:1px solid #f1f5f9;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
        <p style="margin:0;font-size:13px;font-weight:500;color:#0f172a;">Text size</p>
        <span style="font-size:12px;font-weight:600;color:#0d9488;background:#f0fdfa;padding:2px 8px;border-radius:99px;">{{ settings.fontScale }}%</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <button @click="decreaseFont" :disabled="settings.fontScale<=80" aria-label="Decrease text size" :style="fontBtnStyle(settings.fontScale<=80)">−</button>
        <div style="flex:1;display:flex;gap:3px;">
          <button v-for="s in FONT_STEPS" :key="s" @click="set('fontScale',s)" :aria-label="`Set text size to ${s}%`"
            :style="{flex:1,height:'6px',borderRadius:'99px',border:'none',cursor:'pointer',padding:0,background:s<=settings.fontScale?'#0d9488':'#e2e8f0',transition:'background 0.15s'}" />
        </div>
        <button @click="increaseFont" :disabled="settings.fontScale>=150" aria-label="Increase text size" :style="fontBtnStyle(settings.fontScale>=150)">+</button>
      </div>
    </div>

    <!-- Report -->
    <div v-if="report" role="status" style="margin:0 14px;padding:8px 12px;background:#f0fdfa;border:1px solid #99f6e4;border-radius:8px;font-size:12px;color:#0f766e;font-weight:500;font-family:monospace;">
      {{ report.fixed > 0 ? `✓ ${report.fixed} fixes applied · ${report.scanned} nodes · ${report.renderTime}ms` : `✓ 0 fixes needed · ${report.scanned} nodes clean · ${report.renderTime}ms` }}
    </div>

    <!-- Footer -->
    <div style="display:flex;gap:8px;padding:12px 14px 14px;">
      <button @click="resetSettings" style="flex:1;padding:8px 0;font-size:13px;font-weight:500;border-radius:9px;border:1px solid #e2e8f0;background:#fff;color:#64748b;cursor:pointer;">Reset</button>
      <button @click="applySettings" style="flex:2;padding:8px 0;font-size:13px;font-weight:600;border-radius:9px;border:none;background:#0d9488;color:#fff;cursor:pointer;">Apply settings</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { wcagPlugin, A11yReport } from "../core/renderer";

const props = withDefaults(defineProps<{ position?: "left" | "right" }>(), { position: "left" });

const open     = ref(false);
const isActive = ref(false);
const fabScale = ref("scale(1)");
const fabShadow = ref("0 4px 14px rgba(0,0,0,0.18)");
const report   = ref<A11yReport | null>(null);
const fabRef   = ref<HTMLButtonElement | null>(null);
const panelRef = ref<HTMLDivElement | null>(null);
const FONT_STEPS = [80,90,100,110,120,130,140,150];
const OPTIONS = [
  { id:"highContrast", label:"High contrast",         description:"contrast(1.15) brightness on all nodes", icon:"◑"  },
  { id:"reduceMotion", label:"Reduce motion",          description:"Disables all transitions & animations",   icon:"⏸"  },
  { id:"autoFix",      label:"Auto-fix ARIA",          description:"MutationObserver on new DOM nodes",       icon:"♿" },
  { id:"dyslexiaFont", label:"Dyslexia-friendly font", description:"Wider letter & word spacing",             icon:"Aa" },
];
const settings = ref({ highContrast:false, reduceMotion:false, autoFix:true, dyslexiaFont:false, fontScale:100 });
let _dyslexiaStyleNode: HTMLStyleElement | null = null;
let _focusStyleNode: HTMLStyleElement | null = null;

function set(key: string, val: boolean | number) { (settings.value as any)[key] = val; }
function decreaseFont() { const i=FONT_STEPS.indexOf(settings.value.fontScale); if(i>0) settings.value.fontScale=FONT_STEPS[i-1]; }
function increaseFont() { const i=FONT_STEPS.indexOf(settings.value.fontScale); if(i<FONT_STEPS.length-1) settings.value.fontScale=FONT_STEPS[i+1]; }

async function applySettings() {
  const cfg = { enabled:true, highContrast:settings.value.highContrast, reduceMotion:settings.value.reduceMotion, autoFix:settings.value.autoFix };
  console.log("[yuktai-a11y]", await wcagPlugin.execute(cfg));
  report.value = wcagPlugin.applyFixes(cfg);
  document.documentElement.style.fontSize = `${settings.value.fontScale}%`;
  if (settings.value.dyslexiaFont && !_dyslexiaStyleNode) {
    const s = document.createElement("style");
    s.textContent = `body,body *{font-family:'Georgia',serif!important;letter-spacing:.06em!important;word-spacing:.12em!important;line-height:1.9!important;}`;
    document.head.appendChild(s); _dyslexiaStyleNode = s;
  } else if (!settings.value.dyslexiaFont) { _dyslexiaStyleNode?.remove(); _dyslexiaStyleNode = null; }
  isActive.value = true; open.value = false;
  wcagPlugin.announce("yuktai-a11y active.");
}

async function resetSettings() {
  await wcagPlugin.execute({ enabled:false });
  document.documentElement.style.fontSize = "";
  _dyslexiaStyleNode?.remove(); _dyslexiaStyleNode = null;
  document.querySelectorAll<HTMLElement>("*").forEach((h) => { h.style.filter=""; h.style.transition=""; h.style.animation=""; });
  settings.value = { highContrast:false, reduceMotion:false, autoFix:true, dyslexiaFont:false, fontScale:100 };
  report.value = null; isActive.value = false;
  wcagPlugin.announce("yuktai-a11y disabled.");
}

onMounted(() => {
  if (!_focusStyleNode) {
    const s = document.createElement("style");
    s.innerHTML = `*:focus-visible{outline:3px solid #0d9488!important;outline-offset:2px!important;}`;
    document.head.appendChild(s); _focusStyleNode = s;
  }
  document.addEventListener("keydown", handleKey);
  document.addEventListener("mousedown", handleOutside);
});
onUnmounted(() => {
  wcagPlugin.stopObserver(); wcagPlugin.removeLiveRegion(); wcagPlugin.removeColorBlindSvg();
  _focusStyleNode?.remove(); _focusStyleNode = null;
  document.removeEventListener("keydown", handleKey);
  document.removeEventListener("mousedown", handleOutside);
});
function handleKey(e: KeyboardEvent) { if (e.key==="Escape"&&open.value) { open.value=false; fabRef.value?.focus(); } }
function handleOutside(e: MouseEvent) {
  if (!open.value) return;
  if (panelRef.value&&!panelRef.value.contains(e.target as Node)&&fabRef.value&&!fabRef.value.contains(e.target as Node)) open.value=false;
}

const sidePos   = computed(() => props.position==="left" ? {left:"24px"} : {right:"24px"});
const panelSide = computed(() => props.position==="left" ? {left:"88px"} : {right:"88px"});
const fabStyle  = computed(() => ({ position:"fixed",bottom:"24px",...sidePos.value,width:"52px",height:"52px",borderRadius:"50%",background:isActive.value?"#0f766e":"#0d9488",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:fabShadow.value,zIndex:9999,transition:"background 0.2s",transform:fabScale.value,outline:"none" }));
const dotStyle  = { position:"absolute",top:"4px",right:"4px",width:"10px",height:"10px",borderRadius:"50%",background:"#5eead4",border:"2px solid #fff" };
const panelStyle = computed(() => ({ position:"fixed",bottom:"24px",...panelSide.value,width:"312px",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",zIndex:9998,overflow:"hidden",fontFamily:"system-ui,-apple-system,sans-serif" }));
const headerStyle = { padding:"14px 18px 12px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"flex-start",justifyContent:"space-between" };
const badgeStyle  = { fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0d9488",letterSpacing:"0.05em",fontFamily:"monospace" };
const activeBadgeStyle = { fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"99px",background:"#f0fdfa",color:"#0f766e",border:"1px solid #99f6e4" };
const closeBtnStyle = { background:"none",border:"none",cursor:"pointer",padding:"4px",color:"#94a3b8",fontSize:"18px",lineHeight:1,borderRadius:"6px" };
const iconStyle     = { width:"30px",height:"30px",borderRadius:"8px",background:"#f0fdfa",color:"#0d9488",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",flexShrink:0,fontWeight:700 };
const toggleLabelStyle = { position:"relative",display:"inline-flex",width:"40px",height:"24px",cursor:"pointer",flexShrink:0 };
const fontBtnStyle = (dis: boolean) => ({ width:"30px",height:"30px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:dis?"not-allowed":"pointer",fontSize:"16px",color:dis?"#cbd5e1":"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 });
</script>