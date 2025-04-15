/*
  # Create Daily and Guided Journal Tables

  1. New Tables
    - `daily_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `content` (text)
      - `mood` (text)
      - `gratitude` (text array)
      - `goals` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `guided_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `mood` (text)
      - `prompt` (text)
      - `response` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to:
      - Create their own entries
      - Read their own entries
      - Update their own entries
*/

-- Create daily entries table
CREATE TABLE IF NOT EXISTS daily_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  mood text NOT NULL,
  gratitude text[] DEFAULT '{}',
  goals text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create guided entries table
CREATE TABLE IF NOT EXISTS guided_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  mood text NOT NULL,
  prompt text NOT NULL,
  response text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE guided_entries ENABLE ROW LEVEL SECURITY;

-- Policies for daily entries
CREATE POLICY "Users can create own daily entries"
  ON daily_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own daily entries"
  ON daily_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own daily entries"
  ON daily_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for guided entries
CREATE POLICY "Users can create own guided entries"
  ON guided_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own guided entries"
  ON guided_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own guided entries"
  ON guided_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_daily_entries_updated_at
  BEFORE UPDATE ON daily_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guided_entries_updated_at
  BEFORE UPDATE ON guided_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();