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
