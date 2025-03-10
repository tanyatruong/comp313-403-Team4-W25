import express from "express";
import * as ticketController from "../controllers/ticketController.js";
import { employeeOnly, protect } from "../middleware/authMiddleware.js";
import { hrOrAdminOnly } from "../middleware/authMiddleware.js";
import { logger } from "../utils/logger.js";
import Ticket from "../models/Ticket.js";

const router = express.Router();

// Get all tickets
router.get("/", ticketController.getAllTickets);

// Get ticket by ID
router.get("/:id", ticketController.getTicketById);

// Create new ticket
router.post("/", protect, employeeOnly, ticketController.createTicket);

// Update ticket
router.put("/:id", ticketController.updateTicket);

// Delete ticket
router.delete("/:id", ticketController.deleteTicket);

// Get tickets by user ID
router.get("/user/:userId", ticketController.getTicketsByUserId);

// Update ticket status - use a different update pattern
router.patch("/:id/status", protect, hrOrAdminOnly, async (req, res) => {
	try {
		let { status } = req.body;

		logger.info(`Status update request with status: "${status}"`);

		// Use updateOne instead of findByIdAndUpdate for more direct update
		const result = await Ticket.updateOne(
			{ _id: req.params.id },
			{ $set: { status: status, updatedAt: Date.now() } }
		);

		if (result.modifiedCount === 0) {
			logger.error("Status update failed - document not modified");
			return res.status(400).json({ message: "Status update failed" });
		}

		// Fetch the updated document separately
		const ticket = await Ticket.findById(req.params.id);
		logger.info(`Updated ticket status is now: ${ticket.status}`);

		res.json(ticket);
	} catch (error) {
		logger.error(`Status update error: ${error.message}`);
		res
			.status(500)
			.json({ message: "Error updating status", error: error.message });
	}
});

// Assign ticket to HR
router.patch("/:id/assign", ticketController.assignTicket);

export default router;
