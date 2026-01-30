// Submission Model (Mongoose)
const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Submission:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         assignmentId: { type: string }
 *         studentId: { type: string }
 *         content: { type: string }
 *         files: { type: array }
 *         submittedAt: { type: string, format: date-time }
 *         status: { type: string }
 *         score: { type: number }
 *         feedback: { type: string }
 *         gradedBy: { type: string }
 *         gradedAt: { type: string, format: date-time }
 */
const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    content: {
      type: String,
    },
    files: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["submitted", "graded", "late"],
      default: "submitted",
    },
    score: {
      type: Number,
      min: 0,
      max: 9,
      comment: "Điểm tổng (Overall) 0-9",
    },
    feedback: {
      type: String,
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    gradedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick lookup
submissionSchema.index({ assignmentId: 1, studentId: 1 });
submissionSchema.index({ gradedBy: 1 });

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;
