export type UpdateScheduleRequest = {
  teacherId?: number;
  classroomId?: number;
  startTime?: string;
  endTime?: string;
  sessions?: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
};
