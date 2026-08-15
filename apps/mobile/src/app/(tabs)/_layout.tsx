import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

import { fonts, palette } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.bone,
        tabBarInactiveTintColor: palette.boneMute,
        tabBarStyle: {
          backgroundColor: palette.ink,
          borderTopColor: palette.line,
          borderTopWidth: StyleSheet.hairlineWidth,
        },
        tabBarLabelStyle: { fontFamily: fonts.body, fontSize: 13, fontWeight: '400' },
        tabBarIcon: () => null,
        tabBarIconStyle: { height: 0, width: 0, overflow: 'hidden' },
        sceneStyle: { backgroundColor: palette.ink },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Tonight' }} />
      <Tabs.Screen name="browse" options={{ title: 'Browse' }} />
      <Tabs.Screen name="rest" options={{ title: 'Rest' }} />
      <Tabs.Screen name="you" options={{ title: 'You' }} />
    </Tabs>
  );
}
