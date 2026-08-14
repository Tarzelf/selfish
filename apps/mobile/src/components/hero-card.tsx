import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { coverPalette } from '@/components/cover-art';
import { fonts, palette, radius, spacing } from '@/constants/theme';
import { VARIANT_AUDIO } from '@/data/audio-map';
import { getVoice } from '@/data/catalog';
import type { SessionFamily } from '@/lib/types';

/** Full-bleed editorial hero for the Tonight page. */
export function HeroCard({ family, kicker }: { family: SessionFamily; kicker: string }) {
  const router = useRouter();
  const p = coverPalette(family);
  const voice = getVoice(family.voiceId);
  const hasAudio = family.variants.some((v) => VARIANT_AUDIO[v.id] != null);
  const minutes = Math.min(...family.variants.map((v) => v.durationMin));

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/session/[id]', params: { id: family.id } })}
      style={({ pressed }) => [styles.wrap, pressed && { opacity: 0.9 }]}
    >
      <LinearGradient colors={[p.base[0], p.base[1]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        <View style={[styles.orb, { backgroundColor: p.glow }]} />
        <Text style={[styles.kicker, { color: p.accent }]}>{kicker.toUpperCase()}</Text>
        <Text style={styles.title}>{family.title}</Text>
        <Text style={styles.blurb} numberOfLines={2}>
          {family.blurb}
        </Text>
        <View style={styles.footer}>
          <View style={styles.playCircle}>
            <Text style={styles.playGlyph}>▶</Text>
          </View>
          <Text style={[styles.meta, { color: p.accent }]}>
            {voice?.name} · {minutes} min · {family.dynamic}
            {hasAudio ? '  ·  real preview' : ''}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: spacing.md },
  card: {
    borderRadius: radius.lg + 6,
    padding: spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    minHeight: 210,
    justifyContent: 'flex-end',
  },
  orb: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 340,
    top: -170,
    right: -110,
  },
  kicker: {
    fontFamily: fonts.body,
    fontSize: 11,
    letterSpacing: 2.2,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 40,
    color: palette.text,
  },
  blurb: {
    fontFamily: fonts.body,
    fontSize: 14.5,
    lineHeight: 21,
    color: 'rgba(243,237,247,0.78)',
    marginTop: spacing.sm,
    maxWidth: 520,
  },
  footer: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.md },
  playCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playGlyph: { color: palette.text, fontSize: 15, marginLeft: 2 },
  meta: { fontFamily: fonts.body, fontSize: 13, fontWeight: '600', flex: 1 },
});
