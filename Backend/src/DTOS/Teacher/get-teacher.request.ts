export interface GetTeacherRequest {
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  degree?: string;
  isTeaching?: boolean;
}
