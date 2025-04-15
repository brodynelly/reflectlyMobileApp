/*
  # Programs and Exercises Schema Setup

  This migration:
  1. Creates the programs and exercises tables
  2. Sets up RLS policies
  3. Populates initial program data
  4. Adds exercise content for each program

  Tables Created:
  - programs: Core wellness program definitions
  - program_exercises: Daily exercises for each program
*/

-- Create programs table if it doesn't exist
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

-- Create program exercises table if it doesn't exist
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

-- Enable RLS
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_exercises ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Programs are viewable by all authenticated users" ON programs;
DROP POLICY IF EXISTS "Exercises are viewable by all authenticated users" ON program_exercises;

-- Create RLS policies
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

-- Clean existing data
TRUNCATE TABLE program_exercises CASCADE;
TRUNCATE TABLE programs CASCADE;

-- Insert core programs
INSERT INTO programs (id, title, description, category, difficulty, duration_days, theme)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Self-Love Journey', 'Develop a deeper connection with yourself through daily reflection and self-care practices', 'love', 'beginner', 7, 'love'),
  ('22222222-2222-2222-2222-222222222222', 'Anxiety Toolkit', 'Essential tools and techniques for managing anxiety', 'anxiety', 'beginner', 7, 'anxiety'),
  ('33333333-3333-3333-3333-333333333333', 'Inner Peace Journey', 'Find tranquility and balance in your daily life', 'peace', 'beginner', 7, 'peace'),
  ('44444444-4444-4444-4444-444444444444', 'Emotional Balance', 'Learn to navigate and understand your emotions with greater clarity', 'healing', 'intermediate', 14, 'healing');

-- Add exercises for Self-Love Journey
INSERT INTO program_exercises (program_id, title, instructions, estimated_minutes, exercise_type, day_number, order_number)
VALUES
  -- Day 1: Foundation
  ('11111111-1111-1111-1111-111111111111', 'Self-Compassion Practice', 'Begin with a gentle self-compassion meditation. Find a quiet space, close your eyes, and direct kind thoughts toward yourself.', 15, 'meditation', 1, 1),
  ('11111111-1111-1111-1111-111111111111', 'Mirror Exercise', 'Stand before a mirror and speak three kind truths about yourself. Notice any resistance and practice acceptance.', 10, 'practice', 1, 2),
  ('11111111-1111-1111-1111-111111111111', 'Gratitude Journal', 'Write down three things you appreciate about yourself today.', 15, 'reflection', 1, 3),

  -- Day 2: Body Acceptance
  ('11111111-1111-1111-1111-111111111111', 'Body Gratitude', 'Write a thank-you letter to your body, acknowledging all it does for you.', 20, 'writing', 2, 1),
  ('11111111-1111-1111-1111-111111111111', 'Gentle Movement', 'Engage in 15 minutes of gentle, mindful movement that feels good to your body.', 15, 'physical', 2, 2),
  ('11111111-1111-1111-1111-111111111111', 'Evening Reflection', 'Reflect on moments today when you felt connected to your body.', 10, 'reflection', 2, 3),

  -- Day 3: Emotional Awareness
  ('11111111-1111-1111-1111-111111111111', 'Emotion Mapping', 'Create a map of your emotional landscape, noting triggers and responses.', 20, 'analysis', 3, 1),
  ('11111111-1111-1111-1111-111111111111', 'Self-Soothing Practice', 'Learn and practice three self-soothing techniques for difficult emotions.', 15, 'practice', 3, 2),
  ('11111111-1111-1111-1111-111111111111', 'Comfort Inventory', 'Create a list of activities that bring you comfort and peace.', 10, 'planning', 3, 3),

  -- Day 4: Inner Dialogue
  ('11111111-1111-1111-1111-111111111111', 'Inner Voice Awareness', 'Notice and write down your self-talk patterns throughout the day.', 15, 'observation', 4, 1),
  ('11111111-1111-1111-1111-111111111111', 'Reframing Exercise', 'Practice transforming critical thoughts into supportive ones.', 20, 'practice', 4, 2),
  ('11111111-1111-1111-1111-111111111111', 'Positive Affirmations', 'Create and practice personal affirmations that feel authentic to you.', 10, 'creation', 4, 3),

  -- Day 5: Boundaries & Self-Care
  ('11111111-1111-1111-1111-111111111111', 'Boundary Exploration', 'Identify areas where stronger boundaries would support your self-love practice.', 20, 'reflection', 5, 1),
  ('11111111-1111-1111-1111-111111111111', 'Self-Care Planning', 'Design a personalized self-care routine that feels nourishing and sustainable.', 15, 'planning', 5, 2),
  ('11111111-1111-1111-1111-111111111111', 'Energy Audit', 'Review your daily activities and identify what energizes vs. depletes you.', 15, 'analysis', 5, 3),

  -- Day 6: Values & Authenticity
  ('11111111-1111-1111-1111-111111111111', 'Values Clarification', 'Explore and define your core personal values.', 20, 'reflection', 6, 1),
  ('11111111-1111-1111-1111-111111111111', 'Authentic Expression', 'Practice expressing your needs and desires clearly and confidently.', 15, 'practice', 6, 2),
  ('11111111-1111-1111-1111-111111111111', 'Future Self Vision', 'Write a letter from your future self who has mastered self-love.', 15, 'visualization', 6, 3),

  -- Day 7: Integration
  ('11111111-1111-1111-1111-111111111111', 'Progress Reflection', 'Review your journey and celebrate your growth in self-love.', 15, 'reflection', 7, 1),
  ('11111111-1111-1111-1111-111111111111', 'Commitment Ceremony', 'Create a personal ritual to commit to ongoing self-love practices.', 20, 'practice', 7, 2),
  ('11111111-1111-1111-1111-111111111111', 'Action Planning', 'Develop a plan to maintain and deepen your self-love practice.', 15, 'planning', 7, 3);

-- Add exercises for Anxiety Toolkit
INSERT INTO program_exercises (program_id, title, instructions, estimated_minutes, exercise_type, day_number, order_number)
VALUES
  -- Day 1: Understanding Anxiety
  ('22222222-2222-2222-2222-222222222222', 'Anxiety Awareness', 'Track your anxiety triggers and symptoms throughout the day.', 20, 'observation', 1, 1),
  ('22222222-2222-2222-2222-222222222222', 'Breathing Basics', 'Learn and practice the 4-7-8 breathing technique for instant calm.', 15, 'practice', 1, 2),
  ('22222222-2222-2222-2222-222222222222', 'Body Scan', 'Complete a guided body scan to identify areas of tension.', 15, 'meditation', 1, 3),

  -- Day 2: Grounding Techniques
  ('22222222-2222-2222-2222-222222222222', '5-4-3-2-1 Senses', 'Practice the 5-4-3-2-1 grounding technique using all your senses.', 15, 'practice', 2, 1),
  ('22222222-2222-2222-2222-222222222222', 'Safe Place Visualization', 'Create and explore your personal safe place in your mind.', 20, 'visualization', 2, 2),
  ('22222222-2222-2222-2222-222222222222', 'Physical Grounding', 'Try different physical grounding techniques like cold water or texture touching.', 15, 'practice', 2, 3),

  -- Day 3: Thought Management
  ('22222222-2222-2222-2222-222222222222', 'Thought Record', 'Document and analyze anxious thoughts using the CBT thought record.', 20, 'analysis', 3, 1),
  ('22222222-2222-2222-2222-222222222222', 'Reframing Practice', 'Learn to reframe anxious thoughts into more balanced perspectives.', 15, 'practice', 3, 2),
  ('22222222-2222-2222-2222-222222222222', 'Worry Time', 'Establish a designated "worry time" to contain anxious thoughts.', 15, 'planning', 3, 3),

  -- Day 4: Body Response
  ('22222222-2222-2222-2222-222222222222', 'Progressive Relaxation', 'Practice progressive muscle relaxation for physical tension.', 20, 'practice', 4, 1),
  ('22222222-2222-2222-2222-222222222222', 'Anxiety Movement', 'Learn gentle movements to release anxious energy.', 15, 'physical', 4, 2),
  ('22222222-2222-2222-2222-222222222222', 'Tension Mapping', 'Create a body map of where you hold anxiety-related tension.', 15, 'analysis', 4, 3),

  -- Day 5: Lifestyle Strategies
  ('22222222-2222-2222-2222-222222222222', 'Sleep Hygiene', 'Review and improve your sleep habits for better anxiety management.', 20, 'planning', 5, 1),
  ('22222222-2222-2222-2222-222222222222', 'Nutrition Review', 'Identify foods and drinks that may trigger or calm anxiety.', 15, 'analysis', 5, 2),
  ('22222222-2222-2222-2222-222222222222', 'Daily Structure', 'Create a structured daily routine that supports anxiety management.', 15, 'planning', 5, 3),

  -- Day 6: Social Support
  ('22222222-2222-2222-2222-222222222222', 'Support Network', 'Identify and strengthen your anxiety support network.', 20, 'planning', 6, 1),
  ('22222222-2222-2222-2222-222222222222', 'Communication Practice', 'Practice expressing anxiety needs to others effectively.', 15, 'practice', 6, 2),
  ('22222222-2222-2222-2222-222222222222', 'Help Scripts', 'Develop scripts for asking for help during anxious times.', 15, 'creation', 6, 3),

  -- Day 7: Prevention & Maintenance
  ('22222222-2222-2222-2222-222222222222', 'Early Warning Signs', 'Document your personal anxiety early warning signs.', 15, 'analysis', 7, 1),
  ('22222222-2222-2222-2222-222222222222', 'Coping Card Creation', 'Create portable coping cards for anxiety management.', 20, 'creation', 7, 2),
  ('22222222-2222-2222-2222-222222222222', 'Action Plan', 'Develop a personalized anxiety management action plan.', 15, 'planning', 7, 3);

-- Add exercises for Inner Peace Journey
INSERT INTO program_exercises (program_id, title, instructions, estimated_minutes, exercise_type, day_number, order_number)
VALUES
  -- Day 1: Foundation of Peace
  ('33333333-3333-3333-3333-333333333333', 'Peace Inventory', 'Reflect on moments when you feel most at peace. What elements contribute to these experiences?', 20, 'reflection', 1, 1),
  ('33333333-3333-3333-3333-333333333333', 'Mindful Breathing', 'Practice mindful breathing, focusing on the natural rhythm of your breath.', 15, 'meditation', 1, 2),
  ('33333333-3333-3333-3333-333333333333', 'Peace Journal', 'Start a peace journal, noting moments of tranquility throughout your day.', 15, 'writing', 1, 3),

  -- Day 2: Creating Calm
  ('33333333-3333-3333-3333-333333333333', 'Morning Ritual', 'Design and practice a peaceful morning ritual to start your day.', 20, 'practice', 2, 1),
  ('33333333-3333-3333-3333-333333333333', 'Environmental Peace', 'Create a peaceful space in your home or workplace.', 25, 'creation', 2, 2),
  ('33333333-3333-3333-3333-333333333333', 'Evening Reflection', 'Review your day, focusing on peaceful moments and lessons learned.', 15, 'reflection', 2, 3),

  -- Day 3: Mind & Body Peace
  ('33333333-3333-3333-3333-333333333333', 'Body Peace Scan', 'Practice a body scan meditation focused on releasing tension.', 20, 'meditation', 3, 1),
  ('33333333-3333-3333-3333-333333333333', 'Peaceful Movement', 'Engage in gentle, mindful movement or stretching.', 15, 'physical', 3, 2),
  ('33333333-3333-3333-3333-333333333333', 'Peace Breaks', 'Plan and implement regular peace breaks throughout your day.', 15, 'planning', 3, 3),

  -- Day 4: Emotional Peace
  ('33333333-3333-3333-3333-333333333333', 'Emotion Awareness', 'Practice observing emotions without judgment.', 20, 'observation', 4, 1),
  ('33333333-3333-3333-3333-333333333333', 'Peace Response', 'Develop peaceful responses to challenging emotions.', 20, 'practice', 4, 2),
  ('33333333-3333-3333-3333-333333333333', 'Gratitude Practice', 'Focus on gratitude as a path to inner peace.', 15, 'reflection', 4, 3),

  -- Day 5: Mental Peace
  ('33333333-3333-3333-3333-333333333333', 'Thought Observation', 'Practice observing thoughts without attachment.', 20, 'meditation', 5, 1),
  ('33333333-3333-3333-3333-333333333333', 'Mental Declutter', 'Identify and release mental clutter that disturbs your peace.', 20, 'analysis', 5, 2),
  ('33333333-3333-3333-3333-333333333333', 'Peace Affirmations', 'Create and practice peace-promoting affirmations.', 15, 'creation', 5, 3),

  -- Day 6: Relational Peace
  ('33333333-3333-3333-3333-333333333333', 'Boundary Setting', 'Establish and maintain peaceful boundaries in relationships.', 20, 'practice', 6, 1),
  ('33333333-3333-3333-3333-333333333333', 'Compassion Practice', 'Cultivate peace through compassion for self and others.', 20, 'meditation', 6, 2),
  ('33333333-3333-3333-3333-333333333333', 'Communication Review', 'Develop peaceful communication strategies.', 15, 'planning', 6, 3),

  -- Day 7: Sustainable Peace
  ('33333333-3333-3333-3333-333333333333', 'Peace Integration', 'Review and integrate your peace practices.', 20, 'reflection', 7, 1),
  ('33333333-3333-3333-3333-333333333333', 'Challenge Planning', 'Create strategies for maintaining peace during challenges.', 20, 'planning', 7, 2),
  ('33333333-3333-3333-3333-333333333333', 'Commitment Ritual', 'Design a ritual to commit to your ongoing peace practice.', 15, 'creation', 7, 3);

-- Add exercises for Emotional Balance
INSERT INTO program_exercises (program_id, title, instructions, estimated_minutes, exercise_type, day_number, order_number)
VALUES
  -- Week 1: Understanding Emotions
  -- Day 1: Emotional Awareness
  ('44444444-4444-4444-4444-444444444444', 'Emotion Tracking', 'Begin tracking your emotions throughout the day, noting intensity and triggers.', 20, 'observation', 1, 1),
  ('44444444-4444-4444-4444-444444444444', 'Body-Emotion Connection', 'Map how different emotions feel in your body.', 15, 'analysis', 1, 2),
  ('44444444-4444-4444-4444-444444444444', 'Evening Review', 'Review your emotional patterns from the day.', 15, 'reflection', 1, 3),

  -- Day 2: Emotional Vocabulary
  ('44444444-4444-4444-4444-444444444444', 'Emotion Vocabulary', 'Expand your emotional vocabulary beyond basic terms.', 20, 'learning', 2, 1),
  ('44444444-4444-4444-4444-444444444444', 'Nuanced Expression', 'Practice expressing emotions with greater precision.', 20, 'practice', 2, 2),
  ('44444444-4444-4444-4444-444444444444', 'Emotion Journaling', 'Write about complex emotional experiences.', 15, 'writing', 2, 3),

  -- Day 3: Emotional Triggers
  ('44444444-4444-4444-4444-444444444444', 'Trigger Mapping', 'Identify and analyze your emotional triggers.', 25, 'analysis', 3, 1),
  ('44444444-4444-4444-4444-444444444444', 'Response Patterns', 'Examine your typical responses to different triggers.', 20, 'reflection', 3, 2),
  ('44444444-4444-4444-4444-444444444444', 'Alternative Responses', 'Develop alternative responses to common triggers.', 15, 'planning', 3, 3),

  -- Day 4: Physical-Emotional Connection
  ('44444444-4444-4444-4444-444444444444', 'Body Awareness', 'Practice body scanning to notice emotional sensations.', 20, 'meditation', 4, 1),
  ('44444444-4444-4444-4444-444444444444', 'Movement Expression', 'Use movement to express and process emotions.', 20, 'physical', 4, 2),
  ('44444444-4444-4444-4444-444444444444', 'Somatic Release', 'Learn techniques for releasing emotional tension physically.', 15, 'practice', 4, 3),

  -- Day 5: Emotional Regulation
  ('44444444-4444-4444-4444-444444444444', 'Regulation Techniques', 'Learn and practice basic emotional regulation skills.', 25, 'learning', 5, 1),
  ('44444444-4444-4444-4444-444444444444', 'Intensity Scale', 'Create a personal scale for emotional intensity.', 20, 'creation', 5, 2),
  ('44444444-4444-4444-4444-444444444444', 'Regulation Practice', 'Apply regulation techniques to real situations.', 15, 'practice', 5, 3),

  -- Day 6: Emotional Boundaries
  ('44444444-4444-4444-4444-444444444444', 'Boundary Assessment', 'Assess your current emotional boundaries.', 20, 'analysis', 6, 1),
  ('44444444-4444-4444-4444-444444444444', 'Boundary Setting', 'Practice setting and maintaining emotional boundaries.', 25, 'practice', 6, 2),
  ('44444444-4444-4444-4444-444444444444', 'Support Planning', 'Identify sources of emotional support.', 15, 'planning', 6, 3),

  -- Day 7: Integration Week 1
  ('44444444-4444-4444-4444-444444444444', 'Week Review', 'Review and integrate learnings from week one.', 20, 'reflection', 7, 1),
  ('44444444-4444-4444-4444-444444444444', 'Progress Assessment', 'Assess progress in emotional awareness and regulation.', 20, 'analysis', 7, 2),
  ('44444444-4444-4444-4444-444444444444', 'Next Steps', 'Plan focus areas for week two.', 15, 'planning', 7, 3),

  -- Week 2: Advanced Emotional Skills
  -- Day 8: Complex Emotions
  ('44444444-4444-4444-4444-444444444444', 'Mixed Emotions', 'Explore and understand mixed emotional states.', 25, 'analysis', 8, 1),
  ('44444444-4444-4444-4444-444444444444', 'Emotional Layers', 'Practice identifying layers of emotional experience.', 20, 'practice', 8, 2),
  ('44444444-4444-4444-4444-444444444444', 'Integration Exercise', 'Work with accepting conflicting emotions.', 15, 'reflection', 8, 3),

  -- Day 9: Emotional Patterns
  ('44444444-4444-4444-4444-444444444444', 'Pattern Recognition', 'Identify recurring emotional patterns.', 25, 'analysis', 9, 1),
  ('44444444-4444-4444-4444-444444444444', 'Pattern Intervention', 'Develop strategies for changing unhelpful patterns.', 20, 'planning', 9, 2),
  ('44444444-4444-4444-4444-444444444444', 'New Pattern Practice', 'Practice implementing new emotional patterns.', 15, 'practice', 9, 3),

  -- Day 10: Advanced Regulation
  ('44444444-4444-4444-4444-444444444444', 'Complex Regulation', 'Learn advanced emotional regulation techniques.', 25, 'learning', 10, 1),
  ('44444444-4444-4444-4444-444444444444', 'Regulation Scenarios', 'Practice regulation in challenging scenarios.', 20, 'practice', 10, 2),
  ('44444444-4444-4444-4444-444444444444', 'Personal Toolkit', 'Develop your advanced regulation toolkit.', 15, 'creation', 10, 3),

  -- Day 11: Emotional Resilience
  ('44444444-4444-4444-4444-444444444444', 'Resilience Building', 'Learn techniques for building emotional resilience.', 25, 'learning', 11, 1),
  ('44444444-4444-4444-4444-444444444444', 'Challenge Practice', 'Practice resilience in controlled challenges.', 20, 'practice', 11, 2),
  ('44444444-4444-4444-4444-444444444444', 'Recovery Skills', 'Develop personal emotional recovery strategies.', 15, 'planning', 11, 3),

  -- Day 12: Emotional Intelligence
  ('44444444-4444-4444-4444-444444444444', 'Empathy Practice', 'Develop deeper empathy skills.', 25, 'practice', 12, 1),
  ('44444444-4444-4444-4444-444444444444', 'Emotional Impact', 'Understand your emotional impact on others.', 20, 'reflection', 12, 2),
  ('44444444-4444-4444-4444-444444444444', 'Response Refinement', 'Refine your emotional responses.', 15, 'practice', 12, 3),

  -- Day 13: Sustainable Balance
  ('44444444-4444-4444-4444-444444444444', 'Balance Assessment', 'Assess your emotional balance strategies.', 25, 'analysis', 13, 1),
  ('44444444-4444-4444-4444-444444444444', 'Maintenance Plan', 'Create a plan for maintaining emotional balance.', 20, 'planning', 13, 2),
  ('44444444-4444-4444-4444-444444444444', 'Support Network', 'Strengthen your emotional support network.', 15, 'planning', 13, 3),

  -- Day 14: Final Integration
  ('44444444-4444-4444-4444-444444444444', 'Program Review', 'Review and celebrate your progress.', 25, 'reflection', 14, 1),
  ('44444444-4444-4444-4444-444444444444', 'Future Planning', 'Create a long-term emotional balance plan.', 20, 'planning', 14, 2),
  ('44444444-4444-4444-4444-444444444444', 'Commitment Ritual', 'Design a ritual to commit to ongoing emotional balance.', 15, 'creation', 14, 3);