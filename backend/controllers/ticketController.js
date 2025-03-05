// Define functions for the ticket

//Testing this push

// Matthew pushing to test

import Ticket from '../models/Ticket.js';

export const createTicket = async (req, res) => {
    try {
        const { title, description, employee, assignedTo, status, priority, category } = req.body;

        // Create a new ticket
        const newTicket = new Ticket({
            title,
            description,
            employee,
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
