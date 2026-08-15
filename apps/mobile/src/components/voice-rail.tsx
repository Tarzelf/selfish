import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Caption, HitLabel, Title } from '@/components/ui';
import { palette, radius, spacing, type } from '@/constants/theme';
import { VOICE_PREVIEW_AUDIO } from '@/data/audio-map';
import { VOICES } from '@/data/catalog';
import type { Voice } from '@/lib/types';

function VoiceCard({
  voice,
  selected,
  onSelect,
}: {
  voice: Voice;
  selected: boolean;
  onSelect: () => void;
}) {
  const source = VOICE_PREVIEW_AUDIO[voice.id] ?? null;
  const player = useAudioPlayer(source);
  const status = useAudioPlayerStatus(player);

  const toggleSample = () => {
    if (status.playing) {
      player.pause();
      return;
    }
    if (status.duration > 0 && status.currentTime >= status.duration - 0.05) player.seekTo(0);
    player.play();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onSelect}
      style={({ pressed }) => [styles.card, selected && styles.cardSelected, pressed && { opacity: 0.85 }]}
    >
      <Title style={styles.initial}>{voice.name.charAt(0)}</Title>
      <Caption style={selected ? styles.nameOn : undefined}>{voice.name}</Caption>
      <Caption>
        {voice.gender === 'M' ? 'he/him' : voice.gender === 'F' ? 'she/her' : 'they/them'}
      </Caption>
      {source != null && (
        <View style={styles.hear}>
          <HitLabel
            label={status.playing ? 'pause' : 'hear'}
            onPress={toggleSample}
            accessibilityLabel={status.playing ? `Pause ${voice.name}` : `Hear ${voice.name}`}
          />
        </View>
      )}
    </Pressable>
  );
}

export function VoiceRail({
  selectedVoiceId,
  onSelect,
}: {
  selectedVoiceId: string | null;
  onSelect: (voiceId: string | null) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.rail}
      contentContainerStyle={{ paddingRight: spacing.lg }}
    >
      {VOICES.map((v) => (
        <VoiceCard
          key={v.id}
          voice={v}
          selected={selectedVoiceId === v.id}
          onSelect={() => onSelect(selectedVoiceId === v.id ? null : v.id)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  rail: { marginTop: spacing.sm, marginHorizontal: -spacing.lg, paddingHorizontal: spacing.lg },
  card: {
    width: 140,
    marginRight: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: palette.inkLift,
    padding: spacing.md,
  },
  cardSelected: { backgroundColor: palette.inkHigh },
  initial: { ...type.title, color: palette.boneDim, marginBottom: spacing.sm },
  nameOn: { color: palette.bone },
  hear: { marginTop: spacing.sm },
});
