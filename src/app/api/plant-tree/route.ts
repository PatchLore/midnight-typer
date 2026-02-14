import { NextResponse } from 'next/server';
import { treePlantingService } from '@/lib/tree-planting';
import { incrementStarsClaimed, incrementTreesPlanted, getImpactCounter } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userEmail, userName, starName, constellation } = body;

    // Increment stars claimed counter
    const updatedCounter = await incrementStarsClaimed();
    
    if (!updatedCounter) {
      return NextResponse.json(
        { error: 'Failed to update impact counter' },
        { status: 500 }
      );
    }

    let treePlanted = false;
    let celebrationSent = false;

    // Check if we should plant a tree (every 10th star)
    if (updatedCounter.total_stars_claimed % 10 === 0) {
      // Plant a tree
      const treeResult = await treePlantingService.plantTree();
      
      if (treeResult.success) {
        treePlanted = true;
        
        // Increment trees planted counter
        await incrementTreesPlanted();

        // Send celebration email if user info provided
        if (userEmail && userName && starName && constellation) {
          const emailResult = await treePlantingService.sendCelebrationEmail({
            email: userEmail,
            name: userName,
            starName: starName,
            constellation: constellation,
            treesPlanted: updatedCounter.total_trees_planted + 1
          });
          celebrationSent = emailResult;
        }
      }
    }

    return NextResponse.json({
      success: true,
      starsClaimed: updatedCounter.total_stars_claimed,
      treesPlanted: updatedCounter.total_trees_planted,
      treePlantedThisTime: treePlanted,
      celebrationEmailSent: celebrationSent,
      message: treePlanted 
        ? 'Tree planted successfully!' 
        : 'Star claimed. Keep typing to plant more trees!'
    });

  } catch (error) {
    console.error('Error in tree planting endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}