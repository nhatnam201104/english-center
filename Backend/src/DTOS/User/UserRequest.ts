export interface CreateUserRequest {
  phone: string;
  fullName: string;
  password: string;
  roleId: number;
}
export interface GetUserRequest {
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
