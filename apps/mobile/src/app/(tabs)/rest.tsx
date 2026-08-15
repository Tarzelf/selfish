import React, { useMemo } from 'react';

import { SessionCard } from '@/components/session-card';
import { Body, Caption, Display, Screen } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { useAppState } from '@/lib/store';

export default function Rest() {
  const { visibleCatalog } = useAppState();
  const rest = useMemo(() => visibleCatalog.filter((f) => f.shelf === 'rest'), [visibleCatalog]);

  return (
    <Screen tone="rest">
      <Display>Rest</Display>
      <Body dim style={{ marginBottom: spacing.md }}>
        Nothing to follow, nowhere to be.
      </Body>
      <Caption style={{ marginBottom: spacing.lg }}>Headphones. Lights low. They stay until you drift.</Caption>
      {rest.map((f) => (
        <SessionCard key={f.id} family={f} />
      ))}
    </Screen>
  );
}
