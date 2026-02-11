import { Router } from "express";
import { createScheduleValidation } from "../validators/schedule.validator";
import { validate } from "../middleware/validation.middleware";
import { createSchedule, getActiveSchedulesByCourseId, getAllSchedules, getScheduleById, getUpcomingSchedules } from "../controllers/schedule.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { registerSchedule } from "../controllers/scheduleRegistration.controller";

const router = Router();

/**
 * @route   POST /api/schedules
 * @desc    Create new schedule
 * @access  Admin
 */
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createScheduleValidation,
  validate,
  createSchedule,
);

/**
 * @route   POST /api/schedules/register
 * @desc    Register schedule for STUDENT
 * @access  All
 */
router.post(
  "/register",
  validate,
  registerSchedule
);


/**
 * @route   POST /api/schedules/upcoming
 * @desc    Get 3 schedule
 * @access  All
 */
router.get("/upcoming", validate, getUpcomingSchedules);

/**
 * @route   POST /api/schedule/active-schedule
 * @desc    Get all schedule active
 * @access  All
 */
router.get(
  "/active-schedule",
  getActiveSchedulesByCourseId
);

/**
 * @route   POST /api/schedule
 * @desc    Get all schedule
 * @access  ADMIN
 */
router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  getAllSchedules
);

/**
 * @route   POST /api/schedule
 * @desc    Get all schedule
 * @access  ADMIN
 */
router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  getAllSchedules
);

/**
 * @route   GET /api/schedule/:id
 * @desc    Get schedule by id
 * @access  ADMIN
 */
router.get(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  getScheduleById
);





export default router;
