// Attendance Model (Mongoose)
const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Attendance:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         scheduleId: { type: string }
 *         studentId: { type: string }
 *         status: { type: string }
 *         notes: { type: string }
 *         recordedBy: { type: string }
 *         recordedAt: { type: string, format: date-time }
 */
const attendanceSchema = new mongoose.Schema(
  {
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "excused"],
      default: "present",
    },
    notes: {
      type: String,
    },
    // Ai là người điểm danh? (Để tính KPI/Lương cho đúng người)
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      comment: "Để tính KPI/Lương cho đúng người",
    },
    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Unique constraint for scheduleId and studentId combination
attendanceSchema.index({ scheduleId: 1, studentId: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
