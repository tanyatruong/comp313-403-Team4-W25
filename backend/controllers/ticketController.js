import Ticket from "../models/Ticket.js";
import { logger } from "../utils/logger.js";

// Utility function for logging
const logAndRespond = (logger, res, statusCode, message, data, startTime) => {
	const response = { message, ...data };
	logger.response(statusCode, response, Date.now() - startTime);
	res.status(statusCode).json(response);
};

export const createTicket = async (req, res) => {
	const startTime = Date.now();
	logger.request(req);

	try {
		const { title, description, assignedTo, status, priority, category } =
			req.body;
		logger.info(
			`User ${req.user._id} attempting to create a new ticket: ${title}`
		);

		// Create a new ticket using the authenticated employee's information
		const newTicket = new Ticket({
			title,
			description,
			employeeNumber: req.user.employeeNumber,
			assignedTo,
			status,
			priority,
			category,
		});

		// Save the ticket to the database
		await newTicket.save();
		logger.info(`Ticket created successfully with ID: ${newTicket._id}`);

		logAndRespond(
			logger,
			res,
			201,
			"Ticket created successfully",
			{ ticket: newTicket },
			startTime
		);
	} catch (error) {
		logger.error("Error creating ticket", error);
		logAndRespond(
			logger,
			res,
			500,
			"Error creating ticket",
			{ error: error.message },
			startTime
		);
	}
};

// Get all tickets
export const getAllTickets = async (req, res) => {
	const startTime = Date.now();
	logger.request(req);
	logger.info("Fetching all tickets");

	try {
		const tickets = await Ticket.find().sort({ createdAt: -1 });
		logger.info(`Retrieved ${tickets.length} tickets`);

		logger.response(200, { count: tickets.length }, Date.now() - startTime);
		res.status(200).json(tickets);
	} catch (error) {
		logger.error("Error fetching tickets", error);
		const response = {
			message: "Error fetching tickets",
			error: error.message,
		};
		logger.response(500, response, Date.now() - startTime);
		res.status(500).json(response);
	}
};

// Get ticket by ID
export const getTicketById = async (req, res) => {
	const startTime = Date.now();
	logger.request(req);
	logger.info(`Fetching ticket with ID: ${req.params.id}`);

	try {
		const ticket = await Ticket.findById(req.params.id);
		if (!ticket) {
			logger.info(`Ticket with ID ${req.params.id} not found`);
			const response = { message: "Ticket not found" };
			logger.response(404, response, Date.now() - startTime);
			return res.status(404).json(response);
		}

		logger.info(`Retrieved ticket: ${ticket._id}`);
		logger.response(200, { ticketId: ticket._id }, Date.now() - startTime);
		res.status(200).json(ticket);
	} catch (error) {
		logger.error(`Error fetching ticket with ID: ${req.params.id}`, error);
		const response = {
			message: "Error fetching ticket",
			error: error.message,
		};
		logger.response(500, response, Date.now() - startTime);
		res.status(500).json(response);
	}
};

// Get tickets by user ID
export const getTicketsByUserId = async (req, res) => {
	const startTime = Date.now();
	logger.request(req);
	logger.info(`Fetching tickets for user: ${req.params.userId}`);

	try {
		const tickets = await Ticket.find({
			employeeNumber: req.params.userId,
		}).sort({ createdAt: -1 });

		logger.info(
			`Retrieved ${tickets.length} tickets for user ${req.params.userId}`
		);
		logger.response(200, { count: tickets.length }, Date.now() - startTime);
		res.status(200).json(tickets);
	} catch (error) {
		logger.error(
			`Error fetching user tickets for user: ${req.params.userId}`,
			error
		);
		const response = {
			message: "Error fetching user tickets",
			error: error.message,
		};
		logger.response(500, response, Date.now() - startTime);
		res.status(500).json(response);
	}
};

// Update ticket
export const updateTicket = async (req, res) => {
	const startTime = Date.now();
	logger.request(req);
	logger.info(`Updating ticket with ID: ${req.params.id}`);

	try {
		const { title, description, priority, category, status, assignedTo } =
			req.body;

		const ticket = await Ticket.findByIdAndUpdate(
			req.params.id,
			{
				...(title && { title }),
				...(description && { description }),
				...(priority && { priority }),
				...(category && { category }),
				...(status && { status }),
				...(assignedTo && { assignedTo }),
				updatedAt: Date.now(),
			},
			{ new: true, runValidators: true }
		);

		if (!ticket) {
			logger.info(`Ticket with ID ${req.params.id} not found for update`);
			return res.status(404).json({ message: "Ticket not found" });
		}

		logger.info(`Ticket updated successfully with ID: ${ticket._id}`);
		res.status(200).json(ticket);
	} catch (error) {
		logger.error("Error updating ticket", error);
		res.status(500).json({
			message: "Error updating ticket",
			error: error.message,
		});
	}
};

// Delete ticket
export const deleteTicket = async (req, res) => {
	const startTime = Date.now();
	logger.request(req);
	logger.info(`Deleting ticket with ID: ${req.params.id}`);

	try {
		const ticket = await Ticket.findByIdAndDelete(req.params.id);
		if (!ticket) {
			logger.info(`Ticket with ID ${req.params.id} not found for deletion`);
			const response = { message: "Ticket not found" };
			logger.response(404, response, Date.now() - startTime);
			return res.status(404).json(response);
		}

		logger.info(`Ticket deleted successfully with ID: ${ticket._id}`);
		logger.response(200, { ticketId: ticket._id }, Date.now() - startTime);
		res.status(200).json(ticket);
	} catch (error) {
		logger.error("Error deleting ticket", error);
		const response = {
			message: "Error deleting ticket",
			error: error.message,
		};
		logger.response(500, response, Date.now() - startTime);
		res.status(500).json(response);
	}
};

// Assign ticket to HR
export const assignTicket = async (req, res) => {
	const startTime = Date.now();
	logger.request(req);

	try {
		const { assignedTo } = req.body;
		logger.info(`Assigning ticket ${req.params.id} to HR rep: ${assignedTo}`);

		if (!assignedTo) {
			logger.info(`Missing assignedTo field for ticket ${req.params.id}`);
			return res.status(400).json({ message: "HR rep ID is required" });
		}

		// Ensure we're using proper MongoDB ObjectID
		const mongoose = await import("mongoose");
		let assignedToId;
		try {
			assignedToId = new mongoose.Types.ObjectId(assignedTo);
		} catch (e) {
			logger.error(`Invalid ID format for assignedTo: ${assignedTo}`, e);
			return res.status(400).json({ message: "Invalid HR rep ID format" });
		}

		const updatedTicket = await Ticket.findByIdAndUpdate(
			req.params.id,
			{
				assignedTo: assignedToId,
				updatedAt: Date.now(),
			},
			{ new: true, runValidators: true }
		);

		if (!updatedTicket) {
			return res.status(404).json({ message: "Ticket not found" });
		}

		logger.info(`Ticket ${updatedTicket._id} assigned to HR rep ${assignedTo}`);
		res.status(200).json(updatedTicket);
	} catch (error) {
		logger.error(`Error assigning ticket ${req.params.id} to HR`, error);
		res.status(500).json({
			message: "Error assigning ticket to HR",
			error: error.message,
		});
	}
};

// Update ticket status
export const updateTicketStatus = async (req, res) => {
	const startTime = Date.now();
	logger.request(req);
	logger.info(`Updating status for ticket with ID: ${req.params.id}`);

	try {
		const { status } = req.body;

		if (!status) {
			logger.info(
				`Status update missing required field for ticket ${req.params.id}`
			);
			const response = { message: "Status field is required" };
			logger.response(400, response, Date.now() - startTime);
			return res.status(400).json(response);
		}

		const ticket = await Ticket.findByIdAndUpdate(
			req.params.id,
			{
				status,
				updatedAt: Date.now(),
			},
			{ new: true, runValidators: true }
		);

		if (!ticket) {
			logger.info(
				`Ticket with ID ${req.params.id} not found for status update`
			);
			const response = { message: "Ticket not found" };
			logger.response(404, response, Date.now() - startTime);
			return res.status(404).json(response);
		}

		logger.info(
			`Status updated successfully for ticket: ${ticket._id} to ${status}`
		);
		logger.response(
			200,
			{ ticketId: ticket._id, status },
			Date.now() - startTime
		);
		res.status(200).json(ticket);
	} catch (error) {
		logger.error(`Error updating status for ticket ${req.params.id}`, error);
		const response = {
			message: "Error updating ticket status",
			error: error.message,
		};
		logger.response(500, response, Date.now() - startTime);
		res.status(500).json(response);
	}
};
