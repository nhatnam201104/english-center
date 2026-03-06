import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import {
  getMyCourses,
  getMyCourseDetail,
  getMyCourseStudents,
  getMyAvailability,
  updateMyAvailability,
} from "../controllers/teacher.portal.controller";

const router = Router();

/**
 * @route   GET /api/teacher/courses
 * @desc    Lấy danh sách khóa học của teacher đang đăng nhập
 * @access  Private (Teacher only)
 */
router.get(
  "/courses",
  authenticate,
  authorize("TEACHER"),
  getMyCourses,
);

/**
 * @route   GET /api/teacher/courses/:scheduleId
 * @desc    Lấy chi tiết khóa học (schedule) — ownership check
 * @access  Private (Teacher only)
 */
router.get(
  "/courses/:scheduleId",
  authenticate,
  authorize("TEACHER"),
  getMyCourseDetail,
);

/**
 * @route   GET /api/teacher/courses/:scheduleId/students
 * @desc    Lấy danh sách học sinh trong khóa học
 * @access  Private (Teacher only)
 */
router.get(
  "/courses/:scheduleId/students",
  authenticate,
  authorize("TEACHER"),
  getMyCourseStudents,
);

/**
 * @route   GET /api/teacher/availability
 * @desc    Lấy lịch rảnh của teacher đang đăng nhập
 * @access  Private (Teacher only)
 */
router.get(
  "/availability",
  authenticate,
  authorize("TEACHER"),
  getMyAvailability,
);

/**
 * @route   PUT /api/teacher/availability
 * @desc    Cập nhật lịch rảnh của teacher
 * @access  Private (Teacher only)
 */
router.put(
  "/availability",
  authenticate,
  authorize("TEACHER"),
  updateMyAvailability,
);

export default router;
