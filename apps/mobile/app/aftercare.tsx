import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors } from '../src/theme';
import { useSession } from '../src/session-context';

const SCORES = [
  { id: 1, label: 'Not for me' },
  { id: 2, label: 'Almost' },
  { id: 3, label: 'Warm' },
  { id: 4, label: 'Felt for me' },
  { id: 5, label: 'Exactly' },
];

export default function AftercareScreen() {
  const { clearSession, script } = useSession();
  const [score, setScore] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#15111a', '#0c0a0f']} style={StyleSheet.absoluteFill} />
      <View style={styles.body}>
        <Text style={styles.kicker}>Aftercare</Text>
        <Text style={styles.title}>You can put the night down.</Text>
        <Text style={styles.sub}>
          {script
            ? `“${script.title}” is complete. Nothing is owed.`
            : 'Nothing is owed.'}
        </Text>

        <Text style={styles.question}>Did this feel like it was for you?</Text>
        <View style={styles.scores}>
          {SCORES.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => setScore(s.id)}
              style={[styles.score, score === s.id && styles.scoreOn]}
            >
              <Text style={styles.scoreText}>{s.label}</Text>
            </Pressable>
          ))}
        </View>

        {score !== null && !saved && (
          <Pressable
            style={styles.cta}
            onPress={() => {
              // Hook analytics / Supabase feedback here
              setSaved(true);
            }}
          >
            <Text style={styles.ctaText}>Save private feedback</Text>
          </Pressable>
        )}
        {saved && (
          <Text style={styles.thanks}>Saved only for improving your nights.</Text>
        )}
      </View>

      <View style={styles.footer}>
        <Pressable
          style={styles.secondary}
          onPress={() => {
            clearSession();
            router.replace('/mood');
          }}
        >
          <Text style={styles.secondaryText}>Another night</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            clearSession();
            router.replace('/');
          }}
        >
          <Text style={styles.link}>Leave quietly</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 36,
    justifyContent: 'space-between',
  },
  body: { gap: 12 },
  kicker: {
    fontFamily: 'DMSans_500Medium',
    color: colors.amber,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  title: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 40,
    color: colors.parchment,
  },
  sub: {
    fontFamily: 'DMSans_400Regular',
    color: colors.parchmentMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  question: {
    marginTop: 24,
    fontFamily: 'DMSans_500Medium',
    color: colors.parchment,
    fontSize: 15,
  },
  scores: { gap: 8, marginTop: 8 },
  score: {
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  scoreOn: {
    borderColor: colors.amber,
    backgroundColor: colors.amberSoft,
  },
  scoreText: {
    fontFamily: 'DMSans_400Regular',
    color: colors.parchment,
  },
  cta: {
    marginTop: 16,
    backgroundColor: colors.amber,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaText: {
    fontFamily: 'DMSans_500Medium',
    color: colors.ink,
  },
  thanks: {
    marginTop: 12,
    fontFamily: 'DMSans_400Regular',
    color: colors.parchmentMuted,
  },
  footer: { gap: 12 },
  secondary: {
    borderWidth: 1,
    borderColor: colors.amber,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryText: {
    fontFamily: 'DMSans_500Medium',
    color: colors.parchment,
  },
  link: {
    textAlign: 'center',
    fontFamily: 'DMSans_400Regular',
    color: colors.parchmentMuted,
  },
});
