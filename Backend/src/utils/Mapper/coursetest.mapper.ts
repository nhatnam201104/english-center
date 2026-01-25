import { CourseTestResponse } from "../../DTOS/CourseTest";
import { CourseTest } from "@prisma/client";
import { buildCourseTestFileUrl, buildCourseTestAudioUrl } from "../fileUrl";

export const toCourseTestResponse = (
  courseTest: CourseTest,
): CourseTestResponse => {
  return {
    id: courseTest.id,
    courseId: courseTest.courseId,
    name: courseTest.name,
    index: courseTest.index,
    fileTest: buildCourseTestFileUrl(courseTest.fileTest),
    audioTest: buildCourseTestAudioUrl(courseTest.audioTest),
    createdAt: courseTest.createdAt,
  };
};
