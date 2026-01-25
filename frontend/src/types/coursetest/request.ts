export interface GetCourseTestRequest {
  page: number;
  limit: number;
  search?: string;
  courseId?: number;
}

export interface CreateCourseTestRequest {
  courseId: number;
  name: string;
  index: number;
  fileTest: string | File;
  audioTest?: string | File;
}

export interface UpdateCourseTestRequest {
  id: number;
  courseId?: number;
  name?: string;
  index?: number;
  fileTest?: string | File;
  audioTest?: string | File | null;
}
