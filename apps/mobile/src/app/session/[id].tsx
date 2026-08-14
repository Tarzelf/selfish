import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Body, Button, Caption, Card, Chip, Display, HeatBadge, Heading, Screen } from '@/components/ui';
import { fonts, palette, radius, spacing } from '@/constants/theme';
import { getFamily, getSeries, getVoice } from '@/data/catalog';
import { formatClock, useMockPlayback } from '@/lib/mock-player';
import { useAppState } from '@/lib/store';

export default function SessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { prefs, heatAllowed, recordProgress } = useAppState();

  const family = getFamily(id);
  const voice = family ? getVoice(family.voiceId) : undefined;
  const series = family ? getSeries(family.seriesId) : undefined;

  const allowedVariants = useMemo(
    () => family?.variants.filter((v) => heatAllowed(v.heat)) ?? [],
    [family, heatAllowed],
  );
  const [variantId, setVariantId] = useState<string | null>(null);
  const variant = allowedVariants.find((v) => v.id === variantId) ?? allowedVariants[0];

  const [acknowledged, setAcknowledged] = useState(false);

  const onProgress = useCallback(
    (p: number) => {
      if (family && variant) recordProgress(family.id, variant.id, p);
    },
    [family, variant, recordProgress],
  );

  const playback = useMockPlayback(variant?.durationMin ?? 0, onProgress);

  if (!family || !variant || !voice) {
    return (
      <Screen scroll={false}>
        <Display>Not found</Display>
        <Button label="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  const lockedVariants = family.variants.filter((v) => !heatAllowed(v.heat));

  // Content notes gate: never surprise a listener. One acknowledgment per open.
  if (!acknowledged) {
    return (
      <Screen scroll={false}>
        <View style={styles.gateBody}>
          <Caption style={styles.gateKicker}>{family.dynamic.toUpperCase()}</Caption>
          <Display>{family.title}</Display>
          {series ? (
            <Body dim>
              {series.title} · Episode {family.episode}
            </Body>
          ) : null}
          <Body dim style={styles.gateBlurb}>
            {family.blurb}
          </Body>
          <Card>
            <Body>Before you press play</Body>
            <Caption style={{ marginTop: spacing.xs }}>
              This session includes: {family.contentNotes.join(', ')}.
            </Caption>
            <Caption style={{ marginTop: spacing.xs }}>
              Performed by {voice.name} — a studio-crafted synthetic voice. {voice.narratorCredit}
            </Caption>
            <Caption style={{ marginTop: spacing.xs }}>
              Headphones recommended: this session is mixed binaurally and loses its closeness on
              speakers.
            </Caption>
          </Card>
          <Button label="I'm in" onPress={() => setAcknowledged(true)} />
          <Text style={styles.leave} onPress={() => router.back()}>
            Not tonight
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.headerRow}>
        <Text style={styles.close} onPress={() => router.back()}>
          Close
        </Text>
        <HeatBadge heat={variant.heat} />
      </View>

      <Caption style={styles.gateKicker}>{family.dynamic.toUpperCase()}</Caption>
      <Display>{family.title}</Display>
      <Body dim>
        {voice.name} · {variant.durationMin} min · {variant.pace === 'slow' ? 'slow pace' : 'measured pace'}
        {variant.extendedBuildup ? ' · extended buildup' : ''}
      </Body>

      <View style={styles.player}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${playback.progress * 100}%` }]} />
        </View>
        <View style={styles.clockRow}>
          <Caption>{formatClock(playback.elapsedSec)}</Caption>
          <Caption>{variant.durationMin}:00</Caption>
        </View>
        <View style={styles.controls}>
          <Pressable onPress={() => playback.seekBy(-30)} style={styles.skipButton} accessibilityRole="button" accessibilityLabel="Back 30 seconds">
            <Text style={styles.skipLabel}>−30</Text>
          </Pressable>
          <Pressable onPress={playback.toggle} style={styles.playButton} accessibilityRole="button" accessibilityLabel={playback.playing ? 'Pause' : 'Play'}>
            <Text style={styles.playGlyph}>{playback.playing ? '❚❚' : '▶'}</Text>
          </Pressable>
          <Pressable onPress={() => playback.seekBy(30)} style={styles.skipButton} accessibilityRole="button" accessibilityLabel="Forward 30 seconds">
            <Text style={styles.skipLabel}>+30</Text>
          </Pressable>
        </View>
        <Caption style={styles.previewNote}>
          Preview build: playback is simulated. Production streams pre-rendered, watermarked audio.
        </Caption>
      </View>

      <Heading>More like this, but…</Heading>
      <Caption>Same story, different temperature. Switching keeps your place.</Caption>
      <View style={styles.chipWrap}>
        {allowedVariants.map((v) => (
          <Chip
            key={v.id}
            label={`${v.label} · ${v.durationMin} min`}
            selected={v.id === variant.id}
            onPress={() => {
              setVariantId(v.id);
              playback.seekTo(playback.progress);
            }}
          />
        ))}
      </View>
      {lockedVariants.length > 0 && (
        <Caption style={{ marginTop: spacing.xs }}>
          {lockedVariants.length} {lockedVariants.length === 1 ? 'version goes' : 'versions go'} further
          than your current heat cap. Raise it in You → Heat cap if you&apos;re curious.
        </Caption>
      )}

      {prefs.displayName ? (
        <>
          <Heading>Hear your name?</Heading>
          <Caption>
            Some sessions have a version that greets you as {prefs.displayName}. Off by default;
            names come from a fixed studio-recorded list, never generated on the fly. Coming to the
            preview soon.
          </Caption>
        </>
      ) : null}

      <Heading>About this voice</Heading>
      <Card>
        <Body>{voice.name}</Body>
        <Caption style={{ marginTop: spacing.xs }}>{voice.descriptor}</Caption>
        <Caption style={{ marginTop: spacing.xs }}>
          Studio-crafted synthetic voice. {voice.narratorCredit}
        </Caption>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
  close: { fontFamily: fonts.body, color: palette.textDim, fontSize: 15, padding: spacing.xs },
  gateBody: { flex: 1, justifyContent: 'center' },
  gateKicker: { letterSpacing: 1.2, marginTop: spacing.lg },
  gateBlurb: { marginTop: spacing.sm, marginBottom: spacing.lg },
  leave: { fontFamily: fonts.body, color: palette.textFaint, textAlign: 'center', marginTop: spacing.md, fontSize: 15, padding: spacing.sm },
  player: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  progressTrack: { height: 4, backgroundColor: palette.border, borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: palette.gold, borderRadius: 2 },
  clockRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xl, marginTop: spacing.md },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: palette.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playGlyph: { fontSize: 24, color: palette.onAccent },
  skipButton: { padding: spacing.sm },
  skipLabel: { fontFamily: fonts.body, color: palette.textDim, fontSize: 15, fontWeight: '600' },
  previewNote: { textAlign: 'center', marginTop: spacing.md },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm },
});
