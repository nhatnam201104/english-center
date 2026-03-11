import { Router } from "express";
import { validate } from "../middleware/validation.middleware";
import { createPaymentUrlValidation } from "../validators/enrollment.validator";
import {
  createPaymentUrl,
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

export default router;
