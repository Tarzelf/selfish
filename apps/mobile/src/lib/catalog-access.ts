import { HEAT_ORDER, type HeatLevel, type Preferences, type SessionFamily } from './types';

/** Permanent free tier: 3 Desire + 3 Rest. Everything else needs Selfish+. */
export const FREE_FAMILY_IDS = new Set([
  'f-back-to-yours',
  'f-sunday-morning',
  'f-heavy-day',
  'f-rain-on-glass',
  'f-unwind-count',
  'f-night-train',
]);

export const PREVIEW_MS = 14 * 24 * 60 * 60 * 1000;

export function heatAllowed(heat: HeatLevel, heatCap: HeatLevel): boolean {
  return HEAT_ORDER.indexOf(heat) <= HEAT_ORDER.indexOf(heatCap);
}

export function isBlockedByLimits(family: SessionFamily, hardLimits: string[]): boolean {
  return family.tags.some((t) => hardLimits.includes(t));
}

/** Whether the family may appear anywhere (Tonight, Browse, Rest, Continue, deep link). */
export function isFamilyVisible(family: SessionFamily, prefs: Pick<Preferences, 'heatCap' | 'hardLimits'>): boolean {
  if (isBlockedByLimits(family, prefs.hardLimits)) return false;
  return family.variants.some((v) => heatAllowed(v.heat, prefs.heatCap));
}

export function allowedVariants(family: SessionFamily, heatCap: HeatLevel) {
  return family.variants.filter((v) => heatAllowed(v.heat, heatCap));
}

export function lockedVariants(family: SessionFamily, heatCap: HeatLevel) {
  return family.variants.filter((v) => !heatAllowed(v.heat, heatCap));
}

export function isFreeFamily(family: SessionFamily): boolean {
  return FREE_FAMILY_IDS.has(family.id);
}

export function isWhopMember(prefs: Pick<Preferences, 'whopEntitledAt'>): boolean {
  return prefs.whopEntitledAt != null;
}

export function isPreviewActive(prefs: Pick<Preferences, 'membershipStartedAt'>, now = Date.now()): boolean {
  return prefs.membershipStartedAt != null && now - prefs.membershipStartedAt < PREVIEW_MS;
}

export function hasCatalogAccess(
  prefs: Pick<Preferences, 'membershipStartedAt' | 'whopEntitledAt'>,
  now = Date.now(),
): boolean {
  return isWhopMember(prefs) || isPreviewActive(prefs, now);
}

export function previewDaysLeft(prefs: Pick<Preferences, 'membershipStartedAt'>, now = Date.now()): number {
  if (prefs.membershipStartedAt == null) return 0;
  return Math.max(0, Math.ceil((prefs.membershipStartedAt + PREVIEW_MS - now) / (24 * 60 * 60 * 1000)));
}

export function canPlay(
  family: SessionFamily,
  prefs: Pick<Preferences, 'heatCap' | 'hardLimits' | 'membershipStartedAt' | 'whopEntitledAt'>,
  now = Date.now(),
): boolean {
  if (!isFamilyVisible(family, prefs)) return false;
  return isFreeFamily(family) || hasCatalogAccess(prefs, now);
}

export function visibleCatalog<T extends SessionFamily>(
  catalog: T[],
  prefs: Pick<Preferences, 'heatCap' | 'hardLimits'>,
): T[] {
  return catalog.filter((f) => isFamilyVisible(f, prefs));
}

export function browseTags(catalog: SessionFamily[]): string[] {
  return [...new Set(catalog.flatMap((f) => f.tags))].sort();
}

export function browseDynamics(catalog: SessionFamily[]): string[] {
  return [...new Set(catalog.filter((f) => f.shelf === 'desire').map((f) => f.dynamic))].sort();
}
