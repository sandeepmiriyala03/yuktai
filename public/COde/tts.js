/**
 * AksharaJS – Text-to-Speech (TTS) Module
 *
 * Uses the Web Speech API (SpeechSynthesis).
 * Supports auto language detection and Indic voices.
 *
 * API:
 *   akshara.tts.speak(text, options)
 *     options: { lang, rate, pitch, volume, voice, onEnd }
 *   akshara.tts.stop()
 *   akshara.tts.pause()
 *   akshara.tts.resume()
 *   akshara.tts.voices()       → list available voices
 *   akshara.tts.isSpeaking()
 */

// Map of BCP 47 lang codes for Indic + common languages
const LANG_CODES = {
  te : 'te-IN',
  hi : 'hi-IN',
  ta : 'ta-IN',
  bn : 'bn-IN',
  kn : 'kn-IN',
  ml : 'ml-IN',
  mr : 'mr-IN',
  gu : 'gu-IN',
  pa : 'pa-IN',
  ar : 'ar-SA',
  he : 'he-IL',
  en : 'en-US',
  fr : 'fr-FR',
  de : 'de-DE',
  es : 'es-ES',
  ja : 'ja-JP',
  zh : 'zh-CN',
};

export class TTSEngine {

  constructor(logger) {
    this.log   = logger;
    this._synth = window.speechSynthesis || null;

    if (!this._synth) {
      this.log.warn('[tts] Web Speech API not supported in this browser.');
    }
  }

  // ── Speak ─────────────────────────────────────────────────────────────
  speak(text, options = {}) {
    if (!this._synth) return;
    if (!text || !text.trim()) return;

    // Cancel any ongoing speech
    this._synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Resolve language
    const docLang = document.documentElement.getAttribute('lang') || 'en';
    const lang    = options.lang
      ? (LANG_CODES[options.lang] || options.lang)
      : (LANG_CODES[docLang] || 'en-US');

    utterance.lang   = lang;
    utterance.rate   = options.rate   ?? 1.0;
    utterance.pitch  = options.pitch  ?? 1.0;
    utterance.volume = options.volume ?? 1.0;

    // Optionally select a specific voice
    if (options.voice) {
      const voices    = this._synth.getVoices();
      const selected  = voices.find(v => v.name === options.voice);
      if (selected) utterance.voice = selected;
    } else {
      // Try to find a native voice for the language
      const voices     = this._synth.getVoices();
      const langVoice  = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
      if (langVoice) utterance.voice = langVoice;
    }

    utterance.onstart = () => this.log.debug(`[tts] Speaking in ${lang}: "${text.slice(0, 50)}…"`);
    utterance.onend   = () => { if (options.onEnd) options.onEnd(); };
    utterance.onerror = e  => this.log.warn('[tts] Speech error:', e);

    this._synth.speak(utterance);
    return utterance;
  }

  // ── Speak text of a DOM element ───────────────────────────────────────
  speakElement(el, options = {}) {
    const text = el.getAttribute('aria-label') || el.textContent || '';
    return this.speak(text, options);
  }

  // ── Enable click-to-speak on elements with data-tts ───────────────────
  enableClickToSpeak(root = document) {
    (root.querySelectorAll || (() => []))
      .call(root, '[data-tts]')
      .forEach(el => {
        el.style.cursor = 'pointer';
        el.setAttribute('title', 'Click to hear');
        el.addEventListener('click', () => this.speakElement(el));
      });
    this.log.info('[tts] Click-to-speak enabled');
  }

  // ── Controls ──────────────────────────────────────────────────────────
  stop()   { this._synth?.cancel(); }
  pause()  { this._synth?.pause(); }
  resume() { this._synth?.resume(); }

  isSpeaking() {
    return this._synth?.speaking ?? false;
  }

  // ── List available voices ─────────────────────────────────────────────
  voices() {
    return this._synth?.getVoices().map(v => ({
      name  : v.name,
      lang  : v.lang,
      local : v.localService,
    })) || [];
  }
}
