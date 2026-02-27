import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Quiz Attempt Functions
export async function saveQuizAttempt(
  userId: string,
  assessmentType: string,
  totalQuestions: number,
  correctAnswers: number,
  timeSeconds: number,
  domainScores: Array<{ domain_code: string; domain_name: string; correct: number; total: number }>
) {
  const scorePercentage = (correctAnswers / totalQuestions) * 100

  // Insert quiz attempt
  const { data: attemptData, error: attemptError } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: userId,
      assessment_type: assessmentType,
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      score_percentage: scorePercentage,
      time_taken_seconds: timeSeconds,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (attemptError) throw attemptError

  // Insert domain scores
  for (const domain of domainScores) {
    const domainPercentage = (domain.correct / domain.total) * 100
    await supabase.from('domain_scores').insert({
      quiz_attempt_id: attemptData.id,
      domain_code: domain.domain_code,
      domain_name: domain.domain_name,
      total_questions: domain.total,
      correct_answers: domain.correct,
      score_percentage: domainPercentage,
    })
  }

  return attemptData
}

export async function getUserProgress(userId: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows returned, which is expected for new users
    throw error
  }

  return data
}

export async function updateUserProgress(
  userId: string,
  updates: {
    total_attempts?: number
    total_correct?: number
    total_questions?: number
    overall_percentage?: number
    current_xp?: number
    current_level?: number
    current_streak?: number
    longest_streak?: number
  }
) {
  const { data, error } = await supabase
    .from('user_progress')
    .upsert(
      {
        user_id: userId,
        ...updates,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getQuizAttempts(userId: string, assessmentType?: string) {
  let query = supabase.from('quiz_attempts').select('*').eq('user_id', userId)

  if (assessmentType) {
    query = query.eq('assessment_type', assessmentType)
  }

  const { data, error } = await query.order('completed_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getDomainScores(quizAttemptId: string) {
  const { data, error } = await supabase
    .from('domain_scores')
    .select('*')
    .eq('quiz_attempt_id', quizAttemptId)
    .order('domain_code')

  if (error) throw error
  return data
}

export async function getDomainMastery(userId: string) {
  const { data, error } = await supabase
    .from('domain_mastery')
    .select('*')
    .eq('user_id', userId)
    .order('domain_code')

  if (error) throw error
  return data || []
}

export async function updateDomainMastery(
  userId: string,
  domainCode: string,
  domainName: string,
  scorePercentage: number
) {
  const { data, error } = await supabase
    .from('domain_mastery')
    .upsert(
      {
        user_id: userId,
        domain_code: domainCode,
        domain_name: domainName,
        average_percentage: scorePercentage,
        status: scorePercentage >= 80 ? 'MASTERED' : 'IN_PROGRESS',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,domain_code' }
    )
    .select()
    .single()

  if (error) throw error
  return data
}

export async function earnBadge(userId: string, badgeName: string, icon: string) {
  const { data, error } = await supabase
    .from('badges_earned')
    .insert({
      user_id: userId,
      badge_name: badgeName,
      badge_icon: icon,
    })
    .select()
    .single()

  if (error && error.code !== '23505') {
    // 23505 = unique constraint violation (already earned)
    throw error
  }

  return data
}

export async function getBadges(userId: string) {
  const { data, error } = await supabase
    .from('badges_earned')
    .select('*')
    .eq('user_id', userId)
    .order('earned_at')

  if (error) throw error
  return data || []
}
