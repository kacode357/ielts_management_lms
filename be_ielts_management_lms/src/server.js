// Bootstrap: load environment variables and start the HTTP server
require("dotenv").config();

const app = require("./app");
const { initDatabase } = require("./db/init");

const PORT = process.env.PORT || 5000;

/**
 * Initialize database and start the server
 */
async function start() {
  // Connect to MongoDB
  try {
    await initDatabase();
    console.log("✓ MongoDB Connected");
  } catch (err) {
    console.error("✗ Database connection failed:", err.message);
    console.log("→ Vào MongoDB Atlas → Network Access → Thêm IP 0.0.0.0/0");
    process.exit(1);
  }

  // Start HTTP server
  app.listen(PORT, () => {
    console.log(`\n🚀 IELTS Management LMS API`);
    console.log(`   Port: ${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV}`);
    console.log(`   Docs: http://localhost:${PORT}/api-docs`);
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
