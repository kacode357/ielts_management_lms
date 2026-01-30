// Auth Service - Business Logic Layer
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { AppError } = require("../utils/appError");
const { getMessages } = require("../responses");
const eventProducer = require("../events/event.producer");

class AuthService {
  /**
   * Generate JWT token
   * @param {string} userId - User ID
   * @param {string} email - User email
   * @param {string} role - User role
   * @returns {string} JWT token
   */
  generateToken(userId, email, role) {
    return jwt.sign(
      { userId, email, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token
   */
  verifyToken(token, lang = "en") {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      const messages = getMessages(lang);
      throw new AppError(messages.COMMON.INVALID_TOKEN, 401);
    }
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} lang - Language preference
   * @returns {Promise<Object>} Created user
   */
  async register(userData, lang = "en") {
    const messages = getMessages(lang);
    const { email, password, firstName, lastName, role, phone } = userData;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !role) {
      throw new AppError(messages.AUTH.VALIDATION_ERROR, 400);
    }

    // Validate role
    if (!role) {
      throw new AppError(messages.AUTH.ROLE_REQUIRED, 400);
    }

    // Validate password strength
    if (password.length < 8) {
      throw new AppError(messages.AUTH.PASSWORD_TOO_SHORT, 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new AppError(messages.AUTH.EMAIL_ALREADY_EXISTS, 409);
    }

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      role,
      phone,
    });

    // Publish user registered event
    try {
      await eventProducer.publishUserRegistered({
        userId: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });
    } catch (err) {
      console.error("[Event] Failed to publish user registered:", err.message);
    }

    // Send welcome email notification
    try {
      await eventProducer.publishEmailNotification({
        to: user.email,
        subject: "Welcome to IELTS Management LMS",
        template: "welcome",
        data: { firstName: user.firstName, lastName: user.lastName },
      });
    } catch (err) {
      console.error("[Event] Failed to publish welcome email:", err.message);
    }

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return userResponse;
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} lang - Language preference
   * @returns {Promise<Object>} User and token
   */
  async login(email, password, lang = "en") {
    const messages = getMessages(lang);
    
    // Validate input
    if (!email || !password) {
      throw new AppError(messages.AUTH.EMAIL_PASSWORD_REQUIRED, 400);
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new AppError(messages.AUTH.INVALID_CREDENTIALS, 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError(messages.AUTH.ACCOUNT_DEACTIVATED, 403);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError(messages.AUTH.INVALID_CREDENTIALS, 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Publish user logged in event
    try {
      await eventProducer.publishUserLoggedIn({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        loginAt: new Date(),
      });
    } catch (err) {
      console.error("[Event] Failed to publish user logged in:", err.message);
    }

    // Log analytics
    try {
      await eventProducer.publishAnalyticsTracked({
        event: "user_login",
        userId: user._id.toString(),
        metadata: { role: user.role },
      });
    } catch (err) {
      console.error("[Event] Failed to publish analytics:", err.message);
    }

    // Generate token
    const token = this.generateToken(user._id, user.email, user.role);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, token };
  }

  /**
   * Get user profile
   * @param {string} userId - User ID
   * @param {string} lang - Language preference
   * @returns {Promise<Object>} User profile
   */
  async getProfile(userId, lang = "en") {
    const messages = getMessages(lang);
    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new AppError(messages.AUTH.USER_NOT_FOUND, 404);
    }

    return { user };
  }

  /**
   * Change user password
   * @param {string} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @param {string} lang - Language preference
   * @returns {Promise<void>}
   */
  async changePassword(userId, currentPassword, newPassword, lang = "en") {
    const messages = getMessages(lang);
    
    // Validate input
    if (!currentPassword || !newPassword) {
      throw new AppError(messages.AUTH.EMAIL_PASSWORD_REQUIRED, 400);
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      throw new AppError(messages.AUTH.PASSWORD_TOO_SHORT, 400);
    }

    if (currentPassword === newPassword) {
      throw new AppError(messages.AUTH.PASSWORD_MUST_DIFFER, 400);
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(messages.AUTH.USER_NOT_FOUND, 404);
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new AppError(messages.AUTH.CURRENT_PASSWORD_INCORRECT, 401);
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @param {string} lang - Language preference
   * @returns {Promise<Object>} User
   */
  async getUserById(userId, lang = "en") {
    const messages = getMessages(lang);
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      throw new AppError(messages.AUTH.USER_NOT_FOUND, 404);
    }
    
    return user;
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updateData - Update data
   * @param {string} lang - Language preference
   * @returns {Promise<Object>} Updated user
   */
  async updateProfile(userId, updateData, lang = "en") {
    const messages = getMessages(lang);
    
    // Don't allow updating sensitive fields
    delete updateData.password;
    delete updateData.email;
    delete updateData.role;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      throw new AppError(messages.AUTH.USER_NOT_FOUND, 404);
    }

    return user;
  }

  /**
   * Deactivate user account
   * @param {string} userId - User ID
   * @param {string} lang - Language preference
   * @returns {Promise<void>}
   */
  async deactivateAccount(userId, lang = "en") {
    const messages = getMessages(lang);
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      throw new AppError(messages.AUTH.USER_NOT_FOUND, 404);
    }
  }

  /**
   * Reactivate user account (Admin only)
   * @param {string} userId - User ID
   * @param {string} lang - Language preference
   * @returns {Promise<void>}
   */
  async reactivateAccount(userId, lang = "en") {
    const messages = getMessages(lang);
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    );

    if (!user) {
      throw new AppError(messages.AUTH.USER_NOT_FOUND, 404);
    }
  }

  /**
   * Verify email exists
   * @param {string} email - Email to check
   * @returns {Promise<boolean>} True if exists
   */
  async emailExists(email) {
    const user = await User.findOne({ email: email.toLowerCase() });
    return !!user;
  }
}

module.exports = new AuthService();
