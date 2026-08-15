import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { MembershipCtas } from '@/components/membership-ctas';
import { Body, Button, Caption, Card, Chip, Display, Divider, Heading, Screen } from '@/components/ui';
import { fonts, palette, spacing } from '@/constants/theme';
import { useAppState } from '@/lib/store';
import { HEAT_LABEL, type HeatLevel, LIMIT_TAGS } from '@/lib/types';

export default function You() {
  const router = useRouter();
  const { prefs, setPrefs, resetAll } = useAppState();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const toggleLimit = (t: string) =>
    setPrefs({
      hardLimits: prefs.hardLimits.includes(t)
        ? prefs.hardLimits.filter((x) => x !== t)
        : [...prefs.hardLimits, t],
    });

  return (
    <Screen>
      <Display>{prefs.displayName ? prefs.displayName : 'You'}</Display>
      <Body dim>Your settings, your limits, your business.</Body>

      <Heading>Heat cap</Heading>
      <Caption>Nothing above this ever appears, anywhere in the app.</Caption>
      <View style={styles.chipWrap}>
        {(['comfort', 'slow-burn', 'spicy'] as HeatLevel[]).map((h) => (
          <Chip key={h} label={HEAT_LABEL[h]} selected={prefs.heatCap === h} onPress={() => setPrefs({ heatCap: h })} />
        ))}
      </View>

      <Heading>Hard limits</Heading>
      <Caption>Themes selected here are filtered out everywhere, permanently.</Caption>
      <View style={styles.chipWrap}>
        {LIMIT_TAGS.map((t) => (
          <Chip key={t} label={t} selected={prefs.hardLimits.includes(t)} onPress={() => toggleLimit(t)} />
        ))}
      </View>

      <Heading>Discretion</Heading>
      <Card>
        <View style={styles.switchRow}>
          <View style={styles.switchText}>
            <Body>Discreet mode</Body>
            <Caption>
              Lock screen, Control Center, and CarPlay show only “Selfish — Session”. Notifications
              stay neutral. On by default.
            </Caption>
          </View>
          <Switch
            value={prefs.discreetMode}
            onValueChange={(v) => setPrefs({ discreetMode: v })}
            trackColor={{ true: palette.gold, false: palette.border }}
            thumbColor={palette.text}
          />
        </View>
      </Card>

      <Heading>How Selfish is made</Heading>
      <Card onPress={() => router.push('/transparency')}>
        <Body>Voice transparency</Body>
        <Caption>
          Every voice is a studio-crafted synthetic performance built from licensed recordings.
          Read exactly how it works and who gets paid.
        </Caption>
      </Card>

      <Heading>Membership</Heading>
      <Card>
        <MembershipCtas />
      </Card>

      <Divider />

      <Button kind="ghost" label="Replay onboarding" onPress={() => { setPrefs({ onboarded: false }); router.replace('/onboarding'); }} />
      <View style={{ height: spacing.md }} />
      {confirmingDelete ? (
        <Card>
          <Body>Delete everything?</Body>
          <Caption>
            Removes your preferences, limits, and listening history from this device immediately.
          </Caption>
          <View style={styles.deleteRow}>
            <Button kind="danger" label="Yes, delete it all" onPress={() => { resetAll(); router.replace('/onboarding'); }} style={styles.deleteButton} />
            <Text style={styles.cancel} onPress={() => setConfirmingDelete(false)}>
              Cancel
            </Text>
          </View>
        </Card>
      ) : (
        <Button kind="danger" label="Delete my data" onPress={() => setConfirmingDelete(true)} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  switchText: { flex: 1 },
  deleteRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, gap: spacing.md },
  deleteButton: { flex: 1 },
  cancel: { fontFamily: fonts.body, color: palette.textDim, fontSize: 15, padding: spacing.sm },
});
