import { Router } from "express";
import { validate } from "../middleware/validation.middleware";
import {
  validateTokenParam,
  checkParentQuery,
  createDraftValidation,
  createStudentDraftValidation,
  enrollmentStatusParam,
} from "../validators/enrollment.validator";
import {
  validateToken,
  checkParent,
  getAvailableSchedules,
  createDraft,
  getStudentAvailableSchedules,
  createStudentDraft,
  getEnrollmentStatus,
} from "../controllers/enrollment.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

// Public routes — secured by registration token, not JWT

// GET /api/enrollment/validate/:token
router.get("/validate/:token", validateTokenParam, validate, validateToken);

// GET /api/enrollment/check-parent?phone=xxx
router.get("/check-parent", checkParentQuery, validate, checkParent);

// GET /api/enrollment/schedules?admissionType=READING_LISTENING
router.get("/schedules", getAvailableSchedules);

// POST /api/enrollment/draft
router.post("/draft", createDraftValidation, validate, createDraft);

// GET /api/enrollment/student/schedules
router.get(
  "/student/schedules",
  authenticate,
  authorize("STUDENT"),
  getStudentAvailableSchedules,
);

// POST /api/enrollment/student/draft
router.post(
  "/student/draft",
  authenticate,
  authorize("STUDENT"),
  createStudentDraftValidation,
  validate,
  createStudentDraft,
);

// GET /api/enrollment/status/:txnRef
router.get("/status/:txnRef", enrollmentStatusParam, validate, getEnrollmentStatus);

export default router;
