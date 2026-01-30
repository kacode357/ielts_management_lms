// Assignment Model (Mongoose)
const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Assignment:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         lessonId: { type: string }
 *         courseId: { type: string }
 *         title: { type: string }
 *         instructions: { type: string }
 *         dueDate: { type: string, format: date-time }
 *         maxScore: { type: number }
 *         files: { type: array }
 *         type: { type: string }
 */
const assignmentSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    instructions: {
      type: String,
    },
    dueDate: {
      type: Date,
    },
    maxScore: {
      type: Number,
      default: 9,
      min: 0,
      max: 9,
    },
    files: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    type: {
      type: String,
      enum: ["essay", "recording", "file_upload"],
      comment: "essay, recording, file_upload",
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick lookup
assignmentSchema.index({ lessonId: 1 });
assignmentSchema.index({ courseId: 1 });
assignmentSchema.index({ dueDate: 1 });

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
