import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CoverArt } from '@/components/cover-art';
import { Caption, Card, Title } from '@/components/ui';
import { spacing, type } from '@/constants/theme';
import { VARIANT_AUDIO } from '@/data/audio-map';
import { getVoice } from '@/data/catalog';
import { isFreeFamily } from '@/lib/catalog-access';
import { useAppState } from '@/lib/store';
import { HEAT_LABEL, type SessionFamily } from '@/lib/types';

export function SessionCard({ family, compact }: { family: SessionFamily; compact?: boolean }) {
  const router = useRouter();
  const { canPlayFamily } = useAppState();
  const playable = canPlayFamily(family);
  const voice = getVoice(family.voiceId);
  const durations = family.variants.map((v) => v.durationMin);
  const durationLabel =
    Math.min(...durations) === Math.max(...durations)
      ? `${durations[0]} min`
      : `${Math.min(...durations)}–${Math.max(...durations)} min`;
  const hasAudio = family.variants.some((v) => VARIANT_AUDIO[v.id] != null);
  const [, maxHeat] = family.heatRange;

  return (
    <Card
      flush
      onPress={() => router.push({ pathname: '/session/[id]', params: { id: family.id } })}
      style={compact ? styles.compact : undefined}
    >
      <CoverArt family={family} aspect={compact ? 'portrait' : 'wide'} radius={0} />
      <View style={styles.copy}>
        <Title style={styles.title} numberOfLines={2}>
          {family.title}
        </Title>
        <Caption numberOfLines={2}>
          {voice?.name} · {durationLabel} · {HEAT_LABEL[maxHeat].toLowerCase()}
          {hasAudio ? ' · preview' : ''}
          {isFreeFamily(family) ? ' · free' : playable ? '' : ' · the rest of the catalog'}
        </Caption>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  compact: { width: 168, marginBottom: 0 },
  copy: { padding: spacing.md },
  title: { ...type.cardTitle, marginBottom: spacing.xs },
});
