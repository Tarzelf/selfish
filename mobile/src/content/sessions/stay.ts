import type { Session } from '../../types';
import { line as L } from '../line';

export const stay: Session = {
  id: 'stay',
  room: 'want',
  title: 'Stay',
  subtitle: 'Aftercare as a whole hour. Nothing is asked of you.',
  durationLabel: '7 min',
  heat: 1,
  synopsis:
    'For the come-down, or for a night that does not want heat. Water, the lamp, a voice that remains after wanting.',
  forMaya:
    'This must exist on the home screen, not buried. Taste lives here.',
  chapters: [
    {
      id: 'arrival',
      title: 'Landing',
      kind: 'arrival',
      lines: [
        L('This is the part I will not skip.', 1300, 0.82),
        L('Whatever happened in you — heat, or nothing, or something you do not have a word for — you get to land.', 1600, 0.8),
        L('I am still here. I am not leaving because the scene ended.', 1500, 0.8),
      ],
    },
    {
      id: 'body',
      title: 'The body after',
      kind: 'body',
      lines: [
        L('Wiggle your fingers. Feel the sheet, or the couch, or the cheap cotton of a shirt you love.', 1500, 0.82),
        L('Drink water. I mean it. The nervous system likes evidence.', 1400, 0.82),
        L('If you feel tender, that is information, not a problem.', 1400, 0.8),
        L('If you feel nothing, that is also allowed. I will not hunt a feeling out of you.', 1500, 0.8),
        L('You do not owe anyone a story about what this was.', 1400, 0.82),
        L('You are an adult in her own night. That is enough holiness for me.', 1600, 0.8),
      ],
    },
    {
      id: 'aftercare',
      title: 'Kept',
      kind: 'aftercare',
      lines: [
        L('I will be quiet now, except to say: I am glad you came here.', 1500, 0.8),
        L('The hour is still yours. Keep it.', 1600, 0.78),
        L('Goodnight, if it is night. And if it is not, then — stay anyway.', 1800, 0.78),
      ],
    },
  ],
};
