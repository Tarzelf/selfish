import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CoverArt } from '@/components/cover-art';
import { MembershipCtas } from '@/components/membership-ctas';
import {
  Body,
  Button,
  Caption,
  Card,
  Choice,
  ChoiceStack,
  Display,
  HeatBadge,
  Heading,
  HitLabel,
  PlayControl,
  Progress,
  Screen,
  StepScreen,
  TextLink,
} from '@/components/ui';
import { spacing } from '@/constants/theme';
import { VARIANT_AUDIO } from '@/data/audio-map';
import { getFamily, getSeries, getVoice } from '@/data/catalog';
import { allowedVariants as variantsForCap, lockedVariants as lockedForCap } from '@/lib/catalog-access';
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
      <Progress value={playback.progress} />
      <View style={styles.clockRow}>
        <Caption>{formatClock(playback.elapsedSec)}</Caption>
        <Caption>{playback.isReal ? formatClock(playback.durationSec) : `${variant.durationMin}:00`}</Caption>
      </View>
      <View style={styles.controls}>
        <HitLabel label="−30" onPress={() => playback.seekBy(-30)} accessibilityLabel="Back 30 seconds" />
        <PlayControl
          playing={playback.playing}
          onPress={playback.toggle}
          size="lg"
          label={playback.playing ? 'Pause' : 'Play'}
        />
        <HitLabel label="+30" onPress={() => playback.seekBy(30)} accessibilityLabel="Forward 30 seconds" />
      </View>
      <Caption style={styles.previewNote}>
        {playback.isReal
          ? 'Engine preview — a real excerpt from the pipeline.'
          : 'Preview build: playback is simulated for this session.'}
      </Caption>
    </View>
  );
}

export default function SessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { prefs, familyVisible, canPlayFamily, recordProgress } = useAppState();

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
      <StepScreen dock={<Button label="Back" onPress={() => router.back()} />}>
        <Display>{blocked ? 'Outside your limits' : 'Not found'}</Display>
        <Body dim style={styles.lede}>
          {blocked
            ? 'This session is filtered by a hard limit or heat cap you set.'
            : 'That session is not in the catalog.'}
        </Body>
      </StepScreen>
    );
  }

  if (!variant) {
    return (
      <StepScreen dock={<Button label="Back" onPress={() => router.back()} />}>
        <Display>Outside your heat cap</Display>
      </StepScreen>
    );
  }

  const lockedVariants = lockedForCap(family, prefs.heatCap);

  if (!acknowledged) {
    return (
      <StepScreen
        chrome={
          <View style={styles.chrome}>
            <TextLink label="Close" onPress={() => router.back()} />
          </View>
        }
        dock={
          locked ? (
            <MembershipCtas />
          ) : (
            <>
              <Button label="I'm in" onPress={() => setAcknowledged(true)} />
              <View style={styles.leave}>
                <TextLink label="Not tonight" onPress={() => router.back()} />
              </View>
            </>
          )
        }
      >
        <CoverArt family={family} aspect="portrait" />
        <Caption style={styles.dynamic}>{family.dynamic}</Caption>
        <Display>{family.title}</Display>
        {series ? (
          <Caption>
            {series.title} · Episode {family.episode}
          </Caption>
        ) : null}
        <Body dim style={styles.gateBlurb}>
          {family.blurb}
        </Body>
        <Caption style={styles.note}>This session includes: {family.contentNotes.join(', ')}.</Caption>
        <Caption style={styles.note}>
          {voice.name} — a studio-crafted synthetic voice. {voice.narratorCredit}
        </Caption>
        <Caption style={styles.note}>Headphones. This is mixed binaurally.</Caption>
      </StepScreen>
    );
  }

  return (
    <Screen>
      <View style={styles.headerRow}>
        <TextLink label="Close" onPress={() => router.back()} />
        <HeatBadge heat={variant.heat} />
      </View>

      <View style={styles.hero}>
        <CoverArt family={family} aspect="portrait" />
        <Caption style={styles.dynamic}>{family.dynamic}</Caption>
        <Display>{family.title}</Display>
        <Caption>
          {voice.name} · {variant.durationMin} min · {variant.pace === 'slow' ? 'slow' : 'measured'}
          {variant.extendedBuildup ? ' · extended buildup' : ''}
        </Caption>
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
      <ChoiceStack>
        {allowedVariants.map((v) => (
          <Choice
            key={v.id}
            label={v.label}
            hint={`${v.durationMin} min${VARIANT_AUDIO[v.id] ? ' · preview' : ''}`}
            selected={v.id === variant.id}
            onPress={() => setVariantId(v.id)}
          />
        ))}
      </ChoiceStack>
      {lockedVariants.length > 0 && (
        <Caption style={styles.note}>
          {lockedVariants.length} {lockedVariants.length === 1 ? 'version goes' : 'versions go'} further
          than your heat cap.
        </Caption>
      )}

      {prefs.displayName ? (
        <>
          <Heading>Hear your name?</Heading>
          <Caption>
            Some sessions can greet you as {prefs.displayName}. Off by default. Coming to the preview
            soon.
          </Caption>
        </>
      ) : null}

      <Heading>About this voice</Heading>
      <Card>
        <Body>{voice.name}</Body>
        <Caption style={styles.note}>{voice.descriptor}</Caption>
        <Caption style={styles.note}>Studio-crafted synthetic voice. {voice.narratorCredit}</Caption>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chrome: { alignItems: 'flex-start' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  dynamic: { textTransform: 'lowercase', marginTop: spacing.lg },
  gateBlurb: { marginTop: spacing.sm, marginBottom: spacing.lg },
  lede: { marginTop: spacing.sm },
  note: { marginTop: spacing.xs },
  leave: { alignItems: 'center' },
  hero: { marginTop: spacing.md },
  player: { marginTop: spacing.xl },
  clockRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
    marginTop: spacing.md,
  },
  previewNote: { textAlign: 'center', marginTop: spacing.md },
});
