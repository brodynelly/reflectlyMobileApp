/*
  # Create Quick Notes Table

  1. New Tables
    - `quick_notes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `content` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `quick_notes` table
    - Add policies for authenticated users to:
      - Create their own notes
      - Read their own notes
*/

CREATE TABLE IF NOT EXISTS quick_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quick_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create own notes"
  ON quick_notes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own notes"
  ON quick_notes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);