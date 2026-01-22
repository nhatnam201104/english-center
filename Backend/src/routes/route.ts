import { Router } from "express";
import authRoute from "./auth.routes";
import userRoute from "./user.routes";
import teacherRoute from "./teacher.routes";
import studentRoute from "./student.routes";
import parentRoute from "./parent.routes";

const router = Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/teachers", teacherRoute);
router.use("/students", studentRoute);
router.use("/parents", parentRoute);

export default router;
