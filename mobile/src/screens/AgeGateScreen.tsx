import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton, Sanctuary } from '../components/ui';
import { isAdultBirthYear } from '../content/safety';
import { colors, space, type } from '../theme';

const now = new Date();
const latest = now.getFullYear() - 18;

export function AgeGateScreen({
  onAdult,
}: {
  onAdult: (birthYear: number) => void;
}) {
  const [year, setYear] = useState(1994);
  const [affirmed, setAffirmed] = useState(false);
  const adult = isAdultBirthYear(year, now);

  return (
    <Sanctuary>
      <SafeAreaView style={styles.safe}>
        <Text style={type.caption}>Selfish</Text>
        <Text style={[type.title, styles.title]}>This room is for adults.</Text>
        <Text style={[type.body, styles.body]}>
          Literary audio. Some of it is erotic. None of it is for anyone under eighteen.
          Enter your birth year.
        </Text>

        <View style={styles.stepper}>
          <Pressable
            accessibilityLabel="Decrease birth year"
            onPress={() => setYear((value) => Math.max(1950, value - 1))}
            style={styles.step}
          >
            <Text style={styles.stepLabel}>−</Text>
          </Pressable>
          <Text style={styles.year}>{year}</Text>
          <Pressable
            accessibilityLabel="Increase birth year"
            onPress={() => setYear((value) => Math.min(latest, value + 1))}
            style={styles.step}
          >
            <Text style={styles.stepLabel}>+</Text>
          </Pressable>
        </View>
        <Text style={styles.hint}>
          {adult ? 'You may enter.' : 'You are not old enough for this app.'}
        </Text>

        <Pressable
          onPress={() => setAffirmed((value) => !value)}
          style={styles.affirm}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: affirmed }}
        >
          <View style={[styles.box, affirmed && styles.boxOn]} />
          <Text style={styles.affirmText}>
            I am 18 or older. I want adult literary audio. I understand this is fiction,
            spoken to me, not a real person in my room.
          </Text>
        </Pressable>

        <View style={styles.bottom}>
          <PrimaryButton
            label="Enter the room"
            disabled={!adult || !affirmed}
            onPress={() => onAdult(year)}
          />
          <Text style={styles.fine}>
            If you are under 18, close the app. We do not show bodies. We do not sell
            your desire. The lock-screen title stays discreet.
          </Text>
        </View>
      </SafeAreaView>
    </Sanctuary>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: space.lg,
    paddingTop: space.xl,
  },
  title: { marginTop: space.md, marginBottom: space.md },
  body: { marginBottom: space.xl },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.sm,
  },
  step: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: { color: colors.cream, fontSize: 24 },
  year: {
    ...type.display,
    width: 140,
    textAlign: 'center',
  },
  hint: { ...type.small, textAlign: 'center', marginBottom: space.xl },
  affirm: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.gold,
    marginTop: 2,
  },
  boxOn: { backgroundColor: colors.gold },
  affirmText: { ...type.small, flex: 1, color: colors.creamMuted },
  bottom: { marginTop: 'auto', gap: 8, paddingBottom: space.lg },
  fine: { ...type.small, marginTop: space.md, opacity: 0.8 },
});
