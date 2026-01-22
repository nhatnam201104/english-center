export interface TeacherResponse {
  id: number;
  userId: number;
  fullname: string;
  email: string;
  phone: string;
  degree: string;
  isTeaching: boolean;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}
