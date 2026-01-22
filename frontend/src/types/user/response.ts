export interface UserResponse {
  id: number;
  phone: string;
  fullname: string;
  email: string;
  role: string;
  createdAt: Date;
  token?: string;
}
