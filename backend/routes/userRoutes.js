import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getHrUsers } from "../controllers/userController.js";

const router = express.Router();

// This is a minimal implementation - expand as needed
router.get("/", protect, (req, res) => {
	res.json({ message: "User routes implemented" });
});

// New route to get HR users
router.get("/hr", protect, getHrUsers);

export default router;
