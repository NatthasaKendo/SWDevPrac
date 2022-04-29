const express = require("express");

const {
  getInterviewSessions,
  getInterviewSession,
  addInterviewSession,
  updateInterviewSession,
  deleteInterviewSession,
} = require("../controller/interview_session");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(protect, getInterviewSessions)
  .post(protect, authorize("admin", "user"), addInterviewSession);

router
  .route("/:id")
  .get(protect, getInterviewSession)
  .put(protect, authorize("admin", "user"), updateInterviewSession)
  .delete(protect, authorize("admin", "user"), deleteInterviewSession);

module.exports = router;
