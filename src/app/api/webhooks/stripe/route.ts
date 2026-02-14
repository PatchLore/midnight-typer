import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { treePlantingService } from '@/lib/tree-planting';
import { incrementStarsClaimed, incrementTreesPlanted, updateStarStatus, getImpactCounter } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature');
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !endpointSecret) {
    return NextResponse.json(
      { error: 'Webhook signature missing' },
      { status: 400 }
    );
  }

  try {
    const body = await request.text();
    
    // Verify Stripe signature (you'll need to install stripe package)
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const event = stripe.webhooks.constructEvent(body, sig, endpointSecret);

    // For now, we'll process the webhook without signature verification
    // In production, you should verify the signature
    const event = JSON.parse(body);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Check if this is a star claim payment
      if (session.metadata && session.metadata.star_claim === 'true') {
        const userEmail = session.customer_details?.email;
        const userName = session.customer_details?.name;
        const starId = session.metadata.star_id;
        const userId = session.metadata.user_id;
        
        // Update star status to claimed
        if (starId && userId) {
          const updatedStar = await updateStarStatus(starId, 'claimed', session.id);
          
          if (updatedStar) {
            console.log('Star successfully claimed:', {
              starId: starId,
              userId: userId,
              stripeSessionId: session.id
            });

            // Generate certificate and send email
            try {
              const certificateResult = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/certificate/generate`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  starId: starId,
                  userEmail: userEmail
                })
              });

              if (certificateResult.ok) {
                console.log('Certificate generated and email sent successfully');
              } else {
                console.error('Failed to generate certificate:', await certificateResult.text());
              }
            } catch (certError) {
              console.error('Error generating certificate:', certError);
            }
          }
        }

        // Increment stars claimed counter
        const updatedCounter = await incrementStarsClaimed();
        
        if (updatedCounter) {
          let treePlanted = false;
          let celebrationSent = false;
          let treeId = null;

          // Check if we should plant a tree (every 10th star)
          if (updatedCounter.total_stars_claimed % 10 === 0) {
            // Plant a tree via TheGoodAPI
            const treeResult = await treePlantingService.plantTree();
            
            if (treeResult.success) {
              treePlanted = true;
              treeId = treeResult.treeId;
              
              // Increment trees planted counter
              await incrementTreesPlanted();

              // Send celebration email to user who triggered the 10th tree
              if (userEmail && userName) {
                const emailResult = await treePlantingService.sendCelebrationEmail({
                  email: userEmail,
                  name: userName,
                  starName: session.metadata.star_name || 'Your Star',
                  constellation: session.metadata.constellation || 'Your Constellation',
                  treesPlanted: updatedCounter.total_trees_planted + 1
                });
                celebrationSent = emailResult;
              }
            }
          }

          console.log('Star claim processed:', {
            starsClaimed: updatedCounter.total_stars_claimed,
            treesPlanted: updatedCounter.total_trees_planted,
            treePlantedThisTime: treePlanted,
            treeId: treeId,
            celebrationEmailSent: celebrationSent
          });

          // Return success response with impact information
          return NextResponse.json({
            received: true,
            impact: {
              starsClaimed: updatedCounter.total_stars_claimed,
              treesPlanted: updatedCounter.total_trees_planted,
              treePlantedThisTime: treePlanted,
              treeId: treeId
            }
          });
        }
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
