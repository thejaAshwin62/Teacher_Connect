import express from "express";
import { authenticateUser, isAdmin } from "../middleware/authMiddleware.js";
import {
  addTeacher,
  getAllTeachers,
  deleteTeacher,
  getPendingTeachers,
  getPendingStudents,
  approveTeacher,
  approveStudent,
  rejectTeacher,
  rejectStudent,
  updateTeacher
} from "../controllers/admin.controller.js";
import { getStats } from '../controllers/stats.controller.js';

const router = express.Router();

// Protect all admin routes
router.use(authenticateUser, isAdmin);

router.post('/add-teacher', addTeacher);
router.get('/teachers', getAllTeachers);
router.delete('/teachers/:id', deleteTeacher);
router.get('/pending-teachers', getPendingTeachers);
router.get('/pending-students', getPendingStudents);
router.patch('/approve-teacher/:id', approveTeacher);
router.patch('/approve-student/:id', approveStudent);
router.patch('/teachers/:id', updateTeacher);
router.delete('/reject-teacher/:id', rejectTeacher);
router.delete('/reject-student/:id', rejectStudent);
router.get('/stats', getStats);

export default router; 