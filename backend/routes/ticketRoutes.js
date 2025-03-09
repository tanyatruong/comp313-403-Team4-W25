import express from 'express';
import { createTicket } from '../controllers/ticketController.js';
import { protect, employeeOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only employees can create tickets
router.post('/create', protect, employeeOnly, createTicket);

export default router;
