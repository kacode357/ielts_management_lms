// Quiz Attempt Model (Mongoose)
const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     QuizAttempt:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         quizId: { type: string }
 *         studentId: { type: string }
 *         score: { type: number }
 *         startedAt: { type: string, format: date-time }
 *         finishedAt: { type: string, format: date-time }
 *         answers: { type: object }
 */
const quizAttemptSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    score: {
      type: Number,
      min: 0,
    },
    startedAt: {
      type: Date,
    },
    finishedAt: {
      type: Date,
    },
    answers: {
      type: mongoose.Schema.Types.Mixed,
      comment: "Snapshot bài làm của học sinh",
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick lookup
quizAttemptSchema.index({ quizId: 1, studentId: 1 });

const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);

module.exports = QuizAttempt;
