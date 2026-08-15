import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import React from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useAtmosphere } from '@/lib/atmosphere';

/**
 * iOS 26+ uses real Liquid Glass. Web gets the same material language:
 * saturate + blur, specular rim, inner highlight. Unsupported native
 * platforms fall back to a translucent plate.
 */
export function LiquidGlass({
  children,
  style,
  island = false,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  island?: boolean;
}) {
  const { part, palette } = useAtmosphere();
  const native = Platform.OS === 'ios' && isLiquidGlassAvailable();

  if (native) {
    return (
      <GlassView
        glassEffectStyle="regular"
        tintColor={palette.glassTint}
        colorScheme={part === 'morning' ? 'light' : 'dark'}
        isInteractive
        style={[island && styles.island, style]}
      >
        {children}
      </GlassView>
    );
  }

  return (
    <View
      className={`t-liquid-glass${island ? ' t-liquid-glass--island' : ''}`}
      style={[
        styles.web,
        island && styles.island,
        {
          borderColor: palette.glassBorder,
          backgroundColor: Platform.OS === 'web' ? 'transparent' : palette.glassTint,
        },
        style,
      ]}
      {...{ 'data-part': part }}
    >
      <View pointerEvents="none" style={styles.spec} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  island: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  web: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  spec: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.58)',
  },
});
