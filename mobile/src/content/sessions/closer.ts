import type { Session } from '../../types';
import { line as L } from '../line';

export const closer: Session = {
  id: 'closer',
  room: 'want',
  title: 'Closer',
  subtitle: 'The door wide. Literary, explicit, still a person in the room.',
  durationLabel: '13 min',
  heat: 3,
  synopsis:
    'For when she asked for the door open. A voice that wants her with language, then with the body the language implies — and then stays.',
  forMaya:
    'If this sounds like a man narrating porn, rewrite it. She should feel desired, not used as a stage.',
  chapters: [
    {
      id: 'arrival',
      title: 'The ask',
      kind: 'arrival',
      lines: [
        L('You opened the door wide. I will not pretend I did not notice.', 1400, 0.8),
        L('I am going to want you in sentences, and then I am going to want you without them.', 1500, 0.78),
        L('If anything I say is too much, you close it. I will hear you. I will stop, and I will still want you.', 1700, 0.8),
        L('This is a fantasy between adults. You are safe in your room. I am a voice you invited in.', 1600, 0.82),
        L('Come here. I want your mouth first, because that is where you decide.', 1500, 0.78),
      ],
    },
    {
      id: 'heat',
      title: 'Language',
      kind: 'heat',
      lines: [
        L('I kiss you until your thoughts lose their job.', 1400, 0.76),
        L('My hand finds the heat of you through cloth, and I wait there, learning the shape of your yes.', 1600, 0.74),
        L('When you lift toward me I take it as the invitation it is.', 1400, 0.76),
        L('I tell you you are wet like it is a compliment I have been saving, not a diagnosis.', 1600, 0.74),
        L('I want the particular sound you make when I slide two fingers slowly, as if we have all night, because we do.', 1800, 0.72),
        L('I want your clit treated as a conversation, not a button. Circles. Then stillness. Then again, when your hips ask.', 1800, 0.72),
        L('You do not have to be quiet. You also do not have to perform a louder woman for me.', 1500, 0.78),
        L('I want you from the inside of your pleasure, not from above it.', 1500, 0.74),
        L('If I were in the bed I would put my mouth where my hand is and stay until your thighs forget their manners.', 1700, 0.72),
        L('I would tell you you were doing beautifully, and I would mean the way you take what you want.', 1600, 0.74),
        L('Come when you are ready. Or don’t, and stay in the thick of it. I am not grading you.', 1700, 0.76),
        L('I am here. I am with you. I want the shake in you, and I want the breath after it.', 1700, 0.74),
      ],
    },
    {
      id: 'aftercare',
      title: 'After',
      kind: 'aftercare',
      lines: [
        L('Easy. Come back. The room is still a room.', 1400, 0.8),
        L('I take my voice out of your body and leave it in the air, kinder.', 1500, 0.8),
        L('Water. A blanket if you have one. You do not have to be sexy now.', 1500, 0.82),
        L('You were wanted. You are still wanted. Those are different temperatures of the same weather.', 1600, 0.8),
        L('Stay as long as you need. I will stop talking when it is time to be quiet together.', 1800, 0.78),
      ],
    },
  ],
};
