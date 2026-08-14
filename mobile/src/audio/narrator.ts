import * as Speech from 'expo-speech';
import { pitchForVoice, rateForPace, voiceById } from '../content/voices';
import type { Line, Pace, VoiceId } from '../types';

export interface NarratorOptions {
  voiceId: VoiceId;
  pace: Pace;
  onIndex: (index: number) => void;
  onEnd: () => void;
}

function voicePrefers(name: string, voiceId: VoiceId): boolean {
  const lower = name.toLowerCase();
  const voice = voiceById(voiceId);
  if (voice.genderHint === 'female') {
    return /female|woman|samantha|victoria|karen|moira|tessa|fiona|zira|siri/.test(lower);
  }
  if (voice.genderHint === 'male') {
    return /male|man|daniel|alex|fred|tom|david|mark|arthur|rishi/.test(lower);
  }
  return /neutral|rowan|siri/.test(lower) || true;
}

export async function pickVoiceIdentifier(voiceId: VoiceId): Promise<string | undefined> {
  try {
    const available = await Speech.getAvailableVoicesAsync();
    const english = available.filter((item) => item.language?.toLowerCase().startsWith('en'));
    const preferred = english.find((item) => voicePrefers(item.name ?? '', voiceId));
    return preferred?.identifier ?? english[0]?.identifier;
  } catch {
    return undefined;
  }
}

export function createNarrator() {
  let lines: Line[] = [];
  let index = 0;
  let playing = false;
  let options: NarratorOptions | null = null;
  let voiceIdentifier: string | undefined;

  const stop = () => {
    playing = false;
    Speech.stop();
  };

  const speakCurrent = () => {
    if (!playing || !options) return;
    const current = lines[index];
    if (!current) {
      playing = false;
      options.onEnd();
      return;
    }
    options.onIndex(index);
    Speech.speak(current.text, {
      language: 'en-US',
      pitch: pitchForVoice(options.voiceId),
      rate: rateForPace(options.pace, current.rate),
      voice: voiceIdentifier,
      onDone: () => {
        if (!playing) return;
        const wait = current.pauseAfterMs;
        setTimeout(() => {
          if (!playing) return;
          index += 1;
          speakCurrent();
        }, wait);
      },
      onError: () => {
        if (!playing) return;
        index += 1;
        speakCurrent();
      },
    });
  };

  return {
    async prepare(next: Line[], nextOptions: NarratorOptions) {
      stop();
      lines = next;
      index = 0;
      options = nextOptions;
      voiceIdentifier = await pickVoiceIdentifier(nextOptions.voiceId);
    },
    play() {
      if (!options || lines.length === 0) return;
      playing = true;
      Speech.stop();
      speakCurrent();
    },
    pause() {
      playing = false;
      Speech.stop();
    },
    isPlaying() {
      return playing;
    },
    skipTo(nextIndex: number) {
      Speech.stop();
      index = Math.max(0, Math.min(nextIndex, lines.length - 1));
      options?.onIndex(index);
      if (playing) {
        speakCurrent();
      }
    },
    stop,
    getIndex() {
      return index;
    },
  };
}

export type Narrator = ReturnType<typeof createNarrator>;
