import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { IntensityDial } from '../../src/components/IntensityDial';
import { personas, Intensity } from '../../src/constants/personas';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';

export default function WhisperSetupScreen() {
  const router = useRouter();
  const elena = personas[0];
  const [selectedScenarioId, setSelectedScenarioId] = useState(elena.scenarios[0].id);
  const [intensity, setIntensity] = useState<Intensity>('warm');

  const selectedScenario = elena.scenarios.find((s) => s.id === selectedScenarioId)!;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
        <Text style={styles.title}>Set the mood</Text>
        <Text style={styles.subtitle}>with {elena.name}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Choose a scenario</Text>
        {elena.scenarios.map((scenario) => {
          const selected = scenario.id === selectedScenarioId;
          return (
            <Pressable
              key={scenario.id}
              onPress={() => setSelectedScenarioId(scenario.id)}
              style={[styles.scenarioCard, selected && styles.scenarioCardSelected]}
            >
              <Text style={[styles.scenarioTitle, selected && styles.scenarioTitleSelected]}>
                {scenario.title}
              </Text>
              <Text style={styles.scenarioDescription}>{scenario.description}</Text>
            </Pressable>
          );
        })}

        <IntensityDial value={intensity} onChange={setIntensity} />

        <View style={styles.preview}>
          <Text style={styles.previewLabel}>Opening line</Text>
          <Text style={styles.previewText}>"{selectedScenario.openingLine}"</Text>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Button
          label="Begin session"
          onPress={() =>
            router.push({
              pathname: '/whisper/session',
              params: {
                scenarioId: selectedScenarioId,
                intensity,
              },
            })
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 8,
  },
  closeText: {
    color: colors.textMuted,
    fontSize: 20,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.whisper,
  },
  content: {
    flex: 1,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: 12,
  },
  scenarioCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 10,
  },
  scenarioCardSelected: {
    borderColor: colors.whisper,
    backgroundColor: 'rgba(184, 125, 158, 0.08)',
  },
  scenarioTitle: {
    ...typography.subtitle,
    color: colors.text,
    fontSize: 16,
    marginBottom: 4,
  },
  scenarioTitleSelected: {
    color: colors.whisper,
  },
  scenarioDescription: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'none',
    letterSpacing: 0,
  },
  preview: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 14,
    padding: 20,
    marginBottom: 24,
  },
  previewLabel: {
    ...typography.label,
    color: colors.textSubtle,
    marginBottom: 8,
  },
  previewText: {
    ...typography.body,
    color: colors.text,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  actions: {
    paddingBottom: 16,
  },
});
