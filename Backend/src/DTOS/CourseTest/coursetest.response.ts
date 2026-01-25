export interface CourseTestResponse {
  id: number;
  courseId: number;
  name: string;
  index: number;
  fileTest: string | null;
  audioTest: string | null;
  createdAt: Date;
}
