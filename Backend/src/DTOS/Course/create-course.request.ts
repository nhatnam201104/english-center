export interface CreateCourseRequest {
  type: string;
  name: string;
  courseSkill: "READING_LISTENING" | "SPEAKING_WRITING";
  price: number;
  sale?: number;
  thumbnail: string;
  totalSession?: number;
  minBand?: number;
  maxBand?: number;
}
