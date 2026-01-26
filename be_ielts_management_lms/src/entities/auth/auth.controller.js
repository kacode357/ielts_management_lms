// Auth Controller
const jwt = require("jsonwebtoken");
const User = require("./auth.model.mongoose");
const Student = require("../student/student.model.mongoose");
const Teacher = require("../teacher/teacher.model.mongoose");
const { AppError } = require("../../utils/appError");
const { sendSuccess } = require("../../utils/response");
const MESSAGES = require("../../constants/messages");
const moment = require("moment");

// Generate JWT token
function generateToken(userId, email, role) {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// Register new user
exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role, phone } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !role) {
      throw new AppError(MESSAGES.ERROR.VALIDATION_ERROR, 400);
    }

    // Check if role is valid (not admin)
    if (role === "admin") {
      throw new AppError("Cannot register as admin", 403);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError(MESSAGES.ERROR.EMAIL_ALREADY_EXISTS, 400);
    }

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
    });

    // Create profile based on role
    if (role === "student") {
      const studentCode = `STU${Date.now().toString().slice(-6)}`;
      await Student.create({
        userId: user._id,
        studentCode,
      });
    } else if (role === "teacher") {
      const teacherCode = `TEA${Date.now().toString().slice(-6)}`;
      await Teacher.create({
        userId: user._id,
        teacherCode,
      });
    }

    // Generate token
    const token = generateToken(user._id, user.email, user.role);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Remove password from response (already handled in model toJSON)
    const userResponse = user.toJSON();

    sendSuccess(res, { user: userResponse, token }, MESSAGES.SUCCESS.REGISTER, 201);
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(MESSAGES.ERROR.INVALID_CREDENTIALS, 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError("Account is deactivated", 403);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError(MESSAGES.ERROR.INVALID_CREDENTIALS, 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.email, user.role);
    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    sendSuccess(res, { user: userResponse, token }, MESSAGES.SUCCESS.LOGIN);
  } catch (error) {
    next(error);
  }
};

// Logout user
exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    sendSuccess(res, null, MESSAGES.SUCCESS.LOGOUT);
  } catch (error) {
    next(error);
  }
};

// Get current user profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      throw new AppError(MESSAGES.ERROR.NOT_FOUND, 404);
    }

    // Get profile based on role
    let profile = null;
    if (user.role === "student") {
      profile = await Student.findOne({ userId: user._id });
    } else if (user.role === "teacher") {
      profile = await Teacher.findOne({ userId: user._id });
    }

    sendSuccess(res, { user, profile }, MESSAGES.SUCCESS.RETRIEVED);
  } catch (error) {
    next(error);
  }
};

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError("Current password and new password are required", 400);
    }

    if (newPassword.length < 8) {
      throw new AppError(MESSAGES.VALIDATION.INVALID_PASSWORD, 400);
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      throw new AppError(MESSAGES.ERROR.NOT_FOUND, 404);
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new AppError("Current password is incorrect", 401);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    sendSuccess(res, null, "Password changed successfully");
  } catch (error) {
    next(error);
  }
};
