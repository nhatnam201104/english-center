import { CourseResponse } from "../Course";
import { PagingData } from "../pagination";
import { ScheduleSessionResponse } from "./schedule-sessions.response";
import { TeacherResponse } from "../Teacher";

export interface ScheduleResponse {
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
}

export type SchedulePagingResponse = PagingData<ScheduleResponse>;
