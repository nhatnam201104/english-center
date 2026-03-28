/**
 * Writing Exam Types
 */

export interface WritingQuestion {
  questionIndex: number;
  question: string;
  partType: string;
  answer?: string | null;
  images?: string[] | null;
  suggestedTime?: number; // Suggested time in minutes for each question
}

export interface WritingQuestionsResponse {
  questions: WritingQuestion[];
  writingTimeMinutes: number;
}

export interface WritingAnswerRequest {
  questionIndex: number;
  answer: string;
}

export interface WritingSubmitResponse {
  totalRawScore: number;
  scaledScore: number;
  speakingScaled: number;
  totalScaledScore: number;
  gradingResults: Array<{
    questionIndex: number;
    score: number;
    feedback: string;
  }>;
}