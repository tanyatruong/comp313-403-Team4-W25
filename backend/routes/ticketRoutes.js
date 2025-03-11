import express from "express";
import {
	getAllTickets,
	getTicketById,
	createTicket,
	updateTicket,
	deleteTicket,
	getTicketsByUserId,
	assignTicket,
	updateTicketStatus,
} from "../controllers/ticketController.js";

const router = express.Router();

// Get all tickets
router.get("/", getAllTickets);

// Get ticket by ID
router.get("/:id", getTicketById);

// Create new ticket
router.post("/", createTicket);

// Update ticket
router.put("/:id", updateTicket);

// Delete ticket
router.delete("/:id", deleteTicket);

// Get tickets by user ID
router.get("/user/:userId", getTicketsByUserId);

// Assign ticket to HR
router.patch("/:id/assign", assignTicket);

// Add the missing route for updating status
router.patch("/:id/status", updateTicketStatus);

export default router;
