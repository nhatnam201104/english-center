export interface PartSummary {
  id: number;
  partNo: number;
  partName: string;
  direction: string;
  totalQuestion: number;
  quantityQuestionDone: number;
  isDone: boolean;
}

export interface ListeningResponse {
  id: number;
  name: string;
  direction: string;
  isDone: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  partsSummary: PartSummary[];
  answerKeyCount: number;
}

export interface ReadingResponse {
  id: number;
  name: string;
  direction: string;
  isDone: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  partsSummary: PartSummary[];
  answerKeyCount: number;
}

export interface AnswerKeyItem {
  index: number;
  answer: string;
}

export interface AnswerKeyRequest {
  answers: AnswerKeyItem[];
}

export interface QuestionMCDto {
  index: number;
  question: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
}

export interface GroupCreateRequest {
  index: number;
  audio?: string;
  image?: string;
  question?: string;
  fromQuestionIndex: number;
  toQuestionIndex: number;
  questions: QuestionMCDto[];
}
