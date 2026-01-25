export interface Classroom {
  id: number;
  name: string;
  maxSize: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedClassroomResponse {
  data: Classroom[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}
