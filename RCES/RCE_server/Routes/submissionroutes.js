const express = require("express");
const router = express.Router();
const { runCodeOnSample, submitCode, getSubmissionsByQuestion, getSubmissionById } = require("../Controllers/Submission");
const { auth, isStudent } = require("../Middlewares/auth");

// Run code on sample input
router.post("/run", auth, isStudent, runCodeOnSample);

// Submit code for evaluation
router.post("/submit", auth, isStudent, submitCode);

// Get all submissions for a question
router.get("/question/:questionId", auth, getSubmissionsByQuestion);

// Get a single submission by ID
router.get("/:submissionId", auth, getSubmissionById);

module.exports = router;