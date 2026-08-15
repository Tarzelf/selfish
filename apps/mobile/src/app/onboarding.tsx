import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AtmosphereChoice } from '@/components/atmosphere-choice';
import { HeatChoice } from '@/components/heat-choice';
import { Body, Button, Caption, Chip, Display, Screen } from '@/components/ui';
import { fonts, radius, spacing } from '@/constants/theme';
import { VOICE_PREVIEW_AUDIO } from '@/data/audio-map';
import { useAtmosphere } from '@/lib/atmosphere';
import { useAppState } from '@/lib/store';
import { type AtmospherePref, type HeatLevel, LIMIT_TAGS, MOODS, type Mood } from '@/lib/types';
import { ErrorField } from '@/motion/error-field';
import { IconSwap } from '@/motion/icon-swap';
import { TextsReveal } from '@/motion/texts-reveal';

type Step = 'welcome' | 'age' | 'honesty' | 'moods' | 'heat' | 'limits' | 'atmosphere' | 'done';

const STEPS: Step[] = ['welcome', 'age', 'honesty', 'moods', 'heat', 'limits', 'atmosphere', 'done'];

/** The landing: dramatize the value props, let them HEAR it, then begin. */
function Landing({ onBegin }: { onBegin: () => void }) {
  const { palette } = useAtmosphere();
  const player = useAudioPlayer(VOICE_PREVIEW_AUDIO['v-jasper'] ?? null);
  const status = useAudioPlayerStatus(player);

  const toggle = () => {
    if (status.playing) {
      player.pause();
      return;
    }
    if (status.duration > 0 && status.currentTime >= status.duration - 0.05) player.seekTo(0);
    player.play();
  };

  return (
    <Screen>
      <View style={styles.wordmarkChip}>
        <Text style={[styles.landingWordmark, { color: palette.text }]}>Selfish</Text>
      </View>
      <TextsReveal>
        <Text style={[styles.landingHero, { color: palette.text }]}>Time that&apos;s{'\n'}just for you.</Text>
        <Body style={styles.landingLede}>
          Intimate audio fiction and unhurried sleep stories — written with care, whispered up close,
          and tuned to exactly the mood you&apos;re in.
        </Body>
      </TextsReveal>

      <LinearGradient colors={['#2B1631', '#7E2F4E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.listenCard}>
        <View style={styles.listenOrb} />
        <Text style={styles.listenKicker}>PUT YOUR HEADPHONES ON</Text>
        <Text style={styles.listenTitle}>Hear how close{'\n'}close can get.</Text>
        <View style={styles.listenRow}>
          <Pressable
            onPress={toggle}
            accessibilityRole="button"
            accessibilityLabel={status.playing ? 'Pause sample' : 'Play sample'}
            style={({ pressed }) => [styles.listenPlay, pressed && { opacity: 0.8 }]}
          >
            <IconSwap
              state={status.playing ? 'b' : 'a'}
              a="▶"
              b="❚❚"
              style={{ width: 18, height: 18 }}
              glyphStyle={styles.listenPlayGlyph}
            />
          </Pressable>
          <Text style={styles.listenMeta}>Jasper · a 30-second whisper{'\n'}Rendered by our engine — no human recorded this.</Text>
        </View>
      </LinearGradient>

      <View style={styles.props}>
        {(
          [
            {
              title: 'Made to your mood',
              body: 'Comforted, adored, teased, in charge. Pick the feeling and the heat; every story comes in softer, slower, and further versions — switch with one tap.',
              rule: ['#E8B98A', '#7E2F4E'] as const,
            },
            {
              title: 'Private by design',
              body: 'Nothing revealing on your lock screen. No feed, no profiles, no judgment. Hard limits you set once and never see crossed. Deletion that actually deletes.',
              rule: ['#D98A9E', '#3D2244'] as const,
            },
            {
              title: 'Honest AI, human-made',
              body: 'Every voice is synthetic and we say so — built from recordings narrators licensed for exactly this, with a share of revenue for as long as they\u2019re in the app.',
              rule: ['#DFAE72', '#5E2F57'] as const,
            },
          ]
        ).map((p) => (
          <View key={p.title} style={styles.prop}>
            <LinearGradient colors={[p.rule[0], p.rule[1]]} style={styles.propRule} />
            <View style={styles.propText}>
              <Text style={[styles.propTitle, { color: palette.text }]}>{p.title}</Text>
              <Text style={[styles.propBody, { color: palette.text }]}>{p.body}</Text>
            </View>
          </View>
        ))}
      </View>

      <Button label="Begin — it takes a minute" onPress={onBegin} style={styles.landingCta} />
      <Caption style={styles.landingFoot}>For adults. Free to explore; no card required.</Caption>
    </Screen>
  );
}

export default function Onboarding() {
  const router = useRouter();
  const { palette } = useAtmosphere();
  const { setPrefs } = useAppState();

  const [step, setStep] = useState<Step>('welcome');
  const [birthYear, setBirthYear] = useState('');
  const [moods, setMoods] = useState<Mood[]>([]);
  const [heatCap, setHeatCap] = useState<HeatLevel>('comfort');
  const [limits, setLimits] = useState<string[]>([]);
  const [atmospherePref, setAtmospherePref] = useState<AtmospherePref>('auto');
  const [name, setName] = useState('');
  const [ageError, setAgeError] = useState(false);

  const stepIndex = STEPS.indexOf(step);
  const next = () => setStep(STEPS[Math.min(stepIndex + 1, STEPS.length - 1)]);

  const currentYear = new Date().getFullYear();
  const yearNum = Number(birthYear);
  const isAdult = useMemo(
    () => /^\d{4}$/.test(birthYear) && yearNum >= 1900 && currentYear - yearNum >= 18,
    [birthYear, yearNum, currentYear],
  );

  const toggleMood = (m: Mood) =>
    setMoods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  const toggleLimit = (t: string) =>
    setLimits((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const finish = () => {
    setPrefs({
      onboarded: true,
      ageConfirmed: true,
      aiDisclosureAccepted: true,
      moods,
      heatCap,
      hardLimits: limits,
      atmospherePref,
      displayName: name.trim(),
    });
    router.replace('/(tabs)');
  };

  if (step === 'welcome') {
    return <Landing onBegin={next} />;
  }

  return (
    <Screen scroll={false}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <View style={styles.progressRow}>
          {STEPS.slice(0, -1).map((s, i) => (
            <View key={s} style={[styles.progressDot, { backgroundColor: palette.border }, i <= stepIndex && { backgroundColor: palette.gold }]} />
          ))}
        </View>

        {step === 'age' && (
          <View style={styles.stepBody}>
            <TextsReveal key="age">
              <Display>First things first</Display>
              <Body dim style={styles.lede}>
                Selfish is for adults. Enter your birth year to continue.
              </Body>
            </TextsReveal>
            <ErrorField
              error={ageError}
              message="Enter a birth year that makes you 18 or older."
              style={{ marginTop: spacing.md }}
            >
              <TextInput
                style={[
                  styles.input,
                  styles.inputFlush,
                  { backgroundColor: palette.surface, borderColor: 'transparent', color: palette.text },
                ]}
                value={birthYear}
                onChangeText={(v) => {
                  setBirthYear(v);
                  setAgeError(false);
                }}
                placeholder="Year of birth (e.g. 1994)"
                placeholderTextColor={palette.textFaint}
                keyboardType="number-pad"
                maxLength={4}
                accessibilityLabel="Year of birth"
              />
            </ErrorField>
            <Caption style={styles.finePrint}>
              Your birth year stays on this device in the preview build. On iOS we additionally
              honor the Declared Age Range provided by your Apple Account settings.
            </Caption>
            <View style={styles.spacer} />
            <Button
              label="I'm 18 or older — continue"
              onPress={() => {
                if (!isAdult) {
                  setAgeError(false);
                  requestAnimationFrame(() => setAgeError(true));
                  return;
                }
                next();
              }}
            />
          </View>
        )}

        {step === 'honesty' && (
          <View style={styles.stepBody}>
            <TextsReveal key="honesty">
            <Display>The honest part</Display>
            <Body dim style={styles.lede}>
              Every voice in Selfish is a studio-crafted synthetic performance, built from
              recordings licensed from real, paid narrators. Nothing is cloned without consent, and
              nothing is generated live — every session is written, reviewed, and produced by our
              studio before it reaches you.
            </Body>
            <Body dim style={styles.lede}>
              Producing sessions uses third-party AI services. Your listening choices never leave
              your account, and none of your personal data is used to train anything.
            </Body>
            </TextsReveal>
            <View style={styles.spacer} />
            <Button label="Sounds fair — I agree" onPress={next} />
            <Caption style={styles.finePrint}>
              The full voice transparency page is always one tap away in Settings.
            </Caption>
          </View>
        )}

        {step === 'moods' && (
          <View style={styles.stepBody}>
            <TextsReveal key="moods">
            <Display>How do you want to feel?</Display>
            <Body dim style={styles.lede}>
              Pick any that ring true. This tunes Today — change it whenever you like.
            </Body>
            </TextsReveal>
            <View style={styles.chipWrap}>
              {MOODS.map((m) => (
                <Chip key={m.id} label={m.label} hint={m.hint} selected={moods.includes(m.id)} onPress={() => toggleMood(m.id)} />
              ))}
            </View>
            <View style={styles.spacer} />
            <Button label="Continue" onPress={next} disabled={moods.length === 0} />
          </View>
        )}

        {step === 'heat' && (
          <View style={styles.stepBody}>
            <TextsReveal key="heat">
            <Display>What do you want first?</Display>
            <Body dim style={styles.lede}>
              This is the door. Soft is the cover story — held, sleepy, supported. Close is why
              you will open this twice in one day. Nothing above your pick is ever shown. Change
              it anytime in You.
            </Body>
            </TextsReveal>
            <HeatChoice value={heatCap} onChange={setHeatCap} />
            <View style={styles.spacer} />
            <Button label="Continue" onPress={next} />
          </View>
        )}

        {step === 'limits' && (
          <View style={styles.stepBody}>
            <TextsReveal key="limits">
            <Display>Anything off the table?</Display>
            <Body dim style={styles.lede}>
              Select themes you never want to encounter. They will be filtered out everywhere,
              permanently, no questions asked.
            </Body>
            </TextsReveal>
            <View style={styles.chipWrap}>
              {LIMIT_TAGS.map((t) => (
                <Chip key={t} label={t} selected={limits.includes(t)} onPress={() => toggleLimit(t)} />
              ))}
            </View>
            <View style={styles.spacer} />
            <Button label={limits.length > 0 ? 'Continue' : 'Nothing — continue'} onPress={next} />
          </View>
        )}

        {step === 'atmosphere' && (
          <View style={styles.stepBody}>
            <TextsReveal key="atmosphere">
              <Display>When do you listen?</Display>
              <Body dim style={[styles.lede, { color: palette.textDim }]}>
                Morning is linen and an open window. Evening is a summer night, in bed. Auto follows
                the clock. You can change this anytime in You.
              </Body>
            </TextsReveal>
            <AtmosphereChoice
              value={atmospherePref}
              onChange={(v) => {
                setAtmospherePref(v);
                setPrefs({ atmospherePref: v });
              }}
            />
            <View style={styles.spacer} />
            <Button label="Continue" onPress={next} />
          </View>
        )}

        {step === 'done' && (
          <View style={styles.stepBody}>
            <TextsReveal key="done">
            <Display>One last thing</Display>
            <Body dim style={styles.lede}>
              What should we call you? Optional — some sessions can greet you by name if you want
              them to (off by default).
            </Body>
            </TextsReveal>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: palette.surface, borderColor: palette.border, color: palette.text },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Your name (optional)"
              placeholderTextColor={palette.textFaint}
              autoCapitalize="words"
              accessibilityLabel="Your name"
            />
            <View style={styles.spacer} />
            <Button label="Take me in" onPress={finish} />
            <Text style={[styles.skip, { color: palette.textFaint }]} onPress={finish}>
              Skip
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  progressRow: { flexDirection: 'row', gap: 6, marginTop: spacing.lg },
  progressDot: { flex: 1, height: 3, borderRadius: 2 },
  stepBody: { flex: 1, justifyContent: 'center' },
  lede: { marginBottom: spacing.md },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md },
  inputFlush: { marginTop: 0 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
    fontFamily: fonts.body,
    fontSize: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    marginTop: spacing.md,
  },
  finePrint: { marginTop: spacing.md },
  spacer: { height: spacing.xl },
  skip: {
    fontFamily: fonts.body,
    textAlign: 'center',
    marginTop: spacing.md,
    fontSize: 15,
    padding: spacing.sm,
  },

  // Landing
  wordmarkChip: {
    alignSelf: 'flex-start',
    marginTop: spacing.xl,
    backgroundColor: '#121214',
    borderColor: 'rgba(245,245,247,0.14)',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  landingWordmark: {
    fontFamily: fonts.body,
    fontSize: 15,
    letterSpacing: -0.2,
    fontWeight: '700',
  },
  landingHero: {
    fontFamily: fonts.display,
    fontSize: 56,
    lineHeight: 56,
    letterSpacing: -1.6,
    fontWeight: '700',
    marginTop: spacing.md,
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  landingLede: { marginTop: spacing.md, fontSize: 17, lineHeight: 26, maxWidth: 560 },
  listenCard: {
    borderRadius: radius.lg + 6,
    padding: spacing.lg,
    marginTop: spacing.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
  },
  listenOrb: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 300,
    top: -150,
    right: -90,
    backgroundColor: 'rgba(224,138,120,0.32)',
  },
  listenKicker: { fontFamily: fonts.body, fontSize: 11, letterSpacing: 2.2, fontWeight: '700', color: '#E8B98A' },
  listenTitle: { fontFamily: fonts.display, fontSize: 30, lineHeight: 36, color: '#F7F1E8', marginTop: spacing.sm, letterSpacing: -0.4 },
  listenRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.md },
  listenPlay: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listenPlayGlyph: { color: '#F7F1E8', fontSize: 18, marginLeft: 2 },
  listenMeta: { flex: 1, fontFamily: fonts.body, fontSize: 13, lineHeight: 18, color: 'rgba(243,237,247,0.75)' },
  props: { marginTop: spacing.xxl, gap: 44 },
  prop: { flexDirection: 'row', gap: spacing.md },
  propRule: { width: 2, borderRadius: 1, alignSelf: 'stretch' },
  propText: { flex: 1 },
  propTitle: { fontFamily: fonts.display, fontSize: 23, lineHeight: 30, letterSpacing: -0.3 },
  propBody: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 24,
    marginTop: spacing.sm,
    maxWidth: 540,
  },
  landingCta: { marginTop: spacing.xl },
  landingFoot: { textAlign: 'center', marginTop: spacing.md },
});
