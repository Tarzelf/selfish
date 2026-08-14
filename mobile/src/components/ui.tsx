import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, space, type } from '../theme';

export function Sanctuary({ children }: { children: ReactNode }) {
  return (
    <LinearGradient colors={['#1C1612', '#0E0C0A']} style={styles.flex}>
      {children}
    </LinearGradient>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={() => {
        if (Platform.OS !== 'web') {
          Haptics.selectionAsync().catch(() => undefined);
        }
        onPress();
      }}
      style={({ pressed }) => [
        styles.primary,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={styles.primaryLabel}>{label}</Text>
    </Pressable>
  );
}

export function GhostButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.ghost}>
      <Text style={styles.ghostLabel}>{label}</Text>
    </Pressable>
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{label}</Text>
    </Pressable>
  );
}

export function Card({
  children,
  style,
  onPress,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}) {
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={[styles.card, style]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  primary: {
    backgroundColor: colors.cream,
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  primaryLabel: {
    color: colors.ink,
    fontSize: 16,
    letterSpacing: 0.3,
    fontWeight: '600',
  },
  disabled: { opacity: 0.35 },
  pressed: { opacity: 0.85 },
  ghost: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  ghostLabel: {
    ...type.small,
    color: colors.gold,
    letterSpacing: 0.4,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: colors.cream,
    borderColor: colors.cream,
  },
  chipLabel: {
    color: colors.creamMuted,
    fontSize: 15,
  },
  chipLabelSelected: {
    color: colors.ink,
  },
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: 22,
    padding: space.lg,
    borderWidth: 1,
    borderColor: colors.line,
  },
});
