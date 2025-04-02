
import { supabase, Profile } from '@/lib/supabase';

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    if (data) {
      return { success: true, data: data as Profile };
    }

    // If profile doesn't exist, create it
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert([{ id: userId }])
      .select()
      .single();

    if (createError) throw createError;
    return { success: true, data: newProfile as Profile };
  } catch (error: any) {
    console.error('Error getting user profile:', error.message);
    return { success: false, error: error.message, data: null };
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<Profile>) => {
  try {
    console.log('Updating profile for user:', userId);
    console.log('Updates:', updates);

    // First check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (checkError) {
      console.error('Error checking profile:', checkError);
      throw checkError;
    }

    if (!existingProfile) {
      console.log('Profile does not exist, creating new profile');
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([{ id: userId, ...updates }])
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        throw createError;
      }

      return { success: true, data: newProfile };
    }

    console.log('Existing profile found, updating...');
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating profile:', updateError);
      throw updateError;
    }

    // Fetch the latest profile data to ensure we have the most up-to-date version
    const { data: refreshedProfile, error: refreshError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (refreshError) {
      console.error('Error refreshing profile:', refreshError);
      throw refreshError;
    }

    console.log('Profile successfully updated and refreshed:', refreshedProfile);
    return { success: true, data: refreshedProfile };
  } catch (error: any) {
    console.error('Error in updateUserProfile:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    return { success: false, error: error.message };
  }
};

export const getUserStats = async (userId: string) => {
  try {
    // Get workout completions count
    const { data: workoutLogs, error: workoutError } = await supabase
      .from('workout_logs')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);
      
    if (workoutError) throw workoutError;
    
    // Get streak (consecutive days with activities)
    // This is a simplified version - a more accurate implementation would 
    // need a more complex query or server-side function
    const { data: streakData, error: streakError } = await supabase
      .from('activities')
      .select('date')
      .eq('user_id', userId)
      .order('date', { ascending: false });
      
    if (streakError) throw streakError;
    
    // Calculate streak (simplified)
    let streak = 0;
    const uniqueDates = new Set();
    
    streakData?.forEach(item => {
      uniqueDates.add(item.date);
    });
    
    const dateArray = Array.from(uniqueDates) as string[];
    dateArray.sort().reverse();
    
    if (dateArray.length > 0) {
      streak = 1;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let currentDate = new Date(dateArray[0]);
      
      for (let i = 1; i < dateArray.length; i++) {
        const prevDate = new Date(dateArray[i]);
        const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          streak++;
          currentDate = prevDate;
        } else {
          break;
        }
      }
    }
    
    // Get total hours spent working out
    // This is simplified - you'd need to store duration for each workout
    const { data: activityData, error: activityError } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .eq('activity_type', 'workout_duration');
      
    if (activityError) throw activityError;
    
    const hours = activityData?.reduce((acc, curr) => acc + Number(curr.value), 0) || 0;
    
    // Get total days active
    const { data: daysData, error: daysError } = await supabase
      .from('activities')
      .select('date')
      .eq('user_id', userId);
      
    if (daysError) throw daysError;
    
    const uniqueDaysSet = new Set();
    daysData?.forEach(item => {
      uniqueDaysSet.add(item.date);
    });
    
    const days = uniqueDaysSet.size;
    
    return { 
      success: true, 
      data: {
        workouts: workoutLogs?.length || 0,
        streak,
        hours,
        days,
        level: Math.floor((workoutLogs?.length || 0) / 10) + 1 // Simple level calculation
      }
    };
  } catch (error: any) {
    console.error('Error getting user stats:', error.message);
    return { 
      success: false, 
      error: error.message,
      data: {
        workouts: 0,
        streak: 0,
        hours: 0,
        days: 0,
        level: 1
      }
    };
  }
};
