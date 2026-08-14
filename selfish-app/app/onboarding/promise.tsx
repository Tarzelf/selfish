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
        <Text style={styles.eyebrow}>A promise</Text>
        {promises.map((line) => (
          <Text key={line} style={styles.line}>
            {line}
          </Text>
        ))}
        <Text style={styles.note}>
          This is not therapy. Your sessions stay on your terms.
        </Text>
      </View>

      <Button
        label="I understand"
        onPress={() => router.push('/onboarding/self')}
        variant="link"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 28,
    paddingBottom: 36,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  eyebrow: {
    ...typography.label,
    color: colors.textSubtle,
    marginBottom: 28,
  },
  line: {
    ...typography.title,
    color: colors.text,
    fontSize: 28,
    lineHeight: 38,
    marginBottom: 18,
  },
  note: {
    ...typography.caption,
    color: colors.textSubtle,
    marginTop: 12,
  },
});
