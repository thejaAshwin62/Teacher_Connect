import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { updateUserProfile, getUserProfile } from '../controllers/user.controller.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(authenticateUser); // Protect all user routes

// Profile routes
router.patch('/update-profile', upload.single('profilePic'), updateUserProfile);
router.get('/profile', getUserProfile);

export default router; 