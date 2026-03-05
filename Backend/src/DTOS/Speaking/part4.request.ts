export interface CreatePart4Request {
  index: number;
  passage: string;
  questionEight: string;
  questionNine: string;
  questionTen: string;
  image?: string;
}

export interface UpdatePart4Request {
  passage?: string;
  questionEight?: string;
  questionNine?: string;
  questionTen?: string;
  image?: string;
}