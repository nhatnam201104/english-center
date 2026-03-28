// middlewares/upload.middleware.ts
import multer from "multer";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import {
  storage,
  fileFilter,
  courseTestFileFilter,
  entranceExamLRFileFilter,
  speakingAudioFileFilter,
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

// Upload cho Entrance Exam LR - hỗ trợ cả images và audio
// Giới hạn file size: 50MB
export const uploadEntranceExamLR = multer({
  storage,
  fileFilter: entranceExamLRFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

// Upload cho Entrance Exam Speaking - chỉ hỗ trợ audio
// Giới hạn file size: 10MB
export const uploadSpeakingAudio = multer({
  storage,
  fileFilter: speakingAudioFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Upload cho Entrance Exam Speaking Exam - lưu vào uploads/speaking-audio/
// Giới hạn file size: 10MB
const speakingExamStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads", "speaking-audio");
    // Create folder if not exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

export const uploadSpeakingExamAudio = multer({
  storage: speakingExamStorage,
  fileFilter: speakingAudioFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
}).single("audio");
/**
 * Middleware to merge uploaded files into request body
 * This must run AFTER multer but BEFORE validation
 * 
 * Extracts filenames from req.files and assigns them to req.body fields
 * so validation middleware can see the values
 */
export const mergeFilesToBody = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (req.files) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    // For each uploaded file field, assign filename to body
    for (const [fieldname, fileArray] of Object.entries(files)) {
      if (fileArray && fileArray.length > 0) {
        // Assign the filename (not the full path) to body
        req.body[fieldname] = fileArray[0].filename;
      }
    }
  }
  
  next();
};
