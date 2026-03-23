import { DayOfWeek } from "@prisma/client";

export interface UpdateScheduleRequest {
  teacherId?: number;
  classroomId?: number;
  startTime?: string;
  endTime?: string;
  sessions?: {
    day: DayOfWeek;
    startTime: string;
    endTime: string;
  }[];
}