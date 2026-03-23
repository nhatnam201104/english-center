import type { StudentResponse } from "../student/response";

export interface ScheduleStudentListResponse {
  data: StudentResponse[];
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface StudentScheduleSessionResponse {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
}

export interface StudentScheduleByIdResponse {
  id: number;
  teacher?: {
    id: number;
    userId: number;
    fullname: string;
    email: string;
    phone: string;
    degree: string;
    isTeaching: boolean;
    avatar: string;
    createdAt: string;
    updatedAt: string;
    days: string[];
  };
  classroom?: {
    id: number;
    name: string;
    maxSize: number;
    createdAt: string;
    updatedAt: string;
  };
  totalSlot: number;
  totalRegister: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  course?: {
    id: number;
    type: string;
    name: string;
    courseSkill: string;
    status: string;
    price: number;
    sale: number;
    thumbnail: string;
    totalSession: number;
    minBand: number;
    maxBand: number;
    createdAt: string;
    updatedAt: string;
  };
  sessions: StudentScheduleSessionResponse[];
}

export interface StudentSchedulesByStudentIdResponse {
  data: StudentScheduleByIdResponse[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}