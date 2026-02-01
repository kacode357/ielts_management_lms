// Student Model (Mongoose)
const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         userId: { type: string }
 *         studentCode: { type: string }
 *         dateOfBirth: { type: string, format: date }
 *         currentLevel: { type: string }
 *         targetBand: { type: number }
 *         address: { type: string }
 *         emergencyContact: { type: string }
 *         notes: { type: string }
 *         enrollmentDate: { type: string, format: date-time }
 */
const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    currentLevel: {
      type: String,
      comment: "Trình độ hiện tại (Input)",
    },
    targetBand: {
      type: Number,
      default: 6.5,
      min: 0,
      max: 9,
      comment: "Mục tiêu: 0-9",
    },
    address: {
      type: String,
    },
    emergencyContact: {
      type: String,
    },
    notes: {
      type: String,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick lookup
studentSchema.index({ userId: 1 });

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
