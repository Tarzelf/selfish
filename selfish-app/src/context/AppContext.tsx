import { createContext, useContext, useState, ReactNode } from 'react';

interface AppState {
  hasCompletedAgeGate: boolean;
  setHasCompletedAgeGate: (value: boolean) => void;
  freeWhisperSessionsRemaining: number;
  decrementFreeSession: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [hasCompletedAgeGate, setHasCompletedAgeGate] = useState(false);
  const [freeWhisperSessionsRemaining, setFreeWhisperSessionsRemaining] = useState(3);

  const decrementFreeSession = () => {
    setFreeWhisperSessionsRemaining((prev) => Math.max(0, prev - 1));
  };

  return (
    <AppContext.Provider
      value={{
        hasCompletedAgeGate,
        setHasCompletedAgeGate,
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
