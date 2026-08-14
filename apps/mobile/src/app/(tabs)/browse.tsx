import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SessionCard } from '@/components/session-card';
import { Body, Chip, Display, Heading, Screen } from '@/components/ui';
import { fonts, palette, spacing } from '@/constants/theme';
import { ALL_DYNAMICS, ALL_TAGS, VOICES } from '@/data/catalog';
import { useAppState } from '@/lib/store';

export default function Browse() {
  const { visibleCatalog } = useAppState();
  const [dynamics, setDynamics] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [voiceIds, setVoiceIds] = useState<string[]>([]);

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);

  const desire = useMemo(() => visibleCatalog.filter((f) => f.shelf === 'desire'), [visibleCatalog]);

  // Multi-tag AND filtering — the thing the incumbents still don't do.
  const results = useMemo(
    () =>
      desire
        .filter((f) => (dynamics.length ? dynamics.includes(f.dynamic) : true))
        .filter((f) => (tags.length ? tags.every((t) => f.tags.includes(t)) : true))
        .filter((f) => (voiceIds.length ? voiceIds.includes(f.voiceId) : true))
        .sort((a, b) => b.rating - a.rating),
    [desire, dynamics, tags, voiceIds],
  );

  const activeCount = dynamics.length + tags.length + voiceIds.length;

  return (
    <Screen>
      <Display>Browse</Display>
      <Body dim>Stack as many filters as you like. They all apply at once.</Body>

      <Heading>Dynamic</Heading>
      <View style={styles.chipWrap}>
        {ALL_DYNAMICS.map((d) => (
          <Chip key={d} label={d} selected={dynamics.includes(d)} onPress={() => toggle(dynamics, setDynamics, d)} />
        ))}
      </View>

      <Heading>Tags</Heading>
      <View style={styles.chipWrap}>
        {ALL_TAGS.map((t) => (
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
        {results.length} {results.length === 1 ? 'session' : 'sessions'}
        {activeCount > 0 ? ` · ${activeCount} ${activeCount === 1 ? 'filter' : 'filters'}` : ''}
      </Heading>
      {results.map((f) => (
        <SessionCard key={f.id} family={f} />
      ))}
      {results.length === 0 && <Text style={styles.empty}>No sessions match that exact stack yet. New sessions ship weekly.</Text>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm },
  empty: { fontFamily: fonts.body, color: palette.textFaint, fontSize: 14, marginTop: spacing.sm },
});
