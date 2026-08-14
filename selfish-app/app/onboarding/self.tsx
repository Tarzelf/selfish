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
        <Text style={styles.label}>Your self</Text>
        <Text style={styles.title}>Tonight, who do you want to be?</Text>
        <Text style={styles.hint}>Not a profile. A mood. You can change this later.</Text>

        <View style={styles.cards}>
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
        <Button label="I'm ready" onPress={handleReady} />
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
    paddingTop: 24,
    paddingBottom: 16,
  },
  label: {
    ...typography.label,
    color: colors.whisper,
    marginBottom: 12,
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: 8,
  },
  hint: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: 28,
  },
  cards: {
    marginBottom: 28,
  },
  nameLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: 10,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
    fontSize: 17,
    color: colors.text,
  },
  actions: {
    paddingHorizontal: 28,
    paddingBottom: 24,
  },
});
