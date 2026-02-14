import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import React from 'react';
import CertificatePDF from '@/components/CertificatePDF';
import { getImpactCounter, updateStarStatus } from '@/lib/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const resendApiKey = process.env.RESEND_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(resendApiKey);

export async function POST(request: Request) {
  try {
    const { starId, userEmail } = await request.json();

    if (!starId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing starId or userEmail' },
        { status: 400 }
      );
    }

    // Fetch star data from Supabase
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

    // Get impact counter for tree count
    const impactCounter = await getImpactCounter();
    const treeCount = impactCounter?.total_trees_planted || 0;

    // Generate PDF
    const pdfComponent = React.createElement(CertificatePDF, {
      starData: star.star_data,
      treeCount: treeCount,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    });

    // Convert PDF to buffer (this is a simplified approach)
    // In a real implementation, you'd use a proper PDF generation service
    const pdfBuffer = await generatePDFBuffer(pdfComponent);

    // Upload PDF to Supabase Storage
    const fileName = `certificate-${starId}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('certificates')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading PDF:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload certificate' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase
      .storage
      .from('certificates')
      .getPublicUrl(fileName);

    const certificateUrl = publicUrlData.publicUrl;

    // Update star record with certificate URL
    const { data: updatedStar, error: updateError } = await supabase
      .from('stars')
      .update({
        certificate_url: certificateUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', starId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating star with certificate URL:', updateError);
      return NextResponse.json(
        { error: 'Failed to update star record' },
        { status: 500 }
      );
    }

    // Send email via Resend
    const emailResult = await resend.emails.send({
      from: 'Cosmos Cartography <noreply@cosmos.cartography>',
      to: [userEmail],
      subject: `Your star ${star.star_data.name || 'Unnamed Star'} is officially registered`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ffd700; text-align: center;">Certificate of Stellar Recovery</h2>
          <p>Dear Star Guardian,</p>
          <p>Congratulations! Your star has been officially registered in the Cosmic Cartography Registry.</p>
          
          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #ffd700; margin-top: 0;">Star Details:</h3>
            <p><strong>Name:</strong> ${star.star_data.name || 'Unnamed Star'}</p>
            <p><strong>Coordinates:</strong> RA ${star.star_data.ra}, Dec ${star.star_data.dec}</p>
            <p><strong>Spectral Class:</strong> ${star.star_data.spectralClass}</p>
            <p><strong>Magnitude:</strong> ${star.star_data.magnitude.toFixed(2)}</p>
          </div>

          <p>You can download your official certificate below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${certificateUrl}" 
               style="background: #ffd700; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
               Download Certificate
            </a>
          </div>

          <p style="font-size: 14px; color: #888;">
            This star is part of a constellation that has planted ${treeCount} trees on Earth.
            Thank you for supporting our mission to connect the cosmos with our planet.
          </p>
        </div>
      `
    });

    if (emailResult.error) {
      console.error('Error sending email:', emailResult.error);
      // Don't fail the request if email fails, just log it
    }

    return NextResponse.json({
      success: true,
      url: certificateUrl,
      emailSent: !!emailResult.data
    });

  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}

// Helper function to generate PDF buffer
// Note: This is a placeholder - in production you'd use a proper PDF generation service
async function generatePDFBuffer(pdfComponent: React.ReactElement) {
  // This would need to be implemented with a proper PDF generation library
  // For now, return a placeholder buffer
  return Buffer.from('PDF generation placeholder');
}

// Add certificate_url to the StarRecord interface in the supabase.ts file
// This is a reminder that the database schema should include this field
