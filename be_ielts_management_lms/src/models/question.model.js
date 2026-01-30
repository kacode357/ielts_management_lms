// Question Model (Mongoose)
const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         quizId: { type: string }
 *         content: { type: string }
 *         type: { type: string }
 *         options: { type: array }
 *         correctAnswer: { type: object }
 *         explanation: { type: string }
 *         audioUrl: { type: string }
 *         points: { type: number }
 */
const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["multiple_choice", "fill_blank", "true_false"],
      comment: "multiple_choice, fill_blank, true_false",
    },
    options: {
      type: [mongoose.Schema.Types.Mixed],
      comment: "Danh sách đáp án",
    },
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
    },
    explanation: {
      type: String,
    },
    audioUrl: {
      type: String,
      comment: "Dành cho Listening",
    },
    points: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick lookup
questionSchema.index({ quizId: 1 });

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
