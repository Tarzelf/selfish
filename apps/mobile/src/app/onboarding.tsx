import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';

import { Body, Button, Caption, Chip, Display, Screen } from '@/components/ui';
import { fonts, palette, radius, spacing } from '@/constants/theme';
import { useAppState } from '@/lib/store';
import { HEAT_LABEL, type HeatLevel, LIMIT_TAGS, MOODS, type Mood } from '@/lib/types';

type Step = 'welcome' | 'age' | 'honesty' | 'moods' | 'heat' | 'limits' | 'done';

const STEPS: Step[] = ['welcome', 'age', 'honesty', 'moods', 'heat', 'limits', 'done'];

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

  return (
    <Screen scroll={false}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <View style={styles.progressRow}>
          {STEPS.slice(0, -1).map((s, i) => (
            <View key={s} style={[styles.progressDot, i <= stepIndex && { backgroundColor: palette.gold }]} />
          ))}
        </View>

        {step === 'welcome' && (
          <View style={styles.stepBody}>
            <LinearGradient
              colors={['#3D2244', '#8A3B5C']}
              start={{ x: 0.1, y: 0.05 }}
              end={{ x: 0.95, y: 1 }}
              style={styles.welcomeArt}
            >
              <View style={styles.welcomeRing} />
              <Text style={styles.welcomeMonogram}>S</Text>
            </LinearGradient>
            <Display style={styles.welcomeTitle}>Selfish</Display>
            <Body dim style={[styles.lede, styles.welcomeLede]}>
              Audio made for exactly one person tonight: you.
            </Body>
            <Body dim style={[styles.lede, styles.welcomeLede]}>
              Stories to fall asleep to. Stories that are very much not for sleeping. Every one of
              them written with care, performed up close, and tuned to your mood.
            </Body>
            <View style={styles.spacer} />
            <Button label="Begin" onPress={next} />
            <Text style={styles.headphoneHint}>🎧 Best experienced with headphones</Text>
          </View>
        )}

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
              You can read the full voice transparency page any time in Settings.
            </Caption>
          </View>
        )}

        {step === 'moods' && (
          <View style={styles.stepBody}>
            <Display>How do you want to feel?</Display>
            <Body dim style={styles.lede}>
              Pick any that ring true. This tunes your Tonight page — you can change it whenever.
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
              This caps what appears anywhere in the app. It starts gentle; you can turn it up (or
              down) in Settings whenever you like. Nothing above your setting is ever shown.
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
  welcomeArt: {
    width: 128,
    height: 128,
    borderRadius: 32,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  welcomeRing: {
    position: 'absolute',
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  welcomeMonogram: { fontFamily: fonts.display, fontSize: 56, color: palette.text },
  welcomeTitle: { textAlign: 'center' },
  welcomeLede: { textAlign: 'center' },
  headphoneHint: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: palette.textFaint,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
