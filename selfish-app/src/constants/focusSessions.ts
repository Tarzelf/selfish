export interface FocusSession {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  category: 'rain' | 'whisper' | 'breath';
  /** Placeholder until real audio assets are added */
  ambientColor: string;
}

export const focusSessions: FocusSession[] = [
  {
    id: 'gentle-rain',
    title: 'Gentle Rain',
    description: 'Soft rainfall with distant thunder. Let your thoughts settle.',
    durationMinutes: 25,
    category: 'rain',
    ambientColor: '#1a2332',
  },
  {
    id: 'close-whisper',
    title: 'Close Whisper',
    description: 'A warm voice guides your breath. Proximity without words.',
    durationMinutes: 15,
    category: 'whisper',
    ambientColor: '#2a1f28',
  },
  {
    id: 'deep-breath',
    title: 'Deep Breath',
    description: 'Slow, rhythmic breathing cues. Inhale focus. Exhale noise.',
    durationMinutes: 10,
    category: 'breath',
    ambientColor: '#1a2820',
  },
];
