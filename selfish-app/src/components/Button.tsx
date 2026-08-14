import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        variant === 'link' ? styles.linkBase : styles.base,
        variant !== 'link' && styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'ghost' && styles.ghostLabel,
          variant === 'secondary' && styles.secondaryLabel,
          variant === 'link' && styles.linkLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 2,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  linkBase: {
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  primary: {
    backgroundColor: colors.text,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.78,
  },
  disabled: {
    opacity: 0.35,
  },
  label: {
    ...typography.body,
    fontWeight: '500',
    color: colors.background,
  },
  secondaryLabel: {
    color: colors.text,
  },
  ghostLabel: {
    color: colors.text,
    textDecorationLine: 'underline',
  },
  linkLabel: {
    ...typography.link,
    color: colors.text,
  },
});
