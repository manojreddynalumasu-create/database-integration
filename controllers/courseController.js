const Course = require("../models/Course");

// GET /api/courses
const getCourses = async function(req, res, next) {
  try {
    const { category, isActive } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const courses = await Course.find(filter)
      .select("-__v")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/courses/:id
const getCourseById = async function(req, res, next) {
  try {
    const course = await Course.findById(req.params.id)
      .populate({
        path: "enrollments",
        populate: { path: "student", select: "name email" },
      })
      .select("-__v");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

// POST /api/courses
const createCourse = async function(req, res, next) {
  try {
    const existing = await Course.findOne({ title: req.body.title });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Course with this title already exists",
      });
    }

    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/courses/:id
const updateCourse = async function(req, res, next) {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select("-__v");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/courses/:id
const deleteCourse = async function(req, res, next) {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};