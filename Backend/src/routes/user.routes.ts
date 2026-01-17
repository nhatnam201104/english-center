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

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private (Admin only)
 */
// router.get("/:id", authenticate, authorize("ADMIN"), getUserByIdController);

// /**
//  * @route   PUT /api/users/:id
//  * @desc    Update user
//  * @access  Private (Admin only)
//  */
// // router.put('/:id', authenticate, authorize('ADMIN'), updateUserController);

// // /**
// //  * @route   DELETE /api/users/:id
// //  * @desc    Delete user
// //  * @access  Private (Admin only)
// //  */
// router.delete("/:id", authenticate, authorize("ADMIN"), deleteUserController);

export default router;
