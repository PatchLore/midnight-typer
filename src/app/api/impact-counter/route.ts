import { NextResponse } from 'next/server';
import { getImpactCounter } from '@/lib/supabase';

export async function GET() {
  try {
    const impactData = await getImpactCounter();
    
    if (!impactData) {
      // Return default values if no data exists yet
      return NextResponse.json({
        total_stars_claimed: 0,
        total_trees_planted: 0
      });
    }

    return NextResponse.json({
      total_stars_claimed: impactData.total_stars_claimed,
      total_trees_planted: impactData.total_trees_planted
    });
  } catch (error) {
    console.error('Error fetching impact counter:', error);
    return NextResponse.json(
      { error: 'Failed to fetch impact data' },
      { status: 500 }
    );
  }
}