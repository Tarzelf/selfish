import { Intensity } from './personas';

export type SelfFeeling = 'soft' | 'playful' | 'bold';

export interface SelfOption {
  id: SelfFeeling;
  title: string;
  feeling: string;
  intensity: Intensity;
  scenarioId: string;
}

export const selfOptions: SelfOption[] = [
  {
    id: 'soft',
    title: 'Soft',
    feeling: 'Held. Wanted. Unhurried.',
    intensity: 'soft',
    scenarioId: 'hotel-bar',
  },
  {
    id: 'playful',
    title: 'Playful',
    feeling: 'Curious. A little reckless.',
    intensity: 'warm',
    scenarioId: 'late-library',
  },
  {
    id: 'bold',
    title: 'Bold',
    feeling: 'In charge. No apology.',
    intensity: 'bold',
    scenarioId: 'rainy-apartment',
  },
];

export function getSelfOption(id: SelfFeeling): SelfOption {
  return selfOptions.find((option) => option.id === id) ?? selfOptions[0];
}
