import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { useAppState } from '../../src/context/AppContext';
import { personas } from '../../src/constants/personas';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';

export default function WhisperScreen() {
  const router = useRouter();
  const { freeWhisperSessionsRemaining } = useAppState();
  const elena = personas[0];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Whisper</Text>
        <Text style={styles.subtitle}>
          Interactive voice companions that respond to you. Choose a story, set the mood, and
          listen.
        </Text>
        <Text style={styles.sessionsLeft}>
          {freeWhisperSessionsRemaining} free session{freeWhisperSessionsRemaining !== 1 ? 's' : ''}{' '}
          remaining
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.personaCard}>
          <Text style={styles.personaName}>{elena.name}</Text>
          <Text style={styles.personaTagline}>{elena.tagline}</Text>
          <Text style={styles.personaDescription}>{elena.description}</Text>

          <Text style={styles.scenariosLabel}>Scenarios</Text>
          {elena.scenarios.map((scenario) => (
            <View key={scenario.id} style={styles.scenarioItem}>
              <Text style={styles.scenarioTitle}>{scenario.title}</Text>
              <Text style={styles.scenarioDescription}>{scenario.description}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Button
          label="Start a Whisper session"
          onPress={() => router.push('/whisper/setup')}
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
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    ...typography.title,
    color: colors.whisper,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: 8,
  },
  sessionsLeft: {
    ...typography.caption,
    color: colors.accent,
    textTransform: 'none',
    letterSpacing: 0,
  },
  content: {
    flex: 1,
  },
  personaCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    marginBottom: 16,
  },
  personaName: {
    ...typography.title,
    color: colors.text,
    marginBottom: 4,
  },
  personaTagline: {
    ...typography.caption,
    color: colors.whisper,
    textTransform: 'none',
    letterSpacing: 0,
    marginBottom: 12,
  },
  personaDescription: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: 24,
  },
  scenariosLabel: {
    ...typography.label,
    color: colors.textSubtle,
    marginBottom: 12,
  },
  scenarioItem: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  scenarioTitle: {
    ...typography.subtitle,
    color: colors.text,
    fontSize: 16,
    marginBottom: 4,
  },
  scenarioDescription: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'none',
    letterSpacing: 0,
  },
  actions: {
    paddingBottom: 16,
  },
});
