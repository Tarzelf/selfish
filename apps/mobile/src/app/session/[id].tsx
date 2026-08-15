import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CoverArt } from '@/components/cover-art';
import { Body, Button, Caption, Card, Chip, Display, HeatBadge, Heading, Screen } from '@/components/ui';
import { fonts, palette, radius, spacing } from '@/constants/theme';
import { VARIANT_AUDIO } from '@/data/audio-map';
import { getFamily, getSeries, getVoice } from '@/data/catalog';
import { recycleVariant } from '@/data/close-catalog';
import { formatClock, usePlayback } from '@/lib/player';
import { useAppState } from '@/lib/store';
import type { RecycleKey, SessionVariant } from '@/lib/types';

function PlayerCore({
  variant,
  source,
  initialFraction,
  onProgress,
  autoPlay,
  isClose,
}: {
  variant: SessionVariant;
  source: number | null;
  initialFraction: number;
  onProgress: (p: number) => void;
  autoPlay?: boolean;
  isClose?: boolean;
}) {
  const playback = usePlayback(variant.durationMin, source, onProgress);
  const seeded = useRef(false);
  const autoPlayed = useRef(false);
  if (!seeded.current && !playback.isReal && initialFraction > 0) {
    seeded.current = true;
    playback.seekTo(initialFraction);
  }

  useEffect(() => {
    if (!autoPlay || autoPlayed.current) return;
    autoPlayed.current = true;
    const t = setTimeout(() => playback.restart(), 180);
    return () => clearTimeout(t);
    // Restart once on mount when arriving from the ritual play button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  const finished = playback.progress >= 0.97 && !playback.playing;

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
        <Pressable onPress={() => playback.seekBy(-15)} style={styles.skipButton} accessibilityRole="button" accessibilityLabel="Back 15 seconds">
          <Text style={styles.skipLabel}>−15</Text>
        </Pressable>
        <Pressable
          onPress={finished ? playback.restart : playback.toggle}
          style={styles.playButton}
          accessibilityRole="button"
          accessibilityLabel={finished ? 'Again' : playback.playing ? 'Pause' : 'Play'}
        >
          <Text style={styles.playGlyph}>{finished ? '↺' : playback.playing ? '❚❚' : '▶'}</Text>
        </Pressable>
        <Pressable onPress={() => playback.seekBy(15)} style={styles.skipButton} accessibilityRole="button" accessibilityLabel="Forward 15 seconds">
          <Text style={styles.skipLabel}>+15</Text>
        </Pressable>
      </View>
      {finished && isClose ? (
        <Text style={styles.againHint} onPress={playback.restart}>
          Again. Same mouth. Same room.
        </Text>
      ) : null}
      <Caption style={styles.previewNote}>
        {playback.isReal
          ? '▶ Engine preview — a real excerpt rendered by the Selfish pipeline. Full sessions stream in production.'
          : 'Preview build: playback is simulated for this session. Production streams pre-rendered, watermarked audio.'}
      </Caption>
    </View>
  );
}

export default function SessionScreen() {
  const { id, variant: variantParam, play } = useLocalSearchParams<{ id: string; variant?: string; play?: string }>();
  const router = useRouter();
  const { prefs, heatAllowed, recordProgress, setPrefs } = useAppState();

  const family = getFamily(id);
  const voice = family ? getVoice(family.voiceId) : undefined;
  const series = family ? getSeries(family.seriesId) : undefined;
  const isClose = family?.format === 'close';

  const allowedVariants = useMemo(
    () => family?.variants.filter((v) => heatAllowed(v.heat)) ?? [],
    [family, heatAllowed],
  );
  const [variantId, setVariantId] = useState<string | null>(variantParam ?? null);
  const [againNonce, setAgainNonce] = useState(0);
  const variant = allowedVariants.find((v) => v.id === variantId) ?? allowedVariants[0];

  const [acknowledged, setAcknowledged] = useState(() => Boolean(isClose && prefs.closeNotesAcked));
  const fractionRef = useRef(0);
  const wantAutoPlay = play === '1';

  useEffect(() => {
    if (isClose && prefs.closeNotesAcked) setAcknowledged(true);
  }, [isClose, prefs.closeNotesAcked]);

  useEffect(() => {
    if (variantParam) setVariantId(variantParam);
  }, [variantParam]);

  const onProgress = useCallback(
    (p: number) => {
      fractionRef.current = p;
      if (family && variant) recordProgress(family.id, variant.id, p);
    },
    [family, variant, recordProgress],
  );

  const ack = () => {
    if (isClose && !prefs.closeNotesAcked) setPrefs({ closeNotesAcked: true });
    setAcknowledged(true);
  };

  const pickRecycle = (key: RecycleKey) => {
    if (!family) return;
    if (key === 'again') {
      setAgainNonce((n) => n + 1);
      return;
    }
    const next = recycleVariant(family, key);
    if (next && heatAllowed(next.heat)) setVariantId(next.id);
  };

  if (!family || !variant || !voice) {
    return (
      <Screen scroll={false}>
        <Display>Not found</Display>
        <Button label="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  const lockedVariants = family.variants.filter((v) => !heatAllowed(v.heat));

  if (!acknowledged) {
    return (
      <Screen scroll={false}>
        <View style={styles.gateBody}>
          <View style={styles.gateCover}>
            <CoverArt family={family} size={120} radius={20} />
          </View>
          <Caption style={styles.gateKicker}>{(isClose ? 'Close loop' : family.dynamic).toUpperCase()}</Caption>
          <Display>{family.title}</Display>
          {series ? (
            <Body dim>
              {series.title} · Episode {family.episode}
            </Body>
          ) : null}
          <Body dim style={styles.gateBlurb}>
            {isClose ? 'Headphones. This is Close — in your ear, written to be replayed.' : family.blurb}
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
          <Button label="I'm in" onPress={ack} />
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
        <CoverArt family={family} size={isClose ? 120 : 168} radius={24} />
        <Caption style={styles.gateKicker}>{(isClose ? 'Close loop' : family.dynamic).toUpperCase()}</Caption>
        <Display style={styles.heroTitle}>{family.title}</Display>
        <Body dim style={styles.heroMeta}>
          {voice.name} · {variant.durationMin} min
          {isClose ? ` · ${variant.label}` : ` · ${variant.pace === 'slow' ? 'slow pace' : 'measured pace'}`}
          {variant.extendedBuildup ? ' · extended buildup' : ''}
        </Body>
      </View>

      <PlayerCore
        key={`${variant.id}-${againNonce}`}
        variant={variant}
        source={VARIANT_AUDIO[variant.id] ?? null}
        initialFraction={againNonce > 0 ? 0 : fractionRef.current}
        onProgress={onProgress}
        autoPlay={wantAutoPlay || againNonce > 0}
        isClose={isClose}
      />

      {isClose ? (
        <>
          <Heading>Recycle</Heading>
          <Caption>Same mouth. Four buttons. This is the product.</Caption>
          <View style={styles.chipWrap}>
            {(['again', 'slower', 'closer', 'after'] as RecycleKey[]).map((key) => {
              const target = key === 'again' ? variant : recycleVariant(family, key);
              const selected = key !== 'again' && target?.id === variant.id;
              const locked = target ? !heatAllowed(target.heat) : true;
              return (
                <Chip
                  key={key}
                  label={key === 'again' ? 'Again' : key === 'slower' ? 'Slower' : key === 'closer' ? 'Closer' : 'After'}
                  selected={selected}
                  onPress={() => !locked && pickRecycle(key)}
                />
              );
            })}
          </View>
        </>
      ) : (
        <>
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
        </>
      )}

      {prefs.displayName && !isClose ? (
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
  againHint: {
    fontFamily: fonts.display,
    fontStyle: 'italic',
    fontSize: 16,
    color: palette.gold,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  previewNote: { textAlign: 'center', marginTop: spacing.md },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm },
});
