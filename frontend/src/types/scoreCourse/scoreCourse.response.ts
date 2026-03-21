export interface ScoreCourse {
  id: number;
  courseTestId: number;
  studentId: number;
  score: number | null;
  createdAt: string;
  updatedAt: string;
}