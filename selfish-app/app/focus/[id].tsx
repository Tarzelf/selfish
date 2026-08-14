import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { focusSessions } from '../../src/constants/focusSessions';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';

export default function FocusPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const session = focusSessions.find((s) => s.id === id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Session not found</Text>
      </SafeAreaView>
    );
  }

  const totalSeconds = session.durationMinutes * 60;

  const togglePlay = () => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= totalSeconds - 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsPlaying(false);
          return totalSeconds;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = elapsed / totalSeconds;

  return (
    <LinearGradient
      colors={[session.ambientColor, colors.background, colors.background]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>

        <View style={styles.center}>
          <View style={styles.pulseOuter}>
            <View style={[styles.pulseInner, isPlaying && styles.pulseActive]} />
          </View>

          <Text style={styles.title}>{session.title}</Text>
          <Text style={styles.description}>{session.description}</Text>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>

          <Text style={styles.timer}>
            {formatTime(elapsed)} / {formatTime(totalSeconds)}
          </Text>
        </View>

        <Pressable onPress={togglePlay} style={styles.playButton}>
          <Text style={styles.playIcon}>{isPlaying ? '❚❚' : '▶'}</Text>
        </Pressable>

        <Text style={styles.note}>
          Audio assets coming soon — timer simulates session length for now.
        </Text>
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
    paddingBottom: 24,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 12,
    marginTop: 8,
  },
  closeText: {
    color: colors.textMuted,
    fontSize: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  pulseInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(123, 167, 188, 0.3)',
  },
  pulseActive: {
    backgroundColor: 'rgba(123, 167, 188, 0.6)',
  },
  title: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: 32,
  },
  progressBar: {
    width: '100%',
    height: 3,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.focus,
    borderRadius: 2,
  },
  timer: {
    ...typography.caption,
    color: colors.textSubtle,
    textTransform: 'none',
    letterSpacing: 0,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.focus,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  playIcon: {
    color: colors.background,
    fontSize: 24,
  },
  note: {
    ...typography.caption,
    color: colors.textSubtle,
    textAlign: 'center',
    textTransform: 'none',
    letterSpacing: 0,
  },
  error: {
    color: colors.danger,
    textAlign: 'center',
    marginTop: 40,
  },
});
