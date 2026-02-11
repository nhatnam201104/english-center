import { TeacherFreeDay, TeacherInfo, User } from "@prisma/client";
import { TeacherResponse } from "../../DTOS/Teacher/teacher.response";
import { buildTeacherAvatarUrl } from "../fileUrl";

export const toTeacherResponse = (
  teacher: TeacherInfo & { user: User; freeDays?: TeacherFreeDay[] }
): TeacherResponse => ({
  id: teacher.id,
  userId: teacher.userId,
  fullname: teacher.user.fullname,
  email: teacher.user.email,
  phone: teacher.user.phone,
  degree: teacher.degree,
  isTeaching: teacher.isTeaching,
  avatar: buildTeacherAvatarUrl(teacher.avatar),
  createdAt: teacher.createdAt,
  updatedAt: teacher.updatedAt,
  days: teacher.freeDays?.map(d => d.day) || [],
});
