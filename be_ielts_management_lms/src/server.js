// Bootstrap: load environment variables and start the HTTP server
require("dotenv").config();

const app = require("./app");
const { initDatabase } = require("./db/init");

const PORT = process.env.PORT || 3001;

/**
 * Initialize database and start the server
 */
async function start() {
  try {
    // Connect to PostgreSQL database
    await initDatabase();
    
    // Ensure admin user exists
    const { ensureAdminUser } = require("./entities/auth/adminSeeder");
    await ensureAdminUser();
    
    console.log("✓ Database initialized successfully");
  } catch (err) {
    const allowStartWithoutDb =
      String(process.env.ALLOW_START_WITHOUT_DB || "")
        .trim()
        .toLowerCase() === "true";
    
    if (!allowStartWithoutDb) {
      console.error("✗ Database initialization failed:", err.message);
      throw err;
    }

    console.warn(
      "⚠ DB init failed but ALLOW_START_WITHOUT_DB=true, continuing without DB:",
      err && err.message ? err.message : err
    );
  }

  // Start HTTP server
  app.listen(PORT, () => {
    console.log(`\n🚀 IELTS Management LMS API is running on port ${PORT}`);
    console.log(`📚 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    
    // Show Swagger docs URL only in development
    if (process.env.NODE_ENV === "development" && 
        String(process.env.SWAGGER_UI_ENABLED || "true").toLowerCase() === "true") {
      console.log(`📖 API Documentation: http://localhost:${PORT}/api-docs`);
    }
    console.log("");
  });
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err);
  process.exit(1);
});

start();
