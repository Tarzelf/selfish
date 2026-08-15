/** Shared domain types. Mirrors the Supabase schema in /supabase/migrations. */

export type Shelf = 'desire' | 'rest';

export type HeatLevel = 'comfort' | 'slow-burn' | 'spicy';

export const HEAT_ORDER: HeatLevel[] = ['comfort', 'slow-burn', 'spicy'];

export const HEAT_LABEL: Record<HeatLevel, string> = {
  comfort: 'Comfort',
  'slow-burn': 'Slow burn',
  spicy: 'Spicy',
};

export const HEAT_HINT: Record<HeatLevel, string> = {
  comfort: 'Soft, warm, nothing sharp.',
  'slow-burn': 'Patience. The long way around.',
  spicy: 'Further. Only if you ask.',
};

export type Mood = 'comforted' | 'adored' | 'teased' | 'wanted' | 'missed' | 'in-charge';

export const MOODS: { id: Mood; label: string; hint: string }[] = [
  { id: 'comforted', label: 'Comforted', hint: 'held, safe, soft landing' },
  { id: 'adored', label: 'Adored', hint: 'praise, warmth, full attention' },
  { id: 'teased', label: 'Teased', hint: 'playful, patient, unhurried' },
  { id: 'wanted', label: 'Wanted', hint: 'urgency, being chosen first' },
  { id: 'missed', label: 'Missed', hint: 'reunion, yearning, time apart' },
  { id: 'in-charge', label: 'In charge', hint: 'you set the pace tonight' },
];

export type VoiceGender = 'M' | 'F' | 'NB';

export interface Voice {
  id: string;
  /** Persona name presented in-app. Always disclosed as synthetic. */
  name: string;
  gender: VoiceGender;
  /** Short editorial description of the voice character. */
  descriptor: string;
  /** The licensed human performer behind the synthetic voice (disclosure requirement). */
  narratorCredit: string;
  accent: string;
}

export interface Series {
  id: string;
  title: string;
  blurb: string;
  voiceId: string;
}

export type Pace = 'slow' | 'measured';

export interface SessionVariant {
  id: string;
  /** e.g. "Original", "Softer", "Slower", "More buildup" */
  label: string;
  heat: HeatLevel;
  pace: Pace;
  extendedBuildup: boolean;
  durationMin: number;
}

export interface SessionFamily {
  id: string;
  shelf: Shelf;
  title: string;
  blurb: string;
  /** Relationship dynamic, e.g. "Boyfriend experience", "Praise", "Friends to lovers". */
  dynamic: string;
  voiceId: string;
  seriesId?: string;
  /** Episode number within the series, if any. */
  episode?: number;
  moods: Mood[];
  tags: string[];
  /** GWA-style content notes shown before play. Never surprise a listener. */
  contentNotes: string[];
  /** Min and max heat available across variants. */
  heatRange: [HeatLevel, HeatLevel];
  variants: SessionVariant[];
  /** Anonymous community signal (0–5, one decimal). */
  rating: number;
  /** Play-derived chips, e.g. "loved for: buildup". */
  lovedFor: string[];
}

export interface ContinueEntry {
  familyId: string;
  variantId: string;
  /** 0..1 */
  progress: number;
  updatedAt: number;
}

export interface Preferences {
  onboarded: boolean;
  /** Declared 18+ (Apple Declared Age Range stack complements this server-side). */
  ageConfirmed: boolean;
  /** Guideline 5.1.2(i): consent to third-party AI processing, captured at onboarding. */
  aiDisclosureAccepted: boolean;
  displayName: string;
  moods: Mood[];
  /** Max heat the user has opted into. Desire shelf is hidden until raised above 'comfort'? No: shelf visible, spicy content gated. Default comfort. */
  heatCap: HeatLevel;
  favoriteVoiceIds: string[];
  /** Tags globally excluded ("hard limits"). Set once, respected everywhere. */
  hardLimits: string[];
  /** Neutral lock-screen/Now Playing metadata + blurred artwork. */
  discreetMode: boolean;
  /** When the 14-day Selfish+ preview started. Null = no local preview. */
  membershipStartedAt: number | null;
  /** Set after a successful Whop web checkout return. Does not expire on-device. */
  whopEntitledAt: number | null;
}

export const DEFAULT_PREFERENCES: Preferences = {
  onboarded: false,
  ageConfirmed: false,
  aiDisclosureAccepted: false,
  displayName: '',
  moods: [],
  heatCap: 'comfort',
  favoriteVoiceIds: [],
  hardLimits: [],
  discreetMode: true,
  membershipStartedAt: null,
  whopEntitledAt: null,
};

/** Tags a user may exclude globally during onboarding. */
export const LIMIT_TAGS = [
  'soft dom',
  'strangers',
  'public setting',
  'jealousy',
  'praise',
  'possessive',
] as const;
