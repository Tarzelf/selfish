import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts, palette, radius, spacing } from '@/constants/theme';
import { VARIANT_AUDIO } from '@/data/audio-map';
import { closeForVoice, getFamily, getVoice, VOICES } from '@/data/catalog';
import { recycleVariant } from '@/data/close-catalog';
import { useAppState } from '@/lib/store';
import type { RecycleKey, SessionFamily } from '@/lib/types';

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

export function RitualHome() {
  const router = useRouter();
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
        <Text style={styles.wordmark}>SELFISH</Text>
        <Text style={styles.line}>Raise heat to Close in You — then this room opens.</Text>
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
      <Text style={styles.wordmark}>SELFISH</Text>
      <Text style={styles.line}>{alreadyHere(voice?.gender)}</Text>
      {firstName ? <Text style={styles.aside}>{firstName}.</Text> : null}

      <LinearGradient colors={['#2B1631', '#1A121F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.stage}>
        <View style={styles.orb} />
        <Text style={styles.kicker}>HEADPHONES ON</Text>
        <Text style={styles.title}>{cued.title}</Text>
        <Text style={styles.meta}>
          {voice?.name} · {minutes} min
          {VARIANT_AUDIO[defaultVariant.id] ? '  ·  ▶' : ''}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Play ${cued.title}`}
          onPress={() => router.push(openLoop(cued, defaultVariant.id, true))}
          style={({ pressed }) => [styles.play, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
        >
          <Text style={styles.playGlyph}>▶</Text>
        </Pressable>
      </LinearGradient>

      <View style={styles.recycles}>
        {(['again', 'slower', 'closer', 'after'] as RecycleKey[]).map((key) => (
          <Pressable
            key={key}
            accessibilityRole="button"
            accessibilityLabel={key}
            onPress={() => go(key)}
            style={({ pressed }) => [styles.recycle, pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.recycleLabel}>{key === 'again' ? 'Again' : key === 'slower' ? 'Slower' : key === 'closer' ? 'Closer' : 'After'}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.mouthsKicker}>other mouths</Text>
      <View style={styles.mouths}>
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
              style={({ pressed }) => [styles.mouth, selected && styles.mouthOn, pressed && { opacity: 0.8 }]}
            >
              <Text style={[styles.mouthGlyph, selected && { color: palette.gold }]}>{v.name.charAt(0)}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.stories} onPress={() => router.push('/browse')}>
        Stories, if you have time →
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: spacing.lg },
  empty: { paddingTop: spacing.xxl },
  wordmark: {
    fontFamily: fonts.body,
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: '700',
    color: palette.gold,
  },
  line: {
    fontFamily: fonts.display,
    fontSize: 36,
    lineHeight: 44,
    color: palette.text,
    marginTop: spacing.md,
  },
  aside: {
    fontFamily: fonts.display,
    fontStyle: 'italic',
    fontSize: 22,
    color: palette.textDim,
    marginTop: spacing.xs,
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
    color: palette.text,
    marginTop: spacing.sm,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: 'rgba(243,237,247,0.72)',
    marginTop: spacing.xs,
  },
  play: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: palette.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  playGlyph: { fontSize: 28, color: palette.onAccent, marginLeft: 4 },
  recycles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  recycle: {
    flex: 1,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    paddingVertical: 12,
    alignItems: 'center',
  },
  recycleLabel: { fontFamily: fonts.body, fontSize: 13, fontWeight: '600', color: palette.text },
  mouthsKicker: {
    fontFamily: fonts.body,
    fontSize: 11,
    letterSpacing: 1.8,
    color: palette.textFaint,
    textAlign: 'center',
    marginTop: spacing.xl,
    textTransform: 'lowercase',
  },
  mouths: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  mouth: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mouthOn: { borderColor: palette.gold, backgroundColor: palette.goldSoft },
  mouthGlyph: { fontFamily: fonts.display, fontSize: 18, color: palette.textDim },
  stories: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: palette.textFaint,
    textAlign: 'center',
    marginTop: spacing.xl,
    padding: spacing.sm,
  },
});
