import type { AtmospherePart, AtmospherePref } from '@/lib/types';

export function hourToPart(hour: number): AtmospherePart {
  return hour >= 5 && hour < 17 ? 'morning' : 'evening';
}

export function resolvePart(pref: AtmospherePref, hour: number): AtmospherePart {
  if (pref === 'auto') return hourToPart(hour);
  return pref;
}
