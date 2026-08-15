import React, { useMemo } from 'react';

import { SessionCard } from '@/components/session-card';
import { Caption, Display, Screen } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { useAppState } from '@/lib/store';

export default function Rest() {
  const { visibleCatalog } = useAppState();
  const rest = useMemo(() => visibleCatalog.filter((f) => f.shelf === 'rest'), [visibleCatalog]);

  return (
    <Screen tone="rest">
      <Display>Rest</Display>
      <Caption style={{ marginBottom: spacing.xl }}>Nothing to follow, nowhere to be.</Caption>
      {rest.map((f) => (
        <SessionCard key={f.id} family={f} />
      ))}
    </Screen>
  );
}
