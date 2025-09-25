import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getUser, updateUser, getHrUsers } from "../controllers/userController.js";

const router = express.Router();

// This is a minimal implementation - expand as needed
// router.get("/", protect, (req, res) => {
// 	res.json({ message: "User routes implemented" });
// });

// New route to get HR users (must come before /:id)
router.get("/hr", protect, getHrUsers);

// Get user by ID
router.get("/:id", protect, getUser);
// Update user
router.put("/:id", updateUser);

export default router;
