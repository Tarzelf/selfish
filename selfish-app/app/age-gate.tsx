import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components/Button';
import { useAppState } from '../src/context/AppContext';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';

export default function AgeGateScreen() {
  const router = useRouter();
  const { setHasCompletedAgeGate } = useAppState();
  const [birthYear, setBirthYear] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    const year = parseInt(birthYear, 10);
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    if (!year || year < 1920 || year > currentYear) {
      setError('Please enter a valid birth year.');
      return;
    }

    if (age < 18) {
      setError('You must be 18 or older to use Selfish.');
      return;
    }

    setHasCompletedAgeGate(true);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Before we begin</Text>
        <Text style={styles.description}>
          Selfish contains intimate audio content designed for adults. Please confirm your age to
          continue.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Birth year</Text>
          <TextInput
            style={styles.input}
            value={birthYear}
            onChangeText={(text) => {
              setBirthYear(text.replace(/\D/g, '').slice(0, 4));
              setError('');
            }}
            placeholder="1995"
            placeholderTextColor={colors.textSubtle}
            keyboardType="number-pad"
            maxLength={4}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      </View>

      <View style={styles.actions}>
        <Button label="I am 18 or older" onPress={handleContinue} />
        <Button label="Go back" onPress={() => router.back()} variant="ghost" />
      </View>
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
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 24,
    marginBottom: 32,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    ...typography.label,
    color: colors.textMuted,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: colors.text,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    textTransform: 'none',
    letterSpacing: 0,
  },
  actions: {
    gap: 8,
  },
});
