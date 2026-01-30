// Student User Seeder
const User = require("../models/user.model");
const Student = require("../models/student.model");
const { USER_ROLES } = require("../constants/enums");

const defaultStudents = [
  {
    user: {
      email: process.env.STUDENT1_EMAIL || "student1@ieltslms.com",
      password: process.env.STUDENT1_PASSWORD || "Student@123456",
      firstName: "Michael",
      lastName: "Brown",
      role: USER_ROLES.STUDENT,
      phone: "0912345671",
      isActive: true,
    },
    student: {
      studentCode: "STD001",
      dateOfBirth: new Date("2000-05-15"),
      currentLevel: "Intermediate",
      targetBand: 7.0,
      address: "123 Main Street, Ho Chi Minh City",
      emergencyContact: "0909876543 (Mr. Brown - Father)",
      notes: "Motivated student with strong listening skills",
      enrollmentDate: new Date("2024-01-15"),
    },
  },
  {
    user: {
      email: process.env.STUDENT2_EMAIL || "student2@ieltslms.com",
      password: process.env.STUDENT2_PASSWORD || "Student@123456",
      firstName: "Emily",
      lastName: "Davis",
      role: USER_ROLES.STUDENT,
      phone: "0912345672",
      isActive: true,
    },
    student: {
      studentCode: "STD002",
      dateOfBirth: new Date("1999-08-22"),
      currentLevel: "Pre-Intermediate",
      targetBand: 6.5,
      address: "456 Second Avenue, Hanoi",
      emergencyContact: "0909876544 (Mrs. Davis - Mother)",
      notes: "Needs improvement in writing and speaking",
      enrollmentDate: new Date("2024-02-01"),
    },
  },
  {
    user: {
      email: process.env.STUDENT3_EMAIL || "student3@ieltslms.com",
      password: process.env.STUDENT3_PASSWORD || "Student@123456",
      firstName: "David",
      lastName: "Wilson",
      role: USER_ROLES.STUDENT,
      phone: "0912345673",
      isActive: true,
    },
    student: {
      studentCode: "STD003",
      dateOfBirth: new Date("2001-03-10"),
      currentLevel: "Upper-Intermediate",
      targetBand: 8.0,
      address: "789 Third Road, Da Nang",
      emergencyContact: "0909876545 (Mr. Wilson - Father)",
      notes: "Advanced learner aiming for high band score",
      enrollmentDate: new Date("2024-01-20"),
    },
  },
  {
    user: {
      email: process.env.STUDENT4_EMAIL || "student4@ieltslms.com",
      password: process.env.STUDENT4_PASSWORD || "Student@123456",
      firstName: "Sophie",
      lastName: "Martinez",
      role: USER_ROLES.STUDENT,
      phone: "0912345674",
      isActive: true,
    },
    student: {
      studentCode: "STD004",
      dateOfBirth: new Date("2002-11-05"),
      currentLevel: "Elementary",
      targetBand: 5.5,
      address: "321 Fourth Street, Ho Chi Minh City",
      emergencyContact: "0909876546 (Mrs. Martinez - Mother)",
      notes: "Beginner student, requires extra support",
      enrollmentDate: new Date("2024-03-01"),
    },
  },
  {
    user: {
      email: process.env.STUDENT5_EMAIL || "student5@ieltslms.com",
      password: process.env.STUDENT5_PASSWORD || "Student@123456",
      firstName: "James",
      lastName: "Anderson",
      role: USER_ROLES.STUDENT,
      phone: "0912345675",
      isActive: true,
    },
    student: {
      studentCode: "STD005",
      dateOfBirth: new Date("1998-07-18"),
      currentLevel: "Intermediate",
      targetBand: 7.5,
      address: "654 Fifth Lane, Can Tho",
      emergencyContact: "0909876547 (Mr. Anderson - Father)",
      notes: "Consistent attendance, good progress",
      enrollmentDate: new Date("2024-02-15"),
    },
  },
];

async function ensureDefaultStudents() {
  try {
    let created = 0;
    let existing = 0;

    for (const demo of defaultStudents) {
      const existingUser = await User.findOne({ email: demo.user.email });

      if (existingUser) {
        existing++;
        continue;
      }

      // Create user account
      const user = await User.create(demo.user);

      // Create student profile
      await Student.create({
        ...demo.student,
        userId: user._id,
      });

      created++;
    }

    return true;
  } catch (error) {
    console.error("\n✗ Error creating default students:", error);
    throw error;
  }
}

module.exports = { ensureDefaultStudents };
