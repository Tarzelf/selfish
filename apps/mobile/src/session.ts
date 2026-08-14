import type { MoodId, VoiceId } from './theme';

export interface SessionRequest {
  mood: MoodId;
  intensity: number;
  voice: VoiceId;
  /** Optional one-line intention; kept short on purpose */
  intention?: string;
}

export interface SessionScript {
  title: string;
  beats: {
    settle: string;
    want: string;
    build: string;
    peak?: string;
    aftercare: string;
  };
  /** Approximate spoken duration target in minutes */
  minutes: number;
  demoNarration: string;
}

const DEMO: Record<MoodId, SessionScript> = {
  held: {
    title: 'Come here',
    minutes: 8,
    beats: {
      settle: 'Room tone. Breath. Permission to arrive.',
      want: 'Being noticed without performing.',
      build: 'Caretaking closeness, paced to intensity.',
      peak: 'Optional crest — only if intensity allows.',
      aftercare: 'Warm landing. Dignity. Soft exit.',
    },
    demoNarration:
      'Settle in. There is nowhere else you need to be. Tonight is not a performance — it is a room made quiet enough for you. I am here. Unhurried. If you want me closer, I will know. If you want me to stop, I will stop. You are allowed to want this.',
  },
  teased: {
    title: 'Not yet',
    minutes: 10,
    beats: {
      settle: 'A door half-open. Soft light.',
      want: 'Anticipation as the pleasure.',
      build: 'Near / far. Delay as care.',
      peak: 'Release only if she wants the turn.',
      aftercare: 'Laugh-soft. Held. Complete.',
    },
    demoNarration:
      'Not yet. Stay with the almost. Feel how the waiting itself softens your shoulders. I will not rush you into anything. The night can take its time — and so can you.',
  },
  powerful: {
    title: 'Ask me properly',
    minutes: 9,
    beats: {
      settle: 'Ground. Spine. Choice.',
      want: 'Agency named out loud.',
      build: 'Power exchanged with consent checks.',
      peak: 'Intensity-gated.',
      aftercare: 'Return of softness. Equal again.',
    },
    demoNarration:
      'You set the terms. Say what you want — or say nothing and let the silence choose for you. Either way, I am listening. Power here is clean. It ends the moment you say stop.',
  },
  soft: {
    title: 'Almost a whisper',
    minutes: 8,
    beats: {
      settle: 'Breath at the ear. Minimal words.',
      want: 'Tenderness without demand.',
      build: 'Slow sensory presence.',
      aftercare: 'Stillness. Stay as long as you like.',
    },
    demoNarration:
      'Soft. That is enough. No spectacle. Just a voice near enough to feel like warmth. If all you need is to be quiet with someone, we can stay here.',
  },
  slowburn: {
    title: 'Let it unfold',
    minutes: 12,
    beats: {
      settle: 'Long arrival. No skip.',
      want: 'Yearning without urgency.',
      build: 'Scene widens slowly.',
      peak: 'Late, if at all.',
      aftercare: 'Afterglow language. No abrupt cut.',
    },
    demoNarration:
      'We have time. The story does not need to hurry to prove itself. Let attention gather the way dusk gathers — slowly, then all at once.',
  },
  spoken: {
    title: 'Only you',
    minutes: 9,
    beats: {
      settle: 'Direct address established gently.',
      want: 'Being spoken to, not watched.',
      build: 'Second-person intimacy, consent woven in.',
      peak: 'Intensity-gated.',
      aftercare: 'You can put the night down.',
    },
    demoNarration:
      'This is for you. Not an audience. Not a feed. Just a voice shaped around what you asked for tonight. You can pause. You can leave. Nothing is owed.',
  },
};

/** Demo generator — structure only. Live path will call Grok + ElevenLabs. */
export function generateDemoSession(req: SessionRequest): SessionScript {
  const base = DEMO[req.mood];
  const intensityNote =
    req.intensity <= 2
      ? 'Keep suggestion and atmosphere; no explicit crest.'
      : req.intensity >= 4
        ? 'Allow explicit crest only inside consent rails.'
        : 'Warm build; crest optional.';

  return {
    ...base,
    title: base.title,
    demoNarration: `${base.demoNarration}\n\n[${intensityNote} Voice: ${req.voice}${
      req.intention ? ` · Intention: ${req.intention}` : ''
    }]`,
  };
}
