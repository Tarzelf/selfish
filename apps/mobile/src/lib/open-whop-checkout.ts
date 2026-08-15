import { Linking } from 'react-native';

import { buildCheckoutUrl, currentWebOrigin, httpsReturnUrl, type WhopPlanKey } from './whop';

/** Opens hosted Whop checkout. HTTPS origins ask Whop to send the buyer back here. */
export function openWhopCheckout(plan: WhopPlanKey): void {
  const url = buildCheckoutUrl(plan, { returnUrl: httpsReturnUrl(currentWebOrigin()) });
  void Linking.openURL(url);
}
