// Initialize database connection
const { connectDB } = require("./mongoose");
const { ensureAdminUser } = require("./adminSeeder");
const { ensureDefaultTeachers } = require("./teacherSeeder");
const { ensureDefaultStudents } = require("./studentSeeder");
const { ensureDefaultCourseLevels } = require("./courseLevelSeeder");

async function initDatabase() {
  try {
    // Connect to MongoDB
    const connection = await connectDB();

    // Seed default accounts and data (silent mode)
    await ensureAdminUser();
    await ensureDefaultTeachers();
    await ensureDefaultStudents();
    await ensureDefaultCourseLevels();
    
    console.log("✓ Database initialized successfully");

    return connection;
  } catch (error) {
    console.error("✗ Unable to connect to the database:", error);
    throw error;
  }
}

module.exports = { initDatabase };
