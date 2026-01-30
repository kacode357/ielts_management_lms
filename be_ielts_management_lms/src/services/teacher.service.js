// Teacher Service - Business Logic Layer
const Teacher = require("../models/teacher.model");
const User = require("../models/user.model");
const { AppError } = require("../utils/appError");
const { getMessages } = require("../responses");
const MESSAGES = require("../constants/messages");
const { validateObjectId, validateRequired } = require("../utils/validation");
const { USER_ROLES } = require("../constants/enums");

class TeacherService {
  /**
   * Create a new teacher (Admin only)
   * @param {Object} teacherData - Teacher data
   * @param {string} lang - Language preference
   * @returns {Promise<Object>} Created teacher
   */
  async createTeacher(teacherData, lang = "en") {
    const messages = getMessages(lang);
    const { email, password, firstName, lastName, phone, teacherCode, specialization, experience, certifications, bio } = teacherData;

    // Validate required fields
    validateRequired(teacherData, ["email", "password", "firstName", "lastName", "teacherCode"]);

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError(MESSAGES.ERROR.EMAIL_ALREADY_EXISTS, 409);
    }

    // Check if teacher code already exists
    const existingTeacher = await Teacher.findOne({ teacherCode });
    if (existingTeacher) {
      throw new AppError("Teacher code already exists", 409);
    }

    // Create user account
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      role: USER_ROLES.TEACHER,
      isActive: true,
    });

    // Create teacher profile
    const teacher = await Teacher.create({
      userId: user._id,
      teacherCode,
      specialization,
      experience: experience || 0,
      certifications: certifications || [],
      bio,
      hireDate: new Date(),
    });

    // Populate user info
    await teacher.populate("userId", "firstName lastName email phone isActive");

    return teacher;
  }

  /**
   * Get all teachers with filters and pagination
   * @param {Object} filters - Filter criteria
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} Teachers list with pagination
   */
  async getTeachers(filters = {}, options = {}) {
    const { page = 1, limit = 50, isActive, specialization } = options;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (specialization) query.specialization = new RegExp(specialization, "i");

    // Get user filter if isActive is provided
    const userFilter = {};
    if (isActive !== undefined) userFilter.isActive = isActive === "true";

    // Execute query with pagination
    const [teachers, total] = await Promise.all([
      Teacher.find(query)
        .populate({
          path: "userId",
          select: "firstName lastName email phone isActive",
          match: Object.keys(userFilter).length > 0 ? userFilter : undefined,
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Teacher.countDocuments(query),
    ]);

    // Filter out teachers whose user was not matched (if user filter applied)
    const filteredTeachers = teachers.filter(t => t.userId);

    return {
      teachers: filteredTeachers,
      pagination: {
        total: filteredTeachers.length,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(filteredTeachers.length / limit),
      },
    };
  }

  /**
   * Get teacher by ID
   * @param {string} teacherId - Teacher ID
   * @param {string} lang - Language preference
   * @returns {Promise<Object>} Teacher data
   */
  async getTeacherById(teacherId, lang = "en") {
    const messages = getMessages(lang);

    const teacher = await Teacher.findById(teacherId)
      .populate("userId", "firstName lastName email phone isActive avatar");

    if (!teacher) {
      throw new AppError(MESSAGES.COURSE.TEACHER_NOT_FOUND, 404);
    }

    return teacher;
  }

  /**
   * Update teacher (Admin only)
   * @param {string} teacherId - Teacher ID
   * @param {Object} updateData - Data to update
   * @param {string} lang - Language preference
   * @returns {Promise<Object>} Updated teacher
   */
  async updateTeacher(teacherId, updateData, lang = "en") {
    const messages = getMessages(lang);

    // Find teacher
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new AppError(MESSAGES.COURSE.TEACHER_NOT_FOUND, 404);
    }

    // Separate user data and teacher data
    const { firstName, lastName, phone, email, isActive, ...teacherFields } = updateData;

    // Update user if user fields provided
    if (firstName || lastName || phone || email !== undefined || isActive !== undefined) {
      const userUpdate = {};
      if (firstName) userUpdate.firstName = firstName;
      if (lastName) userUpdate.lastName = lastName;
      if (phone) userUpdate.phone = phone;
      if (isActive !== undefined) userUpdate.isActive = isActive;
      
      // Check email uniqueness if changing email
      if (email) {
        const existingUser = await User.findOne({ email, _id: { $ne: teacher.userId } });
        if (existingUser) {
          throw new AppError(MESSAGES.ERROR.EMAIL_ALREADY_EXISTS, 409);
        }
        userUpdate.email = email;
      }

      await User.findByIdAndUpdate(teacher.userId, userUpdate);
    }

    // Check teacherCode uniqueness if changing
    if (teacherFields.teacherCode) {
      const existingTeacher = await Teacher.findOne({ 
        teacherCode: teacherFields.teacherCode, 
        _id: { $ne: teacherId } 
      });
      if (existingTeacher) {
        throw new AppError("Teacher code already exists", 409);
      }
    }

    // Update teacher fields
    Object.assign(teacher, teacherFields);
    await teacher.save();

    // Populate and return
    await teacher.populate("userId", "firstName lastName email phone isActive");

    return teacher;
  }

  /**
   * Delete teacher (Admin only)
   * @param {string} teacherId - Teacher ID
   * @param {string} lang - Language preference
   * @returns {Promise<Object>} Deleted teacher
   */
  async deleteTeacher(teacherId, lang = "en") {
    const messages = getMessages(lang);

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new AppError(MESSAGES.COURSE.TEACHER_NOT_FOUND, 404);
    }

    // Soft delete: deactivate user instead of hard delete
    await User.findByIdAndUpdate(teacher.userId, { isActive: false });

    // Or hard delete (uncomment if needed):
    // await Teacher.findByIdAndDelete(teacherId);
    // await User.findByIdAndDelete(teacher.userId);

    return { message: "Teacher deactivated successfully" };
  }
}

module.exports = new TeacherService();
