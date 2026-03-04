import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { uploadEntranceExamLR } from "../middleware/upload.middleware";
import {
  createListeningValidation,
  createReadingValidation,
  updateLRValidation,
  answerKeyValidation,
  createPartOneQuestionValidation,
  createPartTwoQuestionValidation,
  createPartFiveQuestionValidation,
  createGroupValidation,
  updatePartDirectionValidation,
} from "../validators/entranceExamLR.validator";
import {
  // Listening
  createListening,
  getAllListening,
  getListeningById,
  updateListening,
  deleteListening,
  activateListening,
  getListeningParts,
  getListeningAnswerKey,
  saveListeningAnswerKey,
  // Reading
  createReading,
  getAllReading,
  getReadingById,
  updateReading,
  deleteReading,
  activateReading,
  getReadingParts,
  getReadingAnswerKey,
  saveReadingAnswerKey,
  // Parts
  updatePartDirection,
  addPartOneQuestion,
  addPartTwoQuestion,
  addPartThreeGroup,
  addPartFourGroup,
  addPartFiveQuestion,
  addPartSixGroup,
  addPartSevenGroup,
  // Delete
  deletePartOneQuestion,
  deletePartTwoQuestion,
  deletePartThreeGroup,
  deletePartFourGroup,
  deletePartFiveQuestion,
  deletePartSixGroup,
  deletePartSevenGroup,
} from "../controllers/entranceExamLR.controller";

const router = Router();

/* ══════════════════════════════════════════════════════════════
   LISTENING (/api/entrance-exam-lr/listening)
   ══════════════════════════════════════════════════════════════ */

router.post(
  "/listening",
  authenticate,
  authorize("ADMIN"),
  createListeningValidation,
  validate,
  createListening,
);

router.get(
  "/listening",
  authenticate,
  authorize("ADMIN"),
  getAllListening,
);

router.get(
  "/listening/:id",
  authenticate,
  authorize("ADMIN"),
  getListeningById,
);

router.put(
  "/listening/:id",
  authenticate,
  authorize("ADMIN"),
  updateLRValidation,
  validate,
  updateListening,
);

router.delete(
  "/listening/:id",
  authenticate,
  authorize("ADMIN"),
  deleteListening,
);

router.patch(
  "/listening/:id/activate",
  authenticate,
  authorize("ADMIN"),
  activateListening,
);

/* ── Listening parts detail ── */

router.get(
  "/listening/:id/parts",
  authenticate,
  authorize("ADMIN"),
  getListeningParts,
);

/* ── Listening answer key ── */

router.get(
  "/listening/:id/answer-key",
  authenticate,
  authorize("ADMIN"),
  getListeningAnswerKey,
);

router.put(
  "/listening/:id/answer-key",
  authenticate,
  authorize("ADMIN"),
  answerKeyValidation,
  validate,
  saveListeningAnswerKey,
);

/* ══════════════════════════════════════════════════════════════
   READING (/api/entrance-exam-lr/reading)
   ══════════════════════════════════════════════════════════════ */

router.post(
  "/reading",
  authenticate,
  authorize("ADMIN"),
  createReadingValidation,
  validate,
  createReading,
);

router.get(
  "/reading",
  authenticate,
  authorize("ADMIN"),
  getAllReading,
);

router.get(
  "/reading/:id",
  authenticate,
  authorize("ADMIN"),
  getReadingById,
);

router.put(
  "/reading/:id",
  authenticate,
  authorize("ADMIN"),
  updateLRValidation,
  validate,
  updateReading,
);

router.delete(
  "/reading/:id",
  authenticate,
  authorize("ADMIN"),
  deleteReading,
);

router.patch(
  "/reading/:id/activate",
  authenticate,
  authorize("ADMIN"),
  activateReading,
);

/* ── Reading parts detail ── */

router.get(
  "/reading/:id/parts",
  authenticate,
  authorize("ADMIN"),
  getReadingParts,
);

/* ── Reading answer key ── */

router.get(
  "/reading/:id/answer-key",
  authenticate,
  authorize("ADMIN"),
  getReadingAnswerKey,
);

router.put(
  "/reading/:id/answer-key",
  authenticate,
  authorize("ADMIN"),
  answerKeyValidation,
  validate,
  saveReadingAnswerKey,
);

/* ══════════════════════════════════════════════════════════════
   PARTS – Update direction (shared for all parts)
   ══════════════════════════════════════════════════════════════ */

router.patch(
  "/parts/:partNo/:partId/direction",
  authenticate,
  authorize("ADMIN"),
  updatePartDirectionValidation,
  validate,
  updatePartDirection,
);

/* ══════════════════════════════════════════════════════════════
   PARTS – Add questions / groups
   ══════════════════════════════════════════════════════════════ */

// Part 1: audio + image upload
router.post(
  "/parts/1/:partId/questions",
  authenticate,
  authorize("ADMIN"),
  uploadEntranceExamLR.fields([
    { name: "audio", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  createPartOneQuestionValidation,
  validate,
  addPartOneQuestion,
);

// Part 2: audio upload only
router.post(
  "/parts/2/:partId/questions",
  authenticate,
  authorize("ADMIN"),
  uploadEntranceExamLR.fields([{ name: "audio", maxCount: 1 }]),
  createPartTwoQuestionValidation,
  validate,
  addPartTwoQuestion,
);

// Part 3: group with audio + optional image
router.post(
  "/parts/3/:partId/groups",
  authenticate,
  authorize("ADMIN"),
  uploadEntranceExamLR.fields([
    { name: "audio", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  createGroupValidation,
  validate,
  addPartThreeGroup,
);

// Part 4: group with audio + optional image
router.post(
  "/parts/4/:partId/groups",
  authenticate,
  authorize("ADMIN"),
  uploadEntranceExamLR.fields([
    { name: "audio", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  createGroupValidation,
  validate,
  addPartFourGroup,
);

// Part 5: no file upload (just JSON body)
router.post(
  "/parts/5/:partId/questions",
  authenticate,
  authorize("ADMIN"),
  createPartFiveQuestionValidation,
  validate,
  addPartFiveQuestion,
);

// Part 6: group with optional image
router.post(
  "/parts/6/:partId/groups",
  authenticate,
  authorize("ADMIN"),
  uploadEntranceExamLR.fields([{ name: "image", maxCount: 1 }]),
  createGroupValidation,
  validate,
  addPartSixGroup,
);

// Part 7: group with optional image
router.post(
  "/parts/7/:partId/groups",
  authenticate,
  authorize("ADMIN"),
  uploadEntranceExamLR.fields([{ name: "image", maxCount: 1 }]),
  createGroupValidation,
  validate,
  addPartSevenGroup,
);

/* ══════════════════════════════════════════════════════════════
   PARTS – Delete questions / groups
   ══════════════════════════════════════════════════════════════ */

router.delete(
  "/parts/1/questions/:questionId",
  authenticate,
  authorize("ADMIN"),
  deletePartOneQuestion,
);

router.delete(
  "/parts/2/questions/:questionId",
  authenticate,
  authorize("ADMIN"),
  deletePartTwoQuestion,
);

router.delete(
  "/parts/3/groups/:groupId",
  authenticate,
  authorize("ADMIN"),
  deletePartThreeGroup,
);

router.delete(
  "/parts/4/groups/:groupId",
  authenticate,
  authorize("ADMIN"),
  deletePartFourGroup,
);

router.delete(
  "/parts/5/questions/:questionId",
  authenticate,
  authorize("ADMIN"),
  deletePartFiveQuestion,
);

router.delete(
  "/parts/6/groups/:groupId",
  authenticate,
  authorize("ADMIN"),
  deletePartSixGroup,
);

router.delete(
  "/parts/7/groups/:groupId",
  authenticate,
  authorize("ADMIN"),
  deletePartSevenGroup,
);

export default router;
