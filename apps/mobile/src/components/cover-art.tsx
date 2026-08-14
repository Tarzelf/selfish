import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fonts, palette } from '@/constants/theme';
import type { SessionFamily } from '@/lib/types';

/**
 * Procedural cover art: a deterministic duotone gradient per session, tinted
 * by shelf and dynamic, with a serif monogram. No image assets, no external
 * requests — the covers are part of the design system.
 */

const DESIRE_PALETTES: [string, string][] = [
  ['#3D2244', '#8A3B5C'], // plum → mulberry
  ['#2C1E3F', '#7A4A2E'], // ink → amber
  ['#38203B', '#A0522D'], // aubergine → sienna
  ['#2A1B33', '#6E3B63'], // deep violet → orchid
  ['#341F2E', '#8C5A3C'], // cocoa → copper
  ['#251A38', '#874E68'], // midnight → rose
];

const REST_PALETTES: [string, string][] = [
  ['#1B2436', '#3D5A6C'], // night → slate blue
  ['#1E2230', '#4A5D7E'], // ink → dusk
  ['#1A2A2E', '#3E6257'], // deep teal → moss
  ['#20242F', '#5C6B8A'], // graphite → periwinkle
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function coverColors(family: Pick<SessionFamily, 'id' | 'shelf'>): [string, string] {
  const palettes = family.shelf === 'rest' ? REST_PALETTES : DESIRE_PALETTES;
  return palettes[hashString(family.id) % palettes.length];
}

export function CoverArt({
  family,
  size,
  radius = 14,
  glyphScale = 0.38,
}: {
  family: Pick<SessionFamily, 'id' | 'shelf' | 'title'>;
  size: number;
  radius?: number;
  glyphScale?: number;
}) {
  const [from, to] = coverColors(family);
  const monogram = family.title.replace(/^The\s+/i, '').charAt(0).toUpperCase();
  return (
    <LinearGradient
      colors={[from, to]}
      start={{ x: 0.1, y: 0.05 }}
      end={{ x: 0.95, y: 1 }}
      style={[styles.cover, { width: size, height: size, borderRadius: radius }]}
    >
      <View style={[styles.ring, { width: size * 0.66, height: size * 0.66, borderRadius: size }]} />
      <Text style={[styles.monogram, { fontSize: size * glyphScale }]}>{monogram}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  cover: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  monogram: {
    fontFamily: fonts.display,
    color: palette.text,
    opacity: 0.9,
  },
});
