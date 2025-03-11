import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { logger } from "../utils/logger.js";

// Verify JWT token and attach user to request
export const protect = async (req, res, next) => {
	const startTime = Date.now();
	logger.info(`Authenticating request to: ${req.originalUrl}`);

	try {
		let token;

		// Check if token exists in cookies or authorization header
		if (req.cookies && req.cookies.jwt) {
			token = req.cookies.jwt;
			logger.info("Auth token found in cookies");
		} else if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")
		) {
			token = req.headers.authorization.split(" ")[1];
			logger.info("Auth token found in authorization header");
		}

		if (!token) {
			logger.info("Authentication failed: No token provided");
			return res.status(401).json({ message: "Not authorized, no token" });
		}

		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		logger.info(`Token verified for user ID: ${decoded.userId}`);

		// Find user by id
		const user = await User.findById(decoded.userId);
		if (!user) {
			logger.info(
				`Authentication failed: User with ID ${decoded.userId} not found`
			);
			return res.status(401).json({ message: "User not found" });
		}

		// Attach user to request
		req.user = user;
		logger.info(
			`User authenticated: ${user._id} (${user.name}), Role: ${user.role}`
		);
		logger.info(`Auth process completed in ${Date.now() - startTime}ms`);
		next();
	} catch (error) {
		logger.error("Authentication error", error);
		res
			.status(401)
			.json({ message: "Not authorized, token failed", error: error.message });
	}
};

// Middleware to check if user is an employee or admin
export const employeeOnly = (req, res, next) => {
	logger.info(`Checking employee permission for user: ${req.user._id}`);

	if (req.user && (req.user.role === "Employee" || req.user.role === "Admin")) {
		logger.info(`${req.user.role} permission granted for employee action`);
		next();
	} else {
		logger.info(
			`Permission denied: User ${req.user._id} with role ${req.user.role} attempted to access employee-only resource`
		);
		res
			.status(403)
			.json({ message: "Access denied. Only employees can create tickets." });
	}
};

// Middleware to check if user is HR
export const hrOnly = (req, res, next) => {
	logger.info(`Checking HR permission for user: ${req.user._id}`);

	if (req.user && req.user.role === "HR") {
		logger.info("HR permission granted");
		next();
	} else {
		logger.info(
			`Permission denied: User ${req.user._id} with role ${req.user.role} attempted to access HR-only resource`
		);
		res.status(403).json({
			message: "Access denied. Only HR personnel can access this resource.",
		});
	}
};

// Middleware to check if user is an admin
export const adminOnly = (req, res, next) => {
	logger.info(`Checking admin permission for user: ${req.user._id}`);

	if (req.user && req.user.role === "Admin") {
		logger.info("Admin permission granted");
		next();
	} else {
		logger.info(
			`Permission denied: User ${req.user._id} with role ${req.user.role} attempted to access admin-only resource`
		);
		res.status(403).json({
			message: "Access denied. Only admins can access this resource.",
		});
	}
};

// Middleware to check if user is HR or admin
export const hrOrAdminOnly = (req, res, next) => {
	logger.info(`Checking HR/Admin permission for user: ${req.user._id}`);

	if (req.user && (req.user.role === "HR" || req.user.role === "Admin")) {
		logger.info(`${req.user.role} permission granted`);
		next();
	} else {
		logger.info(
			`Permission denied: User ${req.user._id} with role ${req.user.role} attempted to access HR/Admin-only resource`
		);
		res.status(403).json({
			message: "Access denied. Only HR or admin can access this resource.",
		});
	}
};
