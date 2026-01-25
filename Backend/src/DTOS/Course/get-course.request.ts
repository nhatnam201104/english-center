export interface GetCourseRequest {
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  type?: string;
  courseSkill?: "READING_LISTENING" | "SPEAKING_WRITING" | "ALL";
  status?: "PLANNING" | "ACTIVE" | "INACTIVE" | "COMPLETED";
  minPrice?: number;
  maxPrice?: number;
  minBand?: number;
  maxBand?: number;
}
