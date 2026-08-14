import type { Session } from '../../types';
import { line as L } from '../line';

export const putTheDayDown: Session = {
  id: 'put-the-day-down',
  room: 'still',
  title: 'Put the Day Down',
  subtitle: 'A come-down for a nervous system that is still at work.',
  durationLabel: '8 min',
  heat: 1,
  synopsis:
    'Keys, jaw, the last performance of the day. A voice that will hold the room while you stop holding everything.',
  forMaya:
    'She will use this more than she admits. It is how Want becomes possible on a weeknight.',
  chapters: [
    {
      id: 'arrival',
      title: 'The threshold',
      kind: 'arrival',
      lines: [
        L('You are home, or close enough that the body can be told it is home.', 1300, 0.86),
        L('Set down whatever you have been carrying, even if it is only imaginary bags.', 1400, 0.84),
        L('The day is not allowed to follow you into this next part.', 1400, 0.84),
        L('If it tries, we will notice, and we will not invite it to sit.', 1500, 0.82),
      ],
    },
    {
      id: 'body',
      title: 'Unholding',
      kind: 'body',
      lines: [
        L('Unclench the places that clenched to be competent.', 1300, 0.82),
        L('The mouth. The hands. The small muscle beside the eye.', 1400, 0.8),
        L('You were impressive. You do not have to keep being impressive in private.', 1500, 0.82),
        L('Breathe as if someone kind is in the other room, not waiting for a report.', 1500, 0.8),
        L('There is nothing to optimize now.', 1400, 0.78),
        L('If grief or irritation arrives, let it have a chair. Do not make it a project.', 1600, 0.8),
        L('You are a person who has finished a day. That is a complete story.', 1500, 0.82),
      ],
    },
    {
      id: 'aftercare',
      title: 'The lamp',
      kind: 'aftercare',
      lines: [
        L('Drink water if it is near you. Not as a virtue. As a kindness.', 1400, 0.84),
        L('The night does not require a version of you.', 1300, 0.82),
        L('Stay in the soft light a little longer than feels efficient.', 1500, 0.8),
        L('I have the rest.', 1600, 0.78),
      ],
    },
  ],
};
