import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FocusSessionCard } from '../../src/components/FocusSessionCard';
import { focusSessions } from '../../src/constants/focusSessions';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';

export default function FocusScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Focus</Text>
        <Text style={styles.subtitle}>
          Ambient sessions to calm your nervous system and sharpen attention.
        </Text>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {focusSessions.map((session) => (
          <FocusSessionCard
            key={session.id}
            session={session}
            onPress={() => router.push(`/focus/${session.id}`)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
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
    color: colors.focus,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 22,
  },
  list: {
    flex: 1,
  },
});
