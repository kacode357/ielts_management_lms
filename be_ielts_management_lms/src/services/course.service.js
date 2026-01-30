// Course Service - Business Logic Layer
const mongoose = require("mongoose");
const Course = require("../models/course.model");
const Teacher = require("../models/teacher.model");
const { AppError } = require("../utils/appError");
const { getMessages } = require("../responses");
const MESSAGES = require("../constants/messages");
const { validateObjectId, validateRequired, validateDateRange } = require("../utils/validation");
const {
  COURSE_STATUS,
  ENROLLMENT_STATUS
} = require("../constants/enums");

class CourseService {
  /**
   * Create a new course
   * @param {Object} courseData - Course data
   * @param {string} lang - Language preference
   * @returns {Promise<Object>} Created course
   */
  async createCourse(courseData, lang = "en") {
    const messages = getMessages(lang);
    const { name, code, description, level, teacherId, startDate, endDate, totalHours, room, scheduleDesc, maxStudents } = courseData;

    // Validate required fields
    validateRequired(courseData, ["name", "code", "level", "startDate", "endDate"]);

    // Validate dates
    validateDateRange(startDate, endDate);

    // Check if teacher exists (if provided)
    if (teacherId) {
      validateObjectId(teacherId, "teacherId");
      
      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        throw new AppError(MESSAGES.COURSE.TEACHER_NOT_FOUND, 404);
      }
    }

    // Check if course code already exists
    const existingCourse = await Course.findOne({ code });
    if (existingCourse) {
      throw new AppError(MESSAGES.COURSE.CODE_EXISTS, 409);
    }

    // Create course
    const course = await Course.create({
      name,
      code,
      description,
      level,
      teacherId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalHours,
      room,
      scheduleDesc,
      maxStudents: maxStudents || 30,
      status: COURSE_STATUS.SCHEDULED,
      isActive: true,
    });

    // Populate teacher info
    await course.populate("teacherId", "teacherCode specialization");

    return course;
  }

  /**
   * Get course by ID
   * @param {string} courseId - Course ID
   * @param {Object} user - Current user (from req.user)
   * @param {string} lang - Language preference
   * @returns {Promise<Object>} Course data
   */
  async getCourseById(courseId, user, lang = "en") {
    const messages = getMessages(lang);

    const course = await Course.findById(courseId)
      .populate("teacherId", "teacherCode specialization experience rating");

    if (!course) {
      throw new AppError(MESSAGES.COURSE.NOT_FOUND, 404);
    }

    // Role-based access check
    if (user.role === "teacher") {
      // Teacher can only view courses they teach
      const teacher = await Teacher.findOne({ userId: user.userId });
      if (!teacher || course.teacherId?._id.toString() !== teacher._id.toString()) {
        throw new AppError(MESSAGES.ERROR.FORBIDDEN, 403);
      }
    } else if (user.role === "student") {
      // Student can only view courses they are enrolled in
      const Student = require("../models/student.model");
      const Enrollment = require("../models/enrollment.model");
      
      const student = await Student.findOne({ userId: user.userId });
      if (!student) {
        throw new AppError(MESSAGES.ERROR.STUDENT_PROFILE_NOT_FOUND, 404);
      }
      
      const enrollment = await Enrollment.findOne({ 
        studentId: student._id, 
        courseId: course._id 
      });
      
      if (!enrollment) {
        throw new AppError(MESSAGES.ERROR.FORBIDDEN, 403);
      }
    }
    // Admin can view any course

    return course;
  }

  /**
   * Get all courses with filters and pagination
   * @param {Object} user - Current user (from req.user)
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} Courses list with pagination
   */
  async getCourses(user, options = {}) {
    const { page = 1, limit = 10, status, level, isActive } = options;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (level) query.level = level;
    if (isActive !== undefined) query.isActive = isActive;

    // Role-based filtering
    if (user.role === "teacher") {
      // Teacher: Only see courses they teach
      const teacher = await Teacher.findOne({ userId: user.userId });
      if (!teacher) {
        throw new AppError(MESSAGES.ERROR.TEACHER_PROFILE_NOT_FOUND, 404);
      }
      query.teacherId = teacher._id;
    } else if (user.role === "student") {
      // Student: Only see courses they are enrolled in
      const Student = require("../models/student.model");
      const Enrollment = require("../models/enrollment.model");
      
      const student = await Student.findOne({ userId: user.userId });
      if (!student) {
        throw new AppError(MESSAGES.ERROR.STUDENT_PROFILE_NOT_FOUND, 404);
      }
      
      // Get all courseIds from enrollments
      const enrollments = await Enrollment.find({ studentId: student._id }).select("courseId");
      const courseIds = enrollments.map(e => e.courseId);
      
      query._id = { $in: courseIds };
    }
    // Admin: No additional filter, can see all courses

    // Execute query with pagination
    const [courses, total] = await Promise.all([
      Course.find(query)
        .populate("teacherId", "teacherCode specialization experience rating")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Course.countDocuments(query),
    ]);

    return {
      courses,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update course
   * @param {string} courseId - Course ID
   * @param {Object} updateData - Data to update
   * @param {string} lang - Language preference
   * @returns {Promise<Object>} Updated course
   */
  async updateCourse(courseId, updateData, lang = "en") {
    const messages = getMessages(lang);

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      throw new AppError(MESSAGES.COURSE.NOT_FOUND, 404);
    }

    // Validate dates if provided
    if (updateData.startDate || updateData.endDate) {
      const start = updateData.startDate || course.startDate;
      const end = updateData.endDate || course.endDate;
      validateDateRange(start, end);
    }

    // Check if teacher exists (if changing teacher)
    if (updateData.teacherId && updateData.teacherId !== course.teacherId?.toString()) {
      validateObjectId(updateData.teacherId, "teacherId");
      
      const teacher = await Teacher.findById(updateData.teacherId);
      if (!teacher) {
        throw new AppError(MESSAGES.COURSE.TEACHER_NOT_FOUND, 404);
      }
    }

    // Update course
    Object.assign(course, updateData);
    await course.save();

    // Populate teacher info
    await course.populate("teacherId", "teacherCode specialization");

    return course;
  }

  /**
   * Delete course (soft delete)
   * @param {string} courseId - Course ID
   * @param {string} lang - Language preference
   * @returns {Promise<Object>} Deleted course
   */
  async deleteCourse(courseId, lang = "en") {
    const messages = getMessages(lang);

    const course = await Course.findById(courseId);
    if (!course) {
      throw new AppError(MESSAGES.COURSE.NOT_FOUND, 404);
    }

    // Soft delete
    course.isActive = false;
    course.status = COURSE_STATUS.CANCELLED;
    await course.save();

    return course;
  }

  /**
   * Get course members (teacher and enrolled students)
   * @param {string} courseId - Course ID
   * @param {Object} user - Current user (from req.user)
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} Course members list with pagination
   */
  async getCourseMembers(courseId, user, options = {}) {
    const { page = 1, limit = 50 } = options;
    const skip = (page - 1) * limit;

    // Validate courseId
    validateObjectId(courseId, "courseId");

    // Check if course exists and populate teacher
    const course = await Course.findById(courseId).populate({
      path: "teacherId",
      select: "teacherCode specialization experienceYears",
      populate: {
        path: "userId",
        select: "firstName lastName email phone isActive"
      }
    });
    
    if (!course) {
      throw new AppError(MESSAGES.COURSE.NOT_FOUND, 404);
    }

    // Role-based access check
    if (user.role === "teacher") {
      // Teacher can only view members of courses they teach
      const teacher = await Teacher.findOne({ userId: user.userId });
      if (!teacher || course.teacherId?._id.toString() !== teacher._id.toString()) {
        throw new AppError(MESSAGES.ERROR.FORBIDDEN, 403);
      }
    } else if (user.role === "student") {
      // Student can only view members of courses they are enrolled in
      const Student = require("../models/student.model");
      const Enrollment = require("../models/enrollment.model");
      
      const student = await Student.findOne({ userId: user.userId });
      if (!student) {
        throw new AppError(MESSAGES.ERROR.STUDENT_PROFILE_NOT_FOUND, 404);
      }
      
      const enrollment = await Enrollment.findOne({ 
        studentId: student._id, 
        courseId,
        status: ENROLLMENT_STATUS.ACTIVE // Only active enrollments
      });
      
      if (!enrollment) {
        throw new AppError(MESSAGES.ERROR.FORBIDDEN, 403);
      }
    }
    // Admin can view all course members

    // Build enrollment query - only active enrollments
    const Enrollment = require("../models/enrollment.model");
    const enrollmentQuery = { courseId, status: ENROLLMENT_STATUS.ACTIVE };

    // Get enrollments with pagination
    const [enrollments, total] = await Promise.all([
      Enrollment.find(enrollmentQuery)
        .populate({
          path: "studentId",
          select: "studentCode currentLevel targetBand",
          populate: {
            path: "userId",
            match: { isActive: true }, // Only active users
            select: "firstName lastName email phone isActive"
          }
        })
        .sort({ enrolledAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Enrollment.countDocuments(enrollmentQuery),
    ]);

    // Filter out enrollments with inactive users
    const activeEnrollments = enrollments.filter(enrollment => 
      enrollment.studentId?.userId?.isActive
    );

    // Format students data
    const students = activeEnrollments.map(enrollment => ({
      enrollmentId: enrollment._id,
      enrolledAt: enrollment.enrolledAt,
      attendanceRate: enrollment.attendanceRate,
      averageScore: enrollment.averageScore,
      student: {
        _id: enrollment.studentId._id,
        studentCode: enrollment.studentId.studentCode,
        currentLevel: enrollment.studentId.currentLevel,
        targetBand: enrollment.studentId.targetBand,
        user: {
          firstName: enrollment.studentId.userId.firstName,
          lastName: enrollment.studentId.userId.lastName,
          email: enrollment.studentId.userId.email,
          phone: enrollment.studentId.userId.phone,
        }
      }
    }));

    // Format teacher data
    const teacher = course.teacherId?.userId?.isActive ? {
      _id: course.teacherId._id,
      teacherCode: course.teacherId.teacherCode,
      specialization: course.teacherId.specialization,
      experienceYears: course.teacherId.experienceYears,
      user: {
        firstName: course.teacherId.userId.firstName,
        lastName: course.teacherId.userId.lastName,
        email: course.teacherId.userId.email,
        phone: course.teacherId.userId.phone,
      }
    } : null;

    return {
      course: {
        _id: course._id,
        name: course.name,
        code: course.code,
        level: course.level,
      },
      teacher,
      students,
      pagination: {
        total: activeEnrollments.length,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(activeEnrollments.length / limit),
      },
    };
  }
  
  /**
   * Enroll multiple students in course
   * @param {string} courseId - Course ID
   * @param {Array<string>} studentIds - Array of Student IDs (from Student collection)
   * @returns {Promise<Object>} Enrollment results with success/failure details
   */
  async enrollStudents(courseId, studentIds) {
    // Validate course ID
    validateObjectId(courseId, "courseId");

    // Validate studentIds is an array
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      throw new AppError("studentIds must be a non-empty array", 400);
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      throw new AppError(MESSAGES.COURSE.NOT_FOUND, 404);
    }

    const Student = require("../models/student.model");
    const Enrollment = require("../models/enrollment.model");
    
    const results = {
      successful: [],
      failed: [],
      summary: {
        total: studentIds.length,
        enrolled: 0,
        failed: 0
      }
    };

    // Process each student
    for (const studentId of studentIds) {
      try {
        // Validate student ID
        validateObjectId(studentId, "studentId");

        // Check if student exists
        const student = await Student.findById(studentId).populate("userId", "firstName lastName email");
        if (!student) {
          results.failed.push({
            studentId,
            reason: "Student not found"
          });
          continue;
        }

        // Check if student is already enrolled
        const existingEnrollment = await Enrollment.findOne({
          courseId,
          studentId,
          status: ENROLLMENT_STATUS.ACTIVE
        });
        
        if (existingEnrollment) {
          results.failed.push({
            studentId,
            studentCode: student.studentCode,
            studentName: `${student.userId.firstName} ${student.userId.lastName}`,
            reason: "Already enrolled in this course"
          });
          continue;
        }

        // Check if course is full
        if (course.maxStudents && course.currentStudents >= course.maxStudents) {
          results.failed.push({
            studentId,
            studentCode: student.studentCode,
            studentName: `${student.userId.firstName} ${student.userId.lastName}`,
            reason: "Course is full"
          });
          continue;
        }

        // Create enrollment
        const enrollment = await Enrollment.create({
          courseId,
          studentId,
          status: ENROLLMENT_STATUS.ACTIVE,
          enrolledAt: new Date()
        });

        // Update course student count
        await Course.findByIdAndUpdate(courseId, {
          $inc: { currentStudents: 1 }
        });

        results.successful.push({
          enrollmentId: enrollment._id,
          studentId: student._id,
          studentCode: student.studentCode,
          studentName: `${student.userId.firstName} ${student.userId.lastName}`,
          enrolledAt: enrollment.enrolledAt
        });
        results.summary.enrolled++;

      } catch (error) {
        results.failed.push({
          studentId,
          reason: error.message || "Unknown error"
        });
      }
    }

    results.summary.failed = results.failed.length;

    // If all failed, throw error
    if (results.summary.enrolled === 0) {
      throw new AppError("Failed to enroll any students", 400);
    }

    return results;
  }

  /**
   * Assign or change teacher for course
   * @param {string} courseId - Course ID
   * @param {string} teacherId - Teacher ID (from Teacher collection)
   * @returns {Promise<Object>} Updated course
   */
  async assignTeacher(courseId, teacherId) {
    // Validate IDs
    validateObjectId(courseId, "courseId");
    validateObjectId(teacherId, "teacherId");

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      throw new AppError(MESSAGES.COURSE.NOT_FOUND, 404);
    }

    // Check if teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new AppError(MESSAGES.ERROR.TEACHER_PROFILE_NOT_FOUND, 404);
    }

    // Update course with new teacher
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { teacherId },
      { new: true, runValidators: true }
    ).populate({
      path: "teacherId",
      select: "teacherCode specialization experienceYears",
      populate: {
        path: "userId",
        select: "firstName lastName email"
      }
    });

    return updatedCourse;
  }
}

module.exports = new CourseService();
