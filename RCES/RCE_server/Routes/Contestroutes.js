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
  submitContest, // 👈 Import the new controller
} = require("../Controllers/Contest");

// Import Middlewares
const { auth, isInstructor, isStudent } = require("../Middlewares/auth");

// --- Contest Management Routes (mostly for Instructors) ---
router.post("/createContest", auth, isInstructor, createContest);
router.post("/editContest/:contestId", auth, isInstructor, editContest);
router.get("/getInstructorContests", auth, isInstructor, getInstructorContests);
router.delete("/deleteContest/:contestId", auth, isInstructor, deleteContest);
router.get("/getAllStudentEnrolled/:contestId", auth, isInstructor, getAllStudentEnrolled);

// --- Public/Student Contest Routes ---
router.get("/getAllContests", getAllContests);
router.get("/getContestDetails/:contestId", auth, getContestDetails);
router.get("/getFullContestDetails/:contestId", auth, getFullContestDetails);

// --- Contest Participation Route (for Students) ---
// This route is for a student to finalize their participation and get a score.
router.post("/:contestId/submit", auth, isStudent, submitContest); // 👈 Add the new route

module.exports = router;
