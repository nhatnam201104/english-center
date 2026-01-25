export interface GetCourseTestRequest {
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  courseId?: number;
}
