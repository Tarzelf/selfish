import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CoverArt } from '@/components/cover-art';
import { Body, Caption, PlayControl, Title } from '@/components/ui';
import { radius, spacing } from '@/constants/theme';
import { VARIANT_AUDIO } from '@/data/audio-map';
import { getVoice } from '@/data/catalog';
import type { SessionFamily } from '@/lib/types';

export function HeroCard({ family, kicker }: { family: SessionFamily; kicker: string }) {
  const router = useRouter();
  const voice = getVoice(family.voiceId);
  const hasAudio = family.variants.some((v) => VARIANT_AUDIO[v.id] != null);
  const minutes = Math.min(...family.variants.map((v) => v.durationMin));

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/session/[id]', params: { id: family.id } })}
      style={({ pressed }) => [styles.wrap, pressed && { opacity: 0.88 }]}
    >
      <CoverArt family={family} size={96} radius={radius.md} />
      <View style={styles.copy}>
        <Caption>{kicker}</Caption>
        <Title style={styles.title}>{family.title}</Title>
        <Body dim numberOfLines={2} style={styles.blurb}>
          {family.blurb}
        </Body>
        <View style={styles.footer}>
          <PlayControl
            playing={false}
            onPress={() => router.push({ pathname: '/session/[id]', params: { id: family.id } })}
            size="sm"
            label={`Play ${family.title}`}
          />
          <Caption style={styles.meta}>
            {voice?.name} · {minutes} min
            {hasAudio ? ' · preview' : ''}
          </Caption>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: spacing.lg, flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  copy: { flex: 1, minWidth: 0 },
  title: { marginTop: spacing.xs },
  blurb: { marginTop: spacing.sm },
  footer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md },
  meta: { flex: 1 },
});
