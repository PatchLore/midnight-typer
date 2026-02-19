import Stripe from 'stripe';

export const getStripe = () => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  
  if (!stripeSecretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY');
  }
  
  return new Stripe(stripeSecretKey, {
    apiVersion: '2026-01-28.clover',
    typescript: true,
  });
};

// For backward compatibility, export a getter function
export const stripe = getStripe();
