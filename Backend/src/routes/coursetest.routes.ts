import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";

import {
  createCourseTest,
  getAllCourseTests,
  getCourseTestsByCourseId,
  getCourseTestById,
  updateCourseTest,
  updateCourseTestFile,
  updateCourseTestAudio,
  deleteCourseTest,
} from "../controllers/coursetest.controller";
import {
  uploadCourseTest,
  uploadCourseTestWithAudio,
} from "../middleware/upload.middleware";
import {
  createCourseTestValidation,
  updateCourseTestValidation,
} from "../validators/coursetest.validator";

const router = Router();

/**
 * @route   POST /api/course-tests
 * @desc    Tạo bài kiểm tra mới với file (file bắt buộc)
 * @access  Private (Admin only)
 */
router.post(
  "/",
  authenticate,
  authorize("ADMIN", "TEACHER"),
  uploadCourseTestWithAudio.fields([
    { name: "fileTest", maxCount: 1 },
    { name: "audioTest", maxCount: 1 },
  ]),
  createCourseTestValidation,
  validate,
  createCourseTest,
);

/**
 * @route   GET /api/course-tests
 * @desc    Lấy danh sách bài kiểm tra
 * @access  Private (Admin, Teacher, Student)
 */
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "TEACHER", "STUDENT"),
  getAllCourseTests,
);

/**
 * @route   GET /api/course-tests/course/:courseId
 * @desc    Lấy danh sách bài kiểm tra theo courseId
 * @access  Private (Admin, Teacher, Student)
 */
router.get(
  "/course/:courseId",
  authenticate,
  authorize("ADMIN", "TEACHER", "STUDENT", "PARENT"),
  getCourseTestsByCourseId,
);

/**
 * @route   GET /api/course-tests/:id
 * @desc    Lấy thông tin bài kiểm tra theo ID
 * @access  Private (Admin, Teacher, Student)
 */
router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "TEACHER", "STUDENT"),
  getCourseTestById,
);

/**
 * @route   PUT /api/course-tests/:id
 * @desc    Cập nhật thông tin bài kiểm tra (metadata, không bao gồm file)
 * @access  Private (Admin only)
 */
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateCourseTestValidation,
  validate,
  updateCourseTest,
);

/**
 * @route   PATCH /api/course-tests/:id/file
 * @desc    Cập nhật file của bài kiểm tra
 * @access  Private (Admin only)
 */
router.patch(
  "/:id/file",
  authenticate,
  authorize("ADMIN"),
  uploadCourseTest.single("fileTest"),
  updateCourseTestFile,
);

/**
 * @route   PATCH /api/course-tests/:id/audio
 * @desc    Cập nhật audio của bài kiểm tra
 * @access  Private (Admin only)
 */
router.patch(
  "/:id/audio",
  authenticate,
  authorize("ADMIN"),
  uploadCourseTest.single("audioTest"),
  updateCourseTestAudio,
);

/**
 * @route   DELETE /api/course-tests/:id
 * @desc    Xóa bài kiểm tra (kèm file và các score liên quan)
 * @access  Private (Admin only)
 */
router.delete("/:id", authenticate, authorize("ADMIN"), deleteCourseTest);

export default router;
