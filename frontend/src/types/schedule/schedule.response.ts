import type { Course } from "../course/response";
import type { TeacherResponse } from "../teacher/response";
import type { ScheduleSessionResponse } from "./schedule-session.response";

export interface ScheduleResponse {
  id: number;
  teacher: {
    id: number;
    fullname: string;
  };
  classroom: {
    id: number;
    name: string;
  };
  course: {
    id: number;
    name: string;
    type: string;
    skill: string;
  };
  totalSlot: number;
  totalRegister: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  sessions?: ScheduleSessionResponse[];
}

export interface ScheduleListResponse {
  data: ScheduleResponse[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}