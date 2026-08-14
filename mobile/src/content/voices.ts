import type { Pace, VoiceId } from '../types';

export interface Voice {
  id: VoiceId;
  name: string;
  arrival: string;
  genderHint: 'male' | 'female' | 'neutral';
}

export const voices: Voice[] = [
  {
    id: 'ash',
    name: 'Ash',
    arrival: 'Low, unhurried, close to the ear.',
    genderHint: 'male',
  },
  {
    id: 'vale',
    name: 'Vale',
    arrival: 'Warm, precise, a little literary.',
    genderHint: 'male',
  },
  {
    id: 'juniper',
    name: 'Juniper',
    arrival: 'Soft, knowing, a woman’s voice.',
    genderHint: 'female',
  },
  {
    id: 'rowan',
    name: 'Rowan',
    arrival: 'Quiet, intelligent, not in a hurry to be a gender.',
    genderHint: 'neutral',
  },
];

export function voiceById(id: VoiceId): Voice {
  const found = voices.find((voice) => voice.id === id);
  if (!found) {
    throw new Error(`Unknown voice: ${id}`);
  }
  return found;
}

export function rateForPace(pace: Pace, lineRate?: number): number {
  const base = lineRate ?? 0.92;
  switch (pace) {
    case 'whisper':
      return Math.max(0.72, base - 0.12);
    case 'unhurried':
      return Math.max(0.78, base - 0.06);
    case 'soft':
      return Math.max(0.8, base - 0.04);
    case 'sure':
      return base;
    default:
      return base;
  }
}

export function pitchForVoice(id: VoiceId): number {
  switch (id) {
    case 'ash':
      return 0.85;
    case 'vale':
      return 0.92;
    case 'juniper':
      return 1.08;
    case 'rowan':
      return 1.0;
    default:
      return 1.0;
  }
}
