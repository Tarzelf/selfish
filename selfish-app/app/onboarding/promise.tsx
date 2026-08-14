import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';

const promises = [
  'Nobody is watching.',
  'You can want things here.',
  'You can leave whenever you want.',
];

export default function PromiseScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>A promise</Text>
        {promises.map((line) => (
          <Text key={line} style={styles.line}>
            {line}
          </Text>
        ))}
        <Text style={styles.note}>
          This is not therapy. Your sessions stay on your terms. You can delete them.
        </Text>
      </View>

      <Button label="I understand" onPress={() => router.push('/onboarding/self')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 28,
    paddingBottom: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    ...typography.label,
    color: colors.accent,
    marginBottom: 28,
  },
  line: {
    ...typography.title,
    color: colors.text,
    fontSize: 26,
    lineHeight: 36,
    marginBottom: 16,
  },
  note: {
    ...typography.caption,
    color: colors.textSubtle,
    textTransform: 'none',
    letterSpacing: 0,
    marginTop: 16,
    lineHeight: 20,
  },
});
