import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  createSpeakingValidation,
  updateSpeakingValidation,
  speakingPart1Validation,
  speakingPart2Validation,
  speakingPart3Validation,
  speakingPart4Validation,
  speakingPart5Validation,
  indexParamValidation,
} from "../validators/speaking.validator";
import {
  createSpeaking,
  getAllSpeaking,
  getSpeakingById,
  updateSpeaking,
  toggleActiveSpeaking,
  deleteSpeaking,
  upsertSpeakingPart1,
  getSpeakingPart1,
  deleteSpeakingPart1,
  upsertSpeakingPart2,
  getSpeakingPart2,
  deleteSpeakingPart2,
  upsertSpeakingPart3,
  getSpeakingPart3,
  deleteSpeakingPart3,
  upsertSpeakingPart4,
  getSpeakingPart4,
  deleteSpeakingPart4,
  upsertSpeakingPart5,
  getSpeakingPart5,
  deleteSpeakingPart5,
} from "../controllers/speaking.controller";
import { upload } from "../middleware/upload.middleware";

const router = Router();

// ==================== MAIN EXAM ROUTES ====================

/**
 * @route   POST /api/speaking
 * @desc    Tạo đề thi Speaking mới
 * @access  Private (Admin only)
 */
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createSpeakingValidation,
  validate,
  createSpeaking,
);

/**
 * @route   GET /api/speaking
 * @desc    Lấy danh sách đề thi Speaking
 * @access  Private (Admin, Teacher, Student)
 */
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "TEACHER", "STUDENT"),
  getAllSpeaking,
);

/**
 * @route   GET /api/speaking/:id
 * @desc    Lấy chi tiết đề thi Speaking kèm tất cả parts
 * @access  Private (Admin, Teacher, Student)
 */
router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "TEACHER", "STUDENT"),
  getSpeakingById,
);

/**
 * @route   PUT /api/speaking/:id
 * @desc    Cập nhật đề thi Speaking
 * @access  Private (Admin only)
 */
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateSpeakingValidation,
  validate,
  updateSpeaking,
);

/**
 * @route   PATCH /api/speaking/:id/toggle-active
 * @desc    Toggle active status
 * @access  Private (Admin only)
 */
router.patch(
  "/:id/toggle-active",
  authenticate,
  authorize("ADMIN"),
  toggleActiveSpeaking,
);

/**
 * @route   DELETE /api/speaking/:id
 * @desc    Xóa đề thi Speaking
 * @access  Private (Admin only)
 */
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteSpeaking,
);

// ==================== PART 1 (Read a Text Aloud) ROUTES ====================

/**
 * @route   GET /api/speaking/:id/part1
 * @desc    Lấy tất cả Part 1 của đề thi
 * @access  Private (Admin, Teacher, Student)
 */
router.get(
  "/:id/part1",
  authenticate,
  authorize("ADMIN", "TEACHER", "STUDENT"),
  getSpeakingPart1,
);

/**
 * @route   PUT /api/speaking/:id/part1
 * @desc    Upsert Part 1 (Create or Update) - Read a Text Aloud
 * @access  Private (Admin only)
 * @note    Unified endpoint for both create and update operations
 */
router.put(
  "/:id/part1",
  authenticate,
  authorize("ADMIN"),
  speakingPart1Validation,
  validate,
  upsertSpeakingPart1,
);

/**
 * @route   DELETE /api/speaking/:id/part1
 * @desc    Xóa Part 1
 * @access  Private (Admin only)
 */
router.delete(
  "/:id/part1",
  authenticate,
  authorize("ADMIN"),
  deleteSpeakingPart1,
);

// ==================== PART 2 (Describe a Picture) ROUTES ====================

/**
 * @route   GET /api/speaking/:id/part2
 * @desc    Lấy tất cả Part 2 của đề thi
 * @access  Private (Admin, Teacher, Student)
 */
router.get(
  "/:id/part2",
  authenticate,
  authorize("ADMIN", "TEACHER", "STUDENT"),
  getSpeakingPart2,
);

/**
 * @route   PUT /api/speaking/:id/part2
 * @desc    Upsert Part 2 (Create or Update) - Describe a Picture
 * @access  Private (Admin only)
 * @note    Unified endpoint for both create and update operations
 */
router.put(
  "/:id/part2",
  authenticate,
  authorize("ADMIN"),
  upload.fields([
    { name: 'imageThree', maxCount: 1 },
    { name: 'imageFour', maxCount: 1 },
  ]),
  speakingPart2Validation,
  validate,
  upsertSpeakingPart2,
);

/**
 * @route   DELETE /api/speaking/:id/part2
 * @desc    Xóa Part 2
 * @access  Private (Admin only)
 */
router.delete(
  "/:id/part2",
  authenticate,
  authorize("ADMIN"),
  deleteSpeakingPart2,
);

// ==================== PART 3 (Respond to Questions) ROUTES ====================

/**
 * @route   GET /api/speaking/:id/part3
 * @desc    Lấy tất cả Part 3 của đề thi
 * @access  Private (Admin, Teacher, Student)
 */
router.get(
  "/:id/part3",
  authenticate,
  authorize("ADMIN", "TEACHER", "STUDENT"),
  getSpeakingPart3,
);

/**
 * @route   PUT /api/speaking/:id/part3
 * @desc    Upsert Part 3 (Create or Update) - Respond to Questions
 * @access  Private (Admin only)
 * @note    Unified endpoint for both create and update operations
 */
router.put(
  "/:id/part3",
  authenticate,
  authorize("ADMIN"),
  speakingPart3Validation,
  validate,
  upsertSpeakingPart3,
);

/**
 * @route   DELETE /api/speaking/:id/part3
 * @desc    Xóa Part 3
 * @access  Private (Admin only)
 */
router.delete(
  "/:id/part3",
  authenticate,
  authorize("ADMIN"),
  deleteSpeakingPart3,
);

// ==================== PART 4 (Respond to Questions using Information Provided) ROUTES ====================

/**
 * @route   GET /api/speaking/:id/part4
 * @desc    Lấy tất cả Part 4 của đề thi
 * @access  Private (Admin, Teacher, Student)
 */
router.get(
  "/:id/part4",
  authenticate,
  authorize("ADMIN", "TEACHER", "STUDENT"),
  getSpeakingPart4,
);

/**
 * @route   PUT /api/speaking/:id/part4
 * @desc    Upsert Part 4 (Create or Update) - Respond to Questions using Information Provided
 * @access  Private (Admin only)
 * @note    Unified endpoint for both create and update operations
 */
router.put(
  "/:id/part4",
  authenticate,
  authorize("ADMIN"),
  upload.fields([
    { name: 'image', maxCount: 1 },
  ]),
  speakingPart4Validation,
  validate,
  upsertSpeakingPart4,
);

/**
 * @route   DELETE /api/speaking/:id/part4
 * @desc    Xóa Part 4
 * @access  Private (Admin only)
 */
router.delete(
  "/:id/part4",
  authenticate,
  authorize("ADMIN"),
  deleteSpeakingPart4,
);

// ==================== PART 5 (Express an Opinion) ROUTES ====================

/**
 * @route   GET /api/speaking/:id/part5
 * @desc    Lấy tất cả Part 5 của đề thi
 * @access  Private (Admin, Teacher, Student)
 */
router.get(
  "/:id/part5",
  authenticate,
  authorize("ADMIN", "TEACHER", "STUDENT"),
  getSpeakingPart5,
);

/**
 * @route   PUT /api/speaking/:id/part5
 * @desc    Upsert Part 5 (Create or Update) - Express an Opinion
 * @access  Private (Admin only)
 * @note    Unified endpoint for both create and update operations
 */
router.put(
  "/:id/part5",
  authenticate,
  authorize("ADMIN"),
  speakingPart5Validation,
  validate,
  upsertSpeakingPart5,
);

/**
 * @route   DELETE /api/speaking/:id/part5
 * @desc    Xóa Part 5
 * @access  Private (Admin only)
 */
router.delete(
  "/:id/part5",
  authenticate,
  authorize("ADMIN"),
  deleteSpeakingPart5,
);

export default router;