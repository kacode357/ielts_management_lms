// Quick script to delete schedules
require("dotenv").config();
const mongoose = require("mongoose");

async function deleteSchedules() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✓ Connected");

    const courseId = "697f1a2af93107d87401039a";
    const result = await mongoose.connection.db.collection("schedules").deleteMany({
      courseId: new mongoose.Types.ObjectId(courseId)
    });

    console.log(`✓ Deleted ${result.deletedCount} schedules`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

deleteSchedules();
