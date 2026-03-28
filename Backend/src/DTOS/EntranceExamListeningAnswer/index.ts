export interface EntranceExamListeningAnswerResponse {
  id: number;
  entranceExamListeningId: number;
  part: number;
  answer: string | null;
  isTrue: boolean;
  createdAt: Date;
}