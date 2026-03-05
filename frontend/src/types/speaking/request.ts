export interface CreateSpeakingRequest {
  name: string;
  isActive?: boolean;
}

export interface UpdateSpeakingRequest {
  id: number;
  name?: string;
  isActive?: boolean;
}

export interface GetSpeakingRequest {
  page: number;
  limit: number;
}

export interface UpsertSpeakingPart1Request {
  speakingExamId: number;
  index: number;
  questionOne: string;
  questionTwo: string;
}

export interface UpsertSpeakingPart2Request {
  speakingExamId: number;
  index: number;
}

export interface UpsertSpeakingPart3Request {
  speakingExamId: number;
  index: number;
  passage: string;
  questionFive: string;
  questionSix: string;
  questionSeven: string;
}

export interface UpsertSpeakingPart4Request {
  speakingExamId: number;
  index: number;
}

export interface UpsertSpeakingPart5Request {
  speakingExamId: number;
  index: number;
  question: string;
}