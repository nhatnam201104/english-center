import { StudentInfo, User } from "@prisma/client";
import { StudentResponse } from "../../DTOS/Student/student.response";

export const toStudentResponse = (
  student: StudentInfo & { user: User },
): StudentResponse => ({
  id: student.id,
  userId: student.userId,
  fullname: student.user.fullname,
  email: student.user.email,
  phone: student.user.phone,
  dob: student.dob,
  cccd: student.cccd,
  scoreRl: student.scoreRl,
  scoreSw: student.scoreSw,
  createdAt: student.createdAt,
  updatedAt: student.updatedAt,
});
