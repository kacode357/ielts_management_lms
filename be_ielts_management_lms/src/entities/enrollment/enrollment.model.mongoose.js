// Enrollment Model (Mongoose)
const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "completed", "dropped", "suspended"],
      default: "active",
    },
    finalGrade: {
      type: Number,
      min: 0,
      max: 9,
    },
    completionDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique enrollment
enrollmentSchema.index({ studentId: 1, classId: 1 }, { unique: true });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

module.exports = Enrollment;
