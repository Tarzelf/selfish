import { Tabs } from 'expo-router';
import React from 'react';
import { type ColorValue, Text } from 'react-native';

import { fonts, palette } from '@/constants/theme';

function glyphIcon(glyph: string) {
  return function TabGlyph({ color }: { color: ColorValue; focused: boolean; size: number }) {
    return <Text style={{ fontSize: 17, color, fontFamily: fonts.body }}>{glyph}</Text>;
  };
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.gold,
        tabBarInactiveTintColor: palette.textFaint,
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopColor: palette.borderSoft,
        },
        tabBarLabelStyle: { fontFamily: fonts.body, fontSize: 11, fontWeight: '600' },
        sceneStyle: { backgroundColor: palette.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Tonight', tabBarIcon: glyphIcon('✦') }} />
      <Tabs.Screen name="browse" options={{ title: 'Browse', tabBarIcon: glyphIcon('❋') }} />
      <Tabs.Screen name="rest" options={{ title: 'Rest', tabBarIcon: glyphIcon('☾') }} />
      <Tabs.Screen name="you" options={{ title: 'You', tabBarIcon: glyphIcon('❦') }} />
    </Tabs>
  );
}
