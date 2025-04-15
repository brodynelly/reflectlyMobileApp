/*
  # Update Guided Entries Support

  1. Changes
    - Add `entry_type` column to distinguish between daily and guided entries
    - Add `prompt` column to store the writing prompt
    - Add `response` column to store the user's response
    - Set default entry_type for existing entries

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to journal_entries table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'journal_entries' AND column_name = 'entry_type') 
  THEN
    ALTER TABLE journal_entries ADD COLUMN entry_type text DEFAULT 'daily';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'journal_entries' AND column_name = 'prompt') 
  THEN
    ALTER TABLE journal_entries ADD COLUMN prompt text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'journal_entries' AND column_name = 'response') 
  THEN
    ALTER TABLE journal_entries ADD COLUMN response text;
  END IF;
END $$;