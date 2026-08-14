import { useEffect, useRef, useState } from 'react';
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

export default function ListenScreen() {
  const { script, clearSession } = useSession();
  const [phase, setPhase] = useState<'preparing' | 'listening' | 'stopped'>('preparing');
  const pulse = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    if (!script) {
      router.replace('/mood');
      return;
    }
    const t = setTimeout(() => setPhase('listening'), 1600);
    return () => clearTimeout(t);
  }, [script]);

  useEffect(() => {
    if (phase !== 'listening') return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.5, duration: 1600, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [phase, pulse]);

  if (!script) {
    return <View style={styles.root} />;
  }

  const stop = () => {
    setPhase('stopped');
  };

  const endNight = () => {
    router.push('/aftercare');
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#18131c', '#0c0a0f']} style={StyleSheet.absoluteFill} />

      <View style={styles.top}>
        <Text style={styles.brand}>Selfish</Text>
        <Text style={styles.title}>{script.title}</Text>
        <Text style={styles.meta}>
          ~{script.minutes} min · Demo voice (wire ElevenLabs for live audio)
        </Text>
      </View>

      <View style={styles.stage}>
        {phase === 'preparing' && (
          <Text style={styles.preparing}>Preparing your night…</Text>
        )}
        {phase === 'listening' && (
          <>
            <Animated.View style={[styles.orb, { opacity: pulse }]} />
            <Text style={styles.narration}>{script.demoNarration}</Text>
          </>
        )}
        {phase === 'stopped' && (
          <Text style={styles.preparing}>Stopped. You&apos;re in control.</Text>
        )}
      </View>

      <View style={styles.controls}>
        {phase === 'listening' && (
          <Pressable onPress={stop} style={styles.stop}>
            <Text style={styles.stopText}>Stop</Text>
          </Pressable>
        )}
        {(phase === 'stopped' || phase === 'listening') && (
          <Pressable onPress={endNight} style={styles.secondary}>
            <Text style={styles.secondaryText}>
              {phase === 'stopped' ? 'Continue to aftercare' : 'End night gently'}
            </Text>
          </Pressable>
        )}
        <Pressable
          onPress={() => {
            clearSession();
            router.replace('/mood');
          }}
        >
          <Text style={styles.link}>Choose a different mood</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 36,
    justifyContent: 'space-between',
  },
  top: { gap: 8 },
  brand: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 22,
    color: colors.amber,
  },
  title: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 42,
    color: colors.parchment,
  },
  meta: {
    fontFamily: 'DMSans_400Regular',
    color: colors.parchmentMuted,
    fontSize: 13,
  },
  stage: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
  },
  preparing: {
    fontFamily: 'CormorantGaramond_500Medium',
    fontSize: 28,
    color: colors.parchment,
    textAlign: 'center',
  },
  orb: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 120,
    backgroundColor: 'rgba(196, 165, 116, 0.28)',
    marginBottom: 12,
  },
  narration: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    lineHeight: 26,
    color: colors.parchment,
    textAlign: 'center',
  },
  controls: { gap: 12 },
  stop: {
    borderWidth: 1,
    borderColor: colors.rose,
    paddingVertical: 14,
    alignItems: 'center',
  },
  stopText: {
    fontFamily: 'DMSans_500Medium',
    color: colors.parchment,
    fontSize: 15,
  },
  secondary: {
    backgroundColor: colors.amber,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryText: {
    fontFamily: 'DMSans_500Medium',
    color: colors.ink,
    fontSize: 15,
  },
  link: {
    textAlign: 'center',
    marginTop: 4,
    fontFamily: 'DMSans_400Regular',
    color: colors.parchmentMuted,
  },
});
