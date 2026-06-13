const mongoose = require("mongoose");

// Enrollment = Junction Table for Many:Many (Students <-> Courses)
const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "completed", "dropped"],
        message: "Status must be active, completed, or dropped",
      },
      default: "active",
    },
    grade: {
      type: String,
      enum: {
        values: ["A", "B", "C", "D", "F", "pending"],
        message: "Invalid grade",
      },
      default: "pending",
    },
  },
  { timestamps: true }
);

// Prevent duplicate enrollments - UNIQUE constraint
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);