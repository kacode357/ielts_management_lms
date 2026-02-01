// Teacher Model (Mongoose)
const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         userId: { type: string }
 *         teacherCode: { type: string }
 *         specialization: { type: string }
 *         experience: { type: number }
 *         certifications: { type: array }
 *         bio: { type: string }
 *         rating: { type: number }
 *         hireDate: { type: string, format: date-time }
 */
const teacherSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teacherCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    specialization: {
      type: String,
      comment: "IELTS Writing, Speaking, General...",
    },
    experience: {
      type: Number,
      default: 0,
      comment: "Years of experience",
    },
    certifications: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    bio: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    hireDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick lookup
teacherSchema.index({ userId: 1 });

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
