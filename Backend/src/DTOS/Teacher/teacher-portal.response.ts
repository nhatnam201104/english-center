import { CourseResponse } from "../Course";
import { PagingData } from "../pagination";
import { ScheduleSessionResponse } from "../Schedule/schedule-sessions.response";
import { TeacherResponse } from "./teacher.response";

export interface TeacherCourseResponse {
  id: number;
  teacher: TeacherResponse;
  classroomId: number;
  totalSlot: number;
  totalRegister: number;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
  course: CourseResponse;
  sessions: ScheduleSessionResponse[];
  status: "UPCOMING" | "ONGOING" | "FINISHED";
}

export type TeacherCoursesPagingResponse = PagingData<TeacherCourseResponse>;

export interface TeacherCourseStudentResponse {
  studentId: number;
  fullname: string;
  email: string;
  phone: string;
}
