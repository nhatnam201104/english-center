// middlewares/upload.middleware.ts
import multer from "multer";
import { storage, fileFilter } from "../lib/multer.storage";

// Giới hạn file size: 5MB
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
