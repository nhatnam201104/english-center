export interface GetTeacherCoursesRequest {
  page?: number;
  limit?: number;
  status?: "UPCOMING" | "ONGOING" | "FINISHED";
  scheduleType?: "246" | "357";
}
