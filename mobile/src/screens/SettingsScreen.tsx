import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chip, GhostButton, PrimaryButton, Sanctuary } from '../components/ui';
import { voices } from '../content/voices';
import type { Heat, Profile, VoiceId } from '../types';
import { colors, space, type } from '../theme';

const heats: { id: Heat; label: string }[] = [
  { id: 1, label: 'Door ajar' },
  { id: 2, label: 'Open' },
  { id: 3, label: 'Wide' },
];

export function SettingsScreen({
  profile,
  onChange,
  onBack,
  onWipe,
}: {
  profile: Profile;
  onChange: (next: Profile) => void;
  onBack: () => void;
  onWipe: () => void;
}) {
  const setVoice = (voiceId: VoiceId) => onChange({ ...profile, voiceId });
  const setHeat = (heat: Heat) => onChange({ ...profile, heat });

  return (
    <Sanctuary>
      <SafeAreaView style={styles.safe}>
        <GhostButton label="Back" onPress={onBack} />
        <Text style={[type.display, styles.title]}>The room</Text>
        <Text style={type.caption}>Voice</Text>
        <View style={styles.wrap}>
          {voices.map((voice) => (
            <Chip
              key={voice.id}
              label={voice.name}
              selected={profile.voiceId === voice.id}
              onPress={() => setVoice(voice.id)}
            />
          ))}
        </View>
        <Text style={[type.caption, styles.spaced]}>Door</Text>
        <View style={styles.wrap}>
          {heats.map((item) => (
            <Chip
              key={item.id}
              label={item.label}
              selected={profile.heat === item.id}
              onPress={() => setHeat(item.id)}
            />
          ))}
        </View>
        <Text style={[type.body, styles.copy]}>
          Your gift and birth year live only on this phone. We do not send a desire
          profile to a server in this version. When generation arrives, it will happen
          on a server we control, never with keys in the app, and never as an open chat.
        </Text>
        <View style={styles.bottom}>
          <PrimaryButton
            label="Reset this room"
            onPress={() => {
              const message =
                'This removes your birth year, gift, voice, and heat from this device.';
              if (Platform.OS === 'web') {
                const confirmed =
                  typeof globalThis.confirm === 'function' &&
                  globalThis.confirm(`Reset this room\n\n${message}`);
                if (confirmed) onWipe();
                return;
              }
              Alert.alert('Reset this room', message, [
                { text: 'Keep them', style: 'cancel' },
                { text: 'Wipe', style: 'destructive', onPress: onWipe },
              ]);
            }}
          />
          <Text style={styles.fine}>Selfish · fiction · 18+</Text>
        </View>
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
  title: { marginBottom: space.lg },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: space.sm },
  spaced: { marginTop: space.lg },
  copy: { marginTop: space.xl },
  bottom: { marginTop: 'auto', gap: 12 },
  fine: { ...type.small, color: colors.gold, textAlign: 'center' },
});
