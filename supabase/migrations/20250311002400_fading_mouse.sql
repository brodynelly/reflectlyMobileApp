/*
  # Fix RLS policies and user constraints

  1. Changes
    - Add insert policy for ai_recommendations table
    - Ensure users table is populated from auth.users
    - Add trigger to automatically create user record
  
  2. Security
    - Enable RLS on tables
    - Add policies for authenticated users
*/

-- Create a trigger to automatically create a user record when a new auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add missing users from auth.users
INSERT INTO public.users (id, email)
SELECT id, email FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Add insert policy for ai_recommendations
CREATE POLICY "Users can create recommendations"
ON public.ai_recommendations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_metrics ENABLE ROW LEVEL SECURITY;