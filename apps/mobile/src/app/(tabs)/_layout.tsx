import { Slot, Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import { GlassTabBar, WebGlassTabBar } from '@/components/glass-tab-bar';

export default function TabsLayout() {
  // On web, React Navigation tabs keep every scene position:absolute. Even with
  // enableScreens, visited rooms stay painted and ghost through each other.
  // Slot mounts only the active route.
  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, overflow: 'hidden' }}>
        <Slot />
        <WebGlassTabBar />
      </View>
    );
  }

  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      detachInactiveScreens
      screenOptions={{
        headerShown: false,
        animation: 'none',
        lazy: true,
        freezeOnBlur: true,
        sceneStyle: { backgroundColor: 'transparent', flex: 1, overflow: 'hidden' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Today' }} />
      <Tabs.Screen name="browse" options={{ title: 'Browse' }} />
      <Tabs.Screen name="rest" options={{ title: 'Rest' }} />
      <Tabs.Screen name="you" options={{ title: 'You' }} />
    </Tabs>
  );
}
