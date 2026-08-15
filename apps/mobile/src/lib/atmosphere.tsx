import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { PALETTES, type Palette, heatColorFor } from '@/constants/theme';
import { resolvePart } from '@/lib/atmosphere-time';
import { useAppState } from '@/lib/store';
import type { AtmospherePart, AtmospherePref } from '@/lib/types';

export { hourToPart, resolvePart } from '@/lib/atmosphere-time';

interface AtmosphereValue {
  part: AtmospherePart;
  pref: AtmospherePref;
  hour: number;
  palette: Palette;
  heatColor: Record<string, string>;
}

const Ctx = createContext<AtmosphereValue | null>(null);

export function AtmosphereProvider({ children }: { children: React.ReactNode }) {
  const { prefs } = useAppState();
  const [hour, setHour] = useState(() => new Date().getHours());

  useEffect(() => {
    const id = setInterval(() => setHour(new Date().getHours()), 60_000);
    return () => clearInterval(id);
  }, []);

  const value = useMemo(() => {
    const part = resolvePart(prefs.atmospherePref ?? 'auto', hour);
    const palette = PALETTES[part];
    return {
      part,
      pref: prefs.atmospherePref ?? 'auto',
      hour,
      palette,
      heatColor: heatColorFor(palette),
    };
  }, [prefs.atmospherePref, hour]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.part = value.part;
    document.body.dataset.part = value.part;
  }, [value.part]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAtmosphere(): AtmosphereValue {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return {
      part: 'evening',
      pref: 'auto',
      hour: 21,
      palette: PALETTES.evening,
      heatColor: heatColorFor(PALETTES.evening),
    };
  }
  return ctx;
}

export function useTheme() {
  return useAtmosphere();
}
