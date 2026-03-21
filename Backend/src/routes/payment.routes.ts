import { Router } from "express";
import { validate } from "../middleware/validation.middleware";
import { createPaymentUrlValidation } from "../validators/enrollment.validator";
import { authenticate, authorize } from "../middleware/auth.middleware";
import {
  createPaymentUrl,
  getPaymentHistory,
  getPaymentInvoice,
  ipnHandler,
  returnHandler,
} from "../controllers/payment.controller";

const router = Router();

// POST /api/payment/create-url — Create VNPay payment URL
router.post("/create-url", createPaymentUrlValidation, validate, createPaymentUrl);

// GET /api/payment/ipn — VNPay IPN callback (server-to-server)
router.get("/ipn", ipnHandler);

// GET /api/payment/return — VNPay return URL (browser redirect)
router.get("/return", returnHandler);

// GET /api/payment/history — Payment history for current user
router.get(
  "/history",
  authenticate,
  authorize("ADMIN", "STUDENT", "PARENT"),
  getPaymentHistory
);

// GET /api/payment/invoice/:txnRef — Payment invoice detail
router.get(
  "/invoice/:txnRef",
  authenticate,
  authorize("ADMIN", "STUDENT", "PARENT"),
  getPaymentInvoice
);

export default router;
