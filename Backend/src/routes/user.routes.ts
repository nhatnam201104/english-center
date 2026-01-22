import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { getAllUsersController } from "../controllers/user.controller";

const router = Router();

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private (Admin only)
 */
router.get("/", authenticate, authorize("ADMIN"), getAllUsersController);

;

export default router;
