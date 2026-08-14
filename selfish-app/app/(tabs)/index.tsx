import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LifestyleCard } from '../../src/components/LifestyleCard';
import { getSelfOption } from '../../src/constants/self';
import { useAppState } from '../../src/context/AppContext';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';

export default function HomeScreen() {
  const router = useRouter();
  const { self } = useAppState();
  const selfOption = self ? getSelfOption(self.feeling) : null;
  const greeting = self?.name ? self.name : 'Welcome back';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>This evening</Text>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.subtitle}>
            {selfOption
              ? `${selfOption.title}. ${selfOption.feeling}`
              : 'What do you need right now?'}
          </Text>
        </View>

        <LifestyleCard
          image={require('../../assets/mood/mood-atmosphere.png')}
          eyebrow="Voice"
          title="Whisper"
          description="A voice that listens. A story that's yours."
          action="Begin"
          height={320}
          onPress={() => router.push('/(tabs)/whisper')}
        />
        <LifestyleCard
          image={require('../../assets/mood/mood-device.png')}
          eyebrow="Quiet"
          title="Focus"
          description="Ambient sessions when you need the room to settle."
          action="Listen"
          height={220}
          onPress={() => router.push('/(tabs)/focus')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 4,
  },
  eyebrow: {
    ...typography.label,
    color: colors.textSubtle,
    marginBottom: 10,
  },
  greeting: {
    ...typography.hero,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
});
