import { createClient } from '@supabase/supabase-js';

// Use the real Supabase URL and anon key from the auto-generated client
const supabaseUrl = "https://oiufgxtaehrwqnqmkhhc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pdWZneHRhZWhyd3FucW1raGhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNDc0MDAsImV4cCI6MjA1NzcyMzQwMH0.lDOXp643LdqP4xsj_fZxDQSSeKX2UpoexK06WJnjJ2Q";

// Create client with proper configuration for auth persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

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
