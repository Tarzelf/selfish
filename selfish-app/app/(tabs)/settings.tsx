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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>You</Text>
        <Text style={styles.subtitle}>
          A private self. Not a profile. Nobody else sees this.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This version of you</Text>
        <SettingsRow
          label="Name here"
          hint={self?.name ? self.name : 'Unnamed — that is fine'}
        />
        <SettingsRow
          label="Feeling"
          hint={selfOption ? `${selfOption.title} — ${selfOption.feeling}` : 'Not set'}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        <SettingsRow label="Delete session history" hint="Coming soon" />
        <SettingsRow label="Memory" hint="Off until you ask" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <SettingsRow label="Selfish+" hint="After you want to keep going" />
      </View>

      <Pressable onPress={() => router.push('/dev/design-board')} style={styles.row}>
        <Text style={styles.rowLabel}>Design board</Text>
        <Text style={styles.rowHint}>Mood, tokens, components</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function SettingsRow({ label, hint }: { label: string; hint: string }) {
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
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: 12,
  },
  row: {
    paddingVertical: 14,
    borderBottomWidth: 1,
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
    textTransform: 'none',
    letterSpacing: 0,
  },
});
