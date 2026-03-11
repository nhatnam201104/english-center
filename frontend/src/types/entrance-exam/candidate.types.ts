// ─── Request Types ───

export interface RegisterCandidateRequest {
  email: string;
  fullname: string;
  phone: string;
  cccd: string;
  examType: "READING_LISTENING" | "SPEAKING_WRITING";
}

export interface SaveAnswerRequest {
  section: "LISTENING" | "READING";
  questionIndex: number;
  answerId: number; // 1=A, 2=B, 3=C, 4=D
}

export interface ViolationRequest {
  eventType: "TAB_SWITCH" | "FULLSCREEN_EXIT" | "FOCUS_LOST";
}

// ─── Response Types ───

export interface RegisterResponse {
  admissionId: number;
}

export interface StartAttemptResponse {
  admissionId: number;
  accessToken: string;
  expiresAt: string;
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

export interface ListeningQuestion {
  index: number;
  question: string;
  audio: string | null;
  image: string | null;
  savedAnswer: number | null;
  answerA?: string;
  answerB?: string;
  answerC?: string;
  answerD?: string;
}

export interface ListeningGroup {
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
    savedAnswer: number | null;
  }[];
}

export interface ListeningPartData {
  partNo: number;
  partName: string;
  direction: string;
  type: "single" | "group";
  questions?: ListeningQuestion[];
  groups?: ListeningGroup[];
}

export interface ListeningLoadResponse {
  parts: ListeningPartData[];
}

export interface ReadingQuestion {
  index: number;
  question: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  savedAnswer: number | null;
}

export interface ReadingGroup {
  index: number;
  question: string | null;
  image: string | null;
  fromQuestionIndex: number;
  toQuestionIndex: number;
  questions: ReadingQuestion[];
}

export interface ReadingPartData {
  partNo: number;
  partName: string;
  direction: string;
  type: "single" | "group";
  questions?: ReadingQuestion[];
  groups?: ReadingGroup[];
}

export interface ReadingLoadResponse {
  parts: ReadingPartData[];
  readingTimeMinutes: number;
}

export interface ScoreResponse {
  totalListening: number;
  totalReading: number;
  listeningScaledScore: number;
  readingScaledScore: number;
  totalScaledScore: number;
}
