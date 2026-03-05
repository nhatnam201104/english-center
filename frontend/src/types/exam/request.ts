export interface CreateExamRequest {
  name: string;
  isActive: boolean;
}

export interface UpdateExamRequest extends CreateExamRequest {
  id: number;
}

export interface GetExamRequest {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UpsertPart1Request {
  writingExamId: number;
  imageOne: File;
  imageTwo: File;
  imageThree: File;
  imageFour: File;
  imageFive: File;
}

export interface UpsertPart2Request {
  writingExamId: number;
  imageSix: File;
  imageSeven: File;
}

export interface UpsertPart3Request {
  writingExamId: number;
  questionEight: string;
}
