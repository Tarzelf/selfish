import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={require('../../assets/mood/mood-materials.png')}
          style={styles.hero}
        >
          <LinearGradient
            colors={['transparent', 'rgba(13,11,14,0.88)']}
            style={styles.heroOverlay}
          >
            <Text style={styles.eyebrow}>Companion</Text>
            <Text style={styles.heroTitle}>{elena.name}</Text>
            <Text style={styles.heroTag}>{elena.tagline}</Text>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.body}>
          <Text style={styles.description}>{elena.description}</Text>
          <Text style={styles.sessions}>
            {freeWhisperSessionsRemaining} sessions remaining
          </Text>

          <Text style={styles.section}>Scenes</Text>
          {elena.scenarios.map((scenario) => (
            <View key={scenario.id} style={styles.scene}>
              <Text style={styles.sceneTitle}>{scenario.title}</Text>
              <Text style={styles.sceneCopy}>{scenario.description}</Text>
            </View>
          ))}

          <Button
            label="Start a session"
            onPress={() => router.push('/whisper/setup')}
            variant="link"
            style={styles.cta}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    height: 280,
    justifyContent: 'flex-end',
  },
  heroOverlay: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 80,
  },
  eyebrow: {
    ...typography.label,
    color: colors.text,
    opacity: 0.75,
    marginBottom: 8,
  },
  heroTitle: {
    ...typography.hero,
    color: colors.text,
  },
  heroTag: {
    ...typography.subtitle,
    color: colors.text,
    opacity: 0.85,
    marginTop: 6,
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: 12,
  },
  sessions: {
    ...typography.caption,
    color: colors.textSubtle,
    marginBottom: 32,
  },
  section: {
    ...typography.label,
    color: colors.textSubtle,
    marginBottom: 8,
  },
  scene: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sceneTitle: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: 4,
  },
  sceneCopy: {
    ...typography.caption,
    color: colors.textMuted,
  },
  cta: {
    marginTop: 28,
  },
});
