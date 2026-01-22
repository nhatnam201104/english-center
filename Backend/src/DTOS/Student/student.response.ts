export interface StudentResponse {
  id: number;
  userId: number;
  fullname: string;
  email: string;
  phone: string;
  dob: Date | null;
  cccd: string | null;
  scoreRl: number;
  scoreSw: number;
  createdAt: Date;
  updatedAt: Date;
}
