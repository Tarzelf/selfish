import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Body,
  Button,
  Caption,
  Choice,
  ChoiceStack,
  Display,
  Field,
  HitLabel,
  NumeralField,
  PlayControl,
  Progress,
  StepScreen,
  TextLink,
  Wordmark,
} from '@/components/ui';
import { spacing } from '@/constants/theme';
import { VOICE_PREVIEW_AUDIO } from '@/data/audio-map';
import { useAppState } from '@/lib/store';
import { HEAT_HINT, HEAT_LABEL, type HeatLevel, LIMIT_TAGS, MOODS, type Mood } from '@/lib/types';

type Step = 'welcome' | 'age' | 'honesty' | 'moods' | 'heat' | 'limits' | 'done';

const STEPS: Step[] = ['welcome', 'age', 'honesty', 'moods', 'heat', 'limits', 'done'];

function greeting(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

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
    <StepScreen
      chrome={<Wordmark style={styles.masthead} />}
      dock={
        <>
          <Button label="Begin — it takes a minute" onPress={onBegin} />
          <Caption style={styles.foot}>For adults. Free to explore.</Caption>
        </>
      }
    >
      <Display>Time that&apos;s just for you.</Display>
      <Body dim style={styles.lede}>
        Stories to fall asleep to, and stories that are very much not.
      </Body>
      <View style={styles.listen}>
        <PlayControl
          playing={status.playing}
          onPress={toggle}
          size="lg"
          label={status.playing ? 'Pause sample' : 'Play sample'}
        />
        <Caption style={styles.listenMeta}>
          Headphones. Jasper, thirty seconds. Our engine — no human recorded this.
        </Caption>
      </View>
    </StepScreen>
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
  const back = () => setStep(STEPS[Math.max(stepIndex - 1, 0)]);

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

  const chrome = (
    <View style={styles.chrome}>
      <HitLabel label="Back" onPress={back} />
      <Progress value={stepIndex / (STEPS.length - 1)} style={styles.chromeBar} />
    </View>
  );

  if (step === 'age') {
    return (
      <StepScreen
        keyboard
        chrome={chrome}
        dock={
          <>
            <Button label="I'm 18 or older — continue" onPress={next} disabled={!isAdult} />
            <Caption>Your birth year stays on this device.</Caption>
          </>
        }
      >
        <Display>First things first</Display>
        <Body dim style={styles.lede}>
          Selfish is for adults.
        </Body>
        <NumeralField
          value={birthYear}
          onChangeText={setBirthYear}
          placeholder="1994"
          maxLength={4}
          accessibilityLabel="Year of birth"
        />
      </StepScreen>
    );
  }

  if (step === 'honesty') {
    return (
      <StepScreen
        chrome={chrome}
        dock={
          <>
            <Button label="Sounds fair — I agree" onPress={next} />
            <Caption>The full story is always in You → Voice transparency.</Caption>
          </>
        }
      >
        <Display>The honest part</Display>
        <Body dim style={styles.lede}>
          Every voice is a studio-crafted synthetic performance, built from recordings a paid
          narrator licensed for this.
        </Body>
        <Body dim style={styles.lede}>
          Nothing is cloned without consent. Nothing is generated while you listen.
        </Body>
        <Body dim>
          Your listening choices stay with your account. None of your data trains anything.
        </Body>
      </StepScreen>
    );
  }

  if (step === 'moods') {
    return (
      <StepScreen
        chrome={chrome}
        dock={<Button label="Continue" onPress={next} disabled={moods.length === 0} />}
      >
        <Display>How do you want to feel?</Display>
        <Body dim style={styles.lede}>
          Pick any that ring true. Change it whenever you like.
        </Body>
        <ChoiceStack>
          {MOODS.map((m) => (
            <Choice
              key={m.id}
              label={m.label}
              hint={m.hint}
              selected={moods.includes(m.id)}
              onPress={() => toggleMood(m.id)}
            />
          ))}
        </ChoiceStack>
      </StepScreen>
    );
  }

  if (step === 'heat') {
    return (
      <StepScreen chrome={chrome} dock={<Button label="Continue" onPress={next} />}>
        <Display>Set your heat</Display>
        <Body dim style={styles.lede}>
          This caps what appears anywhere. Nothing above it is ever shown.
        </Body>
        <ChoiceStack>
          {(['comfort', 'slow-burn', 'spicy'] as HeatLevel[]).map((h) => (
            <Choice
              key={h}
              label={HEAT_LABEL[h]}
              hint={HEAT_HINT[h]}
              selected={heatCap === h}
              onPress={() => setHeatCap(h)}
            />
          ))}
        </ChoiceStack>
      </StepScreen>
    );
  }

  if (step === 'limits') {
    return (
      <StepScreen
        chrome={chrome}
        dock={
          <Button label={limits.length > 0 ? 'Continue' : 'Nothing — continue'} onPress={next} />
        }
      >
        <Display>Anything off the table?</Display>
        <Body dim style={styles.lede}>
          Filtered out everywhere, permanently. No questions asked.
        </Body>
        <ChoiceStack>
          {LIMIT_TAGS.map((t) => (
            <Choice key={t} label={t} selected={limits.includes(t)} onPress={() => toggleLimit(t)} />
          ))}
        </ChoiceStack>
      </StepScreen>
    );
  }

  const first = name.trim();
  return (
    <StepScreen
      keyboard
      chrome={chrome}
      dock={
        <>
          <Button label="Take me in" onPress={finish} />
          <View style={styles.skip}>
            <TextLink label="Skip" onPress={finish} />
          </View>
        </>
      }
    >
      <Display>{first ? `${greeting(new Date().getHours())}, ${first}.` : 'What should we call you?'}</Display>
      <Body dim style={styles.lede}>
        Optional. Some sessions can greet you by name — off by default.
      </Body>
      <Field
        kind="quiet"
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        autoCapitalize="words"
        accessibilityLabel="Your name"
      />
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  masthead: { marginTop: spacing.md, marginBottom: spacing.sm },
  chrome: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  chromeBar: { flex: 1 },
  lede: { marginBottom: spacing.md },
  listen: { marginTop: spacing.xl, gap: spacing.md, alignItems: 'flex-start' },
  listenMeta: { maxWidth: 280 },
  foot: { textAlign: 'center' },
  skip: { alignItems: 'center' },
});
