/*
  # Programs and Progress Schema

  1. New Tables
    - `programs`
      - Core program information
      - Title, description, category, difficulty, duration
    - `program_exercises`
      - Individual exercises within programs
      - Instructions, estimated time, order
    - `user_program_progress`
      - Tracks user progress through programs
      - Current day, completion status, responses

  2. Security
    - Enable RLS on all tables
    - Add policies for user access
*/

-- Programs table
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

-- Program exercises table
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

-- User program progress table
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

-- Enable RLS
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_program_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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

CREATE POLICY "Users can insert their own progress"
  ON user_program_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own progress"
  ON user_program_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_program_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert sample programs
INSERT INTO programs (title, description, category, difficulty, duration_days, theme) VALUES
-- Love Programs
('Self-Love Journey', 'Develop a deeper connection with yourself through daily reflection and self-care practices', 'love', 'beginner', 7, 'Nurturing self-acceptance'),
('Relationship Harmony', 'Strengthen your relationships through understanding and communication', 'love', 'intermediate', 14, 'Building connections'),
('Healing Hearts', 'Process past relationship experiences and build emotional resilience', 'love', 'advanced', 21, 'Emotional healing'),
('Love Languages', 'Discover and understand different ways of expressing and receiving love', 'love', 'beginner', 5, 'Understanding love'),
('Boundaries & Love', 'Learn to set healthy boundaries while maintaining loving relationships', 'love', 'intermediate', 10, 'Healthy relationships'),

-- Healing Programs
('Inner Child Healing', 'Connect with and heal your inner child through guided exercises', 'healing', 'intermediate', 14, 'Self-discovery'),
('Trauma Release', 'Gentle practices for processing and releasing trauma', 'healing', 'advanced', 21, 'Trauma healing'),
('Daily Renewal', 'Simple daily practices for emotional healing and growth', 'healing', 'beginner', 7, 'Daily healing'),
('Forgiveness Journey', 'Learn to forgive yourself and others', 'healing', 'intermediate', 14, 'Forgiveness'),
('Emotional First Aid', 'Tools and techniques for emotional healing', 'healing', 'beginner', 5, 'Emotional care'),

-- Anxiety Programs
('Anxiety Toolkit', 'Essential tools and techniques for managing anxiety', 'anxiety', 'beginner', 7, 'Anxiety management'),
('Calm Mind', 'Advanced meditation and mindfulness practices', 'anxiety', 'advanced', 21, 'Mindfulness'),
('Worry Less', 'Practical strategies to reduce worry and anxiety', 'anxiety', 'intermediate', 14, 'Worry reduction'),
('Social Confidence', 'Build confidence in social situations', 'anxiety', 'beginner', 10, 'Social anxiety'),
('Panic Prevention', 'Tools for preventing and managing panic attacks', 'anxiety', 'intermediate', 14, 'Panic management'),

-- Hope Programs
('Hope Builders', 'Daily practices to cultivate hope and optimism', 'hope', 'beginner', 7, 'Building hope'),
('Future Vision', 'Create and work towards a hopeful future', 'hope', 'intermediate', 14, 'Future planning'),
('Resilience Road', 'Build resilience through challenging times', 'hope', 'advanced', 21, 'Resilience'),
('Daily Inspiration', 'Short daily practices to maintain hope', 'hope', 'beginner', 5, 'Daily hope'),
('Hope in Action', 'Transform hope into concrete actions', 'hope', 'intermediate', 10, 'Active hope'),

-- Peace Programs
('Inner Peace', 'Find and maintain inner peace through daily practices', 'peace', 'beginner', 7, 'Finding peace'),
('Peace in Chaos', 'Maintain peace during challenging times', 'peace', 'advanced', 21, 'Stress management'),
('Peaceful Living', 'Create a more peaceful daily life', 'peace', 'intermediate', 14, 'Daily peace'),
('Peace & Purpose', 'Align your life with your values for greater peace', 'peace', 'beginner', 10, 'Purposeful peace'),
('Deep Tranquility', 'Advanced practices for deep inner peace', 'peace', 'advanced', 21, 'Deep peace');

-- Insert sample exercises (just a few examples)
INSERT INTO program_exercises (program_id, title, instructions, estimated_minutes, exercise_type, day_number, order_number) 
SELECT 
  id,
  'Morning Reflection',
  'Take a few moments to connect with yourself. How are you feeling right now? What intentions would you like to set for the day?',
  15,
  'reflection',
  1,
  1
FROM programs 
WHERE title = 'Self-Love Journey';

INSERT INTO program_exercises (program_id, title, instructions, estimated_minutes, exercise_type, day_number, order_number)
SELECT 
  id,
  'Gratitude Practice',
  'List three things you appreciate about yourself today. Be specific and reflect on why these qualities matter to you.',
  10,
  'gratitude',
  1,
  2
FROM programs
WHERE title = 'Self-Love Journey';