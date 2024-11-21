import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { validateAppointmentInput } from "../middleware/validationMiddleware.js";
import {
  bookAppointment,
  getStudentAppointments,
  getTeacherAppointments,
  updateAppointmentStatus,
  getTeacherAvailability,
  updateTeacherAvailability,
} from "../controllers/appointment.controller.js";

const router = express.Router();

// Student routes
router.post(
  "/book",
  authenticateUser,
  validateAppointmentInput,
  bookAppointment
);
router.get("/my-appointments", authenticateUser, getStudentAppointments);

// Teacher routes
router.get("/teacher/appointments", authenticateUser, getTeacherAppointments);
router.patch(
  "/teacher/appointments/:id",
  authenticateUser,
  updateAppointmentStatus
);
router.get("/teacher/availability", authenticateUser, getTeacherAvailability);
router.post(
  "/teacher/availability",
  authenticateUser,
  updateTeacherAvailability
);

export default router;
