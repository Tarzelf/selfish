import React, { useEffect, useRef } from 'react';
import { Platform, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { distance, duration } from '@/motion/tokens';

/** 12 — error state shake. Replayable; message is orthogonal to the shake. */
export function ErrorField({
  children,
  error,
  message,
  style,
}: {
  children: React.ReactNode;
  error: boolean;
  message: string;
  style?: StyleProp<ViewStyle>;
}) {
  const wrapRef = useRef<View>(null);
  const inputRef = useRef<View>(null);
  const shake = useSharedValue(0);

  useEffect(() => {
    if (!error) return;
    if (Platform.OS === 'web') {
      const wrap = wrapRef.current as unknown as HTMLElement | null;
      const input = inputRef.current as unknown as HTMLElement | null;
      if (!wrap || !input) return;
      wrap.classList.add('is-error');
      input.classList.add('is-error');
      input.classList.remove('is-shaking');
      void input.offsetWidth;
      input.classList.add('is-shaking');
      const shakeMs = duration.micro * 2 + 60 * 2;
      const clearShake = setTimeout(() => input.classList.remove('is-shaking'), shakeMs + 20);
      const revert = setTimeout(() => {
        wrap.classList.remove('is-error');
        input.classList.remove('is-error');
      }, shakeMs + 3000);
      return () => {
        clearTimeout(clearShake);
        clearTimeout(revert);
      };
    }
    shake.value = withSequence(
      withTiming(distance.small, { duration: duration.micro, easing: Easing.out(Easing.cubic) }),
      withTiming(-distance.small, { duration: 60, easing: Easing.out(Easing.cubic) }),
      withTiming(distance.micro, { duration: duration.micro, easing: Easing.out(Easing.cubic) }),
      withTiming(0, { duration: 60, easing: Easing.out(Easing.cubic) }),
    );
  }, [error, shake]);

  const nativeShake = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));

  if (Platform.OS === 'web') {
    return (
      <View ref={wrapRef} className="t-input-wrap" style={style}>
        <View ref={inputRef} className="t-input">
          {children}
        </View>
        <Text className="t-error-msg">{message}</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[style, nativeShake]}>
      {children}
      {error ? <Text style={{ color: '#D96E7C', marginTop: 8, fontSize: 13 }}>{message}</Text> : null}
    </Animated.View>
  );
}
