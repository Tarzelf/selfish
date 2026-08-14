import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SessionCard } from '@/components/session-card';
import { Body, Caption, Chip, Display, Heading, Screen } from '@/components/ui';
import { fonts, palette, spacing } from '@/constants/theme';
import { getFamily, VOICES } from '@/data/catalog';
import { useAppState } from '@/lib/store';
import { HEAT_LABEL, type HeatLevel, MOODS, type Mood } from '@/lib/types';

type LengthPick = 'any' | 'short' | 'long';

export default function Tonight() {
  const { prefs, visibleCatalog, continueList, heatAllowed } = useAppState();

  const [mood, setMood] = useState<Mood | null>(prefs.moods[0] ?? null);
  const [voiceId, setVoiceId] = useState<string | null>(null);
  const [heat, setHeat] = useState<HeatLevel | null>(null);
  const [length, setLength] = useState<LengthPick>('any');

  const desire = useMemo(() => visibleCatalog.filter((f) => f.shelf === 'desire'), [visibleCatalog]);

  const matches = useMemo(() => {
    return desire
      .filter((f) => (mood ? f.moods.includes(mood) : true))
      .filter((f) => (voiceId ? f.voiceId === voiceId : true))
      .filter((f) =>
        heat ? f.variants.some((v) => v.heat === heat && heatAllowed(v.heat)) : true,
      )
      .filter((f) => {
        if (length === 'any') return true;
        const mins = f.variants.map((v) => v.durationMin);
        return length === 'short' ? Math.min(...mins) <= 15 : Math.max(...mins) >= 16;
      })
      .sort((a, b) => b.rating - a.rating);
  }, [desire, mood, voiceId, heat, length, heatAllowed]);

  const continueFamilies = continueList
    .map((e) => ({ entry: e, family: getFamily(e.familyId) }))
    .filter((x) => x.family && !x.family.tags.some((t) => prefs.hardLimits.includes(t)));

  const greeting = prefs.displayName ? `Good evening, ${prefs.displayName}.` : 'Good evening.';

  return (
    <Screen>
      <Display>{greeting}</Display>
      <Body dim>Tell us the feeling — we&apos;ll find the session.</Body>

      {continueFamilies.length > 0 && (
        <>
          <Heading>Continue</Heading>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rail}>
            {continueFamilies.map(({ entry, family }) => (
              <View key={entry.familyId}>
                <SessionCard family={family!} compact />
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${Math.round(entry.progress * 100)}%` }]} />
                </View>
              </View>
            ))}
          </ScrollView>
        </>
      )}

      <Heading>I want to feel…</Heading>
      <View style={styles.chipWrap}>
        {MOODS.map((m) => (
          <Chip key={m.id} label={m.label} selected={mood === m.id} onPress={() => setMood(mood === m.id ? null : m.id)} />
        ))}
      </View>

      <Heading>Voice</Heading>
      <View style={styles.chipWrap}>
        {VOICES.map((v) => (
          <Chip key={v.id} label={v.name} selected={voiceId === v.id} onPress={() => setVoiceId(voiceId === v.id ? null : v.id)} />
        ))}
      </View>

      <Heading>Heat & length</Heading>
      <View style={styles.chipWrap}>
        {(['comfort', 'slow-burn', 'spicy'] as HeatLevel[]).map((h) => (
          <Chip
            key={h}
            label={heatAllowed(h) ? HEAT_LABEL[h] : `${HEAT_LABEL[h]} · opt in`}
            selected={heat === h}
            onPress={() => heatAllowed(h) && setHeat(heat === h ? null : h)}
          />
        ))}
      </View>
      <View style={styles.chipWrap}>
        <Chip label="Any length" selected={length === 'any'} onPress={() => setLength('any')} />
        <Chip label="Under 15 min" selected={length === 'short'} onPress={() => setLength('short')} />
        <Chip label="Take your time" selected={length === 'long'} onPress={() => setLength('long')} />
      </View>

      <Heading>
        {matches.length > 0 ? 'Found for you' : 'Nothing matches — loosen a filter?'}
      </Heading>
      <Caption style={{ marginBottom: spacing.md }}>
        Every session is pre-produced and reviewed by our studio. Find your session — we never
        generate on the spot.
      </Caption>
      {matches.map((f) => (
        <SessionCard key={f.id} family={f} />
      ))}
      {matches.length === 0 && (
        <Text style={styles.empty}>Try clearing the voice or heat filter.</Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  rail: { marginTop: spacing.sm, marginHorizontal: -spacing.md, paddingHorizontal: spacing.md },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm },
  progressTrack: {
    height: 3,
    backgroundColor: palette.border,
    borderRadius: 2,
    marginRight: spacing.md,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
  progressFill: { height: 3, backgroundColor: palette.gold, borderRadius: 2 },
  empty: { fontFamily: fonts.body, color: palette.textFaint, fontSize: 14, marginTop: spacing.sm },
});
