export interface CreatePart1Request {
  index: number;
  questionOne: string;
  questionTwo: string;
}

export interface UpdatePart1Request {
  questionOne?: string;
  questionTwo?: string;
}