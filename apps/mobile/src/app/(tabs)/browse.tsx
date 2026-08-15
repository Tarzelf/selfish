import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SessionCard } from '@/components/session-card';
import { Body, Chip, Display, Heading, Screen } from '@/components/ui';
import { fonts, palette, spacing } from '@/constants/theme';
import { ALL_DYNAMICS, ALL_TAGS, VOICES } from '@/data/catalog';
import { useAppState } from '@/lib/store';

export default function Browse() {
  const { visibleCatalog, prefs } = useAppState();
  const [dynamics, setDynamics] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [voiceIds, setVoiceIds] = useState<string[]>([]);

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);

  const closeLoops = useMemo(
    () => visibleCatalog.filter((f) => f.format === 'close').sort((a, b) => b.rating - a.rating),
    [visibleCatalog],
  );
  const stories = useMemo(() => visibleCatalog.filter((f) => f.format === 'story'), [visibleCatalog]);

  const storyDynamics = useMemo(
    () => ALL_DYNAMICS.filter((d) => stories.some((f) => f.dynamic === d)),
    [stories],
  );
  const storyTags = useMemo(() => ALL_TAGS.filter((t) => stories.some((f) => f.tags.includes(t))), [stories]);

  const results = useMemo(
    () =>
      stories
        .filter((f) => (dynamics.length ? dynamics.includes(f.dynamic) : true))
        .filter((f) => (tags.length ? tags.every((t) => f.tags.includes(t)) : true))
        .filter((f) => (voiceIds.length ? voiceIds.includes(f.voiceId) : true))
        .sort((a, b) => b.rating - a.rating),
    [stories, dynamics, tags, voiceIds],
  );

  const activeCount = dynamics.length + tags.length + voiceIds.length;
  const spicy = prefs.heatCap === 'spicy';

  return (
    <Screen>
      <Display>{spicy ? 'More' : 'Browse'}</Display>
      <Body dim>
        {spicy
          ? 'Loops live on Tonight. This is for when you want a story — or a different mouth.'
          : 'Stack as many filters as you like. They all apply at once.'}
      </Body>

      {spicy && closeLoops.length > 0 && (
        <>
          <Heading>Loops</Heading>
          {closeLoops.map((f) => (
            <SessionCard key={f.id} family={f} />
          ))}
        </>
      )}

      <Heading>{spicy ? 'Stories' : 'Dynamic'}</Heading>
      {!spicy && (
        <View style={styles.chipWrap}>
          {storyDynamics.map((d) => (
            <Chip key={d} label={d} selected={dynamics.includes(d)} onPress={() => toggle(dynamics, setDynamics, d)} />
          ))}
        </View>
      )}

      {spicy && (
        <View style={styles.chipWrap}>
          {storyDynamics.map((d) => (
            <Chip key={d} label={d} selected={dynamics.includes(d)} onPress={() => toggle(dynamics, setDynamics, d)} />
          ))}
        </View>
      )}

      <Heading>Tags</Heading>
      <View style={styles.chipWrap}>
        {storyTags.map((t) => (
          <Chip key={t} label={t} selected={tags.includes(t)} onPress={() => toggle(tags, setTags, t)} />
        ))}
      </View>

      <Heading>Voice</Heading>
      <View style={styles.chipWrap}>
        {VOICES.map((v) => (
          <Chip
            key={v.id}
            label={`${v.name} (${v.gender})`}
            selected={voiceIds.includes(v.id)}
            onPress={() => toggle(voiceIds, setVoiceIds, v.id)}
          />
        ))}
      </View>

      <Heading>
        {results.length} {results.length === 1 ? 'story' : 'stories'}
        {activeCount > 0 ? ` · ${activeCount} ${activeCount === 1 ? 'filter' : 'filters'}` : ''}
      </Heading>
      {results.map((f) => (
        <SessionCard key={f.id} family={f} />
      ))}
      {results.length === 0 && <Text style={styles.empty}>No stories match that exact stack yet.</Text>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm },
  empty: { fontFamily: fonts.body, color: palette.textFaint, fontSize: 14, marginTop: spacing.sm },
});
