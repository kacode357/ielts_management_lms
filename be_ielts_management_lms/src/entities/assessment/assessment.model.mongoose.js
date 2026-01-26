// Assessment Model (Mongoose)
const mongoose = require("mongoose");

/**
 * @openapi
 * components:
 *   schemas:
 *     Assessment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         studentId:
 *           type: string
 *         classId:
 *           type: string
 *         assessmentType:
 *           type: string
 *         listeningScore:
 *           type: number
 *         readingScore:
 *           type: number
 *         writingScore:
 *           type: number
 *         speakingScore:
 *           type: number
 *         overallBand:
 *           type: number
 */
const assessmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    assessmentType: {
      type: String,
      enum: ["placement", "progress", "mock", "final"],
      required: true,
    },
    assessmentDate: {
      type: Date,
      default: Date.now,
    },
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
    feedback: {
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

const Assessment = mongoose.model("Assessment", assessmentSchema);

module.exports = Assessment;
