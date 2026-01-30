// Course Level Model - For managing course levels dynamically
const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     CourseLevel:
 *       type: object
 *       required:
 *         - name
 *         - code
 *       properties:
 *         _id: { type: string }
 *         name: { type: string, description: "Display name (e.g., Foundation, IELTS 6.5)" }
 *         code: { type: string, description: "Unique code (e.g., FOUNDATION, IELTS_6_5)" }
 *         description: { type: string }
 *         order: { type: number, description: "Sort order for display" }
 *         isActive: { type: boolean, default: true }
 */
const courseLevelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
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

// Index for sorting and filtering
courseLevelSchema.index({ order: 1, name: 1 });
courseLevelSchema.index({ isActive: 1 });

module.exports = mongoose.model("CourseLevel", courseLevelSchema);
