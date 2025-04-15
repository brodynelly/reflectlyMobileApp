/*
  # Programs and Exercises Migration

  1. New Tables
    - Creates initial program data
    - Adds exercises for Self-Love Journey and Anxiety Toolkit programs

  2. Data Structure
    - Programs with metadata (title, description, category, etc.)
    - Exercises with detailed instructions and timing
    - Proper foreign key relationships

  3. Security
    - RLS policies for authenticated access
*/

-- Create programs if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM programs LIMIT 1) THEN
    INSERT INTO programs (title, description, category, difficulty, duration_days, theme) VALUES
      ('Self-Love Journey', 'Develop a deeper connection with yourself through daily reflection and self-care practices', 'personal-growth', 'beginner', 7, 'love'),
      ('Relationship Harmony', 'Strengthen your relationships through understanding and communication', 'relationships', 'intermediate', 14, 'love'),
      ('Healing Hearts', 'Process past relationship experiences and build emotional resilience', 'healing', 'advanced', 21, 'healing'),
      ('Love Languages', 'Discover and understand different ways of expressing and receiving love', 'relationships', 'beginner', 5, 'love'),
      ('Boundaries & Love', 'Learn to set healthy boundaries while maintaining loving relationships', 'relationships', 'intermediate', 10, 'love'),
      ('Inner Child Healing', 'Connect with and heal your inner child through guided exercises', 'healing', 'intermediate', 14, 'healing'),
      ('Trauma Release', 'Gentle practices for processing and releasing trauma', 'healing', 'advanced', 21, 'healing'),
      ('Daily Renewal', 'Simple daily practices for emotional healing and growth', 'healing', 'beginner', 7, 'healing'),
      ('Forgiveness Journey', 'Learn to forgive yourself and others', 'healing', 'intermediate', 14, 'healing'),
      ('Emotional First Aid', 'Tools and techniques for emotional healing', 'healing', 'beginner', 5, 'healing'),
      ('Anxiety Toolkit', 'Essential tools and techniques for managing anxiety', 'anxiety', 'beginner', 7, 'anxiety'),
      ('Calm Mind', 'Advanced meditation and mindfulness practices', 'meditation', 'advanced', 21, 'peace'),
      ('Worry Less', 'Practical strategies to reduce worry and anxiety', 'anxiety', 'intermediate', 14, 'anxiety'),
      ('Social Confidence', 'Build confidence in social situations', 'anxiety', 'beginner', 10, 'anxiety'),
      ('Panic Prevention', 'Tools for preventing and managing panic attacks', 'anxiety', 'intermediate', 14, 'anxiety'),
      ('Hope Builders', 'Daily practices to cultivate hope and optimism', 'hope', 'beginner', 7, 'hope'),
      ('Future Vision', 'Create and work towards a hopeful future', 'hope', 'intermediate', 14, 'hope'),
      ('Resilience Road', 'Build resilience through challenging times', 'hope', 'advanced', 21, 'hope'),
      ('Daily Inspiration', 'Short daily practices to maintain hope', 'hope', 'beginner', 5, 'hope'),
      ('Hope in Action', 'Transform hope into concrete actions', 'hope', 'intermediate', 10, 'hope'),
      ('Inner Peace', 'Find and maintain inner peace through daily practices', 'peace', 'beginner', 7, 'peace'),
      ('Peace in Chaos', 'Maintain peace during challenging times', 'peace', 'advanced', 21, 'peace'),
      ('Peaceful Living', 'Create a more peaceful daily life', 'peace', 'intermediate', 14, 'peace'),
      ('Peace & Purpose', 'Align your life with your values for greater peace', 'peace', 'beginner', 10, 'peace'),
      ('Deep Tranquility', 'Advanced practices for deep inner peace', 'peace', 'advanced', 21, 'peace'),
      ('Mindful Self-Discovery', 'A journey to better understand yourself through daily reflection and mindfulness practices', 'mindfulness', 'beginner', 7, 'peace'),
      ('Emotional Balance', 'Learn to navigate and understand your emotions with greater clarity', 'emotions', 'intermediate', 14, 'healing'),
      ('Anxiety Management', 'Develop practical tools and techniques for managing anxiety', 'anxiety', 'beginner', 10, 'anxiety'),
      ('Inner Peace Journey', 'Find tranquility and balance in your daily life', 'peace', 'beginner', 7, 'peace'),
      ('Gratitude Practice', 'Cultivate a deeper appreciation for life''s blessings', 'gratitude', 'beginner', 7, 'hope');
  END IF;
END $$;

-- Add exercises for Self-Love Journey program
DO $$
DECLARE
  target_program_id uuid;
BEGIN
  SELECT id INTO target_program_id FROM programs WHERE title = 'Self-Love Journey';
  
  IF NOT EXISTS (
    SELECT 1 FROM program_exercises 
    WHERE program_id = target_program_id
  ) THEN
    INSERT INTO program_exercises (
      program_id,
      title,
      instructions,
      estimated_minutes,
      exercise_type,
      day_number,
      order_number
    ) VALUES
      -- Day 1: Foundation
      (target_program_id, 'Self-Compassion Practice', 'Begin with a gentle self-compassion meditation. Find a quiet space, close your eyes, and direct kind thoughts toward yourself.', 15, 'meditation', 1, 1),
      (target_program_id, 'Mirror Exercise', 'Stand before a mirror and speak three kind truths about yourself. Notice any resistance and practice acceptance.', 10, 'practice', 1, 2),
      (target_program_id, 'Gratitude Journal', 'Write down three things you appreciate about yourself today.', 15, 'reflection', 1, 3),

      -- Day 2: Body Acceptance
      (target_program_id, 'Body Gratitude', 'Write a thank-you letter to your body, acknowledging all it does for you.', 20, 'writing', 2, 1),
      (target_program_id, 'Gentle Movement', 'Engage in 15 minutes of gentle, mindful movement that feels good to your body.', 15, 'physical', 2, 2),
      (target_program_id, 'Evening Reflection', 'Reflect on moments today when you felt connected to your body.', 10, 'reflection', 2, 3),

      -- Day 3: Emotional Awareness
      (target_program_id, 'Emotion Mapping', 'Create a map of your emotional landscape, noting triggers and responses.', 20, 'analysis', 3, 1),
      (target_program_id, 'Self-Soothing Practice', 'Learn and practice three self-soothing techniques for difficult emotions.', 15, 'practice', 3, 2),
      (target_program_id, 'Comfort Inventory', 'Create a list of activities that bring you comfort and peace.', 10, 'planning', 3, 3),

      -- Day 4: Inner Dialogue
      (target_program_id, 'Inner Voice Awareness', 'Notice and write down your self-talk patterns throughout the day.', 15, 'observation', 4, 1),
      (target_program_id, 'Reframing Exercise', 'Practice transforming critical thoughts into supportive ones.', 20, 'practice', 4, 2),
      (target_program_id, 'Positive Affirmations', 'Create and practice personal affirmations that feel authentic to you.', 10, 'creation', 4, 3),

      -- Day 5: Boundaries & Self-Care
      (target_program_id, 'Boundary Exploration', 'Identify areas where stronger boundaries would support your self-love practice.', 20, 'reflection', 5, 1),
      (target_program_id, 'Self-Care Planning', 'Design a personalized self-care routine that feels nourishing and sustainable.', 15, 'planning', 5, 2),
      (target_program_id, 'Energy Audit', 'Review your daily activities and identify what energizes vs. depletes you.', 15, 'analysis', 5, 3),

      -- Day 6: Values & Authenticity
      (target_program_id, 'Values Clarification', 'Explore and define your core personal values.', 20, 'reflection', 6, 1),
      (target_program_id, 'Authentic Expression', 'Practice expressing your needs and desires clearly and confidently.', 15, 'practice', 6, 2),
      (target_program_id, 'Future Self Vision', 'Write a letter from your future self who has mastered self-love.', 15, 'visualization', 6, 3),

      -- Day 7: Integration
      (target_program_id, 'Progress Reflection', 'Review your journey and celebrate your growth in self-love.', 15, 'reflection', 7, 1),
      (target_program_id, 'Commitment Ceremony', 'Create a personal ritual to commit to ongoing self-love practices.', 20, 'practice', 7, 2),
      (target_program_id, 'Action Planning', 'Develop a plan to maintain and deepen your self-love practice.', 15, 'planning', 7, 3);
  END IF;
END $$;

-- Add exercises for Anxiety Toolkit program
DO $$
DECLARE
  target_program_id uuid;
BEGIN
  SELECT id INTO target_program_id FROM programs WHERE title = 'Anxiety Toolkit';
  
  IF NOT EXISTS (
    SELECT 1 FROM program_exercises 
    WHERE program_id = target_program_id
  ) THEN
    INSERT INTO program_exercises (
      program_id,
      title,
      instructions,
      estimated_minutes,
      exercise_type,
      day_number,
      order_number
    ) VALUES
      -- Day 1: Understanding Anxiety
      (target_program_id, 'Anxiety Awareness', 'Track your anxiety triggers and symptoms throughout the day.', 20, 'observation', 1, 1),
      (target_program_id, 'Breathing Basics', 'Learn and practice the 4-7-8 breathing technique for instant calm.', 15, 'practice', 1, 2),
      (target_program_id, 'Body Scan', 'Complete a guided body scan to identify areas of tension.', 15, 'meditation', 1, 3),

      -- Day 2: Grounding Techniques
      (target_program_id, '5-4-3-2-1 Senses', 'Practice the 5-4-3-2-1 grounding technique using all your senses.', 15, 'practice', 2, 1),
      (target_program_id, 'Safe Place Visualization', 'Create and explore your personal safe place in your mind.', 20, 'visualization', 2, 2),
      (target_program_id, 'Physical Grounding', 'Try different physical grounding techniques like cold water or texture touching.', 15, 'practice', 2, 3),

      -- Day 3: Thought Management
      (target_program_id, 'Thought Record', 'Document and analyze anxious thoughts using the CBT thought record.', 20, 'analysis', 3, 1),
      (target_program_id, 'Reframing Practice', 'Learn to reframe anxious thoughts into more balanced perspectives.', 15, 'practice', 3, 2),
      (target_program_id, 'Worry Time', 'Establish a designated "worry time" to contain anxious thoughts.', 15, 'planning', 3, 3),

      -- Day 4: Body Response
      (target_program_id, 'Progressive Relaxation', 'Practice progressive muscle relaxation for physical tension.', 20, 'practice', 4, 1),
      (target_program_id, 'Anxiety Movement', 'Learn gentle movements to release anxious energy.', 15, 'physical', 4, 2),
      (target_program_id, 'Tension Mapping', 'Create a body map of where you hold anxiety-related tension.', 15, 'analysis', 4, 3),

      -- Day 5: Lifestyle Strategies
      (target_program_id, 'Sleep Hygiene', 'Review and improve your sleep habits for better anxiety management.', 20, 'planning', 5, 1),
      (target_program_id, 'Nutrition Review', 'Identify foods and drinks that may trigger or calm anxiety.', 15, 'analysis', 5, 2),
      (target_program_id, 'Daily Structure', 'Create a structured daily routine that supports anxiety management.', 15, 'planning', 5, 3),

      -- Day 6: Social Support
      (target_program_id, 'Support Network', 'Identify and strengthen your anxiety support network.', 20, 'planning', 6, 1),
      (target_program_id, 'Communication Practice', 'Practice expressing anxiety needs to others effectively.', 15, 'practice', 6, 2),
      (target_program_id, 'Help Scripts', 'Develop scripts for asking for help during anxious times.', 15, 'creation', 6, 3),

      -- Day 7: Prevention & Maintenance
      (target_program_id, 'Early Warning Signs', 'Document your personal anxiety early warning signs.', 15, 'analysis', 7, 1),
      (target_program_id, 'Coping Card Creation', 'Create portable coping cards for anxiety management.', 20, 'creation', 7, 2),
      (target_program_id, 'Action Plan', 'Develop a personalized anxiety management action plan.', 15, 'planning', 7, 3);
  END IF;
END $$;

-- Enable RLS
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'programs' 
    AND policyname = 'Programs are viewable by all authenticated users'
  ) THEN
    ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Programs are viewable by all authenticated users"
      ON programs
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'program_exercises' 
    AND policyname = 'Exercises are viewable by all authenticated users'
  ) THEN
    ALTER TABLE program_exercises ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Exercises are viewable by all authenticated users"
      ON program_exercises
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;