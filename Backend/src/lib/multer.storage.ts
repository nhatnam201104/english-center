import path from "path";
import fs from "fs";
import multer from "multer";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    // get folder to save file
    // vd: baseurl : /api/auth
    // get auth to set name folder for save image
    const folder = req.baseUrl.split("/")[2] ?? "default";
    // Đường dẫn tương đối từ compiled code (dist/lib) về uploads
    const uploadPath = path.join(process.cwd(), "uploads", folder);
    // check if folder not exist then create folder
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    // This part defines where the files need to be saved
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const folder = req.baseUrl.split("/")[2] ?? "default";
    // Lấy extension từ file gốc
    const ext = path.extname(file.originalname);
    // This part sets the file name of the file
    cb(null, folder + "-" + Date.now() + ext);
  },
});

const fileFilter = function (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  // Accept only images
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Only image files are allowed!"));
  }
  cb(null, true);
};
export { fileFilter, storage };
