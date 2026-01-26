// Material Model (Mongoose)
const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    materialType: {
      type: String,
      enum: ["document", "video", "audio", "link", "exercise"],
      required: true,
    },
    fileUrl: {
      type: String,
    },
    fileSize: {
      type: Number,
      comment: "File size in bytes",
    },
    skill: {
      type: String,
      enum: ["listening", "reading", "writing", "speaking", "general", "all"],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Material = mongoose.model("Material", materialSchema);

module.exports = Material;
