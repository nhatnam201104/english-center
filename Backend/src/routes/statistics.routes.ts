import { Router } from "express";
import statisticsController from "../controllers/statistics.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// All statistics routes require authentication
router.use(authenticate);

// GET /api/statistics/course-registrations
router.get("/course-registrations", statisticsController.getCourseRegistrationStats);

// GET /api/statistics/revenue
router.get("/revenue", statisticsController.getRevenueStats);

// GET /api/statistics/courses
router.get("/courses", statisticsController.getAllCoursesForFilter);

// GET /api/statistics/admission-students
router.get("/admission-students", statisticsController.getAdmissionStudents);

// GET /api/statistics/admission-students/:id
router.get("/admission-students/:id", statisticsController.getAdmissionStudentDetail);

export default router;
