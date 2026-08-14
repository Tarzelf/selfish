import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { fonts, palette, radius, spacing } from '@/constants/theme';
import { VOICE_PREVIEW_AUDIO } from '@/data/audio-map';
import { VOICES } from '@/data/catalog';
import type { Voice } from '@/lib/types';

/**
 * Voice-forward browsing: the roster as characters, not a filter row.
 * Each card carries the voice's personality line and a playable whisper
 * sample — the parasocial hook, front and center.
 */

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
      <View style={styles.topRow}>
        <Text style={[styles.initial, selected && { color: palette.gold }]}>{voice.name.charAt(0)}</Text>
        {source != null && (
          <Pressable
            onPress={toggleSample}
            accessibilityRole="button"
            accessibilityLabel={`Hear ${voice.name}`}
            hitSlop={8}
            style={({ pressed }) => [styles.sampleButton, status.playing && styles.samplePlaying, pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.sampleGlyph}>{status.playing ? '❚❚' : '▶'}</Text>
          </Pressable>
        )}
      </View>
      <Text style={[styles.name, selected && { color: palette.gold }]}>{voice.name}</Text>
      <Text style={styles.pronouns}>
        {voice.gender === 'M' ? 'he/him' : voice.gender === 'F' ? 'she/her' : 'they/them'} · {voice.accent}
      </Text>
      <Text style={styles.descriptor} numberOfLines={3}>
        {voice.descriptor}
      </Text>
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
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rail} contentContainerStyle={{ paddingRight: spacing.md }}>
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
  rail: { marginTop: spacing.sm, marginHorizontal: -spacing.md, paddingHorizontal: spacing.md },
  card: {
    width: 172,
    marginRight: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    backgroundColor: palette.surface,
    padding: spacing.md,
  },
  cardSelected: { borderColor: palette.gold, backgroundColor: palette.goldSoft },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  initial: { fontFamily: fonts.display, fontStyle: 'italic', fontSize: 34, color: palette.textDim, lineHeight: 40 },
  sampleButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: palette.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  samplePlaying: { backgroundColor: palette.goldSoft },
  sampleGlyph: { color: palette.gold, fontSize: 11 },
  name: { fontFamily: fonts.display, fontSize: 19, color: palette.text, marginTop: spacing.xs },
  pronouns: { fontFamily: fonts.body, fontSize: 11.5, color: palette.textFaint, marginTop: 2 },
  descriptor: { fontFamily: fonts.body, fontSize: 12.5, lineHeight: 18, color: palette.textDim, marginTop: spacing.sm },
});
