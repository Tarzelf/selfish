import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors, intensities, moods, voices, type MoodId, type VoiceId } from '../src/theme';
import { useSession } from '../src/session-context';

export default function MoodScreen() {
  const session = useSession();
  const [localMood, setLocalMood] = useState<MoodId | null>(session.mood);
  const [localIntensity, setLocalIntensity] = useState(session.intensity);
  const [localVoice, setLocalVoice] = useState<VoiceId>(session.voice);
  const [intention, setIntention] = useState(session.intention);

  const continueNight = () => {
    if (!localMood) return;
    session.setMood(localMood);
    session.setIntensity(localIntensity);
    session.setVoice(localVoice);
    session.setIntention(intention);
    session.beginSession();
    router.push('/listen');
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#141018', '#0c0a0f']}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>Tonight</Text>
        <Text style={styles.title}>Choose a temperature.</Text>
        <Text style={styles.sub}>Not a quiz. Just how you want to be met.</Text>

        <View style={styles.grid}>
          {moods.map((m) => {
            const selected = localMood === m.id;
            return (
              <Pressable
                key={m.id}
                onPress={() => setLocalMood(m.id)}
                style={[styles.mood, selected && styles.moodSelected]}
              >
                <Text style={styles.moodTitle}>{m.title}</Text>
                <Text style={styles.moodLine}>{m.line}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.section}>Intensity</Text>
        <View style={styles.row}>
          {intensities.map((i) => {
            const selected = localIntensity === i.id;
            return (
              <Pressable
                key={i.id}
                onPress={() => setLocalIntensity(i.id)}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {i.id} · {i.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.section}>Voice</Text>
        <View style={styles.voiceCol}>
          {voices.map((v) => {
            const selected = localVoice === v.id;
            return (
              <Pressable
                key={v.id}
                onPress={() => setLocalVoice(v.id)}
                style={[styles.voice, selected && styles.moodSelected]}
              >
                <Text style={styles.moodTitle}>{v.title}</Text>
                <Text style={styles.moodLine}>{v.line}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.section}>Optional — one line</Text>
        <TextInput
          value={intention}
          onChangeText={setIntention}
          placeholder="Tonight I want…"
          placeholderTextColor={colors.parchmentMuted}
          style={styles.input}
          maxLength={120}
        />

        <Pressable
          disabled={!localMood}
          onPress={continueNight}
          style={[styles.cta, !localMood && styles.ctaDisabled]}
        >
          <Text style={styles.ctaText}>Begin listening</Text>
        </Pressable>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 48,
    gap: 12,
  },
  kicker: {
    fontFamily: 'DMSans_500Medium',
    color: colors.amber,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 40,
    color: colors.parchment,
    marginTop: 4,
  },
  sub: {
    fontFamily: 'DMSans_400Regular',
    color: colors.parchmentMuted,
    fontSize: 15,
    marginBottom: 12,
  },
  grid: { gap: 10 },
  mood: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.inkElevated,
    padding: 16,
  },
  moodSelected: {
    borderColor: colors.amber,
    backgroundColor: colors.amberSoft,
  },
  moodTitle: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 24,
    color: colors.parchment,
  },
  moodLine: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: colors.parchmentMuted,
    marginTop: 4,
  },
  section: {
    fontFamily: 'DMSans_500Medium',
    color: colors.parchment,
    fontSize: 13,
    marginTop: 18,
    marginBottom: 4,
    letterSpacing: 0.4,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  chipSelected: {
    borderColor: colors.amber,
    backgroundColor: colors.amberSoft,
  },
  chipText: {
    fontFamily: 'DMSans_400Regular',
    color: colors.parchmentMuted,
    fontSize: 13,
  },
  chipTextSelected: { color: colors.parchment },
  voiceCol: { gap: 8 },
  voice: {
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    backgroundColor: colors.inkElevated,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    color: colors.parchment,
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    backgroundColor: colors.inkElevated,
  },
  cta: {
    marginTop: 20,
    backgroundColor: colors.amber,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaDisabled: { opacity: 0.35 },
  ctaText: {
    fontFamily: 'DMSans_500Medium',
    color: colors.ink,
    fontSize: 15,
  },
  back: {
    marginTop: 14,
    textAlign: 'center',
    color: colors.parchmentMuted,
    fontFamily: 'DMSans_400Regular',
  },
});
