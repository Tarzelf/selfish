import React from 'react';
import { Platform, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { duration } from '@/motion/tokens';

/** 09 — icon swap. Two glyphs stacked; data-state a/b cross-fades with blur + scale. */
export function IconSwap({
  state,
  a,
  b,
  style,
  glyphStyle,
}: {
  state: 'a' | 'b';
  a: string;
  b: string;
  style?: StyleProp<ViewStyle>;
  glyphStyle?: StyleProp<TextStyle>;
}) {
  if (Platform.OS === 'web') {
    return (
      <View className="t-icon-swap" style={style} {...{ 'data-state': state }}>
        <Text className="t-icon" style={glyphStyle} {...{ 'data-icon': 'a' }}>
          {a}
        </Text>
        <Text className="t-icon" style={glyphStyle} {...{ 'data-icon': 'b' }}>
          {b}
        </Text>
      </View>
    );
  }

  const aStyle = useAnimatedStyle(() => ({
    opacity: withTiming(state === 'a' ? 1 : 0, { duration: duration.fast, easing: Easing.inOut(Easing.ease) }),
    transform: [
      { scale: withTiming(state === 'a' ? 1 : 0.25, { duration: duration.fast, easing: Easing.inOut(Easing.ease) }) },
    ],
  }));
  const bStyle = useAnimatedStyle(() => ({
    opacity: withTiming(state === 'b' ? 1 : 0, { duration: duration.fast, easing: Easing.inOut(Easing.ease) }),
    transform: [
      { scale: withTiming(state === 'b' ? 1 : 0.25, { duration: duration.fast, easing: Easing.inOut(Easing.ease) }) },
    ],
  }));

  return (
    <View style={[{ alignItems: 'center', justifyContent: 'center' }, style]}>
      <Animated.Text style={[{ position: 'absolute' }, glyphStyle, aStyle]}>{a}</Animated.Text>
      <Animated.Text style={[{ position: 'absolute' }, glyphStyle, bStyle]}>{b}</Animated.Text>
      <Text style={[glyphStyle, { opacity: 0 }]}>{a}</Text>
    </View>
  );
}
