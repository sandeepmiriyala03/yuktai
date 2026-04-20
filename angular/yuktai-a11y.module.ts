// yuktai-a11y · angular/yuktai-a11y.module.ts
// import { YuktAIModule } from "@yuktishaalaa/yuktai/angular";
// <yuktai-a11y position="left"><router-outlet /></yuktai-a11y>

import {
  Component, Input, OnInit, OnDestroy, ElementRef, ViewChild,
  ChangeDetectionStrategy, ChangeDetectorRef, NgModule
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { wcagPlugin, A11yReport } from "../core/renderer";

interface WidgetSettings {
  highContrast: boolean; reduceMotion: boolean;
  autoFix: boolean; dyslexiaFont: boolean; fontScale: number;
}
const DEFAULT: WidgetSettings = { highContrast:false, reduceMotion:false, autoFix:true, dyslexiaFont:false, fontScale:100 };
const FONT_STEPS = [80,90,100,110,120,130,140,150];
const OPTIONS = [
  { id:"highContrast", label:"High contrast",         description:"contrast(1.15) brightness on all nodes", icon:"◑"  },
  { id:"reduceMotion", label:"Reduce motion",          description:"Disables all transitions & animations",   icon:"⏸"  },
  { id:"autoFix",      label:"Auto-fix ARIA",          description:"MutationObserver on new DOM nodes",       icon:"♿" },
  { id:"dyslexiaFont", label:"Dyslexia-friendly font", description:"Wider letter & word spacing",             icon:"Aa" },
];

@Component({
  selector: "yuktai-a11y",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content></ng-content>

    <button #fabRef (click)="open=!open"
      aria-label="Open yuktai-a11y accessibility options"
      [attr.aria-expanded]="open" aria-haspopup="dialog"
      [ngStyle]="fabStyle"
      (mouseenter)="fabScale='scale(1.08)'" (mouseleave)="fabScale='scale(1)'">
      <svg viewBox="0 0 24 24" style="width:26px;height:26px;fill:#fff;" aria-hidden="true">
        <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm9 4.5l-5-.5-2-.2V5l-4 .5-4-.5v.8L4 6.5 3 7l1 3 4-.5v2.3L6 17h2l2-4.5L12 14l2 2.5L16 17h2l-2-4.2V9.5l4 .5 1-3z"/>
      </svg>
      <span *ngIf="isActive" aria-hidden="true" [ngStyle]="dotStyle"></span>
    </button>

    <div *ngIf="open" #panelRef role="dialog" aria-modal="true"
      aria-label="yuktai-a11y accessibility options" [ngStyle]="panelStyle">

      <div style="padding:14px 18px 12px;border-bottom:1px solid #f1f5f9;display:flex;align-items:flex-start;justify-content:space-between;">
        <div>
          <div style="display:flex;align-items:center;gap:7px;margin-bottom:5px;">
            <span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px;background:#f0fdfa;color:#0d9488;font-family:monospace;">@yuktishaalaa/yuktai v1.0.0</span>
            <span *ngIf="isActive" style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px;background:#f0fdfa;color:#0f766e;border:1px solid #99f6e4;">● ACTIVE</span>
          </div>
          <p style="margin:0 0 2px;font-size:15px;font-weight:600;color:#0f172a;">Accessibility</p>
          <p style="margin:0;font-size:12px;color:#64748b;">Zero-config WCAG fixes · Open Source</p>
        </div>
        <button (click)="open=false" aria-label="Close panel" style="background:none;border:none;cursor:pointer;padding:4px;color:#94a3b8;font-size:18px;line-height:1;border-radius:6px;">×</button>
      </div>

      <div style="padding:6px 0;">
        <ng-container *ngFor="let opt of OPTIONS; let i=index">
          <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 18px;gap:12px;">
            <div style="display:flex;align-items:center;gap:10px;flex:1;">
              <span aria-hidden="true" style="width:30px;height:30px;border-radius:8px;background:#f0fdfa;color:#0d9488;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;font-weight:700;">{{opt.icon}}</span>
              <div>
                <p style="margin:0;font-size:13px;font-weight:500;color:#0f172a;">{{opt.label}}</p>
                <p style="margin:0;font-size:11px;color:#94a3b8;">{{opt.description}}</p>
              </div>
            </div>
            <label [attr.aria-label]="'Toggle '+opt.label" style="position:relative;display:inline-flex;width:40px;height:24px;cursor:pointer;flex-shrink:0;">
              <input type="checkbox" [checked]="getVal(opt.id)" (change)="set(opt.id,$event)" style="opacity:0;width:0;height:0;position:absolute;"/>
              <span [ngStyle]="{position:'absolute',inset:0,borderRadius:'99px',background:getVal(opt.id)?'#0d9488':'#cbd5e1',transition:'background 0.2s'}"></span>
              <span [ngStyle]="{position:'absolute',top:'3px',left:getVal(opt.id)?'19px':'3px',width:'18px',height:'18px',background:'#fff',borderRadius:'50%',transition:'left 0.2s',boxShadow:'0 1px 3px rgba(0,0,0,0.2)',pointerEvents:'none'}"></span>
            </label>
          </div>
          <div *ngIf="i<OPTIONS.length-1" style="height:1px;background:#f8fafc;margin:0 18px;"></div>
        </ng-container>
      </div>

      <div style="padding:10px 18px 14px;border-top:1px solid #f1f5f9;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <p style="margin:0;font-size:13px;font-weight:500;color:#0f172a;">Text size</p>
          <span style="font-size:12px;font-weight:600;color:#0d9488;background:#f0fdfa;padding:2px 8px;border-radius:99px;">{{settings.fontScale}}%</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <button (click)="decFont()" [disabled]="settings.fontScale<=80" aria-label="Decrease text size"
            style="width:30px;height:30px;border-radius:8px;border:1px solid #e2e8f0;background:#fff;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;"
            [style.cursor]="settings.fontScale<=80?'not-allowed':'pointer'"
            [style.color]="settings.fontScale<=80?'#cbd5e1':'#0f172a'">−</button>
          <div style="flex:1;display:flex;gap:3px;">
            <button *ngFor="let s of FONT_STEPS" (click)="set('fontScale',s)" [attr.aria-label]="'Set text size to '+s+'%'"
              [ngStyle]="{flex:1,height:'6px',borderRadius:'99px',border:'none',cursor:'pointer',padding:0,background:s<=settings.fontScale?'#0d9488':'#e2e8f0',transition:'background 0.15s'}"></button>
          </div>
          <button (click)="incFont()" [disabled]="settings.fontScale>=150" aria-label="Increase text size"
            style="width:30px;height:30px;border-radius:8px;border:1px solid #e2e8f0;background:#fff;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;"
            [style.cursor]="settings.fontScale>=150?'not-allowed':'pointer'"
            [style.color]="settings.fontScale>=150?'#cbd5e1':'#0f172a'">+</button>
        </div>
      </div>

      <div *ngIf="report" role="status" style="margin:0 14px;padding:8px 12px;background:#f0fdfa;border:1px solid #99f6e4;border-radius:8px;font-size:12px;color:#0f766e;font-weight:500;font-family:monospace;">
        {{report.fixed>0?('✓ '+report.fixed+' fixes applied · '+report.scanned+' nodes · '+report.renderTime+'ms'):('✓ 0 fixes needed · '+report.scanned+' nodes clean · '+report.renderTime+'ms')}}
      </div>

      <div style="display:flex;gap:8px;padding:12px 14px 14px;">
        <button (click)="reset()" style="flex:1;padding:8px 0;font-size:13px;font-weight:500;border-radius:9px;border:1px solid #e2e8f0;background:#fff;color:#64748b;cursor:pointer;">Reset</button>
        <button (click)="apply()" style="flex:2;padding:8px 0;font-size:13px;font-weight:600;border-radius:9px;border:none;background:#0d9488;color:#fff;cursor:pointer;">Apply settings</button>
      </div>
    </div>
  `,
})
export class YuktAIComponent implements OnInit, OnDestroy {
  @Input() position: "left"|"right" = "left";
  @ViewChild("fabRef") fabRef!: ElementRef<HTMLButtonElement>;
  @ViewChild("panelRef") panelRef!: ElementRef<HTMLDivElement>;

  open = false; isActive = false; fabScale = "scale(1)";
  report: A11yReport | null = null;
  settings: WidgetSettings = { ...DEFAULT };
  OPTIONS = OPTIONS; FONT_STEPS = FONT_STEPS;

  private _dyslexiaStyleNode: HTMLStyleElement | null = null;
  private _focusStyleNode: HTMLStyleElement | null = null;
  private _kh: (e: KeyboardEvent) => void;
  private _ch: (e: MouseEvent) => void;

  constructor(private cdr: ChangeDetectorRef) {
    this._kh = (e) => { if (e.key==="Escape"&&this.open) { this.open=false; this.fabRef?.nativeElement.focus(); this.cdr.markForCheck(); } };
    this._ch = (e) => {
      if (!this.open) return;
      const panel = this.panelRef?.nativeElement;
      const fab   = this.fabRef?.nativeElement;
      if (panel&&!panel.contains(e.target as Node)&&fab&&!fab.contains(e.target as Node)) { this.open=false; this.cdr.markForCheck(); }
    };
  }

  ngOnInit() {
    if (!this._focusStyleNode) {
      const s = document.createElement("style");
      s.innerHTML = `*:focus-visible{outline:3px solid #0d9488!important;outline-offset:2px!important;}`;
      document.head.appendChild(s); this._focusStyleNode = s;
    }
    document.addEventListener("keydown", this._kh);
    document.addEventListener("mousedown", this._ch);
  }

  ngOnDestroy() {
    wcagPlugin.stopObserver(); wcagPlugin.removeLiveRegion(); wcagPlugin.removeColorBlindSvg();
    this._focusStyleNode?.remove(); this._focusStyleNode = null;
    document.removeEventListener("keydown", this._kh);
    document.removeEventListener("mousedown", this._ch);
  }

  getVal(key: string): boolean|number { return (this.settings as any)[key]; }
  set(key: string, eOrVal: Event|number) {
    const val = typeof eOrVal==="number" ? eOrVal : (eOrVal.target as HTMLInputElement).checked;
    (this.settings as any)[key] = val; this.cdr.markForCheck();
  }
  decFont() { const i=FONT_STEPS.indexOf(this.settings.fontScale); if(i>0){ this.settings.fontScale=FONT_STEPS[i-1]; this.cdr.markForCheck(); } }
  incFont() { const i=FONT_STEPS.indexOf(this.settings.fontScale); if(i<FONT_STEPS.length-1){ this.settings.fontScale=FONT_STEPS[i+1]; this.cdr.markForCheck(); } }

  async apply() {
    const cfg = { enabled:true, highContrast:this.settings.highContrast, reduceMotion:this.settings.reduceMotion, autoFix:this.settings.autoFix };
    console.log("[yuktai-a11y]", await wcagPlugin.execute(cfg));
    this.report = wcagPlugin.applyFixes(cfg);
    document.documentElement.style.fontSize = `${this.settings.fontScale}%`;
    if (this.settings.dyslexiaFont && !this._dyslexiaStyleNode) {
      const s = document.createElement("style");
      s.textContent = `body,body *{font-family:'Georgia',serif!important;letter-spacing:.06em!important;word-spacing:.12em!important;line-height:1.9!important;}`;
      document.head.appendChild(s); this._dyslexiaStyleNode = s;
    } else if (!this.settings.dyslexiaFont) { this._dyslexiaStyleNode?.remove(); this._dyslexiaStyleNode=null; }
    this.isActive=true; this.open=false; this.cdr.markForCheck();
    wcagPlugin.announce("yuktai-a11y active.");
  }

  async reset() {
    await wcagPlugin.execute({ enabled:false });
    document.documentElement.style.fontSize="";
    this._dyslexiaStyleNode?.remove(); this._dyslexiaStyleNode=null;
    document.querySelectorAll<HTMLElement>("*").forEach((h)=>{ h.style.filter=""; h.style.transition=""; h.style.animation=""; });
    this.settings={...DEFAULT}; this.report=null; this.isActive=false; this.cdr.markForCheck();
    wcagPlugin.announce("yuktai-a11y disabled.");
  }

  get fabStyle() { return { position:"fixed",bottom:"24px",[this.position]:"24px",width:"52px",height:"52px",borderRadius:"50%",background:this.isActive?"#0f766e":"#0d9488",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 14px rgba(0,0,0,0.18)",zIndex:9999,transition:"background 0.2s",transform:this.fabScale,outline:"none" }; }
  get dotStyle()  { return { position:"absolute",top:"4px",right:"4px",width:"10px",height:"10px",borderRadius:"50%",background:"#5eead4",border:"2px solid #fff" }; }
  get panelStyle(){ return { position:"fixed",bottom:"24px",[this.position]:"88px",width:"312px",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",zIndex:9998,overflow:"hidden",fontFamily:"system-ui,-apple-system,sans-serif" }; }
}

@NgModule({ declarations:[YuktAIComponent], imports:[CommonModule], exports:[YuktAIComponent] })
export class YuktAIModule {}