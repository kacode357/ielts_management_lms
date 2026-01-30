// Quiz Model (Mongoose)
const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Quiz:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         lessonId: { type: string }
 *         title: { type: string }
 *         description: { type: string }
 *         timeLimit: { type: number }
 *         passScore: { type: number }
 *         totalPoints: { type: number }
 *         type: { type: string }
 */
const quizSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
    },
    timeLimit: {
      type: Number,
      comment: "Phút",
    },
    passScore: {
      type: Number,
      min: 0,
    },
    totalPoints: {
      type: Number,
    },
    type: {
      type: String,
      enum: ["practice", "graded"],
      comment: "practice, graded",
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick lookup
quizSchema.index({ lessonId: 1 });

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
