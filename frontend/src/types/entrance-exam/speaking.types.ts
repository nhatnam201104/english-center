/**
 * Speaking Exam Types
 */

export interface SpeakingQuestion {
  questionIndex: number;
  question: string;
  partType: string;
  audioRecord?: string | null;
  images?: string[] | null; // For Part 3-4 (multiple images)
  image?: string | null; // For Part 8-10 (single image)
  passage?: string | null; // For Part 5-7, 8-10 (context passage)
  preparationTime?: number; // Seconds for preparation phase
  recordingTime?: number; // Seconds for recording phase
}

export interface SpeakingQuestionsResponse {
  questions: SpeakingQuestion[];
  speakingTimeMinutes: number;
}

export interface SpeakingAnswerRequest {
  questionIndex: number;
  audio: File;
}

export interface SpeakingSubmitResponse {
  totalRawScore: number;
  scaledScore: number;
  gradingResults: Array<{
    questionIndex: number;
    score: number;
    feedback: string;
  }>;
}