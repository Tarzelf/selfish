import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { CATALOG } from '@/data/catalog';
import { canPlay, heatAllowed as heatAllowedFor, isFamilyVisible, visibleCatalog as filterCatalog } from '@/lib/catalog-access';
import {
  type ContinueEntry,
  DEFAULT_PREFERENCES,
  type HeatLevel,
  type Preferences,
  type SessionFamily,
} from '@/lib/types';

const PREFS_KEY = 'selfish.preferences.v1';
const CONTINUE_KEY = 'selfish.continue.v1';

interface AppState {
  ready: boolean;
  prefs: Preferences;
  setPrefs: (update: Partial<Preferences>) => void;
  resetAll: () => void;
  continueList: ContinueEntry[];
  recordProgress: (familyId: string, variantId: string, progress: number) => void;
  /** Catalog filtered by the user's heat cap and hard limits. */
  visibleCatalog: SessionFamily[];
  heatAllowed: (heat: HeatLevel) => boolean;
  familyVisible: (family: SessionFamily) => boolean;
  canPlayFamily: (family: SessionFamily) => boolean;
  startPreview: () => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [prefs, setPrefsState] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [continueList, setContinueList] = useState<ContinueEntry[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [rawPrefs, rawContinue] = await Promise.all([
          AsyncStorage.getItem(PREFS_KEY),
          AsyncStorage.getItem(CONTINUE_KEY),
        ]);
        if (rawPrefs) setPrefsState({ ...DEFAULT_PREFERENCES, ...JSON.parse(rawPrefs) });
        if (rawContinue) setContinueList(JSON.parse(rawContinue));
      } catch {
        // Corrupt local state falls back to defaults; nothing sensitive is lost.
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const setPrefs = useCallback((update: Partial<Preferences>) => {
    setPrefsState((prev) => {
      const next = { ...prev, ...update };
      AsyncStorage.setItem(PREFS_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setPrefsState(DEFAULT_PREFERENCES);
    setContinueList([]);
    AsyncStorage.multiRemove([PREFS_KEY, CONTINUE_KEY]).catch(() => {});
  }, []);

  const recordProgress = useCallback((familyId: string, variantId: string, progress: number) => {
    setContinueList((prev) => {
      const rest = prev.filter((e) => e.familyId !== familyId);
      const next: ContinueEntry[] =
        progress >= 0.97
          ? rest // finished sessions leave the Continue rail
          : [{ familyId, variantId, progress, updatedAt: Date.now() }, ...rest].slice(0, 10);
      AsyncStorage.setItem(CONTINUE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const heatAllowed = useCallback((heat: HeatLevel) => heatAllowedFor(heat, prefs.heatCap), [prefs.heatCap]);

  const familyVisible = useCallback((family: SessionFamily) => isFamilyVisible(family, prefs), [prefs]);

  const canPlayFamily = useCallback((family: SessionFamily) => canPlay(family, prefs), [prefs]);

  const startPreview = useCallback(() => {
    setPrefs({ membershipStartedAt: Date.now() });
  }, [setPrefs]);

  const visibleCatalog = useMemo(() => filterCatalog(CATALOG, prefs), [prefs]);

  const value = useMemo(
    () => ({
      ready,
      prefs,
      setPrefs,
      resetAll,
      continueList,
      recordProgress,
      visibleCatalog,
      heatAllowed,
      familyVisible,
      canPlayFamily,
      startPreview,
    }),
    [
      ready,
      prefs,
      setPrefs,
      resetAll,
      continueList,
      recordProgress,
      visibleCatalog,
      heatAllowed,
      familyVisible,
      canPlayFamily,
      startPreview,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
