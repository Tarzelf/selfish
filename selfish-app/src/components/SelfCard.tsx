import { Pressable, StyleSheet, Text } from 'react-native';
import { SelfOption } from '../constants/self';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface SelfCardProps {
  option: SelfOption;
  selected: boolean;
  onPress: () => void;
}

export function SelfCard({ option, selected, onPress }: SelfCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.title, selected && styles.titleSelected]}>{option.title}</Text>
      <Text style={styles.feeling}>{option.feeling}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 20,
    paddingHorizontal: 22,
    marginBottom: 12,
  },
  selected: {
    borderColor: colors.whisper,
    backgroundColor: 'rgba(184, 125, 158, 0.12)',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
    fontSize: 18,
    marginBottom: 4,
  },
  titleSelected: {
    color: colors.whisper,
  },
  feeling: {
    ...typography.body,
    color: colors.textMuted,
    fontSize: 15,
  },
});
