import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getSupabase } from '@/lib/supabase';

// Lazy init Resend
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY');
  }
  return new Resend(apiKey);
};

export async function POST(req: NextRequest) {
  try {
    const { starId, userEmail } = await req.json();
    
    if (!starId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing starId or userEmail' },
        { status: 400 }
      );
    }

    // Get star data
    const supabase = getSupabase();
    const { data: star, error: starError } = await supabase
      .from('stars')
      .select('*')
      .eq('id', starId)
      .single();

    if (starError || !star) {
      return NextResponse.json(
        { error: 'Star not found' },
        { status: 404 }
      );
    }

    // Generate PDF certificate (your existing logic)
    // ... certificate generation code ...

    // Upload to Supabase storage
    // ... storage code ...

    // Send email (only initialize Resend here)
    const resend = getResend();
    await resend.emails.send({
      from: 'Cosmos Cartography <stars@midnighttyper.com>',
      to: userEmail,
      subject: `Your Star Certificate - ${star.star_data.name || 'Unnamed Star'}`,
      html: `<p>Your certificate is attached!</p>`,
      attachments: [
        {
          filename: `star-certificate-${starId}.pdf`,
          // content: pdfBuffer.toString('base64'), // your PDF data
        }
      ]
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}