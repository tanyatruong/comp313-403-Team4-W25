import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import ticketRoutes from "./routes/ticketRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { logger } from "./utils/logger.js";

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
	cors({
		origin: "http://localhost:4200",
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);
app.use(express.json());
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
	logger.info(`${req.method} ${req.originalUrl}`);
	next();
});

// Connect to MongoDB
mongoose
	.connect(process.env.DB_URI)
	.then(() => {
		logger.info("MongoDB connected successfully");
	})
	.catch((err) => {
		logger.error("MongoDB connection error", err);
	});

// Use routes
app.use("/api/tickets", ticketRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Basic route for testing
app.get("/", (req, res) => {
	logger.info("Base route accessed");
	res.send("HR Ticketing System API is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
	logger.error("Unhandled error", err);
	res.status(500).json({
		message: "Internal server error",
		error:
			process.env.NODE_ENV === "production" ? "An error occurred" : err.message,
	});
});

app.listen(PORT, () => {
	logger.info(`Server running on port ${PORT}`);
});
