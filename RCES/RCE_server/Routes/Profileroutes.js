const express = require("express");
const router = express.Router();
const { auth, isInstructor } = require("../Middlewares/auth");
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledContests,
  instructorDashboard,
} = require("../Controllers/Profile");

// Delete user profile
router.delete("/deleteProfile", auth, deleteAccount);

// Update user profile
router.put("/updateProfile", auth, updateProfile);

// Get all user details
router.get("/getUserDetails", auth, getAllUserDetails);

// Get enrolled contests/courses
router.get("/getEnrolledContests", auth, getEnrolledContests);

// Update display picture
router.put("/updateDisplayPicture", auth, updateDisplayPicture);

// Instructor dashboard
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);

module.exports = router;