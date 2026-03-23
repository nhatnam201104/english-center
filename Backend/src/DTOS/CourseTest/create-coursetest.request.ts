export interface CreateCourseTestRequest {
  courseId: number;
  name: string;
  index?: number; // Optional since it's auto-incremented in backend
}
