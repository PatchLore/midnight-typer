import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { stripe } from '@/lib/stripe';
import { getAvailableSlots, saveStar, getUserStars } from '@/lib/supabase';
import { monitoring } from '@/lib/monitoring';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const stripePriceId = process.env.STRIPE_PRICE_ID!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const limit = 5; // Max 5 requests per 15 minutes
  const windowMs = 15 * 60 * 1000; // 15 minutes

  const userRateLimit = rateLimitMap.get(userId);
  
  if (!userRateLimit) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (now > userRateLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (userRateLimit.count >= limit) {
    return true;
  }

  userRateLimit.count++;
  return false;
}

export async function POST(request: Request) {
  try {
    const { starId, userId } = await request.json();

    if (!starId || !userId) {
      await monitoring.logError(new Error('Missing starId or userId'), { starId, userId });
      return NextResponse.json(
        { error: 'Missing starId or userId' },
        { status: 400 }
      );
    }

    // Rate limiting
    if (isRateLimited(userId)) {
      await monitoring.logError(new Error('Rate limit exceeded'), { userId });
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Check if user has available slots
    const slotsInfo = await getAvailableSlots(userId);
    
    if (slotsInfo.available <= 0) {
      await monitoring.trackEvent('claim_attempt_no_slots', { userId, needed: slotsInfo.needed });
      return NextResponse.json(
        { 
          error: 'No available slots. Type more words to unlock additional slots.',
          needed: slotsInfo.needed
        },
        { status: 429 }
      );
    }

    // Check if star exists and is unclaimed
    const { data: star, error: starError } = await supabase
      .from('stars')
      .select('*')
      .eq('id', starId)
      .single();

    if (starError || !star) {
      await monitoring.logError(new Error('Star not found'), { starId, starError });
      return NextResponse.json(
        { error: 'Star not found' },
        { status: 404 }
      );
    }

    if (star.status !== 'unclaimed') {
      await monitoring.trackEvent('claim_attempt_already_claimed', { starId, userId });
      return NextResponse.json(
        { error: 'This star has already been claimed' },
        { status: 409 }
      );
    }

    // Check if user owns this star
    if (star.user_id !== userId) {
      await monitoring.logError(new Error('User does not own star'), { starId, userId, starUserId: star.user_id });
      return NextResponse.json(
        { error: 'You do not own this star' },
        { status: 403 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: stripePriceId,
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/galaxy/success?session_id={CHECKOUT_SESSION_ID}&star_id=${starId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/galaxy`,
      metadata: {
        star_id: starId,
        user_id: userId,
        star_name: star.star_data.name || 'Unnamed Star',
        constellation: 'Your Constellation' // Could be derived from star position
      },
      client_reference_id: userId,
    });

    await monitoring.trackEvent('checkout_session_created', { 
      starId: starId, 
      userId: userId, 
      sessionId: session.id 
    });

    return NextResponse.json({
      checkoutUrl: session.url,
      sessionId: session.id
    });

  } catch (error) {
    await monitoring.logError(error as Error, { starId: 'unknown', userId: 'unknown' });
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}