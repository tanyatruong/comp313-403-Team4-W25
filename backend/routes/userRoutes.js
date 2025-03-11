import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getHrUsers, getCurrentUser } from "../controllers/userController.js";

const router = express.Router();

// Get current user profile
router.get("/me", protect, getCurrentUser);

// This is a minimal implementation - expand as needed
router.get("/", protect, (req, res) => {
	res.json({ message: "User routes implemented" });
});

// New route to get HR users
router.get("/hr", protect, getHrUsers);

export default router;
