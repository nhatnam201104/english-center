export interface StudentResponse {
  id: number;
  phone: string;
  fullname: string;
  email: string;
  role: string;
  createdAt: string;
  dob: string;
  cccd: string;
  scoreRl: number;
  scoreSw: number;
}

export interface StudentListResponse {
  data: StudentResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
