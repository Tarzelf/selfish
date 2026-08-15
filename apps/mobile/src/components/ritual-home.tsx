import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts, radius, spacing } from '@/constants/theme';
import { VARIANT_AUDIO } from '@/data/audio-map';
import { closeForVoice, getFamily, getVoice, VOICES } from '@/data/catalog';
import { recycleVariant } from '@/data/close-catalog';
import { useAtmosphere } from '@/lib/atmosphere';
import { useAppState } from '@/lib/store';
import type { RecycleKey, SessionFamily } from '@/lib/types';
import { AvatarGroup } from '@/motion/avatar-group';
import { LearnMore } from '@/motion/learn-more';
import { ShimmerText } from '@/motion/shimmer-text';
import { SlidingTabs } from '@/motion/sliding-tabs';
import { TextsReveal } from '@/motion/texts-reveal';
import { TextSwap } from '@/motion/text-swap';

function alreadyHere(gender: string | undefined): string {
  if (gender === 'F') return "She's already here.";
  if (gender === 'NB') return "They're already here.";
  return "He's already here.";
}

function openLoop(family: SessionFamily, variantId: string, play: boolean) {
  return {
    pathname: '/session/[id]' as const,
    params: { id: family.id, variant: variantId, ...(play ? { play: '1' } : {}) },
  };
}

const RECYCLES: { id: RecycleKey; label: string }[] = [
  { id: 'again', label: 'Again' },
  { id: 'slower', label: 'Slower' },
  { id: 'closer', label: 'Closer' },
  { id: 'after', label: 'After' },
];

export function RitualHome() {
  const router = useRouter();
  const { palette } = useAtmosphere();
  const { visibleCatalog, ritual, prefs } = useAppState();
  const closeLoops = useMemo(() => visibleCatalog.filter((f) => f.format === 'close'), [visibleCatalog]);

  const [voiceId, setVoiceId] = useState<string | null>(null);

  const cued = useMemo(() => {
    if (voiceId) return closeForVoice(voiceId, closeLoops) ?? closeLoops[0];
    const remembered = ritual.lastFinishedFamilyId ?? ritual.lastFamilyId;
    if (remembered) {
      const found = closeLoops.find((f) => f.id === remembered) ?? getFamily(remembered);
      if (found && found.format === 'close' && closeLoops.some((f) => f.id === found.id)) return found;
    }
    return closeLoops.find((f) => f.id === 'f-stay') ?? closeLoops[0];
  }, [voiceId, closeLoops, ritual.lastFinishedFamilyId, ritual.lastFamilyId]);

  if (!cued) {
    return (
      <View style={styles.empty}>
        <Text style={[styles.wordmark, { color: palette.text }]}>Selfish</Text>
        <TextsReveal>
          <Text style={[styles.line, { color: palette.text }]}>Raise heat to Close in You — then this room opens.</Text>
        </TextsReveal>
      </View>
    );
  }

  const voice = getVoice(cued.voiceId);
  const rememberedVariant =
    (ritual.lastFamilyId === cued.id ? ritual.lastVariantId : null) ??
    (ritual.lastFinishedFamilyId === cued.id ? ritual.lastFinishedVariantId : null);
  const defaultVariant =
    cued.variants.find((v) => v.id === rememberedVariant && v.label !== 'After') ??
    cued.variants.find((v) => v.label === 'Again') ??
    cued.variants[0];
  const minutes = defaultVariant.durationMin;
  const firstName = prefs.displayName.split(' ')[0];
  const cuedRecycle =
    (defaultVariant.label.toLowerCase() as RecycleKey) === 'slower' ||
    defaultVariant.label.toLowerCase() === 'closer' ||
    defaultVariant.label.toLowerCase() === 'after'
      ? (defaultVariant.label.toLowerCase() as RecycleKey)
      : 'again';

  const go = (key: RecycleKey) => {
    if (key === 'again') {
      router.push(openLoop(cued, defaultVariant.id, true));
      return;
    }
    const variant = recycleVariant(cued, key);
    if (variant) router.push(openLoop(cued, variant.id, true));
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.wordmarkChip}>
        <Text style={[styles.wordmark, { color: palette.text }]}>Selfish</Text>
      </View>
      <TextsReveal>
        <Text style={[styles.line, { color: palette.text }]}>{alreadyHere(voice?.gender)}</Text>
        {firstName ? <Text style={[styles.aside, { color: palette.text }]}>{firstName}.</Text> : <Text style={[styles.aside, { color: palette.text }]}> </Text>}
      </TextsReveal>

      <LinearGradient colors={['#2B1631', '#1A121F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.stage}>
        <View style={styles.orb} />
        <ShimmerText text="HEADPHONES ON" style={styles.kicker} />
        <TextSwap text={cued.title} style={styles.title} />
        <TextSwap
          text={`${voice?.name ?? ''} · ${minutes} min${VARIANT_AUDIO[defaultVariant.id] ? '  ·  ▶' : ''}`}
          style={styles.meta}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Play ${cued.title}`}
          onPress={() => router.push(openLoop(cued, defaultVariant.id, true))}
          style={({ pressed }) => [styles.play, { backgroundColor: palette.gold }, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
        >
          <Text style={[styles.playGlyph, { color: palette.onAccent }]}>▶</Text>
        </Pressable>
      </LinearGradient>

      <View style={styles.recycles}>
        <SlidingTabs tabs={RECYCLES} selected={cuedRecycle} onSelect={(id) => go(id as RecycleKey)} />
      </View>

      <Text style={[styles.mouthsKicker, { color: palette.textFaint }]}>other mouths</Text>
      <AvatarGroup style={styles.mouths}>
        {VOICES.map((v) => {
          const hasLoop = closeForVoice(v.id, closeLoops);
          if (!hasLoop) return null;
          const selected = cued.voiceId === v.id;
          return (
            <Pressable
              key={v.id}
              accessibilityRole="button"
              accessibilityLabel={v.name}
              accessibilityState={{ selected }}
              onPress={() => setVoiceId(v.id)}
              style={({ pressed }) => [
                styles.mouth,
                { borderColor: palette.border, backgroundColor: palette.surface },
                selected && { borderColor: palette.gold, backgroundColor: palette.goldSoft },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={[styles.mouthGlyph, { color: palette.textDim }, selected && { color: palette.gold }]}>{v.name.charAt(0)}</Text>
            </Pressable>
          );
        })}
      </AvatarGroup>

      <LearnMore label="Stories, if you have time" onPress={() => router.push('/browse')} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: spacing.lg },
  empty: { paddingTop: spacing.xxl },
  wordmarkChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#121214',
    borderColor: 'rgba(245,245,247,0.14)',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  wordmark: {
    fontFamily: fonts.body,
    fontSize: 15,
    letterSpacing: -0.2,
    fontWeight: '700',
  },
  line: {
    fontFamily: fonts.display,
    fontSize: 48,
    lineHeight: 50,
    marginTop: spacing.md,
    letterSpacing: -1.2,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 28,
  },
  aside: {
    fontFamily: fonts.display,
    fontStyle: 'italic',
    fontSize: 22,
    marginTop: spacing.xs,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 16,
  },
  stage: {
    marginTop: spacing.xl,
    borderRadius: radius.lg + 8,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    minHeight: 280,
    justifyContent: 'center',
  },
  orb: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 280,
    top: -120,
    right: -80,
    backgroundColor: 'rgba(224,138,120,0.22)',
  },
  kicker: {
    fontFamily: fonts.body,
    fontSize: 11,
    letterSpacing: 2.2,
    fontWeight: '700',
    color: '#E8B98A',
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 44,
    lineHeight: 50,
    color: '#F7F1E8',
    marginTop: spacing.sm,
    textAlign: 'center',
    letterSpacing: -0.6,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: 'rgba(243,237,247,0.72)',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  play: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  playGlyph: { fontSize: 28, marginLeft: 4 },
  recycles: { marginTop: spacing.lg },
  mouthsKicker: {
    fontFamily: fonts.body,
    fontSize: 11,
    letterSpacing: 1.8,
    textAlign: 'center',
    marginTop: spacing.xl,
    textTransform: 'lowercase',
  },
  mouths: { marginTop: spacing.sm, gap: spacing.sm },
  mouth: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mouthGlyph: { fontFamily: fonts.display, fontSize: 18 },
});
