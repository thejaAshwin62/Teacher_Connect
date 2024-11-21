import { Teacher } from '../models/Teacher.js';
import { User } from '../models/User.js';
import { BadRequestError, NotFoundError } from '../errors/customErrors.js';
import bcrypt from 'bcrypt';

export const addTeacher = async (req, res, next) => {
  try {
    const { name, email, department, subject, password } = req.body;

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      throw new BadRequestError('Email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const teacher = await Teacher.create({
      name,
      email,
      department,
      subject,
      password: hashedPassword,
      isApproved: true
    });

    res.status(201).json({
      success: true,
      message: 'Teacher added successfully',
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        department: teacher.department,
        subject: teacher.subject
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find().select('-password');
    res.status(200).json({ success: true, teachers });
  } catch (error) {
    next(error);
  }
};

export const deleteTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByIdAndDelete(id);
    
    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    res.status(200).json({
      success: true,
      message: 'Teacher deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getPendingTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find({ isApproved: false }).select('-password');
    res.status(200).json({ success: true, teachers });
  } catch (error) {
    next(error);
  }
};

export const getPendingStudents = async (req, res, next) => {
  try {
    const students = await User.find({ isApproved: false }).select('-password');
    res.status(200).json({ success: true, students });
  } catch (error) {
    next(error);
  }
};

export const approveTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    ).select('-password');

    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    res.status(200).json({
      success: true,
      message: 'Teacher approved successfully',
      teacher
    });
  } catch (error) {
    next(error);
  }
};

export const approveStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await User.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    ).select('-password');

    if (!student) {
      throw new NotFoundError('Student not found');
    }

    res.status(200).json({
      success: true,
      message: 'Student approved successfully',
      student
    });
  } catch (error) {
    next(error);
  }
};

export const updateTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, department, subject, isApproved } = req.body;

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    if (name) teacher.name = name;
    if (department) teacher.department = department;
    if (subject) teacher.subject = subject;
    if (typeof isApproved === 'boolean') teacher.isApproved = isApproved;

    await teacher.save();

    res.status(200).json({
      success: true,
      message: 'Teacher updated successfully',
      teacher: {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        department: teacher.department,
        subject: teacher.subject,
        isApproved: teacher.isApproved,
        profilePic: teacher.profilePic
      }
    });
  } catch (error) {
    next(error);
  }
};

export const rejectTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByIdAndDelete(id);

    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    res.status(200).json({
      success: true,
      message: 'Teacher registration rejected successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const rejectStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await User.findByIdAndDelete(id);

    if (!student) {
      throw new NotFoundError('Student not found');
    }

    res.status(200).json({
      success: true,
      message: 'Student registration rejected successfully'
    });
  } catch (error) {
    next(error);
  }
}; 