// Quiz and Question Types
export interface Question {
  id: number;
  question_number: number;
  source_file: string;
  assessment_type: string;
  stem: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_answer: string;
  correct_text: string;
  explanation: string;
  domain: string;
  domain_code: string;
  difficulty: string;
  difficulty_order: number;
}

export interface QuizzesData {
  summary: {
    total_questions: number;
    by_assessment_type: Record<string, number>;
    by_domain: Record<string, number>;
    by_difficulty: Record<string, number>;
    metadata: {
      exam: string;
      total_exam_questions: number;
      time_limit_minutes: number;
      domains: number;
      generated: boolean;
    };
  };
  questions: Question[];
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  assessment_type: string;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  time_taken_seconds: number;
  started_at: string;
  completed_at: string;
}

export interface DomainScore {
  domain_code: string;
  domain_name: string;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
}

export interface UserProgress {
  user_id: string;
  total_attempts: number;
  total_correct: number;
  total_questions: number;
  overall_percentage: number;
  current_xp: number;
  current_level: number;
  current_streak: number;
  longest_streak: number;
}

export interface GameState {
  xp: number;
  level: number;
  streak: number;
  badges: Badge[];
}

export interface Badge {
  name: string;
  icon: string;
  description: string;
  earned_at?: string;
}

// Domain information
export const DOMAINS = {
  I: { name: 'Agile Principles & Mindset', weight: 16 },
  II: { name: 'Value-Driven Delivery', weight: 20 },
  III: { name: 'Stakeholder Engagement', weight: 17 },
  IV: { name: 'Team Performance', weight: 16 },
  V: { name: 'Adaptive Planning', weight: 12 },
  VI: { name: 'Problem Detection & Resolution', weight: 10 },
  VII: { name: 'Continuous Improvement', weight: 9 },
};

// Assessment types
export const ASSESSMENT_TYPES = [
  { id: 'mini-test', label: 'Mini-Test (20Q)', time: 30 },
  { id: 'checkpoint', label: 'Checkpoint (60Q)', time: 90 },
  { id: 'cross-domain', label: 'Cross-Domain (40Q)', time: 120 },
  { id: 'mock-exam-1', label: 'Mock Exam 1 — Boss Round 1 (120Q)', time: 180 },
  { id: 'mock-exam-2', label: 'Mock Exam 2 — Boss Round 2 Final (120Q)', time: 180 },
];

// Difficulty tiers
export const DIFFICULTY_TIERS = {
  Bronze: { level: 1, color: '#CD7F32', label: 'Foundational' },
  Silver: { level: 2, color: '#C0C0C0', label: 'Intermediate' },
  Gold: { level: 3, color: '#FFD700', label: 'Advanced' },
  Platinum: { level: 4, color: '#E5E4E2', label: 'Expert' },
};

// Gamification constants
export const GAMIFICATION = {
  XP_PER_CORRECT: 10,
  XP_PER_DIFFICULT_CORRECT: {
    Bronze: 10,
    Silver: 15,
    Gold: 25,
    Platinum: 40,
  },
  STREAK_BONUS_XP: 5,
  LEVEL_THRESHOLDS: [0, 100, 250, 500, 850, 1250, 1700, 2200, 2750, 3350, 4000, 4700, 5450, 6250, 7100],
  BADGES: [
    { name: 'First Step', icon: '👣', description: 'Complete your first quiz', xpRequired: 0 },
    { name: 'Domain Master I', icon: '🏆', description: 'Score 80%+ in Domain I', xpRequired: 0 },
    { name: 'Domain Master II', icon: '🏆', description: 'Score 80%+ in Domain II', xpRequired: 0 },
    { name: 'Domain Master III', icon: '🏆', description: 'Score 80%+ in Domain III', xpRequired: 0 },
    { name: 'Domain Master IV', icon: '🏆', description: 'Score 80%+ in Domain IV', xpRequired: 0 },
    { name: 'Domain Master V', icon: '🏆', description: 'Score 80%+ in Domain V', xpRequired: 0 },
    { name: 'Domain Master VI', icon: '🏆', description: 'Score 80%+ in Domain VI', xpRequired: 0 },
    { name: 'Domain Master VII', icon: '🏆', description: 'Score 80%+ in Domain VII', xpRequired: 0 },
    { name: 'Perfect Score', icon: '💯', description: 'Score 100% on any quiz', xpRequired: 0 },
    { name: 'Speed Demon', icon: '⚡', description: 'Complete a mock exam in under 2.5 hours', xpRequired: 0 },
    { name: 'Persistent Learner', icon: '🔥', description: 'Maintain a 5-day study streak', xpRequired: 0 },
    { name: 'Exam Ready', icon: '🎯', description: 'Score 80%+ on both mock exams', xpRequired: 0 },
  ],
};
