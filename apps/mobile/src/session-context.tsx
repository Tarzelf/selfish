import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { MoodId, VoiceId } from './theme';
import { generateDemoSession, type SessionScript } from './session';

interface SessionState {
  ageConfirmed: boolean;
  mood: MoodId | null;
  intensity: number;
  voice: VoiceId;
  intention: string;
  script: SessionScript | null;
  confirmAge: () => void;
  setMood: (mood: MoodId) => void;
  setIntensity: (n: number) => void;
  setVoice: (v: VoiceId) => void;
  setIntention: (s: string) => void;
  beginSession: () => SessionScript;
  clearSession: () => void;
}

const Ctx = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [mood, setMood] = useState<MoodId | null>(null);
  const [intensity, setIntensity] = useState(2);
  const [voice, setVoice] = useState<VoiceId>('warm-low');
  const [intention, setIntention] = useState('');
  const [script, setScript] = useState<SessionScript | null>(null);

  const value = useMemo<SessionState>(
    () => ({
      ageConfirmed,
      mood,
      intensity,
      voice,
      intention,
      script,
      confirmAge: () => setAgeConfirmed(true),
      setMood,
      setIntensity,
      setVoice,
      setIntention,
      beginSession: () => {
        if (!mood) {
          throw new Error('Mood required');
        }
        const next = generateDemoSession({
          mood,
          intensity,
          voice,
          intention: intention.trim() || undefined,
        });
        setScript(next);
        return next;
      },
      clearSession: () => setScript(null),
    }),
    [ageConfirmed, mood, intensity, voice, intention, script],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSession() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error('useSession outside provider');
  }
  return ctx;
}
