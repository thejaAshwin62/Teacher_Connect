import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import multer from 'multer';
import {
  scheduleAvailability,
  getAllAppointments,
  getPendingAppointments,
  updateAppointmentStatus,
  getAppointmentsByDate,
  getTeacherAvailability,
  updateTeacherProfile,
  getTeacherProfile,
  getTeacherById,
  getTeacherDetailsForAppointment,
  getTeacherDetails
} from "../controllers/teacher.controller.js";

const router = express.Router();

// Add multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Public routes (no authentication needed)
router.get('/details/:teacherId', getTeacherDetailsForAppointment);
router.get('/details/:teacherId', getTeacherDetails);

// Protected routes
router.use(authenticateUser);

// Profile routes
router.patch('/update-profile', authenticateUser, upload.single('profilePic'), updateTeacherProfile);
router.get('/profile', getTeacherProfile);
router.get('/profile/:id', getTeacherById);

// Availability routes
router.get("/availability", getTeacherAvailability);
router.post("/availability", scheduleAvailability);

// Appointment routes
router.get("/appointments", getAllAppointments);
router.get("/appointments/pending", getPendingAppointments);
router.get("/appointments/date", getAppointmentsByDate);
router.patch("/appointments/:appointmentId", updateAppointmentStatus);

export default router;
