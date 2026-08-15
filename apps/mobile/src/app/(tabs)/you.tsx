import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { MembershipCtas } from '@/components/membership-ctas';
import {
  Body,
  Button,
  Caption,
  Card,
  Choice,
  ChoiceStack,
  Display,
  Divider,
  Heading,
  Screen,
  TextLink,
} from '@/components/ui';
import { palette, spacing } from '@/constants/theme';
import { useAppState } from '@/lib/store';
import { HEAT_HINT, HEAT_LABEL, type HeatLevel, LIMIT_TAGS } from '@/lib/types';

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
      <Caption>Your settings. Your limits.</Caption>

      <Heading>Heat cap</Heading>
      <Caption>Nothing above this appears, anywhere.</Caption>
      <ChoiceStack>
        {(['comfort', 'slow-burn', 'spicy'] as HeatLevel[]).map((h) => (
          <Choice
            key={h}
            label={HEAT_LABEL[h]}
            hint={HEAT_HINT[h]}
            selected={prefs.heatCap === h}
            onPress={() => setPrefs({ heatCap: h })}
          />
        ))}
      </ChoiceStack>

      <Heading>Hard limits</Heading>
      <Caption>Filtered out everywhere, permanently.</Caption>
      <ChoiceStack>
        {LIMIT_TAGS.map((t) => (
          <Choice key={t} label={t} selected={prefs.hardLimits.includes(t)} onPress={() => toggleLimit(t)} />
        ))}
      </ChoiceStack>

      <Heading>Discretion</Heading>
      <Card>
        <View style={styles.switchRow}>
          <View style={styles.switchText}>
            <Body>Discreet mode</Body>
            <Caption>Lock screen shows only “Selfish — Session”. On by default.</Caption>
          </View>
          <Switch
            value={prefs.discreetMode}
            onValueChange={(v) => setPrefs({ discreetMode: v })}
            trackColor={{ true: palette.boneDim, false: palette.inkHigh }}
            thumbColor={palette.bone}
          />
        </View>
      </Card>

      <Heading>How this is made</Heading>
      <Card onPress={() => router.push('/transparency')}>
        <Body>Voice transparency</Body>
        <Caption>Every voice is synthetic, licensed, and paid.</Caption>
      </Card>

      <Heading>The rest of the catalog</Heading>
      <Card>
        <MembershipCtas />
      </Card>

      <Divider />

      <Button
        kind="ghost"
        label="Replay onboarding"
        onPress={() => {
          setPrefs({ onboarded: false });
          router.replace('/onboarding');
        }}
      />
      <View style={{ height: spacing.md }} />
      {confirmingDelete ? (
        <Card>
          <Body>Delete everything?</Body>
          <Caption>Preferences, limits, and listening history leave this device immediately.</Caption>
          <View style={styles.deleteRow}>
            <Button
              kind="danger"
              label="Yes, delete it all"
              onPress={() => {
                resetAll();
                router.replace('/onboarding');
              }}
              style={styles.deleteButton}
            />
            <TextLink label="Cancel" onPress={() => setConfirmingDelete(false)} />
          </View>
        </Card>
      ) : (
        <Button kind="danger" label="Delete my data" onPress={() => setConfirmingDelete(true)} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  switchText: { flex: 1 },
  deleteRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, gap: spacing.md },
  deleteButton: { flex: 1 },
});
