import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  createWritingValidation,
  updateWritingValidation,
  part1Validation,
  part2Validation,
  part3Validation,
  indexParamValidation,
} from "../validators/writing.validator";
import {
  createWriting,
  getAllWriting,
  getWritingById,
  updateWriting,
  toggleActiveWriting,
  deleteWriting,
  upsertPart1,
  getPart1,
  deletePart1,
  upsertPart2,
  getPart2,
  deletePart2,
  upsertPart3,
  getPart3,
  deletePart3,
} from "../controllers/writing.controller";
import { upload, mergeFilesToBody } from "../middleware/upload.middleware";

const router = Router();

// ==================== MAIN EXAM ROUTES ====================

/**
 * @route   POST /api/writing
 * @desc    Tạo đề thi Writing mới
 * @access  Private (Admin only)
 */
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createWritingValidation,
  validate,
  createWriting,
);

/**
 * @route   GET /api/writing
 * @desc    Lấy danh sách đề thi Writing
 * @access  Private (Admin, Teacher, Student)
 */
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "TEACHER", "STUDENT"),
  getAllWriting,
);

/**
 * @route   GET /api/writing/:id
 * @desc    Lấy chi tiết đề thi Writing kèm tất cả parts
 * @access  Private (Admin, Teacher, Student)
 */
router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "TEACHER", "STUDENT"),
  getWritingById,
);

/**
 * @route   PUT /api/writing/:id
 * @desc    Cập nhật đề thi Writing
 * @access  Private (Admin only)
 */
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateWritingValidation,
  validate,
  updateWriting,
);

/**
 * @route   PATCH /api/writing/:id/toggle-active
 * @desc    Toggle active status
 * @access  Private (Admin only)
 */
router.patch(
  "/:id/toggle-active",
  authenticate,
  authorize("ADMIN"),
  toggleActiveWriting,
);

/**
 * @route   DELETE /api/writing/:id
 * @desc    Xóa đề thi Writing
 * @access  Private (Admin only)
 */
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteWriting,
);

// ==================== PART 1 ROUTES ====================

/**
 * @route   GET /api/writing/:id/part1
 * @desc    Lấy tất cả Part 1 của đề thi
 * @access  Private (Admin, Teacher, Student)
 */
router.get(
  "/:id/part1",
  authenticate,
  authorize("ADMIN", "TEACHER", "STUDENT"),
  getPart1,
);

/**
 * @route   PUT /api/writing/:id/part1
 * @desc    Upsert Part 1 (Create or Update) - Write a Sentence Based on a Picture
 * @access  Private (Admin only)
 * @note    Unified endpoint for both create and update operations
 * @note    Index is handled by database default value (@default(1))
 */
router.put(
  "/:id/part1",
  authenticate,
  authorize("ADMIN"),
  upload.fields([
    { name: 'imageOne', maxCount: 1 },
    { name: 'imageTwo', maxCount: 1 },
    { name: 'imageThree', maxCount: 1 },
    { name: 'imageFour', maxCount: 1 },
    { name: 'imageFive', maxCount: 1 },
  ]),
  mergeFilesToBody, // ✅ Merge files from req.files to req.body BEFORE validation
  part1Validation,
  validate,
  upsertPart1,
);

/**
 * @route   DELETE /api/writing/:id/part1/:index
 * @desc    Xóa Part 1
 * @access  Private (Admin only)
 */
router.delete(
  "/:id/part1/:index",
  authenticate,
  authorize("ADMIN"),
  indexParamValidation,
  validate,
  deletePart1,
);

// ==================== PART 2 ROUTES ====================

/**
 * @route   GET /api/writing/:id/part2
 * @desc    Lấy tất cả Part 2 của đề thi
 * @access  Private (Admin, Teacher, Student)
 */
router.get(
  "/:id/part2",
  authenticate,
  authorize("ADMIN", "TEACHER", "STUDENT"),
  getPart2,
);

/**
 * @route   PUT /api/writing/:id/part2
 * @desc    Upsert Part 2 (Create or Update) - Respond to a Written Request
 * @access  Private (Admin only)
 * @note    Unified endpoint for both create and update operations
 * @note    Index is handled by database default value (@default(2))
 */
router.put(
  "/:id/part2",
  authenticate,
  authorize("ADMIN"),
  upload.fields([
    { name: 'imageSix', maxCount: 1 },
    { name: 'imageSeven', maxCount: 1 },
  ]),
  mergeFilesToBody, // ✅ Merge files from req.files to req.body BEFORE validation
  part2Validation,
  validate,
  upsertPart2,
);

/**
 * @route   DELETE /api/writing/:id/part2/:index
 * @desc    Xóa Part 2
 * @access  Private (Admin only)
 */
router.delete(
  "/:id/part2/:index",
  authenticate,
  authorize("ADMIN"),
  indexParamValidation,
  validate,
  deletePart2,
);

// ==================== PART 3 ROUTES ====================

/**
 * @route   GET /api/writing/:id/part3
 * @desc    Lấy tất cả Part 3 của đề thi
 * @access  Private (Admin, Teacher, Student)
 */
router.get(
  "/:id/part3",
  authenticate,
  authorize("ADMIN", "TEACHER", "STUDENT"),
  getPart3,
);

/**
 * @route   PUT /api/writing/:id/part3
 * @desc    Upsert Part 3 (Create or Update) - Write an Opinion Essay
 * @access  Private (Admin only)
 * @note    Unified endpoint for both create and update operations
 * @note    Index is handled by database default value (@default(3))
 */
router.put(
  "/:id/part3",
  authenticate,
  authorize("ADMIN"),
  part3Validation,
  validate,
  upsertPart3,
);

/**
 * @route   DELETE /api/writing/:id/part3/:index
 * @desc    Xóa Part 3
 * @access  Private (Admin only)
 */
router.delete(
  "/:id/part3/:index",
  authenticate,
  authorize("ADMIN"),
  indexParamValidation,
  validate,
  deletePart3,
);

export default router;