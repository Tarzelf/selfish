import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LifestyleCard } from '../../src/components/LifestyleCard';
import { focusSessions } from '../../src/constants/focusSessions';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';

const images = [
  require('../../assets/mood/mood-device.png'),
  require('../../assets/mood/mood-atmosphere.png'),
  require('../../assets/mood/mood-materials.png'),
];

export default function FocusScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Quiet</Text>
          <Text style={styles.title}>Focus</Text>
          <Text style={styles.subtitle}>When the room needs to settle.</Text>
        </View>

        {focusSessions.map((session, index) => (
          <LifestyleCard
            key={session.id}
            image={images[index % images.length]}
            eyebrow={`${session.durationMinutes} min`}
            title={session.title}
            description={session.description}
            action="Listen"
            height={200}
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
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 4,
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
});
