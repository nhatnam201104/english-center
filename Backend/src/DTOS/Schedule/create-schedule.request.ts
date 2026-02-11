import { DayOfWeek } from "@prisma/client";

export interface CreateScheduleRequest {
  teacherId: number;
  classroomId: number;
  coursesId: number;
  totalSlot: number;
  startTime: string; 
  endTime: string; 
  sessions: {
    day: DayOfWeek;
    startTime: string;
    endTime: string;
  }[];
}
