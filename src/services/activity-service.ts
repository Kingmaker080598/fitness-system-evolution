
import { supabase, Activity } from '@/lib/supabase';

export const logActivity = async (
  userId: string,
  activityType: string,
  value: number,
  unit: string
) => {
  try {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    const { data, error } = await supabase
      .from('activities')
      .insert([
        {
          user_id: userId,
          activity_type: activityType,
          value,
          unit,
          date
        }
      ]);
      
    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error(`Error logging ${activityType}:`, error.message);
    return { success: false, error: error.message };
  }
};

export const getActivitiesByDate = async (userId: string, date: string) => {
  try {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date);
      
    if (error) throw error;
    return { success: true, data: data as Activity[] };
  } catch (error: any) {
    console.error(`Error getting activities for ${date}:`, error.message);
    return { success: false, error: error.message, data: [] };
  }
};

export const getActivityHistory = async (userId: string, activityType: string, limit = 7) => {
  try {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .eq('activity_type', activityType)
      .order('date', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    return { success: true, data: data as Activity[] };
  } catch (error: any) {
    console.error(`Error getting ${activityType} history:`, error.message);
    return { success: false, error: error.message, data: [] };
  }
};
