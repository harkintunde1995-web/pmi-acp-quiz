import { GAMIFICATION, DIFFICULTY_TIERS } from './types'

export function calculateXP(
  isCorrect: boolean,
  difficulty: string,
  streakBonus: boolean = false
): number {
  if (!isCorrect) return 0

  const difficultyXP =
    GAMIFICATION.XP_PER_DIFFICULT_CORRECT[difficulty as keyof typeof GAMIFICATION.XP_PER_DIFFICULT_CORRECT] ||
    GAMIFICATION.XP_PER_CORRECT

  const totalXP = difficultyXP + (streakBonus ? GAMIFICATION.STREAK_BONUS_XP : 0)
  return totalXP
}

export function calculateLevel(totalXP: number): number {
  for (let i = GAMIFICATION.LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= GAMIFICATION.LEVEL_THRESHOLDS[i]) {
      return i + 1
    }
  }
  return 1
}

export function xpForNextLevel(currentXP: number): { needed: number; progress: number; nextLevel: number } {
  const currentLevel = calculateLevel(currentXP)
  const currentThreshold = GAMIFICATION.LEVEL_THRESHOLDS[currentLevel - 1] || 0
  const nextThreshold = GAMIFICATION.LEVEL_THRESHOLDS[currentLevel] || GAMIFICATION.LEVEL_THRESHOLDS[GAMIFICATION.LEVEL_THRESHOLDS.length - 1]

  const needed = nextThreshold - currentXP
  const progress = currentXP - currentThreshold

  return {
    needed: Math.max(0, needed),
    progress,
    nextLevel: currentLevel + 1,
  }
}

export function getLevelName(level: number): string {
  const levelNames = [
    'Agile Apprentice', // 1
    'Agile Practitioner', // 2
    'Agile Specialist', // 3
    'Agile Coordinator', // 4
    'Agile Manager', // 5
    'Agile Strategist', // 6
    'Agile Coach', // 7
    'Agile Mentor', // 8
    'Agile Champion', // 9
    'Agile Master', // 10
    'Agile Authority', // 11
    'Agile Visionary', // 12
    'Agile Sage', // 13
    'Agile Legend', // 14
    'PMI-ACP Champion', // 15
  ]

  return levelNames[Math.min(level - 1, levelNames.length - 1)]
}

export function updateStreak(
  currentStreak: number,
  longestStreak: number,
  daysPassed: number
): { currentStreak: number; longestStreak: number } {
  if (daysPassed === 1) {
    // Continued streak
    const newCurrent = currentStreak + 1
    const newLongest = Math.max(longestStreak, newCurrent)
    return { currentStreak: newCurrent, longestStreak: newLongest }
  } else if (daysPassed > 1) {
    // Streak broken
    return { currentStreak: 1, longestStreak }
  }
  // Same day, no change
  return { currentStreak, longestStreak }
}

export function checkBadgeEarned(
  quizData: {
    scorePercentage: number
    domainScores: Array<{ score_percentage: number; domain_code: string }>
    timeSeconds: number
    isFirstQuiz: boolean
  },
  previousBadges: string[]
): { badgeName: string; icon: string }[] {
  const newBadges: { badgeName: string; icon: string }[] = []

  // First Step badge
  if (quizData.isFirstQuiz && !previousBadges.includes('First Step')) {
    newBadges.push({ badgeName: 'First Step', icon: '👣' })
  }

  // Perfect Score badge
  if (quizData.scorePercentage === 100 && !previousBadges.includes('Perfect Score')) {
    newBadges.push({ badgeName: 'Perfect Score', icon: '💯' })
  }

  // Speed Demon badge (complete 120Q in under 2.5 hours)
  if (quizData.timeSeconds < 150 * 60 && !previousBadges.includes('Speed Demon')) {
    newBadges.push({ badgeName: 'Speed Demon', icon: '⚡' })
  }

  // Domain Master badges
  for (const domainScore of quizData.domainScores) {
    if (domainScore.score_percentage >= 80) {
      const badgeName = `Domain Master ${domainScore.domain_code}`
      if (!previousBadges.includes(badgeName)) {
        newBadges.push({ badgeName, icon: '🏆' })
      }
    }
  }

  return newBadges
}

export function getDifficultyColor(difficulty: string): string {
  return DIFFICULTY_TIERS[difficulty as keyof typeof DIFFICULTY_TIERS]?.color || '#999999'
}

export function getDifficultyLabel(difficulty: string): string {
  return DIFFICULTY_TIERS[difficulty as keyof typeof DIFFICULTY_TIERS]?.label || 'Unknown'
}
