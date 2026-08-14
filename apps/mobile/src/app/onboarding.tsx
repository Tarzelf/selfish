import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Body, Button, Caption, Chip, Display, Screen } from '@/components/ui';
import { fonts, palette, radius, spacing } from '@/constants/theme';
import { VOICE_PREVIEW_AUDIO } from '@/data/audio-map';
import { useAppState } from '@/lib/store';
import { HEAT_LABEL, type HeatLevel, LIMIT_TAGS, MOODS, type Mood } from '@/lib/types';

type Step = 'welcome' | 'age' | 'honesty' | 'moods' | 'heat' | 'limits' | 'done';

const STEPS: Step[] = ['welcome', 'age', 'honesty', 'moods', 'heat', 'limits', 'done'];

/** The landing: dramatize the value props, let them HEAR it, then begin. */
function Landing({ onBegin }: { onBegin: () => void }) {
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
      <Text style={styles.landingWordmark}>SELFISH</Text>
      <Text style={styles.landingHero}>Time that&apos;s{'\n'}just for you.</Text>
      <Body dim style={styles.landingLede}>
        Intimate audio fiction and unhurried sleep stories — written with care, whispered up close,
        and tuned to exactly the mood you&apos;re in tonight.
      </Body>

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
            <Text style={styles.listenPlayGlyph}>{status.playing ? '❚❚' : '▶'}</Text>
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
              <Text style={styles.propTitle}>{p.title}</Text>
              <Text style={styles.propBody}>{p.body}</Text>
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
  const { setPrefs } = useAppState();

  const [step, setStep] = useState<Step>('welcome');
  const [birthYear, setBirthYear] = useState('');
  const [moods, setMoods] = useState<Mood[]>([]);
  const [heatCap, setHeatCap] = useState<HeatLevel>('comfort');
  const [limits, setLimits] = useState<string[]>([]);
  const [name, setName] = useState('');

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
            <View key={s} style={[styles.progressDot, i <= stepIndex && { backgroundColor: palette.gold }]} />
          ))}
        </View>

        {step === 'age' && (
          <View style={styles.stepBody}>
            <Display>First things first</Display>
            <Body dim style={styles.lede}>
              Selfish is for adults. Enter your birth year to continue.
            </Body>
            <TextInput
              style={styles.input}
              value={birthYear}
              onChangeText={setBirthYear}
              placeholder="Year of birth (e.g. 1994)"
              placeholderTextColor={palette.textFaint}
              keyboardType="number-pad"
              maxLength={4}
              accessibilityLabel="Year of birth"
            />
            <Caption style={styles.finePrint}>
              Your birth year stays on this device in the preview build. On iOS we additionally
              honor the Declared Age Range provided by your Apple Account settings.
            </Caption>
            <View style={styles.spacer} />
            <Button label="I'm 18 or older — continue" onPress={next} disabled={!isAdult} />
          </View>
        )}

        {step === 'honesty' && (
          <View style={styles.stepBody}>
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
            <View style={styles.spacer} />
            <Button label="Sounds fair — I agree" onPress={next} />
            <Caption style={styles.finePrint}>
              The full voice transparency page is always one tap away in Settings.
            </Caption>
          </View>
        )}

        {step === 'moods' && (
          <View style={styles.stepBody}>
            <Display>How do you want to feel?</Display>
            <Body dim style={styles.lede}>
              Pick any that ring true. This tunes your Tonight page — change it whenever you like.
            </Body>
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
            <Display>Set your heat</Display>
            <Body dim style={styles.lede}>
              This caps what appears anywhere in the app. It starts gentle; turn it up (or down) in
              Settings whenever you like. Nothing above your setting is ever shown.
            </Body>
            <View style={styles.chipWrap}>
              {(['comfort', 'slow-burn', 'spicy'] as HeatLevel[]).map((h) => (
                <Chip key={h} label={HEAT_LABEL[h]} selected={heatCap === h} onPress={() => setHeatCap(h)} />
              ))}
            </View>
            <View style={styles.spacer} />
            <Button label="Continue" onPress={next} />
          </View>
        )}

        {step === 'limits' && (
          <View style={styles.stepBody}>
            <Display>Anything off the table?</Display>
            <Body dim style={styles.lede}>
              Select themes you never want to encounter. They will be filtered out everywhere,
              permanently, no questions asked.
            </Body>
            <View style={styles.chipWrap}>
              {LIMIT_TAGS.map((t) => (
                <Chip key={t} label={t} selected={limits.includes(t)} onPress={() => toggleLimit(t)} />
              ))}
            </View>
            <View style={styles.spacer} />
            <Button label={limits.length > 0 ? 'Continue' : 'Nothing — continue'} onPress={next} />
          </View>
        )}

        {step === 'done' && (
          <View style={styles.stepBody}>
            <Display>One last thing</Display>
            <Body dim style={styles.lede}>
              What should we call you? Optional — some sessions can greet you by name if you want
              them to (off by default).
            </Body>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name (optional)"
              placeholderTextColor={palette.textFaint}
              autoCapitalize="words"
              accessibilityLabel="Your name"
            />
            <View style={styles.spacer} />
            <Button label="Take me in" onPress={finish} />
            <Text style={styles.skip} onPress={finish}>
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
  progressDot: { flex: 1, height: 3, borderRadius: 2, backgroundColor: palette.border },
  stepBody: { flex: 1, justifyContent: 'center' },
  lede: { marginBottom: spacing.md, color: palette.textDim },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md },
  input: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    color: palette.text,
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
    color: palette.textFaint,
    textAlign: 'center',
    marginTop: spacing.md,
    fontSize: 15,
    padding: spacing.sm,
  },

  // Landing
  landingWordmark: {
    fontFamily: fonts.body,
    fontSize: 12,
    letterSpacing: 3.5,
    fontWeight: '700',
    color: palette.gold,
    marginTop: spacing.xl,
  },
  landingHero: {
    fontFamily: fonts.display,
    fontSize: 52,
    lineHeight: 58,
    color: palette.text,
    marginTop: spacing.md,
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
  listenTitle: { fontFamily: fonts.display, fontSize: 30, lineHeight: 36, color: palette.text, marginTop: spacing.sm },
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
  listenPlayGlyph: { color: palette.text, fontSize: 18, marginLeft: 2 },
  listenMeta: { flex: 1, fontFamily: fonts.body, fontSize: 12.5, lineHeight: 18, color: 'rgba(243,237,247,0.75)' },
  props: { marginTop: spacing.xxl, gap: 44 },
  prop: { flexDirection: 'row', gap: spacing.md },
  propRule: { width: 2, borderRadius: 1, alignSelf: 'stretch' },
  propText: { flex: 1 },
  propTitle: { fontFamily: fonts.display, fontSize: 23, lineHeight: 30, color: palette.text },
  propBody: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 24,
    color: 'rgba(240,229,238,0.72)',
    marginTop: spacing.sm,
    maxWidth: 540,
  },
  landingCta: { marginTop: spacing.xl },
  landingFoot: { textAlign: 'center', marginTop: spacing.md },
});
