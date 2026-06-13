const Student = require("../models/Student");

// GET /api/students
const getStudents = async function(req, res, next) {
  try {
    const students = await Student.find()
      .select("-__v")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/students/:id
const getStudentById = async function(req, res, next) {
  try {
    const student = await Student.findById(req.params.id)
      .populate({
        path: "enrollments",
        populate: { path: "course", select: "title category fees" },
      })
      .select("-__v");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

// POST /api/students
const createStudent = async function(req, res, next) {
  try {
    const existing = await Student.findOne({ email: req.body.email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const student = await Student.create(req.body);

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/students/:id
const updateStudent = async function(req, res, next) {
  try {
    if (req.body.email) {
      const emailExists = await Student.findOne({
        email: req.body.email,
        _id: { $ne: req.params.id },
      });
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select("-__v");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/students/:id
const deleteStudent = async function(req, res, next) {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};