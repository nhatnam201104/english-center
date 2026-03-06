export interface UpdateCourseRequest {
  type?: string;
  name?: string;
  courseSkill?: "READING_LISTENING" | "SPEAKING_WRITING" | "ALL";
  status?: "PLANNING" | "ACTIVE" | "INACTIVE";
  price?: number;
  sale?: number;
  thumbnail?: string;
  totalSession?: number;
  minBand?: number;
  maxBand?: number;
}
