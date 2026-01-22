export interface CreateTeacherRequest {
  phone: string;
  fullname: string;
  email: string;
  password: string;
  degree: string;
  isTeaching: boolean;
  avatar: File;
}

export interface UpdateTeacherRequest {
  phone?: string;
  fullname?: string;
  email?: string;
  password?: string;
  degree?: string;
  isTeaching?: boolean;
  avatar?: File;
}

export interface GetTeacherRequest {
  page?: number;
  limit?: number;
  search?: string;
  degree?: string;
  isTeaching?: boolean;
}
