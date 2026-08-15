import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { fonts, palette } from '@/constants/theme';
import type { SessionFamily } from '@/lib/types';

interface CoverPalette {
  base: [string, string];
  accent: string;
}

const DESIRE: CoverPalette[] = [
  { base: [palette.ink, palette.inkHigh], accent: palette.blush },
  { base: [palette.inkLift, palette.inkHigh], accent: palette.ember },
  { base: [palette.ink, palette.inkLift], accent: palette.boneDim },
];

const REST: CoverPalette[] = [
  { base: [palette.restInk, palette.inkHigh], accent: palette.rest },
  { base: [palette.ink, palette.inkLift], accent: palette.boneDim },
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function coverPalette(family: Pick<SessionFamily, 'id' | 'shelf'>): CoverPalette {
  const set = family.shelf === 'rest' ? REST : DESIRE;
  return set[hashString(family.id) % set.length];
}

function coverWord(title: string): string {
  const words = title.replace(/[^\w\s]/g, '').split(/\s+/).filter((w) => !/^(the|a|an|of|to)$/i.test(w));
  return (words[0] ?? title).toLowerCase();
}

export function CoverArt({
  family,
  size,
  radius = 12,
}: {
  family: Pick<SessionFamily, 'id' | 'shelf' | 'title'>;
  size: number;
  radius?: number;
}) {
  const p = coverPalette(family);
  const word = coverWord(family.title);

  return (
    <LinearGradient
      colors={[p.base[0], p.base[1]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.cover, { width: size, height: size, borderRadius: radius }]}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.word,
          {
            fontSize: size * 0.28,
            color: p.accent,
            bottom: size * 0.08,
            left: size * 0.1,
            width: size * 1.3,
          },
        ]}
      >
        {word}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  cover: {
    overflow: 'hidden',
    backgroundColor: palette.inkLift,
  },
  word: {
    position: 'absolute',
    fontFamily: fonts.display,
    opacity: 0.88,
  },
});
