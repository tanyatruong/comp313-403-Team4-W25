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

// Refactor role-based middleware checks
const checkRole = (roles) => (req, res, next) => {
	logger.info(`Checking roles ${roles.join(", ")} for user: ${req.user._id}`);

	if (req.user && roles.includes(req.user.role)) {
		logger.info(`${req.user.role} permission granted`);
		next();
	} else {
		logger.info(
			`Permission denied: User ${req.user._id} with role ${req.user.role} attempted to access restricted resource`
		);
		res.status(403).json({
			message: `Access denied. Only ${roles.join(
				" or "
			)} can access this resource.`,
		});
	}
};

export const employeeOnly = checkRole(["Employee", "Admin"]);
export const adminOnly = checkRole(["Admin"]);
export const hrOrAdminOnly = checkRole(["HR", "Admin"]);
