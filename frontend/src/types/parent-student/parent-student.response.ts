import type { ParentStudentSchedule } from "./parent-student-schedule.response";

export interface ParentStudentResponse {
  id: number;
  fullname: string;
  dob: string;
  scoreRl: number;
  scoreSw: number;
  schedules: ParentStudentSchedule[];
}