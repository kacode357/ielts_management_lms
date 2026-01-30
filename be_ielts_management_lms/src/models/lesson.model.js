// Lesson Model (Mongoose)
const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Lesson:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         moduleId: { type: string }
 *         title: { type: string }
 *         type: { type: string }
 *         content: { type: string }
 *         videoUrl: { type: string }
 *         orderIndex: { type: number }
 *         isPublished: { type: boolean }
 */
const lessonSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      comment: "Ex: Reading Strategy - Skimming",
    },
    type: {
      type: String,
      enum: ["lecture", "workshop", "test_review"],
      comment: "lecture, workshop, test_review",
    },
    content: {
      type: String,
      comment: "Nội dung bài học rich text",
    },
    videoUrl: {
      type: String,
    },
    orderIndex: {
      type: Number,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick lookup
lessonSchema.index({ moduleId: 1, orderIndex: 1 });

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;
