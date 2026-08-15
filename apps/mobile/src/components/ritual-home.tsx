import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/ui';
import { fonts, radius, spacing } from '@/constants/theme';
import { closeForVoice, getVoice, VOICES } from '@/data/catalog';
import { recycleVariant } from '@/data/close-catalog';
import { useAtmosphere } from '@/lib/atmosphere';
import { cueCloseLoop, feelingsOnHome, HOME_RECYCLES } from '@/lib/home-cue';
import { useAppState } from '@/lib/store';
import { MOODS, type Mood, type RecycleKey, type SessionFamily } from '@/lib/types';
import { LearnMore } from '@/motion/learn-more';
import { TextsReveal } from '@/motion/texts-reveal';

function openLoop(family: SessionFamily, variantId: string, play: boolean) {
  return {
    pathname: '/session/[id]' as const,
    params: { id: family.id, variant: variantId, ...(play ? { play: '1' } : {}) },
  };
}

function hello(part: 'morning' | 'evening', name: string) {
  const hour = part === 'morning' ? 'Good morning' : 'Good evening';
  return name ? `${hour}, ${name}.` : `${hour}.`;
}

export function RitualHome() {
  const router = useRouter();
  const { part, palette } = useAtmosphere();
  const { visibleCatalog, ritual, prefs } = useAppState();
  const closeLoops = useMemo(() => visibleCatalog.filter((f) => f.format === 'close'), [visibleCatalog]);
  const feelings = useMemo(() => feelingsOnHome(closeLoops), [closeLoops]);

  const [mood, setMood] = useState<Mood | null>(null);
  const [voiceId, setVoiceId] = useState<string | null>(null);

  const cued = useMemo(
    () =>
      cueCloseLoop({
        loops: closeLoops,
        mood,
        voiceId,
        lastFamilyId: ritual.lastFinishedFamilyId ?? ritual.lastFamilyId,
      }),
    [closeLoops, mood, voiceId, ritual.lastFinishedFamilyId, ritual.lastFamilyId],
  );

  if (!cued) {
    return (
      <View style={styles.wrap}>
        <Text style={[styles.wordmark, { color: palette.text }]}>Selfish</Text>
        <Text style={[styles.headline, { color: palette.text }]}>What do you want to feel.</Text>
        <Text style={[styles.lede, { color: palette.text }]}>Raise heat to Close in You — then this room opens.</Text>
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
  const feelingLabel = mood ? (MOODS.find((m) => m.id === mood)?.label ?? 'Wanted') : null;

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
      <Text style={[styles.wordmark, { color: palette.text }]}>Selfish</Text>
      <TextsReveal>
        <Text style={[styles.hello, { color: palette.text }]}>{hello(part, firstName)}</Text>
        <Text style={[styles.headline, { color: palette.text }]}>What do you want{'\n'}to feel.</Text>
      </TextsReveal>

      <View style={styles.feelings}>
        {feelings.map((id) => {
          const meta = MOODS.find((m) => m.id === id);
          if (!meta) return null;
          return (
            <Chip
              key={id}
              label={meta.label}
              selected={mood === id}
              onPress={() => {
                setMood(mood === id ? null : id);
              }}
            />
          );
        })}
      </View>

      <View style={[styles.stage, { borderColor: palette.border }]}>
        {feelingLabel ? (
          <Text style={[styles.kicker, { color: palette.gold }]}>{feelingLabel.toLowerCase()}</Text>
        ) : (
          <Text style={[styles.kicker, { color: palette.gold }]}>for you</Text>
        )}
        <Text style={[styles.title, { color: palette.text }]}>{cued.title}</Text>
        <Text style={[styles.blurb, { color: palette.text }]}>{cued.blurb}</Text>
        <Text style={[styles.meta, { color: palette.text }]}>
          {voice?.name}
          {voice?.descriptor ? ` · ${voice.descriptor}` : ''}
        </Text>
        {cued.lovedFor.length > 0 ? (
          <Text style={[styles.loved, { color: palette.textDim }]}>loved for {cued.lovedFor.join(', ')}</Text>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Play ${cued.title}, ${minutes} minutes, ${voice?.name ?? ''}`}
          onPress={() => router.push(openLoop(cued, defaultVariant.id, true))}
          style={({ pressed }) => [styles.play, { backgroundColor: palette.gold }, pressed && { opacity: 0.88 }]}
        >
          <Text style={[styles.playLabel, { color: palette.onAccent }]}>
            Play {cued.title} · {minutes} min
          </Text>
        </Pressable>
      </View>

      <Text style={[styles.sameVoice, { color: palette.text }]}>Same voice</Text>
      <View style={styles.recycles}>
        {HOME_RECYCLES.map((item) => {
          const selected = cuedRecycle === item.id;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={`${item.label}, ${item.hint}`}
              onPress={() => go(item.id)}
              style={({ pressed }) => [
                styles.recycle,
                { borderColor: selected ? palette.gold : palette.border, backgroundColor: selected ? palette.gold : '#121214' },
                pressed && { opacity: 0.85 },
              ]}
            >
              <Text style={[styles.recycleLabel, { color: selected ? palette.onAccent : palette.text }]}>{item.label}</Text>
              <Text style={[styles.recycleHint, { color: selected ? palette.onAccent : palette.textDim }]}>{item.hint}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.voicesKicker, { color: palette.text }]}>A voice you know</Text>
      <View style={styles.voices}>
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
              onPress={() => setVoiceId(voiceId === v.id ? null : v.id)}
              style={({ pressed }) => [
                styles.voice,
                { borderColor: selected ? palette.gold : palette.border, backgroundColor: selected ? palette.goldSoft : '#121214' },
                pressed && { opacity: 0.85 },
              ]}
            >
              <Text style={[styles.voiceName, { color: selected ? palette.gold : palette.text }]}>{v.name}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.privacy, { color: palette.textDim }]}>Private on this device. Headphones if you have them.</Text>
      <LearnMore label="Stories, if you have time" onPress={() => router.push('/browse')} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: spacing.lg },
  wordmark: {
    fontFamily: fonts.body,
    fontSize: 13,
    letterSpacing: 1.4,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  hello: {
    fontFamily: fonts.body,
    fontSize: 16,
    marginTop: spacing.xl,
    letterSpacing: -0.2,
  },
  headline: {
    fontFamily: fonts.display,
    fontSize: 44,
    lineHeight: 46,
    marginTop: spacing.sm,
    letterSpacing: -1.2,
    fontWeight: '700',
  },
  lede: {
    fontFamily: fonts.body,
    fontSize: 17,
    lineHeight: 24,
    marginTop: spacing.md,
  },
  feelings: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.lg,
  },
  stage: {
    marginTop: spacing.xl,
    borderRadius: radius.lg + 4,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: '#121214',
    borderWidth: 1,
  },
  kicker: {
    fontFamily: fonts.body,
    fontSize: 12,
    letterSpacing: 1.6,
    fontWeight: '700',
    textTransform: 'lowercase',
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 40,
    lineHeight: 44,
    marginTop: spacing.sm,
    letterSpacing: -0.6,
    fontWeight: '700',
  },
  blurb: {
    fontFamily: fonts.body,
    fontSize: 17,
    lineHeight: 24,
    marginTop: spacing.sm,
    maxWidth: 420,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.md,
  },
  loved: {
    fontFamily: fonts.body,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  play: {
    marginTop: spacing.lg,
    borderRadius: radius.pill,
    paddingVertical: 16,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  playLabel: {
    fontFamily: fonts.body,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  sameVoice: {
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: '600',
    marginTop: spacing.xl,
    letterSpacing: -0.1,
  },
  recycles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: spacing.sm,
  },
  recycle: {
    flexGrow: 1,
    flexBasis: '22%',
    minWidth: 72,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  recycleLabel: { fontFamily: fonts.body, fontSize: 13, fontWeight: '700' },
  recycleHint: { fontFamily: fonts.body, fontSize: 11, marginTop: 2 },
  voicesKicker: {
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: '600',
    marginTop: spacing.xl,
  },
  voices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: spacing.sm,
  },
  voice: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  voiceName: { fontFamily: fonts.body, fontSize: 14, fontWeight: '600' },
  privacy: {
    fontFamily: fonts.body,
    fontSize: 13,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
