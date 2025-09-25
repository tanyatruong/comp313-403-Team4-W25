import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";

export const login = async (req, res) => {
	const startTime = Date.now();
	logger.request(req);

	try {
		const { employeeNumber, password } = req.body;
		logger.info(`Login attempt for employee number: ${employeeNumber}`);

		// Check if employeeNumber and password are provided
		if (!employeeNumber || !password) {
			logger.info(
				`Login failed: Missing credentials - need employee number and password`
			);
			const response = {
				message: "Employee ID and password are required",
			};
			logger.response(400, response, Date.now() - startTime);
			return res.status(400).json(response);
		}

		// Find user by employeeNumber
		const user = await User.findOne({ employeeNumber });
		if (!user) {
			logger.info(
				`Login failed: No user found with employee number ${employeeNumber}`
			);
			const response = { message: "Invalid credentials" };
			logger.response(401, response, Date.now() - startTime);
			return res.status(401).json(response);
		}

		// Compare password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			logger.info(
				`Login failed: Invalid password for employee number ${employeeNumber}`
			);
			const response = { message: "Invalid credentials" };
			logger.response(401, response, Date.now() - startTime);
			return res.status(401).json(response);
		}

		// Generate JWT token
		const token = jwt.sign(
			{
				userId: user._id,
				role: user.role,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "24h" }
		);

		logger.info(`User ${user._id} (${user.name}) logged in successfully`);

		// Set token in HTTP-only cookie
		res.cookie("jwt", token, {
			httpOnly: true,
			secure: false,
			sameSite: "lax",
			maxAge: 24 * 60 * 60 * 1000, // 24 hours
		});

		// Send success response
		const response = {
			message: "Login successful",
			token: token,
			user: {
				_id: user._id,
				employeeId: user.employeeId,
				employeeNumber: user.employeeNumber,
				name: user.name,
				email: user.email,
				phone: user.phone,
				role: user.role
			},
		};

		logger.response(
			200,
			{ ...response, token: "[REDACTED]" },
			Date.now() - startTime
		);
		res.status(200).json(response);
	} catch (error) {
		logger.error("Error during login process", error);
		const response = {
			message: "Error logging in",
			error: error.message,
		};
		logger.response(500, response, Date.now() - startTime);
		res.status(500).json(response);
	}
};

export const logout = async (req, res) => {
	const startTime = Date.now();
	logger.request(req);

	try {
		// Clear the JWT cookie
		res.clearCookie("jwt", {
			httpOnly: true,
			secure: false,
			sameSite: "lax"
		});

		logger.info("User logged out successfully");

		const response = {
			message: "Logout successful"
		};

		logger.response(200, response, Date.now() - startTime);
		res.status(200).json(response);
	} catch (error) {
		logger.error("Error during logout process", error);
		const response = {
			message: "Error logging out",
			error: error.message,
		};
		logger.response(500, response, Date.now() - startTime);
		res.status(500).json(response);
	}
};
