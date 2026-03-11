export interface GetEntranceExamLRRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  isDone?: boolean;
  isActive?: boolean;
}

export interface CreateListeningRequest {
  name: string;
  direction: string;
}

export interface CreateReadingRequest {
  name: string;
  direction: string;
}

export interface UpdateLRRequest {
  name?: string;
  direction?: string;
}

export interface AnswerKeyItem {
  index: number;
  answer: string;
}

export interface SaveAnswerKeyRequest {
  answers: AnswerKeyItem[];
}

export interface QuestionMCDto {
  question: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
}

export type AddPartFiveQuestionRequest = QuestionMCDto;

export interface AddGroupRequest {
  audio?: File;
  image?: File;
  question?: string;
  questions: QuestionMCDto[];
}
