import { Router } from "express";

import {
  registerValidation,
  loginValidation,
} from "../validators/auth.validator";
import { validate } from "../middleware/validation.middleware";
import { authenticate } from "../middleware/auth.middleware";
import { login, register } from "../controllers/auth.controller";

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", registerValidation, validate, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", loginValidation, validate, login);

// /**
//  * @route   GET /api/auth/profile
//  * @desc    Get current user profile
//  * @access  Private
//  */
// router.get("/profile", authenticate, getProfile);

export default router;
