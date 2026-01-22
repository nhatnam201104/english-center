export interface CreateStudentRequest {
  fullname: string;
  email: string;
  password: string;
  phone: string;
  dob?: Date;
  cccd?: string;
  scoreRl?: number;
  scoreSw?: number;
}
