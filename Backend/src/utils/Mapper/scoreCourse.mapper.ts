import { ScoreCourse } from "@prisma/client";
import { ScoreCourseResponse } from "../../DTOS/ScoreCourse";

export const toScoreCourseResponse = (
  scoreCourse: ScoreCourse,
): ScoreCourseResponse => {
  return {
    id: scoreCourse.id,
    courseTestId: scoreCourse.courseTestId,
    studentId: scoreCourse.studentId,
    score: scoreCourse.score,
    createdAt: scoreCourse.createdAt,
  };
};
