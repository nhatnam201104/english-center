import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  createStudentValidation,
  updateStudentValidation,
} from "../validators/student.validator";
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller";

const router = Router();

/**
 * @route   POST /api/students
 * @desc    Tạo học sinh mới
 * @access  Private (Admin only)
 */
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createStudentValidation,
  validate,
  createStudent,
);

/**
 * @route   GET /api/students
 * @desc    Lấy danh sách học sinh
 * @access  Private (Admin, Teacher)
 */
router.get("/", authenticate, authorize("ADMIN", "TEACHER"), getAllStudents);

/**
 * @route   GET /api/students/:id
 * @desc    Lấy thông tin học sinh theo ID
 * @access  Private (Admin, Teacher, Student - chỉ xem chính mình)
 */
router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "TEACHER", "STUDENT"),
  getStudentById,
);

/**
 * @route   PUT /api/students/:id
 * @desc    Cập nhật học sinh
 * @access  Private (Admin, Student - chỉ cập nhật chính mình)
 */
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "STUDENT"),
  updateStudentValidation,
  validate,
  updateStudent,
);

/**
 * @route   DELETE /api/students/:id
 * @desc    Xóa học sinh (soft delete)
 * @access  Private (Admin only)
 */
router.delete("/:id", authenticate, authorize("ADMIN"), deleteStudent);

export default router;
