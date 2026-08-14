import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { FocusSessionCard } from '../../src/components/FocusSessionCard';
import { IntensityDial } from '../../src/components/IntensityDial';
import { ModeCard } from '../../src/components/ModeCard';
import { SelfCard } from '../../src/components/SelfCard';
import { TextField } from '../../src/components/TextField';
import { focusSessions } from '../../src/constants/focusSessions';
import { selfOptions } from '../../src/constants/self';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';

const swatches: { name: string; value: string }[] = [
  { name: 'background', value: colors.background },
  { name: 'surface', value: colors.surface },
  { name: 'accent', value: colors.accent },
  { name: 'whisper', value: colors.whisper },
  { name: 'focus', value: colors.focus },
  { name: 'text', value: colors.text },
];

export default function DesignBoardScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>Close</Text>
        </Pressable>
        <Text style={styles.title}>Design board</Text>
        <Text style={styles.subtitle}>Mood, tokens, components. Change these first.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.section}>Mood</Text>
        <Image
          source={require('../../assets/mood/mood-atmosphere.png')}
          style={styles.mood}
        />
        <Image
          source={require('../../assets/mood/mood-materials.png')}
          style={styles.mood}
        />
        <Image source={require('../../assets/mood/mood-device.png')} style={styles.moodTall} />

        <Text style={styles.section}>Color</Text>
        <View style={styles.swatchRow}>
          {swatches.map((swatch) => (
            <View key={swatch.name} style={styles.swatchItem}>
              <View style={[styles.swatch, { backgroundColor: swatch.value }]} />
              <Text style={styles.swatchName}>{swatch.name}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.section}>Type</Text>
        <Text style={[typography.hero, styles.specimen]}>Time that's just yours.</Text>
        <Text style={[typography.title, styles.specimen]}>Tonight, who do you want to be?</Text>
        <Text style={[typography.body, styles.specimenMuted]}>
          Nobody is watching. You can want things here.
        </Text>
        <Text style={[typography.label, styles.specimenMuted]}>Your self</Text>

        <Text style={styles.section}>Buttons</Text>
        <Button label="Begin" onPress={() => undefined} />
        <View style={{ height: spacing.sm }} />
        <Button label="Secondary" onPress={() => undefined} variant="secondary" />
        <Button label="Ghost" onPress={() => undefined} variant="ghost" />

        <Text style={styles.section}>Cards</Text>
        <ModeCard
          title="Whisper"
          subtitle="A voice that listens."
          accentColor={colors.whisper}
          onPress={() => undefined}
        />
        <SelfCard option={selfOptions[0]} selected onPress={() => undefined} />
        <SelfCard option={selfOptions[1]} selected={false} onPress={() => undefined} />
        <FocusSessionCard session={focusSessions[0]} onPress={() => undefined} />

        <Text style={styles.section}>Controls</Text>
        <IntensityDial value="warm" onChange={() => undefined} />
        <TextField label="What should we call you here?" placeholder="Skip — surprise me" />
        <View style={{ height: spacing.md }} />
        <TextField label="Birth year" placeholder="1995" error="This space is for people 18 and over." />

        <Text style={styles.section}>Session bubbles</Text>
        <View style={styles.assistant}>
          <Text style={styles.bubbleText}>
            I've been watching you from across the room. You haven't noticed yet.
          </Text>
        </View>
        <View style={styles.user}>
          <Text style={styles.bubbleText}>I noticed.</Text>
        </View>
        <Text style={styles.thinking}>listening...</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  top: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  back: {
    ...typography.caption,
    color: colors.accent,
    textTransform: 'none',
    letterSpacing: 0,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: 4,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 48,
  },
  section: {
    ...typography.label,
    color: colors.accent,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  mood: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    marginBottom: spacing.sm,
  },
  moodTall: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  swatchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  swatchItem: {
    width: '30%',
  },
  swatch: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 6,
  },
  swatchName: {
    ...typography.caption,
    color: colors.textSubtle,
    textTransform: 'none',
    letterSpacing: 0,
    fontSize: 11,
  },
  specimen: {
    color: colors.text,
    marginBottom: spacing.sm,
  },
  specimenMuted: {
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  assistant: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceElevated,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    padding: 14,
    maxWidth: '85%',
    marginBottom: spacing.sm,
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: colors.whisperMuted,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    padding: 14,
    maxWidth: '85%',
    marginBottom: spacing.sm,
  },
  bubbleText: {
    ...typography.body,
    color: colors.text,
  },
  thinking: {
    ...typography.caption,
    color: colors.whisper,
    fontStyle: 'italic',
    textTransform: 'none',
    letterSpacing: 0,
  },
});
