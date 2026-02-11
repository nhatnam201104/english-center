import path from "path";
import fs from "fs";
import multer from "multer";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const folder = req.baseUrl.split("/")[2] ?? "default";
    // Đường dẫn tương đối từ compiled code (dist/lib) về uploads/folder
    const uploadPath = path.join(process.cwd(), "uploads", folder);
    // Create folder if not exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    // This part defines where the files need to be saved
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Lấy extension từ file gốc
    const ext = path.extname(file.originalname);
    // This part sets the file name of the file without folder prefix
    cb(null, Date.now() + ext);
  },
});

const fileFilter = function (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  // Accept only images
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"));
  }
  cb(null, true);
};

const courseTestFileFilter = function (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  // Accept audio files and documents (mp3, wav, pdf, doc, docx, etc.)
  const allowedExtensions = [
    ".mp3",
    ".wav",
    ".ogg",
    ".m4a",
    ".pdf",
    ".doc",
    ".docx",
    ".txt",
  ];
  if (
    !allowedExtensions.some((ext) =>
      file.originalname.toLowerCase().endsWith(ext),
    )
  ) {
    return cb(
      new Error(
        "Only audio files (mp3, wav, ogg, m4a) and documents (pdf, doc, docx, txt) are allowed!",
      ),
    );
  }
  cb(null, true);
};

export { fileFilter, courseTestFileFilter, storage };
