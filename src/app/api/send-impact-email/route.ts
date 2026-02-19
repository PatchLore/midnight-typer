import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { to, data } = await request.json();
    
    await resend.emails.send({
      from: 'Cosmos Cartography <stars@cosmoscartography.com>',
      to: [to],
      subject: '🌳 A tree was planted because of you!',
      html: `<p>Star ${data.starName} helped plant tree #${data.treesPlanted}</p>`
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}