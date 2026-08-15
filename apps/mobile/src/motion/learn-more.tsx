import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAtmosphere } from '@/lib/atmosphere';

/** 24 — learn more hover. Chevron slides and opens into an arrow. */
export function LearnMore({ label, onPress }: { label: string; onPress: () => void }) {
  const { palette } = useAtmosphere();
  if (Platform.OS === 'web') {
    return (
      <Pressable accessibilityRole="button" onPress={onPress} className="t-learn" style={styles.row}>
        <Text style={[styles.label, { color: palette.textFaint }]}>{label}</Text>
        <View className="t-learn-chevron">
          {React.createElement(
            'svg',
            { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
            React.createElement('path', {
              className: 't-learn-arm t-learn-arm-top',
              d: 'M6 4L10 8',
              stroke: 'currentColor',
              strokeWidth: '1.5',
            }),
            React.createElement('path', {
              className: 't-learn-arm t-learn-arm-bot',
              d: 'M10 8L6 12',
              stroke: 'currentColor',
              strokeWidth: '1.5',
            }),
          )}
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.row}>
      <Text style={[styles.label, { color: palette.textFaint }]}>{label} →</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 8,
  },
  label: { fontSize: 14, letterSpacing: -0.1 },
});
