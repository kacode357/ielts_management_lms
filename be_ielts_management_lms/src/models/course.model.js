// Course Model (Mongoose)
const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         name: { type: string }
 *         code: { type: string }
 *         description: { type: string }
 *         level: { type: string }
 *         teacherId: { type: string }
 *         startDate: { type: string, format: date }
 *         endDate: { type: string, format: date }
 *         totalHours: { type: number }
 *         room: { type: string }
 *         scheduleDesc: { type: string }
 *         currentStudents: { type: number }
 *         maxStudents: { type: number }
 *         status: { type: string }
 *         isActive: { type: boolean }
 */
const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    level: {
      type: String,
      required: true,
      comment: "Foundation, Pre-IELTS, IELTS 6.0+",
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      comment: "Giáo viên chủ nhiệm (Main Teacher)",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    totalHours: {
      type: Number,
    },
    room: {
      type: String,
    },
    scheduleDesc: {
      type: String,
      comment: "Mô tả lịch học: Mon-Wed-Fri 19:00",
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick lookup
courseSchema.index({ teacherId: 1 });
courseSchema.index({ status: 1 });

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
