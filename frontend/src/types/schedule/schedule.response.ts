import type { Course } from "../course/response";
import type { TeacherResponse } from "../teacher/response";
import type { ScheduleSessionResponse } from "./schedule-session.response";

export interface ScheduleResponse {
  id: number;
  teacher: TeacherResponse;
  classroomId: number;
  totalSlot: number;
  totalRegister: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  course: Course;
  sessions: ScheduleSessionResponse[]
}

export interface ScheduleListResponse {
  data: ScheduleResponse[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}