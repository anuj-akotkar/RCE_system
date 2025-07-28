const express = require("express");
const router = express.Router();
const { 
    runSample, 
    submit, 
    getSubmissionsByQuestion, 
    getSubmissionById
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

// Health check for Judge0 connectivity
router.get("/health", auth, async (req, res) => {
    try {
        const axios = require('axios');
        const JUDGE0_URL = process.env.JUDGE0_URL || 'http://localhost:2358';
        const response = await axios.get(`${JUDGE0_URL}/about`);
        res.json({
            success: true,
            judge0: {
                version: response.data.version,
                status: 'online'
            }
        });
    } catch (error) {
        res.status(503).json({
            success: false,
            message: 'Code execution service unavailable'
        });
    }
});

module.exports = router;