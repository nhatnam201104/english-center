import { Router } from "express";
import { validate } from "../middleware/validation.middleware";
import { validateAttemptAccess } from "../middleware/attemptAccess.middleware";
import { authenticate, authorize } from "../middleware/auth.middleware";
import {
  registerCandidateValidation,
  saveAnswerValidation,
} from "../validators/entranceExam.validator";
import {
  getAllEntranceExams,
  registerCandidate,
  startAttempt,
  getAttemptState,
  loadListening,
  loadReading,
  saveAnswer,
  submitListening,
  submitReading,
  cancelAttempt,
  getResults,
  getResultByCccd,
} from "../controllers/entranceExam.controller";

const router = Router();

// ─── Admin: Entrance Exam List ───
router.get("/admin", authenticate, authorize("ADMIN"), getAllEntranceExams);

// ─── Public: Registration ───
router.post(
  "/register",
  registerCandidateValidation,
  validate,
  registerCandidate,
);

router.post("/register/:admissionId/start", startAttempt);

// ─── Attempt Session (secured by accessToken) ───
router.get("/attempt/:accessToken", validateAttemptAccess, getAttemptState);
router.get("/attempt/:accessToken/listening", validateAttemptAccess, loadListening);
router.get("/attempt/:accessToken/reading", validateAttemptAccess, loadReading);
router.put(
  "/attempt/:accessToken/answer",
  validateAttemptAccess,
  saveAnswerValidation,
  validate,
  saveAnswer,
);
router.post("/attempt/:accessToken/listening/submit", validateAttemptAccess, submitListening);
router.post("/attempt/:accessToken/reading/submit", validateAttemptAccess, submitReading);
router.post("/attempt/:accessToken/cancel", validateAttemptAccess, cancelAttempt);

// ─── Admin: Results ───
router.get("/results", authenticate, authorize("ADMIN"), getResults);
router.get("/results/cccd/:cccd", authenticate, authorize("ADMIN"), getResultByCccd);

export default router;
