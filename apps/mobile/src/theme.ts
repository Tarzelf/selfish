export const colors = {
  ink: '#0c0a0f',
  inkElevated: '#15121a',
  mist: '#2a2433',
  parchment: '#f3ebe3',
  parchmentMuted: 'rgba(243, 235, 227, 0.62)',
  amber: '#c4a574',
  amberSoft: 'rgba(196, 165, 116, 0.22)',
  rose: '#a87878',
  danger: '#b45a5a',
  line: 'rgba(243, 235, 227, 0.12)',
};

export const moods = [
  {
    id: 'held',
    title: 'Held',
    line: 'Warm caretaking. Soft and close.',
  },
  {
    id: 'teased',
    title: 'Teased',
    line: 'Slow tension. Anticipation first.',
  },
  {
    id: 'powerful',
    title: 'Powerful',
    line: 'You set the pace. They follow.',
  },
  {
    id: 'soft',
    title: 'Soft',
    line: 'Quiet intimacy. Almost a whisper.',
  },
  {
    id: 'slowburn',
    title: 'Slow burn',
    line: 'Unhurried. Let the night unfold.',
  },
  {
    id: 'spoken',
    title: 'Spoken to',
    line: 'Direct address. A voice for you.',
  },
] as const;

export const intensities = [
  { id: 1, label: 'Suggestive' },
  { id: 2, label: 'Warm' },
  { id: 3, label: 'Spicy' },
  { id: 4, label: 'Explicit' },
  { id: 5, label: 'Raw' },
] as const;

export const voices = [
  {
    id: 'warm-low',
    title: 'Warm low',
    line: 'Steady, close, unhurried.',
  },
  {
    id: 'soft-breath',
    title: 'Soft breath',
    line: 'Airy, intimate, quiet.',
  },
  {
    id: 'calm-even',
    title: 'Calm even',
    line: 'Grounded, clear, present.',
  },
] as const;

export type MoodId = (typeof moods)[number]['id'];
export type VoiceId = (typeof voices)[number]['id'];
