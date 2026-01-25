import { ClassroomResponse } from "../../DTOS/Classroom/classroom.response";

export const toClassroomResponse = (classroom: any): ClassroomResponse => {
  return {
    id: classroom.id,
    name: classroom.name,
    maxSize: classroom.maxSize,
    createdAt: classroom.createdAt,
    updatedAt: classroom.updatedAt,
  };
};
