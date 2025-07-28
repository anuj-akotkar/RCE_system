const express = require("express");
const router = express.Router();
const { 
    runSample, 
    submit, 
    getSubmissionsByQuestion, 
    getSubmissionById,
    checkJudge0Health,
    getAvailableLanguages,
    testJudge0Submission,
    getJudge0Configuration
} = require("../Controllers/JudgeController");
const { auth, isStudent } = require("../Middlewares/auth");

// Run code on sample/public testcases
router.post("/run", auth, isStudent, runSample);

// Submit code for evaluation (all testcases)
router.post("/submit", auth, isStudent, submit);

// Get all submissions for a question
router.get("/submissions/question/:questionId", auth, getSubmissionsByQuestion);

// Get a single submission by ID
router.get("/submissions/:submissionId", auth, getSubmissionById);

// Enhanced Judge0 health check
router.get("/health", auth, checkJudge0Health);

// Get available languages from Judge0
router.get("/languages", auth, getAvailableLanguages);

// Test Judge0 submission
router.post("/test", auth, testJudge0Submission);

// Get Judge0 configuration
router.get("/configuration", auth, getJudge0Configuration);

module.exports = router;