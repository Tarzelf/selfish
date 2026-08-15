import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts, heatColor, palette, radius, spacing } from '@/constants/theme';
import { HEAT_HINT, HEAT_LABEL, type HeatLevel } from '@/lib/types';

const ORDER: HeatLevel[] = ['comfort', 'slow-burn', 'spicy'];

export function HeatChoice({
  value,
  onChange,
}: {
  value: HeatLevel;
  onChange: (h: HeatLevel) => void;
}) {
  return (
    <View style={styles.stack}>
      {ORDER.map((h) => {
        const selected = value === h;
        const color = heatColor[h];
        return (
          <Pressable
            key={h}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(h)}
            style={({ pressed }) => [
              styles.card,
              selected && { borderColor: color, backgroundColor: `${color}14` },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={[styles.label, selected && { color }]}>{HEAT_LABEL[h]}</Text>
            <Text style={styles.hint}>{HEAT_HINT[h]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: spacing.sm, marginTop: spacing.md },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  label: {
    fontFamily: fonts.display,
    fontStyle: 'italic',
    fontSize: 22,
    lineHeight: 28,
    color: palette.text,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: palette.textDim,
    marginTop: spacing.xs,
  },
});
