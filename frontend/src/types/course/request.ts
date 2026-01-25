export type CourseSkill = "READING_LISTENING" | "SPEAKING_WRITING" | "ALL";

export interface CreateCourseRequest {
  name: string;
  type: "COURSE" | "TEST_PREPARATION";
  price: number;
  sale?: number;
  thumbnail?: string;
  status: "PLANNING" | "ACTIVE" | "COMPLETED";
  minBand?: number;
  maxBand?: number;
  courseSkill: CourseSkill;
}

export interface UpdateCourseRequest {
  id: number;
  name?: string;
  type?: "COURSE" | "TEST_PREPARATION";
  price?: number;
  sale?: number;
  thumbnail?: string;
  status?: "PLANNING" | "ACTIVE" | "COMPLETED";
  minBand?: number;
  maxBand?: number;
  courseSkill?: CourseSkill;
}

export interface GetCourseRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  type?: "COURSE" | "TEST_PREPARATION";
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minBand?: number;
  maxBand?: number;
  minSize?: number;
  maxSize?: number;
}
