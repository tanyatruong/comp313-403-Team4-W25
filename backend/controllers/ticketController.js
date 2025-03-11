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

		logAndRespond(logger, res, 201, "Ticket created successfully", { ticket: newTicket }, startTime);
	} catch (error) {
		logger.error("Error creating ticket", error);
		logAndRespond(logger, res, 500, "Error creating ticket", { error: error.message }, startTime);
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
		// Include status in the fields that can be updated
		const { title, description, priority, category, status } = req.body;
		logger.info(`Update includes status change to: ${status}`);

		const ticket = await Ticket.findByIdAndUpdate(
			req.params.id,
			{
				title,
				description,
				priority,
				category,
				status, // Add this field to allow status updates through PUT
				updatedAt: Date.now(),
			},
			{ new: true, runValidators: true }
		);

		if (!ticket) {
			logger.info(`Ticket with ID ${req.params.id} not found for update`);
			const response = { message: "Ticket not found" };
			logger.response(404, response, Date.now() - startTime);
			return res.status(404).json(response);
		}

		logger.info(
			`