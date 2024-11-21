import { Message } from '../models/Message.js';
import { BadRequestError, NotFoundError } from '../errors/customErrors.js';

export const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content, appointmentId } = req.body;
    
    if (!receiverId || !content || !appointmentId) {
      throw new BadRequestError('Please provide all required fields');
    }

    const senderId = req.user.userId;
    const senderModel = req.user.role === 'teacher' ? 'Teacher' : 'User';
    const receiverModel = req.user.role === 'teacher' ? 'User' : 'Teacher';

    const message = await Message.create({
      sender: senderId,
      senderModel,
      receiver: receiverId,
      receiverModel,
      content,
      appointmentId
    });

    await message.populate('sender', 'name username');
    await message.populate('receiver', 'name username');

    res.status(201).json({
      success: true,
      message
    });
  } catch (error) {
    console.error('Send message error:', error);
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.userId;

    const messages = await Message.find({
      appointmentId,
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'name username')
    .populate('receiver', 'name username');

    res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.userId;

    const message = await Message.findOneAndUpdate(
      {
        _id: messageId,
        receiver: userId,
        read: false
      },
      { read: true },
      { new: true }
    );

    if (!message) {
      throw new NotFoundError('Message not found');
    }

    res.status(200).json({
      success: true,
      message
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    next(error);
  }
}; 