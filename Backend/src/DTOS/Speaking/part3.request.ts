export interface CreatePart3Request {
  index: number;
  passage: string;
  questionFive: string;
  questionSix: string;
  questionSeven: string;
}

export interface UpdatePart3Request {
  passage?: string;
  questionFive?: string;
  questionSix?: string;
  questionSeven?: string;
}