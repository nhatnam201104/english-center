// middlewares/upload.middleware.ts
import multer from "multer";
import {
  storage,
  fileFilter,
  courseTestFileFilter,
} from "../lib/multer.storage";

// Giới hạn file size: 5MB cho images
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Upload cho CourseTest - hỗ trợ audio và documents
// Giới hạn file size: 50MB cho audio files
export const uploadCourseTest = multer({
  storage,
  fileFilter: courseTestFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

// Upload cho CourseTest với multiple files (fileTest và audioTest)
export const uploadCourseTestWithAudio = multer({
  storage,
  fileFilter: courseTestFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});
