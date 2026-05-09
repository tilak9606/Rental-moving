import express from 'express';
import {
    createTicket,
    getMyTickets,
    getAllTickets,
    getTicketById,
    addMessage,
    updateTicketStatus
} from '../controllers/supportController.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, authorize('tenant'), createTicket);
router.get('/my-tickets', auth, authorize('tenant'), getMyTickets);
router.get('/all', auth, authorize('admin'), getAllTickets);
router.get('/:id', auth, getTicketById);
router.post('/:ticketId/messages', auth, addMessage);
router.put('/:ticketId/status', auth, authorize('admin'), updateTicketStatus);

export default router;