import React, { useCallback, useEffect, useRef } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
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
  const barRef = useRef<View>(null);
  const tabRefs = useRef<Record<string, { offsetLeft: number; offsetWidth: number } | null>>({});
  const x = useSharedValue(0);
  const w = useSharedValue(0);
  const ready = useSharedValue(0);

  const moveWeb = useCallback(
    (animate: boolean) => {
      const bar = barRef.current as unknown as HTMLElement | null;
      const tab = tabRefs.current[selected];
      if (!bar || !tab) return;
      bar.querySelectorAll('.t-tab').forEach((el) => {
        const label = el.textContent?.trim();
        el.setAttribute('aria-selected', label === tabs.find((t) => t.id === selected)?.label ? 'true' : 'false');
      });
      const pill = bar.querySelector('.t-tabs-pill') as HTMLElement | null;
      if (!pill) return;
      if (!animate) {
        const prev = pill.style.transition;
        pill.style.transition = 'none';
        pill.style.transform = `translateX(${tab.offsetLeft}px)`;
        pill.style.width = `${tab.offsetWidth}px`;
        void pill.offsetWidth;
        pill.style.transition = prev;
      } else {
        pill.style.transform = `translateX(${tab.offsetLeft}px)`;
        pill.style.width = `${tab.offsetWidth}px`;
      }
    },
    [selected],
  );

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    requestAnimationFrame(() => moveWeb(false));
  }, [moveWeb]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    moveWeb(true);
  }, [selected, moveWeb]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
    width: w.value,
    opacity: ready.value,
  }));

  if (Platform.OS === 'web') {
    return (
      <View ref={barRef} className="t-tabs" style={styles.bar} accessibilityRole="tablist">
        <View className="t-tabs-pill" />
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            className="t-tab"
            accessibilityRole="tab"
            accessibilityState={{ selected: selected === tab.id }}
            ref={(node) => {
              tabRefs.current[tab.id] = node as unknown as { offsetLeft: number; offsetWidth: number } | null;
            }}
            onPress={() => onSelect(tab.id)}
          >
            <Text style={styles.webLabel}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>
    );
  }

  return (
    <View style={[styles.nativeBar, { backgroundColor: palette.surface }]} accessibilityRole="tablist">
      <Animated.View style={[styles.nativePill, { backgroundColor: palette.gold }, pillStyle]} />
      {tabs.map((tab) => (
        <Pressable
          key={tab.id}
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
          style={styles.nativeTab}
        >
          <Text style={[styles.nativeLabel, { color: palette.textFaint }, selected === tab.id && { color: palette.onAccent }]}>{tab.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { alignSelf: 'stretch', justifyContent: 'space-between' },
  webLabel: { fontFamily: fonts.body, fontSize: 13, fontWeight: '600', color: 'inherit' as unknown as string },
  nativeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 48,
    padding: 3,
    gap: 3,
  },
  nativePill: {
    position: 'absolute',
    top: 3,
    left: 0,
    height: 30,
    borderRadius: 48,
  },
  nativeTab: { flex: 1, height: 30, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  nativeLabel: { fontFamily: fonts.body, fontSize: 13, fontWeight: '600' },
});
