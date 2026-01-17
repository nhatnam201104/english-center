// middlewares/upload.middleware.ts
import multer from "multer";
import { storage, fileFilter } from "../lib/multer.storage";

export const upload = multer({ storage, fileFilter });
