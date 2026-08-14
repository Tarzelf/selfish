import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts, heatColor, palette, radius, spacing } from '@/constants/theme';
import { HEAT_LABEL, type HeatLevel } from '@/lib/types';

export function Screen({
  children,
  scroll = true,
  padded = true,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const pad = padded ? { paddingHorizontal: spacing.md } : null;
  if (!scroll) {
    return <View style={[styles.screen, { paddingTop: insets.top }, pad]}>{children}</View>;
  }
  return (
    <ScrollView
      style={[styles.screen, { paddingTop: insets.top }]}
      contentContainerStyle={[pad, { paddingBottom: spacing.xxl * 2 }]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

export function Display({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[styles.display, style]}>{children}</Text>;
}

export function Heading({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[styles.heading, style]}>{children}</Text>;
}

export function Body({ children, dim, style }: { children: React.ReactNode; dim?: boolean; style?: TextStyle }) {
  return <Text style={[styles.body, dim && { color: palette.textDim }, style]}>{children}</Text>;
}

export function Caption({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[styles.caption, style]}>{children}</Text>;
}

export function Button({
  label,
  onPress,
  kind = 'primary',
  disabled,
  style,
}: {
  label: string;
  onPress: () => void;
  kind?: 'primary' | 'ghost' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        kind === 'primary' && { backgroundColor: palette.gold },
        kind === 'ghost' && { backgroundColor: 'transparent', borderWidth: 1, borderColor: palette.border },
        kind === 'danger' && { backgroundColor: 'transparent', borderWidth: 1, borderColor: palette.danger },
        disabled && { opacity: 0.4 },
        pressed && !disabled && { opacity: 0.75 },
        style,
      ]}
    >
      <Text
        style={[
          styles.buttonLabel,
          kind === 'primary' && { color: palette.onAccent },
          kind === 'ghost' && { color: palette.text },
          kind === 'danger' && { color: palette.danger },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function Chip({
  label,
  selected,
  onPress,
  hint,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  hint?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && { backgroundColor: palette.goldSoft, borderColor: palette.gold },
        pressed && { opacity: 0.8 },
      ]}
    >
      <Text style={[styles.chipLabel, selected && { color: palette.gold }]}>{label}</Text>
      {hint ? <Text style={styles.chipHint}>{hint}</Text> : null}
    </Pressable>
  );
}

export function HeatBadge({ heat, locked }: { heat: HeatLevel; locked?: boolean }) {
  const color = heatColor[heat];
  return (
    <View style={[styles.heatBadge, { borderColor: color }]}>
      <View style={[styles.heatDot, { backgroundColor: color }]} />
      <Text style={[styles.heatLabel, { color }]}>
        {HEAT_LABEL[heat]}
        {locked ? ' · opt in' : ''}
      </Text>
    </View>
  );
}

export function Card({ children, onPress, style }: { children: React.ReactNode; onPress?: () => void; style?: ViewStyle }) {
  if (!onPress) return <View style={[styles.card, style]}>{children}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { backgroundColor: palette.surfacePressed }, style]}
    >
      {children}
    </Pressable>
  );
}

export function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg },
  display: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 40,
    color: palette.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  heading: {
    fontFamily: fonts.display,
    fontSize: 21,
    lineHeight: 28,
    color: palette.text,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24, color: palette.text },
  caption: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, color: palette.textFaint },
  button: {
    borderRadius: radius.pill,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: { fontFamily: fonts.body, fontSize: 16, fontWeight: '600' },
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipLabel: { fontFamily: fonts.body, fontSize: 14, color: palette.text, fontWeight: '500' },
  chipHint: { fontFamily: fonts.body, fontSize: 11, color: palette.textFaint, marginTop: 2 },
  heatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingVertical: 3,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    gap: 6,
  },
  heatDot: { width: 6, height: 6, borderRadius: 3 },
  heatLabel: { fontSize: 12, fontWeight: '600' },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  divider: { height: 1, backgroundColor: palette.borderSoft, marginVertical: spacing.lg },
});
