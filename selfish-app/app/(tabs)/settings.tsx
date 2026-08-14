import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getSelfOption } from '../../src/constants/self';
import { useAppState } from '../../src/context/AppContext';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';

export default function SettingsScreen() {
  const router = useRouter();
  const { self } = useAppState();
  const selfOption = self ? getSelfOption(self.feeling) : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Private</Text>
        <Text style={styles.title}>You</Text>
        <Text style={styles.subtitle}>A self. Not a profile.</Text>
      </View>

      <Text style={styles.section}>This version of you</Text>
      <Row label="Name here" hint={self?.name ? self.name : 'Unnamed — that is fine'} />
      <Row
        label="Feeling"
        hint={selfOption ? `${selfOption.title} — ${selfOption.feeling}` : 'Not set'}
      />

      <Text style={styles.section}>Privacy</Text>
      <Row label="Memory" hint="Off until you ask" />
      <Row label="Delete history" hint="Coming soon" />

      <Text style={styles.section}>Keep going</Text>
      <Row label="Selfish+" hint="When you want more evenings" />

      <Pressable onPress={() => router.push('/dev/design-board')} style={styles.row}>
        <Text style={styles.rowLabel}>Design board</Text>
        <Text style={styles.rowHint}>Mood and components</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function Row({ label, hint }: { label: string; hint: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowHint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 28,
  },
  eyebrow: {
    ...typography.label,
    color: colors.textSubtle,
    marginBottom: 10,
  },
  title: {
    ...typography.hero,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  section: {
    ...typography.label,
    color: colors.textSubtle,
    marginTop: 20,
    marginBottom: 4,
  },
  row: {
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowLabel: {
    ...typography.body,
    color: colors.text,
    marginBottom: 4,
  },
  rowHint: {
    ...typography.caption,
    color: colors.textSubtle,
  },
});
