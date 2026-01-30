// Module Model (Mongoose)
const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Module:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         courseId: { type: string }
 *         title: { type: string }
 *         description: { type: string }
 *         orderIndex: { type: number }
 *         isActive: { type: boolean }
 */
const moduleSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      comment: "Ex: Unit 1 - Environment",
    },
    description: {
      type: String,
    },
    orderIndex: {
      type: Number,
      comment: "Thứ tự chương: 1, 2, 3...",
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
moduleSchema.index({ courseId: 1, orderIndex: 1 });

const Module = mongoose.model("Module", moduleSchema);

module.exports = Module;
