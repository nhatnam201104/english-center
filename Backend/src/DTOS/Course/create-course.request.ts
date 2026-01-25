export interface CreateCourseRequest {
  type: string;
  name: string;
  courseSkill: "READING_LISTENING" | "SPEAKING_WRITING" | "ALL";
  price: number;
  sale?: number;
  thumbnail: string;
  minBand?: number;
  maxBand?: number;
}
