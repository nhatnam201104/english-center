import path from "path";
import fs from "fs";
import multer from "multer";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    // get folder to save file
    // vd: baseurl : /api/auth
    // get auth to set name folder for save image
    // console.log(req.baseUrl.split('/')[2]);
    const folder = req.baseUrl.split("/")[2] ?? "default";
    const uploadPath = path.join(__dirname, "..", "uploads", folder);
    // check if folder not exist then create folder
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    // This part defines where the files need to be saved
    cb(null, uploadPath);
  },
  filename: (req, _file, cb) => {
    const folder = req.baseUrl.split("/")[2] ?? "default";
    // This part sets the file name of the file
    cb(null, folder + "-" + Date.now() + ".jpg");
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
