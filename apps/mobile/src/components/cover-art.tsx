import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fonts, palette } from '@/constants/theme';
import type { SessionFamily } from '@/lib/types';

/**
 * Procedural cover art v2 — editorial, not placeholder.
 * Layered duotone gradient + glow orb + fine rules + a serif word fragment
 * (the session's first evocative word) set large and cropped, magazine-style.
 * Deterministic per session; zero image assets; cheap to maintain.
 */

interface CoverPalette {
  base: [string, string];
  glow: string;
  accent: string;
}

const DESIRE_PALETTES: CoverPalette[] = [
  { base: ['#2B1631', '#7E2F4E'], glow: 'rgba(224,138,120,0.35)', accent: '#E8B98A' },
  { base: ['#1F1533', '#6E3B1F'], glow: 'rgba(223,174,114,0.32)', accent: '#E5C08D' },
  { base: ['#301A38', '#93422A'], glow: 'rgba(217,122,110,0.30)', accent: '#EFC9A5' },
  { base: ['#241534', '#5E2F57'], glow: 'rgba(216,138,158,0.33)', accent: '#E3A9B8' },
  { base: ['#2C1626', '#7C4A2E'], glow: 'rgba(226,168,120,0.30)', accent: '#E9C79E' },
  { base: ['#1D1430', '#753C55'], glow: 'rgba(213,131,143,0.32)', accent: '#E2AFA6' },
];

const REST_PALETTES: CoverPalette[] = [
  { base: ['#131B2C', '#2F4B60'], glow: 'rgba(126,168,190,0.28)', accent: '#A9C6D4' },
  { base: ['#141827', '#3A4C70'], glow: 'rgba(140,160,205,0.26)', accent: '#B4C2E0' },
  { base: ['#12211F', '#2F5348'], glow: 'rgba(126,190,168,0.24)', accent: '#A8CFC0' },
  { base: ['#171A26', '#48587E'], glow: 'rgba(150,163,205,0.26)', accent: '#BCC6E2' },
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function coverPalette(family: Pick<SessionFamily, 'id' | 'shelf'>): CoverPalette {
  const palettes = family.shelf === 'rest' ? REST_PALETTES : DESIRE_PALETTES;
  return palettes[hashString(family.id) % palettes.length];
}

/** The evocative word set large on the cover: first non-article word of the title. */
function coverWord(title: string): string {
  const words = title.replace(/[^\w\s]/g, '').split(/\s+/).filter((w) => !/^(the|a|an|of|to)$/i.test(w));
  return (words[0] ?? title).toLowerCase();
}

export function CoverArt({
  family,
  size,
  radius = 16,
}: {
  family: Pick<SessionFamily, 'id' | 'shelf' | 'title'>;
  size: number;
  radius?: number;
}) {
  const p = coverPalette(family);
  const word = coverWord(family.title);
  const seed = hashString(family.id);
  const orbTop = 12 + (seed % 30); // percent
  const orbLeft = 40 + ((seed >> 3) % 40);

  return (
    <LinearGradient
      colors={[p.base[0], p.base[1]]}
      start={{ x: 0.05, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.cover, { width: size, height: size, borderRadius: radius }]}
    >
      {/* Glow orb */}
      <View
        style={[
          styles.orb,
          {
            width: size * 0.7,
            height: size * 0.7,
            borderRadius: size,
            backgroundColor: p.glow,
            top: `${orbTop}%`,
            left: `${orbLeft - 30}%`,
          },
        ]}
      />
      {/* Fine rules */}
      <View style={[styles.ruleH, { top: size * 0.18, backgroundColor: p.accent, opacity: 0.35 }]} />
      <View style={[styles.ruleH, { bottom: size * 0.22, backgroundColor: p.accent, opacity: 0.2 }]} />
      {/* Oversized cropped serif word */}
      <Text
        numberOfLines={1}
        style={[
          styles.word,
          {
            fontSize: size * 0.34,
            color: p.accent,
            bottom: size * 0.06,
            left: size * 0.09,
            width: size * 1.4,
          },
        ]}
      >
        {word}
      </Text>
      {/* Corner mark */}
      <Text style={[styles.mark, { color: p.accent, fontSize: Math.max(10, size * 0.07), top: size * 0.07, left: size * 0.09 }]}>
        SELFISH
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  cover: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: palette.surface,
  },
  orb: { position: 'absolute', opacity: 0.9 },
  ruleH: { position: 'absolute', left: 0, right: 0, height: StyleSheet.hairlineWidth },
  word: {
    position: 'absolute',
    fontFamily: fonts.display,
    fontStyle: 'italic',
    opacity: 0.92,
  },
  mark: {
    position: 'absolute',
    fontFamily: fonts.body,
    letterSpacing: 2.2,
    fontWeight: '600',
    opacity: 0.55,
  },
});
