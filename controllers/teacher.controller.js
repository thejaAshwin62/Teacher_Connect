import { Teacher } from "../models/Teacher.js";
import { Appointment } from "../models/Appointment.js";
import { sendEmail } from "../utils/emailUtils.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customErrors.js";
import cloudinary from "cloudinary";

// Schedule available time slots
export const scheduleAvailability = async (req, res, next) => {
  try {
    const { availability } = req.body;
    const teacherId = req.user.userId;

    const teacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { $set: { availability } },
      { new: true }
    );

    if (!teacher) {
      throw new NotFoundError("Teacher not found");
    }

    res.status(200).json({
      success: true,
      message: "Availability scheduled successfully",
      availability: teacher.availability,
    });
  } catch (error) {
    next(error);
  }
};

// Get all appointments for a teacher
export const getAllAppointments = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const appointments = await Appointment.find({ teacherId })
      .populate("studentId", "name email")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

// View messages/appointments for a specific date
export const getAppointmentsByDate = async (req, res, next) => {
  try {
    const { date } = req.query;
    const teacherId = req.user.userId;

    const appointments = await Appointment.find({
      teacherId,
      date: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
      },
    }).populate("studentId", "name email");

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

// Get pending appointments
export const getPendingAppointments = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const appointments = await Appointment.find({
      teacherId,
      status: "pending",
    })
      .populate("studentId", "username email")
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

// Update appointment status (approve/reject)
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const { status, message } = req.body;
    const teacherId = req.user.userId;

    if (!["approved", "rejected"].includes(status)) {
      throw new BadRequestError("Invalid status. Use 'approved' or 'rejected'");
    }

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      teacherId,
    }).populate("studentId", "email");

    if (!appointment) {
      throw new NotFoundError("Appointment not found");
    }

    if (appointment.status !== "pending") {
      throw new BadRequestError(
        `Cannot update appointment with status: ${appointment.status}`
      );
    }

    appointment.status = status;
    await appointment.save();

    // Send email to student
    await sendEmail({
      to: appointment.studentId.email,
      subject: `Appointment ${status}`,
      text: `Your appointment scheduled for ${appointment.date} from ${
        appointment.startTime
      } to ${appointment.endTime} has been ${status}.\n${message || ""}`,
    });

    res.status(200).json({
      success: true,
      message: `Appointment ${status} successfully`,
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

// Get teacher's availability
export const getTeacherAvailability = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      throw new NotFoundError("Teacher not found");
    }

    res.status(200).json({
      success: true,
      availability: teacher.availability,
    });
  } catch (error) {
    next(error);
  }
};

// Update teacher's availability
export const updateTeacherAvailability = async (req, res, next) => {
  try {
    const { availability } = req.body;
    const teacherId = req.user.userId;

    // Log for debugging
    console.log("Teacher ID:", teacherId);
    console.log("Availability:", availability);

    // Validate availability data
    if (!Array.isArray(availability)) {
      throw new BadRequestError("Availability must be an array");
    }

    // Find the teacher first
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      console.log("Teacher not found with ID:", teacherId);
      throw new NotFoundError(
        "Teacher not found. Make sure you are logged in as a teacher."
      );
    }

    // Check if teacher is approved
    if (!teacher.isApproved) {
      throw new UnauthorizedError(
        "Your account needs to be approved before setting availability"
      );
    }

    // Update the teacher's availability
    teacher.availability = availability;
    await teacher.save();

    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      availability: teacher.availability,
    });
  } catch (error) {
    console.error("Error in updateTeacherAvailability:", error);
    next(error);
  }
};

export const updateTeacherProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const teacherId = req.user.userId;

    console.log('Update request:', { name, email, teacherId }); // Debug log

    // Find the teacher
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    // Update basic info
    if (name) teacher.name = name;
    if (email) teacher.email = email;

    // Handle profile picture upload
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { folder: 'teacher_profile_pics' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.write(req.file.buffer);
        stream.end();
      });
      teacher.profilePic = result.secure_url;
    }

    await teacher.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        department: teacher.department,
        profilePic: teacher.profilePic,
        role: 'teacher'
      }
    });
  } catch (error) {
    console.error('Profile update error:', error); // Debug log
    next(error);
  }
};

export const getTeacherProfile = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const teacher = await Teacher.findById(teacherId);
    
    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    res.status(200).json({
      success: true,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        department: teacher.department,
        profilePic: teacher.profilePic,
        role: 'teacher'
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getTeacherById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const teacher = await Teacher.findById(id)
      .select('-password')
      .lean();

    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    res.status(200).json({
      success: true,
      teacher: {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        department: teacher.department,
        isApproved: teacher.isApproved,
        profilePic: teacher.profilePic
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getTeacherDetailsForAppointment = async (req, res, next) => {
  try {
    const { teacherId } = req.params;
    
    const teacher = await Teacher.findById(teacherId)
      .select('name email department profilePic')
      .lean();

    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    res.status(200).json({
      success: true,
      teacher
    });
  } catch (error) {
    next(error);
  }
};

// Add this function to get teacher details
export const getTeacherDetails = async (req, res, next) => {
  try {
    const { teacherId } = req.params;
    
    if (!teacherId) {
      throw new BadRequestError('Teacher ID is required');
    }

    const teacher = await Teacher.findById(teacherId)
      .select('name email department profilePic isApproved');

    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    res.status(200).json({
      success: true,
      teacher
    });
  } catch (error) {
    next(error);
  }
};
