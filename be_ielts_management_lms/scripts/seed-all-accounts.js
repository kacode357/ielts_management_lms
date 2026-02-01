// Seed All Default Accounts (Admin, Teachers, Students)
require("dotenv").config();
const mongoose = require("mongoose");
const { ensureAdminUser } = require("../src/db/adminSeeder");
const { ensureDefaultTeachers } = require("../src/db/teacherSeeder");
const { ensureDefaultStudents } = require("../src/db/studentSeeder");

const MONGODB_URI = process.env.MONGODB_URI;

async function seedAllDefaultAccounts() {
  try {
    console.log("🌱 Starting default accounts seeding...");
    console.log("=" .repeat(60));
    
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    // Seed Admin
    console.log("\n" + "=" .repeat(60));
    console.log("👤 ADMIN ACCOUNT");
    console.log("=" .repeat(60));
    await ensureAdminUser();

    // Seed Teachers
    console.log("\n" + "=" .repeat(60));
    console.log("👨‍🏫 TEACHER ACCOUNTS");
    console.log("=" .repeat(60));
    await ensureDefaultTeachers();

    // Seed Students
    console.log("\n" + "=" .repeat(60));
    console.log("👨‍🎓 STUDENT ACCOUNTS");
    console.log("=" .repeat(60));
    await ensureDefaultStudents();

    console.log("\n" + "=" .repeat(60));
    console.log("✨ ALL DEFAULT ACCOUNTS SEEDED SUCCESSFULLY!");
    console.log("=" .repeat(60));
    
    console.log("\n📋 SUMMARY:");
    console.log("  - 1 Admin account");
    console.log("  - 3 Teacher accounts");
    console.log("  - 5 Student accounts");
    
    console.log("\n⚠️  IMPORTANT:");
    console.log("  Please change all default passwords after first login!");
    console.log("  Default password pattern:");
    console.log("    Admin: Admin@123456");
    console.log("    Teachers: Teacher@123456");
    console.log("    Students: Student@123456");

    await mongoose.disconnect();
    console.log("\n✓ Disconnected from MongoDB");
    console.log("=" .repeat(60));
    process.exit(0);
  } catch (error) {
    console.error("\n✗ Error seeding default accounts:", error);
    process.exit(1);
  }
}

seedAllDefaultAccounts();
