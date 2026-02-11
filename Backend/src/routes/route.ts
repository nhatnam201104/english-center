import { Router } from "express";
import authRoute from "./auth.routes";
import userRoute from "./user.routes";
import teacherRoute from "./teacher.routes";
import studentRoute from "./student.routes";
import parentRoute from "./parent.routes";
import classroomRoute from "./classroom.routes";
import courseRoute from "./course.routes";
import courseTestRoute from "./coursetest.routes";
import scheduleRoute from "./schedule.routes";

const router = Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/teachers", teacherRoute);
router.use("/students", studentRoute);
router.use("/parents", parentRoute);
router.use("/classrooms", classroomRoute);
router.use("/courses", courseRoute);
router.use("/course-tests", courseTestRoute);
router.use("/schedule", scheduleRoute);

export default router;
