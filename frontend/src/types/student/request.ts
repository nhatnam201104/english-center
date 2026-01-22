export interface CreateStudentRequest {
  phone: string;
  fullname: string;
  email: string;
  password: string;
  dob?: string;
  cccd?: string;
  scoreRl?: number;
  scoreSw?: number;
}

export interface UpdateStudentRequest {
  phone?: string;
  fullname?: string;
  email?: string;
  password?: string;
  dob?: string;
  cccd?: string;
  scoreRl?: number;
  scoreSw?: number;
}

export interface GetStudentRequest {
  page?: number;
  limit?: number;
  search?: string;
  minScoreRl?: number;
  maxScoreRl?: number;
  minScoreSw?: number;
  maxScoreSw?: number;
}
