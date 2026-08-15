import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  type PressableStateCallbackType,
  ScrollView,
  type StyleProp,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts, heatColor, palette, radius, spacing, type } from '@/constants/theme';
import { HEAT_LABEL, type HeatLevel } from '@/lib/types';

type PressState = PressableStateCallbackType & { hovered?: boolean };

const SHELL_MAX_WIDTH = 640;

export function Screen({
  children,
  scroll = true,
  padded = true,
  tone = 'desire',
}: {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  tone?: 'desire' | 'rest';
}) {
  const insets = useSafeAreaInsets();
  const bg = tone === 'rest' ? palette.restInk : palette.ink;
  const inner = (
    <View style={[styles.shell, padded && { paddingHorizontal: spacing.md }]}>{children}</View>
  );
  if (!scroll) {
    return <View style={[styles.screen, { backgroundColor: bg, paddingTop: insets.top }]}>{inner}</View>;
  }
  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: bg, paddingTop: insets.top }]}
      contentContainerStyle={{ paddingBottom: spacing.xxl * 2 }}
      showsVerticalScrollIndicator={false}
    >
      {inner}
    </ScrollView>
  );
}

export function Wordmark({ style }: { style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.wordmark, style]}>Selfish</Text>;
}

type TextProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
};

export function Display({ children, style, numberOfLines }: TextProps) {
  return (
    <Text style={[styles.display, style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
}

export function Title({ children, style, numberOfLines }: TextProps) {
  return (
    <Text style={[styles.title, style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
}

export function Heading({ children, style, numberOfLines }: TextProps) {
  return (
    <Text style={[styles.heading, style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
}

export function Body({ children, dim, style, numberOfLines }: TextProps & { dim?: boolean }) {
  return (
    <Text style={[styles.body, dim && { color: palette.boneDim }, style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
}

export function Caption({ children, style, numberOfLines }: TextProps) {
  return (
    <Text style={[styles.caption, style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
}

export function TextLink({
  label,
  onPress,
  danger,
}: {
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} hitSlop={8}>
      <Text style={[styles.textLink, danger && { color: palette.danger }]}>{label}</Text>
    </Pressable>
  );
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
        kind === 'primary' && styles.buttonPrimary,
        kind === 'ghost' && styles.buttonGhost,
        kind === 'danger' && styles.buttonDanger,
        state.hovered && !disabled && { opacity: 0.88 },
        disabled && { opacity: 0.35 },
        state.pressed && !disabled && { opacity: 0.7 },
        style,
      ]}
    >
      <Text
        style={[
          styles.buttonLabel,
          kind === 'primary' && { color: palette.onBone },
          kind === 'ghost' && { color: palette.bone },
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
        selected && styles.chipSelected,
        state.pressed && { opacity: 0.7 },
      ]}
    >
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{label}</Text>
      {hint ? <Text style={styles.chipHint}>{hint}</Text> : null}
    </Pressable>
  );
}

export function ChipRow({ children }: { children: React.ReactNode }) {
  return <View style={styles.chipRow}>{children}</View>;
}

export function HeatBadge({ heat, locked }: { heat: HeatLevel; locked?: boolean }) {
  return (
    <Text style={[styles.heatLabel, { color: heatColor[heat] }]}>
      {HEAT_LABEL[heat].toLowerCase()}
      {locked ? ' · opt in' : ''}
    </Text>
  );
}

export function Card({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  if (!onPress) return <View style={[styles.card, style]}>{children}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={(state: PressState) => [
        styles.card,
        state.hovered && { backgroundColor: palette.inkHigh },
        state.pressed && { opacity: 0.88 },
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

export function PlayControl({
  playing,
  onPress,
  size = 'md',
  label,
}: {
  playing: boolean;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  label: string;
}) {
  const px = size === 'sm' ? 36 : size === 'lg' ? 64 : 48;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.play,
        { width: px, height: px, borderRadius: px / 2 },
        pressed && { opacity: 0.75 },
      ]}
    >
      <Text style={[styles.playGlyph, { fontSize: px * 0.32 }]}>{playing ? '❚❚' : '▶'}</Text>
    </Pressable>
  );
}

export function Progress({ value, style }: { value: number; style?: StyleProp<ViewStyle> }) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <View style={[styles.progressTrack, style]}>
      <View style={[styles.progressFill, { width: `${pct}%` }]} />
    </View>
  );
}

export function HitLabel({
  label,
  onPress,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      hitSlop={12}
    >
      <Text style={styles.hitLabel}>{label}</Text>
    </Pressable>
  );
}

export function Field({
  kind = 'box',
  style,
  ...rest
}: TextInputProps & { kind?: 'box' | 'quiet' }) {
  return (
    <TextInput
      placeholderTextColor={palette.boneMute}
      style={[kind === 'quiet' ? styles.fieldQuiet : styles.field, style]}
      {...rest}
    />
  );
}

export function NumeralField({ style, ...rest }: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={palette.boneMute}
      keyboardType="number-pad"
      style={[styles.numeral, style]}
      {...rest}
    />
  );
}

export function Choice({
  label,
  hint,
  selected,
  onPress,
}: {
  label: string;
  hint?: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={(state: PressState) => [
        styles.choice,
        selected && styles.choiceSelected,
        state.pressed && { opacity: 0.88 },
      ]}
    >
      <Text style={[styles.choiceLabel, selected && styles.choiceLabelOn]}>{label}</Text>
      {hint ? <Text style={styles.choiceHint}>{hint}</Text> : null}
    </Pressable>
  );
}

export function ChoiceStack({ children }: { children: React.ReactNode }) {
  return <View style={styles.choiceStack}>{children}</View>;
}

export function StepScreen({
  chrome,
  children,
  dock,
  keyboard,
}: {
  chrome?: React.ReactNode;
  children: React.ReactNode;
  dock?: React.ReactNode;
  keyboard?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const frame = (
    <View style={[styles.screen, { backgroundColor: palette.ink, paddingTop: insets.top }]}>
      <View style={[styles.shell, { paddingHorizontal: spacing.md }]}>
        {chrome}
        <ScrollView
          style={styles.stepScroll}
          contentContainerStyle={styles.stepBody}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
        {dock ? (
          <View style={[styles.dock, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>{dock}</View>
        ) : null}
      </View>
    </View>
  );
  if (!keyboard) return frame;
  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: palette.ink }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {frame}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  shell: { flex: 1, width: '100%', maxWidth: SHELL_MAX_WIDTH, alignSelf: 'center' },
  wordmark: { ...type.wordmark, marginTop: spacing.lg },
  display: { ...type.display, marginTop: spacing.sm, marginBottom: spacing.sm },
  title: { ...type.title },
  heading: { ...type.heading, marginTop: spacing.xl, marginBottom: spacing.sm },
  body: { ...type.body },
  caption: { ...type.caption },
  textLink: { ...type.body, color: palette.boneDim, paddingVertical: spacing.sm },
  button: {
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: { backgroundColor: palette.bone },
  buttonGhost: { backgroundColor: 'transparent' },
  buttonDanger: { backgroundColor: 'transparent' },
  buttonLabel: { ...type.label },
  chip: {
    paddingVertical: spacing.sm,
    paddingRight: spacing.lg,
    backgroundColor: 'transparent',
  },
  chipSelected: {},
  chipLabel: { ...type.label, color: palette.boneMute, fontWeight: '400' },
  chipLabelSelected: { color: palette.bone },
  chipHint: { ...type.caption, marginTop: 2 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.xs },
  heatLabel: { fontFamily: fonts.display, fontSize: 13, lineHeight: 16 },
  card: {
    backgroundColor: palette.inkLift,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: palette.line, marginVertical: spacing.xl },
  play: {
    backgroundColor: palette.bone,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playGlyph: { color: palette.onBone, marginLeft: 1 },
  progressTrack: {
    height: 2,
    backgroundColor: palette.line,
    overflow: 'hidden',
  },
  progressFill: { height: 2, backgroundColor: palette.bone },
  hitLabel: { ...type.label, color: palette.boneDim, fontWeight: '400' },
  field: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    marginTop: spacing.md,
    color: palette.bone,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
    backgroundColor: palette.inkLift,
  },
  fieldQuiet: {
    ...type.title,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.line,
  },
  numeral: {
    ...type.numeral,
    textAlign: 'center',
    paddingVertical: spacing.lg,
    marginTop: spacing.md,
  },
  choice: {
    backgroundColor: palette.inkLift,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  choiceSelected: { backgroundColor: palette.inkHigh },
  choiceLabel: { ...type.label, color: palette.boneMute, fontWeight: '400' },
  choiceLabelOn: { color: palette.bone },
  choiceHint: { ...type.caption, marginTop: 4 },
  choiceStack: { marginTop: spacing.lg },
  stepScroll: { flex: 1 },
  stepBody: { flexGrow: 1, justifyContent: 'center', paddingVertical: spacing.lg },
  dock: { paddingTop: spacing.md, gap: spacing.sm },
});
