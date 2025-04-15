/*
  # Create User Settings Table
  
  1. New Tables
    - `user_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, unique, references auth.users)
      - `theme` (text, default 'system')
      - `notifications_enabled` (boolean, default true)
      - `journal_reminder` (boolean, default true)
      - `weekly_insights` (boolean, default true)
      - `program_updates` (boolean, default true)
      - `app_lock_enabled` (boolean, default false)
      - `hide_content` (boolean, default true)
      - `data_collection` (boolean, default true)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users to manage their own settings
*/

-- Create the user_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  theme text DEFAULT 'system',
  notifications_enabled boolean DEFAULT true,
  journal_reminder boolean DEFAULT true,
  weekly_insights boolean DEFAULT true,
  program_updates boolean DEFAULT true,
  app_lock_enabled boolean DEFAULT false,
  hide_content boolean DEFAULT true,
  data_collection boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
  DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
  DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create policies
CREATE POLICY "Users can insert own settings"
  ON user_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own settings"
  ON user_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create or replace trigger for updating the updated_at column
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();