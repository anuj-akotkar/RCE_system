const express = require("express");
const router = express.Router();
const { 
  createQuestion, 
  updateQuestion, 
  deleteQuestion, 
  getAllQuestions, 
  getQuestionById 
} = require("../Controllers/Question");
const { auth, isInstructor } = require("../Middlewares/auth");

// Create a new question
router.post("/", auth, isInstructor, createQuestion);

// Update a question by ID
router.put("/:questionId", auth, isInstructor, updateQuestion);

// Delete a question by ID
router.delete("/:questionId", auth, isInstructor, deleteQuestion);

// Get all questions (optionally for a contest)
router.get("/", getAllQuestions);

// Get a single question by ID
router.get("/:questionId", getQuestionById);

module.exports = router;