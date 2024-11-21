import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from './routes/user.routes.js';
import messageRoutes from './routes/message.routes.js';
import { StatusCodes } from "http-status-codes";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import cloudinary from "cloudinary";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
// import { User } from './models/User.js';

// Configure dotenv to read .env file
dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" 
      ? process.env.CLIENT_URL  // Your Render URL
      : "http://localhost:5173",
    credentials: true,
  })
);

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error: ", error);
  });

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/teacher", teacherRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/messages", messageRoutes);

if (process.env.NODE_ENV === 'production') {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  app.use(express.static(path.resolve(__dirname, "./public")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./public", "index.html"));
  });
}

// Error handling middleware (move this after routes)
app.use((err, req, res, next) => {
  console.error("Error:", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

app.use("*", (req, res) => {
  res.status(404).json({ msg: "not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(StatusCodes.BAD_REQUESt).json({ msg: "something went wrong" });
});
app.use(errorHandlerMiddleware);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

