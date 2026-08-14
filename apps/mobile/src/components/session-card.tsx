import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card, HeatBadge } from '@/components/ui';
import { fonts, palette, spacing } from '@/constants/theme';
import { getSeries, getVoice } from '@/data/catalog';
import { useAppState } from '@/lib/store';
import type { SessionFamily } from '@/lib/types';

export function SessionCard({ family, compact }: { family: SessionFamily; compact?: boolean }) {
  const router = useRouter();
  const { heatAllowed } = useAppState();
  const voice = getVoice(family.voiceId);
  const series = getSeries(family.seriesId);
  const [minHeat, maxHeat] = family.heatRange;
  const durations = family.variants.map((v) => v.durationMin);
  const durationLabel =
    Math.min(...durations) === Math.max(...durations)
      ? `${durations[0]} min`
      : `${Math.min(...durations)}–${Math.max(...durations)} min`;

  return (
    <Card onPress={() => router.push({ pathname: '/session/[id]', params: { id: family.id } })} style={compact ? styles.compact : undefined}>
      <View style={styles.topRow}>
        <Text style={styles.dynamic}>{family.dynamic.toUpperCase()}</Text>
        <HeatBadge heat={maxHeat} locked={!heatAllowed(maxHeat)} />
      </View>
      <Text style={styles.title}>{family.title}</Text>
      {series ? (
        <Text style={styles.series}>
          {series.title} · Episode {family.episode}
        </Text>
      ) : null}
      {!compact && <Text style={styles.blurb}>{family.blurb}</Text>}
      <View style={styles.metaRow}>
        <Text style={styles.meta}>
          {voice?.name} · {durationLabel} · {family.variants.length}{' '}
          {family.variants.length === 1 ? 'version' : 'versions'}
        </Text>
        <Text style={styles.rating}>★ {family.rating.toFixed(1)}</Text>
      </View>
      {!compact && family.lovedFor.length > 0 && (
        <Text style={styles.lovedFor}>loved for: {family.lovedFor.join(' · ')}</Text>
      )}
      <Text style={styles.notes}>Notes: {family.contentNotes.join(', ')}</Text>
      {minHeat !== maxHeat ? <Text style={styles.notes}>Also available softer, down to {minHeat === 'comfort' ? 'Comfort' : 'Slow burn'}.</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  compact: { width: 290, marginRight: spacing.md },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  dynamic: { fontFamily: fonts.body, fontSize: 11, letterSpacing: 1.2, color: palette.textFaint, fontWeight: '600' },
  title: { fontFamily: fonts.display, fontSize: 20, lineHeight: 26, color: palette.text },
  series: { fontFamily: fonts.body, fontSize: 13, color: palette.rose, marginTop: 2 },
  blurb: { fontFamily: fonts.body, fontSize: 14, lineHeight: 21, color: palette.textDim, marginTop: spacing.sm },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  meta: { fontFamily: fonts.body, fontSize: 13, color: palette.textDim },
  rating: { fontFamily: fonts.body, fontSize: 13, color: palette.gold, fontWeight: '600' },
  lovedFor: { fontFamily: fonts.body, fontSize: 12, color: palette.rose, marginTop: spacing.xs },
  notes: { fontFamily: fonts.body, fontSize: 12, color: palette.textFaint, marginTop: spacing.xs },
});
