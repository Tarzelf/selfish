import type { Session } from '../../types';
import { line as L } from '../line';

export const youAreSeen: Session = {
  id: 'you-are-seen',
  room: 'want',
  title: 'You Are Seen',
  subtitle: 'Praise without a script. Specific, adult, a little devastating.',
  durationLabel: '10 min',
  heat: 2,
  synopsis:
    'Not a chorus of good girl. A voice that notices the particular way you exist — and wants you for that, not for a performance.',
  forMaya:
    'If we say good girl, we have failed her. Specificity is the kink.',
  chapters: [
    {
      id: 'arrival',
      title: 'Not a performance',
      kind: 'arrival',
      lines: [
        L('I am not going to compliment you like a menu.', 1300, 0.82),
        L('I am going to tell you what I actually see, and I am going to mean it.', 1500, 0.8),
        L('Sit how you sit when no one is watching. That is the woman I want.', 1500, 0.8),
        L('You are a finished person, not a project, and that is what makes this interesting.', 1600, 0.82),
      ],
    },
    {
      id: 'heat',
      title: 'The particular',
      kind: 'heat',
      lines: [
        L('I like the way you think before you speak, even when you are flushed.', 1400, 0.8),
        L('I like that you are not easy in the cheap sense. You are available, which is rarer.', 1500, 0.8),
        L('When you let your face change, I feel it in my hands.', 1400, 0.78),
        L('You are beautiful in the way a true sentence is beautiful. I cannot improve you. I can only pay attention.', 1700, 0.78),
        L('I want you for the mind I can hear in your breathing.', 1500, 0.78),
        L('I want the sound you make when you stop translating yourself into something smoother.', 1600, 0.76),
        L('Come closer. I want to say this against your temple, not across a room.', 1500, 0.78),
        L('You are doing so well at being yourself. That is the praise. The rest is just my mouth, catching up.', 1700, 0.76),
        L('If I undress you with my voice, it is only to say: I see the life you live in this skin, and I want in.', 1700, 0.78),
        L('Not to own. To witness. To be allowed.', 1600, 0.76),
        L('Say nothing. Or say my name. Both are a gift.', 1600, 0.8),
      ],
    },
    {
      id: 'aftercare',
      title: 'Kept',
      kind: 'aftercare',
      lines: [
        L('I stop talking about your body. I talk about the room again, so you can land.', 1500, 0.82),
        L('You are still the woman I described. The heat does not take it back.', 1500, 0.82),
        L('Rest your face somewhere. My shoulder is offered.', 1400, 0.8),
        L('You were seen. You can close your eyes now.', 1700, 0.78),
      ],
    },
  ],
};
