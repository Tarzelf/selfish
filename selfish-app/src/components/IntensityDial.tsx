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
              style={styles.option}
            >
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                {option.label}
              </Text>
              {selected ? <View style={styles.underline} /> : <View style={styles.gap} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 28,
  },
  label: {
    ...typography.label,
    color: colors.textSubtle,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 24,
  },
  option: {
    paddingBottom: 4,
  },
  optionText: {
    ...typography.subtitle,
    color: colors.textSubtle,
  },
  optionTextSelected: {
    color: colors.text,
  },
  underline: {
    marginTop: 6,
    height: 1,
    backgroundColor: colors.text,
  },
  gap: {
    marginTop: 6,
    height: 1,
  },
});
