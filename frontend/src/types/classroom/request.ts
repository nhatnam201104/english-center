export interface CreateClassroomRequest {
  name: string;
  maxSize: number;
}

export interface UpdateClassroomRequest {
  id: number;
  name: string;
  maxSize: number;
}

export interface GetClassroomRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}
