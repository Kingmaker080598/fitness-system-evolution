
import { supabase, Workout } from '@/lib/supabase';

export const getWorkoutsByDay = async (day: string) => {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('day', day)
      .order('id');
      
    if (error) throw error;
    return { success: true, data: data as Workout[] };
  } catch (error: any) {
    console.error(`Error getting workouts for ${day}:`, error.message);
    return { success: false, error: error.message, data: [] };
  }
};

export const getAllWorkouts = async () => {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('day');
      
    if (error) throw error;
    return { success: true, data: data as Workout[] };
  } catch (error: any) {
    console.error('Error getting all workouts:', error.message);
    return { success: false, error: error.message, data: [] };
  }
};

export const logWorkoutCompletion = async (userId: string, workoutId: string) => {
  try {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    const { data, error } = await supabase
      .from('workout_logs')
      .insert([
        {
          user_id: userId,
          workout_id: workoutId,
          completed_date: date
        }
      ]);
      
    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error('Error logging workout completion:', error.message);
    return { success: false, error: error.message };
  }
};
