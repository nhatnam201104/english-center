export interface WritingResponse {
  id: number;
  name: string;
  isDone: boolean;
  isActive: boolean;
  totalQuestion: number;
  createdAt: Date;
  updatedAt: Date;
  writingOneToFives?: WritingOneToFive[];
  writingSixSevens?: WritingSixSeven[];
  writingEights?: WritingEight[];
}

export interface WritingOneToFive {
  id: number;
  index: number;
  writingExamId: number;
  imageOne: string;
  imageTwo: string;
  imageThree: string;
  imageFour: string;
  imageFive: string;
  createdAt: Date;
}

export interface WritingSixSeven {
  id: number;
  index: number;
  writingExamId: number;
  imageSix: string;
  imageSeven: string;
  createdAt: Date;
}

export interface WritingEight {
  id: number;
  index: number;
  writingExamId: number;
  questionEight: string;
  createdAt: Date;
}