export interface GetStudentRequest {
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  minScoreRl?: number;
  maxScoreRl?: number;
  minScoreSw?: number;
  maxScoreSw?: number;
}
