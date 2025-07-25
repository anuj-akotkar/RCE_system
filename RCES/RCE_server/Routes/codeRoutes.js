const express = require("express");
const router = express.Router();
const { runSample, submit, getSubmissionsByQuestion, getSubmissionById } = require("../Controllers/JudgeController");
const { auth, isStudent } = require("../Middlewares/auth");

// Run code on sample/public testcases
router.post("/run", auth, isStudent, runSample);

// Submit code for evaluation (all testcases)
router.post("/submit", auth, isStudent, submit);

// Get all submissions for a question
router.get("/question/:questionId", auth, getSubmissionsByQuestion);

// Get a single submission by ID
router.get("/:submissionId", auth, getSubmissionById);

module.exports = router;