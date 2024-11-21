import { Teacher } from "../models/Teacher.js";
import bcrypt from "bcrypt";
import { createJWT } from "../utils/tokenUtils.js";
import {
  UnauthenticatedError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from "../errors/customErrors.js";
import { sendEmail } from "../utils/emailUtils.js";
import multer from "multer";
import cloudinary from "cloudinary";
import { User } from "../models/User.js";
// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to handle image upload
const uploadMiddleware = upload.single("profilePic");

// Cloudinary configuration (make sure to set up your Cloudinary credentials)
cloudinary.config({
  cloud_name: "dglrrdx2u",
  api_key: "355391597932723",
  api_secret: "43ob25YR1O2ilJCLBQG5m6MlKJI",
});

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() }, 
        { username: username.trim() }
      ]
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        throw new BadRequestError('Email already registered');
      }
      if (existingUser.username === username.trim()) {
        throw new BadRequestError('Username already taken');
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username: username.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      isApproved: false
    });

    await newUser.save();

    // Try to send email but don't block registration if it fails
    try {
      // Notify admin about new registration
      const adminUser = await User.findOne({ role: 'admin' });
      if (adminUser) {
        await sendEmail({
          to: adminUser.email,
          subject: 'New User Registration',
          text: `A new user has registered:\nUsername: ${username}\nEmail: ${email}`
        });
      }
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Continue registration process even if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please wait for admin approval.'
    });
  } catch (error) {
    next(error);
  }
};

export const registerTeacher = async (req, res, next) => {
  try {
    const { name, email, password, department } = req.body;

    // Validate required fields
    if (!name || !email || !password || !department) {
      throw new BadRequestError('Please provide all required fields');
    }

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      throw new BadRequestError('Email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newTeacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      department,
      isApproved: false,
      availability: []
    });

    await newTeacher.save();

    // Notify admin
    const adminUser = await User.findOne({ role: 'admin' });
    if (adminUser) {
      await sendEmail({
        to: adminUser.email,
        subject: 'New Teacher Registration',
        text: `A new teacher has registered and needs approval:\nName: ${name}\nEmail: ${email}\nDepartment: ${department}`
      });
    }

    res.status(201).json({
      success: true,
      message: 'Teacher registration successful. Please wait for admin approval.'
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Check in User collection first
    let user = await User.findOne({ email });
    let isTeacher = false;

    // If not found in User, check Teacher collection
    if (!user) {
      user = await Teacher.findOne({ email });
      if (user) {
        isTeacher = true;
      }
    }

    // If no user found in either collection
    if (!user) {
      throw new UnauthenticatedError('Invalid credentials');
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Invalid credentials');
    }

    // Check if user is approved
    if (!user.isApproved) {
      throw new UnauthorizedError('Your account is pending approval');
    }

    // Create token
    const token = createJWT({
      userId: user._id,
      role: isTeacher ? 'teacher' : user.role
    });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV === 'production'
    });

    // Send response
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: isTeacher ? user.name : user.username,
        email: user.email,
        role: isTeacher ? 'teacher' : user.role,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now())
  });
  res.status(200).json({ message: 'User logged out!' });
};

export const checkAuth = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }
  
  // Fetch user details based on role
  try {
    let userData;
    if (req.user.role === 'teacher') {
      const teacher = await Teacher.findById(req.user.userId);
      userData = {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: 'teacher',
        department: teacher.department,
        profilePic: teacher.profilePic
      };
    } else {
      const user = await User.findById(req.user.userId);
      userData = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic
      };
    }

    res.status(200).json({
      success: true,
      user: userData
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Authentication invalid'
    });
  }
};

export const searchTeachers = async (req, res, next) => {
  try {
    const { query, department } = req.query;
    let searchQuery = { isApproved: true }; // Only show approved teachers

    // Build search query based on parameters
    if (query) {
      searchQuery = {
        ...searchQuery,
        $or: [
          { name: { $regex: query, $options: 'i' } }, // Case-insensitive name search
          { email: { $regex: query, $options: 'i' } } // Case-insensitive email search
        ]
      };
    }

    if (department) {
      searchQuery.department = department;
    }

    const teachers = await Teacher.find(searchQuery)
      .select('name email department profilePic availability') // Only select necessary fields
      .sort({ name: 1 }); // Sort by name alphabetically

    // Group teachers by department
    const teachersByDepartment = teachers.reduce((acc, teacher) => {
      const dept = teacher.department;
      if (!acc[dept]) {
        acc[dept] = [];
      }
      acc[dept].push({
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        profilePic: teacher.profilePic,
        availability: teacher.availability
      });
      return acc;
    }, {});

    // Get unique departments for filtering
    const departments = await Teacher.distinct('department', { isApproved: true });

    res.status(200).json({
      success: true,
      departments, // Send available departments for filtering
      teachersByDepartment,
      total: teachers.length
    });
  } catch (error) {
    next(error);
  }
};

export const searchTeacherById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findOne({ 
      _id: id,
      isApproved: true 
    }).select('name email department profilePic availability');

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
        availability: teacher.availability
      }
    });
  } catch (error) {
    next(error);
  }
};
