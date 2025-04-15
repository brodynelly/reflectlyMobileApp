/*
  # Program Management Schema

  1. New Tables
    - `programs`: Core program information
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `difficulty` (text)
      - `duration_days` (integer)
      - `theme` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `program_exercises`: Daily exercises within programs
      - `id` (uuid, primary key)
      - `program_id` (uuid, foreign key)
      - `title` (text)
      - `instructions` (text)
      - `estimated_minutes` (integer)
      - `exercise_type` (text)
      - `day_number` (integer)
      - `order_number` (integer)
      - `created_at` (timestamptz)

    - `user_program_progress`: Tracks user progress in programs
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `program_id` (uuid, foreign key)
      - `current_day` (integer)
      - `responses` (jsonb)
      - `is_completed` (boolean)
      - `started_at` (timestamptz)
      - `completed_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Programs are viewable by all authenticated users
    - Program exercises are viewable by all authenticated users
    - Users can only manage their own progress
*/

-- Create programs table
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL,
  duration_days integer NOT NULL,
  theme text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create program exercises table
CREATE TABLE IF NOT EXISTS program_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES programs(id) ON DELETE CASCADE,
  title text NOT NULL,
  instructions text NOT NULL,
  estimated_minutes integer NOT NULL,
  exercise_type text NOT NULL,
  day_number integer NOT NULL,
  order_number integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user program progress table
CREATE TABLE IF NOT EXISTS user_program_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id uuid REFERENCES programs(id) ON DELETE CASCADE,
  current_day integer DEFAULT 1,
  responses jsonb DEFAULT '{}',
  is_completed boolean DEFAULT false,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(user_id, program_id)
);

-- Enable Row Level Security
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_program_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for programs
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'programs' 
    AND policyname = 'Programs are viewable by all authenticated users'
  ) THEN
    CREATE POLICY "Programs are viewable by all authenticated users"
      ON programs
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create policies for program exercises
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'program_exercises' 
    AND policyname = 'Exercises are viewable by all authenticated users'
  ) THEN
    CREATE POLICY "Exercises are viewable by all authenticated users"
      ON program_exercises
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create policies for user program progress
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_program_progress' 
    AND policyname = 'Users can insert their own progress'
  ) THEN
    CREATE POLICY "Users can insert their own progress"
      ON user_program_progress
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_program_progress' 
    AND policyname = 'Users can view their own progress'
  ) THEN
    CREATE POLICY "Users can view their own progress"
      ON user_program_progress
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_program_progress' 
    AND policyname = 'Users can update their own progress'
  ) THEN
    CREATE POLICY "Users can update their own progress"
      ON user_program_progress
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Insert sample programs
INSERT INTO programs (title, description, category, difficulty, duration_days, theme) VALUES
('Mindful Self-Discovery', 'A journey to better understand yourself through daily reflection and mindfulness practices', 'love', 'Beginner', 7, 'self-discovery'),
('Emotional Balance', 'Learn to navigate and understand your emotions with greater clarity', 'healing', 'Intermediate', 14, 'emotional-wellbeing'),
('Anxiety Management', 'Develop practical tools and techniques for managing anxiety', 'anxiety', 'Beginner', 10, 'mental-health'),
('Inner Peace Journey', 'Find tranquility and balance in your daily life', 'peace', 'Beginner', 7, 'mindfulness'),
('Gratitude Practice', 'Cultivate a deeper appreciation for life''s blessings', 'hope', 'Beginner', 7, 'gratitude');

-- Insert sample exercises for the first program
INSERT INTO program_exercises (program_id, title, instructions, estimated_minutes, exercise_type, day_number, order_number) 
SELECT 
  id as program_id,
  'Morning Reflection',
  'Take a few minutes to sit quietly and reflect on your intentions for the day.',
  15,
  'reflection',
  1,
  1
FROM programs 
WHERE title = 'Mindful Self-Discovery';

INSERT INTO program_exercises (program_id, title, instructions, estimated_minutes, exercise_type, day_number, order_number)
SELECT 
  id as program_id,
  'Evening Gratitude',
  'Write down three things you''re grateful for from your day.',
  10,
  'writing',
  1,
  2
FROM programs
WHERE title = 'Mindful Self-Discovery';