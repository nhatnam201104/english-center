export interface UserResponse {
  id: number;
  phone: string;
  fullName: string;
  roleId: number;
  createdAt: Date;
  refreshToken?: string;
  token?: string;
}
