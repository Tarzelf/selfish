import assert from 'node:assert/strict';
import { test } from 'node:test';

import { buildCheckoutUrl, httpsReturnUrl, isWhopReturnSuccess, WHOP_PLANS, WHOP_TEST_PROMO } from './whop';

test('checkout URL is the hosted Whop plan link', () => {
  assert.equal(buildCheckoutUrl('monthly'), WHOP_PLANS.monthly.checkoutUrl);
  assert.equal(buildCheckoutUrl('annual'), WHOP_PLANS.annual.checkoutUrl);
});

test('promo and https return URL are appended as query params', () => {
  const url = new URL(
    buildCheckoutUrl('monthly', {
      promo: WHOP_TEST_PROMO,
      returnUrl: 'https://app.example.com/you?whop=success',
    }),
  );
  assert.equal(url.searchParams.get('promo'), 'SELFISHTEST');
  assert.equal(url.searchParams.get('redirect_url'), 'https://app.example.com/you?whop=success');
});

test('http origins cannot be used as a Whop redirect', () => {
  assert.equal(httpsReturnUrl('http://localhost:8081'), undefined);
  assert.equal(httpsReturnUrl('https://app.example.com'), 'https://app.example.com/you?whop=success');
});

test('return query accepts whop=success or status=success', () => {
  assert.equal(isWhopReturnSuccess({ whop: 'success' }), true);
  assert.equal(isWhopReturnSuccess({ status: 'success' }), true);
  assert.equal(isWhopReturnSuccess({ status: 'error' }), false);
  assert.equal(isWhopReturnSuccess({}), false);
});
