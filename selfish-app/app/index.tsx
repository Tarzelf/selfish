import { useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components/Button';
import { useAppState } from '../src/context/AppContext';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';

export default function WelcomeScreen() {
  const router = useRouter();
  const { hasCompletedOnboarding, hasCompletedFirstSession } = useAppState();

  useEffect(() => {
    if (hasCompletedOnboarding && hasCompletedFirstSession) {
      router.replace('/(tabs)');
    }
  }, [hasCompletedOnboarding, hasCompletedFirstSession, router]);

  return (
    <ImageBackground
      source={require('../assets/mood/mood-atmosphere.png')}
      style={styles.photo}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(13,11,14,0.15)', 'rgba(13,11,14,0.25)', 'rgba(13,11,14,0.92)']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.spacer} />
          <View style={styles.copy}>
            <Text style={styles.eyebrow}>Private listening</Text>
            <Text style={styles.brand}>Selfish</Text>
            <Text style={styles.tagline}>Time that's just yours.</Text>
            <Button label="Begin" onPress={() => router.push('/age-gate')} variant="link" />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  photo: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingBottom: 36,
  },
  spacer: {
    flex: 1,
  },
  copy: {
    maxWidth: 320,
  },
  eyebrow: {
    ...typography.label,
    color: colors.text,
    opacity: 0.75,
    marginBottom: 10,
  },
  brand: {
    ...typography.hero,
    color: colors.text,
    marginBottom: 8,
  },
  tagline: {
    ...typography.subtitle,
    color: colors.text,
    opacity: 0.88,
    marginBottom: 22,
  },
});
