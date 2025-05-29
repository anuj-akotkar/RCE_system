const express = require("express");
const router = express.Router();
const { auth, isStudent } = require("../Middlewares/auth");
const {
  updateContestProgress,
  getContestProgressPercentage,
} = require("../Controllers/Contestprogress");

// Contest progress routes
router.post("/updateContestProgress", auth, isStudent, updateContestProgress);
router.get("/getProgressPercentage/:contestId", auth, isStudent, getContestProgressPercentage);

module.exports = router;