export type CreateScheduleRequest = {
  teacherId: number;
  classroomId: number;
  coursesId: number;
  startTime: string;
  endTime: string;
  sessions: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
};
