// Admin User Seeder
const User = require("../models/user.model");

async function ensureAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@ieltslms.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";

    // Check if admin exists
    const existingAdmin = await User.findOne({
      email: adminEmail,
      role: "admin",
    });

    if (existingAdmin) {
      console.log("✓ Admin user already exists");
      return existingAdmin;
    }

    // Create admin user
    const admin = await User.create({
      email: adminEmail,
      password: adminPassword,
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      isActive: true,
    });

    console.log("✓ Admin user created successfully");
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);
    console.log("  ⚠ Please change the default password after first login!");

    return admin;
  } catch (error) {
    console.error("✗ Error creating admin user:", error);
    throw error;
  }
}

module.exports = { ensureAdminUser };
