import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// This is a minimal implementation - expand as needed
router.get("/", protect, (req, res) => {
	res.json({ message: "User routes implemented" });
});

export default router;
