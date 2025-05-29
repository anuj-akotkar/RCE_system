const express = require("express");
const router = express.Router();

// Import Controllers
const {
  createContest,
  editContest,
  getInstructorContests,
  getAllContests,
  getContestDetails,
  getFullContestDetails,
  deleteContest,
  getAllStudentEnrolled,
} = require("../Controllers/Contest");

// const {
//   createQuestion,
//   updateQuestion,
//   deleteQuestion,
//   getAllQuestions,
//   getQuestionById,
// } = require("../Controllers/Question");

// Import Middlewares
const { auth, isInstructor, isStudent } = require("../Middlewares/auth");

// Contest routes
router.post("/createContest", auth, isInstructor, createContest);
router.post("/editContest/:contestId", auth, isInstructor, editContest);
router.get("/getInstructorContests", auth, isInstructor, getInstructorContests);
router.get("/getAllContests", getAllContests);
router.get("/getContestDetails/:contestId", auth, getContestDetails);
router.get("/getFullContestDetails/:contestId", auth, getFullContestDetails);
router.delete("/deleteContest/:contestId", auth, isInstructor, deleteContest);
router.get("/getAllStudentEnrolled/:contestId", auth, isInstructor, getAllStudentEnrolled);

// Question routes (under contest)
// router.post("/createQuestion", auth, isInstructor, createQuestion);
// router.put("/updateQuestion/:questionId", auth, isInstructor, updateQuestion);
// router.delete("/deleteQuestion/:questionId", auth, isInstructor, deleteQuestion);

// Submission routes (under contest)
// router.post("/runCodeOnSample", auth, isStudent, runCodeOnSample);
// router.post("/submitCode", auth, isStudent, submitCode);

// // Contest progress
// router.post("/updateContestProgress", auth, isStudent, updateContestProgress);
// router.get("/getProgressPercentage/:contestId", auth, isStudent, getContestProgressPercentage);

// // Rating and review
// router.post("/createRating", auth, isStudent, createRating);
// router.get("/getAverageRating/:contestId", getAverageRating);
// router.get("/getReviews/:contestId", getAllRatingReview);

module.exports = router;