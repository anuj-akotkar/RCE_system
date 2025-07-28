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

// Import Middlewares
const { auth, isInstructor, isStudent } = require("../Middlewares/auth");
const { validateContestData } = require("../Middlewares/contestValidation");

// Contest routes
router.post("/createContest", auth, isInstructor, validateContestData, createContest);
router.post("/editContest/:contestId", auth, isInstructor, editContest);
router.get("/getInstructorContests", auth, isInstructor, getInstructorContests);
router.get("/getAllContests", getAllContests);
router.get("/getContestDetails/:contestId", auth, getContestDetails);
router.get("/getFullContestDetails/:contestId", auth, getFullContestDetails);
router.delete("/deleteContest/:contestId", auth, isInstructor, deleteContest);
router.get("/getAllStudentEnrolled/:contestId", auth, isInstructor, getAllStudentEnrolled);

module.exports = router;