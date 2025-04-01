
# Supabase Setup Instructions

This document provides instructions for setting up the Supabase backend for the Solo Fitness app.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up or log in
2. Create a new project and give it a name (e.g., "solo-fitness")
3. Wait for the database to be created (this may take a few minutes)
4. Once created, go to Project Settings > API to find your project URL and anon key

## 2. Set Environment Variables

In your frontend project, create an environment file with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Create Database Tables

Run the following SQL in the Supabase SQL Editor to create the necessary tables:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create health_metrics table
CREATE TABLE health_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,  -- 'weight', 'height', 'blood_pressure', 'heart_rate', 'blood_sugar'
  value TEXT NOT NULL,
  unit TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create workouts table
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  sets INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  day TEXT NOT NULL,  -- 'monday', 'tuesday', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create workout_logs table
CREATE TABLE workout_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create activities table
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,  -- 'pushups', 'walking', 'running', 'water', 'workout_duration'
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 4. Set Up Row Level Security (RLS)

Run the following SQL to set up RLS policies for your tables:

```sql
-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Health metrics policies
CREATE POLICY "Users can view their own health metrics"
  ON health_metrics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health metrics"
  ON health_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health metrics"
  ON health_metrics FOR UPDATE
  USING (auth.uid() = user_id);

-- Workouts policies
CREATE POLICY "Anyone can view workouts"
  ON workouts FOR SELECT
  TO authenticated
  USING (true);

-- Workout logs policies
CREATE POLICY "Users can view their own workout logs"
  ON workout_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout logs"
  ON workout_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Activities policies
CREATE POLICY "Users can view their own activities"
  ON activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities"
  ON activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities"
  ON activities FOR UPDATE
  USING (auth.uid() = user_id);
```

## 5. Seed Initial Workout Data

Run the following SQL to add some initial workouts:

```sql
-- Monday workouts
INSERT INTO workouts (title, description, image_url, sets, reps, day)
VALUES 
('Push-ups', 'Keep your body straight and lower until your chest nearly touches the ground.', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop', 3, 12, 'monday'),
('Tricep Dips', 'Use a chair or bench, lower your body until arms are at 90 degrees.', 'https://images.unsplash.com/photo-1530021356476-0a6375ffe73b?q=80&w=1000&auto=format&fit=crop', 3, 15, 'monday'),
('Incline Push-ups', 'Place hands on elevated surface. Easier variation of standard push-ups.', 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1000&auto=format&fit=crop', 3, 10, 'monday');

-- Tuesday workouts
INSERT INTO workouts (title, description, image_url, sets, reps, day)
VALUES 
('Bodyweight Rows', 'Use a table or horizontal bar, pull your chest towards the bar.', 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?q=80&w=1000&auto=format&fit=crop', 3, 12, 'tuesday'),
('Bicep Isometric Holds', 'Hold position with arms at 90 degrees for time indicated.', 'https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=1000&auto=format&fit=crop', 3, 30, 'tuesday');

-- Wednesday workouts
INSERT INTO workouts (title, description, image_url, sets, reps, day)
VALUES 
('Bodyweight Squats', 'Stand with feet shoulder-width apart, lower until thighs are parallel to ground.', 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=1000&auto=format&fit=crop', 4, 15, 'wednesday'),
('Lunges', 'Step forward and lower your body until both knees form 90-degree angles.', 'https://images.unsplash.com/photo-1540338935410-857cc5cfa5b3?q=80&w=1000&auto=format&fit=crop', 3, 10, 'wednesday');

-- Thursday workouts
INSERT INTO workouts (title, description, image_url, sets, reps, day)
VALUES 
('Pike Push-ups', 'Form an inverted V, lower head toward the ground to target shoulders.', 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?q=80&w=1000&auto=format&fit=crop', 3, 10, 'thursday'),
('Jumping Jacks', 'Jump while spreading arms and legs, then return to standing position.', 'https://images.unsplash.com/photo-1582656447063-637a9e5d3a91?q=80&w=1000&auto=format&fit=crop', 3, 30, 'thursday');

-- Friday workouts
INSERT INTO workouts (title, description, image_url, sets, reps, day)
VALUES 
('Burpees', 'Combination of squat, push-up, and jump. Full body exercise.', 'https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=1000&auto=format&fit=crop', 3, 10, 'friday'),
('Mountain Climbers', 'From plank position, alternate bringing knees to chest quickly.', 'https://images.unsplash.com/photo-1520208422220-d12a3c588e6c?q=80&w=1000&auto=format&fit=crop', 3, 20, 'friday');

-- Saturday workouts
INSERT INTO workouts (title, description, image_url, sets, reps, day)
VALUES 
('Gentle Stretching', 'Full body stretching routine, hold each stretch for 30 seconds.', 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=1000&auto=format&fit=crop', 1, 10, 'saturday'),
('Light Walking', 'Take a 20-minute walk at a comfortable pace.', 'https://images.unsplash.com/photo-1507120878965-54b2d3939100?q=80&w=1000&auto=format&fit=crop', 1, 20, 'saturday');

-- Sunday workouts
INSERT INTO workouts (title, description, image_url, sets, reps, day)
VALUES 
('Your Choice', 'Choose your own workout based on how you feel today.', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop', 3, 10, 'sunday');
```

## 6. Deploy Your App

After setting up your Supabase backend:

1. Build your mobile app for Android and iOS
2. Submit to the App Store and Google Play Store
3. Start using your fitness tracking app with a full PostgreSQL database backend!
