import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  createCourseValidation,
  updateCourseValidation,
} from "../validators/course.validator";
import {
  createCourse,
  getAllCourses,
  getActiveCoursesWithFutureSchedules,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller";
import { upload } from "../middleware/upload.middleware";

const router = Router();

/**
 * @route   POST /api/courses
 * @desc    Tạo khóa học mới (thumbnail bắt buộc)
 * @access  Private (Admin only)
 */
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  upload.single("thumbnail"),
  createCourseValidation,
  validate,
  createCourse,
);

/**
 * @route   GET /api/courses
 * @desc    Lấy danh sách khóa học
 * @access  Private (Admin, Teacher, Student)
 */
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "TEACHER", "STUDENT"),
  getAllCourses,
);

/**
 * @route   GET /api/courses/active-with-future-schedules
 * @desc    Lấy danh sách khóa học đang ACTIVE và có lịch học trong tương lai
 */
router.get(
  "/active-with-future-schedules",
  getActiveCoursesWithFutureSchedules,
);

/**
 * @route   GET /api/courses/:id
 * @desc    Lấy thông tin khóa học theo ID
 * @access  Private (Admin, Teacher, Student)
 */
router.get(
  "/:id",
  getCourseById,
);

/**
 * @route   PUT /api/courses/:id
 * @desc    Cập nhật khóa học (có thể upload thumbnail)
 * @access  Private (Admin only)
 */
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  upload.single("thumbnail"),
  updateCourseValidation,
  validate,
  updateCourse,
);

/**
 * @route   DELETE /api/courses/:id
 * @desc    Xóa khóa học
 * @access  Private (Admin only)
 */
router.delete("/:id", authenticate, authorize("ADMIN"), deleteCourse);

export default router;
