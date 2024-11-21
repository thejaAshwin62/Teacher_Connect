import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import {
  sendMessage,
  getMessages,
  markAsRead
} from '../controllers/message.controller.js';

const router = express.Router();

router.use(authenticateUser);

router.post('/send', sendMessage);
router.get('/:appointmentId', getMessages);
router.patch('/:messageId/read', markAsRead);

export default router; 