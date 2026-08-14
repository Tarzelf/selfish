import { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors } from '../src/theme';
import { useSession } from '../src/session-context';

export default function WelcomeScreen() {
  const { ageConfirmed, confirmAge } = useSession();
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: 900, useNativeDriver: true }),
    ]).start();
  }, [fade, rise]);

  const enter = () => {
    if (!ageConfirmed) {
      confirmAge();
    }
    router.push('/mood');
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#1a1420', '#0c0a0f', '#120e14']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.glow} />

      <Animated.View style={[styles.hero, { opacity: fade, transform: [{ translateY: rise }] }]}>
        <Text style={styles.brand}>Selfish</Text>
        <Text style={styles.headline}>A private voice for what you want.</Text>
        <Text style={styles.support}>
          High-fidelity listening — composed like good erotica, shaped around tonight.
        </Text>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.age}>18+ only. Consensual fiction. Private by design.</Text>
        <Pressable
          accessibilityRole="button"
          onPress={enter}
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        >
          <Text style={styles.ctaText}>I am 18 or older — enter</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 88,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  glow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 320,
    backgroundColor: 'rgba(196, 165, 116, 0.12)',
    top: '18%',
    alignSelf: 'center',
  },
  hero: {
    gap: 18,
    maxWidth: 420,
  },
  brand: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 64,
    lineHeight: 68,
    color: colors.parchment,
    letterSpacing: -1,
  },
  headline: {
    fontFamily: 'CormorantGaramond_500Medium',
    fontSize: 28,
    lineHeight: 34,
    color: colors.parchment,
    maxWidth: 340,
  },
  support: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: colors.parchmentMuted,
    maxWidth: 360,
  },
  footer: {
    gap: 16,
  },
  age: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: colors.parchmentMuted,
  },
  cta: {
    backgroundColor: colors.amber,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  ctaPressed: {
    opacity: 0.88,
  },
  ctaText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 15,
    color: colors.ink,
    letterSpacing: 0.2,
  },
});
