export interface Course {
  id: number;
  name: string;
  type: "COURSE" | "TEST_PREPARATION";
  price: number;
  sale: number;
  thumbnail: string | null;
  status: "PLANNING" | "ACTIVE" | "COMPLETED";
  minBand: number | null;
  maxBand: number | null;
  courseSkill: "READING_LISTENING" | "SPEAKING_WRITING" | "ALL";
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedCourseResponse {
  data: Course[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}
