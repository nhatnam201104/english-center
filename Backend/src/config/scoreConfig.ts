// Scoring configuration for entrance exam
// TOEIC: each section scores 5–495, total 990.
// The denominator is always the actual question count in the exam (trueAnswers.length)
// so the score scales correctly whether there are 5 questions (testing) or 100 (production).

export const SCORE_CONFIG = {
  LISTENING: { minScaledScore: 5, maxScaledScore: 495 },
  READING:   { minScaledScore: 5, maxScaledScore: 495 },
} as const;

export const ANSWER_MAP: Record<number, string> = {
  1: "A",
  2: "B",
  3: "C",
  4: "D",
};

export const ANSWER_REVERSE_MAP: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
};

/**
 * Scale a raw correct-answer count to a TOEIC section score (5–495, multiples of 5).
 * @param rawScore   Number of correct answers
 * @param section    "LISTENING" | "READING"
 * @param totalQuestions  Actual total questions in this exam (from trueAnswers.length)
 */
export function computeScaledScore(
  rawScore: number,
  section: "LISTENING" | "READING",
  totalQuestions: number,
): number {
  if (totalQuestions === 0) return SCORE_CONFIG[section].minScaledScore;
  const { minScaledScore, maxScaledScore } = SCORE_CONFIG[section];
  const ratio = Math.min(rawScore / totalQuestions, 1); // clamp to [0,1]
  const raw = ratio * (maxScaledScore - minScaledScore) + minScaledScore;
  // TOEIC scores are always multiples of 5
  return Math.round(raw / 5) * 5;
}

// TOEIC LR: Listening 45 min + Reading 75 min = 120 min total
// Buffer for transitions: +30 min
export const EXAM_EXPIRY_MINUTES = 150;
