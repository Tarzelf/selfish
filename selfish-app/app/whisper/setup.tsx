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
      <Pressable onPress={() => router.back()} hitSlop={12}>
        <Text style={styles.close}>Close</Text>
      </Pressable>

      <Text style={styles.eyebrow}>With {elena.name}</Text>
      <Text style={styles.title}>Set the mood</Text>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <Text style={styles.section}>Scene</Text>
        {elena.scenarios.map((scenario) => {
          const selected = scenario.id === selectedScenarioId;
          return (
            <Pressable
              key={scenario.id}
              onPress={() => setSelectedScenarioId(scenario.id)}
              style={styles.scene}
            >
              <Text style={[styles.sceneTitle, selected && styles.sceneOn]}>
                {scenario.title}
              </Text>
              <Text style={styles.sceneCopy}>{scenario.description}</Text>
            </Pressable>
          );
        })}

        <IntensityDial value={intensity} onChange={setIntensity} />

        <Text style={styles.section}>Opening</Text>
        <Text style={styles.opening}>"{selectedScenario.openingLine}"</Text>
      </ScrollView>

      <Button
        label="Begin session"
        variant="link"
        onPress={() =>
          router.push({
            pathname: '/whisper/session',
            params: { scenarioId: selectedScenarioId, intensity },
          })
        }
      />
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
  close: {
    ...typography.link,
    color: colors.textMuted,
    marginTop: 8,
    marginBottom: 28,
  },
  eyebrow: {
    ...typography.label,
    color: colors.textSubtle,
    marginBottom: 10,
  },
  title: {
    ...typography.hero,
    color: colors.text,
    marginBottom: 28,
  },
  scroll: {
    flex: 1,
  },
  section: {
    ...typography.label,
    color: colors.textSubtle,
    marginBottom: 8,
    marginTop: 8,
  },
  scene: {
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  sceneTitle: {
    ...typography.subtitle,
    color: colors.textMuted,
    marginBottom: 4,
  },
  sceneOn: {
    color: colors.text,
    fontWeight: '500',
  },
  sceneCopy: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  opening: {
    ...typography.body,
    color: colors.text,
    fontStyle: 'italic',
    marginBottom: 32,
    marginTop: 8,
  },
});
