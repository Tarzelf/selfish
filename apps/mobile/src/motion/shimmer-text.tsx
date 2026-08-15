import React, { useEffect } from 'react';
import { Platform, Text, type StyleProp, type TextStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

/** 15 — shimmer text. Alive "in progress" label; reduced-motion falls back to static. */
export function ShimmerText({
  text,
  style,
}: {
  text: string;
  style?: StyleProp<TextStyle>;
}) {
  const sweep = useSharedValue(0);
  useEffect(() => {
    sweep.value = withRepeat(withTiming(1, { duration: 2000, easing: Easing.linear }), -1, false);
  }, [sweep]);

  const native = useAnimatedStyle(() => ({
    opacity: 0.55 + sweep.value * 0.45,
  }));

  if (Platform.OS === 'web') {
    return (
      <Text className="t-shimmer" style={style} {...{ 'data-text': text }}>
        {text}
      </Text>
    );
  }

  return <Animated.Text style={[style, native]}>{text}</Animated.Text>;
}
