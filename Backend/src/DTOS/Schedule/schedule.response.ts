import { CourseResponse } from "../Course";
import { PagingData } from "../pagination";
import { ScheduleSessionResponse } from "./schedule-sessions.response";
import { TeacherResponse } from "../Teacher";
import { ClassroomResponse } from "../Classroom/classroom.response";

export interface ScheduleResponse {
  id: number;
  teacher: TeacherResponse;
  classroom: ClassroomResponse;
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
