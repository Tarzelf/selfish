import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, GhostButton, Sanctuary } from '../components/ui';
import { heatLabel, tonightSessionId, visibleSessions } from '../content/assemble';
import { sessionById } from '../content/sessions';
import { voiceById } from '../content/voices';
import type { Profile } from '../types';
import { colors, space, type } from '../theme';

export function HomeScreen({
  profile,
  onOpen,
  onSettings,
}: {
  profile: Profile;
  onOpen: (id: string) => void;
  onSettings: () => void;
}) {
  const tonightId = tonightSessionId(profile);
  const tonight = sessionById(tonightId);
  const still = visibleSessions(profile).filter((session) => session.room === 'still');
  const want = visibleSessions(profile).filter((session) => session.room === 'want');
  const voice = voiceById(profile.voiceId);

  return (
    <Sanctuary>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.top}>
            <View>
              <Text style={type.caption}>Selfish</Text>
              <Text style={type.display}>An hour that is only yours.</Text>
            </View>
            <GhostButton label="Room settings" onPress={onSettings} />
          </View>
          <Text style={styles.meta}>
            {voice.name} · {heatLabel(profile.heat)}
          </Text>

          {tonight && (
            <Card style={styles.tonight} onPress={() => onOpen(tonight.id)}>
              <Text style={type.caption}>Tonight</Text>
              <Text style={[type.serif, styles.tonightTitle]}>{tonight.title}</Text>
              <Text style={type.body}>{tonight.subtitle}</Text>
            </Card>
          )}

          <Text style={styles.section}>Still</Text>
          {still.map((session) => (
            <Card key={session.id} style={styles.item} onPress={() => onOpen(session.id)}>
              <Text style={styles.itemTitle}>{session.title}</Text>
              <Text style={type.small}>{session.durationLabel} · {session.subtitle}</Text>
            </Card>
          ))}

          <Text style={styles.section}>Want</Text>
          {want.map((session) => (
            <Card key={session.id} style={styles.item} onPress={() => onOpen(session.id)}>
              <Text style={styles.itemTitle}>{session.title}</Text>
              <Text style={type.small}>
                {session.durationLabel} · {heatLabel(session.heat)} · {session.subtitle}
              </Text>
            </Card>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Sanctuary>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: space.lg, paddingBottom: space.xxl },
  top: {
    marginTop: space.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  meta: { ...type.small, marginTop: space.sm, marginBottom: space.lg, color: colors.gold },
  tonight: { marginBottom: space.xl, backgroundColor: colors.bgSoft },
  tonightTitle: { marginVertical: space.sm },
  section: { ...type.caption, marginBottom: space.sm, marginTop: space.md },
  item: { marginBottom: space.sm },
  itemTitle: { ...type.serif, fontSize: 22, marginBottom: 6 },
});
