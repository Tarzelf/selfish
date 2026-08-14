import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface TextLinkProps {
  label: string;
  onPress: () => void;
  tone?: 'cream' | 'gold';
  style?: ViewStyle;
}

export function TextLink({ label, onPress, tone = 'cream', style }: TextLinkProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      style={({ pressed }) => [style, pressed && styles.pressed]}
    >
      <Text style={[styles.link, tone === 'gold' && styles.gold]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    ...typography.link,
    color: colors.text,
  },
  gold: {
    color: colors.accent,
  },
  pressed: {
    opacity: 0.7,
  },
});
