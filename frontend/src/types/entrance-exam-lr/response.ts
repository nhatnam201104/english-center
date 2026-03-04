export interface PartSummary {
  id: number;
  partNo: number;
  partName: string;
  direction: string;
  totalQuestion: number;
  quantityQuestionDone: number;
  isDone: boolean;
}

export interface ListeningExam {
  id: number;
  name: string;
  direction: string;
  isDone: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  partsSummary: PartSummary[];
  answerKeyCount: number;
}

export interface ReadingExam {
  id: number;
  name: string;
  direction: string;
  isDone: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  partsSummary: PartSummary[];
  answerKeyCount: number;
}

export interface PaginatedListeningResponse {
  data: ListeningExam[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

export interface PaginatedReadingResponse {
  data: ReadingExam[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

/* ── Part detail types ── */

export interface PartOneQuestionResponse {
  id: number;
  index: number;
  question: string;
  audio: string | null;
  image: string | null;
  createdAt: string;
}

export interface PartTwoQuestionResponse {
  id: number;
  index: number;
  question: string;
  audio: string | null;
  createdAt: string;
}

export interface MCQuestionResponse {
  id: number;
  index: number;
  question: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
}

export interface ListeningGroupResponse {
  id: number;
  index: number;
  audio: string | null;
  image: string | null;
  fromQuestionIndex: number;
  toQuestionIndex: number;
  createdAt: string;
  questions: MCQuestionResponse[];
}

export interface ReadingGroupResponse {
  id: number;
  index: number;
  question: string | null;
  image: string | null;
  fromQuestionIndex: number;
  toQuestionIndex: number;
  createdAt: string;
  questions: MCQuestionResponse[];
}

export interface PartDetailBase {
  id: number;
  direction: string;
  totalQuestion: number;
  quantityQuestionDone: number;
  isDone: boolean;
}

export interface PartOneDetail extends PartDetailBase {
  questions: PartOneQuestionResponse[];
}

export interface PartTwoDetail extends PartDetailBase {
  questions: PartTwoQuestionResponse[];
}

export interface PartThreeDetail extends PartDetailBase {
  groups: ListeningGroupResponse[];
}

export interface PartFourDetail extends PartDetailBase {
  groups: ListeningGroupResponse[];
}

export interface PartFiveDetail extends PartDetailBase {
  questions: MCQuestionResponse[];
}

export interface PartSixDetail extends PartDetailBase {
  groups: ReadingGroupResponse[];
}

export interface PartSevenDetail extends PartDetailBase {
  groups: ReadingGroupResponse[];
}

export interface ListeningPartsResponse {
  partOne: PartOneDetail | null;
  partTwo: PartTwoDetail | null;
  partThree: PartThreeDetail | null;
  partFour: PartFourDetail | null;
}

export interface ReadingPartsResponse {
  partFive: PartFiveDetail | null;
  partSix: PartSixDetail | null;
  partSeven: PartSevenDetail | null;
}

export interface AnswerKeyItemResponse {
  index: number;
  answer: string;
}
