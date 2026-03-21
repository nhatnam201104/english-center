export interface ParentStudentSchedule {
  registrationId: number;
  registrationCreatedAt: string;
  id: number;
  teacher?: {
    fullname?: string;
  };
  classroom?: {
    name?: string;
  };
  course?: {
    name?: string;
    skill?: string;
    thumnail?: string;
  };
  startTime: string;
  endTime: string;
}