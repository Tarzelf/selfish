import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { Body, Button, Caption } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { hasCatalogAccess, isWhopMember, previewDaysLeft } from '@/lib/catalog-access';
import { useAppState } from '@/lib/store';
import type { Preferences } from '@/lib/types';
import { openWhopCheckout } from '@/lib/open-whop-checkout';
import { WHOP_MANAGE_URL, WHOP_TEST_PROMO } from '@/lib/whop';

function membershipCopy(prefs: Preferences): { title: string; body: string } {
  if (isWhopMember(prefs)) {
    return {
      title: 'Selfish+ · billed on Whop',
      body: 'Full catalog is unlocked on this device. Cancel or update the card on Whop.',
    };
  }
  if (hasCatalogAccess(prefs)) {
    const days = previewDaysLeft(prefs);
    return {
      title: `Selfish+ preview · ${days} ${days === 1 ? 'day' : 'days'} left`,
      body: 'Full catalog is unlocked on this device until the preview ends. Subscribe on Whop to keep it.',
    };
  }
  return {
    title: 'Selfish+',
    body: `Three Desire and three Rest sessions stay free. Unlock the rest on Whop — $6.99/month (14-day trial) or $49.99/year. To test without paying, apply ${WHOP_TEST_PROMO} at checkout.`,
  };
}

export function MembershipCtas() {
  const { prefs, activateWhopMembership } = useAppState();
  const copy = membershipCopy(prefs);
  const unlocked = hasCatalogAccess(prefs);

  return (
    <View>
      <Body>{copy.title}</Body>
      <Caption>{copy.body}</Caption>
      {isWhopMember(prefs) ? (
        <View style={styles.stack}>
          <Button kind="ghost" label="Manage on Whop" onPress={() => void Linking.openURL(WHOP_MANAGE_URL)} />
        </View>
      ) : (
        <View style={styles.stack}>
          <Button label="Start monthly · 14-day trial" onPress={() => openWhopCheckout('monthly')} />
          <Button kind="ghost" label="Go annual · $49.99" onPress={() => openWhopCheckout('annual')} />
          {!unlocked && (
            <Button kind="ghost" label="I completed checkout" onPress={activateWhopMembership} />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { marginTop: spacing.md, gap: spacing.sm },
});
