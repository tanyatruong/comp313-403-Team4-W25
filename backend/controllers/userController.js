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
