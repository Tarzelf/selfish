import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CoverArt } from '@/components/cover-art';
import { Card, HeatBadge } from '@/components/ui';
import { fonts, spacing } from '@/constants/theme';
import { VARIANT_AUDIO } from '@/data/audio-map';
import { getSeries, getVoice } from '@/data/catalog';
import { useAtmosphere } from '@/lib/atmosphere';
import { useAppState } from '@/lib/store';
import type { SessionFamily } from '@/lib/types';

export function SessionCard({ family, compact }: { family: SessionFamily; compact?: boolean }) {
  const router = useRouter();
  const { palette } = useAtmosphere();
  const { heatAllowed } = useAppState();
  const voice = getVoice(family.voiceId);
  const series = getSeries(family.seriesId);
  const [minHeat, maxHeat] = family.heatRange;
  const durations = family.variants.map((v) => v.durationMin);
  const durationLabel =
    Math.min(...durations) === Math.max(...durations)
      ? `${durations[0]} min`
      : `${Math.min(...durations)}–${Math.max(...durations)} min`;
  const hasAudio = family.variants.some((v) => VARIANT_AUDIO[v.id] != null);

  return (
    <Card
      onPress={() => router.push({ pathname: '/session/[id]', params: { id: family.id } })}
      style={compact ? styles.compact : undefined}
    >
      <View style={styles.row}>
        <CoverArt family={family} size={compact ? 56 : 76} />
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={[styles.dynamic, { color: palette.textFaint }]} numberOfLines={1}>
              {family.format === 'close' ? 'LOOP' : family.dynamic.toUpperCase()}
              {family.format !== 'close' && series ? `  ·  ${series.title.toUpperCase()} E${family.episode}` : ''}
            </Text>
            <HeatBadge heat={maxHeat} locked={!heatAllowed(maxHeat)} />
          </View>
          <Text style={[styles.title, { color: palette.text }]} numberOfLines={compact ? 1 : 2}>
            {family.title}
          </Text>
          <Text style={[styles.meta, { color: palette.textDim }]} numberOfLines={1}>
            {voice?.name} · {durationLabel} ·{' '}
            {family.format === 'close'
              ? `${family.variants.length} recycles`
              : `${family.variants.length} ${family.variants.length === 1 ? 'version' : 'versions'}`}
            {hasAudio ? '  ·  ▶ preview' : ''}
          </Text>
        </View>
      </View>
      {!compact && (
        <>
          <Text style={[styles.blurb, { color: palette.textDim }]}>{family.blurb}</Text>
          <View style={styles.footRow}>
            <Text style={[styles.notes, { color: palette.textFaint }]} numberOfLines={1}>
              {family.contentNotes.join(' · ')}
              {minHeat !== maxHeat ? '  ·  softer versions available' : ''}
            </Text>
            <Text style={[styles.rating, { color: palette.gold }]}>★ {family.rating.toFixed(1)}</Text>
          </View>
          {family.lovedFor.length > 0 && (
            <Text style={[styles.lovedFor, { color: palette.rose }]}>loved for: {family.lovedFor.join(' · ')}</Text>
          )}
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  compact: { width: 300, marginRight: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  content: { flex: 1, minWidth: 0 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 4,
  },
  dynamic: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 11,
    letterSpacing: 1.1,
    fontWeight: '600',
  },
  title: { fontFamily: fonts.display, fontSize: 20, lineHeight: 25, letterSpacing: -0.35 },
  meta: { fontFamily: fonts.body, fontSize: 13, marginTop: 3, letterSpacing: -0.1 },
  blurb: { fontFamily: fonts.body, fontSize: 14, lineHeight: 21, marginTop: spacing.sm, letterSpacing: -0.1 },
  footRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  notes: { flex: 1, fontFamily: fonts.body, fontSize: 12 },
  rating: { fontFamily: fonts.body, fontSize: 13, fontWeight: '600' },
  lovedFor: { fontFamily: fonts.body, fontSize: 12, marginTop: spacing.xs },
});
