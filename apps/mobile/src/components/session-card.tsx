import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CoverArt } from '@/components/cover-art';
import { Body, Caption, Card, HeatBadge, Title } from '@/components/ui';
import { spacing, type } from '@/constants/theme';
import { VARIANT_AUDIO } from '@/data/audio-map';
import { getSeries, getVoice } from '@/data/catalog';
import { isFreeFamily } from '@/lib/catalog-access';
import { useAppState } from '@/lib/store';
import type { SessionFamily } from '@/lib/types';

export function SessionCard({ family, compact }: { family: SessionFamily; compact?: boolean }) {
  const router = useRouter();
  const { heatAllowed, canPlayFamily } = useAppState();
  const playable = canPlayFamily(family);
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
        <CoverArt family={family} size={compact ? 52 : 68} />
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Caption style={styles.dynamic} numberOfLines={1}>
              {family.dynamic}
              {series ? ` · ${series.title}` : ''}
            </Caption>
            <HeatBadge heat={maxHeat} locked={!heatAllowed(maxHeat)} />
          </View>
          <Title style={styles.title} numberOfLines={compact ? 1 : 2}>
            {family.title}
          </Title>
          <Caption numberOfLines={1}>
            {voice?.name} · {durationLabel}
            {hasAudio ? ' · preview' : ''}
            {isFreeFamily(family) ? ' · free' : playable ? '' : ' · the rest of the catalog'}
          </Caption>
        </View>
      </View>
      {!compact && (
        <>
          <Body dim style={styles.blurb}>
            {family.blurb}
          </Body>
          <Caption style={styles.notes} numberOfLines={1}>
            {family.contentNotes.join(' · ')}
            {minHeat !== maxHeat ? ' · softer versions' : ''}
          </Caption>
          {family.lovedFor.length > 0 && (
            <Caption style={styles.loved}>loved for: {family.lovedFor.join(' · ')}</Caption>
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
    marginBottom: 2,
  },
  dynamic: { flex: 1, textTransform: 'lowercase' },
  title: { ...type.cardTitle, marginBottom: 2 },
  blurb: { marginTop: spacing.sm },
  notes: { marginTop: spacing.sm },
  loved: { marginTop: spacing.xs },
});
