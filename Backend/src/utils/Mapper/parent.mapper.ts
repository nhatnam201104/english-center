import { ParentInfo, User, StudentInfo } from "@prisma/client";
import { ParentResponse } from "../../DTOS/Parent/parent.response";
import { toStudentResponse } from "./student.mapper";

export const toParentResponse = (
  parent: ParentInfo & {
    user: User;
    students?: Array<{ student: StudentInfo & { user: User } }>;
  },
): ParentResponse => ({
  id: parent.id,
  userId: parent.userId,
  fullname: parent.user.fullname,
  email: parent.user.email,
  phone: parent.user.phone,
  createdAt: parent.createdAt,
  updatedAt: parent.updatedAt,
  students: parent.students?.map((ps) => toStudentResponse(ps.student)),
});
