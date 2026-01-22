import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  createTeacherValidation,
  updateTeacherValidation,
} from "../validators/teacher.validator";
import {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacher.controller";
import { upload } from "../middleware/upload.middleware";

const router = Router();

/**
 * @route   POST /api/teachers
 * @desc    Tạo giáo viên mới (avatar bắt buộc)
 * @access  Private (Admin only)
 */
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  upload.single("avatar"),
  createTeacherValidation,
  validate,
  createTeacher,
);

/**
 * @route   GET /api/teachers
 * @desc    Lấy danh sách giáo viên
 * @access  Private (Admin, Teacher)
 */
router.get("/", authenticate, authorize("ADMIN", "TEACHER"), getAllTeachers);

/**
 * @route   GET /api/teachers/:id
 * @desc    Lấy thông tin giáo viên theo ID
 * @access  Private (Admin, Teacher)
 */
router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "TEACHER"),
  getTeacherById,
);

/**
 * @route   PUT /api/teachers/:id
 * @desc    Cập nhật giáo viên (có thể upload avatar)
 * @access  Private (Admin, Teacher - chỉ cập nhật chính mình)
 */
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "TEACHER"),
  upload.single("avatar"),
  updateTeacherValidation,
  validate,
  updateTeacher,
);

/**
 * @route   DELETE /api/teachers/:id
 * @desc    Xóa giáo viên (soft delete)
 * @access  Private (Admin only)
 */
router.delete("/:id", authenticate, authorize("ADMIN"), deleteTeacher);

export default router;
