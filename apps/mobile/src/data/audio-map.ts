/**
 * Bundled preview audio produced by the real pipeline (see packages/pipeline
 * and samples/). Static requires — Metro needs literal paths.
 *
 * These are engine previews: short excerpts rendered by the current TTS stack
 * so the player and voice pages are testable with real sound. Production
 * streams full pre-rendered sessions from the CDN.
 */

/** variantId → bundled audio module */
export const VARIANT_AUDIO: Record<string, number> = {
  // "Back to Yours" Original — full live-pipeline render (Grok script → safety → castor voice → QA-passed)
  'f-back-to-yours-1': require('../../assets/audio/back-to-yours-preview.mp3'),
  // "Ten Slow Things" — Kokoro sleep-register render (CPU, self-hosted)
  'f-unwind-count-1': require('../../assets/audio/rest-nicole.mp3'),
};

/** voiceId → whisper-register engine preview used on the transparency page */
export const VOICE_PREVIEW_AUDIO: Record<string, number> = {
  'v-jasper': require('../../assets/audio/voice-castor.mp3'),
  'v-elias': require('../../assets/audio/voice-perseus.mp3'),
  'v-rowan': require('../../assets/audio/voice-naksh.mp3'),
  'v-noor': require('../../assets/audio/voice-ursa.mp3'),
  'v-camille': require('../../assets/audio/voice-luna.mp3'),
  'v-ash': require('../../assets/audio/voice-rigel.mp3'),
};
