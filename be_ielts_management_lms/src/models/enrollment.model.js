// Enrollment Model (Mongoose)
const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Enrollment:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         courseId: { type: string }
 *         studentId: { type: string }
 *         enrolledAt: { type: string, format: date-time }
 *         status: { type: string }
 *         attendanceRate: { type: number }
 *         averageScore: { type: number }
 */
const enrollmentSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "completed", "dropped"],
      default: "active",
    },
    attendanceRate: {
      type: Number,
      min: 0,
      max: 100,
    },
    averageScore: {
      type: Number,
      min: 0,
      max: 9,
    },
  },
  {
    timestamps: true,
  }
);

// Unique constraint for courseId and studentId combination
enrollmentSchema.index({ courseId: 1, studentId: 1 }, { unique: true });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

module.exports = Enrollment;
