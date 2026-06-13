const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const Course = require("../models/Course");

// GET /api/enrollments
const getEnrollments = async function(req, res, next) {
  try {
    const enrollments = await Enrollment.find()
      .populate("student", "name email")
      .populate("course", "title category fees")
      .select("-__v")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/enrollments
const createEnrollment = async function(req, res, next) {
  try {
    var studentId = req.body.student;
    var courseId = req.body.course;

    // Validate student exists
    var student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Validate course exists
    var course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check duplicate enrollment (UNIQUE constraint)
    var existing = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Student is already enrolled in this course",
      });
    }

    var enrollment = await Enrollment.create(req.body);
    await enrollment.populate("student", "name email");
    await enrollment.populate("course", "title category fees");

    res.status(201).json({
      success: true,
      message: "Enrollment created successfully",
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/enrollments/:id
const updateEnrollment = async function(req, res, next) {
  try {
    var enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("student", "name email")
      .populate("course", "title category")
      .select("-__v");

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enrollment updated successfully",
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/enrollments/:id
const deleteEnrollment = async function(req, res, next) {
  try {
    var enrollment = await Enrollment.findByIdAndDelete(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enrollment deleted successfully",
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEnrollments,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
};