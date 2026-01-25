export interface UpdateCourseRequest {
  type?: string;
  name?: string;
  courseSkill?: "READING_LISTENING" | "SPEAKING_WRITING" | "ALL";
  status?: "PLANNING" | "ACTIVE" | "INACTIVE" | "COMPLETED";
  price?: number;
  sale?: number;
  thumbnail?: string;
  minBand?: number;
  maxBand?: number;
}
