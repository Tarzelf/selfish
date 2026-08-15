import React, { useMemo } from 'react';

import { SessionCard } from '@/components/session-card';
import { Body, Caption, Display, Screen } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { useAppState } from '@/lib/store';

export default function Rest() {
  const { visibleCatalog } = useAppState();
  const rest = useMemo(() => visibleCatalog.filter((f) => f.shelf === 'rest'), [visibleCatalog]);

  return (
    <Screen>
      <Display>Rest</Display>
      <Body dim style={{ marginBottom: spacing.md }}>
        Nothing to follow, nowhere to be. Voices that read you down slowly, and stay until you drift.
      </Body>
      <Caption style={{ marginBottom: spacing.lg }}>
        Best with headphones and the lights low. Sessions fade out on their own.
      </Caption>
      {rest.map((f) => (
        <SessionCard key={f.id} family={f} />
      ))}
    </Screen>
  );
}
