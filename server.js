const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.status(200).json({
    success: true,
    message: "Database Integration API is running",
    version: "1.0.0",
    project: "Project 3 - DecodeLabs Batch 2026",
    endpoints: {
      students: "/api/students",
      courses: "/api/courses",
      enrollments: "/api/enrollments",
    },
  });
});

app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, function() {
  console.log("Server running on http://localhost:" + PORT);
  console.log("Environment: " + process.env.NODE_ENV);
});