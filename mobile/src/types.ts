export type Room = 'still' | 'want';

export type Heat = 1 | 2 | 3;

export type Gift = 'quiet' | 'wanted' | 'praised' | 'cared' | 'unsure';

export type Pace = 'whisper' | 'unhurried' | 'sure' | 'soft';

export type VoiceId = 'ash' | 'vale' | 'juniper' | 'rowan';

export type ChapterKind = 'arrival' | 'body' | 'heat' | 'aftercare';

export interface Line {
  text: string;
  pauseAfterMs: number;
  rate?: number;
}

export interface Chapter {
  id: string;
  title: string;
  kind: ChapterKind;
  lines: Line[];
}

export interface Session {
  id: string;
  room: Room;
  title: string;
  subtitle: string;
  durationLabel: string;
  heat: Heat;
  synopsis: string;
  forMaya: string;
  chapters: Chapter[];
}

export interface Profile {
  birthYear: number;
  gift: Gift;
  pace: Pace;
  voiceId: VoiceId;
  heat: Heat;
  onboardingComplete: boolean;
}

export type Screen =
  | { name: 'gate' }
  | { name: 'welcome' }
  | { name: 'onboarding' }
  | { name: 'home' }
  | { name: 'session'; id: string }
  | { name: 'player'; id: string }
  | { name: 'settings' };
