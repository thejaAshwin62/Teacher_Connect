import { User } from "../models/User.js";
import { BadRequestError, NotFoundError } from "../errors/customErrors.js";
import cloudinary from "cloudinary";

export const updateUserProfile = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const userId = req.user.userId;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Update basic info
    user.username = username || user.username;
    user.email = email || user.email;

    // Handle profile picture upload
    if (req.file) {
      // Upload to cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          {
            folder: 'user_profile_pics',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.write(req.file.buffer);
        stream.end();
      });

      user.profilePic = result.secure_url;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
}; 