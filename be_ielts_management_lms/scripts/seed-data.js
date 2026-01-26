// Seed sample data for testing
require("dotenv").config();
const { initDatabase } = require("../src/db/init");
const User = require("../src/entities/auth/auth.model.mongoose");
const Student = require("../src/entities/student/student.model.mongoose");
const Teacher = require("../src/entities/teacher/teacher.model.mongoose");
const Course = require("../src/entities/course/course.model.mongoose");
const Class = require("../src/entities/class/class.model.mongoose");

async function seedData() {
  try {
    await initDatabase();
    console.log("✓ Database connected");

    // Create sample teacher
    const teacherUser = await User.create({
      email: "teacher@ieltslms.com",
      password: "Teacher@123",
      firstName: "John",
      lastName: "Smith",
      role: "teacher",
      phone: "0123456789",
    });

    const teacher = await Teacher.create({
      userId: teacherUser._id,
      teacherCode: "TEA001",
      specialization: "All Skills",
      experience: 5,
      certifications: "CELTA, TESOL",
      bio: "Experienced IELTS teacher with 5 years of teaching",
    });

    console.log("✓ Created sample teacher");

    // Create sample students
    for (let i = 1; i <= 3; i++) {
      const studentUser = await User.create({
        email: `student${i}@ieltslms.com`,
        password: "Student@123",
        firstName: `Student`,
        lastName: `${i}`,
        role: "student",
      });

      await Student.create({
        userId: studentUser._id,
        studentCode: `STU00${i}`,
        currentLevel: "Intermediate",
        targetBand: 6.5 + i * 0.5,
      });
    }

    console.log("✓ Created 3 sample students");

    // Create sample courses
    const course1 = await Course.create({
      name: "IELTS Foundation (Band 5.0-6.0)",
      code: "IELTS-FOUND",
      description: "Foundation course for beginners targeting band 5.0-6.0",
      level: "5.0-6.0",
      duration: 12,
      totalHours: 48,
      price: 3000000,
      maxStudents: 20,
    });

    const course2 = await Course.create({
      name: "IELTS Intermediate (Band 6.5-7.5)",
      code: "IELTS-INT",
      description: "Intermediate course for students targeting band 6.5-7.5",
      level: "6.5-7.5",
      duration: 10,
      totalHours: 40,
      price: 4000000,
      maxStudents: 15,
    });

    console.log("✓ Created 2 sample courses");

    // Create sample class
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 84); // 12 weeks

    await Class.create({
      courseId: course1._id,
      teacherId: teacher._id,
      className: "IELTS Foundation - Class A",
      classCode: "FOUND-A-2026",
      startDate,
      endDate,
      schedule: "Mon/Wed/Fri 18:00-20:00",
      room: "Room 101",
      maxStudents: 20,
    });

    console.log("✓ Created sample class");

    console.log("\n🎉 Seed data completed successfully!");
    console.log("\nSample accounts:");
    console.log("- Teacher: teacher@ieltslms.com / Teacher@123");
    console.log("- Student 1: student1@ieltslms.com / Student@123");
    console.log("- Student 2: student2@ieltslms.com / Student@123");
    console.log("- Student 3: student3@ieltslms.com / Student@123\n");

    process.exit(0);
  } catch (error) {
    console.error("✗ Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
