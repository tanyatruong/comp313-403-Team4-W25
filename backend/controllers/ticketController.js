// Define functions for the ticket

//Testing this push

// Matthew pushing to test

import Ticket from "../models/Ticket.js";
import { logger } from "../utils/logger.js";

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

		const response = {
			message: "Ticket created successfully",
			ticket: newTicket,
		};

		logger.response(201, response, Date.now() - startTime);
		res.status(201).json(response);
	} catch (error) {
		logger.error("Error creating ticket", error);
		const response = {
			message: "Error creating ticket",
			error: error.message,
		};
		logger.response(500, response, Date.now() - startTime);
		res.status(500).json(response);
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
		const { title, description, priority, category } = req.body;
		const ticket = await Ticket.findByIdAndUpdate(
			req.params.id,
			{
				title,
				description,
				priority,
				category,
				updatedAt: Date.now(),
			},
			{ new: true }
		);

		if (!ticket) {
			logger.info(`Ticket with ID ${req.params.id} not found for update`);
			const response = { message: "Ticket not found" };
			logger.response(404, response, Date.now() - startTime);
			return res.status(404).json(response);
		}

		logger.info(`Successfully updated ticket: ${ticket._id}`);
		logger.response(200, { ticketId: ticket._id }, Date.now() - startTime);
		res.status(200).json(ticket);
	} catch (error) {
		logger.error(`Error updating ticket with ID: ${req.params.id}`, error);
		const response = {
			message: "Error updating ticket",
			error: error.message,
		};
		logger.response(500, response, Date.now() - startTime);
		res.status(500).json(response);
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

		logger.info(`Successfully deleted ticket: ${req.params.id}`);
		const response = { message: "Ticket deleted successfully" };
		logger.response(200, response, Date.now() - startTime);
		res.status(200).json(response);
	} catch (error) {
		logger.error(`Error deleting ticket with ID: ${req.params.id}`, error);
		const response = {
			message: "Error deleting ticket",
			error: error.message,
		};
		logger.response(500, response, Date.now() - startTime);
		res.status(500).json(response);
	}
};

// Update ticket status
export const updateTicketStatus = async (req, res) => {
	const startTime = Date.now();
	logger.request(req);
	logger.info(`Updating status for ticket with ID: ${req.params.id}`);

	try {
		const { status } = req.body;
		logger.info(`Changing ticket status to: ${status}`);

		const ticket = await Ticket.findByIdAndUpdate(
			req.params.id,
			{
				status,
				updatedAt: Date.now(),
			},
			{ new: true }
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
			`Successfully updated status for ticket: ${ticket._id} to ${status}`
		);
		logger.response(
			200,
			{ ticketId: ticket._id, status },
			Date.now() - startTime
		);
		res.status(200).json(ticket);
	} catch (error) {
		logger.error(
			`Error updating status for ticket with ID: ${req.params.id}`,
			error
		);
		const response = {
			message: "Error updating ticket status",
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
	logger.info(`Assigning ticket with ID: ${req.params.id}`);

	try {
		const { assignedTo } = req.body;
		logger.info(`Assigning ticket to user: ${assignedTo}`);

		const ticket = await Ticket.findByIdAndUpdate(
			req.params.id,
			{
				assignedTo,
				updatedAt: Date.now(),
			},
			{ new: true }
		);

		if (!ticket) {
			logger.info(`Ticket with ID ${req.params.id} not found for assignment`);
			const response = { message: "Ticket not found" };
			logger.response(404, response, Date.now() - startTime);
			return res.status(404).json(response);
		}

		logger.info(
			`Successfully assigned ticket: ${ticket._id} to user: ${assignedTo}`
		);
		logger.response(
			200,
			{ ticketId: ticket._id, assignedTo },
			Date.now() - startTime
		);
		res.status(200).json(ticket);
	} catch (error) {
		logger.error(`Error assigning ticket with ID: ${req.params.id}`, error);
		const response = {
			message: "Error assigning ticket",
			error: error.message,
		};
		logger.response(500, response, Date.now() - startTime);
		res.status(500).json(response);
	}
};
