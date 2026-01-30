// Initialize database connection
const connectDB = require("./mongoose");
const { ensureAdminUser } = require("./adminSeeder");

async function initDatabase() {
  try {
    // Connect to MongoDB
    const connection = await connectDB();
    console.log("✓ Database connection established successfully");

    // Create default admin user
    await ensureAdminUser();
    console.log("✓ Database initialized successfully");

    return connection;
  } catch (error) {
    console.error("✗ Unable to connect to the database:", error);
    throw error;
  }
}

module.exports = { initDatabase };
