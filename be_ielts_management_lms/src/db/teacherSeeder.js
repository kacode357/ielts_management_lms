// Teacher User Seeder
const User = require("../models/user.model");
const Teacher = require("../models/teacher.model");
const { USER_ROLES } = require("../constants/enums");

const defaultTeachers = [
  {
    user: {
      email: process.env.TEACHER1_EMAIL || "teacher1@ieltslms.com",
      password: process.env.TEACHER1_PASSWORD || "Teacher@123456",
      firstName: "John",
      lastName: "Smith",
      role: USER_ROLES.TEACHER,
      phone: "0901234567",
      isActive: true,
    },
    teacher: {
      teacherCode: "TCH001",
      specialization: "IELTS Speaking & Writing",
      experience: 5,
      certifications: ["TESOL", "CELTA"],
      bio: "Experienced IELTS instructor specializing in Speaking and Writing modules",
      rating: 4.5,
      hireDate: new Date("2020-01-15"),
    },
  },
  {
    user: {
      email: process.env.TEACHER2_EMAIL || "teacher2@ieltslms.com",
      password: process.env.TEACHER2_PASSWORD || "Teacher@123456",
      firstName: "Sarah",
      lastName: "Johnson",
      role: USER_ROLES.TEACHER,
      phone: "0901234568",
      isActive: true,
    },
    teacher: {
      teacherCode: "TCH002",
      specialization: "IELTS Reading & Listening",
      experience: 7,
      certifications: ["TESOL", "DELTA"],
      bio: "Expert in IELTS Reading and Listening with 7 years of teaching experience",
      rating: 4.8,
      hireDate: new Date("2018-06-20"),
    },
  },
  {
    user: {
      email: process.env.TEACHER3_EMAIL || "teacher3@ieltslms.com",
      password: process.env.TEACHER3_PASSWORD || "Teacher@123456",
      firstName: "Michael",
      lastName: "Chen",
      role: USER_ROLES.TEACHER,
      phone: "0901234569",
      isActive: true,
    },
    teacher: {
      teacherCode: "TCH003",
      specialization: "IELTS General",
      experience: 4,
      certifications: ["TESOL"],
      bio: "All-around IELTS instructor covering all modules",
      rating: 4.3,
      hireDate: new Date("2021-03-10"),
    },
  },
];

async function ensureDefaultTeachers() {
  try {
    let created = 0;
    let existing = 0;

    for (const demo of defaultTeachers) {
      const existingUser = await User.findOne({ email: demo.user.email });

      if (existingUser) {
        existing++;
        continue;
      }

      // Create user account
      const user = await User.create(demo.user);

      // Create teacher profile
      await Teacher.create({
        ...demo.teacher,
        userId: user._id,
      });

      created++;
    }

    return true;
  } catch (error) {
    console.error("\n✗ Error creating default teachers:", error);
    throw error;
  }
}

module.exports = { ensureDefaultTeachers };
