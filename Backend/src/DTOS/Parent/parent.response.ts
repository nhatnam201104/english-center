import { StudentResponse } from "../Student/student.response";

export interface ParentResponse {
  id: number;
  userId: number;
  fullname: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  students?: StudentResponse[];
}
