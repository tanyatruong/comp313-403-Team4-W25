// Define functions for the ticket

//Testing this push

// Matthew pushing to test

import Ticket from '../models/Ticket.js';

export const createTicket = async (req, res) => {
    try {
        const { title, description, assignedTo, status, priority, category } = req.body;

        // Create a new ticket using the authenticated employee's information
        const newTicket = new Ticket({
            title,
            description,
            employeeNumber: req.user.employeeNumber, // Get from authenticated user
            assignedTo,
            status,
            priority,
            category
        });

        // Save the ticket to the database
        await newTicket.save();

        res.status(201).json({
            message: 'Ticket created successfully',
            ticket: newTicket
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating ticket',
            error: error.message
        });
    }
};
