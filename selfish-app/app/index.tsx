import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
    <LinearGradient colors={['#0D0B0E', '#1A1218', '#0D0B0E']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.brand}>Selfish</Text>
          <Text style={styles.tagline}>Time that's just yours.</Text>
        </View>

        <View style={styles.actions}>
          <Button label="Begin" onPress={() => router.push('/age-gate')} />
          <Text style={styles.disclaimer}>Headphones recommended. Adults 18+.</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
  },
  brand: {
    ...typography.hero,
    color: colors.text,
    marginBottom: 8,
  },
  tagline: {
    ...typography.subtitle,
    color: colors.accent,
  },
  actions: {
    gap: 16,
  },
  disclaimer: {
    ...typography.caption,
    color: colors.textSubtle,
    textAlign: 'center',
    textTransform: 'none',
    letterSpacing: 0,
  },
});
