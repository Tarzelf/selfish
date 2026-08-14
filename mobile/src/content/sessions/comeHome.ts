import type { Session } from '../../types';
import { line as L } from '../line';

export const comeHome: Session = {
  id: 'come-home',
  room: 'want',
  title: 'Come Home',
  subtitle: 'The work is done. Someone has been waiting, and it is not you.',
  durationLabel: '12 min',
  heat: 2,
  synopsis:
    'A domestic hour. The lamp is already low. Dinner can wait. You are received — shoulders, mouth, the long exhale of being wanted without having to arrange it.',
  forMaya:
    'The boyfriend-experience fantasy without the word boyfriend. Care first, then heat, then stay.',
  chapters: [
    {
      id: 'arrival',
      title: 'The lamp',
      kind: 'arrival',
      lines: [
        L('I heard your key. I did not call out. I wanted you to walk into a room that was already soft.', 1500, 0.82),
        L('The lamp is low. I turned it down an hour ago, when I started waiting.', 1400, 0.82),
        L('Come here. You can keep your coat on for a minute. I will take it when you are ready.', 1500, 0.8),
        L('You do not have to tell me about the day unless you want to. I can see it in your face.', 1500, 0.82),
        L('I have you. That is the whole plan.', 1600, 0.78),
      ],
    },
    {
      id: 'body',
      title: 'Received',
      kind: 'body',
      lines: [
        L('Let me have your shoulders. They have been holding a life.', 1400, 0.8),
        L('I press my mouth to the place where your neck becomes your back, and I stay there until you remember you have a body.', 1700, 0.78),
        L('You smell like the outside and like yourself. I like both.', 1400, 0.8),
        L('If you need to be held without being wanted, say so. I can do that.', 1500, 0.82),
        L('If you need to be wanted, I am already there. I have been there since the afternoon.', 1600, 0.8),
        L('I turn you, slowly, and I look at your mouth as if it is a decision I get to make carefully.', 1600, 0.78),
        L('When I kiss you it is not hungry first. It is sure. Then it deepens because you answer.', 1700, 0.76),
        L('I like the sound you make when you stop managing the kiss.', 1500, 0.78),
        L('My hand at your waist is a question. Your breath is the yes.', 1500, 0.78),
        L('We can stay in this hallway for a long time. I am not steering you toward a bed to prove a point.', 1600, 0.8),
        L('I just want you close enough that the day cannot find you.', 1600, 0.78),
        L('If we go further, it will be because you walk, and I walk with you, and the door closes because you close it.', 1700, 0.8),
      ],
    },
    {
      id: 'aftercare',
      title: 'Still here',
      kind: 'aftercare',
      lines: [
        L('I keep you against me after the heat thins. This part is not an epilogue. This is the point.', 1600, 0.8),
        L('Water. A slower kiss, almost chaste, because I am not finished being kind.', 1500, 0.82),
        L('You do not owe me a review of what you felt.', 1400, 0.84),
        L('Stay. Or sleep. I will be in the room either way.', 1700, 0.78),
      ],
    },
  ],
};
