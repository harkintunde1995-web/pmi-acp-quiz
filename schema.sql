-- PMI-ACP Quiz Platform Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Quiz attempts (individual quiz sessions)
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL, -- 'Mini-Test', 'Checkpoint', 'Mock Exam 1', etc
  total_questions INT NOT NULL,
  correct_answers INT NOT NULL,
  score_percentage DECIMAL(5, 2),
  time_taken_seconds INT,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Domain scores (score breakdown by domain per attempt)
CREATE TABLE IF NOT EXISTS domain_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  domain_code TEXT NOT NULL, -- 'I', 'II', 'III', etc
  domain_name TEXT,
  total_questions INT,
  correct_answers INT,
  score_percentage DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- User progress (cumulative stats)
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  total_attempts INT DEFAULT 0,
  total_correct INT DEFAULT 0,
  total_questions INT DEFAULT 0,
  overall_percentage DECIMAL(5, 2) DEFAULT 0,
  current_xp INT DEFAULT 0,
  current_level INT DEFAULT 1,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_attempt_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Questions log (track which questions user answered)
CREATE TABLE IF NOT EXISTS question_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id INT NOT NULL,
  user_answer TEXT,
  correct_answer TEXT,
  is_correct BOOLEAN,
  domain_code TEXT,
  difficulty TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Badges (achievements earned)
CREATE TABLE IF NOT EXISTS badges_earned (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_name TEXT NOT NULL,
  badge_icon TEXT,
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, badge_name)
);

-- Domain mastery tracking
CREATE TABLE IF NOT EXISTS domain_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  domain_code TEXT NOT NULL,
  domain_name TEXT,
  average_percentage DECIMAL(5, 2) DEFAULT 0,
  total_attempts INT DEFAULT 0,
  status TEXT DEFAULT 'NOT_STARTED', -- 'NOT_STARTED', 'IN_PROGRESS', 'MASTERED'
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, domain_code)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_assessment_type ON quiz_attempts(assessment_type);
CREATE INDEX IF NOT EXISTS idx_domain_scores_attempt_id ON domain_scores(quiz_attempt_id);
CREATE INDEX IF NOT EXISTS idx_question_attempts_attempt_id ON question_attempts(quiz_attempt_id);
CREATE INDEX IF NOT EXISTS idx_badges_earned_user_id ON badges_earned(user_id);
CREATE INDEX IF NOT EXISTS idx_domain_mastery_user_id ON domain_mastery(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges_earned ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_mastery ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only see their own data)
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can read own attempts" ON quiz_attempts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own attempts" ON quiz_attempts
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own scores" ON domain_scores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quiz_attempts 
      WHERE quiz_attempts.id = domain_scores.quiz_attempt_id 
      AND quiz_attempts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read own progress" ON user_progress
  FOR SELECT USING (user_id = auth.uid());
