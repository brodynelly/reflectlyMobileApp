/*
  # Add Guided Entries Support

  1. Changes
    - Add `prompt` column to store the writing prompt used
    - Add `response` column to store the user's response to the prompt
    - Add `entry_type` column to distinguish between daily and guided entries
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to journal_entries table
ALTER TABLE journal_entries 
ADD COLUMN IF NOT EXISTS prompt text,
ADD COLUMN IF NOT EXISTS response text,
ADD COLUMN IF NOT EXISTS entry_type text DEFAULT 'daily';

-- Update existing entries to have entry_type='daily'
UPDATE journal_entries 
SET entry_type = 'daily' 
WHERE entry_type IS NULL;