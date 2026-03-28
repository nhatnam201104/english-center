import { Router } from "express";
import { validate } from "../middleware/validation.middleware";
import { validateAttemptAccess } from "../middleware/attemptAccess.middleware";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { uploadSpeakingExamAudio } from "../middleware/upload.middleware";
import {
  registerCandidateValidation,
  saveAnswerValidation,
  saveSpeakingAnswerValidation,
  saveWritingAnswerValidation,
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
  startSpeakingAttempt,
  loadSpeaking,
  saveSpeakingAnswer,
  submitSpeaking,
  loadWriting,
  saveWritingAnswer,
  submitWriting,
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

// ─── Speaking & Writing Exam Endpoints ───
router.post("/attempt/:accessToken/speaking/start", validateAttemptAccess, startSpeakingAttempt);
router.get("/attempt/:accessToken/speaking", validateAttemptAccess, loadSpeaking);
router.post(
  "/attempt/:accessToken/speaking/answer",
  validateAttemptAccess,
  uploadSpeakingExamAudio,
  saveSpeakingAnswerValidation,
  validate,
  saveSpeakingAnswer
);
router.post("/attempt/:accessToken/speaking/submit", validateAttemptAccess, submitSpeaking);
router.get("/attempt/:accessToken/writing", validateAttemptAccess, loadWriting);
router.put(
  "/attempt/:accessToken/writing/answer",
  validateAttemptAccess,
  saveWritingAnswerValidation,
  validate,
  saveWritingAnswer
);
router.post("/attempt/:accessToken/writing/submit", validateAttemptAccess, submitWriting);

// ─── Admin: Results ───
router.get("/results", authenticate, authorize("ADMIN"), getResults);
router.get("/results/cccd/:cccd", authenticate, authorize("ADMIN"), getResultByCccd);

export default router;
