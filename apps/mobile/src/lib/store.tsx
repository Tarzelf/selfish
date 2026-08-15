import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { CATALOG } from '@/data/catalog';
import { catalogForPrefs } from '@/lib/catalog-filter';
import {
  type ContinueEntry,
  DEFAULT_PREFERENCES,
  EMPTY_RITUAL,
  HEAT_ORDER,
  type HeatLevel,
  type Preferences,
  type RitualMemory,
  type SessionFamily,
} from '@/lib/types';

const PREFS_KEY = 'selfish.preferences.v1';
const CONTINUE_KEY = 'selfish.continue.v1';
const RITUAL_KEY = 'selfish.ritual.v1';

interface AppState {
  ready: boolean;
  prefs: Preferences;
  setPrefs: (update: Partial<Preferences>) => void;
  resetAll: () => void;
  continueList: ContinueEntry[];
  ritual: RitualMemory;
  recordProgress: (familyId: string, variantId: string, progress: number) => void;
  /** Catalog filtered by the user's heat cap and hard limits. Close is hidden until heatCap is Close. */
  visibleCatalog: SessionFamily[];
  heatAllowed: (heat: HeatLevel) => boolean;
}

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [prefs, setPrefsState] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [continueList, setContinueList] = useState<ContinueEntry[]>([]);
  const [ritual, setRitual] = useState<RitualMemory>(EMPTY_RITUAL);

  useEffect(() => {
    (async () => {
      try {
        const [rawPrefs, rawContinue, rawRitual] = await Promise.all([
          AsyncStorage.getItem(PREFS_KEY),
          AsyncStorage.getItem(CONTINUE_KEY),
          AsyncStorage.getItem(RITUAL_KEY),
        ]);
        if (rawPrefs) setPrefsState({ ...DEFAULT_PREFERENCES, ...JSON.parse(rawPrefs) });
        if (rawContinue) setContinueList(JSON.parse(rawContinue));
        if (rawRitual) setRitual({ ...EMPTY_RITUAL, ...JSON.parse(rawRitual) });
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
    setRitual(EMPTY_RITUAL);
    AsyncStorage.multiRemove([PREFS_KEY, CONTINUE_KEY, RITUAL_KEY]).catch(() => {});
  }, []);

  const recordProgress = useCallback((familyId: string, variantId: string, progress: number) => {
    const finished = progress >= 0.97;
    setContinueList((prev) => {
      const rest = prev.filter((e) => e.familyId !== familyId);
      const next: ContinueEntry[] = [
        { familyId, variantId, progress: finished ? 1 : progress, updatedAt: Date.now() },
        ...rest,
      ].slice(0, 10);
      AsyncStorage.setItem(CONTINUE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
    setRitual((prev) => {
      const next: RitualMemory = {
        lastFamilyId: familyId,
        lastVariantId: variantId,
        lastFinishedFamilyId: finished ? familyId : prev.lastFinishedFamilyId,
        lastFinishedVariantId: finished ? variantId : prev.lastFinishedVariantId,
      };
      AsyncStorage.setItem(RITUAL_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const heatAllowed = useCallback(
    (heat: HeatLevel) => HEAT_ORDER.indexOf(heat) <= HEAT_ORDER.indexOf(prefs.heatCap),
    [prefs.heatCap],
  );

  const visibleCatalog = useMemo(
    () => catalogForPrefs(CATALOG, prefs, heatAllowed),
    [prefs, heatAllowed],
  );

  const value = useMemo(
    () => ({
      ready,
      prefs,
      setPrefs,
      resetAll,
      continueList,
      ritual,
      recordProgress,
      visibleCatalog,
      heatAllowed,
    }),
    [ready, prefs, setPrefs, resetAll, continueList, ritual, recordProgress, visibleCatalog, heatAllowed],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppState must be within AppStateProvider');
  return ctx;
}
