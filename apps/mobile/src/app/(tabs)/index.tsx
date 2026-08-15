import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { HeroCard } from '@/components/hero-card';
import { RitualHome } from '@/components/ritual-home';
import { SessionCard } from '@/components/session-card';
import { VoiceRail } from '@/components/voice-rail';
import { Caption, Chip, Heading, Screen } from '@/components/ui';
import { fonts, spacing } from '@/constants/theme';
import { getFamily } from '@/data/catalog';
import { useAtmosphere } from '@/lib/atmosphere';
import { useAppState } from '@/lib/store';
import { HEAT_LABEL, type HeatLevel, MOODS, type Mood } from '@/lib/types';

type LengthPick = 'any' | 'short' | 'long';

function partCopy(part: 'morning' | 'evening') {
  if (part === 'morning') {
    return {
      hello: 'Good morning',
      line: 'Linen still warm. The window is open.',
      kicker: "This morning",
      who: "Who's talking this morning?",
      more: 'More for this morning',
    };
  }
  return {
    hello: 'Good evening',
    line: 'The house is quiet. A summer night, in bed.',
    kicker: "Tonight's pick",
    who: "Who's in your ear tonight?",
    more: 'More for tonight',
  };
}

export default function Tonight() {
  const { prefs } = useAppState();
  if (prefs.heatCap === 'spicy') {
    return (
      <Screen>
        <RitualHome />
      </Screen>
    );
  }
  return <EditorialTonight />;
}

function EditorialTonight() {
  const { part, palette } = useAtmosphere();
  const copy = partCopy(part);
  const { prefs, visibleCatalog, continueList, heatAllowed } = useAppState();
  const [mood, setMood] = useState<Mood | null>(null);
  const [voiceId, setVoiceId] = useState<string | null>(null);
  const [heat, setHeat] = useState<HeatLevel | null>(null);
  const [length, setLength] = useState<LengthPick>('any');

  const desire = useMemo(
    () => visibleCatalog.filter((f) => f.shelf === 'desire' && f.format !== 'close'),
    [visibleCatalog],
  );

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
    .filter((x) => x.family && visibleCatalog.some((f) => f.id === x.family!.id));

  const firstName = prefs.displayName.split(' ')[0];

  return (
    <Screen>
      <View style={styles.wordmarkChip}>
        <Text style={[styles.wordmark, { color: palette.text }]}>Selfish</Text>
      </View>
      <Text style={[styles.greeting, { color: palette.text }]}>
        {copy.hello}
        {firstName ? `,\n${firstName}` : ''}.
      </Text>
      <Text style={[styles.subline, { color: palette.textDim }]}>{copy.line} Tell us the feeling — we&apos;ll find the session.</Text>

      {hero && <HeroCard family={hero} kicker={mood ? `For feeling ${MOODS.find((m) => m.id === mood)?.label.toLowerCase()}` : copy.kicker} />}

      {continueFamilies.length > 0 && (
        <>
          <Heading>Pick up where they left off</Heading>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rail}>
            {continueFamilies.map(({ entry, family }) => (
              <View key={entry.familyId}>
                <SessionCard family={family!} compact />
                <View style={[styles.progressTrack, { backgroundColor: palette.border }]}>
                  <View style={[styles.progressFill, { width: `${Math.round(entry.progress * 100)}%`, backgroundColor: palette.gold }]} />
                </View>
              </View>
            ))}
          </ScrollView>
        </>
      )}

      <Heading>How do you want to feel?</Heading>
      <View style={styles.chipWrap}>
        {MOODS.map((m) => (
          <Chip key={m.id} label={m.label} hint={m.hint} selected={mood === m.id} onPress={() => setMood(mood === m.id ? null : m.id)} />
        ))}
      </View>

      <Heading>{copy.who}</Heading>
      <Caption>Tap ▶ to hear them up close. Every voice is synthetic, honestly made — and sounds anything but.</Caption>
      <VoiceRail selectedVoiceId={voiceId} onSelect={setVoiceId} />

      <Heading>Fine-tune</Heading>
      <View style={styles.chipWrap}>
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
      </View>

      <Heading>{matches.length === 0 ? 'Nothing matches that exact feeling' : copy.more}</Heading>
      {matches.length === 0 && (
        <Caption style={{ marginBottom: spacing.md }}>Loosen a filter — or let the pick above surprise you.</Caption>
      )}
      {rest.map((f) => (
        <SessionCard key={f.id} family={f} />
      ))}

      <Caption style={styles.foot}>
        Every session is written, safety-reviewed, and produced before it reaches you. Nothing is
        generated while you listen. 🎧 Best with headphones.
        {prefs.heatCap !== 'spicy' ? ' The other room opens when you set heat to Close in You.' : ''}
      </Caption>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wordmarkChip: {
    alignSelf: 'flex-start',
    marginTop: spacing.lg,
    backgroundColor: '#121214',
    borderColor: 'rgba(245,245,247,0.14)',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  wordmark: {
    fontFamily: fonts.body,
    fontSize: 13,
    letterSpacing: -0.2,
    fontWeight: '700',
  },
  greeting: {
    fontFamily: fonts.display,
    fontSize: 52,
    lineHeight: 52,
    letterSpacing: -1.4,
    fontWeight: '700',
    marginTop: spacing.md,
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 28,
  },
  subline: {
    fontFamily: fonts.body,
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: -0.2,
    marginTop: 14,
    maxWidth: 420,
  },
  rail: { marginTop: spacing.sm, marginHorizontal: -spacing.md, paddingHorizontal: spacing.md },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm },
  progressTrack: {
    height: 2,
    borderRadius: 2,
    marginRight: spacing.md,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
  progressFill: { height: 2, borderRadius: 2 },
  foot: { marginTop: spacing.xl, textAlign: 'center' },
});
