export interface StudentScheduleResponse {
  registrationId: number;
  registrationCreatedAt: string;
  id: number;
  teacher?: {
    fullname?: string;
  };
  classroom?: {
    name?: string;
  };
  course?: {
    courseId?: number;
    name?: string;
    skill?: string;
    thumbnail?: string;
  };
  startTime: string;
  endTime: string;
}

export interface StudentResponse {
  id: number;
  userId?: number;
  phone: string;
  fullname: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt?: string;
  dob: string;
  cccd: string;
  scoreRl: number;
  scoreSw: number;
  schedules?: StudentScheduleResponse[];
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
