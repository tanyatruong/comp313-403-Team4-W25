import User from "../models/User.js";
import { logger } from "../utils/logger.js";

export const getHrUsers = async (req, res) => {
	try {
		const hrUsers = await User.find({ role: "HR" });
		logger.info(`Fetched ${hrUsers.length} HR users`);
		res.json(hrUsers);
	} catch (error) {
		logger.error("Failed to fetch HR users", error);
		res.status(500).json({ error: "Failed to fetch HR users" });
	}
};

export const getCurrentUser = async (req, res) => {
	try {
		// req.user is set by the auth middleware
		const user = await User.findById(req.user._id).select("-password");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(user);
	} catch (error) {
		logger.error("Failed to fetch current user", error);
		res.status(500).json({ error: "Failed to fetch current user" });
	}
};
