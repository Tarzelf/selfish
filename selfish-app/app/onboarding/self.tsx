import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { SelfCard } from '../../src/components/SelfCard';
import { getSelfOption, SelfFeeling, selfOptions } from '../../src/constants/self';
import { useAppState } from '../../src/context/AppContext';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';

export default function SelfScreen() {
  const router = useRouter();
  const { completeOnboarding } = useAppState();
  const [feeling, setFeeling] = useState<SelfFeeling>('playful');
  const [name, setName] = useState('');

  const handleReady = () => {
    const option = getSelfOption(feeling);
    completeOnboarding({
      feeling,
      name: name.trim(),
    });

    router.replace({
      pathname: '/whisper/session',
      params: {
        scenarioId: option.scenarioId,
        intensity: option.intensity,
        firstSession: '1',
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>Your self</Text>
        <Text style={styles.title}>Tonight, who do you want to be?</Text>
        <Text style={styles.hint}>Not a profile. A mood.</Text>

        <View style={styles.list}>
          {selfOptions.map((option) => (
            <SelfCard
              key={option.id}
              option={option}
              selected={feeling === option.id}
              onPress={() => setFeeling(option.id)}
            />
          ))}
        </View>

        <Text style={styles.nameLabel}>What should we call you here?</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Skip — surprise me"
          placeholderTextColor={colors.textSubtle}
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={24}
          returnKeyType="done"
        />
      </ScrollView>

      <View style={styles.actions}>
        <Button label="I'm ready" onPress={handleReady} variant="link" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 16,
  },
  eyebrow: {
    ...typography.label,
    color: colors.textSubtle,
    marginBottom: 14,
  },
  title: {
    ...typography.hero,
    fontSize: 30,
    marginBottom: 10,
    color: colors.text,
  },
  hint: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: 28,
  },
  list: {
    marginBottom: 36,
  },
  nameLabel: {
    ...typography.label,
    color: colors.textSubtle,
    marginBottom: 12,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 12,
    fontSize: 18,
    color: colors.text,
  },
  actions: {
    paddingHorizontal: 28,
    paddingBottom: 32,
  },
});
