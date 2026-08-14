import type { SessionFamily, Series, Voice } from '@/lib/types';

/**
 * Seed catalog for the preview build.
 * In production this is served from Supabase (see /supabase/migrations) and
 * produced by the content pipeline (see /packages/pipeline). Every session is
 * first-party, pre-rendered, and passes the safety + editorial + blind-test
 * gates before it appears here. No audio is generated at runtime — ever.
 */

export const VOICES: Voice[] = [
  {
    id: 'v-jasper',
    name: 'Jasper',
    gender: 'M',
    descriptor: 'Low and unhurried, with a smile you can hear. The one who notices everything.',
    narratorCredit: 'Built with the licensed performance of a professional narrator (credit on release).',
    accent: 'American',
  },
  {
    id: 'v-elias',
    name: 'Elias',
    gender: 'M',
    descriptor: 'Warm gravel, patient to a fault. Reads you like a favorite book.',
    narratorCredit: 'Built with the licensed performance of a professional narrator (credit on release).',
    accent: 'British',
  },
  {
    id: 'v-rowan',
    name: 'Rowan',
    gender: 'M',
    descriptor: 'Soft-spoken, steady, close to the microphone. Better at listening than most people you know.',
    narratorCredit: 'Built with the licensed performance of a professional narrator (credit on release).',
    accent: 'Irish',
  },
  {
    id: 'v-noor',
    name: 'Noor',
    gender: 'F',
    descriptor: 'Velvet and certainty. Says your name like it settles an argument.',
    narratorCredit: 'Built with the licensed performance of a professional narrator (credit on release).',
    accent: 'American',
  },
  {
    id: 'v-camille',
    name: 'Camille',
    gender: 'F',
    descriptor: 'Playful, low-lit, a laugh held just behind the teeth.',
    narratorCredit: 'Built with the licensed performance of a professional narrator (credit on release).',
    accent: 'French',
  },
  {
    id: 'v-ash',
    name: 'Ash',
    gender: 'NB',
    descriptor: 'Quiet confidence, warm static, rain-on-windows calm.',
    narratorCredit: 'Built with the licensed performance of a professional narrator (credit on release).',
    accent: 'American',
  },
];

export const SERIES: Series[] = [
  {
    id: 's-latekeys',
    title: 'Late Keys',
    blurb: 'He moved in across the hall in March. It is now a problem.',
    voiceId: 'v-jasper',
  },
  {
    id: 's-tide',
    title: 'The Tide House',
    blurb: 'One off-season coastal hotel. One very attentive concierge.',
    voiceId: 'v-elias',
  },
  {
    id: 's-emberlight',
    title: 'Emberlight',
    blurb: 'Noor keeps the bookshop open late for exactly one customer.',
    voiceId: 'v-noor',
  },
];

export const CATALOG: SessionFamily[] = [
  // ——— Desire: Boyfriend experience ———
  {
    id: 'f-back-to-yours',
    shelf: 'desire',
    title: 'Back to Yours',
    blurb: 'The dinner party ran long. He kept catching your eye across the table, and now the walk home is taking a very deliberate detour.',
    dynamic: 'Boyfriend experience',
    voiceId: 'v-jasper',
    seriesId: 's-latekeys',
    episode: 1,
    moods: ['wanted', 'teased'],
    tags: ['boyfriend', 'slow burn', 'banter'],
    contentNotes: ['romantic tension', 'affection'],
    heatRange: ['comfort', 'spicy'],
    variants: [
      { id: 'f-back-to-yours-1', label: 'Original', heat: 'slow-burn', pace: 'measured', extendedBuildup: false, durationMin: 14 },
      { id: 'f-back-to-yours-2', label: 'Softer', heat: 'comfort', pace: 'slow', extendedBuildup: false, durationMin: 13 },
      { id: 'f-back-to-yours-3', label: 'More buildup', heat: 'slow-burn', pace: 'slow', extendedBuildup: true, durationMin: 19 },
      { id: 'f-back-to-yours-4', label: 'Further', heat: 'spicy', pace: 'measured', extendedBuildup: false, durationMin: 16 },
    ],
    rating: 4.8,
    lovedFor: ['buildup', 'banter'],
  },
  {
    id: 'f-sunday-morning',
    shelf: 'desire',
    title: 'Sunday, Stay',
    blurb: 'No alarms. His arm over your waist, his voice still rough with sleep, and a very persuasive argument against getting up.',
    dynamic: 'Boyfriend experience',
    voiceId: 'v-rowan',
    moods: ['comforted', 'adored'],
    tags: ['boyfriend', 'lazy morning', 'domestic'],
    contentNotes: ['affection', 'gentle intimacy'],
    heatRange: ['comfort', 'slow-burn'],
    variants: [
      { id: 'f-sunday-morning-1', label: 'Original', heat: 'comfort', pace: 'slow', extendedBuildup: false, durationMin: 12 },
      { id: 'f-sunday-morning-2', label: 'Warmer', heat: 'slow-burn', pace: 'slow', extendedBuildup: true, durationMin: 16 },
    ],
    rating: 4.9,
    lovedFor: ['softness', 'his laugh'],
  },
  {
    id: 'f-airport-run',
    shelf: 'desire',
    title: 'Arrivals',
    blurb: 'Three weeks apart, and he is waiting at the barrier pretending he has been fine. He has not been fine.',
    dynamic: 'Reunion',
    voiceId: 'v-jasper',
    seriesId: 's-latekeys',
    episode: 2,
    moods: ['missed', 'wanted'],
    tags: ['boyfriend', 'reunion', 'yearning'],
    contentNotes: ['romantic tension', 'affection'],
    heatRange: ['comfort', 'spicy'],
    variants: [
      { id: 'f-airport-run-1', label: 'Original', heat: 'slow-burn', pace: 'measured', extendedBuildup: true, durationMin: 17 },
      { id: 'f-airport-run-2', label: 'Softer', heat: 'comfort', pace: 'slow', extendedBuildup: false, durationMin: 14 },
      { id: 'f-airport-run-3', label: 'Further', heat: 'spicy', pace: 'measured', extendedBuildup: true, durationMin: 20 },
    ],
    rating: 4.7,
    lovedFor: ['yearning', 'the pause at 09:40'],
  },

  // ——— Desire: Praise ———
  {
    id: 'f-after-the-win',
    shelf: 'desire',
    title: 'After the Win',
    blurb: 'You closed the deal. He heard everything through the door, and he has opinions about how brilliant you are. Detailed opinions.',
    dynamic: 'Praise',
    voiceId: 'v-elias',
    moods: ['adored', 'wanted'],
    tags: ['praise', 'celebration', 'boyfriend'],
    contentNotes: ['praise', 'affection'],
    heatRange: ['comfort', 'spicy'],
    variants: [
      { id: 'f-after-the-win-1', label: 'Original', heat: 'slow-burn', pace: 'measured', extendedBuildup: false, durationMin: 13 },
      { id: 'f-after-the-win-2', label: 'Softer', heat: 'comfort', pace: 'slow', extendedBuildup: false, durationMin: 12 },
      { id: 'f-after-the-win-3', label: 'Further', heat: 'spicy', pace: 'measured', extendedBuildup: true, durationMin: 18 },
    ],
    rating: 4.8,
    lovedFor: ['praise', 'being seen'],
  },
  {
    id: 'f-long-week',
    shelf: 'desire',
    title: 'The Long Week',
    blurb: 'You have been holding everyone else together for five days. Tonight somebody notices, sits you down, and takes over.',
    dynamic: 'Praise',
    voiceId: 'v-noor',
    seriesId: 's-emberlight',
    episode: 1,
    moods: ['comforted', 'adored'],
    tags: ['praise', 'aftercare', 'F4F'],
    contentNotes: ['praise', 'gentle authority'],
    heatRange: ['comfort', 'slow-burn'],
    variants: [
      { id: 'f-long-week-1', label: 'Original', heat: 'comfort', pace: 'slow', extendedBuildup: false, durationMin: 15 },
      { id: 'f-long-week-2', label: 'Warmer', heat: 'slow-burn', pace: 'slow', extendedBuildup: true, durationMin: 19 },
    ],
    rating: 4.9,
    lovedFor: ['aftercare', 'her certainty'],
  },

  // ——— Desire: Friends to lovers ———
  {
    id: 'f-borrowed-jacket',
    shelf: 'desire',
    title: 'The Borrowed Jacket',
    blurb: "Your best friend of six years just watched you put on his jacket, and something in his face finally gave him away.",
    dynamic: 'Friends to lovers',
    voiceId: 'v-rowan',
    moods: ['teased', 'wanted'],
    tags: ['friends to lovers', 'confession', 'slow burn'],
    contentNotes: ['romantic tension', 'first kiss'],
    heatRange: ['comfort', 'spicy'],
    variants: [
      { id: 'f-borrowed-jacket-1', label: 'Original', heat: 'slow-burn', pace: 'slow', extendedBuildup: true, durationMin: 18 },
      { id: 'f-borrowed-jacket-2', label: 'Softer', heat: 'comfort', pace: 'slow', extendedBuildup: true, durationMin: 16 },
      { id: 'f-borrowed-jacket-3', label: 'Further', heat: 'spicy', pace: 'measured', extendedBuildup: true, durationMin: 21 },
    ],
    rating: 4.9,
    lovedFor: ['the confession', 'buildup'],
  },
  {
    id: 'f-two-truths',
    shelf: 'desire',
    title: 'Two Truths',
    blurb: 'A road trip, a shared playlist, and a game that was supposed to be innocent. Camille never plays anything innocently.',
    dynamic: 'Friends to lovers',
    voiceId: 'v-camille',
    moods: ['teased', 'missed'],
    tags: ['friends to lovers', 'F4F', 'banter'],
    contentNotes: ['flirtation', 'romantic tension'],
    heatRange: ['comfort', 'slow-burn'],
    variants: [
      { id: 'f-two-truths-1', label: 'Original', heat: 'slow-burn', pace: 'measured', extendedBuildup: false, durationMin: 14 },
      { id: 'f-two-truths-2', label: 'Softer', heat: 'comfort', pace: 'measured', extendedBuildup: false, durationMin: 13 },
    ],
    rating: 4.6,
    lovedFor: ['banter', 'her laugh'],
  },

  // ——— Desire: Soft dom / in charge ———
  {
    id: 'f-house-rules',
    shelf: 'desire',
    title: 'House Rules',
    blurb: 'The concierge at the Tide House has exactly one rule for guests who cannot switch off: let someone else decide for a while. You checked the box at booking. He read it.',
    dynamic: 'Soft dom',
    voiceId: 'v-elias',
    seriesId: 's-tide',
    episode: 1,
    moods: ['in-charge', 'teased'],
    tags: ['soft dom', 'strangers', 'hotel'],
    contentNotes: ['gentle authority', 'explicit consent check-ins'],
    heatRange: ['slow-burn', 'spicy'],
    variants: [
      { id: 'f-house-rules-1', label: 'Original', heat: 'slow-burn', pace: 'slow', extendedBuildup: true, durationMin: 17 },
      { id: 'f-house-rules-2', label: 'Further', heat: 'spicy', pace: 'slow', extendedBuildup: true, durationMin: 20 },
    ],
    rating: 4.7,
    lovedFor: ['check-ins', 'his patience'],
  },
  {
    id: 'f-say-when',
    shelf: 'desire',
    title: 'Say When',
    blurb: 'You are in charge tonight — he just needs you to say so out loud. He is very good at waiting. Annoyingly good.',
    dynamic: 'You lead',
    voiceId: 'v-jasper',
    moods: ['in-charge', 'wanted'],
    tags: ['you lead', 'boyfriend', 'banter'],
    contentNotes: ['listener-led pacing', 'affection'],
    heatRange: ['comfort', 'spicy'],
    variants: [
      { id: 'f-say-when-1', label: 'Original', heat: 'slow-burn', pace: 'measured', extendedBuildup: false, durationMin: 15 },
      { id: 'f-say-when-2', label: 'Softer', heat: 'comfort', pace: 'slow', extendedBuildup: false, durationMin: 13 },
      { id: 'f-say-when-3', label: 'Further', heat: 'spicy', pace: 'measured', extendedBuildup: false, durationMin: 17 },
    ],
    rating: 4.5,
    lovedFor: ['being asked', 'the wait'],
  },

  // ——— Desire: Comfort / aftercare ———
  {
    id: 'f-heavy-day',
    shelf: 'desire',
    title: 'Heavy Day',
    blurb: 'No plot. No demands. Ash makes tea, puts your phone face-down, and stays until your shoulders drop.',
    dynamic: 'Comfort',
    voiceId: 'v-ash',
    moods: ['comforted'],
    tags: ['comfort', 'aftercare', 'NB voice'],
    contentNotes: ['no romantic content', 'reassurance'],
    heatRange: ['comfort', 'comfort'],
    variants: [
      { id: 'f-heavy-day-1', label: 'Original', heat: 'comfort', pace: 'slow', extendedBuildup: false, durationMin: 12 },
      { id: 'f-heavy-day-2', label: 'Longer', heat: 'comfort', pace: 'slow', extendedBuildup: true, durationMin: 20 },
    ],
    rating: 4.9,
    lovedFor: ['calm', 'no pressure'],
  },
  {
    id: 'f-apology',
    shelf: 'desire',
    title: 'The Apology',
    blurb: 'He was wrong, he knows it, and he is not going to be casual about it. A masterclass in taking responsibility, delivered quietly, from very close.',
    dynamic: 'Apology',
    voiceId: 'v-rowan',
    moods: ['adored', 'missed'],
    tags: ['apology', 'boyfriend', 'reassurance'],
    contentNotes: ['emotional repair', 'affection'],
    heatRange: ['comfort', 'slow-burn'],
    variants: [
      { id: 'f-apology-1', label: 'Original', heat: 'comfort', pace: 'slow', extendedBuildup: false, durationMin: 13 },
      { id: 'f-apology-2', label: 'Warmer', heat: 'slow-burn', pace: 'slow', extendedBuildup: true, durationMin: 17 },
    ],
    rating: 4.8,
    lovedFor: ['accountability', 'sincerity'],
  },
  {
    id: 'f-emberlight-2',
    shelf: 'desire',
    title: 'Shelf Life',
    blurb: 'The bookshop is closed. Noor is re-shelving poetry, reading the good lines out loud, and standing closer each time you pretend to browse.',
    dynamic: 'Slow burn',
    voiceId: 'v-noor',
    seriesId: 's-emberlight',
    episode: 2,
    moods: ['teased', 'adored'],
    tags: ['F4F', 'slow burn', 'poetry'],
    contentNotes: ['flirtation', 'romantic tension'],
    heatRange: ['comfort', 'spicy'],
    variants: [
      { id: 'f-emberlight-2-1', label: 'Original', heat: 'slow-burn', pace: 'slow', extendedBuildup: true, durationMin: 16 },
      { id: 'f-emberlight-2-2', label: 'Softer', heat: 'comfort', pace: 'slow', extendedBuildup: false, durationMin: 14 },
      { id: 'f-emberlight-2-3', label: 'Further', heat: 'spicy', pace: 'slow', extendedBuildup: true, durationMin: 19 },
    ],
    rating: 4.7,
    lovedFor: ['the readings', 'proximity'],
  },

  // ——— Rest shelf ———
  {
    id: 'f-rain-on-glass',
    shelf: 'rest',
    title: 'Rain on the Glass',
    blurb: 'A storm outside, a fire inside, and Rowan reading you toward sleep with no intention of finishing the chapter.',
    dynamic: 'Read to sleep',
    voiceId: 'v-rowan',
    moods: ['comforted'],
    tags: ['sleep', 'rain', 'reading'],
    contentNotes: ['sleep content'],
    heatRange: ['comfort', 'comfort'],
    variants: [
      { id: 'f-rain-on-glass-1', label: 'Original', heat: 'comfort', pace: 'slow', extendedBuildup: false, durationMin: 22 },
      { id: 'f-rain-on-glass-2', label: 'Longer', heat: 'comfort', pace: 'slow', extendedBuildup: false, durationMin: 40 },
    ],
    rating: 4.9,
    lovedFor: ['his reading voice', 'the rain'],
  },
  {
    id: 'f-night-train',
    shelf: 'rest',
    title: 'Night Train South',
    blurb: 'A sleeper cabin, a slow country going past in the dark, and a voice keeping gentle track of it all so you do not have to.',
    dynamic: 'Sleep story',
    voiceId: 'v-ash',
    moods: ['comforted'],
    tags: ['sleep', 'travel', 'NB voice'],
    contentNotes: ['sleep content'],
    heatRange: ['comfort', 'comfort'],
    variants: [
      { id: 'f-night-train-1', label: 'Original', heat: 'comfort', pace: 'slow', extendedBuildup: false, durationMin: 25 },
    ],
    rating: 4.8,
    lovedFor: ['the rhythm', 'drifting off'],
  },
  {
    id: 'f-unwind-count',
    shelf: 'rest',
    title: 'Ten Slow Things',
    blurb: 'A breath-paced body scan from Noor: ten unhurried instructions, each one heavier than the last.',
    dynamic: 'Wind-down',
    voiceId: 'v-noor',
    moods: ['comforted'],
    tags: ['sleep', 'body scan', 'breathing'],
    contentNotes: ['sleep content', 'guided breathing'],
    heatRange: ['comfort', 'comfort'],
    variants: [
      { id: 'f-unwind-count-1', label: 'Original', heat: 'comfort', pace: 'slow', extendedBuildup: false, durationMin: 15 },
    ],
    rating: 4.7,
    lovedFor: ['actually falling asleep'],
  },
  {
    id: 'f-harbor-morning',
    shelf: 'rest',
    title: 'The Harbor Before Anyone',
    blurb: 'Elias narrates an empty harbor at dawn — ropes, gulls, slow water — until the world feels manageable again.',
    dynamic: 'Sleep story',
    voiceId: 'v-elias',
    moods: ['comforted'],
    tags: ['sleep', 'coastal', 'ambience'],
    contentNotes: ['sleep content'],
    heatRange: ['comfort', 'comfort'],
    variants: [
      { id: 'f-harbor-morning-1', label: 'Original', heat: 'comfort', pace: 'slow', extendedBuildup: false, durationMin: 30 },
    ],
    rating: 4.6,
    lovedFor: ['the gulls', 'calm'],
  },
];

export function getVoice(id: string): Voice | undefined {
  return VOICES.find((v) => v.id === id);
}

export function getSeries(id: string | undefined): Series | undefined {
  return id ? SERIES.find((s) => s.id === id) : undefined;
}

export function getFamily(id: string): SessionFamily | undefined {
  return CATALOG.find((f) => f.id === id);
}

export const ALL_TAGS: string[] = [...new Set(CATALOG.flatMap((f) => f.tags))].sort();

export const ALL_DYNAMICS: string[] = [...new Set(CATALOG.filter((f) => f.shelf === 'desire').map((f) => f.dynamic))].sort();
