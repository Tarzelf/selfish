import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import React from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useAtmosphere } from '@/lib/atmosphere';

/**
 * Dark liquid glass. iOS 26 uses the system material; web matches Talkify's
 * nav: blur(24) saturate(1.4), #0c0c108c, hairline, no milky frost.
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
        colorScheme="dark"
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
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  island: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  web: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
});
