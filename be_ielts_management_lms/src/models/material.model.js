// Material Model (Mongoose)
const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Material:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         lessonId: { type: string }
 *         courseId: { type: string }
 *         uploadedBy: { type: string }
 *         title: { type: string }
 *         type: { type: string }
 *         fileUrl: { type: string }
 *         fileSize: { type: number }
 */
const materialSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      comment: "Nếu tài liệu chung cho khóa, ko thuộc bài nào",
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["pdf", "docx", "mp3", "mp4", "link"],
      comment: "pdf, docx, mp3, mp4, link",
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      comment: "File size in bytes",
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick lookup
materialSchema.index({ lessonId: 1 });
materialSchema.index({ courseId: 1 });

const Material = mongoose.model("Material", materialSchema);

module.exports = Material;
