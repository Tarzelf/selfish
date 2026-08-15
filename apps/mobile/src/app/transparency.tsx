import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Body, Caption, Card, Display, Heading, Screen } from '@/components/ui';
import { fonts, spacing } from '@/constants/theme';
import { VOICE_PREVIEW_AUDIO } from '@/data/audio-map';
import { VOICES } from '@/data/catalog';
import { useAtmosphere } from '@/lib/atmosphere';
import type { Voice } from '@/lib/types';

function VoiceCard({ voice }: { voice: Voice }) {
  const { palette } = useAtmosphere();
  const source = VOICE_PREVIEW_AUDIO[voice.id] ?? null;
  const player = useAudioPlayer(source);
  const status = useAudioPlayerStatus(player);

  const toggle = () => {
    if (status.playing) {
      player.pause();
      return;
    }
    if (status.duration > 0 && status.currentTime >= status.duration - 0.05) player.seekTo(0);
    player.play();
  };

  return (
    <Card>
      <View style={styles.voiceRow}>
        <View style={styles.voiceText}>
          <Body>
            {voice.name} · {voice.gender === 'M' ? 'he/him' : voice.gender === 'F' ? 'she/her' : 'they/them'}
          </Body>
          <Caption style={{ marginTop: spacing.xs }}>{voice.descriptor}</Caption>
          <Caption style={{ marginTop: spacing.xs }}>{voice.narratorCredit}</Caption>
        </View>
        {source != null && (
          <Pressable
            onPress={toggle}
            accessibilityRole="button"
            accessibilityLabel={status.playing ? `Pause ${voice.name} sample` : `Play ${voice.name} sample`}
            style={({ pressed }) => [
              styles.playButton,
              { backgroundColor: palette.goldSoft, borderColor: palette.gold },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={[styles.playGlyph, { color: palette.gold }]}>{status.playing ? '❚❚' : '▶'}</Text>
          </Pressable>
        )}
      </View>
      {source != null && (
        <Caption style={styles.sampleNote}>Engine preview — current pipeline output, not the final cast voice.</Caption>
      )}
    </Card>
  );
}

export default function Transparency() {
  const router = useRouter();
  const { palette } = useAtmosphere();
  return (
    <Screen>
      <View style={styles.headerRow}>
        <Text style={[styles.close, { color: palette.textDim }]} onPress={() => router.back()}>
          Close
        </Text>
      </View>
      <Display>How Selfish is made</Display>
      <Body dim>
        We think you deserve the whole story, told plainly, before anyone else tells it for us.
      </Body>

      <Heading>The voices are synthetic — and humans get paid</Heading>
      <Body dim style={styles.para}>
        Every voice in Selfish is a studio-crafted synthetic performance. Each one is built from
        recordings made by a professional narrator who licensed their voice for exactly this use,
        with consent that covers everything you hear here, and who earns a share of revenue for as
        long as their voice is in the app.
      </Body>
      <Body dim style={styles.para}>
        We never clone anyone&apos;s voice without a signed license. We never imitate real,
        identifiable people. Every audio file we produce carries machine-readable marking that
        identifies it as synthetic.
      </Body>

      <Heading>Every session is written and reviewed before it reaches you</Heading>
      <Body dim style={styles.para}>
        Sessions are drafted with the help of AI writing tools, then rewritten and approved by our
        editorial team — humans with strong opinions about pacing. Every script passes an
        independent safety review before production, and an automated listener checks every take
        before a human ever hears it. Nothing in Selfish is generated live while you listen, and
        nothing you type is ever sent to an AI model.
      </Body>

      <Heading>What we keep (very little)</Heading>
      <Body dim style={styles.para}>
        Your preferences, limits, and listening history exist to make your recommendations better.
        They are never sold, never used to train AI models, and deleted for real when you ask.
      </Body>

      <Heading>The roster</Heading>
      <Caption style={{ marginBottom: spacing.sm }}>
        Tap ▶ to hear a whisper-register engine preview of each voice.
      </Caption>
      {VOICES.map((v) => (
        <VoiceCard key={v.id} voice={v} />
      ))}

      <Caption style={styles.footer}>
        Questions we haven&apos;t answered here? hello@selfish.example — a human reads it.
      </Caption>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: spacing.md },
  close: { fontFamily: fonts.body, fontSize: 15, padding: spacing.xs },
  para: { marginBottom: spacing.sm },
  footer: { marginTop: spacing.lg, textAlign: 'center' },
  voiceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  voiceText: { flex: 1 },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playGlyph: { fontSize: 16 },
  sampleNote: { marginTop: spacing.sm },
});
