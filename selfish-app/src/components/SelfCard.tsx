import { Pressable, StyleSheet, Text, View } from 'react-native';
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
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.mark, selected && styles.markOn]} />
      <View style={styles.copy}>
        <Text style={[styles.title, selected && styles.titleOn]}>{option.title}</Text>
        <Text style={styles.feeling}>{option.feeling}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pressed: {
    opacity: 0.75,
  },
  mark: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 16,
  },
  markOn: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  copy: {
    flex: 1,
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: 4,
  },
  titleOn: {
    fontWeight: '500',
  },
  feeling: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
