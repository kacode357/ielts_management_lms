// Seed Demo Accounts for Testing
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/entities/auth/auth.model.mongoose");
const Teacher = require("../src/entities/teacher/teacher.model.mongoose");
const Student = require("../src/entities/student/student.model.mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

const demoTeachers = [
  {
    user: {
      email: "teacher1@ieltslms.com",
      password: "Teacher@123",
      firstName: "John",
      lastName: "Smith",
      role: "teacher",
      phone: "0901234567",
      isActive: true,
    },
    teacher: {
      teacherCode: "TCH001",
      specialization: "IELTS Speaking & Writing",
      experience: 5,
      certifications: ["TESOL", "CELTA"],
    },
  },
  {
    user: {
      email: "teacher2@ieltslms.com",
      password: "Teacher@123",
      firstName: "Sarah",
      lastName: "Johnson",
      role: "teacher",
      phone: "0901234568",
      isActive: true,
    },
    teacher: {
      teacherCode: "TCH002",
      specialization: "IELTS Reading & Listening",
      experience: 7,
      certifications: ["TESOL", "DELTA"],
    },
  },
];

const demoStudents = [
  {
    user: {
      email: "student1@ieltslms.com",
      password: "Student@123",
      firstName: "Michael",
      lastName: "Brown",
      role: "student",
      phone: "0912345671",
      isActive: true,
    },
    student: {
      studentCode: "STD001",
      dateOfBirth: new Date("2000-05-15"),
      currentLevel: "intermediate",
      targetBand: 7.0,
    },
  },
  {
    user: {
      email: "student2@ieltslms.com",
      password: "Student@123",
      firstName: "Emily",
      lastName: "Davis",
      role: "student",
      phone: "0912345672",
      isActive: true,
    },
    student: {
      studentCode: "STD002",
      dateOfBirth: new Date("1999-08-22"),
      currentLevel: "pre-intermediate",
      targetBand: 6.5,
    },
  },
];

async function seedDemoAccounts() {
  try {
    console.log("🌱 Starting demo accounts seeding...");
    
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    // Seed Teachers
    console.log("\n👨‍🏫 Seeding teachers...");
    for (const demo of demoTeachers) {
      const existingUser = await User.findOne({ email: demo.user.email });
      
      if (existingUser) {
        console.log(`  ⚠ Teacher ${demo.user.email} already exists`);
        continue;
      }

      const user = await User.create(demo.user);
      await Teacher.create({
        ...demo.teacher,
        userId: user._id,
      });
      
      console.log(`  ✓ Created teacher: ${demo.user.email}`);
    }

    // Seed Students
    console.log("\n👨‍🎓 Seeding students...");
    for (const demo of demoStudents) {
      const existingUser = await User.findOne({ email: demo.user.email });
      
      if (existingUser) {
        console.log(`  ⚠ Student ${demo.user.email} already exists`);
        continue;
      }

      const user = await User.create(demo.user);
      await Student.create({
        ...demo.student,
        userId: user._id,
      });
      
      console.log(`  ✓ Created student: ${demo.user.email}`);
    }

    console.log("\n✨ Demo accounts seeded successfully!");
    console.log("\n📝 Login Credentials:");
    console.log("\n👨‍🏫 Teachers:");
    console.log("  Email: teacher1@ieltslms.com | Password: Teacher@123");
    console.log("  Email: teacher2@ieltslms.com | Password: Teacher@123");
    console.log("\n👨‍🎓 Students:");
    console.log("  Email: student1@ieltslms.com | Password: Student@123");
    console.log("  Email: student2@ieltslms.com | Password: Student@123");

    await mongoose.disconnect();
    console.log("\n✓ Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("\n✗ Error seeding demo accounts:", error);
    process.exit(1);
  }
}

seedDemoAccounts();
