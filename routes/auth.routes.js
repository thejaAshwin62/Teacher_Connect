import express from "express";
import {
  register,
  login,
  logout,
  registerTeacher,
  checkAuth,
  searchTeachers,
  searchTeacherById
} from "../controllers/auth.controller.js";
import { authenticateUser, requireAuth, isAdmin } from "../middleware/authMiddleware.js";
import {
  validateRegisterInput,
  validateLoginInput,
  validateTeacherRegisterInput,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", validateRegisterInput, register);
router.post("/register/teacher", validateTeacherRegisterInput, registerTeacher);
router.post("/login", validateLoginInput, login);
router.get("/logout", logout);

// Protected routes
router.get("/check-auth", authenticateUser, checkAuth);
router.get("/admin-only", authenticateUser, requireAuth, isAdmin, (req, res) => {
  res.json({ message: "Admin access granted" });
});

// Search routes - make them public but with optional auth
router.get("/search/teachers", authenticateUser, searchTeachers);
router.get("/search/teachers/:id", authenticateUser, searchTeacherById);

export default router;
