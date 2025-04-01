
import { createClient } from '@supabase/supabase-js';

// These will need to be replaced with actual values from your Supabase dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type User = {
  id: string;
  name: string;
  email: string;
  created_at?: string;
}

export type HealthMetric = {
  id: string;
  user_id: string;
  metric_type: string; // 'weight', 'height', 'blood_pressure', etc.
  value: string;
  unit: string;
  date: string;
  created_at?: string;
}

export type Workout = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  sets: number;
  reps: number;
  day: string; // 'monday', 'tuesday', etc.
  created_at?: string;
}

export type Activity = {
  id: string;
  user_id: string;
  activity_type: string;
  value: number;
  unit: string;
  date: string;
  created_at?: string;
}
