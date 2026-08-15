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
    <View pointerEvents="box-none" style={[styles.dock, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <LiquidGlass island style={styles.island}>
        <View style={styles.row}>
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const color = focused ? palette.gold : palette.textFaint;
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
                style={({ pressed }) => [styles.item, pressed && { opacity: 0.72 }]}
              >
                {focused ? <View className="t-tab-pill" style={[styles.pill, { backgroundColor: palette.goldSoft }]} /> : null}
                <TabIcon name={route.name} color={color} focused={focused} part={part} />
                <Text style={[styles.label, { color }]}>{LABEL[route.name] ?? route.name}</Text>
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
    paddingHorizontal: 20,
  },
  island: {
    width: '100%',
    maxWidth: 400,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    minHeight: 52,
    borderRadius: 22,
    overflow: 'hidden',
  },
  pill: {
    position: 'absolute',
    top: 3,
    right: 4,
    bottom: 3,
    left: 4,
    borderRadius: 20,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginTop: 4,
  },
});
