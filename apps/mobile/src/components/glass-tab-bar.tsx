import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LiquidGlass } from '@/components/liquid-glass';
import { TabIcon } from '@/components/tab-icons';
import { fonts } from '@/constants/theme';
import { useAtmosphere } from '@/lib/atmosphere';

const LABEL: Record<string, string> = {
  index: 'Today',
  browse: 'Browse',
  rest: 'Rest',
  you: 'You',
};

export function GlassTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { part, palette } = useAtmosphere();

  return (
    <View pointerEvents="box-none" style={[styles.dock, { paddingBottom: Math.max(insets.bottom, 14) }]}>
      <LiquidGlass island style={styles.island}>
        <View style={styles.row}>
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const color = focused ? palette.text : palette.textFaint;
            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={{ selected: focused }}
                accessibilityLabel={LABEL[route.name] ?? route.name}
                onPress={() => {
                  const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                  if (!focused && !event.defaultPrevented) {
                    navigation.navigate(route.name, route.params);
                  }
                }}
                style={({ pressed }) => [styles.item, pressed && { opacity: 0.7 }]}
              >
                {focused ? <View className="t-tab-pill" style={styles.pill} /> : null}
                <TabIcon name={route.name} color={focused ? palette.gold : color} focused={focused} part={part} />
                <Text style={[styles.label, { color: focused ? palette.text : palette.textFaint }]}>
                  {LABEL[route.name] ?? route.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </LiquidGlass>
    </View>
  );
}

const styles = StyleSheet.create({
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  island: {
    width: '100%',
    maxWidth: 360,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    minHeight: 48,
    borderRadius: 999,
    overflow: 'hidden',
  },
  pill: {
    position: 'absolute',
    top: 3,
    right: 4,
    bottom: 3,
    left: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 150, 80, 0.14)',
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '600',
    letterSpacing: -0.1,
    marginTop: 3,
  },
});
