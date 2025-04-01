
import { createClient } from '@supabase/supabase-js';

// These values need to be replaced with actual values from your Supabase dashboard for production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key-for-development-only';

// Check if we have real credentials and log a warning if we don't
const usingRealCredentials = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
if (!usingRealCredentials) {
  console.warn(
    'Using development placeholders for Supabase. The app will work, but no real data will be saved or retrieved. ' +
    'For real functionality, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
  );
}

// Create client with placeholder values if real ones aren't available
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// In development with placeholders, we'll simulate responses
if (!usingRealCredentials) {
  // This is a mock version that will be used when proper credentials aren't provided
  // No actual implementation needed here as the real services have fallbacks
}

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
