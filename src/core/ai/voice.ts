// ─────────────────────────────────────────────────────────────────────────────
// src/core/ai/voice.ts
// yuktai v4.0.0 — Yuktishaalaa AI Lab
//
// Voice control — lets users navigate the page using voice commands.
// Uses browser SpeechRecognition API — built into all modern browsers.
// Zero API keys. Zero cost. No data leaves the browser.
// Desktop only. Microphone permission required.
// ─────────────────────────────────────────────────────────────────────────────

// ── Types for Web Speech Recognition API
// Not fully typed in TypeScript default lib — we declare them here
declare global {
  interface Window {
    SpeechRecognition?:       typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}

// ── Result returned to the caller
export interface VoiceResult {
  success:  boolean;
  command:  string;
  action:   string;
  error?:   string;
}

// ── Voice command map
// Simple command → action pairs
// User says one of these phrases → yuktai performs the action
const VOICE_COMMANDS: { phrases: string[]; action: string; label: string }[] = [
  {
    phrases: ["go to main", "skip to main", "main content"],
    action:  "focus-main",
    label:   "Jump to main content",
  },
  {
    phrases: ["go to navigation", "go to nav", "open menu"],
    action:  "focus-nav",
    label:   "Jump to navigation",
  },
  {
    phrases: ["go to search", "search", "find"],
    action:  "focus-search",
    label:   "Jump to search",
  },
  {
    phrases: ["scroll down", "page down", "next"],
    action:  "scroll-down",
    label:   "Scroll down",
  },
  {
    phrases: ["scroll up", "page up", "back up"],
    action:  "scroll-up",
    label:   "Scroll up",
  },
  {
    phrases: ["go back", "previous page"],
    action:  "go-back",
    label:   "Go back",
  },
  {
    phrases: ["click", "press", "select"],
    action:  "click-focused",
    label:   "Click focused element",
  },
  {
    phrases: ["next item", "tab forward", "tab"],
    action:  "tab-forward",
    label:   "Move to next element",
  },
  {
    phrases: ["previous item", "tab back", "shift tab"],
    action:  "tab-back",
    label:   "Move to previous element",
  },
  {
    phrases: ["stop listening", "stop voice", "quiet"],
    action:  "stop-voice",
    label:   "Stop voice control",
  },
];

// ── Active recognition instance
let recognition: SpeechRecognition | null = null;
let isListening = false;

// ── Callback — called when a command is recognised
type CommandCallback = (result: VoiceResult) => void;
let onCommand: CommandCallback | null = null;

// ─────────────────────────────────────────────────────────────────────────────
// checkVoiceSupport
// Returns true if SpeechRecognition is available in this browser.
// ─────────────────────────────────────────────────────────────────────────────
export function checkVoiceSupport(): boolean {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

// ─────────────────────────────────────────────────────────────────────────────
// matchCommand
// Checks if the spoken text matches any known voice command.
// Returns the matched action or null if no match found.
// ─────────────────────────────────────────────────────────────────────────────
function matchCommand(spoken: string): { action: string; label: string } | null {
  const lower = spoken.toLowerCase().trim();

  for (const cmd of VOICE_COMMANDS) {
    for (const phrase of cmd.phrases) {
      if (lower.includes(phrase)) {
        return { action: cmd.action, label: cmd.label };
      }
    }
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// executeAction
// Performs the action matched from the voice command.
// ─────────────────────────────────────────────────────────────────────────────
function executeAction(action: string): void {
  switch (action) {

    case "focus-main": {
      const main = document.querySelector<HTMLElement>("main, [role='main'], #main");
      if (main) { main.focus(); main.scrollIntoView({ behavior: "smooth" }); }
      break;
    }

    case "focus-nav": {
      const nav = document.querySelector<HTMLElement>("nav, [role='navigation']");
      if (nav) { nav.focus(); nav.scrollIntoView({ behavior: "smooth" }); }
      break;
    }

    case "focus-search": {
      const search = document.querySelector<HTMLElement>(
        "input[type='search'], input[role='searchbox'], [aria-label*='search' i]"
      );
      if (search) { search.focus(); search.scrollIntoView({ behavior: "smooth" }); }
      break;
    }

    case "scroll-down": {
      window.scrollBy({ top: 400, behavior: "smooth" });
      break;
    }

    case "scroll-up": {
      window.scrollBy({ top: -400, behavior: "smooth" });
      break;
    }

    case "go-back": {
      window.history.back();
      break;
    }

    case "click-focused": {
      const focused = document.activeElement as HTMLElement;
      if (focused && focused !== document.body) focused.click();
      break;
    }

    case "tab-forward": {
      const focusable = getFocusableElements();
      const current  = focusable.indexOf(document.activeElement as HTMLElement);
      const next      = focusable[current + 1] || focusable[0];
      if (next) next.focus();
      break;
    }

    case "tab-back": {
      const focusable = getFocusableElements();
      const current  = focusable.indexOf(document.activeElement as HTMLElement);
      const prev      = focusable[current - 1] || focusable[focusable.length - 1];
      if (prev) prev.focus();
      break;
    }

    case "stop-voice": {
      stopVoiceControl();
      break;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// getFocusableElements
// Returns all keyboard-focusable elements on the page in DOM order.
// ─────────────────────────────────────────────────────────────────────────────
function getFocusableElements(): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter(el => !el.closest("[data-yuktai-panel]"));
}

// ─────────────────────────────────────────────────────────────────────────────
// startVoiceControl
// Starts listening for voice commands.
// Shows a visual indicator so the user knows yuktai is listening.
// ─────────────────────────────────────────────────────────────────────────────
export function startVoiceControl(callback?: CommandCallback): boolean {
  if (!checkVoiceSupport()) return false;
  if (isListening) return true;

  // Store callback for command results
  if (callback) onCommand = callback;

  // Create recognition instance
  const SpeechRecognitionAPI =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  recognition = new SpeechRecognitionAPI();

  // Settings
  recognition.continuous    = true;   // Keep listening until stopped
  recognition.interimResults = false; // Only final results
  recognition.lang          = "en-US"; // English commands

  // Handle recognised speech
  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const spoken = event.results[event.results.length - 1][0].transcript;
    const match  = matchCommand(spoken);

    if (match) {
      executeAction(match.action);

      const result: VoiceResult = {
        success: true,
        command: spoken,
        action:  match.label,
      };

      if (onCommand) onCommand(result);

      // Stop if user said stop
      if (match.action === "stop-voice") return;
    }
  };

  // Restart on end — keeps listening continuously
  recognition.onend = () => {
    if (isListening) recognition?.start();
  };

  // Handle errors silently
  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    // Ignore no-speech errors — user just paused
    if (event.error === "no-speech") return;

    if (onCommand) {
      onCommand({
        success: false,
        command: "",
        action:  "",
        error:   `Voice error: ${event.error}`,
      });
    }
  };

  recognition.start();
  isListening = true;

  // Show listening indicator
  showListeningIndicator();

  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// stopVoiceControl
// Stops listening and removes the visual indicator.
// ─────────────────────────────────────────────────────────────────────────────
export function stopVoiceControl(): void {
  isListening = false;

  if (recognition) {
    recognition.stop();
    recognition = null;
  }

  onCommand = null;
  removeListeningIndicator();
}

// ─────────────────────────────────────────────────────────────────────────────
// isVoiceActive
// Returns true if voice control is currently listening.
// ─────────────────────────────────────────────────────────────────────────────
export function isVoiceActive(): boolean {
  return isListening;
}

// ─────────────────────────────────────────────────────────────────────────────
// showListeningIndicator
// Shows a small pill at the bottom of the screen so user knows
// yuktai is listening for voice commands.
// ─────────────────────────────────────────────────────────────────────────────
const INDICATOR_ID = "yuktai-voice-indicator";

function showListeningIndicator(): void {
  removeListeningIndicator();

  const indicator = document.createElement("div");
  indicator.id = INDICATOR_ID;
  indicator.setAttribute("data-yuktai-panel", "true");
  indicator.setAttribute("aria-live", "polite");
  indicator.setAttribute("aria-label", "yuktai voice control is listening");

  indicator.style.cssText = `
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
  `;

  // Pulsing dot
  const dot = document.createElement("span");
  dot.style.cssText = `
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ffffff;
    animation: yuktai-pulse 1.2s infinite;
    flex-shrink: 0;
  `;

  // Pulse animation
  if (!document.getElementById("yuktai-pulse-style")) {
    const style = document.createElement("style");
    style.id = "yuktai-pulse-style";
    style.textContent = `
      @keyframes yuktai-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50%       { opacity: 0.4; transform: scale(0.7); }
      }
    `;
    document.head.appendChild(style);
  }

  const label = document.createElement("span");
  label.textContent = "Listening for commands...";

  indicator.appendChild(dot);
  indicator.appendChild(label);
  document.body.appendChild(indicator);
}

// ─────────────────────────────────────────────────────────────────────────────
// removeListeningIndicator
// Removes the listening indicator from the page.
// ─────────────────────────────────────────────────────────────────────────────
function removeListeningIndicator(): void {
  const existing = document.getElementById(INDICATOR_ID);
  if (existing) existing.remove();
}

// ─────────────────────────────────────────────────────────────────────────────
// getVoiceCommands
// Returns the full list of supported voice commands.
// Used by the panel to show a cheatsheet to the user.
// ─────────────────────────────────────────────────────────────────────────────
export function getVoiceCommands(): { phrase: string; label: string }[] {
  return VOICE_COMMANDS.map(cmd => ({
    phrase: cmd.phrases[0], // Show first phrase as example
    label:  cmd.label,
  }));
}