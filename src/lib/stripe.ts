import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

export const getStripe = () => {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('Missing STRIPE_SECRET_KEY');
    stripeClient = new Stripe(key, { apiVersion: '2026-01-28.clover' });
  }
  return stripeClient;
};
