// Rubric Score Model (Mongoose)
const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     RubricScore:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         submissionId: { type: string }
 *         criteriaName: { type: string }
 *         score: { type: number }
 *         comment: { type: string }
 */
const rubricScoreSchema = new mongoose.Schema(
  {
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
    },
    criteriaName: {
      type: String,
      comment: "VD: Grammatical Range & Accuracy",
    },
    score: {
      type: Number,
      min: 0,
      max: 9,
      comment: "VD: 6.5",
    },
    comment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick lookup
rubricScoreSchema.index({ submissionId: 1 });

const RubricScore = mongoose.model("RubricScore", rubricScoreSchema);

module.exports = RubricScore;
