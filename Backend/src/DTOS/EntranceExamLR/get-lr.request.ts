export interface GetLRRequest {
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  isDone?: boolean;
  isActive?: boolean;
}
