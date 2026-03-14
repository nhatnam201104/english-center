import { Router } from "express";
import { getStudentGrades } from "../controllers/grade.controller";
import { authenticateStudent } from "../middleware/studentAuth.middleware";

const router = Router();

router.get("/", authenticateStudent, getStudentGrades);

export default router;