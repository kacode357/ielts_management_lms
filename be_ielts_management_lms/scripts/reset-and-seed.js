// Reset Database and Seed Default Data
// Use this script when you need to reset everything for a fresh start

require("dotenv").config();
const mongoose = require("mongoose");
const readline = require("readline");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ielts_lms_db";

// Import all models
const User = require("../src/models/user.model");
const Teacher = require("../src/models/teacher.model");
const Student = require("../src/models/student.model");
const Course = require("../src/models/course.model");
const Enrollment = require("../src/models/enrollment.model");
const Schedule = require("../src/models/schedule.model");
const Lesson = require("../src/models/lesson.model");
const Module = require("../src/models/module.model");
const Material = require("../src/models/material.model");
const Attendance = require("../src/models/attendance.model");
const Quiz = require("../src/models/quiz.model");
const Question = require("../src/models/question.model");
const QuizAttempt = require("../src/models/quizAttempt.model");
const Assignment = require("../src/models/assignment.model");
const Submission = require("../src/models/submission.model");
const Assessment = require("../src/models/assessment.model");
const RubricScore = require("../src/models/rubricScore.model");

// Import seeders
const { ensureAdminUser } = require("../src/db/adminSeeder");
const { ensureDefaultTeachers } = require("../src/db/teacherSeeder");
const { ensureDefaultStudents } = require("../src/db/studentSeeder");

async function confirmReset() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question("\n⚠️  WARNING: This will DELETE ALL DATA in the database!\nType 'YES' to confirm: ", (answer) => {
      rl.close();
      resolve(answer === "YES");
    });
  });
}

async function dropAllCollections() {
  console.log("\n🗑️  Dropping all collections...");
  
  const collections = [
    { model: RubricScore, name: "RubricScore" },
    { model: Assessment, name: "Assessment" },
    { model: Submission, name: "Submission" },
    { model: Assignment, name: "Assignment" },
    { model: QuizAttempt, name: "QuizAttempt" },
    { model: Question, name: "Question" },
    { model: Quiz, name: "Quiz" },
    { model: Attendance, name: "Attendance" },
    { model: Material, name: "Material" },
    { model: Lesson, name: "Lesson" },
    { model: Module, name: "Module" },
    { model: Schedule, name: "Schedule" },
    { model: Enrollment, name: "Enrollment" },
    { model: Course, name: "Course" },
    { model: Student, name: "Student" },
    { model: Teacher, name: "Teacher" },
    { model: User, name: "User" },
  ];

  for (const { model, name } of collections) {
    try {
      await model.deleteMany({});
      console.log(`   ✓ Cleared ${name}`);
    } catch (err) {
      console.log(`   ⚠ Could not clear ${name}: ${err.message}`);
    }
  }
}

async function seedDefaultData() {
  console.log("\n🌱 Seeding default data...");
  
  // Seed Admin
  console.log("\n   👤 Creating admin account...");
  await ensureAdminUser();
  console.log("   ✓ Admin created");

  // Seed Teachers
  console.log("\n   👨‍🏫 Creating teacher accounts...");
  await ensureDefaultTeachers();
  console.log("   ✓ Teachers created");

  // Seed Students
  console.log("\n   👨‍🎓 Creating student accounts...");
  await ensureDefaultStudents();
  console.log("   ✓ Students created");
}

async function main() {
  console.log("=" .repeat(60));
  console.log("🔄 IELTS LMS - Database Reset & Seed Script");
  console.log("=" .repeat(60));
  console.log(`\n📍 Database: ${MONGODB_URI}`);

  // Check for --force flag to skip confirmation
  const forceMode = process.argv.includes("--force") || process.argv.includes("-f");

  if (!forceMode) {
    const confirmed = await confirmReset();
    if (!confirmed) {
      console.log("\n❌ Reset cancelled.");
      process.exit(0);
    }
  } else {
    console.log("\n⚡ Force mode enabled - skipping confirmation");
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("\n✓ Connected to MongoDB");

    // Drop all collections
    await dropAllCollections();

    // Seed default data
    await seedDefaultData();

    // Summary
    console.log("\n" + "=" .repeat(60));
    console.log("✨ DATABASE RESET COMPLETE!");
    console.log("=" .repeat(60));
    
    console.log("\n📋 Default Accounts Created:");
    console.log("   ┌─────────────────────────────────────────────────┐");
    console.log("   │ Role      │ Email                   │ Password │");
    console.log("   ├─────────────────────────────────────────────────┤");
    console.log("   │ Admin     │ admin@ieltslms.com      │ Admin@123456    │");
    console.log("   │ Teacher 1 │ teacher1@ieltslms.com   │ Teacher@123456  │");
    console.log("   │ Teacher 2 │ teacher2@ieltslms.com   │ Teacher@123456  │");
    console.log("   │ Teacher 3 │ teacher3@ieltslms.com   │ Teacher@123456  │");
    console.log("   │ Student 1 │ student1@ieltslms.com   │ Student@123456  │");
    console.log("   │ Student 2 │ student2@ieltslms.com   │ Student@123456  │");
    console.log("   │ Student 3 │ student3@ieltslms.com   │ Student@123456  │");
    console.log("   │ Student 4 │ student4@ieltslms.com   │ Student@123456  │");
    console.log("   │ Student 5 │ student5@ieltslms.com   │ Student@123456  │");
    console.log("   └─────────────────────────────────────────────────┘");
    
    console.log("\n💡 Note: Kafka and Redis caches are automatically cleared");
    console.log("   on application restart. No manual reset needed.");

    await mongoose.disconnect();
    console.log("\n✓ Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("\n✗ Error:", error.message);
    process.exit(1);
  }
}

main();
