import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
	getHrUsers,
	getCurrentUser,
	getAllUsers,
} from "../controllers/userController.js";

const router = express.Router();

// Get current user profile
router.get("/me", protect, getCurrentUser);

// Get all users (admin only)
router.get("/all", protect, adminOnly, getAllUsers);

// New route to get HR users
router.get("/hr", protect, getHrUsers);

export default router;
