/*
  # Fix Programs Schema and Data

  1. Tables
    - Recreate programs table with correct schema
    - Recreate program_exercises table with correct schema
    - Recreate user_program_progress table with correct schema

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table

  3. Data
    - Insert initial program data
    - Insert program exercises
*/

-- Drop existing tables if they exist (in correct order)
DROP TABLE IF EXISTS user_program_progress;
DROP TABLE IF EXISTS program_exercises;
DROP TABLE IF EXISTS programs;

-- Create programs table
CREATE TABLE programs (
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
CREATE TABLE program_exercises (
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
CREATE TABLE user_program_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id uuid REFERENCES programs(id) ON DELETE CASCADE,
  current_day integer DEFAULT 1,
  responses jsonb DEFAULT '{}'::jsonb,
  is_completed boolean DEFAULT false,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(user_id, program_id)
);

-- Enable Row Level Security
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_program_progress ENABLE ROW LEVEL SECURITY;

-- Set up RLS policies
CREATE POLICY "Programs are viewable by all authenticated users"
  ON programs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Exercises are viewable by all authenticated users"
  ON program_exercises
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view their own progress"
  ON user_program_progress
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own progress"
  ON user_program_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own progress"
  ON user_program_progress
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_programs_updated_at
  BEFORE UPDATE ON programs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial program data
INSERT INTO programs (id, title, description, category, difficulty, duration_days, theme)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Self-Love Journey', 'Develop a deeper connection with yourself through daily reflection and self-care practices', 'love', 'beginner', 7, 'love'),
  ('22222222-2222-2222-2222-222222222222', 'Anxiety Toolkit', 'Essential tools and techniques for managing anxiety', 'anxiety', 'beginner', 7, 'anxiety'),
  ('33333333-3333-3333-3333-333333333333', 'Inner Peace Journey', 'Find tranquility and balance in your daily life', 'peace', 'beginner', 7, 'peace'),
  ('44444444-4444-4444-4444-444444444444', 'Emotional Balance', 'Learn to navigate and understand your emotions with greater clarity', 'healing', 'intermediate', 14, 'healing');

-- Insert program exercises
INSERT INTO program_exercises (program_id, title, instructions, estimated_minutes, exercise_type, day_number, order_number)
VALUES
  -- Self-Love Journey - Day 1
  ('11111111-1111-1111-1111-111111111111', 'Morning Reflection', 'Start your day with a gentle self-reflection exercise', 15, 'reflection', 1, 1),
  ('11111111-1111-1111-1111-111111111111', 'Gratitude Practice', 'Write down three things you appreciate about yourself', 10, 'writing', 1, 2),
  
  -- Anxiety Toolkit - Day 1
  ('22222222-2222-2222-2222-222222222222', 'Breathing Exercise', 'Practice deep breathing techniques for immediate calm', 10, 'breathing', 1, 1),
  ('22222222-2222-2222-2222-222222222222', 'Worry Journal', 'Document and analyze your anxious thoughts', 15, 'writing', 1, 2),
  
  -- Inner Peace Journey - Day 1
  ('33333333-3333-3333-3333-333333333333', 'Peace Meditation', 'Guided meditation for inner peace', 15, 'meditation', 1, 1),
  ('33333333-3333-3333-3333-333333333333', 'Peaceful Environment', 'Create a calming space in your home', 20, 'activity', 1, 2),
  
  -- Emotional Balance - Day 1
  ('44444444-4444-4444-4444-444444444444', 'Emotion Tracking', 'Track and understand your emotional patterns', 15, 'observation', 1, 1),
  ('44444444-4444-4444-4444-444444444444', 'Response Patterns', 'Identify your typical emotional responses', 20, 'analysis', 1, 2);