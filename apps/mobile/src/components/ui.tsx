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

import { fonts, radius, spacing, TAB_ISLAND_SPACE } from '@/constants/theme';
import { useAtmosphere } from '@/lib/atmosphere';
import { HEAT_LABEL, type HeatLevel } from '@/lib/types';

/** react-native-web adds `hovered` to Pressable state; native ignores it. */
type PressState = PressableStateCallbackType & { hovered?: boolean };

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
      contentContainerStyle={{ paddingBottom: TAB_ISLAND_SPACE + insets.bottom + spacing.xl }}
      showsVerticalScrollIndicator={false}
    >
      {inner}
    </ScrollView>
  );
}

export function Display({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  const { palette } = useAtmosphere();
  return <Text style={[styles.display, { color: palette.text }, style]}>{children}</Text>;
}

export function Heading({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  const { palette } = useAtmosphere();
  return <Text style={[styles.heading, { color: palette.text }, style]}>{children}</Text>;
}

export function Body({ children, dim, style }: { children: React.ReactNode; dim?: boolean; style?: StyleProp<TextStyle> }) {
  const { palette } = useAtmosphere();
  return <Text style={[styles.body, { color: dim ? palette.textDim : palette.text }, style]}>{children}</Text>;
}

export function Caption({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  const { palette } = useAtmosphere();
  return <Text style={[styles.caption, { color: palette.textFaint }, style]}>{children}</Text>;
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
  const { palette } = useAtmosphere();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={(state: PressState) => [
        styles.button,
        kind === 'primary' && { backgroundColor: palette.gold },
        kind === 'ghost' && { backgroundColor: 'transparent', borderWidth: StyleSheet.hairlineWidth, borderColor: palette.border },
        kind === 'danger' && { backgroundColor: 'transparent', borderWidth: StyleSheet.hairlineWidth, borderColor: palette.danger },
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
  const { palette } = useAtmosphere();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={(state: PressState) => [
        styles.chip,
        { borderColor: palette.border, backgroundColor: palette.surface },
        selected && { backgroundColor: palette.goldSoft, borderColor: palette.gold },
        state.hovered && !selected && { borderColor: palette.textFaint },
        state.pressed && { opacity: 0.8 },
      ]}
    >
      <Text style={[styles.chipLabel, { color: palette.text }, selected && { color: palette.gold }]}>{label}</Text>
      {hint ? <Text style={[styles.chipHint, { color: palette.textFaint }]}>{hint}</Text> : null}
    </Pressable>
  );
}

export function HeatBadge({ heat, locked }: { heat: HeatLevel; locked?: boolean }) {
  const { heatColor } = useAtmosphere();
  const color = heatColor[heat];
  return (
    <View style={[styles.heatBadge, { backgroundColor: `${color}24` }]}>
      <Text style={[styles.heatLabel, { color }]}>
        {HEAT_LABEL[heat].toLowerCase()}
        {locked ? ' · opt in' : ''}
      </Text>
    </View>
  );
}

export function Card({ children, onPress, style }: { children: React.ReactNode; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  const { palette } = useAtmosphere();
  const look = [
    styles.card,
    { backgroundColor: palette.surface, borderColor: palette.borderSoft },
    style,
  ];
  if (!onPress) {
    return (
      <View className="t-glass-card" style={look}>
        {children}
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="t-glass-card"
      style={(state: PressState) => [
        ...look,
        state.hovered && { borderColor: palette.border, backgroundColor: palette.surfaceRaised },
        state.pressed && { backgroundColor: palette.surfacePressed },
      ]}
    >
      {children}
    </Pressable>
  );
}

export function Divider() {
  const { palette } = useAtmosphere();
  return <View style={[styles.divider, { backgroundColor: palette.borderSoft }]} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  shell: { flex: 1, width: '100%', maxWidth: SHELL_MAX_WIDTH, alignSelf: 'center' },
  display: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.6,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  heading: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  body: { fontFamily: fonts.body, fontSize: 17, lineHeight: 22, letterSpacing: -0.2 },
  caption: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, letterSpacing: -0.08 },
  button: {
    borderRadius: radius.pill,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonHovered: { transform: [{ scale: 1.01 }], opacity: 0.92 },
  buttonLabel: { fontFamily: fonts.body, fontSize: 16, fontWeight: '600', letterSpacing: -0.2 },
  chip: {
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipLabel: { fontFamily: fonts.body, fontSize: 14, fontWeight: '500', letterSpacing: -0.15 },
  chipHint: { fontFamily: fonts.body, fontSize: 11, marginTop: 2, letterSpacing: -0.05 },
  heatBadge: {
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: 11,
    alignSelf: 'flex-start',
  },
  heatLabel: { fontFamily: fonts.display, fontStyle: 'italic', fontSize: 13, letterSpacing: 0.2 },
  card: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: spacing.lg },
});
