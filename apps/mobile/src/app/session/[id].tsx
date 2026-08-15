import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CoverArt } from '@/components/cover-art';
import { Body, Button, Caption, Card, Chip, Display, HeatBadge, Heading, Screen } from '@/components/ui';
import { fonts, palette, radius, spacing } from '@/constants/theme';
import { VARIANT_AUDIO } from '@/data/audio-map';
import { getFamily, getSeries, getVoice } from '@/data/catalog';
import { allowedVariants as variantsForCap, isFreeFamily, lockedVariants as lockedForCap } from '@/lib/catalog-access';
import { formatClock, usePlayback } from '@/lib/player';
import { useAppState } from '@/lib/store';
import type { SessionVariant } from '@/lib/types';

function PlayerCore({
  variant,
  source,
  initialFraction,
  onProgress,
}: {
  variant: SessionVariant;
  source: number | null;
  initialFraction: number;
  onProgress: (p: number) => void;
}) {
  const playback = usePlayback(variant.durationMin, source, onProgress);
  const seeded = useRef(false);
  if (!seeded.current && !playback.isReal && initialFraction > 0) {
    seeded.current = true;
    playback.seekTo(initialFraction);
  }

  return (
    <View style={styles.player}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${playback.progress * 100}%` }]} />
      </View>
      <View style={styles.clockRow}>
        <Caption>{formatClock(playback.elapsedSec)}</Caption>
        <Caption>{playback.isReal ? formatClock(playback.durationSec) : `${variant.durationMin}:00`}</Caption>
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
        {playback.isReal
          ? '▶ Engine preview — a real excerpt rendered by the Selfish pipeline. Full sessions stream in production.'
          : 'Preview build: playback is simulated for this session. Production streams pre-rendered, watermarked audio.'}
      </Caption>
    </View>
  );
}

export default function SessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { prefs, familyVisible, canPlayFamily, startPreview, recordProgress } = useAppState();

  const family = getFamily(id);
  const voice = family ? getVoice(family.voiceId) : undefined;
  const series = family ? getSeries(family.seriesId) : undefined;
  const blocked = family ? !familyVisible(family) : false;
  const locked = family ? !canPlayFamily(family) : false;

  const allowedVariants = useMemo(
    () => (family ? variantsForCap(family, prefs.heatCap) : []),
    [family, prefs.heatCap],
  );
  const [variantId, setVariantId] = useState<string | null>(null);
  const variant = allowedVariants.find((v) => v.id === variantId) ?? allowedVariants[0];

  const [acknowledged, setAcknowledged] = useState(false);
  const fractionRef = useRef(0);

  const onProgress = useCallback(
    (p: number) => {
      fractionRef.current = p;
      if (family && variant) recordProgress(family.id, variant.id, p);
    },
    [family, variant, recordProgress],
  );

  if (!family || blocked || !voice) {
    return (
      <Screen scroll={false}>
        <Display>{blocked ? 'Outside your limits' : 'Not found'}</Display>
        <Body dim style={{ marginTop: spacing.sm }}>
          {blocked
            ? 'This session is filtered by a hard limit or heat cap you set. Nothing here will play.'
            : 'That session is not in the catalog.'}
        </Body>
        <Button label="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  if (!variant) {
    return (
      <Screen scroll={false}>
        <Display>Outside your heat cap</Display>
        <Button label="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  const lockedVariants = lockedForCap(family, prefs.heatCap);

  // Content notes gate: never surprise a listener. One acknowledgment per open.
  if (!acknowledged) {
    return (
      <Screen scroll={false}>
        <View style={styles.gateBody}>
          <View style={styles.gateCover}>
            <CoverArt family={family} size={120} radius={20} />
          </View>
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
              🎧 Headphones recommended: this session is mixed binaurally and loses its closeness on
              speakers.
            </Caption>
          </Card>
          {locked ? (
            <>
              <Caption style={{ marginTop: spacing.md }}>
                {isFreeFamily(family)
                  ? 'This session is in your free tier.'
                  : 'This session is part of Selfish+. Start the 14-day preview to listen — no card in this build.'}
              </Caption>
              <Button
                label="Start 14-day preview"
                onPress={() => {
                  startPreview();
                  setAcknowledged(true);
                }}
              />
            </>
          ) : (
            <Button label="I'm in" onPress={() => setAcknowledged(true)} />
          )}
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

      <View style={styles.hero}>
        <CoverArt family={family} size={168} radius={24} />
        <Caption style={styles.gateKicker}>{family.dynamic.toUpperCase()}</Caption>
        <Display style={styles.heroTitle}>{family.title}</Display>
        <Body dim style={styles.heroMeta}>
          {voice.name} · {variant.durationMin} min · {variant.pace === 'slow' ? 'slow pace' : 'measured pace'}
          {variant.extendedBuildup ? ' · extended buildup' : ''}
        </Body>
      </View>

      <PlayerCore
        key={variant.id}
        variant={variant}
        source={VARIANT_AUDIO[variant.id] ?? null}
        initialFraction={fractionRef.current}
        onProgress={onProgress}
      />

      <Heading>More like this, but…</Heading>
      <Caption>Same story, different temperature.</Caption>
      <View style={styles.chipWrap}>
        {allowedVariants.map((v) => (
          <Chip
            key={v.id}
            label={`${v.label} · ${v.durationMin} min${VARIANT_AUDIO[v.id] ? ' · ▶' : ''}`}
            selected={v.id === variant.id}
            onPress={() => setVariantId(v.id)}
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
  gateCover: { alignItems: 'flex-start', marginBottom: spacing.sm },
  gateKicker: { letterSpacing: 1.2, marginTop: spacing.lg },
  gateBlurb: { marginTop: spacing.sm, marginBottom: spacing.lg },
  leave: { fontFamily: fonts.body, color: palette.textFaint, textAlign: 'center', marginTop: spacing.md, fontSize: 15, padding: spacing.sm },
  hero: { alignItems: 'center', marginTop: spacing.md },
  heroTitle: { textAlign: 'center', marginTop: spacing.xs },
  heroMeta: { textAlign: 'center' },
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
