import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts, radius, spacing } from '@/constants/theme';
import { useAtmosphere } from '@/lib/atmosphere';
import { HEAT_HINT, HEAT_LABEL, type HeatLevel } from '@/lib/types';

const ORDER: HeatLevel[] = ['comfort', 'slow-burn', 'spicy'];

export function HeatChoice({
  value,
  onChange,
}: {
  value: HeatLevel;
  onChange: (h: HeatLevel) => void;
}) {
  const { palette, heatColor } = useAtmosphere();
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
              { borderColor: selected ? color : palette.border, backgroundColor: selected ? `${color}14` : palette.surface },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={[styles.label, { color: selected ? color : palette.text }]}>{HEAT_LABEL[h]}</Text>
            <Text style={[styles.hint, { color: palette.textDim }]}>{HEAT_HINT[h]}</Text>
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
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  label: {
    fontFamily: fonts.display,
    fontStyle: 'italic',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs,
    letterSpacing: -0.1,
  },
});
