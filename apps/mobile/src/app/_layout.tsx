import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AtmosphereSky } from '@/components/atmosphere-sky';
import { AtmosphereProvider, useAtmosphere } from '@/lib/atmosphere';
import { AppStateProvider } from '@/lib/store';

import '@/styles/transitions-root.css';
import '@/styles/transitions.css';
import '@/styles/atmosphere.css';

// Web defaults this off. Without it, every tab/stack scene is position:absolute
// and stays painted — Today, Browse, and Rest ghost through each other.
enableScreens(true);

function ThemedStack() {
  const { palette } = useAtmosphere();
  return (
    <View style={{ flex: 1, backgroundColor: '#060608', overflow: 'hidden' }}>
      <AtmosphereSky />
      <StatusBar style={palette.status} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
          contentStyle: { backgroundColor: 'transparent', flex: 1 },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="session/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="transparency" options={{ presentation: 'modal' }} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <AtmosphereProvider>
          <ThemedStack />
        </AtmosphereProvider>
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
