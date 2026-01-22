export interface TeacherResponse {
  id: number;
  phone: string;
  fullname: string;
  email: string;
  role: string;
  createdAt: string;
  degree: string;
  isTeaching: boolean;
  avatar: string | null;
}

export interface TeacherListResponse {
  data: TeacherResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
