import { createContext, useContext, useState, ReactNode } from 'react';
import { SelfFeeling } from '../constants/self';

export interface SelfPersona {
  feeling: SelfFeeling;
  name: string;
}

interface AppState {
  hasCompletedAgeGate: boolean;
  setHasCompletedAgeGate: (value: boolean) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: (self: SelfPersona) => void;
  hasCompletedFirstSession: boolean;
  setHasCompletedFirstSession: (value: boolean) => void;
  self: SelfPersona | null;
  updateSelf: (self: Partial<SelfPersona>) => void;
  freeWhisperSessionsRemaining: number;
  decrementFreeSession: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [hasCompletedAgeGate, setHasCompletedAgeGate] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [hasCompletedFirstSession, setHasCompletedFirstSession] = useState(false);
  const [self, setSelf] = useState<SelfPersona | null>(null);
  const [freeWhisperSessionsRemaining, setFreeWhisperSessionsRemaining] = useState(3);

  const completeOnboarding = (nextSelf: SelfPersona) => {
    setSelf(nextSelf);
    setHasCompletedOnboarding(true);
  };

  const updateSelf = (partial: Partial<SelfPersona>) => {
    setSelf((prev) => (prev ? { ...prev, ...partial } : null));
  };

  const decrementFreeSession = () => {
    setFreeWhisperSessionsRemaining((prev) => Math.max(0, prev - 1));
  };

  return (
    <AppContext.Provider
      value={{
        hasCompletedAgeGate,
        setHasCompletedAgeGate,
        hasCompletedOnboarding,
        completeOnboarding,
        hasCompletedFirstSession,
        setHasCompletedFirstSession,
        self,
        updateSelf,
        freeWhisperSessionsRemaining,
        decrementFreeSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
}
