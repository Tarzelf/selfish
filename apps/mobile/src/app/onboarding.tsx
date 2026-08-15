import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import {
  Body,
  Button,
  Caption,
  Card,
  Chip,
  ChipRow,
  Display,
  Field,
  PlayControl,
  Screen,
  TextLink,
  Title,
  Wordmark,
} from '@/components/ui';
import { palette, spacing } from '@/constants/theme';
import { VOICE_PREVIEW_AUDIO } from '@/data/audio-map';
import { useAppState } from '@/lib/store';
import { HEAT_LABEL, type HeatLevel, LIMIT_TAGS, MOODS, type Mood } from '@/lib/types';

type Step = 'welcome' | 'age' | 'honesty' | 'moods' | 'heat' | 'limits' | 'done';

const STEPS: Step[] = ['welcome', 'age', 'honesty', 'moods', 'heat', 'limits', 'done'];

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
      <Wordmark />
      <Display>Time that&apos;s just for you.</Display>
      <Body dim style={styles.landingLede}>
        Intimate audio fiction and unhurried sleep stories — written with care, whispered up close,
        tuned to the mood you&apos;re in tonight.
      </Body>

      <Card>
        <Caption>Headphones on.</Caption>
        <Title style={styles.listenTitle}>Hear how close close can get.</Title>
        <View style={styles.listenRow}>
          <PlayControl
            playing={status.playing}
            onPress={toggle}
            size="md"
            label={status.playing ? 'Pause sample' : 'Play sample'}
          />
          <Caption style={styles.listenMeta}>
            Jasper · a 30-second whisper. Rendered by our engine — no human recorded this.
          </Caption>
        </View>
      </Card>

      <View style={styles.props}>
        {(
          [
            {
              title: 'Made to your mood',
              body: 'Comforted, adored, teased, in charge. Every story comes in softer, slower, and further versions.',
            },
            {
              title: 'Private by design',
              body: 'Nothing revealing on your lock screen. No feed. Hard limits you set once. Deletion that deletes.',
            },
            {
              title: 'Honest about the voices',
              body: 'Every voice is synthetic, licensed from a paid narrator, and we say so.',
            },
          ]
        ).map((p) => (
          <View key={p.title} style={styles.prop}>
            <Body>{p.title}</Body>
            <Caption style={styles.propBody}>{p.body}</Caption>
          </View>
        ))}
      </View>

      <Button label="Begin — it takes a minute" onPress={onBegin} style={styles.landingCta} />
      <Caption style={styles.landingFoot}>For adults. Free to explore.</Caption>
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
            <View key={s} style={[styles.progressDot, i <= stepIndex && styles.progressDotOn]} />
          ))}
        </View>

        {step === 'age' && (
          <View style={styles.stepBody}>
            <Display>First things first</Display>
            <Body dim style={styles.lede}>
              Selfish is for adults. Enter your birth year to continue.
            </Body>
            <Field
              value={birthYear}
              onChangeText={setBirthYear}
              placeholder="Year of birth (e.g. 1994)"
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
            <ChipRow>
              {MOODS.map((m) => (
                <Chip key={m.id} label={m.label} hint={m.hint} selected={moods.includes(m.id)} onPress={() => toggleMood(m.id)} />
              ))}
            </ChipRow>
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
            <ChipRow>
              {(['comfort', 'slow-burn', 'spicy'] as HeatLevel[]).map((h) => (
                <Chip key={h} label={HEAT_LABEL[h]} selected={heatCap === h} onPress={() => setHeatCap(h)} />
              ))}
            </ChipRow>
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
            <ChipRow>
              {LIMIT_TAGS.map((t) => (
                <Chip key={t} label={t} selected={limits.includes(t)} onPress={() => toggleLimit(t)} />
              ))}
            </ChipRow>
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
            <Field
              value={name}
              onChangeText={setName}
              placeholder="Your name (optional)"
              autoCapitalize="words"
              accessibilityLabel="Your name"
            />
            <View style={styles.spacer} />
            <Button label="Take me in" onPress={finish} />
            <TextLink label="Skip" onPress={finish} />
          </View>
        )}
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  progressRow: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.lg },
  progressDot: { flex: 1, height: 1, backgroundColor: palette.inkHigh },
  progressDotOn: { backgroundColor: palette.bone },
  stepBody: { flex: 1, justifyContent: 'center' },
  lede: { marginBottom: spacing.md },
  finePrint: { marginTop: spacing.md },
  spacer: { height: spacing.xl },
  landingLede: { marginTop: spacing.md, maxWidth: 560 },
  listenTitle: { marginTop: spacing.sm },
  listenRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.md },
  listenMeta: { flex: 1 },
  props: { marginTop: spacing.xxl, gap: spacing.xl },
  prop: { maxWidth: 540 },
  propBody: { marginTop: spacing.xs },
  landingCta: { marginTop: spacing.xl },
  landingFoot: { textAlign: 'center', marginTop: spacing.md },
});
