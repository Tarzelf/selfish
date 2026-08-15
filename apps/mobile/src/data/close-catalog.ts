import type { RecycleKey, SessionFamily, SessionVariant } from '@/lib/types';

/**
 * Close loops — the unit of value when she opts in.
 *
 * 3–7 minutes. No plot. He/she is already in the room. Written to be
 * replayed, not finished-and-shelved. Each family is four recycles:
 * Again (the take) · Slower · Closer · After.
 *
 * Titles stay roommate-safe. The heat is in the audio.
 */

function closeFamily(
  family: Omit<SessionFamily, 'format' | 'shelf' | 'recycles'> & {
    variants: [SessionVariant, SessionVariant, SessionVariant, SessionVariant];
  },
): SessionFamily {
  const [again, slower, closer, after] = family.variants;
  return {
    ...family,
    shelf: 'desire',
    format: 'close',
    recycles: { slower: slower.id, closer: closer.id, after: after.id },
    variants: [again, slower, closer, after],
  };
}

export const CLOSE_CATALOG: SessionFamily[] = [
  closeFamily({
    id: 'f-stay',
    title: 'Stay',
    blurb: 'You closed the door. He stayed.',
    dynamic: 'In your ear',
    voiceId: 'v-jasper',
    moods: ['wanted', 'adored'],
    tags: ['boyfriend', 'close', 'praise'],
    contentNotes: ['explicit dirty talk', 'praise', 'proximity'],
    heatRange: ['comfort', 'spicy'],
    variants: [
      { id: 'f-stay-1', label: 'Again', heat: 'spicy', pace: 'measured', extendedBuildup: false, durationMin: 4 },
      { id: 'f-stay-2', label: 'Slower', heat: 'spicy', pace: 'slow', extendedBuildup: false, durationMin: 6 },
      { id: 'f-stay-3', label: 'Closer', heat: 'spicy', pace: 'measured', extendedBuildup: false, durationMin: 5 },
      { id: 'f-stay-4', label: 'After', heat: 'comfort', pace: 'slow', extendedBuildup: false, durationMin: 2 },
    ],
    rating: 4.9,
    lovedFor: ['replay', 'his breath'],
  }),
  closeFamily({
    id: 'f-right-here',
    title: 'Right Here',
    blurb: 'Closer than the microphone. Only for you.',
    dynamic: 'In your ear',
    voiceId: 'v-rowan',
    moods: ['wanted', 'comforted'],
    tags: ['boyfriend', 'close'],
    contentNotes: ['explicit dirty talk', 'proximity', 'whisper'],
    heatRange: ['comfort', 'spicy'],
    variants: [
      { id: 'f-right-here-1', label: 'Again', heat: 'spicy', pace: 'slow', extendedBuildup: false, durationMin: 5 },
      { id: 'f-right-here-2', label: 'Slower', heat: 'spicy', pace: 'slow', extendedBuildup: false, durationMin: 7 },
      { id: 'f-right-here-3', label: 'Closer', heat: 'spicy', pace: 'measured', extendedBuildup: false, durationMin: 5 },
      { id: 'f-right-here-4', label: 'After', heat: 'comfort', pace: 'slow', extendedBuildup: false, durationMin: 2 },
    ],
    rating: 4.8,
    lovedFor: ['the whisper', 'how close'],
  }),
  closeFamily({
    id: 'f-the-list',
    title: 'The List',
    blurb: 'Everything he noticed. Said out loud, to you.',
    dynamic: 'Praise',
    voiceId: 'v-elias',
    moods: ['adored', 'wanted', 'missed'],
    tags: ['praise', 'close', 'boyfriend'],
    contentNotes: ['explicit praise', 'dirty talk'],
    heatRange: ['comfort', 'spicy'],
    variants: [
      { id: 'f-the-list-1', label: 'Again', heat: 'spicy', pace: 'measured', extendedBuildup: false, durationMin: 4 },
      { id: 'f-the-list-2', label: 'Slower', heat: 'spicy', pace: 'slow', extendedBuildup: false, durationMin: 6 },
      { id: 'f-the-list-3', label: 'Closer', heat: 'spicy', pace: 'measured', extendedBuildup: false, durationMin: 5 },
      { id: 'f-the-list-4', label: 'After', heat: 'comfort', pace: 'slow', extendedBuildup: false, durationMin: 2 },
    ],
    rating: 4.9,
    lovedFor: ['being seen', 'the list'],
  }),
  closeFamily({
    id: 'f-quiet',
    title: 'Quiet',
    blurb: 'She says your name like it settles something.',
    dynamic: 'In your ear',
    voiceId: 'v-noor',
    moods: ['wanted', 'adored'],
    tags: ['F4F', 'close', 'praise'],
    contentNotes: ['explicit dirty talk', 'praise', 'F4F'],
    heatRange: ['comfort', 'spicy'],
    variants: [
      { id: 'f-quiet-1', label: 'Again', heat: 'spicy', pace: 'slow', extendedBuildup: false, durationMin: 4 },
      { id: 'f-quiet-2', label: 'Slower', heat: 'spicy', pace: 'slow', extendedBuildup: false, durationMin: 6 },
      { id: 'f-quiet-3', label: 'Closer', heat: 'spicy', pace: 'measured', extendedBuildup: false, durationMin: 5 },
      { id: 'f-quiet-4', label: 'After', heat: 'comfort', pace: 'slow', extendedBuildup: false, durationMin: 2 },
    ],
    rating: 4.8,
    lovedFor: ['her certainty', 'replay'],
  }),
  closeFamily({
    id: 'f-come-here',
    title: 'Come Here',
    blurb: 'A laugh held just behind the teeth. Then she stops laughing.',
    dynamic: 'Tease',
    voiceId: 'v-camille',
    moods: ['teased', 'wanted', 'in-charge'],
    tags: ['F4F', 'close', 'banter'],
    contentNotes: ['explicit dirty talk', 'teasing', 'F4F'],
    heatRange: ['comfort', 'spicy'],
    variants: [
      { id: 'f-come-here-1', label: 'Again', heat: 'spicy', pace: 'measured', extendedBuildup: false, durationMin: 4 },
      { id: 'f-come-here-2', label: 'Slower', heat: 'spicy', pace: 'slow', extendedBuildup: false, durationMin: 6 },
      { id: 'f-come-here-3', label: 'Closer', heat: 'spicy', pace: 'measured', extendedBuildup: false, durationMin: 5 },
      { id: 'f-come-here-4', label: 'After', heat: 'comfort', pace: 'slow', extendedBuildup: false, durationMin: 2 },
    ],
    rating: 4.7,
    lovedFor: ['the tease', 'her laugh'],
  }),
  closeFamily({
    id: 'f-still',
    title: 'Still',
    blurb: 'No rush. They stay until your shoulders drop — and then they don\'t leave.',
    dynamic: 'In your ear',
    voiceId: 'v-ash',
    moods: ['wanted', 'comforted'],
    tags: ['close', 'NB voice', 'aftercare'],
    contentNotes: ['explicit dirty talk', 'gentle pace', 'NB voice'],
    heatRange: ['comfort', 'spicy'],
    variants: [
      { id: 'f-still-1', label: 'Again', heat: 'spicy', pace: 'slow', extendedBuildup: false, durationMin: 5 },
      { id: 'f-still-2', label: 'Slower', heat: 'spicy', pace: 'slow', extendedBuildup: false, durationMin: 7 },
      { id: 'f-still-3', label: 'Closer', heat: 'spicy', pace: 'slow', extendedBuildup: false, durationMin: 5 },
      { id: 'f-still-4', label: 'After', heat: 'comfort', pace: 'slow', extendedBuildup: false, durationMin: 2 },
    ],
    rating: 4.8,
    lovedFor: ['no pressure', 'the wait'],
  }),
];

export function recycleVariant(family: SessionFamily, key: RecycleKey): SessionVariant | undefined {
  if (key === 'again') {
    return family.variants.find((v) => v.label === 'Again') ?? family.variants[0];
  }
  const id = family.recycles?.[key];
  if (id) return family.variants.find((v) => v.id === id);
  const label = key === 'slower' ? 'Slower' : key === 'closer' ? 'Closer' : 'After';
  return family.variants.find((v) => v.label === label);
}

export function closeForVoice(voiceId: string, catalog: SessionFamily[] = CLOSE_CATALOG): SessionFamily | undefined {
  return catalog.find((f) => f.format === 'close' && f.voiceId === voiceId);
}
