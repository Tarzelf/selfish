import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Body, Caption, Card, Display, Heading, Screen } from '@/components/ui';
import { fonts, palette, spacing } from '@/constants/theme';
import { VOICES } from '@/data/catalog';

export default function Transparency() {
  const router = useRouter();
  return (
    <Screen>
      <View style={styles.headerRow}>
        <Text style={styles.close} onPress={() => router.back()}>
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
        independent safety review before production. Nothing in Selfish is generated live while you
        listen, and nothing you type is ever sent to an AI model.
      </Body>

      <Heading>What we keep (very little)</Heading>
      <Body dim style={styles.para}>
        Your preferences, limits, and listening history exist to make your recommendations better.
        They are never sold, never used to train AI models, and deleted for real when you ask.
      </Body>

      <Heading>The roster</Heading>
      {VOICES.map((v) => (
        <Card key={v.id}>
          <Body>
            {v.name} · {v.gender === 'M' ? 'he/him' : v.gender === 'F' ? 'she/her' : 'they/them'}
          </Body>
          <Caption style={{ marginTop: spacing.xs }}>{v.descriptor}</Caption>
          <Caption style={{ marginTop: spacing.xs }}>{v.narratorCredit}</Caption>
        </Card>
      ))}

      <Caption style={styles.footer}>
        Questions we haven&apos;t answered here? hello@selfish.example — a human reads it.
      </Caption>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: spacing.md },
  close: { fontFamily: fonts.body, color: palette.textDim, fontSize: 15, padding: spacing.xs },
  para: { marginBottom: spacing.sm },
  footer: { marginTop: spacing.lg, textAlign: 'center' },
});
