import { MOODS, type Mood, type RecycleKey, type SessionFamily } from '@/lib/types';

/**
 * Home is feeling-first. Quinn's top tags are aftercare, praise, boyfriend —
 * emotional connection, not "a man is already in the room."
 * Cue the loop from the feeling she tapped, then the voice she knows.
 */

export const HOME_RECYCLES: { id: RecycleKey; label: string; hint: string }[] = [
  { id: 'again', label: 'Again', hint: 'the take' },
  { id: 'slower', label: 'Slower', hint: 'more breath' },
  { id: 'closer', label: 'Closer', hint: 'more heat' },
  { id: 'after', label: 'After', hint: 'aftercare' },
];

export function feelingsOnHome(loops: SessionFamily[]): Mood[] {
  const have = new Set(loops.flatMap((f) => f.moods));
  return MOODS.map((m) => m.id).filter((id) => have.has(id));
}

export function cueCloseLoop({
  loops,
  mood,
  voiceId,
  lastFamilyId,
}: {
  loops: SessionFamily[];
  mood: Mood | null;
  voiceId: string | null;
  lastFamilyId: string | null;
}): SessionFamily | null {
  if (loops.length === 0) return null;

  if (!mood && !voiceId && lastFamilyId) {
    const remembered = loops.find((f) => f.id === lastFamilyId);
    if (remembered) return remembered;
  }

  const byVoice = voiceId ? loops.filter((f) => f.voiceId === voiceId) : loops;
  const byMood = mood ? byVoice.filter((f) => f.moods.includes(mood)) : byVoice;
  const pool = byMood.length > 0 ? byMood : byVoice.length > 0 ? byVoice : loops;
  return [...pool].sort((a, b) => b.rating - a.rating)[0] ?? loops[0];
}
