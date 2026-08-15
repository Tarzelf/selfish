import React, { useEffect, useState } from 'react';
import { Platform, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { distance, duration, ease } from '@/motion/tokens';

const bezier = Easing.bezier(ease.smoothOut[0], ease.smoothOut[1], ease.smoothOut[2], ease.smoothOut[3]);

function NativeLine({
  children,
  index,
  shown,
}: {
  children: React.ReactNode;
  index: number;
  shown: boolean;
}) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withDelay(
      shown ? duration.stagger * index : 0,
      withTiming(shown ? 1 : 0, {
        duration: shown ? duration.verySlow : 200,
        easing: shown ? bezier : Easing.linear,
      }),
    );
  }, [shown, index, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * (shown ? distance.medium : 0) }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}

/** 18 — texts reveal. Headline + supporting lines rise with stagger + blur. */
export function TextsReveal({
  children,
  shown = true,
  style,
}: {
  children: React.ReactNode;
  shown?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const lines = React.Children.toArray(children);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);
  const isShown = shown && mounted;

  if (Platform.OS === 'web') {
    return (
      <View className={`t-stagger${isShown ? ' is-shown' : ''}`} style={style}>
        {lines.map((child, i) => (
          <View key={i} className={`t-stagger-line t-stagger-line--${i + 1}`}>
            {child}
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={style}>
      {lines.map((child, i) => (
        <NativeLine key={i} index={i} shown={isShown}>
          {child}
        </NativeLine>
      ))}
    </View>
  );
}
