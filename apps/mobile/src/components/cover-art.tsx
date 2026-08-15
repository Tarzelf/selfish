import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { StyleSheet, Text, type ViewStyle } from 'react-native';

import { fonts, palette, radius as radii } from '@/constants/theme';
import type { SessionFamily } from '@/lib/types';

export type CoverAspect = 'square' | 'portrait' | 'wide';

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

const ASPECT: Record<CoverAspect, number> = {
  square: 1,
  portrait: 3 / 4,
  wide: 16 / 9,
};

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
  aspect = 'square',
  radius = radii.md,
}: {
  family: Pick<SessionFamily, 'id' | 'shelf' | 'title'>;
  size?: number;
  aspect?: CoverAspect;
  radius?: number;
}) {
  const p = coverPalette(family);
  const word = coverWord(family.title);
  const ratio = ASPECT[aspect];
  const [measured, setMeasured] = useState(size ?? 0);
  const width = size ?? measured;
  const wordSize = width ? Math.min(Math.max(width * 0.2, 22), 56) : 28;

  const box: ViewStyle =
    size != null
      ? { width: size, height: size / ratio, borderRadius: radius }
      : { width: '100%', aspectRatio: ratio, borderRadius: radius };

  return (
    <LinearGradient
      colors={[p.base[0], p.base[1]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      onLayout={(e) => {
        const next = e.nativeEvent.layout.width;
        if (size == null && Math.abs(next - measured) > 1) setMeasured(next);
      }}
      style={[styles.cover, box]}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.word,
          {
            fontSize: wordSize,
            color: p.accent,
            bottom: width ? width * 0.08 : 16,
            left: width ? width * 0.1 : 16,
            width: width ? width * 1.3 : '80%',
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
