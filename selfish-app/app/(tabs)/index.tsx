import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ModeCard } from '../../src/components/ModeCard';
import { getSelfOption } from '../../src/constants/self';
import { useAppState } from '../../src/context/AppContext';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';

export default function HomeScreen() {
  const router = useRouter();
  const { self } = useAppState();
  const selfOption = self ? getSelfOption(self.feeling) : null;
  const greeting = self?.name ? `Welcome back, ${self.name}` : 'Welcome back';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.subtitle}>
          {selfOption
            ? `You can keep being ${selfOption.title.toLowerCase()} — or try another self.`
            : 'What do you need right now?'}
        </Text>
      </View>

      {selfOption ? (
        <View style={styles.selfCard}>
          <Text style={styles.selfLabel}>Your self tonight</Text>
          <Text style={styles.selfTitle}>{selfOption.title}</Text>
          <Text style={styles.selfFeeling}>{selfOption.feeling}</Text>
        </View>
      ) : null}

      <View style={styles.modes}>
        <ModeCard
          title="Whisper"
          subtitle="Continue. Or start a new scene."
          accentColor={colors.whisper}
          onPress={() => router.push('/(tabs)/whisper')}
        />
        <ModeCard
          title="Focus"
          subtitle="Quiet, if you need it."
          accentColor={colors.focus}
          onPress={() => router.push('/(tabs)/focus')}
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
    paddingBottom: 20,
  },
  greeting: {
    ...typography.hero,
    color: colors.text,
    fontSize: 28,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  selfCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 24,
  },
  selfLabel: {
    ...typography.label,
    color: colors.whisper,
    marginBottom: 8,
  },
  selfTitle: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: 4,
  },
  selfFeeling: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'none',
    letterSpacing: 0,
  },
  modes: {
    flex: 1,
  },
});
