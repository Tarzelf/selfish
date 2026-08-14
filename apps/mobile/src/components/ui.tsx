import React from 'react';
import {
  Pressable,
  type PressableStateCallbackType,
  ScrollView,
  type StyleProp,
  StyleSheet,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts, heatColor, palette, radius, spacing } from '@/constants/theme';
import { HEAT_LABEL, type HeatLevel } from '@/lib/types';

/** react-native-web adds `hovered` to Pressable state; native ignores it. */
type PressState = PressableStateCallbackType & { hovered?: boolean };

/** Content column: full-width on phones, centered column on desktop web. */
const SHELL_MAX_WIDTH = 760;

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
  const inner = (
    <View style={[styles.shell, padded && { paddingHorizontal: spacing.md }]}>{children}</View>
  );
  if (!scroll) {
    return <View style={[styles.screen, { paddingTop: insets.top }]}>{inner}</View>;
  }
  return (
    <ScrollView
      style={[styles.screen, { paddingTop: insets.top }]}
      contentContainerStyle={{ paddingBottom: spacing.xxl * 2 }}
      showsVerticalScrollIndicator={false}
    >
      {inner}
    </ScrollView>
  );
}

export function Display({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.display, style]}>{children}</Text>;
}

export function Heading({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.heading, style]}>{children}</Text>;
}

export function Body({ children, dim, style }: { children: React.ReactNode; dim?: boolean; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.body, dim && { color: palette.textDim }, style]}>{children}</Text>;
}

export function Caption({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
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
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={(state: PressState) => [
        styles.button,
        kind === 'primary' && { backgroundColor: palette.gold },
        kind === 'ghost' && { backgroundColor: 'transparent', borderWidth: 1, borderColor: palette.border },
        kind === 'danger' && { backgroundColor: 'transparent', borderWidth: 1, borderColor: palette.danger },
        state.hovered && !disabled && styles.buttonHovered,
        disabled && { opacity: 0.4 },
        state.pressed && !disabled && { opacity: 0.75 },
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
      style={(state: PressState) => [
        styles.chip,
        selected && { backgroundColor: palette.goldSoft, borderColor: palette.gold },
        state.hovered && !selected && { borderColor: palette.textFaint },
        state.pressed && { opacity: 0.8 },
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

export function Card({ children, onPress, style }: { children: React.ReactNode; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  if (!onPress) return <View style={[styles.card, style]}>{children}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={(state: PressState) => [
        styles.card,
        state.hovered && styles.cardHovered,
        state.pressed && { backgroundColor: palette.surfacePressed },
        style,
      ]}
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
  shell: { flex: 1, width: '100%', maxWidth: SHELL_MAX_WIDTH, alignSelf: 'center' },
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
  buttonHovered: { transform: [{ scale: 1.01 }], opacity: 0.92 },
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
  cardHovered: { borderColor: palette.border, backgroundColor: palette.surfaceRaised },
  divider: { height: 1, backgroundColor: palette.borderSoft, marginVertical: spacing.lg },
});
