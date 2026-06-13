const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      unique: true,
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 hour"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["programming", "design", "business", "science", "arts"],
        message: "Invalid category",
      },
    },
    fees: {
      type: Number,
      required: [true, "Course fees are required"],
      min: [0, "Fees cannot be negative"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: Course has many Enrollments
courseSchema.virtual("enrollments", {
  ref: "Enrollment",
  localField: "_id",
  foreignField: "course",
});

module.exports = mongoose.model("Course", courseSchema);