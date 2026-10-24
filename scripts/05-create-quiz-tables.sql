-- Create quiz_sets table to organize quizzes
CREATE TABLE IF NOT EXISTS quiz_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quiz_questions table for custom quiz questions
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_set_id UUID REFERENCES quiz_sets(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  explanation TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE quiz_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quiz_sets
DROP POLICY IF EXISTS "Anyone can view active quiz sets" ON quiz_sets;
CREATE POLICY "Anyone can view active quiz sets"
  ON quiz_sets FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated users can manage quiz sets" ON quiz_sets;
CREATE POLICY "Authenticated users can manage quiz sets"
  ON quiz_sets FOR ALL
  USING (auth.uid() IS NOT NULL);

-- RLS Policies for quiz_questions
DROP POLICY IF EXISTS "Anyone can view quiz questions" ON quiz_questions;
CREATE POLICY "Anyone can view quiz questions"
  ON quiz_questions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage quiz questions" ON quiz_questions;
CREATE POLICY "Authenticated users can manage quiz questions"
  ON quiz_questions FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_set_id ON quiz_questions(quiz_set_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sets_active ON quiz_sets(is_active);
