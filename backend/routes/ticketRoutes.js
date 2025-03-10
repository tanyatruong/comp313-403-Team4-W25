import express from "express";
import * as ticketController from "../controllers/ticketController.js";

const router = express.Router();

// Get all tickets
router.get("/", ticketController.getAllTickets);

// Get ticket by ID
router.get("/:id", ticketController.getTicketById);

// Create new ticket
router.post("/", ticketController.createTicket);

// Update ticket
router.put("/:id", ticketController.updateTicket);

// Delete ticket
router.delete("/:id", ticketController.deleteTicket);

// Get tickets by user ID
router.get("/user/:userId", ticketController.getTicketsByUserId);

// Update ticket status
router.patch("/:id/status", ticketController.updateTicketStatus);

// Assign ticket to HR
router.patch("/:id/assign", ticketController.assignTicket);

export default router;
