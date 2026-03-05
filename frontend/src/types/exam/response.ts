export interface Exam {
  id: number;
  name: string;
  isActive: boolean;
  isDone: boolean;
  totalQuestion: number;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
}

export interface WritingSixSeven {
  id: number;
  index: number;
  writingExamId: number;
  imageSix: string;
  imageSeven: string;
  createdAt: string;
}

export interface WritingEight {
  id: number;
  index: number;
  writingExamId: number;
  questionEight: string;
  createdAt: string;
}

export interface PaginatedExamResponse {
  data: Exam[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}