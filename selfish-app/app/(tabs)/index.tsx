import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ModeCard } from '../../src/components/ModeCard';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good evening</Text>
        <Text style={styles.subtitle}>What do you need right now?</Text>
      </View>

      <View style={styles.modes}>
        <ModeCard
          title="Focus"
          subtitle="Calm your mind. Find your flow."
          accentColor={colors.focus}
          onPress={() => router.push('/(tabs)/focus')}
        />
        <ModeCard
          title="Whisper"
          subtitle="A voice that listens. A story that's yours."
          accentColor={colors.whisper}
          onPress={() => router.push('/(tabs)/whisper')}
        />
      </View>

      <Text style={styles.hint}>
        Headphones recommended for the full experience.
      </Text>
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
    paddingBottom: 32,
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
  modes: {
    flex: 1,
  },
  hint: {
    ...typography.caption,
    color: colors.textSubtle,
    textAlign: 'center',
    textTransform: 'none',
    letterSpacing: 0,
    paddingBottom: 16,
  },
});
