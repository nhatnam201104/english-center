import { StudentResponse } from "../student/response";

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
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
