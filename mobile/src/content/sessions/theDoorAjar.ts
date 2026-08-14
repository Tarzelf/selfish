import type { Session } from '../../types';
import { line as L } from '../line';

export const theDoorAjar: Session = {
  id: 'the-door-ajar',
  room: 'want',
  title: 'The Door Ajar',
  subtitle: 'A slow burn. Almost a short story. Almost a touch.',
  durationLabel: '11 min',
  heat: 1,
  synopsis:
    'Two adults in a quiet room. The door is not closed. Nothing is taken. Everything is offered at the pace of a look that lasts too long.',
  forMaya:
    'This is the session Apple can hear and Maya can finish. If this fails, the product fails.',
  chapters: [
    {
      id: 'arrival',
      title: 'The room',
      kind: 'arrival',
      lines: [
        L('I have left the door ajar on purpose.', 1400, 0.8),
        L('Not because I am unsure. Because I want you to feel that you can leave, and that you are choosing to stay.', 1600, 0.8),
        L('Come sit. Not in my lap. Across from me. I want to look at you first.', 1500, 0.82),
        L('You are a grown woman in a room that belongs to her for an hour.', 1400, 0.84),
        L('I am not going to rush you toward a conclusion.', 1500, 0.8),
      ],
    },
    {
      id: 'body',
      title: 'The look',
      kind: 'body',
      lines: [
        L('There is a way you hold your mouth when you are thinking. I have been watching it.', 1500, 0.8),
        L('I like the intelligence in it. I like that you are not performing pretty.', 1500, 0.82),
        L('If I reached across the table, I would stop an inch from your wrist.', 1500, 0.78),
        L('I would let you feel the heat of my hand before I asked for anything.', 1500, 0.78),
        L('Tell me, without speaking, whether that inch is a kindness or a torment.', 1600, 0.8),
        L('Good. I thought so.', 1400, 0.76),
        L('I could talk about your work, or the weather. I will not insult you with smallness.', 1500, 0.82),
        L('I want the quiet between us to thicken until it has a pulse.', 1600, 0.78),
        L('Your throat moves when you swallow. I notice. I do not comment like a man collecting trophies.', 1600, 0.8),
        L('I just… stay. Looking. Letting you be looked at without having to be entertaining.', 1600, 0.78),
        L('If you leaned forward, I would meet you halfway and no further.', 1500, 0.8),
        L('The almost is the point tonight.', 1600, 0.76),
      ],
    },
    {
      id: 'aftercare',
      title: 'The inch',
      kind: 'aftercare',
      lines: [
        L('I take my hand back. The inch remains, like a light we did not turn off.', 1500, 0.82),
        L('You can close the door whenever you like. You can also leave it as it is.', 1400, 0.84),
        L('Drink something. Feel the chair. You are still entirely yours.', 1500, 0.82),
        L('If you want the door wider another night, I will be here, and I will still begin with looking.', 1700, 0.8),
      ],
    },
  ],
};
