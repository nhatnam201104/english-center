export interface RegisterResponse {
  admissionId: number;
  message: string;
}

export interface StartAttemptResponse {
  admissionId: number;
  accessToken: string;
}

export interface AttemptStateResponse {
  admissionId: number;
  status: string;
  type: string;
  expiresAt: string | null;
  totalListening: number;
  totalReading: number;
  entranceScore: number;
  isDone: boolean;
}

export interface ListeningQuestionData {
  partNo: number;
  partName: string;
  direction: string;
  type: "single" | "group";
  questions?: {
    index: number;
    question: string;
    audio: string | null;
    image: string | null;
  }[];
  groups?: {
    index: number;
    audio: string | null;
    image: string | null;
    fromQuestionIndex: number;
    toQuestionIndex: number;
    questions: {
      index: number;
      question: string;
      answerA: string;
      answerB: string;
      answerC: string;
      answerD: string;
    }[];
  }[];
}

export interface ReadingQuestionData {
  partNo: number;
  partName: string;
  direction: string;
  type: "single" | "group";
  questions?: {
    index: number;
    question: string;
    answerA: string;
    answerB: string;
    answerC: string;
    answerD: string;
  }[];
  groups?: {
    index: number;
    question: string | null;
    image: string | null;
    fromQuestionIndex: number;
    toQuestionIndex: number;
    questions: {
      index: number;
      question: string;
      answerA: string;
      answerB: string;
      answerC: string;
      answerD: string;
    }[];
  }[];
}

export interface ScoreResponse {
  totalListening: number;
  totalReading: number;
  listeningScaledScore: number;
  readingScaledScore: number;
  totalScaledScore: number;
}
export interface EntranceExamResponse {
  admissionId: number;
  status: string;
  type: string;
  expiresAt: string | null;
  totalListening: number;
  totalReading: number;
  entranceScore: number;
  isDone: boolean;
}