const mongoose = require("mongoose");

// Embedded Profile Schema (1:1 relationship - embedded in Student)
const profileSchema = new mongoose.Schema({
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: {
      values: ["male", "female", "other"],
      message: "Gender must be male, female, or other",
    },
  },
});

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [16, "Student must be at least 16 years old"],
      max: [60, "Age cannot exceed 60"],
    },
    // 1:1 relationship - embedded profile
    profile: profileSchema,
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

// Virtual: 1:Many - Student has many Enrollments
studentSchema.virtual("enrollments", {
  ref: "Enrollment",
  localField: "_id",
  foreignField: "student",
});

module.exports = mongoose.model("Student", studentSchema);