import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Intensity } from '../constants/personas';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface IntensityDialProps {
  value: Intensity;
  onChange: (intensity: Intensity) => void;
}

const options: { value: Intensity; label: string }[] = [
  { value: 'soft', label: 'Soft' },
  { value: 'warm', label: 'Warm' },
  { value: 'bold', label: 'Bold' },
];

export function IntensityDial({ value, onChange }: IntensityDialProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Intensity</Text>
      <View style={styles.row}>
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              style={[styles.option, selected && styles.optionSelected]}
            >
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  optionSelected: {
    borderColor: colors.whisper,
    backgroundColor: 'rgba(184, 125, 158, 0.12)',
  },
  optionText: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'none',
    letterSpacing: 0,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: colors.whisper,
  },
});
