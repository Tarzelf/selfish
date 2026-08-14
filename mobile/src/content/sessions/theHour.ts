import type { Session } from '../../types';
import { line as L } from '../line';

export const theHour: Session = {
  id: 'the-hour',
  room: 'still',
  title: 'The Hour',
  subtitle: 'One point of attention. Nothing to solve.',
  durationLabel: '9 min',
  heat: 1,
  synopsis:
    'A still room. A single hour that does not owe anyone a result. Breath, body, one quiet point to return to.',
  forMaya:
    'This is the front door. If she only ever uses Still, the app has still kept its promise.',
  chapters: [
    {
      id: 'arrival',
      title: 'Arrival',
      kind: 'arrival',
      lines: [
        L('Close the door on the day, even if only in your mind.', 1200, 0.86),
        L('You do not have to become a better person in the next few minutes.', 1400, 0.84),
        L('You only have to be here, in a body that has been useful for too long.', 1400, 0.84),
        L('Let your jaw unhook from the sentence it was holding.', 1300, 0.82),
        L('Let your shoulders admit they were working.', 1400, 0.82),
      ],
    },
    {
      id: 'body',
      title: 'The point',
      kind: 'body',
      lines: [
        L('Find the breath where it is actually happening. Not the idea of breath. The small weather in the nose, or the rise under the ribs.', 1600, 0.8),
        L('That is the hour.', 1400, 0.78),
        L('When the mind leaves — and it will — do not argue with it.', 1300, 0.82),
        L('Notice that it left. Then come back to the small weather.', 1500, 0.8),
        L('This is not discipline. This is returning.', 1400, 0.82),
        L('Again.', 1600, 0.76),
        L('The day will try to resume itself in your chest. Let it pass like a hallway conversation that is not yours.', 1600, 0.8),
        L('You are allowed to be unavailable.', 1500, 0.8),
        L('Stay with the point. Not perfectly. Faithfully.', 1600, 0.78),
      ],
    },
    {
      id: 'aftercare',
      title: 'Return',
      kind: 'aftercare',
      lines: [
        L('Begin to widen. The room. The weight of the phone. The fact of your name.', 1400, 0.84),
        L('You did not waste this.', 1300, 0.82),
        L('When you stand, take the hour with you like a coat, not like a lesson.', 1500, 0.84),
        L('I will be here if you need the quiet again.', 1600, 0.8),
      ],
    },
  ],
};
