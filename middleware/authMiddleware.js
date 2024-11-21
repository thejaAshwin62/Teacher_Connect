import {
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} from "../errors/customErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";
import { Teacher } from "../models/Teacher.js";
import { User } from "../models/User.js";

export const authenticateUser = async (req, res, next) => {
  const { token } = req.cookies;

  try {
    if (!token) {
      // Instead of throwing error for public routes, just pass null user
      req.user = null;
      return next();
    }

    const { userId, role } = verifyJWT(token);
    req.user = { userId, role };
    next();
  } catch (error) {
    // If token is invalid, pass null user instead of throwing error
    req.user = null;
    next();
  }
};

export const checkTestUser = (req, res, next) => {
  if (req.user.testUser) throw new BadRequestError("Demo User, Read Only!");
  next();
};

export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    throw new UnauthorizedError("Not authorized to access this route");
  }
  next();
};

export const requireAuth = (req, res, next) => {
  if (!req.user) {
    throw new UnauthenticatedError("Authentication invalid");
  }
  next();
};
