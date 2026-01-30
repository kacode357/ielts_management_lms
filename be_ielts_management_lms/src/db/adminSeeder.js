// Admin User Seeder
const User = require("../models/user.model");
const { USER_ROLES } = require("../constants/enums");

async function ensureAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@ieltslms.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";

    // Check if admin exists
    const existingAdmin = await User.findOne({
      email: adminEmail,
      role: USER_ROLES.ADMIN,
    });

    if (existingAdmin) {
      return existingAdmin;
    }

    // Create admin user
    const admin = await User.create({
      email: adminEmail,
      password: adminPassword,
      firstName: "Admin",
      lastName: "User",
      role: USER_ROLES.ADMIN,
      isActive: true,
    });

    return admin;
  } catch (error) {
    console.error("✗ Error creating admin user:", error);
    throw error;
  }
}

module.exports = { ensureAdminUser };
