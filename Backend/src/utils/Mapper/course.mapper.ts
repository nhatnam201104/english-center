import { CourseResponse } from "../../DTOS/Course/course.response";
import { buildCourseThumbnailUrl } from "../fileUrl";

export const toCourseResponse = (course: any): CourseResponse => {
  return {
    id: course.id,
    type: course.type,
    name: course.name,
    courseSkill: course.courseSkill,
    status: course.status,
    price: course.price,
    sale: course.sale,

    thumbnail: buildCourseThumbnailUrl(course.thumbnail) ?? "default.jpg",
    totalSession: course.totalSession,
    minBand: course.minBand,
    maxBand: course.maxBand,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  };
};
