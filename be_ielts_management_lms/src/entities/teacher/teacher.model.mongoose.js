// Teacher Model (Mongoose)
const mongoose = require("mongoose");

/**
 * @openapi
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         teacherCode:
 *           type: string
 *         specialization:
 *           type: string
 *         experience:
 *           type: integer
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
      unique: true,
      required: true,
    },
    specialization: {
      type: String,
      comment: "Teaching specialization (e.g., Speaking, Writing, All skills)",
    },
    experience: {
      type: Number,
      comment: "Years of teaching experience",
    },
    certifications: {
      type: String,
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
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
