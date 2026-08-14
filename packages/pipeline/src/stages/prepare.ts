/** Performance tags the TTS should receive and act on. */
const SPOKEN_TAGS = new Set(['pause', 'breath', 'laugh', 'sigh', 'whisper']);

/**
 * Strip editorial-only stage directions before TTS. The compliance header and
 * scene metadata exist for the safety classifier and audit trail — sending
 * them to the renderer makes the voice read them aloud (caught live by the
 * audio-QA gate: "Spoke header metadata"). Whole-line bracketed directions are
 * removed unless the bracket content is a known performance tag.
 */
export function prepareForTts(script: string): string {
  return script
    .split('\n')
    .filter((line) => {
      const m = line.trim().match(/^\[([^\]]+)\]$/);
      if (!m) return true;
      return SPOKEN_TAGS.has(m[1].trim().toLowerCase());
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
