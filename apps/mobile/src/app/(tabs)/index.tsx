import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { HeroCard } from '@/components/hero-card';
import { SessionCard } from '@/components/session-card';
import { VoiceRail } from '@/components/voice-rail';
import { Caption, Chip, ChipRow, Display, Heading, Progress, Screen, Wordmark } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { getFamily } from '@/data/catalog';
import { useAppState } from '@/lib/store';
import { HEAT_LABEL, type HeatLevel, MOODS, type Mood } from '@/lib/types';

type LengthPick = 'any' | 'short' | 'long';

function eveningLine(hour: number): string {
  if (hour < 5) return 'The house is quiet.';
  if (hour < 12) return 'A slow morning.';
  if (hour < 18) return 'Steal a moment.';
  return 'The evening is yours.';
}

export default function Tonight() {
  const { prefs, visibleCatalog, continueList, heatAllowed } = useAppState();

  const [mood, setMood] = useState<Mood | null>(null);
  const [voiceId, setVoiceId] = useState<string | null>(null);
  const [heat, setHeat] = useState<HeatLevel | null>(null);
  const [length, setLength] = useState<LengthPick>('any');

  const desire = useMemo(() => visibleCatalog.filter((f) => f.shelf === 'desire'), [visibleCatalog]);

  const matches = useMemo(() => {
    return desire
      .filter((f) => (mood ? f.moods.includes(mood) : true))
      .filter((f) => (voiceId ? f.voiceId === voiceId : true))
      .filter((f) => (heat ? f.variants.some((v) => v.heat === heat && heatAllowed(v.heat)) : true))
      .filter((f) => {
        if (length === 'any') return true;
        const mins = f.variants.map((v) => v.durationMin);
        return length === 'short' ? Math.min(...mins) <= 15 : Math.max(...mins) >= 16;
      })
      .sort((a, b) => b.rating - a.rating);
  }, [desire, mood, voiceId, heat, length, heatAllowed]);

  const hero = useMemo(() => {
    const pool = matches.length > 0 ? matches : desire;
    return [...pool].sort((a, b) => Number(b.id === 'f-back-to-yours') - Number(a.id === 'f-back-to-yours'))[0];
  }, [matches, desire]);

  const rest = matches.filter((f) => f.id !== hero?.id);

  const continueFamilies = continueList
    .map((e) => ({ entry: e, family: getFamily(e.familyId) }))
    .filter((x) => x.family && !x.family.tags.some((t) => prefs.hardLimits.includes(t)));

  const firstName = prefs.displayName.split(' ')[0];
  const hour = new Date().getHours();
  const hello = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <Screen>
      <Wordmark />
      <Display>
        {hello}
        {firstName ? `, ${firstName}` : ''}.
      </Display>
      <Caption>{eveningLine(hour)}</Caption>

      {hero && (
        <HeroCard
          family={hero}
          kicker={mood ? `for feeling ${MOODS.find((m) => m.id === mood)?.label.toLowerCase()}` : 'tonight'}
        />
      )}

      {continueFamilies.length > 0 && (
        <>
          <Heading>Pick up where you left off</Heading>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rail}>
            {continueFamilies.map(({ entry, family }) => (
              <View key={entry.familyId} style={styles.continueItem}>
                <SessionCard family={family!} compact />
                <Progress value={entry.progress} />
              </View>
            ))}
          </ScrollView>
        </>
      )}

      <Heading>How do you want to feel?</Heading>
      <ChipRow>
        {MOODS.map((m) => (
          <Chip key={m.id} label={m.label} selected={mood === m.id} onPress={() => setMood(mood === m.id ? null : m.id)} />
        ))}
      </ChipRow>
      <ChipRow>
        {(['comfort', 'slow-burn', 'spicy'] as HeatLevel[]).map((h) => (
          <Chip
            key={h}
            label={heatAllowed(h) ? HEAT_LABEL[h] : `${HEAT_LABEL[h]} · opt in`}
            selected={heat === h}
            onPress={() => heatAllowed(h) && setHeat(heat === h ? null : h)}
          />
        ))}
        <Chip label="Under 15 min" selected={length === 'short'} onPress={() => setLength(length === 'short' ? 'any' : 'short')} />
        <Chip label="Take your time" selected={length === 'long'} onPress={() => setLength(length === 'long' ? 'any' : 'long')} />
      </ChipRow>

      <Heading>Who’s talking</Heading>
      <VoiceRail selectedVoiceId={voiceId} onSelect={setVoiceId} />

      <Heading>{matches.length === 0 ? 'Nothing in that feeling' : 'More for tonight'}</Heading>
      {matches.length === 0 && <Caption>Stay with the pick above, or loosen a filter.</Caption>}
      {rest.map((f) => (
        <SessionCard key={f.id} family={f} />
      ))}

      <Caption style={styles.foot}>Written and reviewed before it reaches you.</Caption>
    </Screen>
  );
}

const styles = StyleSheet.create({
  rail: { marginTop: spacing.sm, marginHorizontal: -spacing.lg, paddingHorizontal: spacing.lg },
  continueItem: { width: 168, marginRight: spacing.md },
  foot: { marginTop: spacing.xl, textAlign: 'center' },
});
