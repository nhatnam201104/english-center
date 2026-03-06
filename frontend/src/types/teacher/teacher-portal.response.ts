import type { Course } from "../course/response";
import type { TeacherResponse } from "./response";
import type { ScheduleSessionResponse } from "../schedule/schedule-session.response";

export interface TeacherCourseResponse {
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
  sessions: ScheduleSessionResponse[];
  status: "UPCOMING" | "ONGOING" | "FINISHED";
}

export interface TeacherCoursesListResponse {
  data: TeacherCourseResponse[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

export interface TeacherCourseStudentResponse {
  studentId: number;
  fullname: string;
  email: string;
  phone: string;
}
