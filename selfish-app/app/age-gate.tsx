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
        <Text style={styles.eyebrow}>A moment</Text>
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
        <Button label="Continue" onPress={handleContinue} variant="link" />
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
    paddingBottom: 32,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  eyebrow: {
    ...typography.label,
    color: colors.textSubtle,
    marginBottom: 16,
  },
  title: {
    ...typography.hero,
    color: colors.text,
    fontSize: 32,
    marginBottom: 10,
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: 36,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 14,
    fontSize: 28,
    fontWeight: '400',
    color: colors.text,
    letterSpacing: 4,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    marginTop: 14,
  },
  actions: {
    gap: 8,
  },
});
