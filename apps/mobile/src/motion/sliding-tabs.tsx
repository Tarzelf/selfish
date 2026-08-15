import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { fonts } from '@/constants/theme';
import { useAtmosphere } from '@/lib/atmosphere';
import { duration, ease } from '@/motion/tokens';

const bezier = Easing.bezier(ease.smoothOut[0], ease.smoothOut[1], ease.smoothOut[2], ease.smoothOut[3]);

export function SlidingTabs({
  tabs,
  selected,
  onSelect,
}: {
  tabs: { id: string; label: string }[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  const { palette } = useAtmosphere();
  const x = useSharedValue(0);
  const w = useSharedValue(0);
  const ready = useSharedValue(0);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
    width: w.value,
    opacity: ready.value,
  }));

  return (
    <View
      className="t-tabs"
      style={[styles.bar, { backgroundColor: '#14141A', borderColor: palette.border }]}
      accessibilityRole="tablist"
    >
      <Animated.View className="t-tabs-pill" style={[styles.pill, { backgroundColor: palette.gold }, pillStyle]} />
      {tabs.map((tab) => (
        <Pressable
          key={tab.id}
          className="t-tab"
          accessibilityRole="tab"
          accessibilityState={{ selected: selected === tab.id }}
          onLayout={(e) => {
            if (tab.id !== selected) return;
            const { x: left, width } = e.nativeEvent.layout;
            const animate = ready.value === 1;
            if (!animate) {
              x.value = left;
              w.value = width;
              ready.value = 1;
            } else {
              x.value = withTiming(left, { duration: duration.fast, easing: bezier });
              w.value = withTiming(width, { duration: duration.fast, easing: bezier });
            }
          }}
          onPress={() => onSelect(tab.id)}
          style={styles.tab}
        >
          <Text style={[styles.label, { color: selected === tab.id ? palette.onAccent : palette.text }]}>{tab.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    alignSelf: 'stretch',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 48,
    padding: 3,
    gap: 3,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pill: {
    position: 'absolute',
    top: 3,
    left: 0,
    height: 30,
    borderRadius: 48,
  },
  tab: { flex: 1, height: 30, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  label: { fontFamily: fonts.body, fontSize: 13, fontWeight: '600' },
});
