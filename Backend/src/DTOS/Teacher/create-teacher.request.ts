export interface CreateTeacherRequest {
  fullname: string;
  email: string;
  password: string;
  phone: string;
  degree: string;
  avatar: string; // Bắt buộc khi tạo teacher
  isTeaching?: boolean | string;
}
