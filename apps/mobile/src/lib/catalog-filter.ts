import type { HeatLevel, Preferences, SessionFamily } from '@/lib/types';

/** Close loops stay invisible until she opts Close. Aftercare on a Close family does not leak into Soft. */
export function catalogForPrefs(
  catalog: SessionFamily[],
  prefs: Pick<Preferences, 'heatCap' | 'hardLimits'>,
  heatAllowed: (heat: HeatLevel) => boolean,
): SessionFamily[] {
  return catalog.filter((f) => {
    if (f.format === 'close' && prefs.heatCap !== 'spicy') return false;
    if (f.tags.some((t) => prefs.hardLimits.includes(t))) return false;
    return f.variants.some((v) => heatAllowed(v.heat));
  });
}
