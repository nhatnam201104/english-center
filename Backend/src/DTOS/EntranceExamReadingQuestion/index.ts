export interface EntranceExamReadingQuestionResponse {
  id: number;
  entranceExamId: number;
  index: number;
  part: number;
  question: string;
  image?: string;
  createdAt: Date;
}
