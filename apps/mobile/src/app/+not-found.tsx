import { useRouter } from 'expo-router';
import React from 'react';

import { Body, Button, Display, Screen } from '@/components/ui';
import { spacing } from '@/constants/theme';

export default function NotFound() {
  const router = useRouter();
  return (
    <Screen scroll={false}>
      <Display>This page isn’t here.</Display>
      <Body dim style={{ marginBottom: spacing.lg }}>
        Let’s take you back.
      </Body>
      <Button label="Go home" onPress={() => router.replace('/')} />
    </Screen>
  );
}
