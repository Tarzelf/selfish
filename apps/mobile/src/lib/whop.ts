/** Whop company that owns web checkout. Public ids only — no secrets. */
export const WHOP_COMPANY_ID = 'biz_fsQF44lZBKbFMC';
export const WHOP_PRODUCT_ID = 'prod_yqtZNF7z7pCDA';

/** 100% off for 12 months. Type this at Whop checkout to test without paying. */
export const WHOP_TEST_PROMO = 'SELFISHTEST';

export const WHOP_MANAGE_URL = 'https://whop.com/joined';

export const WHOP_PLANS = {
  monthly: {
    id: 'plan_zORafaxaGY4u0',
    label: 'Monthly',
    priceLabel: '$6.99/month',
    trialDays: 14,
    checkoutUrl: 'https://whop.com/checkout/plan_zORafaxaGY4u0',
  },
  annual: {
    id: 'plan_VFf0oi9xcP5Nx',
    label: 'Annual',
    priceLabel: '$49.99/year',
    trialDays: 0,
    checkoutUrl: 'https://whop.com/checkout/plan_VFf0oi9xcP5Nx',
  },
} as const;

export type WhopPlanKey = keyof typeof WHOP_PLANS;

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** True when Whop (or our own return link) says checkout succeeded. */
export function isWhopReturnSuccess(params: Record<string, string | string[] | undefined>): boolean {
  const whop = firstParam(params.whop);
  const status = firstParam(params.status);
  return whop === 'success' || status === 'success';
}

export function httpsReturnUrl(origin: string | undefined): string | undefined {
  if (!origin || !origin.startsWith('https://')) return undefined;
  return `${origin.replace(/\/$/, '')}/you?whop=success`;
}

export function buildCheckoutUrl(
  plan: WhopPlanKey,
  opts?: { promo?: string; returnUrl?: string },
): string {
  const url = new URL(WHOP_PLANS[plan].checkoutUrl);
  if (opts?.promo) url.searchParams.set('promo', opts.promo);
  if (opts?.returnUrl?.startsWith('https://')) {
    url.searchParams.set('redirect_url', opts.returnUrl);
  }
  return url.toString();
}

export function currentWebOrigin(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.location.origin;
}
