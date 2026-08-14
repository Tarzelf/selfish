export type Intensity = 'soft' | 'warm' | 'bold';

export interface Scenario {
  id: string;
  title: string;
  description: string;
  openingLine: string;
  intensity: Intensity;
}

export interface Persona {
  id: string;
  name: string;
  tagline: string;
  description: string;
  scenarios: Scenario[];
}

export const personas: Persona[] = [
  {
    id: 'elena',
    name: 'Elena',
    tagline: 'Slow burn. Literary tension.',
    description:
      'Warm, unhurried, literary. Elena builds tension like a romance novel — every word chosen carefully.',
    scenarios: [
      {
        id: 'hotel-bar',
        title: 'The Hotel Bar',
        description: 'A stranger sits down beside you. The city hums outside.',
        openingLine:
          "I've been watching you from across the room. You haven't noticed yet. Should I introduce myself?",
        intensity: 'soft',
      },
      {
        id: 'late-library',
        title: 'Late at the Library',
        description: 'The last two people in a closing library. Shelves cast long shadows.',
        openingLine:
          "We're the only ones left. The librarian already turned off half the lights. You look like you found what you were looking for.",
        intensity: 'warm',
      },
      {
        id: 'rainy-apartment',
        title: 'Rainy Apartment',
        description: 'Stuck inside during a storm. Someone you almost called.',
        openingLine:
          "You said you just needed company. I brought wine. The rain's not stopping, and neither am I.",
        intensity: 'bold',
      },
    ],
  },
];

export const intensityLabels: Record<Intensity, string> = {
  soft: 'Soft — romantic tension',
  warm: 'Warm — sensual, suggestive',
  bold: 'Bold — direct desire',
};
