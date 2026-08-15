import { Tabs } from 'expo-router';
import React from 'react';

import { GlassTabBar } from '@/components/glass-tab-bar';

export default function TabsLayout() {
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
