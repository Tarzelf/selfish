import {
  Newsreader_400Regular,
  Newsreader_400Regular_Italic,
  useFonts,
} from '@expo-google-fonts/newsreader';
import { Stack, useGlobalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
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
  const [fontsLoaded, fontError] = useFonts({
    Newsreader: Newsreader_400Regular,
    NewsreaderItalic: Newsreader_400Regular_Italic,
  });
  const [fontWaitOver, setFontWaitOver] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFontWaitOver(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const waitingOnFonts = !fontsLoaded && !fontError && !fontWaitOver;

  return (
    <>
      <Head>
        <title>Selfish</title>
        <meta name="description" content="Intimate audio for rest and desire." />
      </Head>
      {waitingOnFonts ? (
        <View style={{ flex: 1, backgroundColor: palette.ink }} />
      ) : (
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
      )}
    </>
  );
}
