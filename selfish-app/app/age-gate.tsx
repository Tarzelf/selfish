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
      setError('Enter a four-digit year.');
      return;
    }

    if (age < 18) {
      setError('This space is for people 18 and over.');
      return;
    }

    setHasCompletedAgeGate(true);
    router.push('/onboarding/promise');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>A moment</Text>
        <Text style={styles.title}>This is for adults.</Text>
        <Text style={styles.description}>What year were you born?</Text>

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
          autoFocus
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>

      <View style={styles.actions}>
        <Button label="Continue" onPress={handleContinue} />
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
  label: {
    ...typography.label,
    color: colors.accent,
    marginBottom: 16,
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: 28,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
    fontSize: 22,
    color: colors.text,
    letterSpacing: 2,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    textTransform: 'none',
    letterSpacing: 0,
    marginTop: 12,
  },
  actions: {
    gap: 8,
  },
});
