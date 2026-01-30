// Seed sample data for testing
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/user.model");
const Student = require("../src/models/student.model");
const Teacher = require("../src/models/teacher.model");
const Course = require("../src/models/course.model");
const Enrollment = require("../src/models/enrollment.model");
const Schedule = require("../src/models/schedule.model");
const {
  COURSE_STATUS,
  ENROLLMENT_STATUS
} = require("../src/constants/enums");

async function seedData() {
  let connection = null;
  try {
    // Connect to database
    connection = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ielts_lms_db");
    console.log("✓ Database connected");

    // Get existing users
    const teachers = await Teacher.find().populate("userId");
    const students = await Student.find().populate("userId");

    if (!teachers.length || !students.length) {
      console.log("❌ No teachers or students found. Please run reset script first!");
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log(`✓ Found ${teachers.length} teachers and ${students.length} students`);

    // Create multiple courses for testing
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    // Course 1: Active course with schedule TODAY for attendance testing
    const course1 = await Course.create({
      name: "IELTS Foundation - Band 5.0-6.0",
      code: "IELTS-FOUND-01",
      description: "Foundation course for beginners targeting band 5.0-6.0. All skills covered.",
      level: "Foundation",
      teacherId: teachers[0]._id,
      startDate: new Date(today.getFullYear(), today.getMonth(), 1), // Start of this month
      endDate: new Date(today.getFullYear(), today.getMonth() + 3, 0), // 3 months later
      totalHours: 60,
      room: "Room 101",
      scheduleDesc: "Mon/Wed/Fri 18:00-20:00",
      maxStudents: 20,
      currentStudents: 0,
      status: COURSE_STATUS.ONGOING,
      isActive: true,
    });

    // Course 2: Intermediate course with substitute teacher
    const course2 = await Course.create({
      name: "IELTS Intermediate - Band 6.5-7.5",
      code: "IELTS-INT-01",
      description: "Intermediate course for students targeting band 6.5-7.5",
      level: "Intermediate",
      teacherId: teachers[1]._id,
      startDate: new Date(today.getFullYear(), today.getMonth(), 1),
      endDate: new Date(today.getFullYear(), today.getMonth() + 2, 0),
      totalHours: 50,
      room: "Room 201",
      scheduleDesc: "Tue/Thu 19:00-21:00",
      maxStudents: 15,
      currentStudents: 0,
      status: COURSE_STATUS.ONGOING,
      isActive: true,
    });

    // Course 3: Advanced course
    const course3 = await Course.create({
      name: "IELTS Advanced - Band 8.0+",
      code: "IELTS-ADV-01",
      description: "Advanced course for students targeting band 8.0 and above",
      level: "Advanced",
      teacherId: teachers[2] ? teachers[2]._id : teachers[0]._id,
      startDate: nextWeek,
      endDate: new Date(nextWeek.getFullYear(), nextWeek.getMonth() + 2, 0),
      totalHours: 40,
      room: "Room 301",
      scheduleDesc: "Sat/Sun 09:00-12:00",
      maxStudents: 10,
      currentStudents: 0,
      status: COURSE_STATUS.SCHEDULED,
      isActive: true,
    });

    // Course 4: Completed course
    const pastStart = new Date(today);
    pastStart.setMonth(pastStart.getMonth() - 3);
    const pastEnd = new Date(today);
    pastEnd.setDate(pastEnd.getDate() - 7);

    const course4 = await Course.create({
      name: "IELTS Foundation - Completed Class",
      code: "IELTS-FOUND-PAST",
      description: "Completed foundation course",
      level: "Foundation",
      teacherId: teachers[0]._id,
      startDate: pastStart,
      endDate: pastEnd,
      totalHours: 60,
      room: "Room 102",
      scheduleDesc: "Mon/Wed/Fri 18:00-20:00",
      maxStudents: 20,
      currentStudents: 5,
      status: COURSE_STATUS.COMPLETED,
      isActive: false,
    });

    console.log("✓ Created 4 courses");

    // Enroll students in Course 1 (for attendance testing)
    for (let i = 0; i < Math.min(5, students.length); i++) {
      await Enrollment.create({
        courseId: course1._id,
        studentId: students[i]._id,
        status: ENROLLMENT_STATUS.ACTIVE,
        enrolledAt: new Date(today.getFullYear(), today.getMonth(), 1),
        attendanceRate: 0,
        averageScore: 0,
      });
    }
    await Course.findByIdAndUpdate(course1._id, { currentStudents: 5 });
    console.log("✓ Enrolled 5 students in Course 1");

    // Enroll students in Course 2
    for (let i = 2; i < Math.min(5, students.length); i++) {
      await Enrollment.create({
        courseId: course2._id,
        studentId: students[i]._id,
        status: ENROLLMENT_STATUS.ACTIVE,
        enrolledAt: new Date(today.getFullYear(), today.getMonth(), 1),
        attendanceRate: 0,
        averageScore: 0,
      });
    }
    await Course.findByIdAndUpdate(course2._id, { currentStudents: 3 });
    console.log("✓ Enrolled 3 students in Course 2");

    // Create schedules for Course 1 (including TODAY for testing)
    const schedules = [];
    
    // Schedule 1: TODAY - for attendance testing (main teacher)
    schedules.push({
      courseId: course1._id,
      sessionNumber: 5,
      title: "Session 5: Reading Skills - Matching Headings",
      date: today,
      startTime: "18:00",
      endTime: "20:00",
      room: "Room 101",
      // No substituteTeacherId - main teacher will teach
    });

    // Schedule 2: TOMORROW - scheduled
    schedules.push({
      courseId: course1._id,
      sessionNumber: 6,
      title: "Session 6: Writing Task 1 - Line Graphs",
      date: tomorrow,
      startTime: "18:00",
      endTime: "20:00",
      room: "Room 101",
    });

    // Schedule 3: Yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    schedules.push({
      courseId: course1._id,
      sessionNumber: 4,
      title: "Session 4: Listening Section 3 & 4",
      date: yesterday,
      startTime: "18:00",
      endTime: "20:00",
      room: "Room 101",
    });

    // Schedule 4: Course 2 - TODAY with SUBSTITUTE teacher
    schedules.push({
      courseId: course2._id,
      substituteTeacherId: teachers[2] ? teachers[2]._id : teachers[0]._id, // Teacher 3 substitutes for Teacher 2
      internalNotes: "Teacher 2 is on leave, Teacher 3 will substitute this session",
      sessionNumber: 8,
      title: "Session 8: Speaking Part 2 - Cue Cards",
      date: today,
      startTime: "19:00",
      endTime: "21:00",
      room: "Room 201",
    });

    // Schedule 5: Course 2 - Next week (normal)
    schedules.push({
      courseId: course2._id,
      sessionNumber: 9,
      title: "Session 9: Writing Task 2 - Opinion Essays",
      date: nextWeek,
      startTime: "19:00",
      endTime: "21:00",
      room: "Room 201",
    });

    // Schedule 6: Course 3 - Future schedule
    schedules.push({
      courseId: course3._id,
      sessionNumber: 1,
      title: "Session 1: Course Introduction & Diagnostic Test",
      date: nextWeek,
      startTime: "09:00",
      endTime: "12:00",
      room: "Room 301",
    });

    await Schedule.insertMany(schedules);
    console.log("✓ Created 6 schedules (2 for TODAY - 1 main teacher, 1 substitute)");

    console.log("\n🎉 Seed data completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - 4 Courses (active, with substitute, advanced, completed)`);
    console.log(`   - 8 Enrollments (5 in Course 1, 3 in Course 2)`);
    console.log(`   - 6 Schedules`);
    console.log(`   - 2 Schedules TODAY:`);
    console.log(`     * Course 1 (${course1.code}) - Main Teacher: ${teachers[0].teacherCode}`);
    console.log(`     * Course 2 (${course2.code}) - Substitute Teacher: ${teachers[2] ? teachers[2].teacherCode : teachers[0].teacherCode}`);
    console.log("\n🧪 Test Cases:");
    console.log("   1. Teacher 1 can take attendance for Course 1 today (main teacher)");
    console.log("   2. Teacher 3 can take attendance for Course 2 today (substitute)");
    console.log("   3. Teacher 2 CANNOT take attendance for Course 2 today (has substitute)");
    console.log("   4. Students can view their attendance history");
    console.log("   5. Admin can view/manage all attendance");

    await mongoose.connection.close();
    console.log("\n✓ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed data failed:", error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

// Only run if called directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;

