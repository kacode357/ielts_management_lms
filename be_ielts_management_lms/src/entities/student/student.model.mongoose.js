// Student Model (Mongoose)
const mongoose = require("mongoose");

/**
 * @openapi
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         studentCode:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         currentLevel:
 *           type: string
 *         targetBand:
 *           type: number
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
      unique: true,
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    currentLevel: {
      type: String,
      comment: "Current IELTS level (e.g., Beginner, Intermediate, Advanced)",
    },
    targetBand: {
      type: Number,
      default: 6.5,
      min: 0,
      max: 9,
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

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
