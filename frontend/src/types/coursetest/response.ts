export interface CourseTest {
  id: number;
  courseId: number;
  name: string;
  index: number;
  fileTest: string;
  audioTest: string | null;
  createdAt: string;
}

export interface CourseTestQuestion {
  id: string;
  questionText: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER" | "ESSAY";
  options?: string[];
  correctAnswer: string;
  points: number;
  order: number;
}

export interface CourseTestDetail extends CourseTest {
  questions: CourseTestQuestion[];
}

export interface PaginatedCourseTestResponse {
  data: CourseTest[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}
