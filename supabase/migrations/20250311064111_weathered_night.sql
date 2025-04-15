/*
  # Relationship Harmony Program Exercises

  1. Program Structure
    - 14-day program focused on relationship development
    - Progressive exercises building from self-awareness to relationship skills
    - Mix of reflection, practice, and planning activities

  2. Daily Themes
    - Day 1-3: Foundation and Self-Understanding
    - Day 4-6: Communication and Trust
    - Day 7-9: Emotional Intelligence
    - Day 10-12: Growth and Adaptation
    - Day 13-14: Integration and Future Planning

  3. Exercise Types
    - Reflection
    - Practice
    - Analysis
    - Planning
    - Meditation
    - Writing
*/

-- First ensure the program exists
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM programs 
    WHERE title = 'Relationship Harmony'
  ) THEN
    INSERT INTO programs (
      title,
      description,
      category,
      difficulty,
      duration_days,
      theme
    ) VALUES (
      'Relationship Harmony',
      'Strengthen your relationships through understanding and communication',
      'relationships',
      'intermediate',
      14,
      'love'
    );
  END IF;
END $$;

-- Add exercises for Relationship Harmony program
INSERT INTO program_exercises (
  program_id,
  title,
  instructions,
  estimated_minutes,
  exercise_type,
  day_number,
  order_number
)
SELECT 
  (SELECT id FROM programs WHERE title = 'Relationship Harmony'),
  title,
  instructions,
  estimated_minutes,
  exercise_type,
  day_number,
  order_number
FROM (VALUES
  -- Day 1: Foundation of Self-Love
  ('Self-Love Reflection', 'Write about three qualities you genuinely love about yourself. Focus on both internal qualities and external actions.', 20, 'reflection', 1, 1),
  ('Gratitude Practice', 'List five people who have positively impacted your relationships and write how they''ve influenced you.', 15, 'writing', 1, 2),
  ('Compassion Meditation', 'Practice a loving-kindness meditation, directing positive wishes to yourself and others.', 15, 'meditation', 1, 3),

  -- Day 2: Understanding Patterns
  ('Relationship Patterns', 'Reflect on your past relationships. Identify recurring patterns in how you connect with others.', 25, 'analysis', 2, 1),
  ('Boundary Exploration', 'Write about your personal boundaries. What are they? How do you communicate them?', 20, 'writing', 2, 2),
  ('Values Clarification', 'List your top 5 values in relationships and explain why they matter to you.', 15, 'reflection', 2, 3),

  -- Day 3: Communication Skills
  ('Active Listening Exercise', 'Practice active listening techniques through guided scenarios.', 20, 'practice', 3, 1),
  ('Expression Workshop', 'Learn and practice "I" statements for better emotional expression.', 25, 'skill-building', 3, 2),
  ('Nonverbal Awareness', 'Explore the role of nonverbal communication in your relationships.', 15, 'observation', 3, 3),

  -- Day 4: Trust Building
  ('Trust Inventory', 'Examine your trust experiences and identify what builds or breaks trust for you.', 20, 'reflection', 4, 1),
  ('Vulnerability Practice', 'Practice sharing something vulnerable in a safe way.', 25, 'practice', 4, 2),
  ('Trust-Building Actions', 'Plan specific actions to build trust in your relationships.', 15, 'planning', 4, 3),

  -- Day 5: Emotional Intelligence
  ('Emotion Mapping', 'Create a detailed map of your emotional responses in relationships.', 20, 'analysis', 5, 1),
  ('Empathy Building', 'Practice perspective-taking exercises to enhance empathy.', 25, 'practice', 5, 2),
  ('Emotional Regulation', 'Learn techniques for managing intense emotions in relationships.', 20, 'skill-building', 5, 3),

  -- Day 6: Conflict Resolution
  ('Conflict Patterns', 'Identify your typical conflict response patterns.', 20, 'analysis', 6, 1),
  ('Resolution Strategies', 'Learn and practice healthy conflict resolution techniques.', 25, 'skill-building', 6, 2),
  ('Peace-Making Plan', 'Create a personal plan for handling future conflicts.', 20, 'planning', 6, 3),

  -- Day 7: Intimacy Building
  ('Intimacy Reflection', 'Explore different types of intimacy and their role in your relationships.', 20, 'reflection', 7, 1),
  ('Connection Exercises', 'Practice exercises for building emotional intimacy.', 25, 'practice', 7, 2),
  ('Intimacy Goals', 'Set goals for deepening intimacy in your relationships.', 15, 'planning', 7, 3),

  -- Day 8: Growth and Change
  ('Growth Mindset', 'Develop a growth mindset in relationships.', 20, 'reflection', 8, 1),
  ('Adaptation Skills', 'Practice adapting to change in relationships.', 25, 'practice', 8, 2),
  ('Future Vision', 'Create a vision for your relationship growth.', 20, 'planning', 8, 3),

  -- Day 9: Forgiveness Work
  ('Forgiveness Reflection', 'Explore your relationship with forgiveness.', 25, 'reflection', 9, 1),
  ('Letting Go Practice', 'Practice techniques for letting go of past hurts.', 20, 'practice', 9, 2),
  ('Healing Actions', 'Plan specific actions for healing and forgiveness.', 20, 'planning', 9, 3),

  -- Day 10: Gratitude and Appreciation
  ('Appreciation Practice', 'Develop daily practices for showing appreciation.', 15, 'practice', 10, 1),
  ('Gratitude Expression', 'Learn new ways to express gratitude in relationships.', 20, 'skill-building', 10, 2),
  ('Joy Cultivation', 'Create practices for cultivating joy together.', 20, 'planning', 10, 3),

  -- Day 11: Support Systems
  ('Support Network', 'Map out your relationship support system.', 20, 'analysis', 11, 1),
  ('Asking for Help', 'Practice asking for and receiving support.', 25, 'practice', 11, 2),
  ('Community Building', 'Plan ways to strengthen your relationship community.', 20, 'planning', 11, 3),

  -- Day 12: Shared Values and Goals
  ('Values Alignment', 'Explore alignment of values in relationships.', 25, 'reflection', 12, 1),
  ('Goal Setting', 'Create shared goals and plans for achieving them.', 20, 'planning', 12, 2),
  ('Vision Building', 'Develop a shared vision for the future.', 20, 'practice', 12, 3),

  -- Day 13: Self-Care in Relationships
  ('Balance Check', 'Assess the balance between self-care and relationship care.', 20, 'analysis', 13, 1),
  ('Boundary Practice', 'Practice maintaining healthy boundaries.', 25, 'practice', 13, 2),
  ('Self-Care Plan', 'Create a self-care plan that supports relationships.', 20, 'planning', 13, 3),

  -- Day 14: Integration and Moving Forward
  ('Progress Review', 'Review and celebrate your relationship growth journey.', 25, 'reflection', 14, 1),
  ('Integration Practice', 'Practice integrating new relationship skills.', 20, 'practice', 14, 2),
  ('Future Planning', 'Create a plan for continued relationship growth.', 20, 'planning', 14, 3)
) AS exercises(title, instructions, estimated_minutes, exercise_type, day_number, order_number);