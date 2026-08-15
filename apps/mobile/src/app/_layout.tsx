import { Stack, useGlobalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { palette } from '@/constants/theme';
import { AppStateProvider, useAppState } from '@/lib/store';
import { isWhopReturnSuccess } from '@/lib/whop';

function WhopReturnUnlock() {
  const params = useGlobalSearchParams();
  const { ready, prefs, activateWhopMembership } = useAppState();

  useEffect(() => {
    if (!ready || prefs.whopEntitledAt) return;
    if (isWhopReturnSuccess(params)) activateWhopMembership();
  }, [ready, prefs.whopEntitledAt, params, activateWhopMembership]);

  return null;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <WhopReturnUnlock />
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: palette.bg },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="session/[id]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="transparency" options={{ presentation: 'modal' }} />
        </Stack>
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
