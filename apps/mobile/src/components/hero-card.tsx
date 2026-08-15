import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CoverArt } from '@/components/cover-art';
import { Caption, PlayControl, Title } from '@/components/ui';
import { radius, spacing } from '@/constants/theme';
import { VARIANT_AUDIO } from '@/data/audio-map';
import { getVoice } from '@/data/catalog';
import type { SessionFamily } from '@/lib/types';

export function HeroCard({ family, kicker }: { family: SessionFamily; kicker: string }) {
  const router = useRouter();
  const voice = getVoice(family.voiceId);
  const hasAudio = family.variants.some((v) => VARIANT_AUDIO[v.id] != null);
  const minutes = Math.min(...family.variants.map((v) => v.durationMin));
  const open = () => router.push({ pathname: '/session/[id]', params: { id: family.id } });

  return (
    <Pressable
      accessibilityRole="button"
      onPress={open}
      style={({ pressed }) => [styles.wrap, pressed && { opacity: 0.88 }]}
    >
      <CoverArt family={family} aspect="portrait" radius={radius.lg} />
      <Caption style={styles.kicker}>{kicker}</Caption>
      <Title style={styles.title}>{family.title}</Title>
      <View style={styles.footer}>
        <PlayControl playing={false} onPress={open} size="md" label={`Play ${family.title}`} />
        <Caption style={styles.meta}>
          {voice?.name} · {minutes} min
          {hasAudio ? ' · preview' : ''}
        </Caption>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: spacing.xl },
  kicker: { marginTop: spacing.md, textTransform: 'lowercase' },
  title: { marginTop: spacing.xs },
  footer: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.md },
  meta: { flex: 1 },
});
