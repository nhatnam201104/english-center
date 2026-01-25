// Define the structure of a Course and related entities

export interface Instructor {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface Topic {
  id: string;
  title: string;
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  topicId: string;
  order: number;
  content?: string;
  videoUrl?: string;
  duration?: number;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  category: string;
  instructorId: string;
  instructor?: Instructor;
  totalLessons: number;
  createdAt: string;
  updatedAt: string;
  // Nested relationships (populated if requested)
  topics?: Topic[];
  lessons?: Lesson[];
}

export interface CourseFormData {
  title: string;
  description: string;
  level: Course["level"];
  language: string;
  category: string;
  instructorId: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
