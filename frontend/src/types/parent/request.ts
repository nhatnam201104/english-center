export interface CreateParentRequest {
  phone: string;
  fullname: string;
  email: string;
  password: string;
}

export interface UpdateParentRequest {
  phone?: string;
  fullname?: string;
  email?: string;
  password?: string;
}

export interface GetParentRequest {
  page?: number;
  limit?: number;
  search?: string;
  includeStudents?: boolean;
}

export interface LinkStudentRequest {
  parentId: number;
  studentId: number;
}
