import type { StudentResponse } from "../student/response";

export interface ParentResponse {
  id: number;
  phone: string;
  fullname: string;
  email: string;
  role: string;
  createdAt: string;
  students?: StudentResponse[];
}

export interface ParentListResponse {
  data: ParentResponse[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}
