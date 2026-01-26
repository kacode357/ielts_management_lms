// Class Model (Mongoose)
const mongoose = require("mongoose");

/**
 * @openapi
 * components:
 *   schemas:
 *     Class:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         courseId:
 *           type: string
 *         teacherId:
 *           type: string
 *         className:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 */
const classSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    className: {
      type: String,
      required: true,
    },
    classCode: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    schedule: {
      type: String,
      comment: "Class schedule (e.g., Mon/Wed/Fri 18:00-20:00)",
    },
    room: {
      type: String,
    },
    currentStudents: {
      type: Number,
      default: 0,
    },
    maxStudents: {
      type: Number,
      default: 30,
    },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
  }
);

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
