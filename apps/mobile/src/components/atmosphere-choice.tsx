import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts, radius, spacing } from '@/constants/theme';
import { useAtmosphere } from '@/lib/atmosphere';
import type { AtmospherePref } from '@/lib/types';

const OPTIONS: { id: AtmospherePref; label: string; hint: string }[] = [
  { id: 'auto', label: 'Auto', hint: 'Follows the clock. Morning until 5pm, then evening.' },
  { id: 'morning', label: 'Morning', hint: 'Mist, first light. The window is open.' },
  { id: 'evening', label: 'Evening', hint: 'A summer night. Stars over the ridge. In bed.' },
];

export function AtmosphereChoice({
  value,
  onChange,
}: {
  value: AtmospherePref;
  onChange: (v: AtmospherePref) => void;
}) {
  const { palette } = useAtmosphere();
  return (
    <View style={styles.stack}>
      {OPTIONS.map((o) => {
        const selected = value === o.id;
        return (
          <Pressable
            key={o.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(o.id)}
            style={({ pressed }) => [
              styles.card,
              {
                borderColor: selected ? 'rgba(255,180,87,0.65)' : 'rgba(245,245,247,0.22)',
                backgroundColor: selected ? 'rgba(255,150,80,0.14)' : 'rgba(10,10,14,0.4)',
              },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={[styles.label, { color: selected ? palette.gold : palette.text }]}>{o.label}</Text>
            <Text style={[styles.hint, { color: palette.textDim }]}>{o.hint}</Text>
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
  label: { fontFamily: fonts.display, fontStyle: 'italic', fontSize: 22, lineHeight: 28, letterSpacing: -0.3 },
  hint: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, marginTop: spacing.xs, letterSpacing: -0.1 },
});
