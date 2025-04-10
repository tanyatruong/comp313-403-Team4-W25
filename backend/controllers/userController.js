import User from "../models/User.js";
import { logger } from "../utils/logger.js";
import {ExpansionCase} from "@angular/compiler";
//import Ticket from "../models/Ticket.js";

export const getUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		logger.info(`Fetched user with ID: ${req.params.id}`);
		res.json(user);
	} catch (error) {
		logger.error(`Error fetching user with ID: ${req.params.id}`, error);
		const response = {
			message: "Error fetching user",
			error: error.message,
		};
		logger.response(500, response);
		res.status(500).json(response);
	}
};

// Update user
export const updateUser = async (req, res) => {
	const startTime = Date.now();
	logger.request(req);
	logger.info(`Updating user with ID: ${req.params.id}`);

	try {

		//NOTE: code to test error throwing case
		// throw new Error("TEST ERROR");

		const { name, email, phone } =
			req.body;

		const user = await User.findByIdAndUpdate(
			req.params.id,
			{
				...(name && { name }),
				...(email && { email }),
				...(phone && { phone }),
				updatedAt: Date.now(),
			},
			{ new: true, runValidators: true }
		);

		if (!user) {
			logger.info(`User with ID ${req.params.id} not found for update`);
			return res.status(404).json({ message: "User not found" });
		}

		logger.info(`User updated successfully with ID: ${user._id}`);
		res.status(200).json(user);
	} catch (error) {
		logger.error("Error updating user", error);
		res.status(500).json({
			message: "Error updating user",
			error: error.message,
		});
	}
};

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
