import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>You</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        <SettingsRow label="Delete session history" hint="Coming soon" />
        <SettingsRow label="Memory" hint="Opt-in only" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <SettingsRow label="Selfish+" hint="Coming soon — $9.99/mo" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <SettingsRow label="Version" hint="1.0.0 (MVP)" />
        <SettingsRow label="Privacy Policy" hint="Coming soon" />
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: {
    ...typography.body,
    color: colors.text,
  },
  rowHint: {
    ...typography.caption,
    color: colors.textSubtle,
    textTransform: 'none',
    letterSpacing: 0,
  },
});
