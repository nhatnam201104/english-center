export interface GetClassroomRequest {
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  minSize?: number;
  maxSize?: number;
}
