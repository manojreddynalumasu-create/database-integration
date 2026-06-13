const express = require("express");
const router = express.Router();
const {
  getEnrollments,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
} = require("../controllers/enrollmentController");

router.route("/").get(getEnrollments).post(createEnrollment);
router.route("/:id").put(updateEnrollment).delete(deleteEnrollment);

module.exports = router;