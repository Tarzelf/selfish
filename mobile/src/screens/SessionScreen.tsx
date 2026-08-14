import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GhostButton, PrimaryButton, Sanctuary } from '../components/ui';
import { heatLabel } from '../content/assemble';
import { sessionById } from '../content/sessions';
import { voiceById } from '../content/voices';
import type { Profile } from '../types';
import { space, type } from '../theme';

export function SessionScreen({
  id,
  profile,
  onBack,
  onBegin,
}: {
  id: string;
  profile: Profile;
  onBack: () => void;
  onBegin: () => void;
}) {
  const session = sessionById(id);
  const voice = voiceById(profile.voiceId);
  if (!session) {
    return (
      <Sanctuary>
        <SafeAreaView style={styles.safe}>
          <Text style={type.body}>This session is not in the room.</Text>
          <GhostButton label="Back" onPress={onBack} />
        </SafeAreaView>
      </Sanctuary>
    );
  }

  return (
    <Sanctuary>
      <SafeAreaView style={styles.safe}>
        <GhostButton label="Back to the rooms" onPress={onBack} />
        <Text style={type.caption}>{session.room === 'still' ? 'Still' : 'Want'}</Text>
        <Text style={[type.title, styles.title]}>{session.title}</Text>
        <Text style={type.serif}>{session.subtitle}</Text>
        <Text style={[type.body, styles.body]}>{session.synopsis}</Text>
        <View style={styles.meta}>
          <Text style={type.small}>
            {session.durationLabel} · {heatLabel(session.heat)} · {voice.name}
          </Text>
          <Text style={[type.small, styles.note]}>
            Headphones if you have them. Transcript stays off unless you ask. You can
            skip to aftercare at any time.
          </Text>
        </View>
        <PrimaryButton label="Begin" onPress={onBegin} />
      </SafeAreaView>
    </Sanctuary>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    paddingBottom: space.xl,
  },
  title: { marginTop: space.sm, marginBottom: space.md },
  body: { marginTop: space.lg, flex: 1 },
  meta: { marginBottom: space.lg, gap: 10 },
  note: { opacity: 0.85 },
});
