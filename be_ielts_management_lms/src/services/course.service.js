// Course Service - MongoDB Driver
const Course = require("../models/course.model");
const Teacher = require("../models/teacher.model");
const Student = require("../models/student.model");
const Enrollment = require("../models/enrollment.model");
const User = require("../models/user.model");
const { AppError } = require("../utils/appError");
const { validateObjectId, validateDateRange } = require("../utils/validation");
const { COURSE_STATUS, ENROLLMENT_STATUS } = require("../constants/enums");

class CourseService {
  async createCourse(courseData, lang = "en") {
    const { name, code, description, level, teacherId, startDate, endDate, totalHours, room, scheduleDesc, maxStudents } = courseData;

    // Validate required fields
    if (!name || !code || !level || !startDate || !endDate) {
      throw new AppError("Name, code, level, startDate and endDate are required", 400);
    }

    validateDateRange(startDate, endDate);

    // Check if teacher exists
    if (teacherId) {
      validateObjectId(teacherId, "teacherId");
      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        throw new AppError("Teacher not found", 404);
      }
    }

    // Check if course code already exists
    const existingCourse = await Course.findOne({ code });
    if (existingCourse) {
      throw new AppError("Course code already exists", 409);
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

    // Get teacher info manually
    let courseWithTeacher = { ...course };
    if (teacherId) {
      const teacher = await Teacher.findById(teacherId);
      if (teacher) {
        courseWithTeacher.teacherId = {
          _id: teacher._id,
          teacherCode: teacher.teacherCode,
          specialization: teacher.specialization,
        };
      }
    }

    return courseWithTeacher;
  }

  async getCourseById(courseId, user, lang = "en") {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new AppError("Course not found", 404);
    }

    // Get teacher info
    let teacherInfo = null;
    if (course.teacherId) {
      const teacher = await Teacher.findById(course.teacherId);
      if (teacher) {
        teacherInfo = {
          _id: teacher._id,
          teacherCode: teacher.teacherCode,
          specialization: teacher.specialization,
          experience: teacher.experience,
          rating: teacher.rating,
        };
      }
    }

    // Role-based access check
    if (user.role === "teacher") {
      const teacher = await Teacher.findOne({ userId: user.userId });
      if (!teacher || course.teacherId?.toString() !== teacher._id.toString()) {
        throw new AppError("Forbidden", 403);
      }
    } else if (user.role === "student") {
      const student = await Student.findOne({ userId: user.userId });
      if (!student) {
        throw new AppError("Student profile not found", 404);
      }
      
      const enrollment = await Enrollment.findOne({ 
        studentId: student._id.toString(), 
        courseId: courseId 
      });
      
      if (!enrollment) {
        throw new AppError("Forbidden", 403);
      }
    }

    return { ...course, teacherId: teacherInfo };
  }

  async getCourses(user, options = {}) {
    const { page = 1, limit = 10, status, level, isActive } = options;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) query.status = status;
    if (level) query.level = level;
    if (isActive !== undefined) query.isActive = isActive === "true";

    // Role-based filtering
    if (user.role === "teacher") {
      const teacher = await Teacher.findOne({ userId: user.userId });
      if (!teacher) {
        throw new AppError("Teacher profile not found", 404);
      }
      query.teacherId = teacher._id.toString();
    } else if (user.role === "student") {
      const student = await Student.findOne({ userId: user.userId });
      if (!student) {
        throw new AppError("Student profile not found", 404);
      }
      
      const enrollments = await Enrollment.find({ studentId: student._id.toString() });
      const courseIds = enrollments.map(e => e.courseId);
      query._id = { $in: courseIds };
    }

    const [courses, total] = await Promise.all([
      Course.find(query).skip(skip).limit(parseInt(limit)),
      Course.count(query),
    ]);

    // Add teacher info to each course
    const coursesWithTeachers = await Promise.all(courses.map(async (course) => {
      let teacherInfo = null;
      if (course.teacherId) {
        const teacher = await Teacher.findById(course.teacherId);
        if (teacher) {
          teacherInfo = {
            _id: teacher._id,
            teacherCode: teacher.teacherCode,
            specialization: teacher.specialization,
            experience: teacher.experience,
            rating: teacher.rating,
          };
        }
      }
      return { ...course, teacherId: teacherInfo };
    }));

    return {
      courses: coursesWithTeachers,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    };
  }

  async updateCourse(courseId, updateData, lang = "en") {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new AppError("Course not found", 404);
    }

    // Validate dates if provided
    if (updateData.startDate || updateData.endDate) {
      const start = updateData.startDate || course.startDate;
      const end = updateData.endDate || course.endDate;
      validateDateRange(start, end);
    }

    // Check teacher exists
    if (updateData.teacherId && updateData.teacherId !== course.teacherId?.toString()) {
      validateObjectId(updateData.teacherId, "teacherId");
      const teacher = await Teacher.findById(updateData.teacherId);
      if (!teacher) {
        throw new AppError("Teacher not found", 404);
      }
    }

    // Update
    const { _id, createdAt, ...updateFields } = updateData;
    await Course.updateById(courseId, updateFields);

    return await this.getCourseById(courseId, { role: "admin" });
  }

  async deleteCourse(courseId, lang = "en") {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new AppError("Course not found", 404);
    }

    await Course.updateById(courseId, { 
      isActive: false, 
      status: COURSE_STATUS.CANCELLED 
    });

    return { message: "Course deleted successfully" };
  }

  async getCourseMembers(courseId, user, options = {}) {
    const { page = 1, limit = 50 } = options;
    const skip = (page - 1) * limit;

    validateObjectId(courseId, "courseId");

    const course = await Course.findById(courseId);
    if (!course) {
      throw new AppError("Course not found", 404);
    }

    // Role-based access check
    if (user.role === "teacher") {
      const teacher = await Teacher.findOne({ userId: user.userId });
      if (!teacher || course.teacherId?.toString() !== teacher._id.toString()) {
        throw new AppError("Forbidden", 403);
      }
    } else if (user.role === "student") {
      const student = await Student.findOne({ userId: user.userId });
      if (!student) {
        throw new AppError("Student profile not found", 404);
      }
      
      const enrollment = await Enrollment.findOne({ 
        studentId: student._id.toString(), 
        courseId,
        status: ENROLLMENT_STATUS.ACTIVE 
      });
      
      if (!enrollment) {
        throw new AppError("Forbidden", 403);
      }
    }

    // Get teacher info
    let teacherInfo = null;
    if (course.teacherId) {
      const teacher = await Teacher.findById(course.teacherId);
      if (teacher) {
        const userInfo = await User.findById(teacher.userId);
        if (userInfo && userInfo.isActive) {
          teacherInfo = {
            _id: teacher._id,
            teacherCode: teacher.teacherCode,
            specialization: teacher.specialization,
            experience: teacher.experience,
            user: {
              firstName: userInfo.firstName,
              lastName: userInfo.lastName,
              email: userInfo.email,
              phone: userInfo.phone,
            }
          };
        }
      }
    }

    // Get enrollments
    const enrollments = await Enrollment.find({ 
      courseId, 
      status: ENROLLMENT_STATUS.ACTIVE 
    }).skip(skip).limit(parseInt(limit));

    // Get students with user info
    const students = await Promise.all(enrollments.map(async (enrollment) => {
      const student = await Student.findById(enrollment.studentId);
      if (!student) return null;
      
      const userInfo = await User.findById(student.userId);
      if (!userInfo || !userInfo.isActive) return null;
      
      return {
        enrollmentId: enrollment._id,
        enrolledAt: enrollment.enrolledAt,
        attendanceRate: enrollment.attendanceRate,
        averageScore: enrollment.averageScore,
        student: {
          _id: student._id,
          studentCode: student.studentCode,
          currentLevel: student.currentLevel,
          targetBand: student.targetBand,
          user: {
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            phone: userInfo.phone,
          }
        }
      };
    }));

    const activeStudents = students.filter(s => s !== null);

    return {
      course: {
        _id: course._id,
        name: course.name,
        code: course.code,
        level: course.level,
      },
      teacher: teacherInfo,
      students: activeStudents,
      pagination: {
        total: activeStudents.length,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(activeStudents.length / limit),
      },
    };
  }

  async enrollStudents(courseId, studentIds) {
    validateObjectId(courseId, "courseId");

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      throw new AppError("studentIds must be a non-empty array", 400);
    }

    const course = await Course.findById(courseId);
    if (!course) {
      throw new AppError("Course not found", 404);
    }

    const results = {
      successful: [],
      failed: [],
      summary: { total: studentIds.length, enrolled: 0, failed: 0 }
    };

    for (const studentId of studentIds) {
      try {
        validateObjectId(studentId, "studentId");

        const student = await Student.findById(studentId);
        if (!student) {
          results.failed.push({ studentId, reason: "Student not found" });
          continue;
        }

        const existingEnrollment = await Enrollment.findOne({
          courseId,
          studentId: student._id.toString(),
          status: ENROLLMENT_STATUS.ACTIVE
        });
        
        if (existingEnrollment) {
          results.failed.push({ studentId, reason: "Already enrolled" });
          continue;
        }

        if (course.maxStudents && course.currentStudents >= course.maxStudents) {
          results.failed.push({ studentId, reason: "Course is full" });
          continue;
        }

        await Enrollment.create({
          courseId,
          studentId: student._id.toString(),
          status: ENROLLMENT_STATUS.ACTIVE,
          enrolledAt: new Date()
        });

        // Update course student count
        await Course.updateById(courseId, { 
          currentStudents: (course.currentStudents || 0) + 1 
        });

        const userInfo = await User.findById(student.userId);
        results.successful.push({
          studentId: student._id,
          studentCode: student.studentCode,
          studentName: userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : ""
        });
        results.summary.enrolled++;

      } catch (error) {
        results.failed.push({ studentId, reason: error.message || "Unknown error" });
      }
    }

    results.summary.failed = results.failed.length;

    if (results.summary.enrolled === 0) {
      throw new AppError("Failed to enroll any students", 400);
    }

    return results;
  }

  async assignTeacher(courseId, teacherId) {
    validateObjectId(courseId, "courseId");
    validateObjectId(teacherId, "teacherId");

    const course = await Course.findById(courseId);
    if (!course) {
      throw new AppError("Course not found", 404);
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new AppError("Teacher not found", 404);
    }

    await Course.updateById(courseId, { teacherId });

    const updatedCourse = await Course.findById(courseId);
    return updatedCourse;
  }
}

module.exports = new CourseService();
