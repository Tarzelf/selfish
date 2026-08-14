import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chip, PrimaryButton, Sanctuary } from '../components/ui';
import { voices } from '../content/voices';
import type { Gift, Heat, Pace, VoiceId } from '../types';
import { space, type } from '../theme';

const gifts: { id: Gift; label: string }[] = [
  { id: 'quiet', label: 'Quiet' },
  { id: 'wanted', label: 'To be wanted' },
  { id: 'praised', label: 'To be seen' },
  { id: 'cared', label: 'To be taken care of' },
  { id: 'unsure', label: 'I am not sure yet' },
];

const paces: { id: Pace; label: string }[] = [
  { id: 'whisper', label: 'Close, almost a whisper' },
  { id: 'unhurried', label: 'Low and unhurried' },
  { id: 'sure', label: 'Warm and sure' },
  { id: 'soft', label: 'Soft' },
];

const heats: { id: Heat; label: string; detail: string }[] = [
  { id: 1, label: 'Door ajar', detail: 'Suggestive. The almost is the point.' },
  { id: 2, label: 'Open', detail: 'Sensual. A body in the room.' },
  { id: 3, label: 'Wide', detail: 'Explicit literary audio. Still a person.' },
];

export function OnboardingScreen({
  onDone,
}: {
  onDone: (value: { gift: Gift; pace: Pace; voiceId: VoiceId; heat: Heat }) => void;
}) {
  const [step, setStep] = useState(0);
  const [gift, setGift] = useState<Gift>('unsure');
  const [pace, setPace] = useState<Pace>('unhurried');
  const [voiceId, setVoiceId] = useState<VoiceId>('ash');
  const [heat, setHeat] = useState<Heat>(1);

  const next = () => {
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    onDone({ gift, pace, voiceId, heat });
  };

  return (
    <Sanctuary>
      <SafeAreaView style={styles.safe}>
        <Text style={type.caption}>Tonight · {step + 1} of 3</Text>
        {step === 0 && (
          <View style={styles.block}>
            <Text style={type.display}>How do you want to feel?</Text>
            <Text style={[type.body, styles.help]}>
              Not a census. A temperature. You can change this later.
            </Text>
            <View style={styles.wrap}>
              {gifts.map((item) => (
                <Chip
                  key={item.id}
                  label={item.label}
                  selected={gift === item.id}
                  onPress={() => setGift(item.id)}
                />
              ))}
            </View>
          </View>
        )}
        {step === 1 && (
          <View style={styles.block}>
            <Text style={type.display}>How should a voice arrive?</Text>
            <Text style={[type.body, styles.help]}>
              You can change the person later. The pace is the intimacy.
            </Text>
            <View style={styles.wrap}>
              {paces.map((item) => (
                <Chip
                  key={item.id}
                  label={item.label}
                  selected={pace === item.id}
                  onPress={() => setPace(item.id)}
                />
              ))}
            </View>
            <View style={styles.wrap}>
              {voices.map((voice) => (
                <Chip
                  key={voice.id}
                  label={voice.name}
                  selected={voiceId === voice.id}
                  onPress={() => setVoiceId(voice.id)}
                />
              ))}
            </View>
            <Text style={[type.small, styles.help]}>
              {voices.find((voice) => voice.id === voiceId)?.arrival}
            </Text>
          </View>
        )}
        {step === 2 && (
          <View style={styles.block}>
            <Text style={type.display}>How far do you want the door open?</Text>
            <Text style={[type.body, styles.help]}>
              We will not push it. Aftercare is always on the other side.
            </Text>
            <View style={styles.wrap}>
              {heats.map((item) => (
                <Chip
                  key={item.id}
                  label={item.label}
                  selected={heat === item.id}
                  onPress={() => setHeat(item.id)}
                />
              ))}
            </View>
            <Text style={[type.small, styles.help]}>
              {heats.find((item) => item.id === heat)?.detail}
            </Text>
          </View>
        )}
        <PrimaryButton label={step === 2 ? 'Open the room' : 'Continue'} onPress={next} />
      </SafeAreaView>
    </Sanctuary>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: space.lg,
    paddingTop: space.xl,
    paddingBottom: space.xl,
  },
  block: { flex: 1, paddingTop: space.lg },
  help: { marginTop: space.md, marginBottom: space.lg },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
});
