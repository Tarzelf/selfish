import {
  Newsreader_400Regular,
  Newsreader_400Regular_Italic,
  useFonts,
} from '@expo-google-fonts/newsreader';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View } from 'react-native';
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
  const [fontsLoaded] = useFonts({
    Newsreader: Newsreader_400Regular,
    NewsreaderItalic: Newsreader_400Regular_Italic,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: palette.ink }} />;
  }

  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <WhopReturnUnlock />
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: palette.ink },
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
