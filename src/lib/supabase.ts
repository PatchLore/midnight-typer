import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ImpactCounter {
  id: number;
  total_stars_claimed: number;
  total_trees_planted: number;
  last_tree_planted_at: string | null;
}

export interface StarData {
  id: string;
  name: string | null;
  ra: string;
  dec: string;
  magnitude: number;
  spectralClass: 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M';
  color: string;
  constellationPoints: {x: number, y: number}[];
  radius: number;
  sessionSnapshot: {
    id: string;
    wpm: number;
    accuracy: number;
    durationMinutes: number;
    wordCount: number;
    timestamp: number;
  };
}

export interface StarRecord {
  id: string;
  user_id: string;
  star_data: StarData;
  status: 'unclaimed' | 'claimed' | 'gifted';
  created_at: string;
  claimed_at: string | null;
  stripe_session_id: string | null;
  certificate_url: string | null;
}

export interface UserGalaxy {
  user_id: string;
  slots_unlocked: number;
  slots_used: number;
  total_words_typed: number;
}

export const getImpactCounter = async (): Promise<ImpactCounter | null> => {
  const { data, error } = await supabase
    .from('impact_counter')
    .select('*')
    .order('id', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Error fetching impact counter:', error);
    return null;
  }

  return data?.[0] || null;
};

export const incrementStarsClaimed = async (): Promise<ImpactCounter | null> => {
  const { data: currentCounter, error: fetchError } = await supabase
    .from('impact_counter')
    .select('*')
    .order('id', { ascending: false })
    .limit(1);

  if (fetchError) {
    console.error('Error fetching current counter:', fetchError);
    return null;
  }

  const current = currentCounter?.[0];
  
  if (current) {
    const newTotal = current.total_stars_claimed + 1;
    const { data, error } = await supabase
      .from('impact_counter')
      .update({ 
        total_stars_claimed: newTotal,
        updated_at: new Date().toISOString()
      })
      .eq('id', current.id)
      .select();

    if (error) {
      console.error('Error updating stars claimed:', error);
      return null;
    }

    return data?.[0] || null;
  } else {
    // Create initial record
    const { data, error } = await supabase
      .from('impact_counter')
      .insert({ 
        total_stars_claimed: 1,
        total_trees_planted: 0,
        last_tree_planted_at: null
      })
      .select();

    if (error) {
      console.error('Error creating impact counter:', error);
      return null;
    }

    return data?.[0] || null;
  }
};

export const incrementTreesPlanted = async (): Promise<ImpactCounter | null> => {
  const { data: currentCounter, error: fetchError } = await supabase
    .from('impact_counter')
    .select('*')
    .order('id', { ascending: false })
    .limit(1);

  if (fetchError) {
    console.error('Error fetching current counter:', fetchError);
    return null;
  }

  const current = currentCounter?.[0];
  
  if (current) {
    const newTreeCount = current.total_trees_planted + 1;
    const { data, error } = await supabase
      .from('impact_counter')
      .update({ 
        total_trees_planted: newTreeCount,
        last_tree_planted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', current.id)
      .select();

    if (error) {
      console.error('Error updating trees planted:', error);
      return null;
    }

    return data?.[0] || null;
  }

  return null;
};

// Stars table operations
export const saveStar = async (starData: StarData, userId: string): Promise<StarRecord | null> => {
  const { data, error } = await supabase
    .from('stars')
    .insert({
      user_id: userId,
      star_data: starData,
      status: 'unclaimed',
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving star:', error);
    return null;
  }

  return data;
};

export const getUserStars = async (userId: string): Promise<StarRecord[]> => {
  const { data, error } = await supabase
    .from('stars')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user stars:', error);
    return [];
  }

  return data || [];
};

export const updateStarStatus = async (starId: string, status: 'claimed' | 'gifted', stripeSessionId?: string): Promise<StarRecord | null> => {
  const { data, error } = await supabase
    .from('stars')
    .update({
      status,
      claimed_at: new Date().toISOString(),
      stripe_session_id: stripeSessionId || null
    })
    .eq('id', starId)
    .select()
    .single();

  if (error) {
    console.error('Error updating star status:', error);
    return null;
  }

  return data;
};

// User galaxy operations
export const getUserGalaxy = async (userId: string): Promise<UserGalaxy | null> => {
  const { data, error } = await supabase
    .from('user_galaxy')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user galaxy:', error);
    return null;
  }

  return data;
};

export const createUserGalaxy = async (userId: string): Promise<UserGalaxy | null> => {
  const { data, error } = await supabase
    .from('user_galaxy')
    .insert({
      user_id: userId,
      slots_unlocked: 0,
      slots_used: 0,
      total_words_typed: 0
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user galaxy:', error);
    return null;
  }

  return data;
};

export const updateUserGalaxy = async (
  userId: string, 
  updates: Partial<Pick<UserGalaxy, 'total_words_typed' | 'slots_used'>>
): Promise<UserGalaxy | null> => {
  const currentGalaxy = await getUserGalaxy(userId);
  
  if (!currentGalaxy) {
    return await createUserGalaxy(userId);
  }

  const newTotalWords = (currentGalaxy.total_words_typed || 0) + (updates.total_words_typed || 0);
  const newSlotsUnlocked = Math.floor(newTotalWords / 1000);
  const newSlotsUsed = (currentGalaxy.slots_used || 0) + (updates.slots_used || 0);

  const { data, error } = await supabase
    .from('user_galaxy')
    .update({
      total_words_typed: newTotalWords,
      slots_unlocked: newSlotsUnlocked,
      slots_used: newSlotsUsed
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user galaxy:', error);
    return null;
  }

  return data;
};

export const getAvailableSlots = async (userId: string): Promise<{ available: number; needed: number }> => {
  const galaxy = await getUserGalaxy(userId);
  
  if (!galaxy) {
    return { available: 0, needed: 1000 };
  }

  const availableSlots = galaxy.slots_unlocked - galaxy.slots_used;
  const wordsNeeded = Math.max(0, 1000 - (galaxy.total_words_typed % 1000));

  return {
    available: Math.max(0, availableSlots),
    needed: availableSlots > 0 ? 0 : wordsNeeded
  };
};
