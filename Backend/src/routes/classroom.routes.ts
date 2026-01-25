import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  createClassroomValidation,
  updateClassroomValidation,
} from "../validators/classroom.validator";
import {
  createClassroom,
  getAllClassrooms,
  getClassroomById,
  updateClassroom,
  deleteClassroom,
} from "../controllers/classroom.controller";

const router = Router();

/**
 * @route   POST /api/classrooms
 * @desc    Tạo lớp học mới
 * @access  Private (Admin only)
 */
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createClassroomValidation,
  validate,
  createClassroom,
);

/**
 * @route   GET /api/classrooms
 * @desc    Lấy danh sách lớp học
 * @access  Private (Admin, Teacher)
 */
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "TEACHER", "STUDENT"),
  getAllClassrooms,
);

/**
 * @route   GET /api/classrooms/:id
 * @desc    Lấy thông tin lớp học theo ID
 * @access  Private (Admin, Teacher)
 */
router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "TEACHER", "STUDENT"),
  getClassroomById,
);

/**
 * @route   PUT /api/classrooms/:id
 * @desc    Cập nhật lớp học
 * @access  Private (Admin only)
 */
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateClassroomValidation,
  validate,
  updateClassroom,
);

/**
 * @route   DELETE /api/classrooms/:id
 * @desc    Xóa lớp học
 * @access  Private (Admin only)
 */
router.delete("/:id", authenticate, authorize("ADMIN"), deleteClassroom);

export default router;
