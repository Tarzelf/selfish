import React, { useMemo, useState } from 'react';

import { SessionCard } from '@/components/session-card';
import { Body, Caption, Chip, ChipRow, Display, Heading, Screen } from '@/components/ui';
import { VOICES } from '@/data/catalog';
import { browseDynamics, browseTags } from '@/lib/catalog-access';
import { useAppState } from '@/lib/store';

export default function Browse() {
  const { visibleCatalog } = useAppState();
  const [dynamics, setDynamics] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [voiceIds, setVoiceIds] = useState<string[]>([]);

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);

  const desire = useMemo(() => visibleCatalog.filter((f) => f.shelf === 'desire'), [visibleCatalog]);
  const tagOptions = useMemo(() => browseTags(desire), [desire]);
  const dynamicOptions = useMemo(() => browseDynamics(desire), [desire]);

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
      <Body dim>Stack as many as you like. They all apply at once.</Body>

      <Heading>Dynamic</Heading>
      <ChipRow>
        {dynamicOptions.map((d) => (
          <Chip key={d} label={d} selected={dynamics.includes(d)} onPress={() => toggle(dynamics, setDynamics, d)} />
        ))}
      </ChipRow>

      <Heading>Tags</Heading>
      <ChipRow>
        {tagOptions.map((t) => (
          <Chip key={t} label={t} selected={tags.includes(t)} onPress={() => toggle(tags, setTags, t)} />
        ))}
      </ChipRow>

      <Heading>Voice</Heading>
      <ChipRow>
        {VOICES.map((v) => (
          <Chip
            key={v.id}
            label={v.name}
            selected={voiceIds.includes(v.id)}
            onPress={() => toggle(voiceIds, setVoiceIds, v.id)}
          />
        ))}
      </ChipRow>

      <Heading>
        {results.length} {results.length === 1 ? 'session' : 'sessions'}
        {activeCount > 0 ? ` · ${activeCount} ${activeCount === 1 ? 'filter' : 'filters'}` : ''}
      </Heading>
      {results.map((f) => (
        <SessionCard key={f.id} family={f} />
      ))}
      {results.length === 0 && <Caption>Nothing matches that stack yet.</Caption>}
    </Screen>
  );
}
