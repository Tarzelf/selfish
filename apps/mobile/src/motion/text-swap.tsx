import React, { useEffect, useRef, useState } from 'react';
import { Platform, Text, type StyleProp, type TextStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { distance, duration } from '@/motion/tokens';

/** 04 — text states swap. Old text exits up + blur; new text enters from below. */
export function TextSwap({
  text,
  style,
  numberOfLines,
}: {
  text: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}) {
  const [display, setDisplay] = useState(text);
  const elRef = useRef<HTMLSpanElement | null>(null);
  const phase = useSharedValue(0);

  useEffect(() => {
    if (text === display) return;
    if (Platform.OS === 'web') {
      const el = elRef.current;
      if (!el) {
        setDisplay(text);
        return;
      }
      el.classList.add('is-exit');
      const t = setTimeout(() => {
        setDisplay(text);
        el.classList.remove('is-exit');
        el.classList.add('is-enter-start');
        void el.offsetHeight;
        el.classList.remove('is-enter-start');
      }, duration.quick);
      return () => clearTimeout(t);
    }
    phase.value = withTiming(1, { duration: duration.quick, easing: Easing.inOut(Easing.ease) }, (done) => {
      if (done) {
        phase.value = -1;
        phase.value = withTiming(0, { duration: duration.quick, easing: Easing.inOut(Easing.ease) });
      }
    });
    const t = setTimeout(() => setDisplay(text), duration.quick);
    return () => clearTimeout(t);
  }, [text, display, phase]);

  if (Platform.OS === 'web') {
    return (
      <Text
        // @ts-expect-error web node for classList orchestration
        ref={elRef}
        className="t-text-swap"
        style={style}
        numberOfLines={numberOfLines}
      >
        {display}
      </Text>
    );
  }

  const anim = useAnimatedStyle(() => ({
    opacity: 1 - Math.abs(phase.value),
    transform: [{ translateY: phase.value * -distance.micro }],
  }));

  return (
    <Animated.Text style={[style, anim]} numberOfLines={numberOfLines}>
      {display}
    </Animated.Text>
  );
}
