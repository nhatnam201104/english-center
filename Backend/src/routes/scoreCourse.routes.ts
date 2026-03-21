import { Router } from "express";
import {
  getScoreCourseByCourseTestAndStudent,
  createScoreCourse,
  updateScoreCourse,
} from "../controllers/scoreCourse.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

/**
 * @route   GET /api/score-courses/course-tests/:courseTestId/students/:studentId
 * @desc    Lấy điểm theo courseTestId và studentId
 * @access  Private (Admin, Teacher, Student)
 */
router.get(
  "/course-tests/:courseTestId/students/:studentId",
  authenticate,
  authorize("ADMIN", "TEACHER", "STUDENT", "PARENT"),
  getScoreCourseByCourseTestAndStudent,
);

/**
 * @route   POST /api/score-courses/course-tests/:courseTestId/students/:studentId
 * @desc    Tạo điểm mới cho học viên
 * @access  Private (Admin, Teacher)
 * @body    { score?: number }
 */
router.post(
  "/course-tests/:courseTestId/students/:studentId",
  authenticate,
  authorize("ADMIN", "TEACHER"),
  createScoreCourse,
);

/**
 * @route   PUT /api/score-courses/course-tests/:courseTestId/students/:studentId
 * @desc    Cập nhật điểm cho học viên
 * @access  Private (Admin, Teacher)
 * @body    { score: number }
 */
router.put(
  "/course-tests/:courseTestId/students/:studentId",
  authenticate,
  authorize("ADMIN", "TEACHER"),
  updateScoreCourse,
);

export default router;
