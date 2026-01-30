// Assessment Model (Mongoose)
const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Assessment:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         studentId: { type: string }
 *         courseId: { type: string }
 *         type: { type: string }
 *         date: { type: string, format: date-time }
 *         listeningScore: { type: number }
 *         readingScore: { type: number }
 *         writingScore: { type: number }
 *         speakingScore: { type: number }
 *         overallBand: { type: number }
 *         teacherFeedback: { type: string }
 *         strengths: { type: string }
 *         weaknesses: { type: string }
 */
const assessmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    type: {
      type: String,
      required: true,
      enum: ["placement", "mock_test", "final_exam"],
      comment: "placement (đầu vào), mock_test (thi thử), final_exam",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    // Điểm thành phần
    listeningScore: {
      type: Number,
      min: 0,
      max: 9,
    },
    readingScore: {
      type: Number,
      min: 0,
      max: 9,
    },
    writingScore: {
      type: Number,
      min: 0,
      max: 9,
    },
    speakingScore: {
      type: Number,
      min: 0,
      max: 9,
    },
    overallBand: {
      type: Number,
      min: 0,
      max: 9,
    },
    teacherFeedback: {
      type: String,
    },
    strengths: {
      type: String,
    },
    weaknesses: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick lookup
assessmentSchema.index({ studentId: 1, date: -1 });
assessmentSchema.index({ courseId: 1 });

const Assessment = mongoose.model("Assessment", assessmentSchema);

module.exports = Assessment;
