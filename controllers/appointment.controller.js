import { Appointment } from "../models/Appointment.js";
import { Teacher } from "../models/Teacher.js";
import { User } from "../models/User.js";
import { sendEmail } from "../utils/emailUtils.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  UnauthenticatedError,
} from "../errors/customErrors.js";

// Book appointment
export const bookAppointment = async (req, res, next) => {
  try {
    const { teacherId, date, startTime, endTime, purpose, message } = req.body;
    const studentId = req.user.userId;

    // Get student details
    const student = await User.findById(studentId);
    if (!student) {
      throw new UnauthenticatedError('Student not found');
    }

    // Get teacher details
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    // Create appointment
    const appointment = await Appointment.create({
      teacherId,
      studentId,
      studentName: student.username,
      subject: purpose,
      date,
      startTime,
      endTime,
      message,
      status: 'pending'
    });

    // Send email to teacher
    const emailSent = await sendEmail({
      to: teacher.email,
      subject: 'New Appointment Request',
      text: `
Dear ${teacher.name},

You have received a new appointment request:

Student: ${student.username}
Date: ${date}
Time: ${startTime} - ${endTime}
Purpose: ${purpose}
Message: ${message}

Please log in to your dashboard to approve or reject this request.

Best regards,
Teacher Appointment System
      `
    });

    // Send confirmation email to student
    await sendEmail({
      to: student.email,
      subject: 'Appointment Request Confirmation',
      text: `
Dear ${student.username},

Your appointment request has been submitted:

Teacher: ${teacher.name}
Date: ${date}
Time: ${startTime} - ${endTime}
Purpose: ${purpose}

You will receive another email when the teacher responds to your request.

Best regards,
Teacher Appointment System
      `
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully' + (emailSent ? ' and notifications sent' : ''),
      appointment
    });
  } catch (error) {
    console.error('Appointment booking error:', error);
    next(error);
  }
};

// Get student's appointments
export const getStudentAppointments = async (req, res, next) => {
  try {
    const studentId = req.user.userId;
    const appointments = await Appointment.find({ studentId })
      .populate({
        path: 'teacherId',
        select: 'name email department profilePic',
        model: 'Teacher'
      })
      .sort({ date: 1, startTime: 1 });

    const formattedAppointments = appointments.map(appointment => {
      // Add null checks for teacher data
      const teacher = appointment.teacherId || {};
      
      return {
        _id: appointment._id,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        message: appointment.message,
        teacherId: teacher._id || null,
        teacherName: teacher.name || 'Deleted Teacher',
        teacherEmail: teacher.email || 'No Email',
        teacherDepartment: teacher.department || 'Unknown',
        teacherProfilePic: teacher.profilePic || null
      };
    });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments: formattedAppointments
    });
  } catch (error) {
    next(error);
  }
};

// Cancel appointment (for students)
export const cancelAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const studentId = req.user.userId;

    const appointment = await Appointment.findOne({ _id: appointmentId, studentId })
      .populate('teacherId', 'name email');

    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    appointment.status = 'cancelled';
    await appointment.save();

    // Send email to teacher
    await sendEmail({
      to: appointment.teacherId.email,
      subject: 'Appointment Cancelled',
      text: `
        Dear ${appointment.teacherId.name},

        The following appointment has been cancelled by the student:

        Date: ${appointment.date}
        Time: ${appointment.startTime} - ${appointment.endTime}

        The time slot is now available for other bookings.

        Best regards,
        Teacher Appointment System
      `
    });

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getTeacherAppointments = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;

    const appointments = await Appointment.find({ teacherId })
      .populate({
        path: 'studentId',
        select: 'username email profilePic',
        model: 'User'
      })
      .sort({ createdAt: -1 });

    // Format the response with null checks
    const formattedAppointments = appointments.map(appointment => {
      // Check if studentId exists and has required properties
      const student = appointment.studentId || {};
      
      return {
        _id: appointment._id,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        message: appointment.message,
        studentId: student._id || null,
        studentName: student.username || 'Deleted User',
        studentEmail: student.email || 'No Email',
        studentProfilePic: student.profilePic || null
      };
    });

    res.status(200).json({
      success: true,
      appointments: formattedAppointments
    });
  } catch (error) {
    console.error('Error fetching teacher appointments:', error);
    next(error);
  }
};

export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      throw new BadRequestError('Invalid status');
    }

    const appointment = await Appointment.findById(id)
      .populate('studentId', 'username email')
      .populate('teacherId', 'name email');

    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    appointment.status = status;
    await appointment.save();

    // Send email to student
    await sendEmail({
      to: appointment.studentId.email,
      subject: `Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      text: `
        Dear ${appointment.studentId.username},

        Your appointment request has been ${status}:

        Teacher: ${appointment.teacherId.name}
        Date: ${appointment.date}
        Time: ${appointment.startTime} - ${appointment.endTime}
        ${status === 'approved' 
          ? 'Please be on time for your appointment.'
          : 'Please feel free to book another appointment.'}

        Best regards,
        Teacher Appointment System
      `
    });

    res.status(200).json({
      success: true,
      message: `Appointment ${status} successfully`,
      appointment
    });
  } catch (error) {
    next(error);
  }
};

export const getTeacherAvailability = async (req, res) => {
  const teacher = await Teacher.findById(req.user.userId);
  if (!teacher) {
    throw new UnauthenticatedError("Teacher not found");
  }

  res.status(200).json({ availability: teacher.availability });
};

export const updateTeacherAvailability = async (req, res) => {
  const { availability } = req.body;

  const teacher = await Teacher.findByIdAndUpdate(
    req.user.userId,
    { availability },
    { new: true }
  );

  if (!teacher) {
    throw new UnauthenticatedError("Teacher not found");
  }

  res.status(200).json({ availability: teacher.availability });
};

export const getMyAppointments = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const appointments = await Appointment.find({ studentId: userId })
      .populate({
        path: 'teacherId',
        select: 'name email department profilePic isApproved',
        model: 'Teacher'
      })
      .sort({ createdAt: -1 });

    const formattedAppointments = appointments.map(appointment => {
      // Check if teacherId exists and has required properties
      const teacher = appointment.teacherId || {};

      return {
        _id: appointment._id,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        message: appointment.message,
        teacherId: teacher._id || null,
        teacherName: teacher.name || 'Deleted Teacher',
        teacherEmail: teacher.email || 'No Email',
        teacherDepartment: teacher.department || 'Unknown',
        teacherProfilePic: teacher.profilePic || null
      };
    });

    res.status(200).json({
      success: true,
      appointments: formattedAppointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    next(error);
  }
};
