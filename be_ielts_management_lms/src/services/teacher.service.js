// Teacher Service - Simplified for MongoDB Driver
const Teacher = require("../models/teacher.model");
const User = require("../models/user.model");
const { AppError } = require("../utils/appError");
const { USER_ROLES } = require("../constants/enums");

class TeacherService {
  async createTeacher(teacherData, lang = "en") {
    const { email, password, firstName, lastName, phone, teacherCode, specialization, experience, certifications, bio } = teacherData;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !teacherCode) {
      throw new AppError("Name, code, email and password are required", 400);
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("Email already exists", 409);
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
      userId: user._id.toString(),
      teacherCode,
      specialization,
      experience: experience || 0,
      certifications: certifications || [],
      bio,
      hireDate: new Date(),
    });

    return teacher;
  }

  async getTeachers(filters = {}, options = {}) {
    const { page = 1, limit = 50, isActive } = options;
    const skip = (page - 1) * limit;

    const query = {};
    if (isActive !== undefined) query.isActive = isActive === "true";

    const [teachers, total] = await Promise.all([
      Teacher.find(query).skip(skip).limit(parseInt(limit)),
      Teacher.count(query),
    ]);

    // Populate user info manually
    const teachersWithUser = await Promise.all(teachers.map(async (teacher) => {
      const user = await User.findById(teacher.userId);
      if (user && (!query.isActive || user.isActive)) {
        return {
          ...teacher,
          userId: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            isActive: user.isActive,
          },
        };
      }
      return null;
    }));

    const filteredTeachers = teachersWithUser.filter(t => t !== null);

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

  async getTeachersForDropdown() {
    const teachers = await Teacher.find();

    return Promise.all(teachers.map(async (teacher) => {
      const user = await User.findById(teacher.userId);
      if (user && user.isActive) {
        return {
          id: teacher._id,
          name: `${user.firstName} ${user.lastName}`,
          code: teacher.teacherCode,
          specialization: teacher.specialization,
        };
      }
      return null;
    })).then(results => results.filter(r => r !== null));
  }

  async getTeacherById(teacherId, lang = "en") {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new AppError("Teacher not found", 404);
    }

    const user = await User.findById(teacher.userId);
    return {
      ...teacher,
      userId: user ? {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        isActive: user.isActive,
        avatar: user.avatar,
      } : null,
    };
  }

  async updateTeacher(teacherId, updateData, lang = "en") {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new AppError("Teacher not found", 404);
    }

    const { firstName, lastName, phone, email, isActive, ...teacherFields } = updateData;

    // Update user if user fields provided
    if (firstName || lastName || phone || email !== undefined || isActive !== undefined) {
      const userUpdate = {};
      if (firstName) userUpdate.firstName = firstName;
      if (lastName) userUpdate.lastName = lastName;
      if (phone) userUpdate.phone = phone;
      if (isActive !== undefined) userUpdate.isActive = isActive;
      
      if (email) {
        const existingUser = await User.findOne({ email, _id: { $ne: teacher.userId } });
        if (existingUser) {
          throw new AppError("Email already exists", 409);
        }
        userUpdate.email = email;
      }

      await User.updateById(teacher.userId, userUpdate);
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

    await Teacher.updateById(teacherId, teacherFields);
    return await this.getTeacherById(teacherId);
  }

  async deleteTeacher(teacherId, lang = "en") {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new AppError("Teacher not found", 404);
    }

    // Soft delete: deactivate user
    await User.updateById(teacher.userId, { isActive: false });

    return { message: "Teacher deactivated successfully" };
  }
}

module.exports = new TeacherService();
