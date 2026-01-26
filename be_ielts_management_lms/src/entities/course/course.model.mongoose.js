// Course Model (Mongoose)
const mongoose = require("mongoose");

/**
 * @openapi
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         code:
 *           type: string
 *         level:
 *           type: string
 *         duration:
 *           type: integer
 *         price:
 *           type: number
 */
const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
    },
    description: {
      type: String,
    },
    level: {
      type: String,
      required: true,
      comment: "Target IELTS level (e.g., 5.0-6.0, 6.5-7.5)",
    },
    duration: {
      type: Number,
      required: true,
      comment: "Course duration in weeks",
    },
    totalHours: {
      type: Number,
      comment: "Total teaching hours",
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    maxStudents: {
      type: Number,
      default: 30,
    },
    syllabus: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
