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

// New function to get all users (admin only)
export const getAllUsers = async (req, res) => {
	const startTime = Date.now();
	logger.request(req);

	try {
		const users = await User.find().select("-password");
		logger.info(
			`Admin ${req.user.employeeNumber} fetched all ${users.length} users`
		);
		logger.response(200, { count: users.length }, Date.now() - startTime);
		res.json(users);
	} catch (error) {
		logger.error("Failed to fetch users", error);
		const response = { error: "Failed to fetch users" };
		logger.response(500, response, Date.now() - startTime);
		res.status(500).json(response);
	}
};
