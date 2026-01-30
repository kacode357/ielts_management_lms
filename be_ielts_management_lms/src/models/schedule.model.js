// Schedule Model (Mongoose)
const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Schedule:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         courseId: { type: string }
 *         lessonId: { type: string }
 *         substituteTeacherId: { type: string }
 *         internalNotes: { type: string }
 *         sessionNumber: { type: number }
 *         title: { type: string }
 *         date: { type: string, format: date }
 *         startTime: { type: string }
 *         endTime: { type: string }
 *         room: { type: string }
 *         meetingUrl: { type: string }
 *         isCancelled: { type: boolean, description: "Only for exceptional cases like teacher sick" }
 */
const scheduleSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      comment: "Bài học dự kiến cho buổi này",
    },
    // --- LOGIC DẠY THAY ---
    substituteTeacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      comment: "Nếu có ID thì GV này dạy thay buổi này",
    },
    internalNotes: {
      type: String,
      comment: "Lý do dạy thay, ghi chú nội bộ",
    },
    // ----------------------
    sessionNumber: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    room: {
      type: String,
    },
    // Only for exceptional cases - normal status is computed from date
    isCancelled: {
      type: Boolean,
      default: false,
      comment: "Hủy buổi học (GV ốm, lý do đột xuất)",
    },
    cancellationReason: {
      type: String,
      comment: "Lý do hủy buổi học",
    },
    meetingUrl: {
      type: String,
      comment: "Link Zoom/Meet nếu học online",
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick lookup
scheduleSchema.index({ courseId: 1, date: 1 });
scheduleSchema.index({ substituteTeacherId: 1 });

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
